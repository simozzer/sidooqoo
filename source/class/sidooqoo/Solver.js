
/**
 * This is the class to solve a sudoku puzzle
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.Solver",{
    extend: qx.core.Object,
    members: {
        _sortedPossibleValuesList: [],
        _passIndex: 0,
        _stack: [],
        _fast: true,
        _fnComplete: undefined,
        _fastinterval: 8000,
        _intervalsRemaining: 0,
        _bail_early: true,
        _puzzleQueries: {},
        // Within a set of 9 cells find and cells which can be the only cell containing a specific value and set them
        solveCells(aCellsToSolve) {
            let stepProducedProgress = false;
            let continueLooping = false;
            do {
                continueLooping = false;

                for (let possibleValue = 1; possibleValue < 10; possibleValue++) {
                    let iOccurenceCount = 0;
                    aCellsToSolve.forEach(oCell => {
                        if ((this._puzzleQueries.getPossibleValues(oCell).indexOf(possibleValue) | 0 > -1)) {
                            iOccurenceCount++;
                        }
                    });

                    if (iOccurenceCount === 1) {
                        const oCellToAdjust = aCellsToSolve.find(oCell => this._puzzleQueries.getPossibleValues(oCell).indexOf(possibleValue) |0 > -1);
                        if (oCellToAdjust && oCellToAdjust.getValue() | 0 < 1) {
                            this.solvedSometing = true;
                            stepProducedProgress = true;
                            continueLooping = true;
                            oCellToAdjust.setValue(''+possibleValue);
                            if (!this._fast) {
                                this._intervalsRemaining --;
                                if (this._intervalsRemaining >= 0) {
                                    this._intervalsRemaining --;
                                } else {
                                    this._intervalsRemaining = this._fastinterval;
                                    oCellToAdjust.element.innerText = possibleValue;
                                    oCellToAdjust.element.title = '';
                                    oCellToAdjust.element.classList.add('solved');
                                }
                            }
                            oCellToAdjust.setSolved();
                            oCellToAdjust.setPassIndex(this.getPassIndex());
                        }
                    }
                }
            } while (continueLooping);
            return stepProducedProgress;
        },

        solveInnerTables() {
            let stepProducedProgress = false;
            do {
                stepProducedProgress = false;
                for (let i = 0; ((i < 9) && this.solveCells(this._puzzleQueries.getCellsInSameTable(i))); i++) {
                    stepProducedProgress = true;
                }
            } while (stepProducedProgress);
            return stepProducedProgress;
        },

        solveRows() {
            let stepProducedProgress = false;
            do {
                stepProducedProgress = false;
                for (let i = 0; ((i < 9) && this.solveCells(this._puzzleQueries.getCellsInRow(i))); i++) {
                    stepProducedProgress = true;
                }
            } while (stepProducedProgress);
            return stepProducedProgress;
        },

        solveColumns() {
            let stepProducedProgress = false;
            do {
                stepProducedProgress = false;
                for (let i = 0;((i < 9) && this.solveCells(this._puzzleQueries.getCellsInColumn(i))); i++) {
                    stepProducedProgress = true;
                }
            } while (stepProducedProgress);
            return stepProducedProgress;
        },

        // Try to solve based on current data, by process of illimination
        doSimpleSolve(bailEarly) {
            try {
                let solvedSomething = true;
                while (solvedSomething) {  
                    
                    if (bailEarly) {
                        this.solvedSomething = this.solveRows() 
                                            || this.solveColumns() 
                                            || this.solveInnerTables() 
                                            || this.solveSomething(bailEarly);
                        return this.solvedSomething;                    
                    } else {
      
                        this.solvedSomething = this.solveRows() 
                                            && this.solveColumns() 
                                            && this.solveInnerTables() 
                                            && this.solvedSomething(bailEarly);                                             
    
                        return this.solvedSomething;                      
                    }
                    
    
                }
            } catch (err) {
                window.alert(err);
            }
        },
        async doExecuteAsync() {
            return new Promise((resolve) => {
                window.setTimeout(function (that) {
                    if (that.processNextCell()) {
                        that.setPassIndex(that.getPassIndex()+1);
                        resolve(true);
                    } else {
                        that.rewind();
                        resolve(false);
                    }
                    
                }, 0, this);
            });
        },


        doExecute() {
            if (this.processNextCell()) {
                this._passIndex++
            } else {
                this.rewind();
            }
        },

        execute() {
            this._passIndex++;

            this.doSimpleSolve(this._bail_early);

            this._passIndex = 1;
            let iExecutionCount = 0;
            const startTime = new Date().getTime();
            let oCells = this._puzzleQueries._aCells;
            if (this._fast) {
                do {
                    this.doExecute();
                    iExecutionCount++;
                } while (oCells.filter(oCell => (oCell.getValue() | 0) === 0).length > 0);

                
                
                oCells.forEach(oCell => {
                    if (!oCell.getFixed()) {
                        const oElem = oCell.element;
                        oElem.innerHTML = oCell.getValue();
                        oElem.classList.remove('bob');
                        oElem.classList.add('solved');                    
                    }
                });
            } else {
                do {

                        this.doExecuteAsync().then(() => {                        
                            iExecutionCount++;
                        });

                } while (oCells.filter(cell => (cell.getValue() | 0)  === 0).length > 0);
             }
            const duration = new Date().getTime() - startTime;
            document.querySelector('#everywhere table').classList.add('solved');
            if (typeof(this._fnComplete) === "function") {
                this._fnComplete(`Done: 'doExecute' was called ${iExecutionCount} times and took ${duration} ms.`);
            }
            
        },

        rewind() {
            const oLastUpdatedCell = this._stack.pop();
            this._puzzleQueries._aCells.forEach(o => {
                if (o.getPassIndex() === oLastUpdatedCell.getPassIndex()) {
                    o.reset(this._fast);
                }
            })
            oLastUpdatedCell.choiceIndex++;
            oLastUpdatedCell.reset(this._fast);
            const oPuzzleQueries = this._puzzleQueries._aCells;
            if (!oPuzzleQueries.canSetACellValue(oLastUpdatedCell)) {
                oLastUpdatedCell.choiceIndex = 0;
                const oPrevCell = this._stack[this._stack.length - 1];
                this._puzzleQueries._aCells.forEach(o => {
                    if (o.getPassIndex() === oPrevCell.getPassIndex()) {
                        o.reset(this._fast);
                    }
                });
                oPrevCell.reset(this._fast);
                this.rewind();
            }
        },

        processNextCell() {
            const queries = this._puzzleQueries;
            const oCells = this._puzzleQueries._aCells;

            // Get a list of the cells which have no .value and sort the list so that the highest number of possible values comes first
            let emptyCells = oCells.filter(oCell => (oCell.getValue() | 0) < 1);
            this._sortedPossibleValuesList = emptyCells.sort((a, b) => queries.getPossibleValues(a).length - queries.getPossibleValues(b).length);        
    
            let cellsWithMutlipleSolutions = this._sortedPossibleValuesList.filter(oCell => queries.getPossibleValues(oCell).length > 0);
    
            
            if (this._sortedPossibleValuesList.map(o => queries.getPossibleValues(o)).filter(o => o.length > 0).length === 0) {
                // some of the cells on the grid have no possible answer
                return false;
            };
    
            const oSolveCell = cellsWithMutlipleSolutions[0];
            const aPossibleCellValues = queries.getPossibleValues(oSolveCell);
            const iLen = aPossibleCellValues.length;
            if (oSolveCell.getChoiceIndex() < iLen && queries.canSetACellValue(oSolveCell)) {
                debugger;
                oSolveCell.setValue(''+ aPossibleCellValues[oSolveCell.getChoiceIndex()]);
                oSolveCell.suggested = true;
                oSolveCell.setPassIndex(this.getPassIndex());
                if (!this._fast) {
                    debugger
                    oSolveCell.element.innerHTML = oSolveCell.getValue() + "";
                    oSolveCell.element.classList.add('suggested');
                }
                this._stack.push(oSolveCell);
                this.doSimpleSolve(this._bail_early);
                return true;
            } else {
                return false;
            }
        },

        applyCellsWithOnePossibleValue() {
            const oPuzzleQueries = this._puzzleQueries;
            const oSingleValueCells = this._sortedPossibleValuesList.filter(oCell => (((oCell.getValue() | 0) < 1) && oPuzzleQueries.getPossibleValues(oCell).length === 1));
            oSingleValueCells.forEach(oCell => {
                const iValue = oPuzzleQueries.getPossibleValues(oCell)[0];
                if (iValue && oPuzzleQueries.canSetCellValue(oCell, iValue)) {
                    oCell.setValue(''+iValue);
                    if (!this._fast) {
                        oCell.element.innerText = iValue;
                        oCell.element.title = '';
                        oCell.element.classList.add('solved');
                    }
                    oCell.setSolved();
                    oCell.setPassIndex(this._passIndex);
                    return true;
                }
            });
            return false;
        },
        solveSomething(bailEarly) {
            let stepProducedProgress;
            do {
                stepProducedProgress = false;
                if (this.applyCellsWithOnePossibleValue()) {
                    this.solvedSomething = true;
                    stepProducedProgress = true;
                    if (bailEarly) {
                        return true;
                    }
                }
            } while (stepProducedProgress)
            return stepProducedProgress;
        },
        getPassIndex() {
            return this._passIndex;
        }
        },
        construct(oPuzzleQueries, fnComplete) {
            debugger;
            this._puzzleQueries = oPuzzleQueries;
            this._fast = true,
            this._cells = this._puzzleQueries._aCells;
            this._sortedPossibleValuesList = this._cells.filter(oCell => oCell.getValue() | 0  < 1).sort((a, b) => oPuzzleQueries.getPossibleValues(a).length - oPuzzleQueries.getPossibleValues(b).length);
            this._fnComplete = fnComplete;
            this._intervalsRemaining = this._fastinterval;
            this._passIndex = 0;
        },
    
    


});

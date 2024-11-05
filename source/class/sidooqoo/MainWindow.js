/* ************************************************************************

   Copyright: 2024 undefined

   License: MIT license

   Authors: undefined

************************************************************************ */

/**
 * This is the main application class of "sidooqoo"
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.MainWindow",{
    extend: qx.ui.window.Window,
    construct() {
        super("sidooqoo");
        
        // hide the window buttons
        this.setShowClose(false);
        this.setShowMaximize(false);
        this.setShowMinimize(false);

        // adjust size
        this.setWidth(250);
        this.setHeight(300);

        // add the layout
        var layout = new qx.ui.layout.Grid(0, 0);
        this.setLayout(layout);
        this.setContentPadding(20);

        this.buildEmptyPuzzle();

        this.svc = new sidooqoo.PuzzleDataService();
        this.svc.fetchPuzzleData();

        var loadPuzzleButton = new qx.ui.form.Button("Load problem");
        this.add(loadPuzzleButton,{column:2,row:12,colSpan:5});

        loadPuzzleButton.addListener(
          "execute",
          function () {
                this.svc.fetchPuzzleData();
                // TODO load puzzle with data
                let oData = this.svc.getPuzzleData().toArray()[0].getShinningStarData().toArray();
                for(let i=0; i< 81; i++) {                
                    let oPuzzleCell = this._puzzleCells[i];
                    oPuzzleCell.setValue(oData[i]);
                    oPuzzleCell.setFixed(oData[i] > 0);
                    oPuzzleCell.setPassIndex(0);
                    oPuzzleCell.setChoiceIndex(0);                 
                    //TODO:: oPuzzleCell.setBackgroundColor(oData[i] > 0? "#a1a6d3":"white");
                }
                this.updateGrid();
            },
          this
        );

        var solvePuzzleButton = new qx.ui.form.Button("Give me solutions, not problems.");
        this.add(solvePuzzleButton,{column:0,row:13,colSpan:9});
        solvePuzzleButton.addListener(
          "execute",
          function () {            
                console.log('Solve...');                

                const oSolver = new sidooqoo.Solver(this._puzzleQueries,(a)=>{
                    this.updateGrid();
                    window.alert(a);
                });
                oSolver.execute();
            },
          this
        );
        var textArea = new qx.ui.form.TextArea();
        this.add(textArea,{column:0, row:15, colSpan:10, rowSpan: 5});
           
    },
    members: {
        buildEmptyPuzzle() {
            this._puzzleCells = [];   
            this._puzzleQueries = new sidooqoo.PuzzleQueries(this._puzzleCells); 
                        
            let iCellIndex = 0;
            for (let row = 0; row < 9; row++) {
                for(let col=0; col< 9; col++) {                
                    var puzzleCell = new sidooqoo.PuzzleCell();                           
                    puzzleCell.setCellIndex(iCellIndex++);

                    var textField = new sidooqoo.PuzzleCellControl(puzzleCell);                
                    if (row % 3 == 0) {
                        textField.setMarginTop(20);
                    } else {
                        textField.setMarginTop(5);
                    }
    
                    if (col % 3 == 0) { 
                        textField.setMarginLeft(20);
                    } else {
                        textField.setMarginLeft(5);
                    }       
                    this.add(textField, {column: col, row: row});
                    puzzleCell.setElement(textField);
    
                    this._puzzleCells.push(puzzleCell);
                }                        
            }
    
            // give every puzzle cell (which is a customised text field) a refernece to the class to manage puzzle queries
            for (let i=0; i < this._puzzleCells.length;i++) {
                this._puzzleCells[i].setPuzzleQueries(this._puzzleQueries);
            }
            this.updateGrid();


        },
        changePuzzleData() {
            //debugger
        },
        updateGrid(){
            for (let i=0; i < this._puzzleCells.length;i++) {
                let oCell = this._puzzleCells[i];
                oCell.setPuzzleQueries(this._puzzleQueries);                
                let val = oCell.getValue();
                oCell.getElement().setValue(val > 0 ? val.toString() : '' );

                oCell.getElement().setBackgroundColor(oCell.getFixed()? "gray" : "white");
            }

        }       

    }

    
});      
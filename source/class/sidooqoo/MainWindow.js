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
        this.setContentPadding(5);

        this.buildEmptyPuzzle();

        this.svc = new sidooqoo.PuzzleDataService();
        this.svc.fetchPuzzleData();

        var loadPuzzleButton = new qx.ui.form.Button("Load problem");
        this.add(loadPuzzleButton,{column:2,row:11,colSpan:5});

        loadPuzzleButton.addListener(
          "execute",
          function () {
                this.svc.fetchPuzzleData();
                // TODO load puzzle with data
                let oData = this.svc.getPuzzleData().toArray()[0].getEvilPuzzleData().toArray();
                for(let i=0; i< 81; i++) {                
                    let oPuzzleCell = this._puzzleCells[i];
                    oPuzzleCell.setValue(oData[i].toString() === '0'?'':oData[i].toString());
                    oPuzzleCell.setFixed(oData[i] > 0);
                    oPuzzleCell.setBackgroundColor(oData[i] > 0? "#a1a6d3":"white");
                }

            },
          this
        );

        var solvePuzzleButton = new qx.ui.form.Button("Give me solutions, not problems.");
        this.add(solvePuzzleButton,{column:0,row:12,colSpan:9});
        solvePuzzleButton.addListener(
          "execute",
          function () {            
                console.log('Solve...');

                const oSolver = new sidooqoo.Solver(this._puzzleQueries,(a)=>{
                    window.alert(a);
                });
                oSolver.execute();
            },
          this
        );
           
    },
    members: {
        buildEmptyPuzzle() {
            this._puzzleCells = [];   
            this._puzzleQueries = new sidooqoo.PuzzleQueries(this._puzzleCells); 
            
    
            let iCellIndex = 0;
            for (let row = 0; row < 9; row++) {
                for(let col=0; col< 9; col++) {                
                    var textField = new sidooqoo.PuzzleCellControl();                 
                    textField.setCellIndex(iCellIndex++);
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
    
                    this._puzzleCells.push(textField);
                }                        
            }
    
            // give every puzzle cell (which is a customised text field) a refernece to the class to manage puzzle queries
            for (let i=0; i < this._puzzleCells.length;i++) {
                this._puzzleCells[i].setPuzzleQueries(this._puzzleQueries);
            }


        },
        changePuzzleData() {
            debugger
        }       

    }

    
});      
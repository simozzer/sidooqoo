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

        this._puzzleCells = [];   
        this._puzzleQueries = new sidooqoo.PuzzleQueries(this._puzzleCells); 
        

        let iCellIndex = 0;
        for (let row = 0; row < 9; row++) {
            for(let col=0; col< 9; col++) {                
                var textField = new sidooqoo.PuzzleCell();                 
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

          
    }
});      
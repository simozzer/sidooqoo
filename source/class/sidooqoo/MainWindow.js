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

        this._puzzleCells = {
            cells: [],
            cellsInRow(iRow){
                let items = [];
                for (iCellIndex = iRow *3; iCellIndex < iRow *3 + 9; iCellIndex ++) {
                    items.push(this.cells[iCellIndex]);
                }
                return items;
            },
            cellsInColumn(iCol) {
                let items = [];
                for (iRow = 0; iRow < 9; iRow++) {
                    items.push(this.cells[(iRow * 3) + iCol]);
                }
                return items;                
            }
        };
        

        for (let row = 0; row < 9; row++) {
            for(let col=0; col< 9; col++) {
                var textField = new sidooqoo.PuzzleCell();  
                textField.setPuzzleManager(this._puzzleCells)        
                textField.setDataCol(col);
                textField.setDataRow(row);
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

                this._puzzleCells.cells.push(textField);
            }            
        }

        
    }
});      
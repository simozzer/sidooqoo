
/**
 * This is the class to representcing a puzzle cell, which is to contain 0 or 1 number2
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.PuzzleCell",{
    extend: qx.ui.form.TextField,
    properties: {
        cellIndex : { check : "Number" },        
        puzzleQueries: {}
       
    },
    members: {
        getDataRow() {
            return 0 | this.getCellIndex() / 9;
        },
        getDataCol() {
            return this.getCellIndex() % 9;
        },
        getInnerCellIndex() {
            let innerCellRow = 0 | this.getDataRow() / 3;
            let innerCellColumn = 0 | this.getDataCol() / 3;
            return (innerCellRow *3) + innerCellColumn;
        }
    },
    construct() {
        super();
        this.setMinWidth(20);
        this.setMinHeight(20);
        this.setMaxWidth(20);
        this.setMaxHeight(20);
        this.setMarginLeft(5);
        this.setMarginTop(5);    
        
        this.addListener("keydown", (oEv) => {

            //
      
            // some very basic validation to prevent entering invalid digits
            let keyNumericValue = parseInt(oEv.getKeyIdentifier(),10);            
            if (isNaN(keyNumericValue) || keyNumericValue < 1 || keyNumericValue > 9) {
                oEv.stopPropagation();
                oEv.preventDefault();                
            } else {
                // Here we erase the current value of the cell. The default new value will be added in a further default handler
                this.setValue('');
                console.log('Erased value before: ' + oEv.getKeyIdentifier());
            }

            
            // Check that we can actually edit the value
            let puzzleQueries = this.getPuzzleQueries();
            if (!puzzleQueries.canSetCellValue(this,keyNumericValue)) {
                oEv.stopPropagation();
                oEv.preventDefault();
            }

            let oCells = puzzleQueries._aCells;

            // Handle arrow keys to navigate between cells
            let cellIndex = (this.getDataRow() * 9) + this.getDataCol();
            switch (event.code) {                
                case "ArrowUp":
                    if (this.getDataRow() > 0) {
                        oCells[cellIndex - 9 ].focus();    
                    }
                    break;

                case "ArrowLeft":                  
                    if (this.getDataCol() > 0) {
                        oCells[cellIndex - 1 ].focus();
                    }
                    break;

                case "ArrowRight":                    
                    if (this.getDataCol() < 9) {
                        oCells[cellIndex + 1 ].focus();    
                    }
                break;

                case "ArrowDown":                    
                    if (this.getDataRow() < 9) {
                        oCells[cellIndex + 9 ].focus();    
                    }
                    break;       
                
                default:
                    break;
            }


        });

        this.addListener("keypress", oEv => {
           
            let puzzleQueries = this.getPuzzleQueries();
            if (puzzleQueries.canSetCellValue(this,oEv.keyNumericValue)) {
                this.setValue(oEv.keyNumericValue.toString());
                oEv.stopPropagation();
                oEv.preventDefault();
            }
        });
    }
}
);

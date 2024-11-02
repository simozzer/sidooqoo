
/**
 * This is the class to representcing a puzzle cell, which is to contain 0 or 1 number2
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.PuzzleCell",{
    extend: qx.ui.form.TextField,
    properties: {
        dataCol : { check : "Number" },
        dataRow : { check : "Number" },
        puzzleManager: {}
       
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
      
            // some very basic validation to prevent entering invalid digits
            let keyNumericValue = parseInt(oEv.getKeyIdentifier(),10);            
            if (isNaN(keyNumericValue) || keyNumericValue < 1 || keyNumericValue > 9) {
                oEv.stopPropagation();
                oEv.preventDefault();
            } else {
                this.setValue('');
            }

            let cellIndex = (this.getDataRow() * 9) + this.getDataCol();
            switch (event.code) {                
                case "ArrowUp":
                    if (this.getDataRow() > 0) {
                        this.getPuzzleManager().cells[cellIndex - 9 ].focus();    
                    }
                    break;

                case "ArrowLeft":                  
                    if (this.getDataCol() > 0) {
                        this.getPuzzleManager().cells[cellIndex - 1 ].focus();
                    }
                    break;

                case "ArrowRight":                    
                if (this.getDataCol() < 9) {
                    this.getPuzzleManager().cells[cellIndex + 1 ].focus();    
                }
                break;

                case "ArrowDown":                    
                if (this.getDataRow() < 9) {
                    this.getPuzzleManager().cells[cellIndex + 9 ].focus();    
                }
                    break;       
                
                default:
                    break;
            }


        });
    }
}
);


/**
 * This is the class to representcing a puzzle cell, which is to contain 0 or 1 number2
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.PuzzleCellControl", {
    extend: qx.ui.form.TextField,
    properties: {
        _cellData : {}       
    },
    members: {     
        reset(bFast) {
            this.setValue("");
            if (!bFast) {
                this.element.innerHTML = "";
                this.element.classList.remove("suggested");
                this.element.classList.remove("solved");
            }
        }
        
    },
    construct(oCellData) {
        super();
        this.setMinWidth(20);
        this.setMinHeight(20);
        this.setMaxWidth(20);
        this.setMaxHeight(20);
        this.setMarginLeft(5);
        this.setMarginTop(5);  

        this._cellData = oCellData;
        oCellData.setElement(this);
        oCellData.setChoiceIndex(0);
        
        this.addListener("keydown", oEv => {
            // some very basic validation to prevent entering invalid digits
            let keyNumericValue = parseInt(oEv.getKeyIdentifier(), 10);            
            if (isNaN(keyNumericValue) || keyNumericValue < 1 || keyNumericValue > 9) {
                oEv.stopPropagation();
                oEv.preventDefault();                
            } else {
                // Here we erase the current value of the cell. The default new value will be added in a further default handler
                this.setValue("");            
            }

            
            // Check that we can actually edit the value
            let puzzleQueries = this._cellData.getPuzzleQueries();
            if (!puzzleQueries.canSetCellValue(this._cellData, keyNumericValue)) {
                oEv.stopPropagation();
                oEv.preventDefault();
            }

            let oCells = puzzleQueries._aCells;

            // Handle arrow keys to navigate between cells
            let cellIndex = (this._cellData.getDataRow() * 9) + this._cellData.getDataCol();
            switch (event.code) {                
                case "ArrowUp":
                    if (this._cellData.getDataRow() > 0) {
                        oCells[cellIndex - 9].getElement().focus();    
                    }
                    break;

                case "ArrowLeft":                  
                    if (this._cellData.getDataCol() > 0) {
                        oCells[cellIndex - 1].getElement().focus();
                    }
                    break;

                case "ArrowRight":                    
                    if (this._cellData.getDataCol() < 8) {
                        oCells[cellIndex + 1].getElement().focus();    
                    }
                break;

                case "ArrowDown":                    
                    if (this._cellData.getDataRow() < 8) {
                        oCells[cellIndex + 9].getElement().focus();    
                    }
                    break;       
                
                default:
                    break;
            }
        });

        this.addListener("keypress", oEv => {
            let puzzleQueries = this._cellData.getPuzzleQueries();
            if (puzzleQueries.canSetCellValue(this._cellData, oEv.getKeyIdentifier() | 0)) {
                let keyNumericValue = parseInt(oEv.getKeyIdentifier(), 10);
                if (keyNumericValue) {
                    this.setValue(" " + keyNumericValue);
                    this._cellData.setValue(keyNumericValue);
                }
                oEv.stopPropagation();
                oEv.preventDefault();
            }
        });
    }
}
);

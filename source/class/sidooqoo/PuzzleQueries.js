
/**
 * This is the class to query and manage the state of the cells in the puzzle.
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.PuzzleQueries",{
    extend: qx.core.Object,
    construct(aCells) {
        this._aCells = aCells;
        this._aRowCells = [];
        this._aColCells = [];
        this._aSameTableCells = [];
    },
    members: {
        getCellsInRow(iRowIndex) {
            let cached = this._aRowCells[iRowIndex];
            if (cached == undefined) {
                let items = [];
                let iStartCellIndex = iRowIndex * 9;
                for (let iCellIndex = iStartCellIndex ; iCellIndex < iStartCellIndex + 9 ; iCellIndex ++) {
                    items.push(this._aCells[iCellIndex]);
                }
                this._aRowCells[iRowIndex] = items;
                return items;
            } else {
                return cached;
            }
        },
        getCellsInColumn(iColIndex) {
            let cached = this._aColCells[iColIndex];
            if (cached == undefined) {            
                let items = [];
                for (let iRow = 0; iRow < 9; iRow++) {
                    items.push(this._aCells[(iRow * 9) + iColIndex]);
                }
                this._aColCells[iColIndex] = items;
                return items;
            } else {
                return cached;
            }
        },
        getCellsInSameTable(innerCellIndex) {
            let cached = this._aSameTableCells[innerCellIndex];
            if (cached == undefined) {
                let innerCellCells = [];
                for(let i in this._aCells) {
                    if (this._aCells[i].getInnerCellIndex() === innerCellIndex) {
                        innerCellCells.push(this._aCells[i]);
                    }
                }
                this._aSameTableCells[innerCellIndex] = innerCellCells;
                return innerCellCells;
            } else {
                return cached;
            }
         
        },
        canSetCellValue(oCell, iValue) {
            // review ok
            const iRow = oCell.getDataRow();
            const iCol = oCell.getDataCol();
            const iTableIndex = oCell.getInnerCellIndex();
            
            let cellsWithMatchingValuesInRow = this.getCellsInRow(iRow).find(o => {if ((o.getValue() | 0) === iValue) { return true;} });
            if (cellsWithMatchingValuesInRow == undefined) {
                let cellsWithMatchingValuesInColumn = this.getCellsInColumn(iCol).find(o => {if ((o.getValue() | 0) === iValue) { return true;} });
                if (cellsWithMatchingValuesInColumn == undefined) {
                    let cellsWithMatchingValuesInTable = this.getCellsInSameTable(iTableIndex).find(o => (o.getValue() | 0 )=== iValue);
                    if (cellsWithMatchingValuesInTable == undefined) {
                        return true;
                    }
                }
            }        
            return false;           
 
        },
        getPossibleValues(oCell) {         
            // reviuew ok
            const aPossibleValues = [];
            const iRow = oCell.getDataRow();
            const iCol = oCell.getDataCol();
            const iTableIndex = oCell.getInnerCellIndex();
            for (let iPossibleValue = 1; iPossibleValue < 10; iPossibleValue++) {
                if ((!this.getCellsInRow(iRow).find(oRowCell => (oRowCell.getValue() | 0) === iPossibleValue))
                    && (!this.getCellsInColumn(iCol).find(oColumnCell => (oColumnCell.getValue() | 0) === iPossibleValue))
                    && (!this.getCellsInSameTable(iTableIndex).find(oInnerTableCell => (oInnerTableCell.getValue()| 0) === iPossibleValue))) {
                    aPossibleValues.push(iPossibleValue);
                }


            }
            return aPossibleValues;
        },
        canSetACellValue(oCell) {
            const aPossibleCellValues = this.getPossibleValues(oCell);
            let iChoiceIndex = oCell.getChoiceIndex();
            const iLen = aPossibleCellValues.length;
            if (iChoiceIndex < iLen) {
                let choice = aPossibleCellValues[iChoiceIndex];
                while ((iChoiceIndex < iLen) && (!this.canSetCellValue(oCell, choice))) {
                    iChoiceIndex++;
                }
                if (this.canSetCellValue(oCell, choice)) {
                    oCell.setChoiceIndex(iChoiceIndex);
                    return true;
                }
            }
            return false;
        }

    }


}
);

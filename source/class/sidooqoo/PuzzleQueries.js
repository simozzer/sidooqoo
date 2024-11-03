
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
            let rowCells = this.getCellsInRow(oCell.getDataRow());
            for(let i=0; i<9;i++) {
                if (rowCells[i].getValue() == iValue) {
                    console.log('Event should be cancelled as it classes with a value in the row');
                    return false;
                }
            }
           
            let colCells = this.getCellsInColumn(oCell.getDataCol());
            for(let i=0; i<9;i++) {
                // console.log(`Col: index:${i} col:${colCells[i].getDataCol()} value:${colCells[i].getValue()}`);
                if (colCells[i].getValue() == iValue) {
                    return false;
                }
            }

            let innerCellCells = this.getCellsInSameTable(oCell.getInnerCellIndex(oCell));
            for(let i=0; i<9;i++) {
                // console.log(`Col: index:${i} col:${innerCellCells[i].getDataCol()} value:${innerCellCells[i].getValue()}`);
                if (innerCellCells[i].getValue() == iValue) {
                    console.log('Event should be cancelled as it classes with a value in the inner table');
                    return false;
                }
            }            

            return true;
        },

    }


}
);

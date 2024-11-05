
/**
 * This is the class to representcing a puzzle cell, which is to contain 0 or 1 numbers (with values 1..9)
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.PuzzleCell",{
    extend: qx.core.Object,
    statics: {
        cellValueStates: {
            EMPTY: 0,
            FIXED: 1,
            ENTERED: 2,
            SUGGESTED: 4,
            SOLVED: 8
        }
    },
    properties: {
        _value: { check: "Number" },
        cellIndex : { check : "Number" },        
        puzzleQueries: {},
        _valueState: { check: "Number" },
        _element: {}
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
        },
        _getValueState() {
            return this._valueState;
        },
        _setValueState(state) {
            this._valueState = state;
        },
        setFixed(fixed) {
            if (fixed) {
                this._valueState = sidooqoo.PuzzleCell.cellValueStates.FIXED;
            } else {
                this._valueState = this._valueState &! sidooqoo.PuzzleCell.cellValueStates.FIXED;
            }
        },
        getFixed() {
            return this._valueState == sidooqoo.PuzzleCell.cellValueStates.FIXED;
        },
        getPassIndex() {
            return this._passIndex;
        },
        setPassIndex(iPassIndex) {
            this._passIndex = iPassIndex;
        },
        getChoiceIndex() {
            return this._choiceIndex;
        },
        setChoiceIndex(iChoiceIndex) {
            this._choiceIndex = iChoiceIndex;
        },    
        getEntered() {
            return this._valueState === sidooqoo.PuzzleCell.cellValueStates.ENTERED;
        },    
        setEntered(bEntered) {
            if (bEntered) {
                this._valueState = sidooqoo.PuzzleCell.cellValueStates.ENTERED;
            } else if ([sidooqoo.PuzzleCell.cellValueStates.SOLVED, sidooqoo.PuzzleCell.cellValueStates.FIXED].indexOf(this._valueState) < 0) {
                this._valueState = sidooqoo.PuzzleCell.cellValueStates.EMPTY;
            }
        },    
        getSolved() {
            return this._valueState === sidooqoo.PuzzleCell.cellValueStates.SOLVED;
        },    
        setSolved() {
            this._valueState = sidooqoo.PuzzleCell.cellValueStates.SOLVED;
        },    
        getSuggested() {
            return this._valueState === sidooqoo.PuzzleCell.cellValueStates.SUGGESTED;
        },    
        setSuggested(bSuggested) {
            this._valueState = bSuggested ? sidooqoo.PuzzleCell.cellValueStates.SUGGESTED : undefined;
        },        
        reset(bFast) {
            this.setValue(0);
            this._valueState = sidooqoo.PuzzleCell.cellValueStates.EMPTY;
        },
        setElement(oElement) {
            this._element = oElement;
        },
        getElement() {
            return this._element;
        },
        getValue() {
            return this._value;
        },
        setValue(val) {
            this._value = val;
        }
    },
    construct() {
        super(); 
        this.setChoiceIndex(0);
        this._valueState = sidooqoo.PuzzleCell.cellValueStates.EMPTY; 
    }
}
);

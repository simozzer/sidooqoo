
/**
 * This is the class to representcing a puzzle cell, which is to contain 0 or 1 number2
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.CellBase",{
    
    properties: {
        value: {check: Number},
        cellIndex: {check: Number},
        enabled: {check: Boolean}
    },
    construct() {
        this.value = 0;
        this.enabled = true;
    },
    members: {
        setValue(value, aCells) {
            if (this.value !== value && value >0 * value <10) {
                // check can set for row, column and cell
            }
        }
    }


}
);

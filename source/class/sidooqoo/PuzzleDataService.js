/**
 * This is the class to deal with raw data for stating puzzles
 *
 * @asset(sidooqoo/*)
 */
qx.Class.define("sidooqoo.PuzzleDataService", {
    extend: qx.core.Object,
  
    properties: {
      puzzleData: {
        nullable: true      
      }
    },

    members: {
        __store: null,
    
        fetchPuzzleData() {
            if (this.__store === null) {
              var location = window.location;
              var url = location.origin + "/resource/sidooqoo/service.js";
              if (url !== "http://localhost:8080/resource/sidooqoo/service.js") {            
                console.log("bas shit");
                debugger;
              }

              this.__store = new qx.data.store.Jsonp();
              this.__store.setCallbackName("callback");
              this.__store.setUrl(url);
              this.__store.bind("model", this, "puzzleData");    
              
              // get the data with
              //this.getPuzzleData().toArray()[0].getEvilPuzzleData().toArray()
             
             // this.__store.bind("puzzleData", this, "model");


            } else {
              this.__store.reload();
            }
        },
    },

  });

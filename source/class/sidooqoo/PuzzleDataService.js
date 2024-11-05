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
                throw new Error("Wrong URL");
              }

              this.__store = new qx.data.store.Jsonp();
              this.__store.setCallbackName("callback");
              this.__store.setUrl(url);
              this.__store.bind("model", this, "puzzleData");    
            } else {
              this.__store.reload();
            }
        }
    }

  });

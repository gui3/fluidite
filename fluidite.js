/*
js Template flexibles-modules
https://github.com/Gui38/flexible-modules-js
v 0.4.0

thanks to Stefan Judis :
https://www.contentful.com/blog/2017/01/17/the-global-object-in-javascript/
_____________________________________________________________________
 module name : fluidite
 version : 0.1.2
_____________________________________________________________________
*/

(function () {
  var exported = {};

  // start of MODULE ________________________________________________

  _exported.Reader = function ( options ) {


    return this;
  };

  _exported.Logger = function ( options ) {
    this.silent = true;
    this.history = {}
    this.maxLogs = 10 000;

    this.message = function ( description, label=undefined ) {
      if ( this.silent == false ) {
        console.log( "fluidite >> "+label+"::"+description )
      }
    }
    this.addLog = function (log) {
      log = log.push ?
        {list: log} :
        log instanceof Object ?
          log :
          {text: String(log)};

      this.history[this.history.index] =

    }

    return this;
  };




  // end of MODULE __________________________________________________

  var scope =
    typeof window !== "undefined" ?
      window :
      typeof global !== "undefined" ?
        global :
        typeof self !== "undefined" ?
          self :
          undefined;
  var keyScope =
    typeof exports !== "undefined" ?
      exports :
      typeof module !== "undefined" ?
        (typeof module.exports !== "undefined" ?
          module.exports :
          undefined) :
        undefined;

  // require environment ----------------------------------
  if ( keyScope !== undefined ) {
    for ( key in exported ) {
      keyScope[key] = exported[key];
    }
  }

  // global environment -----------------------------------
  if ( scope !== undefined ) {
    scope.

// ___________________________________________________________________
      fluidite // <= YOUR MODULE NAME HERE
// ___________________________________________________________________

        = exported;
  }
})();

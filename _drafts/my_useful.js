/*
js Template flexibles-modules
https://github.com/Gui38/flexible-modules-js
v 0.4.0
_____________________________________________________________________
 module name : my-useful-js
 https://github.com/Gui38/my-useful-js
_____________________________________________________________________

*/

(function () {
  var exported = {};

  // start of MODULE ________________________________________________
  var private = "shhhh ... it's a secret";
  exported.public_message = "HELLO from flexible-modules 0.4.0 !!!";




  // lib setup -------------------------------------------

  exported._silent = true;

  exported.message = function (text) {
    if ( exported._silent == false ) {
      console.log(text);
    }
  };



  // pure JS functions -----------------------------------





  exported.emptyElement = function (element) {
    while ( element.firstChild ) {
      element.removeChild(element.firstChild);
    }
  };



  exported.waitForAsynchro = function (args={testTry:null, testTrue:null,
    maxTries:1000, time:60, callback:null})
  {
    //testTry = function tried
    //testTrue = function condition (return true or false)
    //maxTries = default 1000
    //time = default 60ms, time between tries
    //default time maximum waited : 1mn
    if (args.testTry) {var testTry = args.testTry} else {var testTry = null};
    if (args.testTrue) {var testTrue = args.testTrue} else {var testTrue = null};
    if (args.maxTries) {var maxTries = args.maxTries} else {var maxTries = 1000};
    if (args.time) {var time = args.time} else {var time = 60};
    if (args.callback) {var callback = args.callback} else {var callback = null};

    if (testTry === null) {var testTry = function () {return undefined;};}
    if (testTrue === null) {var testTrue = function () {return true;};}
    if (callback === null) {var callback = function () {return undefined;};}

    exported.message("..waitFor launched");

    var tries = 0
    function bigPayback () {
      tries += 1;
      if ( testTrue() == true && tries < maxTries)
      {
        //console.log("true passed")
        var cleared = false;
        try {
          testTry();
          //console.log("try passed")
          clearInterval(interval);
          cleared = true;
        } catch {
        }
        if (cleared == true)
        {
          exported.message("..waitFor cleared successfully");
          callback();
        }
      }
      else {
        clearInterval(interval);
        exported.message("..waitFor cleared without success")
      }
    };
    var interval = setInterval
    (
      bigPayback,
      time
    );
  };








  // for browser only ------------------------------------
  exported.browser = {};


  exported.browser.getElement = function (element) {
    if ( element instanceof HTMLElement ) {
      return element
    } else {
      element = document.getElementById(element);
      if ( !element ) {
        element = document.getElementsByTagName(element)[0];
      }
    }
  };

  exported.browser.getScript = function (src, test, callback=null) {
    //src = path or url of the lib
    //test = function that check if the lib works
    //callback = what to do with the lib once loaded

    try {
      //test = function that check if the lib works
      test();
      exported.message("lib already there "+src);
      callback();
      return undefined;

    } catch (e) {
      //the lib is not there

      var libDiv = document.createElement("script");
      libDiv.src = src
      document.head.appendChild(libDiv);

      //test will be performed after load
      document.onload = function () {
        try {
          test()
          exported.message("lib successfully loaded from "+src);
          callback();
          //return libDiv;

        } catch (e) {

          throw "Failed to load lib from "+src;
          document.head.removeChild(libDiv);
          callback();//you never know, it might work ??
          //return undefined;
        }
      }

      if (libDiv)
      {
        return libDiv;
      } else {
        return undefined;
      }
    }
  };


  exported.browser.get_jQuery = function (src = null) {
    if (src == null) {
      var src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"
    }
    var jQueryDiv= getLib(src, test= function ()
      {
        $(document).background;
    });
    return jQueryDiv;
  };









  // end of MODULE __________________________________________________

  var scope =
    typeof window !== "undefined" ?
      window :
      typeof global !== "undefined" ?
        global :
        typeof self !== "undefined" ?
          self :
          undefined
  ;
  var keyScope =
    typeof exports !== "undefined" ?
      exports :
      typeof module !== "undefined" ?
        (typeof module.exports !== "undefined" ?
          module.exports :
          undefined) : // *
        undefined
  ;

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
      my_useful
// ___________________________________________________________________

        = exported;
  }
})();




// * what to do with a module without module.exports ?
//   help me improve the code

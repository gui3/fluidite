/*
js Template flexibles-modules
https://github.com/Gui38/flexible-modules-js
v 0.4.0

thanks to Stefan Judis :
https://www.contentful.com/blog/2017/01/17/the-global-object-in-javascript/
_____________________________________________________________________
 module name : fluidite
_____________________________________________________________________
( Don't forget to change the module name
at the VERY END of the file, near the arrow )
*/

(function () {
  var exported = {};

  // start of MODULE ________________________________________________

  var private = "shhhh ... it's a secret"

  exported.public_message = "HELLO from flexible-modules 0.4.0 !!!"



  //Module ---------------------------------------------

  //---------------user params

  exported.tab = 2; //2 or 4 spaces for a tab, depends on user

  //---------------core params

  /*
  32 space
  10 backspace
  9 tabulation
  59 ;
  61 =
  44 ,
  58 :
  35 #
  64 @
  */

  //----------------core objects

  exported.fThesaurus = function () {
    this.learn = function ( wordName,
                            wordDef,
                            wordHelp=null)
    {
      this[wordName] = {};
      this[wordName].def = wordDef;
      this[wordName].help = wordHelp;
    };
    //return this;
  };

  exported.fReader = function () {
    this.context= {};
    this.waitFor= "";
    this.translating= true;
    this.interpreting= true;
    this.currentWord= "";
    this.translated= "";
    this.lastChar=  "";

    //return this;
  };

  //the core thesaurus, with root functions
  exported.scriptures = {
    thesaurus: new exported.fThesaurus (),
    lexicon: {
      ":":{
        def: function (arg) {

        },
        help: ""
      },
      "#":{
        def: "",
        help: ""
      },
      "@":{
        def: "",
        help: ""
      }
    },
    endWordCodes: [32,10,9,59,58],
    invisibleCodes: [32, 10, 9]
  };



  //---------------core functions

  exported.read = function (script, reader = null) {
    script = String(script);

    if ( reader == null)
    {
      reader = new this.fReader ();
    }

    for (var i = 0; i < script.length; i++)
    {
      var char = script.charAt(i);
      var charCode = char.charCodeAt(0);

      if ( reader.translating == true )
      {
        // 1 ------------------------- what to write in HTML

        if ( charCode == 32 ) //spaces
        {
          //one out of 2 spaces needs to be space because of word wrap
          if ( this.scriptures.invisibleCodes
            .indexOf(reader.lastChar.charCodeAt(0)) > -1)
          {
            reader.currentWord += "&nbsp;";
          }
          else
          {
            reader.currentWord += " ";
          }
        }
        else if (charCode == 10) //backspaces
        {
          reader.currentWord += "<br/>";
        }
        else if (charCode == 9) //tabulations
        {
          reader.currentWord += fTabulationHTML;
        }
        //add here new invisibles chars
        else
        {
          reader.currentWord += char;
        };
      };

      if (this.scriptures.endWordCodes.indexOf(charCode) > -1)
      {
        if ( reader.interpreting == true )
        {
          //word checking-------------------------
          reader = this.interpret(reader);
        }
        else
        {
          reader.translated += reader.currentWord;
        };
        reader.currentWord = "";
      }

      reader.lastChar = char;
    }

    return reader.translated;
  };

  exported.interpret = function (reader) {
    reader.translated += reader.currentWord;

    return reader;
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


/*



// CONSTANTS -------------------------------------------
//var document;

const constants = {
  //doc: document
}

var Fluidite = (function (constants) {

  function export (moduleObject, exportObject) {
    var exports;
    if (exports) {

    }
  }



  // end of Module -------------------------------------
  return this;
})( constants );


// Other exports ---------------------------
var exports;
if (exports) {
  // for node JS ---------------------------
  for (key in _module) {
    exports[key] = _module[key];
  }
}
*/


/*
fluidité module
*/

// CONSTANTS -------------------------------------------
//var document;

const constants = {
  //doc: document
}

var Fluidite = (function (constants) {
  //Module ---------------------------------------------

  //---------------user params

  this.tab = 2; //2 or 4 spaces for a tab, depends on user

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

  //the core thesaurus, with root functions
  this.scriptures = {
    thesaurus: new fThesaurus (),
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

  this.read = function (script, reader = null) {
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

  this.interpret = function (reader) {
    reader.translated += reader.currentWord;

    return reader;
  };


  //----------------core objects

  this.fThesaurus = function () {
    this.learn = function ( wordName,
                            wordDef,
                            wordHelp=null)
    {
      this[wordName] = {};
      this[wordName].def = wordDef;
      this[wordName].help = wordHelp;
    };
    return this;
  };

  this.fReader = function () {
    this.context= {};
    this.waitFor= "";
    this.translating= true;
    this.interpreting= true;
    this.currentWord= "";
    this.translated= "";
    this.lastChar=  "";

    return this;
  };




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

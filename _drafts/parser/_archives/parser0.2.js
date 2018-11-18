


var bonjour = "bonjour   hello :buongiorno :h1>"

var fli =
`
:h1> this is a h1 title

:hLine;
          above this should be a line

you need to go to :@https://thisPage@; :-
or to search for some #hashtags;

for mails, do you prefer
:mail guillaume.3.7.13@gmail.fr mail;
or @guillaume.3.7.13@gmail.fr@; ?
        (I like both)

:!
this will not appear in html,
but this page has an author :
#author:: guillaume3 :;
!;

:/ this is a true comment,
 i can write anything /;

some text :/> same here, but it's an #endline; comment

:translate.html
  <p>this section is rendered as is<br/>
  spaces and
  backspaces
  are ignored here</p>
translate.html;

:h2 unknown sequences h2; (suggest more)
 :  ;    ;:
`



var rex = (function () {
  /*
  rex_regex module _____________________________________________________________
  version 0.1.0
  https://github.com/Gui38/rex_regex-js
  */

  var _exported = {};

  // start of MODULE ________________________________________________

  // CORE properties ------------------------------------
  _exported._core = {};

  _exported._core.Element = function (raw) {
    raw =
      raw instanceof _exported._core.Element ?
        raw.text :
        typeof raw == "string" ?
          raw :
          String(raw);
    this.raw = raw;
    this.text = raw;
    this.regex = function (flags = "") {
      return new RegExp (this.text, flags);
    };
    this.one = function () {
      return new _exported._core.Element(
        this.text
      );
    }
    this.any = function () {
      return new _exported._core.Element(
        this.text+"*"
      );
    };
    this.many = function () {
      return new _exported._core.Element(
        this.text+"+"
      );
    };
    this.some = function (min, max=null) {
      // thanks mfix22
      // https://github.com/mfix22/rexrex
      var numbers;
      if ( max == Infinity ) {
        numbers = min+",";
      }
      else if ( max == null ) {
        numbers = ""+min
      }
      else {
        numbers = min+","+max;
      }
      return new _exported._core.Element(
        this.text+"{"+numbers+"}"
      );
    };
    return this;
  };

  var Element = _exported._core.Element

  // basic elements -----------------------------------------------------------

  // CORE properties ------------------------------------
  _exported._core = {};

  _exported._core.Element = function (args) {
    raw = ""
    var argumentList =
      args instanceof _exported._core.Element ?
        [args] :
        args instanceof Object ?
          args :
          [args];
    console.log(argumentList)
    for (ix in argumentList) {
      var arg = argumentList[ix];
      raw +=
        arg instanceof _exported._core.Element ?
          arg.text :
          typeof arg == "string" ?
            arg :
            String(arg);
    }
    this.raw = raw;
    this.text = raw;
    this.regex = function (flags = "") {
      return new RegExp (this.text, flags);
    };
    this.one = function () {
      return new _exported._core.Element(
        this.text
      );
    }
    this.any = function () {
      return new _exported._core.Element(
        this.text+"*"
      );
    };
    this.many = function () {
      return new _exported._core.Element(
        this.text+"+"
      );
    };
    this.some = function (min, max=null) {
      // thanks mfix22 - https://github.com/mfix22/rexrex
      var numbers;
      if ( max == Infinity ) {numbers = min+",";}
      else if ( max == null ) {numbers = ""+min;}
      else {numbers = min+","+max;}
      return new _exported._core.Element(
        this.text+"{"+numbers+"}"
      );
    };
    return this;
  };
  // basic elements -----------------------------------------------------------
  var Element = _exported._core.Element
  // chars are a sequel of characters, like /hello/ ---------
  _exported.chars = function () {
    var that = new _exported._core.Element(arguments);
    var toAllChars = function (operator) {
      return function toAllChars (min=undefined, max = undefined) {
        var result = "";
        for ( ix in that.raw ) {
          var char = that.raw[ix];
          if (char !== "\\") {
            result += new Element(char)[operator](min,max).text;
          } else {
            // THIS IS WHERE the \\ problem should be solved
            // meanwhile, it's not supported
            // don't do chars with \\ (chars("\\\\"))
            result += char;
          }
        }
        return new Element (result);
      };
    };
    that.any = toAllChars("any")
    that.many = toAllChars("many")
    that.some = toAllChars("some")
    return that;
  };

  // sets are a set of characters like /[hello]/ ------------------
  _exported.set = function () {
    var that = new _exported._core.Element(arguments);
    that.text = "["+that.raw+"]"
    that.not = function () {
      return new _exported.set( "^"+that.raw )
    };
    return that;
  };

  // groups are ... groups /(hello)/ ------------------------------
  _exported.group = function () {
    var that = new _exported._core.Element(arguments);
    that.text = "("+that.raw+")"
    //that.not = "(?!"+raw+")"
    return that;
  };


  return _exported;
})();




/*
rex.chars = function (raw) {
  this.raw = raw;
  this.one = raw;
  this.any = "";
  this.many = "";
  for (ix in raw) {
    var char = raw[ix];
    this.any += char+"*";
    this.many += char+"+";
  }
};
rex.set = function (raw) {
  this.raw = raw;
  this.one = "["+raw+"]"
  this.any = this.one+"*";
  this.many = this.one+"+";
  this.not = "[^"+raw+"]"
};
rex.group = function (raw) {
  this.raw = raw;
  this.one = "("+raw+")"
  this.any = this.one+"*";
  this.many = this.one+"+";
  //this.not = "(?!"+raw+")"
};
*/

// Machine parsing ________________________________________________
var machineW = {} ;

// core DICTIONNARY ----------------------------------------------
//open operators ------------------------
machineW.listenOperatorC = new rex.chars(":");
// close operators ----------------------
machineW.followOperatorC = new rex.chars(">");
machineW.execOperatorC = new rex.chars(";");
// specials -----------------------------
machineW.hashtagOperatorC = new rex.chars("#");
machineW.refOperatorC = new rex.chars("@");
/*
machineW.sComOperatorC = new rex.chars("!");
machineW.hComOperatorC = new rex.chars("/");
machineW.sQuoteOperatorC = new rex.chars("'");
machineW.hQuoteOperatorC = new rex.chars('"');
machineW.hQuoteOperatorC = new rex.chars('"');
machineW.killOperatorC = new rex.chars("\\-");
*/
// invisibles ----------------------------
machineW.carriageC = new rex.chars("\\r");
machineW.newLineC = new rex.chars("\\n");
machineW.spaceS = new rex.set(" \\t");// no \s because it contains \r
// words & labels -----------------------
machineW.nonLabelS = new rex.set(
  ",\\\\<=+*%°ç^_`\\-&|([{~}\\]\\)§!?$£¤€"+
  "."//this little one could be useful one day
  // /!@#'" must be kept as labels for special functions
)

// machine semes -------------------------------------------






// processing the regexes ---------------------------------
machineW.openOperatorS = new rex.set (
  machineW.listenOperatorC.one+
  machineW.hashtagOperatorC.one
)
machineW.closeOperatorS = new rex.set(
  machineW.endlineOperatorC.one+
  machineW.execOperatorC.one+
  machineW.noBrOperatorC.one
)
machineW.endLineG = new rex.group(
  machineW.carriageC.one+"|"+
  machineW.newLineC.one+"|"+
  machineW.carriageC.one+machineW.newLineC.one
); // thanks Peter Van der Wal for (\\r\\n|\\r|\\n)
//https://stackoverflow.com/questions/20056306/match-linebreaks-n-or-r-n
machineW.invisibleS = new rex.set (
  machineW.spaceS.raw+
  machineW.carriageC.one+
  machineW.newLineC.one
)
machineW.endWordS = new rex.set (
  machineW.invisibleS.raw+
  machineW.openOperatorS.raw+
  machineW.closeOperatorS.raw
)
machineW.wordS = new rex.set (
  "^"+
  machineW.endWordS.raw
)
machineW.labelS = new rex.set (
  "^"+
  machineW.endWordS.raw+
  machineW.nonLabelS.raw
)
// specials --------------------------------
machineW.loneSpecialOperatorS = new rex.set(
  machineW.hashtagOperatorC.one+
  machineW.atOperatorC.one
)
machineW.loneSpecialG = new rex.group(
  machineW.loneSpecialOperatorS.one+
  machineW.wordS.many+
  machineW.execOperatorC.one
)
machineW.openSpecialC = new rex.chars(
  machineW.listenOperatorC.one+
  machineW.specialS.one
)
machineW.closeSpecialC = new rex.chars(
  machineW.specialS.one+
  machineW.execOperatorC.one
)



// Human Words _________________________________________________
var humanW = {};

humanW.loneTagG = new rex.group(
  machineW.loneSpecialG.raw+"|"+
  machineW.openOperatorS.one+
  machineW.labelS.any+
  machineW.closeOperatorS.one
);
humanW.openTagG = new rex.group(
  machineW.openSpecialC.one+"|"+
  machineW.openOperatorS.one+
  machineW.labelS.many
);
humanW.closeTagG = new rex.group(
  machineW.closeSpecialC.one+"|"+
  machineW.labelS.many+
  machineW.closeOperatorS.one
);
humanW.spacingG = new rex.group(
  machineW.spaceS.many
);
humanW.lineBreakG = machineW.endLineG;

humanW.wordG = new rex.group(
  machineW.wordS.many
);
humanW.leftoverG = new rex.group(
  machineW.invisibleS.not+"+"
)

// HUMAN PARSER ________________________________________________

// parsing regexp -----------------------------------------
humanW.rexString =
  humanW.loneTagG.one+"|"+
  humanW.openTagG.one+"|"+
  humanW.closeTagG.one+"|"+
  humanW.spacingG.one+"|"+
  humanW.lineBreakG.one+"|"+
  humanW.wordG.one+"|"+
  humanW.leftoverG.one
  ;
// regex groups in human word parser -----------
humanW.rexGroups = {
  1: "lonetag",
  2: "opentag",
  3: "closetag",
  4: "spacing",
  5: "linebreak",
  6: "word",
  7: "leftover",
}
/*original regex : -------------------------------
v1
/([:#@]([^ \t\r\n:#@>;-])*[>;-])|([:#@]([^ \t\r\n:#@>;-])+)|
(([^ \t\r\n:#@>;-])+[>;-])|(::)|([ \t]+)|
((\r|\n|\r\n))|(([^ \t\r\n:#@>;-])+)|(.+)/
v2
([#@][^ \t\r\n:#>;\-]+;|[:#][^ \t\r\n:#>;\-,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€.]*[>;\-])|
(:[/!@#'":]|[:#][^ \t\r\n:#>;\-,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€.]+)|
([/!@#'":];|[^ \t\r\n:#>;\-,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€.]+[>;\-])|
([ \t]+)|
(\r|\n|\r\n)|
([^ \t\r\n:#>;\-]+)|
([^ \t\r\n]+)
*/

// parameter variable to place somewhere accessible -----------
var maxSemes = -1
var maxLines = -1;
// -1 for unlimited, otherwise it will floor the while


// human parser -------------------------------------------------
humanW.parse = function (script) {
  var parsingRex = new RegExp ( humanW.rexString, "g" ),
    humanDOM = [],
    lines = 0,
    array = parsingRex.exec(script);

  while ( array !== null &&
    lines !== maxLines &&
    humanDOM.length !== maxSemes )
  {
    var humanElement = {};
    humanElement["value"] = array[0];

    for ( var i = 1; i<array.length; i++ ) {
      if ( array[i] == array[0] ) {
        humanElement["group"] = i;
        humanElement["type"] = humanW.rexGroups[i];
        break;
      }// I am sure there is a FASTER way of doing it
    }// but for now it works good and CLEAN
    if ( humanElement.type == "lineBreak" ) {
      lines += 1;
    }
    humanDOM.push( humanElement );

    array = parsingRex.exec(script);
  };

  return humanDOM;
};

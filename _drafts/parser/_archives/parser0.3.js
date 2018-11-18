


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


// REGEXES ---------------------------------------
rex = {};

rex.set = function (raw) {
  this.raw = raw;
  this.one = "["+raw+"]"
  this.any = this.one+"*";
  this.many = this.one+"+";
  this.not = "[^"+raw+"]"
  this.not_any = "[^"+raw+"]*"
  this.not_many = "[^"+raw+"]+"
};
rex.group = function (raw) {
  this.raw = raw;
  this.one = "("+raw+")"
  this.any = this.one+"*";
  this.many = this.one+"+";
  //this.not = "(?!"+raw+")"
};

// Machine parsing ________________________________________________
var machineW = {} ;

// core DICTIONNARY _____________________

//open operators ------------------------
machineW.listenOperatorC = ":";
// close operators ----------------------
machineW.followOperatorC = ">";
machineW.execOperatorC = ";";
// specials -----------------------------
machineW.killOperatorC = "\\\\";
machineW.keyOperatorC = "#";
machineW.refOperatorC = "@";
/*
machineW.sComOperatorC = new rex.chars("!");
machineW.hComOperatorC = new rex.chars("/");
machineW.sQuoteOperatorC = new rex.chars("'");
machineW.hQuoteOperatorC = new rex.chars('"');
machineW.hQuoteOperatorC = new rex.chars('"');
machineW.killOperatorC = new rex.chars("\\-");
*/
// invisibles ----------------------------
machineW.carriageC = "\\r";
machineW.newLineC = "\\n";
machineW.spaceCs = " \\t";
// forbidden chars in labels -------------
// are added : all the existing operators and invisibles
machineW.outLabelC =
  ",\\\\<=+*%°ç^_`\\-&|([{~}\\]\\)§!?$£¤€"+
  "."//this little one could be useful one day
  // /!@#'" must be kept as labels for special functions
;

// machine semes ___________________

machineW.openOperatorS = new rex.set (
  machineW.listenOperatorC
)
machineW.closeOperatorS = new rex.set(
  machineW.followOperatorC+
  machineW.execOperatorC
)
machineW.operatorS = new rex.set (
  machineW.openOperatorS.raw+
  machineW.closeOperatorS.raw+
  machineW.killOperatorC+
  machineW.keyOperatorC+
  machineW.refOperatorC
)
machineW.endLineG = new rex.group(
  machineW.carriageC+"|"+
  machineW.newLineC+"|"+
  machineW.carriageC+machineW.newLineC
); // thanks Peter Van der Wal for (\\r\\n|\\r|\\n)
//https://stackoverflow.com/questions/20056306/match-linebreaks-n-or-r-n
machineW.spacesS = new rex.set(
  machineW.spaceCs
);// no \s because it contains \r
machineW.invisibleS = new rex.set(
  machineW.spaceCs+
  machineW.carriageC+
  machineW.newLineC
);
machineW.nonWordS = new rex.set (
  machineW.invisibleS.raw+
  machineW.operatorS.raw
);
machineW.nonLabelS = new rex.set(
  machineW.outLabelC+
  machineW.nonWordS.raw
);


// human words --------------------------------
humanW = {};

humanW.separatorG = new rex.group(
  machineW.listenOperatorC+
  machineW.listenOperatorC
);
humanW.closeSetG = new rex.group(
  machineW.listenOperatorC+
  machineW.execOperatorC
);
humanW.killCommandG = new rex.group(
  machineW.listenOperatorC+
  machineW.killOperatorC
);
humanW.openLoneLinkG = new rex.group(
  machineW.keyOperatorC+
  machineW.nonWordS.not_many+ // maybe label ?
  "|"+
  machineW.refOperatorC+
  machineW.nonWordS.not_many
);

humanW.loneTagG = new rex.group(
  machineW.openOperatorS.one+
  machineW.nonLabelS.not_many+
  machineW.closeOperatorS.one
);
humanW.openTagG = new rex.group(
  machineW.openOperatorS.one+
  machineW.nonLabelS.not_many
);
humanW.closeTagG = new rex.group(
  machineW.nonLabelS.not_many+
  machineW.closeOperatorS.one
);
humanW.spacingG = new rex.group(
  machineW.spacesS.many
);
humanW.lineBreakG = new rex.group(
  machineW.endLineG.raw
);
humanW.wordG = new rex.group(
  machineW.nonWordS.not_many
);
humanW.leftoverG = new rex.group(
  ".+"
);


// HUMAN PARSER ________________________________________________

// parsing regexp -----------------------------------------
humanW.rexString =

  humanW.separatorG.one+"|"+
  humanW.closeSetG.one+"|"+
  humanW.killCommandG.one+"|"+
  humanW.openLoneLinkG.one+"|"+
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
  8: "",
  9: "",
  10: "",
  11: "",
  12: "",
  13: ""
}

/*original regex : -------------------------------
v1-----------------------------
/([:#@]([^ \t\r\n:#@>;-])*[>;-])|([:#@]([^ \t\r\n:#@>;-])+)|
(([^ \t\r\n:#@>;-])+[>;-])|(::)|([ \t]+)|
((\r|\n|\r\n))|(([^ \t\r\n:#@>;-])+)|(.+)/
v2-----------------------------
([#@][^ \t\r\n:#>;\-]+;|[:#][^ \t\r\n:#>;\-,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€.]*[>;\-])|
(:[/!@#'":]|[:#][^ \t\r\n:#>;\-,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€.]+)|
([/!@#'":];|[^ \t\r\n:#>;\-,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€.]+[>;\-])|
([ \t]+)|
(\r|\n|\r\n)|
([^ \t\r\n:#>;\-]+)|
([^ \t\r\n]+)
v3-----------------------------
(::)|
(:;)|
(:\\)|
(#[^ \t\r\n:>;\\#@]+|@[^ \t\r\n:>;\\#@]+)|
([:][^,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€. \t\r\n:>;\\#@]+[>;])|
([:][^,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€. \t\r\n:>;\\#@]+)|
([^,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€. \t\r\n:>;\\#@]+[>;])|
([ \t]+)|
(\r|\n|\r\n)|
([^ \t\r\n:>;\\#@]+)|
(.+)
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

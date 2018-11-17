


var bonjour = "bonjour   hello :buongiorno :h1>"

var fli =
`
:h1> this is a h1 title

:hLine;
          above this should be a line

you need to go to @https://thisPage; :-
or to search for some #hashtags;

for mails, do you prefer
:mail guillaume.3.7.13@gmail.fr mail;
or @guillaume.3.7.13@gmail.fr@; ?
        (I like both)

:/
this will not appear in html,
but this page has an author :
#author:: guillaume3 #;
/;

:x this is a true comment,
 i can write anything x;

some text :x> same here, but it's an #endline; comment

:translate.html
  <p>this section is rendered as is<br/>
  spaces and
  backspaces
  are ignored here</p>
translate.html;

:h2 unknown sequences h2; (suggest more)
 :  ;     ;:
`


var rex = {};

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


// Machine words _________________________________________________
var machineW = {} ;

//open operators -----------------------
machineW.listenOperatorC = new rex.chars(":");
machineW.hastagOperatorC = new rex.chars("#");
machineW.atOperatorC = new rex.chars("@");
// close operators --------------------
machineW.endlineOperatorC = new rex.chars(">");
machineW.execOperatorC = new rex.chars(";");
machineW.noBrOperatorC = new rex.chars("-");
// others ----------------------------
machineW.setOperatorC = new rex.chars("::");

machineW.spaceS = new rex.set(" \\t");// no \s because it contains \r
machineW.carriageC = new rex.chars("\\r");
machineW.newLineC = new rex.chars("\\n");

// processing the regexes ---------------------------------
machineW.openOperatorS = new rex.set (
  machineW.listenOperatorC.one+
  machineW.hastagOperatorC.one+
  machineW.atOperatorC.one
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
machineW.labelCharG = new rex.group (
  machineW.endWordS.not
)

// Human Words _________________________________________________
var humanW = {};

humanW.loneTagG = new rex.group(
  machineW.openOperatorS.one+
  machineW.labelCharG.any+
  machineW.closeOperatorS.one
);
humanW.openTagG = new rex.group(
  machineW.openOperatorS.one+
  machineW.labelCharG.many
);
humanW.closeTagG = new rex.group(
  machineW.labelCharG.many+
  machineW.closeOperatorS.one
);
humanW.setTagG = new rex.group(
  machineW.setOperatorC.one
);
humanW.spacingG = new rex.group(
  machineW.spaceS.many
);
humanW.lineBreakG = new rex.group(
  machineW.endLineG.one
);
humanW.wordG = new rex.group(
  machineW.labelCharG.many
);

// HUMAN PARSER ________________________________________________

// parsing regexp -----------------------------------------
humanW.rexString =
  humanW.loneTagG.one+"|"+
  humanW.openTagG.one+"|"+
  humanW.closeTagG.one+"|"+
  humanW.setTagG.one+"|"+
  humanW.spacingG.one+"|"+
  humanW.lineBreakG.one+"|"+
  humanW.wordG.one+
  "|(.+)" // gets all words not taken, for instance a single : or ;
  ;
// regex groups in human word parser -----------
humanW.rexGroups = {
  1: "loneTag",
  2: "X", // (loneTag label's last char)",
  3: "openTag",
  4: "X", // (openTag label's last char)",
  5: "closeTag",
  6: "X", // (closeTag label's last char)",
  7: "setTag",
  8: "spacing",
  9: "lineBreak",
  10: "X", // (lineBreak again)",
  11: "word", // (non interpreted words)",
  12: "X", // (word's last char)"
  13: "unknown" // (word's last char)"
}
/*original regex : -------------------------------
([:#@]([^ \t\r\n:#@>;-])*[>;-])|([:#@]([^ \t\r\n:#@>;-])+)|
(([^ \t\r\n:#@>;-])+[>;-])|(::)|([ \t]+)|
((\r|\n|\r\n))|(([^ \t\r\n:#@>;-])+)|(.+)

it has 2 incoherences
- before last group is double
- last group englobes a set
but please don't change the process of writing it
unless you truly understood the spirit of it
*/

// human parser -------------------------------------------------
humanW.parse = function (script) {
  var parsingRex = new RegExp ( humanW.rexString, "g" ),
    humanDOM = [],
    array = parsingRex.exec(script);

  while ( array !== null && humanDOM.length < 1000) {
    var humanElement = {};
    humanElement["value"] = array[0];

    for ( var i = 1; i<array.length; i++ ) {
      if ( array[i] == array[0] ) {
        humanElement["group"] = i;
        humanElement["type"] = humanW.rexGroups[i];
        break;
      }// I am sure there is a FASTER way of doing it
    }// but for now it works good and CLEAN
    humanDOM.push( humanElement );

    array = parsingRex.exec(script);
  };

  return humanDOM;
};

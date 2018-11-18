


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
machineW.hashtagOperatorC = new rex.chars("#");
machineW.atOperatorC = new rex.chars("@");
// close operators --------------------
machineW.endlineOperatorC = new rex.chars(">");
machineW.execOperatorC = new rex.chars(";");
machineW.noBrOperatorC = new rex.chars("\\-");
// others ----------------------------

machineW.carriageC = new rex.chars("\\r");
machineW.newLineC = new rex.chars("\\n");
machineW.spaceS = new rex.set(" \\t");// no \s because it contains \r
machineW.nonLabelS = new rex.set(
  ",\\\\<=+*%°ç^_`\\-&|([{~}\\]\\)§!?$£¤€"+
  "."//this little one could be useful one day
  // /!@#'" must be kept as labels for special functions
)
machineW.specialS = new rex.set("/!@#'\":")

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

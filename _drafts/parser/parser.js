


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

// operators -------------------------------
machineW.listenOperatorC = ":";
machineW.execOperatorC = ";";
machineW.getOperatorC = "\\.";// could be useful one day
machineW.nextOperatorC = ">";
machineW.killOperatorC = "\\\\";
machineW.keyOperatorC = "#";
machineW.refOperatorC = "@";
/*
machineW.sComOperatorC = new rex.chars("!");
machineW.hComOperatorC = new rex.chars("/");
machineW.sQuoteOperatorC = new rex.chars("'");
machineW.hQuoteOperatorC = new rex.chars('"');
machineW.hQuoteOperatorC = new rex.chars('"');
*/
// invisibles ----------------------------
machineW.carriageC = "\\r";
machineW.newLineC = "\\n";
machineW.spaceCs = " \\t";
// forbidden chars in labels -------------
// are added : all the existing operators and invisibles
machineW.outLabelC =
  ",\\\\<=+*%°ç^_`\\-&|([{~}\\]\\)§!?$£¤€"
  // /!@#'" must be kept as labels for special functions
;

// sets ___________________________________
machineW.operatorS = new rex.set (
  machineW.listenOperatorC+
  machineW.getOperatorC+
  machineW.execOperatorC+
  machineW.killOperatorC+
  machineW.keyOperatorC+
  machineW.refOperatorC
)
machineW.spacesS = new rex.set(
  machineW.spaceCs
);// no \s because it contains \r
machineW.invisibleS = new rex.set(
  machineW.spaceCs+
  machineW.carriageC+
  machineW.newLineC
);
machineW.endLineG = new rex.group(
  machineW.carriageC+"|"+
  machineW.newLineC+"|"+
  machineW.carriageC+machineW.newLineC
); // thanks Peter Van der Wal for (\\r\\n|\\r|\\n)
//https://stackoverflow.com/questions/20056306/match-linebreaks-n-or-r-n
machineW.nonWordS = new rex.set (
  machineW.invisibleS.raw+
  machineW.operatorS.raw
);
machineW.nonLabelS = new rex.set(
  machineW.outLabelC+
  machineW.nonWordS.raw
);

// machine semes ______________________________

machineW.listenOpG = new rex.group( machineW.listenOperatorC );
machineW.execOpG = new rex.group( machineW.execOperatorC );
machineW.getOpG = new rex.group( machineW.getOperatorC );
machineW.nextOpG = new rex.group( machineW.nextOperatorC );
machineW.killOpG = new rex.group( machineW.killOperatorC );
machineW.keyOpG = new rex.group( machineW.keyOperatorC );
machineW.refOpG = new rex.group( machineW.refOperatorC );

machineW.lineBreakG = new rex.group( machineW.endLineG.raw );
machineW.spacingG = new rex.group( machineW.spacesS.many );
machineW.labelG = new rex.group( machineW.nonLabelS.not_many );
machineW.wordG = new rex.group( machineW.nonWordS.not_many );
machineW.leftoverG = new rex.group( ".+" );

// parsing regexp -----------------------------------------
machineW.rexString =
  machineW.listenOpG.one+"|"+
  machineW.execOpG.one+"|"+
  machineW.getOpG.one+"|"+
  machineW.nextOpG.one+"|"+
  machineW.killOpG.one+"|"+
  machineW.keyOpG.one+"|"+
  machineW.refOpG.one+"|"+
  machineW.lineBreakG.one+"|"+
  machineW.spacingG.one+"|"+
  machineW.labelG.one+"|"+
  machineW.wordG.one+"|"+
  machineW.leftoverG.one
  ;
// regex groups in human word parser -----------
machineW.rexGroups = {
  1: "listen",
  2: "exec",
  3: "get",
  4: "next",
  5: "kill",
  6: "key",
  7: "ref",
  8: "linebreak",
  9: "spacing",
  10: "label",
  11: "word",
  12: "unknown"
}
/*the regex : ------------------------------------
(:)|(>)|(;)|(\\)|(#)|(@)|(\r|\n|\r\n)|([ \t]+)|
([^,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€. \t\r\n:>;\\#@]+)|
([^ \t\r\n:>;\\#@]+)|(.+)
*/

// parameter variable to place somewhere accessible -----------
var maxSemes = -1
var maxLines = -1;
// -1 for unlimited, otherwise it will floor the while


// parser -----------------------------------------------------
machineW.parse = function (script) {
  var parsingRex = new RegExp ( machineW.rexString, "g" ),
    machineDOM = [],
    lines = 0,
    array = parsingRex.exec(script);

  while ( array !== null &&
    lines !== maxLines &&
    machineDOM.length !== maxSemes )
  {
    var machineElement = {};
    machineElement.value = array[0];

    for ( var i = 1; i<array.length; i++ ) {
      if ( array[i] == array[0] ) {
        machineElement.group = i;
        machineElement.type = machineW.rexGroups[i];
        break;
      }// I am sure there is a FASTER way of doing it
    }// but for now it works good and CLEAN
    if ( machineElement.type == "lineBreak" ) {
      lines += 1;
    }
    machineDOM.push( machineElement );

    array = parsingRex.exec(script);
  };

  return machineDOM;
};

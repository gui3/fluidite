


var bonjour = "bonjour   hello :buongiorno :h1>"

var fli =
`
:h1> this is a h1 title

:hLine;
          above this should be a line

you need to go to @https://thisPage; :-
or to search for some #hashtags;

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


// machineWords ---------------------------------------------------
var machineW = {} ;

  machineW.listenOperatorC = new rex.chars(":");
  machineW.hastagOperatorC = new rex.chars("#");
  machineW.atOperatorC = new rex.chars("@");

machineW.openOperatorS = new rex.set (
  machineW.listenOperatorC.one+
  machineW.hastagOperatorC.one+
  machineW.atOperatorC.one
)

  machineW.endlineOperatorC = new rex.chars(">");
  machineW.execOperatorC = new rex.chars(";");
  machineW.noBrOperatorC = new rex.chars("-");

machineW.closeOperatorS = new rex.set(
  machineW.endlineOperatorC.one+
  machineW.execOperatorC.one+
  machineW.noBrOperatorC.one
)

machineW.setOperatorC = new rex.chars("::");

machineW.spaceS = new rex.set(" \\t");// no \s because it contains \r

machineW.carriageC = new rex.chars("\\r");
machineW.newLineC = new rex.chars("\\n");

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

// ([\s\t\r]|(\r\n|\r|\n).|[:#@]|[>;-])
machineW.endWordS = new rex.set (
  machineW.invisibleS.raw+
  machineW.openOperatorS.raw+
  machineW.closeOperatorS.raw
)


machineW.labelCharG = new rex.group (
  machineW.endWordS.not
)

// humanWords ------------------------------------------------------

var humanW = {};

humanW.loneTagG =
  machineW.openOperatorS.one+
  machineW.labelCharG.any+
  machineW.closeOperatorS.one;
humanW.openTag =
  machineW.openOperatorS.one+
  machineW.labelCharG.many;
humanW.closeTagG =
  machineW.labelCharG.many+
  machineW.closeOperatorS.one;
humanW.setTagG =
  machineW.setOperatorC.one;
humanW.spacingG =
  machineW.spaceS.many;
humanW.lineBreakG =
  machineW.endLineG.one;
humanW.wordG =
  machineW.labelCharG.many;










/*
while ((myArray = myRe.exec(str)) !== null) {
  var msg = 'Found ' + myArray[0] + '. ';
  msg += 'Next match starts at ' + myRe.lastIndex;
  console.log(msg);
}





var rgx = {};

rgx.replaceDot = function (str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

new RegExp("regex", "g");

var text = "bonjour hello :buongiorno :h1>"

const RE_DATE = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31




// we could do a dynamic_regex.js module
// word = nonWordChar.one() + nonWordChar.not().many() + nonWordChar.one()
// I tried but for now it's waste of time

// I won't use named groups for compatibility reasons

var invisibleC = " \\t\\n\\r";
var nonWordC = invisibleC+":;,()/\\\\><";

var rules = {};

rules.word = new RegExp (
  "["+nonWordC+"]?(?<word>[^"+nonWordC+"]+)["+nonWordC+"]?",
  "g");

rules.separated = new RegExp (
  "(([^"+invisibleC+"]+)|(["+invisibleC+"]+))",
  "g");

*/

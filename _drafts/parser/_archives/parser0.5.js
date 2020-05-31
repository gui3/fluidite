


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

var _core = {};
var fReader = function (options) {

  fReader.log = {};
  fReader.log.silent = true;
  fReader.log.message

  return this;
};


// REGEXES --------------------------------------
_core = {};
_core.regex = {};

_core.regex.set = function (raw="") {
  this.raw = raw;
  this.update = function () {
    this.one = "["+this.raw+"]"
    this.any = this.one+"*";
    this.many = this.one+"+";
    this.not = "[^"+this.raw+"]"
    this.not_any = "[^"+this.raw+"]*"
    this.not_many = "[^"+this.raw+"]+"
    return this;
  };
  this.addChars = function (chars) {
    this.raw += chars;
    this.update();
    return this;
  };
  this.update();
  return this;
};

_core.regex.group = function (raw="") {
  this.raw = raw;
  this.update = function () {
    this.one = "("+this.raw+")"
    this.any = this.one+"*";
    this.many = this.one+"+";
    //this.not = "(?!"+raw+")"
  };
  this.addPossibility = function (string) {
    if (this.raw.length > 0) {
      this.raw += "|";
    }
    this.raw += string;
    this.update();
    return this;
  };
  this.update();
  return this;
};

// Machine parsing ________________________________________________
_core.machine = {} ;

// core DICTIONNARY _____________________
_core.machine._phonemes = {};

// operators ----------------------------------------------
_core.machine._phonemes.operators = {};
_core.machine._phonemes.operators.listen = ":";
_core.machine._phonemes.operators.do = ";";
_core.machine._phonemes.operators.get = "\\.";// could be useful one day
_core.machine._phonemes.operators.next = ">";
_core.machine._phonemes.operators.kill = "\\\\";
_core.machine._phonemes.operators.think = "#";
_core.machine._phonemes.operators.go = "@";
// invisibles --------------------------------------------
_core.machine._phonemes.invisibles = {};
_core.machine._phonemes.invisibles.carriage = "\\r";
_core.machine._phonemes.invisibles.newline = "\\n";
_core.machine._phonemes.invisibles.tab = "\\t";
_core.machine._phonemes.invisibles.space = " ";// NO \s BECAUSE it has \r !!
// special labels ----------------------------------------
_core.machine._phonemes.specials = {};
_core.machine._phonemes.specials.silent = "!";
_core.machine._phonemes.specials.deaf = "/";
_core.machine._phonemes.specials.stubborn = "'";
_core.machine._phonemes.specials.idiot = "\"";
//_core.machine._phonemes.specials.hidden = "_";
// excluded from label ----------------------------------
_core.machine._phonemes.nonLabel =
  ",\\\\<=+*%°ç^`\\-&|([{~}\\]\\)§!?$£¤€"
  // no need to write the operatorS, INVISIBLES and SPECIALS
  // they will be added below
  // - labels work by exclusion, to allow foreign characters
;


_core.machine.regex = {}
_core.machine.regex.update = function () {
  var rex = _core.regex;
  var phonemes = _core.machine._phonemes;
  var semes = {};

  // groups ___________________________________
  semes.operatorG = new rex.group();// ---------------------
  for ( var key in phonemes.operators ) {
    semes.operatorG.addPossibility(
      rex.group(
        phonemes.operators[key]
      ).one
    );
  }
  semes.specialG = new rex.group();// -----------------------
  for ( var key in phonemes.specials ) {
    semes.specialG.addPossibility(
      new rex.group(
        phonemes.specials[key]
      ).one
    );
  }
  semes.linebreakG = new rex.group()// ---------------------
  .addPossibility(
    new rex.group( // both \r\n
      phonemes.invisibles.carriage+"|"+
      phonemes.invisibles.newline
    ).one
  ) // thanks Peter Van der Wal for ((\r\n)|(\r)|(\n))
  //https://stackoverflow.com/questions/20056306/match-linebreaks-n-or-r-n
  .addPossibility(
    new rex.group( // carriage
      phonemes.invisibles.carriage
    ).one
  )
  .addPossibility(
    new rex.group( // newline
      phonemes.invisibles.newline
    ).one
  );
  semes.spacingG = new rex.group()// ---------------------
  .addPossibility(
    new rex.group( // spaces sequence
      new rex.set(
        phonemes.invisibles.space
      ).many
    ).one
  )
  .addPossibility(
    new rex.group( // tabs sequence
      new rex.set(
        phonemes.invisibles.tab
      ).many
    ).one
  );// LABEL & TEXT preparation -----------------------
  semes.invisiblesS = new rex.set()
  for ( var key in phonemes.invisibles ) {
    semes.invisiblesS.addChars(
      phonemes.invisibles[key]
    );
  }
  semes.operatorsS = new rex.set()
  for ( var key in phonemes.operators ) {
    semes.operatorsS.addChars(
      phonemes.operators[key]
    );
  }
  semes.specialsS = new rex.set()
  for ( var key in phonemes.specials ) {
    semes.specialsS.addChars(
      phonemes.specials[key]
    );
  }
  semes.nonTextS = new rex.set (
    semes.invisiblesS.raw+
    semes.operatorsS.raw+
    semes.specialsS.raw
  );
  semes.nonLabelS = new rex.set(
    phonemes.nonLabel+
    semes.nonTextS.raw
  );// LABEL & TEXT groups -----------------------------------
  semes.labelG = new rex.group( semes.nonLabelS.not_many );
  semes.textG = new rex.group( semes.nonTextS.not_many );
  semes.leftoverG = new rex.group( ".+" );


  // parsing regexp ___________________________________________
  _core.machine.regex.string = new rex.group(
    semes.operatorG.one
    + "|" +
    semes.specialG.one
    + "|" +
    semes.linebreakG.one
    + "|" +
    semes.spacingG.one
    + "|" +
    semes.labelG.one
    +"|"+
    semes.textG.one
    +"|"+
    semes.leftoverG.one
  ).raw;

  // regex groups in machine parser -------------
  _core.machine.regex.groups = {
    1: "operator",//--------
      2: "listen", // :
      3: "do", // ;
      4: "get", // .
      5: "next", // >
      6: "kill", // \
      7: "think", // #
      8: "go", // @
    9: "special",//---------
      10: "silent", // !
      11: "deaf", // /
      12: "stubborn", // '
      13: "idiot", // "
    14: "linebreak",//-------
      15: "both", // \r\n
      16: "carriage", // \r
      17: "newline", // \n
    18: "spacing", //-------
      19: "spaces", // (space)+
      20: "tabs", // \t+
    21: "label", // anything but reserved chars and non-label chars
    22: "text", // anything but reserved chars
    23: "unknown" // what's left (you never know)
  }
  /*the regex : ------------------------------------
  (:)|(>)|(;)|(\\)|(#)|(@)|(\r|\n|\r\n)|([ \t]+)|
  ([^,\\<=+*%°ç^_`\-&|([{~}\]\)§!?$£¤€. \t\r\n:>;\\#@]+)|
  ([^ \t\r\n:>;\\#@]+)|(.+)
  */
  _core.machine.regex.regex = new RegExp ( _core.machine.regex.string, "g" );
  return _core.machine.regex.regex;
};

_core.machine.regex.get = function () {
  var regex =
    _core.machine.regex.regex ?
      _core.machine.regex.regex :
      _core.machine.regex.update();
  return regex;
};



// parameter variable to place somewhere accessible -----------
_core.machine.maxSemes = -1
_core.machine.maxLines = -1;
// -1 for unlimited, otherwise it will floor the while


// Machine parser ___________________________________________________
_core.machine.parse = function (script) {
  var parsingRex = _core.machine.regex.get(),
    machineDOM = [],
    lines = 0,
    array = parsingRex.exec(script);

  while ( array !== null &&
    lines !== _core.machine.maxLines &&
    machineDOM.length !== _core.machine.maxSemes )
  {
    var machineElement = {};
    machineElement.value = array[0];
    machineElement.sense = "";
    machineElement.groups = [];

    for ( var i = 1; i<array.length; i++ ) {
      if ( array[i] == array[0] ) {
        machineElement.groups.push(i);
        machineElement.sense += "."+_core.machine.regex.groups[i];
        //break;
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

// HUMAN parser ________________________________________________
humanW = {}

// SPECIAL groups --------------------------------------
// recreating emails and urls are a pain,
// so they are set apart now
// Don't forget to NON-CAPTURE (?: ) every group
humanW.emailC = "(?:(?:[^<>()\[\]\\.,;:\s@\"]+(?!\.[^<>()\[\]\\.,;:\s@\"]+)*)|(?!\".+\"))" +
"@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|" +
"(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))"
  // credits https://emailregex.com/
;
humanW.webUrlC =
  "@^(?:https?|ftp)://[^\\s/$.?#].[^\\s]*$@i" // S modifier was here
  // credits @stephenhay https://mathiasbynens.be/demo/url-regex
;

/*

HUMAN dictionnary -----------------
(http adress)
  regex(accept(nonInvisibles))
(email)
  regex(accept(nonInvisibles))
loneTag
  loneTag
    listen+exists(label)+exec
  refLoneTag
    previous(invisible)+ref+word
  keyLoneTag
    previous(invisible)+key+word
openTag
  listen+getUncut(label,"b")
closeTag
  getUncut(label,"e")+exec
separator
  listen+listen
lineBreak
  lineBreak
text (invisibles+text)
  all unmatched

fDOM ------------------------------

element types
  fullTag
    openTag+argument+closeTag
  loneTag
    loneTag
  text

element properties
  tag
  children
  options





nonWords = spacing+linebreaks+operators

for seme in machineDOM
  seme = listen
    do big stuff
  seme = exec
    previous = listen
      ->closeSet
    previous = key or ref
      ->closeTag
    previous = label
      previous2 = listen
        ->loneTag
      ->closeTag
  seme = get
    (for now)addToPrevious
  seme = key or ref
    previous = nonWord
      next = label
        next2 = nonWord
          ->loneLink
        else addtoPrevious
      else addtoPrevious
    else
      previous = listen
        ->openTag
      else addToPrevious
  seme =


*/

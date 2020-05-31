


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


// REGEXES --------------------------------------
_core.regex = {};

_core.regex.set = function (raw) {
  this.raw = raw;
  this.one = "["+raw+"]"
  this.any = this.one+"*";
  this.many = this.one+"+";
  this.not = "[^"+raw+"]"
  this.not_any = "[^"+raw+"]*"
  this.not_many = "[^"+raw+"]+"
};
_core.regex.group = function (raw) {
  this.raw = raw;
  this.one = "("+raw+")"
  this.any = this.one+"*";
  this.many = this.one+"+";
  //this.not = "(?!"+raw+")"
};

// Machine parsing ________________________________________________
_core.machine = {} ;

// core DICTIONNARY _____________________
_core.machine._phonemes = {};

// operators ----------------------------------------------
_core.machine._phonemes.operators = {};
_core.machine._phonemes.operators.listen = ":";
_core.machine._phonemes.operators.exec = ";";
_core.machine._phonemes.operators.get = "\\.";// could be useful one day
_core.machine._phonemes.operators.next = ">";
_core.machine._phonemes.operators.kill = "\\\\";
_core.machine._phonemes.operators.key = "#";
_core.machine._phonemes.operators.ref = "@";
// invisibles --------------------------------------------
_core.machine._phonemes.invisibles = {};
_core.machine._phonemes.invisibles.carriage = "\\r";
_core.machine._phonemes.invisibles.newLine = "\\n";
_core.machine._phonemes.invisibles.tab = "\\t";
_core.machine._phonemes.invisibles.space = " ";// NO \s BECAUSE it has \r !!
// special labels ----------------------------------------
_core.machine._phonemes.specials = {};
_core.machine._phonemes.specials.softCom = "!";
_core.machine._phonemes.specials.hardCom = "/";
_core.machine._phonemes.specials.softQuote = "'";
_core.machine._phonemes.specials.hardQuote = "\"";
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

  // sets ___________________________________
  var operators = "";// ---------------------
  for ( var key in phonemes.operators ) {
    operators += phonemes.operators[key];
  }
  semes.operatorS = new rex.set (operators)
  var specials = "";// --------------------
  for ( var key in phonemes.specials ) {
    specials += phonemes.specials[key];
  }
  semes.specialS = new rex.set(specials);
  var invisibles = "";// --------------------
  for ( var key in phonemes.invisibles ) {
    invisibles += phonemes.invisibles[key];
  }
  semes.invisibleS = new rex.set(invisibles);
  semes.spacesS = new rex.set(// ------------
    phonemes.invisibles.space+
    phonemes.invisibles.tab
  );
  semes.endLineG = new rex.group(// ---------
    phonemes.invisibles.carriage+"|"+
    phonemes.invisibles.newLine+"|"+
    phonemes.invisibles.carriage+phonemes.invisibles.newLine
  ); // thanks Peter Van der Wal for (\\r\\n|\\r|\\n)
  //https://stackoverflow.com/questions/20056306/match-linebreaks-n-or-r-n
  semes.nonTextS = new rex.set (// -----------
    semes.invisibleS.raw+
    semes.operatorS.raw+
    semes.specialS.raw
  );
  semes.nonLabelS = new rex.set(// ----------
    phonemes.nonLabel+
    semes.nonTextS.raw
  );


  semes.listenOpG = new rex.group( phonemes.operators.listen );
  semes.execOpG = new rex.group( phonemes.operators.exec );
  semes.getOpG = new rex.group( phonemes.operators.get );
  semes.nextOpG = new rex.group( phonemes.operators.next );
  semes.killOpG = new rex.group( phonemes.operators.kill );
  semes.keyOpG = new rex.group( phonemes.operators.key );
  semes.refOpG = new rex.group( phonemes.operators.ref );

  semes.specialG = new rex.group( semes.specialS.one );
  semes.lineBreakG = semes.endLineG;
  semes.spacingG = new rex.group( semes.spacesS.many );
  semes.labelG = new rex.group( semes.nonLabelS.not_many );
  semes.textG = new rex.group( semes.nonTextS.not_many );
  semes.leftoverG = new rex.group( ".+" );

  // parsing regexp -----------------------------------------
  // stored in a property, it is overwritten to fit phoneme changes
  _core.machine.regex.string =
    semes.listenOpG.one+"|"+
    semes.execOpG.one+"|"+
    semes.getOpG.one+"|"+
    semes.nextOpG.one+"|"+
    semes.killOpG.one+"|"+
    semes.keyOpG.one+"|"+
    semes.refOpG.one+"|"+
    semes.specialG.one+"|"+
    semes.lineBreakG.one+"|"+
    semes.spacingG.one+"|"+
    semes.labelG.one+"|"+
    semes.textG.one+"|"+
    semes.leftoverG.one
    ;
  // regex groups in machine parser -------------
  _core.machine.regex.groups = {
    1: "listen", // :
    2: "exec", // ;
    3: "get", // .
    4: "next", // >
    5: "kill", // \
    6: "key", // #
    7: "ref", // @
    8: "special", // ! / ' "
    9: "linebreak", // \r \n
    10: "spacing", // (space) \t
    11: "label", // anything but reserved chars and non-label chars
    12: "text", // anything but reserved chars
    13: "unknown" // what's left (you never know)
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
var maxSemes = -1
var maxLines = -1;
// -1 for unlimited, otherwise it will floor the while


// Text parser ___________________________________________________
_core.machine.parse = function (script) {
  var parsingRex = _core.machine.regex.get(),
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
        machineElement.type = _core.machine.regex.groups[i];
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




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


glossary = new regex.Glossary()
.add({
  type:"charset",
  tags:"operator open listen",
  syntax:":"
})
.add({
  type:"charset",
  tags:"operator close do",
  syntax:";"
})
.add({
  type:"charset",
  tags:"operator listen",
  syntax:":"
})
.add({
  type:"charset",
  tags:"operator listen",
  syntax:":"
})







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


_core._glossary = semantics.new()
.add({
  type:"morpheme charset",
  class:"text operator open listen",
  syntax:":"
})
.add({
  type:"morpheme charset",
  class:"text operator close do",
  syntax:";"
})
.add({
  type:"morpheme charset",
  class:"text operator find",
  syntax:"\\."
})
.add({
  type:"morpheme charset",
  class:"text operator close next",
  syntax:">"
})
.add({
  type:"morpheme charset",
  class:"text operator close kill",
  syntax:"\\\\"
})
.add({
  type:"morpheme charset",
  class:"text operator label get",
  syntax:"#"
})
.add({
  type:"morpheme charset",
  class:"text operator label go",
  syntax:"@"
})
.add({
  type:"morpheme charset",
  class:"text decorator label silent",
  syntax:"!"
})
.add({
  type:"morpheme charset",
  class:"text label decorator deaf",
  syntax:"/"
})
.add({
  type:"morpheme charset",
  class:"text label decorator stubborn",
  syntax:"'"
})
.add({
  type:"morpheme charset",
  class:"text label decorator idiot",
  syntax:"\""
})
.add({
  type:"morpheme",
  class:"invisible tabs",
  syntax:"{{tab}}+"
})
.add({
  type:"charset",
  class:"invisible tab",
  syntax:"\\t"
})
.add({
  type:"morpheme",
  class:"invisible spaces",
  syntax:"{{space}}+"
})
.add({
  type:"charset",
  class:"invisible space",
  syntax:" "// no \s because it has \r inside
})
.add({
  type:"morpheme",
  priority: 1,
  class:"invisible linebreak doublelb",
  syntax:"\\r\\n"
})
.add({
  type:"morpheme",
  class:"invisible linebreak carriage",
  syntax:"\\r"
})
.add({
  type:"morpheme",
  class:"invisible linebreak newline",
  syntax:"\\n"
})
.add({
  type:"morpheme",
  class:"text word label",
  syntax:"{{nonlabel.not.many}}"
})
.add({
  type:"morpheme charset",
  class:"text special",
  syntax:"//,\\\\<=+*%°ç^`\\-&|([{~}\\]\\)§!?$£¤€//"
})
.add({
  type:"charset",
  class:"nonLabel",
  syntax:"{{invisible.chars+operator.chars+decorator.chars+special.chars}}"
});



/*
//escape ^-]\.^$*+?()[{\|


phonemes :
  regexes you DON't want to get in groups
  they are used to put together morphemes
  accepted : accepted characters
morpheme :
  accepted : list of accepted sequences
lexemes :
  accepts : accepted semantics.classes and their :operations
  expects : list of accepted semantics.classes
  follows : list of accepted semantics classes

*/






_core.machine._semantics.add(
  new semantics.group({
    class:"operator"})// --------------
  .add(
    new semantics.seme({
      name:"listen",
      phoneme:":"}))
  .add(
    new semantics.seme({
      name:"do",
      phoneme:";"}))
  .add(
    new semantics.seme({
      name:"find",
      phoneme:"\\."}))
  .add(
    new semantics.seme({
      name:"next",
      phoneme:">"}))
  .add( // specials ? ----------------
    new semantics.seme({
      name:"kill",
      phoneme:"\\\\"}))
  .add(
    new semantics.seme({
      name:"get",
      phoneme:"#"}))
  .add(
    new semantics.seme({
      name:"go",
      phoneme:"@"}))
  .add( // specials------------------
    new semantics.seme({
      name:"silent",
      phoneme:"!"}))
  .add(
    new semantics.seme({
      name:"deaf",
      phoneme:"/"}))
  .add(
    new semantics.seme({
      name:"stubborn",
      phoneme:"'"}))
  .add(
    new semantics.seme({
      name:"idiot",
      phoneme:"\""}))
);//operators
_core.machine._semantics.add(
  new semantics.group({
    name:invisibles })
  .add(
    new semantics.seme({
      name:"spaces",
      phoneme:" ",
      operations:["many"]}))
  .add(
    new semantics.seme({
      name:"spaces",
      phoneme: new semantics.phoneme({
        name:"space",
        sequence:" ",
        type: "charset",
        operations:["many"]})
      }))
  .add(
    new semantics.seme({
      name:"tabs",
      phoneme: new semantics.phoneme({
        name:"tab",
        sequence: "\\t",
        type: "charset",
        operations:["many"]})
      }))
  .add(
    new semantics.group({
      name:"linebreak"})
    .add(
      new semantics.seme({
        name:"doublebreak",
        priority: 1,
        phoneme: new semantics.phoneme({
          sequence: "\\r\\n",
          type: "sequence" })
        }))
    .add(
      new semantics.seme({
        name:"carriage",
        priority: 2,
        phoneme:"\\r" }))
    .add(
      new semantics.seme({
        name:"newline",
        priority: 2,
        phoneme:"\\n" }))
  )//linebreak
);//invisibles
_core.machine._semantics.add(
  new semantics.group({
    name:"text"})
  .add(
    new semantics.seme({
      name:"word",
      phoneme: new semantics.phoneme({
        name:"wordchars",
        type:"charset",
        operations:["not","many"],
        sequence: new semantics.sequence({
          name:"nonWord",
          add:["operator", "invisibles", "special"]
        })
      })
    })
  )
  .add(
    new semantics.seme({
      name:"label",
      phoneme: new semantics.phoneme({
        name:"labelchars",
        type:"charset",
        operations:["not","many"],
        sequence: new semantics.sequence({
          name:"nonLabel",
          add:["nonWord"]

        })
      })
    })
  )
)




// core DICTIONNARY _____________________
_core.machine._semes = {
  "operator": {// ----------------------
    "_priority": 1,

    "listen": {
      "_priority": 2,
      "_phoneme": ":"},
    "do": {
      "_priority": 3,
      "_phoneme": ";"},
    "find": {
      "_priority": 4,
      "_phoneme": "\\."},
    "next": {
      "_priority": 5,
      "_phoneme": ">"},
    "kill": {
      "_priority": 6,
      "_phoneme": "\\\\"},
    "get": {
      "_priority": 7,
      "_phoneme": "#"},
    "go": {
      "_priority": 8,
      "_phoneme": "@"}
  },
  "special":{
    "_priority": 9,

    "silent": {
      "_priority": 10,
      "_phoneme": "!"},
    "deaf": {
      "_priority": 11,
      "_phoneme": "/"},
    "stubborn": {
      "_priority": 12,
      "_phoneme": "'"},
    "idiot": {
      "_priority": 13,
      "_phoneme": "\""}
  },
  "invisible": {
    "_priority": 14,

    "spaces": {
      "_priority": 15,
      "_phoneme": " ",
      "_operations": ["many"]
    }
  }
};
// invisibles --------------------------------------------
_core.machine._phonemes.invisibles = {};
_core.machine._phonemes.invisibles.tabs = "\\t+";
_core.machine._phonemes.invisibles.spaces = " +";// NO \s BECAUSE it has \r !!
_core.machine._phonemes.invisibles.linebreak = {};
_core.machine._phonemes.invisibles.linebreak.both = "\\r\\n";
_core.machine._phonemes.invisibles.linebreak.carriage = "\\r";
_core.machine._phonemes.invisibles.linebreak.newline = "\\n";
_core.machine._phonemes.invisibles.linebreak._regex =
  "(both)|(carriage)|(newline)";
_core.machine._phonemes.invisibles._regex =
  "(tabs)|(spaces)|(linebreak)";
// excluded from label ----------------------------------
_core.machine._phonemes.text = {}
_core.machine._phonemes.text._nonlabelchars =
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

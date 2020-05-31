


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


const Parser = function () {
  this.regexString ="";
  this.groupNames = {};
  this.groupNumber = 0;

  this.addMorpheme = function (element) {
    if ( this.regexString !== "" ) {
      this.regexString += "|";
    }
    this.regexString+= "("+element.syntax+")";

    var tags = element.tags;
    this.groupNumber += 1;
    this.groupNames[this.groupNumber] = tags;
    return this;
  };

  this.parse =  function (script, max = -1) {
    var parsingRex = new RegExp(this.regexString,"g"),
      morphemeDOM = [],
      array = parsingRex.exec(script);

    while ( array !== null &&
      morphemeDOM.length !== max )
    {
      var morphemeElement = {};
      morphemeElement.value = array[0];
      morphemeElement.tags = "";
      morphemeElement.groups = [];

      for ( var i = 1; i<array.length; i++ ) {
        if ( array[i] == array[0] ) {
          morphemeElement.groups.push(i);
          morphemeElement.tags += "."+this.groupNames[i];
          //break;
        }// I am sure there is a FASTER way of doing it
      }// but for now it works good and CLEAN
      morphemeDOM.push( morphemeElement );

      array = parsingRex.exec(script);
    };

    return morphemeDOM;
  };

  return this;
};

var _core = {};

_core.parser = new Parser()

.addMorpheme({
  tags:"text mail",
  syntax:"(?:[^ \\t\\r\\n@:]+)" +
  "@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|" +
  "(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))"
})
.addMorpheme({
  tags:"text url",
  syntax:"(?:https?|ftp)://[^\\s/$.?#].[^\\s]*"
})

.addMorpheme({
  tags:"operator open listen",
  syntax:":"
})
.addMorpheme({
  tags:"operator close do",
  syntax:";"
})
.addMorpheme({
  tags:"operator close next",
  syntax:">"
})
.addMorpheme({
  tags:"operator find",
  syntax:"\\."
})
.addMorpheme({
  tags:"operator decorator kill",
  syntax:"\\\\"
})
.addMorpheme({
  tags:"operator marker take",
  syntax:"#"
})
.addMorpheme({
  tags:"operator marker go",
  syntax:"@"
})
.addMorpheme({
  tags:"operator decorator silent",
  syntax:"!"
})
.addMorpheme({
  tags:"operator decorator deaf",
  syntax:"/"
})
.addMorpheme({
  tags:"operator decorator stubborn",
  syntax:"'"
})
.addMorpheme({
  tags:"operator decorator idiot",
  syntax:"\""
})

.addMorpheme({
  tags:"invisible space",
  syntax:" "
})
.addMorpheme({
  tags:"invisible tab",
  syntax:"\\t"
})
.addMorpheme({
  tags:"invisible linebreak both",
  syntax:"\\r\\n"
})
.addMorpheme({
  tags:"invisible linebreak carriage",
  syntax:"\\r"
})
.addMorpheme({
  tags:"invisible linebreak newline",
  syntax:"\\n"
})
.addMorpheme({
  tags:"text special",
  syntax:"[,\\\\<=\\+\\*%°ç^`\\-&|\\(\\[\\{~}\\]\\)§!?$£¤€]",
})
.addMorpheme({
  tags:"text label",
  syntax:
    "[^"+
    ",\\\\<=\\+\\*%°ç^`\\-&|\\(\\[\\{~}\\]\\)§!?$£¤€"+//specials
    ":;>\.\\\\#@'\"!/"+//operators
    " \\r\\n\\t"+//invisibles
    "]+"
})
.addMorpheme({
  tags:"text leftovers",
  syntax:".+"// all characters that remain
});

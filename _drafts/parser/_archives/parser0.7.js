


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


var linguistics = {
  Glossary: function () {
    this.elements = [];

    this.add = function ( settings ) {
      if (settings instanceof linguistics.Element) {
        
      }

      return this;
    }

    return this;
  },
  Element: function (settings) {
    for (var key in Object.keys(settings)) {
      this[key] = settings[key];
    }
    this.

    return this;
  }
}



glossary = new linguistics.Glossary()
.add({
  type:"charset",
  tags:"operator open listen",
  syntax:":",
})
.add({
  type:"charset",
  tags:"operator close do",
  syntax:";"
})
.add({
  type:"charset",
  tags:"invisible space",
  syntax:" ",
  morpheme:false
})
.add({
  type:"charset",
  tags:"text special",
  syntax:",\\\\<=+*%°ç^`\\-&|([{~}\\]\\)§!?$£¤€",
  morpheme:false
});

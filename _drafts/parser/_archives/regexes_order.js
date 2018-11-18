

var rexSplit = new RegExp("(:[a-z]+)|(([ ]+)|([a-z]*))","g");

var regPositive = new RegExp("((?!:[a-z]+)([ ]+|(?<= )[a-z]*(?= )))","g");

// ((?!:[a-z]+)([ ]+|(?<= )[a-z]*(?= )))  with positive lookbehind 2018
// ((?!:[a-z]+)([ ]+|[a-z]*)) without



var invisibleS = " \\t\\n\\r";
var nonWordS = invisibleS+":;,()/\\\\><";

var bonjour = "bonjour   hello :buongiorno :h1>"

var fli =
`
:h1> this is a h1 title

:hLine;
above this should be a line

you need to go to @https://thisPage;
or to search for some #hashtags;

:/
this will not appear in html,
but this page has an author :
#author:: guillaume3 #;
/:

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

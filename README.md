# fluidite
a markup language to fit the dedale app

## principles
*fluitité should be a markdown language
not as simple as markdown
but more permissive :
you sould be able to write almost
anything you want and render as such
for example an ASCI bar**\
```___________________________________
```

- all words and spaces are kept, outside of interpreted functions
- to call function F you call **:F argument F;**
- to call function F without argument **:F;**
- functions return html (or any chosen rendering langage)
- exceptions :
  - **#name;** or **#name with spaces #;**
  creates a link to function ```_fluidite.Hashtag(name);```
  - ```@ref;``` or ```@ref (options) @;```
  creates a link to function ```_fluidite.At(ref, options);```
  - **#name :: definition #;**
  stores "definition" into the variable "name"
  that can be called later with ":name;"

## example
```
:h1 this is a h1 title with class ._fluidite h1;

:vLine;

you need to go to @thisPage;
or to search for some #hashtags;

:html
  <p>this section is rendered as is<br/>
  spaces and
  backspaces
  are ignored here</p>
html;



```

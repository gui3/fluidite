# fluidite
a markup language to fit the dedale app

<span style="color:red; font-size: 1.5em;">
  This module is still in development,
  not working for now, it is useless to clone it
  (unless you are interested in developing it)
</span>

## principle
*fluitité should be a markup language
not as simple as markdown,
but more permissive :
you sould be able to write almost
anything you want and render as such,
for example an ASCI bar.\
#hashtags and @citations
are meant to be part of the language itself*


## example
```
:>h1 this is a h1 title with class ._fluidite

:hLine;
above this should be a line

you need to go to @https://thisPage;
or to search for some #hashtags;

:/this will not appear in html,
but this page has an author :
#author:: guillaume3 #; /:

:X this is a true comment,
 i can write anything X;

some text :>X same here, but it's an endline comment

:html
  <p>this section is rendered as is<br/>
  spaces and
  backspaces
  are ignored here</p>
html;

```

## general rules
*let's write OK by the time a rule works*

- all words and spaces are kept, outside of interpreted functions
- to call variable or function F you call **:F argument F;**
- to call variable or function F without argument **:F;**
- functions return html (or any chosen rendering langage)

## specific rules
*same with OK*

- **#name;** or **#: name with spaces #;**
creates a link to function ```_fluidite.Hashtag(name);```

- ```@ref;``` or ```@ref: options @;```
creates a link to function ```_fluidite.At(ref, options);```

- **#name :: definition #;**
stores "definition" into the variable "name"
that can be called later with ":name;"

- by default, invisibles (spaces, tab, backspaces)
that are at the beginning and the end of an argument
are not taken :
```
:text
  <-text start here
    these spaces and
      backspaces are taken
 but not those who follow
      the arrow ->

text;
```
- to begin or end an argument with invisibles
one must use :' ';\
this function is one of the few
that don't need an invisible after
(to be a separated word)
```
:text
:'    <- these spaces
    are part of the argument
  and so do these backspaces ->

';
text;
```
- calls like :hello; are still interpreted inside :";,
to make a text full text, use  :" ";\
This function is the second not to need a separated word
```
:text
  :':hello; will call the object "hello"';
  :":hello; will here just be written as ":hello;"
  you can also call anything here with no danger
  like #; @; or #hello;";
```
- to hide something from the renderer,
but still have the content interpreted,
one should use :/ /;
```
this text appear
:/ this text is hidden but :hello; is called /;
```
- to comment, with no renderer AND no interpretation,
one should use :X X;
```
this is text :X this is comment X;
```
- one that would be very nice,
:>F would take the end of line and send it to F
```
:>h1 this is a title
this is text :>X this is an endline comment
```

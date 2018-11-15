# <a name="top"></a>fluidite
a markup language to fit the dedale app

**This module is still in development,
not working for now, it is useless to clone it**\
(unless you are interested in developing it)

## contents
- [principle](#principle)
- [why fluidite ?](#why)
- [example](#example)
- [general rules](#generalRules)
  - [render all](#renderAll)
  - [machine call](#machineCall)
  - [render unknown](#renderUnknown)
  - [separate words](#separateWords)
  - [close priority](#closePriority)
- [specific rules](#specificRules)
  - [hashtags #](#hashtags)
  - [at links @](#ats)
  - [properties](#properties)
  - [invisibles](#invisibles)
  - [citations :'](#citations)
  - [full text citations :"](#fullText)
  - [soft comments :/](#softComs)
  - [hard comments :x](#hardComs)
  - [endline functions :>](#endLines)
- [what's next (to-do list)](#next)

## <a name="principle"></a>principle
*fluidité should be a markup language
not as simple as markdown,
but more permissive :
you sould be able to write almost
anything you want and render as such,
for example an ASCI bar.\
#hashtags and @citations
are meant to be part of the language itself*

[=> top](#top)



## <a name="why"></a>Why fluidite ?
This is part of a big project I have,
some kind of mix between a blog and a wiki :
[dedale](https://github.com/Gui38/dedale)

I could do with markdown, like anybody,
but the core functionality of this project
is the **wiki part of it**,
and there is no hashtag (internal links) in markdown
as far as I know.
I needed something fast, just like **regular hashtags**,
not to provide full links.

Another reason, though markdown is a wonderfull language,
I use to put spaces, backspaces and ASCI bars to decorate my texts,
and that is a **pain** in markdown, especially backspaces
(as you will probably see here)

So I decided to **create my own markup language**
(French people and **pretention** you know)
to fit my requirements. And I liked it, very beaucoup.\
Now comes the hard part, *coding it*...

...Ah and the **name** ?? I settled long ago for **fluidity**,
that is a wonderful word,
speaking of a language that waves between human and machine texts...\
But you guess, fluidity was taken. In npm, in github, in the dictionnary,
everywhere ... but finding a new name is a pain, so I'll settle there
for the french translation **fluidité**, with no accent of course.

____________

## <a name="example"></a>example
```
:h1> this is a h1 title with class ._fluidite

:hLine;
above this should be a line

you need to go to @web:https://thisPage;
or to search for some #hashtags;

:/this will not appear in html,
but this page has an author :
#author:: guillaume3 #; /;

:x this is a true comment,
 i can write anything x;

some text :x> same here, but it's an endline comment

:htmlSection
  <p>this section is rendered as is<br/>
  spaces and
  backspaces
  are ignored here</p>
htmlSection;

```

[=> top](#top)


## <a name="generalRules"></a>general rules
*let's write OK by the time a rule works*

### <a name="renderAll"></a>"render all" rule
all words, characters and spaces are rendered as is,
outside of machine calls.

### <a name="machineCall"></a>"machine call" rule
words that need interpretation,
to be translated in something else than the word itself,
need to be called with :word and closed with word;
- to call variable or function F you call **:F argument F;**
- to call variable or function F without argument **:F;**

functions return html (or any chosen rendering langage)

**notable exceptions**\
#hastags and @at words,
see specific rules.


### <a name="renderUnknown"></a>"render unknown" rule
when a word matches a machine call,
if the machine can't interpret it, it renders it as is.

for example, if I write some closing tag '; but the tag wasn't open,
it wil be rendered '; and nothing special will happen (maybe a log)

another example, if I call the word :hello
but hello is not a key of the current context (a declared variable)
it will also be ignored and rendered as is (:hello)


### <a name="separateWords"></a>"separate words" rule
to be interpreted, words must be separated
with at least one invisible (space, backspace, tab)
or one non-word character ( : ; / ( ) , ...)

**notable exceptions**\
:' :" :/ and :x at least can be joined to another word,
see specific rules.


### <a name="closePriority"></a>"close priority" rule
when a machine call is closed with call; or any closing tag,
all tags open since the call of this function are closed too,
there is no tresspassing between arguments.\
ex :
```
:h1 this title wil be :em italic till the end h1;
this text is not italic anymore
```


[=> top](#top)

## <a name="specificRules"></a>specific rules
*same with OK*

### <a name="hashtags"></a># hashtags
```
#name;
```
or ```#: name with spaces #;```\
creates either
- a link to adress **(current page)/hashtag?name%20with%20spaces**
- a link to function ```_fluidite.hashtag("name with spaces");```

depending of fluidite core properties defined by ...you

### <a name="ats"></a>@ at links
```
@ref;
```
or ```@ref: options @;```\
creates either
- a link to adress **https://ref?options**
- a link to function ```_fluidite.at(ref, options);```

depending of fluidite core properties defined by ...you again

### <a name="properties"></a>properties
**#name :: definition #;**
stores "definition" into the variable "name"\
that can be called later with ":name;"

### <a name="invisibles"></a>invisibles
All invisibles (spaces, tab, backspaces) are rendered,
for instance backspaces are translated as ```<br/>``` in html,
and a sequel of 4 spaces like this ```&nbsp; &nbsp; ```\
- *One out of two spaces must be a basic space
otherwise word wrapping does not work*
- *the first space must be a nbsp otherwise it will be ignored

by default, invisibles that are
at the beginning and the end of an argument
are not rendered :
```
:text
  <-text start here
    these spaces and
      backspaces are taken
 but not those who follow
      the arrow ->

text;
```

[=> top](#top)

### <a name="citations"></a>:' citations ';
to begin or end an argument with invisibles
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

### <a name="fullText"></a>:" full text citations ":
calls like :hello; are still translated inside :' ';,
to make a text full text, use  :" ";\
This function is the second not to need a separated word
```
:text
  :':hello; will call the object "hello"';
  :":hello; will here just be written as ":hello;"
  you can also call anything here with no danger
  like #; @; or #hello;";
```

### <a name="softComs"></a>:/ soft comments /;
to **hide** something from the renderer,
but still have the content **interpreted**,
one should use :/ /;
```
this text appear
:/ this text is hidden but :hello; is called /;
```

### <a name="hardComs"></a>:x hard comments x;
to comment, with **no render AND no interpretation**,
one should use :x x;
```
this is text :x this is comment x;
```

### <a name="endLines"></a>:f> endline functions
one that would be very nice,
:F> would take the end of line and send it to F
```
:h2> this is a title
this is text :x> this is an endline comment
```

[=> top](#top)

________

## <a name="next"></a>What's next (to-do list)
there's all to do at the moment,
come back later for a real to-do list.

### the backspace problem
if one wants to write code in little lines
but not have the backspace (join two lines)
he could use
```
this is line ONE :x
x;this is still line ONE
```
but this syntax is quite unfriendly,
we could find some ending tag to signify
"we don't want the backspace", like
```
this is line ONE :-
this is also line ONE
```
in this case, this operator (:- for now)
would be a non-separated word too.
The problem is what to do with a :-
that would not be at the end of the line ?
Shall we comment all the remaining ? this creates doublon
with :x>, and we can't give backspace removal to an endline comment,
that would be a pain :
```
lorem ipsum :x> this is endline comment
this text would come after Lorem ipsum
that we don't want
```
this is no urgent issue, but I think I'll settle for :-
and use it only at the end of lines, otherwise "render unknown" rule.

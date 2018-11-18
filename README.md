# <a name="top"></a>fluidite
a markup language to fit the dedale app

**This module is still IN DEVELOPMENT,
not working for now, it is USELESS to CLONE or INSTALL it**\
(unless you are interested in developing it)

want to [get a glimpse](#example) ?
want to [participate](#makingOf) ?

## contents
- [PRESENTATION](#presentation)
  - [principle](#principle)
  - [why fluidite ?](#why)
  - [example](#example)
- [SYNTAX](#syntax)
  - [general rules](#generalRules)
    - [render all](#renderAll)
    - [machine call](#machineCall)
    - [render unknown](#renderUnknown)
    - [separate words](#separateWords)
    - [close priority](#closePriority)
  - [specific rules](#specificRules)
    - [hashtags #](#hashtags)
    - [references @](#ats)
    - [properties](#properties)
    - [invisibles](#invisibles)
    - [soft quotes :'](#softQuotes)
    - [hard quotes :"](#hardQuotes)
    - [soft comments :!](#softComs)
    - [hard comments :/](#hardComs)
    - [endline functions :>](#endLines)
    - [kill line command :\ (?)](#killLine)
- [MAKING OF](#makingOf)
  - [pull rules](#pull)
  - [what's done](#done)
  - [what's next (to-do list)](#next)

# <a name="presentation"></a>Presentation

## <a name="principle"></a>principle
*fluidité should be a markup language
not as simple as markdown,
but more permissive :
you sould be able to write almost
anything you want and render as such,
for example an ASCI bar. #hashtags and @references
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
I use to put spaces, linebreaks and ASCI bars to decorate my texts,
and that is a **pain** in markdown, especially linebreaks
(as you will probably see here)

...the **name** ?? I settled long ago for **fluidity**,
but you guess, fluidity was taken. In npm, in github,
everywhere ... finding a new name is a pain, so I'll settle there
for the french translation **fluidité**, with no accent.

Ok now let's code this as good as we can.

[=> top](#top)

____________

## <a name="example"></a>example
```
:h1> this is a h1 title

:hLine;
          above this should be a line

you need to go to @https://thisPage
or to search for some #hashtags

for mails, do you prefer
:mail guillaume.3.7.13@gmail.fr mail;
or :@ guillaume.3.7.13@gmail.fr @;
or @guillaume.3.7.13@gmail.fr ?
        (I like each)

:!
this will not appear in html,
but this page has an author :
#author:: guillaume3 :;
!;

:/ this is a true comment,
 i can write anything /;

this is here :/> same here, but it's an #endline; comment
this is on the next line

this and :\ this is an endline comment too
that are on the same line

:translate.html
  <p>this section is rendered as is<br/>
  spaces and
  backspaces
  are ignored here</p>
translate.html;

:h2 unknown sequences h2; (suggest more)
 :  ;    ;:
```

[=> top](#top)


# <a name="syntax"></a>Syntax

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

**notable exceptions**

hashtags (#) and references (@) words
see specific rules.

[=> top](#top)

### <a name="renderUnknown"></a>"render unknown" rule
when a word matches a machine call,
if the machine can't interpret it, it renders it as is.

for example, if I write some closing tag '; but the tag wasn't open,
it wil be rendered '; and nothing special will happen (maybe a log)

another example, if I call the word :hello
but hello is not a key of the current context (a declared variable)
it will also be ignored and rendered as is (:hello)


### <a name="separateWords"></a>"separate words" rule
*(this rule is not sure, we'll see by the coding)*

to be interpreted, words must be separated
with at least one invisible (space, linebreak, tab)
or one non-word character ( : ; / ( ) , ...)

**notable exceptions**\
:' :" :@ :# at least can be joined to another word,
see specific rules.


### <a name="closePriority"></a>"close priority" rule
when a machine call is closed with call; or any closing tag,
all tags open since the call of this function are closed too,
there is no tresspassing between arguments.\
ex :
```
:h1 this title will be :em italic till the end h1;
this text is not italic anymore
```


[=> top](#top)

## <a name="specificRules"></a>specific rules
*same with OK*

### <a name="hashtags"></a># hashtags
```
#name or :# name with spaces #;
```

**points at a search, or any unprecise item.**

in my mind, it creates either
- a link to adress **(current page)/hashtag?name%20with%20spaces**
- a link to function ```_fluidite.hashtag("name with spaces");```

depending of fluidite core properties defined by ...you

### <a name="ats"></a>@ references
```
@ref or :@ ref @; or :@ ref :: options @;
```
*syntax to be reviewed*

**points at any precise point**

this one is not settled yet, could redirect
- either to the website itself (go to a precise page, an anchor)
- or to the whole web with an url,

and in my dreams, it could even take
other precise and identifiable actions like
- send a mail
- get an image
- import a youtube/dailymotion video
- load a script like css

for now, in my mind it creates either
- a link to adress **https://ref**
- a link to adress **(currentpage)/at/ref**
- a link to function ```_fluidite.at(ref, options);```

depending of ... options ?
Or depending on fluidite core properties defined by ...you again,
i'm not settled on this for now

### <a name="properties"></a>properties
```
#name :: definition #; or :# name :: definition :;
```
stores "definition" into the variable "name"\
that can be called later with ":name;"

some keywords (hashtags) and properties are seeked
in the argument of functions,
and act like options.

You can hide them from the renderer
by prefixing with !
```
:function
  !#option1
  !#option2 ::value :;
<- argument start at the arrow (included)
some #options can be rendered in
or !#hidden in the argument
but the last renders "  " 2 spaces...
argument finishes here ->
  !#option3
:function
```
(see hard coms and the :text function)



### <a name="invisibles"></a>invisibles
All invisibles (spaces, tab, linebreaks) are rendered,
for instance linebreaks are translated as ```<br/>``` in html,
and a sequel of 4 spaces like this ```&nbsp; &nbsp; ```\
- *One out of two spaces must be a basic space
otherwise word wrapping does not work*
- *the first space must be a nbsp otherwise it will be ignored*

by default, invisibles that are
at the beginning and the end of an argument
are not rendered :
```
:text
  <-text start here
    these spaces and
      linebreaks are taken
 but not those who follow
      the arrow ->

text;
```

[=> top](#top)

### <a name="softQuotes"></a>:' soft quotes ';
to begin or end an argument with invisibles
one must use :' ';\
this function is one of the few
that don't need an invisible after
(to be a separated word)
```
:text
:'    <- these spaces
    are part of the argument
  and so do these linebreaks ->

';
text;
```

### <a name="hardQuotes"></a>:" hard quotes ":
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

tip : there is no espcaped characters for now,
to write "; in a hard quote, one could
close the hard quote twice then open it again
";";:"

since this sintax is unfriendly,
a :text function could be defined
with an hidden property that could be
defined on the fly as the end key like
```
:text
  !#endKey :: xxx; :;
there is truly liberty
"; :; #;
until the end
xxx;
```

[=> top](#top)

### <a name="softComs"></a>:! soft comments !;
to **hide** something from the renderer,
but still have the content **interpreted**,
one should use :! !;
```
this text appear
:! this text is hidden but :hello; is called !;
```

### <a name="hardComs"></a>:/ hard comments /;
to comment, with **no render AND no interpretation**,
one should use :/ /;
```
this is text :/ this is comment /; text again
```

[=> top](#top)

### <a name="endLines"></a>:f> endline functions
one that would be very nice,
:F> would take the end of line and send it to F
```
:h2> this is a title
this is text :/> this is an endline hard comment
```

### <a name="killLine"></a>:\ kill line command ???
struggling with the idea of joined lines, with no linebreak,
came out the idea of the kill line command :\ .

anything after, including the linebreak, would be hard commented.
This provides also a quicker comment syntax than :x>,
if you don't need linebreaks.

```
this is line ONE :\
this is also line ONE :\ this is "killed"
this is still line ONE
```

[=> top](#top)

________


# <a name="makingOf"></a>Making Of

## <a name="pull"></a>Pull rules
Ok the project is ambitious,
but if you want to participate, you are **most welcome**

here are the few rules to keep it coherent

- priorities in writing
Let's keep some guideline across the code

  - readable first

  today computers are powerfull,
  let's write something easy to read,
  with spaces, linebreaks
  and lots of comments, even if it costs,
  those who need can minify

  - flexible first ex-aequo

  let's store as many core parameters,
  and assemble them in logic order,
  so they can be adapted later.
  (ex the regex creator instead of a regex string)

  - fast third

  if we can make the code fast,
  it's after the readability,
  but it's cool too

  - light last

  computers are POWERFUL today,
  I prefer big objects with clear property names,
  parsing a few strings should'nt kill your memory.


## <a name="done"></a>What's done
or what's in progress, since nothing is done yet

### Parser (in progress)
the aim is to parse the script and create
a *fDOM*, those structure is still not fixed.

- 1st step - cutting in good pieces

*seems in good way (in drafts)*

parses the string to create a humanDOM.
The big regex creator is ready,
the parsing function is ready,
the structure of the result is yet :

```js
{
  0: {value: "↵", group: 9, type: "lineBreak"}
  1: {value: ":h1>", group: 1, type: "loneTag"}
  2: {value: " ", group: 8, type: "spacing"}
  3: {value: "this", group: 11, type: "word"}
  4: {value: " ", group: 8, type: "spacing"}
}
```

text is cut in semantic groups. There are 13 regex groups
of which 8 are matches :

```js
humanW.rexGroups = {
  1: "loneTag",
  2: "X", // (loneTag label's last char)",
  3: "openTag",
  4: "X", // (openTag label's last char)",
  5: "closeTag",
  6: "X", // (closeTag label's last char)",
  7: "setTag",
  8: "spacing",
  9: "lineBreak",
  10: "X", // (lineBreak again)",
  11: "word", // (non interpreted words)",
  12: "X", // (word's last char)"
  13: "unknown"
}
```

here is the big regex if you want to try it
( remove the linebreaks of course )

```
([:#@]([^ \t\r\n:#@>;-])*[>;-])|([:#@]([^ \t\r\n:#@>;-])+)|
(([^ \t\r\n:#@>;-])+[>;-])|(::)|([ \t]+)|
((\r|\n|\r\n))|(([^ \t\r\n:#@>;-])+)|(.+)
```

**THIS WILL CHANGE** - I forgot the :# multi hashtags #;
and the @references :: with options @;
and the #property :: setter :;
(whose syntaxes have changed anyway)

### next step

the cutting needs now to be cut again,
to separate function names for example,
but ALSO merging.

for example
for email adresses blabla@caramail.fr
that gives "blabla" word "@caramail.fr" openTag
or http links https://hello.fr/
that gives "https" word "://hello.fr/" openTag

the idea is to read the humanDOM (sh- name I know)
and to make the fDOM which would cut the text
in sections, with
- one or 0 openTag
- the argument of it
- the children (sections inside the argument)
- one or 0 closingTag

something like that I guess


## <a name="next"></a>What's next (to-do list)
there's all to do at the moment,
come back later for a real to-do list.

[=> top](#top)

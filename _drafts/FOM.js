

var fom_Element = {
  children: [
    fom.element,
    fom.element
  ],
  type: "function",
  value: "h1",
  id: 0
}


var FOM = {
  type: "definition",
  value: undefined,
  children: {
    fom.element{
      type: "function",
      value: "h1",
      children: [
        fom.element{
          type: "text",
          value: "there is the title"
        }
      ]
    },
    fom.element{

    }
  }

}


var script =
`
:h1>there is the title

   there   some    text
      with  spaces
  &
    backspaces :/>some soft comment

and #someHashtag; in the text

and a @https://link/to/somewhere;

and :h2 a :em title em; h2; inside a text

a line with :-
no backspace:-
and another


`

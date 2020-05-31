
var semantics = {

  Glossary: function ( options=undefined ) {
    this.elements = [];

    this.add = function ( options ) {
      var options,
        element;
      if ( options instanceof semantics.Element ){
        element = options;
      }
      else {
        element = new semantics.Element( options );
      }
      //element.parent = this;
      this.elements.push(element);
      return this;
    };

    this.find = function (tags) {
      var tagdic = {};
      if ( tags instanceof Array ) {
        for (var i=0; i<tags.length; i++) {
          var taglist = tags[i].split(/[\s\.,;]+/);
          for (var i=0; i<taglist.length; i++) {
            tagdic[taglist[i]]=true;
          }
        }
      }
      else if ( typeof tags == "string" ) {
        var taglist = tags.split(/[\s\.,;]+/);
        for (var i=0; i<taglist.length; i++) {
          tagdic[taglist[i]]=true;
        }
      }
      else {
        throw new Error("semantics >> no valid tags for find")
      }

      var foundElements = new semantics.Glossary();
      for ( var i=0; i<this.elements.length; i++ ) {
        var element = this.elements[i];
        var kept = true;
        for ( var tag in tagdic ) {
          var found = false; // no indexOf
          for ( var i2=0; i2<element.tags.length; i2++ ) {
            if (tag == element.tags[i2]) {
              found = true;
              break;
            }
          }
          if ( found !== true ) {
            kept = false;
            break;
          }
        }
        if ( kept == true ) {
          foundElements.add(element);
        }
      }
      return foundElements;
    };

    this.fullCharset = function () {
      var fullSyntax = "";
      for (var i=0; i<this.elements.length; i++) {
        var element = this.elements[i];
        if ( element.type == "Charset" ) {
          fullSyntax += element.syntax;
        }
      }
      return new semantics.Charset({
        syntax: fullSyntax
      });
    };

    this.morphemeParser = function() {
      var parser = new semantics.Parser();
      for (var i=0; i< this.elements.length; i++) {
        var element = this.elements[i];
        if ( element.morpheme == true ) {
          parser.addMorpheme(element);
        }
      }
      return parser;
    };

    if ( options ) {
      this.add( options );
    }

    return this;
  },

  Parser: function () {
    this.regexString ="";
    this.groupNames = {};
    this.groupNumber = 0;

    this.addMorpheme = function (element) {
      if ( this.regexString !== "" ) {
        this.regexString += "|";
      }
      this.regexString+= "("+element.syntax+")";
      var tags = "";
      for (var i=0; i<element.tags.length; i++) {
        var tag = element.tags[i];
        tags += "."+tag;
      }
      this.groupNumber += 1;
      this.groupNames[this.groupNumber] = tags;
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
  },

  Element: function ( options ) {

    this.tags = [];
    if ( options.tags ) {
      if ( options.tags instanceof Array ) {
        for (var i=0; i<options.tags.length; i++) {
          var tags = options.tags[i].split(/[\s\.,;]+/);
          for (var i=0; i<tags.length; i++) {
            this.tags.push(tags[i]);
          }
        }
      }
      else if ( typeof options.tags == "string" ) {
        var tags = options.tags.split(/[\s\.,;]+/);
        for (var i=0; i<tags.length; i++) {
          this.tags.push(tags[i]);
        }
      }
    }
    if ( typeof options.syntax == "string" ) {
      this.syntax = options.syntax;
    } else {
      throw new Error("semantics >> missing syntax");
    }

    this.morpheme = false;
    if ( options.morpheme == true ) {
      this.morpheme = true;
    }

    options._elemented = true;
    if ( options.type ) {
      try {
        semantics[options.type].call(this, options)
      } catch (e) {
        throw new Error( "semantics >> no valid element type : "+options.type )
      }
    }

    return this;
  },

  Charset: function (options) {
    if ( options._elemented !== true ) {
      semantics.Element.call(this, options);
    }

    this.type = "Charset";

    this.add = function ( added ) {
      fullSyntax = this.syntax;
      if ( added instanceof semantics.Charset ) {
        fullSyntax += added.syntax;
      }
      else if ( typeof added == "string" ) {
        fullSyntax += added;
      }
      else {
        throw new Error("semantics >> no valid argument")
      }
      return new semantics.Charset({
        syntax: fullSyntax
      })
    };

    this.one = function() {
      return new semantics.Element({
        //type:"Sequence",
        syntax:"["+this.syntax+"]"
      })
    }
    this.not = function() {
      return new semantics.Element({
        //type:"Sequence",
        syntax:"[^"+this.syntax+"]"
      })
    }
    return this;
  }

};


glossary = new semantics.Glossary()
.add({
  type:"Charset",
  tags:"text operator open listen",
  syntax:":",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator close do",
  syntax:";",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator find",
  syntax:"\\.",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator close next",
  syntax:">",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator decorator kill",
  syntax:"\\\\",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator wordMarker label get",
  syntax:"#",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator wordMarker label go",
  syntax:"@",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator decorator silent",
  syntax:"!",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator decorator deaf",
  syntax:"/",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator decorator stubborn",
  syntax:"'",
  morpheme: true
})
.add({
  type:"Charset",
  tags:"text operator decorator idiot",
  syntax:"\"",
  morpheme: true
})

.add({
  //type:"Sequence",
  tags:"invisible linebreak both",
  syntax:"\\r\\n",
  morpheme:true
})
.add({
  type:"Charset",
  tags:"invisible linebreak carriage",
  syntax:"\\r",
  morpheme:true
})
.add({
  type:"Charset",
  tags:"invisible linebreak newline",
  syntax:"\\n",
  morpheme:true
})
.add({
  type:"Charset",
  tags:"invisible space",
  syntax:" ",
  morpheme:true
})
.add({
  type:"Charset",
  tags:"invisible tab",
  syntax:"\\t",
  morpheme:true
})
.add({
  type:"Charset",
  tags:"text special",
  syntax:",\\\\<=\\+\\*%°ç^`\\-&|\\(\\[\\{~}\\]\\)§!?$£¤€",
  morpheme:false
});

glossary.add({
  tags:"text label",
  syntax:
    glossary.find("operator").fullCharset()
    .add(
      glossary.find("invisible").fullCharset())
    .add(
      glossary.find("text special").fullCharset())
    .not().syntax + "+",
  morpheme:true
})
.add({
  tags:"text special",
  syntax: glossary.find("text special").fullCharset().one().syntax,
  morpheme: true
})
.add({
  tags:"unknown",
  syntax:".",
  morpheme: true
})

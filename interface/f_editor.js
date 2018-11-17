/*
_____________________________________________________________________
 module name : f_editor
 version : 0.1.0
_____________________________________________________________________
js Template flexibles-modules
https://github.com/Gui38/flexible-modules-js
v 0.4.3
*/

(function () {
  var _exported = {};

  // start of MODULE ________________________________________________


  _exported.editor = function (
    doc=undefined,
    parentElement=undefined,
    id="f_editor" ) {

    // draw --------------------------------------------------
    this.draw = function ( doc, parentElement=undefined, id="f_editor" ) {

      if ( parentElement instanceof HTMLElement == false ) {
        parentElement = doc.getElementsByTagName("body")[0];
        _exported._u.message("f_editor >> editor will be drawn in body")
      }

      var editor = doc.createElement("div");
      editor.id = id;
      editor.classList.add("f_editor");
      editor.classList.add("f_backColor");

      var toolBar = doc.createElement("div");
      toolBar.classList.add("f_editor");
      toolBar.appendChild(doc.createTextNode("toolBar"));







      editor.appendChild(toolBar);

      parentElement.appendChild(editor);
      _exported._u.message("f_editor >> drawn")

      return this;
    }

    // INITIALIZE --------------------------------------------

    if (doc !== undefined) {
      this.draw( doc, parentElement, id);
    }

  };

  // original CSS -------------------------------------------
  _exported.css = {}
  _exported.css.setOrigin = function (doc, parentElement) {
    var css =
`

.f_frontColor {
  background: #FA7;
  color: #FFF;
}

.f_backColor {
  background: #FFF;
  color: #000;
}

.f_editor button {
  border-radius: 16px;
  border: 0;
  box-shadow: -1px 2px 2px #111;
  margin: 5px;
  height: 33px;
  min-width: 33px;
}
.f_editor button:hover {
  box-shadow: -2px 3px 5px #111;
}
.medButton:active {
  box-shadow: inset -2px 3px 5px #111;
}

.f_Checked {
  background: #AAA;
  color: #000;
  box-shadow: inset -1px 2px 2px #111;
}
.f_Checked:hover {
  box-shadow: inset -2px 3px 5px #111;
}


`;

    var styleTag = doc.createElement("style");
    styleTag.classList.add("f_editor");
    styleTag.appendChild(
      doc.createTextNode(css)
    );
    parentElement.appendChild(styleTag);
  };


  // useful module functions -----------------------------
  _exported._u = {};
  _exported._u.silentLog = true;
  // set writeLog to "true" to have history, even in silent mode
  // should be "false" for a PRODUCTION application !!!
  // otherwise it's a MEMORY WASTE !!!
  _exported._u.LOGS = {};
  _exported._u.log = function (text) {
    _exported._u.LOGS[
      Object.keys(f_editor._u.LOGS).length
    ] = {
        log: text,
        date: new Date(Date.now()).toISOString()
      };
  }
  _exported._u.silent = true;
  _exported._u.message = function (text) {
    if (_exported._u.silentLog == false ) {
      _exported._u.log(text);
    }
    if ( _exported._u.silent == false ) {
      console.log(text);
    }
  };


  // end of MODULE __________________________________________________

  var _scope =
    typeof window !== "undefined" ?
      window :
      typeof global !== "undefined" ?
        global :
        typeof self !== "undefined" ?
          self :
          undefined;

  var _keyScope =
    typeof exports !== "undefined" ?
      exports :
      typeof module !== "undefined" ?
        (typeof module.exports !== "undefined" ?
          module.exports :
          undefined) :
        undefined;

  // require environment ----------------------------------
  if ( _keyScope !== undefined ) {
    for ( key in _exported ) {
      _keyScope[key] = _exported[key];
    }
  }

  // global environment -----------------------------------
  else if ( _scope !== undefined ) {
    _scope.

// ___________________________________________________________________
      f_editor // <= YOUR MODULE NAME HERE
// ___________________________________________________________________

        = _exported;
  }
  else {
    throw new Error(
      "flexible-modules >> could not load module,"+
      " no global & no export variable"
    )
  }
})();

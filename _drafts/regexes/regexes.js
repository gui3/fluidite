

var rgx = {};

rgx.replaceDot = function (str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

new RegExp("regex", "g");

var text = "bonjour hello :buongiorno :h1>"

const RE_DATE = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;

const matchObj = RE_DATE.exec('1999-12-31');
const year = matchObj.groups.year; // 1999
const month = matchObj.groups.month; // 12
const day = matchObj.groups.day; // 31




// we could do a dynamic_regex.js module
// word = nonWordChar.one() + nonWordChar.not().many() + nonWordChar.one()
// I tried but for now it's waste of time

// I won't use named groups for compatibility reasons

var invisibleC = " \\t\\n\\r";
var nonWordC = invisibleC+":;,()/\\\\><";

var rules = {};

rules.word = new RegExp (
  "["+nonWordC+"]?(?<word>[^"+nonWordC+"]+)["+nonWordC+"]?",
  "g");

rules.separated = new RegExp (
  "(([^"+invisibleC+"]+)|(["+invisibleC+"]+))",
  "g");

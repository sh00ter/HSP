// Something to make you come back ^.^
window.onblur = function () {
  document.title = "You no love me no more...";
}

window.onfocus = function () {
  document.title = "Some title here";
}

/**
 * Helper function for classical inheritance
 */
function inherit(proto) {
  function F() {};
  F.prototype = proto;
  return new F;
}

/**
 * File analyzer skeleton class
 * @param {string} file - the file to analyze
 */
var Analyzer = function(file) {
  this.file = file;
  this.init();
}

Analyzer.prototype = {

  init: function() {
    $.when($.get(this.file)).done($.proxy(function(response) {
      this.parse(response);
    }, this));
  },

  parse: function(content) {
    // mockup. to be inherited and overriden
  },

  /**
   * Trim a string from the given character
   */
  trim: function(string, character) {
    if(typeof character == "undefined") {
      character = " ";
    }

    // If the character is space use the built-in javascript trim
    if(character == " ") return string.trim();

    // Trim from the beginning
    var beginningTrim = 0;
    while(string[beginningTrim] == character) {
      beginningTrim++;
    }

    // Trim from the end
    var endTrim = string.length - 1;
    while(string[endTrim] == character) {
      endTrim--;
    }

    return string.substring(beginningTrim, endTrim + 1);
  }

}

/**
 * CssAnalyzer class: helps analyze the selectors from a css file
 */
var CssAnalyzer = function() {
  // The list with the selectors found after analyzing will go here
  this.selectors = [];

  Analyzer.apply(this, arguments);

  /**
   * A simple Selector class to keep data about a selector
   * @param {integer} line
   * @param {string}  selector
   */
  this.Selector = function(line, selector) {
    this.line = typeof line !== "undefined" ? line : NaN;
    this.selector = typeof line !== "undefined" ? selector : "";
  }
};

// Inherits the basic Analyzer class
CssAnalyzer.prototype = inherit(Analyzer.prototype);

/**
 * Parses the content of the file
 * @param  {string} content
 */
CssAnalyzer.prototype.parse = function(content) {
  var lines = content.split('\n');
  var insideRulesSet = false; // this becomes true if the pointer is between a '{' and a '}'
  var insideComment = false; // this becomes true if the pointer is inside a comment

  // Inside this loop we will go over every line character by character and
  // get all the selectors from the file
  for(var i=0; i<lines.length; i++) {
    var line = lines[i]; // the current line
    var selectors = "";  // all the selectors from the current line will be saved inside this string

    // Go character by character
    for(j=0; j<line.length; j++) {
      // Check if a comment just started
      if(line[j] == "/" && typeof line[j+1] != "undefined" && line[j+1] == "*") {
        insideComment = true;
        j += 2; // skip the '/*' characters
      }

      // Check if a comment just ended
      if(line[j] == "*" && typeof line[j+1] != "undefined" && line[j+1] == "/") {
        insideComment = false;
        j += 2; // skip the '*/' characters
      }

      // Check if a rules set just started or ended
      if(line[j] == "{" || line[j] == "}") {
        insideRulesSet = !insideRulesSet;
        j++;
      }

      // If we are inside a comment or inside a rules set, just skip
      if(insideComment || insideRulesSet) continue;

      // Add the current character to the selectors
      if(typeof line[j] != "undefined") selectors += line[j];
    }

    selectors = this.trim(selectors.trim(), ',');
    if(selectors.length) {
      selectors = selectors.split(',');
      for(var j=0; j<selectors.length; j++) {
        var s = new this.Selector(i, this.trim(selectors[j]));
        this.selectors.push(s);
      }
    }
  }
};

var analyzer = new CssAnalyzer('/style.css');

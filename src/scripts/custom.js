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

  // All the possible pseudo-elements, needed to calculate the specificity
  this.pseudoElements = ["after", "before", "first-letter", "first-line", "selection", "backdrop"];

  // There are 4 levels of specificity, but one of them is inline styles and that one does not apply
  // on css files. Therefore, we need to calculate the following 3 levels (in order of magnitude):
  //   1. ID selectors
  //   2. Class, attribute and pseudo-class
  //   3. Element and pseudo-element selector
  // We're going to write an array of regexes for each level
  this.specPatterns = [
    // Level 1: 100 points
    [
      /^#/g          // ID
    ],

    // Level 2: 10 points
    [
      /\./g,         // class
      /\[.+\]/g,     // attribute
      /[^:]:[^:]/g   // pseudo-class
    ],

    // Level 3: 1 point
    [
      /^[a-z]/g,     // element
      /::/g,         // pseudo-element
    ]
  ];

  // Run the main constructor, which will load the file and run the parse method on its content
  Analyzer.apply(this, arguments);
};

// Inherits the basic Analyzer class
CssAnalyzer.prototype = inherit(Analyzer.prototype);


/**
 * A simple Selector class to keep data about a selector
 * @param {integer} line The line on which the selector was found
 * @param {string}  selector The actual selector
 * @param {integer} specificity The specificity of the selector
 */
CssAnalyzer.prototype.Selector = function(line, selector, specificity) {
  this.line = typeof line !== "undefined" ? line : NaN;
  this.selector = typeof line !== "undefined" ? selector : "";
  this.specificity = typeof specificity !== "undefined" ? specificity : NaN;
}

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
        var selector = this.trim(selectors[j]);
        var specificity = this.calculateSpecificity(selector);
        this.selectors.push(new this.Selector(i, selector, specificity));
        console.log(selector + " - " + specificity);
      }
    }
  }

  // By this point this.selectors will contain all the selectors from the css file and the line
  // on which they are written
  // To check it out simply
  // console.log(this.selectors);
};

/**
 * Calculates the specificity of a selector
 * @param  {string} selector The selector on which to calculate the specificity on
 * @return {integer}         The specificity of the given selector
 */
CssAnalyzer.prototype.calculateSpecificity = function(selector) {
  var specificity = 0;

  // First, we make sure that all the pseudo-elements are starting with "::" instead of ":"
  // to be able to differentiate between pseudo-elements and pseudo-classes
  for(var i=0; i<this.pseudoElements.length; i++) {
    selector = selector.replace(new RegExp("([^:]):" + this.pseudoElements[i], "g"), "$1::" + this.pseudoElements[i]);
  }

  // We can now split the selector by " " and calculate the specificity
  var splitted = selector.split(/ |\+/);
  for(var i=0; i<splitted.length; i++) {
    // Go over each level and add its value to the specificity
    for(var level=0; level<this.specPatterns.length; level++) {
      for(var j=0; j<this.specPatterns[level].length; j++) {
        var matches = (splitted[i].match(this.specPatterns[level][j]) || []).length;
        specificity += matches * Math.pow(10, 2 - level);
      }
    }
  }

  return specificity;
};

var analyzer = new CssAnalyzer('/style.css');

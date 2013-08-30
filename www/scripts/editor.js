// this file is for embedding the ace code editor into an html div element

var CPEditor = {};

// Range object, used to get/set selections of text
var Range = ace.require('ace/range').Range;
// Range objects may be instantiated by: var r = new Range(startRow, startColumn, endRow, endColumn);

///////////////////////////////////
//             Model             //
///////////////////////////////////

// the editor object
CPEditor.editor = null;

// the selection object, used for cursor/text manipulation
CPEditor.selection = null;

// the edit session, used for mainuplating the active document (editor contents)
CPEditor.session = null;

///////////////////////////////////
//           Controller          //
///////////////////////////////////

// initialize the editor, setting it up inside the provided div element
CPEditor.init = function (divName) {
  CPEditor.editor = ace.edit(divName);

  // initialize the session and selection variables
  CPEditor.session = CPEditor.editor.getSession();
  CPEditor.selection = CPEditor.editor.selection;

  // set the default theme and langauge mode
  CPEditor.setTheme("ace/theme/endao");
  CPEditor.session.setMode("ace/mode/endao");
}

// get the contents of the editor as a string
CPEditor.getContents = function () {
  if (CPEditor.editor != null) {
    return CPEditor.editor.getValue();
  }
  else return null;
}

// replaces all the text in the editor with contents
CPEditor.setContents = function (contents) {
  if (CPEditor.editor != null) {
    CPEditor.editor.setValue(contents);
    CPEditor.selection.clearSelection();
  }
}

// get the contents of the current selection
CPEditor.getSelectedText = function () {
  if (CPEditor.editor != null) {
		var rng = CPEditor.selection.getRange();
    return CPEditor.session.getTextRange(rng);
  }
  else return null;
}

// get the current line up to the cursor position
CPEditor.getLineText = function () {
  if (CPEditor.editor != null) {
    var cursorPos = CPEditor.selection.getCursor();
		var lineRange = new Range(cursorPos.row, 0, cursorPos.row, cursorPos.column);
		return CPEditor.session.getTextRange(lineRange);
	}
	else return null;
}

// returns the character to the left of the cursor
CPEditor.getCharAtCursor = function () {
  var cursorPos = CPEditor.selection.getCursor();
  // set range for the char
  var row = cursorPos.row;
  var col2 = cursorPos.column;
  var col1 = col2 - 1;

  // get the char to the left of cursor
  if (col1 >= 0) return CPEditor.session.getTextRange(new Range(row, col1, row, col2));
  else return null;
};

// returns an object containing the word at the current cursor position and the range for that word
CPEditor.getWordAtCursor = function () {
  var cursorPos = CPEditor.selection.getCursor();
  // set endpoints
  var row = cursorPos.row;
  var c1 = cursorPos.column;
  var c2 = c1;

  // get the char to the left of cursor
  var lChar = CPEditor.session.getTextRange(new Range(row, c1 - 1, row, c1));
  // while lChar is a word character, expand word range. stop at the beginning of line
  while (/\w/.test(lChar) && c1 > 0) {
    c1--;
    lChar = CPEditor.session.getTextRange(new Range(row, c1 - 1, row, c1));
  }

  // get the length of the line
  var len = CPEditor.session.getLine(row).length;
  // get the char to the right of cursor
  var rChar = CPEditor.session.getTextRange(new Range(row, c2, row, c2 + 1));
  // while rChar is a word character, expand word range. stop at the end of line
  while (/\w/.test(rChar) && c2 < len) {
    c2++;
    rChar = CPEditor.session.getTextRange(new Range(row, c2, row, c2 + 1));
  }

  // set the word range and word text
  var wordRange = new Range(row, c1, row, c2);
  var word = CPEditor.session.getTextRange(wordRange);

  return {
    text: word,
    range: wordRange
  };
}

// returns an object containing the field at the current cursor position and the range for that field
CPEditor.getFieldAtCursor = function () {
  var cursorPos = CPEditor.selection.getCursor();
  // set endpoints
  var row = cursorPos.row;
  var c1 = cursorPos.column;
  var c2 = c1;

  // get the char to the left of cursor
  var lChar = CPEditor.session.getTextRange(new Range(row, c1 - 1, row, c1));
  // while lChar is not a bracket, expand word range. stop at the beginning of line
  while (lChar != "[" && c1 > 0) {
    c1--;
    lChar = CPEditor.session.getTextRange(new Range(row, c1 - 1, row, c1));
  }

  // if a bracket has not been found there is no field
  if (lChar != "[") return null;

  // set the field range and word text
  var rng = new Range(row, c1, row, c2);
  var field = CPEditor.session.getTextRange(rng);

  return {
    text: field,
    range: rng
  };
}

// replaces the word at the cursor with the given text
CPEditor.replaceWordAtCursor = function (replacement) {
  var word = CPEditor.getWordAtCursor();

  // get the starting position of the word to be replaced
  var wordStart = { row: word.range.start.row, column: word.range.start.column };
  var newWordLen = replacement.length;
  // get the ending position of the new word
  var wordEnd = { row: wordStart.row, column: wordStart.column + newWordLen };

  // replace the word
  CPEditor.session.replace(word.range, replacement);

  // move the cursor to the end of the new word
  CPEditor.selection.moveCursorToPosition(wordEnd);
  CPEditor.selection.clearSelection();
}

// replaces the field at the cursor with the given text
CPEditor.replaceFieldAtCursor = function (replacement) {
  var field = CPEditor.getFieldAtCursor();

  // get the starting position of the word to be replaced
  var start = { row: field.range.start.row, column: field.range.start.column };
  var newLen = replacement.length;
  // get the ending position of the new word
  var end = { row: start.row, column: start.column + newLen };

  // replace the word
  CPEditor.session.replace(field.range, replacement);

  // move the cursor to the end of the new word
  CPEditor.selection.moveCursorToPosition(end);
  CPEditor.selection.clearSelection();
}

// adds text at the cursor position
CPEditor.addText = function (text) {
  // get the cursor position
  var cursor = CPEditor.selection.getCursor();
  // insert the text
  CPEditor.session.insert(cursor, text);
}

// sets the theme of the editor
CPEditor.setTheme = function (theme) {
  // the theme should be in the format: ace/theme/themeName
  CPEditor.editor.setTheme(theme);
}
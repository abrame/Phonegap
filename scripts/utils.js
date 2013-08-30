// contains definitions and other utilities used by other components
CPUtils = {};

// flag used to determine if the autocomplete window should be opened
CPUtils.show = false;

// main init function used to load all of the editor components
CPUtils.initialize = function (editorID, editorContents, defaultTheme, themeSelectID, suggestionsDivID, instructionDivID, autocompleteData) {
  // initialize the editor in the div with id = editor
  CPEditor.init(editorID);

  // load the initial contents into the editor
  if (editorContents != null) {
    CPEditor.setContents(editorContents);
  }
    // clear the editor
  else {
    CPEditor.setContents("");
  }

  // set the default theme
  if (defaultTheme == null) {
    CPEditor.setTheme(CPUtils.themes.Endao.path);
  }
  else {
    CPEditor.setTheme(defaultTheme.path);
  }

  // load the theme select box into the select with the given id
  if (themeSelectID != null) {
    var themeSelect = document.getElementById(themeSelectID);
    var node = CPUtils.getThemeSelectBox();

    // hook up the change event handler
    node.onchange = function (event) {
      CPEditor.setTheme($(this).val());
    }
    themeSelect.parentNode.replaceChild(node, themeSelect);
  }

  // initialize autocomplete component
  CPAuto.init(suggestionsDivID, instructionDivID);

  // load data
  CPAuto.loadVariables(autocompleteData);
  CPAuto.loadFields(autocompleteData);
  CPAuto.loadInstructions(autocompleteData);

  // load custom commands
  CPUtils.loadCommands();

  // run an initial parse
  var text = CPEditor.getLineText();
  var tokens = CPTokenizer.tokenize(text);
  CPParser.parseLine(tokens);
  CPAuto.runAutocomplete();
}


// load custom commands and event listeners
CPUtils.loadCommands = function () {

  CPEditor.selection.on("changeCursor", function () {
    // whenever the cursor changes, re parse
    var text = CPEditor.getLineText();
    var tokens = CPTokenizer.tokenize(text);
    CPParser.parseLine(tokens);
    // run the autocomplete
    CPAuto.runAutocomplete();
    // show suggestions if need to
    if (CPUtils.show) {
      CPAuto.showSuggestions();
      CPUtils.show = false;
    }
  });

  CPEditor.editor.on("change", function (e) {
    var evt = e.data;
    // if text is inserted, the change event is fired before the changeCursor event, 
    // so set a flag that will tell the changeCursor event to display suggestions after generating the list with the correct cursor position
    if (evt.action == "insertText") {
      // only popup the list if word character was entered last
      var lastChar = evt.text.charAt(evt.text.length - 1);
      if (/\w/.test(lastChar)) CPUtils.show = true;
    }
      // when text is removed, the cursor is moved first, then the text is deleted.
      // so, the list of suggestions is already prepared. just show it
    else if (evt.action == "removeText") {
      // only show suggestions if the cursor is next to a word character
      var char = CPEditor.getCharAtCursor();
      if (char != null && /\w/.test(char)) CPAuto.showSuggestions();
      else CPAuto.hideSuggestions();
    }
  });

  // use active suggestion
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteTab',
    bindKey: { win: 'Tab', mac: 'Tab' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      else {
        CPEditor.addText("\t");
      }
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteEnter',
    bindKey: { win: 'Enter', mac: 'Enter' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      else {
        CPEditor.addText("\n");
      }
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion, then add a space
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteSpace',
    bindKey: { win: 'Space', mac: 'Space' },
    exec: function () {
      // special case, ignore autocomplete on space inside a field
      if (CPAuto.active && CPAuto.visible && CPParser.tokenStack.length != 2) {
        CPAuto.useSuggestion();
      }
      CPEditor.addText(" ");
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion, then add an lParen
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteLParen',
    bindKey: { win: '(', mac: '(' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      CPEditor.addText("(");
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion, then add an rParen
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteRParen',
    bindKey: { win: ')', mac: ')' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      CPEditor.addText(")");
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion, then add an lSquareBracket
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteLSquareBracket',
    bindKey: { win: '[', mac: '[' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      CPEditor.addText("[");
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion, then add an rSquareBracket
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteRSquareBracket',
    bindKey: { win: ']', mac: ']' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      CPEditor.addText("]");
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion, then add a comma
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteComma',
    bindKey: { win: ',', mac: ',' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      CPEditor.addText(",");
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // use active suggestion, then add an equals
  CPEditor.editor.commands.addCommand({
    name: 'doAutocompleteEquals',
    bindKey: { win: '=', mac: '=' },
    exec: function () {
      if (CPAuto.active && CPAuto.visible) {
        CPAuto.useSuggestion();
      }
      CPEditor.addText("=");
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // open the autocomplete suggestions manually. nothing happens if there are no suggestions
  CPEditor.editor.commands.addCommand({
    name: 'showSuggestions',
    bindKey: { win: 'Ctrl-Space', mac: 'Command-Space' },
    exec: function () {
      CPAuto.showSuggestions();
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // manually close suggestions list
  CPEditor.editor.commands.addCommand({
    name: 'hideSuggestions',
    bindKey: { win: 'Esc', mac: 'Esc' },
    exec: function () {
      CPAuto.hideSuggestions();
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // move to the next suggestion
  CPEditor.editor.commands.addCommand({
    name: 'nextSuggestion',
    bindKey: { win: 'Down', mac: 'Down' },
    exec: function () {
      // if the suggestions window is visible, go to the next item
      if (CPAuto.visible) {
        CPAuto.nextSuggestion();
      }
        // else, move the cursor down
      else {
        CPEditor.selection.moveCursorDown();
        CPEditor.selection.clearSelection();
      }
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });

  // move to the prev suggestion
  CPEditor.editor.commands.addCommand({
    name: 'prevSuggestion',
    bindKey: { win: 'Up', mac: 'Up' },
    exec: function () {
      // if the suggestions window is visible, go to the prev item
      if (CPAuto.visible) {
        CPAuto.prevSuggestion();
      }
        // else, move the cursor down
      else {
        CPEditor.selection.moveCursorUp();
        CPEditor.selection.clearSelection();
      }
    },
    readOnly: false // false if this command should not apply in readOnly mode
  });
};



// array of theme objects for the editor's look/feel
CPUtils.themes =
  {
    Chrome: { path: "ace/theme/chrome", name: "Chrome", bright: true },
    Crimson: { path: "ace/theme/crimson_editor", name: "Crimson Editor", bright: true },
    Dawn: { path: "ace/theme/dawn", name: "Dawn", bright: true },
    Dreamweaver: { path: "ace/theme/dreamweaver", name: "Dreamweaver", bright: true },
    Eclipse: { path: "ace/theme/eclipse", name: "Eclipse", bright: true },
    Endao: { path: "ace/theme/endao", name: "Endao", bright: true },
    Github: { path: "ace/theme/github", name: "GitHub", bright: true },
    SolarizedLight: { path: "ace/theme/solarized_light", name: "Solarized Light", bright: true },
    TextMate: { path: "ace/theme/textmate", name: "TextMate", bright: true },
    Tomorrow: { path: "ace/theme/tomorrow", name: "Tomorrow", bright: true },
    XCode: { path: "ace/theme/xcode", name: "XCode", bright: true },

    Ambiance: { path: "ace/theme/ambiance", name: "Ambiance", bright: false },
    Chaos: { path: "ace/theme/chaos", name: "Chaos", bright: false },
    CloudsMidnight: { path: "ace/theme/clouds_midnight", name: "Clouds Midnight", bright: false },
    Cobalt: { path: "ace/theme/cobalt", name: "Cobalt", bright: false },
    IdleFingers: { path: "ace/theme/idle_fingers", name: "idleFingers", bright: false },
    KrTheme: { path: "ace/theme/kr", name: "krTheme", bright: false },
    Merbivore: { path: "ace/theme/merbivore", name: "Merbivore", bright: false },
    MerbivoreSoft: { path: "ace/theme/merbivore_soft", name: "Merbivore Soft", bright: false },
    MonoIndustrial: { path: "ace/theme/mono_industrial", name: "Mono Industrial", bright: false },
    Monokai: { path: "ace/theme/monokai", name: "Monokai", bright: false },
    PastelOnDark: { path: "ace/theme/pastel_on_dark", name: "Pastel on Dark", bright: false },
    SolarizedDark: { path: "ace/theme/solarized_dark", name: "Solarized Dark", bright: false },
    Terminal: { path: "ace/theme/terminal", name: "Terminal", bright: false },
    TomorrowNight: { path: "ace/theme/tomorrow_night", name: "Tomorrow Night", bright: false },
    TomorrowNightBlue: { path: "ace/theme/tomorrow_night_blue", name: "Tomorrow Night Blue", bright: false },
    TomorrowNightBright: { path: "ace/theme/tomorrow_night_bright", name: "Tomorrow Night Bright", bright: false },
    TomorrowNightEighties: { path: "ace/theme/tomorrow_night_eighties", name: "Tomorrow Night 80s", bright: false },
    Twilight: { path: "ace/theme/twilight", name: "Twilight", bright: false },
    VibrantInk: { path: "ace/theme/vibrant_ink", name: "Vibrant Ink", bright: false },
  };

// get an html <select> object for changing the editor theme
CPUtils.getThemeSelectBox = function () {
  var sel = document.createElement("select");
  sel.setAttribute("size", "1");

  var node_bright = document.createElement("optgroup");
  node_bright.setAttribute("label", "Bright");

  var node_dark = document.createElement("optgroup");
  node_dark.setAttribute("label", "Dark");

  var curTheme = CPEditor.editor.getTheme();

  // go through all the themes adding them to the proper group
  for (var themeName in CPUtils.themes) {
    var theme = CPUtils.themes[themeName];

    var opt = document.createElement("option");
    opt.setAttribute("value", theme.path);
    opt.innerHTML = theme.name;

    // check if this mode is the active mode. set it's selected property if it is
    if (curTheme == theme.path) opt.setAttribute("selected", "true");

    // add option to appropriate group
    if (theme.bright) node_bright.appendChild(opt);
    else node_dark.appendChild(opt);
  }

  // append the groups to the select element
  sel.appendChild(node_bright);
  sel.appendChild(node_dark);

  return sel;
}

// token types 
CPUtils.TokenType =
{
  // complete tokens
  space: 0,
  comment: 1,
  literal: 2,
  string: 3,
  format: 4,
  field: 5,
  identifier: 6,
  symbol: 7,
  linebreak: 8,
  // partial tokens
  partialLiteral: 9,
  partialString: 10,
  partialField: 11
};

// token names, for printing out token types
CPUtils.TokenName =
	[
		"Space",
		"Comment",
		"Literal",
		"String",
		"Format",
		"Field",
		"Identifier",
		"Symbol",
		"Line Break",
		"Partial Literal",
		"Partial String",
		"Partial Field"
	];

// regular expressions representing valid tokens
CPUtils.regexps =
{
  // complete tokens
  space: /\s+/,
  comment: /\/\/.*/,
  literal: /[nbdst]\s*'((\\\\S)|[^\\'])*'/i,
  string: /"((\\\\S)|[^\\"])*"/,
  format: /f\s*'/i,
  field: /\[(\w|\s)*]/,
  identifier: /[a-z]\w*/i,
  symbol: /[,=(){}']/,
  linebreak: /[\r\n]+/,
  // partial tokens
  partialLiteral: /([nbdst]\s*'((\\\\S)|[^\\'])*)|([nbdst]\s*"((\\\\S)|[^\\"])*)/i, // same as literal but missing the end quote
  partialString: /"((\\\\S)|[^\\"])+/, // same as string but missing end quote
  partialField: /\[(\w|\s)*/, // same as field but missing end bracket
};

// type of syntax nodes
CPUtils.NodeType =
	{
	  statement: 0,
	  expression: 1,
	  instruction: 2,
	  variable: 3,
	  literal: 4,
	  format: 5
	};

// types for different grammar rules

// statement types
CPUtils.StatementType =
	{
	  instruction: 0,
	  control: 1,
	  assign: 2
	};

// expression types
CPUtils.ExpressionType =
	{
	  instruction: 0,
	  variable: 1,
	  literal: 2,
	  format: 3
	};

// literal types
CPUtils.LiteralType =
	{
	  text: 0,
	  number: 1,
	  boolean: 2,
	  date: 3,
	  timespan: 4,
	  string: 5
	};

// language data types
CPUtils.Type = {
  number: "Number",
  boolean: "TrueFalse",
  date: "Date",
  timespan: "TimeSpan",
  format: "FormatExpression",
  text: "Text",
  record: "Record",
  pi: "ActionInputs",
  po: "ActionOutputs",
  search: "SearchInputs",
  recordList: "RecordList",
  string: "String",
  variable: "Variable",
  instruction: "Instruction",
  none: "None"
};

// definition of instructions
CPUtils.Instruction = {
  name: "undefined",
  desc: "no description set",
  returnType: CPUtils.Type.none,
  params: []
};

// definition of instruction params
CPUtils.Param = {
  name: "undefined",
  desc: "no description set",
  type: CPUtils.Type.none
};

// definition of variables
CPUtils.Variable = {
  name: "undefined",
  type: CPUtils.Type.none
};

// definition of fields
CPUtils.Field = {
  name: "undefined",
  type: CPUtils.Type.none,
  table: null,
  fieldType: CPUtils.Type.none
};
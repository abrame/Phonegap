// autocomplete component
// requires CPEdtior, CPTokenizer, CPParser
// parses the current line and provides an interactive list of suggestions for completing the current token based on the context of the current line

var CPAuto = {};

///////////////////////////////////
//             Model             //
///////////////////////////////////

// array of all possible suggestions
CPAuto.candidates = [];

// active autocomplete list item
CPAuto.activeItem = 0;

// whether or not the autocomplete is active
CPAuto.active = false;

// whether or not the autocomplete is visible
CPAuto.visible = false;

// array of suggestions matching the entered token
CPAuto.suggestions = [];

// array of all available variables
CPAuto.variables = [];

// array of all available instructions
CPAuto.instructions = [];

// available fields
CPAuto.fields = {
  record: [],
  search: [],
  pi: [],
  po: []
};

// container for the autocomplete suggestions list
CPAuto.suggDiv = null;

// container for the instruction details box
CPAuto.instrDiv = null;

///////////////////////////////////
//              View             //
///////////////////////////////////

// clears the instruction div
CPAuto.clearInstrDiv = function () {
  CPAuto.instrDiv.empty();
}

// loads information about the current instruction into the instruction div
CPAuto.fillInstrDiv = function (instrNode) {
  // clear the div first
  CPAuto.clearInstrDiv();

  // look up the instruction by name
  var instr = CPAuto.getInstruction(instrNode.instruction);
  if (instr != null) {
    var paramNo = instrNode.numParams;
    var html = instr.name + " (";
    // fill in params
    for (var i = 0; i < instr.params.length; i++) {
      var paramName = instr.params[i].name;

      // add comma for every param after first
      if (i != 0) html += ", ";

      if (i == paramNo) { // bold the current param
        html += "<span class=\"CPAuto-instruction-activeParam\">" + paramName + "</span>";
      }
      else {
        html += paramName;
      }
    }
    html += ")<br />";

    // add the description and return type
    html += "Description: " + instr.desc + "<br />";
    // html += "Return Type: " + instr.returnType + "<br />";

    // add details about the active param
    var param = instr.params[paramNo];
    if (param != null) {
      html += "<span class=\"CPAuto-instruction-activeParam\">" + param.name + "</span> (" + param.type + "): " + param.desc;
    }
    CPAuto.instrDiv.append(html);
  }
  else {
    // if can't find a matching instruction definition, say so
    var html = instrNode.instruction + " (no details available)";
    CPAuto.instrDiv.append(html);
  }
}

// hides the instruction div
CPAuto.hideInstrDiv = function () {
  CPAuto.instrDiv.hide();
}

// shows the instruction div
CPAuto.showInstrDiv = function () {
  CPAuto.instrDiv.show();
}

// clears the suggestion div
CPAuto.clearSuggestionDiv = function () {
  CPAuto.suggDiv.empty();
}

// loads the candidate array into a div and highlights the active item
CPAuto.refreshSuggestions = function () {
  // clear out the list
  CPAuto.clearSuggestionDiv();

  // check if the activeItem is beyond the end of the candidates list
  if (CPAuto.activeItem >= CPAuto.candidates.length) {
    CPAuto.activeItem = Math.max(0, CPAuto.candidates.length - 1);
  }
  
  // create the new list
  var ul = document.createElement("ul");
  ul.setAttribute("class", "CPAuto-suggestions-list");
  
  // fill in the list
  for (var i = 0; i < CPAuto.candidates.length; i++) {
    var item = CPAuto.candidates[i];
    var li = document.createElement("li");

    // set active item
    if (i == CPAuto.activeItem) li.setAttribute("class", "CPAuto-suggestions-active");

    li.innerHTML = "";
    // if the item is a field, show it's parentObjectName
    if (item.parentObjectName != null) {
      li.innerHTML += item.parentObjectName + " / ";
    }
    // set text
    li.innerHTML += item.name;

    // append to list
    ul.appendChild(li);
  }

  // append the list to suggestions div
  CPAuto.suggDiv.append(ul);
};

// hides the suggestion div
CPAuto.hideSuggestionDiv = function () {
  CPAuto.suggDiv.hide();
}

// shows the suggestion div
CPAuto.showSuggestionDiv = function () {
  if (CPAuto.candidates.length > 0) {
    CPAuto.suggDiv.show();
  }
}


///////////////////////////////////
//           Controller          //
///////////////////////////////////

// set up the autocomplete component
// suggDiv = id of the div to be used for displaying the autocomplete suggestions
// instrDiv = id of the div to be used for displaying instruction details
CPAuto.init = function (suggDiv, instrDiv) {
  CPAuto.activeItem = 0;
  CPAuto.active = false;
  CPAuto.visible = false;
  // clear arrays
  CPAuto.candidates = [];
  CPAuto.suggestions = [];
  CPAuto.variables = [];
  CPAuto.instructions = [];
  CPAuto.fields = {
    record: [],
    search: [],
    pi: [],
    po: []
  };

  // assign divs
  CPAuto.suggDiv = $("#" + suggDiv);
  CPAuto.suggDiv.attr("class", "CPAuto-suggestions");
  CPAuto.suggDiv.hide();

  CPAuto.instrDiv = $("#" + instrDiv);
  CPAuto.instrDiv.attr("class", "CPAuto-instruction");
  CPAuto.instrDiv.hide();
};


// runs the autocomplete feature. looks at the current context, populates suggestions list with appropriate items, and
// loads candidates based on the active token
CPAuto.runAutocomplete = function () {
  // make sure the parse tree is valid first
  if (CPParser.node != null) {

    // get the current context
    var curNode = CPParser.node;

    var canUseAutocomplete = true;

    // determine if autocomplete list should appear at all
    if (curNode.nodeType == CPUtils.NodeType.expression && curNode.exprType == null) {
      // in an empty expression, load suggestions based on the parent node
      CPAuto.loadSuggestions(curNode.parent);
    }
    else if (curNode.nodeType == CPUtils.NodeType.statement && curNode.stmtType == null) {
      // in an empty statement, load all instructions and variables as suggestions
      if (CPParser.tokenStack.length < 2) {
        CPAuto.loadAllSuggestions();
      }
      else if (CPParser.tokenStack.length == 2) {
        var idType = CPAuto.getIdentifierType(CPParser.tokenStack[0].text);
        CPAuto.loadAllFields(idType);
      }
    }
    else {
      // in a place where autocomplete is not available
      canUseAutocomplete = false;
    }

    // if necessary, fill out the instruction details box
    if (curNode.nodeType == CPUtils.NodeType.expression && curNode.parent.nodeType == CPUtils.NodeType.instruction) {
      CPAuto.fillInstrDiv(curNode.parent);
      CPAuto.showInstrDiv();
    }
    else {
      CPAuto.hideInstrDiv();
    }

    // if we can use autocomplete, filter candidates
    if (canUseAutocomplete) {
      // filter suggestions to match the cureently entered text
      CPAuto.filterSuggestions();

      // fill in the suggestions div with the valid candidates
      if (CPAuto.candidates.length > 0) {
        // if autocomplete was previously inactive, do a reset to set the active item to 0
        if (!CPAuto.active) {
          CPAuto.active = true;
          CPAuto.resetSuggestions();
        }
        CPAuto.refreshSuggestions();
      }
        // if there are no candidates, disable autocomplete
      else {
        CPAuto.active = false;
      }
    }
    else {
      CPAuto.active = false;
    }
  }
  else {
    CPAuto.active = false;
    CPAuto.resetSuggestions();
  }
};

// shows the suggestions box
CPAuto.showSuggestions = function () {
  if (CPAuto.active) {
    // not already showing
    if (!CPAuto.visible) {
      CPAuto.refreshSuggestions();
      CPAuto.showSuggestionDiv();
      CPAuto.visible = true;
    }
  }
  else {
    CPAuto.hideSuggestions();
  }
}

// hides the suggestions box
CPAuto.hideSuggestions = function () {
  if (CPAuto.visible) {
    CPAuto.visible = false;
    CPAuto.hideSuggestionDiv();
  }
}

// resets the autocomplete list
CPAuto.resetSuggestions = function () {
  CPAuto.activeItem = 0;
  CPAuto.visible = false;
  CPAuto.hideSuggestionDiv();
}

// moves to the next item in the candidates list
CPAuto.nextSuggestion = function () {
  CPAuto.activeItem++;

  // wrap around
  if (CPAuto.activeItem >= CPAuto.candidates.length) {
    CPAuto.activeItem = 0;
  }

  // refresh the suggestions div
  CPAuto.refreshSuggestions();
}

// moves to the previous item in the candidates list
CPAuto.prevSuggestion = function () {
  CPAuto.activeItem--;

  // wrap around
  if (CPAuto.activeItem < 0) {
    CPAuto.activeItem = CPAuto.candidates.length - 1;
  }

  // refresh the suggestions div
  CPAuto.refreshSuggestions();
}

// uses the selected autocomplete suggestion
CPAuto.useSuggestion = function () {
  // check that activeItem is in the correct range
  if (CPAuto.activeItem >= 0 && CPAuto.activeItem < CPAuto.candidates.length) {
    // get the suggestion
    var item = CPAuto.candidates[CPAuto.activeItem];
    // get the text from the suggestion
    var text = item.name;

    if (item.fieldType == null) {
      // replace token with suggestion
      CPEditor.replaceWordAtCursor(text);
    }
    else {
      // replace field with suggestion
      CPEditor.replaceFieldAtCursor(text);
    }

    // reset autocomplete
    CPAuto.hideSuggestionDiv();
    CPAuto.activeItem = 0;
    CPAuto.active = false;
  }
}

// clears variables array and loads the given vars
/*
  Expected input format:
  obj = {
    vars: [
      { name: varName, type: varType },
      { ... },
      ...
    ]
  }
*/
CPAuto.loadVariables = function (obj) {
  if (obj != null && obj.vars != null) {
    CPAuto.clearVariables();
    for (var i = 0; i < obj.vars.length; i++) {
      CPAuto.addVariable(obj.vars[i]);
    }
  }
};

// adds the given variable to the variables array
// item = { name: varName, type: varType };
CPAuto.addVariable = function (item) {
  if (item != null) {
    // create the variable object
    var variable = Object.create(CPUtils.Variable);
    variable.name = item.name;
    variable.type = item.type;

    // insert the new variable alphabetically into the variables array
    CPAuto.insertionSort(variable, CPAuto.variables);
  }
}

// clears the variables array
CPAuto.clearVariables = function () {
  CPAuto.variables = [];
}

// clears instructions array and loads the given items
/*
  Expected input format:
  obj = {
    instrs: [
      { name: instrName, desc: instrDescription, params: arrayOfParams },
      { ... },
      ...
    ]
  }
*/
CPAuto.loadInstructions = function (obj) {
  if (obj != null && obj.instrs != null) {
    CPAuto.clearInstructions();
    for (var i = 0; i < obj.instrs.length; i++) {
      CPAuto.addInstruction(obj.instrs[i]);
    }
  }
};

// adds the given item to the instructions array
// item: { name: instrName, desc: instrDescription, returnType: returnType, params: arrayOfParams }
// param: { name: paramName, desc: paramDescription, type: paramType }
CPAuto.addInstruction = function (item) {
  if (item != null) {
    // create the instruction object
    var instr = Object.create(CPUtils.Instruction);
    instr.name = item.name;
    instr.desc = item.desc;
    // instr.returnType = item.returnType;
    instr.params = [];

    // add the params
    if (item.params != null) {
      for (var i = 0; i < item.params.length; i++) {
        var p = item.params[i];
        var param = Object.create(CPUtils.Param);
        param.name = p.name;
        param.desc = p.desc;
        param.type = p.type;
        instr.params.push(param);
      }
    }

    // insert the new instruction alphabetically into the instructions array
    CPAuto.insertionSort(instr, CPAuto.instructions);
  }
};

// clears the instructions array
CPAuto.clearInstructions = function () {
  CPAuto.instructions = [];
}

// clears fields arrays and loads the given fields
/*
  Expected input format:
  obj = {
    fields: [
      { fieldType: fieldType, parentObjectName: parentObjectName, name: fieldName, type: dataType },
      { ... },
      ...
    ]
  }
*/
CPAuto.loadFields = function (obj) {
  if (obj != null && obj.fields != null) {
    CPAuto.clearFields();
    for (var i = 0; i < obj.fields.length; i++) {
      CPAuto.addField(obj.fields[i]);
    }
  }
};

// adds the given field to the appropriate field array
// item: { fieldType: fieldType, name: fieldName, type: dataType }
// example: var myField = { fieldType: CPUtils.Type.Record, parentObjectName: "Username", type: CPUtils.Type.text }
CPAuto.addField = function (item) {
  if (item != null) {

    // create the field object
    var field = Object.create(CPUtils.Field);
    field.name = item.name;
    field.type = item.type;
    field.fieldType = item.fieldType;
    field.parentObjectName = item.parentObjectName;

    // get the correct array
    var array = null;

    if (item.fieldType == CPUtils.Type.record) array = CPAuto.fields.record;
    else if (item.fieldType == CPUtils.Type.search) array = CPAuto.fields.search;
    else if (item.fieldType == CPUtils.Type.pi) array = CPAuto.fields.pi;
    else if (item.fieldType == CPUtils.Type.po) array = CPAuto.fields.po;

    // insert the new variable alphabetically into the variables array
    if (array != null) CPAuto.insertionSort(field, array);
  }
};

// clears the fields object (clears all 4 of the fields arrays)
CPAuto.clearFields = function () {
  CPAuto.fields.record = [];
  CPAuto.fields.search = [];
  CPAuto.fields.pi = [];
  CPAuto.fields.po = [];
};

// removes all fields matching parentName and fieldType
CPAuto.removeObjectFields = function (fieldType, parentName) {

  var list = null;

  // check fieldType, get the correct list
  if (fieldType == CPUtils.Type.record) {
    list = CPAuto.fields.record;
  }
  else if (fieldType == CPUtils.Type.search) {
    list = CPAuto.fields.search;
  }
  else if (fieldType == CPUtils.Type.pi) {
    list = CPAuto.fields.pi;
  }
  else if (fieldType == CPUtils.Type.po) {
    list = CPAuto.fields.po;
  }

  // remove objects from list
  if (list != null) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].parentObjectName == parentName) {
        // remove element
        list.splice(i, 1);
        // decrement i since the list has shrunk
        i--;
      }
    }
  }
};






///////////////////////////////////
//           Utilities           //
///////////////////////////////////

// insertion sort of item into array based on the item.name property
CPAuto.insertionSort = function (item, array) {
  // push the item onto the end
  array.push(item);

  var sorted = false;
  var i = array.length - 2;

  while (!sorted && (i >= 0)) {
    // move variable up in the list if it comes before preceeding var alphabetically
    if (array[i].name.toLowerCase() > item.name.toLowerCase()) {
      array[i + 1] = array[i];
      array[i] = item;
      i--;
    }
    else {
      sorted = true;
    }
  }
}

// fills the suggestions array based on the given node context
CPAuto.loadSuggestions = function (node) {
  // clear suggestions
  CPAuto.suggestions = [];

  // determine what type of node we're in
  if (node.nodeType == CPUtils.NodeType.statement) {
    // in a statement node. get the lhs to see what types we can add to the suggestions array
    // get the variable being assigned to
    var lhs = node.lhs.variable; // this is just a string, the variable name

    var lhsField = node.lhs.field; // if there is no field this is null

    // get the type of variable
    var type = CPAuto.getIdentifierType(lhs);

    // special case if we're in a field on the rhs
    if (CPParser.tokenStack.length == 2) {
      var idType = CPAuto.getIdentifierType(CPParser.tokenStack[0].text);
      CPAuto.loadAllFields(idType);
    }
    else {
      // if there is a field, any type is legal
      if (lhsField != null) {
        CPAuto.loadAllSuggestions();
      }
      else {
        // load suggestions of the variable type
        // CPAuto.loadSuggestionsOfType(type);
        CPAuto.loadAllSuggestions();
      }
    }
  }
  else if (node.nodeType == CPUtils.NodeType.instruction) {
    // in an instruction node. see what param we're on and what type it is supposed to be
    // get the instruction name
    var instrName = node.instruction; // just a string, the instruction name

    // look up the instruction definition
    var instr = CPAuto.getInstruction(instrName);

    /* For now, removed filtering suggestions by param type
    if (instr != null) {
 
      // load specific suggestions for the expected type of the current parameter
      var paramNo = node.numParams;
      // validate paramNo
      if (paramNo >= 0 && paramNo < instr.params.length) {
        // special case if we're in a field
        if (CPParser.tokenStack.length == 2) {
          var idType = CPAuto.getIdentifierType(CPParser.tokenStack[0].text);
          CPAuto.loadFieldsOfType(idType, instr.params[paramNo].type);
        }
        else {
          // load suggestions for current param
          CPAuto.loadSuggestionsOfType(instr.params[paramNo].type);
        }
      }
      else {
        // invalid param number, do nothing
      }
    }
    // couldn't find the instruction template
    else {
      // special case if we're in a field
      if (CPParser.tokenStack.length == 2) {
        var idType = CPAuto.getIdentifierType(CPParser.tokenStack[0].text);
        CPAuto.loadAllFields(idType);
      }
      else {
        // couldn't find the instruction, load all suggestions
        CPAuto.loadAllSuggestions();
      }
    }*/

    // REMOVE THIS ONCE PARAM TYPES ARE RE-IMPLEMENTED
    if (CPParser.tokenStack.length == 2) {
      var idType = CPAuto.getIdentifierType(CPParser.tokenStack[0].text);
      CPAuto.loadAllFields(idType);
    }
    else {
      // couldn't find the instruction, load all suggestions
      CPAuto.loadAllSuggestions();
    }
  }
  else if (node.nodeType == CPUtils.NodeType.format) {
    // special case if we're in a field
    if (CPParser.tokenStack.length == 2) {
      var idType = CPAuto.getIdentifierType(CPParser.tokenStack[0].text);
      CPAuto.loadAllFields(idType);
    }
    else {
      CPAuto.loadAllSuggestions();
    }
  }
}

// loads all instructions and variables into the suggestions array
CPAuto.loadAllSuggestions = function () {
  // clear suggestions
  CPAuto.suggestions = [];

  // merge instructions and variables arrays into suggestions array to keep alphabetical order
  var i = 0; var j = 0;
  while (i < CPAuto.variables.length && j < CPAuto.instructions.length) {
    var myVar = CPAuto.variables[i];
    var instr = CPAuto.instructions[j];

    // compare names of the two, insert the lower one
    if (myVar.name.toLowerCase() <= instr.name.toLowerCase()) {
      // myVar comes first alphabetically
      CPAuto.suggestions.push(myVar);
      i++;
    }
    else {
      // instr comes before myVar
      CPAuto.suggestions.push(instr);
      j++;
    }
  }

  // one array is empty, add the remaining elements in the other
  while (i < CPAuto.variables.length) {
    var myVar = CPAuto.variables[i];
    CPAuto.suggestions.push(myVar);
    i++;
  }

  while (j < CPAuto.instructions.length) {
    var instr = CPAuto.instructions[j];
    CPAuto.suggestions.push(instr);
    j++;
  }
}

// loads all variables of type t and all instructions with returnType t into the suggestions array
CPAuto.loadSuggestionsOfType = function (t) {
  // clear suggestions
  CPAuto.suggestions = [];

  // merge instructions and variables arrays into suggestions array to keep alphabetical order
  var i = 0; var j = 0;
  while (i < CPAuto.variables.length && j < CPAuto.instructions.length) {
    var myVar = CPAuto.variables[i];
    var instr = CPAuto.instructions[j];

    // compare names of the two, insert the lower one
    if (myVar.name.toLowerCase() <= instr.name.toLowerCase()) {
      // myVar comes first alphabetically
      // add only if types match
      if (myVar.type == t) CPAuto.suggestions.push(myVar);
      i++;
    }
    else {
      // instr comes before myVar
      // add only if types match
      if (instr.returnType == t) CPAuto.suggestions.push(instr);
      j++;
    }
  }

  // one array is empty, add the remaining elements in the other
  while (i < CPAuto.variables.length) {
    var myVar = CPAuto.variables[i];
    // add only if types match
    if (myVar.type == t) CPAuto.suggestions.push(myVar);
    i++;
  }

  while (j < CPAuto.instructions.length) {
    var instr = CPAuto.instructions[j];
    // add only if types match
    if (instr.returnType == t) CPAuto.suggestions.push(instr);
    j++;
  }
}

// looks up the variable with name in variables array
CPAuto.getVariable = function (name) {
  var i = 0;
  var passed = false; // flag to see if we've gone too far in the alphabet to be able to find what we're looking for

  while (i < CPAuto.variables.length && !passed) {
    var v = CPAuto.variables[i];

    // check for match
    if (v.name == name) return v;

    // see if we've passed over where our target should have been
    passed = (name.toLowerCase() > v.name.toLowerCase());
    i++;
  }
}

// gets the data type of a variable
CPAuto.getIdentifierType = function (name) {
  name = name.toUpperCase();

  if (name.indexOf("T_") == 0) {
    return CPUtils.Type.text;
  }
  else if (name.indexOf("N_") == 0) {
    return CPUtils.Type.number;
  }
  else if (name.indexOf("B_") == 0) {
    return CPUtils.Type.boolean;
  }
  else if (name.indexOf("D_") == 0) {
    return CPUtils.Type.date;
  }
  else if (name.indexOf("R_") == 0) {
    return CPUtils.Type.record;
  }
  else if (name.indexOf("RL_") == 0) {
    return CPUtils.Type.recordList;
  }
  else if (name.indexOf("S_") == 0) {
    return CPUtils.Type.search;
  }
  else if (name.indexOf("PI_") == 0) {
    return CPUtils.Type.pi;
  }
  else if (name.indexOf("PO_") == 0) {
    return CPUtils.Type.po;
  }
  else {
    return CPUtils.Type.none;
  }
}

CPAuto.getFieldType = function (field) {

}

// looks up the instruction with name in instructions array
CPAuto.getInstruction = function (name) {
  var i = 0;
  var passed = false; // flag to see if we've gone too far in the alphabet to be able to find what we're looking for

  while (i < CPAuto.instructions.length && !passed) {
    var instr = CPAuto.instructions[i];

    // check for match
    if (instr.name == name) return instr;

    // see if we've passed over where our target should have been
    passed = (name.toLowerCase() > instr.name.toLowerCase());
    i++;
  }
}

// fills the candidates array with items in suggestions array that match the active token
CPAuto.filterSuggestions = function () {
  var text = "";
  CPAuto.candidates = [];

  // see if there is a field on the stack
  if (CPParser.tokenStack.length == 2) {
    // can only have suggestions for partial fields
    if (CPParser.curToken.type != CPUtils.TokenType.partialField) return;

    // extract the text from the current token
    text = CPParser.tokenStack[1].text.toLowerCase();
    // slice off the opening bracket
    text = text.substring(1);
  }
    // see if there is an identifier active
  else if (CPParser.tokenStack.length == 1) {
    // make sure we haven't passed the identifier/ (i.e. by entering a space)
    if (CPParser.curToken.type != CPUtils.TokenType.identifier) return;
    text = CPParser.tokenStack[0].text.toLowerCase(); // extract the text from the current token
  }

  // filter suggestions
  var i = 0;
  while (i < CPAuto.suggestions.length) {
    var item = CPAuto.suggestions[i];
    // check for match, case insensitive
    if (item.name.toLowerCase().indexOf(text) >= 0) CPAuto.candidates.push(item);

    i++;
  }
}

// checks the given type to make sure it is a type that can have fields
// if so, load all the fields for that type (record, process in, process out, search)
CPAuto.loadAllFields = function (type) {
  // clear suggestions
  CPAuto.suggestions = [];
  var source = [];

  // validate type, set the source array
  if (type == CPUtils.Type.record) {
    source = CPAuto.fields.record;
  }
  else if (type == CPUtils.Type.pi) {
    source = CPAuto.fields.pi;
  }
  else if (type == CPUtils.Type.po) {
    source = CPAuto.fields.po;
  }
  else if (type == CPUtils.Type.search) {
    source = CPAuto.fields.search;
  }

  // fill suggestions
  for (var i = 0; i < source.length; i++) {
    CPAuto.suggestions.push(source[i]);
  }
}

// checks the given type to make sure it is a type that can have fields
// if so, load all the fields for that type (record, process in, process out, search) that contain data matching the dataType
CPAuto.loadFieldsOfType = function (fieldType, dataType) {
  // clear suggestions
  CPAuto.suggestions = [];
  var source = [];

  // validate fieldType, set the source array
  if (fieldType == CPUtils.Type.record) {
    source = CPAuto.fields.record;
  }
  else if (fieldType == CPUtils.Type.pi) {
    source = CPAuto.fields.pi;
  }
  else if (fieldType == CPUtils.Type.po) {
    source = CPAuto.fields.po;
  }
  else if (fieldType == CPUtils.Type.search) {
    source = CPAuto.fields.search;
  }

  // fill suggestions
  for (var i = 0; i < source.length; i++) {
    if (source[i].type == dataType) {
      CPAuto.suggestions.push(source[i]);
    }
  }
}
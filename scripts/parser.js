// the parser takes a list of tokens and builds a syntax tree out of them
// this file depends on tokenizer.js being present

var CPParser = {};

////////////////////////////////////////
//						Definitions							//
////////////////////////////////////////

// states of the parser state machine
CPParser.State = 
	{
		begin: 0,
		expression: 1,
    finish: 2
	}


////////////////////////////////////////
//								Model								//
////////////////////////////////////////

// the parsed syntax tree
CPParser.tree = null;

// the current node of the parse tree
CPParser.node = null;

// stack of processed tokens for handling multi-token expressions
CPParser.tokenStack = [];

// the last processed token
CPParser.curToken = null;

// the state of the parser
CPParser.state = CPParser.State.begin;

// whether or not the parse was successful
CPParser.valid = true;





////////////////////////////////////////
//						    View  							//
////////////////////////////////////////

// returns a <ul> object representing the syntax tree
CPParser.getTreeAsUL = function () {
  if (CPparse.tree == null) return null;

  var ul = document.createElement("ul");

}




////////////////////////////////////////
//						 Controller							//
////////////////////////////////////////

// parse a single line of tokens and return the syntax tree
CPParser.parseLine = function (tokens) {
	// restart the parser
  CPParser.init();

	// check that the tokens list is valid
	if (tokens == null) {
	  CPParser.valid = false;
		return null;	
	}

	// set the current node to an empty statement
	CPParser.node =
		{
			parent: null,
			nodeType: CPUtils.NodeType.statement,
			stmtType: null
		};

  // set the syntax tree to the root node
	CPParser.tree = CPParser.node;

	// iterate over the token list
	for (var i = 0; i < tokens.length && CPParser.valid; i++) {
	  CPParser.curToken = tokens[i];
	  if (tokens[i].type != CPUtils.TokenType.space && tokens[i].type != CPUtils.TokenType.comment)
	    CPParser.valid = CPParser.handleToken(tokens[i]);
	}

	// return the result if valid
	if (CPParser.valid) return CPParser.tree;
	else {
	  CPParser.node = null;
	  CPParser.tree = null;
	  return false;
	}
}




////////////////////////////////////////
//							 States								//
////////////////////////////////////////

// statement
CPParser.stateBegin = function (token) {
	if (token.type == CPUtils.TokenType.identifier) {
		// if we haven't pushed any tokens yet, push the identifier
		if (CPParser.tokenStack.length == 0) {
			CPParser.tokenStack.push(token);
			return true;
		}
		else return false;
	}
	else if (token.type == CPUtils.TokenType.field) {
		// if an identifier has been found, push the field
		if (CPParser.tokenStack.length == 1) {
			CPParser.tokenStack.push(token);
			return true;
		}
		else return false;
	}
	else if (token.type == CPUtils.TokenType.partialField) {
	  // if an identifier has been found, push the field and then go to the finish state
	  if (CPParser.tokenStack.length == 1) {
	    CPParser.tokenStack.push(token);
	    CPParser.state = CPParser.State.finish;
	    return true;
	  }
	  else return false;
	}
	else if (token.type == CPUtils.TokenType.symbol && token.text == '(') {
	  // if an identifier is present go to instruction
	  if (CPParser.tokenStack.length == 1) {
	    return CPParser.goToInstruction();
	  }
	  else return false;
	}
	else if (token.type == CPUtils.TokenType.symbol && token.text == '=') {
	  // if a variable has already been seen, create assignment statement
	  if (CPParser.tokenStack.length == 1 || CPParser.tokenStack.length == 2) {
	    return CPParser.goToAssignment();
	  }
	  else return false;
	}
	else {
	  // invalid token
	  return false;
	}
}

// expression
CPParser.stateExpression = function (token) {
	if (token.type == CPUtils.TokenType.literal || token.type == CPUtils.TokenType.string) {
		// if we haven't pushed any tokens yet, create a literal expression
		if (CPParser.tokenStack.length == 0 && CPParser.node.exprType == null) {
			var literalNode = CPParser.createLiteral(token);
			if (literalNode != null) {
				// attach the literal node to the current expression
				return CPParser.setExpression(literalNode);
			}
		}
		else return false;
	}
	else if (token.type == CPUtils.TokenType.partialLiteral || token.type == CPUtils.TokenType.partialString) {
	  // if we haven't pushed any tokens yet, create a literal expression and go to the finish state
	  if (CPParser.tokenStack.length == 0 && CPParser.node.exprType == null) {
	    var literalNode = CPParser.createLiteral(token);
	    if (literalNode != null) {
	      // attach the literal node to the current expression and go to finish state
	      var success = CPParser.setExpression(literalNode);
	      CPParser.state = CPParser.State.finish;
	      return success;
	    }
	  }
	  else return false;
	}
	else if (token.type == CPUtils.TokenType.identifier) {
		// if the current expression is empty and we haven't pushed any tokens yet, push the identifier
	  if (CPParser.tokenStack.length == 0 && CPParser.node.exprType == null) {
			CPParser.tokenStack.push(token);
			return true;
		}
		else return false;
	}
	else if (token.type == CPUtils.TokenType.field) {
		// if an identifier has been found, push the field
		if (CPParser.tokenStack.length == 1) {
			CPParser.tokenStack.push(token);
			return true;
		}
		else return false;
	}
	else if (token.type == CPUtils.TokenType.partialField) {
	  // if an identifier has been found, push the field and go to the finish state
	  if (CPParser.tokenStack.length == 1) {
	    CPParser.tokenStack.push(token);
	    CPParser.state = CPParser.State.finish;
	    return true;
	  }
	  else return false;
	}
	else if (token.type == CPUtils.TokenType.symbol && token.text == '(') {
		// if an identifier is present go to instruction
		if (CPParser.tokenStack.length == 1) {
			return CPParser.goToInstruction();
		}
		else return false;
	}
	else if (token.type == CPUtils.TokenType.format) {
		// if nothing is on the stack, go to a format expression
		if (CPParser.tokenStack.length == 0 && CPParser.node.exprType == null) {
			return CPParser.goToFormat();
		}
		else return false;
	}
	else if (token.type == CPUtils.TokenType.symbol && token.text == ')') {
		// finish the current instruction
		return CPParser.finishInstruction();
	}
	else if (token.type == CPUtils.TokenType.symbol && token.text == '\'') {
		// finish the current format expression
		return CPParser.finishFormat();
	}
	else if (token.type == CPUtils.TokenType.symbol && token.text == ',') {
		// try to go to the next parameter
		return CPParser.goToNextParam();
	} else {
		// invalid token
		return false;
	}
}




////////////////////////////////////////
//							Helpers								//
////////////////////////////////////////

// restart the parser
CPParser.init = function () {
	CPParser.tokenStack = [];
	CPParser.tree = null;
	CPParser.node = null;
	CPParser.state = CPParser.State.begin;
	CPParser.valid = true;
	CPParser.curToken = null;
}

// process the next token in the list
CPParser.handleToken = function (token) {
	if (token.type == CPUtils.TokenType.space || token.type == CPUtils.TokenType.comment) {
		// ignore spaces and comments
		return true;
	}
		// newlines are special case
	else if (token.type != CPUtils.TokenType.linebreak) {
		// handle the token
		if (CPParser.state == CPParser.State.begin) {
			return CPParser.stateBegin(token);
		}
		else if (CPParser.state == CPParser.State.expression) {
			return CPParser.stateExpression(token);
		}
		else {
      // if we've hit the finish state, that means no more meaningful tokens should appear in the given line
			return false;
		}
	}
	else {
		// newline
		return true;
	}
}

CPParser.goToInstruction = function () {
	// if we're in a statement node, the instruction shouldn't be set yet
	if (CPParser.node.nodeType == CPUtils.NodeType.statement) {
		if (CPParser.node.stmtType == null) {
			// add info to the statement node
			CPParser.node.stmtType = CPUtils.StatementType.instruction;
			CPParser.node.instruction = null;

			// create the child node
			var instr = CPParser.createInstruction(CPParser.tokenStack.pop().text);

			// set child/parent relationship
			CPParser.node.instruction = instr;
			instr.parent = CPParser.node;

			// append an empty expression to start of the params list
			var expr = CPParser.createExpression();
			expr.parent = instr;
			instr.params.push(expr);

			// set the current node to the nex expression
			CPParser.node = expr;
			CPParser.state = CPParser.State.expression;
			return true;
		}
		else return false;
		// an instruction has already appeared in the top level of the statement. can't have > 1
		// ex: Stop(T'Do stuff') Stop(T'Do more stuff')
	}

		// if we're in an expression, and it hasn't been set yet, make a new expression
	else if (CPParser.node.nodeType == CPUtils.NodeType.expression && CPParser.node.exprType == null) {
		// create the child instruction node
		var instr = CPParser.createInstruction(CPParser.tokenStack.pop().text);

		// set attributes in the current expression node
		CPParser.node.exprType = CPUtils.ExpressionType.instruction;
		CPParser.node.expr = instr;
		instr.parent = CPParser.node;

		// append an empty expression to start of the params list
		var expr = CPParser.createExpression();
		expr.parent = instr;
		instr.params.push(expr);

		// set the new expression as the active node
		CPParser.node = expr;
		CPParser.state = CPParser.State.expression;
		return true;

	}
	else return false;
}

CPParser.goToAssignment = function () {
	// can only have an assignment in a statement node who's type has not yet been defined
	if (CPParser.node.nodeType == CPUtils.NodeType.statement) {
		if (CPParser.node.stmtType == null) {
			// add info to the statement node
			CPParser.node.stmtType = CPUtils.StatementType.assign;
			CPParser.node.lhs = CPParser.createVariable();
			CPParser.node.rhs = null;

			// set the parent of the lhs variable
			CPParser.node.lhs.parent = CPParser.node;

			// create the child node
			var child =
				{
					parent: CPParser.node,
					nodeType: CPUtils.NodeType.expression,
					exprType: null,
					expr: null
				};
			// append child to parent, and make the current child the active node
			CPParser.node.rhs = child;
			CPParser.node = child;
			CPParser.state = CPParser.State.expression;
			return true;
		}
		else return false;
		// an instruction has already appeared in the top level of the statement. can't have > 1
		// ex: Stop(T'Do stuff') Stop(T'Do more stuff')
	}
}

CPParser.goToFormat = function () {
	// should be already in an empty expression node
	if (CPParser.node.nodeType == CPUtils.NodeType.expression && CPParser.node.exprType == null) {
		// create the child instruction node
		var format = CPParser.createFormat();

		// set attributes in the current expression node
		CPParser.node.exprType = CPUtils.ExpressionType.format;
		CPParser.node.expr = format;
		format.parent = CPParser.node;

		// append an empty expression to start of the params list
		var expr = CPParser.createExpression();
		expr.parent = format;
		format.params.push(expr);

		// set the new expression as the active node
		CPParser.node = expr;
		CPParser.state = CPParser.State.expression;
		return true;

	}
	else return false;
}

CPParser.goToNextParam = function () {
	// the parent node must be a format or instruction node for simple variables
	var parent = CPParser.node.parent;
	if (parent.nodeType == CPUtils.NodeType.instruction || parent.nodeType == CPUtils.NodeType.format) {
		// check if there's a variable hanging out on the token stack
		var myVar = CPParser.createVariable();
		if (myVar != null) {
			if (!CPParser.setExpression(myVar)) {
				return false; // error occurred
			}
		}
		// make sure there is an expression completed already
		else if (CPParser.node.exprType == null) {
			return false;
		}
		parent.numParams++;
		// create new expression node and add to param list
		CPParser.node = CPParser.createExpression();
		CPParser.node.parent = parent;
		parent.params.push(CPParser.node);
		return true;
	}
	else if (parent.nodeType == CPUtils.NodeType.expression) {
	  // in a nested instruction/format
	  // go up one more level to the surrounding instruction/format
	  parent = parent.parent;

	  parent.numParams++;
	  // create new expression node and add to param list
	  CPParser.node = CPParser.createExpression();
	  CPParser.node.parent = parent;
	  parent.params.push(CPParser.node);
	  return true;
	}
	return false;
}

// creates a variable object from tokens on the stack
CPParser.createVariable = function () {
	// need exactly one (var name) or two (var name and field) tokens on the stack
	if (CPParser.tokenStack.length < 1 || CPParser.tokenStack.length > 2) {
		return null;
	}

	var result =
		{
			parent: null,
			nodeType: CPUtils.NodeType.variable,
			variable: null,
			field: null
		};

	// if there are two variables on the stack it's a fielded variable
	if (CPParser.tokenStack.length == 2) {
	  var fieldVal = CPParser.tokenStack.pop().text; // fieldVal still contains the bracket characters
	  fieldVal = fieldVal.substr(1, fieldVal.length - 2); // remove brackets
	  result.field = fieldVal;
	}
	// set the var name
	result.variable = CPParser.tokenStack.pop().text;

	return result;
}

// creates a literal from the token
CPParser.createLiteral = function (token) {
	// create literal template
	var result =
		{
			parent: null,
			nodeType: CPUtils.NodeType.literal,
			literalType: null,
			value: null
		};
	var firstChar = token.text.charAt(0).toLowerCase();

	// determine the type of literal
	if (firstChar == "n") {
		// number
		result.literalType = CPUtils.LiteralType.number;
	}
	else if (firstChar == "b") {
		// boolean
		result.literalType = CPUtils.LiteralType.boolean;
	}
	else if (firstChar == "t") {
		// text
		result.literalType = CPUtils.LiteralType.text;
	}
	else if (firstChar == "d") {
		// date
		result.literalType = CPUtils.LiteralType.date;
	}
	else if (firstChar == "s") {
		// timespan
		result.literalType = CPUtils.LiteralType.timespan;
	}
	else if (firstChar == "\"") {
		// string
		result.literalType = CPUtils.LiteralType.string;
	} else {
		return null; // invalid literal type
	}

	// extract the expression text
	if (result.literalType == CPUtils.LiteralType.string) {
	  if (token.type == CPUtils.TokenType.partialString) {
	    result.value = token.text.substr(1, token.text.length - 1); // no quote at the end to be removed
	  }
	  else {
	    result.value = token.text.substr(1, token.text.length - 2);
	  }
	}
	else {
		// get the starting position of the expression text (because space can be between the type and the ' symbol
	  var start = token.text.indexOf('\'') + 1;
	  if (token.type == CPUtils.TokenType.partialLiteral) {
	    result.value = token.text.substr(start, token.text.length - (start)); // no quote at end to be removed
	  }
	  else {
	    result.value = token.text.substr(start, token.text.length - (start + 1));
	  }
	}
	return result;
}

// creates a new instruction node for the given instruction
CPParser.createInstruction = function (name) {
	var result =
	{
		parent: null,
		nodeType: CPUtils.NodeType.instruction,
		instruction: name,
		params: new Array(),
		numParams: 0
	};
	return result;
}

// creates an empty format expression node
CPParser.createFormat = function () {
	var result =
		{
			parent: null,
			nodeType: CPUtils.NodeType.format,
			params: new Array(),
			numParams: 0
		};
	return result;
}

// creates an empty expression node
CPParser.createExpression = function () {
	var result =
		{
			parent: null,
			nodeType: CPUtils.NodeType.expression,
			exprType: null,
			expr: null
		};
	return result;
}

// set's the value of an expression to the given node type
CPParser.setExpression = function (node) {
	// make sure that the expression hasnt been set yet
	if (CPParser.node.nodeType == CPUtils.NodeType.expression && CPParser.node.exprType == null) {
		// set the expression
		// literal
		if (node.nodeType == CPUtils.NodeType.literal) {
			CPParser.node.exprType = CPUtils.ExpressionType.literal;
		}
			// variable
		else if (node.nodeType == CPUtils.NodeType.variable) {
			CPParser.node.exprType = CPUtils.ExpressionType.variable;
		}
			// format
		else if (node.nodeType == CPUtils.NodeType.format) {
			CPParser.node.exprType = CPUtils.ExpressionType.format;
		}
			// instruction
		else if (node.nodeType == CPUtils.NodeType.instruction) {
			CPParser.node.exprType = CPUtils.ExpressionType.instruction;
		}
		else return false; // invalid node type

		// set the parent/child relationship
		node.parent = CPParser.node;
		CPParser.node.expr = node;

		return true;
	}
	else return false;
}

CPParser.finishInstruction = function () {
	// make sure we're in an instruction expression
	if (CPParser.node.parent.nodeType == CPUtils.NodeType.instruction) {

		// check if there are any tokens laying around on the stack still
		var lastVar = CPParser.createVariable();
		if (lastVar != null) {
			// append the var to param list and finish
			if (CPParser.setExpression(lastVar)) {
				// return control to the parent
				CPParser.node = CPParser.node.parent;
				CPParser.node.numParams++;
				return true;
			}
		}
			// if the current expression is null, then the param list should be empty.
			// otherwise, we're trying to do something illegal like: CompareText(T_name, )
		else if (CPParser.node.exprType == null) {
			if (CPParser.node.parent.numParams == 0) {
				// return control to parent instruction
				CPParser.node = CPParser.node.parent;
				return true;
			}
		}
			// handle the final param in the parameter list
		else {
			CPParser.node = CPParser.node.parent;
			CPParser.node.numParams++;
			return true;
		}
	}
	return false;
}

CPParser.finishFormat = function () {
	// make sure we're in a format expression
	if (CPParser.node.parent.nodeType == CPUtils.NodeType.format) {

		// check if there are any tokens laying around on the stack still
		var lastVar = CPParser.createVariable();
		if (lastVar != null) {
			// append the var to param list and finish
			if (CPParser.setExpression(lastVar)) {
				// return control to the parent
				CPParser.node = CPParser.node.parent;
				CPParser.node.numParams++;
				return true;
			}
		}
			// cannot have empty/no parameters
		else if (CPParser.node.exprType != null) {
			// handle the final param in list
			// return control to parent instruction
			CPParser.node = CPParser.node.parent;
			CPParser.node.numParams++;
			return true;
		}
	}
	return false;
}

// finishes of the current line
CPParser.finishLine = function () {

}
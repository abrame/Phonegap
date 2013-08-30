// this tokenizer takes the string representation of a line and converts it to an array of tokens
var CPTokenizer = {};

/////////////////////////////////////
// 	 						Data  						 //
/////////////////////////////////////

// the string being tokenized
CPTokenizer.string = "";

// flag to ignore comments
CPTokenizer.ignoreComments = false;

// flag to ignore spaces
CPTokenizer.ignoreSpace = false;

/////////////////////////////////////
// 	 					Method(s)						 //
/////////////////////////////////////

// takes a string of text and returns an array of tokens (or null if it fails)
CPTokenizer.tokenize = function (text) {
	var result = [];
	var valid = true;
	CPTokenizer.string = text;
	
	while (CPTokenizer.string.length > 0 && valid) {
	  valid = CPTokenizer.getNextToken(result);
	}

	if (valid) return result;
	else return null;
}

// sets whether or not comment tokens are ignored
CPTokenizer.setIgnoreComments = function (bool) {
  CPTokenizer.ignoreComments = bool;
}

// sets whether or not space tokens are ignored
CPTokenizer.setIgnoreSpace = function (bool) {
  CPTokenizer.ignoreSpace = bool;
}



/////////////////////////////////////
// 	 				 Helpers(s)						 //
/////////////////////////////////////

// gets the next token from the input string and removes that token from the string
CPTokenizer.getNextToken = function (tokens) {
	// go through all of the possible token types to see if one of them starts at position 0

	// line break
  match = CPTokenizer.string.match(CPUtils.regexps.linebreak);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.linebreak)) return true;

	// space
  var match = CPTokenizer.string.match(CPUtils.regexps.space);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.space)) return true;

	// comment
  match = CPTokenizer.string.match(CPUtils.regexps.comment);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.comment)) return true;

	// literal
  match = CPTokenizer.string.match(CPUtils.regexps.literal);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.literal)) return true;

	// string
  match = CPTokenizer.string.match(CPUtils.regexps.string);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.string)) return true;

	// format
  match = CPTokenizer.string.match(CPUtils.regexps.format);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.format)) return true;

	// field
  match = CPTokenizer.string.match(CPUtils.regexps.field);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.field)) return true;

	// partial literal
  match = CPTokenizer.string.match(CPUtils.regexps.partialLiteral);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.partialLiteral)) return true;

	// identifier
  match = CPTokenizer.string.match(CPUtils.regexps.identifier);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.identifier)) return true;

	// partial string
  match = CPTokenizer.string.match(CPUtils.regexps.partialString);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.partialString)) return true;

	// partial field
  match = CPTokenizer.string.match(CPUtils.regexps.partialField);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.partialField)) return true;

	// symbol
  match = CPTokenizer.string.match(CPUtils.regexps.symbol);
  if (CPTokenizer.addMatchToResult(tokens, match, CPUtils.TokenType.symbol)) return true;

	CPTokenizer.string = "";
	return false;
}

// if the found match is at the beginning of the string, add it to the token list and remove it from the string
CPTokenizer.addMatchToResult = function (tokens, match, tokenType) {

  if (match != null && match.index == 0) {
    // check for ignored tokens
    if (tokenType == CPUtils.TokenType.space && CPTokenizer.ignoreSpace) return true;
    else if (tokenType == CPUtils.TokenType.comment && CPTokenizer.ignoreComments) return true;

		tokens.push({ type: tokenType, text: match[0] }); // add the match to the tokens list
		// remove the match from the string
		CPTokenizer.string = CPTokenizer.string.substring(match[0].length, CPTokenizer.string.length);
		return true;
	}
	// match not found or not at the beginning
	return false;
}
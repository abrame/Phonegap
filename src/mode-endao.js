define('ace/mode/endao', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/matching_brace_outdent', 'ace/mode/folding/cstyle', 'ace/mode/endao_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");

var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var MyNewHighlightRules = require("./endao_highlight_rules").MyNewHighlightRules;

var Mode = function() {

    var highlighter = new MyNewHighlightRules();
    this.$outdent = new MatchingBraceOutdent();

    this.$tokenizer = new Tokenizer(highlighter.getRules());
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {


}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/matching_brace_outdent', ['require', 'exports', 'module' , 'ace/range'], function(require, exports, module) {


var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define('ace/mode/folding/cstyle', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/range', 'ace/mode/folding/fold_mode'], function(require, exports, module) {


var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {

    this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i + match[0].length, 1);
        }

        if (foldStyle !== "markbeginend")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };

}).call(FoldMode.prototype);

});
define('ace/mode/endao_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MyNewHighlightRules = function() {

    var keywordMapper = this.createKeywordMapper({
      "support.function": "AggregateList|AP_CreateProcessInput|AP_RunCloudProcess|AppendToList|Assign|BatchDelete|BatchUpdate|CalcList|ChangeDate|ChangeUserEmail|ChangeUserLanguage|ChangeUsername|ChangeUserPassword|ChangeUserRole|ChargeAccountCreditCard|ChargeUserCreditCard|CompareText|CompareValues|ConvertText|CreateCloudProcess|CreateDocument|CreateProcessInput|CreateRecord|CreateRelationship|CreateSearch|CreateTable|CreateTableField|CreateTableLinkField|CreateTempRecord|CreateUser|DeleteCloudProcess|DeleteRecord|DeleteRelationship|DeleteTable|DeleteTableField|DeleteUser|ExportRecords|FindTextIndex|GetCCInfo|GetDateDiff|GetFile|GetLinkedRecords|GetListLength|GetLoginURL|GetTextLength|GetTimespanLength|GetUserRecord|IfFalse|IfTrue|ImportRecords|IsEmpty|IsLinked|IterateRecords|LinkRecords|LoadRecord|LoadRecords|Loop|NoOp|PerformCCAction|PerformQuery|PerformSearch|PrependToList|RecordExists|RemoveFromList|ReplaceText|ResetUserPassword|RunProcess|SaveCloudProcess|SaveFile|SaveRecord|SaveTable|SaveTableField|SearchList|SendEmail|SendNotification|SendSMS|SendUserEmailChangeCode|SendUserLoginInfo|Seperator1|Seperator10|Seperator11|Seperator2|Seperator20|Seperator30|Seperator4|Seperator40|Seperator5|Seperator6|Seperator7|Seperator9|SortList|SplitText|Stop|SubText|TrimText|UnlinkRecords|ValidateUserCreditCard"
    }, "identifier");


    this.$rules = {
      "start": [
          {
            token: "comment",
            regex: /\/\/.*$/
          },
          {
            token: "comment", // block comment
            regex: /\/\*/,
            next: "comment"
          },
          {
            token: "string",
            regex: /'((\\')|[^'])*'/
          },
          {
            token: "string",
            regex: /"((\\")|[^"])*"/
          },
          {
            token: "variable",
            regex: /[NBTDS]_[a-zA-Z]\w*\b/,
            next: "noField"
          },
          {
            token: "variable",
            regex: /(R|PI|PO)_[a-zA-Z]\w*\b/
          },
          {
            token: "text",
            regex: /\[/,
            next: "field"
          },
          {
            token: "text",
            regex: /T'/,
            next: "quotedExpr"
          },
          {
            token: "text",
            regex: /[NBFDS]'/
          },
          {
            token: keywordMapper,
            regex: /[a-zA-Z][\w]*\b/
          },
          {
            token: "paren.lparen",
            regex: /[[{(]/
          },
          {
            token: "paren.rparen",
            regex: /[\]})]/
          },
          {
            token: "text",
            regex: /'/
          },
          {
            token: "text",
            regex: /\s+/
          }
      ],
      "comment": [
          {
            token: "comment", // end comment
            regex: /.*?\*\//,
            next: "start"
          },
          {
            token: "comment", // whole line is part of block comment
            regex: /.+/
          }
      ],
      "field": [
          {
            token: "text",
            regex: /]/,
            next: "start"
          },
          {
            token: "string.other",
            regex: /\S+\b/
          },
          {
            token: "text",
            regex: /\s+/
          }
      ],
      "noField": [
          {
            token: "invalid", // invalid attempt to add field
            regex: /(?:\[)(?:.*?)(?:])/,
            next: "start"
          },
          {
            token: "invalid", // invalid attempt to add field
            regex: /(?:\[)(?:.*?)(?:\s)/,
            next: "start"
          },
          {
            token: "text",
            regex: /(?:)/,
            next: "start"
          }
      ],
      "quotedExpr": [
          {
            token: "text", // end of expression literal
            regex: /'/,
            next: "start"
          },
          {
            token: "string", // part of expression
            regex: /\S+\b/
          },
          {
            token: "text",
            regex: /\s+/
          }
      ]
    };
};

oop.inherits(MyNewHighlightRules, TextHighlightRules);

exports.MyNewHighlightRules = MyNewHighlightRules;

});
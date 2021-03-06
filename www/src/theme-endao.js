/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define('ace/theme/endao', ['require', 'exports', 'module' , 'ace/lib/dom'], function(require, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-endao";
exports.cssText = ".ace-endao .ace_gutter {\
background: #ebebeb;\
border-right: 1px solid rgb(159, 159, 159);\
color: rgb(136, 136, 136);\
}\
.ace-endao .ace_print-margin {\
width: 1px;\
background: #ebebeb;\
}\
.ace-endao {\
background-color: #FFFFFF;\
}\
.ace-endao .ace_fold {\
background-color: rgb(60, 76, 114);\
}\
.ace-endao .ace_cursor {\
border-left: 2px solid black;\
}\
.ace-endao .ace_storage,\
.ace-endao .ace_keyword, {\
color: rgb(127, 0, 85);\
}\
.ace-endao .ace_variable {\
color: rgb(0, 135, 173);\
}\
.ace-endao .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-endao .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-endao .ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-endao .ace_support.ace_function {\
color: rgb(0, 0, 255);\
}\
.ace-endao .ace_string {\
color: rgb(180, 17, 17);\
}\
.ace-endao .ace_string.ace_other {\
color: rgb(80, 80, 80);\
}\
.ace-endao .ace_comment {\
color: rgb(0, 108, 0);\
}\
.ace-endao .ace_comment.ace_doc {\
color: rgb(80, 120, 80);\
}\
.ace-endao .ace_comment.ace_doc.ace_tag {\
color: rgb(127, 159, 191);\
}\
.ace-endao .ace_constant.ace_numeric {\
color: black;\
}\
.ace-endao .ace_invalid {\
color: white;\
background-color: red;\
}\
.ace-endao .ace_tag {\
color: rgb(25, 118, 116);\
}\
.ace-endao .ace_type {\
color: rgb(127, 0, 127);\
}\
.ace-endao .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-endao .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-endao .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-endao .ace_meta.ace_tag {\
color:rgb(25, 118, 116);\
}\
.ace-endao .ace_invisible {\
color: #ddd;\
}\
.ace-endao .ace_entity.ace_other.ace_attribute-name {\
color:rgb(127, 0, 127);\
}\
.ace-endao .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0);\
}\
.ace-endao .ace_marker-layer .ace_active-line {\
background: rgb(232, 242, 254);\
}\
.ace-endao .ace_marker-layer .ace_selected-word {\
border: 1px solid rgb(181, 213, 255);\
}\
.ace-endao .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

define('ace/mode/d', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/d_highlight_rules', 'ace/mode/folding/cstyle'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var DHighlightRules = require("./d_highlight_rules").DHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    var highlighter = new DHighlightRules();
    this.foldingRules = new FoldMode();
    this.$tokenizer = new Tokenizer(highlighter.getRules());
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "/\\+";
    this.blockComment = {start: "/*", end: "*/"};
}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/d_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DHighlightRules = function() {

    this.$rules = { start: 
       [ { token: 'punctuation.definition.comment.d', regex: '/\\*\\*/' },
         { include: 'text.html.javadoc' },
         { token: 
            [ 'meta.definition.class.d',
              'storage.modifier.d',
              'storage.type.structure.d',
              'meta.definition.class.d',
              'entity.name.type.class.d',
              'meta.definition.class.d',
              'meta.definition.class.d',
              'storage.type.template.d',
              'meta.definition.class.d',
              'meta.definition.class.d',
              'meta.definition.class.d',
              'punctuation.separator.inheritance.d',
              'meta.definition.class.d',
              'entity.other.inherited-class.d',
              'meta.definition.class.d',
              'entity.other.inherited-class.d',
              'meta.definition.class.d',
              'entity.other.inherited-class.d',
              'meta.definition.class.d',
              'entity.other.inherited-class.d',
              'meta.definition.class.d',
              'entity.other.inherited-class.d',
              'meta.definition.class.d',
              'entity.other.inherited-class.d',
              'meta.definition.class.d',
              'entity.other.inherited-class.d' ],
           regex: '^(\\s*)((?:\\b(?:public|private|protected|static|final|native|synchronized|abstract|export)\\b\\s*)*)(class|interface)(\\s+)(\\w+)(\\s*)(?:(\\(\\s*)([^\\)]+)(\\s*\\))|)(\\s*)(?:(\\s*)(:)(\\s*)(\\w+)(?:(\\s*,\\s*)(\\w+))?(?:(\\s*,\\s*)(\\w+))?(?:(\\s*,\\s*)(\\w+))?(?:(\\s*,\\s*)(\\w+))?(?:(\\s*,\\s*)(\\w+))?(?:(\\s*,\\s*)(\\w+))?)?',
           push: 
            [ { token: 'meta.definition.class.d', regex: '(?={)', next: 'pop' },
              { token: 'storage.modifier.d',
                regex: '\\b(?:_|:)\\b',
                push: 
                 [ { token: [], regex: '(?={)', next: 'pop' },
                   { include: '#all-types' },
                   { defaultToken: 'meta.definition.class.extends.d' } ] },
              { defaultToken: 'meta.definition.class.d' } ] },
         { token: 
            [ 'meta.definition.struct.d',
              'storage.modifier.d',
              'storage.type.structure.d',
              'meta.definition.struct.d',
              'entity.name.type.struct.d',
              'meta.definition.struct.d',
              'meta.definition.struct.d',
              'storage.type.template.d',
              'meta.definition.struct.d',
              'meta.definition.struct.d' ],
           regex: '^(\\s*)((?:\\b(?:public|private|protected|static|final|native|synchronized|abstract|export)\\b\\s*)*)(struct)(\\s+)(\\w+)(\\s*)(?:(\\(\\s*)([^\\)]+)(\\s*\\))|)(\\s*)',
           push: 
            [ { token: 'meta.definition.struct.d',
                regex: '(?={)',
                next: 'pop' },
              { token: 'storage.modifier.d',
                regex: '\\b(?:_|:)\\b',
                push: 
                 [ { token: [], regex: '(?={)', next: 'pop' },
                   { include: '#all-types' },
                   { defaultToken: 'meta.definition.class.extends.d' } ] },
              { defaultToken: 'meta.definition.struct.d' } ] },
         { token: 
            [ 'meta.definition.constructor.d',
              'storage.modifier.d',
              'entity.name.function.constructor.d',
              'meta.definition.constructor.d' ],
           regex: '^(\\s*)((?:\\b(?:public|private|protected|static|final|native|synchronized|abstract|threadsafe|transient|export)\\b\\s*)*)(\\bthis)(\\s*)(?!.*;)(?=\\()' },
         { token: 
            [ 'storage.modifier.d',
              'entity.name.function.destructor.d',
              'meta.definition.destructor.d',
              'meta.definition.destructor.d' ],
           regex: '(?:^|)((?:\\b(?:public|private|protected|static|final|native|synchronized|abstract|threadsafe|transient|export)\\b\\s*)*)(~this)(\\s*)(\\()',
           TODO: '(?<!else|new|=) were disallowed in original regex'},
         { token: 
            [ 'meta.definition.method.d',
              'storage.modifier.d',
              'storage.type.structure.d',
              'meta.definition.method.d',
              'entity.name.function.d',
              'meta.definition.method.d' ],
           regex: '^(\\s*)((?:\\b(?:public|private|protected|static|final|native|lazy|synchronized|abstract|threadsafe|transient|export)\\b\\s*)*)(\\b(?:void|boolean|byte|char|short|int|float|long|double|[\\w_]+[\\w0-9_]*|(?:\\w+\\.)*[A-Z]\\w+)\\b(?:<(?:(?:\\w+\\.)*[A-Z]\\w+(?:\\s*,\\s*)?)+>|(?:\\[\\s*\\])*)?)(\\s*)(\\w+)(\\s*)(?!.*;)(?=\\()' },
         { token: 'constant.other.d', regex: '\\b[A-Z][A-Z0-9_]+\\b' },
         { include: '#comments' },
         { include: '#all-types' },
         { token: 'storage.modifier.access-control.d',
           regex: '\\b(?:private|protected|public|export)\\b' },
         { token: 'storage.modifier.d',
           regex: '\\b(?:auto|static|override|final|const|abstract|volatile|synchronized|lazy)\\b' },
         { token: 'storage.type.structure.d',
           regex: '\\b(?:template|interface|class|enum|struct|union)\\b' },
         { token: 'storage.type.d',
           regex: '\\b(?:ushort|int|uint|long|ulong|float|void|byte|ubyte|double|bit|char|wchar|ucent|cent|short|bool|dchar|real|ireal|ifloat|idouble|creal|cfloat|cdouble|lazy)\\b' },
         { token: 'keyword.control.exception.d',
           regex: '\\b(?:try|catch|finally|throw)\\b' },
         { token: 'keyword.control.d',
           regex: '\\b(?:return|break|case|continue|default|do|while|for|switch|if|else)\\b' },
         { token: 'keyword.control.conditional.d',
           regex: '\\b(?:if|else|switch|iftype)\\b' },
         { token: 'keyword.control.branch.d',
           regex: '\\b(?:goto|break|continue)\\b' },
         { token: 'keyword.control.repeat.d',
           regex: '\\b(?:while|for|do|foreach(?:_reverse)?)\\b' },
         { token: 'keyword.control.statement.d',
           regex: '\\b(?:version|return|with|invariant|body|scope|in|out|inout|asm|mixin|function|delegate)\\b' },
         { token: 'keyword.control.pragma.d', regex: '\\bpragma\\b' },
         { token: 'keyword.control.alias.d',
           regex: '\\b(?:alias|typedef)\\b' },
         { token: 'keyword.control.import.d', regex: '\\bimport\\b' },
         { token: 
            [ 'meta.module.d',
              'keyword.control.module.d',
              'meta.module.d',
              'entity.name.function.package.d',
              'meta.module.d' ],
           regex: '^(\\s*)(module)(\\s+)([^ ;]+?)(;)' },
         { token: 'constant.language.boolean.d',
           regex: '\\b(?:true|false)\\b' },
         { token: 'constant.language.d',
           regex: '\\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|null)\\b' },
         { token: 'variable.language.d', regex: '\\b(?:this|super)\\b' },
         { token: 'constant.numeric.d',
           regex: '\\b(?:0(?:x|X)[0-9a-fA-F]*|(?:[0-9]+\\.?[0-9]*|\\.[0-9]+)(?:(?:e|E)(?:\\+|-)?[0-9]+)?)(?:[LlFfUuDd]|UL|ul)?\\b' },
         { include: '#string_escaped_char' },
         { include: '#strings' },
         { token: 'keyword.operator.comparison.d',
           regex: '==|!=|<=|>=|<>|<|>' },
         { token: 'keyword.operator.increment-decrement.d',
           regex: '\\-\\-|\\+\\+' },
         { token: 'keyword.operator.arithmetic.d',
           regex: '\\-|\\+|\\*|\\/|~|%' },
         { token: 'keyword.operator.logical.d', regex: '!|&&|\\|\\|' },
         { token: 'keyword.operator.overload.d',
           regex: '\\b(?:opNeg|opCom|opPostInc|opPostDec|opCast|opAdd|opSub|opSub_r|opMul|opDiv|opDiv_r|opMod|opMod_r|opAnd|opOr|opXor|opShl|opShl_r|opShr|opShr_r|opUShr|opUShr_r|opCat|opCat_r|opEquals|opEquals|opCmp|opCmp|opCmp|opCmp|opAddAssign|opSubAssign|opMulAssign|opDivAssign|opModAssign|opAndAssign|opOrAssign|opXorAssign|opShlAssign|opShrAssign|opUShrAssign|opCatAssign|opIndex|opIndexAssign|opCall|opSlice|opSliceAssign|opPos|opAdd_r|opMul_r|opAnd_r|opOr_r|opXor_r)\\b' },
         { token: 'keyword.operator.d',
           regex: '\\b(?:new|delete|typeof|typeid|cast|align|is)\\b' },
         { token: 'keyword.other.class-fns.d',
           regex: '\\b(?:new|throws)\\b' },
         { token: 'keyword.other.external.d',
           regex: '\\b(?:package|extern)\\b' },
         { token: 'keyword.other.debug.d',
           regex: '\\b(?:deprecated|unittest|debug)\\b' },
         { token: 'support.type.sys-types.c',
           regex: '\\b(?:u_char|u_short|u_int|u_long|ushort|uint|u_quad_t|quad_t|qaddr_t|caddr_t|daddr_t|dev_t|fixpt_t|blkcnt_t|blksize_t|gid_t|in_addr_t|in_port_t|ino_t|key_t|mode_t|nlink_t|id_t|pid_t|off_t|segsz_t|swblk_t|uid_t|id_t|clock_t|size_t|ssize_t|time_t|useconds_t|suseconds_t)\\b' },
         { token: 'support.type.pthread.c',
           regex: '\\b(?:pthread_attr_t|pthread_cond_t|pthread_condattr_t|pthread_mutex_t|pthread_mutexattr_t|pthread_once_t|pthread_rwlock_t|pthread_rwlockattr_t|pthread_t|pthread_key_t)\\b' },
         { token: 'support.type.stdint.c',
           regex: '\\b(?:int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|int_least8_t|int_least16_t|int_least32_t|int_least64_t|uint_least8_t|uint_least16_t|uint_least32_t|uint_least64_t|int_fast8_t|int_fast16_t|int_fast32_t|int_fast64_t|uint_fast8_t|uint_fast16_t|uint_fast32_t|uint_fast64_t|intptr_t|uintptr_t|intmax_t|intmax_t|uintmax_t|uintmax_t)\\b' } ],
      '#all-types': 
       [ { include: '#support-type-built-ins-d' },
         { include: '#support-type-d' },
         { include: '#storage-type-d' } ],
      '#comments': 
       [ { token: 'punctuation.definition.comment.d',
           regex: '/\\*',
           push: 
            [ { token: 'punctuation.definition.comment.d',
                regex: '\\*/',
                next: 'pop' },
              { defaultToken: 'comment.block.d' } ] },
         { token: 'punctuation.definition.comment.d',
           regex: '/\\+',
           push: 
            [ { token: 'punctuation.definition.comment.d',
                regex: '\\+/',
                next: 'pop' },
              { defaultToken: 'comment.block.nested.d' } ] },
         { token: 
            [ 'punctuation.definition.comment.d',
              'comment.line.double-slash.d' ],
           regex: '(//)(.*$)' } ],
      '#constant_placeholder': 
       [ { token: 'constant.other.placeholder.d',
           regex: '%(?:\\([a-z_]+\\))?#?0?\\-?[ ]?\\+?(?:[0-9]*|\\*)(?:\\.(?:[0-9]*|\\*))?[hL]?[a-z%]',
           caseInsensitive: true } ],
      '#regular_expressions': [{token: "constant.character.escape", regex: "\\\\."}], //[ { include: 'source.regexp.python' } ],
      '#statement-remainder': 
       [ { token: 'meta.definition.param-list.d',
           regex: '\\(',
           push: 
            [ { token: 'meta.definition.param-list.d',
                regex: '(?=\\))',
                next: 'pop' },
              { include: '#all-types' },
              { defaultToken: 'meta.definition.param-list.d' } ] },
         { token: 'keyword.other.class-fns.d',
           regex: 'throws',
           push: 
            [ { token: [], regex: '(?={)', next: 'pop' },
              { include: '#all-types' },
              { defaultToken: 'meta.definition.throws.d' } ] } ],
      '#storage-type-d': 
       [ { token: 'storage.type.d',
           regex: '\\b(?:void|byte|short|char|int|long|float|double|boolean|(?:[a-z]\\w+\\.)*[A-Z]\\w+)\\b' } ],
      '#string_escaped_char': 
       [ { token: 'constant.character.escape.d',
           regex: '\\\\(?:\\\\|[abefnprtv\'"?]|[0-3]\\d{,2}|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|&\\w+;)' },
         { token: 'invalid.illegal.unknown-escape.d', regex: '\\\\.' } ],
      '#strings': 
       [ { token: 'punctuation.definition.string.begin.d',
           regex: '"',
           push: 
            [ { include: '#string_escaped_char' },
              { token: 'punctuation.definition.string.end.d',
                regex: '"',
                next: 'pop' },
              { defaultToken: 'string.quoted.double.d' } ] },
         { token: 
            [ 'storage.type.string.d',
              'punctuation.definition.string.begin.d' ],
           regex: '(r)(")',
           push: 
            [ { token: 'punctuation.definition.string.end.d',
                regex: '"',
                next: 'pop' },
              { include: '#regular_expressions' },
              { defaultToken: 'string.quoted.double.raw.d' } ] },
         { token: 'punctuation.definition.string.begin.d',
           regex: '`',
           push: 
            [ { token: 'punctuation.definition.string.end.d',
                regex: '`',
                next: 'pop' },
              { defaultToken: 'string.quoted.double.raw.backtick.d' } ] },
         { token: 'punctuation.definition.string.begin.d',
           regex: '\'',
           push: 
            [ { include: '#string_escaped_char' },
              { token: 'punctuation.definition.string.end.d',
                regex: '\'',
                next: 'pop' },
              { defaultToken: 'string.quoted.single.d' } ] } ],
      '#support-type-built-ins-classes-d': 
       [ { token: 'support.type.built-ins.classes.d',
           regex: '\\b(?:AbstractServer|ArchiveMember|ArgParser|Barrier|BomSniffer|Buffer|BufferInput|BufferOutput|BufferSlice|BufferedFile|BufferedStream|BzipInput|BzipOutput|CFile|CacheInvalidatee|CacheInvalidator|CacheServer|CacheThread|Certificate|CertificateStore|CertificateStoreCtx|ChunkInput|ChunkOutput|ClassInfo|Cluster|ClusterCache|ClusterQueue|ClusterThread|CmdParser|ComObject|Compress|Condition|Conduit|Cookie|CookieParser|CookieStack|CounterInput|CounterOutput|DataFileInput|DataFileOutput|DataInput|DataOutput|Database|DatagramConduit|DeviceConduit|DigestInput|DigestOutput|DocPrinter|Document|DummyInputStream|DummyOutputStream|EndianInput|EndianOutput|EndianProtocol|EndianStream|EventSeekInputStream|EventSeekOutputStream|FTPConnection|Fiber|Field|File|FileConduit|FileFolder|FileGroup|FileInput|FileOutput|FilePath|FileScan|FilterStream|Foo|FormatOutput|GreedyInput|GreedyOutput|Gregorian|GrowBuffer|HeapCopy|HeapSlice|Hierarchy|HttpClient|HttpCookies|HttpCookiesView|HttpGet|HttpHeaders|HttpHeadersView|HttpParams|HttpPost|HttpStack|HttpTokens|HttpTriplet|IPv4Address|IUnknown|InputFilter|InternetAddress|InternetHost|Layout|LineInput|LineIterator|LinkedFolder|Log|MapInput|MapOutput|MappedBuffer|Md2|Md4|MemoryQueue|MemoryStream|MmFile|MmFileStream|ModuleInfo|MulticastConduit|Mutex|NativeProtocol|NetCall|NetHost|NetworkAlert|NetworkCache|NetworkCall|NetworkClient|NetworkCombo|NetworkMessage|NetworkQueue|NetworkRegistry|NetworkTask|NotImplemented|Object|Observer|OutBuffer|OutputFilter|PersistQueue|Pipe|PipeConduit|Print|PrivateKey|Process|Properties|Protocol|ProtocolReader|ProtocolWriter|PublicKey|PullParser|QueueFile|QueueServer|QueueThread|QueuedCache|QuoteIterator|Random|Range|ReadWriteMutex|Reader|Record|RegExp|RegExpT|RegexIterator|RollCall|SSLCtx|SSLServerSocket|SSLSocketConduit|SaxParser|SelectionKey|Semaphore|ServerSocket|ServerThread|Service|SimpleIterator|SliceInputStream|SliceSeekInputStream|SliceSeekOutputStream|SliceStream|SnoopInput|SnoopOutput|Socket|SocketConduit|SocketListener|SocketSet|SocketStream|Sprint|Stream|StreamIterator|TArrayStream|TaskServer|TaskThread|TcpSocket|Telnet|TempFile|Text|TextFileInput|TextFileOutput|TextView|Thread|ThreadGroup|ThreadLocal|ThreadPool|Token|TypeInfo|TypeInfo_AC|TypeInfo_Aa|TypeInfo_Ab|TypeInfo_Ac|TypeInfo_Ad|TypeInfo_Ae|TypeInfo_Af|TypeInfo_Ag|TypeInfo_Ah|TypeInfo_Ai|TypeInfo_Aj|TypeInfo_Ak|TypeInfo_Al|TypeInfo_Am|TypeInfo_Ao|TypeInfo_Ap|TypeInfo_Aq|TypeInfo_Ar|TypeInfo_Array|TypeInfo_As|TypeInfo_AssociativeArray|TypeInfo_At|TypeInfo_Au|TypeInfo_Av|TypeInfo_Aw|TypeInfo_C|TypeInfo_Class|TypeInfo_D|TypeInfo_Delegate|TypeInfo_Enum|TypeInfo_Function|TypeInfo_Interface|TypeInfo_P|TypeInfo_Pointer|TypeInfo_StaticArray|TypeInfo_Struct|TypeInfo_Tuple|TypeInfo_Typedef|TypeInfo_a|TypeInfo_b|TypeInfo_c|TypeInfo_d|TypeInfo_e|TypeInfo_f|TypeInfo_g|TypeInfo_h|TypeInfo_i|TypeInfo_j|TypeInfo_k|TypeInfo_l|TypeInfo_m|TypeInfo_o|TypeInfo_p|TypeInfo_q|TypeInfo_r|TypeInfo_s|TypeInfo_t|TypeInfo_u|TypeInfo_v|TypeInfo_w|TypedInput|TypedOutput|URIerror|UdpSocket|UnCompress|UniText|UnicodeBom|UnicodeFile|UnknownAddress|Uri|UtfInput|UtfOutput|VirtualFolder|WrapSeekInputStream|WrapSeekOutputStream|Writer|XmlPrinter|ZipArchive|ZipBlockReader|ZipBlockWriter|ZipEntry|ZipEntryVerifier|ZipFile|ZipFileGroup|ZipFolder|ZipSubFolder|ZipSubFolderEntry|ZipSubFolderGroup|ZlibInput|ZlibOutput)\\b' } ],
      '#support-type-built-ins-d': 
       [ { include: '#support-type-built-ins-exceptions-d' },
         { include: '#support-type-built-ins-classes-d' },
         { include: '#support-type-built-ins-interfaces-d' },
         { include: '#support-type-built-ins-structs-d' } ],
      '#support-type-built-ins-exceptions-d': 
       [ { token: 'support.type.built-ins.exceptions.d',
           regex: '\\b(?:AddressException|ArrayBoundsError|ArrayBoundsException|AssertError|AssertException|Base64CharException|Base64Exception|BzipClosedException|BzipException|ClusterEmptyException|ClusterFullException|ConvError|ConvOverflowError|ConversionException|CorruptedIteratorException|DatabaseException|DateParseError|Exception|FTPException|FiberException|FileException|FinalizeException|FormatError|HostException|IOException|IllegalArgumentException|IllegalElementException|InvalidKeyException|InvalidTypeException|LocaleException|ModuleCtorError|NoSuchElementException|OpenException|OpenRJException|OutOfMemoryException|PlatformException|ProcessCreateException|ProcessException|ProcessForkException|ProcessKillException|ProcessWaitException|ReadException|RegExpException|RegexException|RegistryException|SeekException|SharedLibException|SocketAcceptException|SocketException|StdioException|StreamException|StreamFileException|StringException|SwitchError|SwitchException|SyncException|TextException|ThreadError|ThreadException|UnboxException|UnicodeException|UtfException|VariantTypeMismatchException|Win32Exception|WriteException|XmlException|ZipChecksumException|ZipException|ZipExhaustedException|ZipNotSupportedException|ZlibClosedException|ZlibException|OurUnwindException|SysError)\\b' } ],
      '#support-type-built-ins-interfaces-d': 
       [ { token: 'support.type.built-ins.interfaces.d',
           regex: '\\b(?:Buffered|HttpParamsView|ICache|IChannel|IClassFactory|ICluster|IConduit|IConsumer|IEvent|IHierarchy|ILevel|IListener|IMessage|IMessageLoader|IOStream|IReadable|ISelectable|ISelectionSet|ISelector|IServer|IUnknown|IWritable|IXmlPrinter|InputStream|OutputStream|PathView|VfsFile|VfsFiles|VfsFolder|VfsFolderEntry|VfsFolders|VfsHost|VfsSync|ZipReader|ZipWriter)\\b' } ],
      '#support-type-built-ins-structs-d': 
       [ { token: 'support.type.built-ins.structs.d',
           regex: '\\b(?:ABC|ABCFLOAT|ACCEL|ACCESSTIMEOUT|ACCESS_ALLOWED_ACE|ACCESS_DENIED_ACE|ACE_HEADER|ACL|ACL_REVISION_INFORMATION|ACL_SIZE_INFORMATION|ACTION_HEADER|ADAPTER_STATUS|ADDJOB_INFO_1|ANIMATIONINFO|APPBARDATA|Argument|Atomic|Attribute|BITMAP|BITMAPCOREHEADER|BITMAPCOREINFO|BITMAPINFO|BITMAPINFOHEADER|BITMAPV4HEADER|BLOB|BROWSEINFO|BY_HANDLE_FILE_INFORMATION|Bar|Baz|BitArray|Box|BracketResult|ByteSwap|CANDIDATEFORM|CANDIDATELIST|CBTACTIVATESTRUCT|CBT_CREATEWND|CHARFORMAT|CHARRANGE|CHARSET|CHARSETINFO|CHAR_INFO|CIDA|CIEXYZ|CIEXYZTRIPLE|CLIENTCREATESTRUCT|CMINVOKECOMMANDINFO|COLORADJUSTMENT|COLORMAP|COMMCONFIG|COMMPROP|COMMTIMEOUTS|COMPAREITEMSTRUCT|COMPCOLOR|COMPOSITIONFORM|COMSTAT|CONNECTDLGSTRUCT|CONSOLE_CURSOR_INFO|CONTEXT|CONVCONTEXT|CONVINFO|COORD|COPYDATASTRUCT|CPINFO|CPLINFO|CREATESTRUCT|CREATE_PROCESS_DEBUG_INFO|CREATE_THREAD_DEBUG_INFO|CRITICAL_SECTION|CRITICAL_SECTION_DEBUG|CURRENCYFMT|CURSORSHAPE|CWPRETSTRUCT|CWPSTRUCT|CharClass|CharRange|Clock|CodePage|Console|DATATYPES_INFO_1|DCB|DDEACK|DDEADVISE|DDEDATA|DDELN|DDEML_MSG_HOOK_DATA|DDEPOKE|DDEUP|DEBUGHOOKINFO|DEBUG_EVENT|DELETEITEMSTRUCT|DEVMODE|DEVNAMES|DEV_BROADCAST_HDR|DEV_BROADCAST_OEM|DEV_BROADCAST_PORT|DEV_BROADCAST_VOLUME|DIBSECTION|DIR|DISCDLGSTRUCT|DISK_GEOMETRY|DISK_PERFORMANCE|DOCINFO|DOC_INFO_1|DOC_INFO_2|DRAGLISTINFO|DRAWITEMSTRUCT|DRAWTEXTPARAMS|DRIVER_INFO_1|DRIVER_INFO_2|DRIVER_INFO_3|DRIVE_LAYOUT_INFORMATION|Date|DateParse|DateTime|DirEntry|DynArg|EDITSTREAM|EMPTYRECORD|EMR|EMRABORTPATH|EMRANGLEARC|EMRARC|EMRBITBLT|EMRCREATEBRUSHINDIRECT|EMRCREATECOLORSPACE|EMRCREATEDIBPATTERNBRUSHPT|EMRCREATEMONOBRUSH|EMRCREATEPALETTE|EMRCREATEPEN|EMRELLIPSE|EMREOF|EMREXCLUDECLIPRECT|EMREXTCREATEFONTINDIRECTW|EMREXTCREATEPEN|EMREXTFLOODFILL|EMREXTSELECTCLIPRGN|EMREXTTEXTOUTA|EMRFILLPATH|EMRFILLRGN|EMRFORMAT|EMRFRAMERGN|EMRGDICOMMENT|EMRINVERTRGN|EMRLINETO|EMRMASKBLT|EMRMODIFYWORLDTRANSFORM|EMROFFSETCLIPRGN|EMRPLGBLT|EMRPOLYDRAW|EMRPOLYDRAW16|EMRPOLYLINE|EMRPOLYLINE16|EMRPOLYPOLYLINE|EMRPOLYPOLYLINE16|EMRPOLYTEXTOUTA|EMRRESIZEPALETTE|EMRRESTOREDC|EMRROUNDRECT|EMRSCALEVIEWPORTEXTEX|EMRSELECTCLIPPATH|EMRSELECTCOLORSPACE|EMRSELECTOBJECT|EMRSELECTPALETTE|EMRSETARCDIRECTION|EMRSETBKCOLOR|EMRSETCOLORADJUSTMENT|EMRSETDIBITSTODEVICE|EMRSETMAPPERFLAGS|EMRSETMITERLIMIT|EMRSETPALETTEENTRIES|EMRSETPIXELV|EMRSETVIEWPORTEXTEX|EMRSETVIEWPORTORGEX|EMRSETWORLDTRANSFORM|EMRSTRETCHBLT|EMRSTRETCHDIBITS|EMRTEXT|ENCORRECTTEXT|ENDROPFILES|ENHMETAHEADER|ENHMETARECORD|ENOLEOPFAILED|ENPROTECTED|ENSAVECLIPBOARD|ENUMLOGFONT|ENUMLOGFONTEX|ENUM_SERVICE_STATUS|EVENTLOGRECORD|EVENTMSG|EXCEPTION_DEBUG_INFO|EXCEPTION_POINTERS|EXCEPTION_RECORD|EXIT_PROCESS_DEBUG_INFO|EXIT_THREAD_DEBUG_INFO|EXTLOGFONT|EXTLOGPEN|EXT_BUTTON|EmptySlot|EndOfCDRecord|Environment|FILETIME|FILTERKEYS|FINDREPLACE|FINDTEXTEX|FIND_NAME_BUFFER|FIND_NAME_HEADER|FIXED|FLOATING_SAVE_AREA|FMS_GETDRIVEINFO|FMS_GETFILESEL|FMS_LOAD|FMS_TOOLBARLOAD|FOCUS_EVENT_RECORD|FONTSIGNATURE|FORMATRANGE|FORMAT_PARAMETERS|FORM_INFO_1|FileConst|FileHeader|FileRoots|FileSystem|FoldingCaseData|Foo|FtpConnectionDetail|FtpFeature|FtpFileInfo|FtpResponse|GC|GCP_RESULTS|GCStats|GENERIC_MAPPING|GLYPHMETRICS|GLYPHMETRICSFLOAT|GROUP_INFO_2|GUID|HANDLETABLE|HD_HITTESTINFO|HD_ITEM|HD_LAYOUT|HD_NOTIFY|HELPINFO|HELPWININFO|HIGHCONTRAST|HSZPAIR|HeaderElement|HttpConst|HttpHeader|HttpHeaderName|HttpResponses|HttpStatus|HttpToken|ICONINFO|ICONMETRICS|IMAGEINFO|IMAGE_DOS_HEADER|INPUT_RECORD|ITEMIDLIST|IeeeFlags|Interface|JOB_INFO_1|JOB_INFO_2|KERNINGPAIR|LANA_ENUM|LAYERPLANEDESCRIPTOR|LDT_ENTRY|LIST_ENTRY|LOAD_DLL_DEBUG_INFO|LOCALESIGNATURE|LOCALGROUP_INFO_0|LOCALGROUP_MEMBERS_INFO_0|LOCALGROUP_MEMBERS_INFO_3|LOGBRUSH|LOGCOLORSPACE|LOGFONT|LOGFONTA|LOGFONTW|LOGPALETTE|LOGPEN|LUID_AND_ATTRIBUTES|LV_COLUMN|LV_DISPINFO|LV_FINDINFO|LV_HITTESTINFO|LV_ITEM|LV_KEYDOWN|LocalFileHeader|MAT2|MD5_CTX|MDICREATESTRUCT|MEASUREITEMSTRUCT|MEMORYSTATUS|MEMORY_BASIC_INFORMATION|MENUEX_TEMPLATE_HEADER|MENUEX_TEMPLATE_ITEM|MENUITEMINFO|MENUITEMTEMPLATE|MENUITEMTEMPLATEHEADER|MENUTEMPLATE|MENU_EVENT_RECORD|METAFILEPICT|METARECORD|MINIMIZEDMETRICS|MINMAXINFO|MODEMDEVCAPS|MODEMSETTINGS|MONCBSTRUCT|MONCONVSTRUCT|MONERRSTRUCT|MONHSZSTRUCT|MONITOR_INFO_1|MONITOR_INFO_2|MONLINKSTRUCT|MONMSGSTRUCT|MOUSEHOOKSTRUCT|MOUSEKEYS|MOUSE_EVENT_RECORD|MSG|MSGBOXPARAMS|MSGFILTER|MULTIKEYHELP|NAME_BUFFER|NCB|NCCALCSIZE_PARAMS|NDDESHAREINFO|NETCONNECTINFOSTRUCT|NETINFOSTRUCT|NETRESOURCE|NEWCPLINFO|NEWTEXTMETRIC|NEWTEXTMETRICEX|NMHDR|NM_LISTVIEW|NM_TREEVIEW|NM_UPDOWNW|NONCLIENTMETRICS|NS_SERVICE_INFO|NUMBERFMT|OFNOTIFY|OFSTRUCT|OPENFILENAME|OPENFILENAMEA|OPENFILENAMEW|OSVERSIONINFO|OUTLINETEXTMETRIC|OUTPUT_DEBUG_STRING_INFO|OVERLAPPED|OffsetTypeInfo|PAINTSTRUCT|PALETTEENTRY|PANOSE|PARAFORMAT|PARTITION_INFORMATION|PERF_COUNTER_BLOCK|PERF_COUNTER_DEFINITION|PERF_DATA_BLOCK|PERF_INSTANCE_DEFINITION|PERF_OBJECT_TYPE|PIXELFORMATDESCRIPTOR|POINT|POINTFLOAT|POINTFX|POINTL|POINTS|POLYTEXT|PORT_INFO_1|PORT_INFO_2|PREVENT_MEDIA_REMOVAL|PRINTER_DEFAULTS|PRINTER_INFO_1|PRINTER_INFO_2|PRINTER_INFO_3|PRINTER_INFO_4|PRINTER_INFO_5|PRINTER_NOTIFY_INFO|PRINTER_NOTIFY_INFO_DATA|PRINTER_NOTIFY_OPTIONS|PRINTER_NOTIFY_OPTIONS_TYPE|PRINTPROCESSOR_INFO_1|PRIVILEGE_SET|PROCESS_HEAPENTRY|PROCESS_INFORMATION|PROPSHEETHEADER|PROPSHEETHEADER_U1|PROPSHEETHEADER_U2|PROPSHEETHEADER_U3|PROPSHEETPAGE|PROPSHEETPAGE_U1|PROPSHEETPAGE_U2|PROTOCOL_INFO|PROVIDOR_INFO_1|PSHNOTIFY|PUNCTUATION|PassByCopy|PassByRef|Phase1Info|PropertyConfigurator|QUERY_SERVICE_CONFIG|QUERY_SERVICE_LOCK_STATUS|RASAMB|RASCONN|RASCONNSTATUS|RASDIALEXTENSIONS|RASDIALPARAMS|RASENTRYNAME|RASPPPIP|RASPPPIPX|RASPPPNBF|RASTERIZER_STATUS|REASSIGN_BLOCKS|RECT|RECTL|REMOTE_NAME_INFO|REPASTESPECIAL|REQRESIZE|RGBQUAD|RGBTRIPLE|RGNDATA|RGNDATAHEADER|RIP_INFO|Runtime|SCROLLINFO|SECURITY_ATTRIBUTES|SECURITY_DESCRIPTOR|SECURITY_QUALITY_OF_SERVICE|SELCHANGE|SERIALKEYS|SERVICE_ADDRESS|SERVICE_ADDRESSES|SERVICE_INFO|SERVICE_STATUS|SERVICE_TABLE_ENTRY|SERVICE_TYPE_INFO_ABS|SERVICE_TYPE_VALUE_ABS|SESSION_BUFFER|SESSION_HEADER|SET_PARTITION_INFORMATION|SHFILEINFO|SHFILEOPSTRUCT|SHITEMID|SHNAMEMAPPING|SID|SID_AND_ATTRIBUTES|SID_IDENTIFIER_AUTHORITY|SINGLE_LIST_ENTRY|SIZE|SMALL_RECT|SOUNDSENTRY|STARTUPINFO|STICKYKEYS|STRRET|STYLEBUF|STYLESTRUCT|SYSTEMTIME|SYSTEM_AUDIT_ACE|SYSTEM_INFO|SYSTEM_INFO_U|SYSTEM_POWER_STATUS|Signal|SjLj_Function_Context|SpecialCaseData|TAPE_ERASE|TAPE_GET_DRIVE_PARAMETERS|TAPE_GET_MEDIA_PARAMETERS|TAPE_GET_POSITION|TAPE_PREPARE|TAPE_SET_DRIVE_PARAMETERS|TAPE_SET_MEDIA_PARAMETERS|TAPE_SET_POSITION|TAPE_WRITE_MARKS|TBADDBITMAP|TBBUTTON|TBNOTIFY|TBSAVEPARAMS|TCHOOSECOLOR|TCHOOSEFONT|TC_HITTESTINFO|TC_ITEM|TC_ITEMHEADER|TC_KEYDOWN|TEXTMETRIC|TEXTMETRICA|TEXTRANGE|TFINDTEXT|TIME_ZONE_INFORMATION|TOGGLEKEYS|TOKEN_CONTROL|TOKEN_DEFAULT_DACL|TOKEN_GROUPS|TOKEN_OWNER|TOKEN_PRIMARY_GROUP|TOKEN_PRIVILEGES|TOKEN_SOURCE|TOKEN_STATISTICS|TOKEN_USER|TOOLINFO|TOOLTIPTEXT|TPAGESETUPDLG|TPMPARAMS|TRANSMIT_FILE_BUFFERS|TREEITEM|TSMALLPOINT|TTHITTESTINFO|TTPOLYCURVE|TTPOLYGONHEADER|TVARIANT|TV_DISPINFO|TV_HITTESTINFO|TV_INSERTSTRUCT|TV_ITEM|TV_KEYDOWN|TV_SORTCB|Time|TimeOfDay|TimeSpan|Tuple|UDACCEL|ULARGE_INTEGER|UNIVERSAL_NAME_INFO|UNLOAD_DLL_DEBUG_INFO|USEROBJECTFLAGS|USER_INFO_0|USER_INFO_2|USER_INFO_3|UnicodeData|VALENT|VA_LIST|VERIFY_INFORMATION|VS_FIXEDFILEINFO|Variant|VfsFilterInfo|WIN32_FILE_ATTRIBUTE_DATA|WIN32_FIND_DATA|WIN32_FIND_DATAW|WIN32_STREAM_ID|WINDOWINFO|WINDOWPLACEMENT|WINDOWPOS|WINDOW_BUFFER_SIZE_RECORD|WNDCLASS|WNDCLASSA|WNDCLASSEX|WNDCLASSEXA|WSADATA|WallClock|XFORM|ZipEntryInfo)\\b' } ],
      '#support-type-d': 
       [ { token: 'support.type.d',
           regex: '\\b(?:tango|std)\\.[\\w\\.]+\\b' } ] }
    
    this.normalizeRules();
};

DHighlightRules.metaData = { comment: 'D language',
      fileTypes: [ 'd', 'di' ],
      firstLineMatch: '^#!.*\\bg?dmd\\b.',
      foldingStartMarker: '(?x)/\\*\\*(?!\\*)|^(?![^{]*?//|[^{]*?/\\*(?!.*?\\*/.*?\\{)).*?\\{\\s*($|//|/\\*(?!.*?\\*/.*\\S))',
      foldingStopMarker: '(?<!\\*)\\*\\*/|^\\s*\\}',
      keyEquivalent: '^~D',
      name: 'D',
      scopeName: 'source.d' }


oop.inherits(DHighlightRules, TextHighlightRules);

exports.DHighlightRules = DHighlightRules;
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

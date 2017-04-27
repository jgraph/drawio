mirrors∂Ç
(function(a,b){
"use strict";
var c=a.Array;
var d=a.isNaN;
var e=a.JSON.stringify;
var f;
var g;
var h=b.ImportNow("promise_state_symbol");
var i=b.ImportNow("promise_result_symbol");
var j;
var k;
b.Import(function(l){
f=l.MapEntries;
g=l.MapIteratorNext;
j=l.SetIteratorNext;
k=l.SetValues;
});
var m={
UNDEFINED_TYPE:'undefined',
NULL_TYPE:'null',
BOOLEAN_TYPE:'boolean',
NUMBER_TYPE:'number',
STRING_TYPE:'string',
SYMBOL_TYPE:'symbol',
OBJECT_TYPE:'object',
FUNCTION_TYPE:'function',
REGEXP_TYPE:'regexp',
ERROR_TYPE:'error',
PROPERTY_TYPE:'property',
INTERNAL_PROPERTY_TYPE:'internalProperty',
FRAME_TYPE:'frame',
SCRIPT_TYPE:'script',
CONTEXT_TYPE:'context',
SCOPE_TYPE:'scope',
PROMISE_TYPE:'promise',
MAP_TYPE:'map',
SET_TYPE:'set',
ITERATOR_TYPE:'iterator',
GENERATOR_TYPE:'generator',
}
var n=0;
var o=-1;
var p=[];
var q=true;
function MirrorCacheIsEmpty(){
return n==0&&p.length==0;
}
function ToggleMirrorCache(r){
q=r;
ClearMirrorCache();
}
function ClearMirrorCache(r){
n=0;
p=[];
}
function ObjectIsPromise(r){
return(%_IsJSReceiver(r))&&
!(%DebugGetProperty(r,h)===(void 0));
}
function MakeMirror(r,s){
var t;
if(!s&&q){
for(var u in p){
t=p[u];
if(t.value()===r){
return t;
}
if(t.isNumber()&&d(t.value())&&
typeof r=='number'&&d(r)){
return t;
}
}
}
if((r===(void 0))){
t=new UndefinedMirror();
}else if((r===null)){
t=new NullMirror();
}else if((typeof(r)==='boolean')){
t=new BooleanMirror(r);
}else if((typeof(r)==='number')){
t=new NumberMirror(r);
}else if((typeof(r)==='string')){
t=new StringMirror(r);
}else if((typeof(r)==='symbol')){
t=new SymbolMirror(r);
}else if((%_IsArray(r))){
t=new ArrayMirror(r);
}else if((%IsDate(r))){
t=new DateMirror(r);
}else if((%IsFunction(r))){
t=new FunctionMirror(r);
}else if((%_IsRegExp(r))){
t=new RegExpMirror(r);
}else if((%_ClassOf(r)==='Error')){
t=new ErrorMirror(r);
}else if((%_ClassOf(r)==='Script')){
t=new ScriptMirror(r);
}else if((%_ClassOf(r)==='Map')||(%_ClassOf(r)==='WeakMap')){
t=new MapMirror(r);
}else if((%_ClassOf(r)==='Set')||(%_ClassOf(r)==='WeakSet')){
t=new SetMirror(r);
}else if((%_ClassOf(r)==='Map Iterator')||(%_ClassOf(r)==='Set Iterator')){
t=new IteratorMirror(r);
}else if(ObjectIsPromise(r)){
t=new PromiseMirror(r);
}else if((%_ClassOf(r)==='Generator')){
t=new GeneratorMirror(r);
}else{
t=new ObjectMirror(r,m.OBJECT_TYPE,s);
}
if(q)p[t.handle()]=t;
return t;
}
function LookupMirror(v){
if(!q){
throw %make_error(2,"Mirror cache is disabled");
}
return p[v];
}
function GetUndefinedMirror(){
return MakeMirror((void 0));
}
function inherits(w,x){
var y=function(){};
y.prototype=x.prototype;
w.super_=x.prototype;
w.prototype=new y();
w.prototype.constructor=w;
}
var z=80;
var A={};
A.Data=0;
A.DataConstant=2;
A.AccessorConstant=3;
var B={};
B.None=0;
B.ReadOnly=1;
B.DontEnum=2;
B.DontDelete=4;
var C={Global:0,
Local:1,
With:2,
Closure:3,
Catch:4,
Block:5,
Script:6,
Eval:7,
Module:8,
};
function Mirror(D){
this.type_=D;
}
Mirror.prototype.type=function(){
return this.type_;
};
Mirror.prototype.isValue=function(){
return this instanceof ValueMirror;
};
Mirror.prototype.isUndefined=function(){
return this instanceof UndefinedMirror;
};
Mirror.prototype.isNull=function(){
return this instanceof NullMirror;
};
Mirror.prototype.isBoolean=function(){
return this instanceof BooleanMirror;
};
Mirror.prototype.isNumber=function(){
return this instanceof NumberMirror;
};
Mirror.prototype.isString=function(){
return this instanceof StringMirror;
};
Mirror.prototype.isSymbol=function(){
return this instanceof SymbolMirror;
};
Mirror.prototype.isObject=function(){
return this instanceof ObjectMirror;
};
Mirror.prototype.isFunction=function(){
return this instanceof FunctionMirror;
};
Mirror.prototype.isUnresolvedFunction=function(){
return this instanceof UnresolvedFunctionMirror;
};
Mirror.prototype.isArray=function(){
return this instanceof ArrayMirror;
};
Mirror.prototype.isDate=function(){
return this instanceof DateMirror;
};
Mirror.prototype.isRegExp=function(){
return this instanceof RegExpMirror;
};
Mirror.prototype.isError=function(){
return this instanceof ErrorMirror;
};
Mirror.prototype.isPromise=function(){
return this instanceof PromiseMirror;
};
Mirror.prototype.isGenerator=function(){
return this instanceof GeneratorMirror;
};
Mirror.prototype.isProperty=function(){
return this instanceof PropertyMirror;
};
Mirror.prototype.isInternalProperty=function(){
return this instanceof InternalPropertyMirror;
};
Mirror.prototype.isFrame=function(){
return this instanceof FrameMirror;
};
Mirror.prototype.isScript=function(){
return this instanceof ScriptMirror;
};
Mirror.prototype.isContext=function(){
return this instanceof ContextMirror;
};
Mirror.prototype.isScope=function(){
return this instanceof ScopeMirror;
};
Mirror.prototype.isMap=function(){
return this instanceof MapMirror;
};
Mirror.prototype.isSet=function(){
return this instanceof SetMirror;
};
Mirror.prototype.isIterator=function(){
return this instanceof IteratorMirror;
};
Mirror.prototype.allocateHandle_=function(){
if(q)this.handle_=n++;
};
Mirror.prototype.allocateTransientHandle_=function(){
this.handle_=o--;
};
Mirror.prototype.toText=function(){
return"#<"+this.constructor.name+">";
};
function ValueMirror(D,r,E){
%_Call(Mirror,this,D);
this.value_=r;
if(!E){
this.allocateHandle_();
}else{
this.allocateTransientHandle_();
}
}
inherits(ValueMirror,Mirror);
Mirror.prototype.handle=function(){
return this.handle_;
};
ValueMirror.prototype.isPrimitive=function(){
var D=this.type();
return D==='undefined'||
D==='null'||
D==='boolean'||
D==='number'||
D==='string'||
D==='symbol';
};
ValueMirror.prototype.value=function(){
return this.value_;
};
function UndefinedMirror(){
%_Call(ValueMirror,this,m.UNDEFINED_TYPE,(void 0));
}
inherits(UndefinedMirror,ValueMirror);
UndefinedMirror.prototype.toText=function(){
return'undefined';
};
function NullMirror(){
%_Call(ValueMirror,this,m.NULL_TYPE,null);
}
inherits(NullMirror,ValueMirror);
NullMirror.prototype.toText=function(){
return'null';
};
function BooleanMirror(r){
%_Call(ValueMirror,this,m.BOOLEAN_TYPE,r);
}
inherits(BooleanMirror,ValueMirror);
BooleanMirror.prototype.toText=function(){
return this.value_?'true':'false';
};
function NumberMirror(r){
%_Call(ValueMirror,this,m.NUMBER_TYPE,r);
}
inherits(NumberMirror,ValueMirror);
NumberMirror.prototype.toText=function(){
return %_NumberToString(this.value_);
};
function StringMirror(r){
%_Call(ValueMirror,this,m.STRING_TYPE,r);
}
inherits(StringMirror,ValueMirror);
StringMirror.prototype.length=function(){
return this.value_.length;
};
StringMirror.prototype.getTruncatedValue=function(F){
if(F!=-1&&this.length()>F){
return this.value_.substring(0,F)+
'... (length: '+this.length()+')';
}
return this.value_;
};
StringMirror.prototype.toText=function(){
return this.getTruncatedValue(z);
};
function SymbolMirror(r){
%_Call(ValueMirror,this,m.SYMBOL_TYPE,r);
}
inherits(SymbolMirror,ValueMirror);
SymbolMirror.prototype.description=function(){
return %SymbolDescription(%ValueOf(this.value_));
}
SymbolMirror.prototype.toText=function(){
return %SymbolDescriptiveString(%ValueOf(this.value_));
}
function ObjectMirror(r,D,E){
D=D||m.OBJECT_TYPE;
%_Call(ValueMirror,this,D,r,E);
}
inherits(ObjectMirror,ValueMirror);
ObjectMirror.prototype.className=function(){
return %_ClassOf(this.value_);
};
ObjectMirror.prototype.constructorFunction=function(){
return MakeMirror(%DebugGetProperty(this.value_,'constructor'));
};
ObjectMirror.prototype.prototypeObject=function(){
return MakeMirror(%DebugGetProperty(this.value_,'prototype'));
};
ObjectMirror.prototype.protoObject=function(){
return MakeMirror(%DebugGetPrototype(this.value_));
};
ObjectMirror.prototype.hasNamedInterceptor=function(){
var G=%GetInterceptorInfo(this.value_);
return(G&2)!=0;
};
ObjectMirror.prototype.hasIndexedInterceptor=function(){
var G=%GetInterceptorInfo(this.value_);
return(G&1)!=0;
};
ObjectMirror.prototype.propertyNames=function(){
return %GetOwnPropertyKeys(this.value_,0);
};
ObjectMirror.prototype.properties=function(){
var H=this.propertyNames();
var I=new c(H.length);
for(var J=0;J<H.length;J++){
I[J]=this.property(H[J]);
}
return I;
};
ObjectMirror.prototype.internalProperties=function(){
return ObjectMirror.GetInternalProperties(this.value_);
}
ObjectMirror.prototype.property=function(K){
var L=%DebugGetPropertyDetails(this.value_,K);
if(L){
return new PropertyMirror(this,K,L);
}
return GetUndefinedMirror();
};
ObjectMirror.prototype.lookupProperty=function(r){
var I=this.properties();
for(var J=0;J<I.length;J++){
var M=I[J];
if(M.propertyType()!=A.AccessorConstant){
if(M.value_===r.value_){
return M;
}
}
}
return GetUndefinedMirror();
};
ObjectMirror.prototype.referencedBy=function(N){
var O=%DebugReferencedBy(this.value_,
Mirror.prototype,N||0);
for(var J=0;J<O.length;J++){
O[J]=MakeMirror(O[J]);
}
return O;
};
ObjectMirror.prototype.toText=function(){
var K;
var w=this.constructorFunction();
if(!w.isFunction()){
K=this.className();
}else{
K=w.name();
if(!K){
K=this.className();
}
}
return'#<'+K+'>';
};
ObjectMirror.GetInternalProperties=function(r){
var I=%DebugGetInternalProperties(r);
var O=[];
for(var J=0;J<I.length;J+=2){
O.push(new InternalPropertyMirror(I[J],I[J+1]));
}
return O;
}
function FunctionMirror(r){
%_Call(ObjectMirror,this,r,m.FUNCTION_TYPE);
this.resolved_=true;
}
inherits(FunctionMirror,ObjectMirror);
FunctionMirror.prototype.resolved=function(){
return this.resolved_;
};
FunctionMirror.prototype.name=function(){
return %FunctionGetName(this.value_);
};
FunctionMirror.prototype.debugName=function(){
return %FunctionGetDebugName(this.value_);
}
FunctionMirror.prototype.inferredName=function(){
return %FunctionGetInferredName(this.value_);
};
FunctionMirror.prototype.source=function(){
if(this.resolved()){
return %FunctionToString(this.value_);
}
};
FunctionMirror.prototype.script=function(){
if(this.resolved()){
if(this.script_){
return this.script_;
}
var P=%FunctionGetScript(this.value_);
if(P){
return this.script_=MakeMirror(P);
}
}
};
FunctionMirror.prototype.sourcePosition_=function(){
if(this.resolved()){
return %FunctionGetScriptSourcePosition(this.value_);
}
};
FunctionMirror.prototype.sourceLocation=function(){
if(this.resolved()){
var P=this.script();
if(P){
return P.locationFromPosition(this.sourcePosition_(),true);
}
}
};
FunctionMirror.prototype.constructedBy=function(Q){
if(this.resolved()){
var O=%DebugConstructedBy(this.value_,Q||0);
for(var J=0;J<O.length;J++){
O[J]=MakeMirror(O[J]);
}
return O;
}else{
return[];
}
};
FunctionMirror.prototype.scopeCount=function(){
if(this.resolved()){
if((this.scopeCount_===(void 0))){
this.scopeCount_=%GetFunctionScopeCount(this.value());
}
return this.scopeCount_;
}else{
return 0;
}
};
FunctionMirror.prototype.scope=function(R){
if(this.resolved()){
return new ScopeMirror((void 0),this,(void 0),R);
}
};
FunctionMirror.prototype.toText=function(){
return this.source();
};
FunctionMirror.prototype.context=function(){
if(this.resolved()){
if(!this._context)
this._context=new ContextMirror(%FunctionGetContextData(this.value_));
return this._context;
}
};
function UnresolvedFunctionMirror(r){
%_Call(ValueMirror,this,m.FUNCTION_TYPE,r);
this.propertyCount_=0;
this.elementCount_=0;
this.resolved_=false;
}
inherits(UnresolvedFunctionMirror,FunctionMirror);
UnresolvedFunctionMirror.prototype.className=function(){
return'Function';
};
UnresolvedFunctionMirror.prototype.constructorFunction=function(){
return GetUndefinedMirror();
};
UnresolvedFunctionMirror.prototype.prototypeObject=function(){
return GetUndefinedMirror();
};
UnresolvedFunctionMirror.prototype.protoObject=function(){
return GetUndefinedMirror();
};
UnresolvedFunctionMirror.prototype.name=function(){
return this.value_;
};
UnresolvedFunctionMirror.prototype.debugName=function(){
return this.value_;
};
UnresolvedFunctionMirror.prototype.inferredName=function(){
return(void 0);
};
UnresolvedFunctionMirror.prototype.propertyNames=function(S,T){
return[];
};
function ArrayMirror(r){
%_Call(ObjectMirror,this,r);
}
inherits(ArrayMirror,ObjectMirror);
ArrayMirror.prototype.length=function(){
return this.value_.length;
};
ArrayMirror.prototype.indexedPropertiesFromRange=function(opt_from_index,
opt_to_index){
var U=opt_from_index||0;
var V=opt_to_index||this.length()-1;
if(U>V)return new c();
var W=new c(V-U+1);
for(var J=U;J<=V;J++){
var L=%DebugGetPropertyDetails(this.value_,(%_ToString(J)));
var r;
if(L){
r=new PropertyMirror(this,J,L);
}else{
r=GetUndefinedMirror();
}
W[J-U]=r;
}
return W;
};
function DateMirror(r){
%_Call(ObjectMirror,this,r);
}
inherits(DateMirror,ObjectMirror);
DateMirror.prototype.toText=function(){
var X=e(this.value_);
return X.substring(1,X.length-1);
};
function RegExpMirror(r){
%_Call(ObjectMirror,this,r,m.REGEXP_TYPE);
}
inherits(RegExpMirror,ObjectMirror);
RegExpMirror.prototype.source=function(){
return this.value_.source;
};
RegExpMirror.prototype.global=function(){
return this.value_.global;
};
RegExpMirror.prototype.ignoreCase=function(){
return this.value_.ignoreCase;
};
RegExpMirror.prototype.multiline=function(){
return this.value_.multiline;
};
RegExpMirror.prototype.sticky=function(){
return this.value_.sticky;
};
RegExpMirror.prototype.unicode=function(){
return this.value_.unicode;
};
RegExpMirror.prototype.toText=function(){
return"/"+this.source()+"/";
};
function ErrorMirror(r){
%_Call(ObjectMirror,this,r,m.ERROR_TYPE);
}
inherits(ErrorMirror,ObjectMirror);
ErrorMirror.prototype.message=function(){
return this.value_.message;
};
ErrorMirror.prototype.toText=function(){
var Y;
try{
Y=%ErrorToString(this.value_);
}catch(e){
Y='#<Error>';
}
return Y;
};
function PromiseMirror(r){
%_Call(ObjectMirror,this,r,m.PROMISE_TYPE);
}
inherits(PromiseMirror,ObjectMirror);
function PromiseGetStatus_(r){
var Z=%DebugGetProperty(r,h);
if(Z==0)return"pending";
if(Z==1)return"resolved";
return"rejected";
}
function PromiseGetValue_(r){
return %DebugGetProperty(r,i);
}
PromiseMirror.prototype.status=function(){
return PromiseGetStatus_(this.value_);
};
PromiseMirror.prototype.promiseValue=function(){
return MakeMirror(PromiseGetValue_(this.value_));
};
function MapMirror(r){
%_Call(ObjectMirror,this,r,m.MAP_TYPE);
}
inherits(MapMirror,ObjectMirror);
MapMirror.prototype.entries=function(aa){
var O=[];
if((%_ClassOf(this.value_)==='WeakMap')){
var ab=%GetWeakMapEntries(this.value_,aa||0);
for(var J=0;J<ab.length;J+=2){
O.push({
key:ab[J],
value:ab[J+1]
});
}
return O;
}
var ac=%_Call(f,this.value_);
var ad;
while((!aa||O.length<aa)&&
!(ad=ac.next()).done){
O.push({
key:ad.value[0],
value:ad.value[1]
});
}
return O;
};
function SetMirror(r){
%_Call(ObjectMirror,this,r,m.SET_TYPE);
}
inherits(SetMirror,ObjectMirror);
function IteratorGetValues_(ac,ae,aa){
var O=[];
var ad;
while((!aa||O.length<aa)&&
!(ad=%_Call(ae,ac)).done){
O.push(ad.value);
}
return O;
}
SetMirror.prototype.values=function(aa){
if((%_ClassOf(this.value_)==='WeakSet')){
return %GetWeakSetValues(this.value_,aa||0);
}
var ac=%_Call(k,this.value_);
return IteratorGetValues_(ac,j,aa);
};
function IteratorMirror(r){
%_Call(ObjectMirror,this,r,m.ITERATOR_TYPE);
}
inherits(IteratorMirror,ObjectMirror);
IteratorMirror.prototype.preview=function(aa){
if((%_ClassOf(this.value_)==='Map Iterator')){
return IteratorGetValues_(%MapIteratorClone(this.value_),
g,
aa);
}else if((%_ClassOf(this.value_)==='Set Iterator')){
return IteratorGetValues_(%SetIteratorClone(this.value_),
j,
aa);
}
};
function GeneratorMirror(r){
%_Call(ObjectMirror,this,r,m.GENERATOR_TYPE);
}
inherits(GeneratorMirror,ObjectMirror);
function GeneratorGetStatus_(r){
var af=%GeneratorGetContinuation(r);
if(af<-1)return"running";
if(af==-1)return"closed";
return"suspended";
}
GeneratorMirror.prototype.status=function(){
return GeneratorGetStatus_(this.value_);
};
GeneratorMirror.prototype.sourcePosition_=function(){
return %GeneratorGetSourcePosition(this.value_);
};
GeneratorMirror.prototype.sourceLocation=function(){
var ag=this.sourcePosition_();
if(!(ag===(void 0))){
var P=this.func().script();
if(P){
return P.locationFromPosition(ag,true);
}
}
};
GeneratorMirror.prototype.func=function(){
if(!this.func_){
this.func_=MakeMirror(%GeneratorGetFunction(this.value_));
}
return this.func_;
};
GeneratorMirror.prototype.receiver=function(){
if(!this.receiver_){
this.receiver_=MakeMirror(%GeneratorGetReceiver(this.value_));
}
return this.receiver_;
};
GeneratorMirror.prototype.scopeCount=function(){
return %GetGeneratorScopeCount(this.value());
};
GeneratorMirror.prototype.scope=function(R){
return new ScopeMirror((void 0),(void 0),this,R);
};
GeneratorMirror.prototype.allScopes=function(){
var ah=[];
for(let J=0;J<this.scopeCount();J++){
ah.push(this.scope(J));
}
return ah;
};
function PropertyMirror(t,K,L){
%_Call(Mirror,this,m.PROPERTY_TYPE);
this.mirror_=t;
this.name_=K;
this.value_=L[0];
this.details_=L[1];
this.is_interceptor_=L[2];
if(L.length>3){
this.exception_=L[3];
this.getter_=L[4];
this.setter_=L[5];
}
}
inherits(PropertyMirror,Mirror);
PropertyMirror.prototype.isReadOnly=function(){
return(this.attributes()&B.ReadOnly)!=0;
};
PropertyMirror.prototype.isEnum=function(){
return(this.attributes()&B.DontEnum)==0;
};
PropertyMirror.prototype.canDelete=function(){
return(this.attributes()&B.DontDelete)==0;
};
PropertyMirror.prototype.name=function(){
return this.name_;
};
PropertyMirror.prototype.toText=function(){
if((typeof(this.name_)==='symbol'))return %SymbolDescriptiveString(this.name_);
return this.name_;
};
PropertyMirror.prototype.isIndexed=function(){
for(var J=0;J<this.name_.length;J++){
if(this.name_[J]<'0'||'9'<this.name_[J]){
return false;
}
}
return true;
};
PropertyMirror.prototype.value=function(){
return MakeMirror(this.value_,false);
};
PropertyMirror.prototype.isException=function(){
return this.exception_?true:false;
};
PropertyMirror.prototype.attributes=function(){
return %DebugPropertyAttributesFromDetails(this.details_);
};
PropertyMirror.prototype.propertyType=function(){
return %DebugPropertyTypeFromDetails(this.details_);
};
PropertyMirror.prototype.hasGetter=function(){
return this.getter_?true:false;
};
PropertyMirror.prototype.hasSetter=function(){
return this.setter_?true:false;
};
PropertyMirror.prototype.getter=function(){
if(this.hasGetter()){
return MakeMirror(this.getter_);
}else{
return GetUndefinedMirror();
}
};
PropertyMirror.prototype.setter=function(){
if(this.hasSetter()){
return MakeMirror(this.setter_);
}else{
return GetUndefinedMirror();
}
};
PropertyMirror.prototype.isNative=function(){
return this.is_interceptor_||
((this.propertyType()==A.AccessorConstant)&&
!this.hasGetter()&&!this.hasSetter());
};
function InternalPropertyMirror(K,r){
%_Call(Mirror,this,m.INTERNAL_PROPERTY_TYPE);
this.name_=K;
this.value_=r;
}
inherits(InternalPropertyMirror,Mirror);
InternalPropertyMirror.prototype.name=function(){
return this.name_;
};
InternalPropertyMirror.prototype.value=function(){
return MakeMirror(this.value_,false);
};
var ai=0;
var aj=1;
var ak=2;
var al=3;
var am=4;
var an=5;
var ao=6;
var ap=7;
var aq=8;
var ar=9;
var as=10;
var at=0;
var au=1;
var av=2;
var aw=1<<0;
var ax=1<<1;
var ay=7<<2;
function FrameDetails(az,R){
this.break_id_=az;
this.details_=%GetFrameDetails(az,R);
}
FrameDetails.prototype.frameId=function(){
%CheckExecutionState(this.break_id_);
return this.details_[ai];
};
FrameDetails.prototype.receiver=function(){
%CheckExecutionState(this.break_id_);
return this.details_[aj];
};
FrameDetails.prototype.func=function(){
%CheckExecutionState(this.break_id_);
return this.details_[ak];
};
FrameDetails.prototype.script=function(){
%CheckExecutionState(this.break_id_);
return this.details_[al];
};
FrameDetails.prototype.isConstructCall=function(){
%CheckExecutionState(this.break_id_);
return this.details_[ap];
};
FrameDetails.prototype.isAtReturn=function(){
%CheckExecutionState(this.break_id_);
return this.details_[aq];
};
FrameDetails.prototype.isDebuggerFrame=function(){
%CheckExecutionState(this.break_id_);
var aA=aw;
return(this.details_[ar]&aA)==aA;
};
FrameDetails.prototype.isOptimizedFrame=function(){
%CheckExecutionState(this.break_id_);
var aA=ax;
return(this.details_[ar]&aA)==aA;
};
FrameDetails.prototype.isInlinedFrame=function(){
return this.inlinedFrameIndex()>0;
};
FrameDetails.prototype.inlinedFrameIndex=function(){
%CheckExecutionState(this.break_id_);
var aA=ay;
return(this.details_[ar]&aA)>>2;
};
FrameDetails.prototype.argumentCount=function(){
%CheckExecutionState(this.break_id_);
return this.details_[am];
};
FrameDetails.prototype.argumentName=function(R){
%CheckExecutionState(this.break_id_);
if(R>=0&&R<this.argumentCount()){
return this.details_[as+
R*av+
at];
}
};
FrameDetails.prototype.argumentValue=function(R){
%CheckExecutionState(this.break_id_);
if(R>=0&&R<this.argumentCount()){
return this.details_[as+
R*av+
au];
}
};
FrameDetails.prototype.localCount=function(){
%CheckExecutionState(this.break_id_);
return this.details_[an];
};
FrameDetails.prototype.sourcePosition=function(){
%CheckExecutionState(this.break_id_);
return this.details_[ao];
};
FrameDetails.prototype.localName=function(R){
%CheckExecutionState(this.break_id_);
if(R>=0&&R<this.localCount()){
var aB=as+
this.argumentCount()*av;
return this.details_[aB+
R*av+
at];
}
};
FrameDetails.prototype.localValue=function(R){
%CheckExecutionState(this.break_id_);
if(R>=0&&R<this.localCount()){
var aB=as+
this.argumentCount()*av;
return this.details_[aB+
R*av+
au];
}
};
FrameDetails.prototype.returnValue=function(){
%CheckExecutionState(this.break_id_);
var aC=
as+
(this.argumentCount()+this.localCount())*av;
if(this.details_[aq]){
return this.details_[aC];
}
};
FrameDetails.prototype.scopeCount=function(){
if((this.scopeCount_===(void 0))){
this.scopeCount_=%GetScopeCount(this.break_id_,this.frameId());
}
return this.scopeCount_;
};
function FrameMirror(az,R){
%_Call(Mirror,this,m.FRAME_TYPE);
this.break_id_=az;
this.index_=R;
this.details_=new FrameDetails(az,R);
}
inherits(FrameMirror,Mirror);
FrameMirror.prototype.details=function(){
return this.details_;
};
FrameMirror.prototype.index=function(){
return this.index_;
};
FrameMirror.prototype.func=function(){
if(this.func_){
return this.func_;
}
var aA=this.details_.func();
if((%IsFunction(aA))){
return this.func_=MakeMirror(aA);
}else{
return new UnresolvedFunctionMirror(aA);
}
};
FrameMirror.prototype.script=function(){
if(!this.script_){
this.script_=MakeMirror(this.details_.script());
}
return this.script_;
}
FrameMirror.prototype.receiver=function(){
return MakeMirror(this.details_.receiver());
};
FrameMirror.prototype.isConstructCall=function(){
return this.details_.isConstructCall();
};
FrameMirror.prototype.isAtReturn=function(){
return this.details_.isAtReturn();
};
FrameMirror.prototype.isDebuggerFrame=function(){
return this.details_.isDebuggerFrame();
};
FrameMirror.prototype.isOptimizedFrame=function(){
return this.details_.isOptimizedFrame();
};
FrameMirror.prototype.isInlinedFrame=function(){
return this.details_.isInlinedFrame();
};
FrameMirror.prototype.inlinedFrameIndex=function(){
return this.details_.inlinedFrameIndex();
};
FrameMirror.prototype.argumentCount=function(){
return this.details_.argumentCount();
};
FrameMirror.prototype.argumentName=function(R){
return this.details_.argumentName(R);
};
FrameMirror.prototype.argumentValue=function(R){
return MakeMirror(this.details_.argumentValue(R));
};
FrameMirror.prototype.localCount=function(){
return this.details_.localCount();
};
FrameMirror.prototype.localName=function(R){
return this.details_.localName(R);
};
FrameMirror.prototype.localValue=function(R){
return MakeMirror(this.details_.localValue(R));
};
FrameMirror.prototype.returnValue=function(){
return MakeMirror(this.details_.returnValue());
};
FrameMirror.prototype.sourcePosition=function(){
return this.details_.sourcePosition();
};
FrameMirror.prototype.sourceLocation=function(){
var P=this.script();
if(P){
return P.locationFromPosition(this.sourcePosition(),true);
}
};
FrameMirror.prototype.sourceLine=function(){
var aD=this.sourceLocation();
if(aD){
return aD.line;
}
};
FrameMirror.prototype.sourceColumn=function(){
var aD=this.sourceLocation();
if(aD){
return aD.column;
}
};
FrameMirror.prototype.sourceLineText=function(){
var aD=this.sourceLocation();
if(aD){
return aD.sourceText;
}
};
FrameMirror.prototype.scopeCount=function(){
return this.details_.scopeCount();
};
FrameMirror.prototype.scope=function(R){
return new ScopeMirror(this,(void 0),(void 0),R);
};
FrameMirror.prototype.allScopes=function(aE){
var aF=%GetAllScopesDetails(this.break_id_,
this.details_.frameId(),
this.details_.inlinedFrameIndex(),
!!aE);
var O=[];
for(var J=0;J<aF.length;++J){
O.push(new ScopeMirror(this,(void 0),(void 0),J,
aF[J]));
}
return O;
};
FrameMirror.prototype.evaluate=function(source,disable_break,
opt_context_object){
return MakeMirror(%DebugEvaluate(this.break_id_,
this.details_.frameId(),
this.details_.inlinedFrameIndex(),
source,
(!!(disable_break)),
opt_context_object));
};
FrameMirror.prototype.invocationText=function(){
var O='';
var aG=this.func();
var aH=this.receiver();
if(this.isConstructCall()){
O+='new ';
O+=aG.name()?aG.name():'[anonymous]';
}else if(this.isDebuggerFrame()){
O+='[debugger]';
}else{
var aI=
!aH.className||(aH.className()!='global');
if(aI){
O+=aH.toText();
}
var M=GetUndefinedMirror();
if(aH.isObject()){
for(var aJ=aH;
!aJ.isNull()&&M.isUndefined();
aJ=aJ.protoObject()){
M=aJ.lookupProperty(aG);
}
}
if(!M.isUndefined()){
if(!M.isIndexed()){
if(aI){
O+='.';
}
O+=M.toText();
}else{
O+='[';
O+=M.toText();
O+=']';
}
if(aG.name()&&aG.name()!=M.name()){
O+='(aka '+aG.name()+')';
}
}else{
if(aI){
O+='.';
}
O+=aG.name()?aG.name():'[anonymous]';
}
}
if(!this.isDebuggerFrame()){
O+='(';
for(var J=0;J<this.argumentCount();J++){
if(J!=0)O+=', ';
if(this.argumentName(J)){
O+=this.argumentName(J);
O+='=';
}
O+=this.argumentValue(J).toText();
}
O+=')';
}
if(this.isAtReturn()){
O+=' returning ';
O+=this.returnValue().toText();
}
return O;
};
FrameMirror.prototype.sourceAndPositionText=function(){
var O='';
var aG=this.func();
if(aG.resolved()){
var P=aG.script();
if(P){
if(P.name()){
O+=P.name();
}else{
O+='[unnamed]';
}
if(!this.isDebuggerFrame()){
var aD=this.sourceLocation();
O+=' line ';
O+=!(aD===(void 0))?(aD.line+1):'?';
O+=' column ';
O+=!(aD===(void 0))?(aD.column+1):'?';
if(!(this.sourcePosition()===(void 0))){
O+=' (position '+(this.sourcePosition()+1)+')';
}
}
}else{
O+='[no source]';
}
}else{
O+='[unresolved]';
}
return O;
};
FrameMirror.prototype.localsText=function(){
var O='';
var aK=this.localCount();
if(aK>0){
for(var J=0;J<aK;++J){
O+='      var ';
O+=this.localName(J);
O+=' = ';
O+=this.localValue(J).toText();
if(J<aK-1)O+='\n';
}
}
return O;
};
FrameMirror.prototype.restart=function(){
var O=%LiveEditRestartFrame(this.break_id_,this.index_);
if((O===(void 0))){
O="Failed to find requested frame";
}
return O;
};
FrameMirror.prototype.toText=function(aL){
var O='';
O+='#'+(this.index()<=9?'0':'')+this.index();
O+=' ';
O+=this.invocationText();
O+=' ';
O+=this.sourceAndPositionText();
if(aL){
O+='\n';
O+=this.localsText();
}
return O;
};
var aM=0;
var aN=1;
var aO=2;
var aP=3;
var aQ=4;
var aR=5;
function ScopeDetails(aS,aT,aU,R,aV){
if(aS){
this.break_id_=aS.break_id_;
this.details_=aV||
%GetScopeDetails(aS.break_id_,
aS.details_.frameId(),
aS.details_.inlinedFrameIndex(),
R);
this.frame_id_=aS.details_.frameId();
this.inlined_frame_id_=aS.details_.inlinedFrameIndex();
}else if(aT){
this.details_=aV||%GetFunctionScopeDetails(aT.value(),R);
this.fun_value_=aT.value();
this.break_id_=(void 0);
}else{
this.details_=
aV||%GetGeneratorScopeDetails(aU.value(),R);
this.gen_value_=aU.value();
this.break_id_=(void 0);
}
this.index_=R;
}
ScopeDetails.prototype.type=function(){
if(!(this.break_id_===(void 0))){
%CheckExecutionState(this.break_id_);
}
return this.details_[aM];
};
ScopeDetails.prototype.object=function(){
if(!(this.break_id_===(void 0))){
%CheckExecutionState(this.break_id_);
}
return this.details_[aN];
};
ScopeDetails.prototype.name=function(){
if(!(this.break_id_===(void 0))){
%CheckExecutionState(this.break_id_);
}
return this.details_[aO];
};
ScopeDetails.prototype.startPosition=function(){
if(!(this.break_id_===(void 0))){
%CheckExecutionState(this.break_id_);
}
return this.details_[aP];
}
ScopeDetails.prototype.endPosition=function(){
if(!(this.break_id_===(void 0))){
%CheckExecutionState(this.break_id_);
}
return this.details_[aQ];
}
ScopeDetails.prototype.func=function(){
if(!(this.break_id_===(void 0))){
%CheckExecutionState(this.break_id_);
}
return this.details_[aR];
}
ScopeDetails.prototype.setVariableValueImpl=function(K,aW){
var aX;
if(!(this.break_id_===(void 0))){
%CheckExecutionState(this.break_id_);
aX=%SetScopeVariableValue(this.break_id_,this.frame_id_,
this.inlined_frame_id_,this.index_,K,aW);
}else if(!(this.fun_value_===(void 0))){
aX=%SetScopeVariableValue(this.fun_value_,null,null,this.index_,
K,aW);
}else{
aX=%SetScopeVariableValue(this.gen_value_,null,null,this.index_,
K,aW);
}
if(!aX)throw %make_error(2,"Failed to set variable value");
};
function ScopeMirror(aS,aT,aU,R,aV){
%_Call(Mirror,this,m.SCOPE_TYPE);
if(aS){
this.frame_index_=aS.index_;
}else{
this.frame_index_=(void 0);
}
this.scope_index_=R;
this.details_=new ScopeDetails(aS,aT,aU,R,aV);
}
inherits(ScopeMirror,Mirror);
ScopeMirror.prototype.details=function(){
return this.details_;
};
ScopeMirror.prototype.frameIndex=function(){
return this.frame_index_;
};
ScopeMirror.prototype.scopeIndex=function(){
return this.scope_index_;
};
ScopeMirror.prototype.scopeType=function(){
return this.details_.type();
};
ScopeMirror.prototype.scopeObject=function(){
var E=this.scopeType()==C.Local||
this.scopeType()==C.Closure||
this.scopeType()==C.Script;
return MakeMirror(this.details_.object(),E);
};
ScopeMirror.prototype.setVariableValue=function(K,aW){
this.details_.setVariableValueImpl(K,aW);
};
function ScriptMirror(P){
%_Call(Mirror,this,m.SCRIPT_TYPE);
this.script_=P;
this.context_=new ContextMirror(P.context_data);
this.allocateHandle_();
}
inherits(ScriptMirror,Mirror);
ScriptMirror.prototype.value=function(){
return this.script_;
};
ScriptMirror.prototype.name=function(){
return this.script_.name||this.script_.nameOrSourceURL();
};
ScriptMirror.prototype.id=function(){
return this.script_.id;
};
ScriptMirror.prototype.source=function(){
return this.script_.source;
};
ScriptMirror.prototype.setSource=function(aY){
if(!(typeof(aY)==='string'))throw %make_error(2,"Source is not a string");
%DebugSetScriptSource(this.script_,aY);
};
ScriptMirror.prototype.lineOffset=function(){
return this.script_.line_offset;
};
ScriptMirror.prototype.columnOffset=function(){
return this.script_.column_offset;
};
ScriptMirror.prototype.data=function(){
return this.script_.data;
};
ScriptMirror.prototype.scriptType=function(){
return this.script_.type;
};
ScriptMirror.prototype.compilationType=function(){
return this.script_.compilation_type;
};
ScriptMirror.prototype.lineCount=function(){
return %ScriptLineCount(this.script_);
};
ScriptMirror.prototype.locationFromPosition=function(
position,include_resource_offset){
return this.script_.locationFromPosition(position,include_resource_offset);
};
ScriptMirror.prototype.context=function(){
return this.context_;
};
ScriptMirror.prototype.evalFromScript=function(){
return MakeMirror(this.script_.eval_from_script);
};
ScriptMirror.prototype.evalFromFunctionName=function(){
return MakeMirror(this.script_.eval_from_function_name);
};
ScriptMirror.prototype.evalFromLocation=function(){
var aZ=this.evalFromScript();
if(!aZ.isUndefined()){
var ba=this.script_.eval_from_script_position;
return aZ.locationFromPosition(ba,true);
}
};
ScriptMirror.prototype.toText=function(){
var O='';
O+=this.name();
O+=' (lines: ';
if(this.lineOffset()>0){
O+=this.lineOffset();
O+='-';
O+=this.lineOffset()+this.lineCount()-1;
}else{
O+=this.lineCount();
}
O+=')';
return O;
};
function ContextMirror(bb){
%_Call(Mirror,this,m.CONTEXT_TYPE);
this.data_=bb;
this.allocateHandle_();
}
inherits(ContextMirror,Mirror);
ContextMirror.prototype.data=function(){
return this.data_;
};
function MakeMirrorSerializer(L,bc){
return new JSONProtocolSerializer(L,bc);
}
function JSONProtocolSerializer(L,bc){
this.details_=L;
this.options_=bc;
this.mirrors_=[];
}
JSONProtocolSerializer.prototype.serializeReference=function(t){
return this.serialize_(t,true,true);
};
JSONProtocolSerializer.prototype.serializeValue=function(t){
var bd=this.serialize_(t,false,true);
return bd;
};
JSONProtocolSerializer.prototype.serializeReferencedObjects=function(){
var be=[];
var bf=this.mirrors_.length;
for(var J=0;J<bf;J++){
be.push(this.serialize_(this.mirrors_[J],false,false));
}
return be;
};
JSONProtocolSerializer.prototype.includeSource_=function(){
return this.options_&&this.options_.includeSource;
};
JSONProtocolSerializer.prototype.inlineRefs_=function(){
return this.options_&&this.options_.inlineRefs;
};
JSONProtocolSerializer.prototype.maxStringLength_=function(){
if((this.options_===(void 0))||
(this.options_.maxStringLength===(void 0))){
return z;
}
return this.options_.maxStringLength;
};
JSONProtocolSerializer.prototype.add_=function(t){
for(var J=0;J<this.mirrors_.length;J++){
if(this.mirrors_[J]===t){
return;
}
}
this.mirrors_.push(t);
};
JSONProtocolSerializer.prototype.serializeReferenceWithDisplayData_=
function(t){
var bg={};
bg.ref=t.handle();
bg.type=t.type();
switch(t.type()){
case m.UNDEFINED_TYPE:
case m.NULL_TYPE:
case m.BOOLEAN_TYPE:
case m.NUMBER_TYPE:
bg.value=t.value();
break;
case m.STRING_TYPE:
bg.value=t.getTruncatedValue(this.maxStringLength_());
break;
case m.SYMBOL_TYPE:
bg.description=t.description();
break;
case m.FUNCTION_TYPE:
bg.name=t.name();
bg.inferredName=t.inferredName();
if(t.script()){
bg.scriptId=t.script().id();
}
break;
case m.ERROR_TYPE:
case m.REGEXP_TYPE:
bg.value=t.toText();
break;
case m.OBJECT_TYPE:
bg.className=t.className();
break;
}
return bg;
};
JSONProtocolSerializer.prototype.serialize_=function(t,reference,
L){
if(reference&&
(t.isValue()||t.isScript()||t.isContext())){
if(this.inlineRefs_()&&t.isValue()){
return this.serializeReferenceWithDisplayData_(t);
}else{
this.add_(t);
return{'ref':t.handle()};
}
}
var be={};
if(t.isValue()||t.isScript()||t.isContext()){
be.handle=t.handle();
}
be.type=t.type();
switch(t.type()){
case m.UNDEFINED_TYPE:
case m.NULL_TYPE:
break;
case m.BOOLEAN_TYPE:
be.value=t.value();
break;
case m.NUMBER_TYPE:
be.value=NumberToJSON_(t.value());
break;
case m.STRING_TYPE:
if(this.maxStringLength_()!=-1&&
t.length()>this.maxStringLength_()){
var bh=t.getTruncatedValue(this.maxStringLength_());
be.value=bh;
be.fromIndex=0;
be.toIndex=this.maxStringLength_();
}else{
be.value=t.value();
}
be.length=t.length();
break;
case m.SYMBOL_TYPE:
be.description=t.description();
break;
case m.OBJECT_TYPE:
case m.FUNCTION_TYPE:
case m.ERROR_TYPE:
case m.REGEXP_TYPE:
case m.PROMISE_TYPE:
case m.GENERATOR_TYPE:
this.serializeObject_(t,be,L);
break;
case m.PROPERTY_TYPE:
case m.INTERNAL_PROPERTY_TYPE:
throw %make_error(2,
'PropertyMirror cannot be serialized independently');
break;
case m.FRAME_TYPE:
this.serializeFrame_(t,be);
break;
case m.SCOPE_TYPE:
this.serializeScope_(t,be);
break;
case m.SCRIPT_TYPE:
if(t.name()){
be.name=t.name();
}
be.id=t.id();
be.lineOffset=t.lineOffset();
be.columnOffset=t.columnOffset();
be.lineCount=t.lineCount();
if(t.data()){
be.data=t.data();
}
if(this.includeSource_()){
be.source=t.source();
}else{
var bi=t.source().substring(0,80);
be.sourceStart=bi;
}
be.sourceLength=t.source().length;
be.scriptType=t.scriptType();
be.compilationType=t.compilationType();
if(t.compilationType()==1&&
t.evalFromScript()){
be.evalFromScript=
this.serializeReference(t.evalFromScript());
var bj=t.evalFromLocation();
if(bj){
be.evalFromLocation={line:bj.line,
column:bj.column};
}
if(t.evalFromFunctionName()){
be.evalFromFunctionName=t.evalFromFunctionName();
}
}
if(t.context()){
be.context=this.serializeReference(t.context());
}
break;
case m.CONTEXT_TYPE:
be.data=t.data();
break;
}
be.text=t.toText();
return be;
};
JSONProtocolSerializer.prototype.serializeObject_=function(t,be,
L){
be.className=t.className();
be.constructorFunction=
this.serializeReference(t.constructorFunction());
be.protoObject=this.serializeReference(t.protoObject());
be.prototypeObject=this.serializeReference(t.prototypeObject());
if(t.hasNamedInterceptor()){
be.namedInterceptor=true;
}
if(t.hasIndexedInterceptor()){
be.indexedInterceptor=true;
}
if(t.isFunction()){
be.name=t.name();
if(!(t.inferredName()===(void 0))){
be.inferredName=t.inferredName();
}
be.resolved=t.resolved();
if(t.resolved()){
be.source=t.source();
}
if(t.script()){
be.script=this.serializeReference(t.script());
be.scriptId=t.script().id();
serializeLocationFields(t.sourceLocation(),be);
}
be.scopes=[];
for(var J=0;J<t.scopeCount();J++){
var bk=t.scope(J);
be.scopes.push({
type:bk.scopeType(),
index:J
});
}
}
if(t.isGenerator()){
be.status=t.status();
be.func=this.serializeReference(t.func())
be.receiver=this.serializeReference(t.receiver())
serializeLocationFields(t.sourceLocation(),be);
}
if(t.isDate()){
be.value=t.value();
}
if(t.isPromise()){
be.status=t.status();
be.promiseValue=this.serializeReference(t.promiseValue());
}
var I=t.propertyNames();
for(var J=0;J<I.length;J++){
var bl=t.property(I[J]);
I[J]=this.serializeProperty_(bl);
if(L){
this.add_(bl.value());
}
}
be.properties=I;
var bm=t.internalProperties();
if(bm.length>0){
var bn=[];
for(var J=0;J<bm.length;J++){
bn.push(this.serializeInternalProperty_(bm[J]));
}
be.internalProperties=bn;
}
};
function serializeLocationFields(aD,be){
if(!aD){
return;
}
be.position=aD.position;
var bo=aD.line;
if(!(bo===(void 0))){
be.line=bo;
}
var bp=aD.column;
if(!(bp===(void 0))){
be.column=bp;
}
}
JSONProtocolSerializer.prototype.serializeProperty_=function(bl){
var O={};
O.name=bl.name();
var bq=bl.value();
if(this.inlineRefs_()&&bq.isValue()){
O.value=this.serializeReferenceWithDisplayData_(bq);
}else{
if(bl.attributes()!=B.None){
O.attributes=bl.attributes();
}
O.propertyType=bl.propertyType();
O.ref=bq.handle();
}
return O;
};
JSONProtocolSerializer.prototype.serializeInternalProperty_=
function(bl){
var O={};
O.name=bl.name();
var bq=bl.value();
if(this.inlineRefs_()&&bq.isValue()){
O.value=this.serializeReferenceWithDisplayData_(bq);
}else{
O.ref=bq.handle();
}
return O;
};
JSONProtocolSerializer.prototype.serializeFrame_=function(t,be){
be.index=t.index();
be.receiver=this.serializeReference(t.receiver());
var aG=t.func();
be.func=this.serializeReference(aG);
var P=aG.script();
if(P){
be.script=this.serializeReference(P);
}
be.constructCall=t.isConstructCall();
be.atReturn=t.isAtReturn();
if(t.isAtReturn()){
be.returnValue=this.serializeReference(t.returnValue());
}
be.debuggerFrame=t.isDebuggerFrame();
var G=new c(t.argumentCount());
for(var J=0;J<t.argumentCount();J++){
var br={};
var bs=t.argumentName(J);
if(bs){
br.name=bs;
}
br.value=this.serializeReference(t.argumentValue(J));
G[J]=br;
}
be.arguments=G;
var G=new c(t.localCount());
for(var J=0;J<t.localCount();J++){
var bt={};
bt.name=t.localName(J);
bt.value=this.serializeReference(t.localValue(J));
G[J]=bt;
}
be.locals=G;
serializeLocationFields(t.sourceLocation(),be);
var bu=t.sourceLineText();
if(!(bu===(void 0))){
be.sourceLineText=bu;
}
be.scopes=[];
for(var J=0;J<t.scopeCount();J++){
var bk=t.scope(J);
be.scopes.push({
type:bk.scopeType(),
index:J
});
}
};
JSONProtocolSerializer.prototype.serializeScope_=function(t,be){
be.index=t.scopeIndex();
be.frameIndex=t.frameIndex();
be.type=t.scopeType();
be.object=this.inlineRefs_()?
this.serializeValue(t.scopeObject()):
this.serializeReference(t.scopeObject());
};
function NumberToJSON_(r){
if(d(r)){
return'NaN';
}
if(!(%_IsSmi(%IS_VAR(r))||((r==r)&&(r!=1/0)&&(r!=-1/0)))){
if(r>0){
return'Infinity';
}else{
return'-Infinity';
}
}
return r;
}
b.InstallFunctions(a,2,[
"MakeMirror",MakeMirror,
"MakeMirrorSerializer",MakeMirrorSerializer,
"LookupMirror",LookupMirror,
"ToggleMirrorCache",ToggleMirrorCache,
"MirrorCacheIsEmpty",MirrorCacheIsEmpty,
]);
b.InstallConstants(a,[
"ScopeType",C,
"PropertyType",A,
"PropertyAttribute",B,
"Mirror",Mirror,
"ValueMirror",ValueMirror,
"UndefinedMirror",UndefinedMirror,
"NullMirror",NullMirror,
"BooleanMirror",BooleanMirror,
"NumberMirror",NumberMirror,
"StringMirror",StringMirror,
"SymbolMirror",SymbolMirror,
"ObjectMirror",ObjectMirror,
"FunctionMirror",FunctionMirror,
"UnresolvedFunctionMirror",UnresolvedFunctionMirror,
"ArrayMirror",ArrayMirror,
"DateMirror",DateMirror,
"RegExpMirror",RegExpMirror,
"ErrorMirror",ErrorMirror,
"PromiseMirror",PromiseMirror,
"MapMirror",MapMirror,
"SetMirror",SetMirror,
"IteratorMirror",IteratorMirror,
"GeneratorMirror",GeneratorMirror,
"PropertyMirror",PropertyMirror,
"InternalPropertyMirror",InternalPropertyMirror,
"FrameMirror",FrameMirror,
"ScriptMirror",ScriptMirror,
"ScopeMirror",ScopeMirror,
"FrameDetails",FrameDetails,
]);
b.InstallFunctions(b,2,[
"ClearMirrorCache",ClearMirrorCache
]);
b.Export(function(bv){
bv.MirrorType=m;
});
})

debugzb
(function(a,b){
"use strict";
var c=a.FrameMirror;
var d=a.Array;
var e=a.RegExp;
var f=a.isNaN;
var g=a.JSON.parse;
var h=a.JSON.stringify;
var i=a.LookupMirror;
var j=a.MakeMirror;
var k=a.MakeMirrorSerializer;
var l=a.Math.min;
var m=a.Mirror;
var n;
var o=a.parseInt;
var p=a.ValueMirror;
b.Import(function(q){
n=q.MirrorType;
});
var r=10;
var s={};
var t=/^(?:\s*(?:\/\*.*?\*\/)*)*/;
s.DebugEvent={Break:1,
Exception:2,
NewFunction:3,
BeforeCompile:4,
AfterCompile:5,
CompileError:6,
AsyncTaskEvent:7};
s.ExceptionBreak={Caught:0,
Uncaught:1};
s.StepAction={StepOut:0,
StepNext:1,
StepIn:2,
StepFrame:3};
s.ScriptType={Native:0,
Extension:1,
Normal:2,
Wasm:3};
s.ScriptCompilationType={Host:0,
Eval:1,
JSON:2};
s.ScriptBreakPointType={ScriptId:0,
ScriptName:1,
ScriptRegExp:2};
s.BreakPositionAlignment={
Statement:0,
BreakPosition:1
};
function ScriptTypeFlag(u){
return(1<<u);
}
var v=0;
var w=1;
var x=[];
var y=[];
var z={
breakPointsActive:{
value:true,
getValue:function(){return this.value;},
setValue:function(A){
this.value=!!A;
%SetBreakPointsActive(this.value);
}
},
breakOnCaughtException:{
getValue:function(){return s.isBreakOnException();},
setValue:function(A){
if(A){
s.setBreakOnException();
}else{
s.clearBreakOnException();
}
}
},
breakOnUncaughtException:{
getValue:function(){return s.isBreakOnUncaughtException();},
setValue:function(A){
if(A){
s.setBreakOnUncaughtException();
}else{
s.clearBreakOnUncaughtException();
}
}
},
};
function MakeBreakPoint(B,C){
var D=new BreakPoint(B,C);
x.push(D);
return D;
}
function BreakPoint(B,C){
this.source_position_=B;
if(C){
this.script_break_point_=C;
}else{
this.number_=w++;
}
this.active_=true;
this.condition_=null;
}
BreakPoint.prototype.number=function(){
return this.number_;
};
BreakPoint.prototype.func=function(){
return this.func_;
};
BreakPoint.prototype.source_position=function(){
return this.source_position_;
};
BreakPoint.prototype.active=function(){
if(this.script_break_point()){
return this.script_break_point().active();
}
return this.active_;
};
BreakPoint.prototype.condition=function(){
if(this.script_break_point()&&this.script_break_point().condition()){
return this.script_break_point().condition();
}
return this.condition_;
};
BreakPoint.prototype.script_break_point=function(){
return this.script_break_point_;
};
BreakPoint.prototype.enable=function(){
this.active_=true;
};
BreakPoint.prototype.disable=function(){
this.active_=false;
};
BreakPoint.prototype.setCondition=function(E){
this.condition_=E;
};
BreakPoint.prototype.isTriggered=function(F){
if(!this.active())return false;
if(this.condition()){
try{
var G=F.frame(0).evaluate(this.condition());
if(!(G instanceof p)||!G.value_){
return false;
}
}catch(e){
return false;
}
}
return true;
};
function IsBreakPointTriggered(H,D){
return D.isTriggered(MakeExecutionState(H));
}
function ScriptBreakPoint(u,script_id_or_name,opt_line,opt_column,
opt_groupId,opt_position_alignment){
this.type_=u;
if(u==s.ScriptBreakPointType.ScriptId){
this.script_id_=script_id_or_name;
}else if(u==s.ScriptBreakPointType.ScriptName){
this.script_name_=script_id_or_name;
}else if(u==s.ScriptBreakPointType.ScriptRegExp){
this.script_regexp_object_=new e(script_id_or_name);
}else{
throw %make_error(2,"Unexpected breakpoint type "+u);
}
this.line_=opt_line||0;
this.column_=opt_column;
this.groupId_=opt_groupId;
this.position_alignment_=(opt_position_alignment===(void 0))
?s.BreakPositionAlignment.Statement:opt_position_alignment;
this.active_=true;
this.condition_=null;
this.break_points_=[];
}
ScriptBreakPoint.prototype.cloneForOtherScript=function(I){
var J=new ScriptBreakPoint(s.ScriptBreakPointType.ScriptId,
I.id,this.line_,this.column_,this.groupId_,
this.position_alignment_);
J.number_=w++;
y.push(J);
J.active_=this.active_;
J.condition_=this.condition_;
return J;
};
ScriptBreakPoint.prototype.number=function(){
return this.number_;
};
ScriptBreakPoint.prototype.groupId=function(){
return this.groupId_;
};
ScriptBreakPoint.prototype.type=function(){
return this.type_;
};
ScriptBreakPoint.prototype.script_id=function(){
return this.script_id_;
};
ScriptBreakPoint.prototype.script_name=function(){
return this.script_name_;
};
ScriptBreakPoint.prototype.script_regexp_object=function(){
return this.script_regexp_object_;
};
ScriptBreakPoint.prototype.line=function(){
return this.line_;
};
ScriptBreakPoint.prototype.column=function(){
return this.column_;
};
ScriptBreakPoint.prototype.actual_locations=function(){
var K=[];
for(var L=0;L<this.break_points_.length;L++){
K.push(this.break_points_[L].actual_location);
}
return K;
};
ScriptBreakPoint.prototype.update_positions=function(M,N){
this.line_=M;
this.column_=N;
};
ScriptBreakPoint.prototype.active=function(){
return this.active_;
};
ScriptBreakPoint.prototype.condition=function(){
return this.condition_;
};
ScriptBreakPoint.prototype.enable=function(){
this.active_=true;
};
ScriptBreakPoint.prototype.disable=function(){
this.active_=false;
};
ScriptBreakPoint.prototype.setCondition=function(E){
this.condition_=E;
};
ScriptBreakPoint.prototype.matchesScript=function(O){
if(this.type_==s.ScriptBreakPointType.ScriptId){
return this.script_id_==O.id;
}else{
if(!(O.line_offset<=this.line_&&
this.line_<O.line_offset+%ScriptLineCount(O))){
return false;
}
if(this.type_==s.ScriptBreakPointType.ScriptName){
return this.script_name_==O.nameOrSourceURL();
}else if(this.type_==s.ScriptBreakPointType.ScriptRegExp){
return this.script_regexp_object_.test(O.nameOrSourceURL());
}else{
throw %make_error(2,"Unexpected breakpoint type "+this.type_);
}
}
};
ScriptBreakPoint.prototype.set=function(O){
var N=this.column();
var M=this.line();
if((N===(void 0))){
var P=%ScriptSourceLine(O,M||O.line_offset);
if(!O.sourceColumnStart_){
O.sourceColumnStart_=new d(%ScriptLineCount(O));
}
if((O.sourceColumnStart_[M]===(void 0))){
O.sourceColumnStart_[M]=
P.match(t)[0].length;
}
N=O.sourceColumnStart_[M];
}
var Q=s.findScriptSourcePosition(O,this.line(),N);
if((Q===null))return;
var D=MakeBreakPoint(Q,this);
var R=%SetScriptBreakPoint(O,Q,
this.position_alignment_,
D);
if((R===(void 0))){
R=Q;
}
var S=O.locationFromPosition(R,true);
D.actual_location={line:S.line,
column:S.column,
script_id:O.id};
this.break_points_.push(D);
return D;
};
ScriptBreakPoint.prototype.clear=function(){
var T=[];
for(var L=0;L<x.length;L++){
if(x[L].script_break_point()&&
x[L].script_break_point()===this){
%ClearBreakPoint(x[L]);
}else{
T.push(x[L]);
}
}
x=T;
this.break_points_=[];
};
function UpdateScriptBreakPoints(O){
for(var L=0;L<y.length;L++){
var D=y[L];
if((D.type()==s.ScriptBreakPointType.ScriptName||
D.type()==s.ScriptBreakPointType.ScriptRegExp)&&
D.matchesScript(O)){
D.set(O);
}
}
}
function GetScriptBreakPoints(O){
var U=[];
for(var L=0;L<y.length;L++){
if(y[L].matchesScript(O)){
U.push(y[L]);
}
}
return U;
}
s.setListener=function(V,W){
if(!(%IsFunction(V))&&!(V===(void 0))&&!(V===null)){
throw %make_type_error(34);
}
%SetDebugEventListener(V,W);
};
s.findScript=function(X){
if((%IsFunction(X))){
return %FunctionGetScript(X);
}else if((%_IsRegExp(X))){
var Y=this.scripts();
var Z=null;
var aa=0;
for(var L in Y){
var O=Y[L];
if(X.test(O.name)){
Z=O;
aa++;
}
}
if(aa==1){
return Z;
}else{
return(void 0);
}
}else{
return %GetScript(X);
}
};
s.scriptSource=function(X){
return this.findScript(X).source;
};
s.source=function(ab){
if(!(%IsFunction(ab)))throw %make_type_error(34);
return %FunctionGetSourceCode(ab);
};
s.sourcePosition=function(ab){
if(!(%IsFunction(ab)))throw %make_type_error(34);
return %FunctionGetScriptSourcePosition(ab);
};
s.findFunctionSourceLocation=function(ac,ad,ae){
var O=%FunctionGetScript(ac);
var af=%FunctionGetScriptSourcePosition(ac);
return %ScriptLocationFromLine(O,ad,ae,af);
};
s.findScriptSourcePosition=function(O,ad,ae){
var ag=%ScriptLocationFromLine(O,ad,ae,0);
return ag?ag.position:null;
};
s.findBreakPoint=function(ah,ai){
var D;
for(var L=0;L<x.length;L++){
if(x[L].number()==ah){
D=x[L];
if(ai){
x.splice(L,1);
}
break;
}
}
if(D){
return D;
}else{
return this.findScriptBreakPoint(ah,ai);
}
};
s.findBreakPointActualLocations=function(ah){
for(var L=0;L<y.length;L++){
if(y[L].number()==ah){
return y[L].actual_locations();
}
}
for(var L=0;L<x.length;L++){
if(x[L].number()==ah){
return[x[L].actual_location];
}
}
return[];
};
s.setBreakPoint=function(ac,ad,ae,aj){
if(!(%IsFunction(ac)))throw %make_type_error(34);
if(%FunctionIsAPIFunction(ac)){
throw %make_error(2,'Cannot set break point in native code.');
}
var B=
this.findFunctionSourceLocation(ac,ad,ae).position;
var O=%FunctionGetScript(ac);
if(O.type==s.ScriptType.Native){
throw %make_error(2,'Cannot set break point in native code.');
}
if(O&&O.id){
var ag=O.locationFromPosition(B,false);
return this.setScriptBreakPointById(O.id,
ag.line,ag.column,
aj);
}else{
var D=MakeBreakPoint(B);
var R=
%SetFunctionBreakPoint(ac,B,D);
var S=O.locationFromPosition(R,true);
D.actual_location={line:S.line,
column:S.column,
script_id:O.id};
D.setCondition(aj);
return D.number();
}
};
s.setBreakPointByScriptIdAndPosition=function(script_id,Q,
E,enabled,
opt_position_alignment)
{
var D=MakeBreakPoint(Q);
D.setCondition(E);
if(!enabled){
D.disable();
}
var O=scriptById(script_id);
if(O){
var ak=(opt_position_alignment===(void 0))
?s.BreakPositionAlignment.Statement:opt_position_alignment;
D.actual_position=%SetScriptBreakPoint(O,Q,
ak,D);
}
return D;
};
s.enableBreakPoint=function(ah){
var D=this.findBreakPoint(ah,false);
if(D){
D.enable();
}
};
s.disableBreakPoint=function(ah){
var D=this.findBreakPoint(ah,false);
if(D){
D.disable();
}
};
s.changeBreakPointCondition=function(ah,E){
var D=this.findBreakPoint(ah,false);
D.setCondition(E);
};
s.clearBreakPoint=function(ah){
var D=this.findBreakPoint(ah,true);
if(D){
return %ClearBreakPoint(D);
}else{
D=this.findScriptBreakPoint(ah,true);
if(!D)throw %make_error(2,'Invalid breakpoint');
}
};
s.clearAllBreakPoints=function(){
for(var L=0;L<x.length;L++){
var D=x[L];
%ClearBreakPoint(D);
}
x=[];
};
s.disableAllBreakPoints=function(){
for(var L=1;L<w;L++){
s.disableBreakPoint(L);
}
%ChangeBreakOnException(s.ExceptionBreak.Caught,false);
%ChangeBreakOnException(s.ExceptionBreak.Uncaught,false);
};
s.findScriptBreakPoint=function(ah,ai){
var al;
for(var L=0;L<y.length;L++){
if(y[L].number()==ah){
al=y[L];
if(ai){
al.clear();
y.splice(L,1);
}
break;
}
}
return al;
};
s.setScriptBreakPoint=function(u,script_id_or_name,
ad,ae,aj,
opt_groupId,opt_position_alignment){
var al=
new ScriptBreakPoint(u,script_id_or_name,ad,ae,
opt_groupId,opt_position_alignment);
al.number_=w++;
al.setCondition(aj);
y.push(al);
var Y=this.scripts();
for(var L=0;L<Y.length;L++){
if(al.matchesScript(Y[L])){
al.set(Y[L]);
}
}
return al.number();
};
s.setScriptBreakPointById=function(script_id,
ad,ae,
aj,opt_groupId,
opt_position_alignment){
return this.setScriptBreakPoint(s.ScriptBreakPointType.ScriptId,
script_id,ad,ae,
aj,opt_groupId,
opt_position_alignment);
};
s.setScriptBreakPointByName=function(script_name,
ad,ae,
aj,opt_groupId){
return this.setScriptBreakPoint(s.ScriptBreakPointType.ScriptName,
script_name,ad,ae,
aj,opt_groupId);
};
s.setScriptBreakPointByRegExp=function(script_regexp,
ad,ae,
aj,opt_groupId){
return this.setScriptBreakPoint(s.ScriptBreakPointType.ScriptRegExp,
script_regexp,ad,ae,
aj,opt_groupId);
};
s.enableScriptBreakPoint=function(ah){
var al=this.findScriptBreakPoint(ah,false);
al.enable();
};
s.disableScriptBreakPoint=function(ah){
var al=this.findScriptBreakPoint(ah,false);
al.disable();
};
s.changeScriptBreakPointCondition=function(
ah,E){
var al=this.findScriptBreakPoint(ah,false);
al.setCondition(E);
};
s.scriptBreakPoints=function(){
return y;
};
s.clearStepping=function(){
%ClearStepping();
};
s.setBreakOnException=function(){
return %ChangeBreakOnException(s.ExceptionBreak.Caught,true);
};
s.clearBreakOnException=function(){
return %ChangeBreakOnException(s.ExceptionBreak.Caught,false);
};
s.isBreakOnException=function(){
return!!%IsBreakOnException(s.ExceptionBreak.Caught);
};
s.setBreakOnUncaughtException=function(){
return %ChangeBreakOnException(s.ExceptionBreak.Uncaught,true);
};
s.clearBreakOnUncaughtException=function(){
return %ChangeBreakOnException(s.ExceptionBreak.Uncaught,false);
};
s.isBreakOnUncaughtException=function(){
return!!%IsBreakOnException(s.ExceptionBreak.Uncaught);
};
s.showBreakPoints=function(ab,am,an){
if(!(%IsFunction(ab)))throw %make_error(34);
var ao=am?this.scriptSource(ab):this.source(ab);
var ap=am?0:this.sourcePosition(ab);
var ak=(an===(void 0))
?s.BreakPositionAlignment.Statement:an;
var K=%GetBreakLocations(ab,ak);
if(!K)return ao;
K.sort(function(aq,ar){return aq-ar;});
var U="";
var as=0;
var at;
for(var L=0;L<K.length;L++){
at=K[L]-ap;
U+=ao.slice(as,at);
U+="[B"+L+"]";
as=at;
}
at=ao.length;
U+=ao.substring(as,at);
return U;
};
s.scripts=function(){
return %DebugGetLoadedScripts();
};
function scriptById(au){
var Y=s.scripts();
for(var O of Y){
if(O.id==au)return O;
}
return(void 0);
};
s.debuggerFlags=function(){
return z;
};
s.MakeMirror=j;
function MakeExecutionState(H){
return new ExecutionState(H);
}
function ExecutionState(H){
this.break_id=H;
this.selected_frame=0;
}
ExecutionState.prototype.prepareStep=function(av){
if(av===s.StepAction.StepIn||
av===s.StepAction.StepOut||
av===s.StepAction.StepNext||
av===s.StepAction.StepFrame){
return %PrepareStep(this.break_id,av);
}
throw %make_type_error(34);
};
ExecutionState.prototype.evaluateGlobal=function(ao,disable_break,
opt_additional_context){
return j(%DebugEvaluateGlobal(this.break_id,ao,
(!!(disable_break)),
opt_additional_context));
};
ExecutionState.prototype.frameCount=function(){
return %GetFrameCount(this.break_id);
};
ExecutionState.prototype.frame=function(aw){
if(aw==null)aw=this.selected_frame;
if(aw<0||aw>=this.frameCount()){
throw %make_type_error(33);
}
return new c(this.break_id,aw);
};
ExecutionState.prototype.setSelectedFrame=function(ax){
var L=(%_ToNumber(ax));
if(L<0||L>=this.frameCount()){
throw %make_type_error(33);
}
this.selected_frame=L;
};
ExecutionState.prototype.selectedFrame=function(){
return this.selected_frame;
};
ExecutionState.prototype.debugCommandProcessor=function(ay){
return new DebugCommandProcessor(this,ay);
};
function MakeBreakEvent(H,az){
return new BreakEvent(H,az);
}
function BreakEvent(H,az){
this.frame_=new c(H,0);
this.break_points_hit_=az;
}
BreakEvent.prototype.eventType=function(){
return s.DebugEvent.Break;
};
BreakEvent.prototype.func=function(){
return this.frame_.func();
};
BreakEvent.prototype.sourceLine=function(){
return this.frame_.sourceLine();
};
BreakEvent.prototype.sourceColumn=function(){
return this.frame_.sourceColumn();
};
BreakEvent.prototype.sourceLineText=function(){
return this.frame_.sourceLineText();
};
BreakEvent.prototype.breakPointsHit=function(){
return this.break_points_hit_;
};
BreakEvent.prototype.toJSONProtocol=function(){
var aA={seq:v++,
type:"event",
event:"break",
body:{invocationText:this.frame_.invocationText()}
};
var O=this.func().script();
if(O){
aA.body.sourceLine=this.sourceLine(),
aA.body.sourceColumn=this.sourceColumn(),
aA.body.sourceLineText=this.sourceLineText(),
aA.body.script=MakeScriptObject_(O,false);
}
if(this.breakPointsHit()){
aA.body.breakpoints=[];
for(var L=0;L<this.breakPointsHit().length;L++){
var aB=this.breakPointsHit()[L];
var al=aB.script_break_point();
var aC;
if(al){
aC=al.number();
}else{
aC=aB.number();
}
aA.body.breakpoints.push(aC);
}
}
return h(ObjectToProtocolObject_(aA));
};
function MakeExceptionEvent(H,aD,aE,aF){
return new ExceptionEvent(H,aD,aE,aF);
}
function ExceptionEvent(H,aD,aE,aF){
this.exec_state_=new ExecutionState(H);
this.exception_=aD;
this.uncaught_=aE;
this.promise_=aF;
}
ExceptionEvent.prototype.eventType=function(){
return s.DebugEvent.Exception;
};
ExceptionEvent.prototype.exception=function(){
return this.exception_;
};
ExceptionEvent.prototype.uncaught=function(){
return this.uncaught_;
};
ExceptionEvent.prototype.promise=function(){
return this.promise_;
};
ExceptionEvent.prototype.func=function(){
return this.exec_state_.frame(0).func();
};
ExceptionEvent.prototype.sourceLine=function(){
return this.exec_state_.frame(0).sourceLine();
};
ExceptionEvent.prototype.sourceColumn=function(){
return this.exec_state_.frame(0).sourceColumn();
};
ExceptionEvent.prototype.sourceLineText=function(){
return this.exec_state_.frame(0).sourceLineText();
};
ExceptionEvent.prototype.toJSONProtocol=function(){
var aA=new ProtocolMessage();
aA.event="exception";
aA.body={uncaught:this.uncaught_,
exception:j(this.exception_)
};
if(this.exec_state_.frameCount()>0){
aA.body.sourceLine=this.sourceLine();
aA.body.sourceColumn=this.sourceColumn();
aA.body.sourceLineText=this.sourceLineText();
var O=this.func().script();
if(O){
aA.body.script=MakeScriptObject_(O,false);
}
}else{
aA.body.sourceLine=-1;
}
return aA.toJSONProtocol();
};
function MakeCompileEvent(O,u){
return new CompileEvent(O,u);
}
function CompileEvent(O,u){
this.script_=j(O);
this.type_=u;
}
CompileEvent.prototype.eventType=function(){
return this.type_;
};
CompileEvent.prototype.script=function(){
return this.script_;
};
CompileEvent.prototype.toJSONProtocol=function(){
var aA=new ProtocolMessage();
aA.running=true;
switch(this.type_){
case s.DebugEvent.BeforeCompile:
aA.event="beforeCompile";
break;
case s.DebugEvent.AfterCompile:
aA.event="afterCompile";
break;
case s.DebugEvent.CompileError:
aA.event="compileError";
break;
}
aA.body={};
aA.body.script=this.script_;
return aA.toJSONProtocol();
};
function MakeScriptObject_(O,aG){
var aA={id:O.id(),
name:O.name(),
lineOffset:O.lineOffset(),
columnOffset:O.columnOffset(),
lineCount:O.lineCount(),
};
if(!(O.data()===(void 0))){
aA.data=O.data();
}
if(aG){
aA.source=O.source();
}
return aA;
}
function MakeAsyncTaskEvent(u,aH,aI){
return new AsyncTaskEvent(u,aH,aI);
}
function AsyncTaskEvent(u,aH,aI){
this.type_=u;
this.id_=aH;
this.name_=aI;
}
AsyncTaskEvent.prototype.type=function(){
return this.type_;
}
AsyncTaskEvent.prototype.name=function(){
return this.name_;
}
AsyncTaskEvent.prototype.id=function(){
return this.id_;
}
function DebugCommandProcessor(F,ay){
this.exec_state_=F;
this.running_=ay||false;
}
DebugCommandProcessor.prototype.processDebugRequest=function(aJ){
return this.processDebugJSONRequest(aJ);
};
function ProtocolMessage(aJ){
this.seq=v++;
if(aJ){
this.type='response';
this.request_seq=aJ.seq;
this.command=aJ.command;
}else{
this.type='event';
}
this.success=true;
this.running=(void 0);
}
ProtocolMessage.prototype.setOption=function(aI,A){
if(!this.options_){
this.options_={};
}
this.options_[aI]=A;
};
ProtocolMessage.prototype.failed=function(aK,aL){
this.success=false;
this.message=aK;
if((typeof(aL)==='object')){
this.error_details=aL;
}
};
ProtocolMessage.prototype.toJSONProtocol=function(){
var aM={};
aM.seq=this.seq;
if(this.request_seq){
aM.request_seq=this.request_seq;
}
aM.type=this.type;
if(this.event){
aM.event=this.event;
}
if(this.command){
aM.command=this.command;
}
if(this.success){
aM.success=this.success;
}else{
aM.success=false;
}
if(this.body){
var aN;
var aO=k(true,this.options_);
if(this.body instanceof m){
aN=aO.serializeValue(this.body);
}else if(this.body instanceof d){
aN=[];
for(var L=0;L<this.body.length;L++){
if(this.body[L]instanceof m){
aN.push(aO.serializeValue(this.body[L]));
}else{
aN.push(ObjectToProtocolObject_(this.body[L],aO));
}
}
}else{
aN=ObjectToProtocolObject_(this.body,aO);
}
aM.body=aN;
aM.refs=aO.serializeReferencedObjects();
}
if(this.message){
aM.message=this.message;
}
if(this.error_details){
aM.error_details=this.error_details;
}
aM.running=this.running;
return h(aM);
};
DebugCommandProcessor.prototype.createResponse=function(aJ){
return new ProtocolMessage(aJ);
};
DebugCommandProcessor.prototype.processDebugJSONRequest=function(
json_request){
var aJ;
var aP;
try{
try{
aJ=g(json_request);
aP=this.createResponse(aJ);
if(!aJ.type){
throw %make_error(2,'Type not specified');
}
if(aJ.type!='request'){
throw %make_error(2,
"Illegal type '"+aJ.type+"' in request");
}
if(!aJ.command){
throw %make_error(2,'Command not specified');
}
if(aJ.arguments){
var aQ=aJ.arguments;
if(aQ.inlineRefs||aQ.compactFormat){
aP.setOption('inlineRefs',true);
}
if(!(aQ.maxStringLength===(void 0))){
aP.setOption('maxStringLength',aQ.maxStringLength);
}
}
var aR=aJ.command.toLowerCase();
var aS=DebugCommandProcessor.prototype.dispatch_[aR];
if((%IsFunction(aS))){
%_Call(aS,this,aJ,aP);
}else{
throw %make_error(2,
'Unknown command "'+aJ.command+'" in request');
}
}catch(e){
if(!aP){
aP=this.createResponse();
}
aP.success=false;
aP.message=(%_ToString(e));
}
try{
if(!(aP.running===(void 0))){
this.running_=aP.running;
}
aP.running=this.running_;
return aP.toJSONProtocol();
}catch(e){
return'{"seq":'+aP.seq+','+
'"request_seq":'+aJ.seq+','+
'"type":"response",'+
'"success":false,'+
'"message":"Internal error: '+(%_ToString(e))+'"}';
}
}catch(e){
return'{"seq":0,"type":"response","success":false,"message":"Internal error"}';
}
};
DebugCommandProcessor.prototype.continueRequest_=function(aJ,aP){
if(aJ.arguments){
var av=s.StepAction.StepIn;
var aT=aJ.arguments.stepaction;
if(aT){
if(aT=='in'){
av=s.StepAction.StepIn;
}else if(aT=='next'){
av=s.StepAction.StepNext;
}else if(aT=='out'){
av=s.StepAction.StepOut;
}else{
throw %make_error(2,
'Invalid stepaction argument "'+aT+'".');
}
}
this.exec_state_.prepareStep(av);
}
aP.running=true;
};
DebugCommandProcessor.prototype.breakRequest_=function(aJ,aP){
};
DebugCommandProcessor.prototype.setBreakPointRequest_=
function(aJ,aP){
if(!aJ.arguments){
aP.failed('Missing arguments');
return;
}
var u=aJ.arguments.type;
var aU=aJ.arguments.target;
var M=aJ.arguments.line;
var N=aJ.arguments.column;
var aV=(aJ.arguments.enabled===(void 0))?
true:aJ.arguments.enabled;
var E=aJ.arguments.condition;
var aW=aJ.arguments.groupId;
if(!u||(aU===(void 0))){
aP.failed('Missing argument "type" or "target"');
return;
}
var ah;
if(u=='function'){
if(!(typeof(aU)==='string')){
aP.failed('Argument "target" is not a string value');
return;
}
var ab;
try{
ab=this.exec_state_.evaluateGlobal(aU).value();
}catch(e){
aP.failed('Error: "'+(%_ToString(e))+
'" evaluating "'+aU+'"');
return;
}
if(!(%IsFunction(ab))){
aP.failed('"'+aU+'" does not evaluate to a function');
return;
}
ah=s.setBreakPoint(ab,M,N,E);
}else if(u=='handle'){
var aX=o(aU,10);
var G=i(aX);
if(!G){
return aP.failed('Object #'+aX+'# not found');
}
if(!G.isFunction()){
return aP.failed('Object #'+aX+'# is not a function');
}
ah=s.setBreakPoint(G.value(),
M,N,E);
}else if(u=='script'){
ah=
s.setScriptBreakPointByName(aU,M,N,E,
aW);
}else if(u=='scriptId'){
ah=
s.setScriptBreakPointById(aU,M,N,E,aW);
}else if(u=='scriptRegExp'){
ah=
s.setScriptBreakPointByRegExp(aU,M,N,E,
aW);
}else{
aP.failed('Illegal type "'+u+'"');
return;
}
var D=s.findBreakPoint(ah);
if(!aV){
s.disableBreakPoint(ah);
}
aP.body={type:u,
breakpoint:ah};
if(D instanceof ScriptBreakPoint){
if(D.type()==s.ScriptBreakPointType.ScriptId){
aP.body.type='scriptId';
aP.body.script_id=D.script_id();
}else if(D.type()==s.ScriptBreakPointType.ScriptName){
aP.body.type='scriptName';
aP.body.script_name=D.script_name();
}else if(D.type()==s.ScriptBreakPointType.ScriptRegExp){
aP.body.type='scriptRegExp';
aP.body.script_regexp=D.script_regexp_object().source;
}else{
throw %make_error(2,
"Unexpected breakpoint type: "+D.type());
}
aP.body.line=D.line();
aP.body.column=D.column();
aP.body.actual_locations=D.actual_locations();
}else{
aP.body.type='function';
aP.body.actual_locations=[D.actual_location];
}
};
DebugCommandProcessor.prototype.changeBreakPointRequest_=function(
aJ,aP){
if(!aJ.arguments){
aP.failed('Missing arguments');
return;
}
var D=(%_ToNumber(aJ.arguments.breakpoint));
var aV=aJ.arguments.enabled;
var E=aJ.arguments.condition;
if(!D){
aP.failed('Missing argument "breakpoint"');
return;
}
if(!(aV===(void 0))){
if(aV){
s.enableBreakPoint(D);
}else{
s.disableBreakPoint(D);
}
}
if(!(E===(void 0))){
s.changeBreakPointCondition(D,E);
}
};
DebugCommandProcessor.prototype.clearBreakPointGroupRequest_=function(
aJ,aP){
if(!aJ.arguments){
aP.failed('Missing arguments');
return;
}
var aY=aJ.arguments.groupId;
if(!aY){
aP.failed('Missing argument "groupId"');
return;
}
var aZ=[];
var ba=[];
for(var L=0;L<y.length;L++){
var bb=y[L];
if(bb.groupId()==aY){
aZ.push(bb.number());
bb.clear();
}else{
ba.push(bb);
}
}
y=ba;
aP.body={breakpoints:aZ};
};
DebugCommandProcessor.prototype.clearBreakPointRequest_=function(
aJ,aP){
if(!aJ.arguments){
aP.failed('Missing arguments');
return;
}
var D=(%_ToNumber(aJ.arguments.breakpoint));
if(!D){
aP.failed('Missing argument "breakpoint"');
return;
}
s.clearBreakPoint(D);
aP.body={breakpoint:D};
};
DebugCommandProcessor.prototype.listBreakpointsRequest_=function(
aJ,aP){
var bc=[];
for(var L=0;L<y.length;L++){
var D=y[L];
var bd={
number:D.number(),
line:D.line(),
column:D.column(),
groupId:D.groupId(),
active:D.active(),
condition:D.condition(),
actual_locations:D.actual_locations()
};
if(D.type()==s.ScriptBreakPointType.ScriptId){
bd.type='scriptId';
bd.script_id=D.script_id();
}else if(D.type()==s.ScriptBreakPointType.ScriptName){
bd.type='scriptName';
bd.script_name=D.script_name();
}else if(D.type()==s.ScriptBreakPointType.ScriptRegExp){
bd.type='scriptRegExp';
bd.script_regexp=D.script_regexp_object().source;
}else{
throw %make_error(2,
"Unexpected breakpoint type: "+D.type());
}
bc.push(bd);
}
aP.body={
breakpoints:bc,
breakOnExceptions:s.isBreakOnException(),
breakOnUncaughtExceptions:s.isBreakOnUncaughtException()
};
};
DebugCommandProcessor.prototype.disconnectRequest_=
function(aJ,aP){
s.disableAllBreakPoints();
this.continueRequest_(aJ,aP);
};
DebugCommandProcessor.prototype.setExceptionBreakRequest_=
function(aJ,aP){
if(!aJ.arguments){
aP.failed('Missing arguments');
return;
}
var u=aJ.arguments.type;
if(!u){
aP.failed('Missing argument "type"');
return;
}
var aV;
if(u=='all'){
aV=!s.isBreakOnException();
}else if(u=='uncaught'){
aV=!s.isBreakOnUncaughtException();
}
if(!(aJ.arguments.enabled===(void 0))){
aV=aJ.arguments.enabled;
if((aV!=true)&&(aV!=false)){
aP.failed('Illegal value for "enabled":"'+aV+'"');
}
}
if(u=='all'){
%ChangeBreakOnException(s.ExceptionBreak.Caught,aV);
}else if(u=='uncaught'){
%ChangeBreakOnException(s.ExceptionBreak.Uncaught,aV);
}else{
aP.failed('Unknown "type":"'+u+'"');
}
aP.body={'type':u,'enabled':aV};
};
DebugCommandProcessor.prototype.backtraceRequest_=function(
aJ,aP){
var be=this.exec_state_.frameCount();
if(be==0){
aP.body={
totalFrames:be
};
return;
}
var bf=0;
var bg=r;
if(aJ.arguments){
if(aJ.arguments.fromFrame){
bf=aJ.arguments.fromFrame;
}
if(aJ.arguments.toFrame){
bg=aJ.arguments.toFrame;
}
if(aJ.arguments.bottom){
var bh=be-bf;
bf=be-bg;
bg=bh;
}
if(bf<0||bg<0){
return aP.failed('Invalid frame number');
}
}
bg=l(be,bg);
if(bg<=bf){
var bi='Invalid frame range';
return aP.failed(bi);
}
var bj=[];
for(var L=bf;L<bg;L++){
bj.push(this.exec_state_.frame(L));
}
aP.body={
fromFrame:bf,
toFrame:bg,
totalFrames:be,
frames:bj
};
};
DebugCommandProcessor.prototype.frameRequest_=function(aJ,aP){
if(this.exec_state_.frameCount()==0){
return aP.failed('No frames');
}
if(aJ.arguments){
var ax=aJ.arguments.number;
if(ax<0||this.exec_state_.frameCount()<=ax){
return aP.failed('Invalid frame number');
}
this.exec_state_.setSelectedFrame(aJ.arguments.number);
}
aP.body=this.exec_state_.frame();
};
DebugCommandProcessor.prototype.resolveFrameFromScopeDescription_=
function(bk){
if(bk&&!(bk.frameNumber===(void 0))){
var bl=bk.frameNumber;
if(bl<0||this.exec_state_.frameCount()<=bl){
throw %make_type_error(33);
}
return this.exec_state_.frame(bl);
}else{
return this.exec_state_.frame();
}
};
DebugCommandProcessor.prototype.resolveScopeHolder_=
function(bk){
if(bk&&"functionHandle"in bk){
if(!(typeof(bk.functionHandle)==='number')){
throw %make_error(2,'Function handle must be a number');
}
var bm=i(bk.functionHandle);
if(!bm){
throw %make_error(2,'Failed to find function object by handle');
}
if(!bm.isFunction()){
throw %make_error(2,
'Value of non-function type is found by handle');
}
return bm;
}else{
if(this.exec_state_.frameCount()==0){
throw %make_error(2,'No scopes');
}
var bn=this.resolveFrameFromScopeDescription_(bk);
return bn;
}
}
DebugCommandProcessor.prototype.scopesRequest_=function(aJ,aP){
var bo=this.resolveScopeHolder_(aJ.arguments);
var bp=bo.scopeCount();
var bq=[];
for(var L=0;L<bp;L++){
bq.push(bo.scope(L));
}
aP.body={
fromScope:0,
toScope:bp,
totalScopes:bp,
scopes:bq
};
};
DebugCommandProcessor.prototype.scopeRequest_=function(aJ,aP){
var bo=this.resolveScopeHolder_(aJ.arguments);
var br=0;
if(aJ.arguments&&!(aJ.arguments.number===(void 0))){
br=(%_ToNumber(aJ.arguments.number));
if(br<0||bo.scopeCount()<=br){
return aP.failed('Invalid scope number');
}
}
aP.body=bo.scope(br);
};
DebugCommandProcessor.resolveValue_=function(bs){
if("handle"in bs){
var bt=i(bs.handle);
if(!bt){
throw %make_error(2,"Failed to resolve value by handle, ' #"+
bs.handle+"# not found");
}
return bt.value();
}else if("stringDescription"in bs){
if(bs.type==n.BOOLEAN_TYPE){
return(!!(bs.stringDescription));
}else if(bs.type==n.NUMBER_TYPE){
return(%_ToNumber(bs.stringDescription));
}if(bs.type==n.STRING_TYPE){
return(%_ToString(bs.stringDescription));
}else{
throw %make_error(2,"Unknown type");
}
}else if("value"in bs){
return bs.value;
}else if(bs.type==n.UNDEFINED_TYPE){
return(void 0);
}else if(bs.type==n.NULL_TYPE){
return null;
}else{
throw %make_error(2,"Failed to parse value description");
}
};
DebugCommandProcessor.prototype.setVariableValueRequest_=
function(aJ,aP){
if(!aJ.arguments){
aP.failed('Missing arguments');
return;
}
if((aJ.arguments.name===(void 0))){
aP.failed('Missing variable name');
}
var bu=aJ.arguments.name;
var bk=aJ.arguments.scope;
var bo=this.resolveScopeHolder_(bk);
if((bk.number===(void 0))){
aP.failed('Missing scope number');
}
var br=(%_ToNumber(bk.number));
var bv=bo.scope(br);
var bw=
DebugCommandProcessor.resolveValue_(aJ.arguments.newValue);
bv.setVariableValue(bu,bw);
var bx=j(bw);
aP.body={
newValue:bx
};
};
DebugCommandProcessor.prototype.evaluateRequest_=function(aJ,aP){
if(!aJ.arguments){
return aP.failed('Missing arguments');
}
var by=aJ.arguments.expression;
var bn=aJ.arguments.frame;
var a=aJ.arguments.global;
var bz=aJ.arguments.disable_break;
var bA=aJ.arguments.additional_context;
try{
by=(%_ToString(by));
}catch(e){
return aP.failed('Failed to convert expression argument to string');
}
if(!(bn===(void 0))&&a){
return aP.failed('Arguments "frame" and "global" are exclusive');
}
var bB;
if(bA){
bB={};
for(var L=0;L<bA.length;L++){
var bC=bA[L];
if(!(typeof(bC.name)==='string')){
return aP.failed("Context element #"+L+
" doesn't contain name:string property");
}
var bD=DebugCommandProcessor.resolveValue_(bC);
bB[bC.name]=bD;
}
}
if(a){
aP.body=this.exec_state_.evaluateGlobal(
by,(!!(bz)),bB);
return;
}
if((bz===(void 0))){
bz=true;
}
if(this.exec_state_.frameCount()==0){
return aP.failed('No frames');
}
if(!(bn===(void 0))){
var bE=(%_ToNumber(bn));
if(bE<0||bE>=this.exec_state_.frameCount()){
return aP.failed('Invalid frame "'+bn+'"');
}
aP.body=this.exec_state_.frame(bE).evaluate(
by,(!!(bz)),bB);
return;
}else{
aP.body=this.exec_state_.frame().evaluate(
by,(!!(bz)),bB);
return;
}
};
DebugCommandProcessor.prototype.lookupRequest_=function(aJ,aP){
if(!aJ.arguments){
return aP.failed('Missing arguments');
}
var bF=aJ.arguments.handles;
if((bF===(void 0))){
return aP.failed('Argument "handles" missing');
}
if(!(aJ.arguments.includeSource===(void 0))){
var bG=(!!(aJ.arguments.includeSource));
aP.setOption('includeSource',bG);
}
var bH={};
for(var L=0;L<bF.length;L++){
var aX=bF[L];
var G=i(aX);
if(!G){
return aP.failed('Object #'+aX+'# not found');
}
bH[aX]=G;
}
aP.body=bH;
};
DebugCommandProcessor.prototype.referencesRequest_=
function(aJ,aP){
if(!aJ.arguments){
return aP.failed('Missing arguments');
}
var u=aJ.arguments.type;
var aX=aJ.arguments.handle;
if((u===(void 0))){
return aP.failed('Argument "type" missing');
}
if((aX===(void 0))){
return aP.failed('Argument "handle" missing');
}
if(u!='referencedBy'&&u!='constructedBy'){
return aP.failed('Invalid type "'+u+'"');
}
var G=i(aX);
if(G){
if(u=='referencedBy'){
aP.body=G.referencedBy();
}else{
aP.body=G.constructedBy();
}
}else{
return aP.failed('Object #'+aX+'# not found');
}
};
DebugCommandProcessor.prototype.sourceRequest_=function(aJ,aP){
if(this.exec_state_.frameCount()==0){
return aP.failed('No source');
}
var bI;
var bJ;
var bn=this.exec_state_.frame();
if(aJ.arguments){
bI=aJ.arguments.fromLine;
bJ=aJ.arguments.toLine;
if(!(aJ.arguments.frame===(void 0))){
var bE=(%_ToNumber(aJ.arguments.frame));
if(bE<0||bE>=this.exec_state_.frameCount()){
return aP.failed('Invalid frame "'+bn+'"');
}
bn=this.exec_state_.frame(bE);
}
}
var O=bn.func().script();
if(!O){
return aP.failed('No source');
}
var bK=O.value();
var bL=bK.line_offset;
var bM=%ScriptLineCount(bK);
bI=(bI===(void 0))?0:bI-bL;
bJ=(bJ===(void 0))?bM:bJ-bL;
if(bI<0)bI=0;
if(bJ>bM)bJ=bM;
if(bI>=bM||bJ<0||bI>bJ){
return aP.failed('Invalid line interval');
}
aP.body={};
aP.body.fromLine=bI+bL;
aP.body.toLine=bJ+bL;
aP.body.fromPosition=%ScriptLineStartPosition(bK,bI);
aP.body.toPosition=
(bJ==0)?0:%ScriptLineEndPosition(bK,bJ-1);
aP.body.totalLines=%ScriptLineCount(bK);
aP.body.source=%_SubString(bK.source,
aP.body.fromPosition,
aP.body.toPosition);
};
DebugCommandProcessor.prototype.scriptsRequest_=function(aJ,aP){
var bN=ScriptTypeFlag(s.ScriptType.Normal);
var bG=false;
var bO=null;
if(aJ.arguments){
if(!(aJ.arguments.types===(void 0))){
bN=(%_ToNumber(aJ.arguments.types));
if(f(bN)||bN<0){
return aP.failed('Invalid types "'+
aJ.arguments.types+'"');
}
}
if(!(aJ.arguments.includeSource===(void 0))){
bG=(!!(aJ.arguments.includeSource));
aP.setOption('includeSource',bG);
}
if((%_IsArray(aJ.arguments.ids))){
bO={};
var bP=aJ.arguments.ids;
for(var L=0;L<bP.length;L++){
bO[bP[L]]=true;
}
}
var bQ=null;
var bR=null;
if(!(aJ.arguments.filter===(void 0))){
var bS=(%_ToNumber(aJ.arguments.filter));
if(!f(bS)){
bR=bS;
}
bQ=aJ.arguments.filter;
}
}
var Y=s.scripts();
aP.body=[];
for(var L=0;L<Y.length;L++){
if(bO&&!bO[Y[L].id]){
continue;
}
if(bQ||bR){
var O=Y[L];
var bT=false;
if(bR&&!bT){
if(O.id&&O.id===bR){
bT=true;
}
}
if(bQ&&!bT){
if(O.name&&O.name.indexOf(bQ)>=0){
bT=true;
}
}
if(!bT)continue;
}
if(bN&ScriptTypeFlag(Y[L].type)){
aP.body.push(j(Y[L]));
}
}
};
DebugCommandProcessor.prototype.suspendRequest_=function(aJ,aP){
aP.running=false;
};
DebugCommandProcessor.prototype.versionRequest_=function(aJ,aP){
aP.body={
V8Version:%GetV8Version()
};
};
DebugCommandProcessor.prototype.changeLiveRequest_=function(
aJ,aP){
if(!aJ.arguments){
return aP.failed('Missing arguments');
}
var bU=aJ.arguments.script_id;
var bV=!!aJ.arguments.preview_only;
var bW=scriptById(bU);
if(!bW){
aP.failed('Script not found');
return;
}
var bX=new d();
if(!(typeof(aJ.arguments.new_source)==='string')){
throw"new_source argument expected";
}
var bY=aJ.arguments.new_source;
var bZ;
try{
bZ=s.LiveEdit.SetScriptSource(bW,
bY,bV,bX);
}catch(e){
if(e instanceof s.LiveEdit.Failure&&"details"in e){
aP.failed(e.message,e.details);
return;
}
throw e;
}
aP.body={change_log:bX,result:bZ};
if(!bV&&!this.running_&&bZ.stack_modified){
aP.body.stepin_recommended=true;
}
};
DebugCommandProcessor.prototype.restartFrameRequest_=function(
aJ,aP){
if(!aJ.arguments){
return aP.failed('Missing arguments');
}
var bn=aJ.arguments.frame;
if(this.exec_state_.frameCount()==0){
return aP.failed('No frames');
}
var ca;
if(!(bn===(void 0))){
var bE=(%_ToNumber(bn));
if(bE<0||bE>=this.exec_state_.frameCount()){
return aP.failed('Invalid frame "'+bn+'"');
}
ca=this.exec_state_.frame(bE);
}else{
ca=this.exec_state_.frame();
}
var bZ=ca.restart();
aP.body={result:bZ};
};
DebugCommandProcessor.prototype.debuggerFlagsRequest_=function(aJ,
aP){
if(!aJ.arguments){
aP.failed('Missing arguments');
return;
}
var cb=aJ.arguments.flags;
aP.body={flags:[]};
if(!(cb===(void 0))){
for(var L=0;L<cb.length;L++){
var aI=cb[L].name;
var cc=z[aI];
if(!cc){
continue;
}
if('value'in cb[L]){
cc.setValue(cb[L].value);
}
aP.body.flags.push({name:aI,value:cc.getValue()});
}
}else{
for(var aI in z){
var A=z[aI].getValue();
aP.body.flags.push({name:aI,value:A});
}
}
};
DebugCommandProcessor.prototype.v8FlagsRequest_=function(aJ,aP){
var cb=aJ.arguments.flags;
if(!cb)cb='';
%SetFlags(cb);
};
DebugCommandProcessor.prototype.gcRequest_=function(aJ,aP){
var u=aJ.arguments.type;
if(!u)u='all';
var cd=%GetHeapUsage();
%CollectGarbage(u);
var ce=%GetHeapUsage();
aP.body={"before":cd,"after":ce};
};
DebugCommandProcessor.prototype.dispatch_=(function(){
var cf=DebugCommandProcessor.prototype;
return{
"continue":cf.continueRequest_,
"break":cf.breakRequest_,
"setbreakpoint":cf.setBreakPointRequest_,
"changebreakpoint":cf.changeBreakPointRequest_,
"clearbreakpoint":cf.clearBreakPointRequest_,
"clearbreakpointgroup":cf.clearBreakPointGroupRequest_,
"disconnect":cf.disconnectRequest_,
"setexceptionbreak":cf.setExceptionBreakRequest_,
"listbreakpoints":cf.listBreakpointsRequest_,
"backtrace":cf.backtraceRequest_,
"frame":cf.frameRequest_,
"scopes":cf.scopesRequest_,
"scope":cf.scopeRequest_,
"setvariablevalue":cf.setVariableValueRequest_,
"evaluate":cf.evaluateRequest_,
"lookup":cf.lookupRequest_,
"references":cf.referencesRequest_,
"source":cf.sourceRequest_,
"scripts":cf.scriptsRequest_,
"suspend":cf.suspendRequest_,
"version":cf.versionRequest_,
"changelive":cf.changeLiveRequest_,
"restartframe":cf.restartFrameRequest_,
"flags":cf.debuggerFlagsRequest_,
"v8flag":cf.v8FlagsRequest_,
"gc":cf.gcRequest_,
};
})();
DebugCommandProcessor.prototype.isRunning=function(){
return this.running_;
};
DebugCommandProcessor.prototype.systemBreak=function(cg,aQ){
return %SystemBreak();
};
function ObjectToProtocolObject_(ch,ci){
var cj={};
for(var aR in ch){
if(typeof aR=='string'){
var ck=ValueToProtocolValue_(ch[aR],
ci);
if(!(ck===(void 0))){
cj[aR]=ck;
}
}
}
return cj;
}
function ArrayToProtocolArray_(bc,ci){
var aM=[];
for(var L=0;L<bc.length;L++){
aM.push(ValueToProtocolValue_(bc[L],ci));
}
return aM;
}
function ValueToProtocolValue_(A,ci){
var aM;
switch(typeof A){
case'object':
if(A instanceof m){
aM=ci.serializeValue(A);
}else if((%_IsArray(A))){
aM=ArrayToProtocolArray_(A,ci);
}else{
aM=ObjectToProtocolObject_(A,ci);
}
break;
case'boolean':
case'string':
case'number':
aM=A;
break;
default:
aM=null;
}
return aM;
}
b.InstallConstants(a,[
"Debug",s,
"DebugCommandProcessor",DebugCommandProcessor,
"BreakEvent",BreakEvent,
"CompileEvent",CompileEvent,
"BreakPoint",BreakPoint,
]);
b.InstallFunctions(b,2,[
"MakeExecutionState",MakeExecutionState,
"MakeExceptionEvent",MakeExceptionEvent,
"MakeBreakEvent",MakeBreakEvent,
"MakeCompileEvent",MakeCompileEvent,
"MakeAsyncTaskEvent",MakeAsyncTaskEvent,
"IsBreakPointTriggered",IsBreakPointTriggered,
"UpdateScriptBreakPoints",UpdateScriptBreakPoints,
]);
b.Export(function(cl){
cl.GetScriptBreakPoints=GetScriptBreakPoints;
});
})

 liveediti˜
(function(a,b){
"use strict";
var c=a.Debug.findScriptSourcePosition;
var d;
var e=a.Array;
var f=a.Math.floor;
var g=a.SyntaxError;
b.Import(function(h){
d=h.GetScriptBreakPoints;
});
var i;
function ApplyPatchMultiChunk(script,diff_array,new_source,preview_only,
change_log){
var j=script.source;
var k=GatherCompileInfo(j,script);
var l=BuildCodeInfoTree(k);
var m=new PosTranslator(diff_array);
MarkChangedFunctions(l,m.GetChunks());
FindLiveSharedInfos(l,script);
var n;
try{
n=GatherCompileInfo(new_source,script);
}catch(e){
var o=
new Failure("Failed to compile new version of script: "+e);
if(e instanceof g){
var p={
type:"liveedit_compile_error",
syntaxErrorMessage:e.message
};
CopyErrorPositionToDetails(e,p);
o.details=p;
}
throw o;
}
var q=BuildCodeInfoTree(n);
FindCorrespondingFunctions(l,q);
var r=new e();
var s=new e();
var t=new e();
var u=new e();
function HarvestTodo(v){
function CollectDamaged(w){
s.push(w);
for(var x=0;x<w.children.length;x++){
CollectDamaged(w.children[x]);
}
}
function CollectNew(y){
for(var x=0;x<y.length;x++){
t.push(y[x]);
CollectNew(y[x].children);
}
}
if(v.status==i.DAMAGED){
CollectDamaged(v);
return;
}
if(v.status==i.UNCHANGED){
u.push(v);
}else if(v.status==i.SOURCE_CHANGED){
u.push(v);
}else if(v.status==i.CHANGED){
r.push(v);
CollectNew(v.unmatched_new_nodes);
}
for(var x=0;x<v.children.length;x++){
HarvestTodo(v.children[x]);
}
}
var z={
change_tree:DescribeChangeTree(l),
textual_diff:{
old_len:j.length,
new_len:new_source.length,
chunks:diff_array
},
updated:false
};
if(preview_only){
return z;
}
HarvestTodo(l);
var A=new e();
var B=new e();
for(var x=0;x<r.length;x++){
var C=r[x].live_shared_function_infos;
var D=
r[x].corresponding_node.info.shared_function_info;
if(C){
for(var E=0;E<C.length;E++){
A.push(C[E]);
B.push(D);
}
}
}
var F=
CheckStackActivations(A,
B,
change_log);
z.stack_modified=F!=0;
var G=TemporaryRemoveBreakPoints(script,change_log);
var H;
if(s.length==0){
%LiveEditReplaceScript(script,new_source,null);
H=(void 0);
}else{
var I=CreateNameForOldScript(script);
H=%LiveEditReplaceScript(script,new_source,
I);
var J=new e();
change_log.push({linked_to_old_script:J});
for(var x=0;x<s.length;x++){
LinkToOldScript(s[x],H,
J);
}
z.created_script_name=I;
}
for(var x=0;x<t.length;x++){
%LiveEditFunctionSetScript(
t[x].info.shared_function_info,script);
}
for(var x=0;x<r.length;x++){
PatchFunctionCode(r[x],change_log);
}
var K=new e();
change_log.push({position_patched:K});
for(var x=0;x<u.length;x++){
PatchPositions(u[x],diff_array,
K);
if(u[x].live_shared_function_infos){
u[x].live_shared_function_infos.
forEach(function(L){
%LiveEditFunctionSourceUpdated(L.raw_array);
});
}
}
G(m,H);
z.updated=true;
return z;
}
function GatherCompileInfo(M,N){
var O=%LiveEditGatherCompileInfo(N,M);
var P=new e();
var Q=new e();
for(var x=0;x<O.length;x++){
var L=new FunctionCompileInfo(O[x]);
%LiveEditFunctionSetScript(L.shared_function_info,(void 0));
P.push(L);
Q.push(x);
}
for(var x=0;x<P.length;x++){
var R=x;
for(var E=x+1;E<P.length;E++){
if(P[R].start_position>P[E].start_position){
R=E;
}
}
if(R!=x){
var S=P[R];
var T=Q[R];
P[R]=P[x];
Q[R]=Q[x];
P[x]=S;
Q[x]=T;
}
}
var U=0;
function ResetIndexes(V,W){
var X=-1;
while(U<P.length&&
P[U].outer_index==W){
var Y=U;
P[Y].outer_index=V;
if(X!=-1){
P[X].next_sibling_index=Y;
}
X=Y;
U++;
ResetIndexes(Y,Q[Y]);
}
if(X!=-1){
P[X].next_sibling_index=-1;
}
}
ResetIndexes(-1,-1);
Assert(U==P.length);
return P;
}
function PatchFunctionCode(v,Z){
var D=v.corresponding_node.info;
if(v.live_shared_function_infos){
v.live_shared_function_infos.forEach(function(aa){
%LiveEditReplaceFunctionCode(D.raw_array,
aa.raw_array);
for(var x=0;x<v.children.length;x++){
if(v.children[x].corresponding_node){
var ab=
v.children[x].corresponding_node.info.
shared_function_info;
if(v.children[x].live_shared_function_infos){
v.children[x].live_shared_function_infos.
forEach(function(ac){
%LiveEditReplaceRefToNestedFunction(
aa.info,
ab,
ac.info);
});
}
}
}
});
Z.push({function_patched:D.function_name});
}else{
Z.push({function_patched:D.function_name,
function_info_not_found:true});
}
}
function LinkToOldScript(ad,H,ae){
if(ad.live_shared_function_infos){
ad.live_shared_function_infos.
forEach(function(L){
%LiveEditFunctionSetScript(L.info,H);
});
ae.push({name:ad.info.function_name});
}else{
ae.push(
{name:ad.info.function_name,not_found:true});
}
}
function TemporaryRemoveBreakPoints(af,Z){
var ag=d(af);
var ah=[];
Z.push({break_points_update:ah});
var ai=[];
for(var x=0;x<ag.length;x++){
var aj=ag[x];
aj.clear();
var ak=c(af,
aj.line(),aj.column());
var al={
position:ak,
line:aj.line(),
column:aj.column()
};
ai.push(al);
}
return function(m,am){
for(var x=0;x<ag.length;x++){
var aj=ag[x];
if(am){
var an=aj.cloneForOtherScript(am);
an.set(am);
ah.push({
type:"copied_to_old",
id:aj.number(),
new_id:an.number(),
positions:ai[x]
});
}
var ao=m.Translate(
ai[x].position,
PosTranslator.ShiftWithTopInsideChunkHandler);
var ap=
af.locationFromPosition(ao,false);
aj.update_positions(ap.line,ap.column);
var aq={
position:ao,
line:ap.line,
column:ap.column
};
aj.set(af);
ah.push({type:"position_changed",
id:aj.number(),
old_positions:ai[x],
new_positions:aq
});
}
};
}
function Assert(ar,as){
if(!ar){
if(as){
throw"Assert "+as;
}else{
throw"Assert";
}
}
}
function DiffChunk(at,au,av,aw){
this.pos1=at;
this.pos2=au;
this.len1=av;
this.len2=aw;
}
function PosTranslator(ax){
var ay=new e();
var az=0;
for(var x=0;x<ax.length;x+=3){
var aA=ax[x];
var aB=aA+az;
var aC=ax[x+1];
var aD=ax[x+2];
ay.push(new DiffChunk(aA,aB,aC-aA,
aD-aB));
az=aD-aC;
}
this.chunks=ay;
}
PosTranslator.prototype.GetChunks=function(){
return this.chunks;
};
PosTranslator.prototype.Translate=function(aE,aF){
var aG=this.chunks;
if(aG.length==0||aE<aG[0].pos1){
return aE;
}
var aH=0;
var aI=aG.length-1;
while(aH<aI){
var aJ=f((aH+aI)/2);
if(aE<aG[aJ+1].pos1){
aI=aJ;
}else{
aH=aJ+1;
}
}
var aK=aG[aH];
if(aE>=aK.pos1+aK.len1){
return aE+aK.pos2+aK.len2-aK.pos1-aK.len1;
}
if(!aF){
aF=PosTranslator.DefaultInsideChunkHandler;
}
return aF(aE,aK);
};
PosTranslator.DefaultInsideChunkHandler=function(aE,aL){
Assert(false,"Cannot translate position in changed area");
};
PosTranslator.ShiftWithTopInsideChunkHandler=
function(aE,aL){
return aE-aL.pos1+aL.pos2;
};
var i={
UNCHANGED:"unchanged",
SOURCE_CHANGED:"source changed",
CHANGED:"changed",
DAMAGED:"damaged"
};
function CodeInfoTreeNode(aM,aN,aO){
this.info=aM;
this.children=aN;
this.array_index=aO;
this.parent=(void 0);
this.status=i.UNCHANGED;
this.status_explanation=(void 0);
this.new_start_pos=(void 0);
this.new_end_pos=(void 0);
this.corresponding_node=(void 0);
this.unmatched_new_nodes=(void 0);
this.textual_corresponding_node=(void 0);
this.textually_unmatched_new_nodes=(void 0);
this.live_shared_function_infos=(void 0);
}
function BuildCodeInfoTree(aP){
var aQ=0;
function BuildNode(){
var aR=aQ;
aQ++;
var aS=new e();
while(aQ<aP.length&&
aP[aQ].outer_index==aR){
aS.push(BuildNode());
}
var w=new CodeInfoTreeNode(aP[aR],aS,
aR);
for(var x=0;x<aS.length;x++){
aS[x].parent=w;
}
return w;
}
var aT=BuildNode();
Assert(aQ==aP.length);
return aT;
}
function MarkChangedFunctions(aU,ay){
var aV=new function(){
var aW=0;
var aX=0;
this.current=function(){return ay[aW];};
this.next=function(){
var aK=ay[aW];
aX=aK.pos2+aK.len2-(aK.pos1+aK.len1);
aW++;
};
this.done=function(){return aW>=ay.length;};
this.TranslatePos=function(aE){return aE+aX;};
};
function ProcessInternals(aY){
aY.new_start_pos=aV.TranslatePos(
aY.info.start_position);
var aZ=0;
var ba=false;
var bb=false;
while(!aV.done()&&
aV.current().pos1<aY.info.end_position){
if(aZ<aY.children.length){
var bc=aY.children[aZ];
if(bc.info.end_position<=aV.current().pos1){
ProcessUnchangedChild(bc);
aZ++;
continue;
}else if(bc.info.start_position>=
aV.current().pos1+aV.current().len1){
ba=true;
aV.next();
continue;
}else if(bc.info.start_position<=aV.current().pos1&&
bc.info.end_position>=aV.current().pos1+
aV.current().len1){
ProcessInternals(bc);
bb=bb||
(bc.status!=i.UNCHANGED);
ba=ba||
(bc.status==i.DAMAGED);
aZ++;
continue;
}else{
ba=true;
bc.status=i.DAMAGED;
bc.status_explanation=
"Text diff overlaps with function boundary";
aZ++;
continue;
}
}else{
if(aV.current().pos1+aV.current().len1<=
aY.info.end_position){
aY.status=i.CHANGED;
aV.next();
continue;
}else{
aY.status=i.DAMAGED;
aY.status_explanation=
"Text diff overlaps with function boundary";
return;
}
}
Assert("Unreachable",false);
}
while(aZ<aY.children.length){
var bc=aY.children[aZ];
ProcessUnchangedChild(bc);
aZ++;
}
if(ba){
aY.status=i.CHANGED;
}else if(bb){
aY.status=i.SOURCE_CHANGED;
}
aY.new_end_pos=
aV.TranslatePos(aY.info.end_position);
}
function ProcessUnchangedChild(w){
w.new_start_pos=aV.TranslatePos(w.info.start_position);
w.new_end_pos=aV.TranslatePos(w.info.end_position);
}
ProcessInternals(aU);
}
function FindCorrespondingFunctions(bd,be){
function ProcessNode(v,bf){
var bg=
IsFunctionContextLocalsChanged(v.info,bf.info);
if(bg){
v.status=i.CHANGED;
}
var bh=v.children;
var bi=bf.children;
var bj=[];
var bk=[];
var bl=0;
var bm=0;
while(bl<bh.length){
if(bh[bl].status==i.DAMAGED){
bl++;
}else if(bm<bi.length){
if(bi[bm].info.start_position<
bh[bl].new_start_pos){
bj.push(bi[bm]);
bk.push(bi[bm]);
bm++;
}else if(bi[bm].info.start_position==
bh[bl].new_start_pos){
if(bi[bm].info.end_position==
bh[bl].new_end_pos){
bh[bl].corresponding_node=
bi[bm];
bh[bl].textual_corresponding_node=
bi[bm];
if(bg){
bh[bl].status=i.DAMAGED;
bh[bl].status_explanation=
"Enclosing function is now incompatible. "+
bg;
bh[bl].corresponding_node=(void 0);
}else if(bh[bl].status!=
i.UNCHANGED){
ProcessNode(bh[bl],
bi[bm]);
if(bh[bl].status==i.DAMAGED){
bj.push(
bh[bl].corresponding_node);
bh[bl].corresponding_node=(void 0);
v.status=i.CHANGED;
}
}
}else{
bh[bl].status=i.DAMAGED;
bh[bl].status_explanation=
"No corresponding function in new script found";
v.status=i.CHANGED;
bj.push(bi[bm]);
bk.push(bi[bm]);
}
bm++;
bl++;
}else{
bh[bl].status=i.DAMAGED;
bh[bl].status_explanation=
"No corresponding function in new script found";
v.status=i.CHANGED;
bl++;
}
}else{
bh[bl].status=i.DAMAGED;
bh[bl].status_explanation=
"No corresponding function in new script found";
v.status=i.CHANGED;
bl++;
}
}
while(bm<bi.length){
bj.push(bi[bm]);
bk.push(bi[bm]);
bm++;
}
if(v.status==i.CHANGED){
if(v.info.param_num!=bf.info.param_num){
v.status=i.DAMAGED;
v.status_explanation="Changed parameter number: "+
v.info.param_num+" and "+bf.info.param_num;
}
}
v.unmatched_new_nodes=bj;
v.textually_unmatched_new_nodes=
bk;
}
ProcessNode(bd,be);
bd.corresponding_node=be;
bd.textual_corresponding_node=be;
Assert(bd.status!=i.DAMAGED,
"Script became damaged");
}
function FindLiveSharedInfos(bd,N){
var bn=%LiveEditFindSharedFunctionInfosForScript(N);
var bo=new e();
for(var x=0;x<bn.length;x++){
bo.push(new SharedInfoWrapper(bn[x]));
}
function FindFunctionInfos(P){
var bp=[];
for(var x=0;x<bo.length;x++){
var bq=bo[x];
if(bq.start_position==P.start_position&&
bq.end_position==P.end_position){
bp.push(bq);
}
}
if(bp.length>0){
return bp;
}
}
function TraverseTree(w){
w.live_shared_function_infos=FindFunctionInfos(w.info);
for(var x=0;x<w.children.length;x++){
TraverseTree(w.children[x]);
}
}
TraverseTree(bd);
}
function FunctionCompileInfo(br){
this.function_name=br[0];
this.start_position=br[1];
this.end_position=br[2];
this.param_num=br[3];
this.scope_info=br[4];
this.outer_index=br[5];
this.shared_function_info=br[6];
this.next_sibling_index=null;
this.raw_array=br;
}
function SharedInfoWrapper(br){
this.function_name=br[0];
this.start_position=br[1];
this.end_position=br[2];
this.info=br[3];
this.raw_array=br;
}
function PatchPositions(ad,ax,ae){
if(ad.live_shared_function_infos){
ad.live_shared_function_infos.forEach(function(L){
%LiveEditPatchFunctionPositions(L.raw_array,
ax);
});
ae.push({name:ad.info.function_name});
}else{
ae.push(
{name:ad.info.function_name,info_not_found:true});
}
}
function CreateNameForOldScript(N){
return N.name+" (old)";
}
function IsFunctionContextLocalsChanged(bs,bt){
var bu=bs.scope_info;
var bv=bt.scope_info;
var bw;
var bx;
if(bu){
bw=bu.toString();
}else{
bw="";
}
if(bv){
bx=bv.toString();
}else{
bx="";
}
if(bw!=bx){
return"Variable map changed: ["+bw+
"] => ["+bx+"]";
}
return;
}
var by;
function CheckStackActivations(old_shared_wrapper_list,
new_shared_list,
Z){
var bz=new e();
for(var x=0;x<old_shared_wrapper_list.length;x++){
bz[x]=old_shared_wrapper_list[x].info;
}
var bA=%LiveEditCheckAndDropActivations(
bz,new_shared_list,true);
if(bA[old_shared_wrapper_list.length]){
throw new Failure(bA[old_shared_wrapper_list.length]);
}
var bB=new e();
var bC=new e();
for(var x=0;x<bz.length;x++){
var bD=old_shared_wrapper_list[x];
if(bA[x]==by.REPLACED_ON_ACTIVE_STACK){
bC.push({name:bD.function_name});
}else if(bA[x]!=by.AVAILABLE_FOR_PATCH){
var bE={
name:bD.function_name,
start_pos:bD.start_position,
end_pos:bD.end_position,
replace_problem:
by.SymbolName(bA[x])
};
bB.push(bE);
}
}
if(bC.length>0){
Z.push({dropped_from_stack:bC});
}
if(bB.length>0){
Z.push({functions_on_stack:bB});
throw new Failure("Blocked by functions on stack");
}
return bC.length;
}
var by={
AVAILABLE_FOR_PATCH:1,
BLOCKED_ON_ACTIVE_STACK:2,
BLOCKED_ON_OTHER_STACK:3,
BLOCKED_UNDER_NATIVE_CODE:4,
REPLACED_ON_ACTIVE_STACK:5,
BLOCKED_UNDER_GENERATOR:6,
BLOCKED_ACTIVE_GENERATOR:7,
BLOCKED_NO_NEW_TARGET_ON_RESTART:8
};
by.SymbolName=function(bF){
var bG=by;
for(var bH in bG){
if(bG[bH]==bF){
return bH;
}
}
};
function Failure(as){
this.message=as;
}
Failure.prototype.toString=function(){
return"LiveEdit Failure: "+this.message;
};
function CopyErrorPositionToDetails(bI,p){
function createPositionStruct(N,bJ){
if(bJ==-1)return;
var bK=N.locationFromPosition(bJ,true);
if(bK==null)return;
return{
line:bK.line+1,
column:bK.column+1,
position:bJ
};
}
if(!("scriptObject"in bI)||!("startPosition"in bI)){
return;
}
var N=bI.scriptObject;
var bL={
start:createPositionStruct(N,bI.startPosition),
end:createPositionStruct(N,bI.endPosition)
};
p.position=bL;
}
function SetScriptSource(N,bM,bN,Z){
var j=N.source;
var bO=CompareStrings(j,bM);
return ApplyPatchMultiChunk(N,bO,bM,bN,
Z);
}
function CompareStrings(bP,bQ){
return %LiveEditCompareStrings(bP,bQ);
}
function ApplySingleChunkPatch(N,change_pos,change_len,new_str,
Z){
var j=N.source;
var bM=j.substring(0,change_pos)+
new_str+j.substring(change_pos+change_len);
return ApplyPatchMultiChunk(N,
[change_pos,change_pos+change_len,change_pos+new_str.length],
bM,false,Z);
}
function DescribeChangeTree(bd){
function ProcessOldNode(w){
var bR=[];
for(var x=0;x<w.children.length;x++){
var bc=w.children[x];
if(bc.status!=i.UNCHANGED){
bR.push(ProcessOldNode(bc));
}
}
var bS=[];
if(w.textually_unmatched_new_nodes){
for(var x=0;x<w.textually_unmatched_new_nodes.length;x++){
var bc=w.textually_unmatched_new_nodes[x];
bS.push(ProcessNewNode(bc));
}
}
var bT={
name:w.info.function_name,
positions:DescribePositions(w),
status:w.status,
children:bR,
new_children:bS
};
if(w.status_explanation){
bT.status_explanation=w.status_explanation;
}
if(w.textual_corresponding_node){
bT.new_positions=DescribePositions(w.textual_corresponding_node);
}
return bT;
}
function ProcessNewNode(w){
var bR=[];
if(false){
for(var x=0;x<w.children.length;x++){
bR.push(ProcessNewNode(w.children[x]));
}
}
var bT={
name:w.info.function_name,
positions:DescribePositions(w),
children:bR,
};
return bT;
}
function DescribePositions(w){
return{
start_position:w.info.start_position,
end_position:w.info.end_position
};
}
return ProcessOldNode(bd);
}
var bU={};
bU.SetScriptSource=SetScriptSource;
bU.ApplyPatchMultiChunk=ApplyPatchMultiChunk;
bU.Failure=Failure;
bU.TestApi={
PosTranslator:PosTranslator,
CompareStrings:CompareStrings,
ApplySingleChunkPatch:ApplySingleChunkPatch
};
a.Debug.LiveEdit=bU;
})

H prologueÂF
(function(a,b,c){
"use strict";
%CheckIsBootstrapping();
var d=(void 0);
var e=(void 0);
var f=%ExportFromRuntime({});
var g=(void 0);
function SetupTypedArray(h){
h.next=g;
g=h;
}
function Export(h){
h(f);
}
function Import(h){
h.next=d;
d=h;
}
function ImportNow(i){
return f[i];
}
function ImportFromExperimental(h){
h.next=e;
e=h;
}
function SetFunctionName(h,i,j){
if((typeof(i)==='symbol')){
i="["+%SymbolDescription(i)+"]";
}
if((j===(void 0))){
%FunctionSetName(h,i);
}else{
%FunctionSetName(h,j+" "+i);
}
}
function InstallConstants(k,l){
%CheckIsBootstrapping();
%OptimizeObjectForAddingMultipleProperties(k,l.length>>1);
var m=2|4|1;
for(var n=0;n<l.length;n+=2){
var i=l[n];
var o=l[n+1];
%AddNamedProperty(k,i,o,m);
}
%ToFastProperties(k);
}
function InstallFunctions(k,m,p){
%CheckIsBootstrapping();
%OptimizeObjectForAddingMultipleProperties(k,p.length>>1);
for(var n=0;n<p.length;n+=2){
var q=p[n];
var h=p[n+1];
SetFunctionName(h,q);
%FunctionRemovePrototype(h);
%AddNamedProperty(k,q,h,m);
%SetNativeFlag(h);
}
%ToFastProperties(k);
}
function InstallGetter(k,i,r,m,j){
%CheckIsBootstrapping();
if((m===(void 0)))m=2;
SetFunctionName(r,i,(j===(void 0))?"get":j);
%FunctionRemovePrototype(r);
%DefineGetterPropertyUnchecked(k,i,r,m);
%SetNativeFlag(r);
}
function InstallGetterSetter(k,i,r,s,m){
%CheckIsBootstrapping();
if((m===(void 0)))m=2;
SetFunctionName(r,i,"get");
SetFunctionName(s,i,"set");
%FunctionRemovePrototype(r);
%FunctionRemovePrototype(s);
%DefineAccessorPropertyUnchecked(k,i,r,s,m);
%SetNativeFlag(r);
%SetNativeFlag(s);
}
function OverrideFunction(k,i,h,t){
%CheckIsBootstrapping();
%object_define_property(k,i,{value:h,
writeable:true,
configurable:true,
enumerable:false});
SetFunctionName(h,i);
if(!t)%FunctionRemovePrototype(h);
%SetNativeFlag(h);
}
function SetUpLockedPrototype(
constructor,fields,methods){
%CheckIsBootstrapping();
var u=constructor.prototype;
var v=(methods.length>>1)+(fields?fields.length:0);
if(v>=4){
%OptimizeObjectForAddingMultipleProperties(u,v);
}
if(fields){
for(var n=0;n<fields.length;n++){
%AddNamedProperty(u,fields[n],
(void 0),2|4);
}
}
for(var n=0;n<methods.length;n+=2){
var q=methods[n];
var h=methods[n+1];
%AddNamedProperty(u,q,h,2|4|1);
%SetNativeFlag(h);
}
%InternalSetPrototype(u,null);
%ToFastProperties(u);
}
function PostNatives(b){
%CheckIsBootstrapping();
for(;!(d===(void 0));d=d.next){
d(f);
}
var w=[
"FormatDateToParts",
"MapEntries",
"MapIterator",
"MapIteratorNext",
"MaxSimple",
"MinSimple",
"SetIterator",
"SetIteratorNext",
"SetValues",
"ToLocaleLowerCaseI18N",
"ToLocaleUpperCaseI18N",
"ToLowerCaseI18N",
"ToUpperCaseI18N",
"promise_result_symbol",
"promise_state_symbol",
"reflect_apply",
"to_string_tag_symbol",
];
var x={};
%OptimizeObjectForAddingMultipleProperties(
x,w.length);
for(var q of w){
x[q]=f[q];
}
%ToFastProperties(x);
f=x;
b.PostNatives=(void 0);
b.ImportFromExperimental=(void 0);
}
function PostExperimentals(b){
%CheckIsBootstrapping();
%ExportExperimentalFromRuntime(f);
for(;!(d===(void 0));d=d.next){
d(f);
}
for(;!(e===(void 0));
e=e.next){
e(f);
}
b.Export=(void 0);
b.PostDebug=(void 0);
b.PostExperimentals=(void 0);
g=(void 0);
}
function PostDebug(b){
for(;!(d===(void 0));d=d.next){
d(f);
}
f=(void 0);
b.Export=(void 0);
b.Import=(void 0);
b.ImportNow=(void 0);
b.PostDebug=(void 0);
b.PostExperimentals=(void 0);
g=(void 0);
}
function InitializeBuiltinTypedArrays(b,y,z){
var A=g;
for(;!(A===(void 0));A=A.next){
A(y,z);
}
}
%OptimizeObjectForAddingMultipleProperties(b,14);
b.Import=Import;
b.ImportNow=ImportNow;
b.Export=Export;
b.ImportFromExperimental=ImportFromExperimental;
b.SetFunctionName=SetFunctionName;
b.InstallConstants=InstallConstants;
b.InstallFunctions=InstallFunctions;
b.InstallGetter=InstallGetter;
b.InstallGetterSetter=InstallGetterSetter;
b.OverrideFunction=OverrideFunction;
b.SetUpLockedPrototype=SetUpLockedPrototype;
b.PostNatives=PostNatives;
b.PostExperimentals=PostExperimentals;
b.PostDebug=PostDebug;
%ToFastProperties(b);
%OptimizeObjectForAddingMultipleProperties(c,5);
c.logStackTrace=function logStackTrace(){
%DebugTrace();
};
c.log=function log(){
let message='';
for(const arg of arguments){
message+=arg;
}
%GlobalPrint(message);
};
c.createPrivateSymbol=function createPrivateSymbol(i){
return %CreatePrivateSymbol(i);
};
c.simpleBind=function simpleBind(B,C){
return function(...args){
return %reflect_apply(B,C,args);
};
};
c.uncurryThis=function uncurryThis(B){
return function(C,...args){
return %reflect_apply(B,C,args);
};
};
%ToFastProperties(c);
})

runtime5
(function(a,b){
%CheckIsBootstrapping();
var c=a.Array;
var d=a.Boolean;
var e=a.String;
var f;
b.Import(function(g){
f=g.species_symbol;
});
function ToPositiveInteger(h,i){
var j=(%_ToInteger(h))+0;
if(j<0)throw %make_range_error(i);
return j;
}
function ToIndex(h,i){
var j=(%_ToInteger(h))+0;
if(j<0||j>9007199254740991)throw %make_range_error(i);
return j;
}
function MaxSimple(k,l){
return k>l?k:l;
}
function MinSimple(k,l){
return k>l?l:k;
}
%SetForceInlineFlag(MaxSimple);
%SetForceInlineFlag(MinSimple);
function SpeciesConstructor(m,n){
var o=m.constructor;
if((o===(void 0))){
return n;
}
if(!(%_IsJSReceiver(o))){
throw %make_type_error(28);
}
var p=o[f];
if((p==null)){
return n;
}
if(%IsConstructor(p)){
return p;
}
throw %make_type_error(236);
}
%FunctionSetPrototype(c,new c(0));
b.Export(function(q){
q.MaxSimple=MaxSimple;
q.MinSimple=MinSimple;
q.ToPositiveInteger=ToPositiveInteger;
q.ToIndex=ToIndex;
q.SpeciesConstructor=SpeciesConstructor;
});
})

$v8nativesu
(function(a,b){
%CheckIsBootstrapping();
var c=a.Number;
var d=a.Object;
var e=b.ImportNow("iterator_symbol");
var f=%GetRootNaN();
var g=b.ImportNow("object_to_string");
var h=2|4|1;
b.InstallConstants(a,[
"Infinity",(1/0),
"NaN",f,
"undefined",(void 0),
]);
function ObjectToLocaleString(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Object.prototype.toLocaleString");
return this.toString();
}
function ObjectValueOf(){
return(%_ToObject(this));
}
function ObjectIsPrototypeOf(i){
if(!(%_IsJSReceiver(i)))return false;
var j=(%_ToObject(this));
return %HasInPrototypeChain(i,j);
}
function GetMethod(k,l){
var m=k[l];
if((m==null))return(void 0);
if((typeof(m)==='function'))return m;
throw %make_type_error(15,typeof m);
}
function ObjectConstructor(n){
if(d!=new.target&&!(new.target===(void 0))){
return this;
}
if((n===null)||(n===(void 0)))return{};
return(%_ToObject(n));
}
%SetNativeFlag(d);
%SetCode(d,ObjectConstructor);
%AddNamedProperty(d.prototype,"constructor",d,
2);
b.InstallFunctions(d.prototype,2,[
"toString",g,
"toLocaleString",ObjectToLocaleString,
"valueOf",ObjectValueOf,
"isPrototypeOf",ObjectIsPrototypeOf,
]);
b.InstallConstants(c,[
"MAX_VALUE",1.7976931348623157e+308,
"MIN_VALUE",5e-324,
"NaN",f,
"NEGATIVE_INFINITY",-(1/0),
"POSITIVE_INFINITY",(1/0),
"MAX_SAFE_INTEGER",9007199254740991,
"MIN_SAFE_INTEGER",-9007199254740991,
"EPSILON",2.220446049250313e-16,
]);
function GetIterator(k,o){
if((o===(void 0))){
o=k[e];
}
if(!(typeof(o)==='function')){
throw %make_type_error(71,k);
}
var p=%_Call(o,k);
if(!(%_IsJSReceiver(p))){
throw %make_type_error(65,p);
}
return p;
}
b.Export(function(q){
q.GetIterator=GetIterator;
q.GetMethod=GetMethod;
q.ObjectHasOwnProperty=d.prototype.hasOwnProperty;
});
%InstallToContext([
"object_value_of",ObjectValueOf,
]);
})

symbolô
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.Symbol;
var d=b.ImportNow("has_instance_symbol");
var e=
b.ImportNow("is_concat_spreadable_symbol");
var f=b.ImportNow("iterator_symbol");
var g=b.ImportNow("match_symbol");
var h=b.ImportNow("replace_symbol");
var i=b.ImportNow("search_symbol");
var j=b.ImportNow("species_symbol");
var k=b.ImportNow("split_symbol");
var l=b.ImportNow("to_primitive_symbol");
var m=b.ImportNow("to_string_tag_symbol");
var n=b.ImportNow("unscopables_symbol");
function SymbolFor(o){
o=(%_ToString(o));
var p=%SymbolRegistry();
if((p.for[o]===(void 0))){
var q=%CreateSymbol(o);
p.for[o]=q;
p.keyFor[q]=o;
}
return p.for[o];
}
function SymbolKeyFor(q){
if(!(typeof(q)==='symbol'))throw %make_type_error(138,q);
return %SymbolRegistry().keyFor[q];
}
b.InstallConstants(c,[
"hasInstance",d,
"isConcatSpreadable",e,
"iterator",f,
"match",g,
"replace",h,
"search",i,
"species",j,
"split",k,
"toPrimitive",l,
"toStringTag",m,
"unscopables",n,
]);
b.InstallFunctions(c,2,[
"for",SymbolFor,
"keyFor",SymbolKeyFor
]);
})

arrayfc
(function(a,b,c){
"use strict";
%CheckIsBootstrapping();
var d;
var e;
var f=a.Array;
var g=b.InternalArray;
var h=b.InternalPackedArray;
var i;
var j;
var k;
var l=b.ImportNow("object_to_string");
var m=b.ImportNow("iterator_symbol");
var n=b.ImportNow("species_symbol");
var o=b.ImportNow("unscopables_symbol");
b.Import(function(p){
d=p.GetIterator;
e=p.GetMethod;
i=p.MaxSimple;
j=p.MinSimple;
k=p.ObjectHasOwnProperty;
});
function ArraySpeciesCreate(q,r){
r=((r)+0);
var s=%ArraySpeciesConstructor(q);
return new s(r);
}
function KeySortCompare(t,u){
return t-u;
}
function GetSortedArrayKeys(q,v){
if((typeof(v)==='number')){
var w=v;
var x=new g();
for(var y=0;y<w;++y){
var z=q[y];
if(!(z===(void 0))||y in q){
x.push(y);
}
}
return x;
}
return InnerArraySort(v,v.length,KeySortCompare);
}
function SparseJoinWithSeparatorJS(q,x,r,A,B){
var C=x.length;
var D=new g(C*2);
for(var y=0;y<C;y++){
var E=x[y];
D[y*2]=E;
D[y*2+1]=ConvertToString(A,q[E]);
}
return %SparseJoinWithSeparator(D,r,B);
}
function SparseJoin(q,x,A){
var C=x.length;
var D=new g(C);
for(var y=0;y<C;y++){
D[y]=ConvertToString(A,q[x[y]]);
}
return %StringBuilderConcat(D,C,'');
}
function UseSparseVariant(q,r,F,G){
if(!F||r<1000||%HasComplexElements(q)){
return false;
}
if(!%_IsSmi(r)){
return true;
}
var H=r>>2;
var I=%EstimateNumberOfElements(q);
return(I<H)&&
(G>I*4);
}
function Stack(){
this.length=0;
this.values=new g();
}
Stack.prototype.length=null;
Stack.prototype.values=null;
function StackPush(J,K){
J.values[J.length++]=K;
}
function StackPop(J){
J.values[--J.length]=null
}
function StackHas(J,L){
var r=J.length;
var M=J.values;
for(var y=0;y<r;y++){
if(M[y]===L)return true;
}
return false;
}
var N=new Stack();
function DoJoin(q,r,F,B,A){
if(UseSparseVariant(q,r,F,r)){
%NormalizeElements(q);
var x=GetSortedArrayKeys(q,%GetArrayKeys(q,r));
if(B===''){
if(x.length===0)return'';
return SparseJoin(q,x,A);
}else{
return SparseJoinWithSeparatorJS(
q,x,r,A,B);
}
}
if(r===1){
return ConvertToString(A,q[0]);
}
var D=new g(r);
for(var y=0;y<r;y++){
D[y]=ConvertToString(A,q[y]);
}
if(B===''){
return %StringBuilderConcat(D,r,'');
}else{
return %StringBuilderJoin(D,r,B);
}
}
function Join(q,r,B,A){
if(r===0)return'';
var F=(%_IsArray(q));
if(F){
if(StackHas(N,q))return'';
StackPush(N,q);
}
try{
return DoJoin(q,r,F,B,A);
}finally{
if(F)StackPop(N);
}
}
function ConvertToString(A,O){
if((O==null))return'';
return(%_ToString(A?O.toLocaleString():O));
}
function SparseSlice(q,P,Q,R,S){
var v=%GetArrayKeys(q,P+Q);
if((typeof(v)==='number')){
var w=v;
for(var y=P;y<w;++y){
var T=q[y];
if(!(T===(void 0))||y in q){
%CreateDataProperty(S,y-P,T);
}
}
}else{
var r=v.length;
for(var U=0;U<r;++U){
var E=v[U];
if(E>=P){
var T=q[E];
if(!(T===(void 0))||E in q){
%CreateDataProperty(S,E-P,T);
}
}
}
}
}
function SparseMove(q,P,Q,R,V){
if(V===Q)return;
var W=new g(
j(R-Q+V,0xffffffff));
var X;
var v=%GetArrayKeys(q,R);
if((typeof(v)==='number')){
var w=v;
for(var y=0;y<P&&y<w;++y){
var T=q[y];
if(!(T===(void 0))||y in q){
W[y]=T;
}
}
for(var y=P+Q;y<w;++y){
var T=q[y];
if(!(T===(void 0))||y in q){
W[y-Q+V]=T;
}
}
}else{
var r=v.length;
for(var U=0;U<r;++U){
var E=v[U];
if(E<P){
var T=q[E];
if(!(T===(void 0))||E in q){
W[E]=T;
}
}else if(E>=P+Q){
var T=q[E];
if(!(T===(void 0))||E in q){
var Y=E-Q+V;
W[Y]=T;
if(Y>0xfffffffe){
X=X||new g();
X.push(Y);
}
}
}
}
}
%MoveArrayContents(W,q);
if(!(X===(void 0))){
var r=X.length;
for(var y=0;y<r;++y){
var E=X[y];
q[E]=W[E];
}
}
}
function SimpleSlice(q,P,Q,R,S){
for(var y=0;y<Q;y++){
var Z=P+y;
if(Z in q){
var T=q[Z];
%CreateDataProperty(S,y,T);
}
}
}
function SimpleMove(q,P,Q,R,V){
if(V!==Q){
if(V>Q){
for(var y=R-Q;y>P;y--){
var aa=y+Q-1;
var ab=y+V-1;
if(aa in q){
q[ab]=q[aa];
}else{
delete q[ab];
}
}
}else{
for(var y=P;y<R-Q;y++){
var aa=y+Q;
var ab=y+V;
if(aa in q){
q[ab]=q[aa];
}else{
delete q[ab];
}
}
for(var y=R;y>R-Q+V;y--){
delete q[y-1];
}
}
}
}
function ArrayToString(){
var q;
var ac;
if((%_IsArray(this))){
ac=this.join;
if(ac===ArrayJoin){
return Join(this,this.length,',',false);
}
q=this;
}else{
q=(%_ToObject(this));
ac=q.join;
}
if(!(typeof(ac)==='function')){
return %_Call(l,q);
}
return %_Call(ac,q);
}
function InnerArrayToLocaleString(q,r){
return Join(q,(%_ToLength(r)),',',true);
}
function ArrayToLocaleString(){
var q=(%_ToObject(this));
var ad=q.length;
return InnerArrayToLocaleString(q,ad);
}
function InnerArrayJoin(B,q,r){
if((B===(void 0))){
B=',';
}else{
B=(%_ToString(B));
}
if(r===1){
var z=q[0];
if((z==null))return'';
return(%_ToString(z));
}
return Join(q,r,B,false);
}
function ArrayJoin(B){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.join");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArrayJoin(B,q,r);
}
function ArrayPop(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.pop");
var q=(%_ToObject(this));
var ae=(%_ToLength(q.length));
if(ae==0){
q.length=ae;
return;
}
ae--;
var K=q[ae];
%DeleteProperty_Strict(q,ae);
q.length=ae;
return K;
}
function ArrayPush(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.push");
var q=(%_ToObject(this));
var ae=(%_ToLength(q.length));
var af=arguments.length;
if(af>9007199254740991-ae)throw %make_type_error(228,af,ae);
for(var y=0;y<af;y++){
q[y+ae]=arguments[y];
}
var ag=ae+af;
q.length=ag;
return ag;
}
function SparseReverse(q,R){
var x=GetSortedArrayKeys(q,%GetArrayKeys(q,R));
var ah=x.length-1;
var ai=0;
while(ai<=ah){
var y=x[ai];
var aj=x[ah];
var ak=R-aj-1;
var al,am;
if(ak<=y){
am=aj;
while(x[--ah]==aj){}
al=ak;
}
if(ak>=y){
al=y;
while(x[++ai]==y){}
am=R-y-1;
}
var an=q[al];
if(!(an===(void 0))||al in q){
var ao=q[am];
if(!(ao===(void 0))||am in q){
q[al]=ao;
q[am]=an;
}else{
q[am]=an;
delete q[al];
}
}else{
var ao=q[am];
if(!(ao===(void 0))||am in q){
q[al]=ao;
delete q[am];
}
}
}
}
function PackedArrayReverse(q,R){
var aj=R-1;
for(var y=0;y<aj;y++,aj--){
var an=q[y];
var ao=q[aj];
q[y]=ao;
q[aj]=an;
}
return q;
}
function GenericArrayReverse(q,R){
var aj=R-1;
for(var y=0;y<aj;y++,aj--){
if(y in q){
var an=q[y];
if(aj in q){
var ao=q[aj];
q[y]=ao;
q[aj]=an;
}else{
q[aj]=an;
delete q[y];
}
}else{
if(aj in q){
var ao=q[aj];
q[y]=ao;
delete q[aj];
}
}
}
return q;
}
function ArrayReverse(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.reverse");
var q=(%_ToObject(this));
var R=(%_ToLength(q.length));
var ap=(%_IsArray(q));
if(UseSparseVariant(q,R,ap,R)){
%NormalizeElements(q);
SparseReverse(q,R);
return q;
}else if(ap&&%_HasFastPackedElements(q)){
return PackedArrayReverse(q,R);
}else{
return GenericArrayReverse(q,R);
}
}
function ArrayShift(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.shift");
var q=(%_ToObject(this));
var R=(%_ToLength(q.length));
if(R===0){
q.length=0;
return;
}
if(%object_is_sealed(q))throw %make_type_error(13);
var aq=q[0];
if(UseSparseVariant(q,R,(%_IsArray(q)),R)){
SparseMove(q,0,1,R,0);
}else{
SimpleMove(q,0,1,R,0);
}
q.length=R-1;
return aq;
}
function ArrayUnshift(ar){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.unshift");
var q=(%_ToObject(this));
var R=(%_ToLength(q.length));
var as=arguments.length;
if(R>0&&UseSparseVariant(q,R,(%_IsArray(q)),R)&&
!%object_is_sealed(q)){
SparseMove(q,0,0,R,as);
}else{
SimpleMove(q,0,0,R,as);
}
for(var y=0;y<as;y++){
q[y]=arguments[y];
}
var ag=R+as;
q.length=ag;
return ag;
}
function ArraySlice(at,au){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.slice");
var q=(%_ToObject(this));
var R=(%_ToLength(q.length));
var P=(%_ToInteger(at));
var av=R;
if(!(au===(void 0)))av=(%_ToInteger(au));
if(P<0){
P+=R;
if(P<0)P=0;
}else{
if(P>R)P=R;
}
if(av<0){
av+=R;
if(av<0)av=0;
}else{
if(av>R)av=R;
}
var aw=ArraySpeciesCreate(q,i(av-P,0));
if(av<P)return aw;
if(UseSparseVariant(q,R,(%_IsArray(q)),av-P)){
%NormalizeElements(q);
if((%_IsArray(aw)))%NormalizeElements(aw);
SparseSlice(q,P,av-P,R,aw);
}else{
SimpleSlice(q,P,av-P,R,aw);
}
aw.length=av-P;
return aw;
}
function ComputeSpliceStartIndex(P,R){
if(P<0){
P+=R;
return P<0?0:P;
}
return P>R?R:P;
}
function ComputeSpliceDeleteCount(ax,as,R,P){
var Q=0;
if(as==1)
return R-P;
Q=(%_ToInteger(ax));
if(Q<0)
return 0;
if(Q>R-P)
return R-P;
return Q;
}
function ArraySplice(at,ax){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.splice");
var as=arguments.length;
var q=(%_ToObject(this));
var R=(%_ToLength(q.length));
var P=ComputeSpliceStartIndex((%_ToInteger(at)),R);
var Q=ComputeSpliceDeleteCount(ax,as,R,
P);
var S=ArraySpeciesCreate(q,Q);
S.length=Q;
var ay=as>2?as-2:0;
if(Q!=ay&&%object_is_sealed(q)){
throw %make_type_error(13);
}else if(Q>0&&%object_is_frozen(q)){
throw %make_type_error(12);
}
var az=Q;
if(ay!=Q){
az+=R-P-Q;
}
if(UseSparseVariant(q,R,(%_IsArray(q)),az)){
%NormalizeElements(q);
if((%_IsArray(S)))%NormalizeElements(S);
SparseSlice(q,P,Q,R,S);
SparseMove(q,P,Q,R,ay);
}else{
SimpleSlice(q,P,Q,R,S);
SimpleMove(q,P,Q,R,ay);
}
var y=P;
var aA=2;
var aB=arguments.length;
while(aA<aB){
q[y++]=arguments[aA++];
}
q.length=R-Q+ay;
return S;
}
function InnerArraySort(q,r,aC){
if(!(typeof(aC)==='function')){
aC=function(O,aD){
if(O===aD)return 0;
if(%_IsSmi(O)&&%_IsSmi(aD)){
return %SmiLexicographicCompare(O,aD);
}
O=(%_ToString(O));
aD=(%_ToString(aD));
if(O==aD)return 0;
else return O<aD?-1:1;
};
}
var aE=function InsertionSort(t,p,aF){
for(var y=p+1;y<aF;y++){
var aG=t[y];
for(var aj=y-1;aj>=p;aj--){
var aH=t[aj];
var aI=aC(aH,aG);
if(aI>0){
t[aj+1]=aH;
}else{
break;
}
}
t[aj+1]=aG;
}
};
var aJ=function(t,p,aF){
var aK=new g();
var aL=200+((aF-p)&15);
var aj=0;
p+=1;
aF-=1;
for(var y=p;y<aF;y+=aL){
aK[aj]=[y,t[y]];
aj++;
}
aK.sort(function(t,u){
return aC(t[1],u[1]);
});
var aM=aK[aK.length>>1][0];
return aM;
}
var aN=function QuickSort(t,p,aF){
var aM=0;
while(true){
if(aF-p<=10){
aE(t,p,aF);
return;
}
if(aF-p>1000){
aM=aJ(t,p,aF);
}else{
aM=p+((aF-p)>>1);
}
var aO=t[p];
var aP=t[aF-1];
var aQ=t[aM];
var aR=aC(aO,aP);
if(aR>0){
var aH=aO;
aO=aP;
aP=aH;
}
var aS=aC(aO,aQ);
if(aS>=0){
var aH=aO;
aO=aQ;
aQ=aP;
aP=aH;
}else{
var aT=aC(aP,aQ);
if(aT>0){
var aH=aP;
aP=aQ;
aQ=aH;
}
}
t[p]=aO;
t[aF-1]=aQ;
var aU=aP;
var aV=p+1;
var aW=aF-1;
t[aM]=t[aV];
t[aV]=aU;
partition:for(var y=aV+1;y<aW;y++){
var aG=t[y];
var aI=aC(aG,aU);
if(aI<0){
t[y]=t[aV];
t[aV]=aG;
aV++;
}else if(aI>0){
do{
aW--;
if(aW==y)break partition;
var aX=t[aW];
aI=aC(aX,aU);
}while(aI>0);
t[y]=t[aW];
t[aW]=aG;
if(aI<0){
aG=t[y];
t[y]=t[aV];
t[aV]=aG;
aV++;
}
}
}
if(aF-aW<aV-p){
aN(t,aW,aF);
aF=aV;
}else{
aN(t,p,aV);
p=aW;
}
}
};
var aY=function CopyFromPrototype(aZ,r){
var ba=0;
for(var bb=%object_get_prototype_of(aZ);bb;
bb=%object_get_prototype_of(bb)){
var v=(%_IsJSProxy(bb))?r:%GetArrayKeys(bb,r);
if((typeof(v)==='number')){
var bc=v;
for(var y=0;y<bc;y++){
if(!(%_Call(k,aZ,y))&&(%_Call(k,bb,y))){
aZ[y]=bb[y];
if(y>=ba){ba=y+1;}
}
}
}else{
for(var y=0;y<v.length;y++){
var Z=v[y];
if(!(%_Call(k,aZ,Z))&&(%_Call(k,bb,Z))){
aZ[Z]=bb[Z];
if(Z>=ba){ba=Z+1;}
}
}
}
}
return ba;
};
var bd=function(aZ,p,aF){
for(var bb=%object_get_prototype_of(aZ);bb;
bb=%object_get_prototype_of(bb)){
var v=(%_IsJSProxy(bb))?aF:%GetArrayKeys(bb,aF);
if((typeof(v)==='number')){
var bc=v;
for(var y=p;y<bc;y++){
if((%_Call(k,bb,y))){
aZ[y]=(void 0);
}
}
}else{
for(var y=0;y<v.length;y++){
var Z=v[y];
if(p<=Z&&(%_Call(k,bb,Z))){
aZ[Z]=(void 0);
}
}
}
}
};
var be=function SafeRemoveArrayHoles(aZ){
var bf=0;
var bg=r-1;
var bh=0;
while(bf<bg){
while(bf<bg&&
!(aZ[bf]===(void 0))){
bf++;
}
if(!(%_Call(k,aZ,bf))){
bh++;
}
while(bf<bg&&
(aZ[bg]===(void 0))){
if(!(%_Call(k,aZ,bg))){
bh++;
}
bg--;
}
if(bf<bg){
aZ[bf]=aZ[bg];
aZ[bg]=(void 0);
}
}
if(!(aZ[bf]===(void 0)))bf++;
var y;
for(y=bf;y<r-bh;y++){
aZ[y]=(void 0);
}
for(y=r-bh;y<r;y++){
if(y in %object_get_prototype_of(aZ)){
aZ[y]=(void 0);
}else{
delete aZ[y];
}
}
return bf;
};
if(r<2)return q;
var F=(%_IsArray(q));
var bi;
if(!F){
bi=aY(q,r);
}
var bj=%RemoveArrayHoles(q,r);
if(bj==-1){
bj=be(q);
}
aN(q,0,bj);
if(!F&&(bj+1<bi)){
bd(q,bj,bi);
}
return q;
}
function ArraySort(aC){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.sort");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArraySort(q,r,aC);
}
function InnerArrayFilter(bk,bl,q,r,aw){
var bm=0;
for(var y=0;y<r;y++){
if(y in q){
var aG=q[y];
if(%_Call(bk,bl,aG,y,q)){
%CreateDataProperty(aw,bm,aG);
bm++;
}
}
}
return aw;
}
function ArrayFilter(bk,bl){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.filter");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
if(!(typeof(bk)==='function'))throw %make_type_error(15,bk);
var aw=ArraySpeciesCreate(q,0);
return InnerArrayFilter(bk,bl,q,r,aw);
}
function InnerArrayForEach(bk,bl,q,r){
if(!(typeof(bk)==='function'))throw %make_type_error(15,bk);
if((bl===(void 0))){
for(var y=0;y<r;y++){
if(y in q){
var aG=q[y];
bk(aG,y,q);
}
}
}else{
for(var y=0;y<r;y++){
if(y in q){
var aG=q[y];
%_Call(bk,bl,aG,y,q);
}
}
}
}
function ArrayForEach(bk,bl){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.forEach");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
InnerArrayForEach(bk,bl,q,r);
}
function InnerArraySome(bk,bl,q,r){
if(!(typeof(bk)==='function'))throw %make_type_error(15,bk);
for(var y=0;y<r;y++){
if(y in q){
var aG=q[y];
if(%_Call(bk,bl,aG,y,q))return true;
}
}
return false;
}
function ArraySome(bk,bl){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.some");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArraySome(bk,bl,q,r);
}
function InnerArrayEvery(bk,bl,q,r){
if(!(typeof(bk)==='function'))throw %make_type_error(15,bk);
for(var y=0;y<r;y++){
if(y in q){
var aG=q[y];
if(!%_Call(bk,bl,aG,y,q))return false;
}
}
return true;
}
function ArrayEvery(bk,bl){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.every");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArrayEvery(bk,bl,q,r);
}
function ArrayMap(bk,bl){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.map");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
if(!(typeof(bk)==='function'))throw %make_type_error(15,bk);
var aw=ArraySpeciesCreate(q,r);
for(var y=0;y<r;y++){
if(y in q){
var aG=q[y];
%CreateDataProperty(aw,y,%_Call(bk,bl,aG,y,q));
}
}
return aw;
}
function InnerArrayLastIndexOf(q,aG,Z,r,bn){
if(r==0)return-1;
if(bn<2){
Z=r-1;
}else{
Z=(((%_ToInteger(Z)))+0);
if(Z<0)Z+=r;
if(Z<0)return-1;
else if(Z>=r)Z=r-1;
}
var bo=0;
var ba=Z;
if(UseSparseVariant(q,r,(%_IsArray(q)),Z)){
%NormalizeElements(q);
var v=%GetArrayKeys(q,Z+1);
if((typeof(v)==='number')){
ba=v;
}else{
if(v.length==0)return-1;
var bp=GetSortedArrayKeys(q,v);
var y=bp.length-1;
while(y>=0){
var E=bp[y];
if(q[E]===aG)return E;
y--;
}
return-1;
}
}
if(!(aG===(void 0))){
for(var y=ba;y>=bo;y--){
if(q[y]===aG)return y;
}
return-1;
}
for(var y=ba;y>=bo;y--){
if((q[y]===(void 0))&&y in q){
return y;
}
}
return-1;
}
function ArrayLastIndexOf(aG,Z){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.lastIndexOf");
var r=(%_ToLength(this.length));
return InnerArrayLastIndexOf(this,aG,Z,r,
arguments.length);
}
function InnerArrayReduce(bq,T,q,r,bn){
if(!(typeof(bq)==='function')){
throw %make_type_error(15,bq);
}
var y=0;
find_initial:if(bn<2){
for(;y<r;y++){
if(y in q){
T=q[y++];
break find_initial;
}
}
throw %make_type_error(122);
}
for(;y<r;y++){
if(y in q){
var aG=q[y];
T=bq(T,aG,y,q);
}
}
return T;
}
function ArrayReduce(bq,T){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.reduce");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArrayReduce(bq,T,q,r,
arguments.length);
}
function InnerArrayReduceRight(bq,T,q,r,
bn){
if(!(typeof(bq)==='function')){
throw %make_type_error(15,bq);
}
var y=r-1;
find_initial:if(bn<2){
for(;y>=0;y--){
if(y in q){
T=q[y--];
break find_initial;
}
}
throw %make_type_error(122);
}
for(;y>=0;y--){
if(y in q){
var aG=q[y];
T=bq(T,aG,y,q);
}
}
return T;
}
function ArrayReduceRight(bq,T){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.reduceRight");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArrayReduceRight(bq,T,q,r,
arguments.length);
}
function InnerArrayCopyWithin(br,at,au,q,r){
br=(%_ToInteger(br));
var aF;
if(br<0){
aF=i(r+br,0);
}else{
aF=j(br,r);
}
at=(%_ToInteger(at));
var p;
if(at<0){
p=i(r+at,0);
}else{
p=j(at,r);
}
au=(au===(void 0))?r:(%_ToInteger(au));
var bs;
if(au<0){
bs=i(r+au,0);
}else{
bs=j(au,r);
}
var bt=j(bs-p,r-aF);
var bu=1;
if(p<aF&&aF<(p+bt)){
bu=-1;
p=p+bt-1;
aF=aF+bt-1;
}
while(bt>0){
if(p in q){
q[aF]=q[p];
}else{
delete q[aF];
}
p=p+bu;
aF=aF+bu;
bt--;
}
return q;
}
function ArrayCopyWithin(br,at,au){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.copyWithin");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArrayCopyWithin(br,at,au,q,r);
}
function InnerArrayFind(bv,bw,q,r){
if(!(typeof(bv)==='function')){
throw %make_type_error(15,bv);
}
for(var y=0;y<r;y++){
var aG=q[y];
if(%_Call(bv,bw,aG,y,q)){
return aG;
}
}
return;
}
function ArrayFind(bv,bw){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.find");
var q=(%_ToObject(this));
var r=(%_ToInteger(q.length));
return InnerArrayFind(bv,bw,q,r);
}
function InnerArrayFindIndex(bv,bw,q,r){
if(!(typeof(bv)==='function')){
throw %make_type_error(15,bv);
}
for(var y=0;y<r;y++){
var aG=q[y];
if(%_Call(bv,bw,aG,y,q)){
return y;
}
}
return-1;
}
function ArrayFindIndex(bv,bw){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.findIndex");
var q=(%_ToObject(this));
var r=(%_ToInteger(q.length));
return InnerArrayFindIndex(bv,bw,q,r);
}
function InnerArrayFill(K,at,au,q,r){
var y=(at===(void 0))?0:(%_ToInteger(at));
var au=(au===(void 0))?r:(%_ToInteger(au));
if(y<0){
y+=r;
if(y<0)y=0;
}else{
if(y>r)y=r;
}
if(au<0){
au+=r;
if(au<0)au=0;
}else{
if(au>r)au=r;
}
if((au-y)>0&&%object_is_frozen(q)){
throw %make_type_error(12);
}
for(;y<au;y++)
q[y]=K;
return q;
}
function ArrayFill(K,at,au){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Array.prototype.fill");
var q=(%_ToObject(this));
var r=(%_ToLength(q.length));
return InnerArrayFill(K,at,au,q,r);
}
function ArrayFrom(bx,by,bl){
var bz=(%_ToObject(bx));
var bA=!(by===(void 0));
if(bA){
if(!(typeof(by)==='function')){
throw %make_type_error(15,by);
}
}
var bB=e(bz,m);
var U;
var aw;
var bC;
var bD;
if(!(bB===(void 0))){
aw=%IsConstructor(this)?new this():[];
U=0;
for(bD of
{[m](){return d(bz,bB)}}){
if(bA){
bC=%_Call(by,bl,bD,U);
}else{
bC=bD;
}
%CreateDataProperty(aw,U,bC);
U++;
}
aw.length=U;
return aw;
}else{
var R=(%_ToLength(bz.length));
aw=%IsConstructor(this)?new this(R):new f(R);
for(U=0;U<R;++U){
bD=bz[U];
if(bA){
bC=%_Call(by,bl,bD,U);
}else{
bC=bD;
}
%CreateDataProperty(aw,U,bC);
}
aw.length=U;
return aw;
}
}
function ArrayOf(...args){
var r=args.length;
var s=this;
var q=%IsConstructor(s)?new s(r):[];
for(var y=0;y<r;y++){
%CreateDataProperty(q,y,args[y]);
}
q.length=r;
return q;
}
function ArraySpecies(){
return this;
}
%AddNamedProperty(f.prototype,"constructor",f,
2);
var bE={
__proto__:null,
copyWithin:true,
entries:true,
fill:true,
find:true,
findIndex:true,
includes:true,
keys:true,
};
%AddNamedProperty(f.prototype,o,bE,
2|1);
%FunctionSetLength(ArrayFrom,1);
b.InstallFunctions(f,2,[
"from",ArrayFrom,
"of",ArrayOf
]);
var bF=%SpecialArrayFunctions();
var bG=function(bH,bI,R){
var bk=bI;
if(bF.hasOwnProperty(bH)){
bk=bF[bH];
}
if(!(R===(void 0))){
%FunctionSetLength(bk,R);
}
return bk;
};
var bJ=bG("values",null,0);
b.InstallFunctions(f.prototype,2,[
"toString",bG("toString",ArrayToString),
"toLocaleString",bG("toLocaleString",ArrayToLocaleString),
"join",bG("join",ArrayJoin),
"pop",bG("pop",ArrayPop),
"push",bG("push",ArrayPush,1),
"reverse",bG("reverse",ArrayReverse),
"shift",bG("shift",ArrayShift),
"unshift",bG("unshift",ArrayUnshift,1),
"slice",bG("slice",ArraySlice,2),
"splice",bG("splice",ArraySplice,2),
"sort",bG("sort",ArraySort),
"filter",bG("filter",ArrayFilter,1),
"forEach",bG("forEach",ArrayForEach,1),
"some",bG("some",ArraySome,1),
"every",bG("every",ArrayEvery,1),
"map",bG("map",ArrayMap,1),
"indexOf",bG("indexOf",null,1),
"lastIndexOf",bG("lastIndexOf",ArrayLastIndexOf,1),
"reduce",bG("reduce",ArrayReduce,1),
"reduceRight",bG("reduceRight",ArrayReduceRight,1),
"copyWithin",bG("copyWithin",ArrayCopyWithin,2),
"find",bG("find",ArrayFind,1),
"findIndex",bG("findIndex",ArrayFindIndex,1),
"fill",bG("fill",ArrayFill,1),
"includes",bG("includes",null,1),
"keys",bG("keys",null,0),
"entries",bG("entries",null,0),
m,bJ
]);
%FunctionSetName(bJ,"values");
b.InstallGetter(f,n,ArraySpecies);
%FinishArrayPrototypeSetup(f.prototype);
b.SetUpLockedPrototype(g,f(),[
"indexOf",bG("indexOf",null),
"join",bG("join",ArrayJoin),
"pop",bG("pop",ArrayPop),
"push",bG("push",ArrayPush),
"shift",bG("shift",ArrayShift),
"sort",bG("sort",ArraySort),
"splice",bG("splice",ArraySplice)
]);
b.SetUpLockedPrototype(h,f(),[
"join",bG("join",ArrayJoin),
"pop",bG("pop",ArrayPop),
"push",bG("push",ArrayPush),
"shift",bG("shift",ArrayShift)
]);
b.SetUpLockedPrototype(c.InternalPackedArray,f(),[
"push",bG("push",ArrayPush),
"pop",bG("pop",ArrayPop),
"shift",bG("shift",ArrayShift),
"unshift",bG("unshift",ArrayUnshift),
"splice",bG("splice",ArraySplice),
"slice",bG("slice",ArraySlice)
]);
b.Export(function(aF){
aF.ArrayFrom=ArrayFrom;
aF.ArrayJoin=ArrayJoin;
aF.ArrayPush=ArrayPush;
aF.ArrayToString=ArrayToString;
aF.ArrayValues=bJ;
aF.InnerArrayCopyWithin=InnerArrayCopyWithin;
aF.InnerArrayEvery=InnerArrayEvery;
aF.InnerArrayFill=InnerArrayFill;
aF.InnerArrayFilter=InnerArrayFilter;
aF.InnerArrayFind=InnerArrayFind;
aF.InnerArrayFindIndex=InnerArrayFindIndex;
aF.InnerArrayForEach=InnerArrayForEach;
aF.InnerArrayJoin=InnerArrayJoin;
aF.InnerArrayLastIndexOf=InnerArrayLastIndexOf;
aF.InnerArrayReduce=InnerArrayReduce;
aF.InnerArrayReduceRight=InnerArrayReduceRight;
aF.InnerArraySome=InnerArraySome;
aF.InnerArraySort=InnerArraySort;
aF.InnerArrayToLocaleString=InnerArrayToLocaleString;
aF.PackedArrayReverse=PackedArrayReverse;
});
%InstallToContext([
"array_pop",ArrayPop,
"array_push",ArrayPush,
"array_shift",ArrayShift,
"array_splice",ArraySplice,
"array_slice",ArraySlice,
"array_unshift",ArrayUnshift,
"array_values_iterator",bJ,
]);
});

stringÜ
(function(a,b){
%CheckIsBootstrapping();
var c;
var d=a.RegExp;
var e=a.String;
var f;
var g;
var h=b.ImportNow("match_symbol");
var i=b.ImportNow("replace_symbol");
var j=b.ImportNow("search_symbol");
var k=b.ImportNow("split_symbol");
b.Import(function(l){
c=l.ArrayJoin;
f=l.MaxSimple;
g=l.MinSimple;
});
function StringConcat(m){
"use strict";
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.concat");
var n=(%_ToString(this));
var o=arguments.length;
for(var p=0;p<o;++p){
n=n+(%_ToString(arguments[p]));
}
return n;
}
function StringMatchJS(q){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.match");
if(!(q==null)){
var r=q[h];
if(!(r===(void 0))){
return %_Call(r,q,this);
}
}
var s=(%_ToString(this));
var t=%RegExpCreate(q);
return t[h](s);
}
function GetSubstitution(u,v,w,x,y){
var z=u.length;
var A=v.length;
var B=x.length;
var C=w+z;
var D="";
var E,F,G,H,I,J,K;
var H=%StringIndexOf(y,'$',0);
if(H<0){
D+=y;
return D;
}
if(H>0)D+=%_SubString(y,0,H);
while(true){
F='$';
E=H+1;
if(E<y.length){
G=%_StringCharCodeAt(y,E);
if(G==36){
++E;
D+='$';
}else if(G==38){
++E;
D+=u;
}else if(G==96){
++E;
D+=%_SubString(v,0,w);
}else if(G==39){
++E;
D+=%_SubString(v,C,A);
}else if(G>=48&&G<=57){
I=(G-48);
J=1;
if(E+1<y.length){
H=%_StringCharCodeAt(y,E+1);
if(H>=48&&H<=57){
K=I*10+((H-48));
if(K<B){
I=K;
J=2;
}
}
}
if(I!=0&&I<B){
var L=x.at(I);
if(!(L===(void 0)))D+=L;
E+=J;
}else{
D+='$';
}
}else{
D+='$';
}
}else{
D+='$';
}
H=%StringIndexOf(y,'$',E);
if(H<0){
if(E<y.length){
D+=%_SubString(y,E,y.length);
}
return D;
}
if(H>E){
D+=%_SubString(y,E,H);
}
}
return D;
}
function StringReplace(M,N){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.replace");
if(!(M==null)){
var O=M[i];
if(!(O===(void 0))){
return %_Call(O,M,this,N);
}
}
var s=(%_ToString(this));
M=(%_ToString(M));
if(M.length==1&&
s.length>0xFF&&
(typeof(N)==='string')&&
%StringIndexOf(N,'$',0)<0){
return %StringReplaceOneCharWithString(s,M,N);
}
var P=%StringIndexOf(s,M,0);
if(P<0)return s;
var Q=P+M.length;
var D=%_SubString(s,0,P);
if((typeof(N)==='function')){
D+=N(M,P,s);
}else{
const x={length:1};
const u=%_SubString(s,P,Q);
D+=GetSubstitution(u,s,P,x,
(%_ToString(N)));
}
return D+%_SubString(s,Q,s.length);
}
function StringSearch(q){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.search");
if(!(q==null)){
var R=q[j];
if(!(R===(void 0))){
return %_Call(R,q,this);
}
}
var s=(%_ToString(this));
var t=%RegExpCreate(q);
return %_Call(t[j],t,s);
}
function StringSlice(P,Q){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.slice");
var n=(%_ToString(this));
var S=n.length;
var T=(%_ToInteger(P));
var U=S;
if(!(Q===(void 0))){
U=(%_ToInteger(Q));
}
if(T<0){
T+=S;
if(T<0){
T=0;
}
}else{
if(T>S){
return'';
}
}
if(U<0){
U+=S;
if(U<0){
return'';
}
}else{
if(U>S){
U=S;
}
}
if(U<=T){
return'';
}
return %_SubString(n,T,U);
}
function StringSplitJS(V,W){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.split");
if(!(V==null)){
var X=V[k];
if(!(X===(void 0))){
return %_Call(X,V,this,W);
}
}
var s=(%_ToString(this));
W=((W===(void 0)))?4294967295:((W)>>>0);
var Y=s.length;
var Z=(%_ToString(V));
if(W===0)return[];
if((V===(void 0)))return[s];
var aa=Z.length;
if(aa===0)return %StringToArray(s,W);
return %StringSplit(s,Z,W);
}
function StringToLowerCaseJS(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toLowerCase");
return %StringToLowerCase((%_ToString(this)));
}
function StringToLocaleLowerCase(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toLocaleLowerCase");
return %StringToLowerCase((%_ToString(this)));
}
function StringToUpperCaseJS(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toUpperCase");
return %StringToUpperCase((%_ToString(this)));
}
function StringToLocaleUpperCase(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toLocaleUpperCase");
return %StringToUpperCase((%_ToString(this)));
}
function HtmlEscape(ab){
return %_Call(StringReplace,(%_ToString(ab)),/"/g,"&quot;");
}
function StringAnchor(ac){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.anchor");
return"<a name=\""+HtmlEscape(ac)+"\">"+(%_ToString(this))+
"</a>";
}
function StringBig(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.big");
return"<big>"+(%_ToString(this))+"</big>";
}
function StringBlink(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.blink");
return"<blink>"+(%_ToString(this))+"</blink>";
}
function StringBold(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.bold");
return"<b>"+(%_ToString(this))+"</b>";
}
function StringFixed(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.fixed");
return"<tt>"+(%_ToString(this))+"</tt>";
}
function StringFontcolor(ad){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.fontcolor");
return"<font color=\""+HtmlEscape(ad)+"\">"+(%_ToString(this))+
"</font>";
}
function StringFontsize(ae){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.fontsize");
return"<font size=\""+HtmlEscape(ae)+"\">"+(%_ToString(this))+
"</font>";
}
function StringItalics(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.italics");
return"<i>"+(%_ToString(this))+"</i>";
}
function StringLink(n){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.link");
return"<a href=\""+HtmlEscape(n)+"\">"+(%_ToString(this))+"</a>";
}
function StringSmall(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.small");
return"<small>"+(%_ToString(this))+"</small>";
}
function StringStrike(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.strike");
return"<strike>"+(%_ToString(this))+"</strike>";
}
function StringSub(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.sub");
return"<sub>"+(%_ToString(this))+"</sub>";
}
function StringSup(){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.sup");
return"<sup>"+(%_ToString(this))+"</sup>";
}
function StringRepeat(af){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.repeat");
var n=(%_ToString(this));
var ag=(%_ToInteger(af));
if(ag<0||ag===(1/0))throw %make_range_error(158);
if(n.length===0)return"";
if(ag>%_MaxSmi())throw %make_range_error(158);
var ah="";
while(true){
if(ag&1)ah+=n;
ag>>=1;
if(ag===0)return ah;
n+=n;
}
}
function StringCodePointAt(E){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.codePointAt");
var v=(%_ToString(this));
var ae=v.length;
E=(%_ToInteger(E));
if(E<0||E>=ae){
return(void 0);
}
var ai=%_StringCharCodeAt(v,E);
if(ai<0xD800||ai>0xDBFF||E+1==ae){
return ai;
}
var aj=%_StringCharCodeAt(v,E+1);
if(aj<0xDC00||aj>0xDFFF){
return ai;
}
return(ai-0xD800)*0x400+aj+0x2400;
}
function StringRaw(ak){
"use strict";
var al=arguments.length;
var am=(%_ToObject(ak));
var an=(%_ToObject(am.raw));
var ao=(%_ToLength(an.length));
if(ao<=0)return"";
var D=(%_ToString(an[0]));
for(var p=1;p<ao;++p){
if(p<al){
D+=(%_ToString(arguments[p]));
}
D+=(%_ToString(an[p]));
}
return D;
}
b.InstallFunctions(e,2,[
"raw",StringRaw
]);
b.InstallFunctions(e.prototype,2,[
"codePointAt",StringCodePointAt,
"concat",StringConcat,
"match",StringMatchJS,
"repeat",StringRepeat,
"replace",StringReplace,
"search",StringSearch,
"slice",StringSlice,
"split",StringSplitJS,
"toLowerCase",StringToLowerCaseJS,
"toLocaleLowerCase",StringToLocaleLowerCase,
"toUpperCase",StringToUpperCaseJS,
"toLocaleUpperCase",StringToLocaleUpperCase,
"link",StringLink,
"anchor",StringAnchor,
"fontcolor",StringFontcolor,
"fontsize",StringFontsize,
"big",StringBig,
"blink",StringBlink,
"bold",StringBold,
"fixed",StringFixed,
"italics",StringItalics,
"small",StringSmall,
"strike",StringStrike,
"sub",StringSub,
"sup",StringSup
]);
b.Export(function(ap){
ap.StringMatch=StringMatchJS;
ap.StringReplace=StringReplace;
ap.StringSlice=StringSlice;
ap.StringSplit=StringSplitJS;
});
})

,arraybufferâ
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.ArrayBuffer;
var d;
var e;
var f;
var g=b.ImportNow("species_symbol");
b.Import(function(h){
d=h.MaxSimple;
e=h.MinSimple;
f=h.SpeciesConstructor;
});
function ArrayBufferSlice(i,j){
if(!(%_ClassOf(this)==='ArrayBuffer')){
throw %make_type_error(45,
'ArrayBuffer.prototype.slice',this);
}
var k=(%_ToInteger(i));
if(!(j===(void 0))){
j=(%_ToInteger(j));
}
var l;
var m=%_ArrayBufferGetByteLength(this);
if(k<0){
l=d(m+k,0);
}else{
l=e(k,m);
}
var n=(j===(void 0))?m:j;
var o;
if(n<0){
o=d(m+n,0);
}else{
o=e(n,m);
}
if(o<l){
o=l;
}
var p=o-l;
var q=f(this,c,true);
var r=new q(p);
if(!(%_ClassOf(r)==='ArrayBuffer')){
throw %make_type_error(45,
'ArrayBuffer.prototype.slice',r);
}
if(r===this){
throw %make_type_error(11);
}
if(%_ArrayBufferGetByteLength(r)<p){
throw %make_type_error(10);
}
%ArrayBufferSliceImpl(this,r,l,p);
return r;
}
function ArrayBufferSpecies(){
return this;
}
b.InstallGetter(c,g,ArrayBufferSpecies);
b.InstallFunctions(c.prototype,2,[
"slice",ArrayBufferSlice
]);
})

(typedarrayñq
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=b.ImportNow("ArrayToString");
var d;
var e;
var f;
var g=a.Array;
var h=a.ArrayBuffer;
var i=h.prototype;
var j=a.Object;
var k;
var l;
var m;
var n;
var o;
var p;
var q;
var r;
var s;
var t;
var u;
var v;
var w;
var x=b.InternalArray;
var y;
var z;
var A;
var B;
var C;
var D;
var E=b.ImportNow("iterator_symbol");
var F=b.ImportNow("species_symbol");
var G=b.ImportNow("to_string_tag_symbol");
var H=a.Uint8Array;

var I=a.Int8Array;

var J=a.Uint16Array;

var K=a.Int16Array;

var L=a.Uint32Array;

var M=a.Int32Array;

var N=a.Float32Array;

var O=a.Float64Array;

var P=a.Uint8ClampedArray;


var Q=%object_get_prototype_of(H);
b.Import(function(R){
d=R.ArrayValues;
e=R.GetIterator;
f=R.GetMethod;
k=R.InnerArrayCopyWithin;
l=R.InnerArrayEvery;
m=R.InnerArrayFill;
n=R.InnerArrayFilter;
o=R.InnerArrayFind;
p=R.InnerArrayFindIndex;
q=R.InnerArrayForEach;
r=R.InnerArrayJoin;
s=R.InnerArrayReduce;
t=R.InnerArrayReduceRight;
u=R.InnerArraySome;
v=R.InnerArraySort;
w=R.InnerArrayToLocaleString;
y=R.MaxSimple;
z=R.MinSimple;
A=R.PackedArrayReverse;
B=R.SpeciesConstructor;
C=R.ToPositiveInteger;
D=R.ToIndex;
});
function TypedArrayDefaultConstructor(S){
switch(%_ClassOf(S)){
case"Uint8Array":
return H;

case"Int8Array":
return I;

case"Uint16Array":
return J;

case"Int16Array":
return K;

case"Uint32Array":
return L;

case"Int32Array":
return M;

case"Float32Array":
return N;

case"Float64Array":
return O;

case"Uint8ClampedArray":
return P;


}
throw %make_type_error(45,
"TypedArrayDefaultConstructor",this);
}
function TypedArrayCreate(T,U,V,W){
if((V===(void 0))){
var X=new T(U);
}else{
var X=new T(U,V,W);
}
if(!(%_IsTypedArray(X)))throw %make_type_error(73);
if((typeof(U)==='number')&&%_TypedArrayGetLength(X)<U){
throw %make_type_error(250);
}
return X;
}
function TypedArraySpeciesCreate(Y,U,V,W,Z){
var aa=TypedArrayDefaultConstructor(Y);
var T=B(Y,aa,
Z);
return TypedArrayCreate(T,U,V,W);
}
function Uint8ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 1!==0){
throw %make_range_error(169,
"start offset","Uint8Array",1);
}
}
var ah;
if((ae===(void 0))){
if(af % 1!==0){
throw %make_range_error(169,
"byte length","Uint8Array",1);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Uint8Array",1);
}
}else{
ah=ae*1;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,1,ac,ag,ah,true);
}
function Uint8ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*1;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,1,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,1,null,0,aj,true);
}
}
function Uint8ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*1;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,1,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,1,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Uint8ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Uint8ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Uint8ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*1;
Uint8ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Uint8ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Uint8ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Uint8ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Uint8ArrayConstructByArrayLike(this,V,V.length);
}else{
Uint8ArrayConstructByIterable(this,V,ao);
}
}else{
Uint8ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Uint8Array")
}
}
function Uint8ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*1;
return new H(%TypedArrayGetBuffer(this),aD,aC);
}

function Int8ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 1!==0){
throw %make_range_error(169,
"start offset","Int8Array",1);
}
}
var ah;
if((ae===(void 0))){
if(af % 1!==0){
throw %make_range_error(169,
"byte length","Int8Array",1);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Int8Array",1);
}
}else{
ah=ae*1;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,2,ac,ag,ah,true);
}
function Int8ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*1;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,2,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,2,null,0,aj,true);
}
}
function Int8ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*1;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,2,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,2,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Int8ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Int8ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Int8ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*1;
Int8ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Int8ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Int8ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Int8ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Int8ArrayConstructByArrayLike(this,V,V.length);
}else{
Int8ArrayConstructByIterable(this,V,ao);
}
}else{
Int8ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Int8Array")
}
}
function Int8ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*1;
return new I(%TypedArrayGetBuffer(this),aD,aC);
}

function Uint16ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 2!==0){
throw %make_range_error(169,
"start offset","Uint16Array",2);
}
}
var ah;
if((ae===(void 0))){
if(af % 2!==0){
throw %make_range_error(169,
"byte length","Uint16Array",2);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Uint16Array",2);
}
}else{
ah=ae*2;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,3,ac,ag,ah,true);
}
function Uint16ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*2;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,3,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,3,null,0,aj,true);
}
}
function Uint16ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*2;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,3,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,3,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Uint16ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Uint16ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Uint16ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*2;
Uint16ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Uint16ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Uint16ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Uint16ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Uint16ArrayConstructByArrayLike(this,V,V.length);
}else{
Uint16ArrayConstructByIterable(this,V,ao);
}
}else{
Uint16ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Uint16Array")
}
}
function Uint16ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*2;
return new J(%TypedArrayGetBuffer(this),aD,aC);
}

function Int16ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 2!==0){
throw %make_range_error(169,
"start offset","Int16Array",2);
}
}
var ah;
if((ae===(void 0))){
if(af % 2!==0){
throw %make_range_error(169,
"byte length","Int16Array",2);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Int16Array",2);
}
}else{
ah=ae*2;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,4,ac,ag,ah,true);
}
function Int16ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*2;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,4,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,4,null,0,aj,true);
}
}
function Int16ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*2;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,4,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,4,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Int16ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Int16ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Int16ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*2;
Int16ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Int16ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Int16ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Int16ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Int16ArrayConstructByArrayLike(this,V,V.length);
}else{
Int16ArrayConstructByIterable(this,V,ao);
}
}else{
Int16ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Int16Array")
}
}
function Int16ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*2;
return new K(%TypedArrayGetBuffer(this),aD,aC);
}

function Uint32ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 4!==0){
throw %make_range_error(169,
"start offset","Uint32Array",4);
}
}
var ah;
if((ae===(void 0))){
if(af % 4!==0){
throw %make_range_error(169,
"byte length","Uint32Array",4);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Uint32Array",4);
}
}else{
ah=ae*4;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,5,ac,ag,ah,true);
}
function Uint32ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*4;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,5,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,5,null,0,aj,true);
}
}
function Uint32ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*4;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,5,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,5,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Uint32ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Uint32ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Uint32ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*4;
Uint32ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Uint32ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Uint32ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Uint32ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Uint32ArrayConstructByArrayLike(this,V,V.length);
}else{
Uint32ArrayConstructByIterable(this,V,ao);
}
}else{
Uint32ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Uint32Array")
}
}
function Uint32ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*4;
return new L(%TypedArrayGetBuffer(this),aD,aC);
}

function Int32ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 4!==0){
throw %make_range_error(169,
"start offset","Int32Array",4);
}
}
var ah;
if((ae===(void 0))){
if(af % 4!==0){
throw %make_range_error(169,
"byte length","Int32Array",4);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Int32Array",4);
}
}else{
ah=ae*4;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,6,ac,ag,ah,true);
}
function Int32ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*4;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,6,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,6,null,0,aj,true);
}
}
function Int32ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*4;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,6,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,6,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Int32ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Int32ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Int32ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*4;
Int32ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Int32ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Int32ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Int32ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Int32ArrayConstructByArrayLike(this,V,V.length);
}else{
Int32ArrayConstructByIterable(this,V,ao);
}
}else{
Int32ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Int32Array")
}
}
function Int32ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*4;
return new M(%TypedArrayGetBuffer(this),aD,aC);
}

function Float32ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 4!==0){
throw %make_range_error(169,
"start offset","Float32Array",4);
}
}
var ah;
if((ae===(void 0))){
if(af % 4!==0){
throw %make_range_error(169,
"byte length","Float32Array",4);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Float32Array",4);
}
}else{
ah=ae*4;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,7,ac,ag,ah,true);
}
function Float32ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*4;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,7,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,7,null,0,aj,true);
}
}
function Float32ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*4;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,7,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,7,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Float32ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Float32ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Float32ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*4;
Float32ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Float32ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Float32ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Float32ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Float32ArrayConstructByArrayLike(this,V,V.length);
}else{
Float32ArrayConstructByIterable(this,V,ao);
}
}else{
Float32ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Float32Array")
}
}
function Float32ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*4;
return new N(%TypedArrayGetBuffer(this),aD,aC);
}

function Float64ArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 8!==0){
throw %make_range_error(169,
"start offset","Float64Array",8);
}
}
var ah;
if((ae===(void 0))){
if(af % 8!==0){
throw %make_range_error(169,
"byte length","Float64Array",8);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Float64Array",8);
}
}else{
ah=ae*8;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,8,ac,ag,ah,true);
}
function Float64ArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*8;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,8,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,8,null,0,aj,true);
}
}
function Float64ArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*8;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,8,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,8,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Float64ArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Float64ArrayConstructByArrayLike(ab,ap,ap.length);
}
function Float64ArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*8;
Float64ArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Float64ArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Float64ArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Float64ArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Float64ArrayConstructByArrayLike(this,V,V.length);
}else{
Float64ArrayConstructByIterable(this,V,ao);
}
}else{
Float64ArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Float64Array")
}
}
function Float64ArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*8;
return new O(%TypedArrayGetBuffer(this),aD,aC);
}

function Uint8ClampedArrayConstructByArrayBuffer(ab,ac,ad,ae){
if(!(ad===(void 0))){
ad=D(ad,170);
}
if(!(ae===(void 0))){
ae=D(ae,170);
}
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var af=%_ArrayBufferGetByteLength(ac);
var ag;
if((ad===(void 0))){
ag=0;
}else{
ag=ad;
if(ag % 1!==0){
throw %make_range_error(169,
"start offset","Uint8ClampedArray",1);
}
}
var ah;
if((ae===(void 0))){
if(af % 1!==0){
throw %make_range_error(169,
"byte length","Uint8ClampedArray",1);
}
ah=af-ag;
if(ah<0){
throw %make_range_error(169,
"byte length","Uint8ClampedArray",1);
}
}else{
ah=ae*1;
if(ag+ah>af){
throw %make_range_error(170);
}
}
%_TypedArrayInitialize(ab,9,ac,ag,ah,true);
}
function Uint8ClampedArrayConstructByLength(ab,ae){
var ai=(ae===(void 0))?
0:D(ae,170);
if(ae>%_MaxSmi()){
throw %make_range_error(170);
}
var aj=ai*1;
if(aj>%_TypedArrayMaxSizeInHeap()){
var ac=new h(aj);
%_TypedArrayInitialize(ab,9,ac,0,aj,true);
}else{
%_TypedArrayInitialize(ab,9,null,0,aj,true);
}
}
function Uint8ClampedArrayConstructByArrayLike(ab,ak,ae){
var ai=C(ae,170);
if(ai>%_MaxSmi()){
throw %make_range_error(170);
}
var al=false;
var aj=ai*1;
if(aj<=%_TypedArrayMaxSizeInHeap()){
%_TypedArrayInitialize(ab,9,null,0,aj,false);
}else{
al=
%TypedArrayInitializeFromArrayLike(ab,9,ak,ai);
}
if(!al){
for(var am=0;am<ai;am++){
ab[am]=ak[am];
}
}
}
function Uint8ClampedArrayConstructByIterable(ab,an,ao){
var ap=new x();
var aq=%_Call(ao,an);
var ar={
__proto__:null
};
ar[E]=function(){return aq;}
for(var as of ar){
ap.push(as);
}
Uint8ClampedArrayConstructByArrayLike(ab,ap,ap.length);
}
function Uint8ClampedArrayConstructByTypedArray(ab,S){
var at=%TypedArrayGetBuffer(S);
var ae=%_TypedArrayGetLength(S);
var aj=%_ArrayBufferViewGetByteLength(S);
var ah=ae*1;
Uint8ClampedArrayConstructByArrayLike(ab,S,ae);
var au=B(at,h);
var av=au.prototype;
if((%_IsJSReceiver(av))&&av!==i){
%InternalSetPrototype(%TypedArrayGetBuffer(ab),av);
}
}
function Uint8ClampedArrayConstructor(V,W,aw){
if(!(new.target===(void 0))){
if((%_ClassOf(V)==='ArrayBuffer')||(%_ClassOf(V)==='SharedArrayBuffer')){
Uint8ClampedArrayConstructByArrayBuffer(this,V,W,aw);
}else if((%_IsTypedArray(V))){
Uint8ClampedArrayConstructByTypedArray(this,V);
}else if((%_IsJSReceiver(V))){
var ao=V[E];
if((ao===(void 0))||ao===d){
Uint8ClampedArrayConstructByArrayLike(this,V,V.length);
}else{
Uint8ClampedArrayConstructByIterable(this,V,ao);
}
}else{
Uint8ClampedArrayConstructByLength(this,V);
}
}else{
throw %make_type_error(27,"Uint8ClampedArray")
}
}
function Uint8ClampedArraySubArray(ax,ay){
var az=(%_ToInteger(ax));
if(!(ay===(void 0))){
var aA=(%_ToInteger(ay));
var aB=%_TypedArrayGetLength(this);
}else{
var aB=%_TypedArrayGetLength(this);
var aA=aB;
}
if(az<0){
az=y(0,aB+az);
}else{
az=z(az,aB);
}
if(aA<0){
aA=y(0,aB+aA);
}else{
aA=z(aA,aB);
}
if(aA<az){
aA=az;
}
var aC=aA-az;
var aD=
%_ArrayBufferViewGetByteOffset(this)+az*1;
return new P(%TypedArrayGetBuffer(this),aD,aC);
}


function TypedArraySubArray(ax,ay){
switch(%_ClassOf(this)){
case"Uint8Array":
return %_Call(Uint8ArraySubArray,this,ax,ay);

case"Int8Array":
return %_Call(Int8ArraySubArray,this,ax,ay);

case"Uint16Array":
return %_Call(Uint16ArraySubArray,this,ax,ay);

case"Int16Array":
return %_Call(Int16ArraySubArray,this,ax,ay);

case"Uint32Array":
return %_Call(Uint32ArraySubArray,this,ax,ay);

case"Int32Array":
return %_Call(Int32ArraySubArray,this,ax,ay);

case"Float32Array":
return %_Call(Float32ArraySubArray,this,ax,ay);

case"Float64Array":
return %_Call(Float64ArraySubArray,this,ax,ay);

case"Uint8ClampedArray":
return %_Call(Uint8ClampedArraySubArray,this,ax,ay);


}
throw %make_type_error(45,
"get TypedArray.prototype.subarray",this);
}
%SetForceInlineFlag(TypedArraySubArray);
function TypedArraySetFromArrayLike(aE,aF,aG,ag){
if(ag>0){
for(var am=0;am<aG;am++){
aE[ag+am]=aF[am];
}
}
else{
for(var am=0;am<aG;am++){
aE[am]=aF[am];
}
}
}
function TypedArraySetFromOverlappingTypedArray(aE,aF,ag){
var aH=aF.BYTES_PER_ELEMENT;
var aI=aE.BYTES_PER_ELEMENT;
var aG=%_TypedArrayGetLength(aF);
function CopyLeftPart(){
var aJ=aE.byteOffset+(ag+1)*aI;
var aK=aF.byteOffset;
for(var aL=0;
aL<aG&&aJ<=aK;
aL++){
aE[ag+aL]=aF[aL];
aJ+=aI;
aK+=aH;
}
return aL;
}
var aL=CopyLeftPart();
function CopyRightPart(){
var aJ=
aE.byteOffset+(ag+aG-1)*aI;
var aK=
aF.byteOffset+aG*aH;
for(var aM=aG-1;
aM>=aL&&aJ>=aK;
aM--){
aE[ag+aM]=aF[aM];
aJ-=aI;
aK-=aH;
}
return aM;
}
var aM=CopyRightPart();
var aN=new g(aM+1-aL);
for(var am=aL;am<=aM;am++){
aN[am-aL]=aF[am];
}
for(am=aL;am<=aM;am++){
aE[ag+am]=aN[am-aL];
}
}
function TypedArraySet(ab,ag){
var aO=(ag===(void 0))?0:(%_ToInteger(ag));
if(aO<0)throw %make_type_error(182);
if(aO>%_MaxSmi()){
throw %make_range_error(183);
}
switch(%TypedArraySetFastCases(this,ab,aO)){
case 0:
return;
case 1:
TypedArraySetFromOverlappingTypedArray(this,ab,aO);
return;
case 2:
TypedArraySetFromArrayLike(this,
ab,%_TypedArrayGetLength(ab),aO);
return;
case 3:
var ai=ab.length;
if((ai===(void 0))){
if((typeof(ab)==='number')){
throw %make_type_error(47);
}
return;
}
ai=(%_ToLength(ai));
if(aO+ai>%_TypedArrayGetLength(this)){
throw %make_range_error(183);
}
TypedArraySetFromArrayLike(this,ab,ai,aO);
return;
}
}
%FunctionSetLength(TypedArraySet,1);
function TypedArrayGetToStringTag(){
if(!(%_IsTypedArray(this)))return;
var aP=%_ClassOf(this);
if((aP===(void 0)))return;
return aP;
}
function TypedArrayCopyWithin(aE,aQ,ay){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return k(aE,aQ,ay,this,ae);
}
%FunctionSetLength(TypedArrayCopyWithin,2);
function TypedArrayEvery(aR,aS){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return l(aR,aS,this,ae);
}
%FunctionSetLength(TypedArrayEvery,1);
function TypedArrayForEach(aR,aS){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
q(aR,aS,this,ae);
}
%FunctionSetLength(TypedArrayForEach,1);
function TypedArrayFill(as,aQ,ay){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return m(as,aQ,ay,this,ae);
}
%FunctionSetLength(TypedArrayFill,1);
function TypedArrayFilter(aR,aT){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
if(!(typeof(aR)==='function'))throw %make_type_error(15,aR);
var aU=new x();
n(aR,aT,this,ae,aU);
var aV=aU.length;
var aW=TypedArraySpeciesCreate(this,aV);
for(var am=0;am<aV;am++){
aW[am]=aU[am];
}
return aW;
}
%FunctionSetLength(TypedArrayFilter,1);
function TypedArrayFind(aX,aT){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return o(aX,aT,this,ae);
}
%FunctionSetLength(TypedArrayFind,1);
function TypedArrayFindIndex(aX,aT){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return p(aX,aT,this,ae);
}
%FunctionSetLength(TypedArrayFindIndex,1);
function TypedArrayReverse(){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return A(this,ae);
}
function TypedArrayComparefn(aY,aZ){
if(aY===0&&aY===aZ){
aY=1/aY;
aZ=1/aZ;
}
if(aY<aZ){
return-1;
}else if(aY>aZ){
return 1;
}else if((!%_IsSmi(%IS_VAR(aY))&&!(aY==aY))&&(!%_IsSmi(%IS_VAR(aZ))&&!(aZ==aZ))){
return(!%_IsSmi(%IS_VAR(aZ))&&!(aZ==aZ))?0:1;
}else if((!%_IsSmi(%IS_VAR(aY))&&!(aY==aY))){
return 1;
}
return 0;
}
function TypedArraySort(ba){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
if((ba===(void 0))){
ba=TypedArrayComparefn;
}
return v(this,ae,ba);
}
function TypedArrayIndexOf(bb,bc){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
if(ae===0)return-1;
if(!(typeof(bb)==='number'))return-1;
var bd=(%_ToInteger(bc));
var be;
if(bd===0){
be=0;
}else if(bd>0){
be=bd;
}else{
be=ae+bd;
if(be<0){
be=0;
}
}
while(be<ae){
var bf=this[be];
if(bb===bf){
return be;
}
++be;
}
return-1;
}
%FunctionSetLength(TypedArrayIndexOf,1);
function TypedArrayLastIndexOf(bb,bc){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
if(ae===0)return-1;
if(!(typeof(bb)==='number'))return-1;
var bd;
if(arguments.length<2){
bd=ae-1;
}else{
bd=(%_ToInteger(bc));
}
var be;
if(bd>=0){
if(ae<=bd){
be=ae-1;
}else if(bd===0){
be=0;
}else{
be=bd;
}
}else{
be=ae+bd;
}
while(be>=0){
var bf=this[be];
if(bb===bf){
return be;
}
--be;
}
return-1;
}
%FunctionSetLength(TypedArrayLastIndexOf,1);
function TypedArrayMap(aR,aT){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
var aU=TypedArraySpeciesCreate(this,ae);
if(!(typeof(aR)==='function'))throw %make_type_error(15,aR);
for(var am=0;am<ae;am++){
var bb=this[am];
aU[am]=%_Call(aR,aT,bb,am,this);
}
return aU;
}
%FunctionSetLength(TypedArrayMap,1);
function TypedArraySome(aR,aS){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return u(aR,aS,this,ae);
}
%FunctionSetLength(TypedArraySome,1);
function TypedArrayToLocaleString(){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return w(this,ae);
}
function TypedArrayJoin(bg){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return r(bg,this,ae);
}
function TypedArrayReduce(bh,bi){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return s(bh,bi,this,ae,
arguments.length);
}
%FunctionSetLength(TypedArrayReduce,1);
function TypedArrayReduceRight(bh,bi){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
return t(bh,bi,this,ae,
arguments.length);
}
%FunctionSetLength(TypedArrayReduceRight,1);
function TypedArraySlice(aQ,ay){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var bj=%_TypedArrayGetLength(this);
var bk=(%_ToInteger(aQ));
var be;
if(bk<0){
be=y(bj+bk,0);
}else{
be=z(bk,bj);
}
var bl;
if((ay===(void 0))){
bl=bj;
}else{
bl=(%_ToInteger(ay));
}
var bm;
if(bl<0){
bm=y(bj+bl,0);
}else{
bm=z(bl,bj);
}
var bn=y(bm-be,0);
var bo=TypedArraySpeciesCreate(this,bn);
var bd=0;
while(be<bm){
var bp=this[be];
bo[bd]=bp;
be++;
bd++;
}
return bo;
}
function TypedArrayIncludes(bq,br){
if(!(%_IsTypedArray(this)))throw %make_type_error(73);
var ae=%_TypedArrayGetLength(this);
if(ae===0)return false;
var bd=(%_ToInteger(br));
var be;
if(bd>=0){
be=bd;
}else{
be=ae+bd;
if(be<0){
be=0;
}
}
while(be<ae){
var bf=this[be];
if(%SameValueZero(bq,bf)){
return true;
}
++be;
}
return false;
}
%FunctionSetLength(TypedArrayIncludes,1);
function TypedArrayOf(){
var ae=arguments.length;
var bo=TypedArrayCreate(this,ae);
for(var am=0;am<ae;am++){
bo[am]=arguments[am];
}
return bo;
}
function IterableToArrayLike(bs){
var an=f(bs,E);
if(!(an===(void 0))){
var bt=new x();
var am=0;
for(var as of
{[E](){return e(bs,an)}}){
bt[am]=as;
am++;
}
var bo=[];
%MoveArrayContents(bt,bo);
return bo;
}
return(%_ToObject(bs));
}
function TypedArrayFrom(aF,bu,aT){
if(!%IsConstructor(this))throw %make_type_error(67,this);
var bv;
if(!(bu===(void 0))){
if(!(typeof(bu)==='function'))throw %make_type_error(15,this);
bv=true;
}else{
bv=false;
}
var ak=IterableToArrayLike(aF);
var ae=(%_ToLength(ak.length));
var bw=TypedArrayCreate(this,ae);
var as,bx;
for(var am=0;am<ae;am++){
as=ak[am];
if(bv){
bx=%_Call(bu,aT,as,am);
}else{
bx=as;
}
bw[am]=bx;
}
return bw;
}
%FunctionSetLength(TypedArrayFrom,1);
function TypedArrayConstructor(){
throw %make_type_error(24,"TypedArray");
}
function TypedArraySpecies(){
return this;
}
%SetCode(Q,TypedArrayConstructor);
b.InstallFunctions(Q,2,[
"from",TypedArrayFrom,
"of",TypedArrayOf
]);
b.InstallGetter(Q,F,TypedArraySpecies);
b.InstallGetter(Q.prototype,G,
TypedArrayGetToStringTag);
b.InstallFunctions(Q.prototype,2,[
"subarray",TypedArraySubArray,
"set",TypedArraySet,
"copyWithin",TypedArrayCopyWithin,
"every",TypedArrayEvery,
"fill",TypedArrayFill,
"filter",TypedArrayFilter,
"find",TypedArrayFind,
"findIndex",TypedArrayFindIndex,
"includes",TypedArrayIncludes,
"indexOf",TypedArrayIndexOf,
"join",TypedArrayJoin,
"lastIndexOf",TypedArrayLastIndexOf,
"forEach",TypedArrayForEach,
"map",TypedArrayMap,
"reduce",TypedArrayReduce,
"reduceRight",TypedArrayReduceRight,
"reverse",TypedArrayReverse,
"slice",TypedArraySlice,
"some",TypedArraySome,
"sort",TypedArraySort,
"toLocaleString",TypedArrayToLocaleString
]);
%AddNamedProperty(Q.prototype,"toString",c,
2);
%SetCode(H,Uint8ArrayConstructor);
%FunctionSetPrototype(H,new j());
%InternalSetPrototype(H,Q);
%InternalSetPrototype(H.prototype,Q.prototype);
%AddNamedProperty(H,"BYTES_PER_ELEMENT",1,
1|2|4);
%AddNamedProperty(H.prototype,
"constructor",a.Uint8Array,2);
%AddNamedProperty(H.prototype,
"BYTES_PER_ELEMENT",1,
1|2|4);

%SetCode(I,Int8ArrayConstructor);
%FunctionSetPrototype(I,new j());
%InternalSetPrototype(I,Q);
%InternalSetPrototype(I.prototype,Q.prototype);
%AddNamedProperty(I,"BYTES_PER_ELEMENT",1,
1|2|4);
%AddNamedProperty(I.prototype,
"constructor",a.Int8Array,2);
%AddNamedProperty(I.prototype,
"BYTES_PER_ELEMENT",1,
1|2|4);

%SetCode(J,Uint16ArrayConstructor);
%FunctionSetPrototype(J,new j());
%InternalSetPrototype(J,Q);
%InternalSetPrototype(J.prototype,Q.prototype);
%AddNamedProperty(J,"BYTES_PER_ELEMENT",2,
1|2|4);
%AddNamedProperty(J.prototype,
"constructor",a.Uint16Array,2);
%AddNamedProperty(J.prototype,
"BYTES_PER_ELEMENT",2,
1|2|4);

%SetCode(K,Int16ArrayConstructor);
%FunctionSetPrototype(K,new j());
%InternalSetPrototype(K,Q);
%InternalSetPrototype(K.prototype,Q.prototype);
%AddNamedProperty(K,"BYTES_PER_ELEMENT",2,
1|2|4);
%AddNamedProperty(K.prototype,
"constructor",a.Int16Array,2);
%AddNamedProperty(K.prototype,
"BYTES_PER_ELEMENT",2,
1|2|4);

%SetCode(L,Uint32ArrayConstructor);
%FunctionSetPrototype(L,new j());
%InternalSetPrototype(L,Q);
%InternalSetPrototype(L.prototype,Q.prototype);
%AddNamedProperty(L,"BYTES_PER_ELEMENT",4,
1|2|4);
%AddNamedProperty(L.prototype,
"constructor",a.Uint32Array,2);
%AddNamedProperty(L.prototype,
"BYTES_PER_ELEMENT",4,
1|2|4);

%SetCode(M,Int32ArrayConstructor);
%FunctionSetPrototype(M,new j());
%InternalSetPrototype(M,Q);
%InternalSetPrototype(M.prototype,Q.prototype);
%AddNamedProperty(M,"BYTES_PER_ELEMENT",4,
1|2|4);
%AddNamedProperty(M.prototype,
"constructor",a.Int32Array,2);
%AddNamedProperty(M.prototype,
"BYTES_PER_ELEMENT",4,
1|2|4);

%SetCode(N,Float32ArrayConstructor);
%FunctionSetPrototype(N,new j());
%InternalSetPrototype(N,Q);
%InternalSetPrototype(N.prototype,Q.prototype);
%AddNamedProperty(N,"BYTES_PER_ELEMENT",4,
1|2|4);
%AddNamedProperty(N.prototype,
"constructor",a.Float32Array,2);
%AddNamedProperty(N.prototype,
"BYTES_PER_ELEMENT",4,
1|2|4);

%SetCode(O,Float64ArrayConstructor);
%FunctionSetPrototype(O,new j());
%InternalSetPrototype(O,Q);
%InternalSetPrototype(O.prototype,Q.prototype);
%AddNamedProperty(O,"BYTES_PER_ELEMENT",8,
1|2|4);
%AddNamedProperty(O.prototype,
"constructor",a.Float64Array,2);
%AddNamedProperty(O.prototype,
"BYTES_PER_ELEMENT",8,
1|2|4);

%SetCode(P,Uint8ClampedArrayConstructor);
%FunctionSetPrototype(P,new j());
%InternalSetPrototype(P,Q);
%InternalSetPrototype(P.prototype,Q.prototype);
%AddNamedProperty(P,"BYTES_PER_ELEMENT",1,
1|2|4);
%AddNamedProperty(P.prototype,
"constructor",a.Uint8ClampedArray,2);
%AddNamedProperty(P.prototype,
"BYTES_PER_ELEMENT",1,
1|2|4);


})

(collectionŸÖ
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.Map;
var d=a.Object;
var e=a.Set;
var f=b.ImportNow("hash_code_symbol");
var g=a.Math.random;
var h;
var i;
var j=b.ImportNow("species_symbol");
var k=b.ImportNow("to_string_tag_symbol");
b.Import(function(l){
h=l.MapIterator;
i=l.SetIterator;
});
function HashToEntry(m,n,o){
var p=(n&((o)-1));
return((%_FixedArrayGet(m,(3+(p))|0)));
}
%SetForceInlineFlag(HashToEntry);
function SetFindEntry(m,o,q,n){
var r=HashToEntry(m,n,o);
if(r===-1)return r;
var s=((%_FixedArrayGet(m,((3+(o)+((r)<<1)))|0)));
if(q===s)return r;
var t=(!%_IsSmi(%IS_VAR(q))&&!(q==q));
while(true){
if(t&&(!%_IsSmi(%IS_VAR(s))&&!(s==s))){
return r;
}
r=((%_FixedArrayGet(m,((3+(o)+((r)<<1))+1)|0)));
if(r===-1)return r;
s=((%_FixedArrayGet(m,((3+(o)+((r)<<1)))|0)));
if(q===s)return r;
}
return-1;
}
%SetForceInlineFlag(SetFindEntry);
function MapFindEntry(m,o,q,n){
var r=HashToEntry(m,n,o);
if(r===-1)return r;
var s=((%_FixedArrayGet(m,((3+(o)+((r)*3)))|0)));
if(q===s)return r;
var t=(!%_IsSmi(%IS_VAR(q))&&!(q==q));
while(true){
if(t&&(!%_IsSmi(%IS_VAR(s))&&!(s==s))){
return r;
}
r=((%_FixedArrayGet(m,((3+(o)+((r)*3))+2)|0)));
if(r===-1)return r;
s=((%_FixedArrayGet(m,((3+(o)+((r)*3)))|0)));
if(q===s)return r;
}
return-1;
}
%SetForceInlineFlag(MapFindEntry);
function ComputeIntegerHash(q,u){
var n=q;
n=n^u;
n=~n+(n<<15);
n=n^(n>>>12);
n=n+(n<<2);
n=n^(n>>>4);
n=(n*2057)|0;
n=n^(n>>>16);
return n&0x3fffffff;
}
%SetForceInlineFlag(ComputeIntegerHash);
function GetExistingHash(q){
if(%_IsSmi(q)){
return ComputeIntegerHash(q,0);
}
if((typeof(q)==='string')){
var v=%_StringGetRawHashField(q);
if((v&1)===0){
return v>>>2;
}
}else if((%_IsJSReceiver(q))&&!(%_IsJSProxy(q))&&!(%_ClassOf(q)==='global')){
var n=(q[f]);
return n;
}
return %GenericHash(q);
}
%SetForceInlineFlag(GetExistingHash);
function GetHash(q){
var n=GetExistingHash(q);
if((n===(void 0))){
n=(g()*0x40000000)|0;
if(n===0)n=1;
(q[f]=n);
}
return n;
}
%SetForceInlineFlag(GetHash);
function SetConstructor(w){
if((new.target===(void 0))){
throw %make_type_error(27,"Set");
}
%_SetInitialize(this);
if(!(w==null)){
var x=this.add;
if(!(typeof(x)==='function')){
throw %make_type_error(87,x,'add',this);
}
for(var y of w){
%_Call(x,this,y);
}
}
}
function SetAdd(q){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,'Set.prototype.add',this);
}
if(q===0){
q=0;
}
var m=%_JSCollectionGetTable(this);
var o=((%_FixedArrayGet(m,(0)|0)));
var n=GetHash(q);
if(SetFindEntry(m,o,q,n)!==-1)return this;
var z=((%_FixedArrayGet(m,(1)|0)));
var A=((%_FixedArrayGet(m,(2)|0)));
var B=o<<1;
if((z+A)>=B){
%SetGrow(this);
m=%_JSCollectionGetTable(this);
o=((%_FixedArrayGet(m,(0)|0)));
z=((%_FixedArrayGet(m,(1)|0)));
A=((%_FixedArrayGet(m,(2)|0)));
}
var r=z+A;
var C=(3+(o)+((r)<<1));
var p=(n&((o)-1));
var D=((%_FixedArrayGet(m,(3+(p))|0)));
((%_FixedArraySet(m,(3+(p))|0,r)));
(((%_FixedArraySet(m,(1)|0,(z+1)|0))));
(%_FixedArraySet(m,(C)|0,q));
((%_FixedArraySet(m,(C+1)|0,(D)|0)));
return this;
}
function SetHas(q){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,'Set.prototype.has',this);
}
var m=%_JSCollectionGetTable(this);
var o=((%_FixedArrayGet(m,(0)|0)));
var n=GetExistingHash(q);
if((n===(void 0)))return false;
return SetFindEntry(m,o,q,n)!==-1;
}
function SetDelete(q){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,
'Set.prototype.delete',this);
}
var m=%_JSCollectionGetTable(this);
var o=((%_FixedArrayGet(m,(0)|0)));
var n=GetExistingHash(q);
if((n===(void 0)))return false;
var r=SetFindEntry(m,o,q,n);
if(r===-1)return false;
var z=((%_FixedArrayGet(m,(1)|0)))-1;
var A=((%_FixedArrayGet(m,(2)|0)))+1;
var C=(3+(o)+((r)<<1));
(%_FixedArraySet(m,(C)|0,%_TheHole()));
(((%_FixedArraySet(m,(1)|0,(z)|0))));
(((%_FixedArraySet(m,(2)|0,(A)|0))));
if(z<(o>>>1))%SetShrink(this);
return true;
}
function SetGetSize(){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,
'Set.prototype.size',this);
}
var m=%_JSCollectionGetTable(this);
return((%_FixedArrayGet(m,(1)|0)));
}
function SetClearJS(){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,
'Set.prototype.clear',this);
}
%_SetClear(this);
}
function SetForEach(E,F){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,
'Set.prototype.forEach',this);
}
if(!(typeof(E)==='function'))throw %make_type_error(15,E);
var G=new i(this,2);
var q;
var H=[(void 0)];
while(%SetIteratorNext(G,H)){
q=H[0];
%_Call(E,F,q,q,this);
}
}
function SetSpecies(){
return this;
}
%SetCode(e,SetConstructor);
%FunctionSetLength(e,0);
%FunctionSetPrototype(e,new d());
%AddNamedProperty(e.prototype,"constructor",e,2);
%AddNamedProperty(e.prototype,k,"Set",
2|1);
%FunctionSetLength(SetForEach,1);
b.InstallGetter(e,j,SetSpecies);
b.InstallGetter(e.prototype,"size",SetGetSize);
b.InstallFunctions(e.prototype,2,[
"add",SetAdd,
"has",SetHas,
"delete",SetDelete,
"clear",SetClearJS,
"forEach",SetForEach
]);
function MapConstructor(w){
if((new.target===(void 0))){
throw %make_type_error(27,"Map");
}
%_MapInitialize(this);
if(!(w==null)){
var x=this.set;
if(!(typeof(x)==='function')){
throw %make_type_error(87,x,'set',this);
}
for(var I of w){
if(!(%_IsJSReceiver(I))){
throw %make_type_error(52,I);
}
%_Call(x,this,I[0],I[1]);
}
}
}
function MapGet(q){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.get',this);
}
var m=%_JSCollectionGetTable(this);
var o=((%_FixedArrayGet(m,(0)|0)));
var n=GetExistingHash(q);
if((n===(void 0)))return(void 0);
var r=MapFindEntry(m,o,q,n);
if(r===-1)return(void 0);
return((%_FixedArrayGet(m,((3+(o)+((r)*3))+1)|0)));
}
function MapSet(q,y){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.set',this);
}
if(q===0){
q=0;
}
var m=%_JSCollectionGetTable(this);
var o=((%_FixedArrayGet(m,(0)|0)));
var n=GetHash(q);
var r=MapFindEntry(m,o,q,n);
if(r!==-1){
var J=(3+(o)+((r)*3));
(%_FixedArraySet(m,(J+1)|0,y));
return this;
}
var z=((%_FixedArrayGet(m,(1)|0)));
var A=((%_FixedArrayGet(m,(2)|0)));
var B=o<<1;
if((z+A)>=B){
%MapGrow(this);
m=%_JSCollectionGetTable(this);
o=((%_FixedArrayGet(m,(0)|0)));
z=((%_FixedArrayGet(m,(1)|0)));
A=((%_FixedArrayGet(m,(2)|0)));
}
r=z+A;
var C=(3+(o)+((r)*3));
var p=(n&((o)-1));
var D=((%_FixedArrayGet(m,(3+(p))|0)));
((%_FixedArraySet(m,(3+(p))|0,r)));
(((%_FixedArraySet(m,(1)|0,(z+1)|0))));
(%_FixedArraySet(m,(C)|0,q));
(%_FixedArraySet(m,(C+1)|0,y));
(%_FixedArraySet(m,(C+2)|0,D));
return this;
}
function MapHas(q){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.has',this);
}
var m=%_JSCollectionGetTable(this);
var o=((%_FixedArrayGet(m,(0)|0)));
var n=GetHash(q);
return MapFindEntry(m,o,q,n)!==-1;
}
function MapDelete(q){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.delete',this);
}
var m=%_JSCollectionGetTable(this);
var o=((%_FixedArrayGet(m,(0)|0)));
var n=GetHash(q);
var r=MapFindEntry(m,o,q,n);
if(r===-1)return false;
var z=((%_FixedArrayGet(m,(1)|0)))-1;
var A=((%_FixedArrayGet(m,(2)|0)))+1;
var C=(3+(o)+((r)*3));
(%_FixedArraySet(m,(C)|0,%_TheHole()));
(%_FixedArraySet(m,(C+1)|0,%_TheHole()));
(((%_FixedArraySet(m,(1)|0,(z)|0))));
(((%_FixedArraySet(m,(2)|0,(A)|0))));
if(z<(o>>>1))%MapShrink(this);
return true;
}
function MapGetSize(){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.size',this);
}
var m=%_JSCollectionGetTable(this);
return((%_FixedArrayGet(m,(1)|0)));
}
function MapClearJS(){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.clear',this);
}
%_MapClear(this);
}
function MapForEach(E,F){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.forEach',this);
}
if(!(typeof(E)==='function'))throw %make_type_error(15,E);
var G=new h(this,3);
var H=[(void 0),(void 0)];
while(%MapIteratorNext(G,H)){
%_Call(E,F,H[1],H[0],this);
}
}
function MapSpecies(){
return this;
}
%SetCode(c,MapConstructor);
%FunctionSetLength(c,0);
%FunctionSetPrototype(c,new d());
%AddNamedProperty(c.prototype,"constructor",c,2);
%AddNamedProperty(
c.prototype,k,"Map",2|1);
%FunctionSetLength(MapForEach,1);
b.InstallGetter(c,j,MapSpecies);
b.InstallGetter(c.prototype,"size",MapGetSize);
b.InstallFunctions(c.prototype,2,[
"get",MapGet,
"set",MapSet,
"has",MapHas,
"delete",MapDelete,
"clear",MapClearJS,
"forEach",MapForEach
]);
%InstallToContext([
"map_get",MapGet,
"map_set",MapSet,
"map_has",MapHas,
"map_delete",MapDelete,
"set_add",SetAdd,
"set_has",SetHas,
"set_delete",SetDelete,
]);
b.Export(function(K){
K.GetExistingHash=GetExistingHash;
K.GetHash=GetHash;
});
})

<weak-collectionµ0
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c;
var d;
var e=a.Object;
var f=a.WeakMap;
var g=a.WeakSet;
var h=b.ImportNow("to_string_tag_symbol");
b.Import(function(i){
c=i.GetExistingHash;
d=i.GetHash;
});
function WeakMapConstructor(j){
if((new.target===(void 0))){
throw %make_type_error(27,"WeakMap");
}
%WeakCollectionInitialize(this);
if(!(j==null)){
var k=this.set;
if(!(typeof(k)==='function')){
throw %make_type_error(87,k,'set',this);
}
for(var l of j){
if(!(%_IsJSReceiver(l))){
throw %make_type_error(52,l);
}
%_Call(k,this,l[0],l[1]);
}
}
}
function WeakMapGet(m){
if(!(%_ClassOf(this)==='WeakMap')){
throw %make_type_error(45,
'WeakMap.prototype.get',this);
}
if(!(%_IsJSReceiver(m)))return(void 0);
var n=c(m);
if((n===(void 0)))return(void 0);
return %WeakCollectionGet(this,m,n);
}
function WeakMapSet(m,o){
if(!(%_ClassOf(this)==='WeakMap')){
throw %make_type_error(45,
'WeakMap.prototype.set',this);
}
if(!(%_IsJSReceiver(m)))throw %make_type_error(165);
return %WeakCollectionSet(this,m,o,d(m));
}
function WeakMapHas(m){
if(!(%_ClassOf(this)==='WeakMap')){
throw %make_type_error(45,
'WeakMap.prototype.has',this);
}
if(!(%_IsJSReceiver(m)))return false;
var n=c(m);
if((n===(void 0)))return false;
return %WeakCollectionHas(this,m,n);
}
function WeakMapDelete(m){
if(!(%_ClassOf(this)==='WeakMap')){
throw %make_type_error(45,
'WeakMap.prototype.delete',this);
}
if(!(%_IsJSReceiver(m)))return false;
var n=c(m);
if((n===(void 0)))return false;
return %WeakCollectionDelete(this,m,n);
}
%SetCode(f,WeakMapConstructor);
%FunctionSetLength(f,0);
%FunctionSetPrototype(f,new e());
%AddNamedProperty(f.prototype,"constructor",f,
2);
%AddNamedProperty(f.prototype,h,"WeakMap",
2|1);
b.InstallFunctions(f.prototype,2,[
"get",WeakMapGet,
"set",WeakMapSet,
"has",WeakMapHas,
"delete",WeakMapDelete
]);
function WeakSetConstructor(j){
if((new.target===(void 0))){
throw %make_type_error(27,"WeakSet");
}
%WeakCollectionInitialize(this);
if(!(j==null)){
var k=this.add;
if(!(typeof(k)==='function')){
throw %make_type_error(87,k,'add',this);
}
for(var o of j){
%_Call(k,this,o);
}
}
}
function WeakSetAdd(o){
if(!(%_ClassOf(this)==='WeakSet')){
throw %make_type_error(45,
'WeakSet.prototype.add',this);
}
if(!(%_IsJSReceiver(o)))throw %make_type_error(166);
return %WeakCollectionSet(this,o,true,d(o));
}
function WeakSetHas(o){
if(!(%_ClassOf(this)==='WeakSet')){
throw %make_type_error(45,
'WeakSet.prototype.has',this);
}
if(!(%_IsJSReceiver(o)))return false;
var n=c(o);
if((n===(void 0)))return false;
return %WeakCollectionHas(this,o,n);
}
function WeakSetDelete(o){
if(!(%_ClassOf(this)==='WeakSet')){
throw %make_type_error(45,
'WeakSet.prototype.delete',this);
}
if(!(%_IsJSReceiver(o)))return false;
var n=c(o);
if((n===(void 0)))return false;
return %WeakCollectionDelete(this,o,n);
}
%SetCode(g,WeakSetConstructor);
%FunctionSetLength(g,0);
%FunctionSetPrototype(g,new e());
%AddNamedProperty(g.prototype,"constructor",g,
2);
%AddNamedProperty(g.prototype,h,"WeakSet",
2|1);
b.InstallFunctions(g.prototype,2,[
"add",WeakSetAdd,
"has",WeakSetHas,
"delete",WeakSetDelete
]);
})

Lcollection-iteratorÒ(
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.Map;
var d=a.Set;
var e=b.ImportNow("iterator_symbol");
var f=b.ImportNow("MapIterator");
var g=b.ImportNow("to_string_tag_symbol");
var h=b.ImportNow("SetIterator");
function SetIteratorConstructor(i,j){
%SetIteratorInitialize(this,i,j);
}
function SetIteratorNextJS(){
if(!(%_ClassOf(this)==='Set Iterator')){
throw %make_type_error(45,
'Set Iterator.prototype.next',this);
}
var k=[(void 0),(void 0)];
var l=%_CreateIterResultObject(k,false);
switch(%SetIteratorNext(this,k)){
case 0:
l.value=(void 0);
l.done=true;
break;
case 2:
l.value=k[0];
break;
case 3:
k[1]=k[0];
break;
}
return l;
}
function SetEntries(){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,
'Set.prototype.entries',this);
}
return new h(this,3);
}
function SetValues(){
if(!(%_ClassOf(this)==='Set')){
throw %make_type_error(45,
'Set.prototype.values',this);
}
return new h(this,2);
}
%SetCode(h,SetIteratorConstructor);
%FunctionSetInstanceClassName(h,'Set Iterator');
b.InstallFunctions(h.prototype,2,[
'next',SetIteratorNextJS
]);
%AddNamedProperty(h.prototype,g,
"Set Iterator",1|2);
b.InstallFunctions(d.prototype,2,[
'entries',SetEntries,
'keys',SetValues,
'values',SetValues
]);
%AddNamedProperty(d.prototype,e,SetValues,2);
function MapIteratorConstructor(m,j){
%MapIteratorInitialize(this,m,j);
}
function MapIteratorNextJS(){
if(!(%_ClassOf(this)==='Map Iterator')){
throw %make_type_error(45,
'Map Iterator.prototype.next',this);
}
var k=[(void 0),(void 0)];
var l=%_CreateIterResultObject(k,false);
switch(%MapIteratorNext(this,k)){
case 0:
l.value=(void 0);
l.done=true;
break;
case 1:
l.value=k[0];
break;
case 2:
l.value=k[1];
break;
}
return l;
}
function MapEntries(){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.entries',this);
}
return new f(this,3);
}
function MapKeys(){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.keys',this);
}
return new f(this,1);
}
function MapValues(){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(45,
'Map.prototype.values',this);
}
return new f(this,2);
}
%SetCode(f,MapIteratorConstructor);
%FunctionSetInstanceClassName(f,'Map Iterator');
b.InstallFunctions(f.prototype,2,[
'next',MapIteratorNextJS
]);
%AddNamedProperty(f.prototype,g,
"Map Iterator",1|2);
b.InstallFunctions(c.prototype,2,[
'entries',MapEntries,
'keys',MapKeys,
'values',MapValues
]);
%AddNamedProperty(c.prototype,e,MapEntries,2);
b.Export(function(n){
n.MapEntries=MapEntries;
n.MapIteratorNext=MapIteratorNextJS;
n.SetIteratorNext=SetIteratorNextJS;
n.SetValues=SetValues;
});
})

promiseMç
(function(a,b,c){
"use strict";
%CheckIsBootstrapping();
var d=b.InternalArray;
var e=
b.ImportNow("promise_async_stack_id_symbol");
var f=
b.ImportNow("promise_handled_by_symbol");
var g=
b.ImportNow("promise_forwarding_handler_symbol");
var h=
b.ImportNow("promise_has_handler_symbol");
var i=
b.ImportNow("promise_reject_reactions_symbol");
var j=
b.ImportNow("promise_fulfill_reactions_symbol");
var k=
b.ImportNow("promise_deferred_reaction_symbol");
var l=
b.ImportNow("promise_handled_hint_symbol");
var m=b.ImportNow("promise_raw_symbol");
var n=b.ImportNow("promise_state_symbol");
var o=b.ImportNow("promise_result_symbol");
var p;
var q=b.ImportNow("species_symbol");
var r=b.ImportNow("to_string_tag_symbol");
var s;
b.Import(function(t){
s=t.ObjectHasOwnProperty;
p=t.SpeciesConstructor;
});
const kPending=0;
const kFulfilled=+1;
const kRejected=+2;
const kResolveCallback=0;
const kRejectCallback=1;
var u=function Promise(v){
if(v===m){
return %_NewObject(u,new.target);
}
if((new.target===(void 0)))throw %make_type_error(66,this);
if(!(typeof(v)==='function')){
throw %make_type_error(128,v);
}
var w=PromiseInit(%_NewObject(u,new.target));
var x=%create_resolving_functions(w,true);
var y=(%_DebugIsActive()!=0);
try{
if(y)%DebugPushPromise(w);
v(x[kResolveCallback],x[kRejectCallback]);
}%catch(e){
%_Call(x[kRejectCallback],(void 0),e);
}finally{
if(y)%DebugPopPromise();
}
return w;
}
function PromiseSet(w,z,A){
(w[n]=z);
(w[o]=A);
(w[j]=(void 0));
(w[i]=(void 0));
(w[k]=(void 0));
return w;
}
function PromiseCreateAndSet(z,A){
var w=new u(m);
if((%_DebugIsActive()!=0))PromiseSet(w,kPending,(void 0));
return PromiseSet(w,z,A);
}
function PromiseInit(w){
return PromiseSet(w,kPending,(void 0));
}
function PromiseHandle(A,B,C){
var y=(%_DebugIsActive()!=0);
try{
if(y)%DebugPushPromise(C.promise);
var D=B(A);
if((C.resolve===(void 0))){
ResolvePromise(C.promise,D);
}else{
%_Call(C.resolve,(void 0),D);
}
}%catch(exception){
try{
if((C.reject===(void 0))){
%PromiseReject(C.promise,exception,false);
PromiseSet(C.promise,kRejected,exception);
}else{
%_Call(C.reject,(void 0),exception);
}
}catch(e){}
}finally{
if(y)%DebugPopPromise();
}
}
function PromiseDebugGetInfo(E,z){
var F,G,H=(%_DebugIsActive()!=0);
if(H){
if(!(E===(void 0))&&
(%_Call(s,E.promise,f))&&
(%_Call(s,(E.promise[f]),e))){
F=((E.promise[f])[e]);
G="async function";
}else{
F=%DebugNextMicrotaskId();
G=z===kFulfilled?"Promise.resolve":"Promise.reject";
%DebugAsyncTaskEvent("enqueue",F,G);
}
}
return[F,G];
}
function PromiseAttachCallbacks(w,C,I,J){
var K=
(w[j]);
if((K===(void 0))){
(w[j]=I);
(w[i]=J);
(w[k]=C);
}else if(!(%_IsArray(K))){
var L=new d();
var M=new d();
var N=(w[k]);
L.push(
K,N,I,C);
M.push((w[i]),
N,
J,
C);
(w[j]=L);
(w[i]=M);
(w[k]=(void 0));
}else{
K.push(I,C);
(w[i]).push(J,C);
}
}
function PromiseIdResolveHandler(O){return O;}
function PromiseIdRejectHandler(P){%_ReThrow(P);}
(PromiseIdRejectHandler[g]=true);
function IsPromise(O){
return(%_IsJSReceiver(O))&&(!(O[n]===(void 0)));
}
function PromiseCreate(){
return PromiseInit(new u(m));
}
function ResolvePromise(w,Q){
if(Q===w){
var R=%make_type_error(83,Q);
%PromiseReject(w,R,true);
PromiseSet(w,kRejected,R);
return;
}
if((%_IsJSReceiver(Q))){
try{
var S=Q.then;
}catch(e){
%PromiseReject(w,e,true);
PromiseSet(w,kRejected,e);
return;
}
if(IsPromise(Q)&&S===PromiseThen){
var T=(Q[n]);
if(T===kFulfilled){
var U=(Q[o]);
%PromiseFulfill(w,kFulfilled,U,
j);
PromiseSet(w,kFulfilled,U);
(w[h]=true);
return;
}else if(T===kRejected){
var U=(Q[o]);
if(!(!(Q[h]===(void 0)))){
%PromiseRevokeReject(Q);
}
%PromiseReject(w,U,false);
PromiseSet(w,kRejected,U);
(Q[h]=true);
return;
}
}
if((typeof(S)==='function')){
if((%_DebugIsActive()!=0)&&IsPromise(Q)){
(Q[f]=w);
}
%EnqueuePromiseResolveThenableJob(w,Q,S);
return;
}
}
%PromiseFulfill(w,kFulfilled,Q,
j);
PromiseSet(w,kFulfilled,Q);
}
function RejectPromise(w,V,W){
%PromiseReject(w,V,W);
PromiseSet(w,kRejected,V);
}
function DoRejectPromise(w,V){
%PromiseReject(w,V,true);
PromiseSet(w,kRejected,V);
}
function NewPromiseCapability(X,W){
if(X===u){
var w=PromiseCreate();
var x=%create_resolving_functions(w,W);
return{
promise:w,
resolve:x[kResolveCallback],
reject:x[kRejectCallback]
};
}
var D={promise:(void 0),resolve:(void 0),reject:(void 0)};
D.promise=new X((resolve,reject)=>{
if(!(D.resolve===(void 0))||!(D.reject===(void 0)))
throw %make_type_error(84);
D.resolve=resolve;
D.reject=reject;
});
if(!(typeof(D.resolve)==='function')||!(typeof(D.reject)==='function'))
throw %make_type_error(85);
return D;
}
function PromiseReject(P){
if(!(%_IsJSReceiver(this))){
throw %make_type_error(16,PromiseResolve);
}
if(this===u){
var w=PromiseCreateAndSet(kRejected,P);
%PromiseRejectEventFromStack(w,P);
return w;
}else{
var Y=NewPromiseCapability(this,true);
%_Call(Y.reject,(void 0),P);
return Y.promise;
}
}
function PerformPromiseThen(w,I,J,Z){
if(!(typeof(I)==='function'))I=PromiseIdResolveHandler;
if(!(typeof(J)==='function'))J=PromiseIdRejectHandler;
var z=(w[n]);
switch(z){
case kPending:
PromiseAttachCallbacks(w,Z,I,J);
break;
case kFulfilled:
%EnqueuePromiseReactionJob((w[o]),
I,Z,kFulfilled);
break;
case kRejected:
if(!(!(w[h]===(void 0)))){
%PromiseRevokeReject(w);
}
%EnqueuePromiseReactionJob((w[o]),
J,Z,kRejected);
break;
}
(w[h]=true);
return Z.promise;
}
function PromiseThen(I,J){
var z=(this[n]);
if((z===(void 0))){
throw %make_type_error(66,this);
}
var aa=p(this,u);
var Z;
if(aa===u){
Z={
promise:PromiseCreate(),
resolve:(void 0),
reject:(void 0)
};
}else{
Z=NewPromiseCapability(aa,false);
}
return PerformPromiseThen(this,I,J,Z);
}
function PromiseCatch(J){
return this.then((void 0),J);
}
function PromiseResolve(O){
if(!(%_IsJSReceiver(this))){
throw %make_type_error(16,PromiseResolve);
}
if(IsPromise(O)&&O.constructor===this)return O;
if(this===u){
var w=PromiseCreate();
ResolvePromise(w,O);
return w;
}
var Y=NewPromiseCapability(this,true);
%_Call(Y.resolve,(void 0),O);
return Y.promise;
}
function PromiseAll(ab){
if(!(%_IsJSReceiver(this))){
throw %make_type_error(16,"Promise.all");
}
var C=NewPromiseCapability(this,false);
var ac=new d();
var ad;
var H=(%_DebugIsActive()!=0);
if(H){
(C.reject[g]=true);
}
function CreateResolveElementFunction(ae,af,Y){
var ag=false;
return(O)=>{
if(ag===true)return;
ag=true;
af[ae]=O;
if(--ad===0){
var ah=[];
%MoveArrayContents(af,ah);
%_Call(Y.resolve,(void 0),ah);
}
};
}
try{
var ai=0;
ad=1;
for(var A of ab){
var aj=this.resolve(A);
++ad;
var ak=aj.then(
CreateResolveElementFunction(ai,ac,C),
C.reject);
if(H&&IsPromise(ak)){
(ak[f]=C.promise);
}
++ai;
}
if(--ad===0){
var ah=[];
%MoveArrayContents(ac,ah);
%_Call(C.resolve,(void 0),ah);
}
}catch(e){
%_Call(C.reject,(void 0),e);
}
return C.promise;
}
function PromiseRace(ab){
if(!(%_IsJSReceiver(this))){
throw %make_type_error(16,PromiseRace);
}
var C=NewPromiseCapability(this,false);
var H=(%_DebugIsActive()!=0);
if(H){
(C.reject[g]=true);
}
try{
for(var A of ab){
var ak=this.resolve(A).then(C.resolve,
C.reject);
if(H&&IsPromise(ak)){
(ak[f]=C.promise);
}
}
}catch(e){
%_Call(C.reject,(void 0),e);
}
return C.promise;
}
function PromiseHasUserDefinedRejectHandlerCheck(B,C){
if((B[g])){
return PromiseHasUserDefinedRejectHandlerRecursive(C.promise);
}
return true;
}
function PromiseHasUserDefinedRejectHandlerRecursive(w){
if((w[l]))return true;
var al=(w[f]);
if(al&&
PromiseHasUserDefinedRejectHandlerRecursive(al)){
return true;
}
var am=(w[i]);
var C=(w[k]);
if((am===(void 0)))return false;
if(!(%_IsArray(am))){
return PromiseHasUserDefinedRejectHandlerCheck(am,C);
}
for(var ai=0;ai<am.length;ai+=2){
if(PromiseHasUserDefinedRejectHandlerCheck(am[ai],am[ai+1])){
return true;
}
}
return false;
}
function PromiseHasUserDefinedRejectHandler(){
return PromiseHasUserDefinedRejectHandlerRecursive(this);
};
function MarkPromiseAsHandled(w){
(w[h]=true);
}
function PromiseSpecies(){
return this;
}
%AddNamedProperty(a,'Promise',u,2);
%AddNamedProperty(u.prototype,r,"Promise",
2|1);
b.InstallFunctions(u,2,[
"reject",PromiseReject,
"all",PromiseAll,
"race",PromiseRace,
"resolve",PromiseResolve
]);
b.InstallGetter(u,q,PromiseSpecies);
b.InstallFunctions(u.prototype,2,[
"then",PromiseThen,
"catch",PromiseCatch
]);
%InstallToContext([
"promise_catch",PromiseCatch,
"promise_create",PromiseCreate,
"promise_has_user_defined_reject_handler",PromiseHasUserDefinedRejectHandler,
"promise_reject",DoRejectPromise,
"promise_internal_reject",RejectPromise,
"promise_resolve",ResolvePromise,
"promise_then",PromiseThen,
"promise_handle",PromiseHandle,
"promise_debug_get_info",PromiseDebugGetInfo
]);
b.InstallFunctions(c,0,[
"createPromise",PromiseCreate,
"resolvePromise",ResolvePromise,
"rejectPromise",DoRejectPromise,
"markPromiseAsHandled",MarkPromiseAsHandled
]);
b.Export(function(an){
an.IsPromise=IsPromise;
an.PromiseCreate=PromiseCreate;
an.PromiseThen=PromiseThen;
an.GlobalPromise=u;
an.NewPromiseCapability=NewPromiseCapability;
an.PerformPromiseThen=PerformPromiseThen;
an.ResolvePromise=ResolvePromise;
an.RejectPromise=RejectPromise;
});
})

 messagesÕ	
(function(a,b){
%CheckIsBootstrapping();
var c=b.ImportNow("Script");
%FunctionSetInstanceClassName(c,'Script');
%AddNamedProperty(c.prototype,'constructor',c,
2|4|1);
function ScriptLocationFromPosition(position,
include_resource_offset){
return %ScriptPositionInfo(this,position,!!include_resource_offset);
}
function ScriptNameOrSourceURL(){
if(this.source_url)return this.source_url;
return this.name;
}
b.SetUpLockedPrototype(c,[
"source",
"name",
"source_url",
"source_mapping_url",
"line_offset",
"column_offset"
],[
"locationFromPosition",ScriptLocationFromPosition,
"nameOrSourceURL",ScriptNameOrSourceURL,
]
);
});

$templates
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.Map;
var d=b.InternalArray;
var e=new c;
var f=c.prototype.get;
var g=c.prototype.set;
function SameCallSiteElements(h,i){
var j=h.length;
var i=i.raw;
if(j!==i.length)return false;
for(var k=0;k<j;++k){
if(h[k]!==i[k])return false;
}
return true;
}
function GetCachedCallSite(l,m){
var n=%_Call(f,e,m);
if((n===(void 0)))return;
var j=n.length;
for(var k=0;k<j;++k){
if(SameCallSiteElements(l,n[k]))return n[k];
}
}
function SetCachedCallSite(l,m){
var n=%_Call(f,e,m);
var o;
if((n===(void 0))){
o=new d(1);
o[0]=l;
%_Call(g,e,m,o);
}else{
n.push(l);
}
return l;
}
function GetTemplateCallSite(l,h,m){
var p=GetCachedCallSite(h,m);
if(!(p===(void 0)))return p;
%AddNamedProperty(l,"raw",%object_freeze(h),
1|2|4);
return SetCachedCallSite(%object_freeze(l),m);
}
%InstallToContext(["get_template_call_site",GetTemplateCallSite]);
})

spread5
(function(a,b){
'use strict';
var c=b.InternalArray;
function SpreadArguments(){
var d=arguments.length;
var e=new c();
for(var f=0;f<d;++f){
var g=arguments[f];
var h=g.length;
for(var i=0;i<h;++i){
e.push(g[i]);
}
}
return e;
}
function SpreadIterable(j){
if((j==null)){
throw %make_type_error(71,j);
}
var e=new c();
for(var k of j){
e.push(k);
}
return e;
}
%InstallToContext([
"spread_arguments",SpreadArguments,
"spread_iterable",SpreadIterable,
]);
})

proxyΩ
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.Proxy;
function ProxyCreateRevocable(d,e){
var f=new c(d,e);
return{proxy:f,revoke:()=>%JSProxyRevoke(f)};
}
b.InstallFunctions(c,2,[
"revocable",ProxyCreateRevocable
]);
})

,async-await—
(function(a,b,c){
"use strict";
%CheckIsBootstrapping();
var d;
var e;
var f;
var g;
var h;
var i;
var j;
var k;
var l;
var m;
b.Import(function(n){
d=n.AsyncFunctionNext;
e=n.AsyncFunctionThrow;
f=n.GlobalPromise;
g=n.IsPromise;
h=n.NewPromiseCapability;
i=n.PerformPromiseThen;
j=n.PromiseCreate;
l=n.RejectPromise;
m=n.ResolvePromise;
});
var o=
b.ImportNow("promise_async_stack_id_symbol");
var p=
b.ImportNow("promise_handled_by_symbol");
var q=
b.ImportNow("promise_forwarding_handler_symbol");
var r=
b.ImportNow("promise_handled_hint_symbol");
var s=
b.ImportNow("promise_has_handler_symbol");
function PromiseCastResolved(t){
if(g(t)){
return t;
}else{
var u=j();
m(u,t);
return u;
}
}
function AsyncFunctionAwait(v,w,x){
var u=PromiseCastResolved(w);
var y=sentValue=>{
%_Call(d,v,sentValue);
return;
};
var z=sentError=>{
%_Call(e,v,sentError);
return;
}
var A=h(f,false);
(A.promise[s]=true);
if((%_DebugIsActive()!=0)){
if(g(w)){
(z[q]=true);
}
(A.promise[p]=x);
}
i(u,y,z,A);
}
function AsyncFunctionAwaitUncaught(v,w,x){
AsyncFunctionAwait(v,w,x);
}
function AsyncFunctionAwaitCaught(v,w,x){
if((%_DebugIsActive()!=0)&&g(w)){
(w[r]=true);
}
AsyncFunctionAwait(v,w,x);
}
function RejectPromiseNoDebugEvent(u,B){
return l(u,B,false);
}
function AsyncFunctionPromiseCreate(){
var u=j();
if((%_DebugIsActive()!=0)){
%DebugPushPromise(u);
var C=%DebugNextMicrotaskId();
(u[o]=C);
%DebugAsyncTaskEvent("enqueueRecurring",C,"async function");
}
return u;
}
function AsyncFunctionPromiseRelease(u){
if((%_DebugIsActive()!=0)){
var C=(u[o]);
if(!(C===(void 0))){
%DebugAsyncTaskEvent("cancel",C,"async function");
}
%DebugPopPromise();
}
}
%InstallToContext([
"async_function_await_caught",AsyncFunctionAwaitCaught,
"async_function_await_uncaught",AsyncFunctionAwaitUncaught,
"reject_promise_no_debug_event",RejectPromiseNoDebugEvent,
"async_function_promise_create",AsyncFunctionPromiseCreate,
"async_function_promise_release",AsyncFunctionPromiseRelease,
]);
})

i18n*
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c;
var d;
var e=a.Date;
var f=a.Number;
var g=a.RegExp;
var h=a.String;
var i=b.InstallFunctions;
var j=b.InstallGetter;
var k=b.InternalArray;
var l=b.ImportNow("ObjectHasOwnProperty");
var m=b.OverrideFunction;
var n=b.ImportNow("intl_pattern_symbol");
var o=b.ImportNow("intl_resolved_symbol");
var p=b.SetFunctionName;
var q=h.prototype.substr;
var r=h.prototype.substring;
b.Import(function(s){
c=s.ArrayJoin;
d=s.ArrayPush;
});
function InstallFunction(t,u,v){
i(t,2,[u,v]);
}
function InstallConstructor(t,u,v){
%CheckIsBootstrapping();
p(v,u);
%AddNamedProperty(t,u,v,2);
%SetNativeFlag(v);
%ToFastProperties(t);
}
function AddBoundMethod(w,x,y,z,A){
%CheckIsBootstrapping();
var B=%CreatePrivateSymbol(x);
var C=(0,(function(){
if(!%IsInitializedIntlObjectOfType(this,A)){
throw %make_type_error(54,x);
}
if((this[B]===(void 0))){
var D;
if((z===(void 0))||z===2){
D=
(0,((fst,snd)=>y(this,fst,snd)));
}else if(z===1){
D=(0,(fst=>y(this,fst)));
}else{
D=(0,((...args)=>{
if(args.length>0){
return y(this,args[0]);
}else{
return y(this);
}
}));
}
%SetNativeFlag(D);
this[B]=D;
}
return this[B];
}));
%FunctionRemovePrototype(C);
%DefineGetterPropertyUnchecked(w.prototype,x,C,2);
%SetNativeFlag(C);
}
var E={};
%AddNamedProperty(a,"Intl",E,2);
var F={
'collator':(void 0),
'numberformat':(void 0),
'dateformat':(void 0),
'breakiterator':(void 0)
};
var G=(void 0);
function GetDefaultICULocaleJS(){
if((G===(void 0))){
G=%GetDefaultICULocale();
}
return G;
}
var H=(void 0);
function GetUnicodeExtensionRE(){
if(((void 0)===(void 0))){
H=new g('-u(-[a-z0-9]{2,8})+','g');
}
return H;
}
var I=(void 0);
function GetAnyExtensionRE(){
if((I===(void 0))){
I=new g('-[a-z0-9]{1}-.*','g');
}
return I;
}
var J=(void 0);
function GetQuotedStringRE(){
if((J===(void 0))){
J=new g("'[^']+'",'g');
}
return J;
}
var K=(void 0);
function GetServiceRE(){
if((K===(void 0))){
K=
new g('^(collator|numberformat|dateformat|breakiterator)$');
}
return K;
}
var L=(void 0);
function GetLanguageTagRE(){
if((L===(void 0))){
BuildLanguageTagREs();
}
return L;
}
var M=(void 0);
function GetLanguageVariantRE(){
if((M===(void 0))){
BuildLanguageTagREs();
}
return M;
}
var N=(void 0);
function GetLanguageSingletonRE(){
if((N===(void 0))){
BuildLanguageTagREs();
}
return N;
}
var O=(void 0);
function GetTimezoneNameCheckRE(){
if((O===(void 0))){
O=new g(
'^([A-Za-z]+)/([A-Za-z_-]+)((?:\/[A-Za-z_-]+)+)*$');
}
return O;
}
var P=(void 0);
function GetTimezoneNameLocationPartRE(){
if((P===(void 0))){
P=
new g('^([A-Za-z]+)((?:[_-][A-Za-z]+)+)*$');
}
return P;
}
function supportedLocalesOf(Q,R,S){
if((%regexp_internal_match(GetServiceRE(),Q)===null)){
throw %make_error(7,Q);
}
if((S===(void 0))){
S={};
}else{
S=(%_ToObject(S));
}
var T=S.localeMatcher;
if(!(T===(void 0))){
T=(%_ToString(T));
if(T!=='lookup'&&T!=='best fit'){
throw %make_range_error(175,T);
}
}else{
T='best fit';
}
var U=initializeLocaleList(R);
if((F[Q]===(void 0))){
F[Q]=getAvailableLocalesOf(Q);
}
if(T==='best fit'){
return initializeLocaleList(bestFitSupportedLocalesOf(
U,F[Q]));
}
return initializeLocaleList(lookupSupportedLocalesOf(
U,F[Q]));
}
function lookupSupportedLocalesOf(U,V){
var W=new k();
for(var X=0;X<U.length;++X){
var Y=%RegExpInternalReplace(
GetUnicodeExtensionRE(),U[X],'');
do{
if(!(V[Y]===(void 0))){
%_Call(d,W,U[X]);
break;
}
var Z=%StringLastIndexOf(Y,'-');
if(Z===-1){
break;
}
Y=%_Call(r,Y,0,Z);
}while(true);
}
return W;
}
function bestFitSupportedLocalesOf(U,V){
return lookupSupportedLocalesOf(U,V);
}
function getGetOption(S,aa){
if((S===(void 0)))throw %make_error(4,aa);
var ab=function getOption(ac,A,ad,ae){
if(!(S[ac]===(void 0))){
var af=S[ac];
switch(A){
case'boolean':
af=(!!(af));
break;
case'string':
af=(%_ToString(af));
break;
case'number':
af=(%_ToNumber(af));
break;
default:
throw %make_error(8);
}
if(!(ad===(void 0))&&%ArrayIndexOf(ad,af,0)===-1){
throw %make_range_error(185,af,aa,ac);
}
return af;
}
return ae;
}
return ab;
}
function resolveLocale(Q,U,S){
U=initializeLocaleList(U);
var ab=getGetOption(S,Q);
var T=ab('localeMatcher','string',
['lookup','best fit'],'best fit');
var ag;
if(T==='lookup'){
ag=lookupMatcher(Q,U);
}else{
ag=bestFitMatcher(Q,U);
}
return ag;
}
function lookupMatcher(Q,U){
if((%regexp_internal_match(GetServiceRE(),Q)===null)){
throw %make_error(7,Q);
}
if((F[Q]===(void 0))){
F[Q]=getAvailableLocalesOf(Q);
}
for(var X=0;X<U.length;++X){
var Y=%RegExpInternalReplace(
GetAnyExtensionRE(),U[X],'');
do{
if(!(F[Q][Y]===(void 0))){
var ah=%regexp_internal_match(
GetUnicodeExtensionRE(),U[X]);
var ai=(ah===null)?'':ah[0];
return{'locale':Y,'extension':ai,'position':X};
}
var Z=%StringLastIndexOf(Y,'-');
if(Z===-1){
break;
}
Y=%_Call(r,Y,0,Z);
}while(true);
}
return{'locale':GetDefaultICULocaleJS(),'extension':'','position':-1};
}
function bestFitMatcher(Q,U){
return lookupMatcher(Q,U);
}
function parseExtension(ai){
var aj=%StringSplit(ai,'-',4294967295);
if(aj.length<=2||
(aj[0]!==''&&aj[1]!=='u')){
return{};
}
var ak={};
var al=(void 0);
var af=(void 0);
for(var X=2;X<aj.length;++X){
var z=aj[X].length;
var am=aj[X];
if(z===2){
if(!(al===(void 0))){
if(!(al in ak)){
ak[al]=af;
}
af=(void 0);
}
al=am;
}else if(z>=3&&z<=8&&!(al===(void 0))){
if((af===(void 0))){
af=am;
}else{
af=af+"-"+am;
}
}else{
return{};
}
}
if(!(al===(void 0))&&!(al in ak)){
ak[al]=af;
}
return ak;
}
function setOptions(an,ak,ao,ab,ap){
var ai='';
var aq=function updateExtension(al,af){
return'-'+al+'-'+(%_ToString(af));
}
var ar=function updateProperty(ac,A,af){
if(A==='boolean'&&(typeof af==='string')){
af=(af==='true')?true:false;
}
if(!(ac===(void 0))){
defineWEProperty(ap,ac,af);
}
}
for(var al in ao){
if((%_Call(l,ao,al))){
var af=(void 0);
var as=ao[al];
if(!(as.property===(void 0))){
af=ab(as.property,as.type,as.values);
}
if(!(af===(void 0))){
ar(as.property,as.type,af);
ai+=aq(al,af);
continue;
}
if((%_Call(l,ak,al))){
af=ak[al];
if(!(af===(void 0))){
ar(as.property,as.type,af);
ai+=aq(al,af);
}else if(as.type==='boolean'){
ar(as.property,as.type,true);
ai+=aq(al,true);
}
}
}
}
return ai===''?'':'-u'+ai;
}
function freezeArray(at){
var au=[];
var av=at.length;
for(var X=0;X<av;X++){
if(X in at){
%object_define_property(au,X,{value:at[X],
configurable:false,
writable:false,
enumerable:true});
}
}
%object_define_property(au,'length',{value:av,writable:false});
return au;
}
function makeArray(at){
var au=[];
%MoveArrayContents(at,au);
return au;
}
function getOptimalLanguageTag(aw,ag){
if(aw===ag){
return aw;
}
var R=%GetLanguageTagVariants([aw,ag]);
if(R[0].maximized!==R[1].maximized){
return ag;
}
var ax=new g('^'+R[1].base,'g');
return %RegExpInternalReplace(ax,ag,R[0].base);
}
function getAvailableLocalesOf(Q){
var ay=%AvailableLocalesOf(Q);
for(var X in ay){
if((%_Call(l,ay,X))){
var az=%regexp_internal_match(
/^([a-z]{2,3})-([A-Z][a-z]{3})-([A-Z]{2})$/,X);
if(!(az===null)){
ay[az[1]+'-'+az[3]]=null;
}
}
}
return ay;
}
function defineWEProperty(t,ac,af){
%object_define_property(t,ac,
{value:af,writable:true,enumerable:true});
}
function addWEPropertyIfDefined(t,ac,af){
if(!(af===(void 0))){
defineWEProperty(t,ac,af);
}
}
function defineWECProperty(t,ac,af){
%object_define_property(t,ac,{value:af,
writable:true,
enumerable:true,
configurable:true});
}
function addWECPropertyIfDefined(t,ac,af){
if(!(af===(void 0))){
defineWECProperty(t,ac,af);
}
}
function toTitleCaseWord(aA){
return %StringToUpperCase(%_Call(q,aA,0,1))+
%StringToLowerCase(%_Call(q,aA,1));
}
function toTitleCaseTimezoneLocation(aB){
var aC=%regexp_internal_match(GetTimezoneNameLocationPartRE(),aB)
if((aC===null))throw %make_range_error(152,aB);
var aD=toTitleCaseWord(aC[1]);
if(!(aC[2]===(void 0))&&2<aC.length){
var aE=%_Call(r,aC[2],0,1);
var az=%StringSplit(aC[2],aE,4294967295);
for(var X=1;X<az.length;X++){
var aF=az[X]
var aG=%StringToLowerCase(aF);
aD=aD+aE+
((aG!=='es'&&
aG!=='of'&&aG!=='au')?
toTitleCaseWord(aF):aG);
}
}
return aD;
}
function canonicalizeLanguageTag(aH){
if((!(typeof(aH)==='string')&&!(%_IsJSReceiver(aH)))||
(aH===null)){
throw %make_type_error(53);
}
if((typeof(aH)==='string')&&
!(%regexp_internal_match(/^[a-z]{2,3}$/,aH)===null)){
return aH;
}
var aI=(%_ToString(aH));
if(isStructuallyValidLanguageTag(aI)===false){
throw %make_range_error(164,aI);
}
var aJ=%CanonicalizeLanguageTag(aI);
if(aJ==='invalid-tag'){
throw %make_range_error(164,aI);
}
return aJ;
}
function canonicalizeLocaleList(R){
var aK=new k();
if(!(R===(void 0))){
if(typeof R==='string'){
%_Call(d,aK,canonicalizeLanguageTag(R));
return aK;
}
var aL=(%_ToObject(R));
var aM=(%_ToLength(aL.length));
for(var aN=0;aN<aM;aN++){
if(aN in aL){
var af=aL[aN];
var aJ=canonicalizeLanguageTag(af);
if(%ArrayIndexOf(aK,aJ,0)===-1){
%_Call(d,aK,aJ);
}
}
}
}
return aK;
}
function initializeLocaleList(R){
return freezeArray(canonicalizeLocaleList(R));
}
function isStructuallyValidLanguageTag(Y){
if((%regexp_internal_match(GetLanguageTagRE(),Y)===null)){
return false;
}
if(%StringIndexOf(Y,'x-',0)===0){
return true;
}
Y=%StringSplit(Y,'-x-',4294967295)[0];
var aO=new k();
var aP=new k();
var az=%StringSplit(Y,'-',4294967295);
for(var X=1;X<az.length;X++){
var af=az[X];
if(!(%regexp_internal_match(GetLanguageVariantRE(),af)===null)&&
aP.length===0){
if(%ArrayIndexOf(aO,af,0)===-1){
%_Call(d,aO,af);
}else{
return false;
}
}
if(!(%regexp_internal_match(GetLanguageSingletonRE(),af)===null)){
if(%ArrayIndexOf(aP,af,0)===-1){
%_Call(d,aP,af);
}else{
return false;
}
}
}
return true;
}
function BuildLanguageTagREs(){
var aQ='[a-zA-Z]';
var aR='[0-9]';
var aS='('+aQ+'|'+aR+')';
var aT='(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|'+
'zh-min|zh-min-nan|zh-xiang)';
var aU='(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|'+
'i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|'+
'i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)';
var aV='('+aU+'|'+aT+')';
var aW='(x(-'+aS+'{1,8})+)';
var aX='('+aR+'|[A-WY-Za-wy-z])';
N=new g('^'+aX+'$','i');
var ai='('+aX+'(-'+aS+'{2,8})+)';
var aY='('+aS+'{5,8}|('+aR+aS+'{3}))';
M=new g('^'+aY+'$','i');
var aZ='('+aQ+'{2}|'+aR+'{3})';
var ba='('+aQ+'{4})';
var bb='('+aQ+'{3}(-'+aQ+'{3}){0,2})';
var bc='('+aQ+'{2,3}(-'+bb+')?|'+aQ+'{4}|'+
aQ+'{5,8})';
var bd=bc+'(-'+ba+')?(-'+aZ+')?(-'+
aY+')*(-'+ai+')*(-'+aW+')?';
var be=
'^('+bd+'|'+aW+'|'+aV+')$';
L=new g(be,'i');
}
var bf={
get(){
%IncrementUseCounter(16);
return this[o];
},
set(af){
this[o]=af;
}
};
InstallFunction(E,'getCanonicalLocales',function(R){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
return makeArray(canonicalizeLocaleList(R));
}
);
function initializeCollator(bg,R,S){
if(%IsInitializedIntlObject(bg)){
throw %make_type_error(126,"Collator");
}
if((S===(void 0))){
S={};
}
var ab=getGetOption(S,'collator');
var bh={};
defineWEProperty(bh,'usage',ab(
'usage','string',['sort','search'],'sort'));
var bi=ab('sensitivity','string',
['base','accent','case','variant']);
if((bi===(void 0))&&bh.usage==='sort'){
bi='variant';
}
defineWEProperty(bh,'sensitivity',bi);
defineWEProperty(bh,'ignorePunctuation',ab(
'ignorePunctuation','boolean',(void 0),false));
var Y=resolveLocale('collator',R,S);
var ak=parseExtension(Y.extension);
var bj={
'kn':{'property':'numeric','type':'boolean'},
'kf':{'property':'caseFirst','type':'string',
'values':['false','lower','upper']}
};
setOptions(
S,ak,bj,ab,bh);
var bk='default';
var ai='';
if((%_Call(l,ak,'co'))&&bh.usage==='sort'){
var bl=[
'big5han','dict','direct','ducet','gb2312','phonebk','phonetic',
'pinyin','reformed','searchjl','stroke','trad','unihan','zhuyin'
];
if(%ArrayIndexOf(bl,ak.co,0)!==-1){
ai='-u-co-'+ak.co;
bk=ak.co;
}
}else if(bh.usage==='search'){
ai='-u-co-search';
}
defineWEProperty(bh,'collation',bk);
var bm=Y.locale+ai;
var ag=%object_define_properties({},{
caseFirst:{writable:true},
collation:{value:bh.collation,writable:true},
ignorePunctuation:{writable:true},
locale:{writable:true},
numeric:{writable:true},
requestedLocale:{value:bm,writable:true},
sensitivity:{writable:true},
strength:{writable:true},
usage:{value:bh.usage,writable:true}
});
var bn=%CreateCollator(bm,
bh,
ag);
%MarkAsInitializedIntlObjectOfType(bg,'collator',bn);
bg[o]=ag;
return bg;
}
InstallConstructor(E,'Collator',function(){
var R=arguments[0];
var S=arguments[1];
if(!this||this===E){
return new E.Collator(R,S);
}
return initializeCollator((%_ToObject(this)),R,S);
}
);
InstallFunction(E.Collator.prototype,'resolvedOptions',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if(!%IsInitializedIntlObjectOfType(this,'collator')){
throw %make_type_error(127,"Collator");
}
var bo=this;
var Y=getOptimalLanguageTag(bo[o].requestedLocale,
bo[o].locale);
return{
locale:Y,
usage:bo[o].usage,
sensitivity:bo[o].sensitivity,
ignorePunctuation:bo[o].ignorePunctuation,
numeric:bo[o].numeric,
caseFirst:bo[o].caseFirst,
collation:bo[o].collation
};
}
);
InstallFunction(E.Collator,'supportedLocalesOf',function(R){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
return supportedLocalesOf('collator',R,arguments[1]);
}
);
function compare(bg,bp,bq){
return %InternalCompare(%GetImplFromInitializedIntlObject(bg),
(%_ToString(bp)),(%_ToString(bq)));
};
AddBoundMethod(E.Collator,'compare',compare,2,'collator');
function isWellFormedCurrencyCode(br){
return typeof br=="string"&&br.length==3&&
(%regexp_internal_match(/[^A-Za-z]/,br)===null);
}
function getNumberOption(S,ac,bs,bt,bu){
var af=S[ac];
if(!(af===(void 0))){
af=(%_ToNumber(af));
if((!%_IsSmi(%IS_VAR(af))&&!(af==af))||af<bs||af>bt){
throw %make_range_error(178,ac);
}
return %math_floor(af);
}
return bu;
}
var bv={
get(){
%IncrementUseCounter(15);
return this[n];
},
set(af){
this[n]=af;
}
};
function initializeNumberFormat(bw,R,S){
if(%IsInitializedIntlObject(bw)){
throw %make_type_error(126,"NumberFormat");
}
if((S===(void 0))){
S={};
}
var ab=getGetOption(S,'numberformat');
var Y=resolveLocale('numberformat',R,S);
var bh={};
defineWEProperty(bh,'style',ab(
'style','string',['decimal','percent','currency'],'decimal'));
var br=ab('currency','string');
if(!(br===(void 0))&&!isWellFormedCurrencyCode(br)){
throw %make_range_error(159,br);
}
if(bh.style==='currency'&&(br===(void 0))){
throw %make_type_error(29);
}
var bx=ab(
'currencyDisplay','string',['code','symbol','name'],'symbol');
if(bh.style==='currency'){
defineWEProperty(bh,'currency',%StringToUpperCase(br));
defineWEProperty(bh,'currencyDisplay',bx);
}
var by=getNumberOption(S,'minimumIntegerDigits',1,21,1);
defineWEProperty(bh,'minimumIntegerDigits',by);
var bz=S['minimumFractionDigits'];
var bA=S['maximumFractionDigits'];
if(!(bz===(void 0))||bh.style!=='currency'){
bz=getNumberOption(S,'minimumFractionDigits',0,20,0);
defineWEProperty(bh,'minimumFractionDigits',bz);
}
if(!(bA===(void 0))||bh.style!=='currency'){
var bB=bh.style==='percent'?0:3;
bz=(bz===(void 0))?0:bz;
var bC=(bz>bB)?bz:bB;
bA=getNumberOption(S,'maximumFractionDigits',bz,20,bC);
defineWEProperty(bh,'maximumFractionDigits',bA);
}
var bD=S['minimumSignificantDigits'];
var bE=S['maximumSignificantDigits'];
if(!(bD===(void 0))||!(bE===(void 0))){
bD=getNumberOption(S,'minimumSignificantDigits',1,21,0);
defineWEProperty(bh,'minimumSignificantDigits',bD);
bE=getNumberOption(S,'maximumSignificantDigits',bD,21,21);
defineWEProperty(bh,'maximumSignificantDigits',bE);
}
defineWEProperty(bh,'useGrouping',ab(
'useGrouping','boolean',(void 0),true));
var ak=parseExtension(Y.extension);
var bF={
'nu':{'property':(void 0),'type':'string'}
};
var ai=setOptions(S,ak,bF,
ab,bh);
var bm=Y.locale+ai;
var ag=%object_define_properties({},{
currency:{writable:true},
currencyDisplay:{writable:true},
locale:{writable:true},
maximumFractionDigits:{writable:true},
minimumFractionDigits:{writable:true},
minimumIntegerDigits:{writable:true},
numberingSystem:{writable:true},
requestedLocale:{value:bm,writable:true},
style:{value:bh.style,writable:true},
useGrouping:{writable:true}
});
if((%_Call(l,bh,'minimumSignificantDigits'))){
defineWEProperty(ag,'minimumSignificantDigits',(void 0));
}
if((%_Call(l,bh,'maximumSignificantDigits'))){
defineWEProperty(ag,'maximumSignificantDigits',(void 0));
}
var bG=%CreateNumberFormat(bm,
bh,
ag);
if(bh.style==='currency'){
%object_define_property(ag,'currencyDisplay',
{value:bx,writable:true});
}
%MarkAsInitializedIntlObjectOfType(bw,'numberformat',bG);
bw[o]=ag;
return bw;
}
InstallConstructor(E,'NumberFormat',function(){
var R=arguments[0];
var S=arguments[1];
if(!this||this===E){
return new E.NumberFormat(R,S);
}
return initializeNumberFormat((%_ToObject(this)),R,S);
}
);
InstallFunction(E.NumberFormat.prototype,'resolvedOptions',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if(!%IsInitializedIntlObjectOfType(this,'numberformat')){
throw %make_type_error(127,"NumberFormat");
}
var bH=this;
var Y=getOptimalLanguageTag(bH[o].requestedLocale,
bH[o].locale);
var aD={
locale:Y,
numberingSystem:bH[o].numberingSystem,
style:bH[o].style,
useGrouping:bH[o].useGrouping,
minimumIntegerDigits:bH[o].minimumIntegerDigits,
minimumFractionDigits:bH[o].minimumFractionDigits,
maximumFractionDigits:bH[o].maximumFractionDigits,
};
if(aD.style==='currency'){
defineWECProperty(aD,'currency',bH[o].currency);
defineWECProperty(aD,'currencyDisplay',
bH[o].currencyDisplay);
}
if((%_Call(l,bH[o],'minimumSignificantDigits'))){
defineWECProperty(aD,'minimumSignificantDigits',
bH[o].minimumSignificantDigits);
}
if((%_Call(l,bH[o],'maximumSignificantDigits'))){
defineWECProperty(aD,'maximumSignificantDigits',
bH[o].maximumSignificantDigits);
}
return aD;
}
);
InstallFunction(E.NumberFormat,'supportedLocalesOf',function(R){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
return supportedLocalesOf('numberformat',R,arguments[1]);
}
);
function formatNumber(bG,af){
var bI=(%_ToNumber(af))+0;
return %InternalNumberFormat(%GetImplFromInitializedIntlObject(bG),
bI);
}
AddBoundMethod(E.NumberFormat,'format',formatNumber,1,'numberformat');
function toLDMLString(S){
var ab=getGetOption(S,'dateformat');
var bJ='';
var bK=ab('weekday','string',['narrow','short','long']);
bJ+=appendToLDMLString(
bK,{narrow:'EEEEE',short:'EEE',long:'EEEE'});
bK=ab('era','string',['narrow','short','long']);
bJ+=appendToLDMLString(
bK,{narrow:'GGGGG',short:'GGG',long:'GGGG'});
bK=ab('year','string',['2-digit','numeric']);
bJ+=appendToLDMLString(bK,{'2-digit':'yy','numeric':'y'});
bK=ab('month','string',
['2-digit','numeric','narrow','short','long']);
bJ+=appendToLDMLString(bK,{'2-digit':'MM','numeric':'M',
'narrow':'MMMMM','short':'MMM','long':'MMMM'});
bK=ab('day','string',['2-digit','numeric']);
bJ+=appendToLDMLString(
bK,{'2-digit':'dd','numeric':'d'});
var bL=ab('hour12','boolean');
bK=ab('hour','string',['2-digit','numeric']);
if((bL===(void 0))){
bJ+=appendToLDMLString(bK,{'2-digit':'jj','numeric':'j'});
}else if(bL===true){
bJ+=appendToLDMLString(bK,{'2-digit':'hh','numeric':'h'});
}else{
bJ+=appendToLDMLString(bK,{'2-digit':'HH','numeric':'H'});
}
bK=ab('minute','string',['2-digit','numeric']);
bJ+=appendToLDMLString(bK,{'2-digit':'mm','numeric':'m'});
bK=ab('second','string',['2-digit','numeric']);
bJ+=appendToLDMLString(bK,{'2-digit':'ss','numeric':'s'});
bK=ab('timeZoneName','string',['short','long']);
bJ+=appendToLDMLString(bK,{short:'z',long:'zzzz'});
return bJ;
}
function appendToLDMLString(bK,bM){
if(!(bK===(void 0))){
return bM[bK];
}else{
return'';
}
}
function fromLDMLString(bJ){
bJ=%RegExpInternalReplace(GetQuotedStringRE(),bJ,'');
var S={};
var aC=%regexp_internal_match(/E{3,5}/,bJ);
S=appendToDateTimeObject(
S,'weekday',aC,{EEEEE:'narrow',EEE:'short',EEEE:'long'});
aC=%regexp_internal_match(/G{3,5}/,bJ);
S=appendToDateTimeObject(
S,'era',aC,{GGGGG:'narrow',GGG:'short',GGGG:'long'});
aC=%regexp_internal_match(/y{1,2}/,bJ);
S=appendToDateTimeObject(
S,'year',aC,{y:'numeric',yy:'2-digit'});
aC=%regexp_internal_match(/M{1,5}/,bJ);
S=appendToDateTimeObject(S,'month',aC,{MM:'2-digit',
M:'numeric',MMMMM:'narrow',MMM:'short',MMMM:'long'});
aC=%regexp_internal_match(/L{1,5}/,bJ);
S=appendToDateTimeObject(S,'month',aC,{LL:'2-digit',
L:'numeric',LLLLL:'narrow',LLL:'short',LLLL:'long'});
aC=%regexp_internal_match(/d{1,2}/,bJ);
S=appendToDateTimeObject(
S,'day',aC,{d:'numeric',dd:'2-digit'});
aC=%regexp_internal_match(/h{1,2}/,bJ);
if(aC!==null){
S['hour12']=true;
}
S=appendToDateTimeObject(
S,'hour',aC,{h:'numeric',hh:'2-digit'});
aC=%regexp_internal_match(/H{1,2}/,bJ);
if(aC!==null){
S['hour12']=false;
}
S=appendToDateTimeObject(
S,'hour',aC,{H:'numeric',HH:'2-digit'});
aC=%regexp_internal_match(/m{1,2}/,bJ);
S=appendToDateTimeObject(
S,'minute',aC,{m:'numeric',mm:'2-digit'});
aC=%regexp_internal_match(/s{1,2}/,bJ);
S=appendToDateTimeObject(
S,'second',aC,{s:'numeric',ss:'2-digit'});
aC=%regexp_internal_match(/z|zzzz/,bJ);
S=appendToDateTimeObject(
S,'timeZoneName',aC,{z:'short',zzzz:'long'});
return S;
}
function appendToDateTimeObject(S,bK,aC,bM){
if((aC===null)){
if(!(%_Call(l,S,bK))){
defineWEProperty(S,bK,(void 0));
}
return S;
}
var ac=aC[0];
defineWEProperty(S,bK,bM[ac]);
return S;
}
function toDateTimeOptions(S,bN,bO){
if((S===(void 0))){
S={};
}else{
S=(%_ToObject(S));
}
var bP=true;
if((bN==='date'||bN==='any')&&
(!(S.weekday===(void 0))||!(S.year===(void 0))||
!(S.month===(void 0))||!(S.day===(void 0)))){
bP=false;
}
if((bN==='time'||bN==='any')&&
(!(S.hour===(void 0))||!(S.minute===(void 0))||
!(S.second===(void 0)))){
bP=false;
}
if(bP&&(bO==='date'||bO==='all')){
%object_define_property(S,'year',{value:'numeric',
writable:true,
enumerable:true,
configurable:true});
%object_define_property(S,'month',{value:'numeric',
writable:true,
enumerable:true,
configurable:true});
%object_define_property(S,'day',{value:'numeric',
writable:true,
enumerable:true,
configurable:true});
}
if(bP&&(bO==='time'||bO==='all')){
%object_define_property(S,'hour',{value:'numeric',
writable:true,
enumerable:true,
configurable:true});
%object_define_property(S,'minute',{value:'numeric',
writable:true,
enumerable:true,
configurable:true});
%object_define_property(S,'second',{value:'numeric',
writable:true,
enumerable:true,
configurable:true});
}
return S;
}
function initializeDateTimeFormat(bQ,R,S){
if(%IsInitializedIntlObject(bQ)){
throw %make_type_error(126,"DateTimeFormat");
}
if((S===(void 0))){
S={};
}
var Y=resolveLocale('dateformat',R,S);
S=toDateTimeOptions(S,'any','date');
var ab=getGetOption(S,'dateformat');
var T=ab('formatMatcher','string',
['basic','best fit'],'best fit');
var bJ=toLDMLString(S);
var bR=canonicalizeTimeZoneID(S.timeZone);
var bh={};
var ak=parseExtension(Y.extension);
var bS={
'ca':{'property':(void 0),'type':'string'},
'nu':{'property':(void 0),'type':'string'}
};
var ai=setOptions(S,ak,bS,
ab,bh);
var bm=Y.locale+ai;
var ag=%object_define_properties({},{
calendar:{writable:true},
day:{writable:true},
era:{writable:true},
hour12:{writable:true},
hour:{writable:true},
locale:{writable:true},
minute:{writable:true},
month:{writable:true},
numberingSystem:{writable:true},
[n]:{writable:true},
requestedLocale:{value:bm,writable:true},
second:{writable:true},
timeZone:{writable:true},
timeZoneName:{writable:true},
tz:{value:bR,writable:true},
weekday:{writable:true},
year:{writable:true}
});
var bG=%CreateDateTimeFormat(
bm,{skeleton:bJ,timeZone:bR},ag);
if(ag.timeZone==="Etc/Unknown"){
throw %make_range_error(184,bR);
}
%MarkAsInitializedIntlObjectOfType(bQ,'dateformat',bG);
bQ[o]=ag;
return bQ;
}
InstallConstructor(E,'DateTimeFormat',function(){
var R=arguments[0];
var S=arguments[1];
if(!this||this===E){
return new E.DateTimeFormat(R,S);
}
return initializeDateTimeFormat((%_ToObject(this)),R,S);
}
);
InstallFunction(E.DateTimeFormat.prototype,'resolvedOptions',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if(!%IsInitializedIntlObjectOfType(this,'dateformat')){
throw %make_type_error(127,"DateTimeFormat");
}
var bT={
'gregorian':'gregory',
'ethiopic-amete-alem':'ethioaa'
};
var bH=this;
var bU=fromLDMLString(bH[o][n]);
var bV=bT[bH[o].calendar];
if((bV===(void 0))){
bV=bH[o].calendar;
}
var Y=getOptimalLanguageTag(bH[o].requestedLocale,
bH[o].locale);
var aD={
locale:Y,
numberingSystem:bH[o].numberingSystem,
calendar:bV,
timeZone:bH[o].timeZone
};
addWECPropertyIfDefined(aD,'timeZoneName',bU.timeZoneName);
addWECPropertyIfDefined(aD,'era',bU.era);
addWECPropertyIfDefined(aD,'year',bU.year);
addWECPropertyIfDefined(aD,'month',bU.month);
addWECPropertyIfDefined(aD,'day',bU.day);
addWECPropertyIfDefined(aD,'weekday',bU.weekday);
addWECPropertyIfDefined(aD,'hour12',bU.hour12);
addWECPropertyIfDefined(aD,'hour',bU.hour);
addWECPropertyIfDefined(aD,'minute',bU.minute);
addWECPropertyIfDefined(aD,'second',bU.second);
return aD;
}
);
InstallFunction(E.DateTimeFormat,'supportedLocalesOf',function(R){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
return supportedLocalesOf('dateformat',R,arguments[1]);
}
);
function formatDate(bG,bW){
var bX;
if((bW===(void 0))){
bX=%DateCurrentTime();
}else{
bX=(%_ToNumber(bW));
}
if(!(%_IsSmi(%IS_VAR(bX))||((bX==bX)&&(bX!=1/0)&&(bX!=-1/0))))throw %make_range_error(150);
return %InternalDateFormat(%GetImplFromInitializedIntlObject(bG),
new e(bX));
}
function FormatDateToParts(bW){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"Intl.DateTimeFormat.prototype.formatToParts");
if(!(typeof(this)==='object')){
throw %make_type_error(16,this);
}
var bX;
if((bW===(void 0))){
bX=%DateCurrentTime();
}else{
bX=(%_ToNumber(bW));
}
if(!(%_IsSmi(%IS_VAR(bX))||((bX==bX)&&(bX!=1/0)&&(bX!=-1/0))))throw %make_range_error(150);
return %InternalDateFormatToParts(
%GetImplFromInitializedIntlObject(this),new e(bX));
}
%FunctionSetLength(FormatDateToParts,0);
AddBoundMethod(E.DateTimeFormat,'format',formatDate,0,'dateformat');
function canonicalizeTimeZoneID(bY){
if((bY===(void 0))){
return bY;
}
bY=(%_ToString(bY));
var bZ=%StringToUpperCase(bY);
if(bZ==='UTC'||bZ==='GMT'||
bZ==='ETC/UTC'||bZ==='ETC/GMT'){
return'UTC';
}
var aC=%regexp_internal_match(GetTimezoneNameCheckRE(),bY);
if((aC===null))throw %make_range_error(151,bY);
var aD=toTitleCaseTimezoneLocation(aC[1])+'/'+
toTitleCaseTimezoneLocation(aC[2]);
if(!(aC[3]===(void 0))&&3<aC.length){
var ca=%StringSplit(aC[3],'/',4294967295);
for(var X=1;X<ca.length;X++){
aD=aD+'/'+toTitleCaseTimezoneLocation(ca[X]);
}
}
return aD;
}
function initializeBreakIterator(cb,R,S){
if(%IsInitializedIntlObject(cb)){
throw %make_type_error(126,"v8BreakIterator");
}
if((S===(void 0))){
S={};
}
var ab=getGetOption(S,'breakiterator');
var bh={};
defineWEProperty(bh,'type',ab(
'type','string',['character','word','sentence','line'],'word'));
var Y=resolveLocale('breakiterator',R,S);
var ag=%object_define_properties({},{
requestedLocale:{value:Y.locale,writable:true},
type:{value:bh.type,writable:true},
locale:{writable:true}
});
var cc=%CreateBreakIterator(Y.locale,
bh,
ag);
%MarkAsInitializedIntlObjectOfType(cb,'breakiterator',
cc);
cb[o]=ag;
return cb;
}
InstallConstructor(E,'v8BreakIterator',function(){
var R=arguments[0];
var S=arguments[1];
if(!this||this===E){
return new E.v8BreakIterator(R,S);
}
return initializeBreakIterator((%_ToObject(this)),R,S);
}
);
InstallFunction(E.v8BreakIterator.prototype,'resolvedOptions',
function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if(!%IsInitializedIntlObjectOfType(this,'breakiterator')){
throw %make_type_error(127,"v8BreakIterator");
}
var cd=this;
var Y=
getOptimalLanguageTag(cd[o].requestedLocale,
cd[o].locale);
return{
locale:Y,
type:cd[o].type
};
}
);
InstallFunction(E.v8BreakIterator,'supportedLocalesOf',
function(R){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
return supportedLocalesOf('breakiterator',R,arguments[1]);
}
);
function adoptText(cb,ce){
%BreakIteratorAdoptText(%GetImplFromInitializedIntlObject(cb),
(%_ToString(ce)));
}
function first(cb){
return %BreakIteratorFirst(%GetImplFromInitializedIntlObject(cb));
}
function next(cb){
return %BreakIteratorNext(%GetImplFromInitializedIntlObject(cb));
}
function current(cb){
return %BreakIteratorCurrent(%GetImplFromInitializedIntlObject(cb));
}
function breakType(cb){
return %BreakIteratorBreakType(%GetImplFromInitializedIntlObject(cb));
}
AddBoundMethod(E.v8BreakIterator,'adoptText',adoptText,1,
'breakiterator');
AddBoundMethod(E.v8BreakIterator,'first',first,0,'breakiterator');
AddBoundMethod(E.v8BreakIterator,'next',next,0,'breakiterator');
AddBoundMethod(E.v8BreakIterator,'current',current,0,'breakiterator');
AddBoundMethod(E.v8BreakIterator,'breakType',breakType,0,
'breakiterator');
var cf={
'collator':E.Collator,
'numberformat':E.NumberFormat,
'dateformatall':E.DateTimeFormat,
'dateformatdate':E.DateTimeFormat,
'dateformattime':E.DateTimeFormat
};
var cg={
'collator':(void 0),
'numberformat':(void 0),
'dateformatall':(void 0),
'dateformatdate':(void 0),
'dateformattime':(void 0),
};
function clearDefaultObjects(){
cg['dateformatall']=(void 0);
cg['dateformatdate']=(void 0);
cg['dateformattime']=(void 0);
}
var ch=0;
function checkDateCacheCurrent(){
var ci=%DateCacheVersion();
if(ci==ch){
return;
}
ch=ci;
clearDefaultObjects();
}
function cachedOrNewService(Q,R,S,bO){
var cj=((bO===(void 0)))?S:bO;
if((R===(void 0))&&(S===(void 0))){
checkDateCacheCurrent();
if((cg[Q]===(void 0))){
cg[Q]=new cf[Q](R,cj);
}
return cg[Q];
}
return new cf[Q](R,cj);
}
function LocaleConvertCase(ck,R,cl){
var bc;
if((R===(void 0))){
bc=GetDefaultICULocaleJS();
}else if((typeof(R)==='string')){
bc=canonicalizeLanguageTag(R);
}else{
var R=initializeLocaleList(R);
bc=R.length>0?R[0]:GetDefaultICULocaleJS();
}
var Z=%StringIndexOf(bc,'-',0);
if(Z!=-1){
bc=%_Call(r,bc,0,Z);
}
var cm=['az','el','lt','tr'];
var cn=%ArrayIndexOf(cm,bc,0);
if(cn==-1){
return cl?%StringToUpperCaseI18N(ck):%StringToLowerCaseI18N(ck);
}
return %StringLocaleConvertCase(ck,cl,
cm[cn]);
}
m(h.prototype,'localeCompare',function(co){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if((this==null)){
throw %make_type_error(55);
}
var R=arguments[1];
var S=arguments[2];
var bg=cachedOrNewService('collator',R,S);
return compare(bg,this,co);
}
);
m(h.prototype,'normalize',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.normalize");
var ck=(%_ToString(this));
var cp=arguments[0];
var cq=(cp===(void 0))?'NFC':(%_ToString(cp));
var cr=['NFC','NFD','NFKC','NFKD'];
var cs=%ArrayIndexOf(cr,cq,0);
if(cs===-1){
throw %make_range_error(176,
%_Call(c,cr,', '));
}
return %StringNormalize(ck,cs);
}
);
function ToLowerCaseI18N(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toLowerCase");
var ck=(%_ToString(this));
return %StringToLowerCaseI18N(ck);
}
function ToUpperCaseI18N(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toUpperCase");
var ck=(%_ToString(this));
return %StringToUpperCaseI18N(ck);
}
function ToLocaleLowerCaseI18N(R){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toLocaleLowerCase");
return LocaleConvertCase((%_ToString(this)),R,false);
}
%FunctionSetLength(ToLocaleLowerCaseI18N,0);
function ToLocaleUpperCaseI18N(R){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.toLocaleUpperCase");
return LocaleConvertCase((%_ToString(this)),R,true);
}
%FunctionSetLength(ToLocaleUpperCaseI18N,0);
%FunctionRemovePrototype(ToLowerCaseI18N);
%FunctionRemovePrototype(ToUpperCaseI18N);
%FunctionRemovePrototype(ToLocaleLowerCaseI18N);
%FunctionRemovePrototype(ToLocaleUpperCaseI18N);
b.Export(function(ct){
ct.ToLowerCaseI18N=ToLowerCaseI18N;
ct.ToUpperCaseI18N=ToUpperCaseI18N;
ct.ToLocaleLowerCaseI18N=ToLocaleLowerCaseI18N;
ct.ToLocaleUpperCaseI18N=ToLocaleUpperCaseI18N;
});
m(f.prototype,'toLocaleString',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
if(!(this instanceof f)&&typeof(this)!=='number'){
throw %make_type_error(56,"Number");
}
var R=arguments[0];
var S=arguments[1];
var bw=cachedOrNewService('numberformat',R,S);
return formatNumber(bw,this);
}
);
function toLocaleDateTime(cu,R,S,bN,bO,Q){
if(!(cu instanceof e)){
throw %make_type_error(56,"Date");
}
var bW=(%_ToNumber(cu));
if((!%_IsSmi(%IS_VAR(bW))&&!(bW==bW)))return'Invalid Date';
var bh=toDateTimeOptions(S,bN,bO);
var bQ=
cachedOrNewService(Q,R,S,bh);
return formatDate(bQ,cu);
}
m(e.prototype,'toLocaleString',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
var R=arguments[0];
var S=arguments[1];
return toLocaleDateTime(
this,R,S,'any','all','dateformatall');
}
);
m(e.prototype,'toLocaleDateString',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
var R=arguments[0];
var S=arguments[1];
return toLocaleDateTime(
this,R,S,'date','date','dateformatdate');
}
);
m(e.prototype,'toLocaleTimeString',function(){
if(!(new.target===(void 0))){
throw %make_type_error(82);
}
var R=arguments[0];
var S=arguments[1];
return toLocaleDateTime(
this,R,S,'time','time','dateformattime');
}
);
%FunctionRemovePrototype(FormatDateToParts);
b.Export(function(ct){
ct.FormatDateToParts=FormatDateToParts;
});
})

 <harmony-atomicsÖ(
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.Object;
var d;
var e=b.ImportNow("to_string_tag_symbol");
b.Import(function(f){
d=f.MaxSimple;
});
function CheckSharedIntegerTypedArray(g){
if(!%IsSharedIntegerTypedArray(g)){
throw %make_type_error(75,g);
}
}
function CheckSharedInteger32TypedArray(g){
CheckSharedIntegerTypedArray(g);
if(!%IsSharedInteger32TypedArray(g)){
throw %make_type_error(76,g);
}
}
function ValidateIndex(h,i){
var j=(%_ToNumber(h));
var k=(%_ToInteger(j));
if(j!==k){
throw %make_range_error(156);
}
if(k<0||k>=i){
throw %make_range_error(156);
}
return k;
}
function AtomicsCompareExchangeJS(l,h,m,n){
CheckSharedIntegerTypedArray(l);
h=ValidateIndex(h,%_TypedArrayGetLength(l));
m=(%_ToNumber(m));
n=(%_ToNumber(n));
return %_AtomicsCompareExchange(l,h,m,n);
}
function AtomicsAddJS(g,h,o){
CheckSharedIntegerTypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
o=(%_ToNumber(o));
return %_AtomicsAdd(g,h,o);
}
function AtomicsSubJS(g,h,o){
CheckSharedIntegerTypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
o=(%_ToNumber(o));
return %_AtomicsSub(g,h,o);
}
function AtomicsAndJS(g,h,o){
CheckSharedIntegerTypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
o=(%_ToNumber(o));
return %_AtomicsAnd(g,h,o);
}
function AtomicsOrJS(g,h,o){
CheckSharedIntegerTypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
o=(%_ToNumber(o));
return %_AtomicsOr(g,h,o);
}
function AtomicsXorJS(g,h,o){
CheckSharedIntegerTypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
o=(%_ToNumber(o));
return %_AtomicsXor(g,h,o);
}
function AtomicsExchangeJS(g,h,o){
CheckSharedIntegerTypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
o=(%_ToNumber(o));
return %_AtomicsExchange(g,h,o);
}
function AtomicsIsLockFreeJS(p){
return %_AtomicsIsLockFree(p);
}
function AtomicsWaitJS(g,h,o,q){
CheckSharedInteger32TypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
if((q===(void 0))){
q=(1/0);
}else{
q=(%_ToNumber(q));
if((!%_IsSmi(%IS_VAR(q))&&!(q==q))){
q=(1/0);
}else{
q=d(0,q);
}
}
return %AtomicsWait(g,h,o,q);
}
function AtomicsWakeJS(g,h,r){
CheckSharedInteger32TypedArray(g);
h=ValidateIndex(h,%_TypedArrayGetLength(g));
r=d(0,(%_ToInteger(r)));
return %AtomicsWake(g,h,r);
}
var s=a.Atomics;
%AddNamedProperty(s,e,"Atomics",1|2);
b.InstallFunctions(s,2,[
"compareExchange",AtomicsCompareExchangeJS,
"add",AtomicsAddJS,
"sub",AtomicsSubJS,
"and",AtomicsAndJS,
"or",AtomicsOrJS,
"xor",AtomicsXorJS,
"exchange",AtomicsExchangeJS,
"isLockFree",AtomicsIsLockFreeJS,
"wait",AtomicsWaitJS,
"wake",AtomicsWakeJS,
]);
})

0harmony-simdé¥
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.SIMD;
var d=b.ImportNow("to_string_tag_symbol");
var e=c.Float32x4;


var f=c.Int32x4;

var g=c.Int16x8;

var h=c.Int8x16;


var i=c.Uint32x4;

var j=c.Uint16x8;

var k=c.Uint8x16;


var l=c.Bool32x4;

var m=c.Bool16x8;

var n=c.Bool8x16;



function Float32x4CheckJS(o){
return %Float32x4Check(o);
}
function Float32x4ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='float32x4'){
throw %make_type_error(45,
"Float32x4.prototype.toString",this);
}
var q="SIMD.Float32x4(";
q+=%Float32x4ExtractLane(p,0);
for(var r=1;r<4;r++){
q+=", "+%Float32x4ExtractLane(p,r);
}
return q+")";
}
function Float32x4ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='float32x4'){
throw %make_type_error(45,
"Float32x4.prototype.toLocaleString",this);
}
var q="SIMD.Float32x4(";
q+=%Float32x4ExtractLane(p,0).toLocaleString();
for(var r=1;r<4;r++){
q+=", "+%Float32x4ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Float32x4ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='float32x4'){
throw %make_type_error(45,
"Float32x4.prototype.valueOf",this);
}
return p;
}
function Float32x4ExtractLaneJS(s,t){
return %Float32x4ExtractLane(s,t);
}


function Int32x4CheckJS(o){
return %Int32x4Check(o);
}
function Int32x4ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='int32x4'){
throw %make_type_error(45,
"Int32x4.prototype.toString",this);
}
var q="SIMD.Int32x4(";
q+=%Int32x4ExtractLane(p,0);
for(var r=1;r<4;r++){
q+=", "+%Int32x4ExtractLane(p,r);
}
return q+")";
}
function Int32x4ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='int32x4'){
throw %make_type_error(45,
"Int32x4.prototype.toLocaleString",this);
}
var q="SIMD.Int32x4(";
q+=%Int32x4ExtractLane(p,0).toLocaleString();
for(var r=1;r<4;r++){
q+=", "+%Int32x4ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Int32x4ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='int32x4'){
throw %make_type_error(45,
"Int32x4.prototype.valueOf",this);
}
return p;
}
function Int32x4ExtractLaneJS(s,t){
return %Int32x4ExtractLane(s,t);
}

function Int16x8CheckJS(o){
return %Int16x8Check(o);
}
function Int16x8ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='int16x8'){
throw %make_type_error(45,
"Int16x8.prototype.toString",this);
}
var q="SIMD.Int16x8(";
q+=%Int16x8ExtractLane(p,0);
for(var r=1;r<8;r++){
q+=", "+%Int16x8ExtractLane(p,r);
}
return q+")";
}
function Int16x8ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='int16x8'){
throw %make_type_error(45,
"Int16x8.prototype.toLocaleString",this);
}
var q="SIMD.Int16x8(";
q+=%Int16x8ExtractLane(p,0).toLocaleString();
for(var r=1;r<8;r++){
q+=", "+%Int16x8ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Int16x8ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='int16x8'){
throw %make_type_error(45,
"Int16x8.prototype.valueOf",this);
}
return p;
}
function Int16x8ExtractLaneJS(s,t){
return %Int16x8ExtractLane(s,t);
}

function Int8x16CheckJS(o){
return %Int8x16Check(o);
}
function Int8x16ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='int8x16'){
throw %make_type_error(45,
"Int8x16.prototype.toString",this);
}
var q="SIMD.Int8x16(";
q+=%Int8x16ExtractLane(p,0);
for(var r=1;r<16;r++){
q+=", "+%Int8x16ExtractLane(p,r);
}
return q+")";
}
function Int8x16ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='int8x16'){
throw %make_type_error(45,
"Int8x16.prototype.toLocaleString",this);
}
var q="SIMD.Int8x16(";
q+=%Int8x16ExtractLane(p,0).toLocaleString();
for(var r=1;r<16;r++){
q+=", "+%Int8x16ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Int8x16ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='int8x16'){
throw %make_type_error(45,
"Int8x16.prototype.valueOf",this);
}
return p;
}
function Int8x16ExtractLaneJS(s,t){
return %Int8x16ExtractLane(s,t);
}


function Uint32x4CheckJS(o){
return %Uint32x4Check(o);
}
function Uint32x4ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='uint32x4'){
throw %make_type_error(45,
"Uint32x4.prototype.toString",this);
}
var q="SIMD.Uint32x4(";
q+=%Uint32x4ExtractLane(p,0);
for(var r=1;r<4;r++){
q+=", "+%Uint32x4ExtractLane(p,r);
}
return q+")";
}
function Uint32x4ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='uint32x4'){
throw %make_type_error(45,
"Uint32x4.prototype.toLocaleString",this);
}
var q="SIMD.Uint32x4(";
q+=%Uint32x4ExtractLane(p,0).toLocaleString();
for(var r=1;r<4;r++){
q+=", "+%Uint32x4ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Uint32x4ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='uint32x4'){
throw %make_type_error(45,
"Uint32x4.prototype.valueOf",this);
}
return p;
}
function Uint32x4ExtractLaneJS(s,t){
return %Uint32x4ExtractLane(s,t);
}

function Uint16x8CheckJS(o){
return %Uint16x8Check(o);
}
function Uint16x8ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='uint16x8'){
throw %make_type_error(45,
"Uint16x8.prototype.toString",this);
}
var q="SIMD.Uint16x8(";
q+=%Uint16x8ExtractLane(p,0);
for(var r=1;r<8;r++){
q+=", "+%Uint16x8ExtractLane(p,r);
}
return q+")";
}
function Uint16x8ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='uint16x8'){
throw %make_type_error(45,
"Uint16x8.prototype.toLocaleString",this);
}
var q="SIMD.Uint16x8(";
q+=%Uint16x8ExtractLane(p,0).toLocaleString();
for(var r=1;r<8;r++){
q+=", "+%Uint16x8ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Uint16x8ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='uint16x8'){
throw %make_type_error(45,
"Uint16x8.prototype.valueOf",this);
}
return p;
}
function Uint16x8ExtractLaneJS(s,t){
return %Uint16x8ExtractLane(s,t);
}

function Uint8x16CheckJS(o){
return %Uint8x16Check(o);
}
function Uint8x16ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='uint8x16'){
throw %make_type_error(45,
"Uint8x16.prototype.toString",this);
}
var q="SIMD.Uint8x16(";
q+=%Uint8x16ExtractLane(p,0);
for(var r=1;r<16;r++){
q+=", "+%Uint8x16ExtractLane(p,r);
}
return q+")";
}
function Uint8x16ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='uint8x16'){
throw %make_type_error(45,
"Uint8x16.prototype.toLocaleString",this);
}
var q="SIMD.Uint8x16(";
q+=%Uint8x16ExtractLane(p,0).toLocaleString();
for(var r=1;r<16;r++){
q+=", "+%Uint8x16ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Uint8x16ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='uint8x16'){
throw %make_type_error(45,
"Uint8x16.prototype.valueOf",this);
}
return p;
}
function Uint8x16ExtractLaneJS(s,t){
return %Uint8x16ExtractLane(s,t);
}


function Bool32x4CheckJS(o){
return %Bool32x4Check(o);
}
function Bool32x4ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='bool32x4'){
throw %make_type_error(45,
"Bool32x4.prototype.toString",this);
}
var q="SIMD.Bool32x4(";
q+=%Bool32x4ExtractLane(p,0);
for(var r=1;r<4;r++){
q+=", "+%Bool32x4ExtractLane(p,r);
}
return q+")";
}
function Bool32x4ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='bool32x4'){
throw %make_type_error(45,
"Bool32x4.prototype.toLocaleString",this);
}
var q="SIMD.Bool32x4(";
q+=%Bool32x4ExtractLane(p,0).toLocaleString();
for(var r=1;r<4;r++){
q+=", "+%Bool32x4ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Bool32x4ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='bool32x4'){
throw %make_type_error(45,
"Bool32x4.prototype.valueOf",this);
}
return p;
}
function Bool32x4ExtractLaneJS(s,t){
return %Bool32x4ExtractLane(s,t);
}

function Bool16x8CheckJS(o){
return %Bool16x8Check(o);
}
function Bool16x8ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='bool16x8'){
throw %make_type_error(45,
"Bool16x8.prototype.toString",this);
}
var q="SIMD.Bool16x8(";
q+=%Bool16x8ExtractLane(p,0);
for(var r=1;r<8;r++){
q+=", "+%Bool16x8ExtractLane(p,r);
}
return q+")";
}
function Bool16x8ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='bool16x8'){
throw %make_type_error(45,
"Bool16x8.prototype.toLocaleString",this);
}
var q="SIMD.Bool16x8(";
q+=%Bool16x8ExtractLane(p,0).toLocaleString();
for(var r=1;r<8;r++){
q+=", "+%Bool16x8ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Bool16x8ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='bool16x8'){
throw %make_type_error(45,
"Bool16x8.prototype.valueOf",this);
}
return p;
}
function Bool16x8ExtractLaneJS(s,t){
return %Bool16x8ExtractLane(s,t);
}

function Bool8x16CheckJS(o){
return %Bool8x16Check(o);
}
function Bool8x16ToString(){
var p=%ValueOf(this);
if(typeof(p)!=='bool8x16'){
throw %make_type_error(45,
"Bool8x16.prototype.toString",this);
}
var q="SIMD.Bool8x16(";
q+=%Bool8x16ExtractLane(p,0);
for(var r=1;r<16;r++){
q+=", "+%Bool8x16ExtractLane(p,r);
}
return q+")";
}
function Bool8x16ToLocaleString(){
var p=%ValueOf(this);
if(typeof(p)!=='bool8x16'){
throw %make_type_error(45,
"Bool8x16.prototype.toLocaleString",this);
}
var q="SIMD.Bool8x16(";
q+=%Bool8x16ExtractLane(p,0).toLocaleString();
for(var r=1;r<16;r++){
q+=", "+%Bool8x16ExtractLane(p,r).toLocaleString();
}
return q+")";
}
function Bool8x16ValueOf(){
var p=%ValueOf(this);
if(typeof(p)!=='bool8x16'){
throw %make_type_error(45,
"Bool8x16.prototype.valueOf",this);
}
return p;
}
function Bool8x16ExtractLaneJS(s,t){
return %Bool8x16ExtractLane(s,t);
}



function Int32x4ShiftLeftByScalarJS(s,u){
return %Int32x4ShiftLeftByScalar(s,u);
}
function Int32x4ShiftRightByScalarJS(s,u){
return %Int32x4ShiftRightByScalar(s,u);
}

function Int16x8ShiftLeftByScalarJS(s,u){
return %Int16x8ShiftLeftByScalar(s,u);
}
function Int16x8ShiftRightByScalarJS(s,u){
return %Int16x8ShiftRightByScalar(s,u);
}

function Int8x16ShiftLeftByScalarJS(s,u){
return %Int8x16ShiftLeftByScalar(s,u);
}
function Int8x16ShiftRightByScalarJS(s,u){
return %Int8x16ShiftRightByScalar(s,u);
}


function Uint32x4ShiftLeftByScalarJS(s,u){
return %Uint32x4ShiftLeftByScalar(s,u);
}
function Uint32x4ShiftRightByScalarJS(s,u){
return %Uint32x4ShiftRightByScalar(s,u);
}

function Uint16x8ShiftLeftByScalarJS(s,u){
return %Uint16x8ShiftLeftByScalar(s,u);
}
function Uint16x8ShiftRightByScalarJS(s,u){
return %Uint16x8ShiftRightByScalar(s,u);
}

function Uint8x16ShiftLeftByScalarJS(s,u){
return %Uint8x16ShiftLeftByScalar(s,u);
}
function Uint8x16ShiftRightByScalarJS(s,u){
return %Uint8x16ShiftRightByScalar(s,u);
}


function Int16x8AddSaturateJS(o,v){
return %Int16x8AddSaturate(o,v);
}
function Int16x8SubSaturateJS(o,v){
return %Int16x8SubSaturate(o,v);
}

function Int8x16AddSaturateJS(o,v){
return %Int8x16AddSaturate(o,v);
}
function Int8x16SubSaturateJS(o,v){
return %Int8x16SubSaturate(o,v);
}

function Uint8x16AddSaturateJS(o,v){
return %Uint8x16AddSaturate(o,v);
}
function Uint8x16SubSaturateJS(o,v){
return %Uint8x16SubSaturate(o,v);
}

function Uint16x8AddSaturateJS(o,v){
return %Uint16x8AddSaturate(o,v);
}
function Uint16x8SubSaturateJS(o,v){
return %Uint16x8SubSaturate(o,v);
}


function Float32x4NegJS(o){
return %Float32x4Neg(o);
}


function Int32x4NegJS(o){
return %Int32x4Neg(o);
}

function Int16x8NegJS(o){
return %Int16x8Neg(o);
}

function Int8x16NegJS(o){
return %Int8x16Neg(o);
}


function Bool32x4ReplaceLaneJS(s,t,p){
return %Bool32x4ReplaceLane(s,t,p);
}
function Bool32x4AnyTrueJS(w){
return %Bool32x4AnyTrue(w);
}
function Bool32x4AllTrueJS(w){
return %Bool32x4AllTrue(w);
}

function Bool16x8ReplaceLaneJS(s,t,p){
return %Bool16x8ReplaceLane(s,t,p);
}
function Bool16x8AnyTrueJS(w){
return %Bool16x8AnyTrue(w);
}
function Bool16x8AllTrueJS(w){
return %Bool16x8AllTrue(w);
}

function Bool8x16ReplaceLaneJS(s,t,p){
return %Bool8x16ReplaceLane(s,t,p);
}
function Bool8x16AnyTrueJS(w){
return %Bool8x16AnyTrue(w);
}
function Bool8x16AllTrueJS(w){
return %Bool8x16AllTrue(w);
}


function Float32x4ReplaceLaneJS(s,t,p){
return %Float32x4ReplaceLane(s,t,(%_ToNumber(p)));
}
function Float32x4SelectJS(x,o,v){
return %Float32x4Select(x,o,v);
}
function Float32x4AddJS(o,v){
return %Float32x4Add(o,v);
}
function Float32x4SubJS(o,v){
return %Float32x4Sub(o,v);
}
function Float32x4MulJS(o,v){
return %Float32x4Mul(o,v);
}
function Float32x4MinJS(o,v){
return %Float32x4Min(o,v);
}
function Float32x4MaxJS(o,v){
return %Float32x4Max(o,v);
}
function Float32x4EqualJS(o,v){
return %Float32x4Equal(o,v);
}
function Float32x4NotEqualJS(o,v){
return %Float32x4NotEqual(o,v);
}
function Float32x4LessThanJS(o,v){
return %Float32x4LessThan(o,v);
}
function Float32x4LessThanOrEqualJS(o,v){
return %Float32x4LessThanOrEqual(o,v);
}
function Float32x4GreaterThanJS(o,v){
return %Float32x4GreaterThan(o,v);
}
function Float32x4GreaterThanOrEqualJS(o,v){
return %Float32x4GreaterThanOrEqual(o,v);
}
function Float32x4LoadJS(y,z){
return %Float32x4Load(y,z);
}
function Float32x4StoreJS(y,z,o){
return %Float32x4Store(y,z,o);
}


function Int32x4ReplaceLaneJS(s,t,p){
return %Int32x4ReplaceLane(s,t,(%_ToNumber(p)));
}
function Int32x4SelectJS(x,o,v){
return %Int32x4Select(x,o,v);
}
function Int32x4AddJS(o,v){
return %Int32x4Add(o,v);
}
function Int32x4SubJS(o,v){
return %Int32x4Sub(o,v);
}
function Int32x4MulJS(o,v){
return %Int32x4Mul(o,v);
}
function Int32x4MinJS(o,v){
return %Int32x4Min(o,v);
}
function Int32x4MaxJS(o,v){
return %Int32x4Max(o,v);
}
function Int32x4EqualJS(o,v){
return %Int32x4Equal(o,v);
}
function Int32x4NotEqualJS(o,v){
return %Int32x4NotEqual(o,v);
}
function Int32x4LessThanJS(o,v){
return %Int32x4LessThan(o,v);
}
function Int32x4LessThanOrEqualJS(o,v){
return %Int32x4LessThanOrEqual(o,v);
}
function Int32x4GreaterThanJS(o,v){
return %Int32x4GreaterThan(o,v);
}
function Int32x4GreaterThanOrEqualJS(o,v){
return %Int32x4GreaterThanOrEqual(o,v);
}
function Int32x4LoadJS(y,z){
return %Int32x4Load(y,z);
}
function Int32x4StoreJS(y,z,o){
return %Int32x4Store(y,z,o);
}

function Int16x8ReplaceLaneJS(s,t,p){
return %Int16x8ReplaceLane(s,t,(%_ToNumber(p)));
}
function Int16x8SelectJS(x,o,v){
return %Int16x8Select(x,o,v);
}
function Int16x8AddJS(o,v){
return %Int16x8Add(o,v);
}
function Int16x8SubJS(o,v){
return %Int16x8Sub(o,v);
}
function Int16x8MulJS(o,v){
return %Int16x8Mul(o,v);
}
function Int16x8MinJS(o,v){
return %Int16x8Min(o,v);
}
function Int16x8MaxJS(o,v){
return %Int16x8Max(o,v);
}
function Int16x8EqualJS(o,v){
return %Int16x8Equal(o,v);
}
function Int16x8NotEqualJS(o,v){
return %Int16x8NotEqual(o,v);
}
function Int16x8LessThanJS(o,v){
return %Int16x8LessThan(o,v);
}
function Int16x8LessThanOrEqualJS(o,v){
return %Int16x8LessThanOrEqual(o,v);
}
function Int16x8GreaterThanJS(o,v){
return %Int16x8GreaterThan(o,v);
}
function Int16x8GreaterThanOrEqualJS(o,v){
return %Int16x8GreaterThanOrEqual(o,v);
}
function Int16x8LoadJS(y,z){
return %Int16x8Load(y,z);
}
function Int16x8StoreJS(y,z,o){
return %Int16x8Store(y,z,o);
}

function Int8x16ReplaceLaneJS(s,t,p){
return %Int8x16ReplaceLane(s,t,(%_ToNumber(p)));
}
function Int8x16SelectJS(x,o,v){
return %Int8x16Select(x,o,v);
}
function Int8x16AddJS(o,v){
return %Int8x16Add(o,v);
}
function Int8x16SubJS(o,v){
return %Int8x16Sub(o,v);
}
function Int8x16MulJS(o,v){
return %Int8x16Mul(o,v);
}
function Int8x16MinJS(o,v){
return %Int8x16Min(o,v);
}
function Int8x16MaxJS(o,v){
return %Int8x16Max(o,v);
}
function Int8x16EqualJS(o,v){
return %Int8x16Equal(o,v);
}
function Int8x16NotEqualJS(o,v){
return %Int8x16NotEqual(o,v);
}
function Int8x16LessThanJS(o,v){
return %Int8x16LessThan(o,v);
}
function Int8x16LessThanOrEqualJS(o,v){
return %Int8x16LessThanOrEqual(o,v);
}
function Int8x16GreaterThanJS(o,v){
return %Int8x16GreaterThan(o,v);
}
function Int8x16GreaterThanOrEqualJS(o,v){
return %Int8x16GreaterThanOrEqual(o,v);
}
function Int8x16LoadJS(y,z){
return %Int8x16Load(y,z);
}
function Int8x16StoreJS(y,z,o){
return %Int8x16Store(y,z,o);
}


function Uint32x4ReplaceLaneJS(s,t,p){
return %Uint32x4ReplaceLane(s,t,(%_ToNumber(p)));
}
function Uint32x4SelectJS(x,o,v){
return %Uint32x4Select(x,o,v);
}
function Uint32x4AddJS(o,v){
return %Uint32x4Add(o,v);
}
function Uint32x4SubJS(o,v){
return %Uint32x4Sub(o,v);
}
function Uint32x4MulJS(o,v){
return %Uint32x4Mul(o,v);
}
function Uint32x4MinJS(o,v){
return %Uint32x4Min(o,v);
}
function Uint32x4MaxJS(o,v){
return %Uint32x4Max(o,v);
}
function Uint32x4EqualJS(o,v){
return %Uint32x4Equal(o,v);
}
function Uint32x4NotEqualJS(o,v){
return %Uint32x4NotEqual(o,v);
}
function Uint32x4LessThanJS(o,v){
return %Uint32x4LessThan(o,v);
}
function Uint32x4LessThanOrEqualJS(o,v){
return %Uint32x4LessThanOrEqual(o,v);
}
function Uint32x4GreaterThanJS(o,v){
return %Uint32x4GreaterThan(o,v);
}
function Uint32x4GreaterThanOrEqualJS(o,v){
return %Uint32x4GreaterThanOrEqual(o,v);
}
function Uint32x4LoadJS(y,z){
return %Uint32x4Load(y,z);
}
function Uint32x4StoreJS(y,z,o){
return %Uint32x4Store(y,z,o);
}

function Uint16x8ReplaceLaneJS(s,t,p){
return %Uint16x8ReplaceLane(s,t,(%_ToNumber(p)));
}
function Uint16x8SelectJS(x,o,v){
return %Uint16x8Select(x,o,v);
}
function Uint16x8AddJS(o,v){
return %Uint16x8Add(o,v);
}
function Uint16x8SubJS(o,v){
return %Uint16x8Sub(o,v);
}
function Uint16x8MulJS(o,v){
return %Uint16x8Mul(o,v);
}
function Uint16x8MinJS(o,v){
return %Uint16x8Min(o,v);
}
function Uint16x8MaxJS(o,v){
return %Uint16x8Max(o,v);
}
function Uint16x8EqualJS(o,v){
return %Uint16x8Equal(o,v);
}
function Uint16x8NotEqualJS(o,v){
return %Uint16x8NotEqual(o,v);
}
function Uint16x8LessThanJS(o,v){
return %Uint16x8LessThan(o,v);
}
function Uint16x8LessThanOrEqualJS(o,v){
return %Uint16x8LessThanOrEqual(o,v);
}
function Uint16x8GreaterThanJS(o,v){
return %Uint16x8GreaterThan(o,v);
}
function Uint16x8GreaterThanOrEqualJS(o,v){
return %Uint16x8GreaterThanOrEqual(o,v);
}
function Uint16x8LoadJS(y,z){
return %Uint16x8Load(y,z);
}
function Uint16x8StoreJS(y,z,o){
return %Uint16x8Store(y,z,o);
}

function Uint8x16ReplaceLaneJS(s,t,p){
return %Uint8x16ReplaceLane(s,t,(%_ToNumber(p)));
}
function Uint8x16SelectJS(x,o,v){
return %Uint8x16Select(x,o,v);
}
function Uint8x16AddJS(o,v){
return %Uint8x16Add(o,v);
}
function Uint8x16SubJS(o,v){
return %Uint8x16Sub(o,v);
}
function Uint8x16MulJS(o,v){
return %Uint8x16Mul(o,v);
}
function Uint8x16MinJS(o,v){
return %Uint8x16Min(o,v);
}
function Uint8x16MaxJS(o,v){
return %Uint8x16Max(o,v);
}
function Uint8x16EqualJS(o,v){
return %Uint8x16Equal(o,v);
}
function Uint8x16NotEqualJS(o,v){
return %Uint8x16NotEqual(o,v);
}
function Uint8x16LessThanJS(o,v){
return %Uint8x16LessThan(o,v);
}
function Uint8x16LessThanOrEqualJS(o,v){
return %Uint8x16LessThanOrEqual(o,v);
}
function Uint8x16GreaterThanJS(o,v){
return %Uint8x16GreaterThan(o,v);
}
function Uint8x16GreaterThanOrEqualJS(o,v){
return %Uint8x16GreaterThanOrEqual(o,v);
}
function Uint8x16LoadJS(y,z){
return %Uint8x16Load(y,z);
}
function Uint8x16StoreJS(y,z,o){
return %Uint8x16Store(y,z,o);
}



function Int32x4AndJS(o,v){
return %Int32x4And(o,v);
}
function Int32x4OrJS(o,v){
return %Int32x4Or(o,v);
}
function Int32x4XorJS(o,v){
return %Int32x4Xor(o,v);
}
function Int32x4NotJS(o){
return %Int32x4Not(o);
}

function Int16x8AndJS(o,v){
return %Int16x8And(o,v);
}
function Int16x8OrJS(o,v){
return %Int16x8Or(o,v);
}
function Int16x8XorJS(o,v){
return %Int16x8Xor(o,v);
}
function Int16x8NotJS(o){
return %Int16x8Not(o);
}

function Int8x16AndJS(o,v){
return %Int8x16And(o,v);
}
function Int8x16OrJS(o,v){
return %Int8x16Or(o,v);
}
function Int8x16XorJS(o,v){
return %Int8x16Xor(o,v);
}
function Int8x16NotJS(o){
return %Int8x16Not(o);
}


function Uint32x4AndJS(o,v){
return %Uint32x4And(o,v);
}
function Uint32x4OrJS(o,v){
return %Uint32x4Or(o,v);
}
function Uint32x4XorJS(o,v){
return %Uint32x4Xor(o,v);
}
function Uint32x4NotJS(o){
return %Uint32x4Not(o);
}

function Uint16x8AndJS(o,v){
return %Uint16x8And(o,v);
}
function Uint16x8OrJS(o,v){
return %Uint16x8Or(o,v);
}
function Uint16x8XorJS(o,v){
return %Uint16x8Xor(o,v);
}
function Uint16x8NotJS(o){
return %Uint16x8Not(o);
}

function Uint8x16AndJS(o,v){
return %Uint8x16And(o,v);
}
function Uint8x16OrJS(o,v){
return %Uint8x16Or(o,v);
}
function Uint8x16XorJS(o,v){
return %Uint8x16Xor(o,v);
}
function Uint8x16NotJS(o){
return %Uint8x16Not(o);
}


function Bool32x4AndJS(o,v){
return %Bool32x4And(o,v);
}
function Bool32x4OrJS(o,v){
return %Bool32x4Or(o,v);
}
function Bool32x4XorJS(o,v){
return %Bool32x4Xor(o,v);
}
function Bool32x4NotJS(o){
return %Bool32x4Not(o);
}

function Bool16x8AndJS(o,v){
return %Bool16x8And(o,v);
}
function Bool16x8OrJS(o,v){
return %Bool16x8Or(o,v);
}
function Bool16x8XorJS(o,v){
return %Bool16x8Xor(o,v);
}
function Bool16x8NotJS(o){
return %Bool16x8Not(o);
}

function Bool8x16AndJS(o,v){
return %Bool8x16And(o,v);
}
function Bool8x16OrJS(o,v){
return %Bool8x16Or(o,v);
}
function Bool8x16XorJS(o,v){
return %Bool8x16Xor(o,v);
}
function Bool8x16NotJS(o){
return %Bool8x16Not(o);
}



function Float32x4FromInt32x4JS(o){
return %Float32x4FromInt32x4(o);
}

function Float32x4FromUint32x4JS(o){
return %Float32x4FromUint32x4(o);
}

function Int32x4FromFloat32x4JS(o){
return %Int32x4FromFloat32x4(o);
}

function Int32x4FromUint32x4JS(o){
return %Int32x4FromUint32x4(o);
}

function Uint32x4FromFloat32x4JS(o){
return %Uint32x4FromFloat32x4(o);
}

function Uint32x4FromInt32x4JS(o){
return %Uint32x4FromInt32x4(o);
}

function Int16x8FromUint16x8JS(o){
return %Int16x8FromUint16x8(o);
}

function Uint16x8FromInt16x8JS(o){
return %Uint16x8FromInt16x8(o);
}

function Int8x16FromUint8x16JS(o){
return %Int8x16FromUint8x16(o);
}

function Uint8x16FromInt8x16JS(o){
return %Uint8x16FromInt8x16(o);
}


function Float32x4FromInt32x4BitsJS(o){
return %Float32x4FromInt32x4Bits(o);
}

function Float32x4FromUint32x4BitsJS(o){
return %Float32x4FromUint32x4Bits(o);
}

function Float32x4FromInt16x8BitsJS(o){
return %Float32x4FromInt16x8Bits(o);
}

function Float32x4FromUint16x8BitsJS(o){
return %Float32x4FromUint16x8Bits(o);
}

function Float32x4FromInt8x16BitsJS(o){
return %Float32x4FromInt8x16Bits(o);
}

function Float32x4FromUint8x16BitsJS(o){
return %Float32x4FromUint8x16Bits(o);
}

function Int32x4FromFloat32x4BitsJS(o){
return %Int32x4FromFloat32x4Bits(o);
}

function Int32x4FromUint32x4BitsJS(o){
return %Int32x4FromUint32x4Bits(o);
}

function Int32x4FromInt16x8BitsJS(o){
return %Int32x4FromInt16x8Bits(o);
}

function Int32x4FromUint16x8BitsJS(o){
return %Int32x4FromUint16x8Bits(o);
}

function Int32x4FromInt8x16BitsJS(o){
return %Int32x4FromInt8x16Bits(o);
}

function Int32x4FromUint8x16BitsJS(o){
return %Int32x4FromUint8x16Bits(o);
}

function Uint32x4FromFloat32x4BitsJS(o){
return %Uint32x4FromFloat32x4Bits(o);
}

function Uint32x4FromInt32x4BitsJS(o){
return %Uint32x4FromInt32x4Bits(o);
}

function Uint32x4FromInt16x8BitsJS(o){
return %Uint32x4FromInt16x8Bits(o);
}

function Uint32x4FromUint16x8BitsJS(o){
return %Uint32x4FromUint16x8Bits(o);
}

function Uint32x4FromInt8x16BitsJS(o){
return %Uint32x4FromInt8x16Bits(o);
}

function Uint32x4FromUint8x16BitsJS(o){
return %Uint32x4FromUint8x16Bits(o);
}

function Int16x8FromFloat32x4BitsJS(o){
return %Int16x8FromFloat32x4Bits(o);
}

function Int16x8FromInt32x4BitsJS(o){
return %Int16x8FromInt32x4Bits(o);
}

function Int16x8FromUint32x4BitsJS(o){
return %Int16x8FromUint32x4Bits(o);
}

function Int16x8FromUint16x8BitsJS(o){
return %Int16x8FromUint16x8Bits(o);
}

function Int16x8FromInt8x16BitsJS(o){
return %Int16x8FromInt8x16Bits(o);
}

function Int16x8FromUint8x16BitsJS(o){
return %Int16x8FromUint8x16Bits(o);
}

function Uint16x8FromFloat32x4BitsJS(o){
return %Uint16x8FromFloat32x4Bits(o);
}

function Uint16x8FromInt32x4BitsJS(o){
return %Uint16x8FromInt32x4Bits(o);
}

function Uint16x8FromUint32x4BitsJS(o){
return %Uint16x8FromUint32x4Bits(o);
}

function Uint16x8FromInt16x8BitsJS(o){
return %Uint16x8FromInt16x8Bits(o);
}

function Uint16x8FromInt8x16BitsJS(o){
return %Uint16x8FromInt8x16Bits(o);
}

function Uint16x8FromUint8x16BitsJS(o){
return %Uint16x8FromUint8x16Bits(o);
}

function Int8x16FromFloat32x4BitsJS(o){
return %Int8x16FromFloat32x4Bits(o);
}

function Int8x16FromInt32x4BitsJS(o){
return %Int8x16FromInt32x4Bits(o);
}

function Int8x16FromUint32x4BitsJS(o){
return %Int8x16FromUint32x4Bits(o);
}

function Int8x16FromInt16x8BitsJS(o){
return %Int8x16FromInt16x8Bits(o);
}

function Int8x16FromUint16x8BitsJS(o){
return %Int8x16FromUint16x8Bits(o);
}

function Int8x16FromUint8x16BitsJS(o){
return %Int8x16FromUint8x16Bits(o);
}

function Uint8x16FromFloat32x4BitsJS(o){
return %Uint8x16FromFloat32x4Bits(o);
}

function Uint8x16FromInt32x4BitsJS(o){
return %Uint8x16FromInt32x4Bits(o);
}

function Uint8x16FromUint32x4BitsJS(o){
return %Uint8x16FromUint32x4Bits(o);
}

function Uint8x16FromInt16x8BitsJS(o){
return %Uint8x16FromInt16x8Bits(o);
}

function Uint8x16FromUint16x8BitsJS(o){
return %Uint8x16FromUint16x8Bits(o);
}

function Uint8x16FromInt8x16BitsJS(o){
return %Uint8x16FromInt8x16Bits(o);
}


function Float32x4Load1JS(y,z){
return %Float32x4Load1(y,z);
}
function Float32x4Store1JS(y,z,o){
return %Float32x4Store1(y,z,o);
}

function Float32x4Load2JS(y,z){
return %Float32x4Load2(y,z);
}
function Float32x4Store2JS(y,z,o){
return %Float32x4Store2(y,z,o);
}

function Float32x4Load3JS(y,z){
return %Float32x4Load3(y,z);
}
function Float32x4Store3JS(y,z,o){
return %Float32x4Store3(y,z,o);
}

function Int32x4Load1JS(y,z){
return %Int32x4Load1(y,z);
}
function Int32x4Store1JS(y,z,o){
return %Int32x4Store1(y,z,o);
}

function Int32x4Load2JS(y,z){
return %Int32x4Load2(y,z);
}
function Int32x4Store2JS(y,z,o){
return %Int32x4Store2(y,z,o);
}

function Int32x4Load3JS(y,z){
return %Int32x4Load3(y,z);
}
function Int32x4Store3JS(y,z,o){
return %Int32x4Store3(y,z,o);
}

function Uint32x4Load1JS(y,z){
return %Uint32x4Load1(y,z);
}
function Uint32x4Store1JS(y,z,o){
return %Uint32x4Store1(y,z,o);
}

function Uint32x4Load2JS(y,z){
return %Uint32x4Load2(y,z);
}
function Uint32x4Store2JS(y,z,o){
return %Uint32x4Store2(y,z,o);
}

function Uint32x4Load3JS(y,z){
return %Uint32x4Load3(y,z);
}
function Uint32x4Store3JS(y,z,o){
return %Uint32x4Store3(y,z,o);
}


function Float32x4Splat(w){
return %CreateFloat32x4(w,w,w,w);
}
function Float32x4SwizzleJS(o,A,B,C,D){
return %Float32x4Swizzle(o,A,B,C,D);
}
function Float32x4ShuffleJS(o,v,A,B,C,D){
return %Float32x4Shuffle(o,v,A,B,C,D);
}

function Int32x4Splat(w){
return %CreateInt32x4(w,w,w,w);
}
function Int32x4SwizzleJS(o,A,B,C,D){
return %Int32x4Swizzle(o,A,B,C,D);
}
function Int32x4ShuffleJS(o,v,A,B,C,D){
return %Int32x4Shuffle(o,v,A,B,C,D);
}

function Uint32x4Splat(w){
return %CreateUint32x4(w,w,w,w);
}
function Uint32x4SwizzleJS(o,A,B,C,D){
return %Uint32x4Swizzle(o,A,B,C,D);
}
function Uint32x4ShuffleJS(o,v,A,B,C,D){
return %Uint32x4Shuffle(o,v,A,B,C,D);
}

function Bool32x4Splat(w){
return %CreateBool32x4(w,w,w,w);
}
function Bool32x4SwizzleJS(o,A,B,C,D){
return %Bool32x4Swizzle(o,A,B,C,D);
}
function Bool32x4ShuffleJS(o,v,A,B,C,D){
return %Bool32x4Shuffle(o,v,A,B,C,D);
}


function Int16x8Splat(w){
return %CreateInt16x8(w,w,w,w,w,w,w,w);
}
function Int16x8SwizzleJS(o,A,B,C,D,E,F,G,H){
return %Int16x8Swizzle(o,A,B,C,D,E,F,G,H);
}
function Int16x8ShuffleJS(o,v,A,B,C,D,E,F,G,H){
return %Int16x8Shuffle(o,v,A,B,C,D,E,F,G,H);
}

function Uint16x8Splat(w){
return %CreateUint16x8(w,w,w,w,w,w,w,w);
}
function Uint16x8SwizzleJS(o,A,B,C,D,E,F,G,H){
return %Uint16x8Swizzle(o,A,B,C,D,E,F,G,H);
}
function Uint16x8ShuffleJS(o,v,A,B,C,D,E,F,G,H){
return %Uint16x8Shuffle(o,v,A,B,C,D,E,F,G,H);
}

function Bool16x8Splat(w){
return %CreateBool16x8(w,w,w,w,w,w,w,w);
}
function Bool16x8SwizzleJS(o,A,B,C,D,E,F,G,H){
return %Bool16x8Swizzle(o,A,B,C,D,E,F,G,H);
}
function Bool16x8ShuffleJS(o,v,A,B,C,D,E,F,G,H){
return %Bool16x8Shuffle(o,v,A,B,C,D,E,F,G,H);
}


function Int8x16Splat(w){
return %CreateInt8x16(w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w);
}
function Int8x16SwizzleJS(o,A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15){
return %Int8x16Swizzle(o,A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15);
}
function Int8x16ShuffleJS(o,v,A,B,C,D,E,F,G,H,c8,c9,c10,
c11,c12,c13,c14,c15){
return %Int8x16Shuffle(o,v,A,B,C,D,E,F,G,H,c8,c9,c10,
c11,c12,c13,c14,c15);
}

function Uint8x16Splat(w){
return %CreateUint8x16(w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w);
}
function Uint8x16SwizzleJS(o,A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15){
return %Uint8x16Swizzle(o,A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15);
}
function Uint8x16ShuffleJS(o,v,A,B,C,D,E,F,G,H,c8,c9,c10,
c11,c12,c13,c14,c15){
return %Uint8x16Shuffle(o,v,A,B,C,D,E,F,G,H,c8,c9,c10,
c11,c12,c13,c14,c15);
}

function Bool8x16Splat(w){
return %CreateBool8x16(w,w,w,w,w,w,w,w,w,w,w,w,w,w,w,w);
}
function Bool8x16SwizzleJS(o,A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15){
return %Bool8x16Swizzle(o,A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15);
}
function Bool8x16ShuffleJS(o,v,A,B,C,D,E,F,G,H,c8,c9,c10,
c11,c12,c13,c14,c15){
return %Bool8x16Shuffle(o,v,A,B,C,D,E,F,G,H,c8,c9,c10,
c11,c12,c13,c14,c15);
}


function Float32x4Constructor(A,B,C,D){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Float32x4");
}
return %CreateFloat32x4((%_ToNumber(A)),(%_ToNumber(B)),
(%_ToNumber(C)),(%_ToNumber(D)));
}
function Int32x4Constructor(A,B,C,D){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Int32x4");
}
return %CreateInt32x4((%_ToNumber(A)),(%_ToNumber(B)),
(%_ToNumber(C)),(%_ToNumber(D)));
}
function Uint32x4Constructor(A,B,C,D){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Uint32x4");
}
return %CreateUint32x4((%_ToNumber(A)),(%_ToNumber(B)),
(%_ToNumber(C)),(%_ToNumber(D)));
}
function Bool32x4Constructor(A,B,C,D){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Bool32x4");
}
return %CreateBool32x4(A,B,C,D);
}
function Int16x8Constructor(A,B,C,D,E,F,G,H){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Int16x8");
}
return %CreateInt16x8((%_ToNumber(A)),(%_ToNumber(B)),
(%_ToNumber(C)),(%_ToNumber(D)),
(%_ToNumber(E)),(%_ToNumber(F)),
(%_ToNumber(G)),(%_ToNumber(H)));
}
function Uint16x8Constructor(A,B,C,D,E,F,G,H){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Uint16x8");
}
return %CreateUint16x8((%_ToNumber(A)),(%_ToNumber(B)),
(%_ToNumber(C)),(%_ToNumber(D)),
(%_ToNumber(E)),(%_ToNumber(F)),
(%_ToNumber(G)),(%_ToNumber(H)));
}
function Bool16x8Constructor(A,B,C,D,E,F,G,H){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Bool16x8");
}
return %CreateBool16x8(A,B,C,D,E,F,G,H);
}
function Int8x16Constructor(A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Int8x16");
}
return %CreateInt8x16((%_ToNumber(A)),(%_ToNumber(B)),
(%_ToNumber(C)),(%_ToNumber(D)),
(%_ToNumber(E)),(%_ToNumber(F)),
(%_ToNumber(G)),(%_ToNumber(H)),
(%_ToNumber(c8)),(%_ToNumber(c9)),
(%_ToNumber(c10)),(%_ToNumber(c11)),
(%_ToNumber(c12)),(%_ToNumber(c13)),
(%_ToNumber(c14)),(%_ToNumber(c15)));
}
function Uint8x16Constructor(A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Uint8x16");
}
return %CreateUint8x16((%_ToNumber(A)),(%_ToNumber(B)),
(%_ToNumber(C)),(%_ToNumber(D)),
(%_ToNumber(E)),(%_ToNumber(F)),
(%_ToNumber(G)),(%_ToNumber(H)),
(%_ToNumber(c8)),(%_ToNumber(c9)),
(%_ToNumber(c10)),(%_ToNumber(c11)),
(%_ToNumber(c12)),(%_ToNumber(c13)),
(%_ToNumber(c14)),(%_ToNumber(c15)));
}
function Bool8x16Constructor(A,B,C,D,E,F,G,H,c8,c9,c10,c11,
c12,c13,c14,c15){
if(!(new.target===(void 0))){
throw %make_type_error(67,"Bool8x16");
}
return %CreateBool8x16(A,B,C,D,E,F,G,H,c8,c9,c10,c11,c12,
c13,c14,c15);
}
function Float32x4AbsJS(o){
return %Float32x4Abs(o);
}
function Float32x4SqrtJS(o){
return %Float32x4Sqrt(o);
}
function Float32x4RecipApproxJS(o){
return %Float32x4RecipApprox(o);
}
function Float32x4RecipSqrtApproxJS(o){
return %Float32x4RecipSqrtApprox(o);
}
function Float32x4DivJS(o,v){
return %Float32x4Div(o,v);
}
function Float32x4MinNumJS(o,v){
return %Float32x4MinNum(o,v);
}
function Float32x4MaxNumJS(o,v){
return %Float32x4MaxNum(o,v);
}
%AddNamedProperty(c,d,'SIMD',1|2);
%SetCode(e,Float32x4Constructor);
%FunctionSetPrototype(e,{});
%AddNamedProperty(e.prototype,'constructor',e,
2);
%AddNamedProperty(e.prototype,d,'Float32x4',
2|1);
b.InstallFunctions(e.prototype,2,[
'toLocaleString',Float32x4ToLocaleString,
'toString',Float32x4ToString,
'valueOf',Float32x4ValueOf,
]);


%SetCode(f,Int32x4Constructor);
%FunctionSetPrototype(f,{});
%AddNamedProperty(f.prototype,'constructor',f,
2);
%AddNamedProperty(f.prototype,d,'Int32x4',
2|1);
b.InstallFunctions(f.prototype,2,[
'toLocaleString',Int32x4ToLocaleString,
'toString',Int32x4ToString,
'valueOf',Int32x4ValueOf,
]);

%SetCode(g,Int16x8Constructor);
%FunctionSetPrototype(g,{});
%AddNamedProperty(g.prototype,'constructor',g,
2);
%AddNamedProperty(g.prototype,d,'Int16x8',
2|1);
b.InstallFunctions(g.prototype,2,[
'toLocaleString',Int16x8ToLocaleString,
'toString',Int16x8ToString,
'valueOf',Int16x8ValueOf,
]);

%SetCode(h,Int8x16Constructor);
%FunctionSetPrototype(h,{});
%AddNamedProperty(h.prototype,'constructor',h,
2);
%AddNamedProperty(h.prototype,d,'Int8x16',
2|1);
b.InstallFunctions(h.prototype,2,[
'toLocaleString',Int8x16ToLocaleString,
'toString',Int8x16ToString,
'valueOf',Int8x16ValueOf,
]);


%SetCode(i,Uint32x4Constructor);
%FunctionSetPrototype(i,{});
%AddNamedProperty(i.prototype,'constructor',i,
2);
%AddNamedProperty(i.prototype,d,'Uint32x4',
2|1);
b.InstallFunctions(i.prototype,2,[
'toLocaleString',Uint32x4ToLocaleString,
'toString',Uint32x4ToString,
'valueOf',Uint32x4ValueOf,
]);

%SetCode(j,Uint16x8Constructor);
%FunctionSetPrototype(j,{});
%AddNamedProperty(j.prototype,'constructor',j,
2);
%AddNamedProperty(j.prototype,d,'Uint16x8',
2|1);
b.InstallFunctions(j.prototype,2,[
'toLocaleString',Uint16x8ToLocaleString,
'toString',Uint16x8ToString,
'valueOf',Uint16x8ValueOf,
]);

%SetCode(k,Uint8x16Constructor);
%FunctionSetPrototype(k,{});
%AddNamedProperty(k.prototype,'constructor',k,
2);
%AddNamedProperty(k.prototype,d,'Uint8x16',
2|1);
b.InstallFunctions(k.prototype,2,[
'toLocaleString',Uint8x16ToLocaleString,
'toString',Uint8x16ToString,
'valueOf',Uint8x16ValueOf,
]);


%SetCode(l,Bool32x4Constructor);
%FunctionSetPrototype(l,{});
%AddNamedProperty(l.prototype,'constructor',l,
2);
%AddNamedProperty(l.prototype,d,'Bool32x4',
2|1);
b.InstallFunctions(l.prototype,2,[
'toLocaleString',Bool32x4ToLocaleString,
'toString',Bool32x4ToString,
'valueOf',Bool32x4ValueOf,
]);

%SetCode(m,Bool16x8Constructor);
%FunctionSetPrototype(m,{});
%AddNamedProperty(m.prototype,'constructor',m,
2);
%AddNamedProperty(m.prototype,d,'Bool16x8',
2|1);
b.InstallFunctions(m.prototype,2,[
'toLocaleString',Bool16x8ToLocaleString,
'toString',Bool16x8ToString,
'valueOf',Bool16x8ValueOf,
]);

%SetCode(n,Bool8x16Constructor);
%FunctionSetPrototype(n,{});
%AddNamedProperty(n.prototype,'constructor',n,
2);
%AddNamedProperty(n.prototype,d,'Bool8x16',
2|1);
b.InstallFunctions(n.prototype,2,[
'toLocaleString',Bool8x16ToLocaleString,
'toString',Bool8x16ToString,
'valueOf',Bool8x16ValueOf,
]);



b.InstallFunctions(e,2,[
'splat',Float32x4Splat,
'check',Float32x4CheckJS,
'extractLane',Float32x4ExtractLaneJS,
'replaceLane',Float32x4ReplaceLaneJS,
'neg',Float32x4NegJS,
'abs',Float32x4AbsJS,
'sqrt',Float32x4SqrtJS,
'reciprocalApproximation',Float32x4RecipApproxJS,
'reciprocalSqrtApproximation',Float32x4RecipSqrtApproxJS,
'add',Float32x4AddJS,
'sub',Float32x4SubJS,
'mul',Float32x4MulJS,
'div',Float32x4DivJS,
'min',Float32x4MinJS,
'max',Float32x4MaxJS,
'minNum',Float32x4MinNumJS,
'maxNum',Float32x4MaxNumJS,
'lessThan',Float32x4LessThanJS,
'lessThanOrEqual',Float32x4LessThanOrEqualJS,
'greaterThan',Float32x4GreaterThanJS,
'greaterThanOrEqual',Float32x4GreaterThanOrEqualJS,
'equal',Float32x4EqualJS,
'notEqual',Float32x4NotEqualJS,
'select',Float32x4SelectJS,
'swizzle',Float32x4SwizzleJS,
'shuffle',Float32x4ShuffleJS,
'fromInt32x4',Float32x4FromInt32x4JS,
'fromUint32x4',Float32x4FromUint32x4JS,
'fromInt32x4Bits',Float32x4FromInt32x4BitsJS,
'fromUint32x4Bits',Float32x4FromUint32x4BitsJS,
'fromInt16x8Bits',Float32x4FromInt16x8BitsJS,
'fromUint16x8Bits',Float32x4FromUint16x8BitsJS,
'fromInt8x16Bits',Float32x4FromInt8x16BitsJS,
'fromUint8x16Bits',Float32x4FromUint8x16BitsJS,
'load',Float32x4LoadJS,
'load1',Float32x4Load1JS,
'load2',Float32x4Load2JS,
'load3',Float32x4Load3JS,
'store',Float32x4StoreJS,
'store1',Float32x4Store1JS,
'store2',Float32x4Store2JS,
'store3',Float32x4Store3JS,
]);
b.InstallFunctions(f,2,[
'splat',Int32x4Splat,
'check',Int32x4CheckJS,
'extractLane',Int32x4ExtractLaneJS,
'replaceLane',Int32x4ReplaceLaneJS,
'neg',Int32x4NegJS,
'add',Int32x4AddJS,
'sub',Int32x4SubJS,
'mul',Int32x4MulJS,
'min',Int32x4MinJS,
'max',Int32x4MaxJS,
'and',Int32x4AndJS,
'or',Int32x4OrJS,
'xor',Int32x4XorJS,
'not',Int32x4NotJS,
'shiftLeftByScalar',Int32x4ShiftLeftByScalarJS,
'shiftRightByScalar',Int32x4ShiftRightByScalarJS,
'lessThan',Int32x4LessThanJS,
'lessThanOrEqual',Int32x4LessThanOrEqualJS,
'greaterThan',Int32x4GreaterThanJS,
'greaterThanOrEqual',Int32x4GreaterThanOrEqualJS,
'equal',Int32x4EqualJS,
'notEqual',Int32x4NotEqualJS,
'select',Int32x4SelectJS,
'swizzle',Int32x4SwizzleJS,
'shuffle',Int32x4ShuffleJS,
'fromFloat32x4',Int32x4FromFloat32x4JS,
'fromUint32x4',Int32x4FromUint32x4JS,
'fromFloat32x4Bits',Int32x4FromFloat32x4BitsJS,
'fromUint32x4Bits',Int32x4FromUint32x4BitsJS,
'fromInt16x8Bits',Int32x4FromInt16x8BitsJS,
'fromUint16x8Bits',Int32x4FromUint16x8BitsJS,
'fromInt8x16Bits',Int32x4FromInt8x16BitsJS,
'fromUint8x16Bits',Int32x4FromUint8x16BitsJS,
'load',Int32x4LoadJS,
'load1',Int32x4Load1JS,
'load2',Int32x4Load2JS,
'load3',Int32x4Load3JS,
'store',Int32x4StoreJS,
'store1',Int32x4Store1JS,
'store2',Int32x4Store2JS,
'store3',Int32x4Store3JS,
]);
b.InstallFunctions(i,2,[
'splat',Uint32x4Splat,
'check',Uint32x4CheckJS,
'extractLane',Uint32x4ExtractLaneJS,
'replaceLane',Uint32x4ReplaceLaneJS,
'add',Uint32x4AddJS,
'sub',Uint32x4SubJS,
'mul',Uint32x4MulJS,
'min',Uint32x4MinJS,
'max',Uint32x4MaxJS,
'and',Uint32x4AndJS,
'or',Uint32x4OrJS,
'xor',Uint32x4XorJS,
'not',Uint32x4NotJS,
'shiftLeftByScalar',Uint32x4ShiftLeftByScalarJS,
'shiftRightByScalar',Uint32x4ShiftRightByScalarJS,
'lessThan',Uint32x4LessThanJS,
'lessThanOrEqual',Uint32x4LessThanOrEqualJS,
'greaterThan',Uint32x4GreaterThanJS,
'greaterThanOrEqual',Uint32x4GreaterThanOrEqualJS,
'equal',Uint32x4EqualJS,
'notEqual',Uint32x4NotEqualJS,
'select',Uint32x4SelectJS,
'swizzle',Uint32x4SwizzleJS,
'shuffle',Uint32x4ShuffleJS,
'fromFloat32x4',Uint32x4FromFloat32x4JS,
'fromInt32x4',Uint32x4FromInt32x4JS,
'fromFloat32x4Bits',Uint32x4FromFloat32x4BitsJS,
'fromInt32x4Bits',Uint32x4FromInt32x4BitsJS,
'fromInt16x8Bits',Uint32x4FromInt16x8BitsJS,
'fromUint16x8Bits',Uint32x4FromUint16x8BitsJS,
'fromInt8x16Bits',Uint32x4FromInt8x16BitsJS,
'fromUint8x16Bits',Uint32x4FromUint8x16BitsJS,
'load',Uint32x4LoadJS,
'load1',Uint32x4Load1JS,
'load2',Uint32x4Load2JS,
'load3',Uint32x4Load3JS,
'store',Uint32x4StoreJS,
'store1',Uint32x4Store1JS,
'store2',Uint32x4Store2JS,
'store3',Uint32x4Store3JS,
]);
b.InstallFunctions(l,2,[
'splat',Bool32x4Splat,
'check',Bool32x4CheckJS,
'extractLane',Bool32x4ExtractLaneJS,
'replaceLane',Bool32x4ReplaceLaneJS,
'and',Bool32x4AndJS,
'or',Bool32x4OrJS,
'xor',Bool32x4XorJS,
'not',Bool32x4NotJS,
'anyTrue',Bool32x4AnyTrueJS,
'allTrue',Bool32x4AllTrueJS,
'swizzle',Bool32x4SwizzleJS,
'shuffle',Bool32x4ShuffleJS,
]);
b.InstallFunctions(g,2,[
'splat',Int16x8Splat,
'check',Int16x8CheckJS,
'extractLane',Int16x8ExtractLaneJS,
'replaceLane',Int16x8ReplaceLaneJS,
'neg',Int16x8NegJS,
'add',Int16x8AddJS,
'sub',Int16x8SubJS,
'addSaturate',Int16x8AddSaturateJS,
'subSaturate',Int16x8SubSaturateJS,
'mul',Int16x8MulJS,
'min',Int16x8MinJS,
'max',Int16x8MaxJS,
'and',Int16x8AndJS,
'or',Int16x8OrJS,
'xor',Int16x8XorJS,
'not',Int16x8NotJS,
'shiftLeftByScalar',Int16x8ShiftLeftByScalarJS,
'shiftRightByScalar',Int16x8ShiftRightByScalarJS,
'lessThan',Int16x8LessThanJS,
'lessThanOrEqual',Int16x8LessThanOrEqualJS,
'greaterThan',Int16x8GreaterThanJS,
'greaterThanOrEqual',Int16x8GreaterThanOrEqualJS,
'equal',Int16x8EqualJS,
'notEqual',Int16x8NotEqualJS,
'select',Int16x8SelectJS,
'swizzle',Int16x8SwizzleJS,
'shuffle',Int16x8ShuffleJS,
'fromUint16x8',Int16x8FromUint16x8JS,
'fromFloat32x4Bits',Int16x8FromFloat32x4BitsJS,
'fromInt32x4Bits',Int16x8FromInt32x4BitsJS,
'fromUint32x4Bits',Int16x8FromUint32x4BitsJS,
'fromUint16x8Bits',Int16x8FromUint16x8BitsJS,
'fromInt8x16Bits',Int16x8FromInt8x16BitsJS,
'fromUint8x16Bits',Int16x8FromUint8x16BitsJS,
'load',Int16x8LoadJS,
'store',Int16x8StoreJS,
]);
b.InstallFunctions(j,2,[
'splat',Uint16x8Splat,
'check',Uint16x8CheckJS,
'extractLane',Uint16x8ExtractLaneJS,
'replaceLane',Uint16x8ReplaceLaneJS,
'add',Uint16x8AddJS,
'sub',Uint16x8SubJS,
'addSaturate',Uint16x8AddSaturateJS,
'subSaturate',Uint16x8SubSaturateJS,
'mul',Uint16x8MulJS,
'min',Uint16x8MinJS,
'max',Uint16x8MaxJS,
'and',Uint16x8AndJS,
'or',Uint16x8OrJS,
'xor',Uint16x8XorJS,
'not',Uint16x8NotJS,
'shiftLeftByScalar',Uint16x8ShiftLeftByScalarJS,
'shiftRightByScalar',Uint16x8ShiftRightByScalarJS,
'lessThan',Uint16x8LessThanJS,
'lessThanOrEqual',Uint16x8LessThanOrEqualJS,
'greaterThan',Uint16x8GreaterThanJS,
'greaterThanOrEqual',Uint16x8GreaterThanOrEqualJS,
'equal',Uint16x8EqualJS,
'notEqual',Uint16x8NotEqualJS,
'select',Uint16x8SelectJS,
'swizzle',Uint16x8SwizzleJS,
'shuffle',Uint16x8ShuffleJS,
'fromInt16x8',Uint16x8FromInt16x8JS,
'fromFloat32x4Bits',Uint16x8FromFloat32x4BitsJS,
'fromInt32x4Bits',Uint16x8FromInt32x4BitsJS,
'fromUint32x4Bits',Uint16x8FromUint32x4BitsJS,
'fromInt16x8Bits',Uint16x8FromInt16x8BitsJS,
'fromInt8x16Bits',Uint16x8FromInt8x16BitsJS,
'fromUint8x16Bits',Uint16x8FromUint8x16BitsJS,
'load',Uint16x8LoadJS,
'store',Uint16x8StoreJS,
]);
b.InstallFunctions(m,2,[
'splat',Bool16x8Splat,
'check',Bool16x8CheckJS,
'extractLane',Bool16x8ExtractLaneJS,
'replaceLane',Bool16x8ReplaceLaneJS,
'and',Bool16x8AndJS,
'or',Bool16x8OrJS,
'xor',Bool16x8XorJS,
'not',Bool16x8NotJS,
'anyTrue',Bool16x8AnyTrueJS,
'allTrue',Bool16x8AllTrueJS,
'swizzle',Bool16x8SwizzleJS,
'shuffle',Bool16x8ShuffleJS,
]);
b.InstallFunctions(h,2,[
'splat',Int8x16Splat,
'check',Int8x16CheckJS,
'extractLane',Int8x16ExtractLaneJS,
'replaceLane',Int8x16ReplaceLaneJS,
'neg',Int8x16NegJS,
'add',Int8x16AddJS,
'sub',Int8x16SubJS,
'addSaturate',Int8x16AddSaturateJS,
'subSaturate',Int8x16SubSaturateJS,
'mul',Int8x16MulJS,
'min',Int8x16MinJS,
'max',Int8x16MaxJS,
'and',Int8x16AndJS,
'or',Int8x16OrJS,
'xor',Int8x16XorJS,
'not',Int8x16NotJS,
'shiftLeftByScalar',Int8x16ShiftLeftByScalarJS,
'shiftRightByScalar',Int8x16ShiftRightByScalarJS,
'lessThan',Int8x16LessThanJS,
'lessThanOrEqual',Int8x16LessThanOrEqualJS,
'greaterThan',Int8x16GreaterThanJS,
'greaterThanOrEqual',Int8x16GreaterThanOrEqualJS,
'equal',Int8x16EqualJS,
'notEqual',Int8x16NotEqualJS,
'select',Int8x16SelectJS,
'swizzle',Int8x16SwizzleJS,
'shuffle',Int8x16ShuffleJS,
'fromUint8x16',Int8x16FromUint8x16JS,
'fromFloat32x4Bits',Int8x16FromFloat32x4BitsJS,
'fromInt32x4Bits',Int8x16FromInt32x4BitsJS,
'fromUint32x4Bits',Int8x16FromUint32x4BitsJS,
'fromInt16x8Bits',Int8x16FromInt16x8BitsJS,
'fromUint16x8Bits',Int8x16FromUint16x8BitsJS,
'fromUint8x16Bits',Int8x16FromUint8x16BitsJS,
'load',Int8x16LoadJS,
'store',Int8x16StoreJS,
]);
b.InstallFunctions(k,2,[
'splat',Uint8x16Splat,
'check',Uint8x16CheckJS,
'extractLane',Uint8x16ExtractLaneJS,
'replaceLane',Uint8x16ReplaceLaneJS,
'add',Uint8x16AddJS,
'sub',Uint8x16SubJS,
'addSaturate',Uint8x16AddSaturateJS,
'subSaturate',Uint8x16SubSaturateJS,
'mul',Uint8x16MulJS,
'min',Uint8x16MinJS,
'max',Uint8x16MaxJS,
'and',Uint8x16AndJS,
'or',Uint8x16OrJS,
'xor',Uint8x16XorJS,
'not',Uint8x16NotJS,
'shiftLeftByScalar',Uint8x16ShiftLeftByScalarJS,
'shiftRightByScalar',Uint8x16ShiftRightByScalarJS,
'lessThan',Uint8x16LessThanJS,
'lessThanOrEqual',Uint8x16LessThanOrEqualJS,
'greaterThan',Uint8x16GreaterThanJS,
'greaterThanOrEqual',Uint8x16GreaterThanOrEqualJS,
'equal',Uint8x16EqualJS,
'notEqual',Uint8x16NotEqualJS,
'select',Uint8x16SelectJS,
'swizzle',Uint8x16SwizzleJS,
'shuffle',Uint8x16ShuffleJS,
'fromInt8x16',Uint8x16FromInt8x16JS,
'fromFloat32x4Bits',Uint8x16FromFloat32x4BitsJS,
'fromInt32x4Bits',Uint8x16FromInt32x4BitsJS,
'fromUint32x4Bits',Uint8x16FromUint32x4BitsJS,
'fromInt16x8Bits',Uint8x16FromInt16x8BitsJS,
'fromUint16x8Bits',Uint8x16FromUint16x8BitsJS,
'fromInt8x16Bits',Uint8x16FromInt8x16BitsJS,
'load',Uint8x16LoadJS,
'store',Uint8x16StoreJS,
]);
b.InstallFunctions(n,2,[
'splat',Bool8x16Splat,
'check',Bool8x16CheckJS,
'extractLane',Bool8x16ExtractLaneJS,
'replaceLane',Bool8x16ReplaceLaneJS,
'and',Bool8x16AndJS,
'or',Bool8x16OrJS,
'xor',Bool8x16XorJS,
'not',Bool8x16NotJS,
'anyTrue',Bool8x16AnyTrueJS,
'allTrue',Bool8x16AllTrueJS,
'swizzle',Bool8x16SwizzleJS,
'shuffle',Bool8x16ShuffleJS,
]);
})

Xharmony-string-paddingY
(function(a,b){
%CheckIsBootstrapping();
var c=a.String;
function StringPad(d,e,f){
e=(%_ToLength(e));
var g=d.length;
if(e<=g)return"";
if((f===(void 0))){
f=" ";
}else{
f=(%_ToString(f));
if(f===""){
return"";
}
}
var h=e-g;
var i=(h/f.length)|0;
var j=(h-f.length*i)|0;
var k="";
while(true){
if(i&1)k+=f;
i>>=1;
if(i===0)break;
f+=f;
}
if(j){
k+=%_SubString(f,0,j);
}
return k;
}
function StringPadStart(e,f){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.padStart")
var d=(%_ToString(this));
return StringPad(d,e,f)+d;
}
%FunctionSetLength(StringPadStart,1);
function StringPadEnd(e,f){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.padEnd")
var d=(%_ToString(this));
return d+StringPad(d,e,f);
}
%FunctionSetLength(StringPadEnd,1);
b.InstallFunctions(c.prototype,2,[
"padStart",StringPadStart,
"padEnd",StringPadEnd
]);
});

`datetime-format-to-partsÈ
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.Intl;
var d=b.ImportNow("FormatDateToParts");
b.InstallFunctions(c.DateTimeFormat.prototype,2,[
'formatToParts',d
]);
})

@icu-case-mapping±
(function(a,b){
"use strict";
%CheckIsBootstrapping();
var c=a.String;
var d=b.OverrideFunction;
var e=b.ImportNow("ToLowerCaseI18N");
var f=b.ImportNow("ToUpperCaseI18N");
var g=b.ImportNow("ToLocaleLowerCaseI18N");
var h=b.ImportNow("ToLocaleUpperCaseI18N");
d(c.prototype,'toLowerCase',e,true);
d(c.prototype,'toUpperCase',f,true);
d(c.prototype,'toLocaleLowerCase',
g,true);
d(c.prototype,'toLocaleUpperCase',
h,true);
})

 dByteLengthQueuingStrategy—
(function(global, binding, v8) {
  'use strict';
  const defineProperty = global.Object.defineProperty;
  class ByteLengthQueuingStrategy {
    constructor(options) {
      defineProperty(this, 'highWaterMark', {
        value: options.highWaterMark,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    size(chunk) { return chunk.byteLength; }
  }
  defineProperty(global, 'ByteLengthQueuingStrategy', {
    value: ByteLengthQueuingStrategy,
    enumerable: false,
    configurable: true,
    writable: true
  });
});
PCountQueuingStrategy˝
(function(global, binding, v8) {
  'use strict';
  const defineProperty = global.Object.defineProperty;
  class CountQueuingStrategy {
    constructor(options) {
      defineProperty(this, 'highWaterMark', {
        value: options.highWaterMark,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    size(chunk) { return 1; }
  }
  defineProperty(global, 'CountQueuingStrategy', {
    value: CountQueuingStrategy,
    enumerable: false,
    configurable: true,
    writable: true
  });
  class BuiltInCountQueuingStrategy {
    constructor(highWaterMark) {
      defineProperty(this, 'highWaterMark', {value: highWaterMark});
    }
    size(chunk) { return 1; }
  }
  binding.createBuiltInCountQueuingStrategy = highWaterMark =>
      new BuiltInCountQueuingStrategy(highWaterMark);
});
8ReadableStreamñ¥
(function(global, binding, v8) {
  'use strict';
  const _reader = v8.createPrivateSymbol('[[reader]]');
  const _storedError = v8.createPrivateSymbol('[[storedError]]');
  const _controller = v8.createPrivateSymbol('[[controller]]');
  const _closedPromise = v8.createPrivateSymbol('[[closedPromise]]');
  const _ownerReadableStream =
      v8.createPrivateSymbol('[[ownerReadableStream]]');
  const _readRequests = v8.createPrivateSymbol('[[readRequests]]');
  const createWithExternalControllerSentinel =
      v8.createPrivateSymbol('flag for UA-created ReadableStream to pass');
  const _readableStreamBits = v8.createPrivateSymbol('bit field for [[state]] and [[disturbed]]');
  const DISTURBED = 0b1;
  const STATE_MASK = 0b110;
  const STATE_BITS_OFFSET = 1;
  const STATE_READABLE = 0;
  const STATE_CLOSED = 1;
  const STATE_ERRORED = 2;
  const _underlyingSource = v8.createPrivateSymbol('[[underlyingSource]]');
  const _controlledReadableStream =
      v8.createPrivateSymbol('[[controlledReadableStream]]');
  const _queue = v8.createPrivateSymbol('[[queue]]');
  const _totalQueuedSize = v8.createPrivateSymbol('[[totalQueuedSize]]');
  const _strategySize = v8.createPrivateSymbol('[[strategySize]]');
  const _strategyHWM = v8.createPrivateSymbol('[[strategyHWM]]');
  const _readableStreamDefaultControllerBits = v8.createPrivateSymbol(
      'bit field for [[started]], [[closeRequested]], [[pulling]], [[pullAgain]]');
  const STARTED = 0b1;
  const CLOSE_REQUESTED = 0b10;
  const PULLING = 0b100;
  const PULL_AGAIN = 0b1000;
  const EXTERNALLY_CONTROLLED = 0b10000;
  const undefined = global.undefined;
  const Infinity = global.Infinity;
  const defineProperty = global.Object.defineProperty;
  const hasOwnProperty = v8.uncurryThis(global.Object.hasOwnProperty);
  const callFunction = v8.uncurryThis(global.Function.prototype.call);
  const TypeError = global.TypeError;
  const RangeError = global.RangeError;
  const Number = global.Number;
  const Number_isNaN = Number.isNaN;
  const Number_isFinite = Number.isFinite;
  const Promise = global.Promise;
  const thenPromise = v8.uncurryThis(Promise.prototype.then);
  const Promise_resolve = v8.simpleBind(Promise.resolve, Promise);
  const Promise_reject = v8.simpleBind(Promise.reject, Promise);
  const errIllegalInvocation = 'Illegal invocation';
  const errIllegalConstructor = 'Illegal constructor';
  const errCancelLockedStream =
      'Cannot cancel a readable stream that is locked to a reader';
  const errEnqueueCloseRequestedStream =
      'Cannot enqueue a chunk into a readable stream that is closed or has been requested to be closed';
  const errCancelReleasedReader =
      'This readable stream reader has been released and cannot be used to cancel its previous owner stream';
  const errReadReleasedReader =
      'This readable stream reader has been released and cannot be used to read from its previous owner stream';
  const errCloseCloseRequestedStream =
      'Cannot close a readable stream that has already been requested to be closed';
  const errEnqueueClosedStream = 'Cannot enqueue a chunk into a closed readable stream';
  const errEnqueueErroredStream = 'Cannot enqueue a chunk into an errored readable stream';
  const errCloseClosedStream = 'Cannot close a closed readable stream';
  const errCloseErroredStream = 'Cannot close an errored readable stream';
  const errErrorClosedStream = 'Cannot error a close readable stream';
  const errErrorErroredStream =
      'Cannot error a readable stream that is already errored';
  const errGetReaderNotByteStream = 'This readable stream does not support BYOB readers';
  const errGetReaderBadMode = 'Invalid reader mode given: expected undefined or "byob"';
  const errReaderConstructorBadArgument =
      'ReadableStreamReader constructor argument is not a readable stream';
  const errReaderConstructorStreamAlreadyLocked =
      'ReadableStreamReader constructor can only accept readable streams that are not yet locked to a reader';
  const errReleaseReaderWithPendingRead =
      'Cannot release a readable stream reader when it still has outstanding read() calls that have not yet settled';
  const errReleasedReaderClosedPromise =
      'This readable stream reader has been released and cannot be used to monitor the stream\'s state';
  const errInvalidSize =
      'The return value of a queuing strategy\'s size function must be a finite, non-NaN, non-negative number';
  const errSizeNotAFunction =
      'A queuing strategy\'s size property must be a function';
  const errInvalidHWM =
      'A queueing strategy\'s highWaterMark property must be a nonnegative, non-NaN number';
  const errTmplMustBeFunctionOrUndefined = name =>
      `${name} must be a function or undefined`;
  class ReadableStream {
    constructor() {
      const underlyingSource = arguments[0] === undefined ? {} : arguments[0];
      const strategy = arguments[1] === undefined ? {} : arguments[1];
      const size = strategy.size;
      let highWaterMark = strategy.highWaterMark;
      if (highWaterMark === undefined) {
        highWaterMark = 1;
      }
      this[_readableStreamBits] = 0b0;
      ReadableStreamSetState(this, STATE_READABLE);
      this[_reader] = undefined;
      this[_storedError] = undefined;
      this[_controller] = undefined;
      const type = underlyingSource.type;
      const typeString = String(type);
      if (typeString === 'bytes') {
        throw new RangeError('bytes type is not yet implemented');
      } else if (type !== undefined) {
        throw new RangeError('Invalid type is specified');
      }
      this[_controller] =
          new ReadableStreamDefaultController(this, underlyingSource, size, highWaterMark, arguments[2] === createWithExternalControllerSentinel);
    }
    get locked() {
      if (IsReadableStream(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      return IsReadableStreamLocked(this);
    }
    cancel(reason) {
      if (IsReadableStream(this) === false) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      if (IsReadableStreamLocked(this) === true) {
        return Promise_reject(new TypeError(errCancelLockedStream));
      }
      return ReadableStreamCancel(this, reason);
    }
    getReader({ mode } = {}) {
      if (IsReadableStream(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      if (mode === 'byob') {
        throw new TypeError(errGetReaderNotByteStream);
      }
      if (mode === undefined) {
        return AcquireReadableStreamDefaultReader(this);
      }
      throw new RangeError(errGetReaderBadMode);
    }
    tee() {
      if (IsReadableStream(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      return ReadableStreamTee(this);
    }
  }
  class ReadableStreamDefaultController {
    constructor(stream, underlyingSource, size, highWaterMark, isExternallyControlled) {
      if (IsReadableStream(stream) === false) {
        throw new TypeError(errIllegalConstructor);
      }
      if (stream[_controller] !== undefined) {
        throw new TypeError(errIllegalConstructor);
      }
      this[_controlledReadableStream] = stream;
      this[_underlyingSource] = underlyingSource;
      this[_queue] = new v8.InternalPackedArray();
      this[_totalQueuedSize] = 0;
      this[_readableStreamDefaultControllerBits] = 0b0;
      if (isExternallyControlled === true) {
        this[_readableStreamDefaultControllerBits] |= EXTERNALLY_CONTROLLED;
      }
      const normalizedStrategy =
          ValidateAndNormalizeQueuingStrategy(size, highWaterMark);
      this[_strategySize] = normalizedStrategy.size;
      this[_strategyHWM] = normalizedStrategy.highWaterMark;
      const controller = this;
      const startResult = CallOrNoop(
          underlyingSource, 'start', this, 'underlyingSource.start');
      thenPromise(Promise_resolve(startResult),
          () => {
            controller[_readableStreamDefaultControllerBits] |= STARTED;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          },
          r => {
            if (ReadableStreamGetState(stream) === STATE_READABLE) {
              ReadableStreamDefaultControllerError(controller, r);
            }
          });
    }
    get desiredSize() {
      if (IsReadableStreamDefaultController(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      return ReadableStreamDefaultControllerGetDesiredSize(this);
    }
    close() {
      if (IsReadableStreamDefaultController(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      const stream = this[_controlledReadableStream];
      if (this[_readableStreamDefaultControllerBits] & CLOSE_REQUESTED) {
        throw new TypeError(errCloseCloseRequestedStream);
      }
      const state = ReadableStreamGetState(stream);
      if (state === STATE_ERRORED) {
        throw new TypeError(errCloseErroredStream);
      }
      if (state === STATE_CLOSED) {
        throw new TypeError(errCloseClosedStream);
      }
      return ReadableStreamDefaultControllerClose(this);
    }
    enqueue(chunk) {
      if (IsReadableStreamDefaultController(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      const stream = this[_controlledReadableStream];
      if (this[_readableStreamDefaultControllerBits] & CLOSE_REQUESTED) {
        throw new TypeError(errEnqueueCloseRequestedStream);
      }
      const state = ReadableStreamGetState(stream);
      if (state === STATE_ERRORED) {
        throw new TypeError(errEnqueueErroredStream);
      }
      if (state === STATE_CLOSED) {
        throw new TypeError(errEnqueueClosedStream);
      }
      return ReadableStreamDefaultControllerEnqueue(this, chunk);
    }
    error(e) {
      if (IsReadableStreamDefaultController(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      const stream = this[_controlledReadableStream];
      const state = ReadableStreamGetState(stream);
      if (state === STATE_ERRORED) {
        throw new TypeError(errErrorErroredStream);
      }
      if (state === STATE_CLOSED) {
        throw new TypeError(errErrorClosedStream);
      }
      return ReadableStreamDefaultControllerError(this, e);
    }
  }
  function ReadableStreamDefaultControllerCancel(controller, reason) {
    controller[_queue] = new v8.InternalPackedArray();
    const underlyingSource = controller[_underlyingSource];
    return PromiseCallOrNoop(underlyingSource, 'cancel', reason, 'underlyingSource.cancel');
  }
  function ReadableStreamDefaultControllerPull(controller) {
    const stream = controller[_controlledReadableStream];
    if (controller[_queue].length > 0) {
      const chunk = DequeueValue(controller);
      if ((controller[_readableStreamDefaultControllerBits] & CLOSE_REQUESTED) &&
          controller[_queue].length === 0) {
        ReadableStreamClose(stream);
      } else {
        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
      }
      return Promise_resolve(CreateIterResultObject(chunk, false));
    }
    const pendingPromise = ReadableStreamAddReadRequest(stream);
    ReadableStreamDefaultControllerCallPullIfNeeded(controller);
    return pendingPromise;
  }
  function ReadableStreamAddReadRequest(stream) {
    const promise = v8.createPromise();
    stream[_reader][_readRequests].push(promise);
    return promise;
  }
  class ReadableStreamDefaultReader {
    constructor(stream) {
      if (IsReadableStream(stream) === false) {
        throw new TypeError(errReaderConstructorBadArgument);
      }
      if (IsReadableStreamLocked(stream) === true) {
        throw new TypeError(errReaderConstructorStreamAlreadyLocked);
      }
      ReadableStreamReaderGenericInitialize(this, stream);
      this[_readRequests] = new v8.InternalPackedArray();
    }
    get closed() {
      if (IsReadableStreamDefaultReader(this) === false) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      return this[_closedPromise];
    }
    cancel(reason) {
      if (IsReadableStreamDefaultReader(this) === false) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      const stream = this[_ownerReadableStream];
      if (stream === undefined) {
        return Promise_reject(new TypeError(errCancelReleasedReader));
      }
      return ReadableStreamReaderGenericCancel(this, reason);
    }
    read() {
      if (IsReadableStreamDefaultReader(this) === false) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      if (this[_ownerReadableStream] === undefined) {
        return Promise_reject(new TypeError(errReadReleasedReader));
      }
      return ReadableStreamDefaultReaderRead(this);
    }
    releaseLock() {
      if (IsReadableStreamDefaultReader(this) === false) {
        throw new TypeError(errIllegalInvocation);
      }
      const stream = this[_ownerReadableStream];
      if (stream === undefined) {
        return undefined;
      }
      if (this[_readRequests].length > 0) {
        throw new TypeError(errReleaseReaderWithPendingRead);
      }
      ReadableStreamReaderGenericRelease(this);
    }
  }
  function ReadableStreamReaderGenericCancel(reader, reason) {
    return ReadableStreamCancel(reader[_ownerReadableStream], reason);
  }
  function AcquireReadableStreamDefaultReader(stream) {
    return new ReadableStreamDefaultReader(stream);
  }
  function ReadableStreamCancel(stream, reason) {
    stream[_readableStreamBits] |= DISTURBED;
    const state = ReadableStreamGetState(stream);
    if (state === STATE_CLOSED) {
      return Promise_resolve(undefined);
    }
    if (state === STATE_ERRORED) {
      return Promise_reject(stream[_storedError]);
    }
    ReadableStreamClose(stream);
    const sourceCancelPromise = ReadableStreamDefaultControllerCancel(stream[_controller], reason);
    return thenPromise(sourceCancelPromise, () => undefined);
  }
  function ReadableStreamDefaultControllerClose(controller) {
    const stream = controller[_controlledReadableStream];
    controller[_readableStreamDefaultControllerBits] |= CLOSE_REQUESTED;
    if (controller[_queue].length === 0) {
      ReadableStreamClose(stream);
    }
  }
  function ReadableStreamFulfillReadRequest(stream, chunk, done) {
    const reader = stream[_reader];
    const readRequest = stream[_reader][_readRequests].shift();
    v8.resolvePromise(readRequest, CreateIterResultObject(chunk, done));
  }
  function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
    const stream = controller[_controlledReadableStream];
    if (IsReadableStreamLocked(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
      ReadableStreamFulfillReadRequest(stream, chunk, false);
    } else {
      let chunkSize = 1;
      const strategySize = controller[_strategySize];
      if (strategySize !== undefined) {
        try {
          chunkSize = strategySize(chunk);
        } catch (chunkSizeE) {
          if (ReadableStreamGetState(stream) === STATE_READABLE) {
            ReadableStreamDefaultControllerError(controller, chunkSizeE);
          }
          throw chunkSizeE;
        }
      }
      try {
        EnqueueValueWithSize(controller, chunk, chunkSize);
      } catch (enqueueE) {
        if (ReadableStreamGetState(stream) === STATE_READABLE) {
          ReadableStreamDefaultControllerError(controller, enqueueE);
        }
        throw enqueueE;
      }
    }
    ReadableStreamDefaultControllerCallPullIfNeeded(controller);
  }
  function ReadableStreamGetState(stream) {
    return (stream[_readableStreamBits] & STATE_MASK) >> STATE_BITS_OFFSET;
  }
  function ReadableStreamSetState(stream, state) {
    stream[_readableStreamBits] = (stream[_readableStreamBits] & ~STATE_MASK) |
        (state << STATE_BITS_OFFSET);
  }
  function ReadableStreamDefaultControllerError(controller, e) {
    controller[_queue] = new v8.InternalPackedArray();
    const stream = controller[_controlledReadableStream];
    ReadableStreamError(stream, e);
  }
  function ReadableStreamError(stream, e) {
    stream[_storedError] = e;
    ReadableStreamSetState(stream, STATE_ERRORED);
    const reader = stream[_reader];
    if (reader === undefined) {
      return undefined;
    }
    if (IsReadableStreamDefaultReader(reader) === true) {
      const readRequests = reader[_readRequests];
      for (let i = 0; i < readRequests.length; i++) {
        v8.rejectPromise(readRequests[i], e);
      }
      reader[_readRequests] = new v8.InternalPackedArray();
    }
    v8.rejectPromise(reader[_closedPromise], e);
  }
  function ReadableStreamClose(stream) {
    ReadableStreamSetState(stream, STATE_CLOSED);
    const reader = stream[_reader];
    if (reader === undefined) {
      return undefined;
    }
    if (IsReadableStreamDefaultReader(reader) === true) {
      const readRequests = reader[_readRequests];
      for (let i = 0; i < readRequests.length; i++) {
        v8.resolvePromise(
            readRequests[i], CreateIterResultObject(undefined, true));
      }
      reader[_readRequests] = new v8.InternalPackedArray();
    }
    v8.resolvePromise(reader[_closedPromise], undefined);
  }
  function ReadableStreamDefaultControllerGetDesiredSize(controller) {
    const queueSize = GetTotalQueueSize(controller);
    return controller[_strategyHWM] - queueSize;
  }
  function IsReadableStream(x) {
    return hasOwnProperty(x, _controller);
  }
  function IsReadableStreamDisturbed(stream) {
    return stream[_readableStreamBits] & DISTURBED;
  }
  function IsReadableStreamLocked(stream) {
    return stream[_reader] !== undefined;
  }
  function IsReadableStreamDefaultController(x) {
    return hasOwnProperty(x, _controlledReadableStream);
  }
  function IsReadableStreamDefaultReader(x) {
    return hasOwnProperty(x, _readRequests);
  }
  function IsReadableStreamReadable(stream) {
    return ReadableStreamGetState(stream) === STATE_READABLE;
  }
  function IsReadableStreamClosed(stream) {
    return ReadableStreamGetState(stream) === STATE_CLOSED;
  }
  function IsReadableStreamErrored(stream) {
    return ReadableStreamGetState(stream) === STATE_ERRORED;
  }
  function ReadableStreamReaderGenericInitialize(reader, stream) {
    const controller = stream[_controller];
    if (controller[_readableStreamDefaultControllerBits] & EXTERNALLY_CONTROLLED) {
      const underlyingSource = controller[_underlyingSource];
      callFunction(underlyingSource.notifyLockAcquired, underlyingSource);
    }
    reader[_ownerReadableStream] = stream;
    stream[_reader] = reader;
    switch (ReadableStreamGetState(stream)) {
      case STATE_READABLE:
        reader[_closedPromise] = v8.createPromise();
        break;
      case STATE_CLOSED:
        reader[_closedPromise] = Promise_resolve(undefined);
        break;
      case STATE_ERRORED:
        reader[_closedPromise] = Promise_reject(stream[_storedError]);
      break;
    }
  }
  function ReadableStreamReaderGenericRelease(reader) {
    const controller = reader[_ownerReadableStream][_controller];
    if (controller[_readableStreamDefaultControllerBits] & EXTERNALLY_CONTROLLED) {
      const underlyingSource = controller[_underlyingSource];
      callFunction(underlyingSource.notifyLockReleased, underlyingSource);
    }
    if (ReadableStreamGetState(reader[_ownerReadableStream]) === STATE_READABLE) {
      v8.rejectPromise(reader[_closedPromise], new TypeError(errReleasedReaderClosedPromise));
    } else {
      reader[_closedPromise] = Promise_reject(new TypeError(errReleasedReaderClosedPromise));
    }
    reader[_ownerReadableStream][_reader] = undefined;
    reader[_ownerReadableStream] = undefined;
  }
  function ReadableStreamDefaultReaderRead(reader) {
    const stream = reader[_ownerReadableStream];
    stream[_readableStreamBits] |= DISTURBED;
    if (ReadableStreamGetState(stream) === STATE_CLOSED) {
      return Promise_resolve(CreateIterResultObject(undefined, true));
    }
    if (ReadableStreamGetState(stream) === STATE_ERRORED) {
      return Promise_reject(stream[_storedError]);
    }
    return ReadableStreamDefaultControllerPull(stream[_controller]);
  }
  function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
    const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
    if (shouldPull === false) {
      return undefined;
    }
    if (controller[_readableStreamDefaultControllerBits] & PULLING) {
      controller[_readableStreamDefaultControllerBits] |= PULL_AGAIN;
      return undefined;
    }
    controller[_readableStreamDefaultControllerBits] |= PULLING;
    const underlyingSource = controller[_underlyingSource];
    const pullPromise = PromiseCallOrNoop(
        underlyingSource, 'pull', controller, 'underlyingSource.pull');
    thenPromise(pullPromise,
        () => {
          controller[_readableStreamDefaultControllerBits] &= ~PULLING;
          if (controller[_readableStreamDefaultControllerBits] & PULL_AGAIN) {
            controller[_readableStreamDefaultControllerBits] &= ~PULL_AGAIN;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }
        },
        e => {
          if (ReadableStreamGetState(controller[_controlledReadableStream]) === STATE_READABLE) {
            ReadableStreamDefaultControllerError(controller, e);
          }
        });
  }
  function ReadableStreamDefaultControllerShouldCallPull(controller) {
    const stream = controller[_controlledReadableStream];
    const state = ReadableStreamGetState(stream);
    if (state === STATE_CLOSED || state === STATE_ERRORED) {
      return false;
    }
    if (controller[_readableStreamDefaultControllerBits] & CLOSE_REQUESTED) {
      return false;
    }
    if (!(controller[_readableStreamDefaultControllerBits] & STARTED)) {
      return false;
    }
    if (IsReadableStreamLocked(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
      return true;
    }
    const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
    if (desiredSize > 0) {
      return true;
    }
    return false;
  }
  function ReadableStreamGetNumReadRequests(stream) {
    const reader = stream[_reader];
    const readRequests = reader[_readRequests];
    return readRequests.length;
  }
  function ReadableStreamTee(stream) {
    const reader = AcquireReadableStreamDefaultReader(stream);
    let closedOrErrored = false;
    let canceled1 = false;
    let canceled2 = false;
    let reason1;
    let reason2;
    let promise = v8.createPromise();
    const branch1Stream = new ReadableStream({pull, cancel: cancel1});
    const branch2Stream = new ReadableStream({pull, cancel: cancel2});
    const branch1 = branch1Stream[_controller];
    const branch2 = branch2Stream[_controller];
    thenPromise(
        reader[_closedPromise], undefined, function(r) {
          if (closedOrErrored === true) {
            return;
          }
          ReadableStreamDefaultControllerError(branch1, r);
          ReadableStreamDefaultControllerError(branch2, r);
          closedOrErrored = true;
        });
    return [branch1Stream, branch2Stream];
    function pull() {
      return thenPromise(
          ReadableStreamDefaultReaderRead(reader), function(result) {
            const value = result.value;
            const done = result.done;
            if (done === true && closedOrErrored === false) {
              if (canceled1 === false) {
                ReadableStreamDefaultControllerClose(branch1);
              }
              if (canceled2 === false) {
                ReadableStreamDefaultControllerClose(branch2);
              }
              closedOrErrored = true;
            }
            if (closedOrErrored === true) {
              return;
            }
            if (canceled1 === false) {
              ReadableStreamDefaultControllerEnqueue(branch1, value);
            }
            if (canceled2 === false) {
              ReadableStreamDefaultControllerEnqueue(branch2, value);
            }
          });
    }
    function cancel1(reason) {
      canceled1 = true;
      reason1 = reason;
      if (canceled2 === true) {
        const compositeReason = [reason1, reason2];
        const cancelResult = ReadableStreamCancel(stream, compositeReason);
        v8.resolvePromise(promise, cancelResult);
      }
      return promise;
    }
    function cancel2(reason) {
      canceled2 = true;
      reason2 = reason;
      if (canceled1 === true) {
        const compositeReason = [reason1, reason2];
        const cancelResult = ReadableStreamCancel(stream, compositeReason);
        v8.resolvePromise(promise, cancelResult);
      }
      return promise;
    }
  }
  function DequeueValue(controller) {
    const result = controller[_queue].shift();
    controller[_totalQueuedSize] -= result.size;
    return result.value;
  }
  function EnqueueValueWithSize(controller, value, size) {
    size = Number(size);
    if (Number_isNaN(size) || size === +Infinity || size < 0) {
      throw new RangeError(errInvalidSize);
    }
    controller[_totalQueuedSize] += size;
    controller[_queue].push({value, size});
  }
  function GetTotalQueueSize(controller) { return controller[_totalQueuedSize]; }
  function ValidateAndNormalizeQueuingStrategy(size, highWaterMark) {
    if (size !== undefined && typeof size !== 'function') {
      throw new TypeError(errSizeNotAFunction);
    }
    highWaterMark = Number(highWaterMark);
    if (Number_isNaN(highWaterMark) || highWaterMark < 0) {
      throw new RangeError(errInvalidHWM);
    }
    return {size, highWaterMark};
  }
  function CallOrNoop(O, P, arg, nameForError) {
    const method = O[P];
    if (method === undefined) {
      return undefined;
    }
    if (typeof method !== 'function') {
      throw new TypeError(errTmplMustBeFunctionOrUndefined(nameForError));
    }
    return callFunction(method, O, arg);
  }
  function PromiseCallOrNoop(O, P, arg, nameForError) {
    let method;
    try {
      method = O[P];
    } catch (methodE) {
      return Promise_reject(methodE);
    }
    if (method === undefined) {
      return Promise_resolve(undefined);
    }
    if (typeof method !== 'function') {
      return Promise_reject(new TypeError(errTmplMustBeFunctionOrUndefined(nameForError)));
    }
    try {
      return Promise_resolve(callFunction(method, O, arg));
    } catch (e) {
      return Promise_reject(e);
    }
  }
  function CreateIterResultObject(value, done) { return {value, done}; }
  defineProperty(global, 'ReadableStream', {
    value: ReadableStream,
    enumerable: false,
    configurable: true,
    writable: true
  });
  binding.AcquireReadableStreamDefaultReader = AcquireReadableStreamDefaultReader;
  binding.IsReadableStream = IsReadableStream;
  binding.IsReadableStreamDisturbed = IsReadableStreamDisturbed;
  binding.IsReadableStreamLocked = IsReadableStreamLocked;
  binding.IsReadableStreamReadable = IsReadableStreamReadable;
  binding.IsReadableStreamClosed = IsReadableStreamClosed;
  binding.IsReadableStreamErrored = IsReadableStreamErrored;
  binding.IsReadableStreamDefaultReader = IsReadableStreamDefaultReader;
  binding.ReadableStreamDefaultReaderRead = ReadableStreamDefaultReaderRead;
  binding.ReadableStreamTee = ReadableStreamTee;
  binding.ReadableStreamDefaultControllerClose = ReadableStreamDefaultControllerClose;
  binding.ReadableStreamDefaultControllerGetDesiredSize = ReadableStreamDefaultControllerGetDesiredSize;
  binding.ReadableStreamDefaultControllerEnqueue = ReadableStreamDefaultControllerEnqueue;
  binding.ReadableStreamDefaultControllerError = ReadableStreamDefaultControllerError;
  binding.createReadableStreamWithExternalController =
      (underlyingSource, strategy) => {
        return new ReadableStream(
            underlyingSource, strategy, createWithExternalControllerSentinel);
      };
});
 8WritableStream&†
(function(global, binding, v8) {
  'use strict';
  const _state = v8.createPrivateSymbol('[[state]]');
  const _storedError = v8.createPrivateSymbol('[[storedError]]');
  const _writer = v8.createPrivateSymbol('[[writer]]');
  const _writableStreamController =
      v8.createPrivateSymbol('[[writableStreamController]]');
  const _writeRequests = v8.createPrivateSymbol('[[writeRequests]]');
  const _closedPromise = v8.createPrivateSymbol('[[closedPromise]]');
  const _ownerWritableStream =
      v8.createPrivateSymbol('[[ownerWritableStream]]');
  const _readyPromise = v8.createPrivateSymbol('[[readyPromise]]');
  const _controlledWritableStream =
      v8.createPrivateSymbol('[[controlledWritableStream]]');
  const _queue = v8.createPrivateSymbol('[[queue]]');
  const _queueSize = v8.createPrivateSymbol('[[queueSize]]');
  const _strategyHWM = v8.createPrivateSymbol('[[strategyHWM]]');
  const _strategySize = v8.createPrivateSymbol('[[strategySize]]');
  const _underlyingSink = v8.createPrivateSymbol('[[underlyingSink]]');
  const _defaultControllerFlags =
      v8.createPrivateSymbol('[[defaultControllerFlags]]');
  const FLAG_STARTED = 0b1;
  const FLAG_WRITING = 0b10;
  const WRITABLE = 0;
  const CLOSING = 1;
  const CLOSED = 2;
  const ERRORED = 3;
  const undefined = global.undefined;
  const defineProperty = global.Object.defineProperty;
  const hasOwnProperty = v8.uncurryThis(global.Object.hasOwnProperty);
  const Function_call = v8.uncurryThis(global.Function.prototype.call);
  const Function_apply = v8.uncurryThis(global.Function.prototype.apply);
  const TypeError = global.TypeError;
  const RangeError = global.RangeError;
  const Boolean = global.Boolean;
  const Number = global.Number;
  const Number_isNaN = Number.isNaN;
  const Number_isFinite = Number.isFinite;
  const Promise = global.Promise;
  const thenPromise = v8.uncurryThis(Promise.prototype.then);
  const Promise_resolve = v8.simpleBind(Promise.resolve, Promise);
  const Promise_reject = v8.simpleBind(Promise.reject, Promise);
  const errIllegalInvocation = 'Illegal invocation';
  const errIllegalConstructor = 'Illegal constructor';
  const errInvalidType = 'Invalid type is specified';
  const errAbortLockedStream =  'Cannot abort a writable stream that is locked to a writer';
  const errStreamAborted = 'The stream has been aborted';
  const errWriterLockReleasedPrefix = 'This writable stream writer has been released and cannot be ';
  const errCloseCloseRequestedStream =
      'Cannot close a writable stream that has already been requested to be closed';
  const errWriteCloseRequestedStream =
      'Cannot write to a writable stream that is due to be closed';
  const templateErrorCannotActionOnStateStream =
      (action, state) => `Cannot ${action} a ${state} writable stream`;
  const errReleasedWriterClosedPromise =
      'This writable stream writer has been released and cannot be used to monitor the stream\'s state';
  const templateErrorIsNotAFunction = f => `${f} is not a function`;
  const errSizeNotAFunction =
      'A queuing strategy\'s size property must be a function';
  const errInvalidHWM =
      'A queuing strategy\'s highWaterMark property must be a non-negative, non-NaN number';
  const errInvalidSize =
      'The return value of a queuing strategy\'s size function must be a finite, non-NaN, non-negative number';
  const verbUsedToGetTheDesiredSize = 'used to get the desiredSize';
  const verbAborted = 'aborted';
  const verbClosed = 'closed';
  const verbWrittenTo = 'written to';
  function createWriterLockReleasedError(verb) {
    return new TypeError(errWriterLockReleasedPrefix + verb);
  }
  const stateNames = {[CLOSED]: 'closed', [ERRORED]: 'errored'};
  function createCannotActionOnStateStreamError(action, state) {
    TEMP_ASSERT(stateNames[state] !== undefined,
                `name for state ${state} exists in stateNames`);
    return new TypeError(
        templateErrorCannotActionOnStateStream(action, stateNames[state]));
  }
  function setDefaultControllerFlag(controller, flag, value) {
    let flags = controller[_defaultControllerFlags];
    if (value) {
      flags = flags | flag;
    } else {
      flags = flags & ~flag;
    }
    controller[_defaultControllerFlags] = flags;
  }
  function getDefaultControllerStartedFlag(controller) {
    return Boolean(controller[_defaultControllerFlags] & FLAG_STARTED);
  }
  function setDefaultControllerStartedFlag(controller, value) {
    setDefaultControllerFlag(controller, FLAG_STARTED, value);
  }
  function getDefaultControllerWritingFlag(controller) {
    return Boolean(controller[_defaultControllerFlags] & FLAG_WRITING);
  }
  function setDefaultControllerWritingFlag(controller, value) {
    setDefaultControllerFlag(controller, FLAG_WRITING, value);
  }
  function rejectPromises(array, e) {
    for (let i = 0; i < array.length; ++i) {
      v8.rejectPromise(array[i], e);
    }
  }
  function IsPropertyKey(argument) {
    return typeof argument === 'string' || typeof argument === 'symbol';
  }
  function TEMP_ASSERT(predicate, message) {
    if (predicate) {
      return;
    }
    v8.log(`Assertion failed: ${message}\n`);
    v8.logStackTrace();
    class WritableStreamInternalError {
    }
    throw new WritableStreamInternalError();
  }
  class WritableStream {
    constructor(underlyingSink = {}, { size, highWaterMark = 1 } = {}) {
      this[_state] = WRITABLE;
      this[_storedError] = undefined;
      this[_writer] = undefined;
      this[_writableStreamController] = undefined;
      this[_writeRequests] = new v8.InternalPackedArray();
      const type = underlyingSink.type;
      if (type !== undefined) {
        throw new RangeError(errInvalidType);
      }
      this[_writableStreamController] =
          new WritableStreamDefaultController(this, underlyingSink, size,
                                              highWaterMark);
    }
    get locked() {
      if (!IsWritableStream(this)) {
        throw new TypeError(errIllegalInvocation);
      }
      return IsWritableStreamLocked(this);
    }
    abort(reason) {
      if (!IsWritableStream(this)) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      if (IsWritableStreamLocked(this)) {
        return Promise_reject(new TypeError(errAbortLockedStream));
      }
      return WritableStreamAbort(this, reason);
    }
    getWriter() {
      if (!IsWritableStream(this)) {
         throw new TypeError(errIllegalInvocation);
      }
      return AcquireWritableStreamDefaultWriter(this);
    }
  }
  function AcquireWritableStreamDefaultWriter(stream) {
    return new WritableStreamDefaultWriter(stream);
  }
  function IsWritableStream(x) {
    return hasOwnProperty(x, _writableStreamController);
  }
  function IsWritableStreamLocked(stream) {
    TEMP_ASSERT(IsWritableStream(stream),
                '! IsWritableStream(stream) is true.');
    return stream[_writer] !== undefined;
  }
  function WritableStreamAbort(stream, reason) {
    const state = stream[_state];
    if (state === CLOSED) {
      return Promise_resolve(undefined);
    }
    if (state === ERRORED) {
      return Promise_reject(stream[_storedError]);
    }
    TEMP_ASSERT(state === WRITABLE || state === CLOSING,
               'state is "writable" or "closing".');
    const error = new TypeError(errStreamAborted);
    WritableStreamError(stream, error);
    return WritableStreamDefaultControllerAbort(
        stream[_writableStreamController], reason);
  }
  function WritableStreamAddWriteRequest(stream) {
    TEMP_ASSERT(IsWritableStreamLocked(stream),
                '! IsWritableStreamLocked(writer) is true.');
    TEMP_ASSERT(stream[_state] === WRITABLE,
                'stream.[[state]] is "writable".');
    const promise = v8.createPromise();
    stream[_writeRequests].push(promise);
    return promise;
  }
  function WritableStreamError(stream, e) {
    const state = stream[_state];
    TEMP_ASSERT(state === WRITABLE || state === CLOSING,
                'state is "writable" or "closing".');
    rejectPromises(stream[_writeRequests], e);
    stream[_writeRequests] = new v8.InternalPackedArray();
    const writer = stream[_writer];
    if (writer !== undefined) {
      v8.rejectPromise(writer[_closedPromise], e);
      if (state === WRITABLE &&
          WritableStreamDefaultControllerGetBackpressure(
              stream[_writableStreamController])) {
        v8.rejectPromise(writer[_readyPromise], e);
      } else {
        writer[_readyPromise] = Promise_reject(e);
      }
    }
    stream[_state] = ERRORED;
    stream[_storedError] = e;
  }
  function WritableStreamFinishClose(stream) {
    TEMP_ASSERT(stream[_state] === CLOSING,
                'stream.[[state]] is "closing".');
    TEMP_ASSERT(stream[_writer] !== undefined,
                'stream.[[writer]] is not undefined.');
    stream[_state] = CLOSED;
    v8.resolvePromise(stream[_writer][_closedPromise], undefined);
  }
  function WritableStreamFulfillWriteRequest(stream) {
    TEMP_ASSERT(stream[_writeRequests].length !== 0,
               'stream.[[writeRequests]] is not empty.');
    const writeRequest = stream[_writeRequests].shift();
    v8.resolvePromise(writeRequest, undefined);
  }
  function WritableStreamUpdateBackpressure(stream, backpressure) {
    TEMP_ASSERT(stream[_state] === WRITABLE,
                'stream.[[state]] is "writable".');
    const writer = stream[_writer];
    if (writer === undefined) {
      return;
    }
    if (backpressure) {
      writer[_readyPromise] = v8.createPromise();
    } else {
      TEMP_ASSERT(backpressure === false,
                  'backpressure is false.');
      v8.resolvePromise(writer[_readyPromise], undefined);
    }
  }
  class WritableStreamDefaultWriter {
    constructor(stream) {
      if (!IsWritableStream(stream)) {
        throw new TypeError(errIllegalConstructor);
      }
      if (IsWritableStreamLocked(stream)) {
        throw new TypeError(errIllegalConstructor);
      }
      this[_ownerWritableStream] = stream;
      stream[_writer] = this;
      const state = stream[_state];
      if (state === WRITABLE || state === CLOSING) {
        this[_closedPromise] = v8.createPromise();
      } else if (state === CLOSED) {
        this[_closedPromise] = Promise_resolve(undefined);
      } else {
        TEMP_ASSERT(state === ERRORED,
                    'state is "errored".');
        this[_closedPromise] = Promise_reject(stream[_storedError]);
      }
      if (state === WRITABLE &&
          WritableStreamDefaultControllerGetBackpressure(
              stream[_writableStreamController])) {
        this[_readyPromise] = v8.createPromise();
      } else {
        this[_readyPromise] = Promise_resolve(undefined);
      }
    }
    get closed() {
      if (!IsWritableStreamDefaultWriter(this)) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      return this[_closedPromise];
    }
    get desiredSize() {
      if (!IsWritableStreamDefaultWriter(this)) {
        throw new TypeError(errIllegalInvocation);
      }
      if (this[_ownerWritableStream] === undefined) {
        throw createWriterLockReleasedError(verbUsedToGetTheDesiredSize);
      }
      return WritableStreamDefaultWriterGetDesiredSize(this);
    }
    get ready() {
      if (!IsWritableStreamDefaultWriter(this)) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      return this[_readyPromise];
    }
    abort(reason) {
     if (!IsWritableStreamDefaultWriter(this)) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      if (this[_ownerWritableStream] === undefined) {
        return Promise_reject(createWriterLockReleasedError(verbAborted));
      }
      return WritableStreamDefaultWriterAbort(this, reason);
    }
    close() {
      if (!IsWritableStreamDefaultWriter(this)) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      const stream = this[_ownerWritableStream];
      if (stream === undefined) {
        return Promise_reject(createWriterLockReleasedError(verbClosed));
      }
      if (stream[_state] === CLOSING) {
        return Promise_reject(new TypeError(errCloseCloseRequestedStream));
      }
      return WritableStreamDefaultWriterClose(this);
    }
    releaseLock() {
      if (!IsWritableStreamDefaultWriter(this)) {
        throw new TypeError(errIllegalInvocation);
      }
      const stream = this[_ownerWritableStream];
      if (stream === undefined) {
        return;
      }
      TEMP_ASSERT(stream[_writer] !== undefined,
                  'stream.[[writer]] is not undefined.');
      WritableStreamDefaultWriterRelease(this);
    }
    write(chunk) {
      if (!IsWritableStreamDefaultWriter(this)) {
        return Promise_reject(new TypeError(errIllegalInvocation));
      }
      const stream = this[_ownerWritableStream];
      if (stream === undefined) {
        return Promise_reject(createWriterLockReleasedError(verbWrittenTo));
      }
      if (stream[_state] === CLOSING) {
        return Promise_reject(new TypeError(errWriteCloseRequestedStream));
      }
      return WritableStreamDefaultWriterWrite(this, chunk);
    }
  }
  function IsWritableStreamDefaultWriter(x) {
    return hasOwnProperty(x, _ownerWritableStream);
  }
  function WritableStreamDefaultWriterAbort(writer, reason) {
    const stream = writer[_ownerWritableStream];
    TEMP_ASSERT(stream !== undefined,
                'stream is not undefined.');
    return WritableStreamAbort(stream, reason);
  }
  function WritableStreamDefaultWriterClose(writer) {
    const stream = writer[_ownerWritableStream];
    TEMP_ASSERT(stream !== undefined,
                'stream is not undefined.');
    const state = stream[_state];
    if (state === CLOSED || state === ERRORED) {
      return Promise_reject(
          createCannotActionOnStateStreamError('close', state));
    }
    TEMP_ASSERT(state === WRITABLE,
                'state is "writable".');
    const promise = WritableStreamAddWriteRequest(stream);
    if (WritableStreamDefaultControllerGetBackpressure(
        stream[_writableStreamController])) {
      v8.resolvePromise(writer[_readyPromise], undefined);
    }
    stream[_state] = CLOSING;
    WritableStreamDefaultControllerClose(stream[_writableStreamController]);
    return promise;
  }
  function WritableStreamDefaultWriterGetDesiredSize(writer) {
    const stream = writer[_ownerWritableStream];
    const state = stream[_state];
    if (state === ERRORED) {
      return null;
    }
    if (state === CLOSED) {
      return 0;
    }
    return WritableStreamDefaultControllerGetDesiredSize(
        stream[_writableStreamController]);
  }
  function WritableStreamDefaultWriterRelease(writer) {
    const stream = writer[_ownerWritableStream];
    TEMP_ASSERT(stream !== undefined,
                'stream is not undefined.');
    TEMP_ASSERT(stream[_writer] === writer,
                'stream.[[writer]] is writer.');
    const releasedError = new TypeError(errReleasedWriterClosedPromise);
    const state = stream[_state];
    if (state === WRITABLE || state === CLOSING) {
      v8.rejectPromise(writer[_closedPromise], releasedError);
    } else {
      writer[_closedPromise] = Promise_reject(releasedError);
    }
    if (state === WRITABLE &&
        WritableStreamDefaultControllerGetBackpressure(
            stream[_writableStreamController])) {
      v8.rejectPromise(writer[_readyPromise], releasedError);
    } else {
      writer[_readyPromise] = Promise_reject(releasedError);
    }
    stream[_writer] = undefined;
    writer[_ownerWritableStream] = undefined;
  }
  function WritableStreamDefaultWriterWrite(writer, chunk) {
    const stream = writer[_ownerWritableStream];
    TEMP_ASSERT(stream !== undefined,
                'stream is not undefined.');
    const state = stream[_state];
    if (state === CLOSED || state === ERRORED) {
      return Promise_reject(
          createCannotActionOnStateStreamError('write to', state));
    }
    TEMP_ASSERT(state === WRITABLE,
                'state is "writable".');
    const promise = WritableStreamAddWriteRequest(stream);
    WritableStreamDefaultControllerWrite(stream[_writableStreamController],
                                         chunk);
    return promise;
  }
  class WritableStreamDefaultController {
    constructor(stream, underlyingSink, size, highWaterMark) {
      if (!IsWritableStream(stream)) {
        throw new TypeError(errIllegalConstructor);
      }
      if (stream[_writableStreamController] !== undefined) {
        throw new TypeError(errIllegalConstructor);
      }
      this[_controlledWritableStream] = stream;
      this[_underlyingSink] = underlyingSink;
      this[_queue] = new v8.InternalPackedArray();
      this[_queueSize] = 0;
      this[_defaultControllerFlags] = 0;
      const normalizedStrategy =
          ValidateAndNormalizeQueuingStrategy(size, highWaterMark);
      this[_strategySize] = normalizedStrategy.size;
      this[_strategyHWM] = normalizedStrategy.highWaterMark;
      const backpressure = WritableStreamDefaultControllerGetBackpressure(this);
      if (backpressure) {
        WritableStreamUpdateBackpressure(stream, backpressure);
      }
      const controller = this;
      const startResult = InvokeOrNoop(underlyingSink, 'start', [this]);
      const onFulfilled = () => {
        setDefaultControllerStartedFlag(controller, true);
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      };
      const onRejected = r => {
        WritableStreamDefaultControllerErrorIfNeeded(controller, r);
      };
      thenPromise(Promise_resolve(startResult), onFulfilled, onRejected);
    }
    error(e) {
      if (!IsWritableStreamDefaultController(this)) {
        throw new TypeError(errIllegalInvocation);
      }
      const state = this[_controlledWritableStream][_state];
      if (state === CLOSED || state === ERRORED) {
        throw createCannotActionOnStateStreamError('error', state);
      }
      WritableStreamDefaultControllerError(this, e);
    }
  }
  function IsWritableStreamDefaultController(x) {
    return hasOwnProperty(x, _underlyingSink);
  }
  function WritableStreamDefaultControllerAbort(controller, reason) {
    controller[_queue] = v8.InternalPackedArray();
    controller[_queueSize] = 0;
    const sinkAbortPromise =
        PromiseInvokeOrFallbackOrNoop(controller[_underlyingSink],
                                      'abort', [reason], 'close', [controller]);
    return thenPromise(sinkAbortPromise, () => undefined);
  }
  function WritableStreamDefaultControllerClose(controller) {
    EnqueueValueWithSizeForController(controller, 'close', 0);
    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }
  function WritableStreamDefaultControllerGetDesiredSize(controller) {
    const queueSize = GetTotalQueueSizeForController(controller);
    return controller[_strategyHWM] - queueSize;
  }
  function WritableStreamDefaultControllerWrite(controller, chunk) {
    const stream = controller[_controlledWritableStream];
    TEMP_ASSERT(stream[_state] === WRITABLE,
                'stream.[[state]] is "writable".');
    let chunkSize = 1;
    if (controller[_strategySize] !== undefined) {
      try {
        chunkSize = Function_call(controller[_strategySize], undefined, chunk);
      } catch (e) {
        WritableStreamDefaultControllerErrorIfNeeded(controller, e);
        return Promise_reject(e);
      }
    }
    const writeRecord = {chunk};
    const lastBackpressure =
        WritableStreamDefaultControllerGetBackpressure(controller);
    try {
      const enqueueResult =
          EnqueueValueWithSizeForController(controller, writeRecord, chunkSize);
    } catch (e) {
      WritableStreamDefaultControllerErrorIfNeeded(controller, e);
      return Promise_reject(e);
    }
    if (stream[_state] === WRITABLE) {
      const backpressure =
          WritableStreamDefaultControllerGetBackpressure(controller);
      if (lastBackpressure !== backpressure) {
        WritableStreamUpdateBackpressure(stream, backpressure);
      }
    }
    WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
  }
  function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
    const state = controller[_controlledWritableStream][_state];
    if (state === CLOSED || state === ERRORED) {
      return;
    }
    if (!getDefaultControllerStartedFlag(controller)) {
      return;
    }
    if (getDefaultControllerWritingFlag(controller)) {
      return;
    }
    if (controller[_queue].length === 0) {
      return;
    }
    const writeRecord = PeekQueueValue(controller[_queue]);
    if (writeRecord === 'close') {
      WritableStreamDefaultControllerProcessClose(controller);
    } else {
      WritableStreamDefaultControllerProcessWrite(controller,
                                                  writeRecord.chunk);
    }
  }
  function WritableStreamDefaultControllerErrorIfNeeded(controller, e) {
    const state = controller[_controlledWritableStream][_state];
    if (state === WRITABLE || state === CLOSING) {
      WritableStreamDefaultControllerError(controller, e);
    }
  }
  function WritableStreamDefaultControllerProcessClose(controller) {
    const stream = controller[_controlledWritableStream];
    TEMP_ASSERT(stream[_state] === CLOSING,
                'stream.[[state]] is "closing".');
    DequeueValueForController(controller);
    TEMP_ASSERT(controller[_queue].length === 0,
                'controller.[[queue]] is empty.');
    const sinkClosePromise = PromiseInvokeOrNoop(controller[_underlyingSink],
                                               'close', [controller]);
    thenPromise(sinkClosePromise,
                () => {
                  if (stream[_state] !== CLOSING) {
                    return;
                  }
                  WritableStreamFulfillWriteRequest(stream);
                  WritableStreamFinishClose(stream);
                },
                r => WritableStreamDefaultControllerErrorIfNeeded(controller, r)
               );
  }
  function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
    setDefaultControllerWritingFlag(controller, true);
    const sinkWritePromise = PromiseInvokeOrNoop(controller[_underlyingSink],
                                               'write', [chunk, controller]);
    thenPromise(
        sinkWritePromise,
        () => {
          const stream = controller[_controlledWritableStream];
          const state = stream[_state];
          if (state === ERRORED || state === CLOSED) {
            return;
          }
          setDefaultControllerWritingFlag(controller, false);
          WritableStreamFulfillWriteRequest(stream);
          const lastBackpressure =
              WritableStreamDefaultControllerGetBackpressure(controller);
          DequeueValueForController(controller);
          if (state !== CLOSING) {
            const backpressure =
                WritableStreamDefaultControllerGetBackpressure(controller);
            if (lastBackpressure !== backpressure) {
              WritableStreamUpdateBackpressure(
                  controller[_controlledWritableStream], backpressure);
            }
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        },
        r => WritableStreamDefaultControllerErrorIfNeeded(controller, r)
        );
  }
  function WritableStreamDefaultControllerGetBackpressure(controller) {
    const desiredSize =
        WritableStreamDefaultControllerGetDesiredSize(controller);
    return desiredSize <= 0;
  }
  function WritableStreamDefaultControllerError(controller, e) {
    const stream = controller[_controlledWritableStream];
    const state = stream[_state];
    TEMP_ASSERT(state === WRITABLE || state === CLOSING,
                'stream.[[state]] is "writable" or "closing".');
    WritableStreamError(stream, e);
    controller[_queue] = new v8.InternalPackedArray();
    controller[_queueSize] = 0;
  }
  function DequeueValueForController(controller) {
    TEMP_ASSERT(controller[_queue].length !== 0,
                'queue is not empty.');
    const result = controller[_queue].shift();
    controller[_queueSize] -= result.size;
    return result.value;
  }
  function EnqueueValueWithSizeForController(controller, value, size) {
    size = Number(size);
    if (!IsFiniteNonNegativeNumber(size)) {
      throw new RangeError(errInvalidSize);
    }
    controller[_queueSize] += size;
    controller[_queue].push({value, size});
  }
  function GetTotalQueueSizeForController(controller) {
    return controller[_queueSize];
  }
  function PeekQueueValue(queue) {
    TEMP_ASSERT(queue.length !== 0,
                'queue is not empty.');
    return queue[0].value;
  }
  function InvokeOrNoop(O, P, args) {
    TEMP_ASSERT(IsPropertyKey(P),
                'P is a valid property key.');
    if (args === undefined) {
      args = [];
    }
    const method = O[P];
    if (method === undefined) {
      return undefined;
    }
    if (typeof method !== 'function') {
      throw new TypeError(templateErrorIsNotAFunction(P));
    }
    return Function_apply(method, O, args);
  }
  function IsFiniteNonNegativeNumber(v) {
    return Number_isFinite(v) && v >= 0;
  }
  function PromiseInvokeOrFallbackOrNoop(O, P1, args1, P2, args2) {
    TEMP_ASSERT(IsPropertyKey(P1),
                'P1 is a valid property key.');
    TEMP_ASSERT(IsPropertyKey(P2),
                'P2 is a valid property key.');
    try {
      const method = O[P1];
      if (method === undefined) {
        return PromiseInvokeOrNoop(O, P2, args2);
      }
      if (typeof method !== 'function') {
        return Promise_reject(new TypeError(templateErrorIsNotAFunction(P1)));
      }
      return Promise_resolve(Function_apply(method, O, args1));
    } catch (e) {
      return Promise_reject(e);
    }
  }
  function PromiseInvokeOrNoop(O, P, args) {
    try {
      return Promise_resolve(InvokeOrNoop(O, P, args));
    } catch (e) {
      return Promise_reject(e);
    }
  }
  function ValidateAndNormalizeQueuingStrategy(size, highWaterMark) {
    if (size !== undefined && typeof size !== 'function') {
      throw new TypeError(errSizeNotAFunction);
    }
    highWaterMark = Number(highWaterMark);
    if (Number_isNaN(highWaterMark) || highWaterMark < 0) {
      throw new RangeError(errInvalidHWM);
    }
    return {size, highWaterMark};
  }
  defineProperty(global, 'WritableStream', {
    value: WritableStream,
    enumerable: false,
    configurable: true,
    writable: true
  });
});

# To change mermaid.min.js for IE11

Arrow functions must be replaced manually for IE11 to be able to read the
file with no syntax errors. Here are examples for replacing functions:

Find: o=(t,e)=>
Replace: o=function(t,e)

Find: t.exports=({length:t,type:e,characters:n})=>{
Replace: t.exports=function(obj){var t=obj.length;var e=obj.type;var n=obj.characters;

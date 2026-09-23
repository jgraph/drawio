#!/usr/bin/env node
// Bounded, uninstrumented model/replay checks for the ancestry-cycle hang.
// Optional source tree argument permits the same checks against the base.
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var root = path.resolve(process.argv[2] || path.join(__dirname, '../..'));
var base = path.join(root, 'src/main/webapp');
var context = vm.createContext({assert: require('assert')});
vm.runInContext(`
var mxEvent = {};
var mxUtils = {
 isNumeric: function(v) { return v != null && !isNaN(Number(v)); },
 extend: function(sub, sup) { sub.prototype = Object.create(sup.prototype); sub.prototype.constructor = sub; },
 indexOf: function(a, v) { return a.indexOf(v); },
 isNode: function() { return false; },
 bind: function(s, f) { return f.bind(s); }
};
function EditorUi() {}
EditorUi.debug = function() {};
`, context);
[
 'util/mxPoint.js', 'util/mxRectangle.js', 'util/mxEventSource.js',
 'util/mxEventObject.js', 'util/mxUndoableEdit.js', 'model/mxGeometry.js',
 'model/mxCell.js', 'model/mxGraphModel.js'
].forEach(function(file)
{
 vm.runInContext(fs.readFileSync(path.join(base, 'mxgraph/src', file), 'utf8'), context,
  {filename: file});
});
var source = fs.readFileSync(path.join(base, 'js/diagramly/EditorUi.js'), 'utf8');
var start = source.indexOf('\tvar repairAbsoluteOrigin = function');
var end = source.indexOf('\tvar editorUiUndo = EditorUi.prototype.undo;', start);
if (start < 0 || end < 0) { throw new Error('Replay wrapper boundaries not found'); }
vm.runInContext(source.substring(start, end), context, {filename: 'EditorUi-replay.js'});
var pagesSource = fs.readFileSync(path.join(base, 'js/diagramly/Pages.js'), 'utf8');
var pagesEnd = pagesSource.indexOf('function ReplaceDiagram(');
if (pagesEnd < 0) { throw new Error('Page replay wrapper boundary not found'); }
vm.runInContext(pagesSource.substring(0, pagesEnd), context, {filename: 'Pages-replay.js'});
vm.runInContext(`
function vertex(m, parent, id) {
 var cell = new mxCell(id, new mxGeometry(10, 20, 80, 60));
 cell.setVertex(true); cell.setId(id); m.add(parent, cell); return cell;
}
function fixture() {
 var model = new mxGraphModel(); model.maintainEdgeParent = false;
 var layer = model.root.getChildAt(0);
 var g = vertex(model, layer, 'g'), x = vertex(model, g, 'x');
 return {m:model, layer:layer, g:g, x:x};
}
function record(m, changes) {
 var edit = new mxUndoableEdit(m);
 changes.forEach(function(change) { change.execute(); edit.add(change); });
 return edit;
}
function page(id, root) {
 return {root:root, getId:function(){return id;}, setDiagramModified:function(){}};
}
function documentFixture() {
 var f=fixture(), other=fixture();
 var home=page('home',f.m.root), away=page('away',other.m.root), file={};
 var ui={pages:[home,away], currentPage:home, getCurrentFile:function(){return file;}};
 ui.editor={graph:{model:f.m}, fireEvent:function(){}}; f.m.repairUi=ui;
 f.ui=ui; f.home=home; f.away=away; f.other=other;
 return f;
}
`, context);
var cases = {
 'composite-cycle': `
 var f=fixture(), m=f.m;
 var moved=new mxGeometry(800,30,80,60);
 var edit=record(m,[new mxGeometryChange(m,f.x,moved),new mxChildChange(m,f.layer,f.x,0)]);
 m.parentForCellChanged(f.g,f.x,0);
 edit.undo();
 assert.strictEqual(f.x.parent,f.layer); assert.strictEqual(f.g.parent,f.x);
 assert.strictEqual(f.x.geometry,moved); assert.strictEqual(edit.undone,true);
 m.parentForCellChanged(f.g,f.layer,0);
 edit.redo(); assert.strictEqual(f.x.geometry,moved); // paired redo stays inert
 edit.undo(); assert.strictEqual(f.x.parent,f.g); assert.strictEqual(f.x.geometry.x,10);
 edit.redo(); assert.strictEqual(f.x.parent,f.layer); assert.strictEqual(f.x.geometry,moved);
 `,
 'direct-cycle': `
 var f=fixture(), ch=new mxChildChange(f.m,f.layer,f.x,0); ch.execute();
 f.m.parentForCellChanged(f.g,f.x,0);
 ch.execute(); assert.strictEqual(f.x.parent,f.layer); assert.strictEqual(ch.repairIntent.next,'redo');
 ch.execute(); assert.strictEqual(f.x.parent,f.layer); assert.strictEqual(ch.repairIntent.next,'undo');
 f.m.parentForCellChanged(f.g,f.layer,0);
 ch.execute(); assert.strictEqual(f.x.parent,f.g);
 `,
 'direct-self-parent': `
 var f=fixture(), ch=new mxChildChange(f.m,f.layer,f.x,0); ch.execute();
 ch.repairIntent.ids.undo='x'; ch.repairIntent.objs.undo=f.x;
 ch.execute(); assert.strictEqual(f.x.parent,f.layer);
 `,
 'detached-direct-cycle': `
 var f=fixture(), ch=new mxChildChange(f.m,f.layer,f.x,0); ch.execute();
 f.m.parentForCellChanged(f.g,f.x,0); f.m.parentForCellChanged(f.x,null,0);
 ch.execute(); assert.strictEqual(f.x.parent,null); assert.strictEqual(f.g.parent,f.x);
 assert.strictEqual(repairParentQueue.length,0);
 `,
 'canonical-parent-cycle': `
 var f=fixture(), m=f.m, edit=record(m,[new mxChildChange(m,f.layer,f.x,0)]);
 m.parentForCellChanged(f.g,null,0); var revived=vertex(m,f.x,'g');
 edit.undo(); assert.strictEqual(f.x.parent,f.layer); assert.strictEqual(revived.parent,f.x);
 assert.strictEqual(f.g.parent,null); assert.strictEqual(edit.changes[0].repairIntent.objs.undo,f.g);
 m.parentForCellChanged(revived,f.layer,0); edit.redo(); edit.undo();
 assert.strictEqual(f.x.parent,revived); assert.strictEqual(m.getCell('g'),revived);
 `,
 'deep-cycle': `
 var f=fixture(), m=f.m, h=vertex(m,f.x,'h');
 var edit=record(m,[new mxChildChange(m,f.layer,f.x,0)]);
 m.parentForCellChanged(f.g,h,0);
 edit.undo(); assert.strictEqual(f.x.parent,f.layer); assert.strictEqual(f.g.parent,h);
 edit.redo(); edit.undo(); assert.strictEqual(f.x.parent,f.layer);
 `,
 'detached-parent-restoration': `
 var f=fixture(), m=f.m;
 var edit=record(m,[new mxChildChange(m,null,f.g,0),new mxChildChange(m,null,f.x,0)]);
 for(var i=0;i<3;i++) {
  edit.undo(); assert.strictEqual(f.g.parent,f.layer); assert.strictEqual(f.x.parent,f.g);
  assert.strictEqual(m.getCell('x'),f.x);
  edit.redo(); assert.strictEqual(f.x.parent,null); assert.strictEqual(f.g.parent,null);
 }
 `,
 'canonical-pruning': `
 var f=fixture(), m=f.m;
 var edit=record(m,[new mxChildChange(m,null,f.g,0)]);
 var live=vertex(m,f.layer,'x');
 edit.undo(); assert.strictEqual(m.getCell('x'),live); assert.strictEqual(f.x.parent,null);
 assert.strictEqual(f.x.id,'x'); assert.strictEqual(f.g.getChildCount(),0);
 edit.redo(); edit.undo(); assert.strictEqual(m.getCell('x'),live);
 `,
 'revived-page-cycle': `
 var f=documentFixture(), m=f.m, moved=new mxGeometry(800,30,80,60);
 var edit=record(m,[new mxGeometryChange(m,f.x,moved),new mxChildChange(m,f.layer,f.x,0)]);
 var fresh=fixture(); fresh.m.parentForCellChanged(fresh.x,fresh.layer,0);
 fresh.x.geometry=new mxGeometry(800,30,80,60); fresh.m.parentForCellChanged(fresh.g,fresh.x,0);
 f.ui.pages[0]=page('home',fresh.m.root); f.ui.currentPage=f.away; m.rootChanged(f.away.root);
 edit.undo(); assert.strictEqual(fresh.x.parent,fresh.layer); assert.strictEqual(fresh.x.geometry.x,800);
 assert.strictEqual(f.other.x.geometry.x,10); assert.strictEqual(f.x.geometry,moved);
 assert.strictEqual(edit.repairSkippedDirection,'undo');
 fresh.m.parentForCellChanged(fresh.g,fresh.layer,0);
 edit.redo(); edit.undo(); assert.strictEqual(fresh.x.parent,fresh.g);
 assert.strictEqual(fresh.x.geometry.x,10); assert.strictEqual(f.other.x.geometry.x,10);
 `,
 'absent-page-mixed-edit': `
 var f=documentFixture(), m=f.m;
 var edit=record(m,[new mxChildChange(m,f.layer,f.x,0),new mxValueChange(m,f.other.x,'changed')]);
 m.parentForCellChanged(f.g,f.x,0);
 f.ui.pages=[f.away]; f.ui.currentPage=f.away; m.rootChanged(f.away.root);
 edit.undo(); assert.strictEqual(f.other.x.value,'x'); assert.strictEqual(f.x.parent,f.layer);
 assert.strictEqual(f.g.parent,f.x); assert.strictEqual(edit.repairSkippedDirection,undefined);
 assert.strictEqual(edit.changes[0].repairIntent.next,'redo');
 edit.redo(); assert.strictEqual(f.other.x.value,'changed'); assert.strictEqual(f.x.parent,f.layer);
 `,
 'different-file-cycle': `
 var f=documentFixture(), m=f.m;
 var edit=record(m,[new mxChildChange(m,f.layer,f.x,0)]);
 m.parentForCellChanged(f.g,f.x,0);
 f.ui.getCurrentFile=function(){return replacement;}; var replacement={};
 edit.undo(); assert.strictEqual(f.x.parent,f.layer); assert.strictEqual(f.g.parent,f.x);
 assert.strictEqual(edit.repairSkippedDirection,undefined);
 assert.strictEqual(edit.changes[0].repairIntent.next,'redo');
 `,
 'page-restore-before-cycle': `
 var f=documentFixture(), m=f.m;
 var edit=record(m,[new mxGeometryChange(m,f.x,new mxGeometry(800,30,80,60)),
  new mxChildChange(m,f.layer,f.x,0), new ChangePage(f.ui,f.home,null,null,true)]);
 f.ui.currentPage=f.away; m.rootChanged(f.away.root);
 m.parentForCellChanged(f.g,f.x,0);
 edit.undo(); assert.strictEqual(f.ui.pages.indexOf(f.home),-1);
 assert.strictEqual(f.x.geometry.x,800); assert.strictEqual(edit.repairSkippedDirection,'undo');
 m.parentForCellChanged(f.g,f.layer,0); edit.redo(); edit.undo();
 assert.strictEqual(f.ui.pages.indexOf(f.home),0); assert.strictEqual(f.x.parent,f.g);
 assert.strictEqual(f.x.geometry.x,10);
 `,
 'page-replacement-before-child': `
 var f=documentFixture(), m=f.m, replacement=fixture();
 replacement.m.parentForCellChanged(replacement.x,replacement.layer,0);
 replacement.m.parentForCellChanged(replacement.g,replacement.x,0);
 var next=page('home',replacement.m.root);
 var edit=record(m,[new mxChildChange(m,f.layer,f.x,0),
  new ChangePage(f.ui,f.home,null,null,true), new ChangePage(f.ui,next,null,0,true)]);
 f.ui.currentPage=f.away; m.rootChanged(f.away.root);
 edit.undo(); assert.strictEqual(f.ui.pages[0],f.home); assert.strictEqual(f.x.parent,f.g);
 assert.strictEqual(replacement.g.parent,replacement.x);
 assert.strictEqual(edit.repairSkippedDirection,undefined);
 edit.redo(); assert.strictEqual(f.ui.pages[0],next); assert.strictEqual(f.x.parent,f.layer);
 `,
 'root-context': `
 var f=fixture(), m=f.m, old=m.root, other=fixture();
 // The first child replay resolves against the other root. A following
 // root swap changes the meaning of its detached context on the undo.
 var edit=record(m,[new mxChildChange(m,f.layer,f.x,0),new mxRootChange(m,other.m.root)]);
 other.m.parentForCellChanged(other.x,other.layer,0);
 other.m.parentForCellChanged(other.g,other.x,0);
 edit.undo(); assert.strictEqual(m.root,old); assert.strictEqual(f.x.parent,f.g);
 edit.redo(); assert.strictEqual(m.root,other.m.root); assert.strictEqual(f.x.parent,f.layer);
 `
};
var failed = 0;
Object.keys(cases).forEach(function(name)
{
 try {
  vm.runInContext('repairParentQueue = []; (function(){' + cases[name] + '})();', context, {timeout: 1500, filename: name});
  console.log('PASS ' + name);
 } catch (error) {
  failed++;
  console.error('FAIL ' + name + ': ' + error.message);
 }
});
process.exitCode = failed ? 1 : 0;

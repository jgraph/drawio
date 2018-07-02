class Program {
    constructor() {
        this.statements = []
    }
    emitOp(op) {
        this.statements.push(op)
    }
    emitStart() {
        this.emitOp({op:"start"})
    }
    emitEnd() {
        this.emitOp({op:"end"})
    }
    emitCall(action, parameters) {
        this.emitOp({op:"action", action, parameters})
    }
    emitIf(expression) {
        this.emitOp({op:"if", expression})
    }
    emitElse() {
        this.emitOp({op:"else"})
    }
    emitEndIf() {
        this.emitOp({op:"endif"})
    }
    emitSwitch(expression) {
        this.emitOp({op:"switch", expression})
    }
    emitEndSwitch() {
        this.emitOp({op:"endswitch"})
    }
    emitCase(label) {
        this.emitOp({op:"case", label})
    }
    emitBreak() {
        this.emitOp({op:"break"})
    }
    emitDefault() {
        this.emitOp({op:"default"})
    }
    emitFor(expression) {
        this.emitOp({op:"for", expression})
    }
    emitForeach(expression) {
        this.emitOp({op:"foreach", expression})
    }
    emitGoto(label) {
        this.emitOp({op:"goto", label})
    }
    emitLabel(label) {
        this.emitOp({op:"label", label})
    }
    emitParameters(parameters) {
        this.emitOp({op:"parameters", parameters})
    }
    emitAsync(verb, parameters) {
        this.emitOp({op:"async", verb, parameters})
    }
    emitInsertion(reference) {
        this.emitOp({op:"insertion", reference})
    }
}



const NAMES = {
    _NS: "io.dcdc.drakon",
    START: "shapeStart",
    END: "shapeEnd",
    ACTION: "shapeAction",
    QUESTION: "shapeQuestion",
    CHOICE: "shapeChoice",
    CASE: "shapeCase",
    GOTO: "shapeGoto",
    LABEL: "shapeLabel",
    INSERTION: "shapeInsertion",
    SHELF: "shapeShelf",
    PARAMETERS: "shapeParameters",
    FORBEGIN: "shapeBeginFor",
    FOREND: "shapeEndFor",
    OUTPUT: "shapeOutput",
    INPUT: "shapeInput",
    PAUSE: "shapePause",
    PERIOD:"shapePeriod",
    STARTTIMER:"shapeStartTimer",
    SYNCRONISER:"shapeSynchroniser",
    ASYNC:"shapeAsync", // realtime parallel proc
    COMMENT: "shapeComment", // inline = default, right, left
    // LOOP is taken care of through edges (when a-b-c and c connects to a for example)
    // SILHOUETTE is virtual
    // CONNECTOR ???
    // CONCURRENTPROC is an edge type (when a node connect to more than one other child node that connection becomes paralleled)
}

function findTerminators(route) {
    var terms = []
    if (!route.children || route.children.length == 0)
        terms.push(route)
    else
        return [...route.children.map(findTerminators).reduce((a, b) => a.concat(b), [])]
    return terms
}

function generateSource(ui) {
    var children = ui.editor.graph.model.root.children[0].children
    var state = ui.editor.graph.view.getState.bind(ui.editor.graph.view)
    var nodes = children.map(state).filter(c => c.shape.cst && c.shape.cst.NS == NAMES._NS)
    
    // 0. find starts
    var starts = nodes.filter(s => s.shape.cst.NAME == NAMES.START)

    // 1. for each start walk all connected nodes
    var routes = []
    for (var i in starts) {
        var walk = (self, level = 0) => {
            var targets = self.edges.filter(x => x.source == self).map(e => e.target)
            return {
                type: state(self).shape.cst.NAME,
                self,
                children: targets.map(t => walk(t, level + 1)),
                level
            }
        }

        routes.push(walk(starts[i].cell))
    }


    // 2. any remaining nodes mean there is orphaned nodes (error)
    // 3. ignoring subroutines, any node that connects to more than one start is illegal (error/warning-make sub routine)
    // 4. ensure all groups start with a start
    for (var route of routes) {
        if (route.type !== NAMES.START) {
            console.error("Route does not start with " + NAMES.START)
        }
    }
    // 5. ensure all groups end with an end (at all ends)
    for (var route of routes) {
        var terms = findTerminators(route)
        for (var t of terms) { 
            if (t.type !== NAMES.END) {
                console.error(NAMES.END + " expected at termination of route")
            }
        }
    }
    // 6. a route with more than one end is illegal (error/warning-make one end)
    // 7. make sure starts are not targets on any edges (except parameters? parameters bi0drectional?)

    console.log(routes)

    // generate AST
    for (var route of routes) {
        var prog = new Program()        
        prog.emitStart()
        var l = 1
        var c = 1
        var state = NAMES.START

        var visit = nodes => {
            //if (nodes.length == 0) {
            //    prog.emitEnd()
            //}
            for (var node of nodes) {
                switch (node.type) {
                    case NAMES.ACTION:
                        prog.emitCall(node.self.value)
                        visit(node.children)
                        break
                    case NAMES.QUESTION:
                        if (node.children.length !== 2)
                            throw "QUESTION expects 2 children"
                        prog.emitIf(node.self.value)
                        visit([node.children[0]])
                        prog.emitElse()
                        visit([node.children[1]])
                        prog.emitEndIf()
                        break
                    case NAMES.CHOICE:
                        if (node.children.length < 1)
                            throw "CHOICE expects 1 or more children"
                        if (node.children.map(n => n.type !== NAMES.CASE).reduce((a, b) => a || b))
                            throw "CHOICE child nodes must be of type CASE"                        
                        prog.emitSwitch(node.self.value)
                        for (cnode of node.children) {
                            visit([cnode])
                        }
                        prog.emitEndSwitch()
                        break
                    case NAMES.CASE:                  
                        prog.emitCase(node.self.value)
                        visit(node.children)
                        prog.emitBreak()
                        break
                    case NAMES.GOTO:
                        if (node.children.length > 0)
                            throw "GOTO does not require connected children"
                        prog.emitGoto(node.self.value)
                        break
                    case NAMES.LABEL:
                        prog.emitLabel(node.self.value)
                        break
                    case NAMES.INSERTION:
                        prog.emitInsertion(node.self.value)
                        visit(node.children)
                        break
                    case NAMES.END:
                        if (node.children.length > 0)
                            throw "END cannot flow to another node"
                        prog.emitEnd()
                        break
                    default:
                        break
                }
            }
        }

        visit(route.children)
        console.log(prog)
    }
}

Draw.loadPlugin(function(ui) {
    window.ui = ui

    /* shape END */
    function shapeEnd(bounds, fill, stroke, strokeWidth)
    {
        mxShape.call(this)
        this.bounds = bounds
        this.fill = fill
        this.stroke = stroke
        this.strokeWidth = strokeWidth        
    }
    mxUtils.extend(shapeEnd, mxActor)
    shapeEnd.prototype.cst = { NS: NAMES._NS, NAME: NAMES.END, FULLNAME: `${NAMES._NS}.${NAMES.END}` }
    shapeEnd.prototype.paintVertexShape = function(c, x, y, w, h) {
        c.translate(x, y);
        x = 0; y = 0;
        var radius = Math.min(h, w) / 2;
        c.begin();
        c.moveTo(x + radius, y);
        c.lineTo(x + w - radius, y);
        c.quadTo(x + w, y, x + w, y + radius);
        c.lineTo(x + w, y + h - radius);
        c.quadTo(x + w, y + h, x + w - radius, y + h);
        c.lineTo(x + radius, y + h);
        c.quadTo(x, y + h, x, y + h - radius);
        c.lineTo(x, y + radius);
        c.quadTo(x, y, x + radius, y);
        c.close();        
        c.fillAndStroke();
    }
    mxCellRenderer.registerShape(shapeEnd.prototype.cst.FULLNAME, shapeEnd)
    shapeEnd.prototype.constraints = null
    /* */

    /* shape ACTION */
    function shapeAction(bounds, fill, stroke, strokeWidth)
    {
        mxShape.call(this)
        this.bounds = bounds
        this.fill = fill
        this.stroke = stroke
        this.strokeWidth = strokeWidth        
    }
    mxUtils.extend(shapeAction, mxActor)
    shapeAction.prototype.cst = { NS: NAMES._NS, NAME: NAMES.ACTION, FULLNAME: `${NAMES._NS}.${NAMES.ACTION}` }
    shapeAction.prototype.paintVertexShape = function(c, x, y, w, h) {
        c.translate(x, y);
        x = 0; y = 0;
        
        c.begin();
        c.moveTo(x, y);
        c.lineTo(x + w, y);
        c.lineTo(x + w, y + h);
        c.lineTo(x, y + h);
        c.lineTo(x, y);
        c.close();        
        c.fillAndStroke();
    }
    mxCellRenderer.registerShape(shapeAction.prototype.cst.FULLNAME, shapeAction)
    shapeAction.prototype.constraints = null
    /* */

    /* shape QUESTION */
    function shapeQuestion(bounds, fill, stroke, strokeWidth)
    {
        mxShape.call(this)
        this.bounds = bounds
        this.fill = fill
        this.stroke = stroke
        this.strokeWidth = strokeWidth        
    }
    mxUtils.extend(shapeQuestion, mxActor)
    shapeQuestion.prototype.cst = { NS: NAMES._NS, NAME: NAMES.QUESTION, FULLNAME: `${NAMES._NS}.${NAMES.QUESTION}` }
    shapeQuestion.prototype.paintVertexShape = function(c, x, y, w, h) {
        c.translate(x, y);
        x = 0; y = 0;
        
        c.begin();
        c.moveTo(x, h / 2);
        c.lineTo(x + h / 2, y)
        c.lineTo(x + w - h / 2, y)
        c.lineTo(x + w, y + h / 2);
        c.lineTo(x + w - h / 2, y + h);
        c.lineTo(x + h / 2, y + h);
        c.lineTo(x, y + h / 2);
        c.close();        
        c.fillAndStroke();
    }
    mxCellRenderer.registerShape(shapeQuestion.prototype.cst.FULLNAME, shapeQuestion)
    shapeQuestion.prototype.constraints = null
    /* */

    /* shape CHOICE */
    function shapeChoice(bounds, fill, stroke, strokeWidth)
    {
        mxShape.call(this)
        this.bounds = bounds
        this.fill = fill
        this.stroke = stroke
        this.strokeWidth = strokeWidth        
    }
    mxUtils.extend(shapeChoice, mxActor)
    shapeChoice.prototype.cst = { NS: NAMES._NS, NAME: NAMES.CHOICE, FULLNAME: `${NAMES._NS}.${NAMES.CHOICE}` }
    shapeChoice.prototype.paintVertexShape = function(c, x, y, w, h) {
        c.translate(x, y);
        x = 0; y = 0;
        
        c.begin();
        c.moveTo(x + h / 2, y);
        c.lineTo(x + w, y);
        c.lineTo(x + w - h / 2, y + h);
        c.lineTo(x, y + h);
        c.lineTo(x + h / 2, y);
        c.close();        
        c.fillAndStroke();
    }
    mxCellRenderer.registerShape(shapeChoice.prototype.cst.FULLNAME, shapeChoice)
    shapeChoice.prototype.constraints = null
    /* */

    /* shape CASE */
    function shapeCase(bounds, fill, stroke, strokeWidth)
    {
        mxShape.call(this)
        this.bounds = bounds
        this.fill = fill
        this.stroke = stroke
        this.strokeWidth = strokeWidth        
    }
    mxUtils.extend(shapeCase, mxActor)
    shapeCase.prototype.cst = { NS: NAMES._NS, NAME: NAMES.CASE, FULLNAME: `${NAMES._NS}.${NAMES.CASE}` }
    shapeCase.prototype.paintVertexShape = function(c, x, y, w, h) {
        c.translate(x, y);
        x = 0; y = 0;
        
        c.begin();
        c.moveTo(x, y);
        c.lineTo(x + w, y);
        c.lineTo(x + w, y + h * 0.66);
        c.lineTo(x, y + h * 0.66);
        c.lineTo(x, y);
        c.moveTo(x, y + h * 0.66)
        c.lineTo(x + w / 2, y + h)
        c.lineTo(x + w, y + h * 0.66)
        c.close();      
        c.fillAndStroke();
    }
    mxCellRenderer.registerShape(shapeCase.prototype.cst.FULLNAME, shapeCase)
    shapeCase.prototype.constraints = null
    /* */

    /* shape GOTO (HEADLINE) */
    function shapeGoto(bounds, fill, stroke, strokeWidth)
    {
        mxShape.call(this)
        this.bounds = bounds
        this.fill = fill
        this.stroke = stroke
        this.strokeWidth = strokeWidth        
    }
    mxUtils.extend(shapeGoto, mxActor)
    shapeGoto.prototype.cst = { NS: NAMES._NS, NAME: NAMES.GOTO, FULLNAME: `${NAMES._NS}.${NAMES.GOTO}` }
    shapeGoto.prototype.paintVertexShape = function(c, x, y, w, h) {
        c.translate(x, y);
        x = 0; y = 0;
        
        c.begin();
        c.moveTo(x, y + h);
        c.lineTo(x, y + h * 0.33)
        c.lineTo(x + w / 2, y)
        c.lineTo(x + w, y + h * 0.33)
        c.lineTo(x + w, y + h)
        c.lineTo(x, y + h)
        c.close();      
        c.fillAndStroke();
    }
    mxCellRenderer.registerShape(shapeGoto.prototype.cst.FULLNAME, shapeGoto)
    shapeGoto.prototype.constraints = null
    /* */

        /* shape LABEL */
        function shapeLabel(bounds, fill, stroke, strokeWidth)
        {
            mxShape.call(this)
            this.bounds = bounds
            this.fill = fill
            this.stroke = stroke
            this.strokeWidth = strokeWidth        
        }
        mxUtils.extend(shapeLabel, mxActor)
        shapeLabel.prototype.cst = { NS: NAMES._NS, NAME: NAMES.LABEL, FULLNAME: `${NAMES._NS}.${NAMES.LABEL}` }
        shapeLabel.prototype.paintVertexShape = function(c, x, y, w, h) {
            c.translate(x, y);
            x = 0; y = 0;
            
            c.begin();
            c.moveTo(x, y);
            c.lineTo(x + w, y);
            c.lineTo(x + w, y + h * 0.66);
            c.lineTo(x + w / 2, h)
            c.lineTo(x, y + h * 0.66)
            c.lineTo(x, y)
            c.close();      
            c.fillAndStroke();
        }
        mxCellRenderer.registerShape(shapeLabel.prototype.cst.FULLNAME, shapeLabel)
        shapeLabel.prototype.constraints = null
        /* */

       /* shape INSERTION */
       function shapeInsertion(bounds, fill, stroke, strokeWidth)
       {
           mxShape.call(this)
           this.bounds = bounds
           this.fill = fill
           this.stroke = stroke
           this.strokeWidth = strokeWidth        
       }
       mxUtils.extend(shapeInsertion, mxActor)
       shapeInsertion.prototype.cst = { NS: NAMES._NS, NAME: NAMES.INSERTION, FULLNAME: `${NAMES._NS}.${NAMES.INSERTION}` }
       shapeInsertion.prototype.paintVertexShape = function(c, x, y, w, h) {
           c.translate(x, y);
           x = 0; y = 0;
           
           c.begin();
           c.moveTo(x, y);
           c.lineTo(x + w, y);
           c.lineTo(x + w, y + h);
           c.lineTo(x, y + h);
           c.lineTo(x, y);
           
           c.moveTo(x + 0.1 * w, y)
           c.lineTo(x + 0.1 * w, y + h)
           c.moveTo(x + 0.9 * w, y)
           c.lineTo(x + w * 0.9, y + h)
           
           c.close();      
           c.fillAndStroke();
       }
       mxCellRenderer.registerShape(shapeInsertion.prototype.cst.FULLNAME, shapeInsertion)
       shapeInsertion.prototype.constraints = null
       /* */


    // ctor function
    function shapeStart(bounds, fill, stroke, strokeWidth)
    {
        mxShape.call(this)
        this.bounds = bounds
        this.fill = fill
        this.stroke = stroke
        this.strokewidth = (strokeWidth != null) ? strokeWidth : 1
        this.dy = 0.5
        this.dx = 0.5
        this.notch = 0
        this.arrowHead = 0
    }
    // extend
    mxUtils.extend(shapeStart, mxActor)
    shapeStart.prototype.cst = { NS: NAMES._NS, NAME: NAMES.START, FULLNAME : `${NAMES._NS}.${NAMES.NAME}` }
    // paint
    shapeStart.prototype.paintVertexShape = function(c, x, y, w, h) {
        c.translate(x, y);

        x = 0; y = 0;

        var radius = Math.min(h, w) / 2;
        c.begin();
        c.moveTo(x + radius, y);
        c.lineTo(x + w - radius, y);
        c.quadTo(x + w, y, x + w, y + radius);
        c.lineTo(x + w, y + h - radius);
        c.quadTo(x + w, y + h, x + w - radius, y + h);
        c.lineTo(x + radius, y + h);
        c.quadTo(x, y + h, x, y + h - radius);
        c.lineTo(x, y + radius);
        c.quadTo(x, y, x + radius, y);
        c.close();
        
        c.fillAndStroke();
    }
    mxCellRenderer.registerShape(shapeStart.prototype.cst.FULLNAME, shapeStart)
    shapeStart.prototype.constraints = null
  





    var s = 'html=1;shadow=0;dashed=0;align=center;verticalAlign=middle;shape=';
    
    ui.sidebar.addPalette('drakon', 'drakon', true, function(content) {
        var f = ui.sidebar.createVertexTemplateEntry(s + shapeStart.prototype.cst.FULLNAME +';dy=10;dx=20;', 
			100, 40, 'Start', 'Start', null, null, null);
        content.appendChild(f(content))
        
        var g = ui.sidebar.createVertexTemplateEntry(s + shapeEnd.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 40, 'End', 'End', null, null, null);
        content.appendChild(g(content))

        var h = ui.sidebar.createVertexTemplateEntry(s + shapeAction.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 40, 'Action', 'Action', null, null, null);
        content.appendChild(h(content))

        var i = ui.sidebar.createVertexTemplateEntry(s + shapeQuestion.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 40, 'Question', 'Question', null, null, null);
        content.appendChild(i(content))

        var j = ui.sidebar.createVertexTemplateEntry(s + shapeChoice.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 40, 'Choice', 'Choice', null, null, null);
        content.appendChild(j(content))

        var k = ui.sidebar.createVertexTemplateEntry(s + shapeCase.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 60, 'Case', 'Case', null, null, null);
        content.appendChild(k(content))

        var l = ui.sidebar.createVertexTemplateEntry(s + shapeGoto.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 60, 'Goto', 'Goto', null, null, null);
        content.appendChild(l(content))

        var m = ui.sidebar.createVertexTemplateEntry(s + shapeLabel.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 60, 'Label', 'Label', null, null, null);
        content.appendChild(m(content))

        var n = ui.sidebar.createVertexTemplateEntry(s + shapeInsertion.prototype.cst.FULLNAME +';dy=10;dx=20;', 
            100, 40, 'Insertion', 'Insertion', null, null, null);
        content.appendChild(n(content))


        var frame = document.createElement('iframe');
        frame.setAttribute('width', '100%');
        frame.setAttribute('height', '100%');
        frame.setAttribute('src', 'http://www.example.com/');
        frame.style.backgroundColor = 'white';

        var w = document.body.clientWidth;
        var h = (document.body.clientHeight || document.documentElement.clientHeight);
        var wnd = new mxWindow('Title', frame, 100, 100, 200, 200);
        wnd.setResizable(true)
        ui.toolbar.addButton("geSprite-alignleft", "Compile", function () {
            wnd.setVisible(true);
            generateSource(ui)
        })
    })
})
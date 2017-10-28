function mxGraphMlCodec()
{
	
}

mxGraphMlCodec.prototype.decode = function (xml, callback)
{
	var doc = mxUtils.parseXml(xml);
	
	var graphs = this.getDirectChildNamedElements(doc.documentElement, mxGraphMlConstants.GRAPH);
	
	this.initializeKeys(doc.documentElement);
	
	var mxFile = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><mxfile>";
	for (var i = 0; i < graphs.length; i++)
	{
		var pageElement = graphs[i];

		var graph = this.createMxGraph();
        graph.getModel().beginUpdate();
        
        this.importPage(pageElement, graph);
        
        mxFile += this.processPage(graph, i+1);
	}

	mxFile += "</mxfile>";
	
	if (callback)
	{
		callback(mxFile);
	}
}

mxGraphMlCodec.prototype.initializeKeys = function (graphmlElement)
{
	var keys = this.getDirectChildNamedElements(graphmlElement, mxGraphMlConstants.KEY);
	
	this.nodesKeys = {};
	this.edgesKeys = {};
	this.portsKeys = {};
	this.sharedData = {};
	
	var sharedDataId;
	
	for (var i = 0; i < keys.length; i++)
	{
		var id = keys[i].getAttribute(mxGraphMlConstants.ID);
		var _for = keys[i].getAttribute(mxGraphMlConstants.KEY_FOR);
		var attName = keys[i].getAttribute(mxGraphMlConstants.KEY_NAME);
		
		if (attName == mxGraphMlConstants.SHARED_DATA) sharedDataId = id;
		
		switch (_for)
		{
			case mxGraphMlConstants.NODE:
				this.nodesKeys[id] = {att: attName, elems: keys[i].childNodes};
			break;
			case mxGraphMlConstants.EDGE:
				this.edgesKeys[id] = {att: attName, elems: keys[i].childNodes};
			break;
			case mxGraphMlConstants.PORT:
				this.portsKeys[id] = {att: attName, elems: keys[i].childNodes};
			break;
			case mxGraphMlConstants.ALL:
				this.nodesKeys[id] = {att: attName, elems: keys[i].childNodes};
				this.edgesKeys[id] = {att: attName, elems: keys[i].childNodes};
				this.portsKeys[id] = {att: attName, elems: keys[i].childNodes};
			break;
		}
	}
	
	var data = this.getDirectChildNamedElements(graphmlElement, mxGraphMlConstants.DATA);
	
	for (var i = 0; i < data.length; i++)
	{
		var key = data[i].getAttribute(mxGraphMlConstants.KEY);
		
		if (key == sharedDataId)
		{
			var sharedData = this.getDirectChildNamedElements(data[i], mxGraphMlConstants.Y_SHARED_DATA);
			
			for (var j = 0; j < sharedData.length; j++)
			{
				var dataItems = this.getDirectChildElements(sharedData[j]);
				
				for (var k = 0; k < dataItems.length; k++)
				{
					var dkey = dataItems[k].getAttribute(mxGraphMlConstants.X_KEY);
					this.sharedData[dkey] = dataItems[k];
				}
			}
		}
	}
}

mxGraphMlCodec.prototype.createMxGraph = function ()
{
    var graph = new mxGraph();
//    graph.setExtendParents(false);
//    graph.setExtendParentsOnAdd(false);
//    graph.setConstrainChildren(false);
//    graph.setHtmlLabels(true);
//    graph.getModel().maintainEdgeParent = false;
    return graph;
}

mxGraphMlCodec.prototype.importPage = function (pageElement, graph)
{
	var nodes = this.getDirectChildNamedElements(pageElement, mxGraphMlConstants.NODE);
	
	var nodesMap = {};
	
	for (var i = 0; i < nodes.length; i++)
	{
		this.importNode(nodes[i], graph, nodesMap);
	}
	
	var edges = this.getDirectChildNamedElements(pageElement, mxGraphMlConstants.EDGE);
	
	for (var i = 0; i < edges.length; i++)
	{
		this.importEdge(edges[i], graph, nodesMap);
	}
}

mxGraphMlCodec.prototype.importNode = function (nodeElement, graph, nodesMap)
{
	var data = this.getDirectChildNamedElements(nodeElement, mxGraphMlConstants.DATA);
	var v;
	var id = nodeElement.getAttribute(mxGraphMlConstants.ID);
		
	for (var i = 0; i < data.length; i++)
	{
		var d = data[i];
		if (d.getAttribute(mxGraphMlConstants.KEY) == "d2") //TODO find the key!
		{
			var geoRect = this.getDirectChildNamedElements(d, mxGraphMlConstants.RECT);
			
			if (geoRect.length == 1)
			{
				geoRect = geoRect[0];
				v = graph.insertVertex(graph.getDefaultParent(), null, null, 
						geoRect.getAttribute(mxGraphMlConstants.X),
						geoRect.getAttribute(mxGraphMlConstants.Y),
						geoRect.getAttribute(mxGraphMlConstants.WIDTH),
						geoRect.getAttribute(mxGraphMlConstants.HEIGHT)
				)
			}
		}
	}
	
	nodesMap[id] = v;
}

mxGraphMlCodec.prototype.importEdge = function (edgeElement, graph, nodesMap)
{
	var data = this.getDirectChildNamedElements(edgeElement, mxGraphMlConstants.DATA);
	var e;
	var id = edgeElement.getAttribute(mxGraphMlConstants.ID);
		
	for (var i = 0; i < data.length; i++)
	{
//		var d = data[i];
//		if (d.getAttribute(mxGraphMlConstants.KEY) == "d2") //TODO find the key!
//		{
//			var geoRect = this.getDirectChildNamedElements(d, mxGraphMlConstants.RECT);
//			
//			if (geoRect.length == 1)
//			{
//				geoRect = geoRect[0];
//				v = graph.insertVertex(graph.getDefaultParent(), null, null, 
//						geoRect.getAttribute(mxGraphMlConstants.X),
//						geoRect.getAttribute(mxGraphMlConstants.Y),
//						geoRect.getAttribute(mxGraphMlConstants.WIDTH),
//						geoRect.getAttribute(mxGraphMlConstants.HEIGHT)
//				)
//			}
//		}
	}
}

mxGraphMlCodec.prototype.processPage = function (graph, pageIndex)
{
    var codec = new mxCodec();
    var node = codec.encode(graph.getModel());
    node.setAttribute("style", "default-style2");
    var modelString = mxUtils.getXml(node);
    
    var output = "<diagram name=\"Page " + pageIndex + "\">";
    output += Graph.prototype.compress(modelString);
    output += "</diagram>";
    return output;

}

//These are the same as mxVsdxUtils functions, but added here to be self-dependent
/**
 * Returns a collection of direct child Elements that match the specified tag name
 * @param {*} parent the parent whose direct children will be processed
 * @param {string} name the child tag name to match
 * @return {*[]} a collection of matching Elements
 */
mxGraphMlCodec.prototype.getDirectChildNamedElements = function (parent, name) {
    var result = ([]);
    for (var child = parent.firstChild; child != null; child = child.nextSibling) {
        if ((child != null && (child.nodeType == 1)) && (name == child.nodeName)) {
            /* add */ (result.push(child) > 0);
        }
    }
    ;
    return result;
};
/**
 * Returns a collection of direct child Elements
 * @param {*} parent the parent whose direct children will be processed
 * @return {*[]} a collection of all child Elements
 */
mxGraphMlCodec.prototype.getDirectChildElements = function (parent) {
    var result = ([]);
    for (var child = parent.firstChild; child != null; child = child.nextSibling) {
        if (child != null && (child.nodeType == 1)) {
            /* add */ (result.push(child) > 0);
        }
    }
    ;
    return result;
};
/**
 * Returns the first direct child Element
 * @param {*} parent the parent whose direct first child will be processed
 * @return {*} the first child Element
 */
mxGraphMlCodec.prototype.getDirectFirstChildElement = function (parent) {
    for (var child = parent.firstChild; child != null; child = child.nextSibling) {
        if (child != null && (child.nodeType == 1)) {
            return child;
        }
    }
    ;
    return null;
};


var mxGraphMlConstants =
{
	ID: "id",

	KEY_FOR: "for",

	KEY_NAME: "attr.name",

	KEY_TYPE: "attr.type",

	GRAPH: "graph",

	GRAPHML: "graphml",

	NODE: "node",

	EDGE: "edge",

	HYPEREDGE: "hyperedge",

	PORT: "port",

	ENDPOINT: "endpoint",

	KEY: "key",

	DATA: "data",

	ALL: "all",

	EDGE_SOURCE: "source",

	EDGE_SOURCE_PORT: "sourceport",

	EDGE_TARGET: "target",

	EDGE_TARGET_PORT: "targetport",

	EDGE_DIRECTED: "directed",

	EDGE_UNDIRECTED: "undirected",

	EDGE_DEFAULT: "edgedefault",

	PORT_NAME: "name",

	HEIGHT: "Height",

	WIDTH: "Width",

	X: "X",

	Y: "Y",

	JGRAPH: "jGraph:",

	GEOMETRY: "Geometry",

	FILL: "Fill",

	SHAPENODE: "ShapeNode",

	SHAPEEDGE: "ShapeEdge",

	JGRAPH_URL: "http://www.jgraph.com/",

	KEY_NODE_ID: "d0",

	KEY_NODE_NAME: "nodeData",

	KEY_EDGE_ID: "d1",

	KEY_EDGE_NAME: "edgeData",

	STYLE: "Style",

	SHAPE: "Shape",

	TYPE: "type",

	LABEL: "label",

	TEXT: "text",

	PROPERTIES: "properties",

	SOURCETARGET: "SourceTarget",
		
	RECT: "y:RectD",
	
	NODE_LABELS: "NodeLabels",
	
	NODE_GEOMETRY: "NodeGeometry",
	
	USER_TAGS: "UserTags",

	NODE_STYLE: "NodeStyle",
	
	NODE_VIEW_STATE: "NodeViewState",
	
	EDGE_LABELS: "EdgeLabels",
	
	EDGE_GEOMETRY: "EdgeGeometry",
	
	EDGE_STYLE: "EdgeStyle",
	
	EDGE_VIEW_STATE: "EdgeViewState",
	
	PORT_LOCATION_PARAMETER: "PortLocationParameter",
	
	PORT_STYLE: "PortStyle",
	
	PORT_VIEW_STATE: "PortViewState",
	
	SHARED_DATA: "SharedData",
	
	Y_SHARED_DATA: "y:SharedData",
	
	X_KEY: "x:Key",
	
	GRAPHML_REFERENCE: "y:GraphMLReference"
}

function mxGraphMlCodec()
{
	this.cachedRefObj = {};
};


mxGraphMlCodec.prototype.refRegexp = /^\{y\:GraphMLReference\s+(\d+)\}$/;
mxGraphMlCodec.prototype.staticRegexp = /^\{x\:Static\s+(.+)\.(.+)\}$/;

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
};

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
				this.nodesKeys[attName] = {key: id, elems: keys[i].childNodes};
			break;
			case mxGraphMlConstants.EDGE:
				this.edgesKeys[attName] = {key: id, elems: keys[i].childNodes};
			break;
			case mxGraphMlConstants.PORT:
				this.portsKeys[attName] = {key: id, elems: keys[i].childNodes};
			break;
			case mxGraphMlConstants.ALL:
				this.nodesKeys[attName] = {key: id, elems: keys[i].childNodes};
				this.edgesKeys[attName] = {key: id, elems: keys[i].childNodes};
				this.portsKeys[attName] = {key: id, elems: keys[i].childNodes};
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
};

mxGraphMlCodec.prototype.parseAttributes = function (elem, obj) 
{
	var atts = elem.attributes;
	if (atts)
	{
		for (var i = 0; i < atts.length; i++)
		{
			var val = atts[i].nodeValue;
			var ref = this.refRegexp.exec(val);
			var staticMem = this.staticRegexp.exec(val);
			
			if (ref)
			{
				var key = ref[1];
				var subObj = this.cachedRefObj[key];
				
				//already cached
				if (!subObj)
				{
					subObj = {};
					subObj[this.sharedData[key].nodeName] = this.dataElem2Obj(this.sharedData[key]);
					this.cachedRefObj[key] = subObj;
				}
				
				obj[atts[i].nodeName] = subObj;
			}
			else if (staticMem)
			{
				obj[atts[i].nodeName] = {};
				obj[atts[i].nodeName][staticMem[1]] = staticMem[2];
			}
			else
			{
				obj[atts[i].nodeName] = val;
			}
		}
	}
};

mxGraphMlCodec.prototype.dataElem2Obj = function (elem) 
{
	var ref = this.getDirectFirstChildNamedElements(elem, mxGraphMlConstants.GRAPHML_REFERENCE);
	var refKey = null;
	var obj = {};
	
	if (ref) 
	{
		var key = ref.getAttribute(mxGraphMlConstants.RESOURCE_KEY);
		var cachedObj = this.cachedRefObj[key];
		
		//already cached
		if (cachedObj)
		{
			return cachedObj;
		}
		
		elem = this.sharedData[key];
		refKey = key;
	}

	//parse all attributes
	this.parseAttributes(elem, obj);
	
	if (elem.childNodes.length == 1)
	{
		if (elem.childNodes[0].nodeType != 1)
			return elem.childNodes[0].textContent;
	}
	
	for (var i = 0; i < elem.childNodes.length; i++)
	{
		var child = elem.childNodes[i]; 
		
		if (child.nodeType == 1)
		{
			var attName = child.nodeName;
			
			//Special types of node (x:List and x:Static)
			if (attName == mxGraphMlConstants.X_LIST) 
			{
				var arr = [];
				var arrayElem = this.getDirectChildElements(child);
				
				for (var j = 0; j < arrayElem.length; j++)
				{
					attName = arrayElem[j].nodeName;
					arr.push(this.dataElem2Obj(arrayElem[j]));
				}
					
				obj[attName] = arr;
			}
			else if (attName == mxGraphMlConstants.X_STATIC)
			{
				var member = child.getAttribute(mxGraphMlConstants.MEMBER);
				var dotPos = member.lastIndexOf('.');
				obj[member.substr(0, dotPos)] = member.substr(dotPos + 1);
			}
			else
			{
				var dotPos = attName.lastIndexOf(".");
				
				if (dotPos)
				{
					attName = attName.substr(dotPos + 1);
				}
				
				obj[attName] = this.dataElem2Obj(child);
			}
		}
	}
	
	//cache referenced objects
	if (refKey)
	{
		var tmpObj = {};
		tmpObj[this.sharedData[refKey].nodeName] = obj; 
		this.cachedRefObj[refKey] = tmpObj;
		return tmpObj;
	}
	
	return obj;
};

//Use mapping information to fill the map based on obj content
//TODO yjs looks like they need special handling
mxGraphMlCodec.prototype.mapObject = function (obj, mapping, map)
{
	for (var key in mapping)
	{
		var parts = key.split('.');
		
		var val = obj;
		
		for (var i = 0; i < parts.length; i++)
		{
			if (!val) break;
			
			val = val[parts[i]];
		}
		
		if (val != null)
		{
			var mappingObj = mapping[key];
			if (typeof val === "string")
			{
				if (typeof mappingObj === "string")
				{
					map[mappingObj] = val.toLowerCase();
				}
				else if (typeof mappingObj === "object")
				{
					var modVal;
					switch(mappingObj.mod)
					{
						case "color": //mxGraph doesn't support alfa in colors
							if (val.indexOf("#") == 0)
								modVal = "#" + val.substr(3);
						break;
						case "shape":
							console.log(val);
							modVal = mxGraphMlShapesMap[val];
						break;
						default:
							modVal = val.toLowerCase();
					}
					map[mappingObj.key] = modVal;
				}
				else
				{
					mappingObj(val, map);
				}
			}
			else
			{
				this.mapObject(val, mappingObj, map);
			}
		}
	}
};

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
};

mxGraphMlCodec.prototype.importPort = function (portElement, portsMap)
{
	var name = portElement.getAttribute(mxGraphMlConstants.PORT_NAME);
	
	var data = this.getDirectChildNamedElements(portElement, mxGraphMlConstants.DATA);
	
	for (var i = 0; i < data.length; i++)
	{
		var d = data[i];
		var key = d.getAttribute(mxGraphMlConstants.KEY);
		
		var dataObj = this.dataElem2Obj(d);
	}
};

mxGraphMlCodec.prototype.styleMap2Str = function (styleMap)
{
	var semi = "";
	var str = "";
	
	for (var key in styleMap)
	{
		str += semi + key + "=" + styleMap[key];
		semi = ";";
	}
	
	return str;
};

mxGraphMlCodec.prototype.importNode = function (nodeElement, graph, nodesMap)
{
	var data = this.getDirectChildNamedElements(nodeElement, mxGraphMlConstants.DATA);
	var v;
	var id = nodeElement.getAttribute(mxGraphMlConstants.ID);
	
	var node = new mxCell();
	node.vertex = true;
	var style = {};
	
	for (var i = 0; i < data.length; i++)
	{
		var d = data[i];
		var dataObj = this.dataElem2Obj(d);
		
		if (dataObj.key == this.nodesKeys[mxGraphMlConstants.NODE_GEOMETRY].key) 
		{
			this.addNodeGeo(node, dataObj);
		} 
		else if (dataObj.key == this.nodesKeys[mxGraphMlConstants.NODE_STYLE].key) 
		{
			console.log(dataObj);
			var dashStyleFn = function(val, map)
			{
				map["dashed"] = 1;
				//map["fixDash"] = 1;
				var pattern = null;
				switch(val)
				{
					case "DashDot":
						pattern = "3 1 1 1";
					break;
					case "Dot":
						pattern = "1 1";
					break;
					case "DashDotDot":
						pattern = "3 1 1 1 1 1";
					break;
					default:
						pattern = val;
				}
				
				if (pattern)
					map["dashPattern"] = pattern;
			};
			
			var styleCommonMap = 
			{
				"shape": {key: "shape", mod: "shape"},
				"type": {key: "shape", mod: "shape"},
				"assetName": {key: "shape", mod: "shape"},
				"activityType": {key: "shape", mod: "shape"},
				"fill": {key: "fillColor", mod: "color"},
				"fill.yjs:SolidColorFill.color": {key: "fillColor", mod: "color"},
				"stroke": {key: "strokeColor", mod: "color"},
				"stroke.yjs:Stroke":
				{
					"dashStyle": dashStyleFn,
					"dashStyle.yjs:DashStyle.dashes": dashStyleFn,
					"fill": {key: "strokeColor", mod: "color"},
					"fill.yjs:SolidColorFill.color": {key: "strokeColor", mod: "color"},
					//"lineCap": "", //??
					"thickness.sys:Double": "strokeWidth",
					"thickness": "strokeWidth",
				}
			};

			this.mapObject(dataObj, {
				"yjs:ShapeNodeStyle": styleCommonMap,
				"demostyle:FlowchartNodeStyle": styleCommonMap,
				"demostyle:AssetNodeStyle": styleCommonMap,
				"demostyle:DemoGroupStyle": styleCommonMap,
				"bpmn:ActivityNodeStyle": styleCommonMap
			}, style);
		}
		else if (dataObj.key == this.nodesKeys[mxGraphMlConstants.NODE_LABELS].key) 
		{
			this.addLabels(node, dataObj, style);
		}
	}
	
	var ports = this.getDirectChildNamedElements(nodeElement, mxGraphMlConstants.PORT);
	var portsMap = {};
	
	for (var i = 0; i < ports.length; i++)
	{
		this.importPort(ports[i], portsMap);
	}
	
	node.style = this.styleMap2Str(style);
	
	graph.addCell(node);
	nodesMap[id] = {node: node, ports: portsMap};
};

mxGraphMlCodec.prototype.addNodeGeo = function (node, geoObj) 
{
	var geoRect = geoObj[mxGraphMlConstants.RECT];
	
	if (geoRect)
	{
		var geo = new mxGeometry( 
				geoRect[mxGraphMlConstants.X],
				geoRect[mxGraphMlConstants.Y],
				geoRect[mxGraphMlConstants.WIDTH],
				geoRect[mxGraphMlConstants.HEIGHT]
		);
		node.geometry = geo;
	}
};

mxGraphMlCodec.prototype.importEdge = function (edgeElement, graph, nodesMap)
{
	var data = this.getDirectChildNamedElements(edgeElement, mxGraphMlConstants.DATA);
	var e;
	var id = edgeElement.getAttribute(mxGraphMlConstants.ID);
	var srcId = edgeElement.getAttribute(mxGraphMlConstants.EDGE_SOURCE);
	var trgId = edgeElement.getAttribute(mxGraphMlConstants.EDGE_TARGET);
	var srcPort = edgeElement.getAttribute(mxGraphMlConstants.EDGE_SOURCE_PORT);
	var trgPort = edgeElement.getAttribute(mxGraphMlConstants.EDGE_TARGET_PORT);
	
	var edge = graph.insertEdge(graph.getDefaultParent(), null, "", nodesMap[srcId].node, nodesMap[trgId].node, "graphMLId=" + id);
	var style = {};
	
	for (var i = 0; i < data.length; i++)
	{
		var d = data[i];
		var dataObj = this.dataElem2Obj(d);
		
		if (dataObj.key == this.edgesKeys[mxGraphMlConstants.EDGE_GEOMETRY].key) 
		{
			this.addEdgeGeo(edge, dataObj);
		} 
		else if (dataObj.key == this.edgesKeys[mxGraphMlConstants.EDGE_STYLE].key) 
		{
			this.addEdgeStyle(edge, dataObj);
		}
		else if (dataObj.key == this.edgesKeys[mxGraphMlConstants.EDGE_LABELS].key) 
		{
			this.addLabels(edge, dataObj, style);
		}
	}
	
	return edge;
};

mxGraphMlCodec.prototype.addEdgeGeo = function (edge, geoObj) 
{
	var list = geoObj[mxGraphMlConstants.Y_BEND];
	
	if (list)
	{
		var points = [];
		
		for (var i = 0; i < list.length; i++) {
			var pointStr = list[i][mxGraphMlConstants.LOCATION];
			
			if (pointStr) {
				var xy = pointStr.split(','); 
				points.push(new mxPoint(parseFloat(xy[0]), parseFloat(xy[1])));
			}
		}
		
		edge.geometry.points = points;
	}
};

mxGraphMlCodec.prototype.addEdgeStyle = function (edge, styleObj) 
{
	
};

mxGraphMlCodec.prototype.addLabels = function (node, LblObj, nodeStyle) 
{
	var lblList = LblObj[mxGraphMlConstants.Y_LABEL];
	
	lblTxts = [];
	lblStyles = [];
	
	if (lblList)
	{
		for (var i = 0; i < lblList.length; i++)
		{
			var lbl = lblList[i];
			console.log(lbl);
			var styleMap = {};
			var txt = lbl[mxGraphMlConstants.TEXT];
			
			//layout
			var layout = lbl[mxGraphMlConstants.LAYOUTPARAMETER];
			
			//style
			var fontStyleFn = function(val, map) 
			{
				var style = map["fontStyle"] || 0;
				
				switch(val)
				{
					case "ITALIC":
						style = style | 2;
					break;
					case "BOLD":
						style = style | 1;
					break;
					case "UNDERLINE":
						style = style | 4;
					break;
				}
				map["fontStyle"] = style;
			};
			
			this.mapObject(lbl, {
				"Style.yjs:DefaultLabelStyle":
					{
						"backgroundFill" : {key: "labelBackgroundColor", mod: "color"},
						"backgroundFill.yjs:SolidColorFill.color" : {key: "labelBackgroundColor", mod: "color"},
						"backgroundStroke" : {key: "labelBorderColor", mod: "color"},
						"backgroundStroke.yjs:Stroke.fill" : {key: "labelBorderColor", mod: "color"},
						"textFill": {key: "fontColor", mod: "color"},
						"textFill.yjs:SolidColorFill.color": {key: "fontColor", mod: "color"},
						"textSize": "fontSize",
						"horizontalTextAlignment": "align",
						"verticalTextAlignment": "verticalAlign",
						"wrapping": function(val, map) 
						{
							//TODO mxGraph has a single type of wrapping only
							if (val)
								map["whiteSpace"] = "wrap";
						},
						"font.yjs:Font": 
							{
								"fontFamily": "fontFamily",
								"fontSize": "fontSize",
								"fontStyle": fontStyleFn,
								"fontWeight": fontStyleFn,
								"textDecoration": fontStyleFn
							}
					}
			}, styleMap);

			lblTxts.push(txt);
			lblStyles.push(styleMap);
		}
	}
	
	if (lblTxts.length == 1)
	{
		node.value = lblTxts[0];
		
		for (var key in lblStyles[0])
		{
			nodeStyle[key] = lblStyles[0][key];
		}
	}
	else
	{
	
	}
};


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

};

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

mxGraphMlCodec.prototype.getDirectFirstChildNamedElements = function (parent, name) {
    for (var child = parent.firstChild; child != null; child = child.nextSibling) {
        if ((child != null && (child.nodeType == 1)) && (name == child.nodeName)) {
            return child;
        }
    }
    ;
    return null;
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

var mxGraphMlShapesMap =
{
	"STAR5": "mxgraph.basic.star;flipV=1", //TODO This is not close enough!
	"SHEARED_RECTANGLE": "parallelogram",
	"HEXAGON": "hexagon",
	"ELLIPSE": "ellipse"
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
	
	GRAPHML_REFERENCE: "y:GraphMLReference",
	
	RESOURCE_KEY: "ResourceKey",
		
	X_LIST: "x:List",
	
	X_STATIC: "x:Static",
	
	Y_BEND: "y:Bend",
	
	LOCATION: "Location",
	
	Y_LABEL: "y:Label",
	
	TEXT: "Text",
	
	LAYOUTPARAMETER: "LayoutParameter",
	
	YJS_DEFAULTLABELSTYLE: "yjs:DefaultLabelStyle",
	
	MEMBER: "Member"
};

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
        
        this.importGraph(pageElement, graph, graph.getDefaultParent());
        
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
	var origElem = elem;
	var obj = {};
	
	if (ref) 
	{
		var key = ref.getAttribute(mxGraphMlConstants.RESOURCE_KEY);
		var cachedObj = this.cachedRefObj[key];
		
		//already cached
		if (cachedObj)
		{
			//parse all attributes to update the reference
			this.parseAttributes(elem, cachedObj);
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
		{
			//TODO handle this similar case better
			//cache referenced objects
			if (refKey)
			{
				var tmpObj = {};
				//parse all attributes before following the reference
				this.parseAttributes(origElem, tmpObj);
				tmpObj[this.sharedData[refKey].nodeName] = elem.childNodes[0].textContent; 
				this.cachedRefObj[refKey] = tmpObj;
				return tmpObj;
			}
			else 
			{
				return elem.childNodes[0].textContent;
			}
		}
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
				
				if (dotPos > 0)
				{
					attName = attName.substr(dotPos + 1);
				}
				
				if (obj[attName] != null)
				{
					if (!(obj[attName] instanceof Array))
					{
						obj[attName] = [obj[attName]];
					}
					
					obj[attName].push(this.dataElem2Obj(child));
				}
				else
				{
					obj[attName] = this.dataElem2Obj(child);
				}
			}
		}
	}
	
	//cache referenced objects
	if (refKey)
	{
		var tmpObj = {};
		//parse all attributes before following the reference
		this.parseAttributes(origElem, tmpObj);
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
	//defaults can be overridden by actual values later
	if (mapping.defaults)
	{
		for (var key in mapping.defaults)
		{
			map[key] = mapping.defaults[key];
		}
	}
	
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
					var modVal = val.toLowerCase();
					switch(mappingObj.mod)
					{
						case "color": //mxGraph doesn't support alfa in colors
							if (val.indexOf("#") == 0 && val.length == 9)
							{
								modVal = "#" + val.substr(3);
							}
							else if (val == "TRANSPARENT")
							{
								modVal = "none";
							}
						break;
						case "shape":
//							console.log(val);
							modVal = mxGraphMlShapesMap[val];
						break;
						case "bpmnOutline":
//							console.log(val);
							modVal = mxGraphMlShapesMap.bpmnOutline[val];
						break;
						case "bool":
							modVal = val == "true"? "1" : "0";
						break;
						case "scale":
							try {
								modVal = parseFloat(val) * mappingObj.scale;
							} catch(e) {
								//nothing!
							}
						break;
						case "arrow":
							modVal = mxGraphMlArrowsMap[val];
						break;
					}
					if (modVal != null)
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

mxGraphMlCodec.prototype.importGraph = function (pageElement, graph, parent, nodesMap)
{
	var nodes = this.getDirectChildNamedElements(pageElement, mxGraphMlConstants.NODE);
	
	nodesMap = nodesMap || {};
	
	for (var i = 0; i < nodes.length; i++)
	{
		this.importNode(nodes[i], graph, nodesMap, parent);
	}
	
	var edges = this.getDirectChildNamedElements(pageElement, mxGraphMlConstants.EDGE);
	
	for (var i = 0; i < edges.length; i++)
	{
		this.importEdge(edges[i], graph, nodesMap, parent);
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

mxGraphMlCodec.prototype.importNode = function (nodeElement, graph, nodesMap, parent)
{
	var data = this.getDirectChildNamedElements(nodeElement, mxGraphMlConstants.DATA);
	var v;
	var id = nodeElement.getAttribute(mxGraphMlConstants.ID);
	
	var node = new mxCell();
	node.vertex = true;
	node.geometry = new mxGeometry(0,0,0,0);

	graph.addCell(node, parent);

	var style = {graphMlID: id};
	var mlStyleObj = null;
	var mlTemplate = null;
	var lblObj = null;
	var lbls = null;
	
	for (var i = 0; i < data.length; i++)
	{
		var d = data[i];
		var dataObj = this.dataElem2Obj(d);
		
		if (dataObj.key == this.nodesKeys[mxGraphMlConstants.NODE_GEOMETRY].key) 
		{
			this.addNodeGeo(node, dataObj, parent.geometry);
		} 
		else if (dataObj.key == this.nodesKeys[mxGraphMlConstants.NODE_STYLE].key) 
		{
//			console.log(JSON.stringify(dataObj));
			//TODO move these static mapping objects outside such that they are defined once only
			mlStyleObj = dataObj;
			if (dataObj["yjs:StringTemplateNodeStyle"])
			{
				mlTemplate = dataObj["yjs:StringTemplateNodeStyle"];
			} 
			else
			{
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
					"fill.yjs:SolidColorFill.color.yjs:Color.value": {key: "fillColor", mod: "color"},
					"stroke": {key: "strokeColor", mod: "color"},
					"stroke.yjs:Stroke":
					{
						"dashStyle": dashStyleFn,
						"dashStyle.yjs:DashStyle.dashes": dashStyleFn,
						"fill": {key: "strokeColor", mod: "color"},
						"fill.yjs:SolidColorFill.color": {key: "strokeColor", mod: "color"},
						//"lineCap": "", //??
						"thickness.sys:Double": "strokeWidth",
						"thickness": "strokeWidth"
					}
				};
	
				var assetNodesStyle = mxUtils.clone(styleCommonMap);
				assetNodesStyle["defaults"] = {
					"fillColor": "#CCCCCC",
					"strokeColor": "#6881B3"
				};
				
				var bpmnActivityStyle = mxUtils.clone(styleCommonMap);
				bpmnActivityStyle["defaults"] = {
					"shape": "ext;rounded=1",
					"fillColor": "#FFFFFF",
					"strokeColor": "#000090"
				};
				
				var bpmnGatewayStyle = mxUtils.clone(styleCommonMap);
				bpmnGatewayStyle["defaults"] = {
					"shape": "rhombus;fillColor=#FFFFFF;strokeColor=#FFCD28"
				};
				
				var bpmnConversationStyle = mxUtils.clone(styleCommonMap);
				bpmnConversationStyle["defaults"] = {
					"shape": "hexagon",
					"strokeColor": "#007000"
				};
				
				var bpmnEventStyle = mxUtils.clone(styleCommonMap);
				bpmnEventStyle["defaults"] = {
					"shape": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=general",
					"outline": "standard"
				};
				bpmnEventStyle["characteristic"] = {key: "outline", mod: "bpmnOutline"};
				
				var bpmnDataObjectStyle = mxUtils.clone(styleCommonMap);
				bpmnDataObjectStyle["defaults"] = {
					"shape": "js:bpmnDataObject"
				};
				
				var bpmnDataStoreStyle = mxUtils.clone(styleCommonMap);
				bpmnDataStoreStyle["defaults"] = {
					"shape": "datastore"
				};
				
				var bpmnGroupNodeStyle = mxUtils.clone(styleCommonMap);
				bpmnGroupNodeStyle["defaults"] = {
					"shape": "swimlane;swimlaneLine=0;startSize=20;dashed=1;dashPattern=3 1 1 1;collapsible=0;rounded=1"
				};
				
				var bpmnChoreographyNodeStyle = mxUtils.clone(styleCommonMap);
				bpmnChoreographyNodeStyle["defaults"] = {
					"shape": "js:BpmnChoreography"//"swimlane;childLayout=stackLayout;horizontal=1;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;startSize=20;rounded=1;collapsible=0"
				};
				
				//approximation to GraphML shapes TODO improve them
				var bevelNodeStyle = mxUtils.clone(styleCommonMap);
				bevelNodeStyle["defaults"] = {
					"rounded": "1",
					"glass": "1",
					"strokeColor": "#FFFFFF"
				};
				bevelNodeStyle["inset"] = "strokeWidth";
				bevelNodeStyle["radius"] = "arcSize";
				bevelNodeStyle["drawShadow"] = {key:"shadow", mod:"bool"};
				bevelNodeStyle["color"] = {key:"fillColor", mod:"color", addGradient: "north"};
				bevelNodeStyle["color.yjs:Color.value"] = bevelNodeStyle["color"];
				
				var shinyPlateNodeStyle = mxUtils.clone(styleCommonMap);
				shinyPlateNodeStyle["defaults"] = {
					"rounded": "1",
					"arcSize": 10,
					"glass": "1",
					"shadow": "1",
					"strokeColor": "none",
					"rotation": -90 //TODO requires rotation!
				};
				shinyPlateNodeStyle["drawShadow"] = {key:"shadow", mod:"bool"};
				
				var demoGroupStyle = mxUtils.clone(styleCommonMap);
				demoGroupStyle["defaults"] = {
					"shape": "swimlane",
					"startSize": 20,
					"strokeWidth": 4,
					"spacingLeft": 10 //TODO can we change collapse icon to be in right side?
				};
				demoGroupStyle["isCollapsible"] = {key:"collapsible", mod:"bool"};
				demoGroupStyle["borderColor"] = {key:"strokeColor", mod:"color"};
				demoGroupStyle["folderFrontColor"] = {key:"fillColor", mod:"color"}; //TODO fillColor always match strokeColor!
	//			demoGroupStyle["folderBackColor"] = {key:"fillColor", mod:"color"}; //??
				
				var collapsibleNodeStyle = mxUtils.clone(styleCommonMap);
				collapsibleNodeStyle["defaults"] = {
					"shape": "swimlane",
					"startSize": 20,
					"spacingLeft": 10 //TODO can we change collapse icon to be in right side?
				};
				collapsibleNodeStyle["yjs:PanelNodeStyle"] = {
					"color": {key:"swimlaneFillColor", mod:"color"},
					"color.yjs:Color.value": {key:"swimlaneFillColor", mod:"color"},
					"labelInsetsColor": {key:"fillColor", mod:"color"},
					"labelInsetsColor.yjs:Color.value": {key:"fillColor", mod:"color"}
				};
				
				var tableStyle = mxUtils.clone(styleCommonMap);
				tableStyle["defaults"] = {
					"shape": "js:table"
				};
				
				this.mapObject(dataObj, {
					"yjs:ShapeNodeStyle": styleCommonMap,
					"demostyle:FlowchartNodeStyle": styleCommonMap,
					"demostyle:AssetNodeStyle": assetNodesStyle,
					"demostyle:DemoGroupStyle": styleCommonMap,
					"bpmn:ActivityNodeStyle": bpmnActivityStyle,
					"bpmn:GatewayNodeStyle": bpmnGatewayStyle,
					"bpmn:ConversationNodeStyle": bpmnConversationStyle,
					"bpmn:EventNodeStyle": bpmnEventStyle,
					"bpmn:DataObjectNodeStyle": bpmnDataObjectStyle,
					"bpmn:DataStoreNodeStyle": bpmnDataStoreStyle,
					"bpmn:GroupNodeStyle": bpmnGroupNodeStyle,
					"bpmn:ChoreographyNodeStyle": bpmnChoreographyNodeStyle,
					"yjs:BevelNodeStyle": bevelNodeStyle,
					"yjs:ShinyPlateNodeStyle": shinyPlateNodeStyle,
					"demostyle:DemoGroupStyle": demoGroupStyle,
					"yjs:CollapsibleNodeStyleDecorator": collapsibleNodeStyle,
					"bpmn:PoolNodeStyle": tableStyle,
					"yjs:TableNodeStyle": tableStyle,
					"demotablestyle:DemoTableStyle": tableStyle
				}, style);
			}
		}
		else if (dataObj.key == this.nodesKeys[mxGraphMlConstants.NODE_LABELS].key) 
		{
			lblObj = dataObj;
		}
	}
	
	var ports = this.getDirectChildNamedElements(nodeElement, mxGraphMlConstants.PORT);
	var portsMap = {};
	
	for (var i = 0; i < ports.length; i++)
	{
		this.importPort(ports[i], portsMap);
	}
	
	if (mlTemplate)
	{
		this.handleTemplates(mlTemplate, node, style);
	}
	
	this.handleFixedRatio(node, style);

	//handle labels after node geometry is determined
	if (lblObj)
		lbls = this.addLabels(node, lblObj, style);
	
	//handle special compound shapes
	this.handleCompoundShape(node, style, mlStyleObj, lbls);
	
	node.style = this.styleMap2Str(style);
	
	var subGraphs = this.getDirectChildNamedElements(nodeElement, mxGraphMlConstants.GRAPH);
	
	for (var i = 0; i < subGraphs.length; i++)
	{
		this.importGraph(subGraphs[i], graph, node, portsMap);
	}	
	
	nodesMap[id] = {node: node, ports: portsMap};
};


mxGraphMlCodec.prototype.handleTemplates = function (template, node, styleMap)
{
	var svg = template.match(/\<svg(\s|\S)+\<\/svg\>/);
	if (svg)
	{
		svg = svg[0];
		styleMap["shape"] = "image";
		styleMap["image"] = "data:image/svg+xml," + ((window.btoa) ? btoa(svg) : Base64.encode(svg));
	}
};

mxGraphMlCodec.prototype.handleCompoundShape = function (node, styleMap, mlStyleObj, lbls)
{
	var shape = styleMap["shape"];
	
	if (shape && shape.indexOf("js:") == 0)
	{
		switch(shape)
		{
			case "js:bpmnDataObject":
				styleMap["shape"] = "note;size=16";
				mlStyleObj = mlStyleObj["bpmn:DataObjectNodeStyle"];
				
				if (mlStyleObj["collection"] == "true")
				{
					var cell2 = new mxCell('', new mxGeometry(0.5, 1, 10, 10), 'html=1;whiteSpace=wrap;shape=parallelMarker;');
					cell2.vertex = true;
					cell2.geometry.relative = true;
					cell2.geometry.offset = new mxPoint(-5, -10);
					node.insert(cell2);
				}
				if (mlStyleObj["type"] == "INPUT")
				{
					var cell1 = new mxCell('', new mxGeometry(0, 0, 10, 10), 'html=1;shape=singleArrow;arrowWidth=0.4;arrowSize=0.4;');
					cell1.vertex = true;
					cell1.geometry.relative = true;
					cell1.geometry.offset = new mxPoint(2, 2);
					node.insert(cell1);
				}
				else if (mlStyleObj["type"] == "OUTPUT")
				{
					var cell1 = new mxCell('', new mxGeometry(0, 0, 10, 10), 'html=1;shape=singleArrow;arrowWidth=0.4;arrowSize=0.4;fillColor=#000000;');
					cell1.vertex = true;
					cell1.geometry.relative = true;
					cell1.geometry.offset = new mxPoint(2, 2);
					node.insert(cell1);
				}
			break;
			case "js:BpmnChoreography":
				this.mapObject(mlStyleObj, {
					"defaults": {
						"shape": "swimlane;collapsible=0;rounded=1",
						"startSize": "20",
						"strokeColor": "#006000",
						"fillColor": "#CCCCCC"
					}
				}, styleMap);
				
				//TODO the shape should be clipped by parent borders. It should also be resized relative to its parent
				var pGeo = node.geometry;
				var cell1 = new mxCell('', new mxGeometry(0, pGeo.height - 20, pGeo.width, 20), 'strokeColor=#006000;fillColor=#777777;rounded=1');
				cell1.vertex = true;
				node.insert(cell1);
				
				//TODO handle labels accurately
				if (lbls && lbls.lblTxts)
				{
//					console.log(lbls);
					node.value = lbls.lblTxts[0];
					cell1.value = lbls.lblTxts[1];
				}
			break;
			case "js:table":
				//TODO we need 2 passes to find the exact shift of columns/rows especially when there is rows inside rows
				//TODO Internal table strokes needs to match table strokeWidth and only be on one side
				//TODO code optimization
				styleMap["shape"] = "swimlane;collapsible=0;swimlaneLine=0";
				var tableObj = mlStyleObj["yjs:TableNodeStyle"] || mlStyleObj["demotablestyle:DemoTableStyle"];
				
				if (!tableObj && mlStyleObj["bpmn:PoolNodeStyle"])
				{
					tableObj = mlStyleObj["bpmn:PoolNodeStyle"]["yjs:TableNodeStyle"];
				}
				
//				console.log(tableObj);
				
				this.mapObject(tableObj, {
					"backgroundStyle.demotablestyle:TableBackgroundStyle": {
						"insetFill.yjs:SolidColorFill.color.yjs:Color.value": {key: "fillColor", mod: "color"},
						"tableBackgroundFill.yjs:SolidColorFill.color.yjs:Color.value": {key: "swimlaneFillColor", mod: "color"},
						"tableBackgroundStroke.yjs:Stroke":{
							"fill": {key: "strokeColor", mod: "color"},
							"thickness": "strokeWidth" 
						}
					},
					"backgroundStyle.yjs:ShapeNodeStyle.fill": {key: "fillColor", mod: "color"},
					"backgroundStyle.yjs:ShapeNodeStyle.fill.yjs:SolidColorFill.color": {key: "fillColor", mod: "color"}
				}, styleMap);
				
				//Lane fill color is the same as the fill color
				styleMap["swimlaneFillColor"] = styleMap["fillColor"];
				
				tableObj = tableObj["table"]["y:Table"];
				
				var x = 0, y = 0, xShift = 0, yShift = 0;
				var insets = tableObj["Insets"];
				
				if (insets)
				{
					insets = insets.split(',');
					
					if (insets[0] != "0")
					{
						styleMap["startSize"] = insets[0];
						xShift = parseFloat(insets[0]);
						x += xShift;						
						styleMap["horizontal"] = "0";
					} 
					else if (insets[1] != "0")
					{
						styleMap["startSize"] = insets[1];
						yShift = parseFloat(insets[1]); 
						y += yShift;
					}
				}
				else
				{
					styleMap["startSize"] = "0";
				}
				
				var defRowStyle = {};
				
				var rowMapping = {
					"Insets": function(val, map)
					{
						map["startSize"] = val.split(',')[0];
					},
					"Style.bpmn:AlternatingLeafStripeStyle": {
						"evenLeafDescriptor.bpmn:StripeDescriptor": {
							"insetFill": {key: "evenFill", mod: "color"},
							"backgroundFill": {key: "evenLaneFill", mod: "color"}
						},
						"oddLeafDescriptor.bpmn:StripeDescriptor": {
							"insetFill": {key: "oddFill", mod: "color"},
							"backgroundFill": {key: "oddLaneFill", mod: "color"}
						}
						//parentDescriptor ??
						//TODO collect common types in a special mapping hash
					},
					"Style.yjs:NodeStyleStripeStyleAdapter":{
						"demotablestyle:DemoStripeStyle": {
							"stripeInsetFill.yjs:SolidColorFill.color.yjs:Color.value": {key: "fillColor", mod: "color"},
							"tableLineFill.yjs:SolidColorFill.color.yjs:Color.value": {key: "strokeColor", mod: "color"}
						},
						"yjs:ShapeNodeStyle": {
							"fill": {key: "swimlaneFillColor", mod: "color"}
						}
					},
					"Size": "height"
				};
				this.mapObject(tableObj["RowDefaults"], {
					"defaults": {
						"shape": "swimlane;collapsible=0;horizontal=0",
						"startSize": "0"
					},
					"y:StripeDefaults": rowMapping
				}, defRowStyle);

				var defColStyle = {};
				
				var colMapping = {
					"Insets": function(val, map)
					{
						map["startSize"] = val.split(',')[1];
					},
					"Style.bpmn:AlternatingLeafStripeStyle": {
						"evenLeafDescriptor.bpmn:StripeDescriptor": {
							"insetFill": {key: "evenFill", mod: "color"},
							"backgroundFill": {key: "evenLaneFill", mod: "color"}
						},
						"oddLeafDescriptor.bpmn:StripeDescriptor": {
							"insetFill": {key: "oddFill", mod: "color"},
							"backgroundFill": {key: "oddLaneFill", mod: "color"}
						}
						//parentDescriptor ??
						//TODO collect common types in a special mapping hash
					},
					"Style.yjs:NodeStyleStripeStyleAdapter":{
						"demotablestyle:DemoStripeStyle": {
							"stripeInsetFill.yjs:SolidColorFill.color.yjs:Color.value": {key: "fillColor", mod: "color"},
							"tableLineFill.yjs:SolidColorFill.color.yjs:Color.value": {key: "strokeColor", mod: "color"}
						},
						"yjs:ShapeNodeStyle": {
							"fill": {key: "swimlaneFillColor", mod: "color"}
						}
					},
					"Size": "width"
				};
				
				this.mapObject(tableObj["ColumnDefaults"], {
					"defaults": {
						"shape": "swimlane;collapsible=0",
						"startSize": "0",
						"fillColor": "none"
					},
					"y:StripeDefaults": colMapping
				}, defColStyle);

				var pGeo = node.geometry;
				
				var rows = tableObj["Rows"]["y:Row"];
				y += parseFloat(defColStyle["startSize"]);
				
				//TODO We need two passes to determine the header size!
				if (rows)
				{
					if (!(rows instanceof Array))
						rows = [rows];
					
					for (var i = 0; i < rows.length; i++)
					{
						y = this.addRow(rows[i], node, (i & 1), y, xShift, rowMapping, defRowStyle);
					}
				}

				var columns = tableObj["Columns"]["y:Column"];
				x += parseFloat(defRowStyle["startSize"]);
				
				if (columns)
				{
					if (!(columns instanceof Array))
						columns = [columns];
					
					for (var i = 0; i < columns.length; i++)
					{
						x = this.addColumn(columns[i], node, (i & 1), x, yShift, colMapping, defColStyle);
					}
				}
				
			break;
		}
	}
};

mxGraphMlCodec.prototype.addRow = function(row, parent, odd, y, xShift, rowMapping, defRowStyle)
{
	var cell = new mxCell();
	cell.vertex = true;
	var rowStyle = mxUtils.clone(defRowStyle);
	this.mapObject(row, rowMapping, rowStyle);
	
	if (odd)
	{
		if (rowStyle["oddFill"]) 
			rowStyle["fillColor"] = rowStyle["oddFill"];

		if (rowStyle["oddLaneFill"])
			rowStyle["swimlaneFillColor"] = rowStyle["oddLaneFill"];
	}
	else
	{
		if (rowStyle["evenFill"]) 
			rowStyle["fillColor"] = rowStyle["evenFill"];
		
		if (rowStyle["evenLaneFill"])
			rowStyle["swimlaneFillColor"] = rowStyle["evenLaneFill"];
	}
	
	var height = parseFloat(rowStyle["height"]);
	cell.geometry = new mxGeometry(xShift, y, parent.geometry.width - xShift, height);

	var lblObj = row["Labels"];
	
	if (lblObj)
		this.addLabels(cell, lblObj, rowStyle)
	
	cell.style = this.styleMap2Str(rowStyle);
	parent.insert(cell);
	
	var subRow = row["y:Row"];
	
	var subY = 0;
	if (subRow)
	{
		if (!(subRow instanceof Array))
			subRow = [subRow];
		
		for (var i = 0; i < subRow.length; i++)
		{
			subY = this.addRow(subRow[i], cell, (i & 1), subY, xShift, rowMapping, defRowStyle);
		}
	}
	height = Math.max(height, subY);
	cell.geometry.height = height;
	y += height;

	return y;
}

mxGraphMlCodec.prototype.addColumn = function(column, parent, odd, x, yShift, colMapping, defColStyle)
{
	var cell = new mxCell();
	cell.vertex = true;
	var colStyle = mxUtils.clone(defColStyle);
	this.mapObject(column, colMapping, colStyle);
	
	if (odd)
	{
		if (colStyle["oddFill"]) 
			colStyle["fillColor"] = colStyle["oddFill"];
		
		if (colStyle["oddLaneFill"])
			colStyle["swimlaneFillColor"] = colStyle["oddLaneFill"];
	}
	else
	{
		if (colStyle["evenFill"]) 
			colStyle["fillColor"] = colStyle["evenFill"];
		
		if (colStyle["evenLaneFill"])
			colStyle["swimlaneFillColor"] = colStyle["evenLaneFill"];
	}

	var width = parseFloat(colStyle["width"]);
	cell.geometry = new mxGeometry(x, yShift, width, parent.geometry.height - yShift);

	var lblObj = column["Labels"];
	
	if (lblObj)
		this.addLabels(cell, lblObj, colStyle)

	cell.style = this.styleMap2Str(colStyle);
	parent.insert(cell);
	
	var subCol = column["y:Column"];
	
	var subX = 0;
	if (subCol)
	{
		if (!(subCol instanceof Array))
			subCol = [subCol];
		
		for (var i = 0; i < subCol.length; i++)
		{
			subX = this.addColumn(subCol[i], cell, (i & 1), subX, yShift, colMapping, defColStyle);
		}
	}
	width = Math.max(width, subX);
	cell.geometry.width = width;
	x += width;
	return x;
}

mxGraphMlCodec.prototype.handleFixedRatio = function (node, styleMap)
{
	var shape = styleMap["shape"];
	
	if (shape && shape.indexOf(";aspect=fixed") > 0)
	{
		var geo = node.geometry;
		
		if (geo) 
		{
			var min = Math.min(geo.height, geo.width);
			
			if (min == geo.height) //fix coordinates
			{
				geo.x += (geo.width - min) / 2;
			}
			
			geo.height = min;
			geo.width = min;
		}
	}
};

mxGraphMlCodec.prototype.addNodeGeo = function (node, geoObj, parentGeo) 
{
	var geoRect = geoObj[mxGraphMlConstants.RECT];
	
	if (geoRect)
	{
		var dx = 0, dy = 0;
		
		if (parentGeo) 
		{
			dx = parentGeo.x;
			dy = parentGeo.y;
		}
		
		var geo = node.geometry;
		 
		geo.x = parseFloat(geoRect[mxGraphMlConstants.X]) - dx;
		geo.y = parseFloat(geoRect[mxGraphMlConstants.Y]) - dy;
		geo.width = parseFloat(geoRect[mxGraphMlConstants.WIDTH]);
		geo.height = parseFloat(geoRect[mxGraphMlConstants.HEIGHT]);
	}
};

//TODO handle ports
mxGraphMlCodec.prototype.importEdge = function (edgeElement, graph, nodesMap, parent)
{
	var data = this.getDirectChildNamedElements(edgeElement, mxGraphMlConstants.DATA);
	var e;
	var id = edgeElement.getAttribute(mxGraphMlConstants.ID);
	var srcId = edgeElement.getAttribute(mxGraphMlConstants.EDGE_SOURCE);
	var trgId = edgeElement.getAttribute(mxGraphMlConstants.EDGE_TARGET);
	var srcPort = edgeElement.getAttribute(mxGraphMlConstants.EDGE_SOURCE_PORT);
	var trgPort = edgeElement.getAttribute(mxGraphMlConstants.EDGE_TARGET_PORT);
	
	var edge = graph.insertEdge(parent, null, "", nodesMap[srcId].node, nodesMap[trgId].node, "graphMLId=" + id);
	var style = {graphMlID: id};
	
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
//			console.log(dataObj);
			this.addEdgeStyle(edge, dataObj, style);
		}
		else if (dataObj.key == this.edgesKeys[mxGraphMlConstants.EDGE_LABELS].key) 
		{
			this.addLabels(edge, dataObj, style);
		}
	}
	
	edge.style = this.styleMap2Str(style);
	
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

//TODO improve similarity handling
mxGraphMlCodec.prototype.addEdgeStyle = function (edge, styleObj, styleMap) 
{
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
				pattern = val.replace(/0/g, '1');
		}
		
		if (pattern)
			map["dashPattern"] = pattern;
	};
	
	// can be mapping to WHITE => empty, BLACK => filled
	var endArrowFill = function(val, map)
	{
		map["endFill"] = val == 'WHITE'? "0" : "1"; 
	};
	// can be mapping to WHITE => empty, BLACK => filled
	var startArrowFill = function(val, map)
	{
		map["startFill"] = val == 'WHITE'? "0" : "1"; 
	};

	this.mapObject(styleObj, {
		"yjs:PolylineEdgeStyle": {
			"defaults" : 
			{
				"endArrow": "none"
			},
//			"smoothingLength": "",//?
			"stroke": {key: "strokeColor", mod: "color"},
			"stroke.yjs:Stroke":
			{
				"dashStyle": dashStyleFn,
				"dashStyle.yjs:DashStyle.dashes": dashStyleFn,
				"fill": {key: "strokeColor", mod: "color"},
				"fill.yjs:SolidColorFill.color": {key: "strokeColor", mod: "color"},
				//"lineCap": "", //??
				"thickness.sys:Double": "strokeWidth",
				"thickness": "strokeWidth"
			},
			"targetArrow.yjs:Arrow": {
				"defaults" : 
				{
					"endArrow": "classic",
					"endFill": "1",
					"endSize": "6"
				},
//				cropLength: "", //??
				"fill": endArrowFill,
				"scale": {key: "endSize", mod: "scale", scale: 5},
//				stroke: "", //?
				"type": {key: "endArrow", mod: "arrow"}
			},
			"sourceArrow.yjs:Arrow": {
//				cropLength: "", //??
				"fill": startArrowFill,
				"scale": {key: "startSize", mod: "scale", scale: 5},
//				stroke: "", //?
				"type": {key: "startArrow", mod: "arrow"}
			}
		}
	}, styleMap);
};

//TODO label offset
mxGraphMlCodec.prototype.addLabels = function (node, LblObj, nodeStyle) 
{
	var lblList = LblObj[mxGraphMlConstants.Y_LABEL];
	
	var lblTxts = [];
	var lblStyles = [];
	var lblLayouts = [];
	
	if (lblList)
	{
		if (!(lblList instanceof Array)) 
		{
			lblList = [lblList];
		}
		
		for (var i = 0; i < lblList.length; i++)
		{
			var lbl = lblList[i];
//			console.log(lbl);
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
			lblLayouts.push(layout);
		}
	}
	
	//TODO Use the style map with defaults to change the style
	for (var i = 0; i < lblTxts.length; i++)
	{
		if (lblTxts[i])
		{
			if (lblLayouts[i] && lblLayouts[i]["bpmn:ParticipantParameter"])
				continue;
			
			lblTxts[i] = mxUtils.htmlEntities(lblTxts[i], false).replace(/\n/g, '<br/>');
			var geo = node.geometry;

			var lblCell = new mxCell(lblTxts[i], new mxGeometry(0, 0, geo.width, geo.height), 'text;html=1;spacing=0;' + this.styleMap2Str(lblStyles[i]));
			lblCell.vertex = true;
			node.insert(lblCell, 0);
			var lGeo = lblCell.geometry;

			console.log(lblTxts[i]);
			console.log(lblLayouts[i]);
			
			if (lblLayouts[i]["y:RatioAnchoredLabelModelParameter"])
			{
				var strSize = mxUtils.getSizeForString(lblTxts[i], lblStyles[i]["fontSize"], lblStyles[i]["fontFamily"]);
				var offsetStr = lblLayouts[i]["y:RatioAnchoredLabelModelParameter"]["LayoutOffset"];
				
				if (offsetStr)
				{
					var parts = offsetStr.split(',');
					lGeo.x = parseFloat(parts[0]);
					lGeo.y = parseFloat(parts[1]);
					lGeo.width = strSize.width;
					lGeo.height = strSize.height;
					lblCell.style += ";spacingTop=-4;";
				}
				else
				{
					//TODO map there?
					var lblRatio = lblLayouts[i]["y:RatioAnchoredLabelModelParameter"]["LabelRatio"];
					var layoutRatio = lblLayouts[i]["y:RatioAnchoredLabelModelParameter"]["LayoutRatio"];
					
					lblCell.style += ";align=center;";
				}
			}
			else if (lblLayouts[i]["y:InteriorLabelModel"]) //TODO this is probably can be done by setting the value?
			{
				//TODO merge with next one if they are identical in all cases!
				switch (lblLayouts[i]["y:InteriorLabelModel"])
				{
					case "Center":
						lblCell.style += ";verticalAlign=middle;";
					break;
					case "North":
						lGeo.height = 1;
					break;
					case "West":
						lGeo.width = geo.height;
						lGeo.height = geo.width;
						//-90 rotation of origin
						lGeo.y = geo.height /2 - geo.width /2;
						lGeo.x = -lGeo.y;
						lblCell.style += ";rotation=-90";
					break;
				}
				lblCell.style += ";align=center;";
			}
			//TODO Spacing still need to be adjusted
			else if (lblLayouts[i]["y:StretchStripeLabelModel"])
			{
				switch (lblLayouts[i]["y:StretchStripeLabelModel"])
				{
					case "North":
						lGeo.height = 1;
					break;
					case "West":
						lGeo.width = geo.height;
						lGeo.height = geo.width;
						//-90 rotation of origin
						lGeo.y = geo.height /2 - geo.width /2;
						lGeo.x = -lGeo.y;
						lblCell.style += ";rotation=-90;";
					break;
				}
			}
			else if (lblLayouts[i]["bpmn:PoolHeaderLabelModel"])
			{
				//TODO merge with previous one if they are identical in all cases!
				switch (lblLayouts[i]["bpmn:PoolHeaderLabelModel"])
				{
					case "NORTH":
						lGeo.height = 1;
					break;
					case "WEST":
						lGeo.width = geo.height;
						lGeo.height = geo.width;
						//-90 rotation of origin
						lGeo.y = geo.height /2 - geo.width /2;
						lGeo.x = -lGeo.y;
						lblCell.style += ";rotation=-90;";
					break;
				}
				lblCell.style += ";align=center;";
			}
			else if (lblLayouts[i]["y:InteriorStretchLabelModelParameter"])
			{
				//TODO probably mapObject is needed in this method in general
				try {
					var insets = lblLayouts[i]["y:InteriorStretchLabelModelParameter"]["Model"]["y:InteriorStretchLabelModel"]["Insets"];
					//TODO how to map it?
				} catch(e) {
					//Ignore
				}
				lblCell.style += ";align=center;";
			}
			else if (lblLayouts[i]["y:FreeEdgeLabelModelParameter"])
			{
				lGeo.relative = true;
				var layout = lblLayouts[i]["y:FreeEdgeLabelModelParameter"];
				var ratio = layout["Ratio"];
				var distance = layout["Distance"];
				var angle = layout["Angle"];
				
				if (angle)
				{
					lblCell.style += ";rotation=" + (parseFloat(angle) * (180 / Math.PI));
				}
				//TODO what is the formula?
			}
			else if (lblLayouts[i]["y:ExteriorLabelModel"])
			{
				var lblPos;
				switch (lblLayouts[i]["y:ExteriorLabelModel"])
				{
					case "East":
						lblCell.style += ";labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;";
					break;
					case "South":
						lblCell.style += ";labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;";
					break;
					case "North":
						lblCell.style += ";labelPosition=center;verticalLabelPosition=top;align=center;verticalAlign=bottom;"
					break;
					case "West":
						lblCell.style += ";labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;";
					break;
				}
			}
		}
	}
	return {lblTxts: lblTxts, lblStyles: lblStyles};
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

var mxGraphMlArrowsMap =
{
	"SIMPLE": "open",
	"TRIANGLE": "block",
	"DIAMOND": "diamond",
	"CIRCLE": "oval",
	"CROSS": "cross",
	"SHORT": "classicThin",
	
};

var mxGraphMlShapesMap =
{
	"STAR5": "mxgraph.basic.star;flipV=1", //TODO This is not close enough!
	"STAR6": "mxgraph.basic.6_point_star;rotation=30", //TODO requires rotation!
	"STAR8": "mxgraph.basic.8_point_star",
	"SHEARED_RECTANGLE": "parallelogram",
	"SHEARED_RECTANGLE2": "parallelogram;flipH=1",
	"HEXAGON": "hexagon",
	"OCTAGON": "mxgraph.basic.octagon",
	"ELLIPSE": "ellipse",
	"ROUND_RECTANGLE": "rect;rounded=1;arcSize=30",
	"DIAMOND": "rhombus",
	"FAT_ARROW": "step;perimeter=stepPerimeter",
	"FAT_ARROW2": "step;perimeter=stepPerimeter;flipH=1",
	"TRAPEZ": "trapezoid;perimeter=trapezoidPerimeter;flipV=1",
	"TRAPEZ2": "trapezoid;perimeter=trapezoidPerimeter",
	"TRIANGLE": "triangle;rotation=270", //TODO requires rotation!
	"TRIANGLE2": "triangle;rotation=90", //TODO requires rotation!
	//flowchart
	"process": "mxgraph.flowchart.process",
	"decision": "mxgraph.flowchart.decision",
	"start1": "mxgraph.flowchart.start_1",
	"start2": "mxgraph.flowchart.start_2;aspect=fixed",
	"terminator": "mxgraph.flowchart.terminator",
	"cloud": "cloud",
	"data": "mxgraph.flowchart.data",
	"directData": "mxgraph.flowchart.direct_data",
	"dataBase": "mxgraph.flowchart.database",
	"document": "mxgraph.flowchart.document",
	"predefinedProcess": "mxgraph.flowchart.predefined_process",
	"storedData": "mxgraph.flowchart.stored_data",
	"internalStorage": "mxgraph.flowchart.internal_storage",
	"sequentialData": "mxgraph.flowchart.sequential_data;aspect=fixed",
	"manualInput": "mxgraph.flowchart.manual_input",
	"card": "card;size=10",
	"paperType": "mxgraph.flowchart.paper_tape",
	"delay": "mxgraph.flowchart.delay",
	"display": "mxgraph.flowchart.display",
	"manualOperation": "mxgraph.flowchart.manual_operation",
	"preparation": "mxgraph.flowchart.preparation",
	"loopLimit": "mxgraph.flowchart.loop_limit",
	"loopLimitEnd": "mxgraph.flowchart.loop_limit;flipV=1",
	"onPageReference": "mxgraph.flowchart.on-page_reference;aspect=fixed",
	"offPageReference": "mxgraph.flowchart.off-page_reference",
	"annotation": "mxgraph.flowchart.annotation_1", //TODO not similar!
	"userMessage": "mxgraph.arrows2.arrow;dy=0;dx=10;notch=0", //TODO requires rotation!
	"networkMessage": "mxgraph.arrows2.arrow;dy=0;dx=0;notch=10",
	//icons (network)
	"database.svg": "mxgraph.networks.storage", //TODO not similar!
	"laptop.svg": "mxgraph.networks.laptop",//TODO not similar!
	"server.svg": "mxgraph.networks.server",//TODO not similar!
	"smartphone.svg": "mxgraph.networks.mobile",//TODO not similar! //TODO fixed aspect ratio
	"switch.svg": "mxgraph.networks.switch",//TODO not similar! //TODO fixed aspect ratio
	"wlan.svg": "mxgraph.networks.wireless_hub",//TODO not similar!
	"workstation.svg": "mxgraph.networks.pc",//TODO not similar!
	//bpmn
	"TRANSACTION": "ext;double=1;rounded=1",
	"SUB_PROCESS": "ext;rounded=1",
	"CALL_ACTIVITY": "ext;rounded=1;strokeWidth=3",
	//TODO two colors for stroke!
	"EXCLUSIVE_WITH_MARKER": "mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;outline=none;symbol=exclusiveGw",  
	"EVENT_BASED": "mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;outline=boundInt;symbol=multiple", 
	"PARALLEL": "mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;outline=none;symbol=parallelGw",
	"INCLUSIVE": "mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;outline=end;symbol=general",
	"COMPLEX": "mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;outline=none;symbol=complexGw",
	"EXCLUSIVE_EVENT_BASED": "mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;outline=standard;symbol=multiple", 
	"PARALLEL_EVENT_BASED": "mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;outline=standard;symbol=parallelMultiple",
	//hexagon
	"CALLING_GLOBAL_CONVERSATION": "hexagon;strokeWidth=4",
	//mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=general
	"MESSAGE": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=message",
	"TIMER": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=timer",
	"ESCALATION": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=escalation",
	"CONDITIONAL": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=conditional",
	"LINK": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=link",
	"ERROR": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=error",
	"CANCEL": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=cancel",
	"COMPENSATION": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=compensation",
	"SIGNAL": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=signal",
	"MULTIPLE": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=multiple",
	"PARALLEL_MULTIPLE": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=parallelMultiple",
	"TERMINATE": "mxgraph.bpmn.shape;perimeter=ellipsePerimeter;symbol=terminate",
	bpmnOutline: {
		"SUB_PROCESS_INTERRUPTING": "eventInt",
		"SUB_PROCESS_NON_INTERRUPTING": "eventNonint",
		"CATCHING": "catching",
		"BOUNDARY_INTERRUPTING": "boundInt",
		"BOUNDARY_NON_INTERRUPTING": "boundNonint",
		"THROWING": "throwing",
		"END": "end",
		"CATCHING": "catching"
	},
	//Male/Female icons (FIXME Not similar and unsafe as it refers to remote resources)
	"usericon_female1.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-128.png",
	"usericon_female2.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-128.png",
	"usericon_female3.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-128.png",
	"usericon_female4.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-128.png",
	"usericon_female5.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-128.png",
	"usericon_male1.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
	"usericon_male2.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
	"usericon_male3.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
	"usericon_male4.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
	"usericon_male5.svg": "image;image=https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png",
	"": "",
	"": "",
	"": "",
	"": "",
	"": "",
	"": "",
	"": ""
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

(function()
{
	// Adds EIP shapes
	Sidebar.prototype.addEipMessageConstructionPalette = function(expand)
	{
		var s = "strokeWidth=2;dashed=0;align=center;fontSize=8;shape=";
		var s2 = "strokeWidth=2;dashed=0;align=center;fontSize=8;shape=mxgraph.eip.";
		var s3 = "strokeWidth=3;dashed=0;align=center;fontSize=8;shape=mxgraph.eip.";
		var gn = 'mxgraph.eip';
		var dt = 'eip enterprise integration pattern message construction ';
		var sb = this;
		
		var fns = [
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;strokeColor=#808080;endArrow=block;endSize=10;dashed=0;verticalAlign=bottom;strokeWidth=2;', 
					160, 0, '', 'Pipe', null, this.getTagsForStencil(gn, '', dt + 'pipe').join(' ')),
		    this.createVertexTemplateEntry(s + 'rect;fillColor=#c0f5a9;strokeColor=#000000;verticalLabelPosition=bottom;verticalAlign=top;', 
		    		150, 90, '', 'Filter', null, null, this.getTagsForStencil(gn, '', dt + 'filter').join(' ')),
			this.addEntry(dt + 'edge', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('C', new mxGeometry(16, 18, 12, 12), s + 'rect;fillColor=#FF8080;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, bg1, bg2], 28, 30, 'Command Message');
			}),
			this.addEntry(dt + 'correlation identifier', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('A', new mxGeometry(16, 18, 12, 12), s + 'rect;fillColor=#FF9238;strokeColor=#000000;fontStyle=1;fontColor=#ffffff;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
		    	var bg3 = new mxCell('', new mxGeometry(50, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg3.vertex = true;
				var bg4 = new mxCell('B', new mxGeometry(66, 18, 12, 12), s + 'rect;fillColor=#FF9238;strokeColor=#000000;fontStyle=1;fontColor=#ffffff;');
				bg4.vertex = true;
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	bg3.insertEdge(edge2, false);
		    	bg4.insertEdge(edge2, true);
				var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=block;html=1;endFill=1;strokeWidth=2;strokeColor=#FF9238');
		    	edge3.geometry.setTerminalPoint(new mxPoint(45, 6), true);
		    	edge3.geometry.setTerminalPoint(new mxPoint(17, 6), false);
		    	edge3.geometry.relative = true;
		    	edge3.edge = true;
			    
			   	return sb.createVertexTemplateFromCells([edge1, edge2, edge3, bg1, bg2, bg3, bg4], 78, 30, 'Correlation Identifier');
			}),
			this.addEntry(dt + 'document message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('D', new mxGeometry(16, 18, 12, 12), s + 'rect;fillColor=#C7A0FF;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, bg1, bg2], 28, 30, 'Document Message');
			}),
			this.addEntry(dt + 'event message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('E', new mxGeometry(16, 18, 12, 12), s + 'rect;fillColor=#83BEFF;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, bg1, bg2], 28, 30, 'Event Message');
			}),
		    this.createVertexTemplateEntry(s3 + 'messExp;html=1;verticalLabelPosition=bottom;strokeColor=#000000;verticalAlign=top', 
		    		48, 48, '', 'Message Expiration', null, null, this.getTagsForStencil(gn, '', dt + 'message expiration').join(' ')),
			this.addEntry(dt + 'message sequence', function()
			{
				var bg1 = new mxCell('1', new mxGeometry(0, 12, 12, 12), s + 'rect;fillColor=#80FF6C;strokeColor=#000000;fontStyle=1;');
				bg1.vertex = true;
				var bg2 = new mxCell('2', new mxGeometry(24, 12, 12, 12), s + 'rect;fillColor=#80FF6C;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var bg3 = new mxCell('3', new mxGeometry(48, 12, 12, 12), s + 'rect;fillColor=#80FF6C;strokeColor=#000000;fontStyle=1;');
				bg3.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'curved=1;endArrow=block;html=1;strokeColor=#1CCF00;strokeWidth=2;endSize=3;');
				bg1.insertEdge(edge1, false);
				bg2.insertEdge(edge1, true);
				edge1.geometry.points = [new mxPoint(18, 0)];
				edge1.geometry.relative = true;
				edge1.edge = true;
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'curved=1;endArrow=block;html=1;strokeColor=#1CCF00;strokeWidth=2;endSize=3;');
				bg2.insertEdge(edge2, false);
				bg3.insertEdge(edge2, true);
				edge2.geometry.points = [new mxPoint(42, 0)];
				edge2.geometry.relative = true;
				edge2.edge = true;
			    
			   	return sb.createVertexTemplateFromCells([edge1, edge2, bg1, bg2, bg3], 60, 24, 'Message Sequence');
			}),
		    this.createVertexTemplateEntry(s3 + 'retAddr;html=1;verticalLabelPosition=bottom;fillColor=#FFE040;strokeColor=#000000;verticalAlign=top;', 
		    		78, 48, '', 'Return Address', null, null, this.getTagsForStencil(gn, 'retAddr', dt + 'return address').join(' '))
		];
		  
		this.addPalette('eipMessage Construction', 'EIP / Message Construction', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addEipMessageRoutingPalette = function(expand)
	{
		var s = "strokeWidth=2;dashed=0;align=center;fontSize=8;shape=rect;fillColor=#fffbc0;strokeColor=#000000;";
		var s2 = "strokeWidth=2;dashed=0;align=center;fontSize=8;fillColor=#c0f5a9;verticalLabelPosition=bottom;verticalAlign=top;strokeColor=#000000;shape=mxgraph.eip.";
		var s3 = "edgeStyle=none;endArrow=none;dashed=0;html=1;strokeWidth=2;";
		var gn = 'mxgraph.eip';
		var dt = 'eip enterprise integration pattern message routing ';
		var sb = this;
		
		var fns = [
		    this.createVertexTemplateEntry(s2 + 'aggregator;', 
		    		150, 90, '', 'Aggregator', null, null, this.getTagsForStencil(gn, 'aggregator', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'composed_message_processor;', 
		    		150, 90, '', 'Composed Message Processor', null, null, this.getTagsForStencil(gn, 'composed_message_processor', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'content_based_router;', 
		    		150, 90, '', 'Content Based Router', null, null, this.getTagsForStencil(gn, 'content_based_router', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'dynamic_router;', 
		    		150, 90, '', 'Dynamic Router', null, null, this.getTagsForStencil(gn, 'dynamic_router', dt + '').join(' ')),

			this.addEntry(dt + 'message broker', function()
			{
			    var bg1 = new mxCell('', new mxGeometry(47, 0, 26, 18), s);
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(0, 18, 26, 18), s);
				bg2.vertex = true;
				var bg3 = new mxCell('', new mxGeometry(94, 18, 26, 18), s);
				bg3.vertex = true;
				var bg4 = new mxCell('', new mxGeometry(0, 54, 26, 18), s);
				bg4.vertex = true;
				var bg5 = new mxCell('', new mxGeometry(94, 54, 26, 18), s);
				bg5.vertex = true;
				var bg6 = new mxCell('', new mxGeometry(47, 72, 26, 18), s);
				bg6.vertex = true;
				var bg7 = new mxCell('', new mxGeometry(47, 36, 26, 18), "strokeWidth=2;dashed=0;align=center;fontSize=8;shape=rect;fillColor=#c0f5a9;strokeColor=#000000;");
				bg7.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), s3);
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg7.insertEdge(edge1, true);
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), s3);
		    	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	bg2.insertEdge(edge2, false);
		    	bg7.insertEdge(edge2, true);
				var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), s3);
		    	edge3.geometry.relative = true;
		    	edge3.edge = true;
		    	bg3.insertEdge(edge3, false);
		    	bg7.insertEdge(edge3, true);
				var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), s3);
		    	edge4.geometry.relative = true;
		    	edge4.edge = true;
		    	bg4.insertEdge(edge4, false);
		    	bg7.insertEdge(edge4, true);
				var edge5 = new mxCell('', new mxGeometry(0, 0, 0, 0), s3);
		    	edge5.geometry.relative = true;
		    	edge5.edge = true;
		    	bg5.insertEdge(edge5, false);
		    	bg7.insertEdge(edge5, true);
				var edge6 = new mxCell('', new mxGeometry(0, 0, 0, 0), s3);
		    	edge6.geometry.relative = true;
		    	edge6.edge = true;
		    	bg6.insertEdge(edge6, false);
		    	bg7.insertEdge(edge6, true);
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg2, bg3, bg4, bg5, bg6, bg7, edge1, edge2, edge3, edge4, edge5, edge6], 
						120, 90, 'Message Broker');
			}),
	
		    this.createVertexTemplateEntry(s2 + 'message_filter;', 
		    		150, 90, '', 'Message Filter', null, null, this.getTagsForStencil(gn, 'message_filter', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'process_manager;', 
		    		150, 90, '', 'Process Manager', null, null, this.getTagsForStencil(gn, 'process_manager', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'recipient_list;', 
		    		150, 90, '', 'Recipient List', null, null, this.getTagsForStencil(gn, 'recipient_list', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'resequencer;', 
		    		150, 90, '', 'Resequencer', null, null, this.getTagsForStencil(gn, 'resequencer', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'routing_slip;', 
		    		150, 90, '', 'Routing Slip', null, null, this.getTagsForStencil(gn, 'routing_slip', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'splitter;', 
		    		150, 90, '', 'Splitter', null, null, this.getTagsForStencil(gn, 'splitter', dt + '').join(' '))
		];
		
		this.addPalette('eipMessage Routing', 'EIP / Message Routing', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addEipMessageTransformationPalette = function(expand)
	{
		var s = "strokeWidth=2;dashed=0;align=center;fontSize=8;fillColor=#c0f5a9;verticalLabelPosition=bottom;verticalAlign=top;strokeColor=#000000;shape=mxgraph.eip.";
		var gn = 'mxgraph.eip';
		var dt = 'eip enterprise integration pattern message transformation ';

		this.addPaletteFunctions('eipMessage Transformation', 'EIP / Message Transformation', false,
		[
		    this.createVertexTemplateEntry(s + 'claim_check;', 
		    		150, 90, '', 'Claim Check', null, null, this.getTagsForStencil(gn, 'claim_check', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s + 'content_enricher;', 
		    		150, 90, '', 'Content Enricher', null, null, this.getTagsForStencil(gn, 'content_enricher', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s + 'content_filter;', 
		    		150, 90, '', 'Content Filter', null, null, this.getTagsForStencil(gn, 'content_filter', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s + 'envelope_wrapper;', 
		    		150, 90, '', 'Envelope Wrapper', null, null, this.getTagsForStencil(gn, 'envelope_wrapper', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s + 'normalizer;', 
		    		150, 90, '', 'Normalizer', null, null, this.getTagsForStencil(gn, 'normalizer', dt + '').join(' '))
		]);
	};

	Sidebar.prototype.addEipMessagingChannelsPalette = function(expand)
	{
		var s = "strokeWidth=2;dashed=0;align=center;fontSize=8;html=1;shape=";
		var s2 = "strokeWidth=2;strokeColor=#000000;dashed=0;align=center;html=1;fontSize=8;shape=mxgraph.eip.";
		var s3 = "strokeWidth=1;strokeColor=#000000;dashed=0;align=center;html=1;fontSize=8;shape=mxgraph.eip.";
		var gn = 'mxgraph.eip';
		var dt = 'eip enterprise integration pattern messaging channel message ';
		var sb = this;
		
		var fns = [
			this.createEdgeTemplateEntry('edgeStyle=none;html=1;strokeColor=#808080;endArrow=block;endSize=10;dashed=0;verticalAlign=bottom;strokeWidth=2;', 
					160, 0, '', 'Point to Point Channel', null, this.getTagsForStencil(gn, '', dt + 'point').join(' ')),

			this.addEntry(dt + 'publish subscribe', function()
			{
				var bg1 = new mxCell('', new mxGeometry(40, 120, 0, 0), s + 'rect;');
				bg1.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;endArrow=none;endSize=10;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(40, 0), true);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	bg1.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;edgeStyle=orthogonalEdgeStyle;endArrow=block;endSize=10;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(0, 160), false);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	bg1.insertEdge(edge2, true);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;edgeStyle=orthogonalEdgeStyle;endArrow=block;endSize=10;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(40, 160), false);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
			   	bg1.insertEdge(edge3, true);
			   	var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'rounded=0;edgeStyle=orthogonalEdgeStyle;endArrow=block;endSize=10;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
			   	edge4.geometry.setTerminalPoint(new mxPoint(80, 160), false);
			   	edge4.geometry.relative = true;
			   	edge4.edge = true;
			   	bg1.insertEdge(edge4, true);
			    
			   	return sb.createVertexTemplateFromCells([bg1, edge1, edge2, edge3, edge4], 80, 160, 'Publish Subscribe Channel');
			}),
	
		    this.createVertexTemplateEntry(s2 + 'channel_adapter;fillColor=#9ddbef;', 
		    		45, 90, '', 'Channel Adapter', null, null, this.getTagsForStencil(gn, 'channel_adapter', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s3 + 'messageChannel;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;', 
		    		100, 20, '', 'Message Channel', null, null, this.getTagsForStencil(gn, 'messageChannel', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s3 + 'dataChannel;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;', 
		    		100, 20, '', 'Datatype Channel', null, null, this.getTagsForStencil(gn, 'dataChannel', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s3 + 'deadLetterChannel;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;', 
		    		100, 20, '', 'Dead Letter Channel', null, null, this.getTagsForStencil(gn, 'deadLetterChannel', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s3 + 'invalidMessageChannel;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;', 
		    		100, 20, '', 'Invalid Message Channel', null, null, this.getTagsForStencil(gn, 'invalidMessageChannel', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'messaging_bridge;verticalLabelPosition=bottom;verticalAlign=top;fillColor=#c0f5a9;', 
		    		150, 90, '', 'Messaging Bridge', null, null, this.getTagsForStencil(gn, 'messaging_bridge', dt + '').join(' ')),

			this.addEntry(dt + 'message bus', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 60, 120, 20), s2 + 'messageChannel;');
				bg1.vertex = true;
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;strokeWidth=2;rounded=0;endArrow=block;startArrow=block;startSize=10;endSize=10;dashed=0;html=1;strokeColor=#808080;');
			   	edge1.geometry.setTerminalPoint(new mxPoint(60, 140), true);
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	bg1.insertEdge(edge1, false);
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;strokeWidth=2;rounded=0;endArrow=block;startArrow=block;startSize=10;endSize=10;dashed=0;html=1;strokeColor=#808080;');
			   	edge2.geometry.setTerminalPoint(new mxPoint(20, 0), true);
			   	edge2.geometry.relative = true;
			   	edge2.edge = true;
			   	bg1.insertEdge(edge2, false);
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;strokeWidth=2;rounded=0;endArrow=block;startArrow=block;startSize=10;endSize=10;dashed=0;html=1;strokeColor=#808080;');
			   	edge3.geometry.setTerminalPoint(new mxPoint(60, 0), true);
			   	edge3.geometry.relative = true;
			   	edge3.edge = true;
			   	bg1.insertEdge(edge3, false);
			   	var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;strokeWidth=2;rounded=0;endArrow=block;startArrow=block;startSize=10;endSize=10;dashed=0;html=1;strokeColor=#808080;');
			   	edge4.geometry.setTerminalPoint(new mxPoint(100, 0), true);
			   	edge4.geometry.relative = true;
			   	edge4.edge = true;
			   	bg1.insertEdge(edge4, false);
			    
			   	return sb.createVertexTemplateFromCells([bg1, edge1, edge2, edge3, edge4], 120, 140, 'Message Bus');
			})
		];
		
		this.addPalette('eipMessaging Channels', 'EIP / Messaging Channels', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addEipMessagingEndpointsPalette = function(expand)
	{
		var s = "dashed=0;strokeWidth=2;strokeColor=#000000;html=1;align=center;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.eip.";
		var s2 = 'fillColor=#c0f5a9;' + s;
		var gn = 'mxgraph.eip';
		var dt = 'eip enterprise integration pattern messaging endpoint ';
		
		this.addPaletteFunctions('eipMessaging Endpoints', 'EIP / Messaging Endpoints', false,
		[
		    this.createVertexTemplateEntry(s2 + 'competing_consumers;', 
		    		150, 90, '', 'Competing Consumers', null, null, this.getTagsForStencil(gn, 'competing_consumers', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s + 'durable_subscriber;fillColor=#a0a0a0;', 
		    		30, 35, '', 'Durable Subscriber', null, null, this.getTagsForStencil(gn, 'durable_subscriber', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'event_driven_consumer;', 
		    		150, 90, '', 'Event Driven Consumer', null, null, this.getTagsForStencil(gn, 'event_driven_consumer', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'message_dispatcher;', 
		    		150, 90, '', 'Message Dispatcher', null, null, this.getTagsForStencil(gn, 'message_dispatcher', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'messaging_gateway;', 
		    		150, 90, '', 'Messaging Gateway', null, null, this.getTagsForStencil(gn, 'messaging_gateway', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'polling_consumer;', 
		    		150, 90, '', 'Polling Consumer', null, null, this.getTagsForStencil(gn, 'polling_consumer', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'selective_consumer;', 
		    		150, 90, '', 'Selective Consumer', null, null, this.getTagsForStencil(gn, 'selective_consumer', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'service_activator;', 
		    		150, 90, '', 'Service Activator', null, null, this.getTagsForStencil(gn, 'service_activator', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'transactional_client;', 
		    		150, 90, '', 'Transactional Client', null, null, this.getTagsForStencil(gn, 'transactional_client', dt + '').join(' '))
		]);
	};

	Sidebar.prototype.addEipMessagingSystemsPalette = function(expand)
	{
		var s = "strokeWidth=2;dashed=0;align=center;fontSize=8;shape=";
		var s2 = "strokeWidth=2;dashed=0;align=center;fontSize=8;shape=mxgraph.eip.";
		var s3 = "strokeWidth=1;dashed=0;align=center;fontSize=8;shape=";
		var s4 = "strokeWidth=1;dashed=0;align=center;fontSize=8;shape=mxgraph.eip.";
		var gn = 'mxgraph.eip';
		var dt = 'eip enterprise integration pattern messaging system ';
		var sb = this;
		
		var fns = [
			this.createVertexTemplateEntry(s2 + 'content_based_router;verticalLabelPosition=bottom;verticalAlign=top;fillColor=#c0f5a9;strokeColor=#000000;', 
					150, 90, '', 'Message Router', null, null, this.getTagsForStencil(gn, 'content_based_router', dt + '').join(' ')),

		    this.createVertexTemplateEntry(s4 + 'messageChannel;html=1;verticalLabelPosition=bottom;strokeColor=#000000;verticalAlign=top;', 
		    		100, 20, '', 'Message Channel', null, null, this.getTagsForStencil(gn, 'messageChannel', dt + '').join(' ')),
		    
			this.addEntry(dt + 'message endpoint', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 150, 90), s + 'rect;verticalLabelPosition=bottom;verticalAlign=top;fillColor=#c0f5a9;strokeColor=#000000;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(85, 25, 40, 40), s3 + 'rect;fillColor=#ffffff;strokeColor=#000000;');
				bg2.vertex = true;
				bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Message Endpoint');
			}),
			    
			this.addEntry(dt + 'message endpoint', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 150, 90), s + 'rect;verticalLabelPosition=bottom;verticalAlign=top;fillColor=#c0f5a9;strokeColor=#000000;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(25, 25, 40, 40), s3 + 'rect;fillColor=#ffffff;strokeColor=#000000;');
				bg2.vertex = true;
				bg1.insert(bg2);
			    
			   	return sb.createVertexTemplateFromCells([bg1], bg1.geometry.width, bg1.geometry.height, 'Message Endpoint');
			}),
			    
			this.addEntry(dt + 'message endpoint', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 150, 90), s + 'rect;fillColor=#c0f5a9;strokeColor=#000000;verticalLabelPosition=bottom;verticalAlign=top;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(25, 25, 40, 40), s3 + 'rect;fillColor=#ffffff;strokeColor=#000000;verticalLabelPosition=bottom;verticalAlign=top;');
				bg2.vertex = true;
				bg1.insert(bg2);
				var bg3 = new mxCell('', new mxGeometry(250, 0, 150, 90), s + 'rect;fillColor=#c0f5a9;strokeColor=#000000;');
				bg3.vertex = true;
				var bg4 = new mxCell('', new mxGeometry(85, 25, 40, 40), s3 + 'rect;fillColor=#ffffff;strokeColor=#000000;');
				bg4.vertex = true;
				bg3.insert(bg4);
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;strokeWidth=2;rounded=0;endArrow=block;startArrow=none;startSize=10;endSize=10;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
			   	edge1.geometry.relative = true;
			   	edge1.edge = true;
			   	bg2.insertEdge(edge1, true);
			   	bg4.insertEdge(edge1, false);
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg3, edge1], 400, 90, 'Message Endpoint');
			}),
			    
			this.addEntry(dt + 'message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(16, 18, 12, 12), s + 'rect;fillColor=#80FF6C;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
				var bg3 = new mxCell('', new mxGeometry(16, 36, 12, 12), s + 'rect;fillColor=#ff9900;strokeColor=#000000;fontStyle=1;');
				bg3.vertex = true;
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	bg1.insertEdge(edge2, false);
		    	bg3.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, edge2, bg1, bg2, bg3], 28, 48, 'Message');
			}),
	
			this.addEntry(dt + 'message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(16, 18, 12, 12), s + 'rect;fillColor=#80FF6C;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, bg1, bg2], 28, 30, 'Message');
			}),
	
			this.addEntry(dt + 'message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(16, 18, 12, 12), s + 'rect;fillColor=#ff9900;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, bg1, bg2], 28, 30, 'Message');
			}),
	
			this.addEntry(dt + 'message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(16, 18, 12, 12), s2 + 'message_2;fillColor=#00cc00;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
				var bg3 = new mxCell('', new mxGeometry(16, 36, 12, 12), s2 + 'message_1;fillColor=#ff5500;strokeColor=#000000;fontStyle=1;');
				bg3.vertex = true;
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	bg1.insertEdge(edge2, false);
		    	bg3.insertEdge(edge2, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, edge2, bg1, bg2, bg3], 28, 48, 'Message');
			}),
	
			this.addEntry(dt + 'message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(16, 18, 12, 12), s2 + 'message_1;fillColor=#ff5500;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, bg1, bg2], 28, 30, 'Message');
			}),
	
			this.addEntry(dt + 'message', function()
			{
				var bg1 = new mxCell('', new mxGeometry(0, 0, 12, 12), s + 'ellipse;fillColor=#808080;strokeColor=none;');
				bg1.vertex = true;
				var bg2 = new mxCell('', new mxGeometry(16, 18, 12, 12), s2 + 'message_2;fillColor=#00cc00;strokeColor=#000000;fontStyle=1;');
				bg2.vertex = true;
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;strokeColor=#808080;strokeWidth=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	bg1.insertEdge(edge1, false);
		    	bg2.insertEdge(edge1, true);
			    
			   	return sb.createVertexTemplateFromCells([edge1, bg1, bg2], 28, 30, 'Message');
			}),
	
		    this.createVertexTemplateEntry(s2 + 'message_translator;fillColor=#c0f5a9;strokeColor=#000000;verticalLabelPosition=bottom;verticalAlign=top;', 
		    		150, 90, '', 'Message-Translator', null, null, this.getTagsForStencil(gn, 'message_translator', dt + '').join(' '))
		];
		
		this.addPalette('eipMessaging Systems', 'EIP / Messaging Systems', expand || false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};

	Sidebar.prototype.addEipSystemManagementPalette = function(expand)
	{
		var s2 = "strokeWidth=2;dashed=0;align=center;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.eip.";
		var gn = 'mxgraph.eip';
		var dt = 'eip enterprise integration pattern system management ';
		
		this.addPaletteFunctions('eipSystem Management', 'EIP / System Management', false,
		[
		    this.createVertexTemplateEntry(s2 + 'channel_purger;fillColor=#c0f5a9;strokeColor=#000000;', 
		    		150, 90, '', 'Channel Purger', null, null, this.getTagsForStencil(gn, 'channel_purger', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'control_bus;fillColor=#c0f5a9;strokeColor=#000000;', 
		    		60, 40, '', 'Control Bus', null, null, this.getTagsForStencil(gn, 'control_bus', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'detour;fillColor=#c0f5a9;strokeColor=#000000;', 
		    		150, 90, '', 'Detour', null, null, this.getTagsForStencil(gn, 'detour', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'message_store;fillColor=#c0f5a9;strokeColor=#000000;', 
		    		150, 90, '', 'Message Store', null, null, this.getTagsForStencil(gn, 'message_store', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'smart_proxy;fillColor=#c0f5a9;strokeColor=#000000;', 
		    		70, 90, '', 'Smart Proxy', null, null, this.getTagsForStencil(gn, 'smart_proxy', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'test_message;fillColor=#c0f5a9;strokeColor=#000000;', 
		    		150, 90, '', 'Test Message', null, null, this.getTagsForStencil(gn, 'test_message', dt + '').join(' ')),
		    this.createVertexTemplateEntry(s2 + 'wire_tap;fillColor=#c0f5a9;strokeColor=#000000;', 
		    		150, 90, '', 'Wire Tap', null, null, this.getTagsForStencil(gn, 'wire_tap', dt + '').join(' '))
		]);
	};
	
})();

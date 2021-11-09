(function()
{
	Sidebar.prototype.addC4Palette = function()
	{
		var w = 100;
		var h = 100;
		var gn = 'mxgraph.c4';
		var dt = 'c4 ';
		var pts = 'points=[[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];';
		this.setCurrentSearchEntryLibrary('c4');
		
		this.addPaletteFunctions('c4', 'C4', false,
		[
			this.addEntry(dt + 'person', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2, h * 1.8), 'html=1;fontSize=11;dashed=0;whitespace=wrap;fillColor=#083F75;strokeColor=#06315C;fontColor=#ffffff;shape=mxgraph.c4.person2;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Person name');
		        bg.setAttribute('c4Type', 'Person');
		        bg.setAttribute('c4Description', 'Description of person.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%]</div><br><div><font style="font-size: 11px"><font color="#cccccc">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Person');
			}),				
			this.addEntry(dt + 'external person', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2, h * 1.8), 'html=1;fontSize=11;dashed=0;whitespace=wrap;fillColor=#6C6477;strokeColor=#4D4D4D;fontColor=#ffffff;shape=mxgraph.c4.person2;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'External person name');
		        bg.setAttribute('c4Type', 'Person');
		        bg.setAttribute('c4Description', 'Description of external person.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%]</div><br><div><font style="font-size: 11px"><font color="#cccccc">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'External Person');
			}),				
			this.addEntry(dt + 'software system', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.2), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#1061B0;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#0D5091;metaEdit=1;resizable=0;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'System name');
		        bg.setAttribute('c4Type', 'Software System');
		        bg.setAttribute('c4Description', 'Description of software system.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%]</div><br><div><font style="font-size: 11px"><font color="#cccccc">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Software System');
			}),				
			this.addEntry(dt + 'external software system', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.2), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#8C8496;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#736782;metaEdit=1;resizable=0;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'External system name');
		        bg.setAttribute('c4Type', 'Software System');
		        bg.setAttribute('c4Description', 'Description of external software system.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%]</div><br><div><font style="font-size: 11px"><font color="#cccccc">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'External Software System');
			}),				
			this.addEntry(dt + 'container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.2), 'rounded=1;whiteSpace=wrap;html=1;fontSize=11;labelBackgroundColor=none;fillColor=#23A2D9;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#0E7DAD;metaEdit=1;resizable=0;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Container name');
		        bg.setAttribute('c4Type', 'Container');
		        bg.setAttribute('c4Technology', 'e.g. SpringBoot, ElasticSearch, etc.');
		        bg.setAttribute('c4Description', 'Description of container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%: %c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Container');
			}),				
			this.addEntry(dt + 'data container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.2), 'shape=cylinder3;size=15;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;fillColor=#23A2D9;fontSize=12;fontColor=#ffffff;align=center;strokeColor=#0E7DAD;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Type', 'Container name');
		        bg.setAttribute('c4Container', 'Container ');
		        bg.setAttribute('c4Technology', 'e.g. Oracle Database 12');
		        bg.setAttribute('c4Description', 'Description of storage type container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Type%</font><div>[%c4Container%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Container');
			}),				
			this.addEntry(dt + 'microservice container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2, h * 1.7), 'shape=hexagon;size=50;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;rounded=1;labelBackgroundColor=none;fillColor=#23A2D9;fontSize=12;fontColor=#ffffff;align=center;strokeColor=#0E7DAD;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Type', 'Container name');
		        bg.setAttribute('c4Container', 'Container ');
		        bg.setAttribute('c4Technology', 'e.g. Micronaut, etc.');
		        bg.setAttribute('c4Description', 'Description of microservice type container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Type%</font><div>[%c4Container%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Microservice Container');
			}),				
			this.addEntry(dt + 'message bus container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.2), 'shape=cylinder3;size=15;direction=south;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;fillColor=#23A2D9;fontSize=12;fontColor=#ffffff;align=center;strokeColor=#0E7DAD;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Type', 'Container name');
		        bg.setAttribute('c4Container', 'Container ');
		        bg.setAttribute('c4Technology', 'e.g. Apache Kafka, etc.');
		        bg.setAttribute('c4Description', 'Description of message bus type container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Type%</font><div>[%c4Container%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Message Bus Container');
			}),				
			this.addEntry(dt + 'web browser container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.6), 'shape=mxgraph.c4.webBrowserContainer;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;fillColor=#118ACD;fontSize=12;fontColor=#ffffff;align=center;strokeColor=#0E7DAD;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Type', 'Container name');
		        bg.setAttribute('c4Container', 'Container ');
		        bg.setAttribute('c4Technology', 'e.g. JavaScript, Angular etc.');
		        bg.setAttribute('c4Description', 'Description of web browser container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Type%</font><div>[%c4Container%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Web Browser Container');
			}),				
			this.addEntry(dt + 'component', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.2), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#63BEF2;fontColor=#ffffff;align=center;arcSize=6;strokeColor=#2086C9;metaEdit=1;resizable=0;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Component name');
		        bg.setAttribute('c4Type', 'Component');
		        bg.setAttribute('c4Technology', 'e.g. Spring Service');
		        bg.setAttribute('c4Description', 'Description of component role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%: %c4Technology%]</div><br><div><font style="font-size: 11px">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Component');
			}),				
			this.addEntry(dt + 'relationship description technology', function()
		   	{
			    var edge = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, 0), 'endArrow=blockThin;html=1;fontSize=10;fontColor=#404040;strokeWidth=1;endFill=1;strokeColor=#828282;elbow=vertical;metaEdit=1;endSize=14;startSize=14;jumpStyle=arc;jumpSize=16;rounded=0;edgeStyle=orthogonalEdgeStyle;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(w * 2.4, 0), false);
				edge.geometry.relative = true;
			    edge.edge = true;
			    edge.setValue(mxUtils.createXmlDocument().createElement('object'));
			    edge.setAttribute('placeholders', '1');
			    edge.setAttribute('c4Type', 'Relationship');
			    edge.setAttribute('c4Technology', 'e.g. JSON/HTTP');
			    edge.setAttribute('c4Description', 'e.g. Makes API calls');
			    edge.setAttribute('label', '<div style="text-align: left"><div style="text-align: center"><b>%c4Description%</b></div><div style="text-align: center">[%c4Technology%]</div></div>');
			    
			   	return sb.createEdgeTemplateFromCells([edge], edge.geometry.width, edge.geometry.height, 'Relationship with description and technology');
			}),				
			this.addEntry(dt + 'relationship description', function()
		   	{
			    var edge = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, 0), 'endArrow=blockThin;html=1;fontSize=10;fontColor=#404040;strokeWidth=1;endFill=1;strokeColor=#828282;elbow=vertical;metaEdit=1;endSize=14;startSize=14;jumpStyle=arc;jumpSize=16;rounded=0;edgeStyle=orthogonalEdgeStyle;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(w * 2.4, 0), false);
				edge.geometry.relative = true;
			    edge.edge = true;
			    edge.setValue(mxUtils.createXmlDocument().createElement('object'));
			    edge.setAttribute('placeholders', '1');
			    edge.setAttribute('c4Type', 'Relationship');
			    edge.setAttribute('c4Description', 'e.g. Visits pages');
			    edge.setAttribute('label', '<div style="text-align: left"><div style="text-align: center"><b>%c4Description%</b></div>');
			    
			   	return sb.createEdgeTemplateFromCells([edge], edge.geometry.width, edge.geometry.height, 'Relationship with description');
			}),				
			this.addEntry(dt + 'relationship', function()
		   	{
			    var edge = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, 0), 'endArrow=blockThin;html=1;fontSize=10;fontColor=#404040;strokeWidth=1;endFill=1;strokeColor=#828282;elbow=vertical;metaEdit=1;endSize=14;startSize=14;jumpStyle=arc;jumpSize=16;rounded=0;edgeStyle=orthogonalEdgeStyle;');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(w * 2.4, 0), false);
				edge.geometry.relative = true;
			    edge.edge = true;
			    edge.setValue(mxUtils.createXmlDocument().createElement('object'));
			    edge.setAttribute('placeholders', '1');
			    edge.setAttribute('c4Type', 'Relationship');
			    
			   	return sb.createEdgeTemplateFromCells([edge], edge.geometry.width, edge.geometry.height, 'Relationship');
			}),				
			this.addEntry(dt + 'system scope boundary', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 2.1), 'rounded=1;fontSize=11;whiteSpace=wrap;html=1;dashed=1;arcSize=20;fillColor=none;strokeColor=#666666;fontColor=#333333;labelBackgroundColor=none;align=left;verticalAlign=bottom;labelBorderColor=none;spacingTop=0;spacing=10;dashPattern=8 4;metaEdit=1;rotatable=0;perimeter=rectanglePerimeter;noLabel=0;labelPadding=0;allowArrows=0;connectable=0;expand=0;recursiveResize=0;editable=1;pointerEvents=0;absoluteArcSize=1;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'System name');
		        bg.setAttribute('c4Type', 'SystemScopeBoundary');
		        bg.setAttribute('c4Application', 'Software System');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b><div style="text-align: left">%c4Name%</div></b></font><div style="text-align: left">[%c4Application%]</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'System scope boundary');
			}),				
			this.addEntry(dt + 'container scope boundary', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 2.1), 'rounded=1;fontSize=11;whiteSpace=wrap;html=1;dashed=1;arcSize=20;fillColor=none;strokeColor=#666666;fontColor=#333333;labelBackgroundColor=none;align=left;verticalAlign=bottom;labelBorderColor=none;spacingTop=0;spacing=10;dashPattern=8 4;metaEdit=1;rotatable=0;perimeter=rectanglePerimeter;noLabel=0;labelPadding=0;allowArrows=0;connectable=0;expand=0;recursiveResize=0;editable=1;pointerEvents=0;absoluteArcSize=1;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Container name');
		        bg.setAttribute('c4Type', 'ContainerScopeBoundary');
		        bg.setAttribute('c4Application', 'Container');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b><div style="text-align: left">%c4Name%</div></b></font><div style="text-align: left">[%c4Application%]</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Container scope boundary');
			}),				
			this.addEntry(dt + 'system context diagram title', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.6, h * 0.4), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;whiteSpace=wrap;rounded=0;metaEdit=1;allowArrows=0;resizable=1;rotatable=0;connectable=0;recursiveResize=0;expand=0;pointerEvents=0;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', '[System Context] Diagram title');
		        bg.setAttribute('c4Type', 'ContainerScopeBoundary');
		        bg.setAttribute('c4Description', 'Diagram short description');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b><div style="text-align: left">%c4Name%</div></b></font><div style="text-align: left">%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'System Context diagram title');
			}),				
			this.addEntry(dt + 'container diagram title', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.6, h * 0.4), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;whiteSpace=wrap;rounded=0;metaEdit=1;allowArrows=0;resizable=1;rotatable=0;connectable=0;recursiveResize=0;expand=0;pointerEvents=0;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', '[Containers] Diagram title');
		        bg.setAttribute('c4Type', 'ContainerDiagramTitle');
		        bg.setAttribute('c4Description', 'Diagram short description');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b><div style="text-align: left">%c4Name%</div></b></font><div style="text-align: left">%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Containers diagram title');
			}),				
			this.addEntry(dt + 'component diagram title', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.6, h * 0.4), 'text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;whiteSpace=wrap;rounded=0;metaEdit=1;allowArrows=0;resizable=1;rotatable=0;connectable=0;recursiveResize=0;expand=0;pointerEvents=0;' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', '[Components] Diagram title');
		        bg.setAttribute('c4Type', 'ContainerDiagramTitle');
		        bg.setAttribute('c4Description', 'Diagram short description');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b><div style="text-align: left">%c4Name%</div></b></font><div style="text-align: left">%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Components diagram title');
			}),				
			this.addEntry(dt + 'legend', function()
		   	{
			    var bg1 = new mxCell('Legend', 
			    		new mxGeometry(0, 0, w * 1.8, h * 0.3), 'align=left;fontSize=16;fontStyle=1;strokeColor=none;fillColor=none;fontColor=#4D4D4D;spacingTop=-8;resizable=0;');
		    	bg1.vertex = true;
			    var bg2 = new mxCell('', 
			    		new mxGeometry(0, 30, w * 1.8, h * 1.8), 'shape=table;html=1;whiteSpace=wrap;startSize=0;container=1;collapsible=0;childLayout=tableLayout;fillColor=none;align=left;spacingLeft=10;strokeColor=none;rounded=1;arcSize=11;fontColor=#FFFFFF;resizable=0;' + pts);
		    	bg2.vertex = true;
			    var tableEntry1 = new mxCell('Person', new mxGeometry(0, 0, 160, 30), 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;fillColor=#1E4074;top=0;left=0;bottom=0;right=0;overflow=hidden;pointerEvents=1;align=left;spacingLeft=10;strokeColor=none;fontColor=#FFFFFF;');
		    	tableEntry1.vertex = true;
		    	bg2.insert(tableEntry1);
			    var tableEntry2 = new mxCell('Software System', new mxGeometry(0, 30, 160, 30), 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;fillColor=#3162AF;top=0;left=0;bottom=0;right=0;overflow=hidden;pointerEvents=1;align=left;spacingLeft=10;fontColor=#FFFFFF;');
		    	tableEntry2.vertex = true;
		    	bg2.insert(tableEntry2);
			    var tableEntry3 = new mxCell('Container', new mxGeometry(0, 30, 160, 30), 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;fillColor=#52A2D8;top=0;left=0;bottom=0;right=0;overflow=hidden;pointerEvents=1;align=left;spacingLeft=10;fontColor=#FFFFFF;');
		    	tableEntry3.vertex = true;
		    	bg2.insert(tableEntry3);
			    var tableEntry4 = new mxCell('Component', new mxGeometry(0, 30, 160, 30), 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;fillColor=#7CBEF1;top=0;left=0;bottom=0;right=0;overflow=hidden;pointerEvents=1;align=left;spacingLeft=10;fontColor=#FFFFFF;');
		    	tableEntry4.vertex = true;
		    	bg2.insert(tableEntry4);
			    var tableEntry5 = new mxCell('External Person', new mxGeometry(0, 30, 160, 30), 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;fillColor=#6B6477;top=0;left=0;bottom=0;right=0;overflow=hidden;pointerEvents=1;align=left;spacingLeft=10;fontColor=#FFFFFF;');
		    	tableEntry5.vertex = true;
		    	bg2.insert(tableEntry5);
			    var tableEntry6 = new mxCell('External Software System', new mxGeometry(0, 30, 160, 30), 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;fillColor=#8B8496;top=0;left=0;bottom=0;right=0;overflow=hidden;pointerEvents=1;align=left;spacingLeft=10;fontColor=#FFFFFF;');
		    	tableEntry6.vertex = true;
		    	bg2.insert(tableEntry6);
			    
			   	return sb.createVertexTemplateFromCells([bg1, bg2], bg2.geometry.width, bg1.geometry.height + bg2.geometry.height, 'Legend');
			})				
		]);
		
		this.setCurrentSearchEntryLibrary();
	};
})();

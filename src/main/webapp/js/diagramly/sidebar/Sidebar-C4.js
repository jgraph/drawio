/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	Sidebar.prototype.addC4Palette = function()
	{
		var w = 100;
		var h = 100;
		var dt = 'c4 ';
		var pts = 'points=[[0.25,0,0],[0.5,0,0],[0.75,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];';
		this.setCurrentSearchEntryLibrary('c4');
		
		this.addPaletteFunctions('c4', 'C4', false,
		[
			this.addEntry(dt + 'person', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2, h * 1.8), 'html=1;fontSize=11;dashed=0;whiteSpace=wrap;fillColor=#083F75;strokeColor=#06315C;fontColor=#ffffff;shape=mxgraph.c4.person2;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];resizable=0;');
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
			    		new mxGeometry(0, 0, w * 2, h * 1.8), 'html=1;fontSize=11;dashed=0;whiteSpace=wrap;fillColor=#6C6477;strokeColor=#4D4D4D;fontColor=#ffffff;shape=mxgraph.c4.person2;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];resizable=0;');
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
		        bg.setAttribute('c4Name', 'Container name');
		        bg.setAttribute('c4Type', 'Container');
		        bg.setAttribute('c4Technology', 'e.g. Oracle Database 12');
		        bg.setAttribute('c4Description', 'Description of storage type container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Data Container');
			}),				
			this.addEntry(dt + 'microservice container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2, h * 1.7), 'shape=hexagon;size=50;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;rounded=1;labelBackgroundColor=none;fillColor=#23A2D9;fontSize=12;fontColor=#ffffff;align=center;strokeColor=#0E7DAD;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Container name');
		        bg.setAttribute('c4Type', 'Container');
		        bg.setAttribute('c4Technology', 'e.g. Micronaut, etc.');
		        bg.setAttribute('c4Description', 'Description of microservice type container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Microservice Container');
			}),				
			this.addEntry(dt + 'message bus container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.2), 'shape=cylinder3;size=15;direction=south;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;fillColor=#23A2D9;fontSize=12;fontColor=#ffffff;align=center;strokeColor=#0E7DAD;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Container name');
		        bg.setAttribute('c4Type', 'Container');
		        bg.setAttribute('c4Technology', 'e.g. Apache Kafka, etc.');
		        bg.setAttribute('c4Description', 'Description of message bus type container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Message Bus Container');
			}),				
			this.addEntry(dt + 'web browser container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2.4, h * 1.6), 'shape=mxgraph.c4.webBrowserContainer2;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;strokeColor=#118ACD;fillColor=#23A2D9;strokeColor=#118ACD;strokeColor2=#0E7DAD;fontSize=12;fontColor=#ffffff;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Container name');
		        bg.setAttribute('c4Type', 'Container');
		        bg.setAttribute('c4Technology', 'e.g. JavaScript, Angular etc.');
		        bg.setAttribute('c4Description', 'Description of web browser container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Web Browser Container');
			}),
			this.addEntry(dt + 'mobile device app phone container', function()
		   	{
			    var bg = new mxCell('',
			    		new mxGeometry(0, 0, w * 2.4, h * 1.6), 'shape=mxgraph.c4.mobileDeviceContainer;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;fillColor=#23A2D9;strokeColor=#118ACD;strokeColor2=#0E7DAD;fontSize=12;fontColor=#ffffff;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];resizable=0;');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'Container name');
		        bg.setAttribute('c4Type', 'Container');
		        bg.setAttribute('c4Technology', 'e.g. Swift, Kotlin etc.');
		        bg.setAttribute('c4Description', 'Description of mobile app container role/responsibility.');
		    	bg.setAttribute('label', '<font style="font-size: 16px"><b>%c4Name%</b></font><div>[%c4Type%:&nbsp;%c4Technology%]</div><br><div><font style="font-size: 11px"><font color="#E6E6E6">%c4Description%</font></div>');

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Mobile Device Container');
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
			this.addDataEntry(dt + 'legend', 180, 210, 'Legend',
				'7ZnRcqIwFIafJrc7kAjqZQHtXnRnduq+QCpHyGxImJCK9ul3EoJY0dZ2dhxq1RtychKS/D/fDAdE4mJzr2iZ/5IpcERmiMRKSt1cFZsYOEfYYykiCcLYQxgjPD/R69ter6QKhD5nAG4GrCl/hibyABmItAlXestduMppaS41fTKhqNJU6QV7MTHiIRItpdCUCVCIJL5tc07Litn0xGbkjKcPdCufdTtR24pWUrSz+SEiEeUsE4gkHFamew1KsyXldy6sZWkGMc5jyaW5pZCiWZaSf+EgaCZvQwiTUWL+7U3dFs2Sq5Iumcge7D2TsIu4DSio2AvtNuTODpSGzcnztyF3+PcgC9Bqi7BXs1TnLmPSaOTlwLLcDcO+C9KqCWS7sZ2cCM+dosfVJT1139b1UdaIRLlU7MWoyd0+97W27ZoVnAr4CTQ9CEUy3e5G7UvBRA6KGS2tdjajEddePkmtZdGeszsG76iNUiXLP1Rl0KYcsUEpmdD24IIIBZGHcOz9CFCQIByjIPK7dpDYdKVjKSqtKLO6Aa10DdWhM/G5ouPjom+dLE7a9zxA/oMFRj0L/AZVSXHSCCVVmlH+CEtNRWaf9VwX3D0idc40LEq6NKm1omXz5AuT3Ul0Snq5BrXixmRJztIUxIF6CBNvQubj4MM2sYKDmq2h0d0/otwBUw6oMLc/RKJM0ZRB19eS5RUcfK8LPbp1jM51B/kcEt6yg5utU+3j01GuQQmqIZLPIq16Jtut9CzfBTf0DBE94QXRE/YssJArXVNl3LnYVhqKoVLI90I/8q6bQsE3oND4RqEhUmh6QQpNehaId28qA6UPJnc4mV43fcbfgD7TG32GSB8fXxA/7Wv8K/4UpRRmsQPlT0ii2RxfN3+m34A/vn8D0CABFFwSQP0S72xjXWayhl0MCuNwNB5fN4j8TxaIvxaJbpXoYZJockkS9WvReyT6MrWhSTwZTcMrh9IVlqgRnnffVZv0/c+u/wA=')
		]);
		
		this.setCurrentSearchEntryLibrary();
	};
})();

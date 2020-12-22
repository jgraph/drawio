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
			    		new mxGeometry(0, 0, w * 1.1, h * 1.4), 'html=1;dashed=0;whitespace=wrap;fillColor=#08427b;strokeColor=none;fontColor=#ffffff;shape=mxgraph.c4.person;align=center;metaEdit=1;points=[[0.5,0,0],[1,0.5,0],[1,0.75,0],[0.75,1,0],[0.5,1,0],[0.25,1,0],[0,0.75,0],[0,0.5,0]];metaData={"c4Type":{"editable":false}};');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'name');
		        bg.setAttribute('c4Type', 'Person');
		        bg.setAttribute('c4Description', 'Description');
		    	bg.setAttribute('label', '<b>%c4Name%</b><div>[%c4Type%]</div><br><div>%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Person');
			}),				
			this.addEntry(dt + 'software system', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 1.6, h * 1.1), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#1168BD;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#1168BD;metaEdit=1;metaData={"c4Type":{"editable":false}};' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'name');
		        bg.setAttribute('c4Type', 'Software System');
		        bg.setAttribute('c4Description', 'Description');
		    	bg.setAttribute('label', '<b>%c4Name%</b><div>[%c4Type%]</div><br><div>%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Software System');
			}),				
			this.addEntry(dt + 'software system', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 1.6, h * 1.1), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#999999;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#8A8A8A;metaEdit=1;metaData={"c4Type":{"editable":false}};' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'name');
		        bg.setAttribute('c4Type', 'Software System');
		        bg.setAttribute('c4Description', 'Description');
		    	bg.setAttribute('label', '<b>%c4Name%</b><div>[%c4Type%]</div><br><div>%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Software System');
			}),				
			this.addEntry(dt + 'container', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 1.6, h * 1.1), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#438DD5;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#3C7FC0;metaEdit=1;metaData={"c4Type":{"editable":false}};' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'name');
		        bg.setAttribute('c4Type', 'Container');
		        bg.setAttribute('c4Technology', 'technology');
		        bg.setAttribute('c4Description', 'Description');
		    	bg.setAttribute('label', '<b>%c4Name%</b><div>[%c4Type%: %c4Technology%]</div><br><div>%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Container');
			}),				
			this.addEntry(dt + 'component', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 1.6, h * 1.1), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#85BBF0;fontColor=#ffffff;align=center;arcSize=10;strokeColor=#78A8D8;metaEdit=1;metaData={"c4Type":{"editable":false}};' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'name');
		        bg.setAttribute('c4Type', 'Component');
		        bg.setAttribute('c4Technology', 'technology');
		        bg.setAttribute('c4Description', 'Description');
		    	bg.setAttribute('label', '<b>%c4Name%</b><div>[%c4Type%: %c4Technology%]</div><br><div>%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Component');
			}),				
			this.addEntry(dt + 'execution environment', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 2, h * 1.7), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=5;strokeColor=#000000;verticalAlign=bottom;metaEdit=1;metaData={"c4Type":{"editable":false}};' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'name');
		        bg.setAttribute('c4Type', 'ExecutionEnvironment');
		        bg.setAttribute('c4Application', 'applicationAndVersion');
		    	bg.setAttribute('label', '<div style="text-align: left">%c4Name%</div><div style="text-align: left">[%c4Application%]</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Execution Environment');
			}),				
			this.addEntry(dt + 'deployment node', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0,  w * 2.4, h * 2.3), 'rounded=1;whiteSpace=wrap;html=1;labelBackgroundColor=none;fillColor=#ffffff;fontColor=#000000;align=left;arcSize=5;strokeColor=#000000;verticalAlign=bottom;metaEdit=1;metaData={"c4Type":{"editable":false}};' + pts);
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Name', 'hostname');
		        bg.setAttribute('c4Type', 'DeploymentNode');
		        bg.setAttribute('c4OperationSystem', 'operationSystem');
		        bg.setAttribute('c4ScalingFactor', 'scalingFactor');
		    	bg.setAttribute('label', '<div style="text-align: left">%c4Name%</div><div style="text-align: left">[%c4OperationSystem%]</div><div style="text-align: right">%c4ScalingFactor%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Deployment Node');
			}),				
			this.addEntry(dt + 'database', function()
		   	{
			    var bg = new mxCell('', 
			    		new mxGeometry(0, 0, w * 1.6, h * 1.4), 'shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;rounded=0;labelBackgroundColor=none;fillColor=#438DD5;fontSize=12;fontColor=#ffffff;align=center;strokeColor=#3C7FC0;metaEdit=1;points=[[0.5,0,0],[1,0.25,0],[1,0.5,0],[1,0.75,0],[0.5,1,0],[0,0.75,0],[0,0.5,0],[0,0.25,0]];metaData={"c4Type":{"editable":false}};');
		    	bg.vertex = true;
		    	bg.setValue(mxUtils.createXmlDocument().createElement('object'));
		    	bg.setAttribute('placeholders', '1');
		        bg.setAttribute('c4Type', 'Database');
		        bg.setAttribute('c4Technology', 'Technology');
		        bg.setAttribute('c4Description', 'Description');
		    	bg.setAttribute('label', '%c4Type%<div>[Container:&nbsp;%c4Technology%]</div><br><div>%c4Description%</div>');
			    
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Database');
			}),				
			this.addEntry(dt + 'relationship', function()
		   	{
			    var edge = new mxCell('', 
			    		new mxGeometry(0, 0, w * 1.6, 0), 'edgeStyle=none;rounded=0;html=1;entryX=0;entryY=0.5;jettySize=auto;orthogonalLoop=1;strokeColor=#707070;strokeWidth=2;fontColor=#707070;jumpStyle=none;dashed=1;metaEdit=1;metaData={"c4Type":{"editable":false}};');
				edge.geometry.setTerminalPoint(new mxPoint(0, 0), true);
				edge.geometry.setTerminalPoint(new mxPoint(w * 1.6, 0), false);
				edge.geometry.relative = true;
			    edge.edge = true;
			    edge.setValue(mxUtils.createXmlDocument().createElement('object'));
			    edge.setAttribute('placeholders', '1');
			    edge.setAttribute('c4Type', 'Relationship');
			    edge.setAttribute('c4Technology', 'technology');
			    edge.setAttribute('c4Description', 'Description');
			    edge.setAttribute('label', '<div style="text-align: left"><div style="text-align: center"><b>%c4Description%</b></div><div style="text-align: center">[%c4Technology%]</div></div>');
			    
			   	return sb.createEdgeTemplateFromCells([edge], edge.geometry.width, edge.geometry.height, 'Relationship');
			})				
		]);
		
		this.setCurrentSearchEntryLibrary();
	};
})();

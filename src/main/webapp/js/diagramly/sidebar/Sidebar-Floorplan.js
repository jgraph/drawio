(function()
{
	// Adds Floorplan shapes
	Sidebar.prototype.addFloorplanPalette = function()
	{
		var w = 100;
		var h = 100;
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;align=center;shape=mxgraph.floorplan.';
		var s2 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;align=center;shape=mxgraph.floorplan.';
		var gn = 'mxgraph.floorplan';
		var dt = 'floorplan ';

		var fns =
			[
			this.createVertexTemplateEntry(s + 'wall;fillColor=#000000;', 
					w, 10, '', 'Wall (Horizontal)', null, null, this.getTagsForStencil(gn, 'wall', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wall;fillColor=#000000;direction=south;', 
					10, h, '', 'Wall (Vertical)', null, null, this.getTagsForStencil(gn, 'wall', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;', 
					w, h, '', 'Wall (Corner NW)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;direction=south;', 
					w, h, '', 'Wall (Corner NE)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;direction=west', 
					w, h, '', 'Wall (Corner SE)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallCorner;fillColor=#000000;direction=north', 
					w, h, '', 'Wall (Corner SW)', null, null, this.getTagsForStencil(gn, 'wallCorner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallU;fillColor=#000000;', 
					w, h, '', 'Wall (U)', null, null, this.getTagsForStencil(gn, 'wallU', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'room;fillColor=#000000;', 
					w, h, '', 'Room', null, null, this.getTagsForStencil(gn, 'room', dt).join(' ')),
		 	this.createVertexTemplateEntry('shape=dimension;whiteSpace=wrap;html=1;align=center;points=[];verticalAlign=bottom;spacingBottom=-5;labelBackgroundColor=#ffffff', 100, 40, 'Label', 'Horizontal Dimension', null, null, 'horizontal dimension measure distance unit'),
		 	this.createVertexTemplateEntry('shape=dimension;direction=west;whiteSpace=wrap;html=1;align=center;points=[];verticalAlign=top;spacingTop=-8;labelBackgroundColor=#ffffff', 100, 40, 'Label', 'Vertical Dimension', null, null, 'vertical dimension measure distance unit'),
		 	this.createVertexTemplateEntry('shape=dimension;direction=north;whiteSpace=wrap;html=1;align=right;points=[];verticalAlign=middle;labelBackgroundColor=#ffffff', 40, 100, 'Label', 'Vertical Dimension', null, null, 'vertical dimension measure distance unit'),
		 	this.createVertexTemplateEntry('shape=dimension;direction=south;whiteSpace=wrap;html=1;align=left;points=[];verticalAlign=middle;labelBackgroundColor=#ffffff', 40, 100, 'Label', 'Horizontal Dimension', null, null, 'horizontal dimension measure distance unit'),
		 	this.createVertexTemplateEntry(s + 'window;fillColor=#ffffff;', 
					w, 10, '', 'Window', null, null, this.getTagsForStencil(gn, 'window', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stairs;', 
					300, 100, '', 'Stairs', null, null, this.getTagsForStencil(gn, 'stairs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stairs;direction=south;', 
					100, 300, '', 'Stairs', null, null, this.getTagsForStencil(gn, 'stairs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stairsRest;', 
					300, 200, '', 'Stairs', null, null, this.getTagsForStencil(gn, 'stairsRest', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'doorLeft;aspect=fixed;', 
					80, 85, '', 'Door', null, null, this.getTagsForStencil(gn, 'doorLeft', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'doorRight;aspect=fixed;', 
					80, 85, '', 'Door', null, null, this.getTagsForStencil(gn, 'doorRight', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'doorDouble;aspect=fixed;', 
					160, 85, '', 'Door, Double', null, null, this.getTagsForStencil(gn, 'doorDouble', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bathtub;', 
					180, 60, '', 'Bathtub', null, null, this.getTagsForStencil(gn, 'bathtub', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bed_double;', 
					200, 180, '', 'Bed, Double', null, null, this.getTagsForStencil(gn, 'bed_double', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bed_single;', 
					100, 180, '', 'Bed Single', null, null, this.getTagsForStencil(gn, 'bed_single', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bookcase;', 
					120, 30, '', 'Bookcase', null, null, this.getTagsForStencil(gn, 'bookcase', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'chair;', 
					41, 52, '', 'Chair', null, null, this.getTagsForStencil(gn, 'chair', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'copier;', 
					110, 60, '', 'Copier', null, null, this.getTagsForStencil(gn, 'copier', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'couch;', 
					150, 80, '', 'Couch', null, null, this.getTagsForStencil(gn, 'couch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'crt_tv;', 
					60, 40, '', 'CRT TV', null, null, this.getTagsForStencil(gn, 'crt_tv', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'desk_corner;', 
					150, 150, '', 'Desk Corner', null, null, this.getTagsForStencil(gn, 'desk_corner', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'desk_corner_2;', 
					150, 120, '', 'Desk Corner 2', null, null, this.getTagsForStencil(gn, 'desk_corner_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dresser;', 
					100, 65, '', 'Dresser', null, null, this.getTagsForStencil(gn, 'dresser', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'elevator;', 
					100, 100, '', 'Elevator', null, null, this.getTagsForStencil(gn, 'elevator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'fireplace;', 
					304, 200, '', 'Fireplace', null, null, this.getTagsForStencil(gn, 'fireplace', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'flat_tv;', 
					70, 10, '', 'Flat TV', null, null, this.getTagsForStencil(gn, 'flat_tv', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'floor_lamp;', 
					50, 50, '', 'Floor Lamp', null, null, this.getTagsForStencil(gn, 'floor_lamp', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop;', 
					40, 35, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'office_chair;', 
					40, 43, '', 'Office Chair', null, null, this.getTagsForStencil(gn, 'office_chair', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'piano;', 
					135, 143, '', 'Piano', null, null, this.getTagsForStencil(gn, 'piano', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'plant;', 
					47, 51, '', 'Plant', null, null, this.getTagsForStencil(gn, 'plant', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'printer;', 
					40, 47, '', 'Printer', null, null, this.getTagsForStencil(gn, 'printer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'range_1;', 
					50, 62, '', 'Range 1', null, null, this.getTagsForStencil(gn, 'range_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'range_2;', 
					75, 62, '', 'Range 2', null, null, this.getTagsForStencil(gn, 'range_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'refrigerator;', 
					60, 62, '', 'Refrigerator', null, null, this.getTagsForStencil(gn, 'refrigerator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'shower;', 
					100, 100, '', 'Shower', null, null, this.getTagsForStencil(gn, 'shower', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sink_1;', 
					40, 35, '', 'Sink 1', null, null, this.getTagsForStencil(gn, 'sink_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sink_2;', 
					40, 35, '', 'Sink 2', null, null, this.getTagsForStencil(gn, 'sink_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sink_double;', 
					80, 35, '', 'Sink Double', null, null, this.getTagsForStencil(gn, 'sink_double', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sofa;', 
					90, 80, '', 'Sofa', null, null, this.getTagsForStencil(gn, 'sofa', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'spiral_stairs;', 
					200, 200, '', 'Spiral Stairs', null, null, this.getTagsForStencil(gn, 'spiral_stairs', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'table;', 
					90, 50, '', 'Table', null, null, this.getTagsForStencil(gn, 'table', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'toilet;', 
					50, 67, '', 'Toilet', null, null, this.getTagsForStencil(gn, 'toilet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'water_cooler;', 
					40, 40, '', 'Water Cooler', null, null, this.getTagsForStencil(gn, 'water_cooler', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'workstation;', 
					50, 40, '', 'Workstation', null, null, this.getTagsForStencil(gn, 'workstation', dt).join(' ')),
					
			this.addEntry(dt + 'kitchen table small', function()
			{
			   	var table = new mxCell('', new mxGeometry(0, 20, 80, 80), 'shape=rect;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(20, 0, 40, 52), s + 'chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(20, 68, 40, 52), s + 'chair;shadow=0;rotation=180;');
			   	chair2.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, table], 80, 120, 'Small kitchen table');
			}),
			this.addEntry(dt + 'kitchen table', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 100, 100), 'shape=rect;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 52), s + 'chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 88, 40, 52), s + 'chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 52, 40), s + 'chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(88, 50, 52, 40), s + 'chair;shadow=0;direction=south');
			   	chair4.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, table], 140, 140, 'Kitchen table');
			}),
			
			this.addEntry(dt + 'kitchen table', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 100, 100), 'shape=ellipse;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 52), s + 'chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 88, 40, 52), s + 'chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 52, 40), s + 'chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(88, 50, 52, 40), s + 'chair;shadow=0;direction=south');
			   	chair4.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, table], 140, 140, 'Round kitchen table');
			}),
			
			this.addEntry(dt + 'kitchen table large', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 160, 100), 'shape=rect;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 52), s + 'chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 88, 40, 52), s + 'chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 52, 40), s + 'chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(148, 50, 52, 40), s + 'chair;shadow=0;direction=south');
			   	chair4.vertex = true;
			   	var chair5 = new mxCell('', new mxGeometry(110, 0, 40, 52), s + 'chair;shadow=0;');
			   	chair5.vertex = true;
			   	var chair6 = new mxCell('', new mxGeometry(110, 88, 40, 52), s + 'chair;shadow=0;direction=west;');
			   	chair6.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, chair5, chair6, table], 200, 140, 'Large kitchen table');
			}),
			
			this.addEntry(dt + 'kitchen table large', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 160, 100), 'shape=ellipse;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 52), s + 'chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 88, 40, 52), s + 'chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 52, 40), s + 'chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(148, 50, 52, 40), s + 'chair;shadow=0;direction=south');
			   	chair4.vertex = true;
			   	var chair5 = new mxCell('', new mxGeometry(110, 0, 40, 52), s + 'chair;shadow=0;');
			   	chair5.vertex = true;
			   	var chair6 = new mxCell('', new mxGeometry(110, 88, 40, 52), s + 'chair;shadow=0;direction=west;');
			   	chair6.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, chair5, chair6, table], 200, 140, 'Large kitchen table');
			}),
			
			this.addEntry(dt + 'office table', function()
			{
			   	var table = new mxCell('', new mxGeometry(0, 20, 80, 50), 'shape=rect;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(20, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair1.vertex = true;
			   	var item1 = new mxCell('', new mxGeometry(15, 30, 50, 40), s + 'workstation;shadow=0;flipV=1;');
			   	item1.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, table, item1], 80, 70, 'Office table');
			}),
					
			this.addEntry(dt + 'office table', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 100, 100), 'shape=rect;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 43, 40), s + 'office_chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(97, 50, 43, 40), s + 'office_chair;shadow=0;direction=south');
			   	chair4.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, table], 140, 140, 'Office table');
			}),
			
			this.addEntry(dt + 'office table large', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 160, 100), 'shape=rect;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 43, 40), s + 'office_chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(157, 50, 43, 40), s + 'office_chair;shadow=0;direction=south');
			   	chair4.vertex = true;
			   	var chair5 = new mxCell('', new mxGeometry(110, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair5.vertex = true;
			   	var chair6 = new mxCell('', new mxGeometry(110, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair6.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, chair5, chair6, table], 200, 140, 'Large office table');
			}),
					
			this.addEntry(dt + 'office table large', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 160, 100), 'shape=ellipse;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 43, 40), s + 'office_chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(157, 50, 43, 40), s + 'office_chair;shadow=0;direction=south');
			   	chair4.vertex = true;
			   	var chair5 = new mxCell('', new mxGeometry(110, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair5.vertex = true;
			   	var chair6 = new mxCell('', new mxGeometry(110, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair6.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, chair5, chair6, table], 200, 140, 'Large office table');
			}),

			this.addEntry(dt + 'office table large', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 280, 100), 'shape=ellipse;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 43, 40), s + 'office_chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(277, 50, 43, 40), s + 'office_chair;shadow=0;direction=south');
			   	chair4.vertex = true;
			   	var chair5 = new mxCell('', new mxGeometry(110, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair5.vertex = true;
			   	var chair6 = new mxCell('', new mxGeometry(110, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair6.vertex = true;
			   	var chair7 = new mxCell('', new mxGeometry(170, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair7.vertex = true;
			   	var chair8 = new mxCell('', new mxGeometry(170, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair8.vertex = true;
			   	var chair9 = new mxCell('', new mxGeometry(230, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair9.vertex = true;
			   	var chair10 = new mxCell('', new mxGeometry(230, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair10.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, chair5, chair6, chair7, chair8, chair9, chair10, table], 320, 140, 'Large office table');
			}),

			this.addEntry(dt + 'office table conference large huge', function()
			{
			   	var table = new mxCell('', new mxGeometry(20, 20, 520, 100), 'shape=ellipse;shadow=0;');
			   	table.vertex = true;
			   	var chair1 = new mxCell('', new mxGeometry(50, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair1.vertex = true;
			   	var chair2 = new mxCell('', new mxGeometry(50, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair2.vertex = true;
			   	var chair3 = new mxCell('', new mxGeometry(0, 50, 43, 40), s + 'office_chair;shadow=0;direction=north;');
			   	chair3.vertex = true;
			   	var chair4 = new mxCell('', new mxGeometry(517, 50, 43, 40), s + 'office_chair;shadow=0;direction=south');
			   	chair4.vertex = true;
			   	var chair5 = new mxCell('', new mxGeometry(110, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair5.vertex = true;
			   	var chair6 = new mxCell('', new mxGeometry(110, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair6.vertex = true;
			   	var chair7 = new mxCell('', new mxGeometry(170, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair7.vertex = true;
			   	var chair8 = new mxCell('', new mxGeometry(170, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair8.vertex = true;
			   	var chair9 = new mxCell('', new mxGeometry(230, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair9.vertex = true;
			   	var chair10 = new mxCell('', new mxGeometry(230, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair10.vertex = true;
			   	var chair11 = new mxCell('', new mxGeometry(290, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair11.vertex = true;
			   	var chair12 = new mxCell('', new mxGeometry(290, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair12.vertex = true;
			   	var chair13 = new mxCell('', new mxGeometry(350, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair13.vertex = true;
			   	var chair14 = new mxCell('', new mxGeometry(350, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair14.vertex = true;
			   	var chair15 = new mxCell('', new mxGeometry(410, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair15.vertex = true;
			   	var chair16 = new mxCell('', new mxGeometry(410, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair16.vertex = true;
			   	var chair17 = new mxCell('', new mxGeometry(470, 0, 40, 43), s + 'office_chair;shadow=0;');
			   	chair17.vertex = true;
			   	var chair18 = new mxCell('', new mxGeometry(470, 97, 40, 43), s + 'office_chair;shadow=0;direction=west;');
			   	chair18.vertex = true;

	   			return sb.createVertexTemplateFromCells([chair1, chair2, chair3, chair4, chair5, chair6, chair7, chair8, chair9, chair10, chair11, chair12, chair13, chair14, chair15, chair16, chair17, chair18, table], 560, 140, 'Conference table');
			})
		];

		this.addPalette('floorplan', mxResources.get('floorplans'), false, mxUtils.bind(this, function(content)
		{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();

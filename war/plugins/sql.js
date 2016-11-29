/**
 * Parse SQL CREATE TABLE. Simple initial version for community to improve.
 */
Draw.loadPlugin(function(ui)
{
	// LATER: REFERENCES and PRIMARY KEY
	var div = document.createElement('div');
	div.style.userSelect = 'none';
	div.style.overflow = 'hidden';
	div.style.padding = '10px';
	div.style.height = '100%';

	var graph = ui.editor.graph;

	var sqlInput = document.createElement('textarea');
	sqlInput.style.height = '200px';
	sqlInput.style.width = '100%';
  	sqlInput.value = 'CREATE TABLE Persons\n(\nPersonID int,\nLastName varchar(255),\n' +
  		'FirstName varchar(255),\nAddress varchar(255),\nCity varchar(255)\n);';
	mxUtils.br(div);
	div.appendChild(sqlInput);
	
	var graph = ui.editor.graph;
	
	// Extends Extras menu
	mxResources.parse('fromSql=From SQL');

	var wnd = new mxWindow(mxResources.get('fromSql'), div, document.body.offsetWidth - 480, 140,
		320, 300, true, true);
	wnd.destroyOnClose = false;
	wnd.setMaximizable(false);
	wnd.setResizable(false);
	wnd.setClosable(true);

	function parseSql(text)
	{
		var lines = text.split('\n');
		var tableCell = null;
		var rows = null;
		var cells = [];
		var dx = 0;

		for (var i = 0; i < lines.length; i++)
		{
			var tmp = mxUtils.trim(lines[i]);
			
			if (tmp.substring(0, 12).toLowerCase() == 'create table')
			{
				var name = mxUtils.trim(tmp.substring(12));
				
				if (name.charAt(name.length - 1) == '(')
				{
					name = name.substring(0, name.lastIndexOf(' '));
				}
				
				tableCell = new mxCell(name, new mxGeometry(dx, 0, 160, 26),
			    	'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=#e0e0e0;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;align=center;');
				tableCell.vertex = true;
				cells.push(tableCell);
				
				var size = ui.editor.graph.getPreferredSizeForCell(rowCell);
	   			
	   			if (size != null)
	   			{
	   				tableCell.geometry.width = size.width + 10;
	   			}
	   			
	   			// For primary key lookups
	   			rows = {};
			}
			else if (tableCell != null && tmp.charAt(0) == ')')
			{
				dx += tableCell.geometry.width + 40;
				tableCell = null;
			}
			else if (tmp != '(' && tableCell != null)
			{
				var name = tmp.substring(0, (tmp.charAt(tmp.length - 1) == ',') ? tmp.length - 1 : tmp.length);
				
				if (name.substring(0, 11).toLowerCase() != 'primary key')
				{
					var rowCell = new mxCell(name, new mxGeometry(0, 0, 90, 26),
						'shape=partialRectangle;top=0;left=0;right=0;bottom=0;align=left;verticalAlign=top;spacingTop=-2;fillColor=none;spacingLeft=34;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;dropTarget=0;');
		   			rowCell.vertex = true;
	
					var left = sb.cloneCell(rowCell, '' /* eg. PK */);
		   			left.connectable = false;
		   			left.style = 'shape=partialRectangle;top=0;left=0;bottom=0;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[];portConstraint=eastwest;part=1;'
		   			left.geometry.width = 30;
		   			left.geometry.height = 26;
		   			rowCell.insert(left);
		   			
		   			var size = ui.editor.graph.getPreferredSizeForCell(rowCell);
		   			
		   			if (size != null && tableCell.geometry.width < size.width + 10)
		   			{
		   				tableCell.geometry.width = size.width + 10;
		   			}
		   			
		   			tableCell.insert(rowCell);
		   			tableCell.geometry.height += 26;
		   			
		   			rows[rowCell.value] = rowCell;
				}
			}
		}
		
		if (cells.length > 0)
		{
			var graph = ui.editor.graph;
			var view = graph.view;
			var bds = graph.getGraphBounds();
			
			// Computes unscaled, untranslated graph bounds
			var x = Math.ceil(Math.max(0, bds.x / view.scale - view.translate.x) + 4 * graph.gridSize);
			var y = Math.ceil(Math.max(0, (bds.y + bds.height) / view.scale - view.translate.y) + 4 * graph.gridSize);

			graph.setSelectionCells(graph.importCells(cells, x, y));
			graph.scrollCellToVisible(graph.getSelectionCell());
		}
		
		wnd.setVisible(false);
	};

	mxUtils.br(div);

	var resetBtn = mxUtils.button(mxResources.get('reset'), function()
	{
		sqlInput.value = '';
	});
	
	resetBtn.style.marginTop = '8px';
	resetBtn.style.marginRight = '4px';
	resetBtn.style.padding = '4px';
	div.appendChild(resetBtn);

	var btn = mxUtils.button(mxResources.get('cancel'), function()
	{
		wnd.setVisible(false);
	});
	
	btn.style.marginTop = '8px';
	btn.style.marginRight = '4px';
	btn.style.padding = '4px';
	div.appendChild(btn);

	var btn = mxUtils.button(mxResources.get('insert'), function()
	{
		parseSql(sqlInput.value);
	});
	
	btn.style.marginTop = '8px';
	btn.style.padding = '4px';
	div.appendChild(btn);

    // Adds action
    ui.actions.addAction('fromSql', function()
    {
		wnd.setVisible(!wnd.isVisible());
		
		if (wnd.isVisible())
		{
			sqlInput.focus();	
		}
    });
	
	var theMenu = ui.menus.get('insert');
	var oldMenu = theMenu.funct;
	
	theMenu.funct = function(menu, parent)
	{
		oldMenu.apply(this, arguments);
		
		ui.menus.addMenuItems(menu, ['fromSql'], parent);
	};
});

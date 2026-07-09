/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
(function()
{
	// Adds containers
	var sidebarCreateAdvancedShapes = Sidebar.prototype.createAdvancedShapes;
	
	Sidebar.prototype.createAdvancedShapes = function()
	{
		this.setCurrentSearchEntryLibrary('general', 'advanced');
		
		var fns = sidebarCreateAdvancedShapes.apply(this, arguments);
		
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Live layout containers — configs shared with Insert > Layout via
		// Menus.layoutContainers (the sidebar uses the titled transparent
		// swimlane variant, sidebarStyle). The seed cells are authored at
		// the positions the ELK layout computes: the layout can't run for
		// the thumbnail, and dropping the template then converges without
		// moving anything (the run anchors at the content's top-left, so
		// only the relative positions must match the ELK output).
		// nodes = [label, x, y]; edges = index pairs.
		var layoutEdgeStyle = Menus.layoutContainerEdgeStyle +
			'edgeStyle=orthogonalEdgeStyle;';

		var createLayoutContainer = function(name, title, nodes, edges)
		{
			var def = Menus.layoutContainers[name];

			// transparentBounds swimlane: the stored geometry stays pinned at
			// (0,0,0,0) — the visible box is derived from the children plus
			// groupPadding and the title bar (see Graph.getTransparentBounds).
			var container = new mxCell(title,
				new mxGeometry(0, 0, 0, 0), def.sidebarStyle);
			container.vertex = true;

			var vertices = [];

			for (var i = 0; i < nodes.length; i++)
			{
				var v = new mxCell(nodes[i][0], new mxGeometry(nodes[i][1],
					nodes[i][2], 100, 40), 'whiteSpace=wrap;html=1;');
				v.vertex = true;
				vertices.push(container.insert(v));
			}

			for (var i = 0; i < edges.length; i++)
			{
				var e = new mxCell('', new mxGeometry(), layoutEdgeStyle);
				e.geometry.relative = true;
				e.edge = true;
				vertices[edges[i][0]].insertEdge(e, true);
				vertices[edges[i][1]].insertEdge(e, false);
				container.insert(e);
			}

			return container;
		};

		var addLayoutContainerEntry = function(tags, title, name, nodes, edges)
		{
			return sb.addEntry(tags, function()
			{
				var def = Menus.layoutContainers[name];
				var container = createLayoutContainer(name, title, nodes, edges);

				return sb.createVertexTemplateFromCells([container],
					def.width, def.height, title, true);
			});
		};

		fns = fns.concat(
		[
			this.addDataEntry('container swimlane pool horizontal', 480, 380, 'Horizontal Pool 1',
				'zZRBbsMgEEVPwx4Gt+o6bptNIkXKCVA8CqhgIiCNndMXG2iUNk6rqq2ysMT8+Z/xvAWE16abO7GTS9ugJvyJ8NpZG9LJdDVqTYCqhvBHAkDjR+B5osvGLt0Jh234TgBS4FXoPSZlZa1Oog+9zqI/KKNFG6vZRirdLERv98MAH8TmpVQzh14dcVWmsw/SUnRRpVGV1qmjbYPQ2RbvcWEdnbGGc8d6GFFywZRE/nF0AbvJ5Ucpbz5HazC4PloOqgkyOaqHBIhKVFuZY7yIwidh+549sYyHjPMyWv4J7WIgCJRdw3sFxA8ZwGUGfe7mTb9CwuAXkFRTSOCWkLDqP5ncTTHht8QE7v+QSSxPL97YO3sQ3wA='),
			this.addDataEntry('container swimlane pool horizontal', 480, 360, 'Horizontal Pool 2',
				'zZRRb8IgEMc/De/06MyerZsvmpj4CYi9CBkUA6itn360UE1da5ZlW3wg4f53f477hUBYoeul5QexNiUqwt4IK6wxPu50XaBSBKgsCVsQABoWgfeJbNZl6YFbrPx3DBANJ66OGJWNMSqKzjcqie4steJViOY7IVW54o05tg2c57uPPppbdPKCm757dieteR1UGlRhrLyYynOVhHCO9dtQGWIYVmzbFr3Pa5UOThdH67GeHL6T0uRLNBq9bULJWZZexIr8NQKiAuVeJBubJZG7KOyv3hvLsEk4x9GyL2hXLUGg2SO8D0D8kAGMM0iG9D4GSGYjSDL4BST5FBJ4RiTN3eT/guhlChF7YkSQ/yGiEN7+wy43+C4/AQ=='),
			this.addDataEntry('container swimlane pool horizontal', 360, 480, 'Vertical Pool 1',
				'xZTRbsIgFIafhsstcKC11zrnjSYmewJiT4SMiqE42z39aMGZabss2bJekHD+n//A+S4gfFE1KyePamNLNIQvCV84a33cVc0CjSFAdUn4EwGgYRF4HnFZ79KjdHjwPwlADLxJc8KobK01Uax9a5JYn3Vl5CFU853SplzL1p66C2ovd6+Xau6w1u+4vdzObqSNbIJKgxpizr8EI9TQCcpXJiXSi9B5bEan6qU00gpthd614UgKiMdMzMSMZ7QocpELhg+MxyZnXXoVT/E8sqEK9V6lxqJIoqyjsP/sfsUYNonkMFV+R3XdwQPKviP7aygwDKVNLr0jwGCIQP4HBMQYAZiCQHMz7hREsjEifEIiIP6PSCiv/1rvffn2PgA='),
			this.addDataEntry('container swimlane pool vertical', 380, 480, 'Vertical Pool 2',
				'vZRBbsIwEEVP470zTquuSVs2ICFxAouMsFUnRrYpCafvJHYILaRiQxaRPG/8Pfnfkpkoqmbp5EGtbYmGiQ8mCmdtiKuqKdAYBlyXTLwzAE4fg8+JbtZ3+UE6rMMjAoiCb2mOGMnGWhOhD61J0J90ZWRN1WKntClXsrXHboAPcvc1VAuHXp9xM0zP/qC1bIhyoiRzYUsNqqEDyjp9tnWQJu0YwbYbkU5Lf4suYDPpuEfJ7hJthcG1tOWky6DiDvEWU+EK9V4lWT5A6SPYX7RjgLRIGd7PU9zkuepiA579l+lNHA/5hPs+kyBd/LXtDJ5lO5+yDXPbzvI5fb9M+RazX/frE31TOT5Jfe/Xi/UD'),
			addLayoutContainerEntry('vertical tree layout', 'Vertical Tree Layout',
				'verticalTree',
				[['Root', 90, 40], ['Child 1', 20, 120], ['Child 2', 160, 120]],
				[[0, 1], [0, 2]]),
			addLayoutContainerEntry('horizontal tree layout', 'Horizontal Tree Layout',
				'horizontalTree',
				[['Root', 40, 60], ['Child 1', 180, 20], ['Child 2', 180, 100]],
				[[0, 1], [0, 2]]),
			addLayoutContainerEntry('vertical flow layout', 'Vertical Flow Layout',
				'verticalFlow',
				[['Start', 36.67, 40], ['Task', 150, 130], ['Task', 20, 130],
					['End', 36.67, 220]],
				[[0, 1], [0, 2], [1, 3], [2, 3]]),
			addLayoutContainerEntry('horizontal flow layout', 'Horizontal Flow Layout',
				'horizontalFlow',
				[['Start', 40, 26.67], ['Task', 190, 90], ['Task', 190, 20],
					['End', 340, 26.67]],
				[[0, 1], [0, 2], [1, 3], [2, 3]])
		]);
		
		this.setCurrentSearchEntryLibrary();

		return fns;
	};
})();

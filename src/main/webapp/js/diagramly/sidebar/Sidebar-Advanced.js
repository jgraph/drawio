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

		// Reusable cells
		var flow = new mxCell('Vertical Flow Layout', new mxGeometry(0, 0, 270, 280),
				'swimlane;startSize=20;horizontal=1;childLayout=flowLayout;flowOrientation=north;resizable=0;interRankCellSpacing=50;containerType=tree;');
		flow.vertex = true;
		
		var flow1 = new mxCell('Start', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow1.vertex = true;
		flow.insert(flow1);
		
		var flow2 = new mxCell('Task', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow2.vertex = true;
		flow.insert(flow2);
		
		var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'html=1;curved=1;');
		edge.geometry.relative = true;
		edge.edge = true;
		flow1.insertEdge(edge, true);
		flow2.insertEdge(edge, false);
		flow.insert(edge);
		
		var flow3 = new mxCell('Task', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow3.vertex = true;
		flow.insert(flow3);
		
		edge = edge.clone();
		flow1.insertEdge(edge, true);
		flow3.insertEdge(edge, false);
		flow.insert(edge);
		
		var flow4 = new mxCell('End', new mxGeometry(20, 20, 100, 40), 'whiteSpace=wrap;html=1;');
		flow4.vertex = true;
		flow.insert(flow4);
		
		edge = edge.clone();
		flow2.insertEdge(edge, true);
		flow4.insertEdge(edge, false);
		flow.insert(edge);
		
		edge = edge.clone();
		flow3.insertEdge(edge, true);
		flow4.insertEdge(edge, false);
		flow.insert(edge);

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
			this.addDataEntry('vertical tree layout', 280, 190, 'Vertical Tree Layout',
				'5ZVNU4MwEIZ/DXcgteq1UHvRi+14T2GHZCYQJiyl9Ne7gWCLtE5ntAf1wJB99yPJk83EY1G+XxleihedgvLY0mOR0Rr7Ub6PQCkv9GXqsdgLQ58+L3y64A06r19yAwVekxD2CTuuauiVNzAoE26DNgaAfs+81TX2gRW2ygVWjcwVL8haVMgNruXBemhCthDayIMukMqwOCAhEVKlrhCLkQoPxklsNx+LbQEDlTzwrRrsxAbIAsymLcFVINmtnpYM+4sEOsltfwU6BzQthTQyReEoPPSUfAEyE0PaoxN51QvZR+4RKA0c0/N82YTvqz3bzywbIRHWJU+s3VA3WC6YD/Su2mZ4fpsuwfWB347NEwiBfwbC7AcYzCYMItsNJAX/C8TdBMRk/5BmsHYmqK1ulkdh0Qnk2A1XdMTG6LpIIXUXpq9sy33NiWbXtUlg1K50nTPAk9Ob0jSgOMrduPp34MwvdsmU0p/ukvvf2CXz23QJmce3sPONnsp3'),
			this.addDataEntry('horizontal tree layout', 310, 160, 'Horizontal Tree Layout',
				'5ZXNUoMwEMefJncgtd4LVQ96sX2BtOxAZgJhwlJKn94NSQWkdTqjHtQDA/vfL/LLZsJ4XBwfjajyF52CYnzNeGy0RvdVHGNQikWBTBlPWBQF9LDo4Yo37L1BJQyUeEtC5BIOQjXglCdt5EmXKGzY1gDQ61l0ukEXWmOnfGjdykKJkqxVjcLgRp6sh1ryVT6U4YkV9rlUqS/EE6TCZ2MU2/fjSUiigVqexK7v1efbAFmC2XYV+Aok+/8Hg3C8yqCXPIBH0AWg6SiklSnmLoKHjlOQg8zyc9rSi6J2QvaeOyClD0/1MmE+I/xqd/cjyzaXCJtK7K3d0jxYLlgoT+OmZUaXl+kT/CQE3dQcQQiDCxAW38BgMWMQ22kgKfxfIO5mIGbrhzSDjTdB7XS7HoRVL5BjfLrGdIxuyhRSf2RcbVvwc1LUXzdmD5OBpQOdAY72b87TgBIoD9PqX8GzvDonc05/ek7uf+ecLH9mTsgcbsTeN7kw3wA='),
				
		 	this.addEntry('vertical flow layout', function()
			{
		 		return sb.createVertexTemplateFromCells([flow], flow.geometry.width, flow.geometry.height, 'Vertical Flow Layout', true);
		 	}),
		 	this.addEntry('horizontal flow layout', function()
			{
				var cell = sb.graph.cloneCell(flow);
				cell.geometry = new mxGeometry(0, 0, 460, 150);
				cell.style = 'swimlane;html=1;startSize=20;horizontal=0;childLayout=flowLayout;flowOrientation=west;resizable=0;interRankCellSpacing=50;containerType=tree;';
				cell.value = 'Horizontal Flow Layout';
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Horizontal Flow Layout', true);
			})
		]);
		
		this.setCurrentSearchEntryLibrary();

		return fns;
	};
})();

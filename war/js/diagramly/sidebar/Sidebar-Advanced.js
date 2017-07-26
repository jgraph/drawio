(function()
{
	// Adds containers
	var sidebarCreateAdvancedShapes = Sidebar.prototype.createAdvancedShapes;
	
	Sidebar.prototype.createAdvancedShapes = function()
	{
		var fns = sidebarCreateAdvancedShapes.apply(this, arguments);
		
		// Avoids having to bind all functions to "this"
		var sb = this;

		// Reusable cells
		var flow = new mxCell('Vertical Flow Layout', new mxGeometry(0, 0, 270, 280),
				'swimlane;html=1;startSize=20;horizontal=1;childLayout=flowLayout;flowOrientation=north;resizable=0;interRankCellSpacing=50;');
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

		return fns.concat(
		[
			this.addDataEntry('container swimlane pool horizontal', 480, 380, 'Horizontal Pool 1',
				'zZRLbsIwEIZP4709TlHXhJYNSEicwCIjbNWJkWNKwumZxA6IlrRUaisWlmb+eX8LM5mXzdyrnV66Ai2TL0zm3rkQrbLJ0VoG3BRMzhgAp8fgdSQq+ijfKY9VuKcAYsG7snuMyso5G8U6tDaJ9cGUVlXkTXUoacuZIHOjjS0WqnX7blYd1OZt8KYea3PE1bCI+CAtVUMq7/o5b46uCmroSn18WFMm+XCdse5GpLq0OPqAzejxvZQun6MrMfiWUg6mCDpmZM8RENdotjqVyUFUdRS259oLSzISztto5Se0i44gcHEn3i9A/IQB3GbQpmi69DskAn4BSTaGBB4Jicj+k8nTGBP5SExg8odMyL38eH3s6kM8AQ=='),
			this.addDataEntry('container swimlane pool horizontal', 480, 360, 'Horizontal Pool 2',
				'zZTBbsIwDIafJvfU6dDOlI0LSEg8QUQtEi1tUBJGy9PPbcJQWTsxaZs4VLJ//07sT1WYKKpm6eRBrW2JhokXJgpnbYhR1RRoDAOuSyYWDIDTx+B1opr1VX6QDutwTwPEhndpjhiVjbUmij60Jon+pCsja8rmKlQ05SKjcKe0KVeytcfuLh/k7u2SzR16fcbNZZDsRlrLhlTenWedPts6SJMEOseFLTkph6Fj212RbGlwdAGbyeV7KW2+RFthcC1ZTroMKjry5wiIK9R7ldrELInSR2H/2XtlSUHCOY5WfEG76ggCz+7E+w2InzCAcQapIf0fAySzESQZ/AKSfAoJPCKS9mbzf0H0NIVIPDAiyP8QEaXX97CvDZ7LDw=='),
			this.addDataEntry('container swimlane pool horizontal', 360, 480, 'Vertical Pool 1',
				'xZRBbsIwEEVP4709ThFrQssGJKSewCIjbNXGyDEl4fSdxKa0NJFQVTULSzP/e+T5b2EmS9esgjrqja/QMvnMZBm8j6lyTYnWMuCmYnLJADgdBi8jruhdflQBD/GRAUgD78qeMClb720S69jaLNZn46w6ULfQ0dGWS0HlThtbrVXrT91bdVS7t2u3CFibC26vi4g7aaMaUjmpNBbiKxnUQyfkjTBEbEZT9VKOtELvMIaWrpxNFXW6IWcpOddo9jqPFfMsqjoJ+8/ZGyQqMqdhZvIHs3WHBrh4kNvvIsNw5Da7OdgXAgKGCMz+gEAxRgCmINDcxZ2CyNMYETkhESj+jwi1t1+r9759ah8='),
			this.addDataEntry('container swimlane pool vertical', 380, 480, 'Vertical Pool 2',
				'xZTPbsIwDMafJvf86dDOlI0LSEg8QUQtEi1pUBJGy9PPbdJ1G1TqhXGoZH/219g/RSGitM3ay5PaugoMEW9ElN65mCLblGAM4VRXRKwI5xQ/wt8nqqyv0pP0UMc5Bp4Mn9KcISk750wSQ2xNFsNFWyNrzJYqWpxyxTA8KG2qjWzduTsrRHn4GLKlh6CvsBsGYX+krWxQpaiizcc9FjDnnaCc11dXR2lyxyjsuyPy3/Lg4CM0k8v3Ut58Dc5C9C22XHQVVeoQrwkQVaCPKtuKQZQhCcdv78gSg4zzPlpxg3bTEeSUzcR7Q2bWyvz+ytmQr8NPAow/ikAxRYA/kQAr/hPByxQC8cxLsHggAkzH56uv/XrdvgA='),
			this.addDataEntry('vertical tree layout', 280, 190, 'Vertical Tree Layout',
				'5ZXNUoMwEICfJncgteq1UHvRi3W8p2QHMhNIJyyl9OndQLBFWqcz6kE9MGT/s182E8bjYr+yYps/GQma8SXjsTUG+1Wxj0FrFgVKMp6wKAroY9HDBWvYWYOtsFDiNQFRH7ATuoZe8woWVSqc04sFoN+jaE2NvWOFrfaOVaMKLUqSFjkWtPMkpGWFwuJaHZwT1SabsepgShSDR5orLX1OniDVGIQT3640T1wCC5U6iI0eZL9j2ibsL3bdqXzLKzAFoG3JpVESc9/5XU8myEFl+RB275Wi6hXZe+wRIi08x/NM+YTpszvPj/yaXCGstyJ1ckMTMAZ5VZvR+TZ9gD/7oB2LJxDC4AyE2TcwmE0YxO7YSRX+LxA3ExCT/kFmsPYi6I1plkfFolOQYTdcyxEba+pSghzdDJfuc05U3dQ2hdG40r3NAE9Ob0rTghaoduPsX4EzvzglU0p/ekpuf+OUzH9mSkg8vn+dbfQ8vgE='),
			this.addDataEntry('horizontal tree layout', 310, 160, 'Horizontal Tree Layout',
				'5ZXNUoMwEICfhjuQWu+FWg96sb5A2uxAZgJhwlJKn94NSQWkdTqjHtQDQ/Y/+2UzCVhSHDeGV/mzFqACtg5YYrRGtyqOCSgVxKEUAUuDOA7pC+KHK9aot4YVN1DiLQGxCzhw1YDTPGojT7pEbt1eDQD9nninG3SuNXbKu9atLBQvSVrlWNDe04iWNXKDW3myTlSdbENGllrFPpdK+JwsRapxFka+fWmX0UAtT3zXl7Xxfs9gEI5X++5VvukN6ALQdOTSSoG582CRYxPmILP8HLb0Sl47RfYeO2CkhSd5mSqbUX2xJ/qRX5tLhG3F91ZuaQamIG9qM77cpg/wpx92U3EEIQovQFh8A4PFjEFij51U0f8CcTcDMesfRAZbL4La6XY9KFa9ggzjazSmY3RTChCTu2ETfk6K6uvG7GEysHRzM8DR+c15GlAc5WGa/St4llfnZM7pT8/J/e+ck+XPzAmJwyvY2yaP5Bs='),
				
		 	this.addEntry('vertical flow layout', function()
			{
		 		return sb.createVertexTemplateFromCells([flow], flow.geometry.width, flow.geometry.height, 'Vertical Flow Layout', true);
		 	}),
		 	this.addEntry('horizontal flow layout', function()
			{
				var cell = sb.graph.cloneCells([flow])[0];
				cell.geometry = new mxGeometry(0, 0, 460, 150);
				cell.style = 'swimlane;html=1;startSize=20;horizontal=0;childLayout=flowLayout;flowOrientation=west;resizable=0;interRankCellSpacing=50;';
				cell.value = 'Horizontal Flow Layout';
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Horizontal Flow Layout', true);
			})
		]);
	};
	
})();

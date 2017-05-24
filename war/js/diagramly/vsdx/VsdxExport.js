/**
 * Export mxFile as Vsdx file
 */
function VsdxExport(editorUi, resDir)
{
	var that = this;
	
	resDir = resDir || "js/diagramly/vsdx/resources"

	var vsdxCanvas = new mxVsdxCanvas2D();
	/**
	 * Fill the required files in vsdx format which are constants in our exporter
	 * @param zip JSZip of vsdx file
	 * @param pageCount The number of pages in the mxFile
	 * @callback called when all files are loaded in the zip
	 */
	function createVsdxSkeleton(zip, pageCount, callback)
	{
		mxUtils.get(resDir + "/allConstants.json", function(req)
		{
		  var files = JSON.parse(req.request.responseText);
		  
		  for (var id in files) 
		  {
			  if (pageCount > 1 && id == that.CONTENT_TYPES_XML) 
			  {
			    	//Add the remaining pages
			    	var doc = mxUtils.parseXml(files[id]);
			    	var root = doc.documentElement;
			    	
			    	var children = root.children;
			    	var page1 = null;
		
			    	for (var i = 0; i < children.length; i++)
			    	{
			    		var child = children[i];
			    		if ("/visio/pages/page1.xml" == child.getAttribute(that.PART_NAME))
			    		{
			    			page1 = child;
			    		}
			    	}
			    	
			    	//var p1Id = that.VISIO_PAGES_RELS + "page1.xml.rels";
			    	for (var i = 2; i <= pageCount; i++)
			    	{
			    		//var fId = that.VISIO_PAGES_RELS + "page" + i + ".xml.rels";
			    		//zip.file(fId, files[p1Id]);
		
			        	var newPage = page1.cloneNode();
			    		newPage.setAttribute(that.PART_NAME, "/visio/pages/page" + i + ".xml");
			    		root.appendChild(newPage);
			    	}
			    	
			    	writeXmlDoc2Zip(zip, id, doc, true);
			  }
			  else 
			  {
				  zip.file(id, files[id]);
			  }
		  }
		  
		  if (callback) callback();
		});
	};

	function getGraphAttributes(graph) 
	{
		var attr = {};
		
		try
		{
			attr['gridEnabled'] = graph.gridEnabled;
			attr['gridSize'] = graph.gridSize;
			attr['guidesEnabled'] = graph.graphHandler.guidesEnabled
			attr['pageVisible'] = graph.pageVisible;
			attr['pageScale'] = graph.pageScale;
			attr['pageWidth'] = graph.pageFormat.width;
			attr['pageHeight'] = graph.pageFormat.height;
			attr['backgroundClr'] = graph.background;
			attr['mathEnabled'] = graph.mathEnabled;
			attr['shadowVisible'] = graph.shadowVisible;
		}
		catch(e)
		{
			//nothing
		}
		return attr;
	};

	function createCellElemScaled(name, val, xmlDoc)
	{
		return createCellElem(name, val / that.CONVERSION_FACTOR, xmlDoc);
	};

	function createCellElem(name, val, xmlDoc)
	{
		var cell = xmlDoc.createElement("Cell");
		cell.setAttribute("N", name);
		cell.setAttribute("V", val);
		return cell;
	};

	function createRow(type, index, x, y, xmlDoc) 
	{
		var row = xmlDoc.createElement("Row");
		row.setAttribute("T", type);
		row.setAttribute("IX", index);
		row.appendChild(createCellElem("X", x, xmlDoc));
		row.appendChild(createCellElem("Y", y, xmlDoc));
		return row;
	};

	function applyMxCellStyle(state, shape, xmlDoc)
	{
		var fillClr = state.style[mxConstants.STYLE_FILLCOLOR];
		
		if (!fillClr || fillClr == "none")
		{
			shape.appendChild(createCellElem("FillPattern", 0, xmlDoc));
		}
		else
		{
			shape.appendChild(createCellElem("FillForegnd", fillClr, xmlDoc));
			var gradClr = state.style[mxConstants.STYLE_GRADIENTCOLOR];

			if (gradClr && gradClr != "none")
			{
				shape.appendChild(createCellElem("FillBkgnd", gradClr, xmlDoc));
				
				var gradDir = state.style[mxConstants.STYLE_GRADIENT_DIRECTION];
				var dir = 28;
				
				if (gradDir)
				{
					switch(gradDir)
					{
						case mxConstants.DIRECTION_EAST:
							dir = 25;
						break
						case mxConstants.DIRECTION_WEST:
							dir = 27;
						break
						case mxConstants.DIRECTION_NORTH:
							dir = 30;
						break
					}
				}
				shape.appendChild(createCellElem("FillPattern", dir, xmlDoc));
			}
		}

		var strokeClr = state.style[mxConstants.STYLE_STROKECOLOR];
		
		if (!strokeClr || strokeClr == "none")
			shape.appendChild(createCellElem("LinePattern", 0, xmlDoc));
		else
			shape.appendChild(createCellElem("LineColor", strokeClr, xmlDoc));

		var strokeW = state.style[mxConstants.STYLE_STROKEWIDTH];
		if (strokeW) shape.appendChild(createCellElemScaled("LineWeight", strokeW, xmlDoc));
		
		
		var opacity = state.style[mxConstants.STYLE_OPACITY];
		var fillOpaq; 
		var strkOpaq; 	
		
		if (opacity)
		{
			fillOpaq = opacity;
			strkOpaq = opacity;
		}
		else
		{
			fillOpaq = state.style[mxConstants.STYLE_FILL_OPACITY];
			strkOpaq = state.style[mxConstants.STYLE_STROKE_OPACITY];
		}
			
		if (fillOpaq) shape.appendChild(createCellElem("FillForegndTrans", 1 - parseInt(fillOpaq)/100.0, xmlDoc));
		if (strkOpaq) shape.appendChild(createCellElem("LineColorTrans", 1 - parseInt(strkOpaq)/100.0, xmlDoc));
		
		var isDashed = state.style[mxConstants.STYLE_DASHED];
		
		if (isDashed == 1) 
		{
			var dashPatrn = state.style[mxConstants.STYLE_DASH_PATTERN];
			var pattern = 9
				
			if (dashPatrn)
			{
				//We only support the patterns of draw.io UI
				switch(dashPatrn) 
				{
					case "1 1":
						pattern = 10; 
					break;
					case "1 2":
						pattern = 3; 
					break;
					case "1 4":
						pattern = 17; 
					break;
				} 
			}
			
			shape.appendChild(createCellElem("LinePattern", pattern, xmlDoc));
		}
		
		var hasShadow = state.style[mxConstants.STYLE_SHADOW];
		
		if (hasShadow == 1)
		{
			shape.appendChild(createCellElem("ShdwPattern", 1, xmlDoc));
			shape.appendChild(createCellElem("ShdwForegnd", '#000000', xmlDoc));
			shape.appendChild(createCellElem("ShdwForegndTrans", 0.6, xmlDoc));
			shape.appendChild(createCellElem("ShapeShdwType", 1, xmlDoc));
			shape.appendChild(createCellElem("ShapeShdwOffsetX", '0.02946278254943948', xmlDoc));
			shape.appendChild(createCellElem("ShapeShdwOffsetY", '-0.02946278254943948', xmlDoc));
			shape.appendChild(createCellElem("ShapeShdwScaleFactor", '1', xmlDoc));
			shape.appendChild(createCellElem("ShapeShdwBlur", '0.05555555555555555', xmlDoc));
			shape.appendChild(createCellElem("ShapeShdwShow", 2, xmlDoc));
		}
		
		//Probably we don't need margins as the canvas get the modified position?
	/*	
		var topMargin = state.style[mxConstants.STYLE_SPACING_TOP];
		if (topMargin) shape.appendChild(createCellElemScaled("TopMargin", parseFloat(topMargin) * 2 + 2.8 , xmlDoc));

/*		//Defines label bottom spacing
		double bottomMargin = getBottomSpacing() * 100/100;

		if (bottomMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_BOTTOM, Double.toString(bottomMargin));
		}

		//Defines label left spacing
		double leftMargin = getLeftSpacing() * 100/100;

		if (leftMargin != 0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_LEFT, Double.toString(leftMargin));
		}

		//Defines label right spacing
		double rightMargin = getRightSpacing() * 100/100;

		if(rightMargin !=0)
		{
			styleMap.put(mxConstants.STYLE_SPACING_RIGHT, Double.toString(rightMargin));
		}*/

		//Direction is not clear that we need it
		/*
		var direction = state.style[mxConstants.STYLE_DIRECTION];

		if (direction != mxConstants.DIRECTION_EAST)
		{
			styleMap.put(mxConstants.STYLE_DIRECTION, direction);
		}
		*/

		var flibX = state.style[mxConstants.STYLE_FLIPH];
		if (flibX == 1) shape.appendChild(createCellElem("FlipX", 1, xmlDoc));

		var flibY = state.style[mxConstants.STYLE_FLIPV];
		if (flibY == 1) shape.appendChild(createCellElem("FlipY", 1, xmlDoc));

		var rounded = state.style[mxConstants.STYLE_ROUNDED];
		if (rounded == 1) shape.appendChild(createCellElemScaled("Rounding", state.cell.geometry.width*0.1, xmlDoc));

		//TODO for some reason, visio doesn't show the label (text) background color!
		var lbkgnd = state.style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR];
		if (lbkgnd) shape.appendChild(createCellElem("TextBkgnd", lbkgnd, xmlDoc));
	};

	function createShape(id, geo, xmlDoc, parentHeight)
	{
		var shape = xmlDoc.createElement("Shape");
		
		shape.setAttribute("ID", id);
		shape.setAttribute("NameU", "Shape" + id);
		shape.setAttribute("LineStyle", "0");
		shape.setAttribute("FillStyle", "0");
		shape.setAttribute("TextStyle", "0");
		
		var hw = geo.width/2, hh = geo.height/2;
		
		shape.appendChild(createCellElemScaled("PinX", geo.x + hw, xmlDoc));
		shape.appendChild(createCellElemScaled("PinY", parentHeight - geo.y - hh, xmlDoc));
		shape.appendChild(createCellElemScaled("Width", geo.width, xmlDoc));
		shape.appendChild(createCellElemScaled("Height", geo.height, xmlDoc));
		shape.appendChild(createCellElemScaled("LocPinX", hw, xmlDoc));
		shape.appendChild(createCellElemScaled("LocPinY", hh, xmlDoc));
		
		return shape;
	};
	
	function convertMxCell2Shape(cell, graph, xmlDoc, parentHeight, parentGeo)
	{
		var geo = cell.geometry;
		
		if (geo != null)
		{
			if (geo.relative && parentGeo)
			{
				geo = geo.clone();
				geo.x *= parentGeo.width;
				geo.y *= parentGeo.height;
				geo.relative = 0;
			}

			var shape = createShape(cell.id, geo, xmlDoc, parentHeight);
			
			var state = graph.view.getState(cell);

			applyMxCellStyle(state, shape, xmlDoc);
			
			vsdxCanvas.newShape(shape, geo, xmlDoc);

			if (state.text != null && state.text.checkBounds())
			{
				vsdxCanvas.save();
				
				if (parentGeo)
				{
					vsdxCanvas.translate(-parentGeo.x, -parentGeo.y);
				}
				
				state.text.paint(vsdxCanvas);
				vsdxCanvas.restore();
			}
			if (state.shape != null && state.shape.checkBounds())
			{
				vsdxCanvas.save();
				
				if (parentGeo)
				{
					vsdxCanvas.translate(-parentGeo.x, -parentGeo.y);
				}
				
				state.shape.paint(vsdxCanvas);
				vsdxCanvas.restore();
			}

			shape.appendChild(vsdxCanvas.getShapeGeo());

			vsdxCanvas.endShape();
			shape.setAttribute("Type", vsdxCanvas.getShapeType());

			return shape;
		}
		
		return null;
	};

	
	function convertMxModel2Page(graph, modelAttrib)
	{
        var xmlDoc = mxUtils.createXmlDocument();

        var root = xmlDoc.createElement("PageContents");
        root.setAttribute("xmlns", that.XMLNS);
        root.setAttribute("xmlns:r", that.XMLNS_R);
        root.setAttribute("xml:space", that.XML_SPACE);
        
        var shapes = xmlDoc.createElement("Shapes");
        root.appendChild(shapes);

        var model = graph.model;
        
		var t = graph.view.translate;
		var s = graph.view.scale;
		
		vsdxCanvas.translate(-t.x, -t.y);
		vsdxCanvas.scale(1 / s);
		vsdxCanvas.newPage();
		
		var defParent = graph.getDefaultParent();
		
		for (var id in model.cells) 
		{
			var c = model.cells[id];
			//top-most cells
			if (c.parent == defParent)
			{
				var shape;
				if (c.getChildCount() > 0) //Group 
				{
					var geo = c.geometry;
					shape = createShape(c.id+"10000", geo, xmlDoc, modelAttrib.pageHeight);
					shape.setAttribute("Type", "Group");
					
					var gShapes = xmlDoc.createElement("Shapes");

					var newGeo = geo.clone();
					newGeo.x = 0;
					newGeo.y = 0;
					c.setGeometry(newGeo);
					var subShape = convertMxCell2Shape(c, graph, xmlDoc, geo.height, geo);
					c.setGeometry(geo);
					gShapes.appendChild(subShape);
					
					for (var i = 0; i < c.children.length; i++)
					{
						var subShape = convertMxCell2Shape(c.children[i], graph, xmlDoc, geo.height, geo);
						gShapes.appendChild(subShape);
					}
					
					shape.appendChild(gShapes);
				}
				else
				{
					shape = convertMxCell2Shape(c, graph, xmlDoc, modelAttrib.pageHeight);
				}
				
				if (shape != null)
					shapes.appendChild(shape);
			}
		}
		
		xmlDoc.appendChild(root);

		return xmlDoc;
	};

	function writeXmlDoc2Zip(zip, name, xmlDoc, noHeader)
	{
		zip.file(name, (noHeader? "" : "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>") + mxUtils.getXml(xmlDoc));
	};
	
	function addPagesXML(zip, pages, modelsAttr) 
	{
		var pagesXmlDoc = mxUtils.createXmlDocument();
		var pagesRelsXmlDoc = mxUtils.createXmlDocument();
		
		var pagesRoot = pagesXmlDoc.createElement("Pages");
		pagesRoot.setAttribute("xmlns", that.XMLNS);
		pagesRoot.setAttribute("xmlns:r", that.XMLNS_R);
		pagesRoot.setAttribute("xml:space", that.XML_SPACE);
		
		var pagesRelsRoot = pagesRelsXmlDoc.createElement("Relationships");
		pagesRelsRoot.setAttribute("xmlns", that.RELS_XMLNS);
		
		var i = 1;
		for (var name in pages) 
		{
			var pageName = "page" + i + ".xml";
			
			var pageE = pagesXmlDoc.createElement("Page");
			pageE.setAttribute("ID", i-1);
			pageE.setAttribute("NameU", name);
			pageE.setAttribute("Name", name);
		
			var pageSheet = pagesXmlDoc.createElement("PageSheet");
		
			var modelAttr = modelsAttr[name];
			
			pageSheet.appendChild(createCellElemScaled("PageWidth", modelAttr['pageWidth'], pagesXmlDoc));
			pageSheet.appendChild(createCellElemScaled("PageHeight", modelAttr['pageHeight'], pagesXmlDoc));
			pageSheet.appendChild(createCellElem("PageScale", modelAttr['pageScale'], pagesXmlDoc));
			pageSheet.appendChild(createCellElem("DrawingScale", 1, pagesXmlDoc));
		
			var relE = pagesXmlDoc.createElement("Rel");
			relE.setAttribute("r:id", "rId" + i);
			
			pageE.appendChild(pageSheet);
			pageE.appendChild(relE);
			pagesRoot.appendChild(pageE);
			
			var relationship = pagesRelsXmlDoc.createElement("Relationship");
			relationship.setAttribute("Id", "rId" + i);
			relationship.setAttribute("Type", that.PAGES_TYPE);
			relationship.setAttribute("Target", pageName);
			pagesRelsRoot.appendChild(relationship);
			
			//Note:Each page rels is created with the skeleton as they are constants
			
			//write the page docs
			var xmlDoc = pages[name];
			writeXmlDoc2Zip(zip, that.VISIO_PAGES + pageName, xmlDoc);
			i++;
		}
		
		pagesXmlDoc.appendChild(pagesRoot);
		pagesRelsXmlDoc.appendChild(pagesRelsRoot);
		writeXmlDoc2Zip(zip, that.VISIO_PAGES + "pages.xml", pagesXmlDoc);
		writeXmlDoc2Zip(zip, that.VISIO_PAGES + "_rels/pages.xml.rels", pagesRelsXmlDoc);
	}

	function addImagesRels(zip, pIndex)
	{
		//create a new page rels file
		var fId = that.VISIO_PAGES_RELS + "page" + pIndex + ".xml.rels";
		var pageRelDoc = mxUtils.createXmlDocument();

		var relationships = pageRelDoc.createElement("Relationships");
		relationships.setAttribute("xmlns", that.RELS_XMLNS);

		var imgs = vsdxCanvas.images;

		//create rels of image files
		if (imgs.length > 0)
		{
    		for (var i = 0; i < imgs.length; i++)
			{
    	        var relationship = pageRelDoc.createElement("Relationship");
    	        relationship.setAttribute("Type", that.XMLNS_R + "/image");
    	        relationship.setAttribute("Id", "rId" + (i+1));
    	        relationship.setAttribute("Target", "../media/" + imgs[i]);
    	        
    	        relationships.appendChild(relationship);
			}
    	}
		pageRelDoc.appendChild(relationships);
    	writeXmlDoc2Zip(zip, fId, pageRelDoc);
	};
	/**
	 * 
	 * Convert current Editor UI pages into a vdsx file
	 * @return true if successful, false otherwise 
	 */
	this.exportCurrentDiagrams = function ()
	{
		try 
		{
			var zip = new JSZip();
		    
			vsdxCanvas.init(zip);
			
			pages = {};
			modelsAttr = {};
			
			var pagesCount = editorUi.pages != null? editorUi.pages.length : 1;
			
			if (editorUi.pages != null) 
			{
				var currentPage = editorUi.currentPage;

				for (var i=0; i < editorUi.pages.length; i++)
				{
					var page = editorUi.pages[i];
					editorUi.selectPage(page);
					var diagramName = page.getName();
					var graph = editorUi.editor.graph;
					var modelAttrib = getGraphAttributes(graph);
					pages[diagramName] = convertMxModel2Page(graph, modelAttrib);
					addImagesRels(zip, i+1);
					modelsAttr[diagramName] = modelAttrib;
				}
				editorUi.selectPage(currentPage);
			}
			else
			{
				var graph = editorUi.editor.graph;
				var modelAttrib = getGraphAttributes(graph);
				var diagramName = "Page1";
				pages[diagramName] = convertMxModel2Page(graph, modelAttrib);
				addImagesRels(zip, 1);
				modelsAttr[diagramName] = modelAttrib;
			}
			
			createVsdxSkeleton(zip, pagesCount, function() {
				addPagesXML(zip, pages, modelsAttr);
				
				//wait until all media files are loaded
				var createZipFile = function() 
				{
					if (vsdxCanvas.filesLoading > 0) 
					{
						setTimeout(createZipFile, vsdxCanvas.filesLoading * 200);
					}
					else 
					{
						zip.generateAsync({type:"blob"}).then(
							function(content) 
							{
								var file = editorUi.getCurrentFile();
								
								var filename = (file != null && file.getTitle() != null) ? file.getTitle() : editorUi.defaultFilename;
							    editorUi.saveData(filename+".vsdx", 'vsdx', content, 'application/vnd.visio2013');
							}
						);
					}
				};
				
				createZipFile();
			});
			return true;
		}
		catch(e) 
		{
			console.log(e);
			return false;
		}

	};	
}

VsdxExport.prototype.CONVERSION_FACTOR = 40 * 2.54; //screenCoordinatesPerCm (40) x CENTIMETERS_PER_INCHES (2.54)
VsdxExport.prototype.PAGES_TYPE = "http://schemas.microsoft.com/visio/2010/relationships/page";
VsdxExport.prototype.RELS_XMLNS = "http://schemas.openxmlformats.org/package/2006/relationships";
VsdxExport.prototype.XML_SPACE = "preserve";
VsdxExport.prototype.XMLNS_R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
VsdxExport.prototype.XMLNS = "http://schemas.microsoft.com/office/visio/2012/main";
VsdxExport.prototype.VISIO_PAGES = "visio/pages/";
VsdxExport.prototype.PREFEX = "com/mxgraph/io/vsdx/resources/export/";
VsdxExport.prototype.VSDX_ENC = "ISO-8859-1";
VsdxExport.prototype.PART_NAME = "PartName";
VsdxExport.prototype.CONTENT_TYPES_XML = "[Content_Types].xml";
VsdxExport.prototype.VISIO_PAGES_RELS = "visio/pages/_rels/";

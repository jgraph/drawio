/**
 * Export mxFile as Vsdx file
 */
function VsdxExport(resDir, editorUi)
{
	var that = this;
	
	resDir = resDir || "js/diagramly/vsdx/resources"

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
			    	
			    	var p1Id = that.VISIO_PAGES_RELS + "page1.xml.rels";
			    	for (var i = 2; i <= pageCount; i++)
			    	{
			    		var fId = that.VISIO_PAGES_RELS + "page" + i + ".xml.rels";
			    		zip.file(fId, files[p1Id]);
		
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
		  
//		  //just for testing
//		  zip.generateAsync({type:"base64"}).then(function (base64) 
//		  {
//			    location.href="data:application/zip;base64," + base64;
//		  });
		  
		  if (callback) callback();
		});
	};

	function getModelExtAttributes(modelNode) 
	{
		var attr = {};
		
		try
		{
			var grid = modelNode.getAttribute("grid");
			attr['gridEnabled'] = grid? "1" == grid : true;
			
			var gridSize = modelNode.getAttribute("gridSize");
			attr['gridSize'] = gridSize? parseFloat(gridSize) : 10;
			
			var guides = modelNode.getAttribute("guides");
			attr['guidesEnabled'] = guides? "1" == guides : true;
 
			var page = modelNode.getAttribute("page");
			attr['pageVisible'] = page? "1" == page : true;
			
			var pageScale = modelNode.getAttribute("pageScale");
			attr['pageScale'] = pageScale? parseFloat(pageScale): 1;
			
			var pageWidth = modelNode.getAttribute("pageWidth");
			attr['pageWidth'] = pageWidth? parseFloat(pageWidth) : 839;

			var pageHeight = modelNode.getAttribute("pageHeight");
			attr['pageHeight'] = pageHeight? parseFloat(pageHeight) : 1188;

			var background = modelNode.getAttribute("background");
			attr['backgroundClr'] = background? background : '#FFFFFF';

			var math = modelNode.getAttribute("math");
			attr['mathEnabled'] = math? "1" == math : true;

			var shadow = modelNode.getAttribute("shadow");
			attr['shadowVisible'] = shadow? "1" == shadow : false;

			//these most probably not needed in vsdx
			var tooltips = modelNode.getAttribute("tooltips");
			attr['tooltips'] = tooltips? "1" == tooltips : true;
			
			var connect = modelNode.getAttribute("connect");
			attr['connect'] = connect? "1" == connect : true;
			
			var arrows = modelNode.getAttribute("arrows");
			attr['arrows'] = arrows? "1" == arrows : true;
			
			var fold = modelNode.getAttribute("fold");
			attr['foldingEnabled'] = fold? "1" == fold : true;
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

	function createGeoElem(cell, xmlDoc)
	{
		var geoSec = xmlDoc.createElement("Section");
		
		geoSec.setAttribute("N", "Geometry");
		geoSec.setAttribute("IX", "0");
		
		//now just create a rectangle
		geoSec.appendChild(createRow("MoveTo", "1", 0, 0, xmlDoc));
		geoSec.appendChild(createRow("RelLineTo", "2", 1, 0, xmlDoc));
		geoSec.appendChild(createRow("RelLineTo", "3", 1, 1, xmlDoc));
		geoSec.appendChild(createRow("RelLineTo", "4", 0, 1, xmlDoc));
		geoSec.appendChild(createRow("RelLineTo", "5", 0, 0, xmlDoc));
		
		return geoSec;
	};

	function convertMxCell2Shape(cell, model, xmlDoc, parentHeight)
	{
		var geo = cell.geometry;
		
		if (geo != null)
		{
			var shape = xmlDoc.createElement("Shape");
			
			shape.setAttribute("ID", cell.id);
			shape.setAttribute("NameU", "NotYet");
			shape.setAttribute("Type", "Shape");
			
			var hw = geo.width/2, hh = geo.height/2;
			
			shape.appendChild(createCellElemScaled("PinX", geo.x + hw, xmlDoc));
			shape.appendChild(createCellElemScaled("PinY", parentHeight - geo.y - hh, xmlDoc));
			shape.appendChild(createCellElemScaled("Width", geo.width, xmlDoc));
			shape.appendChild(createCellElemScaled("Height", geo.height, xmlDoc));
			shape.appendChild(createCellElemScaled("LocPinX", hw, xmlDoc));
			shape.appendChild(createCellElemScaled("LocPinY", hh, xmlDoc));
			
			shape.appendChild(createGeoElem(cell, xmlDoc));

			return shape;
		}
		
		return null;
	};

	
	function convertMxModel2Page(model, name, modelAttrib)
	{
        var xmlDoc = mxUtils.createXmlDocument();

        var root = xmlDoc.createElement("PageContents");
        root.setAttribute("xmlns", that.XMLNS);
        root.setAttribute("xmlns:r", that.XMLNS_R);
        root.setAttribute("xml:space", that.XML_SPACE);
        
        var shapes = xmlDoc.createElement("Shapes");
        root.appendChild(shapes);

		var graph = new Graph(null, model);
		var defParent = graph.getDefaultParent();
		
		for (var id in model.cells) 
		{
			var c = model.cells[id];
			//top-most cells
			if (c.parent == defParent)
			{
				var shape = convertMxCell2Shape(c, model, xmlDoc, modelAttrib.pageHeight);
				
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

	/**
	 * 
	 * Convert mxFile into a vdsx file
	 * @param mxFileXML mxFile xml string
	 * @param out output stream where vsdx file is written to
	 * @return true if successful, false otherwise (stream should be discarded and closed)
	 */
	function exportMxFile(mxFileXML) 
	{
		try 
		{
			var zip = new JSZip();
		    
			pages = {};
			modelsAttr = {};
			
			var doc = mxUtils.parseXml(mxFileXML);
			var diagrams = doc.documentElement.children;
			var codec = new mxCodec();
			var pagesCount = 0;
			
			for (var i=0; i < diagrams.length; i++)
			{
				var diagram = diagrams[i];
				
				if (diagram.nodeName == "diagram") 
				{
					var diagramName = diagram.getAttribute("name");
					var diagramB64 = diagram.firstChild.textContent;
					var deflated = (window.atob) ? atob(diagramB64) : Base64.decode(diagramB64, true);
					var uriEncoded = Graph.prototype.bytesToString(pako.inflateRaw(deflated));
					var xml = decodeURIComponent(uriEncoded);
					
					var modelNode = mxUtils.parseXml(xml).documentElement;
					var modelAttrib = getModelExtAttributes(modelNode);
					var model = codec.decode(modelNode);
					pages[diagramName] = convertMxModel2Page(model, diagramName, modelAttrib);
					modelsAttr[diagramName] = modelAttrib;
					pagesCount++;
				}
			}
			
			createVsdxSkeleton(zip, pagesCount, function() {
				addPagesXML(zip, pages, modelsAttr);
				
				//just for testing
				zip.generateAsync({type:"base64"}).then(function (base64) 
				{
				    location.href="data:application/zip;base64," + base64;
				});
			});
			return true;
		}
		catch(e) 
		{
			console.log(e);
			return false;
		}
	}		
	

	//test
//	createVsdxSkeleton(zip, 4, function(){});
	var mxFileXml = mxFileXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><mxfile><diagram name=\"Page-1\">7ZZbk5owFMc/DTPtixPC/VG87G697Ky43t4CREgFwkAE3E/fIFGhzs5uO+1Lpzij8sv/5JCT849KyiCuHjKUhjPq40iCwK8kZShBKMtA5x81OTVEM60GBBnxhegGHPKGBQSCHomP846QURoxknahR5MEe6zDUJbRsivb06ibNUUBvgOOh6J7uiY+C6/rAreBR0yCUKQ2NTHgIu8QZPSYiHwSVPbnqxmO0XWuBuQh8mnZoPMUykgCfan+DiRlkFHKOugyEFcDHNU1v5SzyT/+nPi6vAwn7DfioXh4droULMiQT/hkAxrR7IwURTFN1ZUUe0+iqMVVzdV1lfMi96unIYcyv4mQiyP7Wr2LPqEJz2DzMqV1ppzhxCPRl2I1tod0Fowey/miohPzZbPmTx/Pl6vTOtqGO2Tt8Xg6cR/SiRcXnvL81lfdRRrow+EgBIN0ZPK+cRf549bRBugtf3aG2/jbqPy+nMtamRqmBystIX1jpmTqCmhbPJKg7a/mxgId1xqkQXZUx0cHLYnMVnHKk2+exjO222/lV6Iux/bhwANesgV/n9q41KitR88HDS4T6lS76fYVeX6xKGweaShF/4XrNpa10wyiFRs9n0RjL4cJ/lqvnmX0gFsl5IZyFViPpMgjSTDF+3obQQ9A0Llk8yayKWM0/lC2EF39jipkcSS2TAQsafq+/LyZuG4b3kh2GRKGHR5W72XJj47r4i4uk3sW0Di9b1DRswXOGK5a6L5hb237gGmMWXbi95cQaDTznC4HjtzTrNYl0pQ312vAbFjYMrxhGj1VnDfirAmuyd41Ut2ijZc+ZTPlQ5sJe/zkMAMgXzXaDoP/HfZrDrPOr3/RYaCnK3/TYYYs92DHYzqwuh67s1jtQv3eZFDXe8YfMtmZt35Oha71/+XMfwA=</diagram><diagram name=\"Page-2\">nZTbkqIwEIafhqrdGwuIEbwUlJldD1Mjjqe7CAGyBkKFCDhPv0HigbWmdmtzofD132nS6W4NuGn9wlGezFmIqWbqYa2BsWaahqEP5F9Dzi2B9rAFMSehEt2BTz6xgrqiJxLioiMUjFFB8i4MWJbhQHQY4pxVXVnEaDdqjmL8BPwA0We6IaFIbufS74ZXTOJEhbahMhxQcIw5O2UqnmaC6LJac4pue7WgSFDIqhZdtgATTR9pzbOuAZczJjroakhrF9Mm59d0tvG9fxPfjsdxJv7D31QfL87XhMUchURu5jLKuEQZy6TFiQilVyRTcQBRKFMBnLII6x9jCQ35QtEBU+eWuD+2kBnKmyCFwFlA6Ldy7TljNo8nr9ViWbOp/b7dyA9PF6v1eUN3yR4NI+zNpoeXfBqkZQDePkf9wzKPB+Oxm+huPrFlyRyWxevOhy76LN788S79Oal+rRYGrHLLDswaZmRkzQHvr3W4wxPNdML1wlqi0waaLOanvnfy0YoYYp3mMvj2hzcX+2hnfJD+ynOOR+nwzpfyd+bgCjJnQN+O0FxlzK/3s90HCsJyWTrS0wLl6F3qtsPhHloElttBMaVeUJgZ/t6cXnB2xA8pBBjacNhYchSQLJ7hqLlBvaebemcZ9l3kMCFY+lfZUhX0F6pEpFRdmXJYsfxr+eUycVMxsoacKiEC+9KtuctKTo3b4a4NZvSgbUGJn4tT1WuJucD1A3ou1nvJvmCWYsHP8v3qYlk9u91JjSUDmj0wfFjKXN17HkDYU8MseWh4s2/0gJo3atbEt4BfNlJTp20vddtc8odOV7qH0XrhvwE=</diagram><diagram name=\"Page-3\">7VhZc6pIFP41Vs08jNWs4qMgCmJwwS2+ITTQgjQiCvjrp1GMEuNNcm9y52EuVZb0x1n6LN9hqTHSJuvGZuQ9YRsGNRrYWY1p12iaEliG/BVIfkaaAn0G3BjZpdAVMNARliAo0T2y4a4imGAcJCiqghYOQ2glFcyMY5xWxRwcVL1GpgvvAMMyg3t0juzEK1EKgOsFBSLXK10LXHlhZVq+G+N9WPqr0YxzOs6XN+aLrTOw80wbp2foZIKRa6BVK85BjZFijJMKdLmwySQYFDm/pPPsv/Mx4ZfwYhgmP6FfFnOX5JeEubFpI2JMwgGOCRTikFwRHRQEr6DDzs7UNllTZBGYKxiILzl7JbpLYuzD12BkWih0+9Apdv4PXQdNtnlzCFcZEScJ3rwnNS7L+EOhCY4einjJJijjOUUBiyyRvImphxJoEANFklLClJeYLk1F1Rs8Ae/LUVboAOMEZjfQfXmuRepCvIFJnJN1qUIas87dbrdxNluyssHXqdtYyrKm147naFAvdbybdqd5UGe4km4l1dwX7w/7iOBlK32oy5if6TJCOAbwvMXcthr9fqt5ZlQ42SUwtFDw1/Q4o/s7Tu3L3kyfqLiPQu0I2OQI0iiftSg7kKmnXfyUAzfJUSruAkNfzOZ6aA9zRPUniMTa6wuU6pITtSf7Mh5pZMrRnXZ3LIlTw3GXrGioNVocj4zplklpNJCsYxtsMm2kzAiuAlqX2rrVOlLbp+d11JXNiewfFQpwviqrvanbUoW95+XeSBLVVbZlW3/fkYakg6ZYpmH9fubc0OIDJPoy5tC/xpySGjxXBwK4HtRHqUExoE4J300N9suowXyaGsms329jNZWHualsQjP2XBIvqUQHDccuBjN/O98e1kwnsRR52PUTet7dQMr3hC4fL8brjdhLRoqQdri9gnbdrjZfxPm2pVtzLV2uWvthDxvEmBkO+NVhTM6W5Ne0h5OQ2crrcGxIiOKDrDcf6a1+vt5nKlZkZ75Ie67U7LmtZicKPQ1trXgiA8VsRLLdWOqgZdmxRvbZcxqdwTO9MfZtNQol1ul1lCRbehvCJsjP06bRnhdVojvhYDO2nhcsyIxlkOtPPmg6WVM9tqC0h+CoUz0rRkvF97I5Bm1nciDWQ01YeAtrIg18q6kc+hPWN1WjGAKr7uk2z7T/kPSXSVqqNKk6Rd+QlLkjKcMIdZb/r25g3JexlP80S8OlMpax6spy0c2eb1miMuMTco6HvaC7lHr5DBzIHBFNzbfC+cZkomXjSE8XAfb4xmDuSl24Fhl77tOcMBEMaGlcEoN2Yyp2MlXr7RXTHTD6lIYi5/e6OmWtbDZlc07bESeaun1m9/zAeOLMLGL6sqt3aHmBls6JgiwEqUYdJW2BRlZf6SM3ygzlyDUODkmA2PQKNUXacf2Yo/S+LR/lddQZgaHZJQ2rdeJ1pBupbw9U7KwF29zr6WxaBOfM9i4eNzrPlvKHZ/8XnvHf+fzMVx6ZKZaq08JNufjvDq7xXcFRdPVtgOGZOsf8ztCEu/n4MvAapJ1hePkyQB7GHg/A6yt2QQszTlrFB4CbF06SJkRe7VsBckMCb5BtF/4K+xfRVYAt/615QTU5brW6mxegDm4JUTwgvjUwHokVu6yE9mqGPNCDtguNMlllcI/mygML1cHyeojQp6xnKFmcLZSr58pqCGNE+gDGpRHSlXF+o1Asn6vLqsqjdt7hfWzBCqNJnlyYVHhQ5ODzLR/DwEzQofp1563GfmTvYpU0jJnf6EYYhcnufc3rroaFxk+MmLcY9yEPr3l+st/8Wpun2cF+yOZpSpzT+J7g1W3phvQUuLlZChTN0tVaYsfZkY758UbKQfXSHx8fZSf85qPcxdL1K+gJ/xc=</diagram></mxfile>";
	exportMxFile(mxFileXml);
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
//VsdxExport.prototype.DOC_PROPS_CUSTOM_XML = "docProps/custom.xml";
//VsdxExport.prototype.DOC_PROPS_CORE_XML = "docProps/core.xml";
//VsdxExport.prototype.DOC_PROPS_APP_XML = "docProps/app.xml";
//VsdxExport.prototype._RELS_RELS_FILE = "_rels/.rels";
VsdxExport.prototype.CONTENT_TYPES_XML = "[Content_Types].xml";
//VsdxExport.prototype.VISIO_MASTERS_RELS_MASTERS_XML_RELS = "visio/masters/_rels/masters.xml.rels";
//VsdxExport.prototype.VISIO_MASTERS_MASTERS_XML = "visio/masters/masters.xml";
//VsdxExport.prototype.VISIO_RELS_DOCUMENT_XML_RELS = "visio/_rels/document.xml.rels";
//VsdxExport.prototype.VISIO_WINDOWS_XML = "visio/windows.xml";
//VsdxExport.prototype.VISIO_DOCUMENT_XML = "visio/document.xml";
VsdxExport.prototype.VISIO_PAGES_RELS = "visio/pages/_rels/";

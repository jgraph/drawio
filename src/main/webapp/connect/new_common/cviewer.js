function mxAddSpinner(container, absolute)
{
	var div = document.createElement('div');
	div.style.cssText = ((absolute) ? 'position:absolute;top:50%;left:50%;margin-left:-20px;margin-top:-20px;' :
		'position:relative;') + 'width:40px;height:40px;';
	container.appendChild(div);
	
	new Spinner({
		lines: 12, // The number of lines to draw
		length: 7, // The length of each line
		width: 3, // The line thickness
		radius: 6, // The radius of the inner circle
		rotate: 0, // The rotation offset
		color: '#000', // #rgb or #rrggbb
		speed: 2, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 999 // The z-index (defaults to 2000000000)
	}).spin(div);
	
	return div;
};
	
var tbHeight = 0;
var mxSpinner = mxAddSpinner(document.body);

function updateHeight(height)
{
	parent.postMessage(JSON.stringify({action: 'updateHeight', height: Math.ceil(height) + tbHeight + 2}), '*');
};

function showError(msg)
{
	mxSpinner.parentNode.removeChild(mxSpinner);
	document.body.style.padding = '4px';
	mxUtils.write(document.body, msg);
	updateHeight(24);
};

function renderDiagram(xml, fileTitle, readerOpts)
{
	GraphViewer.initCss();
	// Disables delayed rendering since the container is created on the fly
	GraphViewer.prototype.checkVisibleState = false;
	
	try
	{
		//Code is adopted from mxViewer of Conf Server
		mxStencilRegistry.dynamicLoading = true;
		
		if (readerOpts.simpleViewer)
		{
			//We don't have an image, so, hide the toolbar
			readerOpts.tbstyle = 'hidden';
		}
		
		var graphContainer = document.createElement('div');
		graphContainer.style.cssText = 'position:absolute;' +
			'max-width:100%;border:1px solid transparent;height:auto;overflow:hidden;';
		
		if (readerOpts.width != null)
		{
			graphContainer.style.width = readerOpts.width + 'px';
		}
		
		document.body.appendChild(graphContainer);
		var doc = mxUtils.parseXml(xml);
		
		if (readerOpts.border)
		{
			graphContainer.style.border = '1px solid #d0d0d0';
		}
		
		var config = {'toolbar-position': readerOpts.tbstyle,
				nav: true, highlight: '#3b73af', border: 8};
		
		if (readerOpts.links != 'auto')
		{
			config.target = readerOpts.links;
		}
		
		if (readerOpts.tbstyle == 'top')
		{
			config.title = readerOpts.diagramDisplayName != null && readerOpts.diagramDisplayName.length > 0 ? readerOpts.diagramDisplayName : fileTitle;
			tbHeight = GraphViewer.prototype.toolbarHeight;
		}
		
		if (!readerOpts.lightbox)
		{
			config.lightbox = false;
		}
		
		// Image fallback used if toolbar disabled and image specified
		if (readerOpts.tbstyle == 'hidden')
		{
			config.resize = true;
		}
		else
		{
			config.toolbar = 'pages zoom layers';
			
			if (readerOpts.lightbox)
			{
				config.toolbar += ' lightbox';
			}
		}

		// Forces fit to container and allows scales > 1
		if (readerOpts.width != null)
		{
			config['allow-zoom-in'] = true;
		}
		
		config.zoom = 1;//stops from zooming too much on smaller diagrams 
		
		if(readerOpts.aspect != null && readerOpts.aspect.length > 0) 
		{
			pageAndLayers = readerOpts.aspect.split(' ');
			//we put the layerIds array in the config object due to a timing issue in FF
			config.layerIds = pageAndLayers.length > 1 ? pageAndLayers.slice(1) : null;
			config.pageId = pageAndLayers[0];
		}
		
		mxSpinner.parentNode.removeChild(mxSpinner);
		mxGlobalViewer = new GraphViewer(graphContainer, doc.documentElement, config);
			
		// Handles resize of iframe after zoom
		var graphDoResizeContainer = mxGlobalViewer.graph.doResizeContainer;
		
		mxGlobalViewer.graph.doResizeContainer = function(width, height)
		{
			graphDoResizeContainer.apply(this, arguments);
			updateHeight(height);
		};

		// Updates the size of the iframe in responsive cases
		mxGlobalViewer.updateContainerHeight = function(container, height)
		{
			updateHeight(height);
		};
		
		updateHeight(graphContainer.offsetHeight);
		
		var orignShowLightbox = mxGlobalViewer.showLightbox;
		
		mxGlobalViewer.showLightbox = function()
		{
			orignShowLightbox.call(this, false); //Open in new tab without edit option
		}
	}
	catch(e)
	{
		showError(e.message);
	}	
};

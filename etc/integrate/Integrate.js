/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
// The bundle for third parties is a public build, in the public repository
// and in the internal builds alike, as it is one file for both (the driver,
// 22 November 2026): the dialogs and menus of before, the rows of
// Editor.featureDefaults without publicBuild are off (Editor.isPublicBuild).
// The other public builds are marked with none in Editor.fusionThemeBuild of
// FusionTheme.js, which this bundle does not have (atlas.min.js), so it sets
// the mark and its check here
Editor.fusionThemeBuild = 'none';
Editor.fusionThemeAvailable = false;

Editor.isPublicBuild = function()
{
	return !Editor.fusionThemeAvailable;
};

// Disables eval for JS (uses shapes.min.js)
mxStencilRegistry.allowEval = false;

// Sets defaults
Graph.prototype.defaultPageVisible = false;
Graph.prototype.defaultScrollbars = false;
EditorUi.prototype.toolbarHeight = 0;
EditorUi.scratchpadHelpLink = null;

// Enables action states
EditorUi.prototype.isDiagramActive = function()
{
    return true;
};

// Enables settings
EditorUi.prototype.isSettingsEnabled = function()
{
    return true;
};

// Enables scratchpad
EditorUi.prototype.isScratchpadEnabled = function()
{
    return true;
};

// Workaround for tainted canvas is to base64 encode the image on the server-side
EditorUi.prototype.convertImageToDataUri = function(url, callback)
{
	if (/(\.svg)$/i.test(url))
	{
		mxUtils.get(url, mxUtils.bind(this, function(req)
		{
			callback(Editor.createSvgDataUri(req.getText()));
		}),
		function()
		{
			callback(url);
		});
	}
    else
    {
        // Workaround for tainted canvas error
        if (url.substring(0, PROXY_URL.length) == PROXY_URL)
        {
            mxUtils.get(url + '&base64=1', mxUtils.bind(this, function(req)
            {
                callback('data:image/png;base64,' + req.getText());
            }),
            function()
            {
                callback(url);
            });
        }
        else
        {
		    var img = new Image();
		    var self = this;
		    
		    if (this.crossOriginImages)
	    	{
			    img.crossOrigin = 'anonymous';
		    }
		    
		    img.onload = function()
		    {
		        var canvas = document.createElement('canvas');
		        var ctx = canvas.getContext('2d');
		        canvas.height = img.height;
		        canvas.width = img.width;
		        ctx.drawImage(img, 0, 0);
		        
		        try
		        {
	        		callback(canvas.toDataURL());
		        }
		        catch (e)
		        {
	        		callback(url);
		        }
		    };
		    
		    img.onerror = function()
		    {
	    		callback(url);
		    };
		    
		    img.src = url;
        }
    }
};

if (typeof(window.mxIntegrateCallback) === 'function')
{
	window.mxIntegrateCallback();
}

/**
 * Plugin for electron build
 */
Draw.loadPlugin(function(ui)
{
	ui.hideFooter();
	
	if (!window.mxIsElectron5)
	{
		var footer = document.createElement('div');
		footer.style.cssText = 'position:absolute;bottom:0px;max-width:90%;padding:10px;padding-right:26px;' +
			'white-space:nowrap;left:50%;bottom:2px;';
		footer.className = 'geStatusAlert';
		
		mxUtils.setPrefixedStyle(footer.style, 'transform', 'translate(-50%,110%)');
		mxUtils.setPrefixedStyle(footer.style, 'transition', 'all 1s ease');
		footer.style.whiteSpace = 'nowrap';
		footer.innerHTML = '<a href="http://about.draw.io/drawio-desktop-10-7-5-release" ' +
			'target="_blank" style="display:inline;text-decoration:none;font-weight:700;font-size:13px;opacity:1;">' +
			'<img src="' + this.editor.graph.warningImage.src + '" border="0" style="margin-top:-4px;margin-right:2px;" valign="middle"/>&nbsp;' +
			'Important desktop security update, please upgrade. Click here.&nbsp;' +
			'<img src="' + this.editor.graph.warningImage.src + '" border="0" style="margin-top:-4px;margin-left:2px;" valign="middle"/></a>';
		
		var img = document.createElement('img');
		
		img.setAttribute('src', Dialog.prototype.closeImage);
		img.setAttribute('title', mxResources.get('close'));
		img.style.position = 'absolute';
		img.style.cursor = 'pointer';
		img.style.right = '10px';
		img.style.top = '12px';
	
		footer.appendChild(img);
	
		mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
		{
			footer.parentNode.removeChild(footer);
			this.hideFooter();
		}));
		
		document.body.appendChild(footer);
	}
});
/**
 * Plugin for embed mode in Confluence Connect.
 */
Draw.loadPlugin(function(ui)
{
	// Changes support link in Help menu
	ui.actions.addAction('support...', function()
	{
		window.open('https://support.draw.io/display/DFCC/draw.io+for+Confluence+Cloud');
	});
	

	// Display footer and alter it
	var td = document.getElementById('geFooterItem2');
	
//	if (td != null)
//	{
//		td.innerHTML = '<a title="Connect review" href="https://marketplace.atlassian.com/plugins/com.mxgraph.confluence.plugins.diagramly/cloud/reviews" target="_blank">' +
//		'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Enjoying draw.io for free? Please help us to a 4 star rating</a>';
//	}
	
	if (td != null)
	{
		td.innerHTML = '<a title="Connect review" href="https://desk.draw.io/solution/articles/16000041415-how-to-recover-a-draw-io-diagram-when-the-confluence-page-edit-session-times-out-" target="_blank">' +
		'Please read this article about page edit timeouts</a>';
	}
	
	td = document.getElementById('geFooterItem1');
	
	if (td != null)
	{
		td.parentNode.removeChild(td);
	}
	
	td = document.getElementById('geFooterItem3');

	if (td != null)
	{
		td.parentNode.removeChild(td);
	}
	
	var lang = urlParams['lang'];
	var site = urlParams['site'];
	var user = urlParams['user'];
	
	try
	{
		var img = new Image();
		img.src = 'https://log.draw.io/log?severity=CONFIG&msg=conf-cloud-edit' +
				((lang != null) ? ':lang=' + encodeURIComponent(lang) : '') + 
				((site != null) ? ':site=' + encodeURIComponent(site) : '') + 
				((user != null) ? ':user=' + encodeURIComponent(user) : '') +
				'&v=' + encodeURIComponent(EditorUi.VERSION);
	}
	catch (e)
	{
		// not important, just don't break editing because of a log
	}
});

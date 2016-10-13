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
	
	if (td != null)
	{
		td.innerHTML = '<a title="Connect review" href="https://marketplace.atlassian.com/plugins/com.mxgraph.confluence.plugins.diagramly/cloud/reviews" target="_blank">' +
		'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Enjoying draw.io for free? Please help us to a 4 star rating</a>';
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
});

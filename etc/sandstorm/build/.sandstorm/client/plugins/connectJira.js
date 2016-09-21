/**
 * Plugin for embed mode in JIRA Connect.
 */
Draw.loadPlugin(function(ui)
{
	// Changes support link in Help menu
	ui.actions.addAction('support...', function()
	{
		window.open('https://support.draw.io/display/DFJC/draw.io+for+JIRA+Cloud');
	});
	
	// Display footer and alter it
	var td = document.getElementById('geFooterItem2');
	
	if (td != null)
	{
		td.innerHTML = '<a title="Connect review" href="https://marketplace.atlassian.com/plugins/com.mxgraph.jira.plugins.drawio/cloud/reviews" target="_blank">' +
		'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Enjoying your free plugin? Please help us to a 4 star rating</a>';
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

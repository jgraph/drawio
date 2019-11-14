/**
 * Plugin for electron build
 */
Draw.loadPlugin(function(ui)
{
	if (!window.mxIsElectron5)
	{
		alert('You need to update to latest draw.io desktop');
	}
});
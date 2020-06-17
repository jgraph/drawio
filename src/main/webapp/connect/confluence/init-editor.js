var connectUrl = AC.getBaseUrl() + '/atlassian-connect';
var head = document.getElementsByTagName('head')[0];

var script = document.createElement('script');
script.setAttribute('data-options', 'resize:false;margin:false');

// Main
script.onload = function()
{
	// TODO: Try avoid this by using workaround in EditorUi.fileLoaded on line 2200
	//Firefox has a problem with focusing the can be fixed with a chrome dialog
	if(navigator.userAgent.indexOf('Firefox/') >= 0)
	{
		AP.dialog.create(
        {
    		key: 'splashEditor',
    		header: 'draw.io',
            chrome: true,
            width: "50%",
            height: "50%",
        }).on("close", function(flags)
    	{
        	AP.dialog.close();
        	AP.confluence.closeMacroEditor();
		});
		AP.dialog.getButton('submit').hide();
		//Confluence refuse to hide cancel button!!!
		AP.dialog.getButton('cancel').hide();
	}
	else
	{
		AP.dialog.create(
        {
    		key: 'macroEditor',
    		customData: {},
            chrome: false,
            width: "100%",
            height: "100%",
        }).on("close", function(flags)
    	{
        	AP.confluence.closeMacroEditor();
		});
	}
};
script.src = 'https://connect-cdn.atl-paas.net/all.js';
head.appendChild(script);

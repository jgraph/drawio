var connectUrl = AC.getBaseUrl() + '/atlassian-connect';
var head = document.getElementsByTagName('head')[0];

var script = document.createElement('script');
script.setAttribute('data-options', 'resize:false;margin:false');

// Main
script.onload = function()
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
       	AP.dialog.close();
	});
};
script.src = 'https://connect-cdn.atl-paas.net/all.js';
head.appendChild(script);

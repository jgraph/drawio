var AC = {};

AC.getUrlParam = function(param, escape, url){
    try{
    	var url = url || window.location.search;
        var regex = new RegExp(param + '=([^&]+)'),
        data = regex.exec(url)[1];
        // decode URI with plus sign fix.
        return (escape) ? window.decodeURIComponent(data.replace(/\+/g, '%20')) : data;
    } catch (e){
        return undefined;
    }
};

AC.getMetaTag = function(name) {
	return document.getElementsByTagName('meta')[name].getAttribute('content');
};

AC.getMacroData = function(fn) {
	AP.confluence.getMacroData(fn);
}

AC.getBaseUrl = function()
{
	var baseUrl = AC.getUrlParam('xdm_e', true) + AC.getUrlParam('cp', true);
	//Ensure baseUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	//Since we add cp to xdm_e, we had to ensure that there is a slash after the domain. Since if xdm_e is ok, cp can corrupt is such as cp = '.fakedomain.com' such that baseUrl is atlassian.net.fakedomain.com
	if (/^https:\/\/([^\.])+\.jira\.com\//.test(baseUrl + '/') || /^https:\/\/([^\.])+\.atlassian\.net\//.test(baseUrl + '/')) 
	{
		return baseUrl;
	}
	throw 'Invalid baseUrl!';
};

AC.getSiteUrl = function()
{
	var siteUrl = AC.getUrlParam('xdm_e', true);
	//Ensure siteUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	if (/^https:\/\/([^\.])+\.jira\.com$/.test(siteUrl) || /^https:\/\/([^\.])+\.atlassian\.net$/.test(siteUrl)) 
	{
		return siteUrl;
	}
	throw 'Invalid siteUrl!';
};

AP.request({
    type: 'GET',
    url: '/rest/atlassian-connect/1/addons/com.mxgraph.confluence.plugins.diagramly',
    contentType: 'application/json;charset=UTF-8',
    success: function (resp) 
    {
        resp = JSON.parse(resp);
		document.getElementById('drawioLic').innerHTML = resp.license? resp.license.supportEntitlementNumber : 'Unlicensed';
		document.getElementById('drawioVersion').innerHTML = resp.version;
    }
});

window.intercomSettings = {
	app_id: "fz6gxyi6"
};

(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/fz6gxyi6';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();

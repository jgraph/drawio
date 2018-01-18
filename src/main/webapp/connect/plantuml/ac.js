var AC = {};

AC.getUrlParam = function(param, escape, url)
{
	try
	{
		var url = url || window.location.search;
		var regex = new RegExp(param + '=([^&]+)'),
		data = regex.exec(url)[1];
		
		// decode URI with plus sign fix.
		return (escape) ? window.decodeURIComponent(data.replace(/\+/g, '%20')) : data;
    }
	catch (e)
    {
        return undefined;
    }
};

AC.loadDiagram = function (pageId, diagramName, callback)
{
	AP.require('request', function(request)
	{
		request(
		{
			url: '/rest/api/content/' + pageId + '/child/attachment?filename=' + diagramName,
			type: 'GET',
			success: callback
		});
	});
};

AC.saveDiagram = function(pageId, diagramName, xml, callback, newSave, contentType, existHandler) 
{
	var attachment = { fileName : diagramName, contentType : contentType };
	var params = [pageId, attachment, xml ];
	
	loadCallback = function(resp) 
	{
		resp = JSON.parse(resp);
		
		if (resp != null && resp.results != null && resp.results.length > 0)
		{
			if (existHandler != null)
			{
				existHandler();
			}
			else
			{
				alert('Attachment ' + diagramName + ' already exists. Please choose another name.');
			}
		}
		else 
		{
			doSave();
		}
	};
	
	doSave = function() 
	{
		AP.require(['request'], function(request) 
		{
			request(
			{
				url: '/rpc/json-rpc/confluenceservice-v2/addAttachment',
				type: 'POST',
				data: JSON.stringify(params),
				contentType : 'application/json;charset=UTF-8',
				success: callback
			});
		});
		//TODO add attachments via REST API
		 /*var blob = new Blob([xml], {type : contentType});
		 var file = new File([blob], diagramName);
		 
		 var formData = new FormData();
         formData.append("file", file );
         console.log("formData: "+formData.toString());

         var headers = new Object();
         headers["X-Atlassian-Token"] = "nocheck";

         AP.require('request', function (request) {
             request({
                 url: "/rest/api/content/" + pageId + "/child/attachment",
                 type: "POST",
                 data: formData,
                 contentType: "multipart/form-data",
                 headers: headers,
                 success: success,
                 error : error
             });
         });*/
	};
	
	if(newSave) 
	{
		this.loadDiagram(pageId, diagramName, loadCallback);
	}
	else 
	{
		doSave();
	}
};

AC.getMacroData = function(fn)
{
	AP.require('confluence', function(confluence)
	{
		confluence.getMacroData(fn);
	});
}

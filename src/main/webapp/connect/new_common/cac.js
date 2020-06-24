var CAC = {};

//Extend object with all CAC functions
CAC.applyCAC = function(obj)
{
	for (var fn in CAC)
	{
		obj[fn] = CAC[fn];
	}
};

CAC.$ = function(selector, elem)
{
	elem = elem || document;
	return elem.querySelector(selector);
};

CAC.$$ = function(selector, elem)
{
	elem = elem || document;
	return elem.querySelectorAll(selector);
};

CAC.getUrlParam = function(param, escape, url)
{
    try
    {
    	var url = url || window.location.search;

		var result = (new RegExp(param + '=([^&]*)')).exec(url);
		
		if (result != null && result.length > 0)
		{
			// decode URI with plus sign fix.
			return (escape) ? decodeURIComponent(result[1].replace(/\+/g, '%20')) : result[1];
		}
		
		return null;
    }
    catch (e)
    {
        return undefined;
    }
};

CAC.getMetaTag = function(name) 
{
	return document.getElementsByTagName('meta')[name].getAttribute('content');
};

CAC.getBaseUrl = function()
{
	var baseUrl = CAC.getUrlParam('xdm_e', true) + CAC.getUrlParam('cp', true);
	//Ensure baseUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	//Since we add cp to xdm_e, we had to ensure that there is a slash after the domain. Since if xdm_e is ok, cp can corrupt is such as cp = '.fakedomain.com' such that baseUrl is atlassian.net.fakedomain.com
	if (/^https:\/\/([^\.])+\.jira\.com\//.test(baseUrl + '/') || /^https:\/\/([^\.])+\.atlassian\.net\//.test(baseUrl + '/')) 
	{
		return baseUrl;
	}
	throw 'Invalid baseUrl!';
};

CAC.getDocDim = function() 
{
	var body = document.body,
    html = document.documentElement;

	var height = Math.max(body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight);

	var width = Math.max(body.scrollWidth, body.offsetWidth, 
            html.clientWidth, html.scrollWidth, html.offsetWidth);
	
	return {w: width, h: height};
};

CAC.htmlEntities = function(s, newline)
{
	s = String(s || '');
	
	s = s.replace(/&/g,'&amp;'); // 38 26
	s = s.replace(/"/g,'&quot;'); // 34 22
	s = s.replace(/\'/g,'&#39;'); // 39 27
	s = s.replace(/</g,'&lt;'); // 60 3C
	s = s.replace(/>/g,'&gt;'); // 62 3E

	if (newline == null || newline)
	{
		s = s.replace(/\n/g, '&#xa;');
	}
	
	return s;
};

CAC.getCurPageId = function(callback)
{
	AP.navigator.getLocation(function (data)
    {
    	if (data != null && data.context != null)
   		{
    		var draftPage = (data.target == 'contentcreate');
    		var pageId = data.context.contentId;
    		
    		callback(pageId, draftPage);
   		}
    	else
		{
    		alert('Unexpected Error: Cannot get content id or type.');
		}
    });
};

CAC.uploadCachedMxFile = function(fileContent, filename, success, error)
{
	CAC.uploadAttachment(fileContent, filename, 'application/vnd.jgraph.mxfile.cached', 'Diagram Viewer Cached file', success, error)
};

CAC.delOldCachedFiles = function(pageId, filename, timestamp)
{
	CAC.collectAllAttachments(pageId, function(atts)
	{
		for (var i = 0; i < atts.length; i++)
		{
			var cacheFilename = atts[i].title.match(/(\d+)_(.*)/);
			
			if (cacheFilename != null && cacheFilename[2] == filename && cacheFilename[1] != timestamp)
			{
				CAC.deleteAttachment(atts[i].id, CAC.noop, CAC.noop); //ignore deletion errors
			}
		}
	}, CAC.noop);//ignore deletion errors
};

CAC.uploadAttachment = function(fileContent, filename, fileType, comment, success, error)
{
	CAC.getCurPageId(function(pageId, draftPage)
	{
		var attFile = new Blob([fileContent], {type: fileType});
		attFile.name = filename;
		
		var reqData = {file: attFile, minorEdit: true, comment: comment};
		var draft = draftPage ? '?status=draft' : '';
		 
		AP.request({
			type: 'PUT',
			data: reqData,
			url:  '/rest/api/content/'+ pageId + '/child/attachment' + draft,
			contentType: 'multipart/form-data',
			success: success,
			error: error
		});
	});
};

CAC.collectAllAttachments = function(pageId, callback, error)
{
	var start = 0, limit = 200;
	var attachments = [];
	
	function getChunck()
	{
		AP.request({
			type: 'GET',
			url: '/rest/api/content/' + pageId + '/child/attachment?start=' + start + '&limit=' + limit,
			contentType: 'application/json;charset=UTF-8',
			success: function(resp) {
				var resp = JSON.parse(resp);
				
				for (var i = 0; i < resp.results.length; i++)
				{
					attachments.push({
						id: resp.results[i].id,
						title: resp.results[i].title
					});
				}
				
				//Support pageing
				if (resp._links && resp._links.next) 
				{
					start += resp.limit; //Sometimes the limit is changed by the server
					getChunck();
				}
				else
				{
					callback(attachments);
				}
			},
			error: error
		});
	};
	
	getChunck();	
};

CAC.deleteAttachment = function(attId, success, error)
{
	AP.request({
		type: 'DELETE',
		url: '/rest/api/content/' + attId,
		contentType: 'application/json;charset=UTF-8',
		success: success,
		error: error
	});
};

CAC.uploadToJira = function(fileContent, issueId, filename, fileType, success, error)
{
	var attFile = new Blob([fileContent], {type: fileType});
	attFile.name = filename;
	
	var reqData = {file: attFile};

    AP.request(
    {
        url: '/rest/api/2/issue/' + issueId + '/attachments',
        type: 'POST',
		data: reqData,
        contentType: 'multipart/form-data',
        headers: {'X-Atlassian-Token': 'no-check'},
        success: success,
        error: error
    });	
};

CAC.getJiraAttList = function(issueId, success, error)
{
	AP.request({
		url: '/rest/api/2/issue/' + issueId + '?fields=attachment',
		type: 'GET',
		success: function(resp) 
		{
			var respObj = JSON.parse(resp);
			attDiagrams = [];
			
			for (var i = 0; i < respObj.fields.attachment.length; i++)
			{
				attDiagrams.push(respObj.fields.attachment[i]);	
			}

			success(attDiagrams);
		},
		error: error
	});	
};

CAC.noop = function(){};

CAC.importCsv = function(csv, callback)
{
	//Adjust some functions such that it can be instanciated without UI
	EditorUi.prototype.createUi = function(){};
	EditorUi.prototype.addTrees = function(){};
	EditorUi.prototype.updateActionStates = function(){};
	var editorUi = new EditorUi();
	
	editorUi.importCsv(csv, function()
	{
		var csvModel = editorUi.editor.getGraphXml();
		callback(csvModel, mxUtils.getXml(csvModel));
	});
};
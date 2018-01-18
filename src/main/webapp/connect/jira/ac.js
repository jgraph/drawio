var AC = {};

AC.getUrlParam = function(param, escape, url){
    try{
    	var url = url || window.location.search;
        var regex = new RegExp(param + '=([^&]+)'),
        data = regex.exec(url)[1];
        // decode URI with plus sign fix.
        return (escape) ? window.decodeURIComponent(data.replace(/\+/g, '%20')) : data;
    } catch (e){
        return '';
    }
};

AC.getMetaTag = function(name) {
	return document.getElementsByTagName('meta')[name].getAttribute('content');
};

AC.openEditor = function(baseUrl, issueId, diagramName)
{
	var diagramXml = null;
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname; 
	
	var lang = AC.getUrlParam['loc'];
	
	if (lang != null)
	{
		var dash = lang.indexOf('-');
		
		if (dash >= 0)
		{
			lang = lang.substring(0, dash);
		}
	}

	var editor = $('<iframe id="editorFrame" frameborder="0" style="overflow:hidden;height:99.5%;width:100%" height="99%" width="100%">');
	editorUrl = hostUrl + '/?ui=atlas&p=acj&embed=1&modified=unsavedChanges&spin=1&proto=json' + ((lang != null) ? '&lang=' + lang : '');
	editorUrl += (hostUrl == "http://test.draw.io") ? '&https=0&dev=1' : '';
	editorUrl += '&issueId=' + issueId;
	editor.attr('src', editorUrl);
	editor.appendTo('body');
	editor = editor[0];

	var messageListener = function(evt)
	{
		if (typeof window.AC !== 'undefined' && evt.origin == hostUrl)
		{
			var drawMsg = JSON.parse(evt.data);
			
			if(drawMsg.event == 'init')
			{
				if(diagramName == null)
					editor.contentWindow.postMessage(JSON.stringify({action: 'load', xml: ''}), '*');
				else 
				{
					AC.loadDiagram(issueId, diagramName, 
					function(resp) 
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'load', xml: resp}), '*');
					}, 
					function(resp) 
					{
						if(resp.status == 404)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'status', messageKey: 'fileNotFound', modified : false}), '*');
						}
						else 
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'status', messageKey: 'errorLoadingFile', modified : false}), '*');
						}
					});
				}
			} 
			else if (drawMsg.event == 'exit') 
			{
				AP.require('dialog', function(dialog){
					 dialog.close();
				});
			}
			else if (drawMsg.event == 'save')
			{
				// Maintains modified state while editor is open
				editor.contentWindow.postMessage(JSON.stringify({action: 'status', modified: true}), '*');
				diagramXml = drawMsg.xml;
				
				var onSave = function() 
				{
					AP.require(['jira', 'dialog'], function (jira, dialog) {
			            jira.refreshIssuePage();
			            dialog.close();
				    });
				};
				
				var onError = function(resp) 
				{
					// Post to save servlet to log the diagram XML
					var payload = {issueId : issueId, filename : diagramName, xml : diagramXml};
					
					$.ajax({
						url : "/connect/jira/save",
						type : "POST",
						contentType : "application/json; charset=UTF-8",
						data : JSON.stringify(payload)
					});

					var msgKey = null;
					
					if (resp.status != null && resp.status == 403)
					{
						msgKey = 'errorSavingFileForbidden';
						alert('Please see this article - https://support.draw.io/pages/viewpage.action?pageId=12877897');
					}
					else
					{
						msgKey = 'errorSavingFile';
					}
					
					editor.contentWindow.postMessage(JSON.stringify({action: 'status', messageKey: msgKey, modified : true}), '*');
				};
				
				var onErrorNew = function(resp) 
				{
					diagramName = null;
					onError(resp);
				}

				var askName = function(fileExists)
				{
					diagramName = prompt((fileExists) ? 'File exists! Please enter another name' : 'Please name your diagram', diagramName || '');

					if (diagramName != null)
					{
						if (diagramName.length < 3)
						{
							diagramName = null;
							alert('Invalid filename, filename too short');
						}
						else if (/[&\*+=\\;/{}|\":<>\?]/g.test(diagramName))
						{
							diagramName = null;
							alert('Invalid filename, remove special characters    \\ / | : { } < > & + ? = ; * "');
						}
						else
						{
							AC.hasDiagram(issueId, diagramName, function(fileExists) 
							{
								if (fileExists) 
								{
									askName(true);
								}
								else 
								{
									AC.saveDiagram(issueId, diagramName, diagramXml, onSave, onErrorNew);
								}
							});
						}
					}
				};
				
				if (diagramName == null)
				{
					askName(false);
				}
				else
				{
					AC.deleteDiagram(issueId, diagramName, function() 
					{
						AC.saveDiagram(issueId, diagramName, diagramXml, onSave, onError);
					}, onError);
				}
			}
			/*else if (drawMsg.event == 'save') 
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'export', format: 'xmlpng', spinKey: 'saving'}), '*');
			}*/
		}
	};

	window.addEventListener('message', messageListener);
};

AC.loadDiagram = function (issueId, diagramName, success, error) 
{
	function load(diagramId) 
	{
		AP.require('request', function(request) {
			request({
				url: '/secure/attachment/' + diagramId + '/' + diagramName,
				success: success,
				error : error
			});
		});
	};
	
	AC.getDiagramId(issueId, diagramName, load, error); 
	
};

AC.getDiagramId = function(issueId, diagramName, success, error) 
{
	AC.listDiagrams(issueId, function(diagrams) 
	{
		var diagramId = null;
		for(var i=0; i< diagrams.length; i++) 
		{
			if(diagrams[i].filename == diagramName)
			{
				diagramId = diagrams[i].id;
				break;
			}
		} 
		success(diagramId);
		
	}, error);
	
};

AC.saveDiagram = function(issueId, diagramName, xml, success, error) 
{
	var blob = new Blob([xml], {type : 'application/drawio'});
	var file = new File([blob], diagramName, {type : 'application/drawio'});

    var headers = new Object();
    headers["X-Atlassian-Token"] = "nocheck";

    AP.require('request', function (request) {
        request({
            url: "/rest/api/2/issue/" + issueId + "/attachments",
            type: "POST",
            data: {file : file},
            contentType: "multipart/form-data",
            headers: headers,
            success: success,
            error : error
        });
    });
};

AC.deleteDiagram = function(issueId, diagramName, success, error) 
{
	//files creates via server are owned by the "addon_com.mxgraph.jira.plugins.drawio" user, so they can only be deleted by it
	deleteViaServer = function() 
	{
		var payload = {clientKey : AC.getClientKey(), issueId : issueId, filename : diagramName};
		$.ajax({
			url : "/connect/jira/delete",
			type : "POST",
			contentType : "application/json; charset=UTF-8",
			data : JSON.stringify(payload),
			success : success,
			error : error
		});
	};
	
	deleteViaClient = function(attachmentId) 
	{
		AP.require('request', function (request) {
	        request({
	            url: "/rest/api/2/attachment/" + attachmentId,
	            type: "DELETE",
	            success: success,
	            error : error
	        });
	    });
	};
	
	doDelete = function(attachmentId) 
	{
		getMetaSuccess = function(resp) 
		{
			resp = JSON.parse(resp);
			
			if (resp.author.key == "addon_com.mxgraph.jira.plugins.drawio")
			{
				deleteViaServer();
			}
			else
			{
				deleteViaClient(attachmentId);
				
			}
		};
		
		AC.getAttachmentMetaData(attachmentId, getMetaSuccess, error);
	}
	
	AC.getDiagramId(issueId, diagramName, doDelete, error);
};

AC.getAttachmentMetaData = function(attachmentId, success, error) 
{
	AP.require('request', function (request) {
        request({
            url: "/rest/api/2/attachment/" + attachmentId,
            type: "GET",
            success: success,
            error : error
        });
    });
};

AC.getUser = function(success, fail) 
{
	AP.require(['request'], function(request) 
	{
		request({
			url: '/rest/api/2/myself/',
			type: 'GET',
			success: success,
			error: fail
		});
	});
}

/*
 * Lists attachments for a given issue
 */
AC.listDiagrams = function(issueId, success, fail) 
{
	AP.require(['request'], function(request) 
	{
		request({
			url: '/rest/api/2/issue/' + issueId + '?fields=attachment',
			type: 'GET',
			success: function(resp) 
			{
				var respObj = JSON.parse(resp);
				var names = [];
				$.each(respObj.fields.attachment, function(index, value) 
				{
					if(value.mimeType == 'application/drawio')
						names.push({filename : value.filename, id : value.id});
				});
				success(names);
			},
			error: fail
		});
	});
};

AC.hasDiagram = function(issueId, diagramName, success) 
{
	AC.listDiagrams(issueId, function(diagrams)
	{
		var hasDiagram = false;
		for(var i = 0; i < diagrams.length; i++) 
		{
			if(diagrams[i].filename == diagramName) 
			{
				hasDiagram = true;
				break;
			}
		}
		
		success(hasDiagram);
	}, 
	function()
	{
		console.log(arguments);
	});
};

AC.getClientKey = function() 
{
	jwt = AC.getUrlParam('jwt');
	jwtParts = jwt.split('.');
	claims = JSON.parse(atob(jwtParts[1]));
	return claims.iss;
};
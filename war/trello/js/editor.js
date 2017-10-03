(function () 
{
  var t = window.TrelloPowerUp.iframe();

  var fileName = t.arg('name');
  var type = t.arg('type');
  var attId = t.arg('attId');
  var cardId = t.getContext().card;

  var iframe = document.getElementById("editorFrame");
  iframe.setAttribute('src', mxTrelloCommon.editorURL + "?embed=1&tr=1&spin=1&ui=atlas&proto=json&libraries=1");

  window.addEventListener('message', function(evt)
	{
	  if (evt.data.length > 0)
	  {
	    var msg = null;
	
	    try
	    {
	      msg = JSON.parse(evt.data);
	    }
	    catch (e)
	    {
	      // ignore
	    }
	
	    if (msg == null)
	    {
	      // Ignore
	      return;
	    }
	    else if (msg.event == 'init')
	    {
	      iframe.contentWindow.postMessage(JSON.stringify({action: 'load', autosave: 1,
	                              saveAndExit: '1', modified: false, xml: "", title: fileName}), '*');
	
	      if (!attId) 
	      {
	    	  fileName = fileName + '.drawio' + (type == 'xml'? '' : '.' + type);
	          iframe.contentWindow.postMessage(JSON.stringify({action: 'newFile', type: 'T', folderId: cardId, name: fileName}), '*');
	      }
	      else 
	      {
	          iframe.contentWindow.postMessage(JSON.stringify({action: 'loadFile', type: 'T', autosave: 1,
	                                                       file: cardId + '|$|' + attId}), '*');
	      }
	    }
	    else if (msg.event == 'autosave')
	    {
	      iframe.contentWindow.postMessage(JSON.stringify({action: 'status',
	          messageKey: 'allChangesSaved', modified: false}), '*');
	    }
	    else if (msg.event == 'save')
	    {
	      if (msg.exit)
	      {
	        msg.event = 'exit';
	      }
	      else
	      {
	        iframe.contentWindow.postMessage(JSON.stringify({action: 'status',
	          messageKey: 'allChangesSaved', modified: false}), '*');
	      }
	    }
	
	    if (msg.event == 'exit')
	    {
	      t.closeModal();
	    }
	  }
    });
})();
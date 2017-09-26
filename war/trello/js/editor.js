(function () 
{
  var t = window.TrelloPowerUp.iframe();

  var fileName = t.arg('name');                                                               
  var att = t.arg('att');
  var cardId = t.arg('cardId');

  var iframe = document.getElementById("editorFrame");
  var temp = null;
  iframe.setAttribute('src', "https://test-dot-praxis-deck-767.appspot.com/?embed=1&tr=1&spin=1&ui=atlas&proto=json&libraries=1");

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
	      iframe.contentWindow.postMessage(JSON.stringify({action: 'load', autosave: 0,
	                              saveAndExit: '1', modified: 'unsavedChanges', xml: "", title: fileName}), '*');
	
	      if (!att) 
	      {
	          iframe.contentWindow.postMessage(JSON.stringify({action: 'newFile', type: 'T', folderId: cardId, name: fileName}), '*');
	      }
	      else 
	      {
	          iframe.contentWindow.postMessage(JSON.stringify({action: 'loadFile', type: 'T', autosave: 0,
	                                                       file: cardId + '|$|' + att.id}), '*');
	      }
	    }
	    else if (msg.event == 'autosave')
	    {
	      temp = msg.xml;
	    }
	    else if (msg.event == 'save')
	    {
	      temp = msg.xml;
	
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
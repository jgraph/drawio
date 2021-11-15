'use strict';

chrome.runtime.onInstalled.addListener(function() 
{
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() 
  {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostSuffix: '.notion.so'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo) 
{
	let tabId = activeInfo.tabId;
	
	chrome.tabs.get(tabId, tab => {
		if (tab.url && new URL(tab.url).host.indexOf('.notion.so') > 0)
		{
			chrome.storage.local.set({ notionTabId: tabId });
		}
	});
});

chrome.runtime.onConnect.addListener(function(port) 
{
	//Popup messages
	port.onMessage.addListener(function(msg) 
	{
		chrome.storage.local.get(['notionTabId'], ({ notionTabId }) => 
	    {
		  if (notionTabId != null)
		  {
			  try
			  {
				  chrome.tabs.sendMessage(notionTabId, msg, function(resp)
					{
						console.log(resp);
						port.postMessage(resp);
					});
			  }
			  catch(e)
			  {
				  if (e.message.indexOf('disconnected') >= 0)
				  {
					  port.postMessage({msg: 'NotionDisconnected', error: true});
				  }
				  else
				  {
					  port.postMessage({msg: 'Exception', errMsg: e.message, error: true});
				  }
			  }
		  }
		  else
		  {
			  port.postMessage({msg: 'NotionNotFound', error: true, origMsg: msg});
		  }
	    });
	});
});

mxTrelloCommon = {
	editorURL: location.protocol + '//' + location.hostname + '/',
	attFilterFn: function(attachment) 
	{
		// Returns true for files ending with .drawio and an optional extension
		return /.*\.drawio(\.[A-Za-z]*)?$/.test(attachment.name);
	}
};

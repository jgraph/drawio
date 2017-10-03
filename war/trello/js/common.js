mxTrelloCommon = {
	editorURL: "https://test-dot-praxis-deck-767.appspot.com/",
	attFilterFn: function(attachment) 
	{
		var name = attachment.name;
		var drawioSuffix = '.drawio';
		var extPos = name.lastIndexOf('.');
		var drawioPos = name.lastIndexOf(drawioSuffix);
		return drawioPos > -1 && (drawioPos == extPos || extPos - drawioPos == drawioSuffix.length);
	}
};
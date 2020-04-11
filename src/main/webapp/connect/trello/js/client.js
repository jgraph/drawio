/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

TrelloPowerUp
		.initialize({
			'card-buttons' : function(t, options) 
			{
				return [ {
					icon : 'https://www.draw.io/images/drawlogo48-gray.png',
					text : 'draw.io',
					callback : function(t) 
					{
						return t.popup({
							title : 'Create a New Diagram...',
							url : './new.html',
							height : 190
						});
					}
				} ];
			},
			'attachment-sections' : function(t, options) 
			{
				// Claim all png attachment that is created by draw.io
				var claimed = options.entries.filter(mxTrelloCommon.attFilterFn);

				if (claimed && claimed.length > 0) 
				{
					return [ {
						claimed : claimed,
						icon : 'https://www.draw.io/images/drawlogo48-gray.png',
						title : 'draw.io Diagrams',
						content : 
						{
							type : 'iframe',
							url : t.signUrl('./attSection.html', {
								arg: ""
							}),
							height : 230
						}
					} ];
				} 
				else 
				{
					return [];
				}
			},
			'card-badges' : function(t, options) 
			{
				 return t.card('attachments')
				    .get('attachments')
				    .filter(mxTrelloCommon.attFilterFn)
				    .then(function(claimed)
		    		{
						if (claimed && claimed.length > 0) 
						{
							return [{ 
								  text: claimed.length,
								  icon: 'https://www.draw.io/images/drawlogo48-gray.png', 
								  color: 'white' 
							}];
						}
						else
						{
							return [];
						}
		    		});
			}
		});

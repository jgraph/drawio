/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

TrelloPowerUp
		.initialize({
			'card-buttons' : function(t, options) 
			{
				return [ {
					icon : 'https://www.draw.io/images/favicon-32x32.png',
					text : 'draw.io',
					callback : function(t) 
					{
						return t.popup({
							title : 'Create a New Diagram...',
							url : './new.html',
							height : 125
						});
					}
				} ];
			},
			'attachment-sections' : function(t, options) 
			{
				// Claim all png attachment that is created by draw.io
				var claimed = options.entries
						.filter(function(attachment) 
						{
							var drawioSuffix = '.drawio.png';
							return attachment.name.lastIndexOf(drawioSuffix) === attachment.name.length
									- drawioSuffix.length;
						});

				if (claimed && claimed.length > 0) 
				{
					return [ {
						claimed : claimed,
						icon : 'https://www.draw.io/images/favicon-32x32.png',
						title : 'draw.io Diagrams',
						content : 
						{
							type : 'iframe',
							url : t.signUrl('./attSection.html', {
								arg : ""
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
				// Claim all png attachment that is created by draw.io
				var claimed = options.entries
						.filter(function(attachment) 
						{
							var drawioSuffix = '.drawio.png';
							return attachment.name.lastIndexOf(drawioSuffix) === attachment.name.length
									- drawioSuffix.length;
						});

				if (claimed && claimed.length > 0) 
				{
					return [{ 
						  text: 'draw.io (' + claimed.length + ')',
						  icon: 'https://www.draw.io/images/favicon-32x32.png', 
						  color: 'white' 
					}];
				}
			}
		});

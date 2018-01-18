// Resize sensor not needed
GraphViewer.useResizeSensor = false;

var t = window.TrelloPowerUp.iframe();

t.render(function()
{
	var idSep = encodeURIComponent('|$|');
	var ident = 'attachment-thumbnail-details-options-item dark-hover';
	var data = null;
	
	// NOTE: Autosave is enabled to avoid possible data loss due
	// to no event fired before the modal dialog closes
	var getEditFunction = function(att, name)
	{
		return function() 
		{
			var id = t.getContext().card + idSep + att.id;

			t.modal({
				url: './editor.html',
				fullscreen: true,
				title: 'draw.io: ' + name,
				args: {url: mxTrelloCommon.editorURL +
					((location.hostname != 'www.draw.io') ?
						'?dev=1&drawdev=1&embed=1&libraries=1&tr=1&gapi=1&od=1&gh=1&db=1&p=tr' :
						'?embed=1&libraries=1&tr=1&gapi=1&od=1&gh=1&db=1&p=tr') +
					'#T' + id}
	        });
	    }  
	};

	var getPrevFunction = function(prevURL, name)
	{
		return function(evt)
		{
			var source = mxEvent.getSource(evt);
			
			while (source != null)
			{
				if (source.className != null && source.className.
					toString().substring(0, ident.length) == ident)
				{
					return;
				}
				
				source = source.parentNode;
			}
			
			t.modal(
			{
				url: prevURL,
				fullscreen: true,
				title: 'draw.io: ' + name
			});
		}
	};

	t.card('attachments')
		.get('attachments')
		.filter(mxTrelloCommon.attFilterFn)
		.then(function(drawioAtts)
		{
			var content = document.getElementById('content');
			content.innerHTML = "";

			for (var i = 0; i < drawioAtts.length; i++)
			{
				(function(atts)
				{
					var div = document.createElement('div');
					div.className = "attachment-thumbnail";
	
					var attName = atts.name;
	
					//TODO add preview modal on click
					//For PNG and SVG (on supported browsers) show them as images, otherwise, load them inside a lightbox editor [size 300px max for images]
					//Click shows a preview
					var previews = atts.previews;
	
					var prevURL = mxTrelloCommon.editorURL + '?lightbox=1&nav=1&layers=1&highlight=3572b0';
					var fileId = '#T' + t.getContext().card + idSep + atts.id;
					
					if (previews.length > 0)
					{
						//find the best size (max dim is 300px)
						var maxPrev = previews[0];
	
						for (var j = 1; j < previews.length; j++)
						{
							if (previews[j].width <= 350 && previews[j].height <= 260 && maxPrev.width < previews[j].width)
							{
								maxPrev = previews[j];
							}
						}
	
						var imgLink = document.createElement('a');
						imgLink.className = "attachment-thumbnail-preview";
						imgLink.setAttribute('href', 'javascript:void(0);');
						imgLink.setAttribute('title', attName);
	
						imgLink.style.cssText = "background-image: url('" + maxPrev.url + "');background-color: #fcfcfc;";
						div.appendChild(imgLink);
					}
					else
					{
						var id = t.getContext().card + encodeURIComponent('|$|') + atts.id;
						
						var container = document.createElement('div');
						container.style.cssText = 'position:absolute;top:0px;left:0px;width:110px;' +
							'height:80px;border:1px solid transparent;box-sizing:border-box;cursor:pointer;' +
							'background-position:center;background-repeat:no-repeat;background-image:url(/images/spin.gif);';
						div.appendChild(container);
						
						// Does not use iframe for quicker loading and avoiding authorize dialog
						mxUtils.get('/proxy?url=' + encodeURIComponent(atts.url), function(req)
						{
							container.style.backgroundImage = 'none';
	
							if (req.getStatus() >= 200 && req.getStatus() < 300)
							{
								var viewer = new GraphViewer(container, req.getDocumentElement(),
									{highlight: '#3572b0', border: 4, lightbox: false,
									nav: true, 'max-height': 72});
								
								// Adds transparent background
								viewer.graph.view.canvas.ownerSVGElement.style.backgroundColor = 'transparent';
								
								// Undo container resize and center
								container.style.width = '110px';
								container.style.height = '80px';
								var bounds = viewer.graph.getGraphBounds();
								var dx = (110 - bounds.width) / 2 - bounds.x;
								var dy = (80 - bounds.height) / 2 - bounds.y;
								viewer.graph.view.canvas.ownerSVGElement.setAttribute('transform',
									'translate(' + dx + ' ' + dy + ')');
							}
						});
					}

					var prevFn = getPrevFunction(prevURL + fileId, attName);
					mxEvent.addListener(div, 'click', prevFn);
					
					var detailsP = document.createElement('p');
					detailsP.className = "attachment-thumbnail-details";
	
					var nameSpan = document.createElement('span');
					nameSpan.className = "attachment-thumbnail-name";
					nameSpan.innerHTML = attName;
					detailsP.appendChild(nameSpan);
	
					var detailOpt = document.createElement('span');
					detailOpt.className = "u-block quiet attachment-thumbnail-details-title-options";
	
					var addedSpan = document.createElement('span');
					addedSpan.innerHTML = "&nbsp;"; //Add more details about the file here
					detailOpt.appendChild(addedSpan);
					// <span>
					//   Added <span class="date" dt="2017-09-09T13:28:14.099Z" title="September 9, 2017 3:28 PM">an hour ago</span>
					// </span>
					// <span><a class="attachment-thumbnail-details-title-options-item dark-hover js-confirm-delete" href="#">
					//   <span class="attachment-thumbnail-details-options-item-text">Delete</span></a>
					// </span>
					detailsP.appendChild(detailOpt);
	
					var actionsSpan = document.createElement('span');
					actionsSpan.className = "quiet attachment-thumbnail-details-options";
					detailsP.appendChild(actionsSpan);
	
					var downloadLink = document.createElement('a');
					downloadLink.className = "attachment-thumbnail-details-options-item dark-hover";
					downloadLink.setAttribute('href', atts.url);
					downloadLink.setAttribute('target', '_blank');
					downloadLink.setAttribute('download', attName);
					downloadLink.innerHTML = '<span class="icon-sm icon-download"></span> <span class="attachment-thumbnail-details-options-item-text">Download</span>';
					actionsSpan.appendChild(downloadLink);
	
					var editLink = document.createElement('a');
					editLink.className = "attachment-thumbnail-details-options-item dark-hover";
					editLink.setAttribute('href', 'javascript:void(0);');
					editLink.innerHTML = '<span class="icon-sm icon-edit"></span> <span class="attachment-thumbnail-details-options-item-text">Edit</span>';
					editLink.addEventListener("click", getEditFunction(atts, attName));
					actionsSpan.appendChild(editLink);
	
					detailsP.appendChild(actionsSpan);
					div.appendChild(detailsP);
	
					content.appendChild(div);
				})(drawioAtts[i]);
			}
		})
		.then(function()
		{
			return t.sizeTo('#content');
		});
});

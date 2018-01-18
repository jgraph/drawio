(function()
{
	var t = window.TrelloPowerUp.iframe();
	var diagName = document.getElementById("diagName");
	var errorMsg = document.getElementById("errorMsg");
	
	diagName.focus();

	function create(fileName, type, templateId)
	{
		t.closePopup();
		
		t.modal({
	          url: './editor.html',
	          fullscreen: true,
	          title: 'draw.io: ' + fileName,
	          args: {url: mxTrelloCommon.editorURL +
					((location.hostname != 'www.draw.io') ?
						'?dev=1&drawdev=1&embed=1&tr=1&gapi=1&od=1&gh=1&db=1&p=tr' :
						'?embed=1&tr=1&gapi=1&od=1&gh=1&db=1&p=tr') +
					'&filename=' + encodeURIComponent(fileName + '.drawio' + (type == 'xml' ? '' : '.' + type)) +
					'&filetype=' + encodeURIComponent(type) +
					'&card=' + encodeURIComponent(t.getContext().card) +
					((templateId != null) ? '&template=' + encodeURIComponent(templateId) : '')}
	        });
	};

	//Fill the dialog with other attachments
	var select = document.getElementById("otherAtt");
	var importBtn = document.getElementById("importBtn");

	t.card('attachments')
		.get('attachments')
		.then(function(atts)
		{
			var count = 0;
			for (var i = 0; i < atts.length; i++)
			{
				if (!mxTrelloCommon.attFilterFn(atts[i]))
				{
					var opt = document.createElement("option");
					opt.setAttribute('value', atts[i].id);
					opt.innerHTML = atts[i].name;
					select.appendChild(opt);
					count++;
				}
			}

			if (count == 0)
			{
				document.getElementById("importLbl").style.display = "none";
				select.style.display = "none";
				importBtn.style.display = "none";
			}
			
			var newDiagFn = function()
			{
				var name = diagName.value;
				var type = document.getElementById("format").value;
				
				if (name == null || name.length == 0)
				{
					errorMsg.style.display = "";
					errorMsg.innerHTML = 'Diagram name cannot be empty';
					return;
				}
				else
				{
					for (var i = 0; i < atts.length; i++)
					{
						if (atts[i].name == name + '.drawio' + (type == 'xml' ? '' : '.' + type))
						{
							errorMsg.style.display = "";
							errorMsg.innerHTML = 'Diagram already exists';
							return;
						}
					}
				}
				
				create(name, type);
			};

			diagName.addEventListener("keypress", function(e)
			{
				if (e.keyCode == 13)
					newDiagFn();
				else
					errorMsg.style.display = "none";
			});

			document.getElementById("createBtn").addEventListener("click", newDiagFn);
			document.getElementById("createBtn").removeAttribute('disabled');
		})
		.then(function()
		{
			return t.sizeTo('#content');
		});

	importBtn.addEventListener("click", function()
	{
		create(select.options[select.selectedIndex].text, 'xml', select.value);
	});

})();
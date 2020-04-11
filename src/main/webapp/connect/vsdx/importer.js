function convertVSDXtoMX(file, filename, success, error)
{
	function doImport(vsdxFile)
	{
		try
		{
			new com.mxgraph.io.mxVsdxCodec({
				addRemoteServiceSecurityCheck: function() {}
			}).decodeVsdx(vsdxFile, success, null, error);
		}
		catch (e)
		{
			error();
		}
	};
	
	var delayed = function()
	{
		if (typeof mxVsdxCodec === 'undefined')
		{
			if (/(\.v(sd|dx))($|\?)/i.test(filename)) 
			{
				if (VSD_CONVERT_URL != null)
				{
					var formData = new FormData();
					formData.append('file1', file, filename);

					var xhr = new XMLHttpRequest();
					xhr.open('POST', VSD_CONVERT_URL);
					xhr.responseType = 'blob';
					
					xhr.onreadystatechange = function()
					{
						if (xhr.readyState == 4)
						{	
							if (xhr.status >= 200 && xhr.status <= 299)
							{
								doImport(xhr.response);
							}
							else
							{
								error();
							}
						}
					};
					
					xhr.send(formData);
				}
				else
				{
					error();
				}
			}
			else
			{
				doImport(file);
			}
		}
		else
		{
			error();
		}
	};
	
	//Load extensions.min.js lazily
	if (typeof mxVsdxCodec === 'undefined')
	{
		var script = document.createElement('script');
		script.onload = delayed;
		script.src = '/js/extensions.min.js';
		script.setAttribute('type', 'text/javascript');
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(script);
	}
	else
	{
		delayed();
	}
};
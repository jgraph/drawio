/**
 * Plugin for Confluence Cloud to get the license
 */
Draw.loadPlugin(function(ui)
{
	ui.checkConfLicense = function(license, xdm_e, callback)
	{
		//Exclude dev domain
		if (location.host == 'test.draw.io')
		{
			callback(true);
			return;
		}
		
		var licenseValid = true;
		
		if (license != null && xdm_e != null && license == 'none')
		{
			var hostParse = document.createElement('a');
			hostParse.href = xdm_e;
			var hostname = hostParse.hostname;
			
			if (hostname != null)
			{
				var xhr = new XMLHttpRequest();
		
				xhr.onreadystatechange = function()
				{
				    if (xhr.readyState == XMLHttpRequest.DONE)
				    {
						if (xhr.status >= 200 && xhr.status <= 299)
						{
					        var resp = xhr.responseText;
			
							if (resp != null && resp.length > 0)
							{
								var lic = JSON.parse(resp);
								
								if (lic.atlasCloudLic != 'blocked')
								{
									licenseValid = true;
								}
								else
								{
									licenseValid = false;
								}
							}
							else if (resp != null && resp.length == 0)
							{
								// JSON parse fails on empty response
								licenseValid = false;
							}
						}
						
						callback(licenseValid);
				    }
				};
		
				xhr.open('POST', '/license?domain=' + hostname, true);
				xhr.send(null);
			}
			else
			{
				callback(licenseValid);
			}
		}
		else
		{
			callback(licenseValid);
		}
	};
});
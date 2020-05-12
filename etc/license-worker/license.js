/**
 * Copyright (c) 2011-2020, JGraph Ltd
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * @param {Request} request
 */
async function handleRequest(request) 
{
	if (request.method !== 'POST') 
	{
		return new Response('Only POST method is supported', { status: 500 })
	}
	
	let reqBody = await request.body.getReader().read();
	let reqBodyTxt = new TextDecoder("utf-8").decode(reqBody.value);
	let params = new URL('http://dummy.com?' + reqBodyTxt).searchParams;
	let domain = params.get('domain');
	let confLicense = params.get('confLicense');
	let licenseDump = params.get('licenseDump');
	let sParams = new URL(request.url).searchParams;
	
	//Try Query string parameters
	if (domain == null)
	{
		domain = sParams.get('domain');
	}
	
	if (confLicense == null)
	{
		confLicense = sParams.get('confLicense');
	}
	
	if (licenseDump == null)
	{
		licenseDump = sParams.get('licenseDump');
	}
	
	let email = params.get('email');
//	let locale = params.get('lc');
//	let displayName = params.get('ds');
	
	if (email != null)
	{
		let msg = encodeURIComponent(('license:GWE:' + email));
		let url = "https://log.diagrams.net/" + msg;
		fetch(url);
	}
	else if (confLicense != null && domain != null)
	{
		let msg = encodeURIComponent(('license:cc-domain=' + domain + ',confLicense=' + confLicense));
		let url = "https://log.diagrams.net/" + msg;
		fetch(url);
	}
	else if (domain != null)
	{
		let msg = encodeURIComponent(('license:cc-domain=' + domain));
		let url = "https://log.diagrams.net/" + msg;
		fetch(url);
	}
	
	if (licenseDump != null)
	{
		let msg = encodeURIComponent('license:cc-licenseDump=') + licenseDump;
		let url = 'https://log.diagrams.net/' + msg;
		fetch(url);
		
		try
		{
			let licenseContent = decodeURIComponent(licenseDump);
			let obj = JSON.parse(licenseContent);
//			msg = encodeURIComponent(JSON.stringify(obj));
//			url = 'https://log.diagrams.net/license:cc-obj-string' + msg;
//			fetch(url);
			
			if (obj != null && obj.installedDate != null)
			{
				msg = encodeURIComponent('license:cc-installDate:' + obj.installedDate + ',eval:' + obj.license.evaluation + ',active:' + obj.license.active);
				url = 'https://log.diagrams.net/' + msg;
				fetch(url);
				
				if (obj.installedDate.startsWith('2019') && obj.license.active && obj.license.evaluation)
				{
					url = 'https://log.diagrams.net/license:cc-OMGWTFBBQ';
					fetch(url);
				}
			}
		}
		catch (e)
		{
			let msg = encodeURIComponent('license:cc-error=') + e;
			let url = 'https://log.diagrams.net/' + msg;
			fetch(url);
		}
	}
	
	if (domain != null)
	{
		try
		{
			let licenseJson = await getLicense(domain);
			
			if (licenseJson == null)
			{
				return new Response(null, { status: 204 });
			}
			else
			{
				return new Response(licenseJson, {
					status: 200,
				    headers: {
					    'Content-Type': 'application/json; charset=utf-8'
				    }
				});
			}
		}
		catch (e)
		{
			return new Response('INTERNAL_SERVER_ERROR', { status: 500 });
		}
	}
	else
	{
		return new Response('HTTP_BAD_REQUEST', { status: 400 });
	}	
}

function formatDate(date)
{
	let m = date.getMonth() + 1;
	let d = date.getDate();
	return date.getFullYear() + '-' + (m < 10? '0' + m : m) + '-' + (d < 10? '0' + d : d);
}

async function getLicense(domain)
{
	// Returns test licences
	if (domain == 'valid-example.test')
	{
		let d = new Date();
		d.setDate(d.getDate() + 120);

		return '{"expiry": "' + formatDate(d) + '"}';
	}
	else if (domain == 'expire-example.test')
	{
		let d = new Date();
		d.setDate(d.getDate() + 30);

		return '{"expiry": "' + formatDate(d) + '"}';
	}
	else if (domain == 'expired-example.test')
	{
		let d = new Date();
		d.setDate(d.getDate() - 10);

		return '{"expiry": "' + formatDate(d) + '"}';
	}
	else if (domain == 'drawio.atlassian.net')
	{
		return '{"atlasCloudLic": "expert"}';
	}

	// LATER: Check email first then domain
	var val = await DRAWIO_LICENSE.get(domain, 'json');
	return val? val.json : null;
}
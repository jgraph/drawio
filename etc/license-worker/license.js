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
//	let email = params.get('email');
//	let locale = params.get('lc');
//	let displayName = params.get('ds');
	
	//TODO Add logging if needed
//	if (email != null)
//	{
//		String msg = "GWE:" + email;
//		msg += (displayName == null) ? "" : ",NAME:" + displayName;
//		msg += (locale == null) ? "" : ",LOCALE:" + locale;
//		log.log(Level.CONFIG, msg);
//	}
	
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
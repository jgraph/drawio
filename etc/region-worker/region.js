/**
 * Copyright (c) 2011-2021, JGraph Ltd
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

var regionMapping = {
	us: {
		viewer: 'https://viewer.diagrams.net',
		export: 'https://convert.diagrams.net/node/export',
		plant: 'https://plant-aws.diagrams.net',
		vsd: 'https://convert.diagrams.net/VsdConverter/api/converter',
		emf: 'https://convert.diagrams.net/emf2png/convertEMF',
		cach: 'https://app.diagrams.net/cache',
		save: 'https://app.diagrams.net/save',
		import: 'https://app.diagrams.net/import',
		proxy: 'https://app.diagrams.net/proxy'
	},
	eu: {
		viewer: 'https://viewer.diagrams.net',
		export: 'https://convert.diagrams.net/node/export',
		plant: 'https://plant-aws.diagrams.net',
		vsd: 'https://convert.diagrams.net/VsdConverter/api/converter',
		emf: 'https://convert.diagrams.net/emf2png/convertEMF',
		cach: 'https://app.diagrams.net/cache',
		save: 'https://app.diagrams.net/save',
		import: 'https://app.diagrams.net/import',
		proxy: 'https://app.diagrams.net/proxy'
	}
}

async function handleRequest(event) 
{
	let request = event.request;
	
	let url = new URL(request.url);
	let ref = request.headers.get('referer');
	let path = url.pathname.split('-');
	
	if (isAllowedDomain(ref) && regionMapping[path[2]] != null && 
			regionMapping[path[2]][path[1]] != null)
	{
		try
		{
			let service = regionMapping[path[2]][path[1]];
			
			return await fetch(service + url.search, request);
		}
		catch(e)
		{
			event.waitUntil(log('SEVERE', 'region request failed with error ' + e.message, url.pathname, ref));
			return new Response('INTERNAL_SERVER_ERROR', { status: 500 });			
		}
	}
	else
	{
		event.waitUntil(log('SEVERE', 'region request from unknown host', url.pathname));
		return new Response('HTTP_BAD_REQUEST', { status: 400 });
	}
}

function isAllowedDomain(referer)
{
	return referer != null && 
			(new RegExp("https?://([a-z0-9,-]+[.])*draw[.]io/.*").test(referer.toLowerCase()) ||
			 new RegExp("https?://([a-z0-9,-]+[.])*diagrams[.]net/.*").test(referer.toLowerCase()));
}

function log(level, msg, url, ref) 
{
  return fetch('https://log.diagrams.net/images/1x1.png?src=REGION-WORKER&data=' + encodeURIComponent(level + ', ' + msg + ': url='
			+ ((url != null) ? url : '[null]')
			+ ', referer=' + ((ref != null) ? ref : '[null]')));
}
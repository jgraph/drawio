// https://scotthelme.co.uk/security-headers-cloudflare-worker/

let securityHeaders =
{
	"Content-Security-Policy" : "default-src 'self'; script-src https://aui-cdn.atlassian.com https://connect-cdn.atl-paas.net https://ajax.googleapis.com 'self' https://storage.googleapis.com https://apis.google.com https://*.pusher.com https://code.jquery.com https://www.dropbox.com https://api.trello.com 'sha256-JqdgAC+ydIDMtmQclZEqgbw94J4IeABIfXAxwEJGDJs=' 'sha256-4Dg3/NrB8tLC7TUSCbrtUDWD/J6bSLka01GHn+qtNZ0='; connect-src 'self' https://*.draw.io https://*.diagrams.net https://*.googleapis.com wss://*.pusher.com https://*.pusher.com https://api.github.com https://raw.githubusercontent.com https://gitlab.com https://graph.microsoft.com https://*.sharepoint.com https://*.1drv.com https://*.dropboxapi.com https://api.trello.com https://*.google.com https://fonts.gstatic.com https://fonts.googleapis.com; img-src * data:; media-src * data:; font-src * about:; frame-src https://www.lucidchart.com https://app.lucidchart.com 'self' https://www.draw.io https://*.google.com; style-src https://aui-cdn.atlassian.com https://*.atlassian.net 'self' 'unsafe-inline' https://fonts.googleapis.com;",
	"X-XSS-Protection" : "1; mode=block",
	"Feature-Policy" : "accelerometer 'none'; ambient-light-sensor 'none'; battery 'none'; camera 'none'; display-capture 'none'; document-domain 'none; encrypted-media 'none'; fullscreen 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; midi 'none'; navigation-override 'none'; payment 'none'; picture-in-picture 'none'; usb 'none'; wake-lock 'none'; xr-spatial-tracking 'none';"
}

addEventListener('fetch', event =>
{
	event.respondWith(addHeaders(event.request))
})

async function addHeaders(req)
{
	let response = await fetch(req)
	let newHdrs = new Headers(response.headers)

	if (newHdrs.has("Content-Type") && !newHdrs.get("Content-Type").includes("text/html"))
	{
        return new Response(response.body ,
        {
            status: response.status,
            statusText: response.statusText,
            headers: newHdrs
        })
	}

	Object.keys(securityHeaders).map(function(name, index)
	{
		newHdrs.set(name, securityHeaders[name]);
	})

	return new Response(response.body ,
	{
		status: response.status,
		statusText: response.statusText,
		headers: newHdrs
	})
}
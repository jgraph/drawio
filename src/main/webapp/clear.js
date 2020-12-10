try
{
	write('Clearing Cache...');

	function write(text)
	{
		document.body.appendChild(document.createTextNode(text));
		document.body.appendChild(document.createElement('br'));
	};

	navigator.serviceWorker.getRegistrations().then(function(registrations)
	{
		if (registrations != null && registrations.length > 0)
		{
			for (var i = 0; i < registrations.length; i++)
			{
				registrations[i].unregister();
			}

			write('Done');
		}
		else
		{
			write('OK');
		}
	});
}
catch (e)
{
	write('Error: ' + e.message);
}

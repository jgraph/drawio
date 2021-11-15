(function()
{
	var svg = '<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
		'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="16px" height="16px" viewBox="-0.5 -0.5 16 16" content="&lt;mxfile host=&quot;app.diagrams.net&quot; modified=&quot;2021-10-22T10:07:56.551Z&quot; agent=&quot;5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36&quot; etag=&quot;0jxz5d0kbRKOqK62l998&quot; version=&quot;15.5.6&quot;&gt;&lt;diagram id=&quot;QB-tHsTPjBIoVIsD2LTZ&quot; name=&quot;Page-1&quot;&gt;ddHBEoIgEADQr+GuMGWezerSyUNnRjZhBl0GabS+Ph0wZaoTy9tl2QHCinY8W27kFQVoQhMxEnYklKa7LJmWWZ5BkjxIY5XwtoFKvWApDPpQAvpgnhyidsrEWGPXQe0i49biEJfdUYsIDG8gGmOGquYavspuSjjp9UCz1S+gGrncnO5zn2n5Uhwa95ILHDbESsIKi+h81I4F6Pn14nc5/cl+BrPQuR8HpmDtPW2iL2LlGw==&lt;/diagram&gt;&lt;/mxfile&gt;" style="background-color: rgb(255, 255, 255);"><defs><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Architects+Daughter);&#xa;</style></defs><g/></svg>';
	var port = chrome.runtime.connect({name: 'popup'});
	var button = document.getElementById('insertDiagram');
	var prev = button.innerHTML;
	
	button.onclick = function()
	{
		button.setAttribute('disabled', 'disabled');
		button.innerHTML = 'Please wait...';
		port.postMessage({msg: 'insertDiagram', filename: 'Diagram.drawio.svg', data: svg});
	};

	port.onMessage.addListener(function(msg)
	{
		try
		{
			switch(msg.msg)
			{
			case 'insertDiagram':
				window.setTimeout(function()
				{
					button.removeAttribute('disabled');
					button.innerHTML = prev;
				}, 1500);
			break;
			}
		}
		catch (e)
		{
			button.removeAttribute('disabled');
			button.innerHTML = prev;
			alert(e.message);
		}
	});

})();

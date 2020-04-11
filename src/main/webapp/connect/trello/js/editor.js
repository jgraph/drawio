(function () {
  var t = window.TrelloPowerUp.iframe();
  var url = t.arg('url');

  var iframe = document.getElementById("editorFrame");
  iframe.setAttribute('src', url);

  // Only needed to invoke closeModal via embed button in toolbar
  // and to receive messages from iframe (cannot recv from t.modal)
  window.addEventListener('message', function(evt)
  {
		if (evt.data.length > 0)
		{
			try
			{
				var msg = JSON.parse(evt.data);
	
				if (msg != null && msg.event == 'exit')
				{
					t.closeModal();
				}
			}
			catch (e)
			{
				// ignore
			}
		}
  });
})();
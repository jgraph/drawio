(function () 
{
  var t = window.TrelloPowerUp.iframe();
  
  var diagName = document.getElementById("diagName");
  var errorMsg = document.getElementById("errorMsg");
  diagName.focus();
  
  var newDiagFn = function() 
  {
    var name = diagName.value;
    if (name == null || name.length == 0) {
    	errorMsg.style.display = "";
    	return;
    }
    var type = document.getElementById("format").value;
    t.modal({
      url: './editor.html',
      fullscreen: true,
      args: {name: name, type: type}
    });
  };
  
  diagName.addEventListener("keypress", function(e) 
  {
    if (e.keyCode == 13)
        newDiagFn();
    else
    	errorMsg.style.display = "none";
  });
  
  document.getElementById("createBtn").addEventListener("click", newDiagFn);
  
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
  })
  .then(function()
  {
	  return t.sizeTo('#content');
  });
  
  importBtn.addEventListener("click", function()
  {
	  t.modal({
	      url: './editor.html',
	      fullscreen: true,
	      args: {attId: select.value, name: select.options[select.selectedIndex].text}
	    });
  });
  
})();
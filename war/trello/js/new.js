(function () 
{
  var t = window.TrelloPowerUp.iframe();
  
  var diagName = document.getElementById("diagName");
  diagName.focus();
  
  var newDiagFn = function() 
  {
    var name = diagName.value;
    t.card('id')
      .then(function (card) 
	  {
        t.modal({
          url: './editor.html',
          fullscreen: true,
          args: {cardId: card.id, name: name}
        });
      });
  }
  
  diagName.addEventListener("keypress", function(e) 
  {
    if (e.keyCode == 13)
        newDiagFn();
  });
  
  document.getElementById("createBtn").addEventListener("click", newDiagFn);
})();
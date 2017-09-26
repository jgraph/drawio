var t = window.TrelloPowerUp.iframe();

t.render(function()
{
  var getEditFunction = function(att, name) 
  {
    return function() 
    {
      t.card('id')
      .then(function (card) 
	  {
        t.modal({
          url: './editor.html',
          fullscreen: true,
          args: {cardId: card.id, att: att, name: name}
        });
      });
    }    
  };

  t.card('attachments')
  .get('attachments')
  .filter(function(attachment)
  {
      var drawioSuffix = '.drawio.png';
      return attachment.name.lastIndexOf(drawioSuffix) === attachment.name.length - drawioSuffix.length;
  })
  .then(function(drawioAtts)
  {
    var content = document.getElementById('content');
    content.innerHTML = "";
    
    for (var i=0; i < drawioAtts.length; i++)
    {
      var div = document.createElement('div');
      div.className = "attachment-thumbnail";

      var attName = drawioAtts[i].name.replace(".drawio.png", "");
      
      var imgLink = document.createElement('a');
      imgLink.className = "attachment-thumbnail-preview";
      imgLink.setAttribute('href', 'javascript:void(0);');
      imgLink.setAttribute('title', attName);
      imgLink.style.cssText = "background-image: url('"+ drawioAtts[i].url +"');background-color: #fcfcfc;"; //trello is using the original file instead of previews!
      div.appendChild(imgLink);

      var detailsP = document.createElement('p');
      detailsP.className = "attachment-thumbnail-details";

      var nameSpan = document.createElement('span');
      nameSpan.className = "attachment-thumbnail-name";
      nameSpan.innerHTML = attName;
      detailsP.appendChild(nameSpan);

       var detailOpt = document.createElement('span');
       detailOpt.className = "u-block quiet attachment-thumbnail-details-title-options";

       var addedSpan = document.createElement('span');
       addedSpan.innerHTML = "&nbsp;"; //Add more details about the file here
       detailOpt.appendChild(addedSpan);
                // <span>
                //   Added <span class="date" dt="2017-09-09T13:28:14.099Z" title="September 9, 2017 3:28 PM">an hour ago</span>
                // </span>
                // <span><a class="attachment-thumbnail-details-title-options-item dark-hover js-confirm-delete" href="#">
                //   <span class="attachment-thumbnail-details-options-item-text">Delete</span></a>
                // </span>
      detailsP.appendChild(detailOpt);

      var actionsSpan = document.createElement('span');
      actionsSpan.className = "quiet attachment-thumbnail-details-options";
      detailsP.appendChild(actionsSpan);

      var downloadLink = document.createElement('a');
      downloadLink.className = "attachment-thumbnail-details-options-item dark-hover";
      downloadLink.setAttribute('href', drawioAtts[i].url);
      downloadLink.setAttribute('target', '_blank');
      downloadLink.setAttribute('download', attName);
      downloadLink.innerHTML = '<span class="icon-sm icon-download"></span> <span class="attachment-thumbnail-details-options-item-text">Download</span>';
      actionsSpan.appendChild(downloadLink);

      var editLink = document.createElement('a');
      editLink.className = "attachment-thumbnail-details-options-item dark-hover";
      editLink.setAttribute('href', 'javascript:void(0);');
      editLink.innerHTML = '<span class="icon-sm icon-edit"></span> <span class="attachment-thumbnail-details-options-item-text">Edit</span>';
      editLink.addEventListener("click", getEditFunction(drawioAtts[i], attName));
      actionsSpan.appendChild(editLink);

      detailsP.appendChild(actionsSpan);
      div.appendChild(detailsP);
      
      content.appendChild(div);
    }
  })
  .then(function()
  {
    return t.sizeTo('#content');
  });
});
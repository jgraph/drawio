var t = window.TrelloPowerUp.iframe();

t.render(function()
{
  var getEditFunction = function(att, name) 
  {
    return function() 
    {
        t.modal({
          url: './editor.html',
          fullscreen: true,
          args: {attId: att.id, name: name},
          title: 'draw.io: ' + name,
          callback: function()
          {
        	  //TODO find a way to catch close event before destroying the editor such that we can save
        	  console.log("Closed!!!!!");  
          }
        });
    }    
  };

  var getPrevFunction = function(prevURL, name) 
  {
    return function() 
    {
        t.modal({
          url: prevURL,
          fullscreen: true,
          title: 'draw.io: ' + name
        });
    }    
  };

  var idSep = encodeURIComponent('|$|');
  
  t.card('attachments')
  .get('attachments')
  .filter(mxTrelloCommon.attFilterFn)
  .then(function(drawioAtts)
  {
    var content = document.getElementById('content');
    content.innerHTML = "";
    
    for (var i=0; i < drawioAtts.length; i++)
    {
      var div = document.createElement('div');
      div.className = "attachment-thumbnail";

      var attName = drawioAtts[i].name;
      
      //TODO add preview modal on click
      //For PNG and SVG (on supported browsers) show them as images, otherwise, load them inside a lightbox editor [size 300px max for images]
      //Click shows a preview
      var previews = drawioAtts[i].previews;
      
	  var prevURL = mxTrelloCommon.editorURL + '?lightbox=1';
	  var fileId = '#T' + t.getContext().card + idSep + drawioAtts[i].id;
	  var prevFn = getPrevFunction(prevURL + fileId, attName);
      
      if (previews.length > 0)
	  {
    	  //find the best size (max dim is 300px)
    	  var maxPrev = previews[0];
    	  for (var j = 1; j < previews.length; j++)
		  {
    		  if (previews[j].width <= 350 && previews[j].height <= 260 && maxPrev.width < previews[j].width)
			  {
    			  maxPrev = previews[j];
			  }
		  }
    	  var imgLink = document.createElement('a');
          imgLink.className = "attachment-thumbnail-preview";
          imgLink.setAttribute('href', 'javascript:void(0);');
          imgLink.setAttribute('title', attName);
          
          imgLink.style.cssText = "background-image: url('"+ maxPrev.url +"');background-color: #fcfcfc;";
          imgLink.addEventListener("click", prevFn);
          div.appendChild(imgLink);
	  }
      else
      {
    	  var prevFrm = document.createElement('iframe');
    	  prevFrm.className = "attachment-thumbnail-preview";
    	  prevFrm.setAttribute('src', prevURL + '&toolbar=0&border=0' + fileId);
          
    	  //prevFrm.style.cssText = "width:110px;height:80px";
    	  prevFrm.width = 110;
    	  prevFrm.height = 80;
    	  prevFrm.addEventListener("click", prevFn);
          div.appendChild(prevFrm);
      }

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

      var prevLink = document.createElement('a');
      prevLink.className = "attachment-thumbnail-details-options-item dark-hover";
      prevLink.setAttribute('href', 'javascript:void(0);');
      prevLink.innerHTML = '<span class="icon-sm icon-edit"></span> <span class="attachment-thumbnail-details-options-item-text">Preview</span>';
      prevLink.addEventListener("click", prevFn);
      actionsSpan.appendChild(prevLink);
      
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
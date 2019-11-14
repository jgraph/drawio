/**
 * Draw.io Diagrams Sheets add-on v1.0
 * Copyright (c) 2019, JGraph Ltd
 */
var EXPORT_URL = "https://exp.draw.io/ImageExport4/export";
var DRAW_URL = "https://www.draw.io/";

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 */
function onOpen()
{
  SpreadsheetApp.getUi().createAddonMenu()
      .addItem("Insert Diagrams...", "insertDiagrams")
      .addSeparator()
      .addItem("Update Current Sheet", "updateCurrent")
      .addItem("Update All Sheets", "updateAll")
      .addSeparator()
      .addItem("New Diagram...", "newDiagram")
      .addToUi();
  
  //We cannot get selected image yet! So we cannot do update/edit selected
}

/**
 * Runs when the add-on is installed.
 */
function onInstall()
{
  onOpen();
}

/**
 * Gets the user's OAuth 2.0 access token so that it can be passed to Picker.
 * This technique keeps Picker from needing to show its own authorization
 * dialog, but is only possible if the OAuth scope that Picker needs is
 * available in Apps Script. In this case, the function includes an unused call
 * to a DriveApp method to ensure that Apps Script requests access to all files
 * in the user's Drive.
 *
 * @return {string} The user's OAuth 2.0 access token.
 */
function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}

/**
 * Shows a picker and lets the user select multiple diagrams to insert.
 */
function insertDiagrams()
{
  var html = HtmlService.createHtmlOutputFromFile('Picker.html')
      .setWidth(620).setHeight(440)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, 'Select draw.io Diagrams:');
}

function refreshSheet()
{
  var cur = SpreadsheetApp.getActiveSheet();
  var dummy = SpreadsheetApp.getActive().insertSheet("Working...");
  SpreadsheetApp.setActiveSheet(dummy);
  SpreadsheetApp.flush();
  SpreadsheetApp.setActiveSheet(cur, true);
  SpreadsheetApp.getActive().deleteSheet(dummy);
}

/**
 * Inserts an image for the given diagram.
 */
function pickerHandler(items)
{
  if (items != null && items.length > 0)
  {
      var errors = [];

      var sheet = SpreadsheetApp.getActiveSheet();
      var curCell = sheet.getSelection().getCurrentCell();
      var col = 1, row = 1;

      if (curCell != null)
      {
          col = curCell.getColumn();
          row = curCell.getRow();
      }

      var step = 1;
    
      for (var i = 0; i < items.length; i++)
      {
        try
        {
          var ins = insertDiagram(items[i].id, items[i].page, col, row); 
          
          if (ins != null)
          { 
            col = col + step;
            row = row + step;
          }
	      else
	      {
	    	errors.push("- " + items[i].name + ": Unknown error");
	      }
        }
        catch (e)
        {
          errors.push("- " + items[i].name + ": " + e.message);
        }
      }
    
      // Shows message only in case of errors
      if (errors.length > 0)
      {
        var msg = "";

        if (errors.length > 0)
        {
          msg += errors.length + " insert" + ((errors.length > 1) ? "s" : "") + " failed:\n";
        }
        
        msg += errors.join("\n");
        SpreadsheetApp.getUi().alert(msg);
      }
    
      refreshSheet();
  }
}

/**
 * Inserts the given diagram at the given position.
 */
function insertDiagram(id, page, col, row)
{
  var result = fetchImage(id, page, 'auto'); //We should set scale to 1 as with 'auto' we cannot scale it back (see below) 
  
  var blob = result[0];
  var w = result[1];
  var h = result[2];
  var s = result[3] < 1? 1: result[3];
  var img = null;
  
  if (blob != null)
  {
      img = SpreadsheetApp.getActiveSheet().insertImage(blob, col, row);
      //Setting width/height force the image to disappear, and a refresh is needed!
      img.setWidth( w / s );
	  img.setHeight( h / s );
      var link = createLink(id, page, result[4], 'auto');
	  img.setAltTextDescription(link);
  }
  else
  {
    throw new Error("Invalid image " + id);
  }
  
  return img;
}

/**
 * Get draw.io diagrams images in a given sheet
 */
function getSheetDrawioDiagrams(sheet)
{
  var allImages = sheet.getImages();
  var drawioImages = [];
  
  for (var i = 0; i < allImages.length; i++)
  {
      if (isValidLink(allImages[i].getAltTextDescription()))
      {
          drawioImages.push(allImages[i]);
      }
  }
  
  return drawioImages;
}

/**
 * Updates the current sheet diagrams in-place.
 */
function updateCurrent()
{
  var drawioImages = getSheetDrawioDiagrams(SpreadsheetApp.getActiveSheet());
  
  if (drawioImages.length > 0)
  {
      updateElements(drawioImages);
  }
  else
  {
      SpreadsheetApp.getUi().alert("No diagrams found in current sheet");
  }
}

/**
 * Updates all diagrams in the document.
 */
function updateAll()
{
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  
  var drawioImages = [];
  
  for (var i = 0; i < sheets.length; i++)
  {
      var imgs = getSheetDrawioDiagrams(sheets[i]);
      drawioImages.push.apply(drawioImages, imgs);
  }

  updateElements(drawioImages);
}

/**
 * Updates all given diagrams.
 */
function updateElements(elts)
{
  if (elts != null)
  {
    var updated = 0;
    var errors = [];
    
    for (var i = 0; i < elts.length; i++)
    {
      try
      {
        var upd = updateElement(elts[i]); 
      
        if (upd != null)
        {
          updated++;
        }
        else
        {
          errors.push("- Unknown Error");
        }
      }
      catch (e)
      {
        errors.push("- " + e.message);
      }
    }
    
    // Shows status in case of errors or multiple updates
    if (errors.length > 0 || updated > 0)
    {
      var msg = "";
      
      if (updated > 0)
      {
        msg += updated + " diagram" + ((updated > 1) ? "s" : "") + " updated\n";
        refreshSheet();
      }
      
      if (errors.length > 0)
      {
        msg += errors.length + " update" + ((errors.length > 1) ? "s" : "") + " failed:\n";
      }
      
      msg += errors.join("\n");
      SpreadsheetApp.getUi().alert(msg);
    }
  }
}

/**
 * Returns true if the given URL points to draw.io
 */
function createLink(id, page, pageId, scale)
{
  var params = [];
  
  if (pageId != null)
  {
  	params.push('page-id=' + pageId);
  }
  else if (page != null && page != "0")
  {
    params.push('page=' + page);
  }
  
  params.push('scale=' + (scale || '1'));
  
  return DRAW_URL + ((params.length > 0) ? "?" + params.join("&") : "") + "#G" + id;
}

/**
 * Returns true if the given URL points to draw.io
 */
function isValidLink(url)
{
  return url != null && (url.substring(0, DRAW_URL.length) == DRAW_URL || url.substring(0, 22) == "https://drive.draw.io/");
}

/**
 * Returns the diagram ID for the given URL.
 */
function getDiagramId(url)
{
  return url.substring(url.lastIndexOf("#G") + 2);
}

/**
 * Returns the diagram ID for the given URL.
 */
function getUrlParams(url)
{
  var result = {};
  var idx = url.indexOf("?");
  
  if (idx > 0)
  {
    var idx2 = url.indexOf("#", idx + 1);
    
    if (idx2 < 0)
    {
      idx2 = url.length;
    }
    
    if (idx2 > idx)
    {
      var search = url.substring(idx + 1, idx2);
      var tokens = search.split("&");
      
      for (var i = 0; i < tokens.length; i++)
      {
         var idx3 = tokens[i].indexOf('=');
        
         if (idx3 > 0)
         {
           result[tokens[i].substring(0, idx3)] = tokens[i].substring(idx3 + 1);
         }
      }
    }
  }
  
  return result;
}

/**
 * Updates the diagram in the given inline image and returns the new inline image.
 */
function updateElement(elt)
{
  var result = null;
  var url = elt.getAltTextDescription();
  var id = getDiagramId(url);
  var params = getUrlParams(url);
  
  if (id != null && id.length > 0)
  {
    result = updateDiagram(id, params["page"], params["scale"] || 1, elt, params["page-id"]);
  }
  else
  {
    // commenting this out as well - invalid link might indicate image is not coming from draw.io
    // throw new Error("Invalid link " + url);
  }
  
  return result;
}

/**
 * Updates the diagram in the given inline image and returns the new inline image.
 */
function updateDiagram(id, page, scale, elt, pageId)
{
  var img = null;
  var result = fetchImage(id, page, scale, pageId);
  
  var isOK = false;
  
  if (result != null) 
  {
    var blob = result[0];
    var w = result[1];
    var h = result[2];
    var s = result[3] < 1? 1: result[3];
    
    if (blob != null)
    {
      isOK = true;

      // replace image with the same link
      var img = elt.replace(blob);
      img.setWidth( w / s );
	  img.setHeight( h / s );
      var link = createLink(id, page, result[4], scale);
      img.setAltTextDescription(link);
    }
  }
  if (!isOK)
  {
    throw new Error("Invalid image " + id);
  }
  
  return img;
}

/**
 * Fetches the diagram for the given document ID.
 */
function fetchImage(id, page, scale, pageId)
{
    var file = DriveApp.getFileById(id);

    if (file != null && file.getSize() > 0)
    {
    	var isPng = file.getMimeType() == "image/png";
        
        var fileData = isPng? Utilities.base64Encode(file.getBlob().getBytes()) : encodeURIComponent(file.getBlob().getDataAsString());
      
    	var data = {
		  "format": "png",
          "scale": scale || "1",
		  "xml": fileData,
		  "extras": "{\"isPng\": " + isPng + ", \"isGoogleApp\": true, \"isGoogleSheet\": true}"
		};
    
    	if (pageId != null)
		{
			data.pageId = pageId;
		}
		else
		{
			data.from = page || "0";
		}
    
	    var response = UrlFetchApp.fetch(EXPORT_URL,
	    {
		  "method": "post",
		  "payload": data
		});
      
      var headers = response.getHeaders();

      return [response.getBlob(), headers["content-ex-width"] || 0, headers["content-ex-height"] || 0, headers["content-scale"] || 1, headers["content-page-id"]];
    }
    else
    {
    	// Returns an empty, transparent 1x1 PNG image as a placeholder
    	return [Utilities.newBlob(Utilities.base64Decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNg+M9QDwADgQF/e5IkGQAAAABJRU5ErkJggg=="), "image/png")];
    }
}

/**
 * Creates a new diagram.
 */
function newDiagram()
{
  openUrl('https://www.draw.io/?mode=google');
}

/**
 * Open a URL in a new tab.
 */
function openUrl(url)
{
  var html = HtmlService.createHtmlOutput('<html><script>'
  +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
  +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +'close();'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
  +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
  +'</html>')
  .setWidth(90).setHeight(1);
  SpreadsheetApp.getUi().showModalDialog(html, "Opening...");
}

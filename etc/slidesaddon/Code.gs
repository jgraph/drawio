/**
 * Draw.io Diagrams Docs add-on v1.9
 * Copyright (c) 2018, JGraph Ltd
 */
var EXPORT_URL = "https://exp.draw.io/ImageExport4/export";
var DRAW_URL = "https://www.draw.io/";
var SCALING_VALUE = 0.8; // Google Docs seem to be downscaling all images by this amount

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 */
function onOpen()
{
  SlidesApp.getUi().createAddonMenu()
      .addItem("Insert Diagrams", "insertDiagrams")
      .addItem("Update Selected", "updateSelected")
      .addItem("Update All", "updateAll")
      .addToUi();
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
  SlidesApp.getUi().showModalDialog(html, 'Select draw.io Diagrams');
}

/**
 * Inserts an image for the given diagram.
 */
function pickerHandler(items)
{
  var app = UiApp.getActiveApplication();
  
  // Delay after closing the picker used to show spinner on client-side
  app.close();
  
  if (items != null && items.length > 0)
  {
      var inserted = 0;
      var errors = [];
    
      // if there are selected items in the slides, assume they are going to be replaced
      // by the newly inserted images
      var selectionCoordinates = getSelectionCoordinates();
      var offsetX = selectionCoordinates[0];
      var offsetY = selectionCoordinates[1];
    
      deleteSelectedElements();
    
      var step = 10;
    
      for (var i = 0; i < items.length; i++)
      {
        try
        {
          if (insertDiagram(items[i].id, items[i].page, offsetX, offsetY) != null)
          { 
            inserted++;
            offsetX = offsetX + step;
            offsetY = offsetY + step;
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
        SlidesApp.getUi().alert(msg);
      }
  }
}

/**
  Finds left-most and top-most coordinates of selected page elements; (0,0) by default
  @return left-most and top-most coordinates in an array
**/
function getSelectionCoordinates() 
{
  var selection = SlidesApp.getActivePresentation().getSelection();
  switch (selection.getSelectionType()) 
  {
    case SlidesApp.SelectionType.PAGE_ELEMENT:
    {
      // only interested if selection is containing page elements
      var elements = selection.getPageElementRange();
      var top = 1000000;
      var left = 1000000;
      if (elements) 
      {
        // find the left-most, top-most coordinate of selected elements
        var pageElements = elements.getPageElements();
        for (var i = 0; i < pageElements.length; i++) 
        {
          var element = pageElements[i];
          var elementTop = element.getTop();
          var elementLeft = element.getLeft();
          if (top > elementTop)
            top = elementTop;
          if (left > elementLeft)
            left = elementLeft;
        }
        return [left, top];
      }
    }
  }
  return [0, 0];
}

/**
  Deletes selected elements
**/
function deleteSelectedElements() 
{
  var selection = SlidesApp.getActivePresentation().getSelection();
  switch (selection.getSelectionType()) 
  {
    case SlidesApp.SelectionType.PAGE_ELEMENT: 
      {
      // only interested if selection is containing page elements
      var elements = selection.getPageElementRange();
      if (elements) {
        var pageElements = elements.getPageElements();
        // find the left-most, top-most coordinate of selected elements
        for (var i = 0; i < pageElements.length; i++) 
        {
          // delete all selected page elements
          var element = pageElements[i];
          element.remove();
        }
      }
    } 
  }
}

/**
 * Inserts the given diagram at the given position.
 */
function insertDiagram(id, page, offsetX, offsetY)
{
  var scale = 2;
  var result = fetchImage(id, page, scale);
  
  var blob = result[0];
  var w = result[1] * SCALING_VALUE;
  var h = result[2] * SCALING_VALUE;
  var img = null;
  
  if (blob != null)
  {
      var slide = SlidesApp.getActivePresentation().getSelection().getCurrentPage().asSlide();
      var img = slide.insertImage(blob);
      img.setLeft(offsetX);
      img.setTop(offsetY);
      var wmax = SlidesApp.getActivePresentation().getPageWidth();
      var hmax = SlidesApp.getActivePresentation().getPageHeight();
    
      var link = createLink(id, page, scale);
	  img.setLinkUrl(link);
	  
	  // Scales to document width if not placeholder
      if (w == 0 && h == 0) {
	      var w = img.getWidth();
          var h = img.getHeight();
      }
    
      var nw = w;
      var nh = h;
    
      // adjust scale (retina/HiDPI display support)
      w /= scale;
      h /= scale;
	  
	  if (wmax > 0 && w > wmax)
	  {
	    var aspect = w / h;
	    
	    // Keeps width and aspect
	    nw = wmax;
	    nh = wmax / aspect;
	  }
      else if (hmax > 0 && h > hmax) {
        var aspect = h / w;

        // Keeps height and aspect
	    nh = hmax;
	    nw = hmax / aspect;
      }
      img.setWidth(w);
      img.setHeight(h);
  }
  else
  {
    throw new Error("Invalid image " + id);
  }
  
  return img;
}

/**
 * Updates the selected diagrams in-place.
 */
function updateSelected()
{
  var selection = SlidesApp.getActivePresentation().getSelection();
    
  if (selection)
  {
    switch (selection.getSelectionType()) 
    {
      case SlidesApp.SelectionType.PAGE_ELEMENT:
      {
        var selected = selection.getPageElementRange();
        if (!selected)
          return;
        
        selected = selected.getPageElements();
        
        var elts = [];
        
        // Unwraps selection elements
        for (var i = 0; i < selected.length; i++)
        {
          var pageElement = selected[i];
          switch (pageElement.getPageElementType())
          {
            case SlidesApp.PageElementType.IMAGE:
            {
              elts.push(selected[i].asImage());
            }
          }
        }
        updateElements(elts);
      }
    }
  }
  else
  {
    SlidesApp.getUi().alert("No selection");
  }
}

/**
 * Updates all diagrams in the document.
 */
function updateAll()
{
  // collect all slides
  var slides = SlidesApp.getActivePresentation().getSlides();
  var images = [];
  for (var i = 0; i < slides.length; i++)
  {
    // collect all images on all slides
    var slide = slides[i];
    var slideImages = slide.getImages();
    images = images.concat(slideImages);
  }
  updateElements(images);
}

/**
 * Updates all diagrams in the document.
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
        if (updateElement(elts[i]) != null)
        {
          updated++;
        }
      }
      catch (e)
      {
        errors.push("- " + e.message);
      }
    }
    
    // Shows status in case of errors or multiple updates
    if (errors.length > 0 || updated > 1)
    {
      var msg = "";
      
      if (updated > 0)
      {
        msg += updated + " diagram" + ((updated > 1) ? "s" : "") + " updated\n";
      }
      
      if (errors.length > 0)
      {
        msg += errors.length + " update" + ((errors.length > 1) ? "s" : "") + " failed:\n";
      }
      
      msg += errors.join("\n");
      SlidesApp.getUi().alert(msg);
    }
  }
}

/**
 * Returns true if the given URL points to draw.io
 */
function createLink(id, page, scale)
{
  var params = [];
  
  if (page != null && page != "0")
  {
    params.push('page=' + page);
  }
  
  // This URL parameter is ignored and is used internally to
  // store the retina flag since there is no other storage
  if (scale != null && scale != 1)
  {
    params.push('scale=' + scale);
  }
  
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
  
  if (elt.getPageElementType() == SlidesApp.PageElementType.IMAGE)
  {
    var url = elt.getLink();
    if (url != null)
      url = url.getUrl();
    
    if (url == null)
    {
      // commenting this out - missing link is most of the time an indicator image is not coming from draw.io
      // we probably don't want to have this popping out as an error
      // throw new Error("Missing link")
    }
    else if (isValidLink(url))
    {
      var id = getDiagramId(url);
      var params = getUrlParams(url);
      
      if (id != null && id.length > 0)
      {
        result = updateDiagram(id, params["page"], parseFloat(params["scale"] || 1), elt);
      }
      else
      {
        // commenting this out as well - invalid link might indicate image is not coming from draw.io
        // throw new Error("Invalid link " + url);
      }
    }
  }
  
  return result;
}

/**
 * Updates the diagram in the given inline image and returns the new inline image.
 */
function updateDiagram(id, page, scale, elt)
{
  var img = null;
  var result = fetchImage(id, page, scale);
  
  var isOK = false;
  
  if (result != null) 
  {
    var blob = result[0];
    var w = result[1] / scale;
    var h = result[2] / scale;
    
    if (blob != null)
    {
      isOK = true;
      // There doesn't seem to be a natural way to replace images in SlidesApp
      // Slides API seems to only provide means to get a page and a group associated with the image
      // Groups only allow removal of elements though, not insertions (seems like a half-baked API)
      
      // This code just adds a new image to page to the same position as the old image and removes the old image
      // TODO: No group information will be preserved right now
      // TODO: A question about it was posted here:
      // TODO: https://plus.google.com/111221846870143003075/posts/EPAM8HrZhe2
      // TODO: if there is a satisfying answer, it will be implemented
      
      var page = elt.getParentPage();
      var left = elt.getLeft();
      var top = elt.getTop();
      var width = elt.getWidth();
      var height = elt.getHeight();
      
      // This part addresses the possibility of updated diagrams having completely different shapes,
      // causing diagrams no longer fitting into page
      
      // Keep top-left corner, adjust width x height
      // keep either original width or height together with new aspect ratio
      
      if (w == 0 && h == 0)
      {
        w = width;
        h = height;
      }
      
      // make sure dimensions are reasonable
      if (w == 0 || h == 0)
        throw new Error("One or both image dimensions are zero!");
      
      var nw = w;
      var nh = h;

      // if aspect w/h < 1, use original width, otherwise use original height
      // i.e. the smaller dimension keeps preserved (seems more natural while testing than preserving the larger dimension; can be changed anyway)
      var aspect = w / h;
      
      if (aspect < 1)
      {
        nw = width;
        nh = width / aspect;
      }
      else
      {
        nw = height * aspect;
        nh = height;
      }
      
      // now check if the image is still not too large
      var wmax = SlidesApp.getActivePresentation().getPageWidth();
      var hmax = SlidesApp.getActivePresentation().getPageHeight();

	  if (wmax > 0 && w > wmax)
	  {
	    aspect = w / h;
	    
	    // Keeps width and aspect
	    nw = wmax;
	    nh = wmax / aspect;
	  }
      else if (hmax > 0 && h > hmax) {
        aspect = h / w;

        // Keeps height and aspect
	    nh = hmax;
	    nw = hmax / aspect;
      }
      
      // make sure image is at least 1 pixel wide/high
      nw = Math.max(1, nw);
      nh = Math.max(1, nh);
      
      // replace image with the same link
      var img = page.insertImage(blob, left, top, nw, nh);
      var link = createLink(id, page, scale);
      img.setLinkUrl(link);
      
      elt.remove();
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
function fetchImage(id, page, scale)
{
    var file = DriveApp.getFileById(id);

    if (file != null && file.getSize() > 0)
    {
	    var response = UrlFetchApp.fetch(EXPORT_URL,
	    {
		  "method": "post",
		  "payload":
		  {
		    "format": "png",
            "scale": scale || "1",
//            "border": (scale == 2) ? "1" : "0", // not sure why it was set to 1, it looks better with 0 now, so I commented it out
            "border": "0",
            "from": page || "0",
		    "xml": encodeURIComponent(file.getBlob().getDataAsString())
		  }
		});
      
      var headers = response.getHeaders();

      return [response.getBlob(), headers["content-ex-width"] || 0, headers["content-ex-height"] || 0];
    }
    else
    {
    	// Returns an empty, transparent 1x1 PNG image as a placeholder
    	return Utilities.newBlob(Utilities.base64Decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNg+M9QDwADgQF/e5IkGQAAAABJRU5ErkJggg=="), "image/png");
    }
}


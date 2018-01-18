/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.mxgraph.io.mxVsdxCodec;

/**
 * 
 * A model representing vsdx files. As well as being a programmatic model, the XML DOMs of the unzipped
 * files are held to enable round-tripping
 *
 */
public class mxVsdxModel {

	/**
	 * A map of Documents created by reading the XML files, indexed by the path to those files
	 */
	protected Map<String, Document> xmlDocs = null;
	
	/**
	 * Collection of media files encoded in Base64, indexed by the path to those files
	 */
	protected Map<String, String> media = null;

	/**
	 * The document from .../document.xml
	 */
	protected Element rootElement;
	
	/**
	 * Map of page objects indexed by their ID.
	 */
	protected Map<Integer, mxVsdxPage> pages = null;

	/**
	 * Map of master objects indexed by their ID. Before you think you're being clever by making
	 * the index an Integer as for pages, don't, there are reasons.
	 */
	protected Map<String, mxVsdxMaster> masters = new HashMap<String, mxVsdxMaster>();
	
	/**
	 * Map stylesheets indexed by their ID
	 */
	protected Map<String, Style> stylesheets = new HashMap<String, Style>();
	
	/**
	 * Map themes indexed by their index
	 */
	protected Map<Integer, mxVsdxTheme> themes = new HashMap<>();	
	
	mxPropertiesManager pm;

	public mxVsdxModel(Document doc, Map<String, Document> docData, Map<String, String> mediaData)
	{
		this.xmlDocs = docData;
		this.media = mediaData;
	
		Node childNode = doc.getFirstChild();
		
		while (childNode != null)
		{
			if (childNode instanceof Element && ((Element)childNode).getTagName().toLowerCase().equals(mxVsdxCodec.vsdxPlaceholder + "document"))
			{
				this.rootElement = (Element)childNode;
				break;
			}
			
			childNode = childNode.getNextSibling();
		}
	
		this.pm = new mxPropertiesManager();
		this.pm.initialise(rootElement, this);
		initStylesheets();
		initThemes();
		initMasters();
		initPages();
	}

	/**
	 * Initialize theme objects from the XML files
	 */
	private void initThemes() 
	{
		// Lazy build up the master structure
		if (this.xmlDocs != null)
		{
			boolean more = true;
			int index = 1;
			
			while (more)
			{
				String path = mxVsdxCodec.vsdxPlaceholder + "/theme/theme"+ index +".xml";
				Document themeDoc = this.xmlDocs.get(path);
	
				if (themeDoc != null)
				{
					Node child = themeDoc.getFirstChild();
					
					while (child != null)
					{
						if (child instanceof Element && ((Element)child).getTagName().equals("a:theme"))
						{
							mxVsdxTheme theme = new mxVsdxTheme((Element) child);
							
							
							if (theme.getThemeIndex() < 0)
							{
								//theme index cannot be determined unless the theme is parsed
								theme.processTheme();
							}
							
							//TODO having two theme files with the same id still requires more handling
							//		probably we need to merge the similar parts (has same theme name)
							mxVsdxTheme existingTheme = themes.get(theme.getThemeIndex());
							if (existingTheme == null || !existingTheme.isPure())
							{
								themes.put(theme.getThemeIndex(), theme);
							}
							
							break;
						}
						
						child = child.getNextSibling();
					}
					index++;
				}
				else
				{
					more = false;
				}
			}
		}
	}

	/**
	 * Load the map with the stylesheets elements in the document.<br/>
	 * The masters are wrapped for instances of mxStyleSheet.
	 * @param doc Document with the stylesheets.
	 */
	public void initStylesheets()
	{
		NodeList vdxSheets = rootElement.getElementsByTagName(mxVsdxConstants.STYLE_SHEETS);

		if (vdxSheets.getLength() > 0)
		{
			Element sheets = (Element) vdxSheets.item(0);
			NodeList sheetList = sheets.getElementsByTagName(mxVsdxConstants.STYLE_SHEET);
			int sheetLength = sheetList.getLength();

			for (int i = 0; i < sheetLength; i++)
			{
				Element sheet = (Element) sheetList.item(i);
				String sheetId = sheet.getAttribute(mxVsdxConstants.ID);
				Style sheetElement = new Style(sheet, this);
				stylesheets.put(sheetId, sheetElement);
			}
		}
		
		Collection <Style> sheets = stylesheets.values();
		Iterator<Style> iter = sheets.iterator();
		
		while (iter.hasNext())
		{
			Style sheet = iter.next();
			sheet.stylesheetRefs(this);
		}
	}

	/**
	 * Initialize master objects from the XML files
	 */
	public void initMasters()
	{
		// Lazy build up the master structure
		if (this.xmlDocs != null)
		{
			String path = mxVsdxCodec.vsdxPlaceholder + "/masters/masters.xml";
			Document masterDoc = this.xmlDocs.get(path);

			if (masterDoc != null)
			{
				Node child = masterDoc.getFirstChild();
				
				while (child != null)
				{
					if (child instanceof Element && ((Element)child).getTagName().equals(mxVsdxConstants.MASTERS))
					{
						Node grandChild = child.getFirstChild();
						
						while (grandChild != null)
						{
							if (grandChild instanceof Element && ((Element)grandChild).getTagName().equals("Master"))
							{
								Element masterElement = (Element)grandChild;
								mxVsdxMaster master = new mxVsdxMaster(masterElement, this);
								this.masters.put(master.getId(), master);
							}
							
							grandChild = grandChild.getNextSibling();
						}
						
						break;

					}
					
					child = child.getNextSibling();
				}
			}
		}
	}
	
	/**
	 * Initialize page objects from the XML files
	 */
	public void initPages()
	{
		// Lazy build up the pages structure
		if (this.xmlDocs != null)
		{
			String path = mxVsdxCodec.vsdxPlaceholder + "/pages/pages.xml";
			Document pageDoc = this.xmlDocs.get(path);

			if (pageDoc != null)
			{
				Node child = pageDoc.getFirstChild();
				
				while (child != null)
				{
					if (child instanceof Element && ((Element)child).getTagName().equals(mxVsdxConstants.PAGES))
					{
						Element pages = (Element)child;
						
						NodeList pageList = pages.getElementsByTagName(mxVsdxConstants.PAGE);
						
						if (pageList != null && pageList.getLength() > 0)
						{
							this.pages = new LinkedHashMap<Integer, mxVsdxPage>();
							
							HashMap<Integer, mxVsdxPage> backgroundMap = new HashMap<Integer, mxVsdxPage>();
							int pageListLen = pageList.getLength();
							
							//Find the background pages while creating all the pages
							for (int i = 0; i < pageListLen; i++)
							{
								Element pageEle = (Element) pageList.item(i);
								mxVsdxPage page = createPage(pageEle);
								
								if (page.isBackground())
								{
									backgroundMap.put(page.getId(), page);
								}
								
								this.pages.put(page.getId(), page);
							}
		
							// Iterate again, assigning background pages
							for (Map.Entry<Integer, mxVsdxPage> entry : this.pages.entrySet())
							{
								mxVsdxPage page = entry.getValue();
		
								if (!page.isBackground())
								{
									Integer backId = page.getBackPageId();
		
									if (backId != null)
									{
										//Import the background.
										mxVsdxPage background = backgroundMap.get(backId);
										page.setBackPage(background);;
									}
								}
							}
						}

						break; // MS defines there can only be 0 or 1 PAGES element, don't process second
					}
					
					child = child.getNextSibling();
				}
			}
		}
	}
	
	public Map<Integer, mxVsdxPage> getPages()
	{
		return this.pages;
	}

	public Map<Integer, mxVsdxTheme> getThemes()
	{
		return this.themes;
	}

	protected Element getRelationship(String rid, String path)
	{
		Document relsDoc = this.xmlDocs.get(path);

		if (relsDoc == null || rid == null || rid.isEmpty())
		{
			// Valid to not have a rels for an XML file
			return null;
		}
		
		NodeList rels = relsDoc.getElementsByTagName("Relationship");

		for (int i = 0; i < rels.getLength(); i++)
		{
			Element currElem = (Element) rels.item(i);
			String id = currElem.getAttribute("Id");

			if (id.equals(rid))
			{
				return currElem;
			}
		}

		return null;
	}

	public mxVsdxMaster getMaster(String masterId)
	{
		return this.masters.get(masterId);
	}

	protected mxVsdxPage createPage(Element pageEle)
	{
		return new mxVsdxPage(pageEle, this);
	}
	
	public mxPropertiesManager getPropertiesManager() {
		return pm;
	}

	public void setPropertiesManager(mxPropertiesManager pm) {
		this.pm = pm;
	}

	public Map<String, mxVsdxMaster> getMasterShapes() {
		return masters;
	}

	public void setMasterShapes(Map<String, mxVsdxMaster> mm) {
		this.masters = mm;
	}
	
	/**
	 * Returns the wrapper of the stylesheet element with id indicated by 'id'
	 * @param id StyleSheet's ID.
	 * @return StyleSheet element with id = 'id' wrapped in an instance of mxStyleSheet.
	 */
	public Style getStylesheet(String id)
	{
		return stylesheets.get(id);
	}
	
	public Document getXmlDoc(String path)
	{
		return this.xmlDocs.get(path);
	}
	
	public String getMedia(String path)
	{
		return this.media.get(path);
	}
}

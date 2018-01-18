/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import java.util.HashMap;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This is a singleton class that contains a map with the key elements of the
 * document. The key elements are wrapped in instances of mxGmlKey and
 * may to be access by ID.
 */
public class mxGraphMlKeyManager
{
	/**
	 * Map with the key elements of the document.<br/>
	 * The key is the key's ID.
	 */
	private HashMap<String, mxGraphMlKey> keyMap = new HashMap<String, mxGraphMlKey>();

	private static mxGraphMlKeyManager keyManager = null;

	/**
	 * Singleton pattern requires private constructor.
	 */
	private mxGraphMlKeyManager()
	{
	}

	/**
	 * Returns the instance of mxGmlKeyManager.
	 * If no instance has been created until the moment, a new instance is
	 * returned.
	 * This method don't load the map.
	 * @return An instance of mxGmlKeyManager.
	 */
	public static mxGraphMlKeyManager getInstance()
	{
		if (keyManager == null)
		{
			keyManager = new mxGraphMlKeyManager();
		}
		return keyManager;
	}

	/**
	 * Load the map with the key elements in the document.<br/>
	 * The keys are wrapped for instances of mxGmlKey.
	 * @param doc Document with the keys.
	 */
	public void initialise(Document doc)
	{
		NodeList gmlKeys = doc.getElementsByTagName(mxGraphMlConstants.KEY);

		int keyLength = gmlKeys.getLength();

		for (int i = 0; i < keyLength; i++)
		{
			Element key = (Element) gmlKeys.item(i);
			String keyId = key.getAttribute(mxGraphMlConstants.ID);
			mxGraphMlKey keyElement = new mxGraphMlKey(key);
			keyMap.put(keyId, keyElement);
		}
	}

	public HashMap<String, mxGraphMlKey> getKeyMap()
	{
		return keyMap;
	}

	public void setKeyMap(HashMap<String, mxGraphMlKey> keyMap)
	{
		this.keyMap = keyMap;
	}
}

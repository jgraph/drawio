/**
 * Copyright (c) 2010, Gaudenz Alder
 */
package com.mxgraph.util;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;
import java.util.logging.Level;
import java.util.logging.Logger;

public class mxResources
{

	private static final Logger log = Logger.getLogger(mxResources.class.getName());

	/**
	 * Ordered list of the inserted resource bundles.
	 */
	protected static LinkedList<ResourceBundle> bundles = new LinkedList<ResourceBundle>();

	/**
	 * Returns the bundles.
	 * 
	 * @return Returns the bundles.
	 */
	public static LinkedList<ResourceBundle> getBundles()
	{
		return bundles;
	}

	/**
	 * Sets the bundles.
	 * 
	 * @param value
	 *            The bundles to set.
	 */
	public static void setBundles(LinkedList<ResourceBundle> value)
	{
		bundles = value;
	}

	/**
	 * Adds a resource bundle. This may throw a MissingResourceException that
	 * should be handled in the calling code.
	 * 
	 * @param basename
	 *            The basename of the resource bundle to add.
	 */
	public static void add(String basename)
	{
		bundles.addFirst(PropertyResourceBundle.getBundle(basename));
	}
	
	/**
	 * Adds a resource bundle. This may throw a MissingResourceException that
	 * should be handled in the calling code.
	 * 
	 * @param basename
	 *            The basename of the resource bundle to add.
	 */
	public static void add(String basename, Locale locale)
	{
		bundles.addFirst(PropertyResourceBundle.getBundle(basename, locale));
	}

	/**
	 * 
	 */
	public static String get(String key)
	{
		return get(key, null, null);
	}

	/**
	 * 
	 */
	public static String get(String key, String defaultValue)
	{
		return get(key, null, defaultValue);
	}

	/**
	 * Returns the value for the specified resource key.
	 */
	public static String get(String key, String[] params)
	{
		return get(key, params, null);
	}

	/**
	 * Returns the value for the specified resource key.
	 */
	public static String get(String key, String[] params, String defaultValue)
	{
		String value = getResource(key);

		// Applies default value if required
		if (value == null)
		{
			value = defaultValue;
		}

		// Replaces the placeholders with the values in the array
		if (value != null && params != null)
		{
			StringBuffer result = new StringBuffer();
			String index = null;

			for (int i = 0; i < value.length(); i++)
			{
				char c = value.charAt(i);

				if (c == '{')
				{
					index = "";
				}
				else if (index != null && c == '}')
				{
					int tmp = Integer.parseInt(index) - 1;

					if (tmp >= 0 && tmp < params.length)
					{
						result.append(params[tmp]);
					}

					index = null;
				}
				else if (index != null)
				{
					index += c;
				}
				else
				{
					result.append(c);
				}
			}

			value = result.toString();
		}

		return value;
	}

	/**
	 * Returns the value for <code>key</code> by searching the resource
	 * bundles in inverse order or <code>null</code> if no value can be found
	 * for <code>key</code>.
	 */
	protected static String getResource(String key)
	{
		Iterator<ResourceBundle> it = bundles.iterator();

		while (it.hasNext())
		{
			try
			{
				return it.next().getString(key);
			}
			catch (MissingResourceException e)
			{
				// continue looking in other bundles
			}
		}

		log.severe("Resource " + key + " not found in any bundle");
		return null;
	}

}

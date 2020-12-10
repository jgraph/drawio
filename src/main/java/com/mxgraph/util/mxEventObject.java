/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.util;

import java.util.Hashtable;
import java.util.Map;

/**
 * Base class for objects that dispatch named events.
 */
public class mxEventObject
{

	/**
	 * Holds the name of the event.
	 */
	protected String name;
	
	/**
	 * Holds the properties of the event.
	 */
	protected Map<String, Object> properties;
	
	/**
	 * Holds the consumed state of the event. Default is false.
	 */
	protected boolean consumed = false;

	/**
	 * Constructs a new event for the given name.
	 */
	public mxEventObject(String name)
	{
		this(name, (Object[]) null);
	}

	/**
	 * Constructs a new event for the given name and properties. The optional
	 * properties are specified using a sequence of keys and values, eg.
	 * <code>new mxEventObject("eventName", key1, val1, .., keyN, valN))</code>
	 */
	public mxEventObject(String name, Object... args)
	{
		this.name = name;
		properties = new Hashtable<String, Object>();
		
		if (args != null)
		{
			for (int i = 0; i < args.length; i += 2)
			{
				if (args[i + 1] != null)
				{
					properties.put(String.valueOf(args[i]), args[i + 1]);
				}
			}
		}
	}

	/**
	 * Returns the name of the event.
	 */
	public String getName()
	{
		return name;
	}
	
	/**
	 * 
	 */
	public Map<String, Object> getProperties()
	{
		return properties;
	}

	/**
	 * 
	 */
	public Object getProperty(String key)
	{
		return properties.get(key);
	}

	/**
	 * Returns true if the event has been consumed.
	 */
	public boolean isConsumed()
	{
		return consumed;
	}

	/**
	 * Consumes the event.
	 */
	public void consume()
	{
		consumed = true;
	}

}

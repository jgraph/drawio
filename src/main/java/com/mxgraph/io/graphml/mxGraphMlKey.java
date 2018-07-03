/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * Represents a Key element in the GML Structure.
 */
public class mxGraphMlKey
{
	/**
	 * Possibles values for the keyFor Attribute
	 */
	public enum keyForValues
	{
		GRAPH, NODE, EDGE, HYPEREDGE, PORT, ENDPOINT, ALL
	}

	/**
	 * Possibles values for the keyType Attribute.
	 */
	public enum keyTypeValues
	{
		BOOLEAN, INT, LONG, FLOAT, DOUBLE, STRING
	}

	private String keyDefault;

	private String keyId;

	private keyForValues keyFor;

	private String keyName;

	private keyTypeValues keyType;

	/**
	 * Construct a key with the given parameters.
	 * @param keyId Key's ID
	 * @param keyFor Scope of the key.
	 * @param keyName Key Name
	 * @param keyType Type of the values represented for this key.
	 */
	public mxGraphMlKey(String keyId, keyForValues keyFor, String keyName,
			keyTypeValues keyType)
	{
		this.keyId = keyId;
		this.keyFor = keyFor;
		this.keyName = keyName;
		this.keyType = keyType;
		this.keyDefault = defaultValue();
	}

	/**
	 * Construct a key from a xml key element.
	 * @param keyElement Xml key element.
	 */
	public mxGraphMlKey(Element keyElement)
	{
		this.keyId = keyElement.getAttribute(mxGraphMlConstants.ID);
		this.keyFor = enumForValue(keyElement
				.getAttribute(mxGraphMlConstants.KEY_FOR));
		this.keyName = keyElement.getAttribute(mxGraphMlConstants.KEY_NAME);
		this.keyType = enumTypeValue(keyElement
				.getAttribute(mxGraphMlConstants.KEY_TYPE));
		this.keyDefault = defaultValue();
	}

	public String getKeyDefault()
	{
		return keyDefault;
	}

	public void setKeyDefault(String keyDefault)
	{
		this.keyDefault = keyDefault;
	}

	public keyForValues getKeyFor()
	{
		return keyFor;
	}

	public void setKeyFor(keyForValues keyFor)
	{
		this.keyFor = keyFor;
	}

	public String getKeyId()
	{
		return keyId;
	}

	public void setKeyId(String keyId)
	{
		this.keyId = keyId;
	}

	public String getKeyName()
	{
		return keyName;
	}

	public void setKeyName(String keyName)
	{
		this.keyName = keyName;
	}

	public keyTypeValues getKeyType()
	{
		return keyType;
	}

	public void setKeyType(keyTypeValues keyType)
	{
		this.keyType = keyType;
	}

	/**
	 * Returns the default value of the keyDefault attribute according
	 * the keyType.
	 */
	private String defaultValue()
	{
		String val = "";
		switch (this.keyType)
		{
			case BOOLEAN:
			{
				val = "false";
				break;
			}
			case DOUBLE:
			{
				val = "0";
				break;
			}
			case FLOAT:
			{
				val = "0";
				break;
			}
			case INT:
			{
				val = "0";
				break;
			}
			case LONG:
			{
				val = "0";
				break;
			}
			case STRING:
			{
				val = "";
				break;
			}
		}
		return val;
	}

	/**
	 * Generates a Key Element from this class.
	 * @param document Document where the key Element will be inserted.
	 * @return Returns the generated Elements.
	 */
	public Element generateElement(Document document)
	{
		Element key = document.createElement(mxGraphMlConstants.KEY);
		
		if (!keyName.equals(""))
		{
			key.setAttribute(mxGraphMlConstants.KEY_NAME, keyName);
		}
		key.setAttribute(mxGraphMlConstants.ID, keyId);
		
		if (!keyName.equals(""))
		{
			key.setAttribute(mxGraphMlConstants.KEY_FOR, stringForValue(keyFor));
		}
		
		if (!keyName.equals(""))
		{
			key.setAttribute(mxGraphMlConstants.KEY_TYPE, stringTypeValue(keyType));
		}
		
		if (!keyName.equals(""))
		{
			key.setTextContent(keyDefault);
		}
		
		return key;
	}

	/**
	 * Converts a String value in its corresponding enum value for the
	 * keyFor attribute.
	 * @param value Value in String representation.
	 * @return Returns the value in its enum representation.
	 */
	public keyForValues enumForValue(String value)
	{
		keyForValues enumVal = keyForValues.ALL;
		
		if (value.equals(mxGraphMlConstants.GRAPH))
		{
			enumVal = keyForValues.GRAPH;
		}
		else if (value.equals(mxGraphMlConstants.NODE))
		{
			enumVal = keyForValues.NODE;
		}
		else if (value.equals(mxGraphMlConstants.EDGE))
		{
			enumVal = keyForValues.EDGE;
		}
		else if (value.equals(mxGraphMlConstants.HYPEREDGE))
		{
			enumVal = keyForValues.HYPEREDGE;
		}
		else if (value.equals(mxGraphMlConstants.PORT))
		{
			enumVal = keyForValues.PORT;
		}
		else if (value.equals(mxGraphMlConstants.ENDPOINT))
		{
			enumVal = keyForValues.ENDPOINT;
		}
		else if (value.equals(mxGraphMlConstants.ALL))
		{
			enumVal = keyForValues.ALL;
		}
		
		return enumVal;
	}

	/**
	 * Converts a enum value in its corresponding String value for the
	 * keyFor attribute.
	 * @param value Value in enum representation.
	 * @return Returns the value in its String representation.
	 */
	public String stringForValue(keyForValues value)
	{

		String val = mxGraphMlConstants.ALL;
		
		switch (value)
		{
			case GRAPH:
			{
				val = mxGraphMlConstants.GRAPH;
				break;
			}
			case NODE:
			{
				val = mxGraphMlConstants.NODE;
				break;
			}
			case EDGE:
			{
				val = mxGraphMlConstants.EDGE;
				break;
			}
			case HYPEREDGE:
			{
				val = mxGraphMlConstants.HYPEREDGE;
				break;
			}
			case PORT:
			{
				val = mxGraphMlConstants.PORT;
				break;
			}
			case ENDPOINT:
			{
				val = mxGraphMlConstants.ENDPOINT;
				break;
			}
			case ALL:
			{
				val = mxGraphMlConstants.ALL;
				break;
			}
		}

		return val;
	}

	/**
	 * Converts a String value in its corresponding enum value for the
	 * keyType attribute.
	 * @param value Value in String representation.
	 * @return Returns the value in its enum representation.
	 */
	public keyTypeValues enumTypeValue(String value)
	{
		keyTypeValues enumVal = keyTypeValues.STRING;
		
		if (value.equals("boolean"))
		{
			enumVal = keyTypeValues.BOOLEAN;
		}
		else if (value.equals("double"))
		{
			enumVal = keyTypeValues.DOUBLE;
		}
		else if (value.equals("float"))
		{
			enumVal = keyTypeValues.FLOAT;
		}
		else if (value.equals("int"))
		{
			enumVal = keyTypeValues.INT;
		}
		else if (value.equals("long"))
		{
			enumVal = keyTypeValues.LONG;
		}
		else if (value.equals("string"))
		{
			enumVal = keyTypeValues.STRING;
		}
		
		return enumVal;
	}

	/**
	 * Converts a enum value in its corresponding string value for the
	 * keyType attribute.
	 * @param value Value in enum representation.
	 * @return Returns the value in its String representation.
	 */
	public String stringTypeValue(keyTypeValues value)
	{
		String val = "string";
		
		switch (value)
		{
			case BOOLEAN:
			{
				val = "boolean";
				break;
			}
			case DOUBLE:
			{
				val = "double";
				break;
			}
			case FLOAT:
			{
				val = "float";
				break;
			}
			case INT:
			{
				val = "int";
				break;
			}
			case LONG:
			{
				val = "long";
				break;
			}
			case STRING:
			{
				val = "string";
				break;
			}
		}

		return val;
	}
}

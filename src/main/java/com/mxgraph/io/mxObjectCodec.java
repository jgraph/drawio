/**
 * Copyright (c) 2006, Gaudenz Alder
 */
package com.mxgraph.io;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import com.mxgraph.util.mxUtils;

/**
 * Generic codec for Java objects. See below for a detailed description of
 * the encoding/decoding scheme.
 * 
 * Note: Since booleans are numbers in JavaScript, all boolean values are
 * encoded into 1 for true and 0 for false.
 */
@SuppressWarnings("unchecked")
public class mxObjectCodec
{

	private static final Logger log = Logger.getLogger(mxObjectCodec.class.getName());

	/**
	 * Immutable empty set.
	 */
	private static Set<String> EMPTY_SET = new HashSet<String>();

	/**
	 * Holds the template object associated with this codec.
	 */
	protected Object template;

	/**
	 * Array containing the variable names that should be ignored by the codec.
	 */
	protected Set<String> exclude;

	/**
	 * Array containing the variable names that should be turned into or
	 * converted from references. See <mxCodec.getId> and <mxCodec.getObject>.
	 */
	protected Set<String> idrefs;

	/**
	 * Maps from from fieldnames to XML attribute names.
	 */
	protected Map<String, String> mapping;

	/**
	 * Maps from from XML attribute names to fieldnames.
	 */
	protected Map<String, String> reverse;

	/**
	 * Caches accessors for the given method names.
	 */
	protected Map<String, Method> accessors;

	/**
	 * Caches fields for faster access.
	 */
	protected Map<Class, Map<String, Field>> fields;

	/**
	 * Constructs a new codec for the specified template object.
	 */
	public mxObjectCodec(Object template)
	{
		this(template, null, null, null);
	}

	/**
	 * Constructs a new codec for the specified template object. The variables
	 * in the optional exclude array are ignored by the codec. Variables in the
	 * optional idrefs array are turned into references in the XML. The
	 * optional mapping may be used to map from variable names to XML
	 * attributes. The argument is created as follows:
	 * 
	 * @param template Prototypical instance of the object to be encoded/decoded.
	 * @param exclude Optional array of fieldnames to be ignored.
	 * @param idrefs Optional array of fieldnames to be converted to/from references.
	 * @param mapping Optional mapping from field- to attributenames.
	 */
	public mxObjectCodec(Object template, String[] exclude, String[] idrefs,
			Map<String, String> mapping)
	{
		this.template = template;

		if (exclude != null)
		{
			this.exclude = new HashSet<String>();

			for (int i = 0; i < exclude.length; i++)
			{
				this.exclude.add(exclude[i]);
			}
		}
		else
		{
			this.exclude = EMPTY_SET;
		}

		if (idrefs != null)
		{
			this.idrefs = new HashSet<String>();

			for (int i = 0; i < idrefs.length; i++)
			{
				this.idrefs.add(idrefs[i]);
			}
		}
		else
		{
			this.idrefs = EMPTY_SET;
		}

		if (mapping == null)
		{
			mapping = new Hashtable<String, String>();
		}

		this.mapping = mapping;

		reverse = new Hashtable<String, String>();
		Iterator<Map.Entry<String, String>> it = mapping.entrySet().iterator();

		while (it.hasNext())
		{
			Map.Entry<String, String> e = it.next();
			reverse.put(e.getValue(), e.getKey());
		}
	}

	/**
	 * Returns the name used for the nodenames and lookup of the codec when
	 * classes are encoded and nodes are decoded. For classes to work with
	 * this the codec registry automatically adds an alias for the classname
	 * if that is different than what this returns. The default implementation
	 * returns the classname of the template class.
	 * 
	 * Here is an example on how to use this for renaming mxCell nodes:
	 * <code>
	 * mxCodecRegistry.register(new mxCellCodec()
	 * {
	 *   public String getName()
	 *   {
	 *     return "anotherName";
	 *   }
	 * });
	 * </code>
	 */
	public String getName()
	{
		return mxCodecRegistry.getName(getTemplate());
	}

	/**
	 * Returns the template object associated with this codec.
	 * 
	 * @return Returns the template object.
	 */
	public Object getTemplate()
	{
		return template;
	}

	/**
	 * Returns a new instance of the template object for representing the given
	 * node.
	 * 
	 * @param node XML node that the object is going to represent.
	 * @return Returns a new template instance.
	 */
	protected Object cloneTemplate(Node node)
	{
		Object obj = null;

		try
		{
			if (template.getClass().isEnum())
			{
				obj = template.getClass().getEnumConstants()[0];
			}
			else
			{
				obj = template.getClass().newInstance();
			}

			// Special case: Check if the collection
			// should be a map. This is if the first
			// child has an "as"-attribute. This
			// assumes that all childs will have
			// as attributes in this case. This is
			// required because in JavaScript, the
			// map and array object are the same.
			if (obj instanceof Collection)
			{
				node = node.getFirstChild();

				// Skips text nodes
				while (node != null && !(node instanceof Element))
				{
					node = node.getNextSibling();
				}

				if (node != null && node instanceof Element
						&& ((Element) node).hasAttribute("as"))
				{
					obj = new Hashtable<Object, Object>();
				}
			}
		}
		catch (InstantiationException e)
		{
			log.log(Level.FINEST, "Failed to clone the template", e);
		}
		catch (IllegalAccessException e)
		{
			log.log(Level.FINEST, "Failed to clone the template", e);
		}

		return obj;
	}

	/**
	 * Returns true if the given attribute is to be ignored by the codec. This
	 * implementation returns true if the given fieldname is in
	 * {@link #exclude}.
	 * 
	 * @param obj Object instance that contains the field.
	 * @param attr Fieldname of the field.
	 * @param value Value of the field.
	 * @param write Boolean indicating if the field is being encoded or
	 * decoded. write is true if the field is being encoded, else it is
	 * being decoded.
	 * @return Returns true if the given attribute should be ignored.
	 */
	public boolean isExcluded(Object obj, String attr, Object value,
			boolean write)
	{
		return exclude.contains(attr);
	}

	/**
	 * Returns true if the given fieldname is to be treated as a textual
	 * reference (ID). This implementation returns true if the given fieldname
	 * is in {@link #idrefs}.
	 * 
	 * @param obj Object instance that contains the field.
	 * @param attr Fieldname of the field.
	 * @param value Value of the field.
	 * @param isWrite Boolean indicating if the field is being encoded or
	 * decoded. isWrite is true if the field is being encoded, else it is being
	 * decoded.
	 * @return Returns true if the given attribute should be handled as a
	 * reference.
	 */
	public boolean isReference(Object obj, String attr, Object value,
			boolean isWrite)
	{
		return idrefs.contains(attr);
	}

	/**
	 * Encodes the specified object and returns a node representing then given
	 * object. Calls beforeEncode after creating the node and afterEncode
	 * with the resulting node after processing.
	 * 
	 * Enc is a reference to the calling encoder. It is used to encode complex
	 * objects and create references.
	 * 
	 * This implementation encodes all variables of an object according to the
	 * following rules:
	 * 
	 * <ul>
	 * <li>If the variable name is in {@link #exclude} then it is ignored.</li>
	 * <li>If the variable name is in {@link #idrefs} then
	 * {@link mxCodec#getId(Object)} is used to replace the object with its ID.
	 * </li>
	 * <li>The variable name is mapped using {@link #mapping}.</li>
	 * <li>If obj is an array and the variable name is numeric (ie. an index) then it
	 * is not encoded.</li>
	 * <li>If the value is an object, then the codec is used to create a child
	 * node with the variable name encoded into the "as" attribute.</li>
	 * <li>Else, if {@link com.mxgraph.io.mxCodec#isEncodeDefaults()} is true or
	 * the value differs from the template value, then ...
	 * <ul>
	 * <li>... if obj is not an array, then the value is mapped to an
	 * attribute.</li>
	 * <li>... else if obj is an array, the value is mapped to an add child
	 * with a value attribute or a text child node, if the value is a function.
	 * </li>
	 * </ul>
	 * </li>
	 * </ul>
	 * 
	 * If no ID exists for a variable in {@link #idrefs} or if an object cannot be
	 * encoded, a warning is logged.
	 * 
	 * @param enc Codec that controls the encoding process.
	 * @param obj Object to be encoded.
	 * @return Returns the resulting XML node that represents the given object. 
	 */
	public Node encode(mxCodec enc, Object obj)
	{
		Node node = enc.document.createElement(getName());

		obj = beforeEncode(enc, obj, node);
		encodeObject(enc, obj, node);

		return afterEncode(enc, obj, node);
	}

	/**
	 * Encodes the value of each member in then given obj
	 * into the given node using {@link #encodeFields(mxCodec, Object, Node)}
	 * and {@link #encodeElements(mxCodec, Object, Node)}.
	 * 
	 * @param enc Codec that controls the encoding process.
	 * @param obj Object to be encoded.
	 * @param node XML node that contains the encoded object.
	 */
	protected void encodeObject(mxCodec enc, Object obj, Node node)
	{
		mxCodec.setAttribute(node, "id", enc.getId(obj));
		encodeFields(enc, obj, node);
		encodeElements(enc, obj, node);
	}

	/**
	 * Encodes the declared fields of the given object into the given node.
	 * 
	 * @param enc Codec that controls the encoding process.
	 * @param obj Object whose fields should be encoded.
	 * @param node XML node that contains the encoded object.
	 */
	protected void encodeFields(mxCodec enc, Object obj, Node node)
	{
		// LATER: Use PropertyDescriptors in Introspector.getBeanInfo(clazz)
		// see http://forum.jgraph.com/questions/1424
		Class<?> type = obj.getClass();

		while (type != null)
		{
			Field[] fields = type.getDeclaredFields();

			for (int i = 0; i < fields.length; i++)
			{
				Field f = fields[i];

				if ((f.getModifiers() & Modifier.TRANSIENT) != Modifier.TRANSIENT)
				{
					String fieldname = f.getName();
					Object value = getFieldValue(obj, fieldname);
					encodeValue(enc, obj, fieldname, value, node);
				}
			}

			type = type.getSuperclass();
		}
	}

	/**
	 * Encodes the child objects of arrays, maps and collections.
	 * 
	 * @param enc Codec that controls the encoding process.
	 * @param obj Object whose child objects should be encoded.
	 * @param node XML node that contains the encoded object.
	 */
	protected void encodeElements(mxCodec enc, Object obj, Node node)
	{
		if (obj.getClass().isArray())
		{
			Object[] tmp = (Object[]) obj;

			for (int i = 0; i < tmp.length; i++)
			{
				encodeValue(enc, obj, null, tmp[i], node);
			}
		}
		else if (obj instanceof Map)
		{
			Iterator<Map.Entry> it = ((Map) obj).entrySet().iterator();

			while (it.hasNext())
			{
				Map.Entry e = it.next();
				encodeValue(enc, obj, String.valueOf(e.getKey()), e.getValue(),
						node);
			}
		}
		else if (obj instanceof Collection)
		{
			Iterator<?> it = ((Collection<?>) obj).iterator();

			while (it.hasNext())
			{
				Object value = it.next();
				encodeValue(enc, obj, null, value, node);
			}
		}
	}

	/**
	 * Converts the given value according to the mappings
	 * and id-refs in this codec and uses
	 * {@link #writeAttribute(mxCodec, Object, String, Object, Node)}
	 * to write the attribute into the given node.
	 * 
	 * @param enc Codec that controls the encoding process.
	 * @param obj Object whose field is going to be encoded.
	 * @param fieldname Name if the field to be encoded.
	 * @param value Value of the property to be encoded.
	 * @param node XML node that contains the encoded object.
	 */
	protected void encodeValue(mxCodec enc, Object obj, String fieldname,
			Object value, Node node)
	{
		if (value != null && !isExcluded(obj, fieldname, value, true))
		{
			if (isReference(obj, fieldname, value, true))
			{
				Object tmp = enc.getId(value);

				if (tmp == null)
				{
					log.log(Level.FINEST, "mxObjectCodec.encode: No ID for "
							+ getName() + "." + fieldname + "=" + value);
					return; // exit
				}

				value = tmp;
			}

			Object defaultValue = getFieldValue(template, fieldname);

			if (fieldname == null || enc.isEncodeDefaults()
					|| defaultValue == null || !defaultValue.equals(value))
			{
				writeAttribute(enc, obj, getAttributeName(fieldname), value,
						node);
			}
		}
	}

	/**
	 * Returns true if the given object is a primitive value.
	 * 
	 * @param value Object that should be checked.
	 * @return Returns true if the given object is a primitive value.
	 */
	protected boolean isPrimitiveValue(Object value)
	{
		return value instanceof String || value instanceof Boolean
				|| value instanceof Character || value instanceof Byte
				|| value instanceof Short || value instanceof Integer
				|| value instanceof Long || value instanceof Float
				|| value instanceof Double || value.getClass().isPrimitive();
	}

	/**
	 * Writes the given value into node using writePrimitiveAttribute
	 * or writeComplexAttribute depending on the type of the value.
	 */
	protected void writeAttribute(mxCodec enc, Object obj, String attr,
			Object value, Node node)
	{
		value = convertValueToXml(value);

		if (isPrimitiveValue(value))
		{
			writePrimitiveAttribute(enc, obj, attr, value, node);
		}
		else
		{
			writeComplexAttribute(enc, obj, attr, value, node);
		}
	}

	/**
	 * Writes the given value as an attribute of the given node.
	 */
	protected void writePrimitiveAttribute(mxCodec enc, Object obj,
			String attr, Object value, Node node)
	{
		if (attr == null || obj instanceof Map)
		{
			Node child = enc.document.createElement("add");

			if (attr != null)
			{
				mxCodec.setAttribute(child, "as", attr);
			}

			mxCodec.setAttribute(child, "value", value);
			node.appendChild(child);
		}
		else
		{
			mxCodec.setAttribute(node, attr, value);
		}
	}

	/**
	 * Writes the given value as a child node of the given node.
	 */
	protected void writeComplexAttribute(mxCodec enc, Object obj, String attr,
			Object value, Node node)
	{
		Node child = enc.encode(value);

		if (child != null)
		{
			if (attr != null)
			{
				mxCodec.setAttribute(child, "as", attr);
			}

			node.appendChild(child);
		}
		else
		{
			log.log(Level.FINEST, "mxObjectCodec.encode: No node for " + getName()
					+ "." + attr + ": " + value);
		}
	}

	/**
	 * Converts true to "1" and false to "0". All other values are ignored.
	 */
	protected Object convertValueToXml(Object value)
	{
		if (value instanceof Boolean)
		{
			value = ((Boolean) value).booleanValue() ? "1" : "0";
		}

		return value;
	}

	/**
	 * Converts XML attribute values to object of the given type.
	 */
	protected Object convertValueFromXml(Class<?> type, Object value)
	{
		if (value instanceof String)
		{
			String tmp = (String) value;

			if (type.equals(boolean.class) || type == Boolean.class)
			{
				if (tmp.equals("1") || tmp.equals("0"))
				{
					tmp = (tmp.equals("1")) ? "true" : "false";
				}

				value = Boolean.valueOf(tmp);
			}
			else if (type.equals(char.class) || type == Character.class)
			{
				value = Character.valueOf(tmp.charAt(0));
			}
			else if (type.equals(byte.class) || type == Byte.class)
			{
				value = Byte.valueOf(tmp);
			}
			else if (type.equals(short.class) || type == Short.class)
			{
				value = Short.valueOf(tmp);
			}
			else if (type.equals(int.class) || type == Integer.class)
			{
				value = Integer.valueOf(tmp);
			}
			else if (type.equals(long.class) || type == Long.class)
			{
				value = Long.valueOf(tmp);
			}
			else if (type.equals(float.class) || type == Float.class)
			{
				value = Float.valueOf(tmp);
			}
			else if (type.equals(double.class) || type == Double.class)
			{
				value = Double.valueOf(tmp);
			}
		}

		return value;
	}

	/**
	 * Returns the XML node attribute name for the given Java field name. That
	 * is, it returns the mapping of the field name.
	 */
	protected String getAttributeName(String fieldname)
	{
		if (fieldname != null)
		{
			Object mapped = mapping.get(fieldname);

			if (mapped != null)
			{
				fieldname = mapped.toString();
			}
		}

		return fieldname;
	}

	/**
	 * Returns the Java field name for the given XML attribute name. That is, it
	 * returns the reverse mapping of the attribute name.
	 * 
	 * @param attributename
	 *            The attribute name to be mapped.
	 * @return String that represents the mapped field name.
	 */
	protected String getFieldName(String attributename)
	{
		if (attributename != null)
		{
			Object mapped = reverse.get(attributename);

			if (mapped != null)
			{
				attributename = mapped.toString();
			}
		}

		return attributename;
	}

	/**
	 * Returns the field with the specified name.
	 */
	protected Field getField(Object obj, String fieldname)
	{
		Class<?> type = obj.getClass();

		// Creates the fields cache
		if (fields == null)
		{
			fields = new HashMap<Class, Map<String, Field>>();
		}

		// Creates the fields cache entry for the given type
		Map<String, Field> map = fields.get(type);

		if (map == null)
		{
			map = new HashMap<String, Field>();
			fields.put(type, map);
		}

		// Tries to get cached field
		Field field = map.get(fieldname);

		if (field != null)
		{
			return field;
		}

		while (type != null)
		{
			try
			{
				field = type.getDeclaredField(fieldname);

				if (field != null)
				{
					// Adds field to fields cache
					map.put(fieldname, field);

					return field;
				}
			}
			catch (Exception e)
			{
				log.log(Level.FINEST, "Failed to get field " + fieldname + " in class " + type, e);
			}

			type = type.getSuperclass();
		}

		log.log(Level.FINEST, "Field " + fieldname + " not found in " + obj);
		return null;
	}

	/**
	 * Returns the accessor (getter, setter) for the specified field.
	 */
	protected Method getAccessor(Object obj, Field field, boolean isGetter)
	{
		String name = field.getName();
		name = name.substring(0, 1).toUpperCase() + name.substring(1);

		if (!isGetter)
		{
			name = "set" + name;
		}
		else if (boolean.class.isAssignableFrom(field.getType()))
		{
			name = "is" + name;
		}
		else
		{
			name = "get" + name;
		}

		Method method = (accessors != null) ? accessors.get(name) : null;

		if (method == null)
		{
			try
			{
				if (isGetter)
				{
					method = getMethod(obj, name, null);
				}
				else
				{
					method = getMethod(obj, name,
							new Class[] { field.getType() });
				}
			}
			catch (Exception e)
			{
				log.log(Level.FINEST, "Failed to get method " + name + " from " + obj, e);
			}

			// Adds accessor to cache
			if (method != null)
			{
				if (accessors == null)
				{
					accessors = new Hashtable<String, Method>();
				}

				accessors.put(name, method);
			}
		}

		if (method == null)
		{
			// this should be considered an error in the scope of this method, but the
			// calling code already depends on this method failing softly to filter
			// non-serializable properties, so it gets called for static fields
			// (mxCell.serialVersionUID), non-transient-but-probably-should-be fields
			// (mxCell.children, mxCell.edges)
			// the proper fix is to rewrite the whole thing to use Introspector, like
			// encodeFields already intends, so for now let's just log at a lower level
			if (log.isLoggable(Level.FINER))
				log.finer("Failed to find accessor for " + field + " in " + obj);
		}
		return method;
	}

	/**
	 * Returns the method with the specified signature.
	 */
	protected Method getMethod(Object obj, String methodname, Class[] params)
	{
		Class<?> type = obj.getClass();

		while (type != null)
		{
			try
			{
				Method method = type.getDeclaredMethod(methodname, params);

				if (method != null)
				{
					return method;
				}
			}
			catch (Exception e)
			{
				log.log(Level.FINEST, "Failed to get method " + methodname + " in class " + type, e);
			}

			type = type.getSuperclass();
		}
		return null;
	}

	/**
	 * Returns the value of the field with the specified name in the specified
	 * object instance.
	 */
	protected Object getFieldValue(Object obj, String fieldname)
	{
		Object value = null;

		if (obj != null && fieldname != null)
		{
			Field field = getField(obj, fieldname);

			try
			{
				if (field != null)
				{
					if (Modifier.isPublic(field.getModifiers()))
					{
						value = field.get(obj);
					}
					else
					{
						value = getFieldValueWithAccessor(obj, field);
					}
				}
			}
			catch (IllegalAccessException e1)
			{
				value = getFieldValueWithAccessor(obj, field);
			}
			catch (Exception e)
			{
				log.log(Level.FINEST, "Failed to get value from field " + fieldname + " in " + obj, e);
			}
		}

		return value;
	}

	/**
	 * Returns the value of the field using the accessor for the field if one exists.
	 */
	protected Object getFieldValueWithAccessor(Object obj, Field field)
	{
		Object value = null;

		if (field != null)
		{
			try
			{
				Method method = getAccessor(obj, field, true);

				if (method != null)
				{
					value = method.invoke(obj, (Object[]) null);
				}
			}
			catch (Exception e)
			{
				log.log(Level.FINEST, "Failed to get value from field " + field + " in " + obj, e);
			}
		}

		return value;
	}

	/**
	 * Sets the value of the field with the specified name
	 * in the specified object instance.
	 */
	protected void setFieldValue(Object obj, String fieldname, Object value)
	{
		Field field = null;

		try
		{
			field = getField(obj, fieldname);

			if (field != null)
			{
				if (field.getType() == Boolean.class)
				{
					value = (value.equals("1") || String.valueOf(value)
							.equalsIgnoreCase("true")) ? Boolean.TRUE
							: Boolean.FALSE;
				}

				if (Modifier.isPublic(field.getModifiers()))
				{
					field.set(obj, value);
				}
				else
				{
					setFieldValueWithAccessor(obj, field, value);
				}
			}
		}
		catch (IllegalAccessException e1)
		{
			setFieldValueWithAccessor(obj, field, value);
		}
		catch (Exception e)
		{
			log.log(Level.FINEST, "Failed to set value \"" + value + "\" to field " + fieldname + " in " + obj, e);
		}
	}

	/**
	 * Sets the value of the given field using the accessor if one exists.
	 */
	protected void setFieldValueWithAccessor(Object obj, Field field,
			Object value)
	{
		if (field != null)
		{
			try
			{
				Method method = getAccessor(obj, field, false);

				if (method != null)
				{
					Class<?> type = method.getParameterTypes()[0];
					value = convertValueFromXml(type, value);

					// Converts collection to a typed array before setting
					if (type.isArray() && value instanceof Collection)
					{
						Collection<?> coll = (Collection<?>) value;
						value = coll.toArray((Object[]) Array.newInstance(
								type.getComponentType(), coll.size()));
					}

					method.invoke(obj, new Object[] { value });
				}
			}
			catch (Exception e)
			{
				log.log(Level.FINEST, "setFieldValue: " + e + " on "
						+ obj.getClass().getSimpleName() + "."
						+ field.getName() + " ("
						+ field.getType().getSimpleName() + ") = " + value
						+ " (" + value.getClass().getSimpleName() + ")", e);
			}
		}
	}

	/**
	 * Hook for subclassers to pre-process the object before encoding. This
	 * returns the input object. The return value of this function is used in
	 * encode to perform the default encoding into the given node.
	 * 
	 * @param enc Codec that controls the encoding process.
	 * @param obj Object to be encoded.
	 * @param node XML node to encode the object into.
	 * @return Returns the object to be encoded by the default encoding.
	 */
	public Object beforeEncode(mxCodec enc, Object obj, Node node)
	{
		return obj;
	}

	/**
	 * Hook for subclassers to post-process the node for the given object after
	 * encoding and return the post-processed node. This implementation returns
	 * the input node. The return value of this method is returned to the
	 * encoder from <encode>.
	 * 
	 * Parameters:
	 * 
	 * @param enc Codec that controls the encoding process.
	 * @param obj Object to be encoded.
	 * @param node XML node that represents the default encoding.
	 * @return Returns the resulting node of the encoding.
	 */
	public Node afterEncode(mxCodec enc, Object obj, Node node)
	{
		return node;
	}

	/**
	 * Parses the given node into the object or returns a new object
	 * representing the given node.
	 * 
	 * @param dec Codec that controls the encoding process.
	 * @param node XML node to be decoded.
	 * @return Returns the resulting object that represents the given XML node.
	 */
	public Object decode(mxCodec dec, Node node)
	{
		return decode(dec, node, null);
	}

	/**
	 * Parses the given node into the object or returns a new object
	 * representing the given node.
	 * 
	 * Dec is a reference to the calling decoder. It is used to decode complex
	 * objects and resolve references.
	 * 
	 * If a node has an id attribute then the object cache is checked for the
	 * object. If the object is not yet in the cache then it is constructed
	 * using the constructor of <template> and cached in <mxCodec.objects>.
	 * 
	 * This implementation decodes all attributes and childs of a node according
	 * to the following rules:
	 *  - If the variable name is in <exclude> or if the attribute name is "id"
	 * or "as" then it is ignored. - If the variable name is in <idrefs> then
	 * <mxCodec.getObject> is used to replace the reference with an object. -
	 * The variable name is mapped using a reverse <mapping>. - If the value has
	 * a child node, then the codec is used to create a child object with the
	 * variable name taken from the "as" attribute. - If the object is an array
	 * and the variable name is empty then the value or child object is appended
	 * to the array. - If an add child has no value or the object is not an
	 * array then the child text content is evaluated using <mxUtils.eval>.
	 * 
	 * If no object exists for an ID in <idrefs> a warning is issued in
	 * System.err.
	 * 
	 * @param dec Codec that controls the encoding process.
	 * @param node XML node to be decoded.
	 * @param into Optional object to encode the node into.
	 * @return Returns the resulting object that represents the given XML node
	 * or the object given to the method as the into parameter.
	 */
	public Object decode(mxCodec dec, Node node, Object into)
	{
		Object obj = null;

		if (node instanceof Element)
		{
			String id = ((Element) node).getAttribute("id");
			obj = dec.objects.get(id);

			if (obj == null)
			{
				obj = into;

				if (obj == null)
				{
					obj = cloneTemplate(node);
				}

				if (id != null && id.length() > 0)
				{
					dec.putObject(id, obj);
				}
			}

			node = beforeDecode(dec, node, obj);
			decodeNode(dec, node, obj);
			obj = afterDecode(dec, node, obj);
		}

		return obj;
	}

	/**
	 * Calls decodeAttributes and decodeChildren for the given node.
	 */
	protected void decodeNode(mxCodec dec, Node node, Object obj)
	{
		if (node != null)
		{
			decodeAttributes(dec, node, obj);
			decodeChildren(dec, node, obj);
		}
	}

	/**
	 * Decodes all attributes of the given node using decodeAttribute.
	 */
	protected void decodeAttributes(mxCodec dec, Node node, Object obj)
	{
		NamedNodeMap attrs = node.getAttributes();

		if (attrs != null)
		{
			for (int i = 0; i < attrs.getLength(); i++)
			{
				Node attr = attrs.item(i);
				decodeAttribute(dec, attr, obj);
			}
		}
	}

	/**
	 * Reads the given attribute into the specified object.
	 */
	protected void decodeAttribute(mxCodec dec, Node attr, Object obj)
	{
		String name = attr.getNodeName();

		if (!name.equalsIgnoreCase("as") && !name.equalsIgnoreCase("id"))
		{
			Object value = attr.getNodeValue();
			String fieldname = getFieldName(name);

			if (isReference(obj, fieldname, value, false))
			{
				Object tmp = dec.getObject(String.valueOf(value));

				if (tmp == null)
				{
					log.log(Level.FINEST, "mxObjectCodec.decode: No object for "
							+ getName() + "." + fieldname + "=" + value);
					return; // exit
				}

				value = tmp;
			}

			if (!isExcluded(obj, fieldname, value, false))
			{
				setFieldValue(obj, fieldname, value);
			}
		}
	}

	/**
	 * Decodec all children of the given node using decodeChild.
	 */
	protected void decodeChildren(mxCodec dec, Node node, Object obj)
	{
		Node child = node.getFirstChild();

		while (child != null)
		{
			if (child.getNodeType() == Node.ELEMENT_NODE
					&& !processInclude(dec, child, obj))
			{
				decodeChild(dec, child, obj);
			}

			child = child.getNextSibling();
		}
	}

	/**
	 * Reads the specified child into the given object.
	 */
	protected void decodeChild(mxCodec dec, Node child, Object obj)
	{
		String fieldname = getFieldName(((Element) child).getAttribute("as"));

		if (fieldname == null || !isExcluded(obj, fieldname, child, false))
		{
			Object template = getFieldTemplate(obj, fieldname, child);
			Object value = null;

			if (child.getNodeName().equals("add"))
			{
				value = ((Element) child).getAttribute("value");

				if (value == null)
				{
					value = child.getTextContent();
				}
			}
			else
			{
				value = dec.decode(child, template);
				// log.log(Level.FINEST, "Decoded " + child.getNodeName() + "."
				// + fieldname + "=" + value);
			}

			addObjectValue(obj, fieldname, value, template);
		}
	}

	/**
	 * Returns the template instance for the given field. This returns the
	 * value of the field, null if the value is an array or an empty collection
	 * if the value is a collection. The value is then used to populate the
	 * field for a new instance. For strongly typed languages it may be
	 * required to override this to return the correct collection instance
	 * based on the encoded child.
	 */
	protected Object getFieldTemplate(Object obj, String fieldname, Node child)
	{
		Object template = getFieldValue(obj, fieldname);

		// Arrays are replaced completely
		if (template != null && template.getClass().isArray())
		{
			template = null;
		}
		// Collections are cleared
		else if (template instanceof Collection)
		{
			((Collection<?>) template).clear();
		}

		return template;
	}

	/**
	 * Sets the decoded child node as a value of the given object. If the
	 * object is a map, then the value is added with the given fieldname as a
	 * key. If the fieldname is not empty, then setFieldValue is called or
	 * else, if the object is a collection, the value is added to the
	 * collection. For strongly typed languages it may be required to
	 * override this with the correct code to add an entry to an object.
	 */
	protected void addObjectValue(Object obj, String fieldname, Object value,
			Object template)
	{
		if (value != null && !value.equals(template))
		{
			if (fieldname != null && obj instanceof Map)
			{
				((Map) obj).put(fieldname, value);
			}
			else if (fieldname != null && fieldname.length() > 0)
			{
				setFieldValue(obj, fieldname, value);
			}
			// Arrays are treated as collections and
			// converted in setFieldValue
			else if (obj instanceof Collection)
			{
				((Collection) obj).add(value);
			}
		}
	}

	/**
	 * Returns true if the given node is an include directive and executes the
	 * include by decoding the XML document. Returns false if the given node is
	 * not an include directive.
	 * 
	 * @param dec Codec that controls the encoding/decoding process.
	 * @param node XML node to be checked.
	 * @param into Optional object to pass-thru to the codec.
	 * @return Returns true if the given node was processed as an include.
	 */
	public boolean processInclude(mxCodec dec, Node node, Object into)
	{
		if (node.getNodeType() == Node.ELEMENT_NODE
				&& node.getNodeName().equalsIgnoreCase("include"))
		{
			String name = ((Element) node).getAttribute("name");

			if (name != null)
			{
				try
				{
					Node xml = mxUtils.loadDocument(
							mxObjectCodec.class.getResource(name).toString())
							.getDocumentElement();

					if (xml != null)
					{
						dec.decode(xml, into);
					}
				}
				catch (Exception e)
				{
					log.log(Level.FINEST, "Cannot process include: " + name, e);
				}
			}

			return true;
		}

		return false;
	}

	/**
	 * Hook for subclassers to pre-process the node for the specified object
	 * and return the node to be used for further processing by
	 * {@link #decode(mxCodec, Node)}. The object is created based on the
	 * template in the calling method and is never null.
	 * 
	 * This implementation returns the input node. The return value of this
	 * function is used in {@link #decode(mxCodec, Node)} to perform the
	 * default decoding into the given object.
	 * 
	 * @param dec Codec that controls the decoding process.
	 * @param node XML node to be decoded.
	 * @param obj Object to encode the node into.
	 * @return Returns the node used for the default decoding.
	 */
	public Node beforeDecode(mxCodec dec, Node node, Object obj)
	{
		return node;
	}

	/**
	 * Hook for subclassers to post-process the object after decoding. This
	 * implementation returns the given object without any changes. The return
	 * value of this method is returned to the decoder from
	 * {@link #decode(mxCodec, Node)}.
	 * 
	 * @param dec Codec that controls the decoding process.
	 * @param node XML node to be decoded.
	 * @param obj Object that represents the default decoding.
	 * @return Returns the result of the decoding process.
	 */
	public Object afterDecode(mxCodec dec, Node node, Object obj)
	{
		return obj;
	}

}

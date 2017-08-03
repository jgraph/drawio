package com.mxgraph.io.gliffy.importer;

import java.util.HashMap;
import java.util.Map;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;
import java.util.logging.Logger;

public class StencilTranslator
{
	private static Logger logger = Logger.getLogger("StencilTranslator");

	private static Map<String, String> translationTable = new HashMap<String, String>();

	static
	{
		init();
	};

	private static void init()
	{
		ResourceBundle rb = PropertyResourceBundle
				.getBundle("com/mxgraph/io/gliffy/importer/gliffyTranslation");
		for (String key : rb.keySet())
		{
			translationTable.put(key, rb.getString(key));
		}
	}

	public static String translate(String gliffyShapeKey, String tid)
	{
		String shape = translationTable.get(gliffyShapeKey);
		
		if (shape == null && tid != null)
			shape = translationTable.get(tid);
		
		logger.info(gliffyShapeKey + " -> " + shape);
		
		return shape;
	}
}

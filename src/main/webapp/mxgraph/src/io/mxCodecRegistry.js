/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
var mxCodecRegistry =
{
	/**
	 * Class: mxCodecRegistry
	 *
	 * Singleton class that acts as a global registry for codecs.
	 *
	 * Adding an <mxCodec>:
	 *
	 * 1. Define a default codec with a new instance of the 
	 * object to be handled.
	 *
	 * (code)
	 * var codec = new mxObjectCodec(new mxGraphModel());
	 * (end)
	 *
	 * 2. Define the functions required for encoding and decoding
	 * objects.
	 *
	 * (code)
	 * codec.encode = function(enc, obj) { ... }
	 * codec.decode = function(dec, node, into) { ... }
	 * (end)
	 *
	 * 3. Register the codec in the <mxCodecRegistry>.
	 *
	 * (code)
	 * mxCodecRegistry.register(codec);
	 * (end)
	 *
	 * <mxObjectCodec.decode> may be used to either create a new 
	 * instance of an object or to configure an existing instance, 
	 * in which case the into argument points to the existing
	 * object. In this case, we say the codec "configures" the
	 * object.
	 * 
	 * Variable: codecs
	 *
	 * Maps from constructor names to codecs.
	 */
	codecs: [],
	
	/**
	 * Variable: aliases
	 *
	 * Maps from classnames to codecnames.
	 */
	aliases: [],

	/**
	 * Function: register
	 *
	 * Registers a new codec and associates the name of the template
	 * constructor in the codec with the codec object.
	 *
	 * Parameters:
	 *
	 * codec - <mxObjectCodec> to be registered.
	 */
	register: function(codec)
	{
		if (codec != null)
		{
			var name = codec.getName();
			mxCodecRegistry.codecs[name] = codec;
			
			var classname = mxUtils.getFunctionName(codec.template.constructor);

			if (classname != name)
			{
				mxCodecRegistry.addAlias(classname, name);
			}
		}

		return codec;
	},

	/**
	 * Function: addAlias
	 *
	 * Adds an alias for mapping a classname to a codecname.
	 */
	addAlias: function(classname, codecname)
	{
		mxCodecRegistry.aliases[classname] = codecname;
	},

	/**
	 * Function: getCodec
	 *
	 * Returns a codec that handles objects that are constructed
	 * using the given constructor.
	 *
	 * Parameters:
	 *
	 * ctor - JavaScript constructor function. 
	 */
	getCodec: function(ctor)
	{
		var codec = null;
		
		if (ctor != null)
		{
			var name = mxUtils.getFunctionName(ctor);
			var tmp = mxCodecRegistry.aliases[name];
			
			if (tmp != null)
			{
				name = tmp;
			}
			
			codec = mxCodecRegistry.codecs[name];
			
			// Registers a new default codec for the given constructor
			// if no codec has been previously defined.
			if (codec == null)
			{
				try
				{
					codec = new mxObjectCodec(new ctor());
					mxCodecRegistry.register(codec);
				}
				catch (e)
				{
					// ignore
				}
			}
		}
		
		return codec;
	}

};

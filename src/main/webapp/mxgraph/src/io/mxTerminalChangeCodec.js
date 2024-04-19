/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
mxCodecRegistry.register(function()
{
	/**
	 * Class: mxTerminalChangeCodec
	 *
	 * Codec for <mxTerminalChange>s. This class is created and registered
	 * dynamically at load time and used implicitly via <mxCodec> and
	 * the <mxCodecRegistry>.
	 *
	 * Transient Fields:
	 *
	 * - model
	 * - previous
	 *
	 * Reference Fields:
	 *
	 * - cell
	 * - terminal
	 */
	var codec = new mxObjectCodec(new mxTerminalChange(),
		['model', 'previous'], ['cell', 'terminal']);

	/**
	 * Function: afterDecode
	 *
	 * Restores the state by assigning the previous value.
	 */
	codec.afterDecode = function(dec, node, obj)
	{
		obj.previous = obj.terminal;
		
		return obj;
	};

	// Returns the codec into the registry
	return codec;

}());

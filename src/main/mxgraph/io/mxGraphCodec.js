/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
mxCodecRegistry.register(function()
{
	/**
	 * Class: mxGraphCodec
	 *
	 * Codec for <mxGraph>s. This class is created and registered
	 * dynamically at load time and used implicitly via <mxCodec>
	 * and the <mxCodecRegistry>.
	 *
	 * Transient Fields:
	 *
	 * - graphListeners
	 * - eventListeners
	 * - view
	 * - container
	 * - cellRenderer
	 * - editor
	 * - selection
	 */
	return new mxObjectCodec(new mxGraph(),
		['graphListeners', 'eventListeners', 'view', 'container',
		'cellRenderer', 'editor', 'selection']);

}());

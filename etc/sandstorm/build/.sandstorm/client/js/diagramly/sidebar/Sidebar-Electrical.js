(function()
{
	// Adds electrical stencils
	Sidebar.prototype.addElectricalPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;fillColor=#ffffff;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeWidth=1;' + mxConstants.STYLE_SHAPE;
		var mea = s + '=mxgraph.electrical.abstract.';
		var mec = s + '=mxgraph.electrical.capacitors.';
		var med = 'fillColor=#000000;' + s + '=mxgraph.electrical.diodes.';
		var mei = s + '=mxgraph.electrical.inductors.';
		var mem = s + '=mxgraph.electrical.miscellaneous.';
		var meem = s + '=mxgraph.electrical.electro-mechanical.';
		var mel = s + '=mxgraph.electrical.logic_gates.';
		var mef1 = s + '=mxgraph.electrical.mosfets1.';
		var mef2 = s + '=mxgraph.electrical.mosfets2.';
		var met = s + '=mxgraph.electrical.transistors.';
		var meoe = s + '=mxgraph.electrical.opto_electronics.';
		var mep = s + '=mxgraph.electrical.plc_ladder.';
		var mer = s + '=mxgraph.electrical.radio.';
		var mere = s + '=mxgraph.electrical.resistors.';
		var mess = s + '=mxgraph.electrical.signal_sources.';
		var metd = s + '=mxgraph.electrical.thermionic_devices.';
		var mew = s + '=mxgraph.electrical.waveforms.';
		var mein = 'perimeter=ellipsePerimeter;' + s + '=mxgraph.electrical.instruments.';
		var meiecl = s + '=mxgraph.electrical.iec_logic_gates.';
		var gnmel = 'mxgraph.electrical.logic_gates';
		var dtmel = 'electrical logic gate ';
		var gnmeiecl = 'mxgraph.electrical.iec_logic_gates';
		var dtmeiecl = 'electrical iec logic gate ';
		var gnmere = 'mxgraph.electrical.resistors';
		var dtmere = 'electrical resistor ';
		var gnmec = 'mxgraph.electrical.capacitors';
		var dtmec = 'electrical capacitor ';
		var gnmei = 'mxgraph.electrical.inductors';
		var dtmei = 'electrical inductor ';
		var gnmeem = 'mxgraph.electrical.electro-mechanical';
		var dtmeem = 'electrical switch relay ';
		var gnmed = 'mxgraph.electrical.diodes';
		var dtmed = 'electrical diode ';
		var gnmess = 'mxgraph.electrical.signal_sources';
		var dtmess = 'electrical signal source ';
		var gnmet = 'mxgraph.electrical.transistors';
		var dtmet = 'electrical transistor ';
		var gnmein = 'mxgraph.electrical.instruments';
		var dtmein = 'electrical instrument ';
		var gnmer = 'mxgraph.electrical.radio';
		var dtmer = 'electrical radio audio ';
		var gnmem = 'mxgraph.electrical.miscellaneous';
		var dtmem = 'electrical ';
		var gnmea = 'mxgraph.electrical.abstract';
		var dtmea = 'electrical ';
		var gnmep = 'mxgraph.electrical.plc_ladder';
		var dtmep = 'electrical plc ladder programmable logic logical controller';
		var gnmeoe = 'mxgraph.electrical.opto_electronics';
		var dtmeoe = 'electrical optical ';
		var gnmetd = 'mxgraph.electrical.thermionic_devices';
		var dtmetd = 'electrical thermionic thermo device vacuum tube ';
		var gnmew = 'mxgraph.electrical.waveforms';
		var dtmew = 'electrical waveform signal ';

		this.addPaletteFunctions('eeLogicGates', 'Electrical / Logic Gates', false,
		[
			this.createVertexTemplateEntry(mel + 'and;', 100, 60, '', 'AND', null, null, this.getTagsForStencil(gnmel, 'and', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'buffer;', 100, 60, '', 'Buffer', null, null, this.getTagsForStencil(gnmel, 'buffer', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'd_type_flip-flop;', 100, 80, '', 'D Type Flip-Flop', null, null, this.getTagsForStencil(gnmel, 'd_type_flip-flop', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'd_type_flip-flop_with_clear;', 100, 90, '', 'D Type Flip-Flop With Clear', null, null, this.getTagsForStencil(gnmel, 'd_type_flip-flop_with_clear', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'd_type_rs_flip-flop;', 100, 100, '', 'D Type RS Flip-Flop', null, null, this.getTagsForStencil(gnmel, 'd_type_rs_flip-flop', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'inverter;', 100, 60, '', 'Inverter', null, null, this.getTagsForStencil(gnmel, 'inverter', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'inverting_contact;', 5, 5, '', 'Inverting Contact', null, null, this.getTagsForStencil(gnmel, 'inverting_contact', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'jk_flip-flop;', 100, 80, '', 'JK Flip-Flop', null, null, this.getTagsForStencil(gnmel, 'jk_flip-flop', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'jk_flip-flop_with_clear;', 100, 90, '', 'JK Flip-Flop With Clear', null, null, this.getTagsForStencil(gnmel, 'jk_flip-flop_with_clear', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'jk_flip-flop_with_sr;', 100, 100, '', 'JK Flip-Flop With SR', null, null, this.getTagsForStencil(gnmel, 'jk_flip-flop_with_sr', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'nand;', 100, 60, '', 'NAND', null, null, this.getTagsForStencil(gnmel, 'nand', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'nor;', 100, 60, '', 'NOR', null, null, this.getTagsForStencil(gnmel, 'nor', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'or;', 100, 60, '', 'OR', null, null, this.getTagsForStencil(gnmel, 'or', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'rs_latch;', 100, 80, '', 'RS Latch', null, null, this.getTagsForStencil(gnmel, 'rs_latch', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'synchronous_rs_latch;', 100, 80, '', 'RS Latch (Synchronous)', null, null, this.getTagsForStencil(gnmel, 'synchronous_rs_latch', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'schmitt_trigger;', 100, 60, '', 'Schmitt Trigger', null, null, this.getTagsForStencil(gnmel, 'schmitt_trigger', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 't_type_flip-flop;', 100, 80, '', 'T Type Flip-Flop', null, null, this.getTagsForStencil(gnmel, 't_type_flip-flop', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'xnor;', 100, 60, '', 'XNOR', null, null, this.getTagsForStencil(gnmel, 'xnor', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'xor;', 100, 60, '', 'XOR', null, null, this.getTagsForStencil(gnmel, 'xor', dtmel).join(' ')),
			this.createVertexTemplateEntry(meiecl + 'and;', 60, 80, '', 'AND (IEC)', null, null, this.getTagsForStencil(gnmeiecl, 'and', dtmeiecl).join(' ')),
			this.createVertexTemplateEntry(meiecl + 'nand;', 66, 80, '', 'NAND (IEC)', null, null, this.getTagsForStencil(gnmeiecl, 'nand', dtmeiecl).join(' ')),
			this.createVertexTemplateEntry(meiecl + 'or;', 60, 80, '', 'OR (IEC)', null, null, this.getTagsForStencil(gnmeiecl, 'or', dtmeiecl).join(' ')),
			this.createVertexTemplateEntry(meiecl + 'nor;', 66, 80, '', 'NOR (IEC)', null, null, this.getTagsForStencil(gnmeiecl, 'nor', dtmeiecl).join(' ')),
			this.createVertexTemplateEntry(meiecl + 'not;', 66, 80, '', 'NOT (IEC)', null, null, this.getTagsForStencil(gnmeiecl, 'xor', dtmeiecl).join(' ')),
			this.createVertexTemplateEntry(meiecl + 'xor;', 60, 80, '', 'XOR (IEC)', null, null, this.getTagsForStencil(gnmeiecl, 'xor', dtmeiecl).join(' '))
		]);

		this.addPaletteFunctions('eeResistors', 'Electrical / Resistors', false,
		[
			this.createVertexTemplateEntry(mere + 'resistor_1;', 
					100, 20, '', 'Resistor', null, null, this.getTagsForStencil(gnmere, 'resistor_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'resistor_2;', 
					100, 20, '', 'Resistor', null, null, this.getTagsForStencil(gnmere, 'resistor_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'potentiometer_1;', 
					100, 40, '', 'Potentiometer', null, null, this.getTagsForStencil(gnmere, 'potentiometer_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'potentiometer_2;', 
					100, 40, '', 'Potentiometer', null, null, this.getTagsForStencil(gnmere, 'potentiometer_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'trimmer_pot_1;', 
					100, 40, '', 'Potentiometer (Trimmer)', null, null, this.getTagsForStencil(gnmere, 'trimmer_pot_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'trimmer_pot_2;', 
					100, 40, '', 'Potentiometer (Trimmer)', null, null, this.getTagsForStencil(gnmere, 'trimmer_pot_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'trimmer_resistor_1;', 
					100, 65.5, '', 'Resistor (Trimmer)', null, null, this.getTagsForStencil(gnmere, 'trimmer_resistor_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'trimmer_resistor_2;', 
					100, 65.5, '', 'Resistor (Trimmer)', null, null, this.getTagsForStencil(gnmere, 'trimmer_resistor_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'variable_resistor_1;', 
					100, 60, '', 'Resistor (Variable)', null, null, this.getTagsForStencil(gnmere, 'variable_resistor_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'variable_resistor_2;', 
					100, 60, '', 'Resistor (Variable)', null, null, this.getTagsForStencil(gnmere, 'variable_resistor_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'resistor_with_instrument_or_relay_shunt;', 
					100, 20, '', 'Resistor (Instrument/Relay Shunt)', null, null, this.getTagsForStencil(gnmere, 'resistor_with_instrument_or_relay_shunt', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'resistor,_adjustable_contact;', 
					100, 40, '', 'Resistor (Adjustable Contact)', null, null, this.getTagsForStencil(gnmere, 'resistor,_adjustable_contact', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'resistor,_shunt;', 
					100, 45, '', 'Resistor (Shunt)', null, null, this.getTagsForStencil(gnmere, 'resistor,_shunt', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'symmetrical_varistor;', 
					100, 60, '', 'Varistor (Symmetrical)', null, null, this.getTagsForStencil(gnmere, 'symmetrical_varistor', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'tapped_resistor;', 
					100, 40, '', 'Resistor (Tapped)', null, null, this.getTagsForStencil(gnmere, 'tapped_resistor', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'nonlinear_resistor;', 
					100, 60, '', 'Resistor (Nonlinear)', null, null, this.getTagsForStencil(gnmere, 'nonlinear_resistor', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'memristor_1;', 
					100, 20, '', 'Memristor', null, null, this.getTagsForStencil(gnmere, 'memristor_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'memristor_2;', 
					100, 24, '', 'Memristor', null, null, this.getTagsForStencil(gnmere, 'memristor_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'magnetoresistor;', 
					100, 60, '', 'Magnetoresistor', null, null, this.getTagsForStencil(gnmere, 'magnetoresistor', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'symmetrical_photoconductive_transducer;', 
					100, 40, '', 'Photoconductive Transducer (Symmetrical)', null, null, this.getTagsForStencil(gnmere, 'symmetrical_photoconductive_transducer', dtmere).join(' '))
		]);
		
		this.addPaletteFunctions('eeCapacitors', 'Electrical / Capacitors', false,
		[
			this.createVertexTemplateEntry(mec + 'capacitor_1;', 
					100, 60, '', 'Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'capacitor_1', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'capacitor_2;', 
					100, 60, '', 'Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'capacitor_2', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'capacitor_3;', 
					100, 60, '', 'Electrolytic Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'capacitor_3', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'capacitor_4;', 
					100, 60, '', 'Capacitor (UK)', null, null, this.getTagsForStencil(gnmec, 'capacitor_4', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'capacitor_5;', 
					100, 60, '', 'Electrolytic Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'capacitor_5', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'capacitor_6;', 
					100, 60, '', 'Capacitor', null, null, this.getTagsForStencil(gnmec, 'capacitor_6', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'differential_capacitor;', 
					100, 80, '', 'Differential Capacitor', null, null, this.getTagsForStencil(gnmec, 'differential_capacitor', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'trimmer_capacitor_1;', 
					100, 65.5, '', 'Tuning Variable Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'trimmer_capacitor_1', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'trimmer_capacitor_2;', 
					100, 65.5, '', 'Tuning Variable Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'trimmer_capacitor_2', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'variable_capacitor_1;', 
					100, 60, '', 'Trimmer Variable Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'variable_capacitor_1', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'variable_capacitor_2;', 
					100, 60, '', 'Trimmer Variable Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'variable_capacitor_2', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'feed_through_capacitor;', 
					100, 90, '', 'Feed Through Capacitor', null, null, this.getTagsForStencil(gnmec, 'feed_through_capacitor', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'ganged_capacitor;', 
					100, 130, '', 'Ganged Capacitor', null, null, this.getTagsForStencil(gnmec, 'ganged_capacitor', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'multiple_capacitor;', 
					100, 130, '', 'Multiple Capacitor', null, null, this.getTagsForStencil(gnmec, 'multiple_capacitor', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'multiple_electrolytic_capacitor_comm_neg;', 
					100, 130, '', 'Multiple Electrolytic Capacitor (Common Negative)', null, null, this.getTagsForStencil(gnmec, 'multiple_electrolytic_capacitor_comm_neg', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'multiple_electrolytic_capacitor_comm_pos;', 
					100, 130, '', 'Multiple Electrolytic Capacitor (Common Positive)', null, null, this.getTagsForStencil(gnmec, 'multiple_electrolytic_capacitor_comm_pos', dtmec).join(' '))
		]);

		this.addPaletteFunctions('eeInductors', 'Electrical / Inductors', false,
		[
			this.createVertexTemplateEntry(mei + 'inductor_3;', 
					100, 8, '', 'Inductor (Air Core)', null, null, this.getTagsForStencil(gnmei, 'inductor_3', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'inductor_5;', 
					100, 14, '', 'Inductor (Air Core)', null, null, this.getTagsForStencil(gnmei, 'inductor_5', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'inductor_1;', 
					100, 15, '', 'Inductor (Air Core)', null, null, this.getTagsForStencil(gnmei, 'inductor_1', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'variable_inductor;', 
					100, 60, '', 'Variable', null, null, this.getTagsForStencil(gnmei, 'variable_inductor', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'ferrite_core;', 
					64, 4, '', 'Ferrite Core', null, null, this.getTagsForStencil(gnmei, 'ferrite_core', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'iron_core;', 
					64, 4, '', 'Iron Core', null, null, this.getTagsForStencil(gnmei, 'iron_core', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'transformer_1;', 
					64, 60, '', 'Transformer (Iron Core)', null, null, this.getTagsForStencil(gnmei, 'transformer_1', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'transformer_2;', 
					64, 60, '', 'Transformer (Iron Core)', null, null, this.getTagsForStencil(gnmei, 'transformer_2', dtmei).join(' '))
		]);

		this.addPaletteFunctions('eeSwitchesRelays', 'Electrical / Switches and Relays', false,
		[
			this.createVertexTemplateEntry(meem + '2-way_switch;', 
					75, 26, '', 'SPDT', null, null, this.getTagsForStencil(gnmeem, '2-way_switch', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'push_switch_nc;', 
					75, 10, '', 'Pushbutton NC', null, null, this.getTagsForStencil(gnmeem, 'push_switch_nc', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'push_switch_no;', 
					75, 19, '', 'Pushbutton NO', null, null, this.getTagsForStencil(gnmeem, 'push_switch_no', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'reed_switch;', 
					75, 20, '', 'Reed Switch', null, null, this.getTagsForStencil(gnmeem, 'reed_switch', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'relay_coil;', 
					70, 35, '', 'Relay Coil', null, null, this.getTagsForStencil(gnmeem, 'relay_coil', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'resonator;', 
					100, 50, '', 'Resonator', null, null, this.getTagsForStencil(gnmeem, 'resonator', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'simple_switch;', 
					75, 32, '', 'SPST', null, null, this.getTagsForStencil(gnmeem, 'simple_switch', dtmeem).join(' '))
		]);

		this.addPaletteFunctions('eeDiodes', 'Electrical / Diodes', false,
		[
			this.createVertexTemplateEntry(med + 'diode;', 
					100, 60, '', 'PN Diode', null, null, this.getTagsForStencil(gnmed, 'diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'gunn_diode;', 
					100, 60, '', 'Gunn Diode', null, null, this.getTagsForStencil(gnmed, 'gunn_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'schottky_diode;', 
					100, 60, '', 'Schottky Diode', null, null, this.getTagsForStencil(gnmed, 'schottky_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'zener_diode_2;', 
					100, 60, '', 'Breakdown', null, null, this.getTagsForStencil(gnmed, 'zener_diode_2', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'tunnel_diode;', 
					100, 60, '', 'Tunnel Diode 1', null, null, this.getTagsForStencil(gnmed, 'tunnel_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'tunnel_diode_2;', 
					100, 80, '', 'Tunnel Diode 2', null, null, this.getTagsForStencil(gnmed, 'tunnel_diode_2', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'field_effect_diode;', 
					100, 60, '', 'Field Effect Diode', null, null, this.getTagsForStencil(gnmed, 'field_effect_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'varactor_-_varicap;', 
					100, 60, '', 'Varactor - Varicap', null, null, this.getTagsForStencil(gnmed, 'varactor_-_varicap', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'zener_diode_1;', 
					100, 60, '', 'Zener Diode 1', null, null, this.getTagsForStencil(gnmed, 'zener_diode_1', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'zener_diode_3;', 
					100, 60, '', 'Zener Diode 2', null, null, this.getTagsForStencil(gnmed, 'zener_diode_3', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'four_layer_diode;', 
					100, 80, '', 'Four Layer Diode', null, null, this.getTagsForStencil(gnmed, 'four_layer_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'transorb_1;', 
					100, 60, '', 'Transorb 1', null, null, this.getTagsForStencil(gnmed, 'transorb_1', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'transorb_2;', 
					100, 60, '', 'Transorb 2', null, null, this.getTagsForStencil(gnmed, 'transorb_2', dtmed).join(' '))
		]);
		
		this.addPaletteFunctions('eeSources', 'Electrical / Sources', false,
		[
			this.createVertexTemplateEntry(mess + 'ac_source;', 
					60, 60, '', 'AC', null, null, this.getTagsForStencil(gnmess, 'ac_source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'current_source;', 
					40, 60, '', 'Current', null, null, this.getTagsForStencil(gnmess, 'current_source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'dc_source_1;', 
					70, 75, '', 'DC', null, null, this.getTagsForStencil(gnmess, 'dc_source_1', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'dc_source_2;', 
					60, 60, '', 'DC', null, null, this.getTagsForStencil(gnmess, 'dc_source_2', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'dc_source_3;', 
					60, 60, '', 'DC', null, null, this.getTagsForStencil(gnmess, 'dc_source_3', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'dependent_source_1;', 
					60, 60, '', 'Dependent', null, null, this.getTagsForStencil(gnmess, 'dependent_source_1', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'dependent_source_2;', 
					60, 60, '', 'Dependent', null, null, this.getTagsForStencil(gnmess, 'dependent_source_2', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'dependent_source_3;', 
					60, 60, '', 'Dependent', null, null, this.getTagsForStencil(gnmess, 'dependent_source_3', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'noise_source;', 
					60, 60, '', 'Noise', null, null, this.getTagsForStencil(gnmess, 'noise_source', dtmess).join(' '))
		]);
		
		this.addPaletteFunctions('eeTransistors', 'Electrical / Transistors', false,
		[
			this.createVertexTemplateEntry(met + 'npn_transistor_1;', 
					95, 100, '', 'BJT (NPN)', null, null, this.getTagsForStencil(gnmet, 'npn_transistor_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'pnp_transistor_1;', 
					95, 100, '', 'BJT (PNP)', null, null, this.getTagsForStencil(gnmet, 'pnp_transistor_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'n-channel_jfet_1;', 
					95, 100, '', 'JFET (NPN)', null, null, this.getTagsForStencil(gnmet, 'n-channel_jfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'p-channel_jfet_1;', 
					95, 100, '', 'JFET (PNP)', null, null, this.getTagsForStencil(gnmet, 'p-channel_jfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'n-channel_mosfet_1;', 
					95, 100, '', 'MOSFET (N)', null, null, this.getTagsForStencil(gnmet, 'n-channel_mosfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'p-channel_mosfet_1;', 
					95, 100, '', 'MOSFET (P)', null, null, this.getTagsForStencil(gnmet, 'p-channel_mosfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'mosfet_ic_n;', 
					95, 100, '', 'MOSFET Inductive Channel (N)', null, null, this.getTagsForStencil(gnmet, 'mosfet_ic_n', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'mosfet_ic_p;', 
					95, 100, '', 'MOSFET Inductive Channel (P)', null, null, this.getTagsForStencil(gnmet, 'mosfet_ic_p', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'mosfet_n_no_bulk;', 
					95, 100, '', 'MOSFET No Bulk (N)', null, null, this.getTagsForStencil(gnmet, 'mosfet_n_no_bulk', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'mosfet_p_no_bulk;', 
					95, 100, '', 'MOSFET No Bulk (P)', null, null, this.getTagsForStencil(gnmet, 'mosfet_p_no_bulk', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'p-channel_mosfet_1;', 
					95, 100, '', 'MOSFET (P)', null, null, this.getTagsForStencil(gnmet, 'p-channel_mosfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'dual_gate_mosfet_n;', 
					95, 100, '', 'Dual Gate MOSFET (N)', null, null, this.getTagsForStencil(gnmet, 'dual_gate_mosfet_n', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'dual_gate_mosfet_p;', 
					95, 100, '', 'Dual Gate MOSFET (P)', null, null, this.getTagsForStencil(gnmet, 'dual_gate_mosfet_p', dtmet).join(' '))
		]);

		this.addPaletteFunctions('eeInstruments', 'Electrical / Instruments', false,
		[
			this.createVertexTemplateEntry(mein + 'ampermeter;', 
					90, 90, '', 'Ampermeter', null, null, this.getTagsForStencil(gnmein, 'ampermeter', dtmein).join(' ')),
			this.createVertexTemplateEntry(mein + 'galvanometer;', 
					90, 90, '', 'Galvanometer', null, null, this.getTagsForStencil(gnmein, 'galvanometer', dtmein).join(' ')),
			this.createVertexTemplateEntry(mein + 'oscilloscope;', 
					90, 90, '', 'Oscilloscope', null, null, this.getTagsForStencil(gnmein, 'oscilloscope', dtmein).join(' ')),
			this.createVertexTemplateEntry(mein + 'signal_generator;', 
					90, 90, '', 'Signal Generator', null, null, this.getTagsForStencil(gnmein, 'signal_generator', dtmein).join(' ')),
			this.createVertexTemplateEntry(mein + 'voltmeter;', 
					90, 90, '', 'Voltmeter', null, null, this.getTagsForStencil(gnmein, 'voltmeter', dtmein).join(' '))
		]);

		this.addPaletteFunctions('eeMisc', 'Electrical / Misc', false,
		[
			this.createVertexTemplateEntry(mer + 'aerial_-_antenna_1;', 
					80, 100, '', 'Antenna', null, null, this.getTagsForStencil(gnmer, 'aerial_-_antenna_1', dtmer).join(' ')),
			this.createVertexTemplateEntry(mer + 'aerial_-_antenna_2;', 
					79, 100, '', 'Antenna', null, null, this.getTagsForStencil(gnmer, 'aerial_-_antenna_2', dtmer).join(' ')),
			this.createVertexTemplateEntry(mer + 'loop_antenna;', 
					64.8, 69.78, '', 'Loop Antenna', null, null, this.getTagsForStencil(gnmer, 'loop_antenna', dtmer).join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.electrical.electro-mechanical.motor_1;html=1;shadow=0;dashed=0;fillColor=#ffffff;align=center;fontSize=30;strokeColor=#000000;strokeWidth=1;', 
					100, 60, 'M', 'Electrical Motor', null, null, this.getTagsForStencil(gnmeem, 'motor_1', dtmeem).join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.electrical.electro-mechanical.motor_2;html=1;shadow=0;dashed=0;fillColor=#ffffff;align=center;fontSize=30;strokeColor=#000000;strokeWidth=1;', 
					100, 60, '', 'Motor Armature', null, null, this.getTagsForStencil(gnmeem, 'motor_2', dtmeem).join(' ')),
			this.createVertexTemplateEntry(mem + 'co-ax;', 
					40, 60, '', 'Co-Ax', null, null, this.getTagsForStencil(gnmem, 'co-ax', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'crystal_1;', 
					100, 40, '', 'Crystal', null, null, this.getTagsForStencil(gnmem, 'crystal_1', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'fuse_1;', 
					100, 20, '', 'Fuse (IEC)', null, null, this.getTagsForStencil(gnmem, 'fuse_1', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'fuse_2;', 
					100, 20, '', 'Fuse (IEEE)', null, null, this.getTagsForStencil(gnmem, 'fuse_2', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'fuse_3;', 
					100, 12, '', 'Fuse (obsolete)', null, null, this.getTagsForStencil(gnmem, 'fuse_3', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'fuse_4;', 
					100, 32, '', 'Fuse (IEEE)', null, null, this.getTagsForStencil(gnmem, 'fuse_4', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'light_bulb;', 
					60, 50, '', 'Light Bulb', null, null, this.getTagsForStencil(gnmem, 'light_bulb', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'illuminating_bulb;', 
					60, 50, '', 'Illuminating Bulb', null, null, this.getTagsForStencil(gnmem, 'illuminating_bulb', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'light_bulb;', 
					60, 50, '', 'Pilot Light', null, null, this.getTagsForStencil(gnmem, 'light_bulb', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'neon_lamp_2;', 
					60, 50, '', 'Neon Lamp', null, null, this.getTagsForStencil(gnmem, 'neon_lamp_2', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'thermocouple;', 
					80, 81, '', 'Thermocouple', null, null, this.getTagsForStencil(gnmem, 'thermocouple', dtmem).join(' ')),
			this.createVertexTemplateEntry(mea + 'amplifier;', 
					90, 100, '', 'Amplifier', null, null, this.getTagsForStencil(gnmea, 'amplifier', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'controlled_amplifier;', 
					100, 90, '', 'Controlled Amplifier', null, null, this.getTagsForStencil(gnmea, 'controlled_amplifier', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'dac;', 
					70, 46, '', 'DAC', null, null, this.getTagsForStencil(gnmea, 'dac', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'mux;',
					60, 90, '', 'Mux', null, null, this.getTagsForStencil(gnmea, 'mux', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'demux;', 
					60, 90, '', 'Demux', null, null, this.getTagsForStencil(gnmea, 'demux', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'mux-demux;', 
					60, 90, '', 'Mux-Demux', null, null, this.getTagsForStencil(gnmea, 'mux-demux', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'operational_amp_1;', 
					98, 90, '', 'Operational Amp', null, null, this.getTagsForStencil(gnmea, 'operational_amp_1', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'operational_amp_2;', 
					98, 90, '', 'Operational Amp', null, null, this.getTagsForStencil(gnmea, 'operational_amp_2', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'ota_1;', 
					100, 90, '', 'OTA', null, null, this.getTagsForStencil(gnmea, 'ota_1', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'ota_2;', 
					100, 90, '', 'OTA', null, null, this.getTagsForStencil(gnmea, 'ota_2', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'ota_3;', 
					100, 90, '', 'OTA', null, null, this.getTagsForStencil(gnmea, 'ota_3', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'quantizer;', 
					52, 46, '', 'Quantizer', null, null, this.getTagsForStencil(gnmea, 'quantizer', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'delta;', 
					50, 50, '', 'Delta', null, null, this.getTagsForStencil(gnmea, 'delta', dtmea).join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.electrical.abstract.function;html=1;shadow=0;dashed=0;fillColor=#ffffff;align=center;strokeColor=#000000;strokeWidth=1;fontSize=24', 
					50, 50, 'fn', 'Function', null, null, this.getTagsForStencil(gnmea, 'function', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'integrator;', 
					50, 50, '', 'Integrator', null, null, this.getTagsForStencil(gnmea, 'integrator', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'multiplier;', 
					50, 50, '', 'Multiplier', null, null, this.getTagsForStencil(gnmea, 'multiplier', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'sum;', 
					50, 50, '', 'Sum', null, null, this.getTagsForStencil(gnmea, 'sum', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'summation_point;', 
					50, 50, '', 'Summation Point', null, null, this.getTagsForStencil(gnmea, 'summation_point', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'filter;', 
					52, 46, '', 'Filter', null, null, this.getTagsForStencil(gnmea, 'filter', dtmea).join(' ')),
			this.createVertexTemplateEntry(s + '=mxgraph.electrical.logic_gates.bandpass_filter;', 
					52, 46, '', 'Bandpass Filter', null, null, this.getTagsForStencil('mxgraph.electrical.logic_gates', 'bandpass_filter', '').join(' ')),
			this.createVertexTemplateEntry(s + '=mxgraph.electrical.logic_gates.highpass_filter;', 
					52, 46, '', 'Highpass Filter', null, null, this.getTagsForStencil('mxgraph.electrical.logic_gates', 'highpass_filter', '').join(' ')),
			this.createVertexTemplateEntry(s + '=mxgraph.electrical.logic_gates.lowpass_filter;', 
					52, 46, '', 'Lowpass Filter', null, null, this.getTagsForStencil('mxgraph.electrical.logic_gates', 'lowpass_filter', '').join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_SHAPE + '=mxgraph.electrical.abstract.thermistor_with_independent_integral_heater;html=1;shadow=0;dashed=0;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;align=center;overflow=fill;', 
					100, 94.25, 
					'<table cellpadding="0" cellspacing="0" style="width:100%;height:100%;">' +
					'<tr height="45%">' +
					'<td align="center">\\temp\\</td>' +
					'</tr>' +
					'<tr height="55%">' +
					'<td></td>' +
					'</tr>' +
					'</table>', 
					'Thermistor With Independent Integral Heater', null, null, this.getTagsForStencil(gnmea, 'thermistor_with_independent_integral_heater', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'voltage_regulator;', 
					70, 58, '', 'Voltage Regulator', null, null, this.getTagsForStencil(gnmea, 'voltage_regulator', dtmea).join(' ')),
			this.createVertexTemplateEntry(mess + 'vdd;fontSize=24;', 
					60, 40, 
					'V<sub>dd</sub>', 'Vdd', null, null, this.getTagsForStencil(gnmess, 'vdd', dtmess).join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;' + mxConstants.STYLE_SHAPE + '=mxgraph.electrical.signal_sources.vss2;shadow=0;dashed=0;fillColor=#ffffff;align=center;strokeColor=#000000;strokeWidth=1;fontSize=24;html=1;', 
					60, 40, 
					'V<sub>ss</sub>', 'Vss', null, null, this.getTagsForStencil(gnmess, 'vss2', dtmess).join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=top;' + mxConstants.STYLE_VERTICAL_ALIGN + '=bottom;' + mxConstants.STYLE_SHAPE + '=mxgraph.electrical.signal_sources.current_flow;shadow=0;dashed=0;fillColor=#ffffff;align=center;strokeColor=#000000;strokeWidth=1;fontSize=10;html=1;', 
					70, 10, 
					'5 mA',	'Current Flow', null, null, this.getTagsForStencil(gnmess, 'current_flow', dtmess).join(' ')),
			this.createVertexTemplateEntry(mxConstants.STYLE_LABEL_POSITION + '=right;' + mxConstants.STYLE_ALIGN + '=left;' + mxConstants.STYLE_SHAPE + '=mxgraph.electrical.signal_sources.voltage;shadow=0;dashed=0;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;fontSize=10;html=1;', 
					10, 70, 
					'1.2 V', 'Voltage', null, null, this.getTagsForStencil(gnmess, 'voltage', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'equipotential;', 
					90, 90, '', 'Equipotential', null, null, this.getTagsForStencil(gnmess, 'equipotential', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'protective_earth;', 
					50, 40, '', 'Protective Earth', null, null, this.getTagsForStencil(gnmess, 'protective_earth', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'signal_ground;', 
					90, 60, '', 'Signal Ground', null, null, this.getTagsForStencil(gnmess, 'signal_ground', dtmess).join(' '))
		]);
		
		this.addPaletteFunctions('eeAudio', 'Electrical / Audio', false,
		[
			this.createVertexTemplateEntry(mer + 'dipole;', 
					100, 40, '', 'Dipole', null, null, this.getTagsForStencil(gnmer, 'dipole', dtmer).join(' ')),
			this.createVertexTemplateEntry(mer + 'electret_microphone;', 
					70, 70, '', 'Electret Microphone', null, null, this.getTagsForStencil(gnmer, 'electret_microphone', dtmer).join(' ')),
			this.createVertexTemplateEntry(mer + 'microphone_1;', 
					70, 70, '', 'Microphone', null, null, this.getTagsForStencil(gnmer, 'microphone_1', dtmer).join(' ')),
			this.createVertexTemplateEntry(mer + 'microphone_2;', 
					42, 70, '', 'Microphone', null, null, this.getTagsForStencil(gnmer, 'microphone_2', dtmer).join(' ')),
			this.createVertexTemplateEntry(meem + 'piezo_sounder;', 
					100, 40, '', 'Piezo Sounder', null, null, this.getTagsForStencil(gnmeem, 'piezo_sounder', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'buzzer;', 
					45, 60, '', 'Buzzer', null, null, this.getTagsForStencil(gnmeem, 'buzzer', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'loudspeaker;', 
					25, 50, '', 'Loudspeaker', null, null, this.getTagsForStencil(gnmeem, 'loudspeaker', dtmeem).join(' ')),
			this.createVertexTemplateEntry(mer + 'headphones;', 
					66, 56, '', 'Headphones', null, null, this.getTagsForStencil(gnmer, 'headphones', dtmer).join(' '))
		]);
		
		this.addPaletteFunctions('eePlcLadder', 'Electrical / PLC Ladder', false,
		[
			this.createVertexTemplateEntry(mep + 'contact;', 
					50, 25, '', 'Contact', null, null, this.getTagsForStencil(gnmep, 'contact', dtmep).join(' ')),
			this.createVertexTemplateEntry(mep + 'not_contact;', 
					50, 25, '', 'Contact (N)', null, null, this.getTagsForStencil(gnmep, 'not_contact', dtmep).join(' ')),
			this.createVertexTemplateEntry(mep + 'not_output_1;', 
					50, 25, '', 'Output (N)', null, null, this.getTagsForStencil(gnmep, 'not_output_1;', dtmep).join(' ')),
			this.createVertexTemplateEntry(mep + 'not_output_2;', 
					50, 25, '', 'Output (N)', null, null, this.getTagsForStencil(gnmep, 'not_output_2', dtmep).join(' ')),
			this.createVertexTemplateEntry(mep + 'output_1;', 
					50, 25, '', 'Output', null, null, this.getTagsForStencil(gnmep, 'output_1', dtmep).join(' ')),
			this.createVertexTemplateEntry(mep + 'output_2;', 
					50, 25, '', 'Output', null, null, this.getTagsForStencil(gnmep, 'output_2', dtmep).join(' '))
		]);
		
		this.addPaletteFunctions('eeOptical', 'Electrical / Optical', false,
		[
			this.createVertexTemplateEntry(meoe + '7_segment_display;', 
					74.7, 96.1, '', '7 Segment Display', null, null, this.getTagsForStencil(gnmeoe, '7_segment_display', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + '7_segment_display_with_dp;', 
					79.8, 96.9, '', '7 Segment Display with DP', null, null, this.getTagsForStencil(gnmeoe, '7_segment_display_with_dp', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + '9_segment_display;', 
					74.7, 96.1, '', '9 Segment Display', null, null, this.getTagsForStencil(gnmeoe, '9_segment_display', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + '9_segment_display_with_dp;', 
					79.8, 96.9, '', '9 Segment Display with DP', null, null, this.getTagsForStencil(gnmeoe, '9_segment_display_with_dp', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'led_1;', 
					100, 65, '', 'LED', null, null, this.getTagsForStencil(gnmeoe, 'led_1', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'led_2;', 
					100, 70, '', 'LED', null, null, this.getTagsForStencil(gnmeoe, 'led_2', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'light-activated_scr;', 
					100, 70, '', 'Light Activated SCR', null, null, this.getTagsForStencil(gnmeoe, 'light-activated_scr', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'opto-coupler;', 
					99, 60, '', 'Opto-coupler', null, null, this.getTagsForStencil(gnmeoe, 'opto-coupler', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'opto-transistor;', 
					100, 110, '', 'Opto-transistor', null, null, this.getTagsForStencil(gnmeoe, 'opto-transistor', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'photodiode;', 
					100, 70, '', 'Photodiode', null, null, this.getTagsForStencil(gnmeoe, 'photodiode', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'photo_resistor_1;', 
					100, 90, '', 'Photo Resistor', null, null, this.getTagsForStencil(gnmeoe, 'photo_resistor_1', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'photo_resistor_2;', 
					100, 50, '', 'Photo Resistor', null, null, this.getTagsForStencil(gnmeoe, 'photo_resistor_2', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'photo_resistor_3;', 
					100, 90, '', 'Photo Resistor', null, null, this.getTagsForStencil(gnmeoe, 'photo_resistor_3', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'solar_cell;', 
					100, 70, '', 'Solar Cell', null, null, this.getTagsForStencil(gnmeoe, 'solar_cell', dtmeoe).join(' '))
		]);

		this.addPaletteFunctions('eeVacuumTubes', 'Electrical / Vacuum Tubes', false,
		[
			this.createVertexTemplateEntry(metd + 'diode;', 
					70, 77, '', 'Diode', null, null, this.getTagsForStencil(gnmetd, 'diode', dtmetd).join(' ')),
			this.createVertexTemplateEntry(metd + 'double_diode;', 
					70, 77, '', 'Double Diode', null, null, this.getTagsForStencil(gnmetd, 'double_diode', dtmetd).join(' ')),
			this.createVertexTemplateEntry(metd + 'triode;', 
					70, 77, '', 'Triode', null, null, this.getTagsForStencil(gnmetd, 'triode', dtmetd).join(' ')),
			this.createVertexTemplateEntry(metd + 'double_triode;', 
					70, 77, '', 'Double Triode', null, null, this.getTagsForStencil(gnmetd, 'double_triode', dtmetd).join(' ')),
			this.createVertexTemplateEntry(metd + 'tetrode;', 
					70, 77, '', 'Tetrode', null, null, this.getTagsForStencil(gnmetd, 'tetrode', dtmetd).join(' ')),
			this.createVertexTemplateEntry(metd + 'pentode;', 
					70, 77, '', 'Pentode', null, null, this.getTagsForStencil(gnmetd, 'pentode', dtmetd).join(' ')),
			this.createVertexTemplateEntry(metd + 'photocell;', 
					70, 87, '', 'Photocell', null, null, this.getTagsForStencil(gnmetd, 'photocell', dtmetd).join(' '))
		]);
		
		this.addPaletteFunctions('eeWaveforms', 'Electrical / Waveforms', false,
		[
			this.createVertexTemplateEntry(mew + 'pulse_1;', 
					90, 90, '', 'Pulse', null, null, this.getTagsForStencil(gnmew, 'pulse_1', dtmew).join(' ')),
			this.createVertexTemplateEntry(mew + 'pulse_2;', 
					90, 90, '', 'Pulse', null, null, this.getTagsForStencil(gnmew, 'pulse_2', dtmew).join(' ')),
			this.createVertexTemplateEntry(mew + 'sawtooth;', 
					90, 40, '', 'Sawtooth', null, null, this.getTagsForStencil(gnmew, 'sawtooth', dtmew).join(' ')),
			this.createVertexTemplateEntry(mew + 'sine_wave;', 
					90, 66.18, '', 'Sine Wave', null, null, this.getTagsForStencil(gnmew, 'sine_wave', dtmew).join(' ')),
			this.createVertexTemplateEntry(mew + 'slow_square_wave;', 
					90, 80, '', 'Chopped Square Wave', null, null, this.getTagsForStencil(gnmew, 'slow_square_wave', dtmew).join(' ')),
			this.createVertexTemplateEntry(mew + 'square_wave;', 
					90, 80, '', 'square_wave', null, null, this.getTagsForStencil(gnmew, 'square_wave', dtmew).join(' ')),
			this.createVertexTemplateEntry(mew + 'step_1;', 
					90, 90, '', 'Step', null, null, this.getTagsForStencil(gnmew, 'step_1', dtmew).join(' ')),
			this.createVertexTemplateEntry(mew + 'step_2;', 
					90, 90, '', 'Step', null, null, this.getTagsForStencil(gnmew, 'step_2', dtmew).join(' '))
		]);
	};
	
})();

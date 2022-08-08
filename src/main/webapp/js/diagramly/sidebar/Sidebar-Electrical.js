(function()
{
	// Adds electrical stencils
	Sidebar.prototype.addElectricalPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;shadow=0;dashed=0;align=center;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;' + mxConstants.STYLE_SHAPE;
		var mea = s + '=mxgraph.electrical.abstract.';
		var mec = 'pointerEvents=1;' + s + '=mxgraph.electrical.capacitors.';
		var med = 'pointerEvents=1;fillColor=strokeColor;' + s + '=mxgraph.electrical.diodes.';
		var mei = 'pointerEvents=1;' + s + '=mxgraph.electrical.inductors.';
		var mem = 'pointerEvents=1;' + s + '=mxgraph.electrical.miscellaneous.';
		var meem = 'pointerEvents=1;' + s + '=mxgraph.electrical.electro-mechanical.';
		var mel = s + '=mxgraph.electrical.logic_gates.';
		var mef1 = s + '=mxgraph.electrical.mosfets1.';
		var met = s + '=mxgraph.electrical.transistors.';
		var meoe = s + '=mxgraph.electrical.opto_electronics.';
		var mer = s + '=mxgraph.electrical.radio.';
		var mere = 'pointerEvents=1;' + s + '=mxgraph.electrical.resistors.';
		var mess = 'pointerEvents=1;' + s + '=mxgraph.electrical.signal_sources.';
		var metd = s + '=mxgraph.electrical.thermionic_devices.';
		var mein = 'perimeter=ellipsePerimeter;' + s + '=mxgraph.electrical.instruments.';
		var gnmel = 'mxgraph.electrical.logic_gates';
		var dtmel = 'electrical logic gate ';
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
		var gnmeoe = 'mxgraph.electrical.opto_electronics';
		var dtmeoe = 'electrical optical ';
		var gnmetd = 'mxgraph.electrical.thermionic_devices';
		var dtmetd = 'electrical thermionic thermo device vacuum tube ';

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\LogicGates');
		
		this.addPaletteFunctions('electrical\LogicGates', 'Logic Gates', false,
		[
			this.createVertexTemplateEntry(mel + 'logic_gate;operation=and;', 100, 60, '', 'AND', null, null, this.getTagsForStencil(gnmel, 'and', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'buffer2;', 100, 60, '', 'Buffer', null, null, this.getTagsForStencil(gnmel, 'buffer', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'd_type_flip-flop;', 100, 80, '', 'D Type Flip-Flop', null, null, this.getTagsForStencil(gnmel, 'd_type_flip-flop', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'inverter_2', 100, 60, '', 'Inverter', null, null, this.getTagsForStencil(gnmel, 'inverter', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'jk_flip-flop;', 100, 80, '', 'JK Flip-Flop', null, null, this.getTagsForStencil(gnmel, 'jk_flip-flop', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'jk_flip-flop_with_sr;', 100, 100, '', 'JK Flip-Flop With SR', null, null, this.getTagsForStencil(gnmel, 'jk_flip-flop_with_sr', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'logic_gate;operation=and;negating=1;negSize=0.15;', 100, 60, '', 'NAND', null, null, this.getTagsForStencil(gnmel, 'nand not and', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'logic_gate;operation=or;', 100, 60, '', 'OR', null, null, this.getTagsForStencil(gnmel, 'or', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'logic_gate;operation=or;negating=1;negSize=0.15;', 100, 60, '', 'NOR', null, null, this.getTagsForStencil(gnmel, 'nor', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'rs_latch;', 100, 80, '', 'RS Latch', null, null, this.getTagsForStencil(gnmel, 'rs_latch', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'schmitt_trigger;', 100, 60, '', 'Schmitt Trigger', null, null, this.getTagsForStencil(gnmel, 'schmitt_trigger', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 't_type_flip-flop;', 100, 80, '', 'T Type Flip-Flop', null, null, this.getTagsForStencil(gnmel, 't_type_flip-flop', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'logic_gate;operation=xor;', 100, 60, '', 'XOR', null, null, this.getTagsForStencil(gnmel, 'xor', dtmel).join(' ')),
			this.createVertexTemplateEntry(mel + 'logic_gate;operation=xor;negating=1;negSize=0.15;', 100, 60, '', 'XNOR', null, null, this.getTagsForStencil(gnmel, 'xnor', dtmel).join(' ')),
			this.createVertexTemplateEntry(
					'shadow=0;dashed=0;align=center;html=1;strokeWidth=1;shape=mxgraph.electrical.logic_gates.dual_inline_ic;labelNames=a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;',
					100, 200, 'IC', 'Dual In-Line IC', null, null, this.getTagsForStencil(gnmel, 'dual inline in line ic integrated circuit', dtmel).join(' ')),
			this.createVertexTemplateEntry(
					'shadow=0;dashed=0;align=center;html=1;strokeWidth=1;shape=mxgraph.electrical.logic_gates.qfp_ic;' + 
					'labelNames=a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,a1,b1,c1,d1,e1,f1,g1,h1,i1,j1,k1,l1,m1,n1;', 
					200, 200, 'IC', 'Quad Flat Package IC', null, null, this.getTagsForStencil(gnmel, 'quad flat package qfp ic integrated circuit', dtmel).join(' '))
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Resistors');

		this.addPaletteFunctions('electrical\Resistors', 'Resistors', false,
		[
			this.createVertexTemplateEntry(mere + 'resistor_1;', 
					100, 20, '', 'Resistor', null, null, this.getTagsForStencil(gnmere, 'resistor_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'resistor_2;', 
					100, 20, '', 'Resistor', null, null, this.getTagsForStencil(gnmere, 'resistor_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'potentiometer_1;', 
					100, 40, '', 'Potentiometer', null, null, this.getTagsForStencil(gnmere, 'potentiometer_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'potentiometer_2;', 
					100, 40, '', 'Potentiometer', null, null, this.getTagsForStencil(gnmere, 'potentiometer_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'variable_resistor_1;',
					100, 60, '', 'Resistor (Variable)', null, null, this.getTagsForStencil(gnmere, 'variable_resistor_1', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'variable_resistor_2;', 
					100, 60, '', 'Resistor (Variable)', null, null, this.getTagsForStencil(gnmere, 'variable_resistor_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'symmetrical_varistor;',
					100, 60, '', 'Varistor (Symmetrical)', null, null, this.getTagsForStencil(gnmere, 'symmetrical_varistor', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'memristor_2;',
					100, 24, '', 'Memristor', null, null, this.getTagsForStencil(gnmere, 'memristor_2', dtmere).join(' ')),
			this.createVertexTemplateEntry(mere + 'symmetrical_photoconductive_transducer;',
					100, 40, '', 'Photoconductive Transducer (Symmetrical)', null, null, this.getTagsForStencil(gnmere, 'symmetrical_photoconductive_transducer', dtmere).join(' '))
		]);
		
		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Capacitors');
		
		this.addPaletteFunctions('electrical\Capacitors', 'Capacitors', false,
		[
			this.createVertexTemplateEntry(mec + 'capacitor_1;', 
					100, 60, '', 'Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'capacitor_1', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'capacitor_2;', 
					100, 60, '', 'Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'capacitor_2', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'capacitor_5;',
					100, 60, '', 'Electrolytic Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'capacitor_5', dtmec).join(' ')),
			this.createVertexTemplateEntry(mec + 'variable_capacitor_2;',
					100, 60, '', 'Trimmer Variable Capacitor (US)', null, null, this.getTagsForStencil(gnmec, 'variable_capacitor_2', dtmec).join(' ')),
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Inductors');

		this.addPaletteFunctions('electrical\Inductors', 'Inductors', false,
		[
			this.createVertexTemplateEntry(mei + 'inductor_3;', 
					100, 8, '', 'Inductor (Air Core)', null, null, this.getTagsForStencil(gnmei, 'inductor_3', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'inductor_5;', 
					100, 14, '', 'Inductor (Air Core)', null, null, this.getTagsForStencil(gnmei, 'inductor_5', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'inductor_1;', 
					100, 15, '', 'Inductor (Air Core)', null, null, this.getTagsForStencil(gnmei, 'inductor_1', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'variable_inductor;', 
					100, 60, '', 'Variable', null, null, this.getTagsForStencil(gnmei, 'variable_inductor', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'transformer_1;',
					64, 60, '', 'Transformer (Iron Core)', null, null, this.getTagsForStencil(gnmei, 'transformer_1', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'transformer_2;', 
					64, 60, '', 'Transformer (Iron Core)', null, null, this.getTagsForStencil(gnmei, 'transformer_2', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'transformer;direction=north;',
					64, 64, '', 'Transformer', null, null, this.getTagsForStencil(gnmei, 'transformer', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'inductor;', 
					100, 42, '', 'Inductor', null, null, this.getTagsForStencil(gnmei, 'inductor', dtmei).join(' ')),
			this.createVertexTemplateEntry(mei + 'pot_trans_3_windings;',
					67, 96, '', 'Pot. Trans. 3 Windings', null, null, this.getTagsForStencil(gnmei, 'potential transformer 3 three windings', dtmei).join(' ')),
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\SwitchesRelays');

		this.addPaletteFunctions('electrical\SwitchesRelays', 'Switches and Relays', false,
		[
			this.createVertexTemplateEntry('shape=mxgraph.electrical.electro-mechanical.twoWaySwitch;aspect=fixed;elSwitchState=2;', 
					75, 26, '', 'SPDT', null, null, this.getTagsForStencil(gnmeem, '2-way switch new', dtmeem).join(' ')),
			this.createVertexTemplateEntry('shape=mxgraph.electrical.electro-mechanical.pushbutton;aspect=fixed;elSwitchState=on;', 
					75, 20, '', 'Pushbutton On', null, null, this.getTagsForStencil(gnmeem, 'pushbutton push button', dtmeem).join(' ')),
			this.createVertexTemplateEntry('shape=mxgraph.electrical.electro-mechanical.pushbutton;aspect=fixed;elSwitchState=off;', 
					75, 20, '', 'Pushbutton Off', null, null, this.getTagsForStencil(gnmeem, 'pushbutton push button', dtmeem).join(' ')),
			this.createVertexTemplateEntry('shape=mxgraph.electrical.electro-mechanical.singleSwitch;aspect=fixed;elSwitchState=on;', 
					75, 20, '', 'Single Switch On', null, null, this.getTagsForStencil(gnmeem, 'single switch', dtmeem).join(' ')),
			this.createVertexTemplateEntry('shape=mxgraph.electrical.electro-mechanical.singleSwitch;aspect=fixed;elSwitchState=off;', 
					75, 20, '', 'Single Switch Off', null, null, this.getTagsForStencil(gnmeem, 'single switch', dtmeem).join(' ')),
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Diodes');
		
		this.addPaletteFunctions('electrical\Diodes', 'Diodes', false,
		[
			this.createVertexTemplateEntry(med + 'diode;', 
					100, 60, '', 'PN Diode', null, null, this.getTagsForStencil(gnmed, 'diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'schottky_diode;',
					100, 60, '', 'Schottky Diode', null, null, this.getTagsForStencil(gnmed, 'schottky_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'zener_diode_2;', 
					100, 60, '', 'Breakdown', null, null, this.getTagsForStencil(gnmed, 'zener_diode_2', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'tunnel_diode;', 
					100, 60, '', 'Tunnel Diode 1', null, null, this.getTagsForStencil(gnmed, 'tunnel_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'varactor_-_varicap;',
					100, 60, '', 'Varactor - Varicap', null, null, this.getTagsForStencil(gnmed, 'varactor_-_varicap', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'zener_diode_3;',
					100, 60, '', 'Zener Diode 2', null, null, this.getTagsForStencil(gnmed, 'zener_diode_3', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'four_layer_diode;', 
					100, 80, '', 'Four Layer Diode', null, null, this.getTagsForStencil(gnmed, 'four_layer_diode', dtmed).join(' ')),
			this.createVertexTemplateEntry(med + 'transorb_2;',
					100, 60, '', 'Transorb 2', null, null, this.getTagsForStencil(gnmed, 'transorb_2', dtmed).join(' '))
		]);
		
		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Sources');
		
		this.addPaletteFunctions('electrical\Sources', 'Sources', false,
		[
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=ac;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=dc1;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=dc3;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=none;elSourceType=dependent;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=dc2;elSourceType=dependent;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSourceType=dependent;elSignalType=dc3;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=noise;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=ideal;', 
					60, 60, '', 'Source', null, null, this.getTagsForStencil(gnmess, 'source', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'current_source;',
					40, 60, '', 'Current', null, null, this.getTagsForStencil(gnmess, 'current_source', dtmess).join(' ')),
			this.createVertexTemplateEntry('verticalLabelPosition=bottom;shadow=0;dashed=0;align=center;fillColor=#000000;html=1;verticalAlign=top;strokeWidth=1;shape=mxgraph.electrical.miscellaneous.monocell_battery;',
					100, 60, '', 'Accumulator / Monocell Battery', null, null, this.getTagsForStencil(gnmess, 'accumulator monocell battery single cell', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'batteryStack;', 
					100, 60, '', 'Battery Stack', null, null, this.getTagsForStencil(gnmess, 'battery stack', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=square;',
					60, 60, '', 'Source, Square', null, null, this.getTagsForStencil(gnmess, 'source square', dtmess).join(' ')),
			this.createVertexTemplateEntry(mess + 'source;aspect=fixed;points=[[0.5,0,0],[1,0.5,0],[0.5,1,0],[0,0.5,0]];elSignalType=triangular;',
					60, 60, '', 'Source, Triangular', null, null, this.getTagsForStencil(gnmess, 'source triangular', dtmess).join(' ')),
		]);
		
		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Transistors');
		
		this.addPaletteFunctions('electrical\Transistors', 'Transistors', false,
		[
			this.createVertexTemplateEntry(met + 'npn_transistor_5;',
					64, 100, '', 'BJT (NPN)', null, null, this.getTagsForStencil(gnmet, 'npn_transistor_5', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'nigbt;', 
					64, 100, '', 'NIGBT', null, null, this.getTagsForStencil(gnmet, 'nigbt', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'pnp_transistor_5;',
					64, 100, '', 'BJT (PNP)', null, null, this.getTagsForStencil(gnmet, 'pnp_transistor_5', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'pigbt;',
					64, 100, '', 'PIGBT', null, null, this.getTagsForStencil(gnmet, 'pigbt', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'n-channel_jfet_1;',
					95, 100, '', 'N Channel JFET', null, null, this.getTagsForStencil(gnmet, 'n-channel_jfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'p-channel_jfet_1;',
					95, 100, '', 'P Channel JFET', null, null, this.getTagsForStencil(gnmet, 'p-channel_jfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'n-channel_mosfet_1;',
					95, 100, '', 'MOSFET (N)', null, null, this.getTagsForStencil(gnmet, 'n-channel_mosfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'p-channel_mosfet_1;',
					95, 100, '', 'MOSFET (P)', null, null, this.getTagsForStencil(gnmet, 'p-channel_mosfet_1', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'mosfet_n_no_bulk;',
					95, 100, '', 'MOSFET No Bulk (N)', null, null, this.getTagsForStencil(gnmet, 'mosfet_n_no_bulk', dtmet).join(' ')),
			this.createVertexTemplateEntry(mef1 + 'mosfet_p_no_bulk;',
					95, 100, '', 'MOSFET No Bulk (P)', null, null, this.getTagsForStencil(gnmet, 'mosfet_p_no_bulk', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'nmos;pointerEvents=1;',
					60, 100, '', 'NMOS', null, null, this.getTagsForStencil(gnmet, 'nmos', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'nmos_bulk;pointerEvents=1;', 
					60, 100, '', 'NMOS with Bulk', null, null, this.getTagsForStencil(gnmet, 'nmos bulk', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'pmos;pointerEvents=1;',
					60, 100, '', 'PMOS', null, null, this.getTagsForStencil(gnmet, 'pmos', dtmet).join(' ')),
			this.createVertexTemplateEntry(met + 'pmos_bulk;pointerEvents=1;', 
					60, 100, '', 'PMOS with Bulk', null, null, this.getTagsForStencil(gnmet, 'pmos bulk', dtmet).join(' '))
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Instruments');
		
		this.addPaletteFunctions('electrical\Instruments', 'Instruments', false,
		[
			this.createVertexTemplateEntry('verticalLabelPosition=middle;shadow=0;dashed=0;align=center;html=1;verticalAlign=middle;strokeWidth=1;shape=ellipse;aspect=fixed;fontSize=50;', 
					90, 90, 'A', 'Ammeter', null, null, this.getTagsForStencil(gnmein, 'ampermeter ammeter', dtmein).join(' ')),
			this.createVertexTemplateEntry(mein + 'oscilloscope;',
					90, 90, '', 'Oscilloscope', null, null, this.getTagsForStencil(gnmein, 'oscilloscope', dtmein).join(' ')),
			this.createVertexTemplateEntry(mein + 'signal_generator;', 
					90, 90, '', 'Signal Generator', null, null, this.getTagsForStencil(gnmein, 'signal_generator', dtmein).join(' ')),
			this.createVertexTemplateEntry('verticalLabelPosition=middle;shadow=0;dashed=0;align=center;html=1;verticalAlign=middle;strokeWidth=1;shape=ellipse;aspect=fixed;fontSize=50;', 
					90, 90, 'V', 'Voltmeter', null, null, this.getTagsForStencil(gnmein, 'ampermeter ammeter', dtmein).join(' '))
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Misc');
		
		this.addPaletteFunctions('electrical\Misc', 'Misc', false,
		[
			this.createVertexTemplateEntry(mer + 'aerial_-_antenna_1;', 
					80, 100, '', 'Antenna', null, null, this.getTagsForStencil(gnmer, 'aerial_-_antenna_1', dtmer).join(' ')),
			this.createVertexTemplateEntry(mer + 'aerial_-_antenna_2;', 
					79, 100, '', 'Antenna', null, null, this.getTagsForStencil(gnmer, 'aerial_-_antenna_2', dtmer).join(' ')),
			this.createVertexTemplateEntry('verticalLabelPosition=middle;shadow=0;dashed=0;align=center;html=1;verticalAlign=middle;strokeWidth=1;shape=ellipse;aspect=fixed;fontSize=35;',
					60, 60, 'M', 'Electrical Motor', null, null, this.getTagsForStencil(gnmeem, 'motor_1', dtmeem).join(' ')),
			this.createVertexTemplateEntry(mem + 'crystal_1;',
					100, 40, '', 'Crystal', null, null, this.getTagsForStencil(gnmem, 'crystal_1', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'fuse_2;',
					100, 20, '', 'Fuse (IEEE)', null, null, this.getTagsForStencil(gnmem, 'fuse_2', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'light_bulb;',
					60, 50, '', 'Light Bulb', null, null, this.getTagsForStencil(gnmem, 'light_bulb', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'illuminating_bulb;', 
					60, 50, '', 'Illuminating Bulb', null, null, this.getTagsForStencil(gnmem, 'illuminating_bulb', dtmem).join(' ')),
			this.createVertexTemplateEntry(mem + 'thermocouple;',
					80, 81, '', 'Thermocouple', null, null, this.getTagsForStencil(gnmem, 'thermocouple', dtmem).join(' ')),
			this.createVertexTemplateEntry(mea + 'amplifier;', 
					90, 100, '', 'Amplifier', null, null, this.getTagsForStencil(gnmea, 'amplifier', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'controlled_amplifier;', 
					100, 90, '', 'Controlled Amplifier', null, null, this.getTagsForStencil(gnmea, 'controlled_amplifier', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'dac;', 
					70, 46, '', 'DAC', null, null, this.getTagsForStencil(gnmea, 'dac', dtmea).join(' ')),
			this.createVertexTemplateEntry(
					'shadow=0;dashed=0;align=center;html=1;strokeWidth=1;shape=mxgraph.electrical.abstract.mux2;',
					80, 120, 'Mux', 'Mux', null, null, this.getTagsForStencil(gnmea, 'mux', dtmea).join(' ')),
			this.createVertexTemplateEntry(
					'shadow=0;dashed=0;align=center;html=1;strokeWidth=1;shape=mxgraph.electrical.abstract.mux2;operation=demux;',
					80, 120, 'Demux', 'Demux', null, null, this.getTagsForStencil(gnmea, 'mux', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'operational_amp_1;', 
					98, 90, '', 'Operational Amp', null, null, this.getTagsForStencil(gnmea, 'operational_amp_1', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'operational_amp_2;', 
					98, 90, '', 'Operational Amp', null, null, this.getTagsForStencil(gnmea, 'operational_amp_2', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'ota_1;',
					100, 90, '', 'OTA', null, null, this.getTagsForStencil(gnmea, 'ota_1', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'ota_2;',
					100, 90, '', 'OTA', null, null, this.getTagsForStencil(gnmea, 'ota_2', dtmea).join(' ')),
			this.createVertexTemplateEntry(mea + 'filter;',
					52, 46, '', 'Filter', null, null, this.getTagsForStencil(gnmea, 'filter', dtmea).join(' ')),
			this.createVertexTemplateEntry(s + '=mxgraph.electrical.logic_gates.highpass_filter;',
					52, 46, '', 'Highpass Filter', null, null, this.getTagsForStencil('mxgraph.electrical.logic_gates', 'highpass_filter', '').join(' ')),
			this.createVertexTemplateEntry(s + '=mxgraph.electrical.logic_gates.lowpass_filter;', 
					52, 46, '', 'Lowpass Filter', null, null, this.getTagsForStencil('mxgraph.electrical.logic_gates', 'lowpass_filter', '').join(' ')),
			this.createVertexTemplateEntry(mess + 'signal_ground;',
					45, 30, '', 'Ground', null, null, this.getTagsForStencil(gnmess, 'signal_ground', dtmess).join(' ')),
			this.createVertexTemplateEntry(mem + 'chassis;', 
					65, 32, '', 'Chassis', null, null, this.getTagsForStencil(gnmess, 'chassis', dtmem).join(' ')),
		]);
		
		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Audio');
		
		this.addPaletteFunctions('electrical\Audio', 'Audio', false,
		[
			this.createVertexTemplateEntry(mer + 'microphone_1;',
					70, 70, '', 'Microphone', null, null, this.getTagsForStencil(gnmer, 'microphone_1', dtmer).join(' ')),
			this.createVertexTemplateEntry(meem + 'buzzer;',
					45, 60, '', 'Buzzer', null, null, this.getTagsForStencil(gnmeem, 'buzzer', dtmeem).join(' ')),
			this.createVertexTemplateEntry(meem + 'loudspeaker;', 
					25, 50, '', 'Loudspeaker', null, null, this.getTagsForStencil(gnmeem, 'loudspeaker', dtmeem).join(' ')),
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\Optical');
		
		this.addPaletteFunctions('electrical\Optical', 'Optical', false,
		[
			this.createVertexTemplateEntry(meoe + '7_segment_display;pointerEvents=1;', 
					74.7, 96.1, '', '7 Segment Display', null, null, this.getTagsForStencil(gnmeoe, '7_segment_display', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + '7_segment_display_with_dp;pointerEvents=1;', 
					79.8, 96.9, '', '7 Segment Display with DP', null, null, this.getTagsForStencil(gnmeoe, '7_segment_display_with_dp', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'led_2;pointerEvents=1;',
					100, 70, '', 'LED', null, null, this.getTagsForStencil(gnmeoe, 'led_2', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'light-activated_scr;pointerEvents=1;', 
					100, 70, '', 'Light Activated SCR', null, null, this.getTagsForStencil(gnmeoe, 'light-activated_scr', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'photodiode;pointerEvents=1;',
					100, 70, '', 'Photodiode', null, null, this.getTagsForStencil(gnmeoe, 'photodiode', dtmeoe).join(' ')),
			this.createVertexTemplateEntry(meoe + 'photo_resistor_2;pointerEvents=1;',
					100, 50, '', 'Photo Resistor', null, null, this.getTagsForStencil(gnmeoe, 'photo_resistor_2', dtmeoe).join(' ')),
		]);

		this.setCurrentSearchEntryLibrary('electrical', 'electrical\VacuumTubes');
		
		this.addPaletteFunctions('electrical\VacuumTubes', 'Vacuum Tubes', false,
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

		this.setCurrentSearchEntryLibrary();
	};
	
})();

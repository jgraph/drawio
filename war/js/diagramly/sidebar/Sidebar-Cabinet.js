(function()
{
	// Adds Cabinets shapes
	Sidebar.prototype.addCabinetsPalette = function()
	{
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;dashed=0;shadow=0;strokeColor=#000000;fillColor=#ffffff;html=1;align=center;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;' + mxConstants.STYLE_STROKEWIDTH + '=1;shape=mxgraph.cabinets.';
		var s2 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=middle;dashed=0;shadow=0;strokeColor=#000000;fillColor=#ffffff;html=1;' + mxConstants.STYLE_STROKEWIDTH + '=1;shape=mxgraph.cabinets.';
		var w = 50;
		var h = 50;
		var gn = 'mxgraph.cabinets';
		var dt = 'cabinet ';
		var sb = this;
		
		var fns = 
		[
			this.createVertexTemplateEntry(s + 'cabinet;hasStand=1', 
					w * 5, h * 10, '', 'Cabinet', null, null, this.getTagsForStencil(gn, 'cabinet', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dimension;verticalAlign=top;align=center;', 
					w * 5, 40, '100', 'Dimension', null, null, this.getTagsForStencil(gn, 'dimension', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'dimensionBottom;verticalAlign=bottom;align=center;', 
					w * 5, 40, '100', 'Dimension', null, null, this.getTagsForStencil(gn, 'dimensionBottom', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'coverPlate', 
					w * 4.4, h * 2.5, '', 'Cover Plate', null, null, this.getTagsForStencil(gn, 'coverPlate', dt).join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;', 
					w * 4.4, h * 0.25, '25x40', 'Panel Wiring System 25x40mm', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;', 
					w * 4.4, h * 0.4, '40x40', 'Panel Wiring System 40x40mm', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;', 
					w * 4.4, h * 0.6, '60x40', 'Panel Wiring System 60x40mm', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;', 
					w * 4.4, h * 0.8, '80x40', 'Panel Wiring System 80x40mm', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;', 
					w * 4.4, h, '100x40', 'Panel Wiring System 100x40mm', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;rotation=270', 
					w * 7, h * 0.25, '25x40', 'Panel Wiring System 25x40mm (Vertical)', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;rotation=270', 
					w * 7, h * 0.4, '40x40', 'Panel Wiring System 40x40mm (Vertical)', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;rotation=270', 
					w * 7, h * 0.6, '60x40', 'Panel Wiring System 60x40mm (Vertical)', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;rotation=270', 
					w * 7, h * 0.8, '80x40', 'Panel Wiring System 80x40mm (Vertical)', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry('shape=rect;dashed=0;shadow=0;html=1;whiteSpace=wrap;rotation=270', 
					w * 7, h, '100x40', 'Panel Wiring System 100x40mm (Vertical)', null, null, this.getTagsForStencil(gn, '', dt + 'panel wiring system').join(' ')),
			this.createVertexTemplateEntry(s + 'cb_1p;', 
					w * 0.18, h, '', 'Circuit Breaker (1P)', null, null, this.getTagsForStencil(gn, 'cb_1p', dt).join(' ')),
			this.addDataEntry(dt + 'circuit breaker row', w * 1.8, h, 'Circuit Breaker (1P x 10)',
				'7dhPb8IgFADwT8PVFLD+Oc66edmS3XZcaIuFSKVpmdZvv9eCOpOZbCRygqQJvNcH9P1uRTSr+03LGvGmS64QfUY0a7U2dlb3GVcKkUSWiK4RIQk8iLzcyeIxmzSs5XvzlwJiCw5MfXEbsYHOnJQLHHhrZMHUK8u5etedNFLvIZVrY3SN6KpkneDDfgksOsFKfTwvTKt3PNNKt+NeNBkHZLZSqR/x7TggLkwNPVhjmDIlq+GcAj6Fw3ur80WeXMLo5nLGhyyNcIVwhWa4e91XQ18nBcvlnptuUuSfeChx3wzb8f5u38aQa9qG65qb9gSvHN1BkF3aIsFlJVxRarudsM6uq0vh1QAmjuF3EhpJ/kfS33A8HmgagbyA8CKUUBqFvITIPJTQLAp5CdFZKKF5FPISmqahhBZRyEsonYYSWkYhL6EZDSWEk0jkRTQnwYhwJPIiWuAHEcHy+odizN38wPgG'),

			this.createVertexTemplateEntry(s + 'cb_2p;', w * 0.36, h, '', 'Circuit Breaker (2P)', null, null, this.getTagsForStencil(gn, 'cb_2p', dt).join(' ')),
			this.addDataEntry(dt + 'circuit breaker row', w * 3.6, h, 'Circuit Breaker (2P x 10)',
				'7ZhNb8MgDIZ/DdeKQD+Pa7r1skm77TiRxA1opESEtem/Hwm0XaVV2pDGCSQkbPMa8HOxQDRv+q1mLX9RFUhEHxHNtVLGrZo+BykRwaJCdIMIwXYi8nQnmo1R3DINe/MbAXGCA5Of4DzO0ZmT9I4DaCNKJp9ZAfJVdcIItbehQhmjGkTXFes4DPmwNTrOKnU8G0arD8iVVHrMRfE4bGQnpPzm343D+rlpbA02mV0yKerhnNI+Bey+9fkiDz5gVHs5401UhnuhvUI73L3p66Guk5IVYg+mm5TFOxkk/s02HfR36za6fNG2oBow+mS3HP1Bw46lU3EQNfeqmSs3Zp2z64vyCsEuPIefmdDE5G9M+lseERBNE6IgRHQeDdEsIQpCNJtGQzRPiIIQLUg0RIuEKAjRCkdDtEyIwtoFHK9fWCVGYYxIvIYhwwlSGKRpvJYhyxKkMEjzf2sarHn9sBhjN/8ZXw=='),

			this.createVertexTemplateEntry(s + 'cb_3p;', w * 0.54, h, '', 'Circuit Breaker (3P)', null, null, this.getTagsForStencil(gn, 'cb_3p', dt).join(' ')),
			this.addDataEntry(dt + 'circuit breaker row', w * 2.7, h, 'Circuit Breaker (3P x 5)',
				'7ZbBbsIwDIafJleUNrBxHWXjskm77TilrWmipbhKPShvP7cJMKQhbUjj1EiRYju/7fi7RKis7lZeN+YFS3BCPQqVeUQKp7rLwDmRSlsKtRRpKnmL9OlCNBmistEeNvQbQRoEW+0+IXiCo6W9i44teLKFds86B/eKrSWLGw7lSIS1UItStwb6fJKN1ugSdweDPH5Ahg79kEvJYXFkbZ375l8Pi/2Gap7BMuGjdrbq6xT8FOB7i0MjDzFA2BxrvNmSTBRyC03fe91V/Vwnhc7tBqidFPm76iXxzZwOuotzG1xxaCvAGsjv+couFupndx9UBmxlomoWxi11G+zqqDxB4EPk8DMTNTL5G5PunMcNEE1HRFchmk1vhmg2IroK0Ty5GaK7EdFViBI5/y9GbJ4+H0Ps7G/yBQ=='),
	
			this.createVertexTemplateEntry(s + 'cb_4p;', w * 0.72, h, '', 'Circuit Breaker (4P)', null, null, this.getTagsForStencil(gn, 'cb_4p', dt).join(' ')),
			this.addDataEntry(dt + 'circuit breaker row', w * 3.6, h, 'Circuit Breaker (4P x 5)',
				'7ZbBbsIwDIafJlcUmsJ2HWXjskm77TilrWmipbhKPShvP7cJMKQhbUjj1EiRYv/5ncTfJUJldbfyujEvWIIT6lGozCNSWNVdBs6JRNpSqKVIEslTJE8X1OmgykZ72NBvDEkwbLX7hJAJiZb2Lia24MkW2j3rHNwrtpYsbljKkQhroRalbg309SQHrdEl7g4BefyADB36oZaSw2BlbZ37ll8Pg/OGau7BcspL7WzVn1PwU4D3LQ4XeYgCYXM8482WZKKRr9D0d6+7qu/rpNC53QC1kyJ/T3tLfDOXg+5i34ZUbNoKsAbye96yiwexqubBZcBWJrpmod1StyGujs4TBF5EDj8zUSOTvzHpznncAFE6IroK0V1yM0SzEdFViKby/maM5iOj6xil6X8x4vD0+xi0s8/JFw=='),
				
			this.createVertexTemplateEntry(s + 'cb_auxiliary_contact;', 
					w * 0.09, h, '', 'Auxiliary Contact (Circuit Breaker)', null, null, this.getTagsForStencil(gn, 'cb_auxiliary_contact', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'contactor_1_32a;', 
					w * 0.54, h * 0.86, '', 'Contactor (1-32A)', null, null, this.getTagsForStencil(gn, 'contactor_1_32a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'auxiliary_contact_contactor_1_32a;', 
					w * 0.09, h * 0.86, '', 'Auxiliary Contact (Contactor 1-32A)', null, null, this.getTagsForStencil(gn, 'auxiliary_contact_contactor_1_32a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'contactor_32_125a;', 
					w * 0.6, h, '', 'Contactor 32 to 125A', null, null, this.getTagsForStencil(gn, 'contactor_32_125a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'auxiliary_contact_contactor_32_125a;', 
					w * 0.09, h, '', 'Auxiliary Contact (Contactor 32-125A)', null, null, this.getTagsForStencil(gn, 'auxiliary_contact_contactor_32_125a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'contactor_125_400a;', 
					w * 1.1, h * 1.8, '', 'Contactor 125 to 400A', null, null, this.getTagsForStencil(gn, 'contactor_125_400a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'distribution_block_4p_125a_11_connections;', 
					w * 2, h * 1.2, '', 'Distribution Block 4P 125A 11 Connections', null, null, this.getTagsForStencil(gn, 'distribution_block_4p_125a_11_connections', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'distribution_block_4p_125a_11_connections_2;',
					w * 2, h, '', 'Distribution Block 4P 125A 11 Connections', null, null, this.getTagsForStencil(gn, 'distribution_block_4p_125a_11_connections_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mccb_25_63a_3p;', 
					w * 1.2, h * 1.8, '', 'MCCB 25-63A 3P', null, null, this.getTagsForStencil(gn, 'mccb_25_63a_3p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mccb_25_63a_4p;', 
					w * 1.6, h * 1.8, '', 'MCCB 25-63A 4P', null, null, this.getTagsForStencil(gn, 'mccb_25_63a_4p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mccb_63_250a_3p;', 
					w * 1.4, h * 2.1, '', 'MCCB 63-250A 3P', null, null, this.getTagsForStencil(gn, 'mccb_63_250a_3p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mccb_63_250a_4p;', 
					w * 1.9, h * 2.1, '', 'MCCB 63-250A 4P', null, null, this.getTagsForStencil(gn, 'mccb_63_250a_4p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motorized_switch_3p;', 
					w * 1.7, h * 1.4, '', 'Motorized Switch 3P', null, null, this.getTagsForStencil(gn, 'motorized_switch_3p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motorized_switch_4p;', 
					w * 2, h * 1.4, '', 'Motorized Switch 4P', null, null, this.getTagsForStencil(gn, 'motorized_switch_4p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motor_cb_1_32a;', 
					w * 0.54, h * 0.86, '', 'Motor Circuit Breaker 1-32A', null, null, this.getTagsForStencil(gn, 'motor_cb_1_32a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motor_cb_32_125a;', 
					w * 0.6, h, '', 'Motor Circuit Breaker 32-125A', null, null, this.getTagsForStencil(gn, 'motor_cb_32_125a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motor_cb_125_400a;', 
					w * 1.1, h * 1.8, '', 'Motor Circuit Breaker 125-400A', null, null, this.getTagsForStencil(gn, 'motor_cb_125_400a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motor_protection_cb;', 
					w * 0.54, h, '', 'Motor Protection CB', null, null, this.getTagsForStencil(gn, 'motor_protection_cb', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motor_starter_1_32a;', 
					w * 0.54, h * 0.86, '', 'Motor Circuit Breaker 1-32A', null, null, this.getTagsForStencil(gn, 'motor_starter_1_32a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motor_starter_32_125a;', 
					w * 0.6, h, '', 'Motor Circuit Breaker 32-125A', null, null, this.getTagsForStencil(gn, 'motor_starter_32_125a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'motor_starter_125_400a;', 
					w * 1.1, h * 1.8, '', 'Motor Circuit Breaker 125-400A', null, null, this.getTagsForStencil(gn, 'motor_starter_125_400a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'overcurrent_relay_1_32a;', 
					w * 0.54, h * 0.3, '', 'Overcurrent Relay 1-32A', null, null, this.getTagsForStencil(gn, 'overcurrent_relay_1_32a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'overcurrent_relay_32_125a;', 
					w * 0.6, h * 0.33, '', 'Overcurrent Relay 32-125A', null, null, this.getTagsForStencil(gn, 'overcurrent_relay_32_125a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'overcurrent_relay_125_400a;', 
					w * 1.1, h * 0.6, '', 'Overcurrent Relay 125-400A', null, null, this.getTagsForStencil(gn, 'overcurrent_relay_125_400a', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'plugin_relay_1;', 
					w * 0.06, h * 0.8, '', 'Plugin Relay', null, null, this.getTagsForStencil(gn, 'plugin_relay_1', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'plugin_relay_2;', 
					w * 0.24, h * 0.8, '', 'Plugin Relay', null, null, this.getTagsForStencil(gn, 'plugin_relay_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'din_rail;', 
					w * 10, h * 0.5, '', 'DIN Rail', null, null, this.getTagsForStencil(gn, 'din_rail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'residual_current_device_2p;', 
					w * 0.36, h, '', 'Residual Current Device 2p', null, null, this.getTagsForStencil(gn, 'residual_current_device_2p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'residual_current_device_4p;', 
					w * 0.72, h, '', 'Residual Current Device 4p', null, null, this.getTagsForStencil(gn, 'residual_current_device_4p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'surge_protection_1p;', 
					w * 0.18, h, '', 'Surge Protection 1p', null, null, this.getTagsForStencil(gn, 'surge_protection_1p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'surge_protection_2p;', 
					w * 0.36, h, '', 'Surge Protection 2p', null, null, this.getTagsForStencil(gn, 'surge_protection_2p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'surge_protection_3p;', 
					w * 0.54, h, '', 'Surge Protection 3p', null, null, this.getTagsForStencil(gn, 'surge_protection_3p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'surge_protection_4p;', 
					w * 0.72, h, '', 'Surge Protection 4p', null, null, this.getTagsForStencil(gn, 'surge_protection_4p', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_4mm2;', 
					w * 0.05, h * 0.5, '', 'Terminal 4mm2', null, null, this.getTagsForStencil(gn, 'terminal_4mm2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_4mm2_x10;', 
					w * 0.5, h * 0.5, '', 'Terminal 4mm2 x10', null, null, this.getTagsForStencil(gn, 'terminal_4mm2_x10', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_4_6mm2;', 
					w * 0.05, h * 0.6, '', 'Terminal 4-6mm2', null, null, this.getTagsForStencil(gn, 'terminal_4_6mm2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_4_6mm2_x10;', 
					w * 0.5, h * 0.6, '', 'Terminal 4-6mm2 x10', null, null, this.getTagsForStencil(gn, 'terminal_4_6mm2_x10', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_6_25mm2;', 
					w * 0.1, h * 0.75, '', 'Terminal 6-25mm2', null, null, this.getTagsForStencil(gn, 'terminal_6_25mm2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_6_25mm2_x10;', 
					w, h * 0.75, '', 'Terminal 6-25mm2 x10', null, null, this.getTagsForStencil(gn, 'terminal_6_25mm2_x10', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_40mm2;', 
					w * 0.22, h, '', 'Terminal 40mm2', null, null, this.getTagsForStencil(gn, 'terminal_40mm2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_40mm2_x10;', 
					w * 2.2, h, '', 'Terminal 40mm2 x10', null, null, this.getTagsForStencil(gn, 'terminal_40mm2_x10', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_50mm2;', 
					w * 0.25, h * 1.1, '', 'Terminal 50mm2', null, null, this.getTagsForStencil(gn, 'terminal_50mm2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_50mm2_x10;', 
					w * 2.5, h * 1.1, '', 'Terminal 50mm2 x10', null, null, this.getTagsForStencil(gn, 'terminal_50mm2_x10', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_75mm2;', 
					w * 0.3, h * 1.4, '', 'Terminal 75mm2', null, null, this.getTagsForStencil(gn, 'terminal_75mm2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'terminal_75mm2_x10;', 
					w * 3, h * 1.4, '', 'Terminal 75mm2 x10', null, null, this.getTagsForStencil(gn, 'terminal_75mm2_x10', dt).join(' '))
		];
	   	
		this.addPalette('cabinets', mxResources.get('cabinets'), false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();

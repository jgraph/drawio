(function()
{
	// Adds BPMN shapes
	var sidebarAddBpmnPalette = Sidebar.prototype.addBpmnPalette;
	
	Sidebar.prototype.addBpmnPalette = function(dir, expand)
	{
		sidebarAddBpmnPalette.apply(this, arguments);

		var w = 50;
		var h = 50;

		var s = 'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=rhombusPerimeter;background=gateway;outlineConnect=0;';
		//default tags
		var dt = 'bpmn business process model gateway ';
		
		this.addPaletteFunctions('bpmnGateways', 'BPMN Gateways', false,
		[
			this.createVertexTemplateEntry(s + 'outline=none;symbol=exclusiveGw;', w, h, '', 'Exclusive Gateway', null, null, dt + 'exclusive'),
			this.createVertexTemplateEntry(s + 'outline=none;symbol=parallelGw;', w, h, '', 'Parallel Gateway', null, null, dt + 'parallel'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=general;', w, h, '', 'Inclusive Gateway', null, null, dt + 'inclusive'),
			this.createVertexTemplateEntry(s + 'outline=none;symbol=complexGw;', w, h, '', 'Complex Gateway', null, null, dt + 'complex'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=general;', w, h, '', 'General Start Gateway', null, null, dt + 'general start'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=general;', w, h, '', 'General Intermediate Gateway', null, null, dt + 'general intermediate'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=general;', w, h, '', 'General End Gateway', null, null, dt + 'general end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=message;', w, h, '', 'Message Standard Gateway', null, null, dt + 'message standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=message;', w, h, '', 'Message Interrupting Gateway', null, null, dt + 'message interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=message;', w, h, '', 'Message Non-Interrupting Gateway', null, null, dt + 'message non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=message;', w, h, '', 'Message Catching Gateway', null, null, dt + 'message catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=message;', w, h, '', 'Message Boundary Interrupting Gateway', null, null, dt + 'message boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=message;', w, h, '', 'Message Boundary Non-Interrupting Gateway', null, null, dt + 'message boundary non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=message;', w, h, '', 'Message Throwing Gateway', null, null, dt + 'message throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=message;', w, h, '', 'Message End Gateway', null, null, dt + 'message end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=timer;', w, h, '', 'Timer Standard Gateway', null, null, dt + 'timer standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=timer;', w, h, '', 'Timer Interrupting Gateway', null, null, dt + 'timer interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=timer;', w, h, '', 'Timer Non-Interrupting Gateway', null, null, dt + 'timer non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=timer;', w, h, '', 'Timer Catching Gateway', null, null, dt + 'timer catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=timer;', w, h, '', 'Timer Boundary Interrupting Gateway', null, null, dt + 'timer boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=timer;', w, h, '', 'Timer Boundary Non-Interrupting Gateway', null, null, dt + 'timer boundary non interrupting noninterrupting'),

			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=escalation;', w, h, '', 'Escalation Interrupting Gateway', null, null, dt + 'escalation interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=escalation;', w, h, '', 'Escalation Non-Interrupting Gateway', null, null, dt + 'escalation non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=escalation;', w, h, '', 'Escalation Boundary Interrupting Gateway', null, null, dt + 'escalation boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=escalation;', w, h, '', 'Escalation Boundary Non-Interrupting Gateway', null, null, dt + 'escalation boundary non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=escalation;', w, h, '', 'Escalation Throwing Gateway', null, null, dt + 'escalation throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=escalation;', w, h, '', 'Escalation End Gateway', null, null, dt + 'escalation end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=conditional;', w, h, '', 'Conditional Standard Gateway', null, null, dt + 'conditional standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=conditional;', w, h, '', 'Conditional Interrupting Gateway', null, null, dt + 'conditional interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=conditional;', w, h, '', 'Conditional Non-Interrupting Gateway', null, null, dt + 'conditional non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=conditional;', w, h, '', 'Conditional Catching Gateway', null, null, dt + 'conditional catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=conditional;', w, h, '', 'Conditional Boundary Interrupting Gateway', null, null, dt + 'conditional boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=conditional;', w, h, '', 'Conditional Boundary Non-Interrupting Gateway', null, null, dt + 'conditional boundary non interrupting noninterrupting'),

			this.createVertexTemplateEntry(s + 'outline=catching;symbol=link;', w, h, '', 'Link Catching Gateway', null, null, dt + 'link catching'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=link;', w, h, '', 'Link Throwing Gateway', null, null, dt + 'link throwing'),

			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=error;', w, h, '', 'Error Interrupting Gateway', null, null, dt + 'error interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=error;', w, h, '', 'Error Boundary Interrupting Gateway', null, null, dt + 'error boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=error;', w, h, '', 'Error End Gateway', null, null, dt + 'error end'),

			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=cancel;', w, h, '', 'Cancel Boundary Interrupting Gateway', null, null, dt + 'cancel boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=cancel;', w, h, '', 'Cancel End Gateway', null, null, dt + 'cancel end'),

			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=compensation;', w, h, '', 'Compensation Interrupting Gateway', null, null, dt + 'compensation interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=compensation;', w, h, '', 'Compensation Boundary Interrupting Gateway', null, null, dt + 'compensation boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=compensation;', w, h, '', 'Compensation Throwing Gateway', null, null, dt + 'compensation throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=compensation;', w, h, '', 'Compensation End Gateway', null, null, dt + 'compensation end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=signal;', w, h, '', 'Signal Standard Gateway', null, null, dt + 'signal standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=signal;', w, h, '', 'Signal Interrupting Gateway', null, null, dt + 'signal interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=signal;', w, h, '', 'Signal Non-Interrupting Gateway', null, null, dt + 'signal non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=signal;', w, h, '', 'Signal Catching Gateway', null, null, dt + 'signal catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=signal;', w, h, '', 'Signal Boundary Interrupting Gateway', null, null, dt + 'signal boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=signal;', w, h, '', 'Signal Boundary Non-Interrupting Gateway', null, null, dt + 'signal boundary non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=signal;', w, h, '', 'Signal Throwing Gateway', null, null, dt + 'signal throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=signal;', w, h, '', 'Signal End Gateway', null, null, dt + 'signal end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=multiple;', w, h, '', 'Multiple Standard Gateway', null, null, dt + 'multiple standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=multiple;', w, h, '', 'Multiple Interrupting Gateway', null, null, dt + 'multiple interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=multiple;', w, h, '', 'Multiple Non-Interrupting Gateway', null, null, dt + 'multiple non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=multiple;', w, h, '', 'Multiple Catching Gateway', null, null, dt + 'multiple catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=multiple;', w, h, '', 'Multiple Boundary Interrupting Gateway', null, null, dt + 'multiple boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=multiple;', w, h, '', 'Multiple Boundary Non-Interrupting Gateway', null, null, dt + 'multiple boundary non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=multiple;', w, h, '', 'Multiple Throwing Gateway', null, null, dt + 'multiple throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=multiple;', w, h, '', 'Multiple End Gateway', null, null, dt + 'multiple end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=star;', w, h, '', 'Multiple Start Gateway', null, null, dt + 'multiple end'),
			
			this.createVertexTemplateEntry(s + 'outline=standard;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Standard Gateway', null, null, dt + 'parallel multiple standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Interrupting Gateway', null, null, dt + 'parallel multiple interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Non-Interrupting Gateway', null, null, dt + 'parallel multiple non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Catching Gateway', null, null, dt + 'parallel multiple catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Interrupting Gateway', null, null, dt + 'parallel multiple boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Non-Interrupting Gateway', null, null, dt + 'parallel multiple boundary non interrupting noninterrupting'),

			this.createVertexTemplateEntry(s + 'outline=end;symbol=terminate;', w, h, '', 'Terminate Gateway', null, null, dt + 'terminate')
		]);
		
		s = 'shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;align=center;perimeter=ellipsePerimeter;outlineConnect=0;';
		var dt = 'bpmn business process model event ';
		
		this.addPaletteFunctions('bpmnEvents', 'BPMN Events', false,
		[
			this.createVertexTemplateEntry(s + 'outline=standard;symbol=general;', w, h, '', 'General Start', null, null, dt + 'general start'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=general;', w, h, '', 'General Intermediate', null, null, dt + 'general intermediate'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=general;', w, h, '', 'General End', null, null, dt + 'general end'),
			
			this.createVertexTemplateEntry(s + 'outline=standard;symbol=message;', w, h, '', 'Message Standard', null, null, dt + 'message standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=message;', w, h, '', 'Message Interrupting', null, null, dt + 'message interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=message;', w, h, '', 'Message Non-Interrupting', null, null, dt + 'message non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=message;', w, h, '', 'Message Catching', null, null, dt + 'message catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=message;', w, h, '', 'Message Boundary Interrupting', null, null, dt + 'message boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=message;', w, h, '', 'Message Boundary Non-Interrupting', null, null, dt + 'message boundary non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=message;', w, h, '', 'Message Throwing', null, null, dt + 'message throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=message;', w, h, '', 'Message End', null, null, dt + 'message end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=timer;', w, h, '', 'Timer Standard', null, null, dt + 'timer standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=timer;', w, h, '', 'Timer Interrupting', null, null, dt + 'timer interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=timer;', w, h, '', 'Timer Non-Interrupting', null, null, dt + 'timer non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=timer;', w, h, '', 'Timer Catching', null, null, dt + 'timer catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=timer;', w, h, '', 'Timer Boundary Interrupting', null, null, dt + 'timer boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=timer;', w, h, '', 'Timer Boundary Non-Interrupting', null, null, dt + 'timer boundary non interrupting noninterrupting'),

			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=escalation;', w, h, '', 'Escalation Interrupting', null, null, dt + 'escalation interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=escalation;', w, h, '', 'Escalation Non-Interrupting', null, null, dt + 'escalation non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=escalation;', w, h, '', 'Escalation Boundary Interrupting', null, null, dt + 'escalation boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=escalation;', w, h, '', 'Escalation Boundary Non-Interrupting', null, null, dt + 'escalation boundary non interrupting nonimpterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=escalation;', w, h, '', 'Escalation Throwing', null, null, dt + 'escalation throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=escalation;', w, h, '', 'Escalation End', null, null, dt + 'escalation end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=conditional;', w, h, '', 'Conditional Standard', null, null, dt + 'conditional standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=conditional;', w, h, '', 'Conditional Interrupting', null, null, dt + 'conditional interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=conditional;', w, h, '', 'Conditional Non-Interrupting', null, null, dt + 'conditional non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=conditional;', w, h, '', 'Conditional Catching', null, null, dt + 'conditional catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=conditional;', w, h, '', 'Conditional Boundary Interrupting', null, null, dt + 'conditional boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=conditional;', w, h, '', 'Conditional Boundary Non-Interrupting', null, null, dt + 'conditional boundary non interrupting noninterrupting'),

			this.createVertexTemplateEntry(s + 'outline=catching;symbol=link;', w, h, '', 'Link Catching', null, null, dt + 'link catching'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=link;', w, h, '', 'Link Throwing', null, null, dt + 'link throwing'),

			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=error;', w, h, '', 'Error Interrupting', null, null, dt + 'error interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=error;', w, h, '', 'Error Boundary Interrupting', null, null, dt + 'error boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=error;', w, h, '', 'Error End', null, null, dt + 'error end'),

			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=cancel;', w, h, '', 'Cancel Boundary Interrupting', null, null, dt + 'cancel boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=cancel;', w, h, '', 'Cancel End', null, null, dt + 'cancel end'),

			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=compensation;', w, h, '', 'Compensation Interrupting', null, null, dt + 'compensation interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=compensation;', w, h, '', 'Compensation Boundary Interrupting', null, null, dt + 'compensation boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=compensation;', w, h, '', 'Compensation Throwing', null, null, dt + 'compensation throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=compensation;', w, h, '', 'Compensation End', null, null, dt + 'compensation end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=signal;', w, h, '', 'Signal Standard', null, null, dt + 'signal standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=signal;', w, h, '', 'Signal Interrupting', null, null, dt + 'signal interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=signal;', w, h, '', 'Signal Non-Interrupting', null, null, dt + 'signal non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=signal;', w, h, '', 'Signal Catching', null, null, dt + 'signal catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=signal;', w, h, '', 'Signal Boundary Interrupting', null, null, dt + 'signal boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=signal;', w, h, '', 'Signal Boundary Non-Interrupting', null, null, dt + 'signal boundary non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=signal;', w, h, '', 'Signal Throwing', null, null, dt + 'signal throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=signal;', w, h, '', 'Signal End', null, null, dt + 'signal end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=multiple;', w, h, '', 'Multiple Standard', null, null, dt + 'multiple standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=multiple;', w, h, '', 'Multiple Interrupting', null, null, dt + 'multiple interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=multiple;', w, h, '', 'Multiple Non-Interrupting', null, null, dt + 'multiple non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=multiple;', w, h, '', 'Multiple Catching', null, null, dt + 'multiple catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=multiple;', w, h, '', 'Multiple Boundary Interrupting', null, null, dt + 'multiple boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=multiple;', w, h, '', 'Multiple Boundary Non-Interrupting', null, null, dt + 'multiple boundary non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=throwing;symbol=multiple;', w, h, '', 'Multiple Throwing', null, null, dt + 'multiple throwing'),
			this.createVertexTemplateEntry(s + 'outline=end;symbol=multiple;', w, h, '', 'Multiple End', null, null, dt + 'multiple end'),

			this.createVertexTemplateEntry(s + 'outline=standard;symbol=star;', w, h, '', 'Multiple Start', null, null, dt + 'multiple start'),
			
			this.createVertexTemplateEntry(s + 'outline=standard;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Standard', null, null, dt + 'parallel multiple standard'),
			this.createVertexTemplateEntry(s + 'outline=eventInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Interrupting', null, null, dt + 'parallel multiple interrupting'),
			this.createVertexTemplateEntry(s + 'outline=eventNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Non-Interrupting', null, null, dt + 'parallel multiple non interrupting noninterrupting'),
			this.createVertexTemplateEntry(s + 'outline=catching;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Catching', null, null, dt + 'parallel multiple catching'),
			this.createVertexTemplateEntry(s + 'outline=boundInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Interrupting', null, null, dt + 'parallel multiple boundary interrupting'),
			this.createVertexTemplateEntry(s + 'outline=boundNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Non-Interrupting', null, null, dt + 'parallel multiple boundary non interrupting'),

			this.createVertexTemplateEntry(s + 'outline=end;symbol=terminate;', w, h, '', 'Terminate', null, null, dt + 'terminate')
		]);
	};
})();

/**
 * Handles paste from Lucidchart
 * 
 * TODO: Move to dynamic loading minimized plugin.
 */
LucidImporter = {};
(function()
{
	// Global import transformation
	var defaultFontSize = '11';
	var scale = 0.6;
	var dx = 0;
	var dy = 0;
	
	var arcSize = 6;
	var edgeStyle = 'html=1;jettySize=18;';
	var vertexStyle = 'html=1;whiteSpace=wrap;';
	var labelStyle = 'text;html=1;resizable=0;labelBackgroundColor=#ffffff;align=center;verticalAlign=middle;';
	
	var c = "fillColor=#036897;strokeColor=#ffffff";
	var s = "shape=mxgraph.";
	var ss = "strokeColor=none;shape=mxgraph.";
	var cs = 'mxCompositeShape';
//	stencils with hardcoded rounding
	var hardRound = [
		'GSDFDProcessBlock',
		'GSDFDProcessBlock2',
		'RoundedRectangleContainerBlock',
		'UI2ButtonBlock',
		'UMLStateBlock'
	];
	
//	stencils with hardcoded default rounding (having absolute rounding of arcSize=8 without declaring anything)
	var hardDefRound = [
		'UMLActivationBlock'
	];

//	stencils with hardcoded stroke color
	var hardStroke = [
		'VennPlainColor1', 
		'VennPlainColor2', 
		'VennPlainColor3', 
		'VennPlainColor4', 
		'VennPlainColor5', 
		'VennPlainColor6', 
		'VennPlainColor7', 
		'VennPlainColor8',
		'VennGradientColor1', 
		'VennGradientColor2', 
		'VennGradientColor3', 
		'VennGradientColor4', 
		'VennGradientColor5', 
		'VennGradientColor6', 
		'VennGradientColor7', 
		'VennGradientColor8', 
		'UMLEndBlock',
		'DefaultTextBlockNew',
		'iOSButton'
	];
	
	//stencils with hardCoded fill color
	var hardFill = [
		'AWSAndroidBlock3', 
		'AWSiOSBlock3', 
		'AWSJavaBlock3', 
		'AWSJavaScript', 
		'AWSNetBlock3', 
		'AWSNodeJSBlock3', 
		'AWSPHPBlock3', 
		'AWSPythonBlock3', 
		'AWSRubyBlock3', 
		'AWSXamarin', 
		'AWSCLIBlock3', 
		'AWSEclipseToolkitBlock3', 
		'AWSVisualStudioToolkitBlock3', 
		'AWSWindowsPowershellToolkitBlock3', 
		'DefaultTextBlock', 
		'RectangleContainerBlock', 
		'UMLStartBlock', 
		'UMLEndBlock',
		'DefaultTextBlockNew',
		'UMLHForkJoinBlock',
		'iOSButton'
	];

//	stencils with hardcoded opacity
	var hardOpacity = [
		'VennPlainColor1', 
		'VennPlainColor2', 
		'VennPlainColor3', 
		'VennPlainColor4', 
		'VennPlainColor5', 
		'VennPlainColor6', 
		'VennPlainColor7', 
		'VennPlainColor8', 
		'VennGradientColor1', 
		'VennGradientColor2', 
		'VennGradientColor3', 
		'VennGradientColor4', 
		'VennGradientColor5', 
		'VennGradientColor6', 
		'VennGradientColor7', 
		'VennGradientColor8'
	];

	//stencils to rotate counter clockwise 90 degrees
	var rccw = [
		'AEUSBBlock', 
		'AGSCutandpasteBlock', 
		'iOSDeviceiPadLandscape', 
		'iOSDeviceiPadProLandscape'
	];
	
	//stencils to rotate clockwise 180 degrees
	var rcw2 = [
		'fpDoor'
	];
	
	var edgeStyleMap = {
						'None': 'none',
						'Arrow': 'block;endFill=1',
						'Hollow Arrow': 'block;endFill=0',
						'Open Arrow': 'open;',
						'CFN ERD Zero Or More Arrow': 'ERzeroToMany;startSize=10',
						'CFN ERD One Or More Arrow': 'ERoneToMany;startSize=10',
						'CFN ERD Many Arrow': 'ERmany;startSize=10',
						'CFN ERD Exactly One Arrow': 'ERmandOne;startSize=10',
						'CFN ERD Zero Or One Arrow': 'ERzeroToOne;startSize=10',
						'CFN ERD One Arrow': 'ERone;startSize=16',
						'Generalization': 'block;endFill=0;startSize=12',
						'Big Open Arrow': 'open;startSize=10',
						'Asynch1': 'openAsync;flipH=1;startSize=10',
						'Asynch2': 'openAsync;startSize=10',
						'Aggregation': 'diamond;endFill=0;startSize=16',
						'Composition': 'diamond;endFill=1;startSize=16',
						'BlockEnd': 'none;endFill=1;startSize=16'
	};

	var styleMap = {
//Standard
			'DefaultTextBlockNew': 'text;strokeColor=none;fillColor=none',
			'DefaultTextBlock': 'text;strokeColor=none;fillColor=none',
			'DefaultSquareBlock': '',
			'DefaultNoteBlock': 'shape=note;size=15',
			'DefaultNoteBlockV2': 'shape=note;size=15',
			'HotspotBlock': 'strokeColor=none;opacity=50',
			'ImageSearchBlock2': 'shape=image',
//Flowchart
			'ProcessBlock': '',
			'DecisionBlock': 'rhombus',
			'TerminatorBlock': 'rounded=1;arcSize=50',
			'PredefinedProcessBlock': 'shape=process',
			'DocumentBlock': 'shape=document',
			'MultiDocumentBlock': s + 'flowchart.multi-document',
			'ManualInputBlock': 'shape=manualInput;size=15',
			'PreparationBlock': 'shape=hexagon;perimeter=hexagonPerimeter2',
			'DataBlock': 'shape=parallelogram;perimeter=parallelogramPerimeter;anchorPointDirection=0',
			'DataBlockNew': 'shape=parallelogram;perimeter=parallelogramPerimeter;anchorPointDirection=0',
			'DatabaseBlock': 'shape=cylinder;size=0.1;anchorPointDirection=0;boundedLbl=1;',
			'DirectAccessStorageBlock': 'shape=cylinder;direction=south;size=0.1;anchorPointDirection=0;boundedLbl=1;',
			'InternalStorageBlock': 'shape=internalStorage;dx=10;dy=10',
			'PaperTapeBlock': 'shape=tape;size=0.2',
			'ManualOperationBlockNew': 'shape=trapezoid;perimeter=trapezoidPerimeter;anchorPointDirection=0;flipV=1',
			'DelayBlock': 'shape=delay',
			'StoredDataBlock': 'shape=dataStorage',
			'MergeBlock': 'triangle;direction=south;anchorPointDirection=0',
			'ConnectorBlock': 'ellipse',
			'OrBlock': s + 'flowchart.summing_function',
			'SummingJunctionBlock': s + 'flowchart.or',
			'DisplayBlock': 'shape=display',
			'OffPageLinkBlock': 'shape=offPageConnector',
			'BraceNoteBlock': cs,
			'NoteBlock': s + 'flowchart.annotation_1',
//Containers
			'AdvancedSwimLaneBlock': cs,
			'AdvancedSwimLaneBlockRotated': cs, //TODO
//			'AdvancedSwimLaneBlockRotated': 'swimlane;horizontal=0', //TODO
			'RectangleContainerBlock': 'fillColor=none;container=1',
			'DiamondContainerBlock':  'shape=rhombus;fillColor=none;container=1',
			'RoundedRectangleContainerBlock': 'fillColor=none;container=1;rounded=1;absoluteArcSize=1;arcSize=24',
			'CircleContainerBlock': 'shape=ellipse;fillColor=none;container=1',
			'PillContainerBlock': 'arcSize=50;fillColor=none;container=1',
//			'BraceBlock' NA
//			'BracketBlock' NA
//			'BraceBlockRotated' NA
//			'BracketBlockRotated' NA
//Geometric shapes
			'IsoscelesTriangleBlock': 'triangle;direction=north;anchorPointDirection=0',
			'RightTriangleBlock': s + 'basic.orthogonal_triangle',
			'PentagonBlock': s + 'basic.pentagon',
			'HexagonBlock': 'shape=hexagon;perimeter=hexagonPerimeter2',
			'OctagonBlock': s + 'basic.octagon',
			'CrossBlock': 'shape=cross;size=0.6',
			'CloudBlock': 'ellipse;shape=cloud',
			'HeartBlock': s + 'basic.heart',
			'RightArrowBlock': 'shape=singleArrow;arrowWidth=0.5;arrowSize=0.3',
			'DoubleArrowBlock': 'shape=doubleArrow;arrowWidth=0.5;arrowSize=0.3',
			'CalloutBlock': s + 'basic.rectangular_callout',
			'ShapeCircleBlock': 'ellipse',
			'ShapePolyStarBlock': s + 'basic.star',
			'ShapeDiamondBlock': 'rhombus',
//Misc
			'UI2HotspotBlock' : 'opacity=50;strokeColor=none',
//Android Devices
			'AndroidDevice' : cs,
//Android Dialogs
			'AndroidAlertDialog' : cs,
			'AndroidDateDialog' : cs,
			'AndroidTimeDialog' : cs,
//Android Blocks
			'AndroidListItems' : cs,
			'AndroidTabs' : cs,
			'AndroidProgressBar' : cs,
			'AndroidImageBlock' : cs,
			'AndroidTextBlock' : cs,
			'AndroidActionBar' : cs,
//			'AndroidBrowserBar' NA
//Android Inputs
			'AndroidButton' : cs,
			'AndroidTextBox' : cs,
			'AndroidRadioButton' : cs,
			'AndroidCheckBox' : cs,
			'AndroidToggle' : cs,
			'AndroidSlider' : cs,
//Android Icons (not working properly, needs specific code)
			'AndroidIconCheck': s + 'ios7.misc.check',
//			'AndroidIconBack' NA
			'AndroidIconCancel' : s + 'atlassian.x',
			'AndroidIconCollapse': s + 'ios7.misc.up',
			'AndroidIconExpand': s + 'ios7.misc.down',
//			'AndroidIconForward' NA
			'AndroidIconNext': s + 'ios7.misc.right',
			'AndroidIconPrevious': s + 'ios7.misc.left',
			'AndroidIconRefresh' : + 'ios7.icons.repeat',
			'AndroidIconInformation': s + 'ios7.icons.info',
//			'AndroidIconHelp' NA
			'AndroidIconSearch': s + 'ios7.icons.looking_glass',
			'AndroidIconSettings': s + 'ios7.icons.volume;direction=south',
//			'AndroidIconDislike' NA
//			'AndroidIconLike' NA
//			'AndroidIconDelete' NA
//			'AndroidIconCopy' NA
//			'AndroidIconCut' NA
//			'AndroidIconPaste' NA
			'AndroidIconTrash': s + 'ios7.icons.trashcan',
			'AndroidIconEmail': s + 'mockup.misc.mail2',
			'AndroidIconNew': s + 'ios7.misc.flagged', 
//			'AndroidIconImage' NA
//			'AndroidIconUndo' NA
//			'AndroidIconSharing' NA
//			'AndroidIconDownload' NA
//			'AndroidIconError' NA
//			'AndroidIconWarning' NA
//iOS mockups
			'iOSDeviceiPhoneSE': s + 'ios7.misc.iphone',
			'iOSDeviceiPhone6s': s + 'ios7.misc.iphone',
			'iOSDeviceiPhone6sPlus': s + 'ios7.misc.iphone',
			'iOSDeviceiPadPortrait': s + 'ios7.misc.ipad7inch',
			'iOSDeviceiPadLandscape': s + 'ios7.misc.ipad7inch',
			'iOSDeviceiPadProPortrait': s + 'ios7.misc.ipad7inch',
			'iOSDeviceiPadProLandscape': s + 'ios7.misc.ipad10inch',
//iOS UI components
			'iOSButton': 'fillColor=none;strokeColor=none;',
			'iOSSegmentedControl' : cs, //TODO
			'iOSStepper': s + 'ios7.misc.adjust',
			'iOSToggle': s + 'ios7ui.onOffButton;buttonState=on;strokeColor2=#aaaaaa;fillColor2=#ffffff',
			'iOSSlider': cs,
			'iOSProgressBar': cs,
			'iOSPageControls': cs,
			'iOSStatusBar' : cs, 
			'iOSSearchBar' : cs,
			'iOSNavBar' : cs,
			'iOSTabs' : cs,
			'iOSUniversalKeyboard': s + 'ios.iKeybLett',
			'iOSDatePicker' : cs,
			'iOSTimePicker' : cs,
			'iOSCountdownPicker' : cs,
			'iOSBasicCell' : cs,
			'iOSSubtitleCell' : cs,
			'iOSRightDetailCell' : cs,
			'iOSLeftDetailCell' : cs,
			'iOSTableGroupedSectionBreak' : cs,
			'iOSTablePlainHeaderFooter' : cs,
//Mind Map
			'MindMapBlock' : '',
			'MindMapStadiumBlock' : 'arcSize=50',
			'MindMapCloud' : 'shape=cloud',
			'MindMapCircle' : 'shape=ellipse',
			'MindMapIsoscelesTriangleBlock' : 'shape=triangle;direction=north',
			'MindMapDiamondBlock' : 'shape=rhombus',
			'MindMapPentagonBlock' : s + 'basic.pentagon',
			'MindMapHexagonBlock' : 'shape=hexagon;perimeter=hexagonPerimeter2',
			'MindMapOctagonBlock' : s + 'basic.octagon',
			'MindMapCrossBlock' : s + 'basic.cross2;dx=20',
//Entity Relationship
			'ERDEntityBlock' : cs,
			'ERDEntityBlock2' : cs,
			'ERDEntityBlock3' : cs,
			'ERDEntityBlock4' : cs,
//Site Maps
			'SMPage'  : 'shape=mxgraph.sitemap.page',
			'SMHome'  : 'shape=mxgraph.sitemap.home',
			'SMGallery' : 'shape=mxgraph.sitemap.gallery',
			'SMShopping' : 'shape=mxgraph.sitemap.shopping',
			'SMMap' : 'shape=mxgraph.sitemap.map',
			'SMAthletics' : 'shape=mxgraph.sitemap.sports',
			'SMLogin' : 'shape=mxgraph.sitemap.login',
			'SMPrint'  : 'shape=mxgraph.sitemap.print',
			'SMScript' : 'shape=mxgraph.sitemap.script',
			'SMSearch'  : 'shape=mxgraph.sitemap.search',
			'SMSettings'  : 'shape=mxgraph.sitemap.settings',
			'SMSitemap'  : 'shape=mxgraph.sitemap.sitemap',
			'SMSuccess'  : 'shape=mxgraph.sitemap.success',
			'SMVideo'  : 'shape=mxgraph.sitemap.video',
			'SMAudio'  : 'shape=mxgraph.sitemap.audio',
			'SMBlog' : 'shape=mxgraph.sitemap.blog',
			'SMCalendar'  : 'shape=mxgraph.sitemap.calendar',
			'SMChart'  : 'shape=mxgraph.sitemap.chart',
			'SMCloud'  : 'shape=mxgraph.sitemap.cloud',
			'SMDocument'  : 'shape=mxgraph.sitemap.document',
			'SMDownload' : 'shape=mxgraph.sitemap.download',
			'SMError' : 'shape=mxgraph.sitemap.error',
			'SMForm'  : 'shape=mxgraph.sitemap.form',
			'SMGame'  : 'shape=mxgraph.sitemap.game',
			'SMJobs' : 'shape=mxgraph.sitemap.jobs',
			'SMLucid' : 'shape=mxgraph.sitemap.page',
			'SMNewspress' : 'shape=mxgraph.sitemap.news',
			'SMPhoto' : 'shape=mxgraph.sitemap.photo',
			'SMPortfolio' : 'shape=mxgraph.sitemap.portfolio',
			'SMPricing' : 'shape=mxgraph.sitemap.pricing',
			'SMProfile' : 'shape=mxgraph.sitemap.profile',
			'SMSlideshow' : 'shape=mxgraph.sitemap.slideshow',
			'SMUpload'  : 'shape=mxgraph.sitemap.upload',
//UML Class Diagram
			'UMLClassBlock': cs,
			'UMLActiveClassBlock': 'shape=process',
			'UMLMultiplicityBlock' : cs,
			'UMLPackageBlock': 'shape=folder;tabPosition=left',
			'UMLConstraintBlock' : cs,
			'UMLNoteBlock': 'shape=note;size=15',
			'UMLTextBlock': cs,
//UML Use Case
			'UMLActorBlock': 'shape=umlActor;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;whiteSpace=nowrap',
			'UMLUseCaseBlock': 'shape=ellipse',
			'UMLCircleContainerBlock': 'shape=ellipse;container=1',
			'UMLRectangleContainerBlock': 'container=1',
//UML State/Activity			
			'UMLOptionLoopBlock' : s + 'sysml.package2;xSize=90;overflow=fill',
			'UMLAlternativeBlock2' : s + 'sysml.package2;xSize=90;overflow=fill',
			'UMLStartBlock' : 'shape=ellipse;fillColor=#000000',
			'UMLStateBlock' : 'rounded=1;arcSize=20',
			'UMLDecisionBlock' : 'shape=rhombus;',
			'UMLHForkJoinBlock' : 'fillColor=#000000',
			'UMLVForkJoinBlock' : 'fillColor=#000000',
			'UMLFlowFinalBlock' : s + 'flowchart.or',
			'UMLHistoryStateBlock' : 'shape=ellipse',
			'UMLEndBlock' : s + 'bpmn.shape;outline=end;symbol=terminate;strokeColor=#000000;fillColor=#ffffff',
			'UMLObjectBlock' : '',
			'UMLSendSignalBlock' : s + 'sysml.sendSigAct',
			'UMLReceiveSignalBlock' : s + 'sysml.accEvent;flipH=1',
			'UMLAcceptTimeEventActionBlock' : s + 'sysml.timeEvent',
//			'UMLInterruptingEdgeBlock' NA
			'UMLOffPageLinkBlock' : s + 'sysml.sendSigAct;direction=south',
//			'UMLExpansionNodeBlock' NA
			'UMLMultiLanePoolBlock' : cs, //TODO
			'UMLMultiLanePoolRotatedBlock' : cs, //TODO
			'UMLMultidimensionalSwimlane' : cs, //TODO
//UML Sequence
			'UMLActivationBlock' : '',
			'UMLDeletionBlock' : s + 'sysml.x;strokeWidth=4',
//			'UMLAlternativeBlock' NA
			'UMLSeqEntityBlock' : s + 'electrical.radio.microphone_1;direction=north',
//			'UMLBoundaryBlock' NA
//			'UMLControlBlock'NA
//UML Component
			'UMLComponentBlock' : 'shape=component;align=left;spacingLeft=36',
			'UMLNodeBlock' : 'shape=cube;size=12;flipH=1',
			'UMLComponentInterfaceBlock' : 'shape=ellipse',
			'UMLComponentBoxBlock' : cs, //TODO
//			'UMLAssemblyConnectorBlock' NA
			'UMLProvidedInterfaceBlock' : 'shape=lollipop;direction=south',
			'UMLRequiredInterfaceBlock' : 'shape=requires;direction=north',
//UML Deployment
//UML Entity Relationship
			'UMLEntityBlock' : '',
			'UMLWeakEntityBlock' : 'shape=ext;double=1',
			'UMLAttributeBlock' : 'shape=ellipse',
			'UMLMultivaluedAttributeBlock' : 'shape=doubleEllipse',
			'UMLRelationshipBlock' : 'shape=rhombus',
			'UMLWeakRelationshipBlock' : 'shape=rhombus;double=1',
//BPMN 2.0
			'BPMNActivity' : cs,
			'BPMNEvent' : cs,
			'BPMNChoreography' : cs, //TODO
			'BPMNConversation' : cs,
			'BPMNGateway' : cs,
			'BPMNData' : cs,
			'BPMNDataStore' : 'shape=datastore', 
			'BPMNAdvancedPoolBlock' : cs, //TODO
			'BPMNAdvancedPoolBlockRotated' : cs, //TODO
			'BPMNBlackPool' : cs,
//Data Flow
			'DFDExternalEntityBlock' : cs,
			'DFDExternalEntityBlock2' : '',
			'YDMDFDProcessBlock' : 'shape=ellipse',
			'YDMDFDDataStoreBlock' : 'shape=partialRectangle;right=0;left=0',
			'GSDFDProcessBlock' : 'shape=swimlane;rounded=1;arcSize=10',
			'GSDFDProcessBlock2' : 'rounded=1;arcSize=10;',
			'GSDFDDataStoreBlock' : cs,
			'GSDFDDataStoreBlock2' : 'shape=partialRectangle;right=0',
//Org Chart
			'OrgBlock' : '',
//Tables
			'DefaultTableBlock' : cs, //TODO
//Value Stream Mapping			
//Processes
			'VSMCustomerSupplierBlock' : s + 'lean_mapping.outside_sources',
			'VSMDedicatedProcessBlock' : cs,
			'VSMSharedProcessBlock' : cs,
			'VSMWorkcellBlock' : cs,
			'VSMDatacellBlock' : cs,
//Materials
			'VSMInventoryBlock' : cs,
			'VSMSupermarketBlock' : cs,
			'VSMPhysicalPullBlock' : s + 'lean_mapping.physical_pull;direction=south',
			'VSMFIFOLaneBlock' : cs,
			'VSMSafetyBufferStockBlock' : cs,
//Shipments
			'VSMExternalShipmentAirplaneBlock' : s + 'lean_mapping.airplane_7',
			'VSMExternalShipmentForkliftBlock' : s + 'lean_mapping.move_by_forklift',
			'VSMExternalShipmentTruckBlock' : s + 'lean_mapping.truck_shipment',
			'VSMExternalShipmentBoatBlock' : s + 'lean_mapping.boat_shipment',
//Information
			'VSMProductionControlBlock' : cs,
			'VSMOtherInformationBlock' : '',
//			'VSMHeijyunkaBoxBlock' NA
			'VSMSequencedPullBallBlock' : s + 'lean_mapping.sequenced_pull_ball',
			'VSMMRPERPBlock' : s + 'lean_mapping.mrp_erp;whiteSpace=wrap',
			'VSMLoadLevelingBlock' : s + 'lean_mapping.load_leveling',
			'VSMGoSeeBlock' : s + 'lean_mapping.go_see_production_scheduling;flipH=1',
			'VSMGoSeeProductionBlock' : cs,
			'VSMVerbalInfoBlock' : s + 'lean_mapping.verbal',
//Value Stream Mapping
			'VSMKaizenBurstBlock' : s + 'lean_mapping.kaizen_lightening_burst',
			'VSMOperatorBlock' : s + 'lean_mapping.operator;flipV=1',
			'VSMTimelineBlock' : cs, //TODO
			'VSMQualityProblemBlock' : s + 'lean_mapping.quality_problem',
//Kanban
			'VSMProductionKanbanSingleBlock' : 'shape=card;size=18;flipH=1;',
			'VSMProductionKanbanBatchBlock' : cs,
			'VSMWithdrawalKanbanBlock' : s + 'lean_mapping.withdrawal_kanban',
//			'VSMWithdrawalKanbanBatchBlock' NA
			'VSMSignalKanbanBlock' : 'shape=triangle;direction=south;anchorPointDirection=0',
			'VSMKanbanPostBlock' : s + 'lean_mapping.kanban_post',
//Arrows
			'VSMShipmentArrow': 'shape=singleArrow;arrowWidth=0.5;arrowSize=0.13',
			'VSMPushArrow' : s + 'lean_mapping.push_arrow',
//			'VSMElectronicInformationArrow' : s + 'lean_mapping.electronic_info_flow_edge;', //TODO
//EC2
			'AWSElasticComputeCloudBlock2' : cs,
//			'AWSElasticComputeCloudBlock2' : ss + 'aws3.ec2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSInstanceBlock2' : ss + 'aws3.instance',
			'AWSInstancesBlock2' : ss + 'aws3.instances;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAMIBlock2' : ss + 'aws3.ami;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDBonInstanceBlock2' : ss + 'aws3.db_on_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSInstanceCloudWatchBlock2' : ss + 'aws3.instance_with_cloudwatch;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElasticIPBlock2' : ss + 'aws3.elastic_ip;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSHDFSClusterBlock2' : ss + 'aws3.hdfs_cluster;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAutoScalingBlock2' : ss + 'aws3.auto_scaling;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEC2OptimizedInstance2' : ss + 'aws3.optimized_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonEC2(Spotinstance)' : ss + 'aws3.spot_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonECR' : ss + 'aws3.ecr;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonECS' : ss + 'aws3.ecs;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSLambda2' : ss + 'aws3.lambda;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElasticLoadBalancing' : ss + 'aws3.elastic_load_balancing;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Networking
			'AWSElasticLoadBlock2' : ss + 'aws3.classic_load_balancer;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDirectConnectBlock3' : ss + 'aws3.direct_connect;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElasticNetworkBlock2' : ss + 'aws3.elastic_network_interface;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRoute53Block2' : cs,
			'AWSHostedZoneBlock2' : ss + 'aws3.hosted_zone;fontColor=#FFFFFF;fontStyle=1',
			'AWSRouteTableBlock2' : ss + 'aws3.route_table;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSVPCBlock2' : ss + 'aws3.vpc;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSVPNConnectionBlock2' : ss + 'aws3.vpn_connection;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSVPNGatewayBlock2' : ss + 'aws3.vpn_gateway;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCustomerGatewayBlock2' : ss + 'aws3.customer_gateway;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCustomerGatewayBlock3' : ss + 'aws3.customer_gateway;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSInternetGatewayBlock2' : ss + 'aws3.internet_gateway;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRouterBlock2' : ss + 'aws3.router;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRouterBlock3' : ss + 'aws3.router;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonVPC(endpoints)' : ss + 'aws3.endpoints;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonVPC(flowlogs)' : ss + 'aws3.flow_logs;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonVPC(VPCNATgateway)' : ss + 'aws3.vpc_nat_gateway;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSVPCPeering3' : ss + 'aws3.vpc_peering;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			
//S3
			'AWSSimpleStorageBlock2' : ss + 'aws3.s3;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSBucketBlock2' : ss + 'aws3.bucket;fontStyle=1;fontColor=#ffffff',
			'AWSBuckethWithObjectsBlock2' : ss + 'aws3.bucket_with_objects;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSObjectBlock2' : ss + 'aws3.object;fontStyle=1;fontColor=#ffffff',
			'AWSImportExportBlock2' : ss + 'aws3.import_export;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSStorageGatewayBlock2' : ss + 'aws3.storage_gateway;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElasticBlockStorageBlock2' : ss + 'aws3.volume;fontStyle=1;fontColor=#ffffff',
			'AWSVolumeBlock3' : ss + 'aws3.volume;fontStyle=1;fontColor=#ffffff',
			'AWSSnapshotBlock2' : ss + 'aws3.snapshot;fontStyle=1;fontColor=#ffffff',
			'AWSGlacierArchiveBlock3' : ss + 'aws3.archive;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSGlacierVaultBlock3' : ss + 'aws3.vault;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonEFS' : ss + 'aws3.efs;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSGlacierBlock2' : ss + 'aws3.glacier;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSImportExportSnowball' : ss + 'aws3.snowball;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSStorageGatewayCachedVolumn2' : ss + 'aws3.cached_volume;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSStorageGatewayNon-CachedVolumn2' : ss + 'aws3.non_cached_volume;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSStorageGatewayVirtualTapeLibrary2' : ss + 'aws3.virtual_tape_library;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Content Delivery
			'AWSCloudFrontBlock2' : ss + 'aws3.cloudfront;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDownloadDistBlock2' : ss + 'aws3.download_distribution;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSStreamingBlock2' : ss + 'aws3.streaming_distribution;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEdgeLocationBlock2' : ss + 'aws3.edge_location;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Database
			'AWSItemBlock2' : ss + 'aws3.item;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSItemsBlock2' : ss + 'aws3.items;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAttributeBlock2' : ss + 'aws3.attribute;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAttributesBlock2' : ss + 'aws3.attributes;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRDBSBlock2' : cs,
			'AWSRDSInstanceBlock2' : ss + 'aws3.rds_db_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRDSStandbyBlock2' : ss + 'aws3.rds_db_instance_standby_multi_az;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRDSInstanceReadBlock2' : ss + 'aws3.rds_db_instance_read_replica;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOracleDBBlock2' : ss + 'aws3.oracle_db_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSMySQLDBBlock2' : ss + 'aws3.mysql_db_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDynamoDBBlock2' : ss + 'aws3.dynamo_db;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSSimpleDatabaseBlock3' : ss + 'aws2.database.simpledb;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSSimpleDatabaseDomainBlock3' : ss + 'aws2.database.simpledb_domain;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSTableBlock2' : ss + 'aws3.table;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRedShiftBlock3' : ss + 'aws3.redshift;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElastiCacheNodeBlock2' : ss + 'aws3.cache_node;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElastiCacheBlock2' : ss + 'aws3.elasticache;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDynamoDBGlobalSecondaryIndexes2' : ss + 'aws3.global_secondary_index;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonElastiCacheMemcache2' : ss + 'aws3.memcached;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonElastiCacheRedis2' : ss + 'aws3.redis;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRDSMSSQLInstance2' : ss + 'aws3.ms_sql_instance_2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSMSSQLDBBlock3' : ss + 'aws3.ms_sql_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRDSMySQLDBInstance2' : ss + 'aws3.mysql_db_instance_2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRDSOracleDBInstance2' : ss + 'aws3.oracle_db_instance_2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRDSReplicasetswithPIOP2' : ss + 'aws3.piop;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRDSPostgreSQL2' : ss + 'aws3.postgre_sql_instance;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRDSMasterSQL2' : ss + 'aws3.sql_master;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRDSSlaveSQL2' : ss + 'aws3.sql_slave;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRedshift(densecomputenode)' : ss + 'aws3.dense_compute_node;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRedshift(densestoragenode)' : ss + 'aws3.dense_storage_node;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSDatabaseMigrationService' : ss + 'aws3.database_migration_service;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Security Identity
			'AWSACM' : ss + 'aws3.certificate_manager;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonInspector' : ss + 'aws3.inspector;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSCloudHSM' : ss + 'aws3.cloudhsm;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDirectoryService2' : ss + 'aws3.directory_service;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSKMS' : ss + 'aws3.kms;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSWAF' : ss + 'aws3.waf;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSACM(certificate-manager)' : ss + 'aws3.certificate_manager_2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//App Services
			'AWSSESBlock2' : ss + 'aws3.ses;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEmailBlock2' : ss + 'aws3.email;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSSNSBlock2' : ss + 'aws3.sns;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSSQSBlock3' : ss + 'aws3.sqs;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSQueueBlock2' : ss + 'aws3.queue;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSMessageBlock2' : ss + 'aws3.message;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDeciderBlock2' : ss + 'aws3.decider;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSSWFBlock2' : ss + 'aws3.swf;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSWorkerBlock2' : ss + 'aws3.worker;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCloudSearchBlock2' : ss + 'aws3.cloudsearch;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCloudSearchMetadataBlock3' : ss + 'aws3.search_documents;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElasticTranscoder3' : ss + 'aws3.elastic_transcoder;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonAPIGateway' : ss + 'aws3.api_gateway;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAppStream2' : ss + 'aws3.appstream;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Deployment
			'AWSCloudFormationBlock2' : ss + 'aws3.cloudformation;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDataPipelineBlock3' : ss + 'aws3.data_pipeline;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDataPipelineBlock2' : ss + 'aws3.data_pipeline;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSTemplageBlock2' : ss + 'aws3.template;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSStackBlock2' : ss + 'aws3.stack_aws_cloudformation;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSBeanStockBlock2' : ss + 'aws3.elastic_beanstalk;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSApplicationBlock2' : ss + 'aws3.application;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSBeanstalkDeploymentBlock3' : ss + 'aws3.deployment;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMBlock3' : ss + 'aws3.iam;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMSTSBlock3' : ss + 'aws3.sts;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMAddonBlock2' : ss + 'aws3.add_on;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCloudWatchBlock3' : ss + 'aws3.cloudwatch;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCloudWatchAlarmBlock2' : ss + 'aws3.alarm;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMSecurityTokenService2' : ss + 'aws3.sts_2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMDataEncryptionKey2' : ss + 'aws3.data_encryption_key;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMEncryptedData2' : ss + 'aws3.encrypted_data;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIAM(long-termsecuritycredential)' : ss + 'aws3.long_term_security_credential;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMMFAToken2' : ss + 'aws3.mfa_token;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMPermissions2' : ss + 'aws3.permissions_2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSIAMRoles2' : ss + 'aws3.role;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIAM(temporarysecuritycredential)' : ss + 'aws3.long_term_security_credential;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCloudTrail2' : ss + 'aws3.cloudtrail;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSConfig2' : ss + 'aws3.config;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksBlock3' : ss + 'aws3.opsworks;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSServiceCatalog' : ss + 'aws3.service_catalog;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSTrustedAdvisor2' : ss + 'aws3.trusted_advisor;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksApps2' : ss + 'aws3.apps;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksDeployments2' : ss + 'aws3.deployments;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksInstances2' : ss + 'aws3.instances_2;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksLayers2' : ss + 'aws3.layers;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksMonitoring2' : ss + 'aws3.monitoring;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksPermissions2' : ss + 'aws3.permissions;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksResources2' : ss + 'aws3.resources;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSOpsWorksStack2' : ss + 'aws3.stack_aws_opsworks;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//On-Demand
			'AWSMechanicalTurkBlock3' : ss + 'aws3.mechanical_turk;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSHumanITBlock2' : ss + 'aws3.human_intelligence_tasks_hit;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAssignmentTaskBlock2' : ss + 'aws3.requester;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSWorkersBlock2' : ss + 'aws3.users;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRequesterBlock2' : ss + 'aws3.assignment_task;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//SDKs
			'AWSAndroidBlock3': ss + 'aws3.android;fillColor=#96BF3D;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSiOSBlock3' : ss + 'aws3.android;fillColor=#CFCFCF;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSJavaBlock3' : ss + 'aws3.android;fillColor=#EE472A;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSJavaScript' : ss + 'aws3.android;fillColor=#205E00;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSNetBlock3' : ss + 'aws3.android;fillColor=#115193;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSNodeJSBlock3' : ss + 'aws3.android;fillColor=#8CC64F;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSPHPBlock3' : ss + 'aws3.android;fillColor=#5A69A4;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSPythonBlock3' : ss + 'aws3.android;fillColor=#FFD44F;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSRubyBlock3' : ss + 'aws3.android;fillColor=#AE1F23;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSXamarin' : ss + 'aws3.android;fillColor=#4090D7;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCLIBlock3' : ss + 'aws3.cli;fillColor=#444444;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEclipseToolkitBlock3' : ss + 'aws3.toolkit_for_eclipse;fillColor=#342074;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSVisualStudioToolkitBlock3' : ss + 'aws3.toolkit_for_visual_studio;fillColor=#53B1CB;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSWindowsPowershellToolkitBlock3' : ss + 'aws3.toolkit_for_windows_powershell;fillColor=#737373;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Analytics
			'AWSAmazonElasticsearchService' : ss + 'aws3.elasticsearch_service;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSElasticMapReduceBlock2' : ss + 'aws3.emr;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSClusterBlock2' : ss + 'aws3.emr_cluster;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEMREngine2' : ss + 'aws3.emr_engine;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEMRMapRM3Engine2' : ss + 'aws3.emr_engine_mapr_m3;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEMRMapRM5Engine2' : ss + 'aws3.emr_engine_mapr_m5;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSEMRMapRM7Engine2' : ss + 'aws3.emr_engine_mapr_m7;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSKinesis2' : ss + 'aws3.kinesis;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonKinesis(AmazonKinesisAnalytics)' : ss + 'aws3.kinesis;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSKinesisEnabledApp2' : ss + 'aws3.kinesis_enabled_app;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonKinesis(AmazonKinesisFirehose)' : ss + 'aws3.kinesis_firehose;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonKinesis(AmazonKinesisStreams)' : ss + 'aws3.kinesis_streams;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonMachineLearning' : ss + 'aws3.machine_learning;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonQuickSight' : ss + 'aws3.quicksight;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Mobile Services
			'AWSCognito2' : ss + 'aws3.cognito;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSMobileAnalytics2' : ss + 'aws3.mobile_analytics;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSDeviceFarm' : ss + 'aws3.device_farm;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSMobileHub' : ss + 'aws3.mobile_hub;gradientColor=#AD688A;gradientDirection=east;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSTopicBlock2' : ss + 'aws3.topic_2;fontStyle=1;fontColor=#ffffff;verticalAlign=top;spacingTop=-5',
			'AWSEmailNotificationBlock2' : ss + 'aws3.email_notification;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSHTTPNotificationBlock2' : ss + 'aws3.http_notification;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Developer Tools
			'AWSAWSCodeCommit' : ss + 'aws3.codecommit;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSCodeDeploy2' : ss + 'aws3.codedeploy;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSCodePipeline' : ss + 'aws3.codepipeline;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Enterprise Application
			'AWSWorkDocs2' : ss + 'aws3.workdocs;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonWorkMail' : ss + 'aws3.workmail;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonWorkSpaces2' : ss + 'aws3.workspaces;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//Internet of Things
			'AWSAWSIoT' : ss + 'aws3.aws_iot;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(action)' : ss + 'aws3.action;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(actuator)' : ss + 'aws3.actuator;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(certificate)' : ss + 'aws3.certificate;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(desiredstate)' : ss + 'aws3.desired_state;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(hardwareboard)' : ss + 'aws3.hardware_board;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(HTTP2protocol)' : ss + 'aws3.http_2_protocol;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(HTTPprotocol)' : ss + 'aws3.http_protocol;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(MQTTprotocol)' : ss + 'aws3.mqtt_protocol;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(policy)' : ss + 'aws3.policy;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(reportedstate)' : ss + 'aws3.reported_state;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(rule)' : ss + 'aws3.rule;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(sensor)' : ss + 'aws3.sensor;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(servo)' : ss + 'aws3.servo;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(shadow)' : ss + 'aws3.shadow;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(simulator)' : ss + 'aws3.simulator;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingbank)' : ss + 'aws3.bank;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingbicycle)' : ss + 'aws3.bicycle;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingcamera)' : ss + 'aws3.camera;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingcar)' : ss + 'aws3.car;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingcart)' : ss + 'aws3.cart;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingcoffeepot)' : ss + 'aws3.coffee_pot;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingdoorlock)' : ss + 'aws3.door_lock;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingfactory)' : ss + 'aws3.factory;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thinggeneric)' : ss + 'aws3.generic;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thinghouse)' : ss + 'aws3.house;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thinglightbulb)' : ss + 'aws3.lightbulb;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingmedicalemergency)' : ss + 'aws3.medical_emergency;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingpoliceemergency)' : ss + 'aws3.police_emergency;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingthermostat)' : ss + 'aws3.thermostat;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingtravel)' : ss + 'aws3.travel;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingutility)' : ss + 'aws3.utility;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(thingwindfarm)' : ss + 'aws3.windfarm;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAWSIoT(topic)' : ss + 'aws3.topic;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			
//AWS General			
			'AWSCloudBlock2' : ss + 'aws3.cloud;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSVPCloudBlock3' : ss + 'aws3.virtual_private_cloud;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSUserBlock2' : ss + 'aws3.user;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSUsersBlock2' : ss + 'aws3.users;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSClientBlock2' : ss + 'aws3.management_console;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSMobileClientBlock2' : ss + 'aws3.mobile_client;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSGenericDatabaseBlock3' : ss + 'aws3.generic_database;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDiskBlock3' : ss + 'aws3.disk;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSTapeStorageBlock3' : ss + 'aws3.tape_storage;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSMediaBlock2' : ss + 'aws3.multimedia;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSDataCenterBlock2' : ss + 'aws3.corporate_data_center;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSServerBlock2' : ss + 'aws3.traditional_server;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSInternetBlock2' : ss + 'aws2.non-service_specific.internet;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSForumsBlock3' : ss + 'aws3.forums;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSManagementBlock2' : ss + 'aws3.management_console;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonElasticCacheNode2' : ss + 'aws3.cache_node;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRedshiftDW1Cluster2' : ss + 'aws3.dense_compute_node;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRedshiftDW2Cluster2' : ss + 'aws3.dense_storage_node;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRedshiftSSDFamilyCluster2' : ss + 'aws3.dense_storage_node;verticalLabelPosition=bottom;align=center;verticalAlign=top',
			'AWSAmazonRoute53RouteTable2' : ss + 'aws3.route_table;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//			'AWSExampleIAMBlock2' NA
			'AWSSubnetBlock2' : ss + 'aws3.permissions;verticalLabelPosition=bottom;align=center;verticalAlign=top',
//AWS Containers
			'AWSRoundedRectangleContainerBlock2' : cs,
//Azure Cloud
			'ACAccessControlBlock' : ss + 'azure.access_control',
			'ACAPIAppsBlock' : ss + 'mscae.cloud.api_app',
			'ACAPIManagementBlock' : ss + 'mscae.cloud.api_management',
			'ACAppInsightsBlock' : ss + 'mscae.cloud.application_insights',
			'ACAppServicesBlock' : ss + 'mscae.cloud.app_service',
			'ACAutoscalingBlock' : ss + 'azure.autoscale',
			'ACAzureActiveDirectoryBlock' : ss + 'azure.azure_active_directory',
			'ACAzurealertBlock' : ss + 'azure.azure_alert',
			'ACAzureAutomationBlock' : ss + 'azure.automation',
			'ACAzureBatchBlock' : ss + 'mscae.cloud.azure_batch',
			'ACAzureRedisBlock' : ss + 'azure.azure_cache',
			'ACAzureFilesBlock' : ss + 'mscae.cloud.azure_files_service',
			'ACAzureloadbalancerBlock' : ss + 'mscae.cloud.azure_automatic_load_balancer',
			'ACAzureMarketplaceBlock' : ss + 'azure.azure_marketplace',
			'ACAzureRightManagementRMSBlock' : ss + 'mscae.cloud.azure_rights_management_rms',
			'ACAzureSDKBlock' : ss + 'azure.azure_sdk',
			'ACAzureSearchBlock' : ss + 'mscae.cloud.azure_search',
			'ACAzureSQLdatabaseBlock' : ss + 'azure.sql_database_sql_azure',
			'ACAzuresubscriptionBlock' : ss + 'azure.azure_subscription',
			'ACAzureWebsitesBlock' : ss + 'azure.azure_website',
			'ACBackupServiceBlock' : ss + 'azure.backup_service',
			'ACBitbucketcodesourceBlock' : ss + 'azure.bitbucket_code_source',
			'ACBizTalkServicesBlock' : ss + 'azure.biztalk_services',
			'ACCloudServiceBlock' : ss + 'azure.cloud_service',
			'ACCodePlexBlock' : ss + 'azure.codeplex_code_source',
//			'ACComputeBlock' NA
			'ACContentDeliveryNetworkBlock' : ss + 'azure.content_delivery_network',
			'ACDataFactoryBlock' : ss + 'mscae.cloud.data_factory',
//			'ACDataservicesBlock' NA
			'ACDocumentDBBlock' : ss + 'mscae.cloud.documentdb',
			'ACDropboxcodesourceBlock' : ss + 'azure.dropbox_code_source',
			'ACEventsHubBlock' : ss + 'mscae.cloud.event_hubs',
			'ACExpressRouteBlock' : ss + 'azure.express_route',
			'ACGitHubBlock' : ss + 'azure.github_code',
			'ACGitrepositoryBlock' : ss + 'azure.git_repository',
			'ACHDInsightBlock' : ss + 'mscae.cloud.hdinsight',
			'ACHealthmonitoringBlock' : ss + 'azure.health_monitoring',
			'ACHealthyBlock' : ss + 'azure.healthy',
			'ACHybridConnectionBlock' : ss + 'mscae.cloud.hybrid_connections',
			'ACBizTalkhybridconnectionBlock' : ss + 'mscae.cloud.hybrid_connection_manager',
			'ACKeyVaultBlock' : ss + 'mscae.cloud.key_vault',
			'ACLogicAppBlock' : ss + 'mscae.cloud.logic_app',
			'ACMachineLearningBlock' : ss + 'mscae.cloud.machine_learning',
			'ACMediaServicesBlock' : ss + 'azure.media_service',
			'ACMicrosoftaccountBlock' : ss + 'mscae.cloud.microsoft_account',
			'ACMicrosoftAzureBlock' : ss + 'mscae.cloud.microsoft_azure',
			'ACMobileEngagementBlock' : ss + 'mscae.cloud.mobile_engagement',
			'ACMobileServicesBlock' : ss + 'mscae.cloud.mobile_app',
			'ACMultiFactorAuthBlock' : ss + 'azure.multi_factor_authentication',
			'ACMySQLdatabaseBlock' : ss + 'azure.mysql_database',
			'ACNotificationHubsBlock' : ss + 'azure.notification_hub',
			'ACNotificationtopicBlock' : ss + 'azure.notification_topic',
			'ACOperationalInsightsBlock' : ss + 'mscae.cloud.operational_insights',
			'ACOSimageBlock' : ss + 'azure.operating_system_image',
			'ACRemoteAppBlock' : ss + 'mscae.cloud.remoteapp',
			'ACrpdRemotingfileBlock' : ss + 'azure.rdp_remoting_file',
			'ACSchedulerBlock' : ss + 'azure.scheduler',
			'ACServiceBusBlock' : ss + 'azure.service_bus',
			'ACServiceBusQueueBlock' : ss + 'azure.service_bus_queues',
			'ACServiceBusRelayBlock' : ss + 'azure.service_bus_relay',
			'ACServiceBusTopicBlock' : ss + 'azure.service_bus_topics_and_subscriptions',
			'ACServiceEndpointBlock' : ss + 'mscae.cloud.service_endpoint',
			'ACServicepackageBlock' : ss + 'mscae.cloud.service_package',
			'ACSiteRecoveryBlock' : ss + 'azure.hyper_v_recovery_manager',
			'ACSQLdatabasegenericBlock' : ss + 'azure.sql_database',
//			'ACSQLDatabasePremiumBlock' NA
			'ACSQLdatasyncBlock' : ss + 'azure.sql_datasync',
			'ACSQLreportingdeprecatedBlock' : ss + 'azure.sql_reporting',
			'ACStartuptaskBlock' : ss + 'azure.startup_task',
			'ACStorageAzureBlock' : ss + 'mscae.cloud.azure_storage',
			'ACStorageblobBlock' : ss + 'azure.storage_blob',
			'ACStoragequeueBlock' : ss + 'azure.storage_queue',
			'ACStoragetableBlock' : ss + 'azure.storage_table',
			'ACStorSimpleBlock' : ss + 'azure.storsimple',
			'ACStreamAnalyticsBlock' : ss + 'mscae.cloud.stream_analytics',
			'ACTrafficManagerBlock' : ss + 'azure.traffic_manager',
			'ACAlienBlock' : ss + 'azure.unidentified_code_object',
			'ACVHDBlock' : ss + 'azure.vhd',
			'ACVHDdatadiskBlock' : ss + 'azure.vhd_data_disk',
			'ACVirtualmachineBlock' : ss + 'azure.virtual_machine',
			'ACVirtualmachinecontainerBlock' : ss + 'mscae.cloud.virtual_machine_container',
			'ACVirtualnetworkBlock' : ss + 'azure.virtual_network',
			'ACVisualStudioOnlineBlock' : ss + 'azure.visual_studio_online',
			'ACVMsymbolonlyBlock' : ss + 'azure.virtual_machine_feature',
			'ACWebJobsBlock' : ss + 'mscae.cloud.webjobs',
			'ACWebroleBlock' : ss + 'azure.web_role',
			'ACWebrolesBlock' : ss + 'azure.web_roles',
			'ACWorkaccountBlock' : ss + 'mscae.cloud.work_account',
			'ACWorkerroleBlock' : ss + 'azure.worker_role',
			'ACWorkerrolesBlock' : ss + 'azure.worker_roles',
			'ADNSBlock' : ss + 'mscae.cloud.azure_dns',
//			'AGatewayBlock' NA
			'ACLoadBalancerBlock' : ss + 'mscae.cloud.azure_load_balancer_feature',
			'ACResourceGroupBlock' : ss + 'mscae.cloud.resource_group',
			'ACVPNGatewayBlock' : ss + 'mscae.cloud.vpn_gateway',
//Azure Enterprise
			'AEActiveDirectoryFSPBlock' : ss + 'mscae.enterprise.d',
			'AEADFSBlock' : ss + 'mscae.enterprise.ad_fs',
			'AEAndroidPhoneBlock' : ss + 'mscae.enterprise.android_phone',
			'AEappblankfortextBlock' : ss + 'mscae.enterprise.application_blank',
			'AEAppGenericBlock' : ss + 'mscae.enterprise.app_generic',
			'AEAppserverBlock' : ss + 'mscae.enterprise.application_server',
			'AEBackuplocalBlock' : ss + 'mscae.enterprise.backup_local',
			'AEBackuponlineBlock' : ss + 'mscae.enterprise.backup_online',
			'AECalendarBlock' : ss + 'mscae.general.calendar',
			'AECertificateBlock' : ss + 'azure.certificate',
			'AEClientAppBlock' : ss + 'mscae.enterprise.client_application',
			'AECloudBlock' : ss + 'mscae.enterprise.internet',
			'AEClusterserverBlock' : ss + 'mscae.enterprise.cluster_server',
			'AECodefileBlock' : ss + 'azure.code_file',
			'AEConnectorsBlock' : ss + 'mscae.enterprise.connectors',
			'AEDatabasegenericBlock' : ss + 'mscae.enterprise.database_generic',
			'AEDatabaseserverBlock' : ss + 'mscae.enterprise.database_server',
			'AEDatabasesyncBlock' : ss + 'mscae.enterprise.database_synchronization',
			'AEDeviceBlock' : ss + 'mscae.enterprise.device',
			'AEDirectaccessBlock' : ss + 'mscae.enterprise.direct_access_feature',
			'AEDocumentBlock' : ss + 'mscae.enterprise.document',
			'AEDomaincontrollerBlock' : ss + 'mscae.enterprise.domain_controller',
			'AEEnterpriseBuildingBlock' : ss + 'azure.enterprise',
			'AEFilegeneralBlock' : ss + 'azure.file',
			'AEFilterBlock' : ss + 'mscae.enterprise.filter',
			'AEFirewallBlock' : ss + 'mscae.enterprise.firewall',
			'AEFolderBlock' : ss + 'mscae.enterprise.folder',
			'AEGatewayBlock' : ss + 'mscae.enterprise.gateway',
			'AEGenericcodeBlock' : ss + 'azure.code_file',
			'AEGraphBlock' : ss + 'mscae.general.graph',
			'AEHealthmonitoringBlock' : ss + 'azure.health_monitoring',
			'AEHealthyBlock' : ss + 'azure.healthy',
			'AEImportgenericBlock' : ss + 'mscae.enterprise.import_generic',
			'AEInternetBlock' : ss + 'mscae.enterprise.internet',
			'AEKeyboardBlock' : ss + 'mscae.enterprise.keyboard',
			'AEKeypermissionsBlock' : ss + 'mscae.enterprise.key_permissions',
			'AELaptopcomputerBlock' : ss + 'azure.laptop',
			'AELoadbalancerBlock' : ss + 'azure.load_balancer_generic',
			'AELoadTestingBlock' : ss + 'mscae.enterprise.load_testing',
			'AELockprotectedBlock' : ss + 'mscae.enterprise.lock',
			'AELockunprotectedBlock' : ss + 'mscae.enterprise.lock_unlocked',
			'AEMaintenanceBlock' : ss + 'mscae.enterprise.maintenance',
			'AEManagementconsoleBlock' : ss + 'mscae.enterprise.management_console',
			'AEMessageBlock' : ss + 'azure.message',
			'AEMonitorBlock' : ss + 'azure.computer',
			'AEMonitorrunningappsBlock' : ss + 'mscae.enterprise.monitor_running_apps',
			'AEMouseBlock' : ss + 'mscae.enterprise.mouse',
			'AENetworkcardBlock' : ss + 'mscae.enterprise.network_card',
			'AENotallowedBlock' : ss + 'mscae.general.not_allowed',
			'AEPerformanceBlock' : ss + 'mscae.enterprise.performance',
			'AEPerformancemonitorBlock' : ss + 'mscae.enterprise.performance_monitor',
			'AEPhoneBlock' : ss + 'azure.mobile',
			'AEPlugandplayBlock' : ss + 'mscae.enterprise.plug_and_play',
			'AEPowershellscriptfileBlock' : ss + 'azure.powershell_file',
			'AEProtocolstackBlock' : ss + 'mscae.enterprise.protocol_stack',
			'AEQueuegeneralBlock' : ss + 'azure.queue_generic',
			'AERMSconnectorBlock' : ss + 'mscae.enterprise.rms_connector',
			'AERouterBlock' : ss + 'mscae.enterprise.router',
			'AEScriptfileBlock' : ss + 'azure.script_file',
			'AESecurevirtualmachineBlock' : ss + 'mscae.enterprise.secure_virtual_machine',
			'AEServerbladeBlock' : ss + 'azure.server',
			'AEServerdirectoryBlock' : ss + 'mscae.enterprise.server_directory',
			'AEServerfarmBlock' : ss + 'mscae.enterprise.server_farm',
			'AEServergenericBlock' : ss + 'mscae.enterprise.server_generic',
			'AEServerrackBlock' : ss + 'azure.server_rack',
			'AESettingsBlock' : ss + 'mscae.enterprise.settings',
			'AESharedfolderBlock' : ss + 'mscae.enterprise.shared_folder',
			'AESmartcardBlock' : ss + 'mscae.enterprise.smartcard',
			'AEStorageBlock' : ss + 'mscae.enterprise.storage',
			'AETableBlock' : ss + 'mscae.enterprise.table',
			'AETabletBlock' : ss + 'azure.tablet',
			'AEToolBlock' : ss + 'mscae.enterprise.tool',
			'AETunnelBlock' : ss + 'mscae.general.tunnel',
			'AEUnhealthyBlock' : ss + 'mscae.enterprise.unhealthy',
			'AEUSBBlock' : ss + 'mscae.enterprise.usb',
			'AEUserBlock' : ss + 'azure.user',
			'AEVideoBlock' : ss + 'mscae.general.video',
			'AEVirtualmachineBlock' : ss + 'azure.virtual_machine_feature',
			'AEWebBlock' : ss + 'mscae.enterprise.web',
			'AEWebserverBlock' : ss + 'mscae.enterprise.web_server',
			'AEWindowsserverBlock' : ss + 'mscae.enterprise.windows_server',
			'AEWirelessconnectionBlock' : ss + 'mscae.enterprise.wireless_connection',
			'AEWorkstationclientBlock' : ss + 'mscae.enterprise.workstation_client',
			'AEXMLwebserviceBlock' : ss + 'mscae.enterprise.xml_web_service',
			'AGSAudioBlock' : ss + 'mscae.general.audio',
			'AGSBugBlock' : ss + 'mscae.general.bug',
			'AGSCablesettopTVboxBlock' : ss + 'mscae.general.cable_settop_tv_box',
			'AGSCalendarBlock' : ss + 'mscae.general.calendar',
			'AGSChartBlock' : ss + 'mscae.general.chart',
			'AGSCheckmarkSuccessBlock' : ss + 'mscae.general.checkmark',
			'AGSContinousCycleCircleBlock' : ss + 'mscae.general.continuous_cycle',
			'AGSCrossoutFailureBlock' : ss + 'mscae.general.crossout',
			'AGSCutandpasteBlock' : ss + 'mscae.general.cut_and_paste',
			'AGSFolderBlock' : ss + 'mscae.enterprise.folder',
			'AGSGamecontrollerBlock' : ss + 'mscae.general.game_controller',
			'AGSGearsBlock' : ss + 'mscae.general.gears',
			'AGSGraphBlock' : ss + 'mscae.general.graph',
			'AGSLikeBlock' : ss + 'mscae.general.like',
			'AGSNotallowedBlock' : ss + 'mscae.general.not_allowed',
			'AGSSliderbarhorizontalBlock' : ss + 'mscae.general.slider_bar_horizontal',
			'AGSSliderbarvertBlock' : ss + 'mscae.general.slider_bar_vertical',
			'AGSTasklistorBacklogBlock' : ss + 'mscae.general.task_list',
			'AGSTasksBlock' : ss + 'mscae.general.tasks',
			'AGSTunnelBlock' : ss + 'mscae.general.tunnel',
			'AGSUserBlock' : ss + 'azure.user',
			'AGSVideoBlock' : ss + 'mscae.general.video',
// Azure VMS			
//			'AVMActiveDirectoryVMBlock' NA
//			'AVMActiveDirectoryVMmultiBlock' NA
//			'AVMAppServerVMBlock' NA
//			'AVMAppServerVMmultiBlock' NA
//			'AVMDatabaseServerVMBlock' NA
//			'AVMDatabaseServerVMmultiBlock' NA
//			'AVMDirectoryServerVMBlock' NA
//			'AVMDirectoryServerVMmultiBlock' NA
//			'AVMDomainServerVMBlock' NA
//			'AVMDomainServerVMmultiBlock' NA
//			'AVMFileServerVMBlock' NA
//			'AVMFileServerVMmultiBlock' NA
//			'AVMWebServerVMBlock' NA
//			'AVMWebServerVMmultiBlock' NA
//			'AVMWindowsServerVMBlock' NA
//			'AVMWindowsServerVMmultiBlock' NA
//Cisco Basic
			'Cisco_cisco_androgenous_person' : s + 'cisco.people.androgenous_person;' + c,
			'Cisco_cisco_atm_switch' : s + 'cisco.switches.atm_switch;' + c,
			'Cisco_cisco_cloud' : s + 'cisco.storage.cloud;strokeColor=#036897;fillColor=#ffffff',
			'Cisco_cisco_fileserver' : s + 'cisco.servers.fileserver;' + c,
			'Cisco_cisco_firewall' : s + 'cisco.security.firewall;' + c,
			'Cisco_cisco_generic_building' : s + 'cisco.buildings.generic_building;' + c,
			'Cisco_cisco_laptop' : s + 'cisco.computers_and_peripherals.laptop;' + c,
			'Cisco_cisco_lock' : s + 'cisco.security.lock;' + c,
			'Cisco_cisco_microwebserver' : s + 'cisco.servers.microwebserver;' + c,
			'Cisco_cisco_pc' : s + 'cisco.computers_and_peripherals.pc;' + c,
			'Cisco_cisco_pda' : s + 'cisco.misc.pda;' + c,
			'Cisco_cisco_phone' : s + 'cisco.modems_and_phones.hootphone;' + c,
			'Cisco_cisco_printer' : s + 'cisco.computers_and_peripherals.printer;' + c,
			'Cisco_cisco_relational_database' : s + 'cisco.storage.relational_database;' + c,
			'Cisco_cisco_router' : s + 'cisco.routers.router;' + c,
			'Cisco_cisco_standing_man' : s + 'cisco.people.standing_man;' + c,
			'Cisco_cisco_standing_woman' : s + 'cisco.people.standing_woman;' + c,
			'Cisco_cisco_ups' : s + 'cisco.misc.ups;' + c,
			'Cisco_cisco_wireless_router' : s + 'cisco.routers.wireless_router;' + c,
//Cisco Extended
			'Cisco_cisco_100baset_hub' : s + 'cisco.hubs_and_gateways.100baset_hub;' + c,
			'Cisco_cisco_10700' : s + 'cisco.routers.10700;' + c,
			'Cisco_cisco_10GE_FCoE' : s + 'cisco.controllers_and_modules.10ge_fcoe;' + c,
			'Cisco_cisco_15200' : s + 'cisco.misc.15200;' + c,
			'Cisco_cisco_3174__desktop_' : s + 'cisco.controllers_and_modules.3174_(desktop)_cluster_controller;' + c,
			'Cisco_cisco_3200_mobile_access_router' : s + 'cisco.routers.mobile_access_router;' + c,
			'Cisco_cisco_3x74__floor_' : s + 'cisco.controllers_and_modules.3x74_(floor)_cluster_controller;' + c,
			'Cisco_cisco_6700_series' : s + 'cisco.misc.6700_series;' + c,
			'Cisco_cisco_7500ars__7513_' : s + 'cisco.misc.7500ars_(7513);' + c,
//			'Cisco_cisco_access_gateway' NA
			'Cisco_cisco_accesspoint' : s + 'cisco.misc.access_point;' + c,
			'Cisco_cisco_ace' : s + 'cisco.misc.ace;' + c,
			'Cisco_cisco_ACS' : s + 'cisco.misc.acs;' + c,
			'Cisco_cisco_adm' : s + 'cisco.misc.adm;' + c,
			'Cisco_cisco_antenna' : s + 'cisco.wireless.antenna;' + c,
			'Cisco_cisco_asic_processor' : s + 'cisco.misc.asic_processor;' + c,
			'Cisco_cisco_ASR_1000_Series' : s + 'cisco.misc.asr_1000_series;' + c,
			'Cisco_cisco_ata' : s + 'cisco.misc.ata;' + c,
			'Cisco_cisco_atm_3800' : s + 'cisco.misc.atm_3800;' + c,
			'Cisco_cisco_atm_fast_gigabit_etherswitch' : s + 'cisco.switches.atm_fast_gigabit_etherswitch;' + c,
			'Cisco_cisco_atm_router' : s + 'cisco.routers.atm_router;' + c,
			'Cisco_cisco_atm_tag_switch_router' : s + 'cisco.routers.atm_tag_switch_router;' + c,
			'Cisco_cisco_avs' : s + 'cisco.misc.avs;' + c,
			'Cisco_cisco_AXP' : s + 'cisco.misc.axp;' + c,
//			'Cisco_cisco_bbfw_media' NA
//			'Cisco_cisco_bbfw' NA
			'Cisco_cisco_bbsm' : s + 'cisco.misc.bbsm;' + c,
			'Cisco_cisco_branch_office' : s + 'cisco.buildings.branch_office;' + c,
			'Cisco_cisco_breakout_box' : s + 'cisco.misc.breakout_box;' + c,
			'Cisco_cisco_bridge' : s + 'cisco.misc.bridge;' + c,
			'Cisco_cisco_broadband_router' : s + 'cisco.routers.broadcast_router;' + c,
			'Cisco_cisco_bts_10200' : s + 'cisco.misc.bts_10200;' + c,
			'Cisco_cisco_cable_modem' : s + 'cisco.modems_and_phones.cable_modem;' + c,
			'Cisco_cisco_callmanager' : s + 'cisco.misc.call_manager;' + c,
			'Cisco_cisco_car' : s + 'cisco.misc.car;' + c,
			'Cisco_cisco_carrier_routing_system' : s + 'cisco.misc.carrier_routing_system;' + c,
			'Cisco_cisco_cddi_fddi' : s + 'cisco.misc.cddi_fddi;' + c,
			'Cisco_cisco_cdm' : s + 'cisco.misc.cdm;' + c,
			'Cisco_cisco_cellular_phone' : s + 'cisco.modems_and_phones.cell_phone;' + c,
			'Cisco_cisco_centri_firewall' : s + 'cisco.security.centri_firewall;' + c,
			'Cisco_cisco_cisco_1000' : s + 'cisco.misc.cisco_1000;' + c,
			'Cisco_cisco_cisco_asa_5500' : s + 'cisco.misc.asa_5500;' + c,
			'Cisco_cisco_cisco_ca' : s + 'cisco.misc.cisco_ca;' + c,
			'Cisco_cisco_cisco_file_engine' : s + 'cisco.storage.cisco_file_engine;' + c,
			'Cisco_cisco_cisco_hub' : s + 'cisco.hubs_and_gateways.cisco_hub;' + c,
			'Cisco_cisco_ciscosecurity' : s + 'cisco.security.cisco_security;' + c,
//			'Cisco_cisco_Cisco_telepresence_manager' NA
			'Cisco_cisco_cisco_unified_presence_server' : s + 'cisco.servers.cisco_unified_presence_server;' + c,
			'Cisco_cisco_cisco_unityexpress' : s + 'cisco.misc.cisco_unity_express;' + c,
			'Cisco_cisco_ciscoworks' : s + 'cisco.misc.cisco_works;' + c,
			'Cisco_cisco_class_4_5_switch' : s + 'cisco.switches.class_4_5_switch;' + c,
			'Cisco_cisco_communications_server' : s + 'cisco.servers.communications_server;' + c,
			'Cisco_cisco_contact_center' : s + 'cisco.misc.contact_center;' + c,
			'Cisco_cisco_content_engine__cache_director_' : s + 'cisco.directors.content_engine_(cache_director);' + c,
			'Cisco_cisco_content_service_router' : s + 'cisco.routers.content_service_router;' + c,
			'Cisco_cisco_content_service_switch_1100' : s + 'cisco.switches.content_service_switch_1100;' + c,
			'Cisco_cisco_content_switch_module' : s + 'cisco.controllers_and_modules.content_switch_module;' + c,
			'Cisco_cisco_content_switch' : s + 'cisco.switches.content_switch;' + c,
			'Cisco_cisco_content_transformation_engine__cte_' : s + 'cisco.misc.content_transformation_engine_(cte);' + c,
			'Cisco_cisco_cs_mars' : s + 'cisco.misc.cs-mars;' + c,
			'Cisco_cisco_csm_s' : s + 'cisco.misc.csm-s;' + c,
			'Cisco_cisco_csu_dsu' : s + 'cisco.misc.csu_dsu;' + c,
			'Cisco_cisco_CUBE' : s + 'cisco.misc.cube;' + c,
			'Cisco_cisco_detector' : s + 'cisco.misc.detector;' + c,
			'Cisco_cisco_director_class_fibre_channel_director' : s + 'cisco.directors.director-class_fibre_channel_director;' + c,
			'Cisco_cisco_directory_server' : s + 'cisco.servers.directory_server;' + c,
			'Cisco_cisco_diskette' : s + 'cisco.storage.diskette;' + c,
			'Cisco_cisco_distributed_director' : s + 'cisco.directors.distributed_director;' + c,
			'Cisco_cisco_dot_dot' : s + 'cisco.misc.dot-dot;' + c,
			'Cisco_cisco_dpt' : s + 'cisco.misc.dpt;' + c,
			'Cisco_cisco_dslam' : s + 'cisco.misc.dslam;' + c,
			'Cisco_cisco_dual_mode_ap' : s + 'cisco.misc.dual_mode;' + c,
			'Cisco_cisco_dwdm_filter' : s + 'cisco.misc.dwdm_filter;' + c,
			'Cisco_cisco_end_office' : s + 'cisco.buildings.end_office;' + c,
			'Cisco_cisco_fax' : s + 'cisco.modems_and_phones.fax;' + c,
			'Cisco_cisco_fc_storage' : s + 'cisco.storage.fc_storage;' + c,
			'Cisco_cisco_fddi_ring' : s + 'cisco.misc.fddi_ring;strokeColor=#036897;',
			'Cisco_cisco_fibre_channel_disk_subsystem' : s + 'cisco.storage.fibre_channel_disk_subsystem;' + c,
			'Cisco_cisco_fibre_channel_fabric_switch' : s + 'cisco.switches.fibre_channel_fabric_switch;' + c,
			'Cisco_cisco_file_cabinet' : s + 'cisco.storage.file_cabinet;' + c,
			'Cisco_cisco_file_server' : s + 'cisco.servers.file_server;' + c,
			'Cisco_cisco_firewall_service_module__fwsm_' : s + 'cisco.controllers_and_modules.firewall_service_module_(fwsm);' + c,
			'Cisco_cisco_front_end_processor' : s + 'cisco.misc.front_end_processor;' + c,
			'Cisco_cisco_gatekeeper' : s + 'cisco.security.gatekeeper;strokeColor=#036897;',
			'Cisco_cisco_general_applicance' : s + 'cisco.misc.general_appliance;' + c,
			'Cisco_cisco_generic_gateway' : s + 'cisco.hubs_and_gateways.generic_gateway;' + c,
			'Cisco_cisco_generic_processor' : s + 'cisco.misc.generic_processor;' + c,
			'Cisco_cisco_generic_softswitch' : s + 'cisco.switches.generic_softswitch;' + c,
			'Cisco_cisco_gigabit_switch_atm_tag_router' : s + 'cisco.routers.gigabit_switch_atm_tag_router;' + c,
			'Cisco_cisco_government_building' : s + 'cisco.buildings.government_building;' + c,
			'Cisco_cisco_Ground_terminal' : s + 'cisco.wireless.ground_terminal;' + c,
			'Cisco_cisco_guard' : s + 'cisco.security.guard;' + c,
			'Cisco_cisco_handheld' : s + 'cisco.misc.handheld;' + c,
			'Cisco_cisco_hootphone' : s + 'cisco.modems_and_phones.hootphone;' + c,
			'Cisco_cisco_host' : s + 'cisco.servers.host;' + c,
			'Cisco_cisco_hp_mini' : s + 'cisco.misc.hp_mini;' + c,
			'Cisco_cisco_h' : s + 'cisco.misc.h_323;' + c,
			'Cisco_cisco_hub' : s + 'cisco.hubs_and_gateways.hub;' + c,
			'Cisco_cisco_iad_router' : s + 'cisco.routers.iad_router;' + c,
			'Cisco_cisco_ibm_mainframe' : s + 'cisco.computers_and_peripherals.ibm_mainframe;' + c,
			'Cisco_cisco_ibm_mini_as400' : s + 'cisco.computers_and_peripherals.ibm_mini_as400;' + c,
			'Cisco_cisco_ibm_tower' : s + 'cisco.computers_and_peripherals.ibm_tower;' + c,
			'Cisco_cisco_icm' : s + 'cisco.misc.icm;' + c,
			'Cisco_cisco_ics' : s + 'cisco.misc.ics;' + c,
			'Cisco_cisco_intelliswitch_stack' : s + 'cisco.switches.intelliswitch_stack;' + c,
			'Cisco_cisco_ios_firewall' : s + 'cisco.security.ios_firewall;' + c,
			'Cisco_cisco_ios_slb' : s + 'cisco.misc.ios_slb;' + c,
			'Cisco_cisco_ip_communicator' : s + 'cisco.misc.ip_communicator;' + c,
			'Cisco_cisco_ip_dsl' : s + 'cisco.misc.ip_dsl;' + c,
			'Cisco_cisco_ip_phone' : s + 'cisco.modems_and_phones.ip_phone;' + c,
			'Cisco_cisco_ip' : s + 'cisco.misc.ip;' + c,
			'Cisco_cisco_iptc' : s + 'cisco.misc.iptc;' + c,
			'Cisco_cisco_ip_telephony_router' : s + 'cisco.routers.ip_telephony_router;' + c,
			'Cisco_cisco_iptv_content_manager' : s + 'cisco.misc.iptv_content_manager;' + c,
			'Cisco_cisco_iptv_server' : s + 'cisco.servers.iptv_server;' + c,
			'Cisco_cisco_iscsi_router' : s + 'cisco.routers.isci_router;' + c,
			'Cisco_cisco_isdn_switch' : s + 'cisco.switches.isdn_switch;' + c,
			'Cisco_cisco_itp' : s + 'cisco.misc.itp;' + c,
			'Cisco_cisco_jbod' : s + 'cisco.misc.jbod;' + c,
			'Cisco_cisco_key' : s + 'cisco.misc.key;' + c,
			'Cisco_cisco_keys' : s + 'cisco.misc.keys;' + c,
			'Cisco_cisco_lan_to_lan' : s + 'cisco.misc.lan_to_lan;' + c,
			'Cisco_cisco_layer_2_remote_switch' : s + 'cisco.switches.layer_2_remote_switch;' + c,
			'Cisco_cisco_layer_3_switch' : s + 'cisco.switches.layer_3_switch;' + c,
			'Cisco_cisco_lightweight_ap' : s + 'cisco.misc.lightweight_ap;' + c,
			'Cisco_cisco_localdirector' : s + 'cisco.directors.localdirector;' + c,
			'Cisco_cisco_longreach_cpe' : s + 'cisco.misc.longreach_cpe;' + c,
			'Cisco_cisco_macintosh' : s + 'cisco.computers_and_peripherals.macintosh;' + c,
			'Cisco_cisco_mac_woman' : s + 'cisco.people.mac_woman;' + c,
			'Cisco_cisco_man_woman' : s + 'cisco.people.man_woman;' + c,
			'Cisco_cisco_mas_gateway' : s + 'cisco.hubs_and_gateways.mas_gateway;' + c,
			'Cisco_cisco_mau' : s + 'cisco.misc.mau;' + c,
			'Cisco_cisco_mcu' : s + 'cisco.misc.mcu;' + c,
			'Cisco_cisco_mdu' : s + 'cisco.buildings.mdu;' + c,
			'Cisco_cisco_me_1100' : s + 'cisco.misc.me1100;' + c,
			'Cisco_cisco_Mediator' : s + 'cisco.misc.mediator;' + c,
			'Cisco_cisco_meetingplace' : s + 'cisco.misc.meetingplace;' + c,
			'Cisco_cisco_mesh_ap' : s + 'cisco.misc.mesh_ap;' + c,
			'Cisco_cisco_metro_1500' : s + 'cisco.misc.metro_1500;' + c,
			'Cisco_cisco_mgx_8000_multiservice_switch' : s + 'cisco.switches.mgx_8000_multiservice_switch;' + c,
			'Cisco_cisco_microphone' : s + 'cisco.computers_and_peripherals.microphone;' + c,
			'Cisco_cisco_mini_vax' : s + 'cisco.misc.mini_vax;' + c,
			'Cisco_cisco_mobile_access_ip_phone' : s + 'cisco.modems_and_phones.mobile_access_ip_phone;' + c,
			'Cisco_cisco_mobile_access_router' : s + 'cisco.routers.mobile_access_router;' + c,
			'Cisco_cisco_modem' : s + 'cisco.modems_and_phones.modem;' + c,
			'Cisco_cisco_moh_server' : s + 'cisco.servers.moh_server;' + c,
			'Cisco_cisco_MSE' : s + 'cisco.misc.mse;' + c,
			'Cisco_cisco_mulitswitch_device' : s + 'cisco.switches.multiswitch_device;' + c,
			'Cisco_cisco_multi_fabric_server_switch' : s + 'cisco.switches.multi-fabric_server_switch;' + c,
			'Cisco_cisco_multilayer_remote_switch' : s + 'cisco.switches.multilayer_remote_switch;' + c,
			'Cisco_cisco_mux' : s + 'cisco.misc.mux;' + c,
			'Cisco_cisco_MXE' : s + 'cisco.misc.mxe;' + c,
			'Cisco_cisco_nac_appliance' : s + 'cisco.misc.nac_appliance;' + c,
			'Cisco_cisco_NCE' : s + 'cisco.misc.nce;' + c,
			'Cisco_cisco_NCE_router' : s + 'cisco.routers.nce_router;' + c,
			'Cisco_cisco_netflow_router' : s + 'cisco.routers.netflow_router;' + c,
			'Cisco_cisco_netranger' : s + 'cisco.misc.netranger;' + c,
			'Cisco_cisco_netsonar' : s + 'cisco.misc.netsonar;' + c,
			'Cisco_cisco_network_management' : s + 'cisco.misc.network_management;' + c,
			'Cisco_cisco_Nexus_1000' : s + 'cisco.misc.nexus_1000;' + c,
			'Cisco_cisco_Nexus_2000' : s + 'cisco.misc.nexus_2000_fabric_extender;' + c,
			'Cisco_cisco_Nexus_5000' : s + 'cisco.misc.nexus_5000;' + c,
			'Cisco_cisco_Nexus_7000' : s + 'cisco.misc.nexus_7000;' + c,
			'Cisco_cisco_octel' : s + 'cisco.misc.octel;' + c,
			'Cisco_cisco_ons15500' : s + 'cisco.misc.ons15500;' + c,
			'Cisco_cisco_optical_amplifier' : s + 'cisco.misc.optical_amplifier;' + c,
			'Cisco_cisco_optical_services_router' : s + 'cisco.routers.optical_services_router;' + c,
			'Cisco_cisco_optical_transport' : s + 'cisco.misc.optical_transport;' + c,
			'Cisco_cisco_pad' : s + 'cisco.misc.pad_2;' + c,
			'Cisco_cisco_pad_x' : s + 'cisco.misc.pad_1;' + c,
			'Cisco_cisco_page_icon' : s + 'cisco.misc.page_icon;strokeColor=#036897;',
			'Cisco_cisco_pbx' : s + 'cisco.misc.pbx;' + c,
			'Cisco_cisco_pbx_switch' : s + 'cisco.switches.pbx_switch;' + c,
			'Cisco_cisco_pc_adapter_card' : s + 'cisco.computers_and_peripherals.pc_adapter_card;' + c,
			'Cisco_cisco_pc_man' : s + 'cisco.people.pc_man;' + c,
			'Cisco_cisco_pc_routercard' : s + 'cisco.computers_and_peripherals.pc_routercard;' + c,
			'Cisco_cisco_pc_software' : s + 'cisco.misc.pc_software;' + c,
			'Cisco_cisco_pc_video' : s + 'cisco.misc.pc_video;' + c,
			'Cisco_cisco_phone_fax' : s + 'cisco.modems_and_phones.phone-fax;' + c,
			'Cisco_cisco_pix_firewall' : s + 'cisco.security.pix_firewall;' + c,
			'Cisco_cisco_pmc' : s + 'cisco.misc.pmc;' + c,
			'Cisco_cisco_programmable_switch' : s + 'cisco.switches.programmable_switch;' + c,
			'Cisco_cisco_protocol_translator' : s + 'cisco.misc.protocol_translator;' + c,
			'Cisco_cisco_pxf' : s + 'cisco.misc.pxf;' + c,
			'Cisco_cisco_radio_tower' : s + 'cisco.wireless.radio_tower;strokeColor=#036897',
			'Cisco_cisco_ratemux' : s + 'cisco.misc.ratemux;' + c,
			'Cisco_cisco_repeater' : s + 'cisco.misc.repeater;' + c,
			'Cisco_cisco_RF_modem' : s + 'cisco.modems_and_phones.rf_modem;' + c,
			'Cisco_cisco_router_firewall' : s + 'cisco.security.router_firewall;' + c,
			'Cisco_cisco_routerin_building' : s + 'cisco.routers.router_in_building;' + c,
			'Cisco_cisco_router_with_silicon_switch' : s + 'cisco.routers.router_with_silicon_switch;' + c,
			'Cisco_cisco_route_switch_processor' : s + 'cisco.misc.route_switch_processor;' + c,
			'Cisco_cisco_rpsrps' : s + 'cisco.misc.rpsrps;' + c,
			'Cisco_cisco_running_man' : s + 'cisco.people.running_man;' + c,
			'Cisco_cisco_sattelite_dish' : s + 'cisco.wireless.satellite_dish;' + c,
			'Cisco_cisco_sattelite' : s + 'cisco.wireless.satellite;' + c,
			'Cisco_cisco_scanner' : s + 'cisco.computers_and_peripherals.scanner;' + c,
			'Cisco_cisco_server_switch' : s + 'cisco.switches.server_switch;' + c,
			'Cisco_cisco_server_with_router' : s + 'cisco.servers.server_with_router;' + c,
			'Cisco_cisco_service_control' : s + 'cisco.misc.service_control;' + c,
			'Cisco_cisco_Service_Module' : s + 'cisco.controllers_and_modules.service_module;' + c,
			'Cisco_cisco_Service_router' : s + 'cisco.routers.service_router;' + c,
			'Cisco_cisco_Services' : s + 'cisco.misc.services;' + c,
			'Cisco_cisco_Set_top_box' : s + 'cisco.misc.set_top_box;' + c,
			'Cisco_cisco_simulitlayer_switch' : s + 'cisco.switches.simultilayer_switch;' + c,
			'Cisco_cisco_sip_proxy_werver' : s + 'cisco.servers.sip_proxy_server;' + c,
			'Cisco_cisco_sitting_woman' : s + 'cisco.people.sitting_woman;' + c,
			'Cisco_cisco_small_business' : s + 'cisco.buildings.small_business;' + c,
			'Cisco_cisco_small_hub' : s + 'cisco.hubs_and_gateways.small_hub;' + c,
			'Cisco_cisco_softphone' : s + 'cisco.modems_and_phones.softphone;' + c,
			'Cisco_cisco_softswitch_pgw_mgc' : s + 'cisco.switches.softswitch_pgw_mgc;' + c,
			'Cisco_cisco_software_based_server' : s + 'cisco.servers.software_based_server;' + c,
//			'Cisco_cisco_Space_router' NA
			'Cisco_cisco_speaker' : s + 'cisco.computers_and_peripherals.speaker;' + c,
			'Cisco_cisco_ssc' : s + 'cisco.misc.ssc;' + c,
			'Cisco_cisco_ssl_terminator' : s + 'cisco.misc.ssl_terminator;' + c,
			'Cisco_cisco_standard_host' : s + 'cisco.servers.standard_host;' + c,
			'Cisco_cisco_stb' : s + 'cisco.misc.stb;' + c,
			'Cisco_cisco_storage_router' : s + 'cisco.routers.storage_router;' + c,
			'Cisco_cisco_storage_server' : s + 'cisco.servers.storage_server;' + c,
			'Cisco_cisco_stp' : s + 'cisco.misc.stp;' + c,
			'Cisco_cisco_streamer' : s + 'cisco.misc.streamer;' + c,
			'Cisco_cisco_sun_workstation' : s + 'cisco.computers_and_peripherals.workstation;' + c,
			'Cisco_cisco_supercomputer' : s + 'cisco.computers_and_peripherals.supercomputer;' + c,
			'Cisco_cisco_svx' : s + 'cisco.misc.svx;' + c,
			'Cisco_cisco_system_controller' : s + 'cisco.controllers_and_modules.system_controller;' + c,
			'Cisco_cisco_tablet' : s + 'cisco.computers_and_peripherals.tablet;' + c,
			'Cisco_cisco_tape_array' : s + 'cisco.storage.tape_array;' + c,
			'Cisco_cisco_tdm_router' : s + 'cisco.routers.tdm_router;' + c,
			'Cisco_cisco_telecommuter_house_pc' : s + 'cisco.buildings.telecommuter_house_pc;' + c,
			'Cisco_cisco_telecommuter_house' : s + 'cisco.buildings.telecommuter_house;' + c,
			'Cisco_cisco_telecommuter_icon' : s + 'cisco.misc.telecommuter_icon;' + c,
//			'Cisco_cisco_Telepresence_1000' NA
//			'Cisco_cisco_Telepresence_3000' NA
			'Cisco_cisco_Telepresence_3200' : s + 'cisco.misc.telepresence;' + c,
//			'Cisco_cisco_Telepresence_500' NA
			'Cisco_cisco_terminal' : s + 'cisco.computers_and_peripherals.terminal;' + c,
			'Cisco_cisco_token' : s + 'cisco.misc.token;strokeColor=#036897',
			'Cisco_cisco_TP_MCU' : s + 'cisco.misc.tp_mcu;' + c,
			'Cisco_cisco_transpath' : s + 'cisco.misc.transpath;' + c,
			'Cisco_cisco_truck' : s + 'cisco.misc.truck;' + c,
			'Cisco_cisco_turret' : s + 'cisco.misc.turret;' + c,
			'Cisco_cisco_tv' : s + 'cisco.misc.tv;' + c,
			'Cisco_cisco_ubr910' : s + 'cisco.misc.ubr910;' + c,
			'Cisco_cisco_umg_series' : s + 'cisco.misc.umg_series;' + c,
			'Cisco_cisco_unity_server' : s + 'cisco.servers.unity_server;' + c,
			'Cisco_cisco_universal_gateway' : s + 'cisco.hubs_and_gateways.universal_gateway;' + c,
			'Cisco_cisco_university' : s + 'cisco.buildings.university;' + c,
			'Cisco_cisco_upc' : s + 'cisco.computers_and_peripherals.upc;' + c,
			'Cisco_cisco_vault' : s + 'cisco.misc.vault;' + c,
			'Cisco_cisco_video_camera' : s + 'cisco.computers_and_peripherals.video_camera;' + c,
			'Cisco_cisco_vip' : s + 'cisco.misc.vip;' + c,
			'Cisco_cisco_virtual_layer_switch' : s + 'cisco.switches.virtual_layer_switch;' + c,
			'Cisco_cisco_virtual_switch_controller__vsc3000_' : s + 'cisco.controllers_and_modules.virtual_switch_controller_(vsc3000);' + c,
			'Cisco_cisco_voice_atm_switch' : s + 'cisco.switches.voice_atm_switch;' + c,
			'Cisco_cisco_voice_commserver' : s + 'cisco.servers.voice_commserver;' + c,
			'Cisco_cisco_voice_router' : s + 'cisco.routers.voice_router;' + c,
			'Cisco_cisco_voice_switch' : s + 'cisco.switches.voice_switch;' + c,
			'Cisco_cisco_vpn_concentrator' : s + 'cisco.misc.vpn_concentrator;' + c,
			'Cisco_cisco_vpn_gateway' : s + 'cisco.hubs_and_gateways.vpn_gateway;' + c,
			'Cisco_cisco_VSS' : s + 'cisco.misc.vss;' + c,
			'Cisco_cisco_wae' : s + 'cisco.misc.wae;' + c,
			'Cisco_cisco_wavelength_router' : s + 'cisco.routers.wavelength_router;' + c,
			'Cisco_cisco_web_browser' : s + 'cisco.computers_and_peripherals.web_browser;' + c,
			'Cisco_cisco_web_cluster' : s + 'cisco.storage.web_cluster;' + c,
			'Cisco_cisco_wi_fi_tag' : s + 'cisco.wireless.wi-fi_tag;' + c,
			'Cisco_cisco_wireless_bridge' : s + 'cisco.wireless.wireless_bridge;' + c,
			'Cisco_cisco_wireless_location_appliance' : s + 'cisco.wireless.wireless_location_appliance;' + c,
			'Cisco_cisco_wireless' : s + 'cisco.wireless.wireless;' + c,
			'Cisco_cisco_wireless_transport' : s + 'cisco.wireless.wireless_transport;' + c,
			'Cisco_cisco_wism' : s + 'cisco.misc.wism;' + c,
			'Cisco_cisco_wlan_controller' : s + 'cisco.wireless.wlan_controller;' + c,
			'Cisco_cisco_workgroup_director' : s + 'cisco.directors.workgroup_director;' + c,
			'Cisco_cisco_workgroup_switch' : s + 'cisco.switches.workgroup_switch;' + c,
			'Cisco_cisco_workstation' : s + 'cisco.computers_and_peripherals.workstation;' + c,
			'Cisco_cisco_www_server' : s + 'cisco.servers.www_server;' + c,
//Computers and Monitors
			'NET_PC' : s + 'networks.pc;fillColor=#29AAE1',
			'NET_Virtual-PC' : s + 'networks.virtual_pc;fillColor=#29AAE1',
			'NET_Terminal' : s + 'networks.terminal;fillColor=#29AAE1',
			'NET_DataPipe' : s + 'networks.bus;fillColor=#29AAE1',
			'NET_SlateDevice' : s + 'networks.tablet;fillColor=#29AAE1', 
			'NET_TabletDevice' : s + 'networks.tablet;fillColor=#29AAE1',
			'NET_Laptop' : s + 'networks.laptop;fillColor=#29AAE1',
			'NET_PDA' : s + 'networks.mobile;fillColor=#29AAE1',
			'NET_CRTMonitor' : s + 'networks.monitor;fillColor=#29AAE1',
			'NET_LCDMonitor' : s + 'networks.monitor;fillColor=#29AAE1',
//Detailed Network Diagrams
//			'NET_ABSwitch' NA
//			'NET_Repeater' NA
//			'NET_DiagnosticDevice' NA
//			'NET_CardReader' NA
//			'NET_PatchPanel' NA
			'NET_RadioTower' : s + 'networks.radio_tower;fillColor=#29AAE1',
//			'NET_BiometricReader' NA
			'NET_ExternalHardDrive' : s + 'networks.external_storage;fillColor=#29AAE1',
//			'NET_WebService' NA
//			'NET_FiberOptic' NA
			'NET_SatelliteDish' : s + 'networks.satellite_dish;fillColor=#29AAE1',
			'NET_Satellite' : s + 'networks.satellite;fillColor=#29AAE1',
//			'NET_VoIPPhone' NA
//			'NET_PBX' NA
//			'NET_MLPS' NA
//Basic Network Shapes
			'NET_WirelessAccessPoint' : s + 'networks.radio_tower;fillColor=#29AAE1',
			'NET_RingNetwork' : cs,
			'NET_Ethernet' : cs,
			'NET_Server' : s + 'networks.server;fillColor=#29AAE1',
//			'NET_ExternalMediaDrive' NA
			'NET_Mainframe' : s + 'networks.mainframe;fillColor=#29AAE1',
			'NET_Router' : s + 'networks.wireless_hub;fillColor=#29AAE1',
			'NET_Switch' : s + 'networks.switch;fillColor=#29AAE1',
			'NET_Firewall' : s + 'networks.firewall;fillColor=#29AAE1',
			'NET_User' : s + 'networks.user_male;fillColor=#29AAE1',
			'NET_CommLink' : s + 'networks.comm_link_edge;fillColor=#29AAE1',
			'NET_SuperComputer' : s + 'networks.supercomputer;fillColor=#29AAE1',
			'NET_VirtualServer' : s + 'networks.virtual_server;fillColor=#29AAE1',
			'NET_Printer' : s + 'networks.printer;fillColor=#29AAE1',
//			'NET_Plotter' NA
			'NET_Scanner' : s + 'networks.scanner;fillColor=#29AAE1',
			'NET_Copier' : s + 'networks.copier;fillColor=#29AAE1',
//			'NET_FaxMachine' NA
			'NET_MultiFunctionMachine' : s + 'networks.copier;fillColor=#29AAE1',
			'NET_Projector' : s + 'networks.video_projector;fillColor=#29AAE1',
			'NET_ProjectorScreen' : s + 'networks.video_projector_screen;fillColor=#29AAE1',
			'NET_Bridge' : s + 'networks.router;fillColor=#29AAE1',
			'NET_Hub' : s + 'networks.hub;fillColor=#29AAE1',
			'NET_Modem' : s + 'networks.modem;fillColor=#29AAE1',
			'NET_Telephone' : s + 'signs.tech.telephone_5;fillColor=#29AAE1',
			'NET_CellPhone' : s + 'networks.mobile;fillColor=#29AAE1',
			'NET_SmartPhone' : s + 'networks.mobile;fillColor=#29AAE1',
//			'NET_VideoPhone' NA
			'NET_Camera' : s + 'signs.tech.camera_2;fillColor=#29AAE1',
//			'NET_VideoCamera' NA
//Server Racks
			'RackServerRack' : s + 'rackGeneral.container;container=1;collapsible=0;childLayout=rack;marginLeft=9;marginRight=9;marginTop=21;marginBottom=22;textColor=#000000;numDisp=off',
			'RackBlank' : s + 'rackGeneral.plate;strokeColor=#666666;labelPosition=left;align=right;spacingRight=15;fillColor=#e8e8e8',
			'RackRaidArray' : s + 'rack.cisco.cisco_carrier_packet_transport_50;labelPosition=left;align=right;spacingRight=15',
			'RackServer' : s + 'rack.oracle.sunfire_x4100;labelPosition=left;align=right;spacingRight=15',
			'RackEthernetSwitch' : s + 'rack.cisco.cisco_nexus_3016_switch;labelPosition=left;align=right;spacingRight=15',
			'RackPatchPanel' : s + 'rack.general.cat5e_rack_mount_patch_panel_24_ports;strokeColor=#666666;labelPosition=left;align=right;spacingRight=15',
			'RackRouter' : s + 'rack.cisco.cisco_asr_1001_router;labelPosition=left;align=right;spacingRight=15',
			'RackMonitor' : s + 'rack.ibm.ibm_1u_flat_panel_console_kit;labelPosition=left;align=right;spacingRight=15',
			'RackKeyboard' : s + 'rack.cisco.cisco_1905_serial_integrated_services_router;labelPosition=left;align=right;spacingRight=15',
			'RackPowerStrip' : s + 'rack.dell.power_strip;labelPosition=left;align=right;spacingRight=15',
			'RackPowerSupply' : s + 'rack.cisco.cisco_web_security_appliance_s170;labelPosition=left;align=right;spacingRight=15',
			'RackBridge' : s + 'rack.cisco.cisco_nexus_5548p_switch;labelPosition=left;align=right;spacingRight=15',
			'RackTapeDrive' : s + 'rack.ibm.ibm_1754_local_console_manager;labelPosition=left;align=right;spacingRight=15',
//Network
			'Image_network_server' : 'image;image=img/lib/clip_art/computers/Server_Tower_128x128.png;flipH=1',
			'Image_network_server_file' : 'image;image=img/lib/clip_art/computers/Server_128x128.png',
			'Image_network_server_net' : 'image;image=img/lib/clip_art/networking/Print_Server_128x128.png',
			'Image_network_server_net_large' : 'image;image=img/lib/clip_art/computers/Server_128x128.png',
			'Image_network_raid' : 'image;image=img/lib/clip_art/computers/Server_Tower_128x128.png;flipH=1',
			'Image_network_raid_large' : 'image;image=img/lib/clip_art/computers/Server_Tower_128x128.png;flipH=1',
			'Image_network_rack_server' : 'image;image=img/lib/clip_art/computers/Server_Rack_128x128.png',
			'Image_network_rack_tape' : 'image;image=img/lib/clip_art/computers/Server_Rack_Partial_128x128.png',
			'Image_network_printer_small' : 'image;image=img/lib/clip_art/computers/Printer_128x128.png;flipH=1',
			'Image_network_printer_large' : 'image;image=img/lib/clip_art/computers/Printer_128x128.png;flipH=1',
			'Image_network_printer_multipurpose' : 'image;image=img/lib/clip_art/computers/Printer_Commercial_128x128.png;flipH=1',
			'Image_network_copier_small' : 'image;image=img/lib/clip_art/computers/Printer_Commercial_128x128.png',
			'Image_network_copier_large' : 'image;image=img/lib/clip_art/computers/Printer_Commercial_128x128.png',
//			'Image_network_printer_largeformat' NA
			'Image_network_router' : 'image;image=img/lib/clip_art/networking/Router_128x128.png',
			'Image_network_router_wireless' : 'image;image=img/lib/clip_art/networking/Wireless_Router_128x128.png',
			'Image_network_ups' : 'image;image=img/lib/clip_art/networking/UPS_128x128.png',
//Electronics
//			'Image_electronics_speakers_2' NA
//			'Image_electronics_scanner_slide' NA
//			'Image_electronics_speakers_2_1' NA
//			'Image_electronics_speakers_5_1' NA
			'Image_electronics_lcd' : 'image;image=img/lib/clip_art/computers/Monitor_128x128.png',
			'Image_electronics_pda' : 'image;image=img/lib/clip_art/telecommunication/Palm_Treo_128x128.png',
			'Image_electronics_drive_cardreader' : 'image;image=img/lib/clip_art/finance/Credit_Card_128x128.png',
			'Image_electronics_camcorder' : 'image;image=img/lib/clip_art/networking/Ip_Camera_128x128.png',
//			'Image_electronics_headset' NA
//			'Image_electronics_calculator_simple' NA
//			'Image_electronics_scanner_flatbed' NA
			'Image_electronics_printer_photo' : 'image;image=img/lib/clip_art/computers/Printer_128x128.png;flipH=1',
//			'Image_electronics_scanner_photo' NA
//			'Image_electronics_projector' NA
			'Image_electronics_drive_firewire' : 'image;image=img/lib/clip_art/computers/Harddrive_128x128.png;flipH=1',
			'Image_electronics_drive_usb' : 'image;image=img/lib/clip_art/computers/Harddrive_128x128.png;flipH=1',
			'Image_electronics_modem_external' : 'image;image=img/lib/clip_art/networking/Modem_128x128.png;flipH=1',
//			'Image_electronics_tv_tuner_external' NA
//			'Image_electronics_mp3' NA
//			'Image_electronics_sound_box' NA
			'Image_electronics_lcd_wide' : 'image;image=img/lib/clip_art/computers/Monitor_128x128.png',
//Audio Equipment
//			'Image_audio_speakers_2' NA
//			'Image_audio_speakers_2_1' NA
//			'Image_audio_speakers_5_1' NA
//			'Image_audio_record_player' NA
//			'Image_audio_headset' NA
//Electrical
			'EE_Amplifier' : s + 'electrical.abstract.amplifier',
			'EE_OpAmp' : cs,
			'EE_ControlledAmp' : s + 'electrical.abstract.controlled_amplifier',
			'EE_Multiplexer' : s + 'electrical.abstract.mux',
			'EE_Demultiplexer' : s + 'electrical.abstract.demux;',
			'EE_Capacitor1' : s + 'electrical.capacitors.capacitor_1',
			'EE_Capacitor2' : s + 'electrical.capacitors.capacitor_3',
			'EE_Diode' : s + 'electrical.diodes.diode',
			'EE_Resistor' : s + 'electrical.resistors.resistor_2',
			'EE_VarResistor' : s + 'electrical.resistors.variable_resistor_2',
			'EE_Potentiometer' : s + 'electrical.resistors.potentiometer_2',
			'EE_ProtGround' : s + 'electrical.signal_sources.protective_earth',
			'EE_SignalGround' : s + 'electrical.signal_sources.signal_ground',
			'EE_Transformer' : s + 'electrical.inductors.transformer_1',
			'EE_Inductor' : s + 'electrical.inductors.inductor_3',
			'EE_Variable Inductor' : s + 'electrical.inductors.variable_inductor',
			'EE_TwoWaySwitch' : s + 'electrical.electro-mechanical.2-way_switch',
			'EE_OnOffSwitch' : s + 'electrical.electro-mechanical.simple_switch',
			'EE_Loudspeaker' : s + 'electrical.electro-mechanical.loudspeaker',
			'EE_Motor' : s + 'electrical.electro-mechanical.motor_1',
			'EE_LED1' : s + 'electrical.opto_electronics.led_2',
			'EE_Lightbulb' : s + 'electrical.miscellaneous.light_bulb',
//			'EE_IntegratedCircuit' : NA
//Power Sources
			'EE_AcSource' : s + 'electrical.signal_sources.ac_source;strokeWidth=1',
			'EE_VoltageSource' : s + 'electrical.signal_sources.dc_source_3',
			'EE_CurrentSource' : s + 'electrical.signal_sources.dc_source_2;direction=north',
			'EE_ControlledCurrentSource' : s + 'electrical.signal_sources.dependent_source_2;direction=west',
			'EE_ControlledVoltageSource' : s + 'electrical.signal_sources.dependent_source_3',
			'EE_DcSource1' : s + 'electrical.miscellaneous.monocell_battery;flipH=1;verticalLabelPosition=bottom;verticalAlign=top',
			'EE_DcSource2' : s + 'electrical.miscellaneous.multicell_battery;flipH=1;verticalLabelPosition=bottom;verticalAlign=top',
			'EE_Vss' : s + 'electrical.signal_sources.vss2;verticalLabelPosition=top;verticalAlign=bottom;fontSize=24',
			'EE_Vdd' : s + 'electrical.signal_sources.vdd;verticalLabelPosition=bottom;verticalAlign=top',
//Transistors
			'EE_BJT_NPN1' : s + 'electrical.transistors.pnp_transistor_1',
			'EE_BJT_PNP1' : s + 'electrical.transistors.npn_transistor_1',
			'EE_JFET_P' : s + 'electrical.transistors.p-channel_jfet_1;flipV=1',
			'EE_JFET_N' : s + 'electrical.transistors.n-channel_jfet_1',
			'EE_MOSFET_P1' : s + 'electrical.mosfets1.mosfet_ic_p;flipV=1',
			'EE_MOSFET_P2' : s + 'electrical.mosfets1.mosfet_p_no_bulk',
			'EE_MOSFET_P3' : s + 'electrical.mosfets1.p-channel_mosfet_1;flipV=1',
			'EE_MOSFET_N1' : s + 'electrical.mosfets1.mosfet_ic_n',
			'EE_MOSFET_N2' : s + 'electrical.mosfets1.mosfet_n_no_bulk',
			'EE_MOSFET_N3' : s + 'electrical.mosfets1.n-channel_mosfet_1',
//Relays
//			'EE_SPST' NA
//			'EE_SPDT' NA
//			'EE_DPST' NA
//			'EE_DPDT' NA
//Logic Gates
			'EE_AND' : s + 'electrical.logic_gates.and',
			'EE_OR' : s + 'electrical.logic_gates.or',
			'EE_Inverter' : s + 'electrical.logic_gates.inverter',
			'EE_NAND' : s + 'electrical.logic_gates.nand',
			'EE_NOR' : s + 'electrical.logic_gates.nor',
			'EE_XOR' : s + 'electrical.logic_gates.xor',
			'EE_NXOR' : s + 'electrical.logic_gates.xnor',
			'EE_DTypeRSFlipFlop' : s + 'electrical.logic_gates.d_type_rs_flip-flop',
			'EE_DTypeFlipFlop' : s + 'electrical.logic_gates.d_type_flip-flop',
			'EE_DTypeFlipFlopWithClear' : s + 'electrical.logic_gates.d_type_flip-flop_with_clear',
			'EE_RSLatch' : s + 'electrical.logic_gates.rs_latch',
			'EE_SyncRSLatch' : s + 'electrical.logic_gates.synchronous_rs_latch',
			'EE_TTypeFlipFlop' : s + 'electrical.logic_gates.t_type_flip-flop',
//Miscellaneous
			'EE_Plus' : s + 'ios7.misc.flagged',
			'EE_Negative' : 'shape=line',
			'EE_InverterContact' : 'shape=ellipse',
			'EE_Voltmeter' : s + 'electrical.instruments.voltmeter',
			'EE_Ammeter' : s + 'electrical.instruments.ampermeter',
			'EE_SineWave' : s + 'electrical.waveforms.sine_wave',
			'EE_Sawtooth' : s + 'electrical.waveforms.sawtooth',
			'EE_SquareWave' : s + 'electrical.waveforms.square_wave',
//Messaging Systems
			'EIChannelBlock' : s + 'eip.messageChannel;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageChannelBlock' : cs,
			'EIMessageBlock' : cs,
			'EIMessageRouterBlock' : s + 'eip.content_based_router;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageTranslatorBlock' : s + 'eip.message_translator;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageEndpointBlock' : cs,
//Messaging Channels
			'EIPublishSubscribeChannelBlock' : cs,
			'EIDatatypeChannelBlock' : cs,
			'EIInvalidMessageChannelBlock' : cs,
			'EIDeadLetterChannelBlock' : cs,
			'EIGuaranteedDeliveryBlock' : cs,
			'EIChannelAdapterBlock' : cs,
			'EIMessagingBridgeBlock' : s + 'eip.messaging_bridge;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageBusBlock' : cs,
//Message Construction
			'EICommandMessageBlock' : cs,
			'EIDocumentMessageBlock' : cs,
			'EIEventMessageBlock' : cs,
			'EIRequestReplyBlock' : cs, 
			'EIReturnAddressBlock' : cs,
			'EICorrelationIDBlock' : cs,
			'EIMessageSequenceBlock' : cs,
			'EIMessageExpirationBlock' : cs,
//Message Routing
			'EIContentBasedRouterBlock' : s + 'eip.content_based_router;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageFilterBlock' : s + 'eip.message_filter;verticalLabelPosition=bottom;verticalAlign=top',
			'EIDynamicRouterBlock' : s + 'eip.dynamic_router;verticalLabelPosition=bottom;verticalAlign=top',
			'EIRecipientListBlock' : s + 'eip.recipient_list;verticalLabelPosition=bottom;verticalAlign=top',
			'EISplitterBlock' : s + 'eip.splitter;verticalLabelPosition=bottom;verticalAlign=top',
			'EIAggregatorBlock' : s + 'eip.aggregator;verticalLabelPosition=bottom;verticalAlign=top',
			'EIResequencerBlock' : s + 'eip.resequencer;verticalLabelPosition=bottom;verticalAlign=top',
			'EIComposedMessageBlock' : s + 'eip.composed_message_processor;verticalLabelPosition=bottom;verticalAlign=top',
			'EIRoutingSlipBlock' : s + 'eip.routing_slip;verticalLabelPosition=bottom;verticalAlign=top',
			'EIProcessManagerBlock' : s + 'eip.process_manager;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageBrokerBlock' : cs,
//Message Transformation
			'EIEnvelopeWrapperBlock' : s + 'eip.envelope_wrapper;verticalLabelPosition=bottom;verticalAlign=top',
			'EIContentEnricherBlock' : s + 'eip.content_enricher;verticalLabelPosition=bottom;verticalAlign=top',
			'EIContentFilterBlock' : s + 'eip.content_filter;verticalLabelPosition=bottom;verticalAlign=top',
			'EIClaimCheckBlock' : s + 'eip.claim_check;verticalLabelPosition=bottom;verticalAlign=top',
			'EINormalizerBlock' : s + 'eip.normalizer;verticalLabelPosition=bottom;verticalAlign=top',
//Messaging Endpoints
			'EIMessagingGatewayBlock' : s + 'eip.messaging_gateway;verticalLabelPosition=bottom;verticalAlign=top',
			'EITransactionalClientBlock' : s + 'eip.transactional_client;verticalLabelPosition=bottom;verticalAlign=top',
			'EIPollingConsumerBlock' : s + 'eip.polling_consumer;verticalLabelPosition=bottom;verticalAlign=top',
			'EIEventDrivenConsumerBlock' : s + 'eip.event_driven_consumer;verticalLabelPosition=bottom;verticalAlign=top',
			'EICompetingConsumersBlock' : s + 'eip.competing_consumers;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageDispatcherBlock' : s + 'eip.message_dispatcher;verticalLabelPosition=bottom;verticalAlign=top',
			'EISelectiveConsumerBlock' : s + 'eip.selective_consumer;verticalLabelPosition=bottom;verticalAlign=top',
			'EIDurableSubscriberBlock' : cs,
			'EIServiceActivatorBlock' : s + 'eip.service_activator;verticalLabelPosition=bottom;verticalAlign=top',
//System Management
			'EIControlBusBlock' : cs,
			'EIDetourBlock' : s + 'eip.detour;verticalLabelPosition=bottom;verticalAlign=top',
			'EIWireTapBlock' : s + 'eip.wire_tap;verticalLabelPosition=bottom;verticalAlign=top',
			'EIMessageHistoryBlock' : cs,
			'EIMessageStoreBlock' : s + 'eip.message_store;verticalLabelPosition=bottom;verticalAlign=top',
			'EISmartProxyBlock' : s + 'eip.smart_proxy;verticalLabelPosition=bottom;verticalAlign=top',
			'EITestMessageBlock' : s + 'eip.test_message;verticalLabelPosition=bottom;verticalAlign=top',
			'EIChannelPurgerBlock' : s + 'eip.channel_purger;verticalLabelPosition=bottom;verticalAlign=top',
//Google Cloud Platform
			'GCPIconComputeEngineBlock' : ss + 'gcp.compute.compute_engine;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconAppEngineBlock' : ss + 'gcp.compute.app_engine;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconContainerEngineBlock' : ss + 'gcp.compute.container_engine;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconContainerRegistryBlock' : ss + 'gcp.compute.container_registry;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudFunctionsBlock' : ss + 'gcp.compute.cloud_functions;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudStorageBlock' : ss + 'gcp.storage_databases.cloud_storage;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudSQLBlock' : ss + 'gcp.storage_databases.cloud_sql;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudBigtableBlock' : ss + 'gcp.storage_databases.cloud_bigtable;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudDatastoreBlock' : ss + 'gcp.storage_databases.cloud_datastore;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconPersistentDiskBlock' : ss + 'gcp.storage_databases.persistent_disk;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudVirtualNetworkBlock' : ss + 'gcp.networking.cloud_virtual_network;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudLoadBalancingBlock' : ss + 'gcp.networking.cloud_load_balancing;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudCDNBlock' : ss + 'gcp.networking.cloud_cdn;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudInterconnectBlock' : ss + 'gcp.networking.cloud_interconnect;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudDNSBlock' : ss + 'gcp.networking.cloud_dns;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconBigQueryBlock' : ss + 'gcp.big_data.bigquery;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudDataflowBlock' : ss + 'gcp.big_data.cloud_dataflow;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudDataprocBlock' : ss + 'gcp.big_data.cloud_dataproc;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudDatalabBlock' : ss + 'gcp.big_data.cloud_datalab;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudPubSubBlock' : ss + 'gcp.big_data.cloud_pubsub;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconGenomicsBlock' : ss + 'gcp.big_data.genomics;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudMachineLearningServicesBlock' : ss + 'gcp.machine_learning.cloud_machine_learning;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconVisionAPIBlock' : ss + 'gcp.machine_learning.vision_api;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconSpeechAPIBlock' : ss + 'gcp.machine_learning.speech_api;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconNaturalLanguageAPIBlock' : ss + 'gcp.machine_learning.natural_language_api;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconTranslateAPIBlock' : ss + 'gcp.machine_learning.translation_api;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconStackdriverOverviewBlock' : ss + 'gcp.management_tools.stackdriver;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconMonitoringBlock' : ss + 'gcp.management_tools.monitoring;verticalLabelPosition=bottom;verticalAlign=top',
//			'GCPIconLoggingBlock' NA
			'GCPIconErrorReportingBlock' : ss + 'gcp.management_tools.error_reporting;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconTraceBlock' : ss + 'gcp.management_tools.trace;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconDebuggerBlock' : ss + 'gcp.management_tools.debugger;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconDeploymentManagerBlock' : ss + 'gcp.management_tools.deployment_manager;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudEndpointsBlock' : ss + 'gcp.management_tools.cloud_endpoints;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudToolsForPowerShellBlock' : ss + 'gcp.developer_tools.cloud_tools_for_powershell;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudToolsForVisualStudioBlock' : ss + 'gcp.developer_tools.cloud_tools_for_visual_studio;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconCloudIAMBlock' : ss + 'gcp.identity_and_security.cloud_iam;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconGCPLogoBlock' : ss + 'gcp.extras.generic_gcp;verticalLabelPosition=bottom;verticalAlign=top',
			'GCPIconBlankBlock' : ss + 'gcp.extras.blue_hexagon;verticalLabelPosition=bottom;verticalAlign=top',
//Equation
			'Equation' : cs, //TODO
//Walls
			'fpWall' : '',
//Rooms
//Doors & Windows
			'fpWindow' : s + 'floorplan.window',
			'fpOpening' : 'shape=rect',
			'fpDoor' : cs,
			'fpDoubleDoor' : cs,
//Stairs			
			'fpStairs' : s + 'floorplan.stairs;direction=north',
			'fpStairsDirectional' : s + 'floorplan.stairs;direction=north;verticalAlign=bottom',
//			'fpStairsCurved' NA
//			'fpStairsCurvedWide' NA
//Desks
//			'fpDeskEndSegment' NA
			'fpDeskLongSegment' : '',
			'fpDeskShortSegment' : '',
//			'fpDeskSmallCornerSegment' NA
			'fpDeskLargeCornerSegment' : s + 'floorplan.desk_corner',
//			'fpDeskMediumCornerSegment' NA
//			'fpDeskRoundedLSegment' NA
//			'fpDeskRoundedCornerSegment' NA
//Cubicle walls
			'fpCubiclePanel' : s + 'floorplan.wall;wallThickness=3',
			'fpCubicleWorkstation' : s + 'floorplan.wallU;wallThickness=3',
			'fpCubicleCorner5x5' : s + 'floorplan.wallCorner;wallThickness=3',
			'fpCubicleCorner6x6' : s + 'floorplan.wallCorner;wallThickness=3',
			'fpCubicleCorner8x8' : s + 'floorplan.wallCorner;wallThickness=3',
			'fpCubicleCorner8x6' : s + 'floorplan.wallCorner;wallThickness=3',
			'fpCubicleCornerOpen6x4' : s + 'floorplan.wallCorner;wallThickness=3',
			'fpCubicleDouble14x8' : s + 'floorplan.wallU;wallThickness=3',
			'fpCubicleEnclosed11x9' : s + 'floorplan.wallU;wallThickness=3',
//Tables & Chairs
			'fpTableConferenceOval' : 'shape=ellipse',
			'fpTableConferenceBoat' : '',
			'fpTableConferenceRectangle' : '',
			'fpTableDiningRound' : 'shape=ellipse',
			'fpTableDiningSquare' : '',
			'fpChairOffice' : s + 'floorplan.office_chair',
			'fpChairExecutive' : s + 'floorplan.office_chair',
			'fpChairLobby' : s + 'floorplan.office_chair',
			'fpChairDining' : s + 'floorplan.chair',
			'fpChairBarstool' : 'shape=ellipse',
//Cubicles - Prebuilt
//Tables - Prebuilt
//Cabinets - we don't have corresponding stencils, just rounded rectangles			
			'fpCabinetBasic' : '',
//			'fpCabinetCornerLarge' NA
			'fpCabinetDoubleWide' : '',
			'fpCabinetDoubleWithShelves' : '',
			'fpCabinetShelvesBasic' : '',
			'fpCabinetShelvesDouble' : '',
			'fpCabinetBasicWithShelves' : '',
			'fpCabinetsAboveDeskShelves' : '',
//Restroom
			'fpRestroomToiletPrivate' : s + 'floorplan.toilet',
			'fpRestroomToiletPublic' : s + 'floorplan.toilet',
//			'fpRestroomBidet' NA
			'fpRestroomLights' : cs,
			'fpRestroomSinks' : cs,
//			'fpRestroomGrabBar' NA
			'fpRestroomBathtub' : s + 'floorplan.bathtub;direction=south',
			'fpRestroomShower' : s + 'floorplan.shower;flipH=1',
//			'fpRestroomCornerSink' NA
			'fpRestroomPedastalSink' : s + 'floorplan.sink_1',
			'fpRestroomCountertop' : '',
			'fpRestroomMirror' : 'shape=line;strokeWidth=3',
//			'fpDresserOrnateMirror' NA
//			'fpRestroomToiletPaper' NA
			'fpRestroomStalls' : cs,
//Beds
			'fpBedDouble' : s + 'floorplan.bed_double',
			'fpBedSingle' : s + 'floorplan.bed_single',
			'fpBedQueen' : s + 'floorplan.bed_double',
			'fpBedKing' : s + 'floorplan.bed_double',
			'fpBedDoubleWithTrundle' : s + 'floorplan.bed_double',
			'fpBedBunk' : s + 'floorplan.bed_double',
//			'fpBedBunkL' NA
//			'fpBedCrib' NA
			'fpBedBassinet' : s + 'pid.fittings.compensator',
//Dressers
//			'fpDresserChest' NA
//			'fpDresserMirrorDresser' NA
//			'fpClosetRod' NA
//			'fpDresserOrnateMirror' NA
//Appliances
			'fpApplianceWasher' : '',
			'fpApplianceDryer' : '',
			'fpApplianceWaterHeater' : 'shape=ellipse',
//			'fpApplianceRefrigerator' NA
			'fpApplianceStoveOven' : s + 'floorplan.range_1',
			'fpStoveOvenSixBurner' : s + 'floorplan.range_2',
			'fpApplianceDishwasher' : '',
//Kitchen
			'fpKitchenSink' : s + 'floorplan.sink_2',
			'fpKitchenDoubleSink' : s + 'floorplan.sink_double',
			'fpKitchenCountertop' : '',
			'fpKitchenCountertopCorner' : s + 'floorplan.desk_corner',
//Couches
			'fpCouchLoveSeat' : s + 'floorplan.couch',
			'fpCouchSofa' : s + 'floorplan.couch',
//			'fpCouchSectional' NA
			'fpCouchOttoman' : '',
//			'fpCouchPillow' NA
//Technology
			'fpMiscDesktopComputer' : s + 'floorplan.workstation',
			'fpMiscLaptopComputer' : s + 'floorplan.laptop',
			'fpComputerMonitor' : s + 'floorplan.flat_tv',
			'fpCRTTelevision' : s + 'floorplan.flat_tv',
//			'fpMiscProjector' NA
//			'fpMiscProjectorScreen' NA
//Misc Floorplan
			'fpMiscIndoorPlant' : s + 'floorplan.plant',
//			'fpMiscPodium' NA
			'fpPiano' : s + 'floorplan.piano',
//			'fpPianoBench' : 'absoluteArcSize=1;arcSize=' + arcSize + ';rounded=1',
//Equipment
			'PEAxialCompressor' : s + 'pid.compressors.centrifugal_compressor_-_turbine_driven;verticalLabelPosition=bottom;verticalAlign=top',
			'PECentrifugalCompressor' : s + 'pid.compressors.centrifugal_compressor;verticalLabelPosition=bottom;verticalAlign=top',
			'PECentrifugalCompressor2' : s + 'pid.compressors.centrifugal_compressor_-_turbine_driven;verticalLabelPosition=bottom;verticalAlign=top',
//			'PECentrifugalCompressor3' NA
			'PEReciprocationCompressor' : s + 'pid.compressors.reciprocating_compressor;verticalLabelPosition=bottom;verticalAlign=top',
			'PERotaryCompressorBlock' : s + 'pid.compressors.rotary_compressor;verticalLabelPosition=bottom;verticalAlign=top',
			'PERotaryCompressor2Block' : s + 'pid.compressors.compressor_and_silencers;verticalLabelPosition=bottom;verticalAlign=top',
			'PEConveyorBlock' : s + 'pid2misc.conveyor;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEOverheadConveyorBlock' NA
//			'PEScraperConveyorBlock' NA
//			'PEScrewConveyorBlock' NA
//			'PEPositiveDisplacementBlock' NA
//			'PEPositiveDisplacement2' NA
			'PEElevator1Block' : s + 'pid.misc.bucket_elevator;flipH=1;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEElevator2Block' NA
//			'PEHoistBlock' NA
//			'PESkipHoistBlock' NA
//			'PEMotorBlock' NA
//			'PEDieselMotorBlock' NA
//			'PEElectricMotorBlock' NA
//			'PELiquidRingVacuumBlock' NA
//			'PETurbineDriverBlock' NA
//			'PEDoubleFlowTurbineBlock' NA
			'PEAgitatorMixerBlock' : s + 'pid.agitators.agitator_(propeller);verticalLabelPosition=bottom;verticalAlign=top',
			'PEDrumBlock' : s + 'pid.vessels.drum_or_condenser;verticalLabelPosition=bottom;verticalAlign=top',
			'PETankEquipmentBlock' : s + 'pid.vessels.tank;verticalLabelPosition=bottom;verticalAlign=top',
//			'PECentrifugalBlower' NA
//			'PEAlkylationBlock' NA
//			'PEBoomLoaderBlock' NA
//			'PEFluidCatalyticCrackingBlock' NA
//			'PEFluidCookingBlock' NA
//			'PEFluidizedReactorBlock' NA
//			'PETubularBlock' NA
//			'PEReformerBlock' NA
			'PEMixingReactorBlock' : s + 'pid.vessels.mixing_reactor;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEHydrodesulferizationBlock' NA
//			'PEHydrocrackingBlock' NA
			'PEPlateTowerBlock' : s + 'pid2misc.column;columnType=baffle;verticalLabelPosition=bottom;verticalAlign=top',
			'PEPackedTowerBlock' : s + 'pid2misc.column;columnType=fixed;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEAutomaticStokerBlock' NA
//			'PEOilBurnerBlock' NA
//			'PECounterflowForcedDraftBlock' NA
//			'PECounterflowNaturalDraftBlock' NA
//			'PECrossflowInductedBlock' NA
			'PEFurnaceBlock' : s + 'pid.vessels.furnace;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEChimneyTowerBlock' NA
//Piping
			'PEOneToMany' : cs, //TODO
			'PEMultilines' : cs, //TODO
			'PEMidArrow' : 'shape=triangle;anchorPointDirection=0',
			'PEButtWeld' : s + 'sysml.x',
			'PETopToTop' : s + 'pid.vessels.container,_tank,_cistern',
//			'PESonicSignal' NA
			'PENuclear' : s + 'electrical.waveforms.sine_wave',
//			'PEPneumatic' NA
//			'PEHydraulicSignalLine' NA
			'PEMechanicalLink' : 'shape=ellipse',
			'PESolderedSolvent' : 'shape=ellipse',
			'PEDoubleContainment' : 'shape=hexagon;perimeter=hexagonPerimeter2',
			'PEFlange' : s + 'pid.piping.double_flange',
			'PEFlange2' : s + 'pid.piping.flange_in;flipH=1',
			'PEEndCap' : s + 'pid.piping.cap',
			'PEEndCap2' : s + 'pid.vessels.container,_tank,_cistern;direction=north',
			'PEBreather' : s + 'pid.piping.breather',
			'PEElectronicallyInsulated' : s + 'pid.piping.double_flange',
			'PEReducer' : s + 'pid.piping.concentric_reducer',
			'PEInlineMixer' : s + 'pid.piping.in-line_mixer',
//			'PESeparator' NA
//			'PEBurstingDisc' NA
			'PEFlameArrester' : s + 'pid.piping.flame_arrestor',
//			'PEFlameArrester2' NA
			'PEDetonationArrester' : s + 'pid.piping.detonation_arrestor',
//			'PEDrainSilencer' NA
			'PETriangleSeparator' : 'shape=triangle;direction=west;anchorPointDirection=0',
//			'PETriangleSeparator2' NA
			'PETundish' : s + 'ios7.misc.left',
			'PEOpenVent' : s + 'pid.vessels.vent_(bent)',
//			'PESiphonDrain' NA
			'PERemovableSpool' : s + 'pid.piping.removable_spool',
			'PEYTypeStrainer' : s + 'pid.piping.y-type_strainer',
			'PEDiverterValve' : s + 'pid.piping.diverter_valve',
			'PEPulsationDampener' : s + 'pid.piping.pulsation_dampener',
			'PEDuplexStrainer' : s + 'pid.piping.duplex_strainer',
			'PEBasketStrainer' : s + 'pid.piping.basket_strainer',
			'PEVentSilencer' : s + 'pid.piping.vent_silencer',
			'PEInlineSilencer' : s + 'pid.piping.in-line_silencer',
			'PESteamTrap' : s + 'pid.piping.steam_trap',
			'PEDesuperheater' : s + 'pid.piping.desuper_heater',
			'PEEjectorOrEductor' : s + 'pid.fittings.injector',
			'PEExhaustHead' : s + 'pid.piping.exhaust_head',
			'PERotaryValve' : s + 'pid.piping.rotary_valve',
			'PEExpansionJoint' : s + 'pid.piping.expansion_joint',
//Vessels
			'PEVesselBlock' : cs,
			'PEOpenTankBlock' : s + 'pid.vessels.container,_tank,_cistern;verticalLabelPosition=bottom;verticalAlign=top', //not all versions supported
			'PEOpenTopTank' : s + 'pid.vessels.container,_tank,_cistern;verticalLabelPosition=bottom;verticalAlign=top',
			'PEClosedTankBlock' : cs,
			'PEStorageSphereBlock' : s + 'pid.vessels.storage_sphere;verticalLabelPosition=bottom;verticalAlign=top',
			'PEColumnBlock' : cs,
			'PEBagBlock' : s + 'pid.vessels.bag;verticalLabelPosition=bottom;verticalAlign=top',
			'PEGasCylinderBlock' : s + 'pid.vessels.gas_bottle;verticalLabelPosition=bottom;verticalAlign=top',
			'PEGasHolderBlock' : s + 'pid.vessels.gas_holder;verticalLabelPosition=bottom;verticalAlign=top',
			'PEClarifierBlock' : s + 'pid.vessels.bunker_(conical_bottom);verticalLabelPosition=bottom;verticalAlign=top',
			'PETankBlock' : s + 'pid.vessels.tank_(conical_roof);verticalLabelPosition=bottom;verticalAlign=top',
			'PETrayColumnBlock' : s + 'pid2misc.column;columnType=tray;verticalLabelPosition=bottom;verticalAlign=top',
			'PEReactionVesselBlock' : s + 'pid.vessels.reactor',
			'PEBin' : s + 'pid.vessels.tank_(conical_bottom)',
			'PEDomeRoofTank' : s + 'pid.vessels.tank_(dished_roof)',
			'PEConeRoofTank' : s + 'pid.vessels.tank_(conical_roof)',
//			'PEInternalFloatingRoof' NA
//			'PEDoubleWallTank' NA
//			'PEOnionTank' NA
//Heat Exchangers
			'PEBoilerBlock' : s + 'pid.misc.boiler_(dome);verticalLabelPosition=bottom;verticalAlign=top',
			'PEEquipmentBoilerBlock' : s + 'pid.misc.boiler_(dome);verticalLabelPosition=bottom;verticalAlign=top',
			'PEReboilerBlock' : s + 'pid.heat_exchangers.reboiler;verticalLabelPosition=bottom;verticalAlign=top',
			'PECondenserBlock' : s + 'pid.heat_exchangers.heat_exchanger_(straight_tubes);verticalLabelPosition=bottom;verticalAlign=top',
			'PEEquipmentCondenserBlock' : s + 'pid.heat_exchangers.condenser;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEEvaporativeCondenserBlock' NA
			'PECoolingTowerBlock' : s + 'pid.misc.cooling_tower;verticalLabelPosition=bottom;verticalAlign=top',
			'PEHeatExchangerBlock' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_1;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEAirCooledExchangerBlock' NA
			'PEHairpinExchangerBlock' : s + 'pid.heat_exchangers.hairpin_exchanger;verticalLabelPosition=bottom;verticalAlign=top',
			'PEPlateAndFrameHeatExchangerBlock' : s + 'pid.heat_exchangers.plate_and_frame_heat_exchanger;verticalLabelPosition=bottom;verticalAlign=top',
			'PESpiralHeatExchanger' : s + 'pid.heat_exchangers.spiral_heat_exchanger;verticalLabelPosition=bottom;verticalAlign=top',
			'PEUTubeHeatExchangerBlock' : s + 'pid.heat_exchangers.u-tube_heat_exchanger;verticalLabelPosition=bottom;verticalAlign=top',
			'PEDoublePipeHeatBlock' : s + 'pid.heat_exchangers.double_pipe_heat_exchanger;verticalLabelPosition=bottom;verticalAlign=top',
			'PEShellAndTubeHeat1Block' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_1;verticalLabelPosition=bottom;verticalAlign=top',
			'PEShellAndTubeHeat2Block' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_2;verticalLabelPosition=bottom;verticalAlign=top',
			'PEShellAndTubeHeat3Block' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_1;direction=north;verticalLabelPosition=bottom;verticalAlign=top',
			'PESinglePassHeatBlock' : s + 'pid.heat_exchangers.single_pass_heat_exchanger;verticalLabelPosition=bottom;verticalAlign=top',
			'PEHeaterBlock' : s + 'pid.heat_exchangers.heater',
//Pumps
			'PEEjectorInjectorBlock' : s + 'pid.fittings.injector;verticalLabelPosition=bottom;verticalAlign=top',
			'PECompressorTurbineBlock' : cs,
			'PEMotorDrivenTurbineBlock' : cs,
//			'PETripleFanBlades2Block' NA
//			'PEFanBlades2Block' : NA
			'PECentrifugalPumpBlock' : s + 'pid.pumps.gas_blower;flipH=1;verticalLabelPosition=bottom;verticalAlign=top',
			'PECentrifugalPump' : s + 'pid.pumps.centrifugal_pump_1;verticalLabelPosition=bottom;verticalAlign=top',
			'PECentrifugalPump2' : s + 'pid.pumps.centrifugal_pump_2;verticalLabelPosition=bottom;verticalAlign=top',
			'PECentrifugalPump3' : s + 'pid.pumps.centrifugal_pump_1;flipH=1;verticalLabelPosition=bottom;verticalAlign=top',
			'PEGearPumpBlock' : s + 'pid.pumps.gear_pump;verticalLabelPosition=bottom;verticalAlign=top',
			'PEHorizontalPump' : s + 'pid.pumps.horizontal_pump;verticalLabelPosition=bottom;verticalAlign=top',
			'PEProgressiveCavityPump' : s + 'pid.pumps.cavity_pump;flipH=1;flipV=1;verticalLabelPosition=bottom;verticalAlign=top',
			'PEScrewPump' : s + 'pid.pumps.screw_pump;verticalLabelPosition=bottom;verticalAlign=top',
			'PEScrewPump2' : s + 'pid.pumps.screw_pump_2;flipH=1;verticalLabelPosition=bottom;verticalAlign=top',
			'PESumpPump' : s + 'pid.pumps.sump_pump;verticalLabelPosition=bottom;verticalAlign=top',
			'PEVacuumPump' : s + 'pid.pumps.vacuum_pump;verticalLabelPosition=bottom;verticalAlign=top',
			'PEVerticalPump' : s + 'pid.pumps.vertical_pump;verticalLabelPosition=bottom;verticalAlign=top',
			'PEVerticalPump2' : s + 'pid.pumps.vertical_pump;verticalLabelPosition=bottom;verticalAlign=top',
//Instruments
			'PEIndicatorBlock' : cs,
			'PEIndicator2Block' : cs,
			'PEIndicator3Block' : s + 'pid2inst.discInst;mounting=field',
			'PEIndicator4Block' : s + 'pid2inst.indicator;mounting=field;indType=inst',
//			'PEIndicator5Block' NA
			'PESharedIndicatorBlock' : cs,
			'PESharedIndicator2Block' : cs,
			'PEComputerIndicatorBlock' : cs,
			'PEProgrammableIndicatorBlock' : cs,
//Valves
			'PEGateValveBlock' : cs, //TODO not all variants covered
			'PEGlobeValveBlock' : cs,
			'PEControlValveBlock' : s + 'pid2valves.valve;valveType=gate;actuator=diaph;verticalLabelPosition=bottom;verticalAlign=top',  //TODO not all variants covered
			'PENeedleValveBlock' : s + 'pid2valves.valve;valveType=needle;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEButterflyValveBlock' NA
			'PEButterflyValve2Block' : s + 'pid2valves.valve;flipH=1;valveType=butterfly;verticalLabelPosition=bottom;verticalAlign=top',
			'PEBallValveBlock' : s + 'pid2valves.valve;valveType=ball;verticalLabelPosition=bottom;verticalAlign=top',
			'PEDiaphragmBlock' : s + 'pid2valves.valve;valveType=ball;verticalLabelPosition=bottom;verticalAlign=top', 
			'PEPlugValveBlock' : s + 'pid2valves.valve;valveType=ball;verticalLabelPosition=bottom;verticalAlign=top',
			'PECheckValveBlock' : s + 'pid2valves.valve;valveType=check;verticalLabelPosition=bottom;verticalAlign=top',
			'PECheckValve2Block' : s + 'pid2valves.valve;valveType=check;verticalLabelPosition=bottom;verticalAlign=top',
			'PEAngleValveBlock' : cs,
			'PEAngleGlobeValveBlock' : cs,
			'PEPoweredValveBlock' : cs,
			'PEFloatOperatedValveBlock' : s + 'pid2valves.valve;valveType=gate;actuator=singActing;verticalLabelPosition=bottom;verticalAlign=top',
			'PENeedleValve2Block' : s + 'pid2valves.valve;valveType=needle;verticalLabelPosition=bottom;verticalAlign=top',
			'PEThreeWayValveBlock' : s + 'pid2valves.valve;valveType=threeWay;actuator=none;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEFourWayValveBlock' NA
//			'PEGaugeBlock' NA
			'PEBleederValveBlock' : s + 'pid2valves.blockBleedValve;actuator=none;verticalLabelPosition=bottom;verticalAlign=top',
//			'PEOrificeBlock' NA
			'PERotameterBlock' : s + 'pid.flow_sensors.rotameter;flipH=1;verticalLabelPosition=bottom;verticalAlign=top',
//Venn Gradient
			'VennGradientColor1' : 'shape=ellipse;fillOpacity=35',
			'VennGradientColor2' : 'shape=ellipse;fillOpacity=35',
			'VennGradientColor3' : 'shape=ellipse;fillOpacity=35',
			'VennGradientColor4' : 'shape=ellipse;fillOpacity=35',
			'VennGradientColor5' : 'shape=ellipse;fillOpacity=35',
			'VennGradientColor6' : 'shape=ellipse;fillOpacity=35',
			'VennGradientColor7' : 'shape=ellipse;fillOpacity=35',
			'VennGradientColor8' : 'shape=ellipse;fillOpacity=35',
//Venn Plain
			'VennPlainColor1' : 'shape=ellipse;fillOpacity=35',
			'VennPlainColor2' : 'shape=ellipse;fillOpacity=35',
			'VennPlainColor3' : 'shape=ellipse;fillOpacity=35',
			'VennPlainColor4' : 'shape=ellipse;fillOpacity=35',
			'VennPlainColor5' : 'shape=ellipse;fillOpacity=35',
			'VennPlainColor6' : 'shape=ellipse;fillOpacity=35',
			'VennPlainColor7' : 'shape=ellipse;fillOpacity=35',
			'VennPlainColor8' : 'shape=ellipse;fillOpacity=35',
//iOS Devices
			'iOS7DeviceiPhone5Portrait' : s + 'ios.iPhone;bgStyle=bgGreen', //TODO
			'iOS7DeviceiPhone5Landscape' : s + 'ios.iPhone;bgStyle=bgGreen', //TODO
			'iOS7DeviceiPadPortrait' : s + 'ios.iPad;bgStyle=bgGreen', //TODO
			'iOS7DeviceiPadLandscape' : s + 'ios.iPad;bgStyle=bgGreen', //TODO
			'iOS7DeviceiPhone6Portrait' : s + 'ios.iPhone;bgStyle=bgGreen', //TODO
			'iOS7DeviceiPhone6Landscape' : s + 'ios.iPhone;bgStyle=bgGreen', //TODO
			'iOS7DeviceiPhone6PlusPortrait' : s + 'ios.iPhone;bgStyle=bgGreen', //TODO
			'iOS7DeviceiPhone6PlusLandscape' : s + 'ios.iPhone;bgStyle=bgGreen', //TODO
//iPhone Elements
			'iOS7StatusBariPhone' : s + 'ios7ui.appBar',
//			'iOS7NavBariPhone' NA
			'iOS7TabsiPhone' : cs, //TODO
			'iOS7iPhoneActionSheet' : cs, //TODO
			'iOS7iPhoneKeyboard' : s + 'ios7.misc.keyboard_(letters)',
			'iOS7TableView' : cs, //TODO
//iPad Elements
			'iOS7StatusBariPad' : s + 'ios7ui.appBar',
			'iOS7NavBariPad' : cs, //TODO
			'iOS7TabsiPad' : cs, //TODO
			'iOS7iPadActionSheet' : cs, //TODO
			'iOS7iPadKeyboard' : s + 'ios7.misc.keyboard_(letters)',
//			'iOS7SplitView'
//			'iOS7iPadPopover'
//Common Elements
			'iOS7AlertDialog' : cs, //TODO
			'iOS7ProgressBar' : s + 'ios7ui.downloadBar', //TODO
			'iOS7Slider' : s + 'ios7ui.searchBox', //TODO
			'iOS7SearchBar' : s + 'ios7ui.searchBox', 
			'iOS7Button' : '',
			'iOS7TextField' : '',
			'iOS7TextView' : '',
			'iOS7SegmentedControl' : cs, //TODO
			'iOS7Toggle' : s + 'ios7ui.onOffButton;buttonState=on;strokeColor=#38D145;strokeColor2=#aaaaaa;fillColor=#38D145;fillColor2=#ffffff', //TODO
			'iOS7Stepper' : s + 'ios7.misc.adjust;fillColor=#ffffff;gradientColor=none',
			'iOS7PageControls' : s + 'ios7ui.pageControl;fillColor=#666666;strokeColor=#bbbbbb', //TODO
			'iOS7Block' : '',
			'iOS7DatePicker' : cs, //TODO
			'iOS7TimePicker' : cs, //TODO
			'iOS7CountdownPicker' : cs, //TODO
//iOS Icons
			'iOS7IconArrow left' : s + 'ios7.misc.left',
			'iOS7IconArrow' : s + 'ios7.misc.right',
			'iOS7IconArrow up' : s + 'ios7.misc.up',
			'iOS7IconArrow down' : s + 'ios7.misc.down',
			'iOS7IconWifi' : s + 'ios7.icons.wifi',
			'iOS7IconBluetooth' : s + 'ios7.icons.bluetooth',
			'iOS7IconBattery' : s + 'ios7.icons.battery',
			'iOS7IconSiri' : s + 'ios7.icons.microphone',
			'iOS7IconCheck' : s + 'ios7.icons.select',
			'iOS7IconCreate' : s + 'ios7.icons.add',
			'iOS7IconInfo' : s + 'ios7.icons.info',
			'iOS7IconLocation' : s + 'ios7.icons.location_2',
			'iOS7IconQuestion' : s + 'ios7.icons.help',
			'iOS7IconSearch' : s + 'ios7.icons.looking_glass',
			'iOS7IconToolbox' : s + 'ios7.icons.briefcase',
			'iOS7IconOptions' : s + 'ios7.icons.options',
			'iOS7IconShare' : s + 'ios7.icons.share',
			'iOS7IconTyping' : s + 'ios7.icons.message',
			'iOS7IconCopy' : s + 'ios7.icons.folders_2',
			'iOS7IconChat' : s + 'ios7.icons.messages',
			'iOS7IconOrganize' : s + 'ios7.icons.folder',
			'iOS7IconTrash' : s + 'ios7.icons.trashcan',
			'iOS7IconReply' : s + 'ios7.icons.back',
			'iOS7IconArchive' : s + 'ios7.icons.box',
			'iOS7IconCompose' : s + 'ios7.icons.compose',
			'iOS7IconSend' : s + 'ios7.icons.pointer',
			'iOS7IconDrawer' : s + 'ios7.icons.storage',
			'iOS7IconMail' : s + 'ios7.icons.mail',
			'iOS7IconDocument' : s + 'ios7.icons.document',
			'iOS7IconFlag' : s + 'ios7.icons.flag',
			'iOS7IconBookmarks' : s + 'ios7.icons.book',
			'iOS7IconGlasses' : s + 'ios7.icons.glasses',
			'iOS7IconFiles' : s + 'ios7.icons.folders',
			'iOS7IconDownloads' : s + 'ios7.icons.down',
			'iOS7IconLock' : s + 'ios7.icons.locked',
//			'iOS7IconUnlock' NA
			'iOS7IconCloud' : s + 'ios7.icons.cloud',
//			'iOS7IconCloud-lock' NA
			'iOS7IconOrientation Lock' : s + 'ios7.icons.orientation_lock',
//			'iOS7IconNotification' NA
			'iOS7IconContacts' : s + 'ios7.icons.user',
			'iOS7IconGlobal' : s + 'ios7.icons.globe',
			'iOS7IconSettings' : s + 'ios7.icons.settings',
			'iOS7IconAirplay' : s + 'ios7.icons.move_to_folder',
			'iOS7IconCamera' : s + 'ios7.icons.camera',
			'iOS7IconAirplane' : s + 'signs.transportation.airplane_6;direction=south',
			'iOS7IconCalculator' : s + 'ios7.icons.calculator',
			'iOS7IconPreferences' : s + 'ios7.icons.most_viewed',
			'iOS7IconPhone' : s + 'signs.tech.telephone_3',
			'iOS7IconKeypad' : s + 'ios7.icons.keypad',
			'iOS7IconVoicemail' : s + 'ios7.icons.tape',
			'iOS7IconStar' : s + 'ios7.icons.star',
			'iOS7IconMost Viewed' : s + 'ios7.icons.most_viewed',
			'iOS7IconVideo' : s + 'ios7.icons.video_conversation',
			'iOS7IconVolumne Controls' : s + 'ios7.icons.volume',
			'iOS7IconLocation pin' : s + 'ios7.icons.location',
			'iOS7IconCalendar' : s + 'ios7.icons.calendar',
			'iOS7IconAlarm' : s + 'ios7.icons.alarm_clock',
			'iOS7IconClock' : s + 'ios7.icons.clock',
			'iOS7IconTimer' : s + 'ios7.icons.gauge',
			'iOS7IconVolume down' : s + 'ios7.icons.silent',
			'iOS7IconVolume' : s + 'ios7.icons.volume_2',
			'iOS7IconVolume up' : s + 'ios7.icons.loud',
			'iOS7IconRepeat' : s + 'ios7.icons.reload',
			'iOS7IconRewind' : s + 'ios7.icons.backward',
			'iOS7IconPlay' : s + 'ios7.icons.play',
			'iOS7IconPause' : s + 'ios7.icons.pause',
			'iOS7IconFast forward' : s + 'ios7.icons.forward',
//			'iOS7IconArtists' NA
//			'iOS7IconPlaylist' NA
			'iOS7IconControls' : s + 'ios7.icons.controls',
//			'iOS7IconShuffle' NA
			'iOS7IconPrivacy' : s + 'ios7.icons.privacy',
			'iOS7IconLink' : s + 'ios7.icons.link',
			'iOS7IconLight' : s + 'ios7.icons.flashlight',
			'iOS7IconBrightness' : s + 'ios7.icons.sun',
			'iOS7IconHeart' : s + 'ios7.icons.heart',
			'iOS7IconJava' : s + 'ios7.icons.cup',
			'iOS7IconBox' : s + 'ios7.icons.bag',
			'iOS7IconEye' : s + 'ios7.icons.eye',
			'iOS7IconDo not disturb' : s + 'ios7.icons.moon',
//iOS Activity
//			'iOS7ActivityAdd bookmark' NA
//			'iOS7ActivityAdd to home screen' NA
//			'iOS7ActivityAdd to reading list' NA
//			'iOS7ActivityAirplay' NA
//			'iOS7ActivityAssign to contact' NA
//			'iOS7ActivityCopy' NA
//			'iOS7ActivityPrint' NA
//			'iOS7ActivitySlideshow' NA
//			'iOS7ActivityUse as wallpaper' NA
//UI Containers
			'UI2BrowserBlock' : cs,
			'UI2WindowBlock' : cs, 
			'UI2DialogBlock' : cs,
			'UI2AreaBlock' : '',
			'UI2ElementBlock' : '',
			'UI2AccordionBlock' : cs,
			'UI2TabBarContainerBlock' : cs,
			'UI2TabBar2ContainerBlock' : cs,
			'UI2VTabBarContainerBlock' : cs,
			'UI2VScrollBlock' : s + 'mockup.navigation.scrollBar;direction=north',
			'UI2HScrollBlock' : s + 'mockup.navigation.scrollBar',
			'UI2VerticalSplitterBlock' : s + 'mockup.forms.splitter;direction=north',
			'UI2HorizontalSplitterBlock' : s + 'mockup.forms.splitter',
//UI Widgets
			'UI2ImageBlock' : s + 'mockup.graphics.simpleIcon',
			'UI2VideoBlock' : s + 'mockup.containers.videoPlayer;barHeight=30',
			'UI2AudioBlock' : s + 'mockup.misc.playbackControls',
			'UI2MapBlock' : s + 'mockup.misc.map',
//			'UI2CalendarBlock' NA
			'UI2BarChartBlock' : s + 'mockup.graphics.barChart;strokeColor=none;strokeColor2=none',
			'UI2ColumnChartBlock' : s + 'mockup.graphics.columnChart;strokeColor=none;strokeColor2=none',
			'UI2LineChartBlock' : s + 'mockup.graphics.lineChart;strokeColor=none',
			'UI2PieChartBlock' : s + 'mockup.graphics.pieChart;parts=10,20,35',
			'UI2WebcamBlock' : s + 'mockup.containers.userMale',
			'UI2CaptchaBlock' : s + 'mockup.text.captcha;mainText=',
//			'Image_ui_formatting_toolbar2'
//UI Input
			'UI2ButtonBlock' : 'rounded=1;arcSize=25;',
			'UI2CheckBoxBlock' : cs,
			'UI2HorizontalCheckBoxBlock' : cs,
			'UI2RadioBlock' : cs,
			'UI2HorizontalRadioBlock' : cs,
			'UI2ColorPickerBlock' : s + 'mockup.forms.colorPicker;chosenColor=#aaddff',
			'UI2TextInputBlock' : '',
			'UI2SelectBlock' : s + 'mockup.forms.comboBox;strokeColor=#999999;fillColor=#ddeeff;align=left;fillColor2=#aaddff;mainText=;fontColor=#666666',
			'UI2VSliderBlock' : cs,
			'UI2HSliderBlock' : cs,
			'UI2DatePickerBlock' : cs,
			'UI2SearchBlock' : cs,
			'UI2NumericStepperBlock' : cs,
			'UI2TableBlock' : cs, //TODO
//UI Menus
			'UI2ButtonBarBlock' : cs,
			'UI2VerticalButtonBarBlock' : cs,
			'UI2LinkBarBlock' : cs,
			'UI2BreadCrumbsBlock' : cs,
			'UI2MenuBarBlock' : cs,
			'UI2AtoZBlock' : cs,
			'UI2PaginationBlock' : cs,
			'UI2ContextMenuBlock' : cs,
			'UI2TreePaneBlock' : cs, //TODO
			'UI2PlaybackControlsBlock' : s + 'mockup.misc.playbackControls;fillColor=#ffffff;strokeColor=#999999;fillColor2=#99ddff;strokeColor2=none;fillColor3=#ffffff;strokeColor3=none',
			'Image_ui_formatting_toolbar' : s + 'mockup.menus_and_buttons.font_style_selector_2',
//UI Misc
			'UI2ProgressBarBlock' : cs,
			'UI2HelpIconBlock' : s + 'mockup.misc.help_icon',
			'UI2BraceNoteBlock' : cs,
			'UI2TooltipBlock' : s + 'basic.rectangular_callout;flipV=1',
			'UI2TooltipSquareBlock' : cs,
			'UI2CalloutBlock' : cs,
			'UI2AlertBlock' : cs,
//iOS 6 iPad Elements
			'Image_ipad_ipad' : s + 'ios.iPad;bgStyle=bgGreen',
			'iPadGrayBackgroundBlock' : '',
			'Image_ipad_top_bar' : s + 'ios.iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc',
//			'Image_ipad_bar_gray' : '',
//			'Image_ipad_bar_semi_trans_black' : '',
//			'Image_ipad_bar_black' : '',
//			'Image_ipad_safari_top' NA
			'Image_ipad_search' : s + 'mockup.forms.searchBox;mainText=;flipH=1',
			'Image_ipad_alert_dialog' : cs, //TODO
			'Image_ipad_dialog' : cs, //TODO
			'Image_ipad_popover' : s + 'ios.iOption;barPos=50;pointerPos=top;buttonText=',
			'Image_ipad_table' : cs, //TODO
			'Image_ipad_vtab' : cs, //TODO
//iOS 6 iPad Controls
			'Image_ipad_button_black' : '',
			'Image_ipad_button_blue' : '',
			'Image_ipad_button_grayblue' : '',
			'Image_ipad_button_red' : '',
			'Image_ipad_back_button_gray' : s + 'ios.iButtonBack;buttonText=;fillColor=#eeeeee;fillColor2=#aaaaaa',
			'Image_ipad_back_button_black' : s + 'ios.iButtonBack;buttonText=;fillColor=#888888;fillColor2=#000000',
			'Image_ipad_sort_handle' : s + 'ios7.icons.options',
			'Image_ipad_dropdown' : s + 'ios.iComboBox;buttonText=;fillColor=#dddddd;fillColor2=#3D5565',
			'Image_ipad_email_name' : '',
			'Image_ipad_prev_next' : s + 'ios.iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff',
			'Image_ipad_keyboard_portrait' : s + 'ios.iKeybLett',
			'Image_ipad_keyboard_landscape' : s + 'ios.iKeybLett',
			'Image_ipad_large_tabbed_button' : cs, //TODO
			'Image_ipad_sort_button' : cs, //TODO
			'Image_ipad_tab_bar' : cs, //TODO
			'Image_ipad_slider' : s + 'ios.iSlider;barPos=20',
//			'Image_ipad_switch_off'
//iOS 6 iPad Icons
			'Image_ipad_add_icon_blue' : s + 'ios.iAddIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff',
			'Image_ipad_add_icon_green' : s + 'ios.iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff',
			'Image_ipad_remove_icon' : s + 'ios.iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff',
			'Image_ipad_arrow_icon' : s + 'ios.iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff',
			'Image_ipad_arrow' : s + 'ios7.misc.more',
			'Image_ipad_checkmark' : s + 'ios7.misc.check',
			'Image_ipad_check_off' : 'shape=ellipse', //TODO
			'Image_ipad_location_dot' : 'shape=ellipse',
			'Image_ipad_mark_as_read' : 'shape=ellipse',
			'Image_ipad_pin_green' : s + 'ios.iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600',
			'Image_ipad_pin_red' : s + 'ios.iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000',
			'Image_ipad_radio_off' : 'shape=ellipse', //TODO
			'Image_ipad_checkbox_off' : 'absoluteArcSize=1;arcSize=' + arcSize + ';rounded=1', //TODO
			'Image_ipad_indicator' : 'absoluteArcSize=1;arcSize=' + arcSize + ';rounded=1;fillColor=#e8878E;gradientColor=#BD1421;strokeColor=#ffffff',
//iOS 6 iPhone Elements
			'Image_iphone_iphone_4' : s + 'ios.iPhone;bg=bgGreen',
			'Image_iphone_bg_black' : '',
			'Image_iphone_bg_gray' : '',
			'Image_iphone_bg_stripe_drk' : s + 'ios.iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F',
			'Image_iphone_bg_stripe_lt' : s + 'ios.iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F',
			'Image_iphone_bg_white' : '',
			'Image_iphone_top_bar_app' : s + 'ios.iAppBar',
			'Image_iphone_top_bar_home' : s + 'ios.iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc;strokeWidth=1',
			'Image_iphone_bar_top' : '',
			'Image_iphone_bar_semi_trans_black' : '',
			'Image_iphone_bar_semi_trans_blue' : '',
			'Image_iphone_search' : s + 'mockup.forms.searchBox;mainText=;flipH=1',
			'Image_iphone_table' : cs, //TODO
			'Image_iphone_table_w_buttons' : cs, //TODO
			'Image_iphone_table_w_icons' : cs, //TODO
			'Image_iphone_list' : cs, //TODO
//			'Image_iphone_safari_top' NA
//			'Image_iphone_safari_bottom' NA
			'Image_iphone_gray_grad_list' : '', //TODO
//			'Image_iphone_alert_bar' NA
//			'Image_iphone_alert_dialog' : cs, //TODO
			'Image_iphone_dialog' : cs, //TODO
			'Image_iphone_scroll_pane' : cs, //TODO
			'Image_iphone_alpha_list' : s + 'ios.iAlphaList',
//iOS 6 iPhone Controls
			'Image_iphone_button_black' : '',
			'Image_iphone_button_blue' : '',
			'Image_iphone_button_grayblue' : '',
			'Image_iphone_button_red' : '',
			'Image_iphone_button_lg_light' : '',
			'Image_iphone_button_lg_dark' : '',
			'Image_iphone_button_lg_green' : '',
			'Image_iphone_button_lg_red' : '',
			'Image_iphone_button_lg_yellow' : '',
			'Image_iphone_button_xl_green' : '',
			'Image_iphone_back_button' : s + 'ios.iButtonBack;strokeColor=#444444;buttonText=;fillColor=#dddddd;fillColor2=#3D5565',
			'Image_iphone_prev_next' : s + 'ios.iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff',
			'Image_iphone_sort_handle' : s + 'ios7.icons.options',
			'Image_iphone_slider' : s + 'ios.iSlider;barPos=60',
			'Image_iphone_dropdown' : s + 'ios.iComboBox;buttonText=;fillColor=#dddddd;fillColor2=#3D5565',
			'Image_iphone_email_name' : '',
			'Image_iphone_switch_off' : s + 'android.switch_off;fillColor=#666666', //TODO
			'Image_iphone_keyboard_button_blue' : '',
			'Image_iphone_keyboard_letters' : s + 'ios.iKeybLett',
			'Image_iphone_keyboard_landscape' : s + 'ios.iKeybLett',
			'Image_iphone_large_tabbed_button' : cs, //TODO
			'Image_iphone_sort_button' : cs, //TODO
			'Image_iphone_tab_bar' : cs, //TODO
			'Image_iphone_picker_multi' : cs, //TODO
			'Image_iphone_picker_web' : cs, //TODO
//iOS 6 iPhone Icons
			'Image_iphone_add_icon_blue' : s + 'ios.iAddIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff',
			'Image_iphone_add_icon_green' : s + 'ios.iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff',
			'Image_iphone_remove_icon' : s + 'ios.iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff',
			'Image_iphone_arrow_icon' : s + 'ios.iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff',
			'Image_iphone_arrow' : s + 'ios7.misc.more',
			'Image_iphone_checkmark' : s + 'ios7.misc.check',
			'Image_iphone_check_off' : 'shape=ellipse', //TODO
			'Image_iphone_location_dot' : 'shape=ellipse',
			'Image_iphone_mark_as_read' : 'shape=ellipse',
			'Image_iphone_pin_green' : s + 'ios.iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600',
			'Image_iphone_pin_red' : s + 'ios.iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000',
			'Image_iphone_radio_off' : 'shape=ellipse', //TODO
			'Image_iphone_checkbox_off' : '', //TODO
			'Image_iphone_indicator' : 'fillColor=#e8878E;gradientColor=#BD1421;strokeColor=#ffffff',
			'Image_iphone_thread_count' : ''
	};
	
	function convertText(props)
	{
		var text = (props.Text != null) ? props.Text :
			((props.Value != null) ? props.Value :
			props.Lane_0);
		var text2 = null;
		
		if (text == null && props.State != null)
		{
			if (props.State.t != null)
			{
				text = props.State;
			}
		}
		else if (text == null && props.Note != null)
		{
			if (props.Note.t != null)
			{
				text = props.Note;
			}
		}
		else if (text == null && props.Title != null)
		{
			if (props.Title.t != null)
			{
				text = props.Title;
			}
		}
		else if (props.t != null)
		{
			text = props;
		}

		if (text == null && props.TextAreas != null)
		{
			if (props.TextAreas.Text != null)
			{
				if (props.TextAreas.Text.Value != null)
				{
					if (props.TextAreas.Text.Value.t != null)
					{
						text = props.TextAreas.Text.Value;
					}
				}
			}
		}

		// TODO: Convert text object to HTML
		if (text != null)
		{
			if (text.t != null)
			{
				text.t = text.t.replace(/</g, '&lt;');
				text.t = text.t.replace(/>/g, '&gt;');
				return text.t;
			}
			
			if (text.Value != null)
			{
				if (text.Value.t != null)
				{
					text.Value.t = text.Value.t.replace(/</g, '&lt;');
					text.Value.t = text.Value.t.replace(/>/g, '&gt;');
					return text.Value.t;
				}
			}
		}
		
		return (text2 != null) ? text2 : ''; 
	};
		
	function getAction(obj)
	{
		if (obj.Action != null)
		{
			return obj.Action;
		}
		
		return obj;
	};
		
	function getTextM(properties)
	{
		if (properties.Text != null)
		{
			if (properties.Text.m != null)
			{
				return properties.Text.m;
			}
		}
		else if(properties.TextAreas != null)
		{
			if (properties.TextAreas.Text != null)
			{
				if (properties.TextAreas.Text.Value != null)
				{
					if (properties.TextAreas.Text.Value.m != null)
					{
						return properties.TextAreas.Text.Value.m;
					}
				}
			}
		}
		else if (properties.m != null)
		{
			return properties.m;
		}

		return null;
	}
	
	function getLabelStyle(properties)
	{
		var style = getFontSize(properties) +
				getFontColor(properties) + 
				getFontStyle(properties) +
				getTextAlignment(properties) + 
				getTextLeftSpacing(properties) +
				getTextRightSpacing(properties) + 
				getTextTopSpacing(properties) +
				getTextBottomSpacing(properties) + 
				getTextGlobalSpacing(properties) +
				getTextVerticalAlignment(properties);
		
		return style;  
	}
	
	function getFontSize(properties)
	{
		//adds font size
		var isV = false;
		
		var m = getTextM(properties);
		
		if (m != null)
		{
			var i = 0;
			
			while ((!isV) && (i < m.length))
			{
				var currM = m[i];
				
				if (currM.n == 's')
				{
					if (currM.v != null)
					{
						isV = true;
						
						return 'fontSize=' + Math.round(currM.v * scale) + ';';
					}
				}
				i++;
			}
		}
		
		if (isV == 0)
		{
			return 'fontSize=' + defaultFontSize + ';';
		}
		
		return '';
	}
	
	function getFontColor(properties)
	{
		//adds font color
		var isC = false;
		var m = getTextM(properties);
		
		if (m != null)
		{
			var i = 0;
			
			while ((!isC) && (i < m.length))
			{
				var currM = m[i];
				
				if (currM.n == 'c')
				{
					if (currM.v != null)
					{
						isC = true;
						
						var currV = currM.v;
						
						if (currV.charAt(0) != '#')
						{
							currV = '#' + currV;
						}

						var currV = currV.substring(0, 7);

						return mxConstants.STYLE_FONTCOLOR + '=' + currV + ';';
					}
				}
				
				i++;
			}
		}
		
		return '';
	}
	
	function getFontStyle(properties)
	{
		var m = getTextM(properties);
		
		if (m != null)
		{
			var fontStyle = 0;
			//check for bold text
			var isBT = false;
			
			if (m != null)
			{
				var i = 0;
				
				while ((!isBT) && (i < m.length))
				{
					var currM = m[i];
					
					if (currM.n == 'b')
					{
						if (currM.v != null && currM.v)
						{
							isBT = true;
							fontStyle += 1;
						}
					}
					
					i++;
				}
			}
				
			//check for italic text
			var isIT = false;
			
			if (m != null)
			{
				var i = 0;
				
				while ((!isIT) && (i < m.length))
				{
					var currM = m[i];
					
					if (currM.n == 'i')
					{
						if (currM.v != null && currM.v)
						{
							isIT = true;
							fontStyle += 2;
						}
					}
					
					i++;
				}
			}
				
			//check for underline text
			var isUT = false;
			
			if (m != null)
			{
				var i = 0;
				
				while ((!isUT) && (i < m.length))
				{
					var currM = m[i];
					
					if (currM.n == 'u')
					{
						if (currM.v != null && currM.v)
						{
							isUT = true;
							fontStyle += 4;
						}
					}
					
					i++;
				}
			}
			
			if (fontStyle > 0)
			{
				return 'fontStyle=' + fontStyle + ';';
			}
		}
		
		return '';
	}
	
	function getTextAlignment(properties)
	{
		var m = getTextM(properties);
		
		//adds text alignment
		if (m != null)
		{
			var i = 0;
			
			while (i < m.length)
			{
				var currM = m[i];
				
				if (currM.n == 'a')
				{
					if (currM.v != null)
					{
						return 'align=' + currM.v + ';';
					}
				}
				
				i++;
			}
		}
		
		return '';
	}
	
	function getTextLeftSpacing(properties)
	{
		var m = getTextM(properties);
		
		if (m != null)
		{
			//adds left spacing
			var i = 0;
			
			while (i < m.length)
			{
				var currM = m[i];
				
				if (currM.v != null)
				{
					if (currM.n == 'il')
					{
						return 'spacingLeft=' + currM.v * 0.6 + ';';
					}
					else
					{
						var align = getTextAlignment(properties);
					
						if (currM.n == 's' && align != 'align=center;' && align != '')
						{
							// TODO: Fix condition to apply this only when necessary
							//return 'spacingLeft=' + currM.v * 0.6 + ';';
						}
					}
				}
					
				i++;
			}
		}
		
		return '';
	}

	function getTextRightSpacing(properties)
	{
		//adds right spacing
		var isIR = false;
		var m = getTextM(properties);
		
		if (m != null)
		{
			var i = 0;
			
			while ((!isIR) && (i < m.length))
			{
				var currM = m[i];
				
				if (currM.n == 'ir')
				{
					if (currM.v != null)
					{
						isIR = true;
						
						return 'spacingRight=' + currM.v + ';';
					}
				}
				
				i++;
			}
		}
		
		return '';
	}
	
	function getTextTopSpacing(properties)
	{
		//adds top spacing
		var isMT = false;
		var m = getTextM(properties);
		
		if (m != null)
		{
			var i = 0;
			
			while ((!isMT) && (i < m.length))
			{
				var currM = m[i];
				
				if (currM.n == 'mt')
				{
					if (currM.v != null)
					{
						isMT = true;
						return 'spacingTop=' + currM.v + ';';
					}
				}
				
				i++;
			}
		}

		return '';
	}
	
	function getTextBottomSpacing(properties)
	{
		//adds bottom spacing
		var isMB = false;
		var m = getTextM(properties);
		
		if (m != null)
		{
			var i = 0;
			
			while ((!isMB) && (i < m.length))
			{
				var currM = m[i];
				
				if (currM.n == 'mb')
				{
					if (currM.v != null)
					{
						isMB = true;
						return 'spacingBottom=' + currM.v + ';';
					}
				}
				
				i++;
			}
		}
		
		return '';
	}
	
	function getTextGlobalSpacing(properties)
	{
		//adds global spacing
		if (typeof properties.InsetMargin === 'number')
		{
				return 'spacing=' + parseInt(properties.InsetMargin) + ';';
		}
	
		return '';
	}
	
	function getTextVerticalAlignment(properties)
	{
		// adds text vertical alignment
		if (properties.Text_VAlign != null)
		{
			if (typeof properties.Text_VAlign === 'string')
			{
				return 'verticalAlign=' + properties.Text_VAlign + ';';
			}
		}
		
		return createStyle(mxConstants.STYLE_VERTICAL_ALIGN, properties.TextVAlign, 'middle');
	}
	
	function getStrokeColor(properties, action)
	{
		if (mxUtils.indexOf(hardStroke, action.Class) < 0)
		{
			if (properties.LineWidth == 0)
			{
				return mxConstants.STYLE_STROKECOLOR + '=none;';
			}
			else
			{
				return createStyle(mxConstants.STYLE_STROKECOLOR, properties.LineColor.substring(0, 7), '#000000');
			}
		}
		else
		{
			if (action.Class.substring(0,4) == 'Venn')
			{
				return createStyle(mxConstants.STYLE_STROKECOLOR, properties.FillColor.substring(0, 7), '#FFFFFF');
			}
		}
		
		return '';
	}

	function getOpacity(properties, action)
	{
		var style = '';
		var incl = mxUtils.indexOf(hardOpacity, action.Class) >= 0;
		
		if (!incl)
		{
			style += createStyle(mxConstants.STYLE_OPACITY, properties.Opacity, '100');
		}

		if (typeof properties.LineColor === 'string' && !incl)
		{
			if (properties.LineColor.length > 7)
			{
				var sOpac = "0x" + properties.LineColor.substring(properties.LineColor.length - 2, properties.LineColor.length);
				style += 'strokeOpacity=' + Math.round(parseInt(sOpac) / 2.55) + ';';
			}
		}
		
		if (typeof properties.FillColor === 'string' && !incl)
		{
			if (properties.FillColor.length > 7)
			{
				var fOpac = "0x" + properties.FillColor.substring(properties.FillColor.length - 2, properties.FillColor.length);
				style += 'fillOpacity=' + Math.round(parseInt(fOpac) / 2.55) + ';';
			}
		}
		
		return style;
	}

	function getRounded(properties, action, cell)
	{
		if (!cell.edge)
		{
			//rounding check
			if (properties.Rounding != null && mxUtils.indexOf(hardRound, action.Class) < 0)
			{
				if (properties.Rounding > 0)
				{
					return 'rounded=1;absoluteArcSize=1;arcSize=' + properties.Rounding * 0.6 + ';';
				}
			}
			else if (properties.Rounding == null && mxUtils.indexOf(hardDefRound, action.Class) >= 0)
			{
				return 'rounded=1;absoluteArcSize=1;arcSize=8;';
			}
		}
		
		return '';
	}

	function getRotation(properties, action, cell)
	{
		// Converts rotation
		if (properties.Rotation != null)
		{
			// KNOWN: TextRotation currently ignored
			var deg = mxUtils.toDegree(parseFloat(properties.Rotation));
			
			// Fixes the case for horizontal swimlanes where we use horizontal=0
			// and Lucid uses rotation
			
			if (action.Class == 'AdvancedSwimLaneBlockRotated')
			{
				deg += 90;
				cell.geometry.rotate90();
			}
			else if (mxUtils.indexOf(rccw, action.Class) >= 0)
			{
				deg -= 90;
				cell.geometry.rotate90();
				cell.geometry.rotate90();
				cell.geometry.rotate90();
			}
			else if (mxUtils.indexOf(rcw2, action.Class) >= 0)
			{
				deg += 180;
				cell.geometry.rotate90();
				cell.geometry.rotate90();
			}
			
			if (deg != 0)
			{
				return 'rotation=' + deg + ';';
			}
		}
		
		return '';
	}
	
	function getFlipH(properties)
	{
		if (properties.FlipX)
		{
			return 'flipH=1;';
		}
		
		return '';
	}
	
	function getFlipV(properties)
	{
		if (properties.FlipY)
		{
			return 'flipV=1;';
		}
		
		return '';
	}

	function getShadow(properties)
	{
		// Shadow is mapped simple shadow style
		if (properties.Shadow != null)
		{
			return mxConstants.STYLE_SHADOW + '=1;';
		}
		
		return '';
	}

	function getFillColor(properties, action)
	{
		// Gradients and fill color
		if (properties.FillColor != null)
		{
			if (mxUtils.indexOf(hardFill, action.Class) < 0)
			{
				if (typeof properties.FillColor === 'object')
				{
					if (properties.FillColor.cs != null && properties.FillColor.cs.length > 1)
					{
						return createStyle(mxConstants.STYLE_FILLCOLOR, properties.FillColor.cs[0].c.substring(0, 7)) + createStyle(mxConstants.STYLE_GRADIENTCOLOR, properties.FillColor.cs[1].c.substring(0, 7));
					}
				}
				else if (typeof properties.FillColor === 'string')
				{
					return createStyle(mxConstants.STYLE_FILLCOLOR, properties.FillColor.substring(0, 7), '#FFFFFF');
				}
				else
				{
					return createStyle(mxConstants.STYLE_FILLCOLOR, 'none');
				}
			}
		}
		
		return '';
	}
	
	function getStrokeStyle(properties)
	{
		// Stroke style
		if (properties.StrokeStyle == 'dashed')
		{
			return 'dashed=1;';
		}
		else if (properties.StrokeStyle == 'dotted')
		{
			return 'dashed=1;dashPattern=1 4;';
		}
		else if (properties.StrokeStyle == 'dashdot')
		{
			return 'dashed=1;dashPattern=10 5 1 5;';
		}
		else if (properties.StrokeStyle == 'dotdotdot')
		{
			return 'dashed=1;dashPattern=1 1;';
		}
		
		return '';
	}
	
	function getStrokeWidth(properties)
	{
		return createStyle(mxConstants.STYLE_STROKEWIDTH, parseFloat(properties.LineWidth) * scale, '1');
	}
	
	function getImage(properties, action)
	{
		// Converts images
		if (action.Class == 'ImageSearchBlock2')
		{
			return 'image=' + properties.URL + ';';
		}
		
		return '';
	}
	
	function updateCell(cell, obj)
	{
		var a = getAction(obj);
		
		if (a != null)
		{
			var s = styleMap[a.Class];
			
			if (s != null)
			{
				cell.style += s + ';';
			}
//			else if (a.Class != null)
			{
//				console.log('no mapping', a.Class);
			}
			
			var p = (a.Properties != null) ? a.Properties : a;

			if (p != null)
			{
				//adds label
				cell.value = convertText(p);
				
				
				cell.style += 	getFontSize(p) +
								getFontColor(p) + 
								getFontStyle(p) +
								getTextAlignment(p, cell) + 
								getTextLeftSpacing(p) +
								getTextRightSpacing(p) + 
								getTextTopSpacing(p) +
								getTextBottomSpacing(p) + 
								getTextGlobalSpacing(p) +
								getTextVerticalAlignment(p) + 
								getStrokeColor(p, a) + 
								getOpacity(p, a) + 
								getRounded(p, a, cell) +
								getRotation(p, a, cell) + 
								getFlipH(p) + 
								getFlipV(p) +
								getShadow(p) +
								getFillColor(p, a)  +
								getStrokeStyle(p) + 
								getStrokeWidth(p) + 
								getImage(p, a);
				
				// Edge style
				if (cell.edge)
				{
					if (p.Rounding != null)
					{
						cell.style += 'rounded=1;arcSize=' + p.Rounding + ';';
					}
					else
					{
						cell.style += 'rounded=0;';
					}
					
					if (p.Shape != 'diagonal')
					{
						if (p.ElbowPoints != null)
						{
							cell.geometry.points = [];
							
							for (var i = 0; i < p.ElbowPoints.length; i++)
							{
								cell.geometry.points.push(new mxPoint(Math.round(p.ElbowPoints[i].x * scale + dx),
										Math.round(p.ElbowPoints[i].y * scale + dy)));
							}
						}
						else if (p.Shape == 'elbow')
						{
							if (p.Endpoint1.Block != null && p.Endpoint1.Block != null)
							{
								cell.style += 'edgeStyle=orthogonalEdgeStyle;';
							}
							else
							{
								cell.style += 'edgeStyle=elbowEdgeStyle;';
							}
						}
						else if (p.Endpoint1.Block != null && p.Endpoint1.Block != null)
						{
							cell.style += 'edgeStyle=orthogonalEdgeStyle;';
	
							if (p.Shape == 'curve')
							{
								cell.style += 'curved=1;';
							}
						}
					}

					if (p.Endpoint1.Style != null)
					{
						cell.style += 'startArrow=' + edgeStyleMap[p.Endpoint1.Style] + ';';
					}
					
					if (p.Endpoint2.Style != null)
					{
						cell.style += 'endArrow=' + edgeStyleMap[p.Endpoint2.Style].replace(/startSize/g, 'endSize') + ';';
					}
					
					// Anchor points and arrows
					// TODO: Convert waypoints, elbowPoints
					updateEndpoint(cell, p.Endpoint1, true);
					updateEndpoint(cell, p.Endpoint2, false);
				}
			}
		}
	};
	
	function createVertex(obj)
	{
		var p = getAction(obj).Properties;
		var b = p.BoundingBox;

		if (obj.Class != null && obj.Class.substring(0, 3) === "AWS")
		{
			b.h = b.h - 20;
		}
		
		v = new mxCell('', new mxGeometry(Math.round(b.x * scale + dx), Math.round(b.y * scale + dy),
				Math.round(b.w * scale), Math.round(b.h * scale)), vertexStyle);
	    v.vertex = true;
	    updateCell(v, obj);

	    return v;
	};
	
	function createEdge(obj)
	{
		var e = new mxCell('', new mxGeometry(0, 0, 100, 100), edgeStyle);
		e.geometry.relative = true;
		e.edge = true;
		updateCell(e, obj);
		
		// Adds text labels
		var a = getAction(obj);
		var p = a.Properties;
		var ta = (p != null) ? p.TextAreas : obj.TextAreas;
		
		if (ta != null)
		{
			var count = 0;
			
			while (ta['t' + count] != null)
			{
				var tmp = ta['t' + count];
				e = insertLabel(tmp, e);
				count++;
			}
			
			var count = 1;
			
			while (ta['m' + count] != null)
			{
				var tmp = ta['m' + count];
				e = insertLabel(tmp, e, obj);
				count++;
			}

			if (ta.Text != null)
			{
				e = insertLabel(ta, e, obj);
			}

			var ta = (p != null) ? p.TextAreas : obj.TextAreas;
			
			if (ta.Message != null)
			{
				e = insertLabel(ta.Message, e, obj);
			}
		}
		
		return e;
	}

	function insertLabel(textArea, e, obj)
	{
		var x = (parseFloat(textArea.Location) - 0.5) * 2;
		var lab = new mxCell(convertText(textArea), new mxGeometry(x, 0, 0, 0), labelStyle);
		lab.geometry.relative = true
		lab.vertex = true;
		e.insert(lab);
		
		return e;
	};
	
	function createStyle(key, prop, defaultValue, fn)
	{
		if (prop != null && fn != null)
		{
			prop = fn(prop);
		}
		
		if (prop != null && prop != defaultValue)
		{
			return key + '=' + prop + ';';
		}
		
		return '';
	};

	function updateEndpoint(cell, endpoint, source)
	{
		if (endpoint != null)
		{
			if (endpoint.LinkX != null && endpoint.LinkY != null)
			{
				cell.style += ((source) ? 'exitX' : 'entryX') + '=' + endpoint.LinkX + ';' +
					((source) ? 'exitY' : 'entryY') + '=' + endpoint.LinkY + ';' +
					((source) ? 'exitPerimeter' : 'entryPerimeter') + '=1;';
			}
		}
	};

	var hideObj = function(key, groups, hidden)
	{
		if (mxUtils.indexOf(hidden, key) < 0)
		{
			hidden.push(key);
		}

		if (key in groups)
		{
			var obj = groups[key];
			obj.id = key;
			
			if (obj.Members != null)
			{
				for (var key2 in obj.Members)
				{
					hidden = hideObj(key2, groups, hidden);
				}
			}
		
		}
		
		return hidden;
	};
	
	function importLucidPage(graph, g, dx, dy, crop, noSelection)
	{
		graph.getModel().beginUpdate();
		try
		{
			var select = [];
			var lookup = {};
			var queue = [];

			//collect IDs that are part of groups and hidden
			var hidden = [];
			var i = 0;
			
			if (g.Groups != null)
			{
				for (var key in g.Groups)
				{
					var obj = g.Groups[key];
					obj.id = key;
					
					if (obj.Hidden == true && obj.Members != null)
					{
						if (mxUtils.indexOf(hidden, key) < 0)
						{
							hidden.push(key);
						}

						for (var key2 in obj.Members)
						{
							hidden = hideObj(key2, g.Groups, hidden);
						}
					}
				}
			}
			
			// Vertices first (populates lookup table for connecting edges)
			if (g.Blocks != null)
			{
				for (var key in g.Blocks)
				{
					var obj = g.Blocks[key];
					obj.id = key;
					
					if (mxUtils.indexOf(hidden, key) < 0)
					{
						var created = false;
						
						if (styleMap[obj.Class] != null)
						{
							if (styleMap[obj.Class] == 'mxCompositeShape')
							{
								lookup[obj.id] = addCompositeShape(obj, select, graph);
								queue.push(obj);
								created = true;
							}
						}
						
						if (!created)
						{
						    lookup[obj.id] = createVertex(obj);
							queue.push(obj);
						}
					}
				}
			}
			else
			{
				for (var i = 0; i < g.Objects.length; i++)
				{
					var obj = g.Objects[i];
					
					if (obj.Action != null && styleMap[obj.Action.Class] == 'mxCompositeShape')
					{
						lookup[obj.id] = addCompositeShape(obj, select, graph);
					}
					else if (obj.IsBlock && obj.Action != null && obj.Action.Properties != null)
					{
					    lookup[obj.id] = createVertex(obj);
					}
					
					queue.push(obj);
				}
			}
				
			// Sorts all cells by ZOrder
			queue.sort(function(a, b)
			{
				a = getAction(a);
				b = getAction(b);
				
				if (a.Properties != null)
				{
					if (b.Properties != null)
					{
						return a.Properties.ZOrder - b.Properties.ZOrder;
					}
				}
				
				return 0;
			});
			
			function addLine(obj, p)
			{
				var src = (p.Endpoint1.Block != null) ? lookup[p.Endpoint1.Block] : null;
				var trg = (p.Endpoint2.Block != null) ? lookup[p.Endpoint2.Block] : null;
				var e = createEdge(obj);
				
				if (src == null && p.Endpoint1 != null)
				{
					e.geometry.setTerminalPoint(new mxPoint(Math.round(p.Endpoint1.x * scale),
						Math.round(p.Endpoint1.y * scale)), true);
				}
				
				if (trg == null && p.Endpoint2 != null)
				{
					e.geometry.setTerminalPoint(new mxPoint(Math.round(p.Endpoint2.x * scale),
						Math.round(p.Endpoint2.y * scale)), false);
				}
				
				select.push(graph.addCell(e, null, null, src, trg));
			};
			
			// Inserts cells in ZOrder and connects edges via lookup
			for (var i = 0; i < queue.length; i++)
			{
				var obj = queue[i];
				var v = lookup[obj.id];
				
				if (v != null)
				{
					select.push(graph.addCell(v));
				}
				else if (obj.IsLine && obj.Action != null && obj.Action.Properties != null)
				{
					var p = obj.Action.Properties;
					addLine(obj, p);
				}
			}
			
			if (g.Lines != null)
			{
				for (var key in g.Lines)
				{
					if (mxUtils.indexOf(hidden, key) < 0)
					{
						var obj = g.Lines[key];
					    addLine(obj, obj);
					}
				}
			}
			
			if (crop && dx != null && dy != null)
			{
				if (graph.isGridEnabled())
				{
					dx = graph.snap(dx);
					dy = graph.snap(dy);
				}
				
				var bounds = graph.getBoundingBoxFromGeometry(select, true);
				
				if (bounds != null)
				{
					graph.moveCells(select, dx - bounds.x, dy - bounds.y);
				}
			}

			if (!noSelection)
				graph.setSelectionCells(select);
		}
		finally
		{
			graph.getModel().endUpdate();
		}
		
	};

	function createGraph()
	{
		//TODO Set the graph defaults
		var graph = new Graph();
        graph.setExtendParents(false);
        graph.setExtendParentsOnAdd(false);
        graph.setConstrainChildren(false);
        graph.setHtmlLabels(true);
        graph.getModel().maintainEdgeParent = false;
        return graph;
	};
	
	LucidImporter.importState = function(state)
	{
		var xml = ['<?xml version=\"1.0\" encoding=\"UTF-8\"?>', '<mxfile>'];
		
		// Extracts and sorts all pages
		var pages = [];

		if (state.state != null)
		{
			state = JSON.parse(state.state);
			
			for (var id in state.Pages)
			{
				pages.push(state.Pages[id]);
			}
			
			pages.sort(function(a, b)
			{
			    if (a.Properties.Order < b.Properties.Order)
			    {
			    	return -1;
			    }
			    else if (a.Properties.Order > b.Properties.Order)
			    {
			    	return 1;
			    }
			    else
			    {
			    	return 0;
			    }
			});
		}
		else
		{
			pages.push(state);
		}
		
		var graph = createGraph();
		var codec = new mxCodec();
		
		for (var i = 0; i < pages.length; i++)
		{
            xml.push('<diagram');
            
            if (pages[i].Properties != null && pages[i].Properties.Title != null)
            {
            	xml.push(' name="' + mxUtils.htmlEntities(pages[i].Properties.Title) + '"');
            }
            
			importLucidPage(graph, pages[i], null, null, null, true);
            var node = codec.encode(graph.getModel());
            graph.getModel().clear();

            xml.push('>' + Graph.prototype.compress(mxUtils.getXml(node)) + '</diagram>');
		}
		
		xml.push('</mxfile>');
		
		return xml.join('');
	};

	function addRouterEdge(x, y, edge, select, graph, cells, v, cell)
	{
	   	var dummy = new mxCell('', new mxGeometry(x, y, 0, 0), 'strokeColor=none;fillColor=none;');
	   	dummy.vertex = true;
	   	v.insert(dummy);
	   	cells = [dummy];
	   	
		var e = sb.cloneCell(edge);
		cell.insertEdge(e, false);
		dummy.insertEdge(e, true);
		cells.push(e);
		select.push(graph.addCell(e, null, null, null, null));
	};
   	
	function addFloatingEdge(x1, y1, x2, y2, edge, select, graph, cells, v)
	{
	   	var dummy1 = new mxCell('', new mxGeometry(x1, y1, 0, 0), 'strokeColor=none;fillColor=none;');
	   	dummy1.vertex = true;
	   	v.insert(dummy1);
	   	cells = [dummy1];
	   	
	   	var dummy2 = new mxCell('', new mxGeometry(x2, y2, 0, 0), 'strokeColor=none;fillColor=none;');
	   	dummy2.vertex = true;
	   	v.insert(dummy2);
	   	cells = [dummy2];
	   	
		var e = sb.cloneCell(edge);
		dummy1.insertEdge(e, true);
		dummy2.insertEdge(e, false);
		cells.push(e);
		select.push(graph.addCell(e, null, null, null, null));
	};
   	
	function addCompositeShape(obj, select, graph)
	{
		var a = getAction(obj);
		var p = a.Properties;
		var b = p.BoundingBox;

		var w = Math.round(b.w * scale);
		var h = Math.round(b.h * scale);
		var x = Math.round(b.x * scale + dx);
		var y = Math.round(b.y * scale + dy);
		
		v = new mxCell('', new mxGeometry(x, y, w, h), vertexStyle);
	    v.vertex = true;

	    var cls = (obj.Class != null) ? obj.Class : (a != null) ? a.Class : null;
	    
		switch (cls)
		{
			case 'BraceNoteBlock' :
			case 'UI2BraceNoteBlock' :
								
				var isRightBrace = false;
				
				if (p.BraceDirection != null)
				{
					if (p.BraceDirection == 'Right')
					{
						isRightBrace = true;
					}				
				}
				
				var brace = null;
				var label = null;
				
				if (isRightBrace)
				{
					brace = new mxCell('', new mxGeometry(w - h * 0.125, 0,	h * 0.125, h), 'shape=curlyBracket;rounded=1;');
					label = new mxCell('', new mxGeometry(0, 0,	w - h * 0.125, h), 'strokeColor=none;fillColor=none;');
				}
				else
				{
					brace = new mxCell('', new mxGeometry(0, 0,	h * 0.125, h), 'shape=curlyBracket;rounded=1;flipH=1;');
					label = new mxCell('', new mxGeometry(h * 0.125, 0,	w - h * 0.125, h), 'strokeColor=none;fillColor=none;');
				}
				
				v.style = "strokeColor=none;fillColor=none;"
				v.style += 	getRotation(p, a, v); 
					
				brace.vertex = true;
				v.insert(brace);

				brace.style += 	getStrokeColor(p, a) + 
								getOpacity(p, a) + 
								getShadow(p) +
								getStrokeStyle(p) + 
								getStrokeWidth(p); 


				label.vertex = true;
				label.value = convertText(p);
				v.insert(label);
				
				label.style += 	getFontSize(p) +
								getFontColor(p) + 
								getFontStyle(p) +
								getTextAlignment(p, label) + 
								getTextLeftSpacing(p) +
								getTextRightSpacing(p) + 
								getTextTopSpacing(p) +
								getTextBottomSpacing(p) + 
								getTextGlobalSpacing(p) +
								getTextVerticalAlignment(p); 
				break;
				
			case 'AdvancedSwimLaneBlockRotated' :
			case 'AdvancedSwimLaneBlock' :
				var lanesNum = 0;
				
				if (p.Lanes != null)
				{
					lanesNum = p.Lanes.length;
				}

				v.style = "strokeColor=none;fillColor=none;"
				var totalOffset = 0; //relative
				var lane = new Array();
				
				for (var i = 0; i < lanesNum; i++)
				{
					var currOffset = parseFloat(p.Lanes[i].p);
					
					lane.push(new mxCell('', new mxGeometry(w * totalOffset, 0,	w * currOffset, h), 'shape=swimlane;startSize=25;'));
					
					lane[i].vertex = true;
					v.insert(lane[i]);
					lane[i].value = convertText(p["Lane_" + i]);
					lane[i].style += 	getFontSize(p["Lane_" + i]) +
									getFontColor(p["Lane_" + i]) + 
									getFontStyle(p["Lane_" + i]) +
									getTextAlignment(p["Lane_" + i], lane[i]) + 
									getTextLeftSpacing(p["Lane_" + i]) +
									getTextRightSpacing(p["Lane_" + i]) + 
									getTextTopSpacing(p["Lane_" + i]) +
									getTextBottomSpacing(p["Lane_" + i]) + 
									getTextGlobalSpacing(p["Lane_" + i]) +
									getTextVerticalAlignment(p["Lane_" + i]) + 
									getStrokeColor(p, a) + 
									getOpacity(p, a) + 
									getRounded(p, a, lane[i]) +
									getRotation(p, a, lane[i]) + 
									getFlipH(p) + 
									getFlipV(p) +
									getShadow(p) +
									getFillColor(p, a)  +
									getStrokeStyle(p) + 
									getStrokeWidth(p); 

					totalOffset += currOffset;
				}
				
				break;
				
			case 'AndroidDevice' :
				if (p.AndroidDeviceName != null)
				{
					
					v.style = "fillColor=#000000;strokeColor=#000000;";
					var background = null;
					var keyboard = null;
					var statusBar = null;
					
					if (p.AndroidDeviceName == 'Tablet' || p.AndroidDeviceName == 'Mini Tablet')
					{
						v.style += "shape=mxgraph.android.tab2;"
						background = new mxCell('', new mxGeometry(w * 0.112, h * 0.077, w * 0.77, h * 0.85), '');
						
						if (p.KeyboardShown)
						{
							keyboard = new mxCell('', new mxGeometry(w * 0.112, h * 0.727, w * 0.77, h * 0.2), 'shape=mxgraph.android.keyboard;');
						}

						if (!p.FullScreen)
						{
							statusBar = new mxCell('', new mxGeometry(w * 0.112, h * 0.077, w * 0.77, h * 0.03), 'shape=mxgraph.android.statusBar;strokeColor=#33b5e5;fillColor=#000000;fontColor=#33b5e5;fontSize=' + h * 0.015 + ';');
						}
					}
					else if (p.AndroidDeviceName == 'Large Phone' || p.AndroidDeviceName == 'Phone')
					{
						v.style += "shape=mxgraph.android.phone2;"
						background = new mxCell('', new mxGeometry(w * 0.04, h * 0.092, w * 0.92, h * 0.816), '');
						
						if (p.KeyboardShown)
						{
							keyboard = new mxCell('', new mxGeometry(w * 0.04, h * 0.708, w * 0.92, h * 0.2), 'shape=mxgraph.android.keyboard;');
						}
						
						if (!p.FullScreen)
						{
							statusBar = new mxCell('', new mxGeometry(w * 0.04, h * 0.092, w * 0.92, h * 0.03), 'shape=mxgraph.android.statusBar;strokeColor=#33b5e5;fillColor=#000000;fontColor=#33b5e5;fontSize=' + h * 0.015 + ';');
						}
					}
					
					background.vertex = true;
					v.insert(background);
					
					if (p.Scheme == "Dark")
					{
						background.style += "fillColor=#111111;"
					}
					else if (p.Scheme == "Light")
					{
						background.style += "fillColor=#ffffff;"
					}
					
					if (keyboard != null)
					{
						keyboard.vertex = true;
						v.insert(keyboard);
					}

					if (statusBar != null)
					{
						statusBar.vertex = true;
						v.insert(statusBar);
					}
				}
				
				break;
				
			case 'AndroidAlertDialog' :
				var dialog = new mxCell('', new mxGeometry(0, 0, w, 30), 'strokeColor=none;fillColor=none;spacingLeft=9;');
				dialog.vertex = true;
				v.insert(dialog);
				var line = new mxCell('', new mxGeometry(0, 25, w, 10), 'shape=line;strokeColor=#33B5E5;');
				line.vertex = true;
				v.insert(line);
				var dialogText = new mxCell('', new mxGeometry(0, 30, w, h - 30), 'strokeColor=none;fillColor=none;verticalAlign=top;');
				dialogText.vertex = true;
				v.insert(dialogText);
				var cancelButton = new mxCell('', new mxGeometry(0, h - 25, w * 0.5, 25), 'fillColor=none;');
				cancelButton.vertex = true;
				v.insert(cancelButton);
				var okButton = new mxCell('', new mxGeometry(w * 0.5, h - 25, w * 0.5, 25), 'fillColor=none;');
				okButton.vertex = true;
				v.insert(okButton);
				dialog.value = convertText(p.DialogTitle);
				dialog.style += getLabelStyle(p.DialogTitle);
				dialogText.value = convertText(p.DialogText);
				dialogText.style += getLabelStyle(p.DialogText);
				cancelButton.value = convertText(p.Button_0);
				cancelButton.style += getLabelStyle(p.Button_0);
				okButton.value = convertText(p.Button_1);
				okButton.style += getLabelStyle(p.Button_1);

				if (p.Scheme == 'Dark')
				{
					v.style += 'strokeColor=#353535;fillColor=#282828;shadow=1;';
					cancelButton.style += 'strokeColor=#353535;';
					okButton.style += 'strokeColor=#353535;';
				}
				else
				{
					v.style += 'strokeColor=none;fillColor=#ffffff;shadow=1;';
					cancelButton.style += 'strokeColor=#E2E2E2;';
					okButton.style += 'strokeColor=#E2E2E2;';
				}
				
				break;
				
			case 'AndroidDateDialog' :
			case 'AndroidTimeDialog' :
				var dialog = new mxCell('', new mxGeometry(0, 0, w, 30), 'strokeColor=none;fillColor=none;spacingLeft=9;');
				dialog.vertex = true;
				v.insert(dialog);
				dialog.value = convertText(p.DialogTitle);
				dialog.style += getLabelStyle(p.DialogTitle);
				var line = new mxCell('', new mxGeometry(0, 25, w, 10), 'shape=line;strokeColor=#33B5E5;');
				line.vertex = true;
				v.insert(line);
				var cancelButton = new mxCell('', new mxGeometry(0, h - 25, w * 0.5, 25), 'fillColor=none;');
				cancelButton.vertex = true;
				v.insert(cancelButton);
				cancelButton.value = convertText(p.Button_0);
				cancelButton.style += getLabelStyle(p.Button_0);
				var okButton = new mxCell('', new mxGeometry(w * 0.5, h - 25, w * 0.5, 25), 'fillColor=none;');
				okButton.vertex = true;
				v.insert(okButton);
				okButton.value = convertText(p.Button_1);
				okButton.style += getLabelStyle(p.Button_1);

				var triangle1 = new mxCell('', new mxGeometry(w * 0.5 - 4, 41, 8, 4), 'shape=triangle;direction=north;');
				triangle1.vertex = true;
				v.insert(triangle1);
				var triangle2 = new mxCell('', new mxGeometry(w * 0.25 - 4, 41, 8, 4), 'shape=triangle;direction=north;');
				triangle2.vertex = true;
				v.insert(triangle2);
				var triangle3 = new mxCell('', new mxGeometry(w * 0.75 - 4, 41, 8, 4), 'shape=triangle;direction=north;');
				triangle3.vertex = true;
				v.insert(triangle3);

				var prevDate1 = new mxCell('', new mxGeometry(w * 0.375, 50, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				prevDate1.vertex = true;
				v.insert(prevDate1);
				prevDate1.value = convertText(p.Label_1);
				prevDate1.style += getLabelStyle(p.Label_1);
				var prevDate2 = new mxCell('', new mxGeometry(w * 0.125, 50, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				prevDate2.vertex = true;
				v.insert(prevDate2);
				prevDate2.value = convertText(p.Label_0);
				prevDate2.style += getLabelStyle(p.Label_0);

				var prevDate3 = null;
				
				if (obj.Class == 'AndroidDateDialog')
				{
					prevDate3 = new mxCell('', new mxGeometry(w * 0.625, 50, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
					prevDate3.vertex = true;
					v.insert(prevDate3);
					prevDate3.value = convertText(p.Label_2);
					prevDate3.style += getLabelStyle(p.Label_2);
				}

				var line1 = new mxCell('', new mxGeometry(w * 0.43, 60, w * 0.14, 10), 'shape=line;strokeColor=#33B5E5;');
				line1.vertex = true;
				v.insert(line1);
				var line2 = new mxCell('', new mxGeometry(w * 0.18, 60, w * 0.14, 10), 'shape=line;strokeColor=#33B5E5;');
				line2.vertex = true;
				v.insert(line2);
				var line3 = new mxCell('', new mxGeometry(w * 0.68, 60, w * 0.14, 10), 'shape=line;strokeColor=#33B5E5;');
				line3.vertex = true;
				v.insert(line3);

				var date1 = new mxCell('', new mxGeometry(w * 0.375, 65, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				date1.vertex = true;
				v.insert(date1);
				date1.value = convertText(p.Label_4);
				date1.style += getLabelStyle(p.Label_4);
				
				var sep = null;
				
				if (obj.Class == 'AndroidTimeDialog')
				{
					sep = new mxCell('', new mxGeometry(w * 0.3, 65, w * 0.1, 15), 'strokeColor=none;fillColor=none;');
					sep.vertex = true;
					v.insert(sep);
					sep.value = convertText(p.Label_Colon);
					sep.style += getLabelStyle(p.Label_Colon);
				}
				
				var date2 = new mxCell('', new mxGeometry(w * 0.125, 65, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				date2.vertex = true;
				v.insert(date2);
				date2.value = convertText(p.Label_3);
				date2.style += getLabelStyle(p.Label_3);
				var date3 = new mxCell('', new mxGeometry(w * 0.625, 65, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				date3.vertex = true;
				v.insert(date3);
				date3.value = convertText(p.Label_5);
				date3.style += getLabelStyle(p.Label_5);

				var line4 = new mxCell('', new mxGeometry(w * 0.43, 75, w * 0.14, 10), 'shape=line;strokeColor=#33B5E5;');
				line4.vertex = true;
				v.insert(line4);
				var line5 = new mxCell('', new mxGeometry(w * 0.18, 75, w * 0.14, 10), 'shape=line;strokeColor=#33B5E5;');
				line5.vertex = true;
				v.insert(line5);
				var line6 = new mxCell('', new mxGeometry(w * 0.68, 75, w * 0.14, 10), 'shape=line;strokeColor=#33B5E5;');
				line6.vertex = true;
				v.insert(line6);

				var nextDate1 = new mxCell('', new mxGeometry(w * 0.375, 80, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				nextDate1.vertex = true;
				v.insert(nextDate1);
				nextDate1.value = convertText(p.Label_7);
				nextDate1.style += getLabelStyle(p.Label_7);
				var nextDate2 = new mxCell('', new mxGeometry(w * 0.125, 80, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				nextDate2.vertex = true;
				v.insert(nextDate2);
				nextDate2.value = convertText(p.Label_6);
				nextDate2.style += getLabelStyle(p.Label_6);
				var nextDate3 = new mxCell('', new mxGeometry(w * 0.625, 80, w * 0.2, 15), 'strokeColor=none;fillColor=none;');
				nextDate3.vertex = true;
				v.insert(nextDate3);
				nextDate3.value = convertText(p.Label_8);
				nextDate3.style += getLabelStyle(p.Label_8);
				
				var triangle4 = new mxCell('', new mxGeometry(w * 0.5 - 4, 99, 8, 4), 'shape=triangle;direction=south;');
				triangle4.vertex = true;
				v.insert(triangle4);
				var triangle5 = new mxCell('', new mxGeometry(w * 0.25 - 4, 99, 8, 4), 'shape=triangle;direction=south;');
				triangle5.vertex = true;
				v.insert(triangle5);
				var triangle6 = new mxCell('', new mxGeometry(w * 0.75 - 4, 99, 8, 4), 'shape=triangle;direction=south;');
				triangle6.vertex = true;
				v.insert(triangle6);

				if (p.Scheme == 'Dark')
				{
					v.style += 'strokeColor=#353535;fillColor=#282828;shadow=1;';
					cancelButton.style += 'strokeColor=#353535;';
					okButton.style += 'strokeColor=#353535;';
					triangle1.style += 'strokeColor=none;fillColor=#7E7E7E;';
					triangle2.style += 'strokeColor=none;fillColor=#7E7E7E;';
					triangle3.style += 'strokeColor=none;fillColor=#7E7E7E;';
					triangle4.style += 'strokeColor=none;fillColor=#7E7E7E;';
					triangle5.style += 'strokeColor=none;fillColor=#7E7E7E;';
					triangle6.style += 'strokeColor=none;fillColor=#7E7E7E;';
				}
				else
				{
					v.style += 'strokeColor=none;fillColor=#ffffff;shadow=1;';
					cancelButton.style += 'strokeColor=#E2E2E2;';
					okButton.style += 'strokeColor=#E2E2E2;';
					triangle1.style += 'strokeColor=none;fillColor=#939393;';
					triangle2.style += 'strokeColor=none;fillColor=#939393;';
					triangle3.style += 'strokeColor=none;fillColor=#939393;';
					triangle4.style += 'strokeColor=none;fillColor=#939393;';
					triangle5.style += 'strokeColor=none;fillColor=#939393;';
					triangle6.style += 'strokeColor=none;fillColor=#939393;';
				}
				
				break;
				
			case 'AndroidListItems' :
				var itemFullH = h;
				var startH = 0;
				
				if (p.ShowHeader)
				{
					startH = 8;
					
					var header = new mxCell('', new mxGeometry(0, 0, w, startH), 'strokeColor=none;fillColor=none;');
					header.vertex = true;
					v.insert(header);
					header.value = convertText(p.Header);
					header.style += getLabelStyle(p.Header);
					
					itemFullH -= startH;
					
					var lineH = new mxCell('', new mxGeometry(0, startH - 2, w, 4), 'shape=line;strokeColor=#999999;');
					lineH.vertex = true;
					v.insert(lineH);

				}
				
				var numItems = parseInt(p.Items);
				
				if (numItems > 0)
				{
					itemFullH = itemFullH / numItems;
				}
				
				var item = new Array();
				var line = new Array();
				
				for (var i = 0; i < numItems; i++)
				{
					item[i] = new mxCell('', new mxGeometry(0, startH + i * itemFullH, w, itemFullH), 'strokeColor=none;fillColor=none;');
					item[i].vertex = true;
					v.insert(item[i]);
					item[i].value = convertText(p["Item_" + i]);
					item[i].style += getLabelStyle(p["Item_" + i]);
					
					if (i > 0)
					{
						line[i] = new mxCell('', new mxGeometry(0, startH + i * itemFullH - 2, w, 4), 'shape=line;');
						line[i].vertex = true;
						v.insert(line[i]);
						
						if (p.Scheme == 'Dark')
						{
							line[i].style += 'strokeColor=#ffffff;';
						}
						else
						{
							line[i].style += 'strokeColor=#D9D9D9;';
						}
					}
				}
				
				if (p.Scheme == 'Dark')
				{
					v.style += 'strokeColor=none;fillColor=#111111;';
				}
				else
				{
					v.style += 'strokeColor=none;fillColor=#ffffff;';
				}
				
				break;
				
			case 'AndroidTabs' :
				var numTabs = parseInt(p.Tabs);
				var tabFullW = w;
				
				if (numTabs > 0)
				{
					tabFullW = tabFullW / numTabs;
				}
				
				var tab = new Array();
				var line = new Array();
				
				for (var i = 0; i < numTabs; i++)
				{
					tab[i] = new mxCell('', new mxGeometry(i * tabFullW, 0, tabFullW, h), 'strokeColor=none;fillColor=none;');
					tab[i].vertex = true;
					v.insert(tab[i]);
					tab[i].value = convertText(p["Tab_" + i]);
					tab[i].style += getLabelStyle(p["Tab_" + i]);
					
					if (i > 0)
					{
						line[i] = new mxCell('', new mxGeometry(i * tabFullW - 2, h * 0.2, 4, h * 0.6), 'shape=line;direction=north;');
						line[i].vertex = true;
						v.insert(line[i]);
						
						if (p.Scheme == 'Dark')
						{
							line[i].style += 'strokeColor=#484848;';
						}
						else
						{
							line[i].style += 'strokeColor=#CCCCCC;';
						}
					}
				}

				var selectedMarker = new mxCell('', new mxGeometry(p.Selected * tabFullW + 2, h - 3, tabFullW - 4, 3), 'strokeColor=none;fillColor=#33B5E5;');
				selectedMarker.vertex = true;
				v.insert(selectedMarker);

				if (p.Scheme == 'Dark')
				{
					v.style += 'strokeColor=none;fillColor=#333333;';
				}
				else
				{
					v.style += 'strokeColor=none;fillColor=#DDDDDD;';
				}
				
				break;
				
			case 'AndroidProgressBar' :
				v = new mxCell('', new mxGeometry(Math.round(x), Math.round(y + h * 0.25), Math.round(w), Math.round(h * 0.5)), vertexStyle);
			    v.vertex = true;
				
				var progressBar = new mxCell('', new mxGeometry(0, 0, w * p.BarPosition, Math.round(h * 0.5)), 'strokeColor=none;fillColor=#33B5E5;');
				progressBar.vertex = true;
				v.insert(progressBar);

				if (p.Scheme == 'Dark')
				{
					v.style += 'strokeColor=none;fillColor=#474747;';
				}
				else
				{
					v.style += 'strokeColor=none;fillColor=#BBBBBB;';
				}
				
				break;
				
			case 'AndroidImageBlock' :
				if (p.Scheme == 'Dark')
				{
					v.style += 'shape=mxgraph.mockup.graphics.simpleIcon;strokeColor=#7E7E7E;fillColor=#111111;';
				}
				else
				{
					v.style += 'shape=mxgraph.mockup.graphics.simpleIcon;strokeColor=#939393;fillColor=#ffffff;';
				}
				
				break;
				
			case 'AndroidTextBlock' :
				if (p.Scheme == 'Dark')
				{
					if (p.ShowBorder)
					{
						v.style += 'fillColor=#111111;strokeColor=#ffffff;';
					}
					else
					{
						v.style += 'fillColor=#111111;strokeColor=none;';
					}
				}
				else
				{
					if (p.ShowBorder)
					{
						v.style += 'fillColor=#ffffff;strokeColor=#000000;';
					}
					else
					{
						v.style += 'fillColor=#ffffff;strokeColor=none;';
					}
				}
				
				v.value = convertText(p.Label);
				v.style += getLabelStyle(p.Label);
				
				break;

			case 'AndroidActionBar' :
				v.style += 'strokeColor=none;';
				
				switch (p.BarBackground)
				{
					case 'Blue' :
						v.style += 'fillColor=#002E3E;';
						break;
					case 'Gray' :
						v.style += 'fillColor=#DDDDDD;';
						break;
					case 'Dark Gray' :
						v.style += 'fillColor=#474747;';
						break;
					case 'White' :
						v.style += 'fillColor=#ffffff;';
						break;
				}
				
				if (p.HighlightShow)
				{
					var highlight = null;
					
					if (p.HighlightTop)
					{
						highlight = new mxCell('', new mxGeometry(0, 0, w, 2), 'strokeColor=none;');
					}
					else
					{
						highlight = new mxCell('', new mxGeometry(0, h - 2, w, 2), 'strokeColor=none;');
					}

					highlight.vertex = true;
					v.insert(highlight);

					switch (p.HighlightColor)
					{
						case 'Blue' :
							highlight.style += 'fillColor=#33B5E5;';
							break;
						case 'Dark Gray' :
							highlight.style += 'fillColor=#B0B0B0;';
							break;
						case 'White' :
							highlight.style += 'fillColor=#ffffff;';
							break;
					}
				}
				
				if (p.VlignShow)
				{
					var vLine = new mxCell('', new mxGeometry(20, 5, 2, h - 10), 'shape=line;direction=north;');
					vLine.vertex = true;
					v.insert(vLine);

					switch (p.VlignColor)
					{
						case 'Blue' :
							vLine.style += 'strokeColor=#244C5A;';
							break;
						case 'White' :
							vLine.style += 'strokeColor=#ffffff;';
							break;
					}
				}
				
				break;
				
			case 'AndroidButton' :
				v.value = convertText(p.Label);
				v.style += getLabelStyle(p.Label) + 'shape=partialRectangle;left=0;right=0;';

				if (p.Scheme == 'Dark')
				{
					v.style += 'fillColor=#474747;strokeColor=#C6C5C6;bottom=0;';
				}
				else
				{
					v.style += 'fillColor=#DFE0DF;strokeColor=#C6C5C6;top=0;';
				}
				
				break;
				
			case 'AndroidTextBox' :
				v.value = convertText(p.Label);
				v.style += getLabelStyle(p.Label);

				var underline = new mxCell('', new mxGeometry(2, h - 6, w - 4, 4), 'shape=partialRectangle;top=0;fillColor=none;');
				underline.vertex = true;
				v.insert(underline);

				if (p.Scheme == 'Dark')
				{
					v.style += 'fillColor=#111111;strokeColor=none;';
				}
				else
				{
					v.style += 'fillColor=#ffffff;strokeColor=none;';
				}
				
				if (p.TextFocused)
				{
					underline.style += 'strokeColor=#33B5E5;';
				}
				else
				{
					underline.style += 'strokeColor=#A9A9A9;';
				}
				
				break;
				
			case 'AndroidRadioButton' :
				var dot = null;
				
				if (p.Checked)
				{
					dot = new mxCell('', new mxGeometry(w * 0.15, h * 0.15, w * 0.7, h * 0.7), 'shape=ellipse;fillColor=#33B5E5;strokeWidth=0.6;');
					dot.vertex = true;
					v.insert(dot);
				}

				if (p.Scheme == 'Dark')
				{
					v.style += 'shape=ellipse;strokeWidth=0.6;strokeColor=#272727;';
					
					if (p.Checked)
					{
						dot.style += 'strokeColor=#1F5C73;';
						v.style += 'fillColor=#193C49;';
					}
					else
					{
						v.style += 'fillColor=#111111;';
					}
				}
				else
				{
					v.style += 'shape=ellipse;strokeWidth=0.6;fillColor=#ffffff;strokeColor=#5C5C5C;';
					
					if (p.Checked)
					{
						dot.style += 'strokeColor=#999999;';
					}
				}

				break;
				
			case 'AndroidCheckBox' :
				var check = null;
				if (p.Checked)
				{
					check = new mxCell('', new mxGeometry(w * 0.25, - h * 0.05, w, h * 0.8), 'shape=mxgraph.ios7.misc.check;strokeColor=#33B5E5;strokeWidth=2;');
					check.vertex = true;
					v.insert(check);
				}

				if (p.Scheme == 'Dark')
				{
					v.style += 'strokeWidth=0.6;strokeColor=#272727;fillColor=#111111;';
				}
				else
				{
					v.style += 'strokeWidth=0.6;strokeColor=#5C5C5C;fillColor=#ffffff;';
				}

				break;
				
			case 'AndroidToggle' :
				if (p.Scheme == 'Dark')
				{
					if (p.Checked)
					{
						v.style += 'shape=mxgraph.android.switch_on;fillColor=#666666;';
					}
					else
					{
						v.style += 'shape=mxgraph.android.switch_off;fillColor=#666666;';
					}
				}
				else
				{
					if (p.Checked)
					{
						v.style += 'shape=mxgraph.android.switch_on;fillColor=#E6E6E6;';
					}
					else
					{
						v.style += 'shape=mxgraph.android.switch_off;fillColor=#E6E6E6;';
					}
				}
				
				break;
				
			case 'AndroidSlider' :
				v.style += 'shape=mxgraph.android.progressScrubberFocused;dx=' + p.BarPosition + ';fillColor=#33b5e5;';
				
				break;
				
			case 'iOSSegmentedControl' :
				var numTabs = parseInt(p.Tabs);
				var tabFullW = w;
				v.style += 'strokeColor=none;fillColor=none;';
				
				if (numTabs > 0)
				{
					tabFullW = tabFullW / numTabs;
				}
				
				var tab = new Array();
				var line = new Array();
				
				for (var i = 0; i < numTabs; i++)
				{
					tab[i] = new mxCell('', new mxGeometry(i * tabFullW, 0, tabFullW, h), 'strokeColor=' + p.FillColor + ';');
					tab[i].vertex = true;
					v.insert(tab[i]);
					tab[i].value = convertText(p["Tab_" + i]);
					tab[i].style += getLabelStyle(p["Tab_" + i]);
					
					if (p.Selected == i)
					{
						tab[i].style += getFillColor(p, a);
					}
					else
					{
						tab[i].style += 'fillColor=none;';
					}
				}

				break;

			case 'iOSSlider' :
				v.style += 'shape=mxgraph.ios7ui.slider;strokeColor=' + p.FillColor + ';fillColor=#ffffff;strokeWidth=2;barPos=' + p.BarPosition * 100 + ';';
				
				break;

			case 'iOSProgressBar':
				v = new mxCell('', new mxGeometry(Math.round(x), Math.round(y + h * 0.25), Math.round(w), Math.round(h * 0.5)), vertexStyle + 'strokeColor=none;fillColor=#B5B5B5;');
			    v.vertex = true;
				
				var progressBar = new mxCell('', new mxGeometry(0, 0, w * p.BarPosition, Math.round(h * 0.5)), 'strokeColor=none;' + getFillColor(p, a));
				progressBar.vertex = true;
				v.insert(progressBar);

				break;

			case 'iOSPageControls' :
				v.style += 'shape=mxgraph.ios7ui.pageControl;' + getFillColor(p, a) + 'strokeColor=#D6D6D6;';
				
				break;

			case 'iOSStatusBar' :
				v.style += 'shape=mxgraph.ios7ui.appBar;' + getFillColor(p, a) + 'strokeColor=#000000;';

				var text1 = new mxCell(convertText(p.Text), new mxGeometry(w * 0.35, 0, w * 0.3, h), 'strokeColor=none;fillColor=none;');
				text1.vertex = true;
				v.insert(text1);
				text1.style += getLabelStyle(p.Text);
				
				var text2 = new mxCell(convertText(p.Carrier), new mxGeometry(w * 0.09, 0, w * 0.2, h), 'strokeColor=none;fillColor=none;');
				text2.vertex = true;
				v.insert(text2);
				text2.style += getLabelStyle(p.Carrier);
				
				break;
				
			case 'iOSSearchBar' :
				v.style += 'strokeColor=none;' +
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getRounded(p, a, v) +
					getLabelStyle(p.Search);
				
				v.value = convertText(p.Search);
				
				var icon1 = new mxCell('', new mxGeometry(w * 0.3, h * 0.3, h * 0.4, h * 0.4), 'shape=mxgraph.ios7.icons.looking_glass;strokeColor=#000000;fillColor=none;');
				icon1.vertex = true;
				v.insert(icon1);
				
				break;
				
			case 'iOSNavBar' :
				v.style += 'shape=partialRectangle;top=0;right=0;left=0;strokeColor=#979797;' + getFillColor(p, a) + getOpacity(p, a) + getLabelStyle(p.Title);
				v.value = convertText(p.Title);

				var text1 = new mxCell(convertText(p.LeftText), new mxGeometry(w * 0.03, 0, w * 0.3, h), 'strokeColor=none;fillColor=none;');
				text1.vertex = true;
				v.insert(text1);
				text1.style += getLabelStyle(p.LeftText);
				
				var text2 = new mxCell(convertText(p.RightText), new mxGeometry(w * 0.65, 0, w * 0.3, h), 'strokeColor=none;fillColor=none;');
				text2.vertex = true;
				v.insert(text2);
				text2.style += getLabelStyle(p.RightText);
				
				var icon1 = new mxCell('', new mxGeometry(w * 0.02, h * 0.2, h * 0.3, h * 0.5), 'shape=mxgraph.ios7.misc.left;strokeColor=#007AFF;strokeWidth=2;');
				icon1.vertex = true;
				v.insert(icon1);
				
				break;
				
			case 'iOSTabs' :
				var numTabs = parseInt(p.Tabs);
				var tabFullW = w;
				v.style += 'shape=partialRectangle;right=0;left=0;bottom=0;strokeColor=#979797;' + getFillColor(p, a) + getOpacity(p, a);
				
				if (numTabs > 0)
				{
					tabFullW = tabFullW / numTabs;
				}
				
				var tab = new Array();
				var line = new Array();
				
				for (var i = 0; i < numTabs; i++)
				{
					tab[i] = new mxCell('', new mxGeometry(i * tabFullW, 0, tabFullW, h), 'strokeColor=none;');
					tab[i].vertex = true;
					v.insert(tab[i]);
					tab[i].value = convertText(p["Tab_" + i]);
					
					tab[i].style += getFontSize(p["Tab_" + i]);

					tab[i].style += 
									getFontColor(p["Tab_" + i]) + 
									getFontStyle(p["Tab_" + i]) +
									getTextAlignment(p["Tab_" + i]) + 
									getTextLeftSpacing(p["Tab_" + i]) +
									getTextRightSpacing(p["Tab_" + i]) + 
									getTextTopSpacing(p["Tab_" + i]) +
									getTextBottomSpacing(p["Tab_" + i]) + 
									getTextGlobalSpacing(p["Tab_" + i]);
					
					tab[i].style += 'verticalAlign=bottom;';
					
					if (p.Selected == i)
					{
						tab[i].style += 'fillColor=#BBBBBB;';
					}
					else
					{
						tab[i].style += 'fillColor=none;';
					}
				}

				break;

			case 'iOSDatePicker' :
				var firstDate1 = new mxCell('', new mxGeometry(0, 0, w * 0.5, h * 0.2), 'strokeColor=none;fillColor=none;');
				firstDate1.vertex = true;
				v.insert(firstDate1);
				firstDate1.value = convertText(p.Option11);
				firstDate1.style += getLabelStyle(p.Option11);
				var firstDate2 = new mxCell('', new mxGeometry(w * 0.5, 0, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				firstDate2.vertex = true;
				v.insert(firstDate2);
				firstDate2.value = convertText(p.Option21);
				firstDate2.style += getLabelStyle(p.Option21);
				var firstDate3 = new mxCell('', new mxGeometry(w * 0.65, 0, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				firstDate3.vertex = true;
				v.insert(firstDate3);
				firstDate3.value = convertText(p.Option31);
				firstDate3.style += getLabelStyle(p.Option31);

				var secondDate1 = new mxCell('', new mxGeometry(0, h * 0.2, w * 0.5, h * 0.2), 'strokeColor=none;fillColor=none;');
				secondDate1.vertex = true;
				v.insert(secondDate1);
				secondDate1.value = convertText(p.Option12);
				secondDate1.style += getLabelStyle(p.Option12);
				var secondDate2 = new mxCell('', new mxGeometry(w * 0.5, h * 0.2, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				secondDate2.vertex = true;
				v.insert(secondDate2);
				secondDate2.value = convertText(p.Option22);
				secondDate2.style += getLabelStyle(p.Option22);
				var secondDate3 = new mxCell('', new mxGeometry(w * 0.65, h * 0.2, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				secondDate3.vertex = true;
				v.insert(secondDate3);
				secondDate3.value = convertText(p.Option32);
				secondDate3.style += getLabelStyle(p.Option32);

				var currDate1 = new mxCell('', new mxGeometry(0, h * 0.4, w * 0.5, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate1.vertex = true;
				v.insert(currDate1);
				currDate1.value = convertText(p.Option13);
				currDate1.style += getLabelStyle(p.Option13);
				var currDate2 = new mxCell('', new mxGeometry(w * 0.5, h * 0.4, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate2.vertex = true;
				v.insert(currDate2);
				currDate2.value = convertText(p.Option23);
				currDate2.style += getLabelStyle(p.Option23);
				var currDate3 = new mxCell('', new mxGeometry(w * 0.65, h * 0.4, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate3.vertex = true;
				v.insert(currDate3);
				currDate3.value = convertText(p.Option33);
				currDate3.style += getLabelStyle(p.Option33);
				var currDate4 = new mxCell('', new mxGeometry(w * 0.80, h * 0.4, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate4.vertex = true;
				v.insert(currDate4);
				currDate4.value = convertText(p.Option43);
				currDate4.style += getLabelStyle(p.Option43);

				var fourthDate1 = new mxCell('', new mxGeometry(0, h * 0.6, w * 0.5, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate1.vertex = true;
				v.insert(fourthDate1);
				fourthDate1.value = convertText(p.Option14);
				fourthDate1.style += getLabelStyle(p.Option14);
				var fourthDate2 = new mxCell('', new mxGeometry(w * 0.5, h * 0.6, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate2.vertex = true;
				v.insert(fourthDate2);
				fourthDate2.value = convertText(p.Option24);
				fourthDate2.style += getLabelStyle(p.Option24);
				var fourthDate3 = new mxCell('', new mxGeometry(w * 0.65, h * 0.6, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate3.vertex = true;
				v.insert(fourthDate3);
				fourthDate3.value = convertText(p.Option34);
				fourthDate3.style += getLabelStyle(p.Option34);
				var fourthDate4 = new mxCell('', new mxGeometry(w * 0.8, h * 0.6, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate4.vertex = true;
				v.insert(fourthDate4);
				fourthDate4.value = convertText(p.Option44);
				fourthDate4.style += getLabelStyle(p.Option44);

				var fifthDate1 = new mxCell('', new mxGeometry(0, h * 0.8, w * 0.5, h * 0.2), 'strokeColor=none;fillColor=none;');
				fifthDate1.vertex = true;
				v.insert(fifthDate1);
				fifthDate1.value = convertText(p.Option15);
				fifthDate1.style += getLabelStyle(p.Option15);
				var fifthDate2 = new mxCell('', new mxGeometry(w * 0.5, h * 0.8, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				fifthDate2.vertex = true;
				v.insert(fifthDate2);
				fifthDate2.value = convertText(p.Option25);
				fifthDate2.style += getLabelStyle(p.Option25);
				var fifthDate3 = new mxCell('', new mxGeometry(w * 0.65, h * 0.8, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				fifthDate3.vertex = true;
				v.insert(fifthDate3);
				fifthDate3.value = convertText(p.Option35);
				fifthDate3.style += getLabelStyle(p.Option35);

				var line1 = new mxCell('', new mxGeometry(0, h * 0.4 - 2, w, 4), 'shape=line;strokeColor=#888888;');
				line1.vertex = true;
				v.insert(line1);
				var line2 = new mxCell('', new mxGeometry(0, h * 0.6 - 2, w, 4), 'shape=line;strokeColor=#888888;');
				line2.vertex = true;
				v.insert(line2);

				v.style += getFillColor(p, a) + getOpacity(p, a) + 'strokeColor=none;';
				
				break;
				
			case 'iOSTimePicker' :
				var firstDate1 = new mxCell('', new mxGeometry(0, 0, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				firstDate1.vertex = true;
				v.insert(firstDate1);
				firstDate1.value = convertText(p.Option11);
				firstDate1.style += getLabelStyle(p.Option11);
				var firstDate2 = new mxCell('', new mxGeometry(w * 0.25, 0, w * 0.3, h * 0.2), 'strokeColor=none;fillColor=none;');
				firstDate2.vertex = true;
				v.insert(firstDate2);
				firstDate2.value = convertText(p.Option21);
				firstDate2.style += getLabelStyle(p.Option21);

				var secondDate1 = new mxCell('', new mxGeometry(0, h * 0.2, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				secondDate1.vertex = true;
				v.insert(secondDate1);
				secondDate1.value = convertText(p.Option12);
				secondDate1.style += getLabelStyle(p.Option12);
				var secondDate2 = new mxCell('', new mxGeometry(w * 0.25, h * 0.2, w * 0.3, h * 0.2), 'strokeColor=none;fillColor=none;');
				secondDate2.vertex = true;
				v.insert(secondDate2);
				secondDate2.value = convertText(p.Option22);
				secondDate2.style += getLabelStyle(p.Option22);

				var currDate1 = new mxCell('', new mxGeometry(0, h * 0.4, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate1.vertex = true;
				v.insert(currDate1);
				currDate1.value = convertText(p.Option13);
				currDate1.style += getLabelStyle(p.Option13);
				var currDate2 = new mxCell('', new mxGeometry(w * 0.25, h * 0.4, w * 0.3, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate2.vertex = true;
				v.insert(currDate2);
				currDate2.value = convertText(p.Option23);
				currDate2.style += getLabelStyle(p.Option23);
				var currDate4 = new mxCell('', new mxGeometry(w * 0.7, h * 0.4, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate4.vertex = true;
				v.insert(currDate4);
				currDate4.value = convertText(p.Option33);
				currDate4.style += getLabelStyle(p.Option33);

				var fourthDate1 = new mxCell('', new mxGeometry(0, h * 0.6, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate1.vertex = true;
				v.insert(fourthDate1);
				fourthDate1.value = convertText(p.Option14);
				fourthDate1.style += getLabelStyle(p.Option14);
				var fourthDate2 = new mxCell('', new mxGeometry(w * 0.25, h * 0.6, w * 0.3, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate2.vertex = true;
				v.insert(fourthDate2);
				fourthDate2.value = convertText(p.Option24);
				fourthDate2.style += getLabelStyle(p.Option24);
				var fourthDate4 = new mxCell('', new mxGeometry(w * 0.7, h * 0.6, w * 0.15, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate4.vertex = true;
				v.insert(fourthDate4);
				fourthDate4.value = convertText(p.Option34);
				fourthDate4.style += getLabelStyle(p.Option34);

				var fifthDate1 = new mxCell('', new mxGeometry(0, h * 0.8, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				fifthDate1.vertex = true;
				v.insert(fifthDate1);
				fifthDate1.value = convertText(p.Option15);
				fifthDate1.style += getLabelStyle(p.Option15);
				var fifthDate2 = new mxCell('', new mxGeometry(w * 0.25, h * 0.8, w * 0.3, h * 0.2), 'strokeColor=none;fillColor=none;');
				fifthDate2.vertex = true;
				v.insert(fifthDate2);
				fifthDate2.value = convertText(p.Option25);
				fifthDate2.style += getLabelStyle(p.Option25);

				var line1 = new mxCell('', new mxGeometry(0, h * 0.4 - 2, w, 4), 'shape=line;strokeColor=#888888;');
				line1.vertex = true;
				v.insert(line1);
				var line2 = new mxCell('', new mxGeometry(0, h * 0.6 - 2, w, 4), 'shape=line;strokeColor=#888888;');
				line2.vertex = true;
				v.insert(line2);

				v.style += getFillColor(p, a) + getOpacity(p, a) + 'strokeColor=none;';
				
				break;
				
			case 'iOSCountdownPicker' :
				var firstDate3 = new mxCell('', new mxGeometry(w * 0.45, 0, w * 0.2, h * 0.2), 'strokeColor=none;fillColor=none;');
				firstDate3.vertex = true;
				v.insert(firstDate3);
				firstDate3.value = convertText(p.Option31);
				firstDate3.style += getLabelStyle(p.Option31);

				var secondDate3 = new mxCell('', new mxGeometry(w * 0.45, h * 0.2, w * 0.2, h * 0.2), 'strokeColor=none;fillColor=none;');
				secondDate3.vertex = true;
				v.insert(secondDate3);
				secondDate3.value = convertText(p.Option32);
				secondDate3.style += getLabelStyle(p.Option32);

				var currDate1 = new mxCell('', new mxGeometry(0, h * 0.4, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate1.vertex = true;
				v.insert(currDate1);
				currDate1.value = convertText(p.Option13);
				currDate1.style += getLabelStyle(p.Option13);
				var currDate2 = new mxCell('', new mxGeometry(w * 0.2, h * 0.4, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate2.vertex = true;
				v.insert(currDate2);
				currDate2.value = convertText(p.Option23);
				currDate2.style += getLabelStyle(p.Option23);
				var currDate3 = new mxCell('', new mxGeometry(w * 0.45, h * 0.4, w * 0.2, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate3.vertex = true;
				v.insert(currDate3);
				currDate3.value = convertText(p.Option33);
				currDate3.style += getLabelStyle(p.Option33);
				var currDate4 = new mxCell('', new mxGeometry(w * 0.6, h * 0.4, w * 0.2, h * 0.2), 'strokeColor=none;fillColor=none;');
				currDate4.vertex = true;
				v.insert(currDate4);
				currDate4.value = convertText(p.Option43);
				currDate4.style += getLabelStyle(p.Option43);

				var fourthDate1 = new mxCell('', new mxGeometry(0, h * 0.6, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate1.vertex = true;
				v.insert(fourthDate1);
				fourthDate1.value = convertText(p.Option14);
				fourthDate1.style += getLabelStyle(p.Option14);
				var fourthDate3 = new mxCell('', new mxGeometry(w * 0.45, h * 0.6, w * 0.2, h * 0.2), 'strokeColor=none;fillColor=none;');
				fourthDate3.vertex = true;
				v.insert(fourthDate3);
				fourthDate3.value = convertText(p.Option34);
				fourthDate3.style += getLabelStyle(p.Option34);

				var fifthDate1 = new mxCell('', new mxGeometry(0, h * 0.8, w * 0.25, h * 0.2), 'strokeColor=none;fillColor=none;');
				fifthDate1.vertex = true;
				v.insert(fifthDate1);
				fifthDate1.value = convertText(p.Option15);
				fifthDate1.style += getLabelStyle(p.Option15);
				var fifthDate3 = new mxCell('', new mxGeometry(w * 0.45, h * 0.8, w * 0.2, h * 0.2), 'strokeColor=none;fillColor=none;');
				fifthDate3.vertex = true;
				v.insert(fifthDate3);
				fifthDate3.value = convertText(p.Option35);
				fifthDate3.style += getLabelStyle(p.Option35);

				var line1 = new mxCell('', new mxGeometry(0, h * 0.4 - 2, w, 4), 'shape=line;strokeColor=#888888;');
				line1.vertex = true;
				v.insert(line1);
				var line2 = new mxCell('', new mxGeometry(0, h * 0.6 - 2, w, 4), 'shape=line;strokeColor=#888888;');
				line2.vertex = true;
				v.insert(line2);

				v.style += getFillColor(p, a) + getOpacity(p, a) + 'strokeColor=none;';
				
				break;
				
			case 'iOSBasicCell' :
				v.style += 'shape=partialRectangle;left=0;top=0;right=0;fillColor=#ffffff;strokeColor=#C8C7CC;spacing=0;align=left;spacingLeft=' + (p.SeparatorInset * scale) + ';';
				v.style += getFontSize(p.text) +
					getFontColor(p.text) + 
					getFontStyle(p.text) +
					getTextVerticalAlignment(p.text);

				v.value = convertText(p.text);
				
				switch (p.AccessoryIndicatorType) 
				{
					case 'Disclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);
						
						break;
						
					case 'DetailDisclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);
						
						var icon2 = new mxCell('', new mxGeometry(w * 0.79, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);
						
						break;
						
					case 'DetailIndicator' :
						var icon2 = new mxCell('', new mxGeometry(w * 0.87, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);
						
						break;
						
					case 'CheckMark' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.89, h * 0.37, h * 0.4, h * 0.26), 'shape=mxgraph.ios7.misc.check;strokeColor=#007AFF;strokeWidth=2;');
						icon1.vertex = true;
						v.insert(icon1);
						
						break;
				}

				break;
				
			case 'iOSSubtitleCell' :
				v.style += 'shape=partialRectangle;left=0;top=0;right=0;fillColor=#ffffff;strokeColor=#C8C7CC;align=left;spacing=0;verticalAlign=top;spacingLeft=' + (p.SeparatorInset * scale) + ';';
				v.style += getFontSize(p.subtext) +
					getFontColor(p.subtext) + 
					getFontStyle(p.subtext);

				v.value = convertText(p.subtext);
				
				var subtext = new mxCell('', new mxGeometry(0, h * 0.4, w, h * 0.6), 'fillColor=none;strokeColor=none;spacing=0;align=left;verticalAlign=bottom;spacingLeft=' + (p.SeparatorInset * scale) + ';');
				subtext.vertex = true;
				v.insert(subtext);
				subtext.style += getFontSize(p.text) +
					getFontColor(p.text) + 
					getFontStyle(p.text);
				subtext.value = convertText(p.text);

				switch (p.AccessoryIndicatorType) 
				{
					case 'Disclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);
						
						break;
						
					case 'DetailDisclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);
						
						var icon2 = new mxCell('', new mxGeometry(w * 0.79, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);
						
						break;
						
					case 'DetailIndicator' :
						var icon2 = new mxCell('', new mxGeometry(w * 0.87, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);
						
						break;
						
					case 'CheckMark' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.89, h * 0.37, h * 0.4, h * 0.26), 'shape=mxgraph.ios7.misc.check;strokeColor=#007AFF;strokeWidth=2;');
						icon1.vertex = true;
						v.insert(icon1);
						
						break;
				}

				break;
				
			case 'iOSRightDetailCell' :
				v.style += 'shape=partialRectangle;left=0;top=0;right=0;fillColor=#ffffff;strokeColor=#C8C7CC;align=left;spacing=0;verticalAlign=middle;spacingLeft=' + (p.SeparatorInset * scale) + ';';
				v.style += getFontSize(p.subtext) +
					getFontColor(p.subtext) + 
					getFontStyle(p.subtext);

				v.value = convertText(p.subtext);
				
				var subtext = null;
				
				switch (p.AccessoryIndicatorType) 
				{
					case 'Disclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);

						subtext = new mxCell('', new mxGeometry(w * 0.55, 0, w * 0.3, h), 'fillColor=none;strokeColor=none;spacing=0;align=right;');

						break;
						
					case 'DetailDisclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);
						
						var icon2 = new mxCell('', new mxGeometry(w * 0.79, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);

						subtext = new mxCell('', new mxGeometry(w * 0.45, 0, w * 0.3, h), 'fillColor=none;strokeColor=none;spacing=0;align=right;');

						break;
						
					case 'DetailIndicator' :
						var icon2 = new mxCell('', new mxGeometry(w * 0.87, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);

						subtext = new mxCell('', new mxGeometry(w * 0.52, 0, w * 0.3, h), 'fillColor=none;strokeColor=none;spacing=0;align=right;');

						break;
						
					case 'CheckMark' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.89, h * 0.37, h * 0.4, h * 0.26), 'shape=mxgraph.ios7.misc.check;strokeColor=#007AFF;strokeWidth=2;');
						icon1.vertex = true;
						v.insert(icon1);

						subtext = new mxCell('', new mxGeometry(w * 0.55, 0, w * 0.3, h), 'fillColor=none;strokeColor=none;spacing=0;align=right;');

						break;
						
					default :
						subtext = new mxCell('', new mxGeometry(w * 0.65, 0, w * 0.3, h), 'fillColor=none;strokeColor=none;spacing=0;align=right;');
				}

				subtext.vertex = true;
				v.insert(subtext);
				subtext.style += getFontSize(p.text) +
					getFontColor(p.text) + 
					getFontStyle(p.text);
				subtext.value = convertText(p.text);


				break;
				
			case 'iOSLeftDetailCell' :
				v.style += 'shape=partialRectangle;left=0;top=0;right=0;fillColor=#ffffff;strokeColor=#C8C7CC;';
				
				var text = new mxCell('', new mxGeometry(0, 0, w * 0.25, h), 'fillColor=none;strokeColor=none;spacing=0;align=right;verticalAlign=middle;spacingRight=3;');
				text.vertex = true;
				v.insert(text);
				text.style += getFontSize(p.subtext) +
					getFontColor(p.subtext) + 
					getFontStyle(p.subtext);
				text.value = convertText(p.subtext);

				var subtext = new mxCell('', new mxGeometry(w * 0.25, 0, w * 0.5, h), 'fillColor=none;strokeColor=none;spacing=0;align=left;verticalAlign=middle;spacingLeft=3;');
				subtext.vertex = true;
				v.insert(subtext);
				subtext.style += getFontSize(p.text) +
					getFontColor(p.text) + 
					getFontStyle(p.text);
				subtext.value = convertText(p.text);

				switch (p.AccessoryIndicatorType) 
				{
					case 'Disclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);
						
						break;
						
					case 'DetailDisclosure' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.91, h * 0.35, h * 0.15, h * 0.3), 'shape=mxgraph.ios7.misc.right;strokeColor=#D2D2D6;');
						icon1.vertex = true;
						v.insert(icon1);
						
						var icon2 = new mxCell('', new mxGeometry(w * 0.79, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);
						
						break;
						
					case 'DetailIndicator' :
						var icon2 = new mxCell('', new mxGeometry(w * 0.87, h * 0.25, h * 0.5, h * 0.5), 'shape=mxgraph.ios7.icons.info;strokeColor=#007AFF;fillColor=#ffffff;');
						icon2.vertex = true;
						v.insert(icon2);
						
						break;
						
					case 'CheckMark' :
						var icon1 = new mxCell('', new mxGeometry(w * 0.89, h * 0.37, h * 0.4, h * 0.26), 'shape=mxgraph.ios7.misc.check;strokeColor=#007AFF;strokeWidth=2;');
						icon1.vertex = true;
						v.insert(icon1);
						
						break;
				}

				break;
				
			case 'iOSTableGroupedSectionBreak' :
				v.style += 'shape=partialRectangle;left=0;right=0;fillColor=#EFEFF4;strokeColor=#C8C7CC;';
				
				var text1 = new mxCell('', new mxGeometry(0, 0, w, h * 0.4), 'fillColor=none;strokeColor=none;spacing=10;align=left;');
				text1.vertex = true;
				v.insert(text1);
				text1.style += getFontSize(p.text) +
					getFontColor(p.text) + 
					getFontStyle(p.text);
				text1.value = convertText(p.text);

				var text2 = new mxCell('', new mxGeometry(0, h * 0.6, w, h * 0.4), 'fillColor=none;strokeColor=none;spacing=10;align=left;');
				text2.vertex = true;
				v.insert(text2);
				text2.style += getFontSize(p["bottom-text"]) +
					getFontColor(p["bottom-text"]) + 
					getFontStyle(p["bottom-text"]);
				text2.value = convertText(p["bottom-text"]);

				break;
				
			case 'iOSTablePlainHeaderFooter' :
				v.style += 'fillColor=#F7F7F7;strokeColor=none;align=left;spacingLeft=5;spacing=0;';
				v.style += getFontSize(p.text) +
					getFontColor(p.text) + 
					getFontStyle(p.text);
				v.value = convertText(p.text);
				
				break;
				
			case 'SMPage' :
				if (p.Group)
				{
					v.style += 'strokeColor=none;fillColor=none;'
						
					var item1 = new mxCell('', new mxGeometry(0, 0, w * 0.9, h * 0.9), 'part=1;');
					item1.vertex = true;
					v.insert(item1);
					
					item1.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p); 

					var item2 = new mxCell('', new mxGeometry(w * 0.1, h * 0.1, w * 0.9, h * 0.9), 'part=1;');
					item2.vertex = true;
					v.insert(item2);
					
					item2.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p) +
						getLabelStyle(p);
					
					item2.value = convertText(p.Text);
					
					if (p.Future)
					{
						item1.style += 'dashed=1;';
						item2.style += 'dashed=1;';
					}
				}
				else
				{
					if (p.Future)
					{
						v.style += 'dashed=1;';
					}
					
					v.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p) + 
						getLabelStyle(p);
				
					v.value = convertText(p.Text);
				}
				
				break;
				
			case 'SMHome' :
			case 'SMPrint' :
			case 'SMSearch' :
			case 'SMSettings' :
			case 'SMSitemap' :
			case 'SMSuccess' :
			case 'SMVideo' :
			case 'SMAudio' :
			case 'SMCalendar' :
			case 'SMChart' :
			case 'SMCloud' :
			case 'SMDocument' :
			case 'SMForm' :
			case 'SMGame' :
			case 'SMUpload' :
				
				v.style += 	getStrokeColor(p, a) + 
				getFillColor(p, a) +
				getOpacity(p, a) + 
				getShadow(p) +
				getStrokeWidth(p);

				var item1 = null;
				
				switch (obj.Class)
				{
					case 'SMHome' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.1, h * 0.8, h * 0.8), 'part=1;shape=mxgraph.office.concepts.home;flipH=1;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMPrint' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.19, h * 0.8, h * 0.62), 'part=1;shape=mxgraph.office.devices.printer;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMSearch' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.1, h * 0.8, h * 0.8), 'part=1;shape=mxgraph.office.concepts.search;flipH=1;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMSettings' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.35, h * 0.15, h * 0.7, h * 0.7), 'part=1;shape=mxgraph.mscae.enterprise.settings;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMSitemap' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.35, h * 0.2, h * 0.7, h * 0.6), 'part=1;shape=mxgraph.office.sites.site_collection;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMSuccess' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.3, h * 0.25, h * 0.6, h * 0.5), 'part=1;shape=mxgraph.mscae.general.checkmark;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMVideo' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.2, h * 0.8, h * 0.6), 'part=1;shape=mxgraph.office.concepts.video_play;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMAudio' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.3, h * 0.2, h * 0.6, h * 0.6), 'part=1;shape=mxgraph.mscae.general.audio;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMCalendar' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.15, h * 0.8, h * 0.7), 'part=1;shape=mxgraph.office.concepts.form;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMChart' :
						var fc = getFillColor(p, a);
						
						if (fc == '')
						{
							fc = '#ffffff;'
						}
						else
						{
							fc = fc.replace('fillColor=', '');
						}
						
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.35, h * 0.15, h * 0.7, h * 0.7), 'part=1;shape=mxgraph.ios7.icons.pie_chart;fillColor=#e6e6e6;fillOpacity=50;strokeWidth=4;strokeColor=' + fc);
						break;
					case 'SMCloud' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.27, h * 0.8, h * 0.46), 'part=1;shape=mxgraph.networks.cloud;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMDocument' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.25, h * 0.15, h * 0.5, h * 0.7), 'part=1;shape=mxgraph.mscae.enterprise.document;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMForm' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.15, h * 0.8, h * 0.7), 'part=1;shape=mxgraph.office.concepts.form;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMGame' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.2, h * 0.8, h * 0.6), 'part=1;shape=mxgraph.mscae.general.game_controller;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
					case 'SMUpload' :
						item1 = new mxCell('', new mxGeometry(w * 0.5 - h * 0.4, h * 0.2, h * 0.8, h * 0.6), 'part=1;shape=mxgraph.mscae.enterprise.backup_online;fillColor=#e6e6e6;opacity=50;strokeColor=none;');
						break;
				}
					
				item1.vertex = true;
				v.insert(item1);
				
				item1.style += 	getLabelStyle(p);
				item1.value = convertText(p.Text);
				
				break;
			case 'UMLMultiplicityBlock' :
				v.style += 'strokeColor=none;fillColor=none;'
					
					var item1 = new mxCell('', new mxGeometry(w * 0.1, 0, w * 0.9, h * 0.9), 'part=1;');
					item1.vertex = true;
					v.insert(item1);
					
					item1.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p); 

					var item2 = new mxCell('', new mxGeometry(0, h * 0.1, w * 0.9, h * 0.9), 'part=1;');
					item2.vertex = true;
					v.insert(item2);
					
					item2.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p) +
						getLabelStyle(p.Text);
					
					item2.value = convertText(p.Text);
				
				break;

			case 'UMLConstraintBlock' :				
				
				var brace1 = new mxCell('', new mxGeometry(0, 0,	h * 0.25, h), 'shape=curlyBracket;rounded=1;');
				brace1.vertex = true;
				v.insert(brace1);

				var brace2 = new mxCell('', new mxGeometry(w - h * 0.25, 0,	h * 0.25, h), 'shape=curlyBracket;rounded=1;flipH=1;');
				brace2.vertex = true;
				v.insert(brace2);

				var label = new mxCell('', new mxGeometry(h * 0.25, 0,	w - h * 0.5, h), 'strokeColor=none;fillColor=none;');
				label.vertex = true;
				label.value = convertText(p);
				v.insert(label);
				
				v.style = "strokeColor=none;fillColor=none;"
				v.style += 	getRotation(p, a, v); 
					

				brace1.style += getStrokeColor(p, a) + 
								getOpacity(p, a) + 
								getShadow(p) +
								getStrokeStyle(p) + 
								getStrokeWidth(p); 

				brace2.style += getStrokeColor(p, a) + 
								getOpacity(p, a) + 
								getShadow(p) +
								getStrokeStyle(p) + 
								getStrokeWidth(p); 

				label.style += 	getFontSize(p) +
								getFontColor(p) + 
								getFontStyle(p) +
								getTextAlignment(p) + 
								getTextLeftSpacing(p) +
								getTextRightSpacing(p) + 
								getTextTopSpacing(p) +
								getTextBottomSpacing(p) + 
								getTextGlobalSpacing(p) +
								getTextVerticalAlignment(p); 
				break;

			case 'UMLTextBlock' : 
				v.style += 'strokeColor=none;' +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) + 
					getStrokeWidth(p) +
					getLabelStyle(p.Text);
				
				v.value = convertText(p.Text);

				break;
			case 'UMLMultiLanePoolBlock' :
				break;
			case 'UMLMultiLanePoolRotatedBlock' :
				break;
			case 'UMLMultidimensionalSwimlane' :
				break;
			case 'UMLComponentBoxBlock' :
				break;
			case 'BPMNActivity' :
				switch (p.bpmnActivityType)
				{
					case 1:
						v.style += getFillColor(p, a) +
							getStrokeColor(p, a) +
							getOpacity(p, a) + 
							getShadow(p) +
							getStrokeStyle(p) + 
							getStrokeWidth(p) +
							getLabelStyle(p.Text);
					
						v.value = convertText(p.Text);
						break
					case 2:
						v.style += 'shape=ext;double=1;' +
							getFillColor(p, a) +
							getStrokeColor(p, a) +
							getOpacity(p, a) + 
							getShadow(p) +
							getStrokeStyle(p) + 
							getStrokeWidth(p) +
							getLabelStyle(p.Text);
				
						v.value = convertText(p.Text);
						break
					case 3:
						v.style += 'shape=ext;dashed=1;dashPattern=2 1;' +
							getFillColor(p, a) +
							getStrokeColor(p, a) +
							getOpacity(p, a) + 
							getShadow(p) +
							getStrokeWidth(p) +
							getLabelStyle(p.Text);
					
						v.value = convertText(p.Text);
						break
					case 4:
						v.style += 'shape=ext;strokeWidth=2;' +
							getFillColor(p, a) +
							getStrokeColor(p, a) +
							getOpacity(p, a) + 
							getShadow(p) +
							getStrokeStyle(p) + 
							getLabelStyle(p.Text);
					
						v.value = convertText(p.Text);
						break
				}

				if (p.bpmnTaskType != 0)
				{
					switch (p.bpmnTaskType)
					{
						case 1:
							var item1 = new mxCell('', new mxGeometry(0, 0, 19, 12), 'shape=message;');
							item1.geometry.offset = new mxPoint(4, 7);
							break;
						case 2:
							var item1 = new mxCell('', new mxGeometry(0, 0, 19, 12), 'shape=message;');
							item1.geometry.offset = new mxPoint(4, 7);
							break;
						case 3:
							var item1 = new mxCell('', new mxGeometry(0, 0, 15, 15), 'shape=mxgraph.bpmn.user_task;');
							item1.geometry.offset = new mxPoint(4, 5);
							break;
						case 4:
							var item1 = new mxCell('', new mxGeometry(0, 0, 15, 10), 'shape=mxgraph.bpmn.manual_task;');
							item1.geometry.offset = new mxPoint(4, 7);
							break;
						case 5:
							var item1 = new mxCell('', new mxGeometry(0, 0, 18, 13), 'shape=mxgraph.bpmn.business_rule_task;');
							item1.geometry.offset = new mxPoint(4, 7);
							break;
						case 6:
							var item1 = new mxCell('', new mxGeometry(0, 0, 15, 15), 'shape=mxgraph.bpmn.service_task;');
							item1.geometry.offset = new mxPoint(4, 5);
							break;
						case 7:
							var item1 = new mxCell('', new mxGeometry(0, 0, 15, 15), 'shape=mxgraph.bpmn.script_task;');
							item1.geometry.offset = new mxPoint(4, 5);
							break;
					}
					
					if (p.bpmnTaskType == 1)
					{
						var sc = getFillColor(p, a);
						var fc = getStrokeColor(p, a);
							
						fc = fc.replace('strokeColor', 'fillColor');
						sc = sc.replace('fillColor', 'strokeColor');
						
						if (fc == '')
						{
							fc = 'fillColor=#000000;'
						}
						
						if (sc == '')
						{
							sc = 'strokeColor=#ffffff;'
						}
						
						item1.style += sc + fc + 'part=1;';

					}
					else
					{
						item1.style += getFillColor(p, a) + getStrokeColor(p, a) + 'part=1;';
					}
					
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
				}

				var numIcons = 0;
				
				if (p.bpmnActivityMarker1 != 0)
				{
					numIcons++;
				}
				
				if (p.bpmnActivityMarker2 != 0)
				{
					numIcons++;
				}
				
				var iconX = 0;
				var iconY = h - 20;
				
				if (numIcons == 1)
				{
					iconX = -7.5;
				}
				else if (numIcons == 2)
				{
					iconX = -19;
				}

				if (p.bpmnActivityMarker1 != 0)
				{
					switch (p.bpmnActivityMarker1)
					{
						case 1:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=plus;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 2:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=mxgraph.bpmn.loop;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 3:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=parallelMarker;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 4:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=parallelMarker;direction=south;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 5:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 10), 'shape=mxgraph.bpmn.ad_hoc;strokeColor=none;flipH=1;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -17);
							var fc = getStrokeColor(p, a);
							fc = fc.replace('strokeColor', 'fillColor');
							
							if (fc == '')
							{
								fc = 'fillColor=#000000;'
							}
							
							item1.style += fc;
							break;
						case 6:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 11), 'shape=mxgraph.bpmn.compensation;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -18);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
					}
					
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
				}
				
				if (numIcons == 2)
				{
					iconX = 5;
				}

				if (p.bpmnActivityMarker2 != 0)
				{
					switch (p.bpmnActivityMarker2)
					{
						case 1:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=plus;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 2:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=mxgraph.bpmn.loop;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 3:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=parallelMarker;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 4:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 15), 'shape=parallelMarker;direction=south;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -20);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
						case 5:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 10), 'shape=mxgraph.bpmn.ad_hoc;strokeColor=none;flipH=1;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -17);
							var fc = getStrokeColor(p, a);
							fc = fc.replace('strokeColor', 'fillColor');
							
							if (fc == '')
							{
								fc = 'fillColor=#000000;'
							}
							
							item1.style += fc;
							break;
						case 6:
							var item1 = new mxCell('', new mxGeometry(0.5, 1, 15, 11), 'shape=mxgraph.bpmn.compensation;part=1;');
							item1.geometry.offset = new mxPoint(iconX, -18);
							item1.style += getFillColor(p, a) + getStrokeColor(p, a);
							break;
					}

					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
				}

				break;
				
			case 'BPMNEvent' :
				v.style += 'shape=mxgraph.bpmn.shape;verticalLabelPosition=bottom;verticalAlign=top;' +
					getFillColor(p, a) +
					getStrokeColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) + 
					getStrokeWidth(p) + 
					getFontSize(p) +
					getFontColor(p) + 
					getFontStyle(p) +
					getTextAlignment(p) + 
					getTextLeftSpacing(p) +
					getTextRightSpacing(p) + 
					getTextTopSpacing(p) +
					getTextBottomSpacing(p) + 
					getTextGlobalSpacing(p);
			
				v.value = convertText(p.Text);
				
				if (p.bpmnDashed == true)
				{
					switch (p.bpmnEventGroup)
					{
						case 0:
							v.style += 'outline=eventNonint;';
							break;
						case 1:
							v.style += 'outline=boundNonint;';
							break;
						case 2:
							v.style += 'outline=end;';
							break;
					}
				}
				else 
				{
					switch (p.bpmnEventGroup)
					{
						case 0:
							v.style += 'outline=standard;';
							break;
						case 1:
							v.style += 'outline=throwing;';
							break;
						case 2:
							v.style += 'outline=end;';
							break;
					}
				}
				
				switch(p.bpmnEventType)
				{
					case 1:
						v.style += 'symbol=message;';
						break;
					case 2:
						v.style += 'symbol=timer;';
						break;
					case 3:
						v.style += 'symbol=escalation;';
						break;
					case 4:
						v.style += 'symbol=conditional;';
						break;
					case 5:
						v.style += 'symbol=link;';
						break;
					case 6:
						v.style += 'symbol=error;';
						break;
					case 7:
						v.style += 'symbol=cancel;';
						break;
					case 8:
						v.style += 'symbol=compensation;';
						break;
					case 9:
						v.style += 'symbol=signal;';
						break;
					case 10:
						v.style += 'symbol=multiple;';
						break;
					case 11:
						v.style += 'symbol=parallelMultiple;';
						break;
					case 12:
						v.style += 'symbol=terminate;';
						break;
					
				}
				
				break;
			case 'BPMNChoreography' :
				break;
			case 'BPMNConversation' :
				v.style += 'shape=hexagon;perimeter=hexagonPerimeter2;' +
					getFillColor(p, a) +
					getStrokeColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) + 
					getLabelStyle(p);
		
				v.value = convertText(p.Text);
				
				if (p.bpmnConversationType == 0)
				{
					v.style += getStrokeWidth(p);
				}
				else
				{
					v.style += 'strokeWidth=2;';
				}
				
				if (p.bpmnIsSubConversation)
				{
					var item1 = new mxCell('', new mxGeometry(0.5, 1, 12, 12), 'shape=plus;part=1;');
					item1.geometry.offset = new mxPoint(-6, -17);
					item1.style += getFillColor(p, a) + getStrokeColor(p, a);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
				}
				
				break;
			case 'BPMNGateway' :
				v.style += 'shape=mxgraph.bpmn.shape;perimeter=rhombusPerimeter;background=gateway;' + 
					getFillColor(p, a) +
					getStrokeColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) + 
					getLabelStyle(p);
				
				switch (p.bpmnGatewayType)
				{
					case 0:
						v.style += 'outline=none;symbol=general;';
						break;
					case 1:
						v.style += 'outline=none;symbol=exclusiveGw;';
						break;
					case 2:
						v.style += 'outline=catching;symbol=multiple;';
						break;
					case 3:
						v.style += 'outline=none;symbol=parallelGw;';
						break;
					case 4:
						v.style += 'outline=end;symbol=general;';
						break;
					case 5:
						v.style += 'outline=standard;symbol=multiple;';
						break;
					case 6:
						v.style += 'outline=none;symbol=complexGw;';
						break;
					case 7:
						v.style += 'outline=standard;symbol=parallelMultiple;';
						break;
				}
				break;
			case 'BPMNData' :
				v.style += 'shape=note;size=14;' + 
					getFillColor(p, a) +
					getStrokeColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) + 
					getLabelStyle(p);

				switch (p.bpmnDataType)
				{
					case 0:
						break;
					case 1:
						var item1 = new mxCell('', new mxGeometry(0.5, 1, 12, 10), 'shape=parallelMarker;part=1;');
						item1.geometry.offset = new mxPoint(-6, -15);
						item1.style += getFillColor(p, a) + getStrokeColor(p, a);
						item1.geometry.relative = true;
						item1.vertex = true;
						v.insert(item1);
						break;
					case 2:
						var item1 = new mxCell('', new mxGeometry(0, 0, 12, 10), 'shape=singleArrow;part=1;arrowWidth=0.4;arrowSize=0.4;');
						item1.geometry.offset = new mxPoint(3, 3);
						item1.style += getFillColor(p, a) + getStrokeColor(p, a);
						item1.geometry.relative = true;
						item1.vertex = true;
						v.insert(item1);
						v.style += 'verticalLabelPosition=bottom;verticalAlign=top;';
						
						var text1 = new mxCell('', new mxGeometry(0, 0, w, 20), 'strokeColor=none;fillColor=none;');
						text1.geometry.offset = new mxPoint(0, 14);
						text1.geometry.relative = true;
						text1.vertex = true;
						v.insert(text1);
						text1.value = convertText(p.Text);
						text1.style += getLabelStyle(p);
						break;
					case 3:
						var item1 = new mxCell('', new mxGeometry(0, 0, 12, 10), 'shape=singleArrow;part=1;arrowWidth=0.4;arrowSize=0.4;');
						item1.geometry.offset = new mxPoint(3, 3);
						item1.style += getStrokeColor(p, a);
						item1.geometry.relative = true;
						item1.vertex = true;
						v.insert(item1);
						
						var fc = getStrokeColor(p, a);
						fc = fc.replace('strokeColor', 'fillColor');
						
						if (fc == '')
						{
							fc = 'fillColor=#000000;'
						}
						
						item1.style += fc;
						
						var text1 = new mxCell('', new mxGeometry(0, 0, w, 20), 'strokeColor=none;fillColor=none;');
						text1.geometry.offset = new mxPoint(0, 14);
						text1.geometry.relative = true;
						text1.vertex = true;
						v.insert(text1);
						text1.value = convertText(p.Text);
						text1.style += getLabelStyle(p);
						break;
				}
				break;
			case 'BPMNAdvancedPoolBlock' :
				break;
			case 'BPMNAdvancedPoolBlockRotated' :
				break;
			case 'BPMNBlackPool' :
				v.style += getFillColor(p, a) +
					getStrokeColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) + 
					getLabelStyle(p);

				v.value = convertText(p.Text);

				var item1 = new mxCell('', new mxGeometry(0, 0, w, h), 'fillColor=#000000;strokeColor=none;opacity=30;');
				item1.vertex = true;
				v.insert(item1);
				
				break;
				
			case 'DFDExternalEntityBlock' :
				
				v.style += 'strokeColor=none;fillColor=none;'
					
					var item1 = new mxCell('', new mxGeometry(0, 0, w * 0.95, h * 0.95), 'part=1;');
					item1.vertex = true;
					v.insert(item1);
					
					item1.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p); 

					var item2 = new mxCell('', new mxGeometry(w * 0.05, h * 0.05, w * 0.95, h * 0.95), 'part=1;');
					item2.vertex = true;
					v.insert(item2);
					
					item2.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p) +
						getLabelStyle(p.Text);
					
					item2.value = convertText(p.Text);
				
				break;
				
			case 'GSDFDDataStoreBlock' :
				
				v.style += 'shape=partialRectangle;right=0;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getLabelStyle(p.Text);
			
				v.value = convertText(p.Text);

				var item1 = new mxCell('', new mxGeometry(0, 0, w * 0.2, h), 'part=1;');
				item1.vertex = true;
				v.insert(item1);
				
				item1.style += 	getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) + 
					getLabelStyle(p.Number);

				item1.value = convertText(p.Number);

				break;
				
			case 'DefaultTableBlock' :
				break;
			case 'VSMDedicatedProcessBlock' :
			case 'VSMProductionControlBlock' :
				v.style += 'shape=mxgraph.lean_mapping.manufacturing_process;spacingTop=15;';

				if (obj.Class == 'VSMDedicatedProcessBlock')
				{
					v.value = convertText(p.Text);
				}
				else if (obj.Class == 'VSMProductionControlBlock')
				{
					v.value = convertText(p.Resources);
				}

				
				v.style += 	getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) + 
					getFontSize(p) +
					getFontColor(p) + 
					getFontStyle(p) +
					getTextAlignment(p) + 
					getTextLeftSpacing(p) +
					getTextRightSpacing(p) + 
					getTextBottomSpacing(p) + 
					getTextGlobalSpacing(p) +
					getTextVerticalAlignment(p);

				if (obj.Class == 'VSMDedicatedProcessBlock')
				{
					var item1 = new mxCell('', new mxGeometry(0, 1, 11, 9), 'part=1;shape=mxgraph.lean_mapping.operator;');
					item1.geometry.relative = true;
					item1.geometry.offset = new mxPoint(4, -13);
					item1.vertex = true;
					v.insert(item1);
					
					item1.style += 	getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p); 
				}

				var text1 = new mxCell('', new mxGeometry(0, 0, w, 15), 'strokeColor=none;fillColor=none;part=1;');
				text1.vertex = true;
				v.insert(text1);
				text1.value = convertText(p.Title);
				text1.style += getLabelStyle(p.Title);

				break;
				
			case 'VSMSharedProcessBlock' :
				v.style += 'shape=mxgraph.lean_mapping.manufacturing_process_shared;spacingTop=-5;verticalAlign=top;';

				v.value = convertText(p.Text);
				
				v.style += 	getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) + 
					getFontSize(p) +
					getFontColor(p) + 
					getFontStyle(p) +
					getTextAlignment(p) + 
					getTextLeftSpacing(p) +
					getTextRightSpacing(p) + 
					getTextBottomSpacing(p) + 
					getTextTopSpacing(p) + 
					getTextGlobalSpacing(p)
	
				var text1 = new mxCell('', new mxGeometry(w * 0.1, h * 0.3, w * 0.8, h * 0.6), 'part=1;');
				text1.vertex = true;
				v.insert(text1);
				text1.value = convertText(p.Resource);
				text1.style += 	getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) + 
					getLabelStyle(p.Resource);

				break;
				
			case 'VSMWorkcellBlock' :
				v.style += 'shape=mxgraph.lean_mapping.work_cell;verticalAlign=top;spacingTop=-2;';
				
				v.style += 	getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) + 
					getFontSize(p) +
					getFontColor(p) + 
					getFontStyle(p) +
					getTextAlignment(p) + 
					getTextLeftSpacing(p) +
					getTextRightSpacing(p) + 
					getTextBottomSpacing(p) + 
					getTextGlobalSpacing(p);
		
				v.value = convertText(p.Text);

				break;
			case 'VSMSafetyBufferStockBlock' :
			case 'VSMDatacellBlock' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				var itemFullH = h;
				
				var numItems = parseInt(p.Cells);

				var st = getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) + 'part=1;'; 

				if (numItems > 0)
				{
					itemFullH = itemFullH / numItems;
				}
				
				var item = new Array();
				var line = new Array();
				
				for (var i = 1; i <= numItems; i++)
				{
					item[i] = new mxCell('', new mxGeometry(0, (i - 1) * itemFullH, w, itemFullH), st);
					item[i].vertex = true;
					v.insert(item[i]);
					item[i].value = convertText(p["cell_" + i]);
					item[i].style += getLabelStyle(p["cell_" + i]);
				}
				
				break;
			case 'VSMInventoryBlock' : 
				v.style += 'shape=mxgraph.lean_mapping.inventory_box;verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) + 
					getFontSize(p) +
					getFontColor(p) + 
					getFontStyle(p) +
					getTextAlignment(p) + 
					getTextLeftSpacing(p) +
					getTextRightSpacing(p) + 
					getTextTopSpacing(p) +
					getTextBottomSpacing(p) + 
					getTextGlobalSpacing(p);
				v.value = convertText(p.Text);
		
				break;
			case 'VSMSupermarketBlock' :
				v.style += 'strokeColor=none;' + getFillColor(p, a);
				
				var itemFullH = h;
				
				var numItems = parseInt(p.Cells);

				var st = getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p) + 'part=1;fillColor=none;'; 

				if (numItems > 0)
				{
					itemFullH = itemFullH / numItems;
				}
				
				var item = new Array();
				var text = new Array();
				
				for (var i = 1; i <= numItems; i++)
				{
					item[i] = new mxCell('', new mxGeometry(w * 0.5, (i - 1) * itemFullH, w * 0.5, itemFullH), 'shape=partialRectangle;left=0;' + st);
					item[i].vertex = true;
					v.insert(item[i]);
					
					text[i] = new mxCell('', new mxGeometry(0, (i - 1) * itemFullH, w, itemFullH), 'strokeColor=none;fillColor=none;part=1;');
					text[i].vertex = true;
					v.insert(text[i]);
					text[i].value = convertText(p["cell_" + i]);
					text[i].style += getLabelStyle(p["cell_" + i]);
				}
				
				break;
			case 'VSMFIFOLaneBlock' : 
				v.style += 'shape=mxgraph.lean_mapping.fifo_sequence_flow;fontStyle=0;fontSize=18';
				v.value = 'FIFO';
				break;
			case 'VSMGoSeeProductionBlock' :
				v.style += 'shape=ellipse;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.17, h * 0.2, 13, 6), 'shape=mxgraph.lean_mapping.go_see_production_scheduling;flipH=1;part=1;whiteSpace=wrap;html=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getStrokeWidth(p);
				
				break;
			case 'VSMProductionKanbanBatchBlock' :
				v.style += 'strokeColor=none;fillColor=none;'

				var st = 'shape=card;size=18;flipH=1;part=1;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getStrokeWidth(p);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.1, 0, w * 0.9, h * 0.8), 'shape=mxgraph.lean_mapping.go_see_production_scheduling;flipH=1;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += st; 

				var item2 = new mxCell('', new mxGeometry(w * 0.05, h * 0.1, w * 0.9, h * 0.8), 'shape=mxgraph.lean_mapping.go_see_production_scheduling;flipH=1;part=1;');
				item2.vertex = true;
				v.insert(item2);
				item2.style += st;

				var item3 = new mxCell('', new mxGeometry(0, h * 0.2, w * 0.9, h * 0.8), 'shape=mxgraph.lean_mapping.go_see_production_scheduling;flipH=1;part=1;whiteSpace=wrap;html=1;spacing=2;');
				item3.vertex = true;
				v.insert(item3);
				item3.style += st +
					getLabelStyle(p);
				
				item3.value = convertText(p.Text);

				break;
			case 'VSMTimelineBlock' :
				break;
			case 'AWSRoundedRectangleContainerBlock2' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				if (p.Spotfleet)
				{
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h - 20), 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;');
					item1.geometry.offset = new mxPoint(0, 20);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
					item1.style += getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					item1.value = convertText(p.Title);
					
					var item2 = new mxCell('', new mxGeometry(0, 0, 35, 40), 'strokeColor=none;shape=mxgraph.aws3.spot_instance;fillColor=#f58536;');
					item2.geometry.relative = true;
					item2.geometry.offset = new mxPoint(30, 0);
					item2.vertex = true;
					v.insert(item2);
				}
				else if (p.Beanstalk)
				{
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h - 20), 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;');
					item1.geometry.offset = new mxPoint(0, 20);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
					item1.style += getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					item1.value = convertText(p.Title);
					
					var item2 = new mxCell('', new mxGeometry(0, 0, 30, 40), 'strokeColor=none;shape=mxgraph.aws3.elastic_beanstalk;fillColor=#759C3E;');
					item2.geometry.relative = true;
					item2.geometry.offset = new mxPoint(30, 0);
					item2.vertex = true;
					v.insert(item2);
				}
				else if (p.EC2)
				{
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h - 20), 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;');
					item1.geometry.offset = new mxPoint(0, 20);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
					item1.style += getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					item1.value = convertText(p.Title);
					
					var item2 = new mxCell('', new mxGeometry(0, 0, 32, 40), 'strokeColor=none;shape=mxgraph.aws3.ec2;fillColor=#F58534;');
					item2.geometry.relative = true;
					item2.geometry.offset = new mxPoint(30, 0);
					item2.vertex = true;
					v.insert(item2);
				}
				else if (p.Subnet)
				{
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h - 20), 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;');
					item1.geometry.offset = new mxPoint(0, 20);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
					item1.style += getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					item1.value = convertText(p.Title);
					
					var item2 = new mxCell('', new mxGeometry(0, 0, 32, 40), 'strokeColor=none;shape=mxgraph.aws3.permissions;fillColor=#146EB4;');
					item2.geometry.relative = true;
					item2.geometry.offset = new mxPoint(30, 0);
					item2.vertex = true;
					v.insert(item2);
				}
				else if (p.VPC)
				{
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h - 20), 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;');
					item1.geometry.offset = new mxPoint(0, 20);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
					item1.style += getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					item1.value = convertText(p.Title);
					
					var item2 = new mxCell('', new mxGeometry(0, 0, 60, 40), 'strokeColor=none;shape=mxgraph.aws3.virtual_private_cloud;fillColor=#146EB4;');
					item2.geometry.relative = true;
					item2.geometry.offset = new mxPoint(30, 0);
					item2.vertex = true;
					v.insert(item2);
				}
				else if (p.AWS)
				{
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h - 20), 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;');
					item1.geometry.offset = new mxPoint(0, 20);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
					item1.style += getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					item1.value = convertText(p.Title);
					
					var item2 = new mxCell('', new mxGeometry(0, 0, 60, 40), 'strokeColor=none;shape=mxgraph.aws3.cloud;fillColor=#F58534;');
					item2.geometry.relative = true;
					item2.geometry.offset = new mxPoint(30, 0);
					item2.vertex = true;
					v.insert(item2);
				}
				else if (p.Corporate)
				{
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h - 20), 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;');
					item1.geometry.offset = new mxPoint(0, 20);
					item1.geometry.relative = true;
					item1.vertex = true;
					v.insert(item1);
					item1.style += getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					item1.value = convertText(p.Title);
					
					var item2 = new mxCell('', new mxGeometry(0, 0, 25, 40), 'strokeColor=none;shape=mxgraph.aws3.corporate_data_center;fillColor=#7D7C7C;');
					item2.geometry.relative = true;
					item2.geometry.offset = new mxPoint(30, 0);
					item2.vertex = true;
					v.insert(item2);
				}
				else
				{
					v.style = 'resizeWidth=1;resizeHeight=1;fillColor=none;align=center;verticalAlign=bottom;spacing=2;rounded=1;arcSize=10;' +
						getStrokeColor(p, a) + 
						getLabelStyle(p.Title) + 
						getStrokeStyle(p) + 
						getStrokeWidth(p);
					
					v.value = convertText(p.Title);
				}

				break;
			case 'AWSElasticComputeCloudBlock2' :
				v.style += 'strokeColor=none;shape=mxgraph.aws3.ec2;verticalLabelPosition=bottom;align=center;verticalAlign=top;' +
					getLabelStyle(p.Title) + 
					getFillColor(p, a) + 
					getOpacity(p, a) + 
					getShadow(p);
				
				v.value = convertText(p.Title);
				
				break;
				
			case 'AWSRoute53Block2' :
				v.style += 'strokeColor=none;shape=mxgraph.aws3.route_53;verticalLabelPosition=bottom;align=center;verticalAlign=top;' +
					getLabelStyle(p.Title) + 
					getFillColor(p, a) + 
					getOpacity(p, a) + 
					getShadow(p);
				
				v.value = convertText(p.Title);
				
				break;
				
			case 'AWSRDBSBlock2' :
				v.style += 'strokeColor=none;shape=mxgraph.aws3.rds;verticalLabelPosition=bottom;align=center;verticalAlign=top;' +
					getLabelStyle(p.Title) + 
					getFillColor(p, a) + 
					getOpacity(p, a) + 
					getShadow(p);
				
				v.value = convertText(p.Title);
				
				break;
				
			case 'NET_RingNetwork' :
				v.style += 'strokeColor=none;fillColor=none;';
				
			   	var cell = new mxCell('', new mxGeometry(w * 0.25, h * 0.25, w * 0.5, h * 0.5), 'html=1;shape=ellipse;perimeter=ellipsePerimeter;strokeColor=#29AAE1;strokeWidth=2;');
			   	cell.vertex = true;
			   	v.insert(cell);
			   	var cells = [cell];
			   	cell.style += getFillColor(p, a);
			   	
			   	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;rounded=0;endArrow=none;dashed=0;html=1;strokeColor=#29AAE1;strokeWidth=2;');
			   	edge.geometry.relative = true;
		    	edge.edge = true;
		    	
		    	addRouterEdge(w * 0.5, 0, edge, select, graph, cells, v, cell);
		    	addRouterEdge(w * 0.855, h * 0.145, edge, select, graph, cells, v, cell);
		    	addRouterEdge(w, h * 0.5, edge, select, graph, cells, v, cell);
		    	addRouterEdge(w * 0.855, h * 0.855, edge, select, graph, cells, v, cell);
		    	addRouterEdge(w * 0.5, h, edge, select, graph, cells, v, cell);
		    	addRouterEdge(w * 0.145, h * 0.855, edge, select, graph, cells, v, cell);
		    	addRouterEdge(0, h * 0.5, edge, select, graph, cells, v, cell);
		    	addRouterEdge(w * 0.145, h * 0.145, edge, select, graph, cells, v, cell);
				break;
				
			case 'NET_Ethernet' :
				v.style += 'strokeColor=none;fillColor=none;';
				
			   	var cell = new mxCell('', new mxGeometry(0, h * 0.5 - 10, w, 20), 'shape=mxgraph.networks.bus;gradientColor=none;gradientDirection=north;fontColor=#ffffff;perimeter=backbonePerimeter;backboneSize=20;fillColor=#29AAE1;strokeColor=#29AAE1;');
			   	cell.vertex = true;
			   	v.insert(cell);
			   	var cells = [cell];

				var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'strokeColor=#29AAE1;edgeStyle=none;rounded=0;endArrow=none;html=1;strokeWidth=2;');
				edge.geometry.relative = true;
				edge.edge = true;

			   	var cells = [cell];
		    	var stepX = w / p.NumTopNodes;
		    	
			   	for (var i = 0; i < p.NumTopNodes; i++)
			   	{
			   		addRouterEdge(stepX * 0.5 + i * stepX, 0, edge, select, graph, cells, v, cell);
			   	}
			   	
		    	stepX = w / p.NumBottomNodes;
		    	
			   	for (var i = 0; i < p.NumBottomNodes; i++)
			   	{
			   		addRouterEdge(stepX * 0.5 + i * stepX, h, edge, select, graph, cells, v, cell);
			   	}
			   	
				break;
				
			case 'EE_OpAmp' :
				v.style += 'shape=mxgraph.electrical.abstract.operational_amp_1;' + 
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Title);
				
				if (p.ToggleCharge)
				{
					v.style += 'flipV=1;';
				}
				
				break;
				
			case 'EIMessageChannelBlock' :
			case 'EIDatatypeChannelBlock' :
			case 'EIInvalidMessageChannelBlock' :
			case 'EIDeadLetterChannelBlock' :
			case 'EIGuaranteedDeliveryBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				if (obj.Class == 'EIMessageChannelBlock')
				{
					var item1 = new mxCell('', new mxGeometry(0.5, 0.5, w * 0.9, 20), 'shape=mxgraph.eip.messageChannel;fillColor=#818181;part=1;');
					item1.geometry.offset = new mxPoint( - w * 0.45, 0);
				}
				else if (obj.Class == 'EIDatatypeChannelBlock')
				{
					var item1 = new mxCell('', new mxGeometry(0.5, 0.5, w * 0.9, 20), 'shape=mxgraph.eip.dataChannel;fillColor=#818181;part=1;');
					item1.geometry.offset = new mxPoint( - w * 0.45, 0);
				}
				else if (obj.Class == 'EIInvalidMessageChannelBlock')
				{
					var item1 = new mxCell('', new mxGeometry(0.5, 0.5, w * 0.9, 20), 'shape=mxgraph.eip.invalidMessageChannel;fillColor=#818181;part=1;');
					item1.geometry.offset = new mxPoint( - w * 0.45, 0);
				}
				else if (obj.Class == 'EIDeadLetterChannelBlock')
				{
					var item1 = new mxCell('', new mxGeometry(0.5, 0.5, w * 0.9, 20), 'shape=mxgraph.eip.deadLetterChannel;fillColor=#818181;part=1;');
					item1.geometry.offset = new mxPoint( - w * 0.45, 0);
				}
				else if (obj.Class == 'EIGuaranteedDeliveryBlock')
				{
					var item1 = new mxCell('', new mxGeometry(0.5, 0.5, 20, 27), 'shape=cylinder;fillColor=#818181;part=1;');
					item1.geometry.offset = new mxPoint( -10, -7);
				}
				
				item1.geometry.relative = true;
				item1.vertex = true;
				v.insert(item1);

				item1.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p);

			   	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;rounded=0;endArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=6;');
			   	edge.geometry.relative = true;
		    	edge.edge = true;
		    	
		    	addFloatingEdge(w * 0.15, h * 0.25, w * 0.85, h * 0.25, edge, select, graph, cells, v, cell);
		    	
				break;

			case 'EIChannelAdapterBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(0, h * 0.07, w * 0.21, h * 0.86), 'fillColor=#FFFF33;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p);
				
				var item2 = new mxCell('', new mxGeometry(w * 0.26, h * 0.09, w * 0.2, h * 0.82), 'shape=mxgraph.eip.channel_adapter;fillColor=#4CA3D9;part=1;');
				item2.vertex = true;
				v.insert(item2);
				item2.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p);
				
				var item3 = new mxCell('', new mxGeometry(1, 0.5, w * 0.35, 20), 'shape=mxgraph.eip.messageChannel;fillColor=#818181;part=1;');
				item3.geometry.relative = true;
				item3.geometry.offset = new mxPoint( - w * 0.4, -10);
				item3.vertex = true;
				v.insert(item3);
				item3.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p);
				
				edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=1;exitY=0.5;entryX=0;entryY=0.5;endArrow=none;dashed=0;html=1;strokeWidth=1;endFill=1;endSize=2;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	item1.insertEdge(edge1, true);
		    	item2.insertEdge(edge1, false);
				edge1.style += getStrokeColor(p, a); 

				select.push(graph.addCell(edge1, null, null, null, null));

				edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=1;exitY=0.5;entryX=0;entryY=0.5;endArrow=block;startArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=2;startFill=1;startSize=2;');
		    	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	item2.insertEdge(edge2, true);
		    	item3.insertEdge(edge2, false);

				select.push(graph.addCell(edge2, null, null, null, null));
				
				break;
				
			case 'EIMessageBlock' :
			case 'EICommandMessageBlock' :
			case 'EIDocumentMessageBlock' :
			case 'EIEventMessageBlock' :
				v.style += 'strokeColor=none;fillColor=none;verticalLabelPosition=bottom;verticalAlign=top;' +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(0, 0, 17, 17), 'shape=ellipse;fillColor=#808080;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				var messagesNum = p.Messages;
				var oneH = (h - 17) / messagesNum;
				var item2 = new Array();
				var edge = new Array();
				
				for (var i = 0; i < messagesNum; i++)
				{
					var currY = oneH * (i + 1) - 3;
 					item2[i] = new mxCell('', new mxGeometry(w - 20, currY, 20, 20), 'part=1;');
					item2[i].vertex = true;
					v.insert(item2[i]);
					
					item2[i].style += 
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p) +
						getStrokeStyle(p);

					switch(obj.Class)
					{
						case 'EIMessageBlock' :
							item2[i].value = convertText(p['message_' + (i + 1)]);
							item2.style += getLabelStyle(p['message_' + (i + 1)]);

							break;
						case 'EICommandMessageBlock' :
							item2[i].value = 'C';
							item2[i].style += 'fontStyle=1;fontSize=' + defaultFontSize + ';';
							break;
						case 'EIDocumentMessageBlock' :
							item2[i].value = 'D';
							item2[i].style += 'fontStyle=1;fontSize=' + defaultFontSize + ';';
							break;
						case 'EIEventMessageBlock' :
							item2[i].value = 'E';
							item2[i].style += 'fontStyle=1;fontSize=' + defaultFontSize + ';';
							break;
					}

					edge[i] = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;');
			    	edge[i].geometry.relative = true;
			    	edge[i].edge = true;
			    	item1.insertEdge(edge[i], false);
			    	item2[i].insertEdge(edge[i], true);
					edge[i].style += 
						getStrokeColor(p, a) + 
						getStrokeWidth(p);

					var wp = new Array();
					wp.push(new mxPoint(x + 8.5, y + currY + 10));
					
					edge[i].geometry.points = wp;
					select.push(graph.addCell(edge[i], null, null, null, null));
				}

				break;
				
			case 'EIMessageEndpointBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.45, h * 0.25, w * 0.3, h * 0.5), 'part=1;');
				item1.vertex = true;
				v.insert(item1);
	
				item1.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p);
	
			   	var edge = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;rounded=0;endArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=6;');
			   	edge.geometry.relative = true;
		    	edge.edge = true;
		    	
		    	addFloatingEdge(0, h * 0.5, w * 0.4, h * 0.5, edge, select, graph, cells, v, cell);
		    	
				break;
			case 'EIPublishSubscribeChannelBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;rounded=0;endArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=6;');
			   	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	addFloatingEdge(w * 0.05, h * 0.5, w * 0.85, h * 0.5, edge1, select, graph, cells, v, cell);
		    	
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;rounded=0;endArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=6;');
			   	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	addFloatingEdge(w * 0.05, h * 0.5, w * 0.85, h * 0.15, edge2, select, graph, cells, v, cell);
		    	
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;rounded=0;endArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=6;');
			   	edge3.geometry.relative = true;
		    	edge3.edge = true;
		    	addFloatingEdge(w * 0.05, h * 0.5, w * 0.85, h * 0.85, edge3, select, graph, cells, v, cell);
	    	
				break;
				
			case 'EIMessageBusBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;rounded=0;endArrow=block;dashed=0;html=1;strokeWidth=1;endFill=1;endSize=4;startArrow=block;startFill=1;startSize=4;');
			   	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	edge1.style += getStrokeColor(p, a);
		    	addFloatingEdge(w * 0.05, h * 0.5, w * 0.95, h * 0.5, edge1, select, graph, cells, v, cell);
		    	
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;rounded=0;endArrow=block;dashed=0;html=1;strokeWidth=1;endFill=1;endSize=4;startArrow=block;startFill=1;startSize=4;');
			   	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	edge2.style += getStrokeColor(p, a);
		    	addFloatingEdge(w * 0.3, h * 0.1, w * 0.3, h * 0.5, edge2, select, graph, cells, v, cell);
		    	
			   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;rounded=0;endArrow=block;dashed=0;html=1;strokeWidth=1;endFill=1;endSize=4;startArrow=block;startFill=1;startSize=4;');
			   	edge3.geometry.relative = true;
		    	edge3.edge = true;
		    	edge3.style += getStrokeColor(p, a);
		    	addFloatingEdge(w * 0.7, h * 0.1, w * 0.7, h * 0.5, edge3, select, graph, cells, v, cell);
		    	
			   	var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;rounded=0;endArrow=block;dashed=0;html=1;strokeWidth=1;endFill=1;endSize=4;startArrow=block;startFill=1;startSize=4;');
			   	edge4.geometry.relative = true;
		    	edge4.edge = true;
		    	edge4.style += getStrokeColor(p, a);
		    	addFloatingEdge(w * 0.5, h * 0.5, w * 0.5, h * 0.9, edge4, select, graph, cells, v, cell);
	    	
				break;
				
			case 'EIRequestReplyBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.2, h * 0.21, w * 0.16, h * 0.24), 'part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p);

			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;rounded=0;endArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=6;');
			   	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	
		    	addFloatingEdge(w * 0.45, h * 0.33, w * 0.8, h * 0.33, edge1, select, graph, cells, v, cell);
		    	
				var item2 = new mxCell('', new mxGeometry(w * 0.64, h * 0.55, w * 0.16, h * 0.24), 'part=1;');
				item2.vertex = true;
				v.insert(item2);
				item2.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p);

			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=none;rounded=0;endArrow=block;dashed=0;html=1;strokeColor=#818181;strokeWidth=1;endFill=1;endSize=6;');
			   	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	
		    	addFloatingEdge(w * 0.55, h * 0.67, w * 0.2, h * 0.67, edge2, select, graph, cells, v, cell);
		    	
				break;

			case 'EIReturnAddressBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.1, h * 0.15, w * 0.8, h * 0.7), 'part=1;shape=mxgraph.eip.retAddr;fillColor=#FFE040;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p);
				
				break;
				
			case 'EICorrelationIDBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.04, h * 0.06, w * 0.18, h * 0.28), 'shape=ellipse;fillColor=#808080;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				item2 = new mxCell('', new mxGeometry(w * 0.2, h * 0.56, w * 0.2, h * 0.32), 'part=1;');
				item2.vertex = true;
				v.insert(item2);
				item2.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p);

				item2.value = 'A';
				item2.style += 'fontStyle=1;fontSize=' + defaultFontSize + ';';

				edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;part=1;');
		    	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	item1.insertEdge(edge1, false);
		    	item2.insertEdge(edge1, true);
				edge1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				var wp = new Array();
				wp.push(new mxPoint(x + w * 0.13, y + h * 0.72));
				
				edge1.geometry.points = wp;
				select.push(graph.addCell(edge1, null, null, null, null));
	
				var item3 = new mxCell('', new mxGeometry(w * 0.6, h * 0.06, w * 0.18, h * 0.28), 'shape=ellipse;fillColor=#808080;part=1;');
				item3.vertex = true;
				v.insert(item3);
				item3.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				item4 = new mxCell('', new mxGeometry(w * 0.76, h * 0.56, w * 0.2, h * 0.32), 'part=1;');
				item4.vertex = true;
				v.insert(item4);
				item4.style += 
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p);

				item4.value = 'B';
				item4.style += 'fontStyle=1;fontSize=' + defaultFontSize + ';';

				edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;part=1;');
		    	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	item3.insertEdge(edge2, false);
		    	item4.insertEdge(edge2, true);
				edge2.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				var wp2 = new Array();
				wp2.push(new mxPoint(x + w * 0.69, y + h * 0.72));
				
				edge2.geometry.points = wp2;
				select.push(graph.addCell(edge2, null, null, null, null));
	
				edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;endArrow=block;endFill=1;endSize=6;part=1;');
		    	edge3.geometry.relative = true;
		    	edge3.edge = true;
		    	item1.insertEdge(edge3, false);
		    	item3.insertEdge(edge3, true);
				edge3.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				select.push(graph.addCell(edge3, null, null, null, null));
				
				break;

			case 'EIMessageSequenceBlock' :
				
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('1', new mxGeometry(w * 0.2, h * 0.4, w * 0.1, h * 0.19), 'fontStyle=1;fontSize=' + defaultFontSize + ';part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				var item2 = new mxCell('2', new mxGeometry(w * 0.45, h * 0.4, w * 0.1, h * 0.19), 'fontStyle=1;fontSize=' + defaultFontSize + ';part=1;');
				item2.vertex = true;
				v.insert(item2);
				item2.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				var item3 = new mxCell('3', new mxGeometry(w * 0.7, h * 0.4, w * 0.1, h * 0.19), 'fontStyle=1;fontSize=' + defaultFontSize + ';part=1;');
				item3.vertex = true;
				v.insert(item3);
				item3.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'curved=1;endArrow=block;html=1;endSize=3;part=1;');
				item1.insertEdge(edge1, false);
				item2.insertEdge(edge1, true);
				
				edge1.geometry.points = [new mxPoint(x + w * 0.375, y + h * 0.15)];
				edge1.geometry.relative = true;
				edge1.edge = true;
				edge1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge1, null, null, null, null));
				
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'curved=1;endArrow=block;html=1;endSize=3;part=1;');
				item2.insertEdge(edge2, false);
				item3.insertEdge(edge2, true);
				edge2.geometry.points = [new mxPoint(x + w * 0.675, y + h * 0.15)];
				edge2.geometry.relative = true;
				edge2.edge = true;
				edge2.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge2, null, null, null, null));
				
				break;
				
			case 'EIMessageExpirationBlock' :
				
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.3, h * 0.2, w * 0.4, h * 0.6), 'shape=mxgraph.ios7.icons.clock;flipH=1;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				break;
				
			case 'EIMessageBrokerBlock' :
				v.style += 'strokeColor=none;fillColor=none;verticalLabelPosition=bottom;verticalAlign=top;' +
					getFontSize(p) +
					getFontColor(p) + 
					getFontStyle(p) +
					getTextAlignment(p); 
				
				v.value = convertText(p.Text);

				var item1 = new mxCell('', new mxGeometry(w * 0.38, h * 0.42, w * 0.24, h * 0.16), 'part=1;fillColor=#aefe7d;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				var item2 = new mxCell('', new mxGeometry(w * 0.38, 0, w * 0.24, h * 0.16), 'part=1;');
				item2.vertex = true;
				v.insert(item2);
				item2.style += 
					getFillColor(p, a) + 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				var item3 = new mxCell('', new mxGeometry(w * 0.76, h * 0.23, w * 0.24, h * 0.16), 'part=1;');
				item3.vertex = true;
				v.insert(item3);
				item3.style = item2.style;

				var item4 = new mxCell('', new mxGeometry(w * 0.76, h * 0.61, w * 0.24, h * 0.16), 'part=1;');
				item4.vertex = true;
				v.insert(item4);
				item4.style = item2.style;

				var item5 = new mxCell('', new mxGeometry(w * 0.38, h * 0.84, w * 0.24, h * 0.16), 'part=1;');
				item5.vertex = true;
				v.insert(item5);
				item5.style = item2.style;

				var item6 = new mxCell('', new mxGeometry(0, h * 0.61, w * 0.24, h * 0.16), 'part=1;');
				item6.vertex = true;
				v.insert(item6);
				item6.style = item2.style;

				var item7 = new mxCell('', new mxGeometry(0, h * 0.23, w * 0.24, h * 0.16), 'part=1;');
				item7.vertex = true;
				v.insert(item7);
				item7.style = item2.style;

				var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;part=1;');
				item1.insertEdge(edge1, false);
				item2.insertEdge(edge1, true);
				edge1.edge = true;
				edge1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge1, null, null, null, null));
				
				var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;part=1;');
				item1.insertEdge(edge2, false);
				item3.insertEdge(edge2, true);
				edge2.edge = true;
				edge2.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge2, null, null, null, null));
				
				var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;part=1;');
				item1.insertEdge(edge3, false);
				item4.insertEdge(edge3, true);
				edge3.edge = true;
				edge3.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge3, null, null, null, null));
				
				var edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;part=1;');
				item1.insertEdge(edge4, false);
				item5.insertEdge(edge4, true);
				edge4.edge = true;
				edge4.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge4, null, null, null, null));
				
				var edge5 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;part=1;');
				item1.insertEdge(edge5, false);
				item6.insertEdge(edge5, true);
				edge5.edge = true;
				edge5.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge5, null, null, null, null));
				
				var edge6 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'endArrow=none;part=1;');
				item1.insertEdge(edge6, false);
				item7.insertEdge(edge6, true);
				edge6.edge = true;
				edge6.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				select.push(graph.addCell(edge6, null, null, null, null));

				break;
			case 'EIDurableSubscriberBlock' :	
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;rounded=0;endArrow=block;endFill=1;endSize=6;');
			   	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	addFloatingEdge(w * 0.05, h * 0.5, w * 0.6, h * 0.25, edge1, select, graph, cells, v, cell);
		    	
			   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=elbowEdgeStyle;rounded=0;endArrow=block;endFill=1;endSize=6;');
			   	edge2.geometry.relative = true;
		    	edge2.edge = true;
		    	addFloatingEdge(w * 0.05, h * 0.5, w * 0.6, h * 0.75, edge2, select, graph, cells, v, cell);
		    	
				var item1 = new mxCell('', new mxGeometry(w * 0.7, h * 0.1, w * 0.15, h * 0.32), 'shape=mxgraph.eip.durable_subscriber;part=1;fillColor=#818181;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				break;
				
			case 'EIControlBusBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.25, h * 0.25, w * 0.5, h * 0.5), 'shape=mxgraph.eip.control_bus;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
	
				break;
				
			case 'EIMessageHistoryBlock' :
				v.style += 'strokeColor=none;fillColor=none;verticalLabelPosition=bottom;verticalAlign=top;' +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(0, 0, 17, 17), 'shape=ellipse;fillColor=#808080;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				var item3 = new mxCell('', new mxGeometry(w - 45, 30, 30, 20), 'shape=mxgraph.mockup.misc.mail2;fillColor=#FFE040;part=1;');
				item3.vertex = true;
				v.insert(item3);
				item3.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;');
		    	edge3.geometry.relative = true;
		    	edge3.edge = true;
		    	item1.insertEdge(edge3, false);
		    	item3.insertEdge(edge3, true);
				edge3.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				edge3.geometry.points = [new mxPoint(x + 8.5, y + 40)];
				select.push(graph.addCell(edge3, null, null, null, null));

				var item4 = new mxCell('', new mxGeometry(w - 45, h - 20, 20, 20), 'part=1;');
				item4.vertex = true;
				v.insert(item4);
				item4.value = convertText(p.message_0);
				item4.style += getLabelStyle(p.message_0);
				
				item4.style += 
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getStrokeStyle(p);

				edge4 = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;');
		    	edge4.geometry.relative = true;
		    	edge4.edge = true;

		    	item1.insertEdge(edge4, false);
		    	item4.insertEdge(edge4, true);
				edge4.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);

				edge4.geometry.points = [new mxPoint(x + 8.5, y + h - 10)];
				select.push(graph.addCell(edge4, null, null, null, null));

				var messagesNum = p.HistoryMessages;
				var oneH = (h - 75) / messagesNum;
				var item2 = new Array();
				var edge = new Array();
				
				for (var i = 0; i < messagesNum; i++)
				{
					var currY = oneH * (i + 1) + 30;
						item2[i] = new mxCell('', new mxGeometry(w - 20, currY, 20, 20), 'part=1;');
					item2[i].vertex = true;
					item2[i].value = convertText(p['message_' + (i + 1)]);
					item2.style += getLabelStyle(p['message_' + (i + 1)]);
					v.insert(item2[i]);
					
					item2[i].style += 
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
	
					edge[i] = new mxCell('', new mxGeometry(0, 0, 0, 0), 'edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0;exitY=0.5;endArrow=none;dashed=0;html=1;');
			    	edge[i].geometry.relative = true;
			    	edge[i].edge = true;
			    	item3.insertEdge(edge[i], false);
			    	item2[i].insertEdge(edge[i], true);
					edge[i].style += 
						getStrokeColor(p, a) + 
						getStrokeWidth(p);
	
					var wp = new Array();
					wp.push(new mxPoint(x + w - 30, y + currY + 10));
					
					edge[i].geometry.points = wp;
					select.push(graph.addCell(edge[i], null, null, null, null));
				}
	
				break;
				
			case 'Equation' :
				break;
			case 'fpDoor' :
				v.style += 'shape=mxgraph.floorplan.doorRight;' +
					getStrokeColor(p, a) + 
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeWidth(p) +
					getRotation(p, a, v)
					getStrokeStyle(p);

				if (p.DoorAngle < 0)
				{
					v.style += 'flipV=1;'
				}
				
				break;
				
			case 'fpDoubleDoor' :
				v.style += 'shape=mxgraph.floorplan.doorDouble;' +
				getStrokeColor(p, a) + 
				getOpacity(p, a) + 
				getShadow(p) +
				getStrokeWidth(p) +
				getRotation(p, a, v) + 
				getStrokeStyle(p);

			if (p.DoorAngle > 0)
			{
				v.style += 'flipV=1;'
			}
			
				break;
				
			case 'fpRestroomLights' :
				v.style += 'strokeColor=none;fillColor=none;' +
					getRotation(p, a, v); 
				
				var item1 = new mxCell('', new mxGeometry(0, 0, w, h * 0.25), 'part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p);

				var item2 = new Array();
				var lightOffset = w * 0.02;
				var lightW = (w - lightOffset * 2) / p.LightCount;
				var trueW = lightW * 0.8;
				
				for (var i = 0; i < p.LightCount; i++)
				{
					item2[i] = new mxCell('', new mxGeometry(lightOffset + lightW * i + (lightW - trueW) / 2, h * 0.25, trueW, h * 0.75), 'part=1;shape=ellipse;');
					item2[i].vertex = true;
					v.insert(item2[i]);
					item2[i].style += 
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeStyle(p);
				}
				
				break;
				
			case 'fpRestroomSinks' :
				v.style += 'strokeColor=none;fillColor=none;' +
				getRotation(p, a, v); 
				
				var item1 = new Array();
				var sinkW = w / p.SinkCount;
				
				for (var i = 0; i < p.SinkCount; i++)
				{
					item1[i] = new mxCell('', new mxGeometry(sinkW * i, 0, sinkW, h), 'part=1;shape=mxgraph.floorplan.sink_2;');
					item1[i].vertex = true;
					v.insert(item1[i]);
					item1[i].style += 
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getOpacity(p, a) + 
						getShadow(p) +
						getStrokeStyle(p);
				}
				
				break;
				
			case 'fpRestroomStalls' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				var wallW = w * 0.1 / p.StallCount;
				
				var item1 = new mxCell('', new mxGeometry(0, 0, wallW, h), 'fillColor=#000000;part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				var stallW = (w - wallW) / p.StallCount;
				
				var wall = new Array();
				var toilet = new Array();
				var door = new Array();
				var paper = new Array();
				
				var fc = getStrokeColor(p, a);
				
				if (fc == '')
				{
					fc = '#000000;'
				}
				else
				{
					fc = fc.replace('stokreColor=', '');
				}
				
				var wallStyle = 'part=1;fillColor=' + fc + 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				var otherStyle = 
					getFillColor(p, a) + 
					getStrokeColor(p, a) + 
					getStrokeWidth(p);
				
				for (var i = 0; i < p.StallCount; i++)
				{
					wall[i] = new mxCell('', new mxGeometry((i + 1) * stallW, 0, wallW, h), wallStyle);
					wall[i].vertex = true;
					v.insert(wall[i]);

					door[i] = new mxCell('', new mxGeometry(wallW + i * stallW + (stallW - wallW) * 0.05, h - (stallW - wallW) * 0.92, (stallW - wallW) * 0.9, (stallW - wallW) * 0.92), 'shape=mxgraph.floorplan.doorRight;flipV=1;part=1;');
					door[i].vertex = true;
					v.insert(door[i]);
					door[i].style += otherStyle;
					
					toilet[i] = new mxCell('', new mxGeometry(wallW + i * stallW + (stallW - wallW) * 0.2, 0, (stallW - wallW) * 0.6, (stallW - wallW) * 0.8), 'shape=mxgraph.floorplan.toilet;part=1;');
					toilet[i].vertex = true;
					v.insert(toilet[i]);
					toilet[i].style += otherStyle;
					
					paper[i] = new mxCell('', new mxGeometry(wallW + i * stallW, h * 0.42, (stallW - wallW) * 0.15, (stallW - wallW) * 0.12), 'part=1;');
					paper[i].vertex = true;
					v.insert(paper[i]);
					paper[i].style += otherStyle;
				}
				
				break;
			case 'PEOneToMany' :
				v.style += 'strokeColor=none;fillColor=none;';
				
		    	var edgeStyle = 'edgeStyle=none;endArrow=none;part=1;' +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p);

				var fc = getStrokeColor(p, a);
				
				if (fc == '')
				{
					fc = '#000000;'
				}
				else
				{
					fc = fc.replace('stokreColor=', '');
				}
				
				var endStyle = 'shape=triangle;part=1;fillColor=' + fc +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p);
		    	
			   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), edgeStyle);
			   	edge1.geometry.relative = true;
		    	edge1.edge = true;
		    	
		    	addFloatingEdge(0, h * 0.5, w * 0.65, h * 0.5, edge1, select, graph, cells, v, cell);
		    	
		    	var itemH = h / p.numLines;
		    	var edge2 = new Array();
		    	var endArrow = new Array();
		    	
		    	for (var i = 0; i < p.numLines; i++)
		    	{
				   	edge2[i] = new mxCell('', new mxGeometry(0, 0, 0, 0), edgeStyle);
				   	edge2[i].geometry.relative = true;
			    	edge2[i].edge = true;
			    	
			    	addFloatingEdge(w * 0.65, h * 0.5, w * 0.96, (i + 0.5) * itemH, edge2[i], select, graph, cells, v, cell);

			    	endArrow[i] = new mxCell('', new mxGeometry(w * 0.95, (i + 0.2) * itemH, w * 0.05, itemH * 0.6), endStyle);
			    	endArrow[i].vertex = true;
					v.insert(endArrow[i]);
		    	}
				
				break;
				
			case 'PEMultilines' :
				v.style += 'strokeColor=none;fillColor=none;';
				
		    	var edgeStyle = 'edgeStyle=none;endArrow=none;part=1;' +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p);

				var fc = getStrokeColor(p, a);
				
				if (fc == '')
				{
					fc = '#000000;'
				}
				else
				{
					fc = fc.replace('stokreColor=', '');
				}
				
				var endStyle = 'shape=triangle;part=1;fillColor=' + fc +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p);
		    	
		    	var itemH = h / p.numLines;
		    	var edge2 = new Array();
		    	var endArrow = new Array();
		    	
		    	for (var i = 0; i < p.numLines; i++)
		    	{
				   	edge2[i] = new mxCell('', new mxGeometry(0, 0, 0, 0), edgeStyle);
				   	edge2[i].geometry.relative = true;
			    	edge2[i].edge = true;
			    	
			    	addFloatingEdge(0, (i + 0.5) * itemH, w * 0.96, (i + 0.5) * itemH, edge2[i], select, graph, cells, v, cell);

			    	endArrow[i] = new mxCell('', new mxGeometry(w * 0.95, (i + 0.2) * itemH, w * 0.05, itemH * 0.6), endStyle);
			    	endArrow[i].vertex = true;
					v.insert(endArrow[i]);
		    	}
				
				break;
				
			case 'PEVesselBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) +
					getFillColor(p,a) +
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
					
					v.value = convertText(p.Text);
				
				switch (p.vesselType)
				{
					case 1 :
						v.style += 'shape=mxgraph.pid.vessels.pressurized_vessel;';
						break;
					case 2 :
						v.style += 'shape=hexagon;perimeter=hexagonPerimeter2;size=0.10;direction=south;';
						break;
				}
				
				break;
				
			case 'PEClosedTankBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) +
					getFillColor(p,a) +
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
					
					v.value = convertText(p.Text);

				if (p.peakedRoof == 1 && p.stumpType == 0)
				{
					v.style += 'shape=mxgraph.pid.vessels.tank_(conical_roof);';
				}
				else if (p.stumpType == 1)
				{
					v.style += 'shape=mxgraph.pid.vessels.tank_(boot);';
				}
				
				break;
				
			case 'PEColumnBlock' :
				v.style += 'verticalLabelPosition=bottom;verticalAlign=top;' +
					getStrokeColor(p, a) +
					getFillColor(p,a) +
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p) +
					getLabelStyle(p);
					
					v.value = convertText(p.Text);

				if (p.columnType == 0)
				{
					v.style += 'shape=mxgraph.pid.vessels.pressurized_vessel;';
				}
				else
				{
					v.style += 'shape=mxgraph.pid.vessels.tank;';
				}
				
				break;
				
			case 'PECompressorTurbineBlock' :
				v.style += 'strokeColor=none;fillColor=none;' + 
					getRotation(p, a, v) + 
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var st = 
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getShadow(p) +
					getStrokeStyle(p);
				
				var item1 = new mxCell('', new mxGeometry(0, h * 0.2, w, h * 0.6), 'part=1;shape=trapezoid;perimeter=trapezoidPerimeter;direction=south;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += st; 

				st += 'endSize=4;endArrow=block;endFill=1;';
				
				if (p.compressorType == 0)
				{
				   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), '');
				   	edge1.geometry.relative = true;
			    	edge1.edge = true;
					edge1.style += st; 
			    	
			    	addFloatingEdge(0, 0, 0, h * 0.2, edge1, select, graph, cells, v, cell);
					
				   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), '');
				   	edge2.geometry.relative = true;
			    	edge2.edge = true;
					edge2.style += st; 
			    	
			    	addFloatingEdge(w, h * 0.67, w, h, edge2, select, graph, cells, v, cell);
				}
				else
				{
					
					item1.style += 'flipH=1;'
				   	var edge1 = new mxCell('', new mxGeometry(0, 0, 0, 0), '');
				   	edge1.geometry.relative = true;
			    	edge1.edge = true;
					edge1.style += st; 
			    	
			    	addFloatingEdge(0, 0, 0, h * 0.33, edge1, select, graph, cells, v, cell);
					
				   	var edge2 = new mxCell('', new mxGeometry(0, 0, 0, 0), '');
				   	edge2.geometry.relative = true;
			    	edge2.edge = true;
					edge2.style += st; 
			    	
			    	addFloatingEdge(w, h * 0.8, w, h, edge2, select, graph, cells, v, cell);
				}

		    	if (p.centerLineType == 1)
		    	{
				   	var edge3 = new mxCell('', new mxGeometry(0, 0, 0, 0), '');
				   	edge3.geometry.relative = true;
			    	edge3.edge = true;
					edge3.style += st; 
			    	
			    	addFloatingEdge(w * 0.2, h * 0.5, w * 0.8, h * 0.5, edge3, select, graph, cells, v, cell);
		    	}
		    	
				break;
				
			case 'PEMotorDrivenTurbineBlock' :
				var st = 
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getOpacity(p, a) + 
					getStrokeStyle(p);
				
				v.style += 'shape=ellipse;' + 
					getShadow(p) +
					getRotation(p, a, v) +
					getLabelStyle(p);
				
				v.value = convertText(p.Text);
				
				var item1 = new mxCell('', new mxGeometry(w * 0.2, h * 0.2, w * 0.6, h * 0.6), 'part=1;shape=trapezoid;perimeter=trapezoidPerimeter;direction=south;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += st; 
			
				break;
				
			case 'PEFanBlades2Block' :
				break;
			case 'PECentrifugalPumpBlock' :
				break;
			case 'PEIndicatorBlock' :
			case 'PEIndicator2Block' :
			case 'PESharedIndicatorBlock' :
			case 'PEComputerIndicatorBlock' :
			case 'PESharedIndicator2Block' :
			case 'PEProgrammableIndicatorBlock' :
				var st = getOpacity(p, a);
				
				v.style += st +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v);
				
				switch(obj.Class)
				{
					case 'PEIndicatorBlock' :
						v.style += 'shape=mxgraph.pid2inst.discInst;';
						break;
					case 'PEIndicator2Block' :
						v.style += 'shape=mxgraph.pid2inst.indicator;indType=inst;';
						break;
					case 'PESharedIndicatorBlock' :
						v.style += 'shape=mxgraph.pid2inst.sharedCont;';
						break;
					case 'PEComputerIndicatorBlock' :
						v.style += 'shape=mxgraph.pid2inst.compFunc;';
						break;
					case 'PESharedIndicator2Block' :
						v.style += 'shape=mxgraph.pid2inst.indicator;indType=ctrl;';
						break;
					case 'PEProgrammableIndicatorBlock' :
						v.style += 'shape=mxgraph.pid2inst.progLogCont;';
						break;
				}
				
				if (obj.Class == 'PEIndicator2Block' || obj.Class == 'PESharedIndicator2Block')
				{
					//scale labels to width
					var item1 = new mxCell('', new mxGeometry(0, 0, w, w * 0.5), 'part=1;strokeColor=none;fillColor=none;');
					item1.vertex = true;
					v.insert(item1);
					item1.style += st +
						getLabelStyle(p.TopText);
					
					item1.value = convertText(p.TopText);
					
					var item2 = new mxCell('', new mxGeometry(0, w * 0.5, w, w * 0.5), 'part=1;strokeColor=none;fillColor=none;');
					item2.vertex = true;
					v.insert(item2);
					item2.style += st; 
						getLabelStyle(p.BotText);
					
					item2.value = convertText(p.BotText);
				}
				else
				{
					//scale labels as usual
					var item1 = new mxCell('', new mxGeometry(0, 0, w, h * 0.5), 'part=1;strokeColor=none;fillColor=none;');
					item1.vertex = true;
					v.insert(item1);
					item1.style += st +
						getLabelStyle(p.TopText);
					
					item1.value = convertText(p.TopText);
					
					var item2 = new mxCell('', new mxGeometry(0, h * 0.5, w, h * 0.5), 'part=1;strokeColor=none;fillColor=none;');
					item2.vertex = true;
					v.insert(item2);
					item2.style += st; 
						getLabelStyle(p.BotText);
					
					item2.value = convertText(p.BotText);
				}
				
				switch(p.instrumentLocation)
				{
					case 0 :
						v.style += 'mounting=field;';
						break;
					case 1 :
						v.style += 'mounting=inaccessible;';
						break;
					case 2 :
						v.style += 'mounting=room;';
						break;
					case 3 :
						v.style += 'mounting=local;';
						break;
				}
				
				break;
				
			case 'PEGateValveBlock' :
			case 'PEGlobeValveBlock' :
			case 'PEAngleValveBlock' :
			case 'PEAngleGlobeValveBlock' :
			case 'PEPoweredValveBlock' :
				
				var actuator = false;
				
				if (obj.Class == 'PEPoweredValveBlock')
				{
					if (p.poweredHandOperated != 1)
					{
						actuator = true;
					}
				}
				else
				{
					if (p.handOperated != 1)
					{
						actuator = true;
					}
				}

				if (actuator)
				{
					var p = getAction(obj).Properties;
					var b = p.BoundingBox;

					var oldH = b.h;
					
					if (obj.Class == 'PEAngleValveBlock' || obj.Class == 'PEAngleGlobeValveBlock')
					{
						b.h = b.h * 0.7;
					}
					else
					{
						b.h = b.h * 0.6;
					}
					
					v = new mxCell('', new mxGeometry(Math.round(b.x * scale + dx), Math.round((b.y + oldH - b.h) * scale + dy),
							Math.round(b.w * scale), Math.round(b.h * scale)), '');
				    v.vertex = true;
				    updateCell(v, obj);
				}
				
				if (obj.Class == 'PEPoweredValveBlock')
				{
					v.style += 'shape=mxgraph.pid2valves.valve;verticalLabelPosition=bottom;verticalAlign=top;' + 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getShadow(p) +
						getRotation(p, a, v);
					
						if (p.poweredHandOperated == 1)
						{
							v.style += 'valveType=gate;actuator=powered;';
							
							var item1 = new mxCell('', new mxGeometry(w * 0.325, 0, w * 0.35, h * 0.35), 'part=1;strokeColor=none;fillColor=none;spacingTop=2;');
							item1.vertex = true;
							v.insert(item1);
							item1.style += st +
								getOpacity(p, a) +
								getStrokeColor(p, a) + 
								getFillColor(p, a) +
								getStrokeWidth(p) +
								getStrokeStyle(p) +
								getShadow(p) +
								'fontSize=6;' +
								getFontColor(p.PoweredText) + 
								getFontStyle(p.PoweredText) +
								getTextAlignment(p.PoweredText) + 
								getTextLeftSpacing(p.PoweredText) +
								getTextRightSpacing(p.PoweredText) + 
								getTextBottomSpacing(p.PoweredText) + 
								getTextGlobalSpacing(p.PoweredText) +
								getTextVerticalAlignment(p.PoweredText);
							
							item1.value = convertText(p.PoweredText);
						}
						else
						{
							v.style += 'valveType=gate;';
						}
				}
				else
				{
					v.style += 'verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.pid2valves.valve;' +
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getShadow(p) +
						getRotation(p, a, v) +
						getFontSize(p) +
						getFontColor(p) + 
						getFontStyle(p) +
						getTextAlignment(p); 
					
					v.value = convertText(p.Text);
					
					switch (obj.Class)
					{
						case 'PEGateValveBlock' :
								v.style += 'valveType=gate;';
							break;
							
						case 'PEGlobeValveBlock' :
								v.style += 'valveType=globe;';
							break;
							
						case 'PEAngleValveBlock' :
								v.style += 'valveType=angle;';
							break;
							
						case 'PEAngleGlobeValveBlock' :
								v.style += 'valveType=angleGlobe;flipH=1;';
							break;
					}
					
					if (p.handOperated == 1)
					{
						v.style += 'actuator=man;';
					}
				}
				
				break;

			case 'UI2BrowserBlock' :
				v.style += 'shape=mxgraph.mockup.containers.browserWindow;mainText=;' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v);

				if (p.vScroll == 1)
				{
					if (p.hScroll == 1)
					{
						var item3 = new mxCell('', new mxGeometry(1, 0, 20, h - 130), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					else
					{
						var item3 = new mxCell('', new mxGeometry(1, 0, 20, h - 110), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					
				   	item3.geometry.relative = true;
				   	item3.geometry.offset = new mxPoint(-20, 110);
					item3.vertex = true;
					v.insert(item3);
					
					v.style += 'spacingRight=20;';
				}
				
				if (p.hScroll == 1)
				{
					if (p.vScroll == 1)
					{
						var item4 = new mxCell('', new mxGeometry(0, 1, w - 20, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					else
					{
						var item4 = new mxCell('', new mxGeometry(0, 1, w, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					
				   	item4.geometry.relative = true;
				   	item4.geometry.offset = new mxPoint(0, -20);
					item4.vertex = true;
					v.insert(item4);
				}
				
				break;
			case 'UI2WindowBlock' :
				v.style += 'shape=mxgraph.mockup.containers.window;mainText=;align=center;verticalAlign=top;spacing=5;' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v) +
					getFontSize(p.Title) +
					getFontColor(p.Title) + 
					getFontStyle(p.Title);

				v.value = convertText(p.Title);

				if (p.vScroll == 1)
				{
					if (p.hScroll == 1)
					{
						var item3 = new mxCell('', new mxGeometry(1, 0, 20, h - 50), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					else
					{
						var item3 = new mxCell('', new mxGeometry(1, 0, 20, h - 30), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					
				   	item3.geometry.relative = true;
				   	item3.geometry.offset = new mxPoint(-20, 30);
					item3.vertex = true;
					v.insert(item3);
					
					v.style += 'spacingRight=20;';
				}
				
				if (p.hScroll == 1)
				{
					if (p.vScroll == 1)
					{
						var item4 = new mxCell('', new mxGeometry(0, 1, w - 20, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					else
					{
						var item4 = new mxCell('', new mxGeometry(0, 1, w, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					
				   	item4.geometry.relative = true;
				   	item4.geometry.offset = new mxPoint(0, -20);
					item4.vertex = true;
					v.insert(item4);
				}
				
				break;
			case 'UI2DialogBlock' :
				v.style += 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v) +
					getLabelStyle(p.Text);

				v.value = convertText(p.Text);

				var item1 = new mxCell('', new mxGeometry(0, 0, w, 30), 'part=1;resizeHeight=0;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += st +
					getLabelStyle(p.Title);
				
				item1.value = convertText(p.Title);

				var item2 = new mxCell('', new mxGeometry(1, 0.5, 20, 20), 'part=1;shape=ellipse;strokeColor=#008cff;resizable=0;fillColor=none;html=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-25, -10);
				item2.vertex = true;
				item1.insert(item2);

				if (p.vScroll == 1)
				{
					if (p.hScroll == 1)
					{
						var item3 = new mxCell('', new mxGeometry(1, 0, 20, h - 50), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					else
					{
						var item3 = new mxCell('', new mxGeometry(1, 0, 20, h - 30), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					
				   	item3.geometry.relative = true;
				   	item3.geometry.offset = new mxPoint(-20, 30);
					item3.vertex = true;
					v.insert(item3);
					
					v.style += 'spacingRight=20;';
				}
				
				if (p.hScroll == 1)
				{
					if (p.vScroll == 1)
					{
						var item4 = new mxCell('', new mxGeometry(0, 1, w - 20, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					else
					{
						var item4 = new mxCell('', new mxGeometry(0, 1, w, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					
				   	item4.geometry.relative = true;
				   	item4.geometry.offset = new mxPoint(0, -20);
					item4.vertex = true;
					v.insert(item4);
				}
				
				break;
			case 'UI2AccordionBlock' :
				v.style += 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v);
				
				var item1 = new Array();
				var itemH = 25;
				
				for (var i = 0; i <= (p.Panels - 1); i++)
				{
					if (i < (p.Selected - 1))
					{
						item1[i] = new mxCell('', new mxGeometry(0, i * itemH, w, itemH), 'part=1;fillColor=#000000;fillOpacity=25;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getLabelStyle(p['Panel_' + (i + 1)]);
						
						item1[i].value = convertText(p['Panel_' + (i + 1)]);
					}
					else if (i == (p.Selected - 1))
					{
						item1[i] = new mxCell('', new mxGeometry(0, i * itemH, w, itemH), 'part=1;fillColor=none;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getLabelStyle(p['Panel_' + (i + 1)]);
						
						item1[i].value = convertText(p['Panel_' + (i + 1)]);
					}
					else
					{
						item1[i] = new mxCell('', new mxGeometry(0, h - (p.Panels - p.Selected) * itemH + (i - p.Selected) * itemH, w, itemH), 'part=1;fillColor=#000000;fillOpacity=25;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getLabelStyle(p['Panel_' + (i + 1)]);
						
						item1[i].value = convertText(p['Panel_' + (i + 1)]);
					}

					if (item1[i].style.indexOf(';align=') < 0)
					{
						item1[i].style += 'align=left;spacingLeft=5;';
					}
				}
				
				var fc2 = getStrokeColor(p, a);
				fc2 = fc2.replace('strokeColor', 'fillColor2');
				
				if (fc2 == '')
				{
					fc2 = 'fillColor2=#000000;'
				}
				
				if (p.vScroll == 1)
				{
					if (p.hScroll == 1)
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h - p.Selected * itemH -20 - (p.Panels - p.Selected) * itemH), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					else
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h - p.Selected * itemH - (p.Panels - p.Selected) * itemH), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					
				   	item2.geometry.relative = true;
				   	item2.geometry.offset = new mxPoint(-20, p.Selected * itemH);
					item2.vertex = true;
					v.insert(item2);
					
					v.style += 'spacingRight=20;';
					
					item2.style += fc2 +
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				if (p.hScroll == 1)
				{
					if (p.vScroll == 1)
					{
						var item3 = new mxCell('', new mxGeometry(0, 1, w - 20, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					else
					{
						var item3 = new mxCell('', new mxGeometry(0, 1, w, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					
				   	item3.geometry.relative = true;
				   	item3.geometry.offset = new mxPoint(0, -20 - (p.Panels - p.Selected) * itemH);
					item3.vertex = true;
					v.insert(item3);

					item3.style += fc2 + 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				if (p.vScroll == 1)
				{
					item4 = new mxCell('', new mxGeometry(0, p.Selected * itemH, w - 20, h - p.Selected * itemH -20 - (p.Panels - p.Selected) * itemH), 'part=1;fillColor=none;strokeColor=none;');
				}
				else
				{
					item4 = new mxCell('', new mxGeometry(0, p.Selected * itemH, w - 20, h - p.Selected * itemH - (p.Panels - p.Selected) * itemH), 'part=1;fillColor=none;strokeColor=none;');
				}
				item4.vertex = true;
				v.insert(item4);
				item4.style += 
					getLabelStyle(p['Content_1']);
				
				if (item4.style.indexOf(';align=') < 0)
				{
					item4.style += 'align=left;spacingLeft=5;';
				}
				
				item4.value = convertText(p['Content_1']);
				
				break;
			case 'UI2TabBarContainerBlock' :
				v.style += 'strokeColor=none;fillColor=none;';

				var item1 = new Array();
				var item2 = new Array();
				var itemH = 25;
				var itemS = 3; // tab spacing
				var itemW = (w + itemS) / (p.Tabs + 1);
				var startW = 10;
					
				var bg = new mxCell('', new mxGeometry(0, itemH, w, h - itemH), 'part=1;');
				bg.vertex = true;
				v.insert(bg);
				bg.style += 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v);
				
				for (var i = 0; i <= (p.Tabs - 1); i++)
				{
					if (i == (p.Selected - 1))
					{
						item2[i] = new mxCell('', new mxGeometry(startW + i * itemW, 0, itemW - itemS, itemH), '');
						item2[i].vertex = true;
						v.insert(item2[i]);
						item2[i].style += 
							getOpacity(p, a) +
							getStrokeColor(p, a) + 
							getFillColor(p, a) +
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getShadow(p) +
							getLabelStyle(p['Tab_' + (i + 1)]);
						
						item2[i].value = convertText(p['Tab_' + (i + 1)]);
					}
					else
					{
						item1[i] = new mxCell('', new mxGeometry(startW + i * itemW, 0, itemW - itemS, itemH), 'strokeColor=none;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getOpacity(p, a) +
							getFillColor(p, a) +
							getShadow(p);
						
						item2[i] = new mxCell('', new mxGeometry(0, 0, itemW - itemS, itemH), 'fillColor=#000000;fillOpacity=25;');
						item2[i].vertex = true;
						item1[i].insert(item2[i]);
						item2[i].style += 
							getStrokeColor(p, a) + 
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getLabelStyle(p['Tab_' + (i + 1)]);
						
						item2[i].value = convertText(p['Tab_' + (i + 1)]);
					}

					if (item2[i].style.indexOf(';align=') < 0)
					{
						item2[i].style += 'align=left;spacingLeft=2;';
					}
				}
				
				var fc2 = getStrokeColor(p, a);
				fc2 = fc2.replace('strokeColor', 'fillColor2');
				
				if (fc2 == '')
				{
					fc2 = 'fillColor2=#000000;'
				}
				
				if (p.vScroll == 1)
				{
					if (p.hScroll == 1)
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h -20 - itemH), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					else
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h - itemH), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					
				   	item2.geometry.relative = true;
				   	item2.geometry.offset = new mxPoint(-20, itemH);
					item2.vertex = true;
					v.insert(item2);
					
					v.style += 'spacingRight=20;';
					
					item2.style += fc2 +
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				if (p.hScroll == 1)
				{
					if (p.vScroll == 1)
					{
						var item3 = new mxCell('', new mxGeometry(0, 1, w - 20, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					else
					{
						var item3 = new mxCell('', new mxGeometry(0, 1, w, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					
				   	item3.geometry.relative = true;
				   	item3.geometry.offset = new mxPoint(0, -20);
					item3.vertex = true;
					v.insert(item3);

					item3.style += fc2 + 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				break;
				
			case 'UI2TabBar2ContainerBlock' :
				v.style += 'strokeColor=none;fillColor=none;';

				var item1 = new Array();
				var item2 = new Array();
				var itemH = 25; // tab height
				var itemS = 3; // tab spacing
				var itemW = (w + itemS) / p.Tabs; //tab width (including spacing)
					
				var bg = new mxCell('', new mxGeometry(0, itemH, w, h - itemH), 'part=1;');
				bg.vertex = true;
				v.insert(bg);
				bg.style += 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v);
				
				for (var i = 0; i <= (p.Tabs - 1); i++)
				{
					if (i == (p.Selected - 1))
					{
						item2[i] = new mxCell('', new mxGeometry(i * itemW, 0, itemW - itemS, itemH), '');
						item2[i].vertex = true;
						v.insert(item2[i]);
						item2[i].style += 
							getOpacity(p, a) +
							getStrokeColor(p, a) + 
							getFillColor(p, a) +
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getShadow(p) +
							getLabelStyle(p['Tab_' + (i + 1)]);
						
						item2[i].value = convertText(p['Tab_' + (i + 1)]);
					}
					else
					{
						item1[i] = new mxCell('', new mxGeometry(i * itemW, 0, itemW - itemS, itemH), 'strokeColor=none;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getOpacity(p, a) +
							getFillColor(p, a) +
							getShadow(p);
						
						item2[i] = new mxCell('', new mxGeometry(0, 0, itemW - itemS, itemH), 'fillColor=#000000;fillOpacity=25;');
						item2[i].vertex = true;
						item1[i].insert(item2[i]);
						item2[i].style += 
							getStrokeColor(p, a) + 
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getLabelStyle(p['Tab_' + (i + 1)]);
						
						item2[i].value = convertText(p['Tab_' + (i + 1)]);
					}

					if (item2[i].style.indexOf(';align=') < 0)
					{
						item2[i].style += 'align=left;spacingLeft=2;';
					}
				}
				
				var fc2 = getStrokeColor(p, a);
				fc2 = fc2.replace('strokeColor', 'fillColor2');
				
				if (fc2 == '')
				{
					fc2 = 'fillColor2=#000000;'
				}
				
				if (p.vScroll == 1)
				{
					if (p.hScroll == 1)
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h -20 - itemH), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					else
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h - itemH), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					
				   	item2.geometry.relative = true;
				   	item2.geometry.offset = new mxPoint(-20, itemH);
					item2.vertex = true;
					v.insert(item2);
					
					v.style += 'spacingRight=20;';
					
					item2.style += fc2 +
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				if (p.hScroll == 1)
				{
					if (p.vScroll == 1)
					{
						var item3 = new mxCell('', new mxGeometry(0, 1, w - 20, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					else
					{
						var item3 = new mxCell('', new mxGeometry(0, 1, w, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					
				   	item3.geometry.relative = true;
				   	item3.geometry.offset = new mxPoint(0, -20);
					item3.vertex = true;
					v.insert(item3);

					item3.style += fc2 + 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				break;
				
			case 'UI2VTabBarContainerBlock' :
				v.style += 'strokeColor=none;fillColor=none;';

				var item1 = new Array();
				var item2 = new Array();
				var itemS = 3; // tab spacing
				var itemH = 25 + itemS; // tab height (including spacing)
				var itemW = 80; //tab width
				var startH = 10;
					
				var bg = new mxCell('', new mxGeometry(itemW, 0, w - itemW, h), 'part=1;');
				bg.vertex = true;
				v.insert(bg);
				bg.style += 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v);
				
				for (var i = 0; i <= (p.Tabs - 1); i++)
				{
					if (i == (p.Selected - 1))
					{
						item2[i] = new mxCell('', new mxGeometry(0, startH + i * itemH, itemW, itemH - itemS), '');
						item2[i].vertex = true;
						v.insert(item2[i]);
						item2[i].style += 
							getOpacity(p, a) +
							getStrokeColor(p, a) + 
							getFillColor(p, a) +
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getShadow(p) +
							getLabelStyle(p['Tab_' + (i + 1)]);
						
						item2[i].value = convertText(p['Tab_' + (i + 1)]);
					}
					else
					{
						item1[i] = new mxCell('', new mxGeometry(0, startH + i * itemH, itemW, itemH - itemS), 'strokeColor=none;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getOpacity(p, a) +
							getFillColor(p, a) +
							getShadow(p);
						
						item2[i] = new mxCell('', new mxGeometry(0, 0, itemW, itemH - itemS), 'fillColor=#000000;fillOpacity=25;');
						item2[i].vertex = true;
						item1[i].insert(item2[i]);
						item2[i].style += 
							getStrokeColor(p, a) + 
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getLabelStyle(p['Tab_' + (i + 1)]);
						
						item2[i].value = convertText(p['Tab_' + (i + 1)]);
					}

					if (item2[i].style.indexOf(';align=') < 0)
					{
						item2[i].style += 'align=left;spacingLeft=2;';
					}
				}
				
				var fc2 = getStrokeColor(p, a);
				fc2 = fc2.replace('strokeColor', 'fillColor2');
				
				if (fc2 == '')
				{
					fc2 = 'fillColor2=#000000;'
				}
				
				if (p.vScroll == 1)
				{
					if (p.hScroll == 1)
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h -20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					else
					{
						var item2 = new mxCell('', new mxGeometry(1, 0, 20, h), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=95;direction=north;resizeHeight=1;');
					}
					
				   	item2.geometry.relative = true;
				   	item2.geometry.offset = new mxPoint(-20, 0);
					item2.vertex = true;
					v.insert(item2);
					
					v.style += 'spacingRight=20;';
					
					item2.style += fc2 +
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				if (p.hScroll == 1)
				{
					if (p.vScroll == 1)
					{
						var item3 = new mxCell('', new mxGeometry(itemW, 1, w - 20 - itemW, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					else
					{
						var item3 = new mxCell('', new mxGeometry(itemW, 1, w - itemW, 20), 'part=1;shape=mxgraph.mockup.navigation.scrollBar;barPos=5;resizeWidth=1;');
					}
					
				   	item3.geometry.relative = true;
				   	item3.geometry.offset = new mxPoint(0, -20);
					item3.vertex = true;
					v.insert(item3);

					item3.style += fc2 + 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p);
				}
				
				break;
			case 'UI2CheckBoxBlock' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				var itemH = h / p.Options;
				var item1 = new Array(); //checkbox
				var item2 = new Array(); //checkmark
				
				for (var i = 0; i < p.Options; i++)
				{
					item1[i] = new mxCell('', new mxGeometry(0, i * itemH + itemH * 0.5 - 5, 10, 10), 'labelPosition=right;part=1;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=3;');
					item1[i].vertex = true;
					v.insert(item1[i]);
					item1[i].style += 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getShadow(p) +
						getLabelStyle(p['Option_' + (i + 1)]);
					
					if (p.Selected[i + 1] != null)
					{
						if (p.Selected[i + 1] == 1)
						{
							var fc = getStrokeColor(p, a);
							fc = fc.replace('strokeColor', 'fillColor');
							
							if (fc == '')
							{
								fc = 'fillColor=#000000;'
							}
							
							item2[i] = new mxCell('', new mxGeometry(2, 2, 6, 6), 'shape=mxgraph.mscae.general.checkmark;part=1;');
							item2[i].vertex = true;
							item1[i].insert(item2[i]);
							item2[i].style += fc + 
								getOpacity(p, a) +
								getStrokeColor(p, a) + 
								getStrokeWidth(p) +
								getStrokeStyle(p);
						}
					}
					
					item1[i].value = convertText(p['Option_' + (i + 1)]);
				}
				
				break;
			case 'UI2HorizontalCheckBoxBlock' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				var itemW = w / p.Options;
				var item1 = new Array(); //checkbox
				var item2 = new Array(); //checkmark
				
				for (var i = 0; i < p.Options; i++)
				{
					item1[i] = new mxCell('', new mxGeometry(i * itemW, h * 0.5 - 5, 10, 10), 'labelPosition=right;part=1;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=3;');
					item1[i].vertex = true;
					v.insert(item1[i]);
					item1[i].style += 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getShadow(p) +
						getLabelStyle(p['Option_' + (i + 1)]);
					
					if (p.Selected[i + 1] != null)
					{
						if (p.Selected[i + 1] == 1)
						{
							var fc = getStrokeColor(p, a);
							fc = fc.replace('strokeColor', 'fillColor');
							
							if (fc == '')
							{
								fc = 'fillColor=#000000;'
							}
							
							item2[i] = new mxCell('', new mxGeometry(2, 2, 6, 6), 'shape=mxgraph.mscae.general.checkmark;part=1;');
							item2[i].vertex = true;
							item1[i].insert(item2[i]);
							item2[i].style += fc + 
								getOpacity(p, a) +
								getStrokeColor(p, a) + 
								getStrokeWidth(p) +
								getStrokeStyle(p);
						}
					}
					
					item1[i].value = convertText(p['Option_' + (i + 1)]);
				}
				
				break;
			case 'UI2RadioBlock' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				var itemH = h / p.Options;
				var item1 = new Array(); //checkbox
				var item2 = new Array(); //checkmark
				
				for (var i = 0; i < p.Options; i++)
				{
					item1[i] = new mxCell('', new mxGeometry(0, i * itemH + itemH * 0.5 - 5, 10, 10), 'shape=ellipse;labelPosition=right;part=1;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=3;');
					item1[i].vertex = true;
					v.insert(item1[i]);
					item1[i].style += 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getShadow(p) +
						getLabelStyle(p['Option_' + (i + 1)]);
					
					if (p.Selected != null)
					{
						if (p.Selected == (i + 1))
						{
							var fc = getStrokeColor(p, a);
							fc = fc.replace('strokeColor', 'fillColor');
							
							if (fc == '')
							{
								fc = 'fillColor=#000000;'
							}
							
							item2[i] = new mxCell('', new mxGeometry(2.5, 2.5, 5, 5), 'shape=ellipse;');
							item2[i].vertex = true;
							item1[i].insert(item2[i]);
							item2[i].style += fc + 
								getOpacity(p, a) +
								getStrokeColor(p, a) + 
								getStrokeWidth(p) +
								getStrokeStyle(p);
						}
					}
					
					item1[i].value = convertText(p['Option_' + (i + 1)]);
				}
				
				break;
			case 'UI2HorizontalRadioBlock' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				var itemW = w / p.Options;
				var item1 = new Array(); //checkbox
				var item2 = new Array(); //checkmark
				
				for (var i = 0; i < p.Options; i++)
				{
					item1[i] = new mxCell('', new mxGeometry(i * itemW, h * 0.5 - 5, 10, 10), 'shape=ellipse;labelPosition=right;part=1;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=3;');
					item1[i].vertex = true;
					v.insert(item1[i]);
					item1[i].style += 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getShadow(p) +
						getLabelStyle(p['Option_' + (i + 1)]);
					
					if (p.Selected != null)
					{
						if (p.Selected == (i + 1))
						{
							var fc = getStrokeColor(p, a);
							fc = fc.replace('strokeColor', 'fillColor');
							
							if (fc == '')
							{
								fc = 'fillColor=#000000;'
							}
							
							item2[i] = new mxCell('', new mxGeometry(2, 2, 6, 6), 'shape=ellipse;part=1;');
							item2[i].vertex = true;
							item1[i].insert(item2[i]);
							item2[i].style += fc + 
								getOpacity(p, a) +
								getStrokeColor(p, a) + 
								getStrokeWidth(p) +
								getStrokeStyle(p);
						}
					}
					
					item1[i].value = convertText(p['Option_' + (i + 1)]);
				}
				
				break;
				
			case 'UI2HSliderBlock' :
			case 'UI2VSliderBlock' :
				v.style += 'shape=mxgraph.mockup.forms.horSlider;sliderStyle=basic;handleStyle=handle;' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p);

				if (obj.Class == 'UI2VSliderBlock')
				{
					v.style += 'direction=south;';
				}
				
				v.style += 'sliderPos=' + (p.ScrollVal * 100) + ';';
				
				break;
				
			case 'UI2DatePickerBlock' :
				v.style += 'strokeColor=none;fillColor=none;';
				
				var item1 = new mxCell('', new mxGeometry(0, 0, w * 0.6, h), 'part=1;');
				item1.vertex = true;
				v.insert(item1);
				item1.style +=  
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getLabelStyle(p.Date);
				
				item1.value = convertText(p.Date);

				var fc = getStrokeColor(p, a);
				fc = fc.replace('strokeColor', 'fillColor');
				
				if (fc == '')
				{
					fc = 'fillColor=#000000;'
				}
				
				var item2 = new mxCell('', new mxGeometry(w * 0.75, 0, w * 0.25, h), 'part=1;shape=mxgraph.gmdl.calendar;');
				item2.vertex = true;
				v.insert(item2);
				item2.style += fc +  
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p);

				break;

			case 'UI2SearchBlock' :
				v.style += 'shape=mxgraph.mockup.forms.searchBox;mainText=;flipH=1;align=left;spacingLeft=26;' + 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getFontSize(p.Search) +
					getFontColor(p.Search) + 
					getFontStyle(p.Search);
				
				v.value = convertText(p.Search);
				
				break;

			case 'UI2NumericStepperBlock' :
				var fc = getStrokeColor(p, a);
				fc = fc.replace('strokeColor', 'fillColor');
				
				if (fc == '')
				{
					fc = 'fillColor=#000000;'
				}
				
				v.style += 'shape=mxgraph.mockup.forms.spinner;spinLayout=right;spinStyle=normal;adjStyle=triangle;mainText=;align=left;spacingLeft=8;' + fc + 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getFontSize(p.Number) +
					getFontColor(p.Number) + 
					getFontStyle(p.Number);
				
				v.value = convertText(p.Number);
				
				break;
				
			case 'UI2TableBlock' :
				break;
			case 'UI2ButtonBarBlock' :
				v.style +=
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p);

				var item1 = new Array();
				var item2 = new Array();
				var itemW = w / p.Buttons;
					
				for (var i = 0; i <= (p.Buttons - 1); i++)
				{
					if (i == (p.Selected - 1))
					{
						item2[i] = new mxCell('', new mxGeometry(i * itemW, 0, itemW, h), '');
						item2[i].vertex = true;
						v.insert(item2[i]);
						item2[i].style += 
							getOpacity(p, a) +
							getStrokeColor(p, a) + 
							getFillColor(p, a) +
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getShadow(p) +
							getLabelStyle(p['Button_' + (i + 1)]);
						
						item2[i].value = convertText(p['Button_' + (i + 1)]);
					}
					else
					{
						item1[i] = new mxCell('', new mxGeometry(i * itemW, 0, itemW, h), 'strokeColor=none;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getOpacity(p, a) +
							getFillColor(p, a) +
							getShadow(p);
						
						item2[i] = new mxCell('', new mxGeometry(0, 0, itemW, h), 'fillColor=#000000;fillOpacity=25;');
						item2[i].vertex = true;
						item1[i].insert(item2[i]);
						item2[i].style += 
							getStrokeColor(p, a) + 
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getLabelStyle(p['Button_' + (i + 1)]);
						
						item2[i].value = convertText(p['Button_' + (i + 1)]);
					}
				}
				
				break;
				
			case 'UI2VerticalButtonBarBlock' :
				v.style +=
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p);
	
				var item1 = new Array();
				var item2 = new Array();
				var itemH = h / p.Buttons;
					
				for (var i = 0; i <= (p.Buttons - 1); i++)
				{
					if (i == (p.Selected - 1))
					{
						item2[i] = new mxCell('', new mxGeometry(0, i * itemH, w, itemH), '');
						item2[i].vertex = true;
						v.insert(item2[i]);
						item2[i].style += 
							getOpacity(p, a) +
							getStrokeColor(p, a) + 
							getFillColor(p, a) +
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getShadow(p) +
							getLabelStyle(p['Button_' + (i + 1)]);
						
						item2[i].value = convertText(p['Button_' + (i + 1)]);
					}
					else
					{
						item1[i] = new mxCell('', new mxGeometry(0, i * itemH, w, itemH), 'strokeColor=none;');
						item1[i].vertex = true;
						v.insert(item1[i]);
						item1[i].style += 
							getOpacity(p, a) +
							getFillColor(p, a) +
							getShadow(p);
						
						item2[i] = new mxCell('', new mxGeometry(0, 0, w, itemH), 'fillColor=#000000;fillOpacity=25;');
						item2[i].vertex = true;
						item1[i].insert(item2[i]);
						item2[i].style += 
							getStrokeColor(p, a) + 
							getStrokeWidth(p) +
							getStrokeStyle(p) +
							getLabelStyle(p['Button_' + (i + 1)]);
						
						item2[i].value = convertText(p['Button_' + (i + 1)]);
					}
				}
				
				break;
			case 'UI2LinkBarBlock' :
				v.style += 'strokeColor=none;fillColor=none;' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p);

				var item1 = new Array();
				var item2 = new Array();
				var itemW = w / p.Links;
					
				for (var i = 0; i < (p.Links); i++)
				{
					if (i != 0)
					{
						item2[i] = new mxCell('', new mxGeometry(i * itemW, 0, itemW, h), 'shape=partialRectangle;top=0;bottom=0;right=0;fillColor=none;');
						item2[i].style += 
							getOpacity(p, a) +
							getShadow(p) +
							getStrokeColor(p, a) + 
							getStrokeWidth(p) +
							getStrokeStyle(p);
					}
					else
					{
						item2[i] = new mxCell('', new mxGeometry(i * itemW, 0, itemW, h), 'fillColor=none;strokeColor=none;');
					}
					
					item2[i].vertex = true;
					v.insert(item2[i]);
					item2[i].style += 
						getLabelStyle(p['Link_' + (i + 1)]);
					
					item2[i].value = convertText(p['Link_' + (i + 1)]);
				}
				
				break;
				
			case 'UI2BreadCrumbsBlock' :
				v.style += 'strokeColor=none;fillColor=none;' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p);

				var item1 = new Array();
				var item2 = new Array();
				var itemW = w / p.Links;
					
				for (var i = 0; i < (p.Links); i++)
				{
					item1[i] = new mxCell('', new mxGeometry(i * itemW, 0, itemW, h), 'fillColor=none;strokeColor=none;');
					item1[i].vertex = true;
					v.insert(item1[i]);
					item1[i].style += 
						getLabelStyle(p['Link_' + (i + 1)]);
					
					item1[i].value = convertText(p['Link_' + (i + 1)]);
				}
				
				for (var i = 1; i < (p.Links); i++)
				{
					item2[i] = new mxCell('', new mxGeometry(i / p.Links, 0.5, 6, 10), 'shape=mxgraph.ios7.misc.right;');
					item2[i].geometry.relative = true;
					item2[i].geometry.offset = new mxPoint(-3, -5);
					item2[i].vertex = true;
					v.insert(item2[i]);
				}
				
				break;
			case 'UI2MenuBarBlock' :
				v.style += 'strokeColor=none;' +
					getOpacity(p, a) +
					getFillColor(p, a) +
					getShadow(p);

				var item1 = new Array();
				var itemW = w / (p.Buttons + 1);
					
				for (var i = 0; i <= (p.Buttons - 1); i++)
				{
					if (i != (p.Selected - 1))
					{
						item1[i] = new mxCell('', new mxGeometry(0, 0, itemW, h), 'strokeColor=none;fillColor=none;resizeHeight=1;');
					}
					else
					{
						item1[i] = new mxCell('', new mxGeometry(0, 0, itemW, h), 'fillColor=#000000;fillOpacity=25;strokeColor=none;resizeHeight=1;');
					}
					
					item1[i].geometry.relative = true;
					item1[i].geometry.offset = new mxPoint(i * itemW, 0);
					item1[i].vertex = true;
					v.insert(item1[i]);
					item1[i].style += 
						getLabelStyle(p['MenuItem_' + (i + 1)]);
					
					item1[i].value = convertText(p['MenuItem_' + (i + 1)]);
				}
				
				break;
			case 'UI2AtoZBlock' :
				v.style += 'fillColor=none;strokeColor=none;' + 
					getLabelStyle(p['Text_0']);
				
				v.value = '0-9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
				
				break;

			case 'UI2PaginationBlock' :
				v.style += 'fillColor=none;strokeColor=none;' + 
					getLabelStyle(p.Text_prev);
			
				v.value = convertText(p.Text_prev) + ' ';
				
				for (var i = 0; i < p.Links; i++)
				{
					v.value += convertText(p['Link_' + (i + 1)]) + ' ';
				}
				
				v.value += convertText(p.Text_next);
				
				break;
				
			case 'UI2ContextMenuBlock' :
				v.style +=
					getOpacity(p, a) +
					getFillColor(p, a) + 
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p);
				
				var item = new Array();
				var icon = new Array();
				var shortcut = new Array();
				var itemH = h / p.Lines;
				var st = null; 
				
				for (var i = 0; i < p.Lines; i++)
				{
					//add label
					if (p['Item_' + (i + 1)] != null)
					{
						if (st == null)
						{
							st = '' + 
								getFontSize(p['Item_' + (i + 1)]) +
								getFontColor(p['Item_' + (i + 1)]) + 
								getFontStyle(p['Item_' + (i + 1)]);
						}
						
						item[i] = new mxCell('', new mxGeometry(0, i * h / p.Lines, w, itemH), 'strokeColor=none;fillColor=none;spacingLeft=20;align=left;html=1;');
						item[i].vertex = true;
						v.insert(item[i]);
						item[i].style += st; 
						
						item[i].value = convertText(p['Item_' + (i + 1)]);
					}
					
					//add icon
					if (p.Icons[(i + 1)] != null && item[i] != null)
					{
						if (p.Icons[(i + 1)] == 'dot')
						{
							icon[i] = new mxCell('', new mxGeometry(0, 0.5, 8, 8), 'shape=ellipse;strokeColor=none;');
							icon[i].geometry.offset = new mxPoint(6, -4);
						}
						else if (p.Icons[(i + 1)] == 'check')
						{
							icon[i] = new mxCell('', new mxGeometry(0, 0.5, 7, 8), 'shape=mxgraph.mscae.general.checkmark;strokeColor=none;');
							icon[i].geometry.offset = new mxPoint(6.5, -4);
						}

						if (icon[i] != null)
						{
							icon[i].geometry.relative = true;
							icon[i].vertex = true;
							item[i].insert(icon[i]);
							
							var fc = getStrokeColor(p, a);
							fc = fc.replace('strokeColor', 'fillColor');
							
							if (fc == '')
							{
								fc = 'fillColor=#000000;'
							}
							
							icon[i].style += fc;
						}
					}
					
					//add shortcut
					if (p['Shortcut_' + (i + 1)] != null)
					{
						if (st == null)
						{
							st = '' + 
								getFontSize(p['Shortcut_' + (i + 1)]) +
								getFontColor(p['Shortcut_' + (i + 1)]) + 
								getFontStyle(p['Shortcut_' + (i + 1)]);
						}
						
						shortcut[i] = new mxCell('', new mxGeometry(w * 0.6, i * h / p.Lines, w * 0.4, itemH), 'strokeColor=none;fillColor=none;spacingRight=3;align=right;html=1;');
						shortcut[i].vertex = true;
						v.insert(shortcut[i]);
						shortcut[i].style += st; 
						
						shortcut[i].value = convertText(p['Shortcut_' + (i + 1)]);
					}
					
					//add line
					if (p.Dividers[(i + 1)] != null)
					{
						item[i] = new mxCell('', new mxGeometry(w * 0.05, i * h / p.Lines, w * 0.9, itemH), 'shape=line;strokeWidth=0.25;');
						item[i].vertex = true;
						v.insert(item[i]);
						item[i].style += getStrokeColor(p, a); 
					}
				}
				
				break;
			case 'UI2TreePaneBlock' :
				break;
				
			case 'UI2ProgressBarBlock' :
				v.style += 'shape=mxgraph.mockup.misc.progressBar;fillColor2=#888888;barPos=' + (p.ScrollVal * 100) + ';';
				
				break;
				
			case 'UI2TooltipSquareBlock' :
				v.style += 'html=1;shape=callout;flipV=1;base=13;size=7;position=0.5;position2=0.66;rounded=1;arcSize=' + (p.RoundCorners) + ';' +
					getOpacity(p, a) +
					getFillColor(p, a) + 
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getLabelStyle(p.Tip);
				
				v.value = convertText(p.Tip);
				
				break;
			case 'UI2CalloutBlock' :
				v.style += 'shape=ellipse;' +
					getOpacity(p, a) +
					getFillColor(p, a) + 
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getLabelStyle(p.Txt);
				
				v.value = convertText(p.Txt);
				
				
				break;
				
			case 'UI2AlertBlock' :
				v.style += 
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getShadow(p) +
					getRotation(p, a, v) +
					getLabelStyle(p.Txt);

				v.value = convertText(p.Txt);

				var item1 = new mxCell('', new mxGeometry(0, 0, w, 30), 'part=1;resizeHeight=0;');
				item1.vertex = true;
				v.insert(item1);
				item1.style += st +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getFillColor(p, a) +
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p.Title);
				
				item1.value = convertText(p.Title);

				var item2 = new mxCell('', new mxGeometry(1, 0.5, 20, 20), 'part=1;shape=ellipse;strokeColor=#008cff;resizable=0;fillColor=none;html=1;');
			   	item2.geometry.relative = true;
			   	item2.geometry.offset = new mxPoint(-25, -10);
				item2.vertex = true;
				item1.insert(item2);

				var bw = 45;
				var bh = 20;
				var bs = 10;
				var totalW = bw * p.Buttons + (bs * p.Buttons - 1)
				
				item3 = new Array();
				
				for (var i = 0; i < p.Buttons; i++)
				{
					item3[i] = new mxCell('', new mxGeometry(0.5, 1, bw, bh), 'part=1;html=1;');
				   	item3[i].geometry.relative = true;
				   	item3[i].geometry.offset = new mxPoint(-totalW * 0.5 + i * (bw + bs), -40);
					item3[i].vertex = true;
					v.insert(item3[i]);
					item3[i].style +=
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getLabelStyle(p['Button_' + (i + 1)]);
					
					item3[i].value = convertText(p['Button_' + (i + 1)]);
				}
				
				break;
				
			case 'UMLClassBlock' :
				if (p.Simple == 0)
				{
					var st = getFillColor(p, a);
					var th = Math.round(p.TitleHeight * scale);
					st = st.replace('fillColor', 'swimlaneFillColor');
					
					if (st == '')
					{
						st = 'swimlaneFillColor=#ffffff;'
					}
					
					v.style += 'swimlane;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;' + st +
						'startSize=' + th + ';' +
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getLabelStyle(p.Title);
						
					v.value = convertText(p.Title);
					
					var item = new Array();
					var divider = new Array();
					var currH = th / h;
					
					for (var i = 0; i <= p.Attributes; i++)
					{
						if (i > 0)
						{
							divider[i] = new mxCell('', new mxGeometry(0, 0, 40, 8), 'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;');
							divider[i].vertex = true;
							v.insert(divider[i]);
						}
						
						var itemH = 0;
						
						if (i < p.Attributes)
						{
							itemH = p['Text' + (i + 1) + 'Percent'];
							currH += itemH;
						}
						else
						{
							itemH = 1 - currH;
						}
						
						item[i] = new mxCell('', new mxGeometry(0, 0, w, Math.round((h - th) * itemH)), 'part=1;resizeHeight=0;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
						item[i].vertex = true;
						v.insert(item[i]);
						item[i].style += st +
							getOpacity(p, a) +
							getFontSize(p['Text' + (i + 1)]) +
							getFontColor(p['Text' + (i + 1)]) + 
							getFontStyle(p['Text' + (i + 1)]);
						
						item[i].value = convertText(p['Text' + (i + 1)]);
					}
				}
				else
				{
					v.style += 
						getOpacity(p, a) +
						getStrokeColor(p, a) + 
						getFillColor(p, a) +
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getLabelStyle(p.Title);
						
					v.value = convertText(p.Title);
				}

				break;
			 	
			case 'ERDEntityBlock' :
				var st = getFillColor(p, a);
				var th = p.Name_h * scale;
				st = st.replace('fillColor', 'swimlaneFillColor');
				
				if (st == '')
				{
					st = 'swimlaneFillColor=#ffffff;'
				}
				
				v.style += 'swimlane;childLayout=stackLayout;horizontal=1;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;' + st +
					'startSize=' + th + ';' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p.Name);

				if (p.ShadedHeader)
				{
					v.style += 'fillColor=#e0e0e0;';
				}
				else
				{
					v.style += getFillColor(p, a);
				}
				
				v.value = convertText(p.Name);
				
				var item = new Array();
				var currH = th / h;
				
				for (var i = 0; i < p.Fields; i++)
				{
					var itemH = 0;
					
					item[i] = new mxCell('', new mxGeometry(0, 0, w, p['Field' + (i + 1) + '_h'] * scale), 'part=1;resizeHeight=0;strokeColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					item[i].vertex = true;
					v.insert(item[i]);
					item[i].style += st +
						getFontSize(p['Field' + (i + 1)]) +
						getFontColor(p['Field' + (i + 1)]) + 
						getFontStyle(p['Field' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						item[i].style += 'fillColor=#000000;opacity=5;';
					}
					else
					{
						item[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					item[i].value = convertText(p['Field' + (i + 1)]);
				}
				
				break;
				
			case 'ERDEntityBlock2' :
				var st = getFillColor(p, a);
				var th = p.Name_h * scale;
				st = st.replace('fillColor', 'swimlaneFillColor');
				
				if (st == '')
				{
					st = 'swimlaneFillColor=#ffffff;'
				}
				
				v.style += 'swimlane;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;' + st +
					'startSize=' + th + ';' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p.Name);

				if (p.ShadedHeader)
				{
					v.style += 'fillColor=#e0e0e0;';
				}
				else
				{
					v.style += getFillColor(p, a);
				}
				
				v.value = convertText(p.Name);
				
				var item = new Array();
				var key = new Array();
				var currH = th;
				var keyW = 30;
				
				if (p.Column1 != null)
				{
					keyW = p.Column1 * scale;
				}
				
				for (var i = 0; i < p.Fields; i++)
				{
					var itemH = 0;

					key[i] = new mxCell('', new mxGeometry(0, currH, keyW, p['Key' + (i + 1) + '_h'] * scale), 'strokeColor=none;part=1;resizeHeight=0;align=center;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					key[i].vertex = true;
					v.insert(key[i]);
					key[i].style += st +
						getFontSize(p['Key' + (i + 1)]) +
						getFontColor(p['Key' + (i + 1)]) + 
						getFontStyle(p['Key' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						key[i].style += 'fillColor=#000000;fillOpacity=5;';
					}
					else
					{
						key[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					key[i].value = convertText(p['Key' + (i + 1)]);
					
					item[i] = new mxCell('', new mxGeometry(keyW, currH, w - keyW, p['Field' + (i + 1) + '_h'] * scale), 'shape=partialRectangle;top=0;right=0;bottom=0;part=1;resizeHeight=0;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					item[i].vertex = true;
					v.insert(item[i]);
					item[i].style += st +
						getStrokeColor(p, a) + 
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getFontSize(p['Field' + (i + 1)]) +
						getFontColor(p['Field' + (i + 1)]) + 
						getFontStyle(p['Field' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						item[i].style += 'fillColor=#000000;fillOpacity=5;';
					}
					else
					{
						item[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					item[i].value = convertText(p['Field' + (i + 1)]);
					
					currH += p['Key' + (i + 1) + '_h'] * scale;
				}
				
				break;
				
			case 'ERDEntityBlock3' :
				var st = getFillColor(p, a);
				var th = p.Name_h * scale;
				st = st.replace('fillColor', 'swimlaneFillColor');
				
				if (st == '')
				{
					st = 'swimlaneFillColor=#ffffff;'
				}
				
				v.style += 'swimlane;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;' + st +
					'startSize=' + th + ';' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p.Name);

				if (p.ShadedHeader)
				{
					v.style += 'fillColor=#e0e0e0;';
				}
				else
				{
					v.style += getFillColor(p, a);
				}
				
				v.value = convertText(p.Name);
				
				var item = new Array();
				var key = new Array();
				var currH = th;
				var keyW = 30;
				
				if (p.Column1 != null)
				{
					keyW = p.Column1 * scale;
				}
				
				for (var i = 0; i < p.Fields; i++)
				{
					var itemH = 0;

					key[i] = new mxCell('', new mxGeometry(0, currH, keyW, p['Field' + (i + 1) + '_h'] * scale), 'strokeColor=none;part=1;resizeHeight=0;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					key[i].vertex = true;
					v.insert(key[i]);
					key[i].style += st +
						getFontSize(p['Field' + (i + 1)]) +
						getFontColor(p['Field' + (i + 1)]) + 
						getFontStyle(p['Field' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						key[i].style += 'fillColor=#000000;fillOpacity=5;';
					}
					else
					{
						key[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					key[i].value = convertText(p['Field' + (i + 1)]);
					
					item[i] = new mxCell('', new mxGeometry(keyW, currH, w - keyW, p['Type' + (i + 1) + '_h'] * scale), 'shape=partialRectangle;top=0;right=0;bottom=0;part=1;resizeHeight=0;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					item[i].vertex = true;
					v.insert(item[i]);
					item[i].style += st +
						getStrokeColor(p, a) + 
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getFontSize(p['Type' + (i + 1)]) +
						getFontColor(p['Type' + (i + 1)]) + 
						getFontStyle(p['Type' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						item[i].style += 'fillColor=#000000;fillOpacity=5;';
					}
					else
					{
						item[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					item[i].value = convertText(p['Type' + (i + 1)]);
					
					currH += p['Field' + (i + 1) + '_h'] * scale;
				}
				
				break;
			case 'ERDEntityBlock4' :
				var st = getFillColor(p, a);
				var th = p.Name_h * scale;
				st = st.replace('fillColor', 'swimlaneFillColor');
				
				if (st == '')
				{
					st = 'swimlaneFillColor=#ffffff;'
				}
				
				v.style += 'swimlane;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;' + st +
					'startSize=' + th + ';' +
					getOpacity(p, a) +
					getStrokeColor(p, a) + 
					getStrokeWidth(p) +
					getStrokeStyle(p) +
					getLabelStyle(p.Name);

				if (p.ShadedHeader)
				{
					v.style += 'fillColor=#e0e0e0;';
				}
				else
				{
					v.style += getFillColor(p, a);
				}
				
				v.value = convertText(p.Name);
				
				var item = new Array();
				var key = new Array();
				var type = new Array();
				var currH = th;
				var keyW = 30;
				var typeW = 40;
				
				if (p.Column1 != null)
				{
					keyW = p.Column1 * scale;
				}
				
				if (p.Column2 != null)
				{
					typeW = p.Column2 * scale;
				}
				
				for (var i = 0; i < p.Fields; i++)
				{
					var itemH = 0;

					key[i] = new mxCell('', new mxGeometry(0, currH, keyW, p['Key' + (i + 1) + '_h'] * scale), 'strokeColor=none;part=1;resizeHeight=0;align=center;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					key[i].vertex = true;
					v.insert(key[i]);
					key[i].style += st +
						getFontSize(p['Key' + (i + 1)]) +
						getFontColor(p['Key' + (i + 1)]) + 
						getFontStyle(p['Key' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						key[i].style += 'fillColor=#000000;fillOpacity=5;';
					}
					else
					{
						key[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					key[i].value = convertText(p['Key' + (i + 1)]);
					
					item[i] = new mxCell('', new mxGeometry(keyW, currH, w - keyW - typeW, p['Field' + (i + 1) + '_h'] * scale), 'shape=partialRectangle;top=0;right=0;bottom=0;part=1;resizeHeight=0;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					item[i].vertex = true;
					v.insert(item[i]);
					item[i].style += st +
						getStrokeColor(p, a) + 
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getFontSize(p['Field' + (i + 1)]) +
						getFontColor(p['Field' + (i + 1)]) + 
						getFontStyle(p['Field' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						item[i].style += 'fillColor=#000000;fillOpacity=5;';
					}
					else
					{
						item[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					item[i].value = convertText(p['Field' + (i + 1)]);
					
					type[i] = new mxCell('', new mxGeometry(w - typeW, currH, typeW, p['Type' + (i + 1) + '_h'] * scale), 'shape=partialRectangle;top=0;right=0;bottom=0;part=1;resizeHeight=0;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
					type[i].vertex = true;
					v.insert(type[i]);
					type[i].style += st +
						getStrokeColor(p, a) + 
						getStrokeWidth(p) +
						getStrokeStyle(p) +
						getFontSize(p['Type' + (i + 1)]) +
						getFontColor(p['Type' + (i + 1)]) + 
						getFontStyle(p['Type' + (i + 1)]);

					if (p.AltRows == 1 && (i % 2 != 0))
					{
						type[i].style += 'fillColor=#000000;fillOpacity=5;';
					}
					else
					{
						type[i].style += 'fillColor=none;' + 
							getOpacity(p, a);
					}

					type[i].value = convertText(p['Type' + (i + 1)]);
					
					currH += p['Key' + (i + 1) + '_h'] * scale;
				}
				
				break;
		}

	    return v;
	};
})();

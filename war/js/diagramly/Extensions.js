/**
 * Handles paste from Lucidchart
 * 
 * TODO: Move to dynamic loading minimized plugin.
 */
(function()
{
	// Global import transformation
	var scale = 0.6;
	var dx = 0;
	var dy = 0;
	
	var arcSize = 5;
	var edgeStyle = 'html=1;';
	var vertexStyle = 'html=1;whiteSpace=wrap;';
	var labelStyle = 'text;html=1;resizable=0;align=center;verticalAlign=middle;labelBackgroundColor=#ffffff;';
	
	var c = "fillColor=#036897;strokeColor=#ffffff;";
	var s = "shape=mxgraph.";
	var ss = "strokeColor=none;shape=mxgraph.";
	
	// TODO: Add shape mappings
	// FIXME: Factor our common strings, eg. shape=mxgraph. to save space
	var styleMap = {
//Standard
			'DefaultTextBlockNew': 'text;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;',
			'DefaultTextBlock': 'text;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;',
			'DefaultSquareBlock': 'rounded=1;arcSize=' + arcSize + ';',
			'DefaultNoteBlock': 'shape=note;size=15;',
			'DefaultNoteBlockV2': 'shape=note;size=15;',
			'HotspotBlock': 'strokeColor=none;opacity=50;',
			'ImageSearchBlock2': 'shape=image;',
//Flowchart
			'ProcessBlock': 'rounded=1;arcSize=' + arcSize + ';',
			'DecisionBlock': 'rhombus;rounded=1;arcSize=' + arcSize + ';',
			'TerminatorBlock': 'rounded=1;arcSize=50;',
			'PredefinedProcessBlock': 'shape=process;rounded=1;arcSize=' + arcSize + ';',
			'DocumentBlock': 'shape=document;',
			'MultiDocumentBlock': s + 'flowchart.multi-document;',
			'ManualInputBlock': 'shape=manualInput;size=15;rounded=1;arcSize=' + arcSize + ';',
			'PreparationBlock': 'shape=hexagon;rounded=1;arcSize=' + arcSize + ';',
			'DataBlock': 'shape=parallelogram;rounded=1;arcSize=' + arcSize + ';',
			'DataBlockNew': 'shape=parallelogram;rounded=1;arcSize=' + arcSize + ';',
			'DatabaseBlock': 'shape=cylinder;',
			'DirectAccessStorageBlock': s + 'flowchart.direct_data;',
			'InternalStorageBlock': 'shape=internalStorage;rounded=1;arcSize=' + arcSize + ';dx=10;dy=10;',
			'PaperTapeBlock': 'shape=tape;size=0.2;',
			'ManualOperationBlockNew': 'shape=trapezoid;rounded=1;arcSize=' + arcSize + ';flipV=1;',
			'DelayBlock': 'shape=delay;',
			'StoredDataBlock': 'shape=dataStorage;',
			'MergeBlock': 'triangle;direction=south;rounded=1;arcSize=' + arcSize + ';',
			'ConnectorBlock': 'ellipse;',
			'OrBlock': s + 'flowchart.summing_function;',
			'SummingJunctionBlock': s + 'flowchart.or;',
			'DisplayBlock': 'shape=display;',
			'OffPageLinkBlock': 'shape=offPageConnector;rounded=1;arcSize=' + arcSize + ';',
			'BraceNoteBlock': 'shape=curlyBracket;rounded=1;', //EXT
			'NoteBlock': s + 'flowchart.annotation_1;',
//Containers
			'AdvancedSwimLaneBlock': 'swimlane;rounded=1;arcSize=' + arcSize + ';', //EXT
			'AdvancedSwimLaneBlockRotated': 'swimlane;horizontal=0;rounded=1;arcSize=' + arcSize + ';', //EXT
			'RectangleContainerBlock': 'fillColor=none;container=1;rounded=1;arcSize=' + arcSize + ';',
			'DiamondContainerBlock':  'shape=rhombus;fillColor=none;container=1;',
			'RoundedRectangleContainerBlock': 'rounded=1;fillColor=none;container=1;', 
			'CircleContainerBlock': 'shape=ellipse;fillColor=none;container=1;',
			'PillContainerBlock': 'rounded=1;arcSize=50;fillColor=none;container=1;',
//			'BraceBlock' NA
//			'BracketBlock' NA
//			'BraceBlockRotated' NA
//			'BracketBlockRotated' NA
//Geometric shapes
			'IsoscelesTriangleBlock': 'triangle;direction=north;',
			'RightTriangleBlock': s + 'basic.orthogonal_triangle;',
			'PentagonBlock': s + 'basic.pentagon;',
			'HexagonBlock': 'shape=hexagon;rounded=1;arcSize=' + arcSize + ';',
			'OctagonBlock': s + 'basic.octagon;',
			'CrossBlock': 'shape=cross;size=0.6;',
			'CloudBlock': 'ellipse;shape=cloud;',
			'HeartBlock': s + 'basic.heart;',
			'RightArrowBlock': 'shape=singleArrow;arrowWidth=0.5;arrowSize=0.3;',
			'DoubleArrowBlock': 'shape=doubleArrow;arrowWidth=0.5;arrowSize=0.3;',
			'CalloutBlock': s + 'basic.rectangular_callout;',
			'ShapeCircleBlock': 'ellipse;',
			'ShapePolyStarBlock': s + 'basic.star;',
			'ShapeDiamondBlock': 'rhombus;rounded=1;arcSize=' + arcSize + ';',
//Misc
			'UI2HotspotBlock' : 'shape=rect;opacity=50;strokeColor=none;rounded=1;',
//Android Devices
//			'AndroidDevice' EXT
//Android Dialogs
//			'AndroidAlertDialog' EXT
//			'AndroidDateDialog' EXT
//			'AndroidTimeDialog' EXT
//Android Blocks
//			'AndroidListItems' EXT
//			'AndroidTabs' EXT
//			'AndroidProgressBar' EXT
//			'AndroidImageBlock' EXT
//			'AndroidTextBlock' EXT
//			'AndroidActionBar' EXT
//			'AndroidBrowserBar' EXT
//Android Inputs
//			'AndroidButton' EXT
//			'AndroidTextBox' EXT
//			'AndroidRadioButton' EXT
//			'AndroidCheckBox' EXT
//			'AndroidToggle' EXT
//			'AndroidSlider' EXT
//Android Icons (not working properly, needs specific code)
			'AndroidIconCheck': s + 'ios7.misc.check;',
//			'AndroidIconBack' NA
			'AndroidIconCancel' : s + 'atlassian.x;',
			'AndroidIconCollapse': s + 'ios7.misc.up;',
			'AndroidIconExpand': s + 'ios7.misc.down;',
//			'AndroidIconForward' NA
			'AndroidIconNext': s + 'ios7.misc.right;',
			'AndroidIconPrevious': s + 'ios7.misc.left;',
			'AndroidIconRefresh' : + 'ios7.icons.repeat;',
			'AndroidIconInformation': s + 'ios7.icons.info;',
//			'AndroidIconHelp' NA
			'AndroidIconSearch': s + 'ios7.icons.looking_glass;',
			'AndroidIconSettings': s + 'ios7.icons.volume;direction=south;',
//			'AndroidIconDislike' NA
//			'AndroidIconLike' NA
//			'AndroidIconDelete' NA
//			'AndroidIconCopy' NA
//			'AndroidIconCut' NA
//			'AndroidIconPaste' NA
			'AndroidIconTrash': s + 'ios7.icons.trashcan;',
			'AndroidIconEmail': s + 'mockup.misc.mail2;',
			'AndroidIconNew': s + 'ios7.misc.flagged;', 
//			'AndroidIconImage' NA
//			'AndroidIconUndo' NA
//			'AndroidIconSharing' NA
//			'AndroidIconDownload' NA
//			'AndroidIconError' NA
//			'AndroidIconWarning' NA
//iOS mockups
			'iOSDeviceiPhoneSE': s + 'ios7.misc.iphone;',
			'iOSDeviceiPhone6s': s + 'ios7.misc.iphone;',
			'iOSDeviceiPhone6sPlus': s + 'ios7.misc.iphone;',
			'iOSDeviceiPadPortrait': s + 'ios7.misc.ipad7inch;',
			'iOSDeviceiPadLandscape': s + 'ios7.misc.ipad7inch;',
			'iOSDeviceiPadProPortrait': s + 'ios7.misc.ipad7inch;',
			'iOSDeviceiPadProLandscape': s + 'ios7.misc.ipad10inch;',
//iOS UI components
			'iOSButton': 'shape=rect;',
//			'iOSSegmentedControl' EXT
			'iOSStepper': s + 'ios7.misc.adjust;',
			'iOSToggle': s + 'ios7ui.onOffButton;buttonState=on;strokeColor2=#aaaaaa;fillColor2=#ffffff;',
			'iOSSlider': s + 'ios7ui.slider;barPos=20;strokeColor2=#a0a0a0;',
			'iOSProgressBar': s + 'ios.iCloudProgressBar;barPos=20;',
			'iOSPageControls': s + 'ios.iCloudProgressBar;barPos=20;',
//			'iOSStatusBar' NA
//			'iOSSearchBar' EXT
//			'iOSNavBar' EXT
//			'iOSTabs' EXT
			'iOSUniversalKeyboard': s + 'ios.iKeybLett;',
//			'iOSDatePicker' EXT
//			'iOSTimePicker' EXT
//			'iOSCountdownPicker' EXT
//			'iOSBasicCell' EXT
//			'iOSSubtitleCell' EXT
//			'iOSRightDetailCell' EXT
//			'iOSLeftDetailCell' EXT
//			'iOSTableGroupedSectionBreak' EXT
//			'iOSTablePlainHeaderFooter' EXT
//Mind Map
			'MindMapBlock' : 'shape=rect;rounded=1;',
			'MindMapStadiumBlock' : 'shape=rect;rounded=1;arcSize=50;',
			'MindMapCloud' : 'shape=cloud;',
			'MindMapCircle' : 'shape=ellipse;',
			'MindMapIsoscelesTriangleBlock' : 'shape=triangle;direction=north;',
			'MindMapDiamondBlock' : 'shape=rhombus;',
			'MindMapPentagonBlock' : s + 'basic.pentagon;',
			'MindMapHexagonBlock' : 'shape=hexagon;',
			'MindMapOctagonBlock' : s + 'basic.octagon;',
			'MindMapCrossBlock' : s + 'basic.cross2;dx=20;',
//Entity Relationship
//			'ERDEntityBlock' EXT
//			'ERDEntityBlock2' EXT
//			'ERDEntityBlock3' EXT
//			'ERDEntityBlock4' EXT
//Site Maps
//			'SMPage' EXT
//			'SMHome' EXT
//			'SMGallery' EXT
//			'SMShopping' EXT
//			'SMMap' EXT
//			'SMAthletics' EXT
//			'SMLogin' EXT
//			'SMPrint' EXT
//			'SMScript' EXT
//			'SMSearch' EXT
//			'SMSettings' EXT
//			'SMSitemap' EXT
//			'SMSuccess' EXT
//			'SMVideo' EXT
//			'SMAudio' EXT
//			'SMBlog' EXT
//			'SMCalendar' EXT
//			'SMChart' EXT
//			'SMCloud' EXT
//			'SMDocument' EXT
//			'SMDownload' EXT
//			'SMError' EXT
//			'SMForm' EXT
//			'SMGame' EXT
//			'SMJobs' EXT
//			'SMLucid' EXT
//			'SMNewspress' EXT
//			'SMPhoto' EXT
//			'SMPortfolio' EXT
//			'SMPricing' EXT
//			'SMProfile' EXT
//			'SMSlideshow' EXT
//			'SMUpload' EXT
//UML Class Diagram
			'UMLClassBlock': 'rounded=1;',
			'UMLActiveClassBlock': s + 'flowchart.predefined_process;',
//			'UMLMultiplicityBlock' NA
			'UMLPackageBlock': 'shape=folder;tabPosition=left;',
//			'UMLConstraintBlock' NA
			'UMLNoteBlock': 'shape=note;size=15;',
			'UMLTextBlock': 'shape=text;strokeColor=none;fillColor=none;',
//UML Use Case
			'UMLActorBlock': 'shape=umlActor;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;whiteSpace=nowrap;',
			'UMLUseCaseBlock': 'shape=ellipse;',
			'UMLCircleContainerBlock': 'shape=ellipse;container=1;',
			'UMLRectangleContainerBlock': 'rounded=1;container=1;',
//UML State/Activity			
			'UMLOptionLoopBlock' : s + 'sysml.package2;xSize=90;align=left;spacingLeft=10;overflow=fill;',
			'UMLAlternativeBlock2' : s + 'sysml.package2;xSize=90;align=left;spacingLeft=10;overflow=fill;',
			'UMLStartBlock' : 'shape=ellipse;fillColor=#000000;',
			'UMLStateBlock' : 'shape=rect;rounded=1;',
			'UMLDecisionBlock' : 'shape=rhombus;rounded=1;',
			'UMLHForkJoinBlock' : 'shape=rect;rounded=1;fillColor=#000000;',
			'UMLVForkJoinBlock' : 'shape=rect;rounded=1;fillColor=#000000;',
			'UMLFlowFinalBlock' : s + 'flowchart.or;',
			'UMLHistoryStateBlock' : 'shape=ellipse;',
			'UMLEndBlock' : s + 'bpmn.shape;outline=end;symbol=terminate;',
			'UMLObjectBlock' : 'shape=rect;rounded=1;',
			'UMLSendSignalBlock' : s + 'sysml.sendSigAct;',
			'UMLReceiveSignalBlock' : s + 'sysml.accEvent;flipH=1;',
			'UMLAcceptTimeEventActionBlock' : s + 'sysml.timeEvent;',
//			'UMLInterruptingEdgeBlock' NA
			'UMLOffPageLinkBlock' : s + 'sysml.sendSigAct;direction=south;',
//			'UMLExpansionNodeBlock' NA
//			'UMLMultiLanePoolBlock' EXT
//			'UMLMultiLanePoolRotatedBlock' EXT
//			'UMLMultidimensionalSwimlane' EXT
//UML Sequence
			'UMLActivationBlock' : 'shape=rect;rounded=1;',
			'UMLDeletionBlock' : s + 'sysml.x;strokeWidth=4;',
//			'UMLAlternativeBlock' NA
			'UMLSeqEntityBlock' : s + 'electrical.radio.microphone_1;direction=north;',
//			'UMLBoundaryBlock' NA
//			'UMLControlBlock'NA
//UML Component
			'UMLComponentBlock' : 'shape=component;align=left;spacingLeft=36;',
			'UMLNodeBlock' : 'shape=cube;size=12;flipH=1;',
			'UMLComponentInterfaceBlock' : 'shape=ellipse;',
//			'UMLComponentBoxBlock' EXT
//			'UMLAssemblyConnectorBlock' NA
			'UMLProvidedInterfaceBlock' : 'shape=lollipop;direction=south;',
			'UMLRequiredInterfaceBlock' : 'shape=requires;direction=north;',
//UML Deployment
//UML Entity Relationship
			'UMLEntityBlock' : 'shape=rect;rounded=1;',
			'UMLWeakEntityBlock' : 'shape=ext;double=1;rounded=1;',
			'UMLAttributeBlock' : 'shape=ellipse;',
			'UMLMultivaluedAttributeBlock' : 'shape=doubleEllipse;',
			'UMLRelationshipBlock' : 'shape=rhombus;rounded=1;',
			'UMLWeakRelationshipBlock' : 'shape=rhombus;rounded=1;double=1;',
//BPMN 2.0
//			'BPMNActivity' EXT
//			'BPMNActivity' EXT
//			'BPMNEvent' EXT
//			'BPMNChoreography' EXT
//			'BPMNConversation' EXT
//			'BPMNGateway' EXT
//			'BPMNData' EXT
//			'BPMNDataStore'
//			'BPMNAdvancedPoolBlock' EXT
//			'BPMNAdvancedPoolBlockRotated' EXT
//			'BPMNBlackPool' EXT
//Data Flow
//			'DFDExternalEntityBlock' NA
			'DFDExternalEntityBlock2' : 'shape=rect;rounded=1;',
			'YDMDFDProcessBlock' : 'shape=ellipse;',
			'YDMDFDDataStoreBlock' : 'shape=partialRectangle;right=0;left=0;',
			'GSDFDProcessBlock' : 'shape=swimlane;rounded=1;',
			'GSDFDProcessBlock2' : 'shape=rect;rounded=1;',
//			'GSDFDDataStoreBlock' NA
			'GSDFDDataStoreBlock2' : 'shape=partialRectangle;right=0;',
			
//Org Chart
			'OrgBlock' : 'shape=rect;rounded=1;',
//Tables
//			'DefaultTableBlock' EXT
//Processes
			'VSMCustomerSupplierBlock' : s + 'lean_mapping.outside_sources;',
			'VSMDedicatedProcessBlock' : s + 'lean_mapping.manufacturing_process;',
			'VSMSharedProcessBlock' : s + 'lean_mapping.manufacturing_process_shared;',
			'VSMWorkcellBlock' : s + 'lean_mapping.work_cell;',
//			'VSMDatacellBlock' EXT
//Materials
			'VSMInventoryBlock' : s + 'lean_mapping.inventory_box;',
//			'VSMSupermarketBlock' EXT
			'VSMPhysicalPullBlock' : s + 'lean_mapping.physical_pull;direction=south;',
			'VSMFIFOLaneBlock' : s + 'lean_mapping.fifo_sequence_flow;fontStyle=0;fontSize=20',
//			'VSMSafetyBufferStockBlock' EXT
//Shipments
			'VSMExternalShipmentAirplaneBlock' : s + 'lean_mapping.airplane_7;',
			'VSMExternalShipmentForkliftBlock' : s + 'lean_mapping.move_by_forklift;',
			'VSMExternalShipmentTruckBlock' : s + 'lean_mapping.truck_shipment;',
			'VSMExternalShipmentBoatBlock' : s + 'lean_mapping.boat_shipment;',
//Information
			'VSMProductionControlBlock' : s + 'lean_mapping.manufacturing_process;',
			'VSMOtherInformationBlock' : 'shape=rect;rounded=1;',
//			'VSMHeijyunkaBoxBlock' NA
			'VSMSequencedPullBallBlock' : s + 'lean_mapping.sequenced_pull_ball;',
			'VSMMRPERPBlock' : s + 'lean_mapping.mrp_erp;whiteSpace=wrap;',
			'VSMLoadLevelingBlock' : s + 'lean_mapping.load_leveling;',
			'VSMGoSeeBlock' : s + 'lean_mapping.go_see_production_scheduling;flipH=1;',
			'VSMGoSeeProductionBlock' : 'shape=ellipse;',
			'VSMVerbalInfoBlock' : s + 'lean_mapping.verbal;',
//Value Stream Mapping
			'VSMKaizenBurstBlock' : s + 'lean_mapping.kaizen_lightening_burst;',
			'VSMOperatorBlock' : s + 'lean_mapping.operator;flipV=1;',
//			'VSMTimelineBlock' EXT
			'VSMQualityProblemBlock' : s + 'lean_mapping.quality_problem;',
//Kanban
			'VSMProductionKanbanSingleBlock' : s + 'lean_mapping.production_kanban;',
//			'VSMProductionKanbanBatchBlock' NA
			'VSMWithdrawalKanbanBlock' : s + 'lean_mapping.withdrawal_kanban;',
//			'VSMWithdrawalKanbanBatchBlock' NA
			'VSMSignalKanbanBlock' : s + 'lean_mapping.signal_kanban;',
			'VSMKanbanPostBlock' : s + 'lean_mapping.kanban_post;',
//Arrows
			'VSMShipmentArrow': 'shape=singleArrow;arrowWidth=0.5;arrowSize=0.13;',
			'VSMPushArrow' : s + 'lean_mapping.push_arrow;',
//			'VSMElectronicInformationArrow' : s + 'lean_mapping.electronic_info_flow_edge;', EXT
//EC2
			'AWSElasticComputeCloudBlock2' : ss + 'aws3.ec2;',
			'AWSInstanceBlock2' : ss + 'aws3.instance;',
			'AWSInstancesBlock2' : ss + 'aws3.instances;',
			'AWSAMIBlock2' : ss + 'aws3.ami;',
			'AWSDBonInstanceBlock2' : ss + 'aws3.db_on_instance;',
			'AWSInstanceCloudWatchBlock2' : ss + 'aws3.instance_with_cloudwatch;',
			'AWSElasticIPBlock2' : ss + 'aws3.elastic_ip;',
			'AWSHDFSClusterBlock2' : ss + 'aws3.hdfs_cluster;',
			'AWSAutoScalingBlock2' : ss + 'aws3.auto_scaling;',
			'AWSEC2OptimizedInstance2' : ss + 'aws3.optimized_instance;',
			'AWSAmazonEC2(Spotinstance)' : ss + 'aws3.spot_instance;',
			'AWSAmazonECR' : ss + 'aws3.ecr;',
			'AWSAmazonECS' : ss + 'aws3.ecs;',
			'AWSLambda2' : ss + 'aws3.lambda;',
			'AWSElasticLoadBalancing' : ss + 'aws3.elastic_load_balancing;',
//Networking
			'AWSElasticLoadBlock2' : ss + 'aws3.classic_load_balancer;',
			'AWSDirectConnectBlock3' : ss + 'aws3.direct_connect;',
			'AWSElasticNetworkBlock2' : ss + 'aws3.elastic_network_interface;',
			'AWSRoute53Block2' : ss + 'aws3.route_53;',
			'AWSHostedZoneBlock2' : ss + 'aws3.hosted_zone;fontColor=#FFFFFF;fontStyle=1;',
			'AWSRouteTableBlock2' : ss + 'aws3.route_table;',
			'AWSVPCBlock2' : ss + 'aws3.vpc;',
			'AWSVPNConnectionBlock2' : ss + 'aws3.vpn_connection;',
			'AWSVPNGatewayBlock2' : ss + 'aws3.vpn_gateway;',
			'AWSCustomerGatewayBlock2' : ss + 'aws3.customer_gateway;',
			'AWSCustomerGatewayBlock3' : ss + 'aws3.customer_gateway;',
			'AWSInternetGatewayBlock2' : ss + 'aws3.internet_gateway;',
			'AWSRouterBlock2' : ss + 'aws3.router;',
			'AWSRouterBlock3' : ss + 'aws3.router;',
			'AWSAmazonVPC(endpoints)' : ss + 'aws3.endpoints;',
			'AWSAmazonVPC(flowlogs)' : ss + 'aws3.flow_logs;',
			'AWSAmazonVPC(VPCNATgateway)' : ss + 'aws3.vpc_nat_gateway;',
			'AWSVPCPeering3' : ss + 'aws3.vpc_peering;',
			
//S3
			'AWSSimpleStorageBlock2' : ss + 'aws3.s3;',
			'AWSBucketBlock2' : ss + 'aws3.bucket;fontStyle=1;fontColor=#ffffff;',
			'AWSBuckethWithObjectsBlock2' : ss + 'aws3.bucket_with_objects;',
			'AWSObjectBlock2' : ss + 'aws3.object;fontStyle=1;fontColor=#ffffff;',
			'AWSImportExportBlock2' : ss + 'aws3.import_export;',
			'AWSStorageGatewayBlock2' : ss + 'aws3.storage_gateway;',
			'AWSElasticBlockStorageBlock2' : ss + 'aws3.volume;fontStyle=1;fontColor=#ffffff;',
			'AWSVolumeBlock3' : ss + 'aws3.volume;fontStyle=1;fontColor=#ffffff;',
			'AWSSnapshotBlock2' : ss + 'aws3.snapshot;fontStyle=1;fontColor=#ffffff;',
			'AWSGlacierArchiveBlock3' : ss + 'aws3.archive;',
			'AWSGlacierVaultBlock3' : ss + 'aws3.vault;',
			'AWSAmazonEFS' : ss + 'aws3.efs;',
			'AWSGlacierBlock2' : ss + 'aws3.glacier;',
			'AWSAWSImportExportSnowball' : ss + 'aws3.snowball;',
			'AWSStorageGatewayCachedVolumn2' : ss + 'aws3.cached_volume;',
			'AWSStorageGatewayNon-CachedVolumn2' : ss + 'aws3.non_cached_volume;',
			'AWSStorageGatewayVirtualTapeLibrary2' : ss + 'aws3.virtual_tape_library;',
//Content Delivery
			'AWSCloudFrontBlock2' : ss + 'aws3.cloudfront;',
			'AWSDownloadDistBlock2' : ss + 'aws3.download_distribution;',
			'AWSStreamingBlock2' : ss + 'aws3.streaming_distribution;',
			'AWSEdgeLocationBlock2' : ss + 'aws3.edge_location;',
//Database
			'AWSItemBlock2' : ss + 'aws3.item;',
			'AWSItemsBlock2' : ss + 'aws3.items;',
			'AWSAttributeBlock2' : ss + 'aws3.attribute;',
			'AWSAttributesBlock2' : ss + 'aws3.attributes;',
			'AWSRDBSBlock2' : ss + 'aws3.rds;',
			'AWSRDSInstanceBlock2' : ss + 'aws3.rds_db_instance;',
			'AWSRDSStandbyBlock2' : ss + 'aws3.rds_db_instance_standby_multi_az;',
			'AWSRDSInstanceReadBlock2' : ss + 'aws3.rds_db_instance_read_replica;',
			'AWSOracleDBBlock2' : ss + 'aws3.oracle_db_instance;',
			'AWSMySQLDBBlock2' : ss + 'aws3.mysql_db_instance;',
			'AWSDynamoDBBlock2' : ss + 'aws3.dynamo_db;',
			'AWSSimpleDatabaseBlock3' : ss + 'aws2.database.simpledb;',
			'AWSSimpleDatabaseDomainBlock3' : ss + 'aws2.database.simpledb_domain;',
			'AWSTableBlock2' : ss + 'aws3.table;',
			'AWSAmazonRedShiftBlock3' : ss + 'aws3.redshift;',
			'AWSElastiCacheNodeBlock2' : ss + 'aws3.cache_node;',
			'AWSElastiCacheBlock2' : ss + 'aws3.elasticache;',
			'AWSDynamoDBGlobalSecondaryIndexes2' : ss + 'aws3.global_secondary_index;',
			'AWSAmazonElastiCacheMemcache2' : ss + 'aws3.memcached;',
			'AWSAmazonElastiCacheRedis2' : ss + 'aws3.redis;',
			'AWSAmazonRDSMSSQLInstance2' : ss + 'aws3.ms_sql_instance_2;',
			'AWSMSSQLDBBlock3' : ss + 'aws3.ms_sql_instance;',
			'AWSAmazonRDSMySQLDBInstance2' : ss + 'aws3.mysql_db_instance_2;',
			'AWSAmazonRDSOracleDBInstance2' : ss + 'aws3.oracle_db_instance_2;',
			'AWSRDSReplicasetswithPIOP2' : ss + 'aws3.piop;',
			'AWSAmazonRDSPostgreSQL2' : ss + 'aws3.postgre_sql_instance;',
			'AWSRDSMasterSQL2' : ss + 'aws3.sql_master;',
			'AWSRDSSlaveSQL2' : ss + 'aws3.sql_slave;',
			'AWSAmazonRedshift(densecomputenode)' : ss + 'aws3.dense_compute_node;',
			'AWSAmazonRedshift(densestoragenode)' : ss + 'aws3.dense_storage_node;',
			'AWSAWSDatabaseMigrationService' : ss + 'aws3.database_migration_service;',
//Security Identity
			'AWSACM' : ss + 'aws3.certificate_manager;',
			'AWSAmazonInspector' : ss + 'aws3.inspector;',
			'AWSAWSCloudHSM' : ss + 'aws3.cloudhsm;',
			'AWSDirectoryService2' : ss + 'aws3.directory_service;',
			'AWSAWSKMS' : ss + 'aws3.kms;',
			'AWSAWSWAF' : ss + 'aws3.waf;',
			'AWSACM(certificate-manager)' : ss + 'aws3.certificate_manager_2;',
//App Services
			'AWSSESBlock2' : ss + 'aws3.ses;',
			'AWSEmailBlock2' : ss + 'aws3.email;',
			'AWSSNSBlock2' : ss + 'aws3.sns;',
			'AWSSQSBlock3' : ss + 'aws3.sqs;',
			'AWSQueueBlock2' : ss + 'aws3.queue;',
			'AWSMessageBlock2' : ss + 'aws3.message;',
			'AWSDeciderBlock2' : ss + 'aws3.decider;',
			'AWSSWFBlock2' : ss + 'aws3.swf;',
			'AWSWorkerBlock2' : ss + 'aws3.worker;',
			'AWSCloudSearchBlock2' : ss + 'aws3.cloudsearch;',
			'AWSCloudSearchMetadataBlock3' : ss + 'aws3.search_documents;',
			'AWSElasticTranscoder3' : ss + 'aws3.elastic_transcoder;',
			'AWSAmazonAPIGateway' : ss + 'aws3.api_gateway;',
			'AWSAppStream2' : ss + 'aws3.appstream;',
//Deployment
			'AWSCloudFormationBlock2' : ss + 'aws3.cloudformation;',
			'AWSDataPipelineBlock3' : ss + 'aws3.data_pipeline;',
			'AWSDataPipelineBlock2' : ss + 'aws3.data_pipeline;',
			'AWSTemplageBlock2' : ss + 'aws3.template;',
			'AWSStackBlock2' : ss + 'aws3.stack_aws_cloudformation;',
			'AWSBeanStockBlock2' : ss + 'aws3.elastic_beanstalk;',
			'AWSApplicationBlock2' : ss + 'aws3.application;',
			'AWSBeanstalkDeploymentBlock3' : ss + 'aws3.deployment;',
			'AWSIAMBlock3' : ss + 'aws3.iam;',
			'AWSIAMSTSBlock3' : ss + 'aws3.sts;',
			'AWSIAMAddonBlock2' : ss + 'aws3.add_on;',
			'AWSCloudWatchBlock3' : ss + 'aws3.cloudwatch;',
			'AWSCloudWatchAlarmBlock2' : ss + 'aws3.alarm;',
			'AWSIAMSecurityTokenService2' : ss + 'aws3.sts_2;',
			'AWSIAMDataEncryptionKey2' : ss + 'aws3.data_encryption_key;',
			'AWSIAMEncryptedData2' : ss + 'aws3.encrypted_data;',
			'AWSAWSIAM(long-termsecuritycredential)' : ss + 'aws3.long_term_security_credential;',
			'AWSIAMMFAToken2' : ss + 'aws3.mfa_token;',
			'AWSIAMPermissions2' : ss + 'aws3.permissions_2;',
			'AWSIAMRoles2' : ss + 'aws3.role;',
			'AWSAWSIAM(temporarysecuritycredential)' : ss + 'aws3.long_term_security_credential;',
			'AWSCloudTrail2' : ss + 'aws3.cloudtrail;',
			'AWSConfig2' : ss + 'aws3.config;',
			'AWSOpsWorksBlock3' : ss + 'aws3.opsworks;',
			'AWSAWSServiceCatalog' : ss + 'aws3.service_catalog;',
			'AWSTrustedAdvisor2' : ss + 'aws3.trusted_advisor;',
			'AWSOpsWorksApps2' : ss + 'aws3.apps;',
			'AWSOpsWorksDeployments2' : ss + 'aws3.deployments;',
			'AWSOpsWorksInstances2' : ss + 'aws3.instances_2;',
			'AWSOpsWorksLayers2' : ss + 'aws3.layers;',
			'AWSOpsWorksMonitoring2' : ss + 'aws3.monitoring;',
			'AWSOpsWorksPermissions2' : ss + 'aws3.permissions;',
			'AWSOpsWorksResources2' : ss + 'aws3.resources;',
			'AWSOpsWorksStack2' : ss + 'aws3.stack_aws_opsworks;',
//On-Demand
			'AWSMechanicalTurkBlock3' : ss + 'aws3.mechanical_turk;',
			'AWSHumanITBlock2' : ss + 'aws3.human_intelligence_tasks_hit;',
			'AWSAssignmentTaskBlock2' : ss + 'aws3.requester;',
			'AWSWorkersBlock2' : ss + 'aws3.users;',
			'AWSRequesterBlock2' : ss + 'aws3.assignment_task;',
//SDKs
			'AWSAndroidBlock3': ss + 'aws3.android;fillColor=#96BF3D;',
			'AWSiOSBlock3' : ss + 'aws3.android;fillColor=#CFCFCF;',
			'AWSJavaBlock3' : ss + 'aws3.android;fillColor=#EE472A;',
			'AWSJavaScript' : ss + 'aws3.android;fillColor=#205E00;',
			'AWSNetBlock3' : ss + 'aws3.android;fillColor=#115193;',
			'AWSNodeJSBlock3' : ss + 'aws3.android;fillColor=#8CC64F;',
			'AWSPHPBlock3' : ss + 'aws3.android;fillColor=#5A69A4;',
			'AWSPythonBlock3' : ss + 'aws3.android;fillColor=#FFD44F;',
			'AWSRubyBlock3' : ss + 'aws3.android;fillColor=#AE1F23;',
			'AWSXamarin' : ss + 'aws3.android;fillColor=#4090D7;',
			'AWSCLIBlock3' : ss + 'aws3.cli;fillColor=#444444;',
			'AWSEclipseToolkitBlock3' : ss + 'aws3.toolkit_for_eclipse;fillColor=#342074;',
			'AWSVisualStudioToolkitBlock3' : ss + 'aws3.toolkit_for_visual_studio;fillColor=#53B1CB;',
			'AWSWindowsPowershellToolkitBlock3' : ss + 'aws3.toolkit_for_windows_powershell;fillColor=#737373;',
//Analytics
			'AWSAmazonElasticsearchService' : ss + 'aws3.elasticsearch_service;',
			'AWSElasticMapReduceBlock2' : ss + 'aws3.emr;',
			'AWSClusterBlock2' : ss + 'aws3.emr_cluster;',
			'AWSEMREngine2' : ss + 'aws3.emr_engine;',
			'AWSEMRMapRM3Engine2' : ss + 'aws3.emr_engine_mapr_m3;',
			'AWSEMRMapRM5Engine2' : ss + 'aws3.emr_engine_mapr_m5;',
			'AWSEMRMapRM7Engine2' : ss + 'aws3.emr_engine_mapr_m7;',
			'AWSKinesis2' : ss + 'aws3.kinesis;',
			'AWSAmazonKinesis(AmazonKinesisAnalytics)' : ss + 'aws3.kinesis;',
			'AWSKinesisEnabledApp2' : ss + 'aws3.kinesis_enabled_app;',
			'AWSAmazonKinesis(AmazonKinesisFirehose)' : ss + 'aws3.kinesis_firehose;',
			'AWSAmazonKinesis(AmazonKinesisStreams)' : ss + 'aws3.kinesis_streams;',
			'AWSAmazonMachineLearning' : ss + 'aws3.machine_learning;',
			'AWSAmazonQuickSight' : ss + 'aws3.quicksight;',
//Mobile Services
			'AWSCognito2' : ss + 'aws3.cognito;',
			'AWSMobileAnalytics2' : ss + 'aws3.mobile_analytics;',
			'AWSAWSDeviceFarm' : ss + 'aws3.device_farm;',
			'AWSAWSMobileHub' : ss + 'aws3.mobile_hub;gradientColor=#AD688A;gradientDirection=east;',
			'AWSTopicBlock2' : ss + 'aws3.topic_2;fontStyle=1;fontColor=#ffffff;verticalAlign=top;spacingTop=-5;',
			'AWSEmailNotificationBlock2' : ss + 'aws3.email_notification;',
			'AWSHTTPNotificationBlock2' : ss + 'aws3.http_notification;',
//Developer Tools
			'AWSAWSCodeCommit' : ss + 'aws3.codecommit;',
			'AWSCodeDeploy2' : ss + 'aws3.codedeploy;',
			'AWSAWSCodePipeline' : ss + 'aws3.codepipeline;',
//Enterprise Application
			'AWSWorkDocs2' : ss + 'aws3.workdocs;',
			'AWSAmazonWorkMail' : ss + 'aws3.workmail;',
			'AWSAmazonWorkSpaces2' : ss + 'aws3.workspaces;',
//Internet of Things
			'AWSAWSIoT' : ss + 'aws3.aws_iot;',
			'AWSAWSIoT(action)' : ss + 'aws3.action;',
			'AWSAWSIoT(actuator)' : ss + 'aws3.actuator;',
			'AWSAWSIoT(certificate)' : ss + 'aws3.certificate;',
			'AWSAWSIoT(desiredstate)' : ss + 'aws3.desired_state;',
			'AWSAWSIoT(hardwareboard)' : ss + 'aws3.hardware_board;',
			'AWSAWSIoT(HTTP2protocol)' : ss + 'aws3.http_2_protocol;',
			'AWSAWSIoT(HTTPprotocol)' : ss + 'aws3.http_protocol;',
			'AWSAWSIoT(MQTTprotocol)' : ss + 'aws3.mqtt_protocol;',
			'AWSAWSIoT(policy)' : ss + 'aws3.policy;',
			'AWSAWSIoT(reportedstate)' : ss + 'aws3.reported_state;',
			'AWSAWSIoT(rule)' : ss + 'aws3.rule;',
			'AWSAWSIoT(sensor)' : ss + 'aws3.sensor;',
			'AWSAWSIoT(servo)' : ss + 'aws3.servo;',
			'AWSAWSIoT(shadow)' : ss + 'aws3.shadow;',
			'AWSAWSIoT(simulator)' : ss + 'aws3.simulator;',
			'AWSAWSIoT(thingbank)' : ss + 'aws3.bank;',
			'AWSAWSIoT(thingbicycle)' : ss + 'aws3.bicycle;',
			'AWSAWSIoT(thingcamera)' : ss + 'aws3.camera;',
			'AWSAWSIoT(thingcar)' : ss + 'aws3.car;',
			'AWSAWSIoT(thingcart)' : ss + 'aws3.cart;',
			'AWSAWSIoT(thingcoffeepot)' : ss + 'aws3.coffee_pot;',
			'AWSAWSIoT(thingdoorlock)' : ss + 'aws3.door_lock;',
			'AWSAWSIoT(thingfactory)' : ss + 'aws3.factory;',
			'AWSAWSIoT(thinggeneric)' : ss + 'aws3.generic;',
			'AWSAWSIoT(thinghouse)' : ss + 'aws3.house;',
			'AWSAWSIoT(thinglightbulb)' : ss + 'aws3.lightbulb;',
			'AWSAWSIoT(thingmedicalemergency)' : ss + 'aws3.medical_emergency;',
			'AWSAWSIoT(thingpoliceemergency)' : ss + 'aws3.police_emergency;',
			'AWSAWSIoT(thingthermostat)' : ss + 'aws3.thermostat;',
			'AWSAWSIoT(thingtravel)' : ss + 'aws3.travel;',
			'AWSAWSIoT(thingutility)' : ss + 'aws3.utility;',
			'AWSAWSIoT(thingwindfarm)' : ss + 'aws3.windfarm;',
			'AWSAWSIoT(topic)' : ss + 'aws3.topic;',
			
//AWS General			
			'AWSCloudBlock2' : ss + 'aws3.cloud;',
			'AWSVPCloudBlock3' : ss + 'aws3.virtual_private_cloud;',
			'AWSUserBlock2' : ss + 'aws3.user;',
			'AWSUsersBlock2' : ss + 'aws3.users;',
			'AWSClientBlock2' : ss + 'aws3.management_console;',
			'AWSMobileClientBlock2' : ss + 'aws3.mobile_client;',
			'AWSGenericDatabaseBlock3' : ss + 'aws3.generic_database;',
			'AWSDiskBlock3' : ss + 'aws3.disk;',
			'AWSTapeStorageBlock3' : ss + 'aws3.tape_storage;',
			'AWSMediaBlock2' : ss + 'aws3.multimedia;',
			'AWSDataCenterBlock2' : ss + 'aws3.corporate_data_center;',
			'AWSServerBlock2' : ss + 'aws3.traditional_server;',
			'AWSInternetBlock2' : ss + 'aws2.non-service_specific.internet;',
			'AWSForumsBlock3' : ss + 'aws3.forums;',
			'AWSManagementBlock2' : ss + 'aws3.management_console;',
			'AWSAmazonElasticCacheNode2' : ss + 'aws3.cache_node;',
			'AWSAmazonRedshiftDW1Cluster2' : ss + 'aws3.dense_compute_node;',
			'AWSAmazonRedshiftDW2Cluster2' : ss + 'aws3.dense_storage_node;',
			'AWSAmazonRedshiftSSDFamilyCluster2' : ss + 'aws3.dense_storage_node;',
			'AWSAmazonRoute53RouteTable2' : ss + 'aws3.route_table;',
//			'AWSExampleIAMBlock2' NA
			'AWSSubnetBlock2' : ss + 'aws3.permissions;',
//AWS Containers
//			'AWSRoundedRectangleContainerBlock2' EXT
//Azure Cloud
			'ACAccessControlBlock' : ss + 'azure.access_control;',
			'ACAPIAppsBlock' : ss + 'mscae.cloud.api_app;',
			'ACAPIManagementBlock' : ss + 'mscae.cloud.api_management;',
			'ACAppInsightsBlock' : ss + 'mscae.cloud.application_insights;',
			'ACAppServicesBlock' : ss + 'mscae.cloud.app_service;',
			'ACAutoscalingBlock' : ss + 'azure.autoscale;',
			'ACAzureActiveDirectoryBlock' : ss + 'azure.azure_active_directory;',
			'ACAzurealertBlock' : ss + 'azure.azure_alert;',
			'ACAzureAutomationBlock' : ss + 'azure.automation;',
			'ACAzureBatchBlock' : ss + 'mscae.cloud.azure_batch;',
			'ACAzureRedisBlock' : ss + 'azure.azure_cache;',
			'ACAzureFilesBlock' : ss + 'mscae.cloud.azure_files_service;',
			'ACAzureloadbalancerBlock' : ss + 'mscae.cloud.azure_automatic_load_balancer;',
			'ACAzureMarketplaceBlock' : ss + 'azure.azure_marketplace;',
			'ACAzureRightManagementRMSBlock' : ss + 'mscae.cloud.azure_rights_management_rms;',
			'ACAzureSDKBlock' : ss + 'azure.azure_sdk;',
			'ACAzureSearchBlock' : ss + 'mscae.cloud.azure_search;',
			'ACAzureSQLdatabaseBlock' : ss + 'azure.sql_database_sql_azure;',
			'ACAzuresubscriptionBlock' : ss + 'azure.azure_subscription;',
			'ACAzureWebsitesBlock' : ss + 'azure.azure_website;',
			'ACBackupServiceBlock' : ss + 'azure.backup_service;',
			'ACBitbucketcodesourceBlock' : ss + 'azure.bitbucket_code_source;',
			'ACBizTalkServicesBlock' : ss + 'azure.biztalk_services;',
			'ACCloudServiceBlock' : ss + 'azure.cloud_service;',
			'ACCodePlexBlock' : ss + 'azure.codeplex_code_source;',
//			'ACComputeBlock' NA
			'ACContentDeliveryNetworkBlock' : ss + 'azure.content_delivery_network;',
			'ACDataFactoryBlock' : ss + 'mscae.cloud.data_factory;',
//			'ACDataservicesBlock' NA
			'ACDocumentDBBlock' : ss + 'mscae.cloud.documentdb;',
			'ACDropboxcodesourceBlock' : ss + 'azure.dropbox_code_source;',
			'ACEventsHubBlock' : ss + 'mscae.cloud.event_hubs;',
			'ACExpressRouteBlock' : ss + 'azure.express_route;',
			'ACGitHubBlock' : ss + 'azure.github_code;',
			'ACGitrepositoryBlock' : ss + 'azure.git_repository;',
			'ACHDInsightBlock' : ss + 'mscae.cloud.hdinsight;',
			'ACHealthmonitoringBlock' : ss + 'azure.health_monitoring;',
			'ACHealthyBlock' : ss + 'azure.healthy;',
			'ACHybridConnectionBlock' : ss + 'mscae.cloud.hybrid_connections;',
			'ACBizTalkhybridconnectionBlock' : ss + 'mscae.cloud.hybrid_connection_manager;',
			'ACKeyVaultBlock' : ss + 'mscae.cloud.key_vault;',
			'ACLogicAppBlock' : ss + 'mscae.cloud.logic_app;',
			'ACMachineLearningBlock' : ss + 'mscae.cloud.machine_learning;',
			'ACMediaServicesBlock' : ss + 'azure.media_service;',
			'ACMicrosoftaccountBlock' : ss + 'mscae.cloud.microsoft_account;',
			'ACMicrosoftAzureBlock' : ss + 'mscae.cloud.microsoft_azure;',
			'ACMobileEngagementBlock' : ss + 'mscae.cloud.mobile_engagement;',
			'ACMobileServicesBlock' : ss + 'mscae.cloud.mobile_app;',
			'ACMultiFactorAuthBlock' : ss + 'azure.multi_factor_authentication;',
			'ACMySQLdatabaseBlock' : ss + 'azure.mysql_database;',
			'ACNotificationHubsBlock' : ss + 'azure.notification_hub;',
			'ACNotificationtopicBlock' : ss + 'azure.notification_topic;',
			'ACOperationalInsightsBlock' : ss + 'mscae.cloud.operational_insights;',
			'ACOSimageBlock' : ss + 'azure.operating_system_image;',
			'ACRemoteAppBlock' : ss + 'mscae.cloud.remoteapp;',
			'ACrpdRemotingfileBlock' : ss + 'azure.rdp_remoting_file;',
			'ACSchedulerBlock' : ss + 'azure.scheduler;',
			'ACServiceBusBlock' : ss + 'azure.service_bus;',
			'ACServiceBusQueueBlock' : ss + 'azure.service_bus_queues;',
			'ACServiceBusRelayBlock' : ss + 'azure.service_bus_relay;',
			'ACServiceBusTopicBlock' : ss + 'azure.service_bus_topics_and_subscriptions;',
			'ACServiceEndpointBlock' : ss + 'mscae.cloud.service_endpoint;',
			'ACServicepackageBlock' : ss + 'mscae.cloud.service_package;',
			'ACSiteRecoveryBlock' : ss + 'azure.hyper_v_recovery_manager;',
			'ACSQLdatabasegenericBlock' : ss + 'azure.sql_database;',
//			'ACSQLDatabasePremiumBlock' NA
			'ACSQLdatasyncBlock' : ss + 'azure.sql_datasync;',
			'ACSQLreportingdeprecatedBlock' : ss + 'azure.sql_reporting;',
			'ACStartuptaskBlock' : ss + 'azure.startup_task;',
			'ACStorageAzureBlock' : ss + 'mscae.cloud.azure_storage;',
			'ACStorageblobBlock' : ss + 'azure.storage_blob;',
			'ACStoragequeueBlock' : ss + 'azure.storage_queue;',
			'ACStoragetableBlock' : ss + 'azure.storage_table;',
			'ACStorSimpleBlock' : ss + 'azure.storsimple;',
			'ACStreamAnalyticsBlock' : ss + 'mscae.cloud.stream_analytics;',
			'ACTrafficManagerBlock' : ss + 'azure.traffic_manager;',
			'ACAlienBlock' : ss + 'azure.unidentified_code_object;',
			'ACVHDBlock' : ss + 'azure.vhd;',
			'ACVHDdatadiskBlock' : ss + 'azure.vhd_data_disk;',
			'ACVirtualmachineBlock' : ss + 'azure.virtual_machine;',
			'ACVirtualmachinecontainerBlock' : ss + 'mscae.cloud.virtual_machine_container;',
			'ACVirtualnetworkBlock' : ss + 'azure.virtual_network;',
			'ACVisualStudioOnlineBlock' : ss + 'azure.visual_studio_online;',
			'ACVMsymbolonlyBlock' : ss + 'azure.virtual_machine_feature;',
			'ACWebJobsBlock' : ss + 'mscae.cloud.webjobs;',
			'ACWebroleBlock' : ss + 'azure.web_role;',
			'ACWebrolesBlock' : ss + 'azure.web_roles;',
			'ACWorkaccountBlock' : ss + 'mscae.cloud.work_account;',
			'ACWorkerroleBlock' : ss + 'azure.worker_role;',
			'ACWorkerrolesBlock' : ss + 'azure.worker_roles;',
			'ADNSBlock' : ss + 'mscae.cloud.azure_dns;',
//			'AGatewayBlock' NA
			'ACLoadBalancerBlock' : ss + 'mscae.cloud.azure_load_balancer_feature;',
			'ACResourceGroupBlock' : ss + 'mscae.cloud.resource_group;',
			'ACVPNGatewayBlock' : ss + 'mscae.cloud.vpn_gateway;',
//Azure Enterprise
			'AEActiveDirectoryFSPBlock' : ss + 'mscae.enterprise.d;',
			'AEADFSBlock' : ss + 'mscae.enterprise.ad_fs;',
			'AEAndroidPhoneBlock' : ss + 'mscae.enterprise.android_phone;',
			'AEappblankfortextBlock' : ss + 'mscae.enterprise.application_blank;',
			'AEAppGenericBlock' : ss + 'mscae.enterprise.app_generic;',
			'AEAppserverBlock' : ss + 'mscae.enterprise.application_server;',
			'AEBackuplocalBlock' : ss + 'mscae.enterprise.backup_local;',
			'AEBackuponlineBlock' : ss + 'mscae.enterprise.backup_online;',
			'AECalendarBlock' : ss + 'mscae.general.calendar;',
			'AECertificateBlock' : ss + 'azure.certificate;',
			'AEClientAppBlock' : ss + 'mscae.enterprise.client_application;',
			'AECloudBlock' : ss + 'mscae.enterprise.internet;',
			'AEClusterserverBlock' : ss + 'mscae.enterprise.cluster_server;',
			'AECodefileBlock' : ss + 'azure.code_file;',
			'AEConnectorsBlock' : ss + 'mscae.enterprise.connectors;',
			'AEDatabasegenericBlock' : ss + 'mscae.enterprise.database_generic;',
			'AEDatabaseserverBlock' : ss + 'mscae.enterprise.database_server;',
			'AEDatabasesyncBlock' : ss + 'mscae.enterprise.database_synchronization;',
			'AEDeviceBlock' : ss + 'mscae.enterprise.device;',
			'AEDirectaccessBlock' : ss + 'mscae.enterprise.direct_access_feature;',
			'AEDocumentBlock' : ss + 'mscae.enterprise.document;',
			'AEDomaincontrollerBlock' : ss + 'mscae.enterprise.domain_controller;',
			'AEEnterpriseBuildingBlock' : ss + 'azure.enterprise;',
			'AEFilegeneralBlock' : ss + 'azure.file;',
			'AEFilterBlock' : ss + 'mscae.enterprise.filter;',
			'AEFirewallBlock' : ss + 'mscae.enterprise.firewall;',
			'AEFolderBlock' : ss + 'mscae.enterprise.folder;',
			'AEGatewayBlock' : ss + 'mscae.enterprise.gateway;',
			'AEGenericcodeBlock' : ss + 'azure.code_file;',
			'AEGraphBlock' : ss + 'mscae.general.graph;',
			'AEHealthmonitoringBlock' : ss + 'azure.health_monitoring;',
			'AEHealthyBlock' : ss + 'azure.healthy;',
			'AEImportgenericBlock' : ss + 'mscae.enterprise.import_generic;',
			'AEInternetBlock' : ss + 'mscae.enterprise.internet;',
			'AEKeyboardBlock' : ss + 'mscae.enterprise.keyboard;',
			'AEKeypermissionsBlock' : ss + 'mscae.enterprise.key_permissions;',
			'AELaptopcomputerBlock' : ss + 'azure.laptop;',
			'AELoadbalancerBlock' : ss + 'azure.load_balancer_generic;',
			'AELoadTestingBlock' : ss + 'mscae.enterprise.load_testing;',
			'AELockprotectedBlock' : ss + 'mscae.enterprise.lock;',
			'AELockunprotectedBlock' : ss + 'mscae.enterprise.lock_unlocked;',
			'AEMaintenanceBlock' : ss + 'mscae.enterprise.maintenance;',
			'AEManagementconsoleBlock' : ss + 'mscae.enterprise.management_console;',
			'AEMessageBlock' : ss + 'azure.message;',
			'AEMonitorBlock' : ss + 'azure.computer;',
			'AEMonitorrunningappsBlock' : ss + 'mscae.enterprise.monitor_running_apps;',
			'AEMouseBlock' : ss + 'mscae.enterprise.mouse;',
			'AENetworkcardBlock' : ss + 'mscae.enterprise.network_card;',
			'AENotallowedBlock' : ss + 'mscae.general.not_allowed;',
			'AEPerformanceBlock' : ss + 'mscae.enterprise.performance;',
			'AEPerformancemonitorBlock' : ss + 'mscae.enterprise.performance_monitor;',
			'AEPhoneBlock' : ss + 'azure.mobile;',
			'AEPlugandplayBlock' : ss + 'mscae.enterprise.plug_and_play;',
			'AEPowershellscriptfileBlock' : ss + 'azure.powershell_file;',
			'AEProtocolstackBlock' : ss + 'mscae.enterprise.protocol_stack;',
			'AEQueuegeneralBlock' : ss + 'azure.queue_generic;',
			'AERMSconnectorBlock' : ss + 'mscae.enterprise.rms_connector;',
			'AERouterBlock' : ss + 'mscae.enterprise.router;',
			'AEScriptfileBlock' : ss + 'azure.script_file;',
			'AESecurevirtualmachineBlock' : ss + 'mscae.enterprise.secure_virtual_machine;',
			'AEServerbladeBlock' : ss + 'azure.server;',
			'AEServerdirectoryBlock' : ss + 'mscae.enterprise.server_directory;',
			'AEServerfarmBlock' : ss + 'mscae.enterprise.server_farm;',
			'AEServergenericBlock' : ss + 'mscae.enterprise.server_generic;',
			'AEServerrackBlock' : ss + 'azure.server_rack;',
			'AESettingsBlock' : ss + 'mscae.enterprise.settings;',
			'AESharedfolderBlock' : ss + 'mscae.enterprise.shared_folder;',
			'AESmartcardBlock' : ss + 'mscae.enterprise.smartcard;',
			'AEStorageBlock' : ss + 'mscae.enterprise.storage;',
			'AETableBlock' : ss + 'mscae.enterprise.table;',
			'AETabletBlock' : ss + 'azure.tablet;',
			'AEToolBlock' : ss + 'mscae.enterprise.tool;',
			'AETunnelBlock' : ss + 'mscae.general.tunnel;',
			'AEUnhealthyBlock' : ss + 'mscae.enterprise.unhealthy;',
			'AEUSBBlock' : ss + 'mscae.enterprise.usb;',
			'AEUserBlock' : ss + 'azure.user;',
			'AEVideoBlock' : ss + 'mscae.general.video;',
			'AEVirtualmachineBlock' : ss + 'azure.virtual_machine_feature;',
			'AEWebBlock' : ss + 'mscae.enterprise.web;',
			'AEWebserverBlock' : ss + 'mscae.enterprise.web_server;',
			'AEWindowsserverBlock' : ss + 'mscae.enterprise.windows_server;',
			'AEWirelessconnectionBlock' : ss + 'mscae.enterprise.wireless_connection;',
			'AEWorkstationclientBlock' : ss + 'mscae.enterprise.workstation_client;',
			'AEXMLwebserviceBlock' : ss + 'mscae.enterprise.xml_web_service;',
			'AGSAudioBlock' : ss + 'mscae.general.audio;',
			'AGSBugBlock' : ss + 'mscae.general.bug;',
			'AGSCablesettopTVboxBlock' : ss + 'mscae.general.cable_settop_tv_box;',
			'AGSCalendarBlock' : ss + 'mscae.general.calendar;',
			'AGSChartBlock' : ss + 'mscae.general.chart;',
			'AGSCheckmarkSuccessBlock' : ss + 'mscae.general.checkmark;',
			'AGSContinousCycleCircleBlock' : ss + 'mscae.general.continuous_cycle;',
			'AGSCrossoutFailureBlock' : ss + 'mscae.general.crossout;',
			'AGSCutandpasteBlock' : ss + 'mscae.general.cut_and_paste;',
			'AGSFolderBlock' : ss + 'mscae.enterprise.folder;',
			'AGSGamecontrollerBlock' : ss + 'mscae.general.game_controller;',
			'AGSGearsBlock' : ss + 'mscae.general.gears;',
			'AGSGraphBlock' : ss + 'mscae.general.graph;',
			'AGSLikeBlock' : ss + 'mscae.general.like;',
			'AGSNotallowedBlock' : ss + 'mscae.general.not_allowed;',
			'AGSSliderbarhorizontalBlock' : ss + 'mscae.general.slider_bar_horizontal;',
			'AGSSliderbarvertBlock' : ss + 'mscae.general.slider_bar_vertical;',
			'AGSTasklistorBacklogBlock' : ss + 'mscae.general.task_list;',
			'AGSTasksBlock' : ss + 'mscae.general.tasks;',
			'AGSTunnelBlock' : ss + 'mscae.general.tunnel;',
			'AGSUserBlock' : ss + 'azure.user;',
			'AGSVideoBlock' : ss + 'mscae.general.video;',
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
			'Cisco_cisco_cloud' : s + 'cisco.storage.cloud;strokeColor=#036897;fillColor=#ffffff;',
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
			'Cisco_cisco_radio_tower' : s + 'cisco.wireless.radio_tower;strokeColor=#036897;',
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
			'Cisco_cisco_token' : s + 'cisco.misc.token;strokeColor=#036897;',
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
			'NET_PC' : s + 'networks.pc;fillColor=#29AAE1;',
			'NET_Virtual-PC' : s + 'networks.virtual_pc;fillColor=#29AAE1;',
			'NET_Terminal' : s + 'networks.terminal;fillColor=#29AAE1;',
			'NET_DataPipe' : s + 'networks.bus;fillColor=#29AAE1;',
			'NET_SlateDevice' : s + 'networks.tablet;fillColor=#29AAE1;', 
			'NET_TabletDevice' : s + 'networks.tablet;fillColor=#29AAE1;',
			'NET_Laptop' : s + 'networks.laptop;fillColor=#29AAE1;',
			'NET_PDA' : s + 'networks.mobile;fillColor=#29AAE1;',
			'NET_CRTMonitor' : s + 'networks.monitor;fillColor=#29AAE1;',
			'NET_LCDMonitor' : s + 'networks.monitor;fillColor=#29AAE1;',
//Detailed Network Diagrams
//			'NET_ABSwitch' NA
//			'NET_Repeater' NA
//			'NET_DiagnosticDevice' NA
//			'NET_CardReader' NA
//			'NET_PatchPanel' NA
			'NET_RadioTower' : s + 'networks.radio_tower;fillColor=#29AAE1;',
//			'NET_BiometricReader' NA
			'NET_ExternalHardDrive' : s + 'networks.external_storage;fillColor=#29AAE1;',
//			'NET_WebService' NA
//			'NET_FiberOptic' NA
			'NET_SatelliteDish' : s + 'networks.satellite_dish;fillColor=#29AAE1;',
			'NET_Satellite' : s + 'networks.satellite;fillColor=#29AAE1;',
//			'NET_VoIPPhone' NA
//			'NET_PBX' NA
//			'NET_MLPS' NA
//Basic Network Shapes
			'NET_WirelessAccessPoint' : s + 'networks.radio_tower;fillColor=#29AAE1;',
//			'NET_RingNetwork' EXT
//			'NET_Ethernet' EXT
			'NET_Server' : s + 'networks.server;fillColor=#29AAE1;',
//			'NET_ExternalMediaDrive' NA
			'NET_Mainframe' : s + 'networks.mainframe;fillColor=#29AAE1;',
			'NET_Router' : s + 'networks.wireless_hub;fillColor=#29AAE1;',
			'NET_Switch' : s + 'networks.switch;fillColor=#29AAE1;',
			'NET_Firewall' : s + 'networks.firewall;fillColor=#29AAE1;',
			'NET_User' : s + 'networks.user_male;fillColor=#29AAE1;',
			'NET_CommLink' : s + 'networks.comm_link_edge;fillColor=#29AAE1;',
			'NET_SuperComputer' : s + 'networks.supercomputer;fillColor=#29AAE1;',
			'NET_VirtualServer' : s + 'networks.virtual_server;fillColor=#29AAE1;',
			'NET_Printer' : s + 'networks.printer;fillColor=#29AAE1;',
//			'NET_Plotter' NA
			'NET_Scanner' : s + 'networks.scanner;fillColor=#29AAE1;',
			'NET_Copier' : s + 'networks.copier;fillColor=#29AAE1;',
//			'NET_FaxMachine' NA
			'NET_MultiFunctionMachine' : s + 'networks.copier;fillColor=#29AAE1;',
			'NET_Projector' : s + 'networks.video_projector;fillColor=#29AAE1;',
			'NET_ProjectorScreen' : s + 'networks.video_projector_screen;fillColor=#29AAE1;',
			'NET_Bridge' : s + 'networks.router;fillColor=#29AAE1;',
			'NET_Hub' : s + 'networks.hub;fillColor=#29AAE1;',
			'NET_Modem' : s + 'networks.modem;fillColor=#29AAE1;',
			'NET_Telephone' : s + 'signs.tech.telephone_5;fillColor=#29AAE1;',
			'NET_CellPhone' : s + 'networks.mobile;fillColor=#29AAE1;',
			'NET_SmartPhone' : s + 'networks.mobile;fillColor=#29AAE1;',
//			'NET_VideoPhone' NA
			'NET_Camera' : s + 'signs.tech.camera_2;fillColor=#29AAE1;',
//			'NET_VideoCamera' NA
//Server Racks
			'RackServerRack' : s + 'rackGeneral.container;container=1;collapsible=0;childLayout=rack;marginLeft=9;marginRight=9;marginTop=21;marginBottom=22;textColor=#000000;numDisp=off;',
			'RackBlank' : s + 'rackGeneral.plate;strokeColor=#666666;labelPosition=left;align=right;spacingRight=15;fillColor=#e8e8e8;',
			'RackRaidArray' : s + 'rack.cisco.cisco_carrier_packet_transport_50;labelPosition=left;align=right;spacingRight=15;',
			'RackServer' : s + 'rack.oracle.sunfire_x4100;labelPosition=left;align=right;spacingRight=15;',
			'RackEthernetSwitch' : s + 'rack.cisco.cisco_nexus_3016_switch;labelPosition=left;align=right;spacingRight=15;',
			'RackPatchPanel' : s + 'rack.general.cat5e_rack_mount_patch_panel_24_ports;strokeColor=#666666;labelPosition=left;align=right;spacingRight=15;',
			'RackRouter' : s + 'rack.cisco.cisco_asr_1001_router;labelPosition=left;align=right;spacingRight=15;',
			'RackMonitor' : s + 'rack.ibm.ibm_1u_flat_panel_console_kit;labelPosition=left;align=right;spacingRight=15;',
			'RackKeyboard' : s + 'rack.cisco.cisco_1905_serial_integrated_services_router;labelPosition=left;align=right;spacingRight=15;',
			'RackPowerStrip' : s + 'rack.dell.power_strip;labelPosition=left;align=right;spacingRight=15;',
			'RackPowerSupply' : s + 'rack.cisco.cisco_web_security_appliance_s170;labelPosition=left;align=right;spacingRight=15;',
			'RackBridge' : s + 'rack.cisco.cisco_nexus_5548p_switch;labelPosition=left;align=right;spacingRight=15;',
			'RackTapeDrive' : s + 'rack.ibm.ibm_1754_local_console_manager;labelPosition=left;align=right;spacingRight=15;',
//Network
			'Image_network_server' : 'image;image=img/lib/clip_art/computers/Server_Tower_128x128.png;flipH=1;',
			'Image_network_server_file' : 'image;image=img/lib/clip_art/computers/Server_128x128.png;',
			'Image_network_server_net' : 'image;image=img/lib/clip_art/networking/Print_Server_128x128.png;',
			'Image_network_server_net_large' : 'image;image=img/lib/clip_art/computers/Server_128x128.png;',
			'Image_network_raid' : 'image;image=img/lib/clip_art/computers/Server_Tower_128x128.png;flipH=1;',
			'Image_network_raid_large' : 'image;image=img/lib/clip_art/computers/Server_Tower_128x128.png;flipH=1;',
			'Image_network_rack_server' : 'image;image=img/lib/clip_art/computers/Server_Rack_128x128.png;',
			'Image_network_rack_tape' : 'image;image=img/lib/clip_art/computers/Server_Rack_Partial_128x128.png;',
			'Image_network_printer_small' : 'image;image=img/lib/clip_art/computers/Printer_128x128.png;flipH=1;',
			'Image_network_printer_large' : 'image;image=img/lib/clip_art/computers/Printer_128x128.png;flipH=1;',
			'Image_network_printer_multipurpose' : 'image;image=img/lib/clip_art/computers/Printer_Commercial_128x128.png;flipH=1;',
			'Image_network_copier_small' : 'image;image=img/lib/clip_art/computers/Printer_Commercial_128x128.png;',
			'Image_network_copier_large' : 'image;image=img/lib/clip_art/computers/Printer_Commercial_128x128.png;',
//			'Image_network_printer_largeformat' NA
			'Image_network_router' : 'image;image=img/lib/clip_art/networking/Router_128x128.png;',
			'Image_network_router_wireless' : 'image;image=img/lib/clip_art/networking/Wireless_Router_128x128.png;',
			'Image_network_ups' : 'image;image=img/lib/clip_art/networking/UPS_128x128.png;',
//Electronics
//			'Image_electronics_speakers_2' NA
//			'Image_electronics_scanner_slide' NA
//			'Image_electronics_speakers_2_1' NA
//			'Image_electronics_speakers_5_1' NA
			'Image_electronics_lcd' : 'image;image=img/lib/clip_art/computers/Monitor_128x128.png;',
			'Image_electronics_pda' : 'image;image=img/lib/clip_art/telecommunication/Palm_Treo_128x128.png;',
			'Image_electronics_drive_cardreader' : 'image;image=img/lib/clip_art/finance/Credit_Card_128x128.png;',
			'Image_electronics_camcorder' : 'image;image=img/lib/clip_art/networking/Ip_Camera_128x128.png;',
//			'Image_electronics_headset' NA
//			'Image_electronics_calculator_simple' NA
//			'Image_electronics_scanner_flatbed' NA
			'Image_electronics_printer_photo' : 'image;image=img/lib/clip_art/computers/Printer_128x128.png;flipH=1;',
//			'Image_electronics_scanner_photo' NA
//			'Image_electronics_projector' NA
			'Image_electronics_drive_firewire' : 'image;image=img/lib/clip_art/computers/Harddrive_128x128.png;flipH=1;',
			'Image_electronics_drive_usb' : 'image;image=img/lib/clip_art/computers/Harddrive_128x128.png;flipH=1;',
			'Image_electronics_modem_external' : 'image;image=img/lib/clip_art/networking/Modem_128x128.png;flipH=1;',
//			'Image_electronics_tv_tuner_external' NA
//			'Image_electronics_mp3' NA
//			'Image_electronics_sound_box' NA
			'Image_electronics_lcd_wide' : 'image;image=img/lib/clip_art/computers/Monitor_128x128.png;',
//Audio Equipment
//			'Image_audio_speakers_2' NA
//			'Image_audio_speakers_2_1' NA
//			'Image_audio_speakers_5_1' NA
//			'Image_audio_record_player' NA
//			'Image_audio_headset' NA
//Electrical
			'EE_Amplifier' : s + 'electrical.abstract.amplifier;',
			'EE_OpAmp' : s + 'electrical.abstract.operational_amp_1;', //EXT
			'EE_ControlledAmp' : s + 'electrical.abstract.controlled_amplifier;', //EXT
			'EE_Multiplexer' : s + 'electrical.abstract.mux;', //EXT
			'EE_Demultiplexer' : s + 'electrical.abstract.demux;', //EXT
			'EE_Capacitor1' : s + 'electrical.capacitors.capacitor_1;', //EXT
			'EE_Capacitor2' : s + 'electrical.capacitors.capacitor_3;', //EXT
			'EE_Diode' : s + 'electrical.diodes.diode;', //EXT
			'EE_Resistor' : s + 'electrical.resistors.resistor_2;', //EXT
			'EE_VarResistor' : s + 'electrical.resistors.variable_resistor_2;',
			'EE_Potentiometer' : s + 'electrical.resistors.potentiometer_2;', //EXT
			'EE_ProtGround' : s + 'electrical.signal_sources.protective_earth;',
			'EE_SignalGround' : s + 'electrical.signal_sources.signal_ground;',
			'EE_Transformer' : s + 'electrical.inductors.transformer_1;',
			'EE_Inductor' : s + 'electrical.inductors.inductor_3;', //EXT
			'EE_Variable Inductor' : s + 'electrical.inductors.variable_inductor;', //EXT
			'EE_TwoWaySwitch' : s + 'electrical.electro-mechanical.2-way_switch;',
			'EE_OnOffSwitch' : s + 'electrical.electro-mechanical.simple_switch;',
			'EE_Loudspeaker' : s + 'electrical.electro-mechanical.loudspeaker;',
			'EE_Motor' : s + 'electrical.electro-mechanical.motor_1;', //EXT
			'EE_LED1' : s + 'electrical.opto_electronics.led_2;',
			'EE_Lightbulb' : s + 'electrical.miscellaneous.light_bulb;',
//			'EE_IntegratedCircuit' EXT
//Power Sources
			'EE_AcSource' : s + 'electrical.signal_sources.ac_source;strokeWidth=1;', //EXT
			'EE_VoltageSource' : s + 'electrical.signal_sources.dc_source_3;', //EXT
			'EE_CurrentSource' : s + 'electrical.signal_sources.dc_source_2;direction=north;', //EXT
			'EE_ControlledCurrentSource' : s + 'electrical.signal_sources.dependent_source_2;direction=west;', //EXT
			'EE_ControlledVoltageSource' : s + 'electrical.signal_sources.dependent_source_3;', //EXT
			'EE_DcSource1' : s + 'electrical.miscellaneous.monocell_battery;flipH=1;verticalLabelPosition=bottom;verticalAlign=top;',
			'EE_DcSource2' : s + 'electrical.miscellaneous.multicell_battery;flipH=1;verticalLabelPosition=bottom;verticalAlign=top;',
			'EE_Vss' : s + 'electrical.signal_sources.vss2;verticalLabelPosition=top;verticalAlign=bottom;fontSize=24;',
			'EE_Vdd' : s + 'electrical.signal_sources.vdd;verticalLabelPosition=bottom;verticalAlign=top;',
//Transistors
			'EE_BJT_NPN1' : s + 'electrical.transistors.pnp_transistor_1;',
			'EE_BJT_PNP1' : s + 'electrical.transistors.npn_transistor_1;',
			'EE_JFET_P' : s + 'electrical.transistors.p-channel_jfet_1;flipV=1;',
			'EE_JFET_N' : s + 'electrical.transistors.n-channel_jfet_1;',
			'EE_MOSFET_P1' : s + 'electrical.mosfets1.mosfet_ic_p;flipV=1;',
			'EE_MOSFET_P2' : s + 'electrical.mosfets1.mosfet_p_no_bulk;',
			'EE_MOSFET_P3' : s + 'electrical.mosfets1.p-channel_mosfet_1;flipV=1;',
			'EE_MOSFET_N1' : s + 'electrical.mosfets1.mosfet_ic_n;',
			'EE_MOSFET_N2' : s + 'electrical.mosfets1.mosfet_n_no_bulk;',
			'EE_MOSFET_N3' : s + 'electrical.mosfets1.n-channel_mosfet_1;',
//Relays
//			'EE_SPST' NA
//			'EE_SPDT' NA
//			'EE_DPST' NA
//			'EE_DPDT' NA
//Logic Gates
			'EE_AND' : s + 'electrical.logic_gates.and;',
			'EE_OR' : s + 'electrical.logic_gates.or;',
			'EE_Inverter' : s + 'electrical.logic_gates.inverter;',
			'EE_NAND' : s + 'electrical.logic_gates.nand;',
			'EE_NOR' : s + 'electrical.logic_gates.nor;',
			'EE_XOR' : s + 'electrical.logic_gates.xor;',
			'EE_NXOR' : s + 'electrical.logic_gates.xnor;',
			'EE_DTypeRSFlipFlop' : s + 'electrical.logic_gates.d_type_rs_flip-flop;',
			'EE_DTypeFlipFlop' : s + 'electrical.logic_gates.d_type_flip-flop;',
			'EE_DTypeFlipFlopWithClear' : s + 'electrical.logic_gates.d_type_flip-flop_with_clear;',
			'EE_RSLatch' : s + 'electrical.logic_gates.rs_latch;',
			'EE_SyncRSLatch' : s + 'electrical.logic_gates.synchronous_rs_latch;',
			'EE_TTypeFlipFlop' : s + 'electrical.logic_gates.t_type_flip-flop;',
//Miscellaneous
			'EE_Plus' : s + 'ios7.misc.flagged;',
			'EE_Negative' : 'shape=line;',
			'EE_InverterContact' : 'shape=ellipse;',
			'EE_Voltmeter' : s + 'electrical.instruments.voltmeter;',
			'EE_Ammeter' : s + 'electrical.instruments.ampermeter;',
			'EE_SineWave' : s + 'electrical.waveforms.sine_wave;',
			'EE_Sawtooth' : s + 'electrical.waveforms.sawtooth;',
			'EE_SquareWave' : s + 'electrical.waveforms.square_wave;',
//Messaging Systems
			'EIChannelBlock' : s + 'eip.messageChannel;',
//			'EIMessageChannelBlock' NA
//			'EIMessageBlock' EXT
			'EIMessageRouterBlock' : s + 'eip.content_based_router;',
			'EIMessageTranslatorBlock' : s + 'eip.message_translator;',
//			'EIMessageEndpointBlock' EXT
//Messaging Channels
//			'EIPublishSubscribeChannelBlock' NA
//			'EIDatatypeChannelBlock' NA
//			'EIInvalidMessageChannelBlock' NA
//			'EIDeadLetterChannelBlock' NA
//			'EIGuaranteedDeliveryBlock' NA
//			'EIChannelAdapterBlock' NA
			'EIMessagingBridgeBlock' : s + 'eip.messaging_bridge;',
//			'EIMessageBusBlock' NA
//Message Construction
//			'EICommandMessageBlock' EXT
//			'EIDocumentMessageBlock' EXT
//			'EIEventMessageBlock' EXT
//			'EIEventMessageBlock' NA
//			'EIRequestReplyBlock' NA
//			'EIReturnAddressBlock' NA
//			'EICorrelationIDBlock' NA
//			'EIMessageSequenceBlock' NA
//			'EIMessageExpirationBlock' NA
//Message Routing
			'EIContentBasedRouterBlock' : s + 'eip.content_based_router;',
			'EIMessageFilterBlock' : s + 'eip.message_filter;',
			'EIDynamicRouterBlock' : s + 'eip.dynamic_router;',
			'EIRecipientListBlock' : s + 'eip.recipient_list;',
			'EISplitterBlock' : s + 'eip.splitter;',
			'EIAggregatorBlock' : s + 'eip.aggregator;',
			'EIResequencerBlock' : s + 'eip.resequencer;',
			'EIComposedMessageBlock' : s + 'eip.composed_message_processor;',
			'EIRoutingSlipBlock' : s + 'eip.routing_slip;',
			'EIProcessManagerBlock' : s + 'eip.process_manager;',
//			'EIMessageBrokerBlock' EXT
//Message Transformation
			'EIEnvelopeWrapperBlock' : s + 'eip.envelope_wrapper;',
			'EIContentEnricherBlock' : s + 'eip.content_enricher;',
			'EIContentFilterBlock' : s + 'eip.content_filter;',
			'EIClaimCheckBlock' : s + 'eip.claim_check;',
			'EINormalizerBlock' : s + 'eip.normalizer;',
//Messaging Endpoints
			'EIMessagingGatewayBlock' : s + 'eip.messaging_gateway;',
			'EITransactionalClientBlock' : s + 'eip.transactional_client;',
			'EIPollingConsumerBlock' : s + 'eip.polling_consumer;',
			'EIEventDrivenConsumerBlock' : s + 'eip.event_driven_consumer;',
			'EICompetingConsumersBlock' : s + 'eip.competing_consumers;',
			'EIMessageDispatcherBlock' : s + 'eip.message_dispatcher;',
			'EISelectiveConsumerBlock' : s + 'eip.selective_consumer;',
//			'EIDurableSubscriberBlock' NA
			'EIServiceActivatorBlock' : s + 'eip.service_activator;',
//System Management
//			'EIControlBusBlock' NA
			'EIDetourBlock' : s + 'eip.detour;',
			'EIWireTapBlock' : s + 'eip.wire_tap;',
//			'EIMessageHistoryBlock' EXT
			'EIMessageStoreBlock' : s + 'eip.message_store;',
			'EISmartProxyBlock' : s + 'eip.smart_proxy;',
			'EITestMessageBlock' : s + 'eip.test_message;',
			'EIChannelPurgerBlock' : s + 'eip.channel_purger;',
//Google Cloud Platform
			'GCPIconComputeEngineBlock' : ss + 'gcp.compute.compute_engine;',
			'GCPIconAppEngineBlock' : ss + 'gcp.compute.app_engine;',
			'GCPIconContainerEngineBlock' : ss + 'gcp.compute.container_engine;',
			'GCPIconContainerRegistryBlock' : ss + 'gcp.compute.container_registry;',
			'GCPIconCloudFunctionsBlock' : ss + 'gcp.compute.cloud_functions;',
			'GCPIconCloudStorageBlock' : ss + 'gcp.storage_databases.cloud_storage;',
			'GCPIconCloudSQLBlock' : ss + 'gcp.storage_databases.cloud_sql;',
			'GCPIconCloudBigtableBlock' : ss + 'gcp.storage_databases.cloud_bigtable;',
			'GCPIconCloudDatastoreBlock' : ss + 'gcp.storage_databases.cloud_datastore;',
			'GCPIconPersistentDiskBlock' : ss + 'gcp.storage_databases.persistent_disk;',
			'GCPIconCloudVirtualNetworkBlock' : ss + 'gcp.networking.cloud_virtual_network;',
			'GCPIconCloudLoadBalancingBlock' : ss + 'gcp.networking.cloud_load_balancing;',
			'GCPIconCloudCDNBlock' : ss + 'gcp.networking.cloud_cdn;',
			'GCPIconCloudInterconnectBlock' : ss + 'gcp.networking.cloud_interconnect;',
			'GCPIconCloudDNSBlock' : ss + 'gcp.networking.cloud_dns;',
			'GCPIconBigQueryBlock' : ss + 'gcp.big_data.bigquery;',
			'GCPIconCloudDataflowBlock' : ss + 'gcp.big_data.cloud_dataflow;',
			'GCPIconCloudDataprocBlock' : ss + 'gcp.big_data.cloud_dataproc;',
			'GCPIconCloudDatalabBlock' : ss + 'gcp.big_data.cloud_datalab;',
			'GCPIconCloudPubSubBlock' : ss + 'gcp.big_data.cloud_pubsub;',
			'GCPIconGenomicsBlock' : ss + 'gcp.big_data.genomics;',
			'GCPIconCloudMachineLearningServicesBlock' : ss + 'gcp.machine_learning.cloud_machine_learning;',
			'GCPIconVisionAPIBlock' : ss + 'gcp.machine_learning.vision_api;',
			'GCPIconSpeechAPIBlock' : ss + 'gcp.machine_learning.speech_api;',
			'GCPIconNaturalLanguageAPIBlock' : ss + 'gcp.machine_learning.natural_language_api;',
			'GCPIconTranslateAPIBlock' : ss + 'gcp.machine_learning.translation_api;',
			'GCPIconStackdriverOverviewBlock' : ss + 'gcp.management_tools.stackdriver;',
			'GCPIconMonitoringBlock' : ss + 'gcp.management_tools.monitoring;',
//			'GCPIconLoggingBlock' NA
			'GCPIconErrorReportingBlock' : ss + 'gcp.management_tools.error_reporting;',
			'GCPIconTraceBlock' : ss + 'gcp.management_tools.trace;',
			'GCPIconDebuggerBlock' : ss + 'gcp.management_tools.debugger;',
			'GCPIconDeploymentManagerBlock' : ss + 'gcp.management_tools.deployment_manager;',
			'GCPIconCloudEndpointsBlock' : ss + 'gcp.management_tools.cloud_endpoints;',
			'GCPIconCloudToolsForPowerShellBlock' : ss + 'gcp.developer_tools.cloud_tools_for_powershell;',
			'GCPIconCloudToolsForVisualStudioBlock' : ss + 'gcp.developer_tools.cloud_tools_for_visual_studio;',
			'GCPIconCloudIAMBlock' : ss + 'gcp.identity_and_security.cloud_iam;',
			'GCPIconGCPLogoBlock' : ss + 'gcp.extras.generic_gcp;',
			'GCPIconBlankBlock' : ss + 'gcp.extras.blue_hexagon;',
//Equation
//			'Equation' EXT
//Walls
			'fpWall' : 'shape=rect;',
//Rooms
//Doors & Windows
			'fpWindow' : s + 'floorplan.window;',
			'fpOpening' : 'shape=rect;',
			'fpDoor' : s + 'floorplan.doorLeft;flipV=1;', //EXT
			'fpDoubleDoor' : s + 'floorplan.doorDouble;flipV=1;', //EXT
//Stairs			
			'fpStairs' : s + 'floorplan.stairs;direction=north;',
			'fpStairsDirectional' : s + 'floorplan.stairs;direction=north;',
//			'fpStairsCurved' EXT
//			'fpStairsCurvedWide' EXT
//Desks
//			'fpDeskEndSegment' NA
			'fpDeskLongSegment' : 'shape=rect;',
			'fpDeskShortSegment' : 'shape=rect;rounded=1;',
//			'fpDeskSmallCornerSegment' NA
			'fpDeskLargeCornerSegment' : s + 'floorplan.desk_corner;',
//			'fpDeskMediumCornerSegment' NA
//			'fpDeskRoundedLSegment' NA
//			'fpDeskRoundedCornerSegment' NA
//Cubicle walls
			'fpCubiclePanel' : s + 'floorplan.wall;wallThickness=3;',
			'fpCubicleWorkstation' : s + 'floorplan.wallU;wallThickness=3;',
			'fpCubicleCorner5x5' : s + 'floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCorner6x6' : s + 'floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCorner8x8' : s + 'floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCorner8x6' : s + 'floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCornerOpen6x4' : s + 'floorplan.wallCorner;wallThickness=3;',
			'fpCubicleDouble14x8' : s + 'floorplan.wallU;wallThickness=3;',
			'fpCubicleEnclosed11x9' : s + 'floorplan.wallU;wallThickness=3;',
//Tables & Chairs
			'fpTableConferenceOval' : 'shape=ellipse;',
			'fpTableConferenceBoat' : 'shape=rect;rounded=1;',
			'fpTableConferenceRectangle' : 'shape=rect;rounded=1;',
			'fpTableDiningRound' : 'shape=ellipse;',
			'fpTableDiningSquare' : 'shape=rect;rounded=1;',
			'fpChairOffice' : s + 'floorplan.office_chair;',
			'fpChairExecutive' : s + 'floorplan.office_chair;',
			'fpChairLobby' : s + 'floorplan.office_chair;',
			'fpChairDining' : s + 'floorplan.chair;',
			'fpChairBarstool' : 'shape=ellipse;',
//Cubicles - Prebuilt
//Tables - Prebuilt
//Cabinets - we don't have corresponding stencils, just rounded rectangles			
			'fpCabinetBasic' : 'shape=rect;rounded=1;',
//			'fpCabinetCornerLarge' NA
			'fpCabinetDoubleWide' : 'shape=rect;rounded=1;',
			'fpCabinetDoubleWithShelves' : 'shape=rect;rounded=1;',
			'fpCabinetShelvesBasic' : 'shape=rect;rounded=1;',
			'fpCabinetShelvesDouble' : 'shape=rect;rounded=1;',
			'fpCabinetBasicWithShelves' : 'shape=rect;rounded=1;',
			'fpCabinetsAboveDeskShelves' : 'shape=rect;rounded=1;',
//Restroom
			'fpRestroomToiletPrivate' : s + 'floorplan.toilet;',
			'fpRestroomToiletPublic' : s + 'floorplan.toilet;',
//			'fpRestroomBidet' NA
//			'fpRestroomLights' EXT
//			'fpRestroomSinks' EXT
//			'fpRestroomGrabBar' NA
			'fpRestroomBathtub' : s + 'floorplan.bathtub;direction=south;',
			'fpRestroomShower' : s + 'floorplan.shower;flipH=1;',
//			'fpRestroomCornerSink' NA
			'fpRestroomPedastalSink' : s + 'floorplan.sink_1;',
			'fpRestroomCountertop' : 'shape=rect;rounded=1;',
			'fpRestroomMirror' : 'shape=line;strokeWidth=3;',
//			'fpDresserOrnateMirror' NA
//			'fpRestroomToiletPaper' NA
//			'fpRestroomStalls' NA
//Beds
			'fpBedDouble' : s + 'floorplan.bed_double;',
			'fpBedSingle' : s + 'floorplan.bed_single;',
			'fpBedQueen' : s + 'floorplan.bed_double;',
			'fpBedKing' : s + 'floorplan.bed_double;',
			'fpBedDoubleWithTrundle' : s + 'floorplan.bed_double;',
			'fpBedBunk' : s + 'floorplan.bed_double;',
//			'fpBedBunkL' NA
//			'fpBedCrib' NA
			'fpBedBassinet' : s + 'pid.fittings.compensator;',
//Dressers
//			'fpDresserChest' NA
//			'fpDresserMirrorDresser' NA
//			'fpClosetRod' NA
//			'fpDresserOrnateMirror' NA
//Appliances
			'fpApplianceWasher' : 'shape=rect;',
			'fpApplianceDryer' : 'shape=rect;',
			'fpApplianceWaterHeater' : 'shape=ellipse;',
//			'fpApplianceRefrigerator' NA
			'fpApplianceStoveOven' : s + 'floorplan.range_1;',
			'fpStoveOvenSixBurner' : s + 'floorplan.range_2;',
			'fpApplianceDishwasher' : 'shape=rect;',
//Kitchen
			'fpKitchenSink' : s + 'floorplan.sink_2;',
			'fpKitchenDoubleSink' : s + 'floorplan.sink_double;',
			'fpKitchenCountertop' : 'shape=rect;rounded=1;',
			'fpKitchenCountertopCorner' : s + 'floorplan.desk_corner;',
//Couches
			'fpCouchLoveSeat' : s + 'floorplan.couch;',
			'fpCouchSofa' : s + 'floorplan.couch;',
//			'fpCouchSectional' NA
			'fpCouchOttoman' : 'shape=rect;rounded=1;',
//			'fpCouchPillow' NA
//Technology
			'fpMiscDesktopComputer' : s + 'floorplan.workstation;',
			'fpMiscLaptopComputer' : s + 'floorplan.laptop;',
			'fpComputerMonitor' : s + 'floorplan.flat_tv;',
			'fpCRTTelevision' : s + 'floorplan.flat_tv;',
//			'fpMiscProjector' NA
//			'fpMiscProjectorScreen' NA
//Misc Floorplan
			'fpMiscIndoorPlant' : s + 'floorplan.plant;',
//			'fpMiscPodium' NA
			'fpPiano' : s + 'floorplan.piano;',
//			'fpPianoBench' : 'shape=rect;rounded=1;',
//Equipment
			'PEAxialCompressor' : s + 'pid.compressors.centrifugal_compressor_-_turbine_driven;',
			'PECentrifugalCompressor' : s + 'pid.compressors.centrifugal_compressor;',
			'PECentrifugalCompressor2' : s + 'pid.compressors.centrifugal_compressor_-_turbine_driven;',
//			'PECentrifugalCompressor3' NA
			'PEReciprocationCompressor' : s + 'pid.compressors.reciprocating_compressor;',
			'PERotaryCompressorBlock' : s + 'pid.compressors.rotary_compressor;',
			'PERotaryCompressor2Block' : s + 'pid.compressors.compressor_and_silencers;',
			'PEConveyorBlock' : s + 'pid2misc.conveyor;',
//			'PEOverheadConveyorBlock' NA
//			'PEScraperConveyorBlock' NA
//			'PEScrewConveyorBlock' NA
//			'PEPositiveDisplacementBlock' NA
//			'PEPositiveDisplacement2' NA
			'PEElevator1Block' : s + 'pid.misc.bucket_elevator;flipH=1;',
//			'PEElevator2Block' NA
//			'PEHoistBlock' NA
//			'PESkipHoistBlock' NA
//			'PEMotorBlock' NA
//			'PEDieselMotorBlock' NA
//			'PEElectricMotorBlock' NA
//			'PELiquidRingVacuumBlock' NA
//			'PETurbineDriverBlock' NA
//			'PEDoubleFlowTurbineBlock' NA
			'PEAgitatorMixerBlock' : s + 'pid.agitators.agitator_(propeller);',
			'PEDrumBlock' : s + 'pid.vessels.drum_or_condenser;',
			'PETankEquipmentBlock' : s + 'pid.vessels.tank;',
//			'PECentrifugalBlower' NA
//			'PEAlkylationBlock' NA
//			'PEBoomLoaderBlock' NA
//			'PEFluidCatalyticCrackingBlock' NA
//			'PEFluidCookingBlock' NA
//			'PEFluidizedReactorBlock' NA
//			'PETubularBlock' NA
//			'PEReformerBlock' NA
			'PEMixingReactorBlock' : s + 'pid.vessels.mixing_reactor;',
//			'PEHydrodesulferizationBlock' NA
//			'PEHydrocrackingBlock' NA
			'PEPlateTowerBlock' : s + 'pid2misc.column;columnType=baffle;',
			'PEPackedTowerBlock' : s + 'pid2misc.column;columnType=fixed;',
//			'PEAutomaticStokerBlock' NA
//			'PEOilBurnerBlock' NA
//			'PECounterflowForcedDraftBlock' NA
//			'PECounterflowNaturalDraftBlock' NA
//			'PECrossflowInductedBlock' NA
			'PEFurnaceBlock' : s + 'pid.vessels.furnace;',
//			'PEChimneyTowerBlock' NA
//Piping
//			'PEOneToMany' EXT
//			'PEMultilines' EXT
			'PEMidArrow' : 'shape=triangle;',
			'PEButtWeld' : s + 'sysml.x;',
			'PETopToTop' : s + 'pid.vessels.container,_tank,_cistern;',
//			'PESonicSignal' NA
			'PENuclear' : s + 'electrical.waveforms.sine_wave;',
//			'PEPneumatic' NA
//			'PEHydraulicSignalLine' NA
			'PEMechanicalLink' : 'shape=ellipse;',
			'PESolderedSolvent' : 'shape=ellipse;',
			'PEDoubleContainment' : 'shape=hexagon;',
			'PEFlange' : s + 'pid.piping.double_flange;',
			'PEFlange2' : s + 'pid.piping.flange_in;flipH=1;',
			'PEEndCap' : s + 'pid.piping.cap;',
			'PEEndCap2' : s + 'pid.vessels.container,_tank,_cistern;direction=north;',
			'PEBreather' : s + 'pid.piping.breather;',
			'PEElectronicallyInsulated' : s + 'pid.piping.double_flange;',
			'PEReducer' : s + 'pid.piping.concentric_reducer;',
			'PEInlineMixer' : s + 'pid.piping.in-line_mixer;',
//			'PESeparator' NA
//			'PEBurstingDisc' NA
			'PEFlameArrester' : s + 'pid.piping.flame_arrestor;',
//			'PEFlameArrester2' NA
			'PEDetonationArrester' : s + 'pid.piping.detonation_arrestor;',
//			'PEDrainSilencer' NA
			'PETriangleSeparator' : 'shape=triangle;direction=west;',
//			'PETriangleSeparator2' NA
			'PETundish' : s + 'ios7.misc.left;',
			'PEOpenVent' : s + 'pid.vessels.vent_(bent);',
//			'PESiphonDrain' NA
			'PERemovableSpool' : s + 'pid.piping.removable_spool;',
			'PEYTypeStrainer' : s + 'pid.piping.y-type_strainer;',
			'PEDiverterValve' : s + 'pid.piping.diverter_valve;',
			'PEPulsationDampener' : s + 'pid.piping.pulsation_dampener;',
			'PEDuplexStrainer' : s + 'pid.piping.duplex_strainer;',
			'PEBasketStrainer' : s + 'pid.piping.basket_strainer;',
			'PEVentSilencer' : s + 'pid.piping.vent_silencer;',
			'PEInlineSilencer' : s + 'pid.piping.in-line_silencer;',
			'PESteamTrap' : s + 'pid.piping.steam_trap;',
			'PEDesuperheater' : s + 'pid.piping.desuper_heater;',
			'PEEjectorOrEductor' : s + 'pid.fittings.injector;',
			'PEExhaustHead' : s + 'pid.piping.exhaust_head;',
			'PERotaryValve' : s + 'pid.piping.rotary_valve;',
			'PEExpansionJoint' : s + 'pid.piping.expansion_joint;',
//Vessels
			'PEVesselBlock' : 'shape=rect;', //EXT
			'PEOpenTankBlock' : s + 'pid.vessels.container,_tank,_cistern;', //EXT
			'PEOpenTopTank' : s + 'pid.vessels.container,_tank,_cistern;',
			'PEClosedTankBlock' : 'shape=rect;', //EXT
			'PEStorageSphereBlock' : s + 'pid.vessels.storage_sphere;',
			'PEColumnBlock' : s + 'pid.vessels.pressurized_vessel;', //EXT
			'PEBagBlock' : s + 'pid.vessels.bag;',
			'PEGasCylinderBlock' : s + 'pid.vessels.gas_bottle;',
			'PEGasHolderBlock' : s + 'pid.vessels.gas_holder;',
			'PEClarifierBlock' : s + 'pid.vessels.bunker_(conical_bottom);',
//			'PETankBlock' NA
			'PETrayColumnBlock' : s + 'pid2misc.column;columnType=tray;',
			'PEReactionVesselBlock' : s + 'pid.vessels.reactor;',
			'PEBin' : s + 'pid.vessels.tank_(conical_bottom);',
			'PEDomeRoofTank' : s + 'pid.vessels.tank_(dished_roof);',
			'PEConeRoofTank' : s + 'pid.vessels.tank_(conical_roof);',
//			'PEInternalFloatingRoof' NA
//			'PEDoubleWallTank' NA
//			'PEOnionTank' NA
//Heat Exchangers
			'PEBoilerBlock' : s + 'pid.misc.boiler_(dome);',
			'PEEquipmentBoilerBlock' : s + 'pid.misc.boiler_(dome);',
			'PEReboilerBlock' : s + 'pid.heat_exchangers.reboiler;',
			'PECondenserBlock' : s + 'pid.heat_exchangers.heat_exchanger_(straight_tubes);',
			'PEEquipmentCondenserBlock' : s + 'pid.heat_exchangers.condenser;',
//			'PEEvaporativeCondenserBlock' NA
			'PECoolingTowerBlock' : s + 'pid.misc.cooling_tower;',
			'PEHeatExchangerBlock' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_1;',
//			'PEAirCooledExchangerBlock' NA
			'PEHairpinExchangerBlock' : s + 'pid.heat_exchangers.hairpin_exchanger;',
			'PEPlateAndFrameHeatExchangerBlock' : s + 'pid.heat_exchangers.plate_and_frame_heat_exchanger;',
			'PESpiralHeatExchanger' : s + 'pid.heat_exchangers.spiral_heat_exchanger;',
			'PEUTubeHeatExchangerBlock' : s + 'pid.heat_exchangers.u-tube_heat_exchanger;',
			'PEDoublePipeHeatBlock' : s + 'pid.heat_exchangers.double_pipe_heat_exchanger;',
			'PEShellAndTubeHeat1Block' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_1;',
			'PEShellAndTubeHeat2Block' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_2;',
			'PEShellAndTubeHeat3Block' : s + 'pid.heat_exchangers.shell_and_tube_heat_exchanger_1;direction=north;',
			'PESinglePassHeatBlock' : s + 'pid.heat_exchangers.single_pass_heat_exchanger;',
			'PEHeaterBlock' : s + 'pid.heat_exchangers.heater;',
//Pumps
			'PEEjectorInjectorBlock' : s + 'pid.fittings.injector;',
			'PECompressorTurbineBlock' : s + 'pid.engines.turbine;flipH=1;', //EXT
//			'PEMotorDrivenTurbineBlock' NA
			'PETripleFanBlades2Block' : s + 'pid2misc.fan;fanType=common;',
			'PEFanBlades2Block' : s + 'pid2misc.fan;fanType=common;', //EXT
			'PECentrifugalPumpBlock' : s + 'pid.pumps.centrifugal_pump_1;', //EXT
			'PECentrifugalPump' : s + 'pid.pumps.centrifugal_pump_1;',
			'PECentrifugalPump2' : s + 'pid.pumps.centrifugal_pump_2;',
			'PECentrifugalPump3' : s + 'pid.pumps.centrifugal_pump_1;flipH=1;',
			'PEGearPumpBlock' : s + 'pid.pumps.gear_pump;',
			'PEHorizontalPump' : s + 'pid.pumps.horizontal_pump;',
			'PEProgressiveCavityPump' : s + 'pid.pumps.cavity_pump;flipH=1;flipV=1;',
			'PEScrewPump' : s + 'pid.pumps.screw_pump;',
			'PEScrewPump2' : s + 'pid.pumps.screw_pump_2;flipH=1;',
			'PESumpPump' : s + 'pid.pumps.sump_pump;',
			'PEVacuumPump' : s + 'pid.pumps.vacuum_pump;',
			'PEVerticalPump' : s + 'pid.pumps.vertical_pump;',
			'PEVerticalPump2' : s + 'pid.pumps.vertical_pump;',
//Instruments
			'PEIndicatorBlock' : s + 'pid2inst.discInst;mounting=room;', //EXT
			'PEIndicator2Block' : s + 'pid2inst.indicator;mounting=room;indType=inst;', //EXT
			'PEIndicator3Block' : s + 'pid2inst.discInst;mounting=field;',
			'PEIndicator4Block' : s + 'pid2inst.indicator;mounting=field;indType=inst;',
//			'PEIndicator5Block' NA
			'PESharedIndicatorBlock' : s + 'pid2inst.sharedCont;mounting=room;', //EXT
			'PESharedIndicator2Block' : s + 'pid2inst.indicator;mounting=room;indType=ctrl;', //EXT
//			'PEComputerIndicatorBlock' NA
			'PEProgrammableIndicatorBlock' : s + 'pid2inst.progLogCont;mounting=room;', //EXT
//Valves
			'PEGateValveBlock' : s + 'pid2valves.valve;valveType=gate;', //EXT
			'PEGlobeValveBlock' : s + 'pid2valves.valve;valveType=globe;', //EXT
			'PEControlValveBlock' : s + 'pid2valves.valve;valveType=gate;actuator=diaph;', //EXT
			'PENeedleValveBlock' : s + 'pid2valves.valve;valveType=needle;',
//			'PEButterflyValveBlock' NA
			'PEButterflyValve2Block' : s + 'pid2valves.valve;valveType=butterfly;',
//			'PEBallValveBlock' NA
			'PEDiaphragmBlock' : s + 'pid2valves.valve;valveType=ball;', 
//			'PEPlugValveBlock' NA
			'PECheckValveBlock' : s + 'pid2valves.valve;valveType=check;',
			'PECheckValve2Block' : s + 'pid2valves.valve;valveType=check;',
			'PEAngleValveBlock' : s + 'pid2valves.valve;valveType=angle;actuator=none;',
			'PEAngleGlobeValveBlock' : s + 'pid2valves.valve;valveType=angleGlobe;actuator=man;flipH=1;', //EXT
			'PEPoweredValveBlock' : s + 'pid2valves.valve;valveType=gate;actuator=digital;', //EXT
			'PEFloatOperatedValveBlock' : s + 'pid2valves.valve;valveType=gate;actuator=singActing;',
//			'PENeedleValve2Block' NA
			'PEThreeWayValveBlock' : s + 'pid2valves.valve;valveType=threeWay;actuator=none;',
//			'PEFourWayValveBlock' NA
//			'PEGaugeBlock' NA
			'PEBleederValveBlock' : s + 'pid2valves.blockBleedValve;actuator=none;',
//			'PEOrificeBlock' NA
			'PERotameterBlock' : s + 'pid.flow_sensors.rotameter;flipH=1;',
//Venn Gradient
			'VennGradientColor1' : 'shape=ellipse;fillOpacity=35;',
			'VennGradientColor2' : 'shape=ellipse;fillOpacity=35;',
			'VennGradientColor3' : 'shape=ellipse;fillOpacity=35;',
			'VennGradientColor4' : 'shape=ellipse;fillOpacity=35;',
			'VennGradientColor5' : 'shape=ellipse;fillOpacity=35;',
			'VennGradientColor6' : 'shape=ellipse;fillOpacity=35;',
			'VennGradientColor7' : 'shape=ellipse;fillOpacity=35;',
			'VennGradientColor8' : 'shape=ellipse;fillOpacity=35;',
//Venn Plain
			'VennPlainColor1' : 'shape=ellipse;fillOpacity=35;',
			'VennPlainColor2' : 'shape=ellipse;fillOpacity=35;',
			'VennPlainColor3' : 'shape=ellipse;fillOpacity=35;',
			'VennPlainColor4' : 'shape=ellipse;fillOpacity=35;',
			'VennPlainColor5' : 'shape=ellipse;fillOpacity=35;',
			'VennPlainColor6' : 'shape=ellipse;fillOpacity=35;',
			'VennPlainColor7' : 'shape=ellipse;fillOpacity=35;',
			'VennPlainColor8' : 'shape=ellipse;fillOpacity=35;',
//iOS Devices
			'iOS7DeviceiPhone5Portrait' : s + 'ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone5Landscape' : s + 'ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPadPortrait' : s + 'ios.iPad;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPadLandscape' : s + 'ios.iPad;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6Portrait' : s + 'ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6Landscape' : s + 'ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6PlusPortrait' : s + 'ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6PlusLandscape' : s + 'ios.iPhone;bgStyle=bgGreen;', //EXT
//iPhone Elements
			'iOS7StatusBariPhone' : s + 'ios7ui.appBar;',
//			'iOS7NavBariPhone' NA
//			'iOS7TabsiPhone' EXT
//			'iOS7iPhoneActionSheet' EXT
			'iOS7iPhoneKeyboard' : s + 'ios7.misc.keyboard_(letters);',
//			'iOS7TableView' EXT
//iPad Elements
			'iOS7StatusBariPad' : s + 'ios7ui.appBar;',
//			'iOS7NavBariPad' EXT
//			'iOS7TabsiPad' EXT
//			'iOS7iPadActionSheet' EXT
			'iOS7iPadKeyboard' : s + 'ios7.misc.keyboard_(letters);',
//			'iOS7SplitView'
//			'iOS7iPadPopover'
//Common Elements
//			'iOS7AlertDialog' EXT
			'iOS7ProgressBar' : s + 'ios7ui.downloadBar;', //EXT
			'iOS7Slider' : s + 'ios7ui.searchBox;', //EXT
			'iOS7SearchBar' : s + 'ios7ui.searchBox;', 
			'iOS7Button' : 'shape=rect;',
			'iOS7TextField' : 'shape=rect;',
			'iOS7TextView' : 'shape=rect;',
//			'iOS7SegmentedControl' EXT
			'iOS7Toggle' : s + 'ios7ui.onOffButton;buttonState=on;strokeColor=#38D145;strokeColor2=#aaaaaa;fillColor=#38D145;fillColor2=#ffffff;', //EXT
			'iOS7Stepper' : s + 'ios7.misc.adjust;fillColor=#ffffff;gradientColor=none;',
			'iOS7PageControls' : s + 'ios7ui.pageControl;fillColor=#666666;strokeColor=#bbbbbb;', //EXT
			'iOS7Block' : 'shape=rect;',
//			'iOS7DatePicker' EXT
//			'iOS7TimePicker' EXT
//			'iOS7CountdownPicker' EXT
//iOS Icons
			'iOS7IconArrow left' : s + 'ios7.misc.left;',
			'iOS7IconArrow' : s + 'ios7.misc.right;',
			'iOS7IconArrow up' : s + 'ios7.misc.up;',
			'iOS7IconArrow down' : s + 'ios7.misc.down;',
			'iOS7IconWifi' : s + 'ios7.icons.wifi;',
			'iOS7IconBluetooth' : s + 'ios7.icons.bluetooth;',
			'iOS7IconBattery' : s + 'ios7.icons.battery;',
			'iOS7IconSiri' : s + 'ios7.icons.microphone;',
			'iOS7IconCheck' : s + 'ios7.icons.select;',
			'iOS7IconCreate' : s + 'ios7.icons.add;',
			'iOS7IconInfo' : s + 'ios7.icons.info;',
			'iOS7IconLocation' : s + 'ios7.icons.location_2;',
			'iOS7IconQuestion' : s + 'ios7.icons.help;',
			'iOS7IconSearch' : s + 'ios7.icons.looking_glass;',
			'iOS7IconToolbox' : s + 'ios7.icons.briefcase;',
			'iOS7IconOptions' : s + 'ios7.icons.options;',
			'iOS7IconShare' : s + 'ios7.icons.share;',
			'iOS7IconTyping' : s + 'ios7.icons.message;',
			'iOS7IconCopy' : s + 'ios7.icons.folders_2;',
			'iOS7IconChat' : s + 'ios7.icons.messages;',
			'iOS7IconOrganize' : s + 'ios7.icons.folder;',
			'iOS7IconTrash' : s + 'ios7.icons.trashcan;',
			'iOS7IconReply' : s + 'ios7.icons.back;',
			'iOS7IconArchive' : s + 'ios7.icons.box;',
			'iOS7IconCompose' : s + 'ios7.icons.compose;',
			'iOS7IconSend' : s + 'ios7.icons.pointer;',
			'iOS7IconDrawer' : s + 'ios7.icons.storage;',
			'iOS7IconMail' : s + 'ios7.icons.mail;',
			'iOS7IconDocument' : s + 'ios7.icons.document;',
			'iOS7IconFlag' : s + 'ios7.icons.flag;',
			'iOS7IconBookmarks' : s + 'ios7.icons.book;',
			'iOS7IconGlasses' : s + 'ios7.icons.glasses;',
			'iOS7IconFiles' : s + 'ios7.icons.folders;',
			'iOS7IconDownloads' : s + 'ios7.icons.down;',
			'iOS7IconLock' : s + 'ios7.icons.locked;',
//			'iOS7IconUnlock' NA
			'iOS7IconCloud' : s + 'ios7.icons.cloud;',
//			'iOS7IconCloud-lock' NA
			'iOS7IconOrientation Lock' : s + 'ios7.icons.orientation_lock;',
//			'iOS7IconNotification' NA
			'iOS7IconContacts' : s + 'ios7.icons.user;',
			'iOS7IconGlobal' : s + 'ios7.icons.globe;',
			'iOS7IconSettings' : s + 'ios7.icons.settings;',
			'iOS7IconAirplay' : s + 'ios7.icons.move_to_folder;',
			'iOS7IconCamera' : s + 'ios7.icons.camera;',
			'iOS7IconAirplane' : s + 'signs.transportation.airplane_6;direction=south;',
			'iOS7IconCalculator' : s + 'ios7.icons.calculator;',
			'iOS7IconPreferences' : s + 'ios7.icons.most_viewed;',
			'iOS7IconPhone' : s + 'signs.tech.telephone_3;',
			'iOS7IconKeypad' : s + 'ios7.icons.keypad;',
			'iOS7IconVoicemail' : s + 'ios7.icons.tape;',
			'iOS7IconStar' : s + 'ios7.icons.star;',
			'iOS7IconMost Viewed' : s + 'ios7.icons.most_viewed;',
			'iOS7IconVideo' : s + 'ios7.icons.video_conversation;',
			'iOS7IconVolumne Controls' : s + 'ios7.icons.volume;',
			'iOS7IconLocation pin' : s + 'ios7.icons.location;',
			'iOS7IconCalendar' : s + 'ios7.icons.calendar;',
			'iOS7IconAlarm' : s + 'ios7.icons.alarm_clock;',
			'iOS7IconClock' : s + 'ios7.icons.clock;',
			'iOS7IconTimer' : s + 'ios7.icons.gauge;',
			'iOS7IconVolume down' : s + 'ios7.icons.silent;',
			'iOS7IconVolume' : s + 'ios7.icons.volume_2;',
			'iOS7IconVolume up' : s + 'ios7.icons.loud;',
			'iOS7IconRepeat' : s + 'ios7.icons.reload;',
			'iOS7IconRewind' : s + 'ios7.icons.backward;',
			'iOS7IconPlay' : s + 'ios7.icons.play;',
			'iOS7IconPause' : s + 'ios7.icons.pause;',
			'iOS7IconFast forward' : s + 'ios7.icons.forward;',
//			'iOS7IconArtists' NA
//			'iOS7IconPlaylist' NA
			'iOS7IconControls' : s + 'ios7.icons.controls;',
//			'iOS7IconShuffle' NA
			'iOS7IconPrivacy' : s + 'ios7.icons.privacy;',
			'iOS7IconLink' : s + 'ios7.icons.link;',
			'iOS7IconLight' : s + 'ios7.icons.flashlight;',
			'iOS7IconBrightness' : s + 'ios7.icons.sun;',
			'iOS7IconHeart' : s + 'ios7.icons.heart;',
			'iOS7IconJava' : s + 'ios7.icons.cup;',
			'iOS7IconBox' : s + 'ios7.icons.bag;',
			'iOS7IconEye' : s + 'ios7.icons.eye;',
			'iOS7IconDo not disturb' : s + 'ios7.icons.moon;',
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
			'UI2BrowserBlock' : s + 'mockup.containers.browserWindow;mainText=,;', //EXT
			'UI2WindowBlock' : s + 'mockup.containers.window;strokeColor2=#008cff;strokeColor3=#c4c4c4;fontColor=#666666;mainText=;', 
//			'UI2DialogBlock' EXT
			'UI2AreaBlock' : 'shape=rect;',
			'UI2ElementBlock' : 'shape=rect;',
//			'UI2AccordionBlock' EXT
//			'UI2TabBarContainerBlock' EXT
//			'UI2TabBar2ContainerBlock' EXT
//			'UI2VTabBarContainerBlock' EXT
			'UI2VScrollBlock' : s + 'mockup.navigation.scrollBar;direction=north;',
			'UI2HScrollBlock' : s + 'mockup.navigation.scrollBar;',
			'UI2VerticalSplitterBlock' : s + 'mockup.forms.splitter;direction=north;',
			'UI2HorizontalSplitterBlock' : s + 'mockup.forms.splitter;',
//UI Widgets
			'UI2ImageBlock' : s + 'mockup.graphics.simpleIcon;',
			'UI2VideoBlock' : s + 'mockup.containers.videoPlayer;barHeight=30;',
			'UI2AudioBlock' : s + 'mockup.misc.playbackControls;',
			'UI2MapBlock' : s + 'mockup.misc.map;',
//			'UI2CalendarBlock' NA
			'UI2BarChartBlock' : s + 'mockup.graphics.barChart;strokeColor=none;strokeColor2=none;',
			'UI2ColumnChartBlock' : s + 'mockup.graphics.columnChart;strokeColor=none;strokeColor2=none;',
			'UI2LineChartBlock' : s + 'mockup.graphics.lineChart;strokeColor=none;',
			'UI2PieChartBlock' : s + 'mockup.graphics.pieChart;parts=10,20,35;',
			'UI2WebcamBlock' : s + 'mockup.containers.userMale;',
			'UI2CaptchaBlock' : s + 'mockup.text.captcha;mainText=;',
//			'Image_ui_formatting_toolbar2'
//UI Input
			'UI2ButtonBlock' : 'shape=rect;rounded=1;',
//			'UI2CheckBoxBlock' EXT
//			'UI2HorizontalCheckBoxBlock' EXT
//			'UI2RadioBlock' EXT
//			'UI2HorizontalRadioBlock' EXT
			'UI2ColorPickerBlock' : s + 'mockup.forms.colorPicker;chosenColor=#aaddff;',
			'UI2TextInputBlock' : 'shape=rect;rounded=1;',
			'UI2SelectBlock' : s + 'mockup.forms.comboBox;strokeColor=#999999;fillColor=#ddeeff;align=left;fillColor2=#aaddff;mainText=;fontColor=#666666;',
			'UI2VSliderBlock' : s + 'mockup.forms.horSlider;sliderStyle=basic;sliderPos=20;handleStyle=circle;direction=north;',
			'UI2HSliderBlock' : s + 'mockup.forms.horSlider;sliderStyle=basic;sliderPos=20;handleStyle=circle;',
//			'UI2DatePickerBlock' NA
			'UI2SearchBlock' : s + 'mockup.forms.searchBox;mainText=;flipH=1;',
			'UI2NumericStepperBlock' : s + 'mockup.forms.spinner;spinLayout=right;spinStyle=normal;adjStyle=triangle;fillColor=#000000;mainText=;',
//			'UI2TableBlock' EXT
//UI Menus
//			'UI2ButtonBarBlock' EXT
//			'UI2VerticalButtonBarBlock' EXT
//			'UI2LinkBarBlock' EXT
//			'UI2BreadCrumbsBlock' EXT
//			'UI2MenuBarBlock' EXT
			'UI2AtoZBlock' : s + 'mockup.text.alphanumeric;linkText=;fontStyle=4;',
			'UI2PaginationBlock' : s + 'mockup.navigation.pagination;linkText=;fontStyle=4;',
//			'UI2ContextMenuBlock' EXT
//			'UI2TreePaneBlock'EXT
			'UI2PlaybackControlsBlock' : s + 'mockup.misc.playbackControls;fillColor=#ffffff;strokeColor=#999999;fillColor2=#99ddff;strokeColor2=none;fillColor3=#ffffff;strokeColor3=none;',
			'Image_ui_formatting_toolbar' : s + 'mockup.menus_and_buttons.font_style_selector_2;',
//UI Misc
			'UI2ProgressBarBlock' : s + 'mockup.misc.progressBar;fillColor2=#888888;barPos=25;',
			'UI2HelpIconBlock' : s + 'mockup.misc.help_icon;',
			'UI2BraceNoteBlock' : s + 'mockup.markup.curlyBrace;direction=north;', //EXT
			'UI2TooltipBlock' : s + 'basic.rectangular_callout;flipV=1;', //EXT
			'UI2CalloutBlock' : 'shape=ellipse;',
//			'UI2AlertBlock' EXT
//iOS 6 iPad Elements
			'Image_ipad_ipad' : s + 'ios.iPad;bgStyle=bgGreen;',
			'iPadGrayBackgroundBlock' : 'shape=rect;',
			'Image_ipad_top_bar' : s + 'ios.iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc;',
//			'Image_ipad_bar_gray' : 'shape=rect;',
//			'Image_ipad_bar_semi_trans_black' : 'shape=rect;',
//			'Image_ipad_bar_black' : 'shape=rect;',
//			'Image_ipad_safari_top' NA
			'Image_ipad_search' : s + 'mockup.forms.searchBox;mainText=;flipH=1;',
//			'Image_ipad_alert_dialog' EXT
//			'Image_ipad_dialog' EXT
			'Image_ipad_popover' : s + 'ios.iOption;barPos=50;pointerPos=top;buttonText=;',
//			'Image_ipad_table' EXT
//			'Image_ipad_vtab' EXT
//iOS 6 iPad Controls
			'Image_ipad_button_black' : 'shape=rect;roudned=1;',
			'Image_ipad_button_blue' : 'shape=rect;roudned=1;',
			'Image_ipad_button_grayblue' : 'shape=rect;roudned=1;',
			'Image_ipad_button_red' : 'shape=rect;roudned=1;',
			'Image_ipad_back_button_gray' : s + 'ios.iButtonBack;buttonText=;fillColor=#eeeeee;fillColor2=#aaaaaa;',
			'Image_ipad_back_button_black' : s + 'ios.iButtonBack;buttonText=;fillColor=#888888;fillColor2=#000000;',
			'Image_ipad_sort_handle' : s + 'ios7.icons.options;',
			'Image_ipad_dropdown' : s + 'ios.iComboBox;buttonText=;fillColor=#dddddd;fillColor2=#3D5565;',
			'Image_ipad_email_name' : 'shape=rect;rounded=1;',
			'Image_ipad_prev_next' : s + 'ios.iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff;',
			'Image_ipad_keyboard_portrait' : s + 'ios.iKeybLett;',
			'Image_ipad_keyboard_landscape' : s + 'ios.iKeybLett;',
//			'Image_ipad_large_tabbed_button' EXT
//			'Image_ipad_sort_button' EXT
//			'Image_ipad_tab_bar' EXT
			'Image_ipad_slider' : s + 'ios.iSlider;barPos=20;',
//			'Image_ipad_switch_off'
//iOS 6 iPad Icons
			'Image_ipad_add_icon_blue' : s + 'ios.iAddIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_ipad_add_icon_green' : s + 'ios.iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff;',
			'Image_ipad_remove_icon' : s + 'ios.iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;',
			'Image_ipad_arrow_icon' : s + 'ios.iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_ipad_arrow' : s + 'ios7.misc.more;',
			'Image_ipad_checkmark' : s + 'ios7.misc.check;',
			'Image_ipad_check_off' : 'shape=ellipse;', //EXT
			'Image_ipad_location_dot' : 'shape=ellipse;',
			'Image_ipad_mark_as_read' : 'shape=ellipse;',
			'Image_ipad_pin_green' : s + 'ios.iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;',
			'Image_ipad_pin_red' : s + 'ios.iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;',
			'Image_ipad_radio_off' : 'shape=ellipse;', //EXT
			'Image_ipad_checkbox_off' : 'shape=rect;rounded=1;', //EXT
			'Image_ipad_indicator' : 'shape=rect;rounded=1;fillColor=#e8878E;gradientColor=#BD1421;strokeColor=#ffffff;',
//iOS 6 iPhone Elements
			'Image_iphone_iphone_4' : s + 'ios.iPhone;bgStyle=bgGreen;',
			'Image_iphone_bg_black' : 'shape=rect;',
			'Image_iphone_bg_gray' : 'shape=rect;',
			'Image_iphone_bg_stripe_drk' : s + 'ios.iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F;',
			'Image_iphone_bg_stripe_lt' : s + 'ios.iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F;',
			'Image_iphone_bg_white' : 'shape=rect;',
			'Image_iphone_top_bar_app' : s + 'ios.iAppBar;',
			'Image_iphone_top_bar_home' : s + 'ios.iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc;strokeWidth=1;',
			'Image_iphone_bar_top' : 'shape=rect;',
			'Image_iphone_bar_semi_trans_black' : 'shape=rect;',
			'Image_iphone_bar_semi_trans_blue' : 'shape=rect;',
			'Image_iphone_search' : s + 'mockup.forms.searchBox;mainText=;flipH=1;',
//			'Image_iphone_table' EXT
//			'Image_iphone_table_w_buttons' EXT
//			'Image_iphone_table_w_icons' EXT
//			'Image_iphone_list' EXT
//			'Image_iphone_safari_top' NA
//			'Image_iphone_safari_bottom' NA
			'Image_iphone_gray_grad_list' : 'shape=rect;rounded=1;', //EXT
//			'Image_iphone_alert_bar' NA
//			'Image_iphone_alert_dialog' EXT
//			'Image_iphone_dialog' EXT
//			'Image_iphone_scroll_pane' EXT
			'Image_iphone_alpha_list' : s + 'ios.iAlphaList;',
//iOS 6 iPhone Controls
			'Image_iphone_button_black' : 'shape=rect;rounded=1;',
			'Image_iphone_button_blue' : 'shape=rect;rounded=1;',
			'Image_iphone_button_grayblue' : 'shape=rect;rounded=1;',
			'Image_iphone_button_red' : 'shape=rect;rounded=1;',
			'Image_iphone_button_lg_light' : 'shape=rect;rounded=1;',
			'Image_iphone_button_lg_dark' : 'shape=rect;rounded=1;',
			'Image_iphone_button_lg_green' : 'shape=rect;rounded=1;',
			'Image_iphone_button_lg_red' : 'shape=rect;rounded=1;',
			'Image_iphone_button_lg_yellow' : 'shape=rect;rounded=1;',
			'Image_iphone_button_xl_green' : 'shape=rect;rounded=1;',
			'Image_iphone_back_button' : s + 'ios.iButtonBack;strokeColor=#444444;buttonText=;fillColor=#dddddd;fillColor2=#3D5565;',
			'Image_iphone_prev_next' : s + 'ios.iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff;',
			'Image_iphone_sort_handle' : s + 'ios7.icons.options;',
			'Image_iphone_slider' : s + 'ios.iSlider;barPos=60;',
			'Image_iphone_dropdown' : s + 'ios.iComboBox;buttonText=;fillColor=#dddddd;fillColor2=#3D5565;',
			'Image_iphone_email_name' : 'shape=rect;rounded=1;',
			'Image_iphone_switch_off' : s + 'android.switch_off;fillColor=#666666;', //EXT
			'Image_iphone_keyboard_button_blue' : 'shape=rect;rounded=1;',
			'Image_iphone_keyboard_letters' : s + 'ios.iKeybLett;',
			'Image_iphone_keyboard_landscape' : s + 'ios.iKeybLett;',
//			'Image_iphone_large_tabbed_button' EXT
//			'Image_iphone_sort_button' EXT
//			'Image_iphone_tab_bar' EXT
//			'Image_iphone_picker_multi' EXT
//			'Image_iphone_picker_web' EXT
//iOS 6 iPhone Icons
			'Image_iphone_add_icon_blue' : s + 'ios.iAddIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_iphone_add_icon_green' : s + 'ios.iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff;',
			'Image_iphone_remove_icon' : s + 'ios.iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;',
			'Image_iphone_arrow_icon' : s + 'ios.iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_iphone_arrow' : s + 'ios7.misc.more;',
			'Image_iphone_checkmark' : s + 'ios7.misc.check;',
			'Image_iphone_check_off' : 'shape=ellipse;', //EXT
			'Image_iphone_location_dot' : 'shape=ellipse;',
			'Image_iphone_mark_as_read' : 'shape=ellipse;',
			'Image_iphone_pin_green' : s + 'ios.iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;',
			'Image_iphone_pin_red' : s + 'ios.iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;',
			'Image_iphone_radio_off' : 'shape=ellipse;', //EXT
			'Image_iphone_checkbox_off' : 'shape=rect;rounded=1;', //EXT
			'Image_iphone_indicator' : 'shape=rect;rounded=1;fillColor=#e8878E;gradientColor=#BD1421;strokeColor=#ffffff;',
			// NOTE: NO COMMA ON LAST LINE
			'Image_iphone_thread_count' : 'shape=rect;rounded=1;'
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
				text2 = props.State.t;
			}
		}

		// TODO: Convert text object to HTML
		if (text != null)
		{
			if (text.t != null)
			{
				return text.t;
				other = false;
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
		
	function updateCell(cell, obj)
	{
		var a = getAction(obj);
		
		if (a != null)
		{
			var s = styleMap[a.Class];
			
			if (s != null)
			{
				cell.style += s;
			}
			else if (a.Class != null)
			{
//				console.log('no mapping', a.Class);
			}
			
			var p = (a.Properties != null) ? a.Properties : a;
			
			if (p != null)
			{
				//adds label
				cell.value = convertText(p);

				//adds font size
				var isV = false;
				
				if (p.Text != null)
				{
					if (p.Text.m != null)
					{
						var m = p.Text.m;
						var i = 0;
						
						while ((!isV) && (i < m.length))
						{
							var currM = m[i];
							
							if (currM.n == 's')
							{
								if (currM.v != null)
								{
									isV = true;

									var fontSize = currM.v;
									fontSize = 1 + Math.round(fontSize / 1.8);
									cell.style += 'fontSize=' + fontSize + ';';
								}
							}
							i++;
						}
					}
				}
				
				if (isV == 0)
				{
					cell.style += 'fontSize=10;';
				}
				
				//adds font color
				var isC = false;
				
				if (p.Text != null)
				{
					if (p.Text.m != null)
					{
						var m = p.Text.m;
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

									cell.style += mxConstants.STYLE_FONTCOLOR + '=' + currV + ';';
								}
							}
							
							i++;
						}
					}

					var fontStyle = 0;

					//check for bold text
					var isBT = false;
					
					if (p.Text.m != null)
					{
						var m = p.Text.m;
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
					
					if (p.Text.m != null)
					{
						var m = p.Text.m;
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
					
					if (p.Text.m != null)
					{
						var m = p.Text.m;
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
						cell.style += 'fontStyle=' + fontStyle + ';';
					}
					
					//adds text alignment
					var isA = false;
					
					if (p.Text != null)
					{
						if (p.Text.m != null)
						{
							var m = p.Text.m;
							var i = 0;
							
							while ((!isA) && (i < m.length))
							{
								var currM = m[i];
								
								if (currM.n == 'a')
								{
									if (currM.v != null)
									{
										isA = true;
										
										var currV = currM.v;
										
										cell.style += 'align=' + currV + ';';
									}
								}
								
								i++;
							}
						}
					}

					//adds left spacing
					var isIL = false;
					
					if (p.Text != null)
					{
						if (p.Text.m != null)
						{
							var m = p.Text.m;
							var i = 0;
							
							while ((!isIL) && (i < m.length))
							{
								var currM = m[i];
								
								if (currM.n == 'il')
								{
									if (currM.v != null)
									{
										isIL = true;
										
										var currV = currM.v;
										
										cell.style += 'spacingLeft=' + currV + ';';
									}
								}
								
								i++;
							}
						}
					}

					//adds right spacing
					var isIR = false;
					
					if (p.Text != null)
					{
						if (p.Text.m != null)
						{
							var m = p.Text.m;
							var i = 0;
							
							while ((!isIR) && (i < m.length))
							{
								var currM = m[i];
								
								if (currM.n == 'ir')
								{
									if (currM.v != null)
									{
										isIR = true;
										
										var currV = currM.v;
										
										cell.style += 'spacingRight=' + currV + ';';
									}
								}
								
								i++;
							}
						}
					}

					//adds top spacing
					var isMT = false;
					
					if (p.Text != null)
					{
						if (p.Text.m != null)
						{
							var m = p.Text.m;
							var i = 0;
							
							while ((!isMT) && (i < m.length))
							{
								var currM = m[i];
								
								if (currM.n == 'mt')
								{
									if (currM.v != null)
									{
										isMT = true;
										
										var currV = currM.v;
										
										cell.style += 'spacingTop=' + currV + ';';
									}
								}
								
								i++;
							}
						}
					}

					//adds bottom spacing
					var isMB = false;
					
					if (p.Text != null)
					{
						if (p.Text.m != null)
						{
							var m = p.Text.m;
							var i = 0;
							
							while ((!isMB) && (i < m.length))
							{
								var currM = m[i];
								
								if (currM.n == 'mb')
								{
									if (currM.v != null)
									{
										isMB = true;
										
										var currV = currM.v;
										
										cell.style += 'spacingBottom=' + currV + ';';
									}
								}
								
								i++;
							}
						}
					}

					//adds global spacing
					if (typeof p.InsetMargin === 'number')
					{
							cell.style += 'spacing=' + parseInt(p.InsetMargin) + ';';
					}
					
					//adds opacity
					if (typeof p.LineColor === 'string')
					{
						if (p.LineColor.length > 7)
						{
							var sOpac = "0x" + p.LineColor.substring(p.LineColor.length - 2, p.LineColor.length);
							cell.style += 'strokeOpacity=' + Math.round(parseInt(sOpac) / 2.55) + ';';
						}
					}
					
					if (typeof p.FillColor === 'string')
					{
						if (p.FillColor.length > 7)
						{
							var fOpac = "0x" + p.FillColor.substring(p.FillColor.length - 2, p.FillColor.length);
							cell.style += 'fillOpacity=' + Math.round(parseInt(fOpac) / 2.55) + ';';
						}
					}

					// adds text vertical alignment
					if (p.Text_VAlign != null)
					{
						if (typeof p.Text_VAlign === 'string')
						{
							cell.style += 'verticalAlign=' + p.Text_VAlign + ';';
						}
					}
				}

				// Converts images
				if (a.Class == 'ImageSearchBlock2')
				{
					cell.style += 'image=' + p.URL + ';';
				}
				
				// Adds styles
				cell.style += createStyle(mxConstants.STYLE_STROKEWIDTH, p.LineWidth, '1');
				
//				stencils with hardcoded stroke color
				var hardStroke = ['VennPlainColor1', 'VennPlainColor2', 'VennPlainColor3', 'VennPlainColor4', 'VennPlainColor5', 'VennPlainColor6', 'VennPlainColor7', 'VennPlainColor8',
					'VennGradientColor1', 'VennGradientColor2', 'VennGradientColor3', 'VennGradientColor4', 'VennGradientColor5', 'VennGradientColor6', 'VennGradientColor7', 'VennGradientColor8'];
				
				if (!hardStroke.includes(a.Class))
				{
					if (p.LineWidth == 0)
					{
						cell.style += mxConstants.STYLE_STROKECOLOR + '=none;';
					}
					else
					{
						cell.style += createStyle(mxConstants.STYLE_STROKECOLOR, p.LineColor.substring(0, 7), '#000000');
					}
				}
				else
				{
					var t = a.Class.substring(0,4); 
					if (t == 'Venn')
					{
						cell.style += createStyle(mxConstants.STYLE_STROKECOLOR, p.FillColor.substring(0, 7), '#FFFFFF');
					}
				}
				
				cell.style += createStyle(mxConstants.STYLE_ALIGN, p.TextAlign, 'center');
				cell.style += createStyle(mxConstants.STYLE_VERTICAL_ALIGN, p.TextVAlign, 'middle');
				
//				stencils with hardcoded opacity
				var hardOpacity = ['VennPlainColor1', 'VennPlainColor2', 'VennPlainColor3', 'VennPlainColor4', 'VennPlainColor5', 'VennPlainColor6', 'VennPlainColor7', 'VennPlainColor8', 
					'VennGradientColor1', 'VennGradientColor2', 'VennGradientColor3', 'VennGradientColor4', 'VennGradientColor5', 'VennGradientColor6', 'VennGradientColor7', 'VennGradientColor8'];

				if (!hardOpacity.includes(a.Class))
				{
					cell.style += createStyle(mxConstants.STYLE_OPACITY, p.Opacity, '100');
				}

				
				// Converts rotation
				if (p.Rotation != null)
				{
					// KNOWN: TextRotation currently ignored
					var deg = mxUtils.toDegree(parseFloat(p.Rotation));
					
					// Fixes the case for horizontal swimlanes where we use horizontal=0
					// and Lucid uses rotation
					
					//stencils to rotate counter clockwise 90 degrees
					var rccw = ['AEUSBBlock', 'AGSCutandpasteBlock', 'iOSDeviceiPadLandscape', 'iOSDeviceiPadProLandscape'];
					
					if (a.Class == 'AdvancedSwimLaneBlockRotated')
					{
						deg += 90;
						cell.geometry.rotate90();
					}
					else if (rccw.includes(a.Class))
					{
						deg -= 90;
						cell.geometry.rotate90();
						cell.geometry.rotate90();
						cell.geometry.rotate90();
					}
					cell.style += 'rotation=' + deg + ';';
				}
				
				if (p.FlipX)
				{
					cell.style += 'flipH=1;';
				}
				
				if (p.FlipY)
				{
					cell.style += 'flipV=1;';
				}
				
				// Shadow is mapped simple shadow style
				if (p.Shadow != null)
				{
					cell.style += mxConstants.STYLE_SHADOW + '=1;';
				}
				
				// Stroke style
				if (p.StrokeStyle == 'dashed')
				{
					cell.style += 'dashed=1;';
				}
				else if (p.StrokeStyle == 'dotted')
				{
					cell.style += 'dashed=1;dashPattern=1 4;';
				}
				
				// Gradients and fill color
				if (p.FillColor != null)
				{
					//stencils with hardCoded fill color
					var exc = ['AWSAndroidBlock3', 'AWSiOSBlock3', 'AWSJavaBlock3', 'AWSJavaScript', 'AWSNetBlock3', 'AWSNodeJSBlock3', 'AWSPHPBlock3', 'AWSPythonBlock3', 'AWSRubyBlock3', 'AWSXamarin', 'AWSCLIBlock3', 'AWSEclipseToolkitBlock3', 'AWSVisualStudioToolkitBlock3', 'AWSWindowsPowershellToolkitBlock3', 'DefaultTextBlock', 'RectangleContainerBlock'];
				
					if (!exc.includes(a.Class))
					{
						if (typeof p.FillColor === 'object')
						{
							if (p.FillColor.cs != null && p.FillColor.cs.length > 1)
							{
								cell.style += createStyle(mxConstants.STYLE_FILLCOLOR, p.FillColor.cs[0].c.substring(0, 7));
								cell.style += createStyle(mxConstants.STYLE_GRADIENTCOLOR, p.FillColor.cs[1].c.substring(0, 7));
							}
						}
						else if (typeof p.FillColor === 'string')
						{
							cell.style += createStyle(mxConstants.STYLE_FILLCOLOR, p.FillColor.substring(0, 7), '#FFFFFF');
						}
						else
						{
							cell.style += createStyle(mxConstants.STYLE_FILLCOLOR, 'none');
						}
					}
				}

				// Edge style
				if (cell.edge)
				{
					cell.style += 'rounded=1;arcSize=' + arcSize + ';';
					
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
						var s = p.Endpoint1.Style;
						
						if (s == 'None')
						{
							cell.style += 'startArrow=none;';
						}
						else if (s == 'Arrow')
						{
							cell.style += 'startArrow=block;endFill=1;';
						}
						else if (s == 'Hollow Arrow')
						{
							cell.style += 'startArrow=block;endFill=0;';
						}
						else if (s == 'Open Arrow')
						{
							cell.style += 'startArrow=open;';
						}
						else if (s == 'CFN ERD Zero Or More Arrow')
						{
							cell.style += 'startArrow=ERzeroToMany;startSize=10;';
						}
						else if (s == 'CFN ERD One Or More Arrow')
						{
							cell.style += 'startArrow=ERoneToMany;startSize=10;';
						}
						else if (s == 'CFN ERD Many Arrow')
						{
							cell.style += 'startArrow=ERmany;startSize=10;';
						}
						else if (s == 'CFN ERD Exactly One Arrow')
						{
							cell.style += 'startArrow=ERmandOne;startSize=10;';
						}
						else if (s == 'CFN ERD Zero Or One Arrow')
						{
							cell.style += 'startArrow=ERzeroToOne;startSize=10;';
						}
						else if (s == 'CFN ERD One Arrow')
						{
							cell.style += 'startArrow=ERone;startSize=10;';
						}
					}
					
					if (p.Endpoint2.Style != null)
					{
						var s = p.Endpoint2.Style;
						
						if (s == 'None')
						{
							cell.style += 'endArrow=none;';
						}
						else if (s == 'Arrow')
						{
							cell.style += 'endArrow=block;endFill=1;';
						}
						else if (s == 'Hollow Arrow')
						{
							cell.style += 'endArrow=block;endFill=0;';
						}
						else if (s == 'Open Arrow')
						{
							cell.style += 'endArrow=open;';
						}
						else if (s == 'CFN ERD Zero Or More Arrow')
						{
							cell.style += 'endArrow=ERzeroToMany;endSize=10;';
						}
						else if (s == 'CFN ERD One Or More Arrow')
						{
							cell.style += 'endArrow=ERoneToMany;endSize=10;';
						}
						else if (s == 'CFN ERD Many Arrow')
						{
							cell.style += 'endArrow=ERmany;endSize=10;';
						}
						else if (s == 'CFN ERD Exactly One Arrow')
						{
							cell.style += 'endArrow=ERmandOne;endSize=10;';
						}
						else if (s == 'CFN ERD Zero Or One Arrow')
						{
							cell.style += 'endArrow=ERzeroToOne;endSize=10;';
						}
						else if (s == 'CFN ERD One Arrow')
						{
							cell.style += 'endArrow=ERone;endSize=10;';
						}
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
				var ta = ta['t' + count];
				e = insertLabel(ta, e);
				count++;
			}
			
			var ta = (p != null) ? p.TextAreas : obj.TextAreas;
			
			if (ta.Message != null)
			{
				e = insertLabel(ta.Message, e);
			}
			
			if (ta.Text != null)
			{
				e = insertLabel(ta.Text, e);
			}
		}
		
		return e;
	}

	function insertLabel(textArea, e)
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
					((source) ? 'exitPerimeter' : 'entryPerimeter') + '=0;';
			}
				
			if (endpoint.Style == 'Arrow')
			{
				cell.style += ((source) ? 'startArrow' : 'endArrow') + '=block;';
			}
			else if (endpoint.Style == 'Hollow Arrow')
			{
				cell.style += ((source) ? 'startArrow' : 'endArrow') + '=block;';
				cell.style += ((source) ? 'startFill' : 'endFill') + '=0;';
			}
			else if (endpoint.Style == 'Open Arrow')
			{
				cell.style += ((source) ? 'startArrow' : 'endArrow') + '=open;';
				cell.style += ((source) ? 'startSize' : 'endSize') + '=12;';
			}
		}
	};

	var hideObj = function(key, groups, hidden)
	{
		if (!hidden.includes(key))
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
	
	EditorUi.prototype.pasteLucidChart = function(g, dx, dy, crop)
	{
		// Creates a new graph, inserts cells and returns XML for insert
		var graph = this.editor.graph;
		
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
						if (!hidden.includes(key))
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
					
					if (!hidden.includes(key))
					{
					    lookup[obj.id] = createVertex(obj);
						queue.push(obj);
					}
				}
			}
			else
			{
				for (var i = 0; i < g.Objects.length; i++)
				{
					var obj = g.Objects[i];
					
					if (obj.IsBlock && obj.Action != null && obj.Action.Properties != null)
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
					var obj = g.Lines[key];
				    addLine(obj, obj);
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

			graph.setSelectionCells(select);
		}
		finally
		{
			graph.getModel().endUpdate();
		}
		
		if (!graph.isSelectionEmpty())
		{
			graph.scrollCellToVisible(graph.getSelectionCell());
			
			if (this.hoverIcons != null)
			{
				this.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
			}
		}
	};

})();

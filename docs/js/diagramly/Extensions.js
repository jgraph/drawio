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
	
	// TODO: Add shape mappings
	// FIXME: Factor our common strings, eg. shape=mxgraph. to save space
	var styleMap = {
//Standard
			'DefaultTextBlockNew': 'text;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;',
			'DefaultSquareBlock': 'rounded=1;arcSize=' + arcSize + ';',
			'DefaultNoteBlock': 'shape=note;size=15;',
			'HotspotBlock': 'strokeColor=none;opacity=50;',
			'ImageSearchBlock2': 'shape=image;',
//Flowchart
			'ProcessBlock': 'rounded=1;arcSize=' + arcSize + ';',
			'DecisionBlock': 'rhombus;rounded=1;arcSize=' + arcSize + ';',
			'TerminatorBlock': 'rounded=1;arcSize=50;',
			'PredefinedProcessBlock': 'shape=process;rounded=1;arcSize=' + arcSize + ';',
			'DocumentBlock': 'shape=document;',
			'MultiDocumentBlock': 'shape=mxgraph.flowchart.multi-document;',
			'ManualInputBlock': 'shape=manualInput;size=15;rounded=1;arcSize=' + arcSize + ';',
			'PreparationBlock': 'shape=hexagon;rounded=1;arcSize=' + arcSize + ';',
			'DataBlockNew': 'shape=parallelogram;rounded=1;arcSize=' + arcSize + ';',
			'DatabaseBlock': 'shape=cylinder;',
			'DirectAccessStorageBlock': 'shape=mxgraph.flowchart.direct_data;',
			'InternalStorageBlock': 'shape=internalStorage;rounded=1;arcSize=' + arcSize + ';dx=10;dy=10;',
			'PaperTapeBlock': 'shape=tape;size=0.2;',
			'ManualOperationBlockNew': 'shape=trapezoid;rounded=1;arcSize=' + arcSize + ';flipV=1;',
			'DelayBlock': 'shape=delay;',
			'StoredDataBlock': 'shape=dataStorage;',
			'MergeBlock': 'triangle;direction=south;rounded=1;arcSize=' + arcSize + ';',
			'ConnectorBlock': 'ellipse;',
			'OrBlock': 'shape=mxgraph.flowchart.summing_function;',
			'SummingJunctionBlock': 'shape=mxgraph.flowchart.or;',
			'DisplayBlock': 'shape=display;',
			'OffPageLinkBlock': 'shape=offPageConnector;rounded=1;arcSize=' + arcSize + ';',
			'BraceNoteBlock': 'shape=curlyBracket;rounded=1;', //EXT
			'NoteBlock': 'shape=mxgraph.flowchart.annotation_1;',
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
			'RightTriangleBlock': 'shape=mxgraph.basic.orthogonal_triangle;',
			'PentagonBlock': 'shape=mxgraph.basic.pentagon;',
			'HexagonBlock': 'shape=hexagon;rounded=1;arcSize=' + arcSize + ';',
			'OctagonBlock': 'shape=mxgraph.basic.octagon;',
			'CrossBlock': 'shape=cross;size=0.6;',
			'CloudBlock': 'ellipse;shape=cloud;',
			'HeartBlock': 'shape=mxgraph.basic.heart;',
			'RightArrowBlock': 'shape=singleArrow;arrowWidth=0.5;arrowSize=0.3;',
			'DoubleArrowBlock': 'shape=doubleArrow;arrowWidth=0.5;arrowSize=0.3;',
			'CalloutBlock': 'shape=mxgraph.basic.rectangular_callout;',
			'ShapeCircleBlock': 'ellipse;',
			'ShapePolyStarBlock': 'shape=mxgraph.basic.star;',
			'ShapeDiamondBlock': 'rhombus;rounded=1;arcSize=' + arcSize + ';',
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
			'AndroidIconCheck': 'shape=mxgraph.ios7.misc.check;',
//			'AndroidIconBack' NA
//			'AndroidIconCancel' NA
			'AndroidIconCollapse': 'shape=mxgraph.ios7.misc.up;',
			'AndroidIconExpand': 'shape=mxgraph.ios7.misc.down;',
//			'AndroidIconForward' NA
			'AndroidIconNext': 'shape=mxgraph.ios7.misc.right;',
			'AndroidIconPrevious': 'shape=mxgraph.ios7.misc.left;',
//			'AndroidIconRefresh' NA
			'AndroidIconInformation': 'shape=mxgraph.ios7.icons.info;',
//			'AndroidIconHelp' NA
			'AndroidIconSearch': 'shape=mxgraph.ios7.icons.looking_glass;',
			'AndroidIconSettings': 'shape=mxgraph.ios7.icons.volume;direction=south;',
//			'AndroidIconDislike' NA
//			'AndroidIconLike' NA
//			'AndroidIconDelete' NA
//			'AndroidIconCopy' NA
//			'AndroidIconCut' NA
//			'AndroidIconPaste' NA
			'AndroidIconTrash': 'shape=mxgraph.ios7.icons.trashcan;',
			'AndroidIconEmail': 'shape=mxgraph.mockup.misc.mail2;',
			'AndroidIconNew': 'shape=mxgraph.ios7.misc.flagged;', 
//			'AndroidIconImage' NA
//			'AndroidIconUndo' NA
//			'AndroidIconSharing' NA
//			'AndroidIconDownload' NA
//			'AndroidIconError' NA
//			'AndroidIconWarning' NA
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
			'UMLActiveClassBlock': 'shape=mxgraph.flowchart.predefined_process;',
//			'UMLMultiplicityBlock' NA
			'UMLPackageBlock': 'shape=folder;tabPosition=left;',
//			'UMLConstraintBlock' NA
			'UMLNoteBlock': 'shape=note;size=15;',
			'UMLTextBlock': 'shape=text;strokeColor=none;fillColor=none;',
//UML Use Case
			'UMLActorBlock': 'shape=umlActor;',
			'UMLUseCaseBlock': 'shape=ellipse;',
			'UMLCircleContainerBlock': 'shape=ellipse;container=1;',
			'UMLRectangleContainerBlock': 'rounded=1;container=1;',
//UML State/Activity			
			'UMLOptionLoopBlock' : 'shape=mxgraph.sysml.package;xSize=90;align=left;spacingLeft=10;overflow=fill;',
			'UMLStartBlock' : 'shape=ellipse;fillColor=#000000;',
			'UMLStateBlock' : 'shape=rect;rounded=1;',
			'UMLDecisionBlock' : 'shape=rhombus;rounded=1;',
			'UMLHForkJoinBlock' : 'shape=rect;rounded=1;fillColor=#000000;',
			'UMLVForkJoinBlock' : 'shape=rect;rounded=1;fillColor=#000000;',
			'UMLFlowFinalBlock' : 'shape=mxgraph.flowchart.or;',
			'UMLHistoryStateBlock' : 'shape=ellipse;',
			'UMLEndBlock' : 'shape=mxgraph.bpmn.shape;outline=end;symbol=terminate;',
			'UMLObjectBlock' : 'shape=rect;rounded=1;',
			'UMLSendSignalBlock' : 'shape=mxgraph.sysml.sendSigAct;',
			'UMLReceiveSignalBlock' : 'shape=mxgraph.sysml.accEvent;',
			'UMLAcceptTimeEventActionBlock' : 'shape=mxgraph.sysml.timeEvent;',
//			'UMLInterruptingEdgeBlock' NA
			'UMLOffPageLinkBlock' : 'shape=mxgraph.sysml.sendSigAct;direction=south;',
//			'UMLExpansionNodeBlock' NA
//			'UMLMultiLanePoolBlock' EXT
//			'UMLMultiLanePoolRotatedBlock' EXT
//			'UMLMultidimensionalSwimlane' EXT
//UML Sequence
			'UMLActivationBlock' : 'shape=rect;rounded=1;',
			'UMLDeletionBlock' : 'shape=mxgraph.sysml.x;strokeWidth=4;',
//			'UMLAlternativeBlock' NA
			'UMLSeqEntityBlock' : 'shape=mxgraph.electrical.radio.microphone_1;direction=north;',
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
			'YDMDFDDataStoreBlock' : 'shape=mxgraph.bootstrap.horLines;',
			'GSDFDProcessBlock' : 'shape=swimlane;rounded=1;',
			'GSDFDProcessBlock2' : 'shape=rect;rounded=1;',
//			'GSDFDDataStoreBlock' NA
//			'GSDFDDataStoreBlock2' NA
//Org Chart
			'OrgBlock' : 'shape=rect;rounded=1;',
//Tables
//			'DefaultTableBlock' EXT
//Processes
			'VSMCustomerSupplierBlock' : 'shape=mxgraph.lean_mapping.outside_sources;',
			'VSMDedicatedProcessBlock' : 'shape=mxgraph.lean_mapping.manufacturing_process;',
			'VSMSharedProcessBlock' : 'shape=mxgraph.lean_mapping.manufacturing_process_shared;',
			'VSMWorkcellBlock' : 'shape=mxgraph.lean_mapping.work_cell;',
//			'VSMDatacellBlock' EXT
//Materials
			'VSMInventoryBlock' : 'shape=mxgraph.lean_mapping.inventory_box;',
//			'VSMSupermarketBlock' EXT
			'VSMPhysicalPullBlock' : 'shape=mxgraph.lean_mapping.physical_pull;direction=south;',
			'VSMFIFOLaneBlock' : 'shape=mxgraph.lean_mapping.fifo_sequence_flow;fontStyle=0;fontSize=20',
//			'VSMSafetyBufferStockBlock' EXT
//Shipments
			'VSMExternalShipmentAirplaneBlock' : 'shape=mxgraph.lean_mapping.airplane_7;',
			'VSMExternalShipmentForkliftBlock' : 'shape=mxgraph.lean_mapping.move_by_forklift;',
			'VSMExternalShipmentTruckBlock' : 'shape=mxgraph.lean_mapping.truck_shipment;',
			'VSMExternalShipmentBoatBlock' : 'shape=mxgraph.lean_mapping.boat_shipment;',
//Information
			'VSMProductionControlBlock' : 'shape=mxgraph.lean_mapping.manufacturing_process;',
			'VSMOtherInformationBlock' : 'shape=rect;rounded=1;',
//			'VSMHeijyunkaBoxBlock' NA
			'VSMSequencedPullBallBlock' : 'shape=mxgraph.lean_mapping.sequenced_pull_ball;',
			'VSMMRPERPBlock' : 'shape=mxgraph.lean_mapping.mrp_erp;whiteSpace=wrap;',
			'VSMLoadLevelingBlock' : 'shape=mxgraph.lean_mapping.load_leveling;',
			'VSMGoSeeBlock' : 'shape=mxgraph.lean_mapping.go_see_production_scheduling;flipH=1;',
			'VSMGoSeeProductionBlock' : 'shape=ellipse;',
			'VSMVerbalInfoBlock' : 'shape=mxgraph.lean_mapping.verbal;',
//Value Stream Mapping
			'VSMKaizenBurstBlock' : 'shape=mxgraph.lean_mapping.kaizen_lightening_burst;',
			'VSMOperatorBlock' : 'shape=mxgraph.lean_mapping.operator;flipV=1;',
//			'VSMTimelineBlock' EXT
			'VSMQualityProblemBlock' : 'shape=mxgraph.lean_mapping.quality_problem;',
//Kanban
			'VSMProductionKanbanSingleBlock' : 'shape=mxgraph.lean_mapping.production_kanban;',
//			'VSMProductionKanbanBatchBlock' NA
			'VSMWithdrawalKanbanBlock' : 'shape=mxgraph.lean_mapping.withdrawal_kanban;',
//			'VSMWithdrawalKanbanBatchBlock' NA
			'VSMSignalKanbanBlock' : 'shape=mxgraph.lean_mapping.signal_kanban;',
			'VSMKanbanPostBlock' : 'shape=mxgraph.lean_mapping.kanban_post;',
//Arrows
			'VSMShipmentArrow': 'shape=singleArrow;arrowWidth=0.5;arrowSize=0.13;',
			'VSMPushArrow' : 'shape=mxgraph.lean_mapping.push_arrow;',
//			'VSMElectronicInformationArrow' : 'shape=mxgraph.lean_mapping.electronic_info_flow_edge;', EXT
//EC2
			'AWSElasticComputeCloudBlock2' : 'shape=mxgraph.aws2.compute_and_networking.ec2;strokeColor=none;',
			'AWSInstanceBlock2' : 'shape=mxgraph.aws2.compute_and_networking.ec2_instance;strokeColor=none;',
			'AWSInstancesBlock2' : 'shape=mxgraph.aws2.compute_and_networking.ec2_instances;strokeColor=none;',
			'AWSAMIBlock2' : 'shape=mxgraph.aws2.compute_and_networking.ec2_ami;strokeColor=none;',
			'AWSDBonInstanceBlock2' : 'shape=mxgraph.aws2.compute_and_networking.ec2_db_on_instance;strokeColor=none;',
			'AWSInstanceCloudWatchBlock2' : 'shape=mxgraph.aws2.compute_and_networking.ec2_cloudwatch;strokeColor=none;',
			'AWSElasticIPBlock2' : 'shape=mxgraph.aws2.compute_and_networking.ec2_elastic_ip;strokeColor=none;',
			'AWSElasticMapReduceBlock2' : 'shape=mxgraph.aws2.compute_and_networking.emr;strokeColor=none;',
			'AWSClusterBlock2' : 'shape=mxgraph.aws2.compute_and_networking.emr_cluster;strokeColor=none;',
			'AWSHDFSClusterBlock2' : 'shape=mxgraph.aws2.compute_and_networking.emr_hdfs_cluster;strokeColor=none;',
			'AWSAutoScalingBlock2' : 'shape=mxgraph.aws2.compute_and_networking.auto_scaling;strokeColor=none;',
//Networking
			'AWSElasticLoadBlock2' : 'shape=mxgraph.aws2.compute_and_networking.elastic_load_balancing;strokeColor=none;',
			'AWSDirectConnectBlock3' : 'shape=mxgraph.aws2.compute_and_networking.aws_direct_connect;strokeColor=none;',
			'AWSElasticNetworkBlock2' : 'shape=mxgraph.aws2.compute_and_networking.elastic_network_instance;strokeColor=none;',
			'AWSRoute53Block2' : 'shape=mxgraph.aws2.compute_and_networking.route_53;strokeColor=none;',
			'AWSHostedZoneBlock2' : 'shape=mxgraph.aws2.compute_and_networking.route_53_hosted_zone;strokeColor=none;',
			'AWSRouteTableBlock2' : 'shape=mxgraph.aws2.compute_and_networking.route_53_route_table;strokeColor=none;',
			'AWSVPCBlock2' : 'shape=mxgraph.aws2.compute_and_networking.vpc;strokeColor=none;',
			'AWSVPNConnectionBlock2' : 'shape=mxgraph.aws2.compute_and_networking.vpc_vpn_connection;strokeColor=none;',
			'AWSVPNGatewayBlock2' : 'shape=mxgraph.aws2.compute_and_networking.vpc_vpn_gateway;strokeColor=none;',
			'AWSCustomerGatewayBlock2' : 'shape=mxgraph.aws2.compute_and_networking.vpc_customer_gateway;strokeColor=none;',
			'AWSInternetGatewayBlock2' : 'shape=mxgraph.aws2.compute_and_networking.vpc_internet_gateway;strokeColor=none;',
			'AWSRouterBlock2' : 'shape=mxgraph.aws2.compute_and_networking.vpc_router;strokeColor=none;',
//S3
			'AWSSimpleStorageBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.s3;strokeColor=none;',
			'AWSBucketBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.s3_bucket;strokeColor=none;',
			'AWSBuckethWithObjectsBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.s3_bucket_with_objects;strokeColor=none;',
			'AWSObjectBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.s3_objects;strokeColor=none;',
			'AWSImportExportBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.aws_import_export;strokeColor=none;',
			'AWSStorageGatewayBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.aws_storage_gateway;strokeColor=none;',
			'AWSElasticBlockStorageBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.ebs;strokeColor=none;',
			'AWSVolumeBlock3' : 'shape=mxgraph.aws2.storage_and_content_delivery.ebs_volume;strokeColor=none;',
			'AWSSnapshotBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.ebs_snapshot;strokeColor=none;',
			'AWSGlacierBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.glacier;strokeColor=none;',
			'AWSGlacierArchiveBlock3' : 'shape=mxgraph.aws2.storage_and_content_delivery.glacier_archive;strokeColor=none;',
			'AWSGlacierVaultBlock3' : 'shape=mxgraph.aws2.storage_and_content_delivery.glacier_vault;strokeColor=none;',
//Content Delivery
			'AWSCloudFrontBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.cloudfront;strokeColor=none;',
			'AWSDownloadDistBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.cloudfront_download_distribution;strokeColor=none;',
			'AWSStreamingBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.cloudfront_streaming_distribution;strokeColor=none;',
			'AWSEdgeLocationBlock2' : 'shape=mxgraph.aws2.storage_and_content_delivery.cloudfront_edge_location;strokeColor=none;',
//Database
			'AWSItemBlock2' : 'shape=mxgraph.aws2.database.dynamodb_item;strokeColor=none;',
			'AWSItemsBlock2' : 'shape=mxgraph.aws2.database.dynamodb_items;strokeColor=none;',
			'AWSAttributeBlock2' : 'shape=mxgraph.aws2.database.dynamodb_attribute;strokeColor=none;',
			'AWSAttributesBlock2' : 'shape=mxgraph.aws2.database.dynamodb_attributes;strokeColor=none;',
			'AWSRDBSBlock2' : 'shape=mxgraph.aws2.database.rds;strokeColor=none;',
			'AWSRDSInstanceBlock2' : 'shape=mxgraph.aws2.database.rds_db_instance;strokeColor=none;',
			'AWSRDSStandbyBlock2' : 'shape=mxgraph.aws2.database.rds_instance_standby;strokeColor=none;',
			'AWSRDSInstanceReadBlock2' : 'shape=mxgraph.aws2.database.rds_instance_read_replica;strokeColor=none;',
			'AWSOracleDBBlock2' : 'shape=mxgraph.aws2.database.rds_oracle_db_instance;strokeColor=none;',
			'AWSMySQLDBBlock2' : 'shape=mxgraph.aws2.database.rds_mysql_db_instance;strokeColor=none;',
			'AWSMSSQLDBBlock3' : 'shape=mxgraph.aws2.database.rds_ms_sql_instance;strokeColor=none;',
			'AWSDynamoDBBlock2' : 'shape=mxgraph.aws2.database.dynamodb;strokeColor=none;',
			'AWSSimpleDatabaseBlock3' : 'shape=mxgraph.aws2.database.simpledb;strokeColor=none;',
			'AWSSimpleDatabaseDomainBlock3' : 'shape=mxgraph.aws2.database.simpledb_domain;strokeColor=none;',
			'AWSTableBlock2' : 'shape=mxgraph.aws2.database.dynamodb_table;strokeColor=none;',
			'AWSAmazonRedShiftBlock3' : 'shape=mxgraph.aws2.database.redshift;strokeColor=none;',
			'AWSElastiCacheNodeBlock2' : 'shape=mxgraph.aws2.database.elasticcache_node;strokeColor=none;',
			'AWSElastiCacheBlock2' : 'shape=mxgraph.aws2.database.elasticcache;strokeColor=none;',
//App Services
			'AWSSESBlock2' : 'shape=mxgraph.aws2.app_services.ses;strokeColor=none;',
			'AWSEmailBlock2' : 'shape=mxgraph.aws2.app_services.email;strokeColor=none;',
			'AWSSNSBlock2' : 'shape=mxgraph.aws2.app_services.sns;strokeColor=none;',
			'AWSTopicBlock2' : 'shape=mxgraph.aws2.app_services.sns_topic;strokeColor=none;',
			'AWSEmailNotificationBlock2' : 'shape=mxgraph.aws2.app_services.sns_email_notification;strokeColor=none;',
			'AWSHTTPNotificationBlock2' : 'shape=mxgraph.aws2.app_services.sns_http_notification;strokeColor=none;',
			'AWSSQSBlock3' : 'shape=mxgraph.aws2.app_services.sqs;strokeColor=none;',
			'AWSQueueBlock2' : 'shape=mxgraph.aws2.app_services.sqs_queue;strokeColor=none;',
			'AWSMessageBlock2' : 'shape=mxgraph.aws2.app_services.sqs_message;strokeColor=none;',
			'AWSDeciderBlock2' : 'shape=mxgraph.aws2.app_services.swf_decider;strokeColor=none;',
			'AWSSWFBlock2' : 'shape=mxgraph.aws2.app_services.swf;strokeColor=none;',
			'AWSWorkerBlock2' : 'shape=mxgraph.aws2.app_services.swf_worker;strokeColor=none;',
			'AWSCloudSearchBlock2' : 'shape=mxgraph.aws2.app_services.cloudsearch;strokeColor=none;',
			'AWSCloudSearchMetadataBlock3' : 'shape=mxgraph.aws2.app_services.cloudsearch_sdf_metadata;strokeColor=none;',
			'AWSElasticTranscoder3' : 'shape=mxgraph.aws2.app_services.elastic_transcoder;strokeColor=none;',
//Deployment
			'AWSCloudFormationBlock2' : 'shape=mxgraph.aws2.deployment_and_management.cloudformation;strokeColor=none;',
			'AWSDataPipelineBlock3' : 'shape=mxgraph.aws2.deployment_and_management.data_pipeline;strokeColor=none;',
			'AWSTemplageBlock2' : 'shape=mxgraph.aws2.deployment_and_management.cloudformation_template;strokeColor=none;',
			'AWSStackBlock2' : 'shape=mxgraph.aws2.deployment_and_management.cloudformation_stack;strokeColor=none;',
			'AWSBeanStockBlock2' : 'shape=mxgraph.aws2.deployment_and_management.elastic_beanstalk;strokeColor=none;',
			'AWSApplicationBlock2' : 'shape=mxgraph.aws2.deployment_and_management.elastic_beanstalk_application;strokeColor=none;',
			'AWSBeanstalkDeploymentBlock3' : 'shape=mxgraph.aws2.deployment_and_management.elastic_beanstalk_deployment;strokeColor=none;',
			'AWSIAMBlock3' : 'shape=mxgraph.aws2.deployment_and_management.iam;strokeColor=none;',
			'AWSIAMSTSBlock3' : 'shape=mxgraph.aws2.deployment_and_management.iam_sts;strokeColor=none;',
			'AWSIAMAddonBlock2' : 'shape=mxgraph.aws2.deployment_and_management.iam_add-on;strokeColor=none;',
			'AWSCloudWatchBlock3' : 'shape=mxgraph.aws2.deployment_and_management.cloudwatch;strokeColor=none;',
			'AWSCloudWatchAlarmBlock2' : 'shape=mxgraph.aws2.deployment_and_management.cloudwatch_alarm;strokeColor=none;',
			'AWSOpsWorksBlock3' : 'shape=mxgraph.aws2.deployment_and_management.opsworks;strokeColor=none;',
//On-Demand
			'AWSMechanicalTurkBlock3' : 'shape=mxgraph.aws2.on-demand_workforce.mechanical_turk;strokeColor=none;',
			'AWSHumanITBlock2' : 'shape=mxgraph.aws2.on-demand_workforce.mechanical_turk_human_intelligence_tasks;strokeColor=none;',
			'AWSAssignmentTaskBlock2' : 'shape=mxgraph.aws2.on-demand_workforce.mechanical_turk_requester;strokeColor=none;',
			'AWSWorkersBlock2' : 'shape=mxgraph.aws2.on-demand_workforce.mechanical_turk_workers;strokeColor=none;',
			'AWSRequesterBlock2' : 'shape=mxgraph.aws2.on-demand_workforce.mechanical_turk_assignment_task;strokeColor=none;',
//SDKs
			'AWSAndroidBlock3': 'shape=mxgraph.aws2.sdks.android;',
			'AWSiOSBlock3' : 'shape=mxgraph.aws2.sdks.ios;',
			'AWSJavaBlock3' : 'shape=mxgraph.aws2.sdks.java;',
			'AWSNetBlock3' : 'shape=mxgraph.aws2.sdks.net;',
			'AWSNodeJSBlock3' : 'shape=mxgraph.aws2.sdks.nodejs;',
			'AWSPHPBlock3' : 'shape=mxgraph.aws2.sdks.php;',
			'AWSPythonBlock3' : 'shape=mxgraph.aws2.sdks.python;',
			'AWSRubyBlock3' : 'shape=mxgraph.aws2.sdks.ruby;',
			'AWSCLIBlock3' : 'shape=mxgraph.aws2.sdks.cli;',
			'AWSEclipseToolkitBlock3' : 'shape=mxgraph.aws2.sdks.aws_toolkit_for_eclipse;',
			'AWSVisualStudioToolkitBlock3' : 'shape=mxgraph.aws2.sdks.aws_toolkit_for_visual_studio;',
			'AWSWindowsPowershellToolkitBlock3' : 'shape=mxgraph.aws2.sdks.tools_for_windows_powershell;',
//AWS Other			
			'AWSCloudBlock2' : 'shape=mxgraph.aws2.non-service_specific.cloud;strokeColor=none;',
			'AWSVPCloudBlock3' : 'shape=mxgraph.aws2.non-service_specific.virtual_private_cloud;strokeColor=none;',
			'AWSUserBlock2' : 'shape=mxgraph.aws2.non-service_specific.user;strokeColor=none;',
			'AWSUsersBlock2' : 'shape=mxgraph.aws2.non-service_specific.users;strokeColor=none;',
			'AWSClientBlock2' : 'shape=mxgraph.aws2.non-service_specific.client;strokeColor=none;',
			'AWSMobileClientBlock2' : 'shape=mxgraph.aws2.non-service_specific.mobile_client;strokeColor=none;',
			'AWSGenericDatabaseBlock3' : 'shape=mxgraph.aws2.non-service_specific.generic_database;strokeColor=none;',
			'AWSDiskBlock3' : 'shape=mxgraph.aws2.non-service_specific.disk;strokeColor=none;',
			'AWSTapeStorageBlock3' : 'shape=mxgraph.aws2.non-service_specific.tape_storage;strokeColor=none;',
			'AWSMediaBlock2' : 'shape=mxgraph.aws2.non-service_specific.multimedia;strokeColor=none;',
			'AWSDataCenterBlock2' : 'shape=mxgraph.aws2.non-service_specific.corporate_data_center;strokeColor=none;',
			'AWSServerBlock2' : 'shape=mxgraph.aws2.non-service_specific.traditional_server;strokeColor=none;',
			'AWSInternetBlock2' : 'shape=mxgraph.aws2.non-service_specific.internet;strokeColor=none;',
			'AWSForumsBlock3' : 'shape=mxgraph.aws2.non-service_specific.forums;strokeColor=none;',
			'AWSManagementBlock2' : 'shape=mxgraph.aws2.non-service_specific.management_console;strokeColor=none;',
//			'AWSExampleIAMBlock2' NA
//			'AWSSubnetBlock2' NA
//AWS Containers
//			'AWSRoundedRectangleContainerBlock2' EXT
//Cisco Basic
			'Cisco_cisco_androgenous_person' : 'shape=mxgraph.cisco.people.androgenous_person;' + c,
			'Cisco_cisco_atm_switch' : 'shape=mxgraph.cisco.switches.atm_switch;' + c,
			'Cisco_cisco_cloud' : 'shape=mxgraph.cisco.storage.cloud;strokeColor=#036897;fillColor=#ffffff;',
			'Cisco_cisco_fileserver' : 'shape=mxgraph.cisco.servers.fileserver;' + c,
			'Cisco_cisco_firewall' : 'shape=mxgraph.cisco.security.firewall;' + c,
			'Cisco_cisco_generic_building' : 'shape=mxgraph.cisco.buildings.generic_building;' + c,
			'Cisco_cisco_laptop' : 'shape=mxgraph.cisco.computers_and_peripherals.laptop;' + c,
			'Cisco_cisco_lock' : 'shape=mxgraph.cisco.security.lock;' + c,
			'Cisco_cisco_microwebserver' : 'shape=mxgraph.cisco.servers.microwebserver;' + c,
			'Cisco_cisco_pc' : 'shape=mxgraph.cisco.computers_and_peripherals.pc;' + c,
			'Cisco_cisco_pda' : 'shape=mxgraph.cisco.misc.pda;' + c,
			'Cisco_cisco_phone' : 'shape=mxgraph.cisco.modems_and_phones.hootphone;' + c,
			'Cisco_cisco_printer' : 'shape=mxgraph.cisco.computers_and_peripherals.printer;' + c,
			'Cisco_cisco_relational_database' : 'shape=mxgraph.cisco.storage.relational_database;' + c,
			'Cisco_cisco_router' : 'shape=mxgraph.cisco.routers.router;' + c,
			'Cisco_cisco_standing_man' : 'shape=mxgraph.cisco.people.standing_man;' + c,
			'Cisco_cisco_standing_woman' : 'shape=mxgraph.cisco.people.standing_woman;' + c,
			'Cisco_cisco_ups' : 'shape=mxgraph.cisco.misc.ups;' + c,
			'Cisco_cisco_wireless_router' : 'shape=mxgraph.cisco.routers.wireless_router;' + c,
//Cisco Extended
			'Cisco_cisco_100baset_hub' : 'shape=mxgraph.cisco.hubs_and_gateways.100baset_hub;' + c,
			'Cisco_cisco_10700' : 'shape=mxgraph.cisco.routers.10700;' + c,
			'Cisco_cisco_10GE_FCoE' : 'shape=mxgraph.cisco.controllers_and_modules.10ge_fcoe;' + c,
			'Cisco_cisco_15200' : 'shape=mxgraph.cisco.misc.15200;' + c,
			'Cisco_cisco_3174__desktop_' : 'shape=mxgraph.cisco.controllers_and_modules.3174_(desktop)_cluster_controller;' + c,
			'Cisco_cisco_3200_mobile_access_router' : 'shape=mxgraph.cisco.routers.mobile_access_router;' + c,
			'Cisco_cisco_3x74__floor_' : 'shape=mxgraph.cisco.controllers_and_modules.3x74_(floor)_cluster_controller;' + c,
			'Cisco_cisco_6700_series' : 'shape=mxgraph.cisco.misc.6700_series;' + c,
			'Cisco_cisco_7500ars__7513_' : 'shape=mxgraph.cisco.misc.7500ars_(7513);' + c,
//			'Cisco_cisco_access_gateway' NA
			'Cisco_cisco_accesspoint' : 'shape=mxgraph.cisco.misc.access_point;' + c,
			'Cisco_cisco_ace' : 'shape=mxgraph.cisco.misc.ace;' + c,
			'Cisco_cisco_ACS' : 'shape=mxgraph.cisco.misc.acs;' + c,
			'Cisco_cisco_adm' : 'shape=mxgraph.cisco.misc.adm;' + c,
			'Cisco_cisco_antenna' : 'shape=mxgraph.cisco.wireless.antenna;' + c,
			'Cisco_cisco_asic_processor' : 'shape=mxgraph.cisco.misc.asic_processor;' + c,
			'Cisco_cisco_ASR_1000_Series' : 'shape=mxgraph.cisco.misc.asr_1000_series;' + c,
			'Cisco_cisco_ata' : 'shape=mxgraph.cisco.misc.ata;' + c,
			'Cisco_cisco_atm_3800' : 'shape=mxgraph.cisco.misc.atm_3800;' + c,
			'Cisco_cisco_atm_fast_gigabit_etherswitch' : 'shape=mxgraph.cisco.switches.atm_fast_gigabit_etherswitch;' + c,
			'Cisco_cisco_atm_router' : 'shape=mxgraph.cisco.routers.atm_router;' + c,
			'Cisco_cisco_atm_tag_switch_router' : 'shape=mxgraph.cisco.routers.atm_tag_switch_router;' + c,
			'Cisco_cisco_avs' : 'shape=mxgraph.cisco.misc.avs;' + c,
			'Cisco_cisco_AXP' : 'shape=mxgraph.cisco.misc.axp;' + c,
//			'Cisco_cisco_bbfw_media' NA
//			'Cisco_cisco_bbfw' NA
			'Cisco_cisco_bbsm' : 'shape=mxgraph.cisco.misc.bbsm;' + c,
			'Cisco_cisco_branch_office' : 'shape=mxgraph.cisco.buildings.branch_office;' + c,
			'Cisco_cisco_breakout_box' : 'shape=mxgraph.cisco.misc.breakout_box;' + c,
			'Cisco_cisco_bridge' : 'shape=mxgraph.cisco.misc.bridge;' + c,
			'Cisco_cisco_broadband_router' : 'shape=mxgraph.cisco.routers.broadcast_router;' + c,
			'Cisco_cisco_bts_10200' : 'shape=mxgraph.cisco.misc.bts_10200;' + c,
			'Cisco_cisco_cable_modem' : 'shape=mxgraph.cisco.modems_and_phones.cable_modem;' + c,
			'Cisco_cisco_callmanager' : 'shape=mxgraph.cisco.misc.call_manager;' + c,
			'Cisco_cisco_car' : 'shape=mxgraph.cisco.misc.car;' + c,
			'Cisco_cisco_carrier_routing_system' : 'shape=mxgraph.cisco.misc.carrier_routing_system;' + c,
			'Cisco_cisco_cddi_fddi' : 'shape=mxgraph.cisco.misc.cddi_fddi;' + c,
			'Cisco_cisco_cdm' : 'shape=mxgraph.cisco.misc.cdm;' + c,
			'Cisco_cisco_cellular_phone' : 'shape=mxgraph.cisco.modems_and_phones.cell_phone;' + c,
			'Cisco_cisco_centri_firewall' : 'shape=mxgraph.cisco.security.centri_firewall;' + c,
			'Cisco_cisco_cisco_1000' : 'shape=mxgraph.cisco.misc.cisco_1000;' + c,
			'Cisco_cisco_cisco_asa_5500' : 'shape=mxgraph.cisco.misc.asa_5500;' + c,
			'Cisco_cisco_cisco_ca' : 'shape=mxgraph.cisco.misc.cisco_ca;' + c,
			'Cisco_cisco_cisco_file_engine' : 'shape=mxgraph.cisco.storage.cisco_file_engine;' + c,
			'Cisco_cisco_cisco_hub' : 'shape=mxgraph.cisco.hubs_and_gateways.cisco_hub;' + c,
			'Cisco_cisco_ciscosecurity' : 'shape=mxgraph.cisco.security.cisco_security;' + c,
//			'Cisco_cisco_Cisco_telepresence_manager' NA
			'Cisco_cisco_cisco_unified_presence_server' : 'shape=mxgraph.cisco.servers.cisco_unified_presence_server;' + c,
			'Cisco_cisco_cisco_unityexpress' : 'shape=mxgraph.cisco.misc.cisco_unity_express;' + c,
			'Cisco_cisco_ciscoworks' : 'shape=mxgraph.cisco.misc.cisco_works;' + c,
			'Cisco_cisco_class_4_5_switch' : 'shape=mxgraph.cisco.switches.class_4_5_switch;' + c,
			'Cisco_cisco_communications_server' : 'shape=mxgraph.cisco.servers.communications_server;' + c,
			'Cisco_cisco_contact_center' : 'shape=mxgraph.cisco.misc.contact_center;' + c,
			'Cisco_cisco_content_engine__cache_director_' : 'shape=mxgraph.cisco.directors.content_engine_(cache_director);' + c,
			'Cisco_cisco_content_service_router' : 'shape=mxgraph.cisco.routers.content_service_router;' + c,
			'Cisco_cisco_content_service_switch_1100' : 'shape=mxgraph.cisco.switches.content_service_switch_1100;' + c,
			'Cisco_cisco_content_switch_module' : 'shape=mxgraph.cisco.controllers_and_modules.content_switch_module;' + c,
			'Cisco_cisco_content_switch' : 'shape=mxgraph.cisco.switches.content_switch;' + c,
			'Cisco_cisco_content_transformation_engine__cte_' : 'shape=mxgraph.cisco.misc.content_transformation_engine_(cte);' + c,
			'Cisco_cisco_cs_mars' : 'shape=mxgraph.cisco.misc.cs-mars;' + c,
			'Cisco_cisco_csm_s' : 'shape=mxgraph.cisco.misc.csm-s;' + c,
			'Cisco_cisco_csu_dsu' : 'shape=mxgraph.cisco.misc.csu_dsu;' + c,
			'Cisco_cisco_CUBE' : 'shape=mxgraph.cisco.misc.cube;' + c,
			'Cisco_cisco_detector' : 'shape=mxgraph.cisco.misc.detector;' + c,
			'Cisco_cisco_director_class_fibre_channel_director' : 'shape=mxgraph.cisco.directors.director-class_fibre_channel_director;' + c,
			'Cisco_cisco_directory_server' : 'shape=mxgraph.cisco.servers.directory_server;' + c,
			'Cisco_cisco_diskette' : 'shape=mxgraph.cisco.storage.diskette;' + c,
			'Cisco_cisco_distributed_director' : 'shape=mxgraph.cisco.directors.distributed_director;' + c,
			'Cisco_cisco_dot_dot' : 'shape=mxgraph.cisco.misc.dot-dot;' + c,
			'Cisco_cisco_dpt' : 'shape=mxgraph.cisco.misc.dpt;' + c,
			'Cisco_cisco_dslam' : 'shape=mxgraph.cisco.misc.dslam;' + c,
			'Cisco_cisco_dual_mode_ap' : 'shape=mxgraph.cisco.misc.dual_mode;' + c,
			'Cisco_cisco_dwdm_filter' : 'shape=mxgraph.cisco.misc.dwdm_filter;' + c,
			'Cisco_cisco_end_office' : 'shape=mxgraph.cisco.buildings.end_office;' + c,
			'Cisco_cisco_fax' : 'shape=mxgraph.cisco.modems_and_phones.fax;' + c,
			'Cisco_cisco_fc_storage' : 'shape=mxgraph.cisco.storage.fc_storage;' + c,
			'Cisco_cisco_fddi_ring' : 'shape=mxgraph.cisco.misc.fddi_ring;strokeColor=#036897;',
			'Cisco_cisco_fibre_channel_disk_subsystem' : 'shape=mxgraph.cisco.storage.fibre_channel_disk_subsystem;' + c,
			'Cisco_cisco_fibre_channel_fabric_switch' : 'shape=mxgraph.cisco.switches.fibre_channel_fabric_switch;' + c,
			'Cisco_cisco_file_cabinet' : 'shape=mxgraph.cisco.storage.file_cabinet;' + c,
			'Cisco_cisco_file_server' : 'shape=mxgraph.cisco.servers.file_server;' + c,
			'Cisco_cisco_firewall_service_module__fwsm_' : 'shape=mxgraph.cisco.controllers_and_modules.firewall_service_module_(fwsm);' + c,
			'Cisco_cisco_front_end_processor' : 'shape=mxgraph.cisco.misc.front_end_processor;' + c,
			'Cisco_cisco_gatekeeper' : 'shape=mxgraph.cisco.security.gatekeeper;strokeColor=#036897;',
			'Cisco_cisco_general_applicance' : 'shape=mxgraph.cisco.misc.general_appliance;' + c,
			'Cisco_cisco_generic_gateway' : 'shape=mxgraph.cisco.hubs_and_gateways.generic_gateway;' + c,
			'Cisco_cisco_generic_processor' : 'shape=mxgraph.cisco.misc.generic_processor;' + c,
			'Cisco_cisco_generic_softswitch' : 'shape=mxgraph.cisco.switches.generic_softswitch;' + c,
			'Cisco_cisco_gigabit_switch_atm_tag_router' : 'shape=mxgraph.cisco.routers.gigabit_switch_atm_tag_router;' + c,
			'Cisco_cisco_government_building' : 'shape=mxgraph.cisco.buildings.government_building;' + c,
			'Cisco_cisco_Ground_terminal' : 'shape=mxgraph.cisco.wireless.ground_terminal;' + c,
			'Cisco_cisco_guard' : 'shape=mxgraph.cisco.security.guard;' + c,
			'Cisco_cisco_handheld' : 'shape=mxgraph.cisco.misc.handheld;' + c,
			'Cisco_cisco_hootphone' : 'shape=mxgraph.cisco.modems_and_phones.hootphone;' + c,
			'Cisco_cisco_host' : 'shape=mxgraph.cisco.servers.host;' + c,
			'Cisco_cisco_hp_mini' : 'shape=mxgraph.cisco.misc.hp_mini;' + c,
			'Cisco_cisco_h' : 'shape=mxgraph.cisco.misc.h_323;' + c,
			'Cisco_cisco_hub' : 'shape=mxgraph.cisco.hubs_and_gateways.hub;' + c,
			'Cisco_cisco_iad_router' : 'shape=mxgraph.cisco.routers.iad_router;' + c,
			'Cisco_cisco_ibm_mainframe' : 'shape=mxgraph.cisco.computers_and_peripherals.ibm_mainframe;' + c,
			'Cisco_cisco_ibm_mini_as400' : 'shape=mxgraph.cisco.computers_and_peripherals.ibm_mini_as400;' + c,
			'Cisco_cisco_ibm_tower' : 'shape=mxgraph.cisco.computers_and_peripherals.ibm_tower;' + c,
			'Cisco_cisco_icm' : 'shape=mxgraph.cisco.misc.icm;' + c,
			'Cisco_cisco_ics' : 'shape=mxgraph.cisco.misc.ics;' + c,
			'Cisco_cisco_intelliswitch_stack' : 'shape=mxgraph.cisco.switches.intelliswitch_stack;' + c,
			'Cisco_cisco_ios_firewall' : 'shape=mxgraph.cisco.security.ios_firewall;' + c,
			'Cisco_cisco_ios_slb' : 'shape=mxgraph.cisco.misc.ios_slb;' + c,
			'Cisco_cisco_ip_communicator' : 'shape=mxgraph.cisco.misc.ip_communicator;' + c,
			'Cisco_cisco_ip_dsl' : 'shape=mxgraph.cisco.misc.ip_dsl;' + c,
			'Cisco_cisco_ip_phone' : 'shape=mxgraph.cisco.modems_and_phones.ip_phone;' + c,
			'Cisco_cisco_ip' : 'shape=mxgraph.cisco.misc.ip;' + c,
			'Cisco_cisco_iptc' : 'shape=mxgraph.cisco.misc.iptc;' + c,
			'Cisco_cisco_ip_telephony_router' : 'shape=mxgraph.cisco.routers.ip_telephony_router;' + c,
			'Cisco_cisco_iptv_content_manager' : 'shape=mxgraph.cisco.misc.iptv_content_manager;' + c,
			'Cisco_cisco_iptv_server' : 'shape=mxgraph.cisco.servers.iptv_server;' + c,
			'Cisco_cisco_iscsi_router' : 'shape=mxgraph.cisco.routers.isci_router;' + c,
			'Cisco_cisco_isdn_switch' : 'shape=mxgraph.cisco.switches.isdn_switch;' + c,
			'Cisco_cisco_itp' : 'shape=mxgraph.cisco.misc.itp;' + c,
			'Cisco_cisco_jbod' : 'shape=mxgraph.cisco.misc.jbod;' + c,
			'Cisco_cisco_key' : 'shape=mxgraph.cisco.misc.key;' + c,
			'Cisco_cisco_keys' : 'shape=mxgraph.cisco.misc.keys;' + c,
			'Cisco_cisco_lan_to_lan' : 'shape=mxgraph.cisco.misc.lan_to_lan;' + c,
			'Cisco_cisco_layer_2_remote_switch' : 'shape=mxgraph.cisco.switches.layer_2_remote_switch;' + c,
			'Cisco_cisco_layer_3_switch' : 'shape=mxgraph.cisco.switches.layer_3_switch;' + c,
			'Cisco_cisco_lightweight_ap' : 'shape=mxgraph.cisco.misc.lightweight_ap;' + c,
			'Cisco_cisco_localdirector' : 'shape=mxgraph.cisco.directors.localdirector;' + c,
			'Cisco_cisco_longreach_cpe' : 'shape=mxgraph.cisco.misc.longreach_cpe;' + c,
			'Cisco_cisco_macintosh' : 'shape=mxgraph.cisco.computers_and_peripherals.macintosh;' + c,
			'Cisco_cisco_mac_woman' : 'shape=mxgraph.cisco.people.mac_woman;' + c,
			'Cisco_cisco_man_woman' : 'shape=mxgraph.cisco.people.man_woman;' + c,
			'Cisco_cisco_mas_gateway' : 'shape=mxgraph.cisco.hubs_and_gateways.mas_gateway;' + c,
			'Cisco_cisco_mau' : 'shape=mxgraph.cisco.misc.mau;' + c,
			'Cisco_cisco_mcu' : 'shape=mxgraph.cisco.misc.mcu;' + c,
			'Cisco_cisco_mdu' : 'shape=mxgraph.cisco.buildings.mdu;' + c,
			'Cisco_cisco_me_1100' : 'shape=mxgraph.cisco.misc.me1100;' + c,
			'Cisco_cisco_Mediator' : 'shape=mxgraph.cisco.misc.mediator;' + c,
			'Cisco_cisco_meetingplace' : 'shape=mxgraph.cisco.misc.meetingplace;' + c,
			'Cisco_cisco_mesh_ap' : 'shape=mxgraph.cisco.misc.mesh_ap;' + c,
			'Cisco_cisco_metro_1500' : 'shape=mxgraph.cisco.misc.metro_1500;' + c,
			'Cisco_cisco_mgx_8000_multiservice_switch' : 'shape=mxgraph.cisco.switches.mgx_8000_multiservice_switch;' + c,
			'Cisco_cisco_microphone' : 'shape=mxgraph.cisco.computers_and_peripherals.microphone;' + c,
			'Cisco_cisco_mini_vax' : 'shape=mxgraph.cisco.misc.mini_vax;' + c,
			'Cisco_cisco_mobile_access_ip_phone' : 'shape=mxgraph.cisco.modems_and_phones.mobile_access_ip_phone;' + c,
			'Cisco_cisco_mobile_access_router' : 'shape=mxgraph.cisco.routers.mobile_access_router;' + c,
			'Cisco_cisco_modem' : 'shape=mxgraph.cisco.modems_and_phones.modem;' + c,
			'Cisco_cisco_moh_server' : 'shape=mxgraph.cisco.servers.moh_server;' + c,
			'Cisco_cisco_MSE' : 'shape=mxgraph.cisco.misc.mse;' + c,
			'Cisco_cisco_mulitswitch_device' : 'shape=mxgraph.cisco.switches.multiswitch_device;' + c,
			'Cisco_cisco_multi_fabric_server_switch' : 'shape=mxgraph.cisco.switches.multi-fabric_server_switch;' + c,
			'Cisco_cisco_multilayer_remote_switch' : 'shape=mxgraph.cisco.switches.multilayer_remote_switch;' + c,
			'Cisco_cisco_mux' : 'shape=mxgraph.cisco.misc.mux;' + c,
			'Cisco_cisco_MXE' : 'shape=mxgraph.cisco.misc.mxe;' + c,
			'Cisco_cisco_nac_appliance' : 'shape=mxgraph.cisco.misc.nac_appliance;' + c,
			'Cisco_cisco_NCE' : 'shape=mxgraph.cisco.misc.nce;' + c,
			'Cisco_cisco_NCE_router' : 'shape=mxgraph.cisco.routers.nce_router;' + c,
			'Cisco_cisco_netflow_router' : 'shape=mxgraph.cisco.routers.netflow_router;' + c,
			'Cisco_cisco_netranger' : 'shape=mxgraph.cisco.misc.netranger;' + c,
			'Cisco_cisco_netsonar' : 'shape=mxgraph.cisco.misc.netsonar;' + c,
			'Cisco_cisco_network_management' : 'shape=mxgraph.cisco.misc.network_management;' + c,
			'Cisco_cisco_Nexus_1000' : 'shape=mxgraph.cisco.misc.nexus_1000;' + c,
			'Cisco_cisco_Nexus_2000' : 'shape=mxgraph.cisco.misc.nexus_2000_fabric_extender;' + c,
			'Cisco_cisco_Nexus_5000' : 'shape=mxgraph.cisco.misc.nexus_5000;' + c,
			'Cisco_cisco_Nexus_7000' : 'shape=mxgraph.cisco.misc.nexus_7000;' + c,
			'Cisco_cisco_octel' : 'shape=mxgraph.cisco.misc.octel;' + c,
			'Cisco_cisco_ons15500' : 'shape=mxgraph.cisco.misc.ons15500;' + c,
			'Cisco_cisco_optical_amplifier' : 'shape=mxgraph.cisco.misc.optical_amplifier;' + c,
			'Cisco_cisco_optical_services_router' : 'shape=mxgraph.cisco.routers.optical_services_router;' + c,
			'Cisco_cisco_optical_transport' : 'shape=mxgraph.cisco.misc.optical_transport;' + c,
			'Cisco_cisco_pad' : 'shape=mxgraph.cisco.misc.pad_2;' + c,
			'Cisco_cisco_pad_x' : 'shape=mxgraph.cisco.misc.pad_1;' + c,
			'Cisco_cisco_page_icon' : 'shape=mxgraph.cisco.misc.page_icon;strokeColor=#036897;',
			'Cisco_cisco_pbx' : 'shape=mxgraph.cisco.misc.pbx;' + c,
			'Cisco_cisco_pbx_switch' : 'shape=mxgraph.cisco.switches.pbx_switch;' + c,
			'Cisco_cisco_pc_adapter_card' : 'shape=mxgraph.cisco.computers_and_peripherals.pc_adapter_card;' + c,
			'Cisco_cisco_pc_man' : 'shape=mxgraph.cisco.people.pc_man;' + c,
			'Cisco_cisco_pc_routercard' : 'shape=mxgraph.cisco.computers_and_peripherals.pc_routercard;' + c,
			'Cisco_cisco_pc_software' : 'shape=mxgraph.cisco.misc.pc_software;' + c,
			'Cisco_cisco_pc_video' : 'shape=mxgraph.cisco.misc.pc_video;' + c,
			'Cisco_cisco_phone_fax' : 'shape=mxgraph.cisco.modems_and_phones.phone-fax;' + c,
			'Cisco_cisco_pix_firewall' : 'shape=mxgraph.cisco.security.pix_firewall;' + c,
			'Cisco_cisco_pmc' : 'shape=mxgraph.cisco.misc.pmc;' + c,
			'Cisco_cisco_programmable_switch' : 'shape=mxgraph.cisco.switches.programmable_switch;' + c,
			'Cisco_cisco_protocol_translator' : 'shape=mxgraph.cisco.misc.protocol_translator;' + c,
			'Cisco_cisco_pxf' : 'shape=mxgraph.cisco.misc.pxf;' + c,
			'Cisco_cisco_radio_tower' : 'shape=mxgraph.cisco.wireless.radio_tower;strokeColor=#036897;',
			'Cisco_cisco_ratemux' : 'shape=mxgraph.cisco.misc.ratemux;' + c,
			'Cisco_cisco_repeater' : 'shape=mxgraph.cisco.misc.repeater;' + c,
			'Cisco_cisco_RF_modem' : 'shape=mxgraph.cisco.modems_and_phones.rf_modem;' + c,
			'Cisco_cisco_router_firewall' : 'shape=mxgraph.cisco.security.router_firewall;' + c,
			'Cisco_cisco_routerin_building' : 'shape=mxgraph.cisco.routers.router_in_building;' + c,
			'Cisco_cisco_router_with_silicon_switch' : 'shape=mxgraph.cisco.routers.router_with_silicon_switch;' + c,
			'Cisco_cisco_route_switch_processor' : 'shape=mxgraph.cisco.misc.route_switch_processor;' + c,
			'Cisco_cisco_rpsrps' : 'shape=mxgraph.cisco.misc.rpsrps;' + c,
			'Cisco_cisco_running_man' : 'shape=mxgraph.cisco.people.running_man;' + c,
			'Cisco_cisco_sattelite_dish' : 'shape=mxgraph.cisco.wireless.satellite_dish;' + c,
			'Cisco_cisco_sattelite' : 'shape=mxgraph.cisco.wireless.satellite;' + c,
			'Cisco_cisco_scanner' : 'shape=mxgraph.cisco.computers_and_peripherals.scanner;' + c,
			'Cisco_cisco_server_switch' : 'shape=mxgraph.cisco.switches.server_switch;' + c,
			'Cisco_cisco_server_with_router' : 'shape=mxgraph.cisco.servers.server_with_router;' + c,
			'Cisco_cisco_service_control' : 'shape=mxgraph.cisco.misc.service_control;' + c,
			'Cisco_cisco_Service_Module' : 'shape=mxgraph.cisco.controllers_and_modules.service_module;' + c,
			'Cisco_cisco_Service_router' : 'shape=mxgraph.cisco.routers.service_router;' + c,
			'Cisco_cisco_Services' : 'shape=mxgraph.cisco.misc.services;' + c,
			'Cisco_cisco_Set_top_box' : 'shape=mxgraph.cisco.misc.set_top_box;' + c,
			'Cisco_cisco_simulitlayer_switch' : 'shape=mxgraph.cisco.switches.simultilayer_switch;' + c,
			'Cisco_cisco_sip_proxy_werver' : 'shape=mxgraph.cisco.servers.sip_proxy_server;' + c,
			'Cisco_cisco_sitting_woman' : 'shape=mxgraph.cisco.people.sitting_woman;' + c,
			'Cisco_cisco_small_business' : 'shape=mxgraph.cisco.buildings.small_business;' + c,
			'Cisco_cisco_small_hub' : 'shape=mxgraph.cisco.hubs_and_gateways.small_hub;' + c,
			'Cisco_cisco_softphone' : 'shape=mxgraph.cisco.modems_and_phones.softphone;' + c,
			'Cisco_cisco_softswitch_pgw_mgc' : 'shape=mxgraph.cisco.switches.softswitch_pgw_mgc;' + c,
			'Cisco_cisco_software_based_server' : 'shape=mxgraph.cisco.servers.software_based_server;' + c,
//			'Cisco_cisco_Space_router' NA
			'Cisco_cisco_speaker' : 'shape=mxgraph.cisco.computers_and_peripherals.speaker;' + c,
			'Cisco_cisco_ssc' : 'shape=mxgraph.cisco.misc.ssc;' + c,
			'Cisco_cisco_ssl_terminator' : 'shape=mxgraph.cisco.misc.ssl_terminator;' + c,
			'Cisco_cisco_standard_host' : 'shape=mxgraph.cisco.servers.standard_host;' + c,
			'Cisco_cisco_stb' : 'shape=mxgraph.cisco.misc.stb;' + c,
			'Cisco_cisco_storage_router' : 'shape=mxgraph.cisco.routers.storage_router;' + c,
			'Cisco_cisco_storage_server' : 'shape=mxgraph.cisco.servers.storage_server;' + c,
			'Cisco_cisco_stp' : 'shape=mxgraph.cisco.misc.stp;' + c,
			'Cisco_cisco_streamer' : 'shape=mxgraph.cisco.misc.streamer;' + c,
			'Cisco_cisco_sun_workstation' : 'shape=mxgraph.cisco.computers_and_peripherals.workstation;' + c,
			'Cisco_cisco_supercomputer' : 'shape=mxgraph.cisco.computers_and_peripherals.supercomputer;' + c,
			'Cisco_cisco_svx' : 'shape=mxgraph.cisco.misc.svx;' + c,
			'Cisco_cisco_system_controller' : 'shape=mxgraph.cisco.controllers_and_modules.system_controller;' + c,
			'Cisco_cisco_tablet' : 'shape=mxgraph.cisco.computers_and_peripherals.tablet;' + c,
			'Cisco_cisco_tape_array' : 'shape=mxgraph.cisco.storage.tape_array;' + c,
			'Cisco_cisco_tdm_router' : 'shape=mxgraph.cisco.routers.tdm_router;' + c,
			'Cisco_cisco_telecommuter_house_pc' : 'shape=mxgraph.cisco.buildings.telecommuter_house_pc;' + c,
			'Cisco_cisco_telecommuter_house' : 'shape=mxgraph.cisco.buildings.telecommuter_house;' + c,
			'Cisco_cisco_telecommuter_icon' : 'shape=mxgraph.cisco.misc.telecommuter_icon;' + c,
//			'Cisco_cisco_Telepresence_1000' NA
//			'Cisco_cisco_Telepresence_3000' NA
			'Cisco_cisco_Telepresence_3200' : 'shape=mxgraph.cisco.misc.telepresence;' + c,
//			'Cisco_cisco_Telepresence_500' NA
			'Cisco_cisco_terminal' : 'shape=mxgraph.cisco.computers_and_peripherals.terminal;' + c,
			'Cisco_cisco_token' : 'shape=mxgraph.cisco.misc.token;strokeColor=#036897;',
			'Cisco_cisco_TP_MCU' : 'shape=mxgraph.cisco.misc.tp_mcu;' + c,
			'Cisco_cisco_transpath' : 'shape=mxgraph.cisco.misc.transpath;' + c,
			'Cisco_cisco_truck' : 'shape=mxgraph.cisco.misc.truck;' + c,
			'Cisco_cisco_turret' : 'shape=mxgraph.cisco.misc.turret;' + c,
			'Cisco_cisco_tv' : 'shape=mxgraph.cisco.misc.tv;' + c,
			'Cisco_cisco_ubr910' : 'shape=mxgraph.cisco.misc.ubr910;' + c,
			'Cisco_cisco_umg_series' : 'shape=mxgraph.cisco.misc.umg_series;' + c,
			'Cisco_cisco_unity_server' : 'shape=mxgraph.cisco.servers.unity_server;' + c,
			'Cisco_cisco_universal_gateway' : 'shape=mxgraph.cisco.hubs_and_gateways.universal_gateway;' + c,
			'Cisco_cisco_university' : 'shape=mxgraph.cisco.buildings.university;' + c,
			'Cisco_cisco_upc' : 'shape=mxgraph.cisco.computers_and_peripherals.upc;' + c,
			'Cisco_cisco_vault' : 'shape=mxgraph.cisco.misc.vault;' + c,
			'Cisco_cisco_video_camera' : 'shape=mxgraph.cisco.computers_and_peripherals.video_camera;' + c,
			'Cisco_cisco_vip' : 'shape=mxgraph.cisco.misc.vip;' + c,
			'Cisco_cisco_virtual_layer_switch' : 'shape=mxgraph.cisco.switches.virtual_layer_switch;' + c,
			'Cisco_cisco_virtual_switch_controller__vsc3000_' : 'shape=mxgraph.cisco.controllers_and_modules.virtual_switch_controller_(vsc3000);' + c,
			'Cisco_cisco_voice_atm_switch' : 'shape=mxgraph.cisco.switches.voice_atm_switch;' + c,
			'Cisco_cisco_voice_commserver' : 'shape=mxgraph.cisco.servers.voice_commserver;' + c,
			'Cisco_cisco_voice_router' : 'shape=mxgraph.cisco.routers.voice_router;' + c,
			'Cisco_cisco_voice_switch' : 'shape=mxgraph.cisco.switches.voice_switch;' + c,
			'Cisco_cisco_vpn_concentrator' : 'shape=mxgraph.cisco.misc.vpn_concentrator;' + c,
			'Cisco_cisco_vpn_gateway' : 'shape=mxgraph.cisco.hubs_and_gateways.vpn_gateway;' + c,
			'Cisco_cisco_VSS' : 'shape=mxgraph.cisco.misc.vss;' + c,
			'Cisco_cisco_wae' : 'shape=mxgraph.cisco.misc.wae;' + c,
			'Cisco_cisco_wavelength_router' : 'shape=mxgraph.cisco.routers.wavelength_router;' + c,
			'Cisco_cisco_web_browser' : 'shape=mxgraph.cisco.computers_and_peripherals.web_browser;' + c,
			'Cisco_cisco_web_cluster' : 'shape=mxgraph.cisco.storage.web_cluster;' + c,
			'Cisco_cisco_wi_fi_tag' : 'shape=mxgraph.cisco.wireless.wi-fi_tag;' + c,
			'Cisco_cisco_wireless_bridge' : 'shape=mxgraph.cisco.wireless.wireless_bridge;' + c,
			'Cisco_cisco_wireless_location_appliance' : 'shape=mxgraph.cisco.wireless.wireless_location_appliance;' + c,
			'Cisco_cisco_wireless' : 'shape=mxgraph.cisco.wireless.wireless;' + c,
			'Cisco_cisco_wireless_transport' : 'shape=mxgraph.cisco.wireless.wireless_transport;' + c,
			'Cisco_cisco_wism' : 'shape=mxgraph.cisco.misc.wism;' + c,
			'Cisco_cisco_wlan_controller' : 'shape=mxgraph.cisco.wireless.wlan_controller;' + c,
			'Cisco_cisco_workgroup_director' : 'shape=mxgraph.cisco.directors.workgroup_director;' + c,
			'Cisco_cisco_workgroup_switch' : 'shape=mxgraph.cisco.switches.workgroup_switch;' + c,
			'Cisco_cisco_workstation' : 'shape=mxgraph.cisco.computers_and_peripherals.workstation;' + c,
			'Cisco_cisco_www_server' : 'shape=mxgraph.cisco.servers.www_server;' + c,
//Computers and Monitors
//			'NET_PC' NA
//			'NET_Virtual-PC' NA
//			'NET_Terminal' NA
//			'NET_DataPipe' NA
//			'NET_SlateDevice' NA
//			'NET_TabletDevice' NA
//			'NET_Laptop' NA
//			'NET_PDA' NA
//			'NET_CRTMonitor' NA
//			'NET_LCDMonitor' NA
//Detailed Network Diagrams
//			'NET_ABSwitch' NA
//			'NET_Repeater' NA
//			'NET_DiagnosticDevice' NA
//			'NET_CardReader' NA
//			'NET_PatchPanel' NA
//			'NET_RadioTower' NA
//			'NET_BiometricReader' NA
//			'NET_ExternalHardDrive' NA
//			'NET_WebService' NA
//			'NET_FiberOptic' NA
//			'NET_SatelliteDish' NA
//			'NET_Satellite' NA
//			'NET_VoIPPhone' NA
//			'NET_PBX' NA
//			'NET_MLPS' NA
//Basic Network Shapes
//			'NET_WirelessAccessPoint' NA
//			'NET_RingNetwork' NA
//			'NET_Ethernet' NA
//			'NET_Server' NA
//			'NET_ExternalMediaDrive' NA
//			'NET_Mainframe' NA
//			'NET_Router' NA
//			'NET_Switch' NA
//			'NET_Firewall' NA
//			'NET_User' NA
//			'NET_CommLink' NA
//			'NET_SuperComputer' NA
//			'NET_VirtualServer' NA
//			'NET_Printer' NA
//			'NET_Plotter' NA
//			'NET_Scanner' NA
//			'NET_Copier' NA
//			'NET_FaxMachine' NA
//			'NET_MultiFunctionMachine' NA
//			'NET_Projector' NA
//			'NET_ProjectorScreen' NA
//			'NET_Bridge' NA
//			'NET_Hub' NA
//			'NET_Modem' NA
//			'NET_Telephone' NA
//			'NET_CellPhone' NA
//			'NET_SmartPhone' NA
//			'NET_VideoPhone' NA
//			'NET_Camera' NA
//			'NET_VideoCamera' NA
//Server Racks
			'RackServerRack' : 'shape=mxgraph.rackGeneral.container;container=1;collapsible=0;childLayout=rack;marginLeft=9;marginRight=9;marginTop=21;marginBottom=22;textColor=#000000;numDisp=off;',
			'RackBlank' : 'strokeColor=#666666;labelPosition=left;align=right;spacingRight=15;shape=mxgraph.rackGeneral.plate;fillColor=#e8e8e8;',
			'RackRaidArray' : 'shape=mxgraph.rack.cisco.cisco_carrier_packet_transport_50;labelPosition=left;align=right;spacingRight=15;',
			'RackServer' : 'shape=mxgraph.rack.oracle.sunfire_x4100;labelPosition=left;align=right;spacingRight=15;',
			'RackEthernetSwitch' : 'shape=mxgraph.rack.cisco.cisco_nexus_3016_switch;labelPosition=left;align=right;spacingRight=15;',
			'RackPatchPanel' : 'strokeColor=#666666;labelPosition=left;align=right;spacingRight=15;shape=mxgraph.rack.general.cat5e_rack_mount_patch_panel_24_ports;',
			'RackRouter' : 'shape=mxgraph.rack.cisco.cisco_asr_1001_router;labelPosition=left;align=right;spacingRight=15;',
			'RackMonitor' : 'shape=mxgraph.rack.ibm.ibm_1u_flat_panel_console_kit;labelPosition=left;align=right;spacingRight=15;',
			'RackKeyboard' : 'shape=mxgraph.rack.cisco.cisco_1905_serial_integrated_services_router;labelPosition=left;align=right;spacingRight=15;',
			'RackPowerStrip' : 'shape=mxgraph.rack.dell.power_strip;labelPosition=left;align=right;spacingRight=15;',
			'RackPowerSupply' : 'shape=mxgraph.rack.cisco.cisco_web_security_appliance_s170;labelPosition=left;align=right;spacingRight=15;',
			'RackBridge' : 'shape=mxgraph.rack.cisco.cisco_nexus_5548p_switch;labelPosition=left;align=right;spacingRight=15;',
			'RackTapeDrive' : 'shape=mxgraph.rack.ibm.ibm_1754_local_console_manager;labelPosition=left;align=right;spacingRight=15;',
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
			'EE_Amplifier' : 'shape=mxgraph.electrical.abstract.amplifier;',
			'EE_OpAmp' : 'shape=mxgraph.electrical.abstract.operational_amp_1;', //EXT
			'EE_ControlledAmp' : 'shape=mxgraph.electrical.abstract.controlled_amplifier;', //EXT
			'EE_Multiplexer' : 'shape=mxgraph.electrical.abstract.mux;', //EXT
			'EE_Demultiplexer' : 'shape=mxgraph.electrical.abstract.demux;', //EXT
			'EE_Capacitor1' : 'shape=mxgraph.electrical.capacitors.capacitor_1;', //EXT
			'EE_Capacitor2' : 'shape=mxgraph.electrical.capacitors.capacitor_3;', //EXT
			'EE_Diode' : 'shape=mxgraph.electrical.diodes.diode;', //EXT
			'EE_Resistor' : 'shape=mxgraph.electrical.resistors.resistor_2;', //EXT
			'EE_VarResistor' : 'shape=mxgraph.electrical.resistors.variable_resistor_2;',
			'EE_Potentiometer' : 'shape=mxgraph.electrical.resistors.potentiometer_2;', //EXT
			'EE_ProtGround' : 'shape=mxgraph.electrical.signal_sources.protective_earth;',
			'EE_SignalGround' : 'shape=mxgraph.electrical.signal_sources.signal_ground;',
			'EE_Transformer' : 'shape=mxgraph.electrical.inductors.transformer_1;',
			'EE_Inductor' : 'shape=mxgraph.electrical.inductors.inductor_3;', //EXT
			'EE_Variable Inductor' : 'shape=mxgraph.electrical.inductors.variable_inductor;', //EXT
			'EE_TwoWaySwitch' : 'shape=mxgraph.electrical.electro-mechanical.2-way_switch;',
			'EE_OnOffSwitch' : 'shape=mxgraph.electrical.electro-mechanical.simple_switch;',
			'EE_Loudspeaker' : 'shape=mxgraph.electrical.electro-mechanical.loudspeaker;',
			'EE_Motor' : 'shape=mxgraph.electrical.electro-mechanical.motor_1;', //EXT
			'EE_LED1' : 'shape=mxgraph.electrical.opto_electronics.led_2;',
			'EE_Lightbulb' : 'shape=mxgraph.electrical.miscellaneous.light_bulb;',
//			'EE_IntegratedCircuit' EXT
//Power Sources
			'EE_AcSource' : 'strokeWidth=1;shape=mxgraph.electrical.signal_sources.ac_source;', //EXT
			'EE_VoltageSource' : 'shape=mxgraph.electrical.signal_sources.dc_source_3;', //EXT
			'EE_CurrentSource' : 'shape=mxgraph.electrical.signal_sources.dc_source_2;direction=north;', //EXT
			'EE_ControlledCurrentSource' : 'shape=mxgraph.electrical.signal_sources.dependent_source_2;direction=west;', //EXT
			'EE_ControlledVoltageSource' : 'shape=mxgraph.electrical.signal_sources.dependent_source_3;', //EXT
//			'EE_DcSource1' NA
//			'EE_DcSource2' NA
			'EE_Vss' : 'verticalLabelPosition=top;verticalAlign=bottom;shape=mxgraph.electrical.signal_sources.vss2;fontSize=24;',
			'EE_Vdd' : 'verticalLabelPosition=bottom;verticalAlign=top;shape=mxgraph.electrical.signal_sources.vdd;',
//Transistors
			'EE_BJT_NPN1' : 'shape=mxgraph.electrical.transistors.pnp_transistor_1;',
			'EE_BJT_PNP1' : 'shape=mxgraph.electrical.transistors.npn_transistor_1;',
			'EE_JFET_P' : 'shape=mxgraph.electrical.transistors.p-channel_jfet_1;flipV=1;',
			'EE_JFET_N' : 'shape=mxgraph.electrical.transistors.n-channel_jfet_1;',
			'EE_MOSFET_P1' : 'shape=mxgraph.electrical.mosfets1.mosfet_ic_p;flipV=1;',
			'EE_MOSFET_P2' : 'shape=mxgraph.electrical.mosfets1.mosfet_p_no_bulk;',
			'EE_MOSFET_P3' : 'shape=mxgraph.electrical.mosfets1.p-channel_mosfet_1;flipV=1;',
			'EE_MOSFET_N1' : 'shape=mxgraph.electrical.mosfets1.mosfet_ic_n;',
			'EE_MOSFET_N2' : 'shape=mxgraph.electrical.mosfets1.mosfet_n_no_bulk;',
			'EE_MOSFET_N3' : 'shape=mxgraph.electrical.mosfets1.n-channel_mosfet_1;',
//Relays
//			'EE_SPST' NA
//			'EE_SPDT' NA
//			'EE_DPST' NA
//			'EE_DPDT' NA
//Logic Gates
			'EE_AND' : 'shape=mxgraph.electrical.logic_gates.and;',
			'EE_OR' : 'shape=mxgraph.electrical.logic_gates.or;',
			'EE_Inverter' : 'shape=mxgraph.electrical.logic_gates.inverter;',
			'EE_NAND' : 'shape=mxgraph.electrical.logic_gates.nand;',
			'EE_NOR' : 'shape=mxgraph.electrical.logic_gates.nor;',
			'EE_XOR' : 'shape=mxgraph.electrical.logic_gates.xor;',
			'EE_NXOR' : 'shape=mxgraph.electrical.logic_gates.xnor;',
			'EE_DTypeRSFlipFlop' : 'shape=mxgraph.electrical.logic_gates.d_type_rs_flip-flop;',
			'EE_DTypeFlipFlop' : 'shape=mxgraph.electrical.logic_gates.d_type_flip-flop;',
			'EE_DTypeFlipFlopWithClear' : 'shape=mxgraph.electrical.logic_gates.d_type_flip-flop_with_clear;',
			'EE_RSLatch' : 'shape=mxgraph.electrical.logic_gates.rs_latch;',
			'EE_SyncRSLatch' : 'shape=mxgraph.electrical.logic_gates.synchronous_rs_latch;',
			'EE_TTypeFlipFlop' : 'shape=mxgraph.electrical.logic_gates.t_type_flip-flop;',
//Miscellaneous
			'EE_Plus' : 'shape=mxgraph.ios7.misc.flagged;',
			'EE_Negative' : 'shape=line;',
			'EE_InverterContact' : 'shape=ellipse;',
			'EE_Voltmeter' : 'shape=mxgraph.electrical.instruments.voltmeter;',
			'EE_Ammeter' : 'shape=mxgraph.electrical.instruments.ampermeter;',
			'EE_SineWave' : 'shape=mxgraph.electrical.waveforms.sine_wave;',
			'EE_Sawtooth' : 'shape=mxgraph.electrical.waveforms.sawtooth;',
			'EE_SquareWave' : 'shape=mxgraph.electrical.waveforms.square_wave;',
//Messaging Systems
			'EIChannelBlock' : 'shape=mxgraph.eip.messageChannel;',
//			'EIMessageChannelBlock' NA
//			'EIMessageBlock' EXT
			'EIMessageRouterBlock' : 'shape=mxgraph.eip.content_based_router;',
			'EIMessageTranslatorBlock' : 'shape=mxgraph.eip.message_translator;',
//			'EIMessageEndpointBlock' EXT
//Messaging Channels
//			'EIPublishSubscribeChannelBlock' NA
//			'EIDatatypeChannelBlock' NA
//			'EIInvalidMessageChannelBlock' NA
//			'EIDeadLetterChannelBlock' NA
//			'EIGuaranteedDeliveryBlock' NA
//			'EIChannelAdapterBlock' NA
			'EIMessagingBridgeBlock' : 'shape=mxgraph.eip.messaging_bridge;',
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
			'EIContentBasedRouterBlock' : 'shape=mxgraph.eip.content_based_router;',
			'EIMessageFilterBlock' : 'shape=mxgraph.eip.message_filter;',
			'EIDynamicRouterBlock' : 'shape=mxgraph.eip.dynamic_router;',
			'EIRecipientListBlock' : 'shape=mxgraph.eip.recipient_list;',
			'EISplitterBlock' : 'shape=mxgraph.eip.splitter;',
			'EIAggregatorBlock' : 'shape=mxgraph.eip.aggregator;',
			'EIResequencerBlock' : 'shape=mxgraph.eip.resequencer;',
			'EIComposedMessageBlock' : 'shape=mxgraph.eip.composed_message_processor;',
			'EIRoutingSlipBlock' : 'shape=mxgraph.eip.routing_slip;',
			'EIProcessManagerBlock' : 'shape=mxgraph.eip.process_manager;',
//			'EIMessageBrokerBlock' EXT
//Message Transformation
			'EIEnvelopeWrapperBlock' : 'shape=mxgraph.eip.envelope_wrapper;',
			'EIContentEnricherBlock' : 'shape=mxgraph.eip.content_enricher;',
			'EIContentFilterBlock' : 'shape=mxgraph.eip.content_filter;',
			'EIClaimCheckBlock' : 'shape=mxgraph.eip.claim_check;',
			'EINormalizerBlock' : 'shape=mxgraph.eip.normalizer;',
//Messaging Endpoints
			'EIMessagingGatewayBlock' : 'shape=mxgraph.eip.messaging_gateway;',
			'EITransactionalClientBlock' : 'shape=mxgraph.eip.transactional_client;',
			'EIPollingConsumerBlock' : 'shape=mxgraph.eip.polling_consumer;',
			'EIEventDrivenConsumerBlock' : 'shape=mxgraph.eip.event_driven_consumer;',
			'EICompetingConsumersBlock' : 'shape=mxgraph.eip.competing_consumers;',
			'EIMessageDispatcherBlock' : 'shape=mxgraph.eip.message_dispatcher;',
			'EISelectiveConsumerBlock' : 'shape=mxgraph.eip.selective_consumer;',
//			'EIDurableSubscriberBlock' NA
			'EIServiceActivatorBlock' : 'shape=mxgraph.eip.service_activator;',
//System Management
//			'EIControlBusBlock' NA
			'EIDetourBlock' : 'shape=mxgraph.eip.detour;',
			'EIWireTapBlock' : 'shape=mxgraph.eip.wire_tap;',
//			'EIMessageHistoryBlock' EXT
			'EIMessageStoreBlock' : 'shape=mxgraph.eip.message_store;',
			'EISmartProxyBlock' : 'shape=mxgraph.eip.smart_proxy;',
			'EITestMessageBlock' : 'shape=mxgraph.eip.test_message;',
			'EIChannelPurgerBlock' : 'shape=mxgraph.eip.channel_purger;',
//Equation
//			'Equation' EXT
//Walls
			'fpWall' : 'shape=rect;',
//Rooms
//Doors & Windows
			'fpWindow' : 'shape=mxgraph.floorplan.window;',
			'fpOpening' : 'shape=rect;',
			'fpDoor' : 'shape=mxgraph.floorplan.doorLeft;flipV=1;', //EXT
			'fpDoubleDoor' : 'shape=mxgraph.floorplan.doorDouble;flipV=1;', //EXT
//Stairs			
			'fpStairs' : 'shape=mxgraph.floorplan.stairs;direction=north;',
			'fpStairsDirectional' : 'shape=mxgraph.floorplan.stairs;direction=north;',
//			'fpStairsCurved' EXT
//			'fpStairsCurvedWide' EXT
//Desks
//			'fpDeskEndSegment' NA
			'fpDeskLongSegment' : 'shape=rect;',
			'fpDeskShortSegment' : 'shape=rect;rounded=1;',
//			'fpDeskSmallCornerSegment' NA
			'fpDeskLargeCornerSegment' : 'shape=mxgraph.floorplan.desk_corner;',
//			'fpDeskMediumCornerSegment' NA
//			'fpDeskRoundedLSegment' NA
//			'fpDeskRoundedCornerSegment' NA
//Cubicle walls
			'fpCubiclePanel' : 'shape=mxgraph.floorplan.wall;wallThickness=3;',
			'fpCubicleWorkstation' : 'shape=mxgraph.floorplan.wallU;wallThickness=3;',
			'fpCubicleCorner5x5' : 'shape=mxgraph.floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCorner6x6' : 'shape=mxgraph.floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCorner8x8' : 'shape=mxgraph.floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCorner8x6' : 'shape=mxgraph.floorplan.wallCorner;wallThickness=3;',
			'fpCubicleCornerOpen6x4' : 'shape=mxgraph.floorplan.wallCorner;wallThickness=3;',
			'fpCubicleDouble14x8' : 'shape=mxgraph.floorplan.wallU;wallThickness=3;',
			'fpCubicleEnclosed11x9' : 'shape=mxgraph.floorplan.wallU;wallThickness=3;',
//Tables & Chairs
			'fpTableConferenceOval' : 'shape=ellipse;',
			'fpTableConferenceBoat' : 'shape=rect;rounded=1;',
			'fpTableConferenceRectangle' : 'shape=rect;rounded=1;',
			'fpTableDiningRound' : 'shape=ellipse;',
			'fpTableDiningSquare' : 'shape=rect;rounded=1;',
			'fpChairOffice' : 'shape=mxgraph.floorplan.office_chair;',
			'fpChairExecutive' : 'shape=mxgraph.floorplan.office_chair;',
			'fpChairLobby' : 'shape=mxgraph.floorplan.office_chair;',
			'fpChairDining' : 'shape=mxgraph.floorplan.chair;',
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
			'fpRestroomToiletPrivate' : 'shape=mxgraph.floorplan.toilet;',
			'fpRestroomToiletPublic' : 'shape=mxgraph.floorplan.toilet;',
//			'fpRestroomBidet' NA
//			'fpRestroomLights' EXT
//			'fpRestroomSinks' EXT
//			'fpRestroomGrabBar' NA
			'fpRestroomBathtub' : 'shape=mxgraph.floorplan.bathtub;direction=south;',
			'fpRestroomShower' : 'shape=mxgraph.floorplan.shower;flipH=1;',
//			'fpRestroomCornerSink' NA
			'fpRestroomPedastalSink' : 'shape=mxgraph.floorplan.sink_1;',
			'fpRestroomCountertop' : 'shape=rect;rounded=1;',
			'fpRestroomMirror' : 'shape=line;strokeWidth=3;',
//			'fpDresserOrnateMirror' NA
//			'fpRestroomToiletPaper' NA
//			'fpRestroomStalls' NA
//Beds
			'fpBedDouble' : 'shape=mxgraph.floorplan.bed_double;',
			'fpBedSingle' : 'shape=mxgraph.floorplan.bed_single;',
			'fpBedQueen' : 'shape=mxgraph.floorplan.bed_double;',
			'fpBedKing' : 'shape=mxgraph.floorplan.bed_double;',
			'fpBedDoubleWithTrundle' : 'shape=mxgraph.floorplan.bed_double;',
			'fpBedBunk' : 'shape=mxgraph.floorplan.bed_double;',
//			'fpBedBunkL' NA
//			'fpBedCrib' NA
			'fpBedBassinet' : 'shape=mxgraph.pid.fittings.compensator;',
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
			'fpApplianceStoveOven' : 'shape=mxgraph.floorplan.range_1;',
			'fpStoveOvenSixBurner' : 'shape=mxgraph.floorplan.range_2;',
			'fpApplianceDishwasher' : 'shape=rect;',
//Kitchen
			'fpKitchenSink' : 'shape=mxgraph.floorplan.sink_2;',
			'fpKitchenDoubleSink' : 'shape=mxgraph.floorplan.sink_double;',
			'fpKitchenCountertop' : 'shape=rect;rounded=1;',
			'fpKitchenCountertopCorner' : 'shape=mxgraph.floorplan.desk_corner;',
//Couches
			'fpCouchLoveSeat' : 'shape=mxgraph.floorplan.couch;',
			'fpCouchSofa' : 'shape=mxgraph.floorplan.couch;',
//			'fpCouchSectional' NA
			'fpCouchOttoman' : 'shape=rect;rounded=1;',
//			'fpCouchPillow' NA
//Technology
			'fpMiscDesktopComputer' : 'shape=mxgraph.floorplan.workstation;',
			'fpMiscLaptopComputer' : 'shape=mxgraph.floorplan.laptop;',
			'fpComputerMonitor' : 'shape=mxgraph.floorplan.flat_tv;',
			'fpCRTTelevision' : 'shape=mxgraph.floorplan.flat_tv;',
//			'fpMiscProjector' NA
//			'fpMiscProjectorScreen' NA
//Misc Floorplan
			'fpMiscIndoorPlant' : 'shape=mxgraph.floorplan.plant;',
//			'fpMiscPodium' NA
			'fpPiano' : 'shape=mxgraph.floorplan.piano;',
//			'fpPianoBench' : 'shape=rect;rounded=1;',
//Equipment
			'PEAxialCompressor' : 'shape=mxgraph.pid.compressors.centrifugal_compressor_-_turbine_driven;',
			'PECentrifugalCompressor' : 'shape=mxgraph.pid.compressors.centrifugal_compressor',
			'PECentrifugalCompressor2' : 'shape=mxgraph.pid.compressors.centrifugal_compressor_-_turbine_driven;',
//			'PECentrifugalCompressor3' NA
			'PEReciprocationCompressor' : 'shape=mxgraph.pid.compressors.reciprocating_compressor;',
			'PERotaryCompressorBlock' : 'shape=mxgraph.pid.compressors.rotary_compressor;',
			'PERotaryCompressor2Block' : 'shape=mxgraph.pid.compressors.compressor_and_silencers;',
			'PEConveyorBlock' : 'shape=mxgraph.pid2misc.conveyor;',
//			'PEOverheadConveyorBlock' NA
//			'PEScraperConveyorBlock' NA
//			'PEScrewConveyorBlock' NA
//			'PEPositiveDisplacementBlock' NA
//			'PEPositiveDisplacement2' NA
			'PEElevator1Block' : 'shape=mxgraph.pid.misc.bucket_elevator;flipH=1;',
//			'PEElevator2Block' NA
//			'PEHoistBlock' NA
//			'PESkipHoistBlock' NA
//			'PEMotorBlock' NA
//			'PEDieselMotorBlock' NA
//			'PEElectricMotorBlock' NA
//			'PELiquidRingVacuumBlock' NA
//			'PETurbineDriverBlock' NA
//			'PEDoubleFlowTurbineBlock' NA
			'PEAgitatorMixerBlock' : 'shape=mxgraph.pid.agitators.agitator_(propeller);',
			'PEDrumBlock' : 'shape=mxgraph.pid.vessels.drum_or_condenser;',
			'PETankEquipmentBlock' : 'mxgraph.pid.vessels.tank;',
//			'PECentrifugalBlower' NA
//			'PEAlkylationBlock' NA
//			'PEBoomLoaderBlock' NA
//			'PEFluidCatalyticCrackingBlock' NA
//			'PEFluidCookingBlock' NA
//			'PEFluidizedReactorBlock' NA
//			'PETubularBlock' NA
//			'PEReformerBlock' NA
			'PEMixingReactorBlock' : 'shape=mxgraph.pid.vessels.mixing_reactor;',
//			'PEHydrodesulferizationBlock' NA
//			'PEHydrocrackingBlock' NA
			'PEPlateTowerBlock' : 'shape=mxgraph.pid2misc.column;columnType=baffle;',
			'PEPackedTowerBlock' : 'shape=mxgraph.pid2misc.column;columnType=fixed;',
//			'PEAutomaticStokerBlock' NA
//			'PEOilBurnerBlock' NA
//			'PECounterflowForcedDraftBlock' NA
//			'PECounterflowNaturalDraftBlock' NA
//			'PECrossflowInductedBlock' NA
			'PEFurnaceBlock' : 'shape=mxgraph.pid.vessels.furnace;',
//			'PEChimneyTowerBlock' NA
//Piping
//			'PEOneToMany' EXT
//			'PEMultilines' EXT
			'PEMidArrow' : 'shape=triangle;',
			'PEButtWeld' : 'shape=mxgraph.sysml.x;',
			'PETopToTop' : 'shape=mxgraph.pid.vessels.container,_tank,_cistern;',
//			'PESonicSignal' NA
			'PENuclear' : 'shape=mxgraph.electrical.waveforms.sine_wave;',
//			'PEPneumatic' NA
//			'PEHydraulicSignalLine' NA
			'PEMechanicalLink' : 'shape=ellipse;',
			'PESolderedSolvent' : 'shape=ellipse;',
			'PEDoubleContainment' : 'shape=hexagon;',
			'PEFlange' : 'shape=mxgraph.pid.piping.double_flange;',
			'PEFlange2' : 'shape=mxgraph.pid.piping.flange_in;flipH=1;',
			'PEEndCap' : 'shape=mxgraph.pid.piping.cap;',
			'PEEndCap2' : 'shape=mxgraph.pid.vessels.container,_tank,_cistern;direction=north;',
			'PEBreather' : 'shape=mxgraph.pid.piping.breather;',
			'PEElectronicallyInsulated' : 'shape=mxgraph.pid.piping.double_flange;',
			'PEReducer' : 'shape=mxgraph.pid.piping.concentric_reducer;',
			'PEInlineMixer' : 'shape=mxgraph.pid.piping.in-line_mixer;',
//			'PESeparator' NA
//			'PEBurstingDisc' NA
			'PEFlameArrester' : 'shape=mxgraph.pid.piping.flame_arrestor;',
//			'PEFlameArrester2' NA
			'PEDetonationArrester' : 'shape=mxgraph.pid.piping.detonation_arrestor;',
//			'PEDrainSilencer' NA
			'PETriangleSeparator' : 'shape=triangle;direction=west;',
//			'PETriangleSeparator2' NA
			'PETundish' : 'shape=mxgraph.ios7.misc.left;',
			'PEOpenVent' : 'shape=mxgraph.pid.vessels.vent_(bent);',
//			'PESiphonDrain' NA
			'PERemovableSpool' : 'shape=mxgraph.pid.piping.removable_spool;',
			'PEYTypeStrainer' : 'shape=mxgraph.pid.piping.y-type_strainer;',
			'PEDiverterValve' : 'shape=mxgraph.pid.piping.diverter_valve;',
			'PEPulsationDampener' : 'shape=mxgraph.pid.piping.pulsation_dampener;',
			'PEDuplexStrainer' : 'shape=mxgraph.pid.piping.duplex_strainer;',
			'PEBasketStrainer' : 'shape=mxgraph.pid.piping.basket_strainer;',
			'PEVentSilencer' : 'shape=mxgraph.pid.piping.vent_silencer;',
			'PEInlineSilencer' : 'shape=mxgraph.pid.piping.in-line_silencer;',
			'PESteamTrap' : 'shape=mxgraph.pid.piping.steam_trap;',
			'PEDesuperheater' : 'shape=mxgraph.pid.piping.desuper_heater;',
			'PEEjectorOrEductor' : 'shape=mxgraph.pid.fittings.injector;',
			'PEExhaustHead' : 'shape=mxgraph.pid.piping.exhaust_head;',
			'PERotaryValve' : 'shape=mxgraph.pid.piping.rotary_valve;',
			'PEExpansionJoint' : 'shape=mxgraph.pid.piping.expansion_joint;',
//Vessels
			'PEVesselBlock' : 'shape=rect;', //EXT
			'PEOpenTankBlock' : 'shape=mxgraph.pid.vessels.container,_tank,_cistern;', //EXT
//			'PEOpenTopTank' NA
			'PEClosedTankBlock' : 'shape=rect;', //EXT
			'PEStorageSphereBlock' : 'shape=mxgraph.pid.vessels.storage_sphere;',
			'PEColumnBlock' : 'shape=mxgraph.pid.vessels.pressurized_vessel;', //EXT
			'PEBagBlock' : 'shape=mxgraph.pid.vessels.bag;',
			'PEGasCylinderBlock' : 'shape=mxgraph.pid.vessels.gas_bottle;',
			'PEGasHolderBlock' : 'shape=mxgraph.pid.vessels.gas_holder;',
			'PEClarifierBlock' : 'shape=mxgraph.pid.vessels.bunker_(conical_bottom);',
//			'PETankBlock' NA
			'PETrayColumnBlock' : 'shape=mxgraph.pid2misc.column;columnType=tray;',
			'PEReactionVesselBlock' : 'shape=mxgraph.pid.vessels.reactor;',
			'PEBin' : 'shape=mxgraph.pid.vessels.tank_(conical_bottom);',
			'PEDomeRoofTank' : 'shape=mxgraph.pid.vessels.tank_(dished_roof);',
			'PEConeRoofTank' : 'shape=mxgraph.pid.vessels.tank_(conical_roof);',
//			'PEInternalFloatingRoof' NA
//			'PEDoubleWallTank' NA
//			'PEOnionTank' NA
//Heat Exchangers
			'PEBoilerBlock' : 'shape=mxgraph.pid.misc.boiler_(dome);',
			'PEEquipmentBoilerBlock' : 'shape=mxgraph.pid.misc.boiler_(dome);',
			'PEReboilerBlock' : 'shape=mxgraph.pid.heat_exchangers.reboiler;',
			'PECondenserBlock' : 'shape=mxgraph.pid.heat_exchangers.heat_exchanger_(straight_tubes);',
			'PEEquipmentCondenserBlock' : 'shape=mxgraph.pid.heat_exchangers.condenser;',
//			'PEEvaporativeCondenserBlock' NA
			'PECoolingTowerBlock' : 'shape=mxgraph.pid.misc.cooling_tower;',
			'PEHeatExchangerBlock' : 'shape=mxgraph.pid.heat_exchangers.shell_and_tube_heat_exchanger_1;',
//			'PEAirCooledExchangerBlock' NA
			'PEHairpinExchangerBlock' : 'shape=mxgraph.pid.heat_exchangers.hairpin_exchanger;',
			'PEPlateAndFrameHeatExchangerBlock' : 'shape=mxgraph.pid.heat_exchangers.plate_and_frame_heat_exchanger;',
			'PESpiralHeatExchanger' : 'shape=mxgraph.pid.heat_exchangers.spiral_heat_exchanger;',
			'PEUTubeHeatExchangerBlock' : 'shape=mxgraph.pid.heat_exchangers.u-tube_heat_exchanger;',
			'PEDoublePipeHeatBlock' : 'shape=mxgraph.pid.heat_exchangers.double_pipe_heat_exchanger;',
			'PEShellAndTubeHeat1Block' : 'shape=mxgraph.pid.heat_exchangers.shell_and_tube_heat_exchanger_1;',
			'PEShellAndTubeHeat2Block' : 'shape=mxgraph.pid.heat_exchangers.shell_and_tube_heat_exchanger_2;',
			'PEShellAndTubeHeat3Block' : 'shape=mxgraph.pid.heat_exchangers.shell_and_tube_heat_exchanger_1;direction=north;',
			'PESinglePassHeatBlock' : 'shape=mxgraph.pid.heat_exchangers.single_pass_heat_exchanger;',
			'PEHeaterBlock' : 'shape=mxgraph.pid.heat_exchangers.heater;',
//Pumps
			'PEEjectorInjectorBlock' : 'shape=mxgraph.pid.fittings.injector;',
			'PECompressorTurbineBlock' : 'shape=mxgraph.pid.engines.turbine;flipH=1;', //EXT
//			'PEMotorDrivenTurbineBlock' NA
			'PETripleFanBlades2Block' : 'shape=mxgraph.pid2misc.fan;fanType=common;',
			'PEFanBlades2Block' : 'shape=mxgraph.pid2misc.fan;fanType=common;', //EXT
			'PECentrifugalPumpBlock' : 'shape=mxgraph.pid.pumps.centrifugal_pump_1;', //EXT
			'PECentrifugalPump' : 'shape=mxgraph.pid.pumps.centrifugal_pump_1;',
			'PECentrifugalPump2' : 'shape=mxgraph.pid.pumps.centrifugal_pump_2;',
			'PECentrifugalPump3' : 'shape=mxgraph.pid.pumps.centrifugal_pump_1;flipH=1;',
			'PEGearPumpBlock' : 'shape=mxgraph.pid.pumps.gear_pump;',
			'PEHorizontalPump' : 'shape=mxgraph.pid.pumps.horizontal_pump;',
			'PEProgressiveCavityPump' : 'shape=mxgraph.pid.pumps.cavity_pump;flipH=1;flipV=1;',
			'PEScrewPump' : 'shape=mxgraph.pid.pumps.screw_pump;',
			'PEScrewPump2' : 'shape=mxgraph.pid.pumps.screw_pump_2;flipH=1;',
			'PESumpPump' : 'shape=mxgraph.pid.pumps.sump_pump;',
			'PEVacuumPump' : 'shape=mxgraph.pid.pumps.vacuum_pump;',
			'PEVerticalPump' : 'shape=mxgraph.pid.pumps.vertical_pump;',
			'PEVerticalPump2' : 'shape=mxgraph.pid.pumps.vertical_pump;',
//Instruments
			'PEIndicatorBlock' : 'shape=mxgraph.pid2inst.discInst;mounting=room;', //EXT
			'PEIndicator2Block' : 'shape=mxgraph.pid2inst.indicator;mounting=room;indType=inst;', //EXT
			'PEIndicator3Block' : 'shape=mxgraph.pid2inst.discInst;mounting=field;',
			'PEIndicator4Block' : 'shape=mxgraph.pid2inst.indicator;mounting=field;indType=inst;',
//			'PEIndicator5Block' NA
			'PESharedIndicatorBlock' : 'shape=mxgraph.pid2inst.sharedCont;mounting=room;', //EXT
			'PESharedIndicator2Block' : 'shape=mxgraph.pid2inst.indicator;mounting=room;indType=ctrl;', //EXT
//			'PEComputerIndicatorBlock' NA
			'PEProgrammableIndicatorBlock' : 'shape=mxgraph.pid2inst.progLogCont;mounting=room;', //EXT
//Valves
			'PEGateValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=gate;', //EXT
			'PEGlobeValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=globe;', //EXT
			'PEControlValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=gate;actuator=diaph;', //EXT
			'PENeedleValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=needle;',
//			'PEButterflyValveBlock' NA
			'PEButterflyValve2Block' : 'shape=mxgraph.pid2valves.valve;valveType=butterfly;',
//			'PEBallValveBlock' NA
			'PEDiaphragmBlock' : 'shape=mxgraph.pid2valves.valve;valveType=ball;', 
//			'PEPlugValveBlock' NA
			'PECheckValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=check;',
			'PECheckValve2Block' : 'shape=mxgraph.pid2valves.valve;valveType=check;',
			'PEAngleValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=angle;actuator=none;',
			'PEAngleGlobeValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=angleGlobe;actuator=man;flipH=1;', //EXT
			'PEPoweredValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=gate;actuator=digital;', //EXT
			'PEFloatOperatedValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=gate;actuator=singActing;',
//			'PENeedleValve2Block' NA
			'PEThreeWayValveBlock' : 'shape=mxgraph.pid2valves.valve;valveType=threeWay;actuator=none;',
//			'PEFourWayValveBlock' NA
//			'PEGaugeBlock' NA
			'PEBleederValveBlock' : 'shape=mxgraph.pid2valves.blockBleedValve;actuator=none;',
//			'PEOrificeBlock' NA
			'PERotameterBlock' : 'shape=mxgraph.pid.flow_sensors.rotameter;flipH=1;',
//Venn Gradient
			'VennGradientColor1' : 'shape=ellipse;',
			'VennGradientColor2' : 'shape=ellipse;',
			'VennGradientColor3' : 'shape=ellipse;',
			'VennGradientColor4' : 'shape=ellipse;',
			'VennGradientColor5' : 'shape=ellipse;',
			'VennGradientColor6' : 'shape=ellipse;',
			'VennGradientColor7' : 'shape=ellipse;',
			'VennGradientColor8' : 'shape=ellipse;',
//Venn Plain
			'VennPlainColor1' : 'shape=ellipse;',
			'VennPlainColor2' : 'shape=ellipse;',
			'VennPlainColor3' : 'shape=ellipse;',
			'VennPlainColor4' : 'shape=ellipse;',
			'VennPlainColor5' : 'shape=ellipse;',
			'VennPlainColor6' : 'shape=ellipse;',
			'VennPlainColor7' : 'shape=ellipse;',
			'VennPlainColor8' : 'shape=ellipse;',
//iOS Devices
			'iOS7DeviceiPhone5Portrait' : 'shape=mxgraph.ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone5Landscape' : 'shape=mxgraph.ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPadPortrait' : 'shape=mxgraph.ios.iPad;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPadLandscape' : 'shape=mxgraph.ios.iPad;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6Portrait' : 'shape=mxgraph.ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6Landscape' : 'shape=mxgraph.ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6PlusPortrait' : 'shape=mxgraph.ios.iPhone;bgStyle=bgGreen;', //EXT
			'iOS7DeviceiPhone6PlusLandscape' : 'shape=mxgraph.ios.iPhone;bgStyle=bgGreen;', //EXT
//iPhone Elements
			'iOS7StatusBariPhone' : 'shape=mxgraph.ios7ui.appBar;',
//			'iOS7NavBariPhone' NA
//			'iOS7TabsiPhone' EXT
//			'iOS7iPhoneActionSheet' EXT
			'iOS7iPhoneKeyboard' : 'shape=mxgraph.ios7.misc.keyboard_(letters);',
//			'iOS7TableView' EXT
//iPad Elements
			'iOS7StatusBariPad' : 'shape=mxgraph.ios7ui.appBar;',
//			'iOS7NavBariPad' EXT
//			'iOS7TabsiPad' EXT
//			'iOS7iPadActionSheet' EXT
			'iOS7iPadKeyboard' : 'shape=mxgraph.ios7.misc.keyboard_(letters);',
//			'iOS7SplitView'
//			'iOS7iPadPopover'
//Common Elements
//			'iOS7AlertDialog' EXT
			'iOS7ProgressBar' : 'shape=mxgraph.ios7ui.downloadBar;', //EXT
			'iOS7Slider' : 'shape=mxgraph.ios7ui.searchBox;', //EXT
			'iOS7SearchBar' : 'shape=mxgraph.ios7ui.searchBox;', 
			'iOS7Button' : 'shape=rect;',
			'iOS7TextField' : 'shape=rect;',
			'iOS7TextView' : 'shape=rect;',
//			'iOS7SegmentedControl' EXT
			'iOS7Toggle' : 'shape=mxgraph.ios7ui.onOffButton;buttonState=on;strokeColor=#38D145;strokeColor2=#aaaaaa;fillColor=#38D145;fillColor2=#ffffff;', //EXT
			'iOS7Stepper' : 'shape=mxgraph.ios7.misc.adjust;fillColor=#ffffff;gradientColor=none;',
			'iOS7PageControls' : 'shape=mxgraph.ios7ui.pageControl;fillColor=#666666;strokeColor=#bbbbbb;', //EXT
			'iOS7Block' : 'shape=rect;',
//			'iOS7DatePicker' EXT
//			'iOS7TimePicker' EXT
//			'iOS7CountdownPicker' EXT
//iOS Icons
			'iOS7IconArrow left' : 'shape=mxgraph.ios7.misc.left;',
			'iOS7IconArrow' : 'shape=mxgraph.ios7.misc.right;',
			'iOS7IconArrow up' : 'shape=mxgraph.ios7.misc.up;',
			'iOS7IconArrow down' : 'shape=mxgraph.ios7.misc.down;',
			'iOS7IconWifi' : 'shape=mxgraph.ios7.icons.wifi;',
			'iOS7IconBluetooth' : 'shape=mxgraph.ios7.icons.bluetooth;',
			'iOS7IconBattery' : 'shape=mxgraph.ios7.icons.battery;',
			'iOS7IconSiri' : 'shape=mxgraph.ios7.icons.microphone;',
			'iOS7IconCheck' : 'shape=mxgraph.ios7.icons.select;',
			'iOS7IconCreate' : 'shape=mxgraph.ios7.icons.add;',
			'iOS7IconInfo' : 'shape=mxgraph.ios7.icons.info;',
			'iOS7IconLocation' : 'shape=mxgraph.ios7.icons.location_2;',
			'iOS7IconQuestion' : 'shape=mxgraph.ios7.icons.help;',
			'iOS7IconSearch' : 'shape=mxgraph.ios7.icons.looking_glass;',
			'iOS7IconToolbox' : 'shape=mxgraph.ios7.icons.briefcase;',
			'iOS7IconOptions' : 'shape=mxgraph.ios7.icons.options;',
			'iOS7IconShare' : 'shape=mxgraph.ios7.icons.share;',
			'iOS7IconTyping' : 'shape=mxgraph.ios7.icons.message;',
			'iOS7IconCopy' : 'shape=mxgraph.ios7.icons.folders_2;',
			'iOS7IconChat' : 'shape=mxgraph.ios7.icons.messages;',
			'iOS7IconOrganize' : 'shape=mxgraph.ios7.icons.folder;',
			'iOS7IconTrash' : 'shape=mxgraph.ios7.icons.trashcan;',
			'iOS7IconReply' : 'shape=mxgraph.ios7.icons.back;',
			'iOS7IconArchive' : 'shape=mxgraph.ios7.icons.box;',
			'iOS7IconCompose' : 'shape=mxgraph.ios7.icons.compose;',
			'iOS7IconSend' : 'shape=mxgraph.ios7.icons.pointer;',
			'iOS7IconDrawer' : 'shape=mxgraph.ios7.icons.storage;',
			'iOS7IconMail' : 'shape=mxgraph.ios7.icons.mail;',
			'iOS7IconDocument' : 'shape=mxgraph.ios7.icons.document;',
			'iOS7IconFlag' : 'shape=mxgraph.ios7.icons.flag;',
			'iOS7IconBookmarks' : 'shape=mxgraph.ios7.icons.book;',
			'iOS7IconGlasses' : 'shape=mxgraph.ios7.icons.glasses;',
			'iOS7IconFiles' : 'shape=mxgraph.ios7.icons.folders;',
			'iOS7IconDownloads' : 'shape=mxgraph.ios7.icons.down;',
			'iOS7IconLock' : 'shape=mxgraph.ios7.icons.locked;',
//			'iOS7IconUnlock' NA
			'iOS7IconCloud' : 'shape=mxgraph.ios7.icons.cloud;',
//			'iOS7IconCloud-lock' NA
			'iOS7IconOrientation Lock' : 'shape=mxgraph.ios7.icons.orientation_lock;',
//			'iOS7IconNotification' NA
			'iOS7IconContacts' : 'shape=mxgraph.ios7.icons.user;',
			'iOS7IconGlobal' : 'shape=mxgraph.ios7.icons.globe;',
			'iOS7IconSettings' : 'shape=mxgraph.ios7.icons.settings;',
			'iOS7IconAirplay' : 'shape=mxgraph.ios7.icons.move_to_folder;',
			'iOS7IconCamera' : 'shape=mxgraph.ios7.icons.camera;',
			'iOS7IconAirplane' : 'shape=mxgraph.signs.transportation.airplane_6;direction=south;',
			'iOS7IconCalculator' : 'shape=mxgraph.ios7.icons.calculator;',
			'iOS7IconPreferences' : 'shape=mxgraph.ios7.icons.most_viewed;',
			'iOS7IconPhone' : 'shape=mxgraph.signs.tech.telephone_3;',
			'iOS7IconKeypad' : 'shape=mxgraph.ios7.icons.keypad;',
			'iOS7IconVoicemail' : 'shape=mxgraph.ios7.icons.tape;',
			'iOS7IconStar' : 'shape=mxgraph.ios7.icons.star;',
			'iOS7IconMost Viewed' : 'shape=mxgraph.ios7.icons.most_viewed;',
			'iOS7IconVideo' : 'shape=mxgraph.ios7.icons.video_conversation;',
			'iOS7IconVolumne Controls' : 'shape=mxgraph.ios7.icons.volume;',
			'iOS7IconLocation pin' : 'shape=mxgraph.ios7.icons.location;',
			'iOS7IconCalendar' : 'shape=mxgraph.ios7.icons.calendar;',
			'iOS7IconAlarm' : 'shape=mxgraph.ios7.icons.alarm_clock;',
			'iOS7IconClock' : 'shape=mxgraph.ios7.icons.clock;',
			'iOS7IconTimer' : 'shape=mxgraph.ios7.icons.gauge;',
			'iOS7IconVolume down' : 'shape=mxgraph.ios7.icons.silent;',
			'iOS7IconVolume' : 'shape=mxgraph.ios7.icons.volume_2;',
			'iOS7IconVolume up' : 'shape=mxgraph.ios7.icons.loud;',
			'iOS7IconRepeat' : 'shape=mxgraph.ios7.icons.reload;',
			'iOS7IconRewind' : 'shape=mxgraph.ios7.icons.backward;',
			'iOS7IconPlay' : 'shape=mxgraph.ios7.icons.play;',
			'iOS7IconPause' : 'shape=mxgraph.ios7.icons.pause;',
			'iOS7IconFast forward' : 'shape=mxgraph.ios7.icons.forward;',
//			'iOS7IconArtists' NA
//			'iOS7IconPlaylist' NA
			'iOS7IconControls' : 'shape=mxgraph.ios7.icons.controls;',
//			'iOS7IconShuffle' NA
			'iOS7IconPrivacy' : 'shape=mxgraph.ios7.icons.privacy;',
			'iOS7IconLink' : 'shape=mxgraph.ios7.icons.link;',
			'iOS7IconLight' : 'shape=mxgraph.ios7.icons.flashlight;',
			'iOS7IconBrightness' : 'shape=mxgraph.ios7.icons.sun;',
			'iOS7IconHeart' : 'shape=mxgraph.ios7.icons.heart;',
			'iOS7IconJava' : 'shape=mxgraph.ios7.icons.cup;',
			'iOS7IconBox' : 'shape=mxgraph.ios7.icons.bag;',
			'iOS7IconEye' : 'shape=mxgraph.ios7.icons.eye;',
			'iOS7IconDo not disturb' : 'shape=mxgraph.ios7.icons.moon;',
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
			'UI2BrowserBlock' : 'shape=mxgraph.mockup.containers.browserWindow;mainText=,;', //EXT
			'UI2WindowBlock' : 'shape=mxgraph.mockup.containers.window;strokeColor2=#008cff;strokeColor3=#c4c4c4;fontColor=#666666;mainText=;', 
//			'UI2DialogBlock' EXT
			'UI2AreaBlock' : 'shape=rect;',
			'UI2ElementBlock' : 'shape=rect;',
//			'UI2AccordionBlock' EXT
//			'UI2TabBarContainerBlock' EXT
//			'UI2TabBar2ContainerBlock' EXT
//			'UI2VTabBarContainerBlock' EXT
			'UI2VScrollBlock' : 'shape=mxgraph.mockup.navigation.scrollBar;direction=north;',
			'UI2HScrollBlock' : 'shape=mxgraph.mockup.navigation.scrollBar;',
			'UI2VerticalSplitterBlock' : 'shape=mxgraph.mockup.forms.splitter;direction=north;',
			'UI2HorizontalSplitterBlock' : 'shape=mxgraph.mockup.forms.splitter;',
//UI Widgets
			'UI2ImageBlock' : 'shape=mxgraph.mockup.graphics.simpleIcon;',
			'UI2VideoBlock' : 'shape=mxgraph.mockup.containers.videoPlayer;barHeight=30;',
			'UI2AudioBlock' : 'shape=mxgraph.mockup.misc.playbackControls;',
			'UI2MapBlock' : 'shape=mxgraph.mockup.misc.map;',
//			'UI2CalendarBlock' NA
			'UI2BarChartBlock' : 'shape=mxgraph.mockup.graphics.barChart;strokeColor=none;strokeColor2=none;',
			'UI2ColumnChartBlock' : 'shape=mxgraph.mockup.graphics.columnChart;strokeColor=none;strokeColor2=none;',
			'UI2LineChartBlock' : 'shape=mxgraph.mockup.graphics.lineChart;strokeColor=none;',
			'UI2PieChartBlock' : 'shape=mxgraph.mockup.graphics.pieChart;parts=10,20,35;',
			'UI2WebcamBlock' : 'shape=mxgraph.mockup.containers.userMale;',
			'UI2CaptchaBlock' : 'shape=mxgraph.mockup.text.captcha;mainText=;',
//			'Image_ui_formatting_toolbar2'
//UI Input
			'UI2ButtonBlock' : 'shape=rect;rounded=1;',
//			'UI2CheckBoxBlock' EXT
//			'UI2HorizontalCheckBoxBlock' EXT
//			'UI2RadioBlock' EXT
//			'UI2HorizontalRadioBlock' EXT
			'UI2ColorPickerBlock' : 'shape=mxgraph.mockup.forms.colorPicker;chosenColor=#aaddff;',
			'UI2TextInputBlock' : 'shape=rect;rounded=1;',
			'UI2SelectBlock' : 'shape=mxgraph.mockup.forms.comboBox;strokeColor=#999999;fillColor=#ddeeff;align=left;fillColor2=#aaddff;mainText=;fontColor=#666666;',
			'UI2VSliderBlock' : 'shape=mxgraph.mockup.forms.horSlider;sliderStyle=basic;sliderPos=20;handleStyle=circle;direction=north;',
			'UI2HSliderBlock' : 'shape=mxgraph.mockup.forms.horSlider;sliderStyle=basic;sliderPos=20;handleStyle=circle;',
//			'UI2DatePickerBlock' NA
			'UI2SearchBlock' : 'shape=mxgraph.mockup.forms.searchBox;mainText=;flipH=1;',
			'UI2NumericStepperBlock' : 'shape=mxgraph.mockup.forms.spinner;spinLayout=right;spinStyle=normal;adjStyle=triangle;fillColor=#000000;mainText=;',
//			'UI2TableBlock' EXT
//UI Menus
//			'UI2ButtonBarBlock' EXT
//			'UI2VerticalButtonBarBlock' EXT
//			'UI2LinkBarBlock' EXT
//			'UI2BreadCrumbsBlock' EXT
//			'UI2MenuBarBlock' EXT
			'UI2AtoZBlock' : 'shape=mxgraph.mockup.text.alphanumeric;linkText=;fontStyle=4;',
			'UI2PaginationBlock' : 'shape=mxgraph.mockup.navigation.pagination;linkText=;fontStyle=4;',
//			'UI2ContextMenuBlock' EXT
//			'UI2TreePaneBlock'EXT
			'UI2PlaybackControlsBlock' : 'shape=mxgraph.mockup.misc.playbackControls;fillColor=#ffffff;strokeColor=#999999;fillColor2=#99ddff;strokeColor2=none;fillColor3=#ffffff;strokeColor3=none;',
			'Image_ui_formatting_toolbar' : 'shape=mxgraph.mockup.menus_and_buttons.font_style_selector_2;',
//UI Misc
			'UI2ProgressBarBlock' : 'shape=mxgraph.mockup.misc.progressBar;fillColor2=#888888;barPos=25;',
			'UI2HelpIconBlock' : 'shape=mxgraph.mockup.misc.help_icon;',
			'UI2BraceNoteBlock' : 'shape=mxgraph.mockup.markup.curlyBrace;direction=north;', //EXT
			'UI2TooltipBlock' : 'shape=mxgraph.basic.rectangular_callout;flipV=1;', //EXT
			'UI2CalloutBlock' : 'shape=ellipse;',
//			'UI2AlertBlock' EXT
//iOS 6 iPad Elements
			'Image_ipad_ipad' : 'shape=mxgraph.ios.iPad;bgStyle=bgGreen;',
			'iPadGrayBackgroundBlock' : 'shape=rect;',
			'Image_ipad_top_bar' : 'shape=mxgraph.ios.iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc;',
//			'Image_ipad_bar_gray' : 'shape=rect;',
//			'Image_ipad_bar_semi_trans_black' : 'shape=rect;',
//			'Image_ipad_bar_black' : 'shape=rect;',
//			'Image_ipad_safari_top' NA
			'Image_ipad_search' : 'shape=mxgraph.mockup.forms.searchBox;mainText=;flipH=1;',
//			'Image_ipad_alert_dialog' EXT
//			'Image_ipad_dialog' EXT
			'Image_ipad_popover' : 'shape=mxgraph.ios.iOption;barPos=50;pointerPos=top;buttonText=;',
//			'Image_ipad_table' EXT
//			'Image_ipad_vtab' EXT
//iOS 6 iPad Controls
			'Image_ipad_button_black' : 'shape=rect;roudned=1;',
			'Image_ipad_button_blue' : 'shape=rect;roudned=1;',
			'Image_ipad_button_grayblue' : 'shape=rect;roudned=1;',
			'Image_ipad_button_red' : 'shape=rect;roudned=1;',
			'Image_ipad_back_button_gray' : 'shape=mxgraph.ios.iButtonBack;buttonText=;fillColor=#eeeeee;fillColor2=#aaaaaa;',
			'Image_ipad_back_button_black' : 'shape=mxgraph.ios.iButtonBack;buttonText=;fillColor=#888888;fillColor2=#000000;',
			'Image_ipad_sort_handle' : 'shape=mxgraph.ios7.icons.options;',
			'Image_ipad_dropdown' : 'shape=mxgraph.ios.iComboBox;buttonText=;fillColor=#dddddd;fillColor2=#3D5565;',
			'Image_ipad_email_name' : 'shape=rect;rounded=1;',
			'Image_ipad_prev_next' : 'shape=mxgraph.ios.iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff;',
			'Image_ipad_keyboard_portrait' : 'shape=mxgraph.ios.iKeybLett;',
			'Image_ipad_keyboard_landscape' : 'shape=mxgraph.ios.iKeybLett;',
//			'Image_ipad_large_tabbed_button' EXT
//			'Image_ipad_sort_button' EXT
//			'Image_ipad_tab_bar' EXT
			'Image_ipad_slider' : 'shape=mxgraph.ios.iSlider;barPos=20;',
//			'Image_ipad_switch_off'
//iOS 6 iPad Icons
			'Image_ipad_add_icon_blue' : 'shape=mxgraph.ios.iAddIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_ipad_add_icon_green' : 'shape=mxgraph.ios.iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff;',
			'Image_ipad_remove_icon' : 'shape=mxgraph.ios.iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;',
			'Image_ipad_arrow_icon' : 'shape=mxgraph.ios.iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_ipad_arrow' : 'shape=mxgraph.ios7.misc.more;',
			'Image_ipad_checkmark' : 'shape=mxgraph.ios7.misc.check;',
			'Image_ipad_check_off' : 'shape=ellipse;', //EXT
			'Image_ipad_location_dot' : 'shape=ellipse;',
			'Image_ipad_mark_as_read' : 'shape=ellipse;',
			'Image_ipad_pin_green' : 'shape=mxgraph.ios.iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;',
			'Image_ipad_pin_red' : 'shape=mxgraph.ios.iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;',
			'Image_ipad_radio_off' : 'shape=ellipse;', //EXT
			'Image_ipad_checkbox_off' : 'shape=rect;rounded=1;', //EXT
			'Image_ipad_indicator' : 'shape=rect;rounded=1;fillColor=#e8878E;gradientColor=#BD1421;strokeColor=#ffffff;',
//iOS 6 iPhone Elements
			'Image_iphone_iphone_4' : 'shape=mxgraph.ios.iPhone;bgStyle=bgGreen;',
			'Image_iphone_bg_black' : 'shape=rect;',
			'Image_iphone_bg_gray' : 'shape=rect;',
			'Image_iphone_bg_stripe_drk' : 'shape=mxgraph.ios.iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F;',
			'Image_iphone_bg_stripe_lt' : 'shape=mxgraph.ios.iBgStriped;strokeColor=#18211b;fillColor=#5D7585;strokeColor2=#657E8F;',
			'Image_iphone_bg_white' : 'shape=rect;',
			'Image_iphone_top_bar_app' : 'shape=mxgraph.ios.iAppBar;',
			'Image_iphone_top_bar_home' : 'shape=mxgraph.ios.iTopBar2;opacity=50;fillColor=#999999;strokeColor=#cccccc;strokeWidth=1;',
			'Image_iphone_bar_top' : 'shape=rect;',
			'Image_iphone_bar_semi_trans_black' : 'shape=rect;',
			'Image_iphone_bar_semi_trans_blue' : 'shape=rect;',
			'Image_iphone_search' : 'shape=mxgraph.mockup.forms.searchBox;mainText=;flipH=1;',
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
			'Image_iphone_alpha_list' : 'shape=mxgraph.ios.iAlphaList;',
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
			'Image_iphone_back_button' : 'shape=mxgraph.ios.iButtonBack;strokeColor=#444444;buttonText=;fillColor=#dddddd;fillColor2=#3D5565;',
			'Image_iphone_prev_next' : 'shape=mxgraph.ios.iPrevNext;strokeColor=#444444;fillColor=#dddddd;fillColor2=#3D5565;fillColor3=#ffffff;',
			'Image_iphone_sort_handle' : 'shape=mxgraph.ios7.icons.options;',
			'Image_iphone_slider' : 'shape=mxgraph.ios.iSlider;barPos=60;',
			'Image_iphone_dropdown' : 'shape=mxgraph.ios.iComboBox;buttonText=;fillColor=#dddddd;fillColor2=#3D5565;',
			'Image_iphone_email_name' : 'shape=rect;rounded=1;',
			'Image_iphone_switch_off' : 'shape=mxgraph.android.switch_off;fillColor=#666666;', //EXT
			'Image_iphone_keyboard_button_blue' : 'shape=rect;rounded=1;',
			'Image_iphone_keyboard_letters' : 'shape=mxgraph.ios.iKeybLett;',
			'Image_iphone_keyboard_landscape' : 'shape=mxgraph.ios.iKeybLett;',
//			'Image_iphone_large_tabbed_button' EXT
//			'Image_iphone_sort_button' EXT
//			'Image_iphone_tab_bar' EXT
//			'Image_iphone_picker_multi' EXT
//			'Image_iphone_picker_web' EXT
//iOS 6 iPhone Icons
			'Image_iphone_add_icon_blue' : 'shape=mxgraph.ios.iAddIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_iphone_add_icon_green' : 'shape=mxgraph.ios.iAddIcon;fillColor=#7AdF78;fillColor2=#1A9917;strokeColor=#ffffff;',
			'Image_iphone_remove_icon' : 'shape=mxgraph.ios.iDeleteIcon;fillColor=#e8878E;fillColor2=#BD1421;strokeColor=#ffffff;',
			'Image_iphone_arrow_icon' : 'shape=mxgraph.ios.iArrowIcon;fillColor=#8BbEff;fillColor2=#135Ec8;strokeColor=#ffffff;',
			'Image_iphone_arrow' : 'shape=mxgraph.ios7.misc.more;',
			'Image_iphone_checkmark' : 'shape=mxgraph.ios7.misc.check;',
			'Image_iphone_check_off' : 'shape=ellipse;', //EXT
			'Image_iphone_location_dot' : 'shape=ellipse;',
			'Image_iphone_mark_as_read' : 'shape=ellipse;',
			'Image_iphone_pin_green' : 'shape=mxgraph.ios.iPin;fillColor2=#00dd00;fillColor3=#004400;strokeColor=#006600;',
			'Image_iphone_pin_red' : 'shape=mxgraph.ios.iPin;fillColor2=#dd0000;fillColor3=#440000;strokeColor=#660000;',
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
		
		// TODO: Convert text object to HTML
		return (text != null && text.t != null) ? text.t : '';
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
				//console.log('no mapping', a.Class);
			}
			
			var p = (a.Properties != null) ? a.Properties : a;
			
			if (p != null)
			{
				cell.value = convertText(p);
				
				// Converts images
				if (a.Class == 'ImageSearchBlock2')
				{
					cell.style += 'image=' + p.URL + ';';
				}
				
				// Adds styles
				cell.style += createStyle(mxConstants.STYLE_STROKEWIDTH, p.LineWidth, '1');
				cell.style += createStyle(mxConstants.STYLE_STROKECOLOR, p.LineColor.substring(0, 7), '#000000');
				cell.style += createStyle(mxConstants.STYLE_ALIGN, p.TextAlign, 'center');
				cell.style += createStyle(mxConstants.STYLE_VERTICAL_ALIGN, p.TextVAlign, 'middle');
				cell.style += createStyle(mxConstants.STYLE_OPACITY, p.Opacity, '100');
				
				// Converts rotation
				if (p.Rotation != null)
				{
					// KNOWN: TextRotation currently ignored
					var deg = mxUtils.toDegree(parseFloat(p.Rotation));
					
					// Fixes the case for horizontal swimlanes where we use horizontal=0
					// and Lucid uses rotation
					if (a.Class == 'AdvancedSwimLaneBlockRotated')
					{
						deg += 90;
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
		
		var v = new mxCell('', new mxGeometry(Math.round(b.x * scale + dx), Math.round(b.y * scale + dy),
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
				
				var x = (parseFloat(ta.Location) - 0.5) * 2;
				var lab = new mxCell(convertText(ta), new mxGeometry(x, 0, 0, 0), labelStyle);
				lab.geometry.relative = true
				lab.vertex = true;
				
				e.insert(lab);
				count++;
			}
		}
		
		return e;
	}

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

			// Vertices first (populates lookup table for connecting edges)
			if (g.Blocks != null)
			{
				for (var key in g.Blocks)
				{
					var obj = g.Blocks[key];
					obj.id = key;
				    lookup[obj.id] = createVertex(obj);
					queue.push(obj);
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
					e.geometry.setTerminalPoint(new mxPoint(Math.round(p.Endpoint1.x * scale + dx),
						Math.round(p.Endpoint1.y * scale + dy)), true);
				}
				
				if (trg == null && p.Endpoint2 != null)
				{
					e.geometry.setTerminalPoint(new mxPoint(Math.round(p.Endpoint2.x * scale + dx),
						Math.round(p.Endpoint2.y * scale + dy)), false);
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

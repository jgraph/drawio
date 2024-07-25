(function()
{
	// Adds iOS7 shapes
	Sidebar.prototype.addIos7Palette = function()
	{
		// Avoids having to bind all functions to "this"
		var sb = this;
		
		var sizeX = 200; //reference size for iPhone and all other iOS shapes
		
		var sizeY = 2 * sizeX; //change only sizeX, to avoid changing aspect ratio
		var sc = 0.3; // stencil scaling
		
		//default tags
		var dt = 'ios icon ';
		
		var s = 'html=1;verticalLabelPosition=bottom;align=center;labelBackgroundColor=#ffffff;verticalAlign=top;strokeWidth=2;strokeColor=#0080F0;shadow=0;dashed=0;shape=mxgraph.ios7.icons.'
		var inh = 'strokeColor=inherit;fillColor=inherit;gradientColor=inherit;';
		var gn = 'mxgraph.ios7.icons';
		this.setCurrentSearchEntryLibrary('ios', 'ios7icons');
		
		this.addPaletteFunctions('ios7icons', 'iOS Icons', false,
		[
			this.createVertexTemplateEntry(s + 'add;', 100 * sc, 100 * sc, '', 'Add', null, null, this.getTagsForStencil(gn, 'add', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'alarm_clock;', 90 * sc, 100 * sc, '', 'Alarm Clock', null, null, this.getTagsForStencil(gn, 'alarm_clock', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'back;', 100 * sc, 85 * sc, '', 'Back', null, null, this.getTagsForStencil(gn, 'back', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'backward;', 100 * sc, 56 * sc, '', 'Backward', null, null, this.getTagsForStencil(gn, 'backward', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bag;', 70 * sc, 70 * sc, '', 'Bag', null, null, this.getTagsForStencil(gn, 'bag', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'basket_cancel;', 100 * sc, 40 * sc, '', 'Basket Cancel', null, null, this.getTagsForStencil(gn, 'basket_cancel', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'basketball;', 100 * sc, 100 * sc, '', 'Basketball', null, null, this.getTagsForStencil(gn, 'basketball', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'battery;', 100 * sc, 40 * sc, '', 'Battery', null, null, this.getTagsForStencil(gn, 'battery', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bell;', 80 * sc, 77 * sc, '', 'Bell', null, null, this.getTagsForStencil(gn, 'bell', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bluetooth;pointerEvents=1', 50 * sc, 96 * sc, '', 'Bluetooth', null, null, this.getTagsForStencil(gn, 'bluetooth', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'book;', 100 * sc, 85 * sc, '', 'Book', null, null, this.getTagsForStencil(gn, 'book', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'bookmark;', 60 * sc, 80 * sc, '', 'Bookmark', null, null, this.getTagsForStencil(gn, 'bookmark', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'box;', 100 * sc, 100 * sc, '', 'Box', null, null, this.getTagsForStencil(gn, 'box', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'briefcase;', 100 * sc, 67 * sc, '', 'Briefcase', null, null, this.getTagsForStencil(gn, 'briefcase', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'calculator;', 80 * sc, 100 * sc, '', 'Calculator', null, null, this.getTagsForStencil(gn, 'calculator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'calendar;', 100 * sc, 100 * sc, '', 'Calendar', null, null, this.getTagsForStencil(gn, 'calendar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'camera;', 100 * sc, 58 * sc, '', 'Camera', null, null, this.getTagsForStencil(gn, 'camera', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'chat;', 100 * sc, 60 * sc, '', 'Chat', null, null, this.getTagsForStencil(gn, 'chat', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'clock;', 100 * sc, 100 * sc, '', 'Clock', null, null, this.getTagsForStencil(gn, 'clock', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud;', 100 * sc, 100 * sc, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'compose;', 97 * sc, 97 * sc, '', 'Compose', null, null, this.getTagsForStencil(gn, 'compose', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'controls;', 90 * sc, 80 * sc, '', 'Controls', null, null, this.getTagsForStencil(gn, 'controls', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'credit_card;', 100 * sc, 50 * sc, '', 'Credit Card', null, null, this.getTagsForStencil(gn, 'credit_card', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'crop;', 100 * sc, 100 * sc, '', 'Crop', null, null, this.getTagsForStencil(gn, 'crop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cube;', 100 * sc, 100 * sc, '', 'Cube', null, null, this.getTagsForStencil(gn, 'cube', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cup;', 100 * sc, 100 * sc, '', 'Cup', null, null, this.getTagsForStencil(gn, 'cup', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'data;', 80 * sc, 97 * sc, '', 'Data', null, null, this.getTagsForStencil(gn, 'data', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'delete;', 100 * sc, 100 * sc, '', 'Delete', null, null, this.getTagsForStencil(gn, 'delete', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'document;', 70 * sc, 100 * sc, '', 'Document', null, null, this.getTagsForStencil(gn, 'document', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'documents;', 75 * sc, 100 * sc, '', 'Documents', null, null, this.getTagsForStencil(gn, 'documents', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'down;', 70 * sc, 85 * sc, '', 'Down', null, null, this.getTagsForStencil(gn, 'down', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'edit;', 98 * sc, 98 * sc, '', 'Edit', null, null, this.getTagsForStencil(gn, 'edit', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'envelope_(empty);', 100 * sc, 100 * sc, '', 'Envelope (Empty)', null, null, this.getTagsForStencil(gn, 'envelope_(empty)', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'envelope_(message);', 100 * sc, 100 * sc, '', 'Envelope (Message)', null, null, this.getTagsForStencil(gn, 'envelope_(message)', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'eye;', 100 * sc, 47 * sc, '', 'Eye', null, null, this.getTagsForStencil(gn, 'eye', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'flag;', 100 * sc, 100 * sc, '', 'Flag', null, null, this.getTagsForStencil(gn, 'flag', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'flash;', 60 * sc, 100 * sc, '', 'Flash', null, null, this.getTagsForStencil(gn, 'flash', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'flashlight;', 50 * sc, 100 * sc, '', 'Flashlight', null, null, this.getTagsForStencil(gn, 'flashlight', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'folder;', 100 * sc, 65 * sc, '', 'Folder', null, null, this.getTagsForStencil(gn, 'folder', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'folders;', 100 * sc, 85 * sc, '', 'Folders', null, null, this.getTagsForStencil(gn, 'folders', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'folders_2;', 100 * sc, 75 * sc, '', 'Folders', null, null, this.getTagsForStencil(gn, 'folders_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'forward;', 100 * sc, 56 * sc, '', 'Forward', null, null, this.getTagsForStencil(gn, 'forward', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'gauge;', 108 * sc, 105 * sc, '', 'Gauge', null, null, this.getTagsForStencil(gn, 'gauge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'glasses;', 100 * sc, 40 * sc, '', 'Glasses', null, null, this.getTagsForStencil(gn, 'glasses', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'globe;', 100 * sc, 100 * sc, '', 'Globe', null, null, this.getTagsForStencil(gn, 'globe', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'heart;', 102 * sc, 91 * sc, '', 'Heart', null, null, this.getTagsForStencil(gn, 'heart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'help;', 100 * sc, 100 * sc, '', 'Help', null, null, this.getTagsForStencil(gn, 'help', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'home;', 80 * sc, 85 * sc, '', 'Home', null, null, this.getTagsForStencil(gn, 'home', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'info;', 100 * sc, 100 * sc, '', 'Info', null, null, this.getTagsForStencil(gn, 'info', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'keypad;', 100 * sc, 100 * sc, '', 'Keypad', null, null, this.getTagsForStencil(gn, 'keypad', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'lightbulb;', 76 * sc, 99 * sc, '', 'Lightbulb', null, null, this.getTagsForStencil(gn, 'lightbulb', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'link;', 100 * sc, 100 * sc, '', 'Link', null, null, this.getTagsForStencil(gn, 'link', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'location;', 80 * sc, 100 * sc, '', 'Location', null, null, this.getTagsForStencil(gn, 'location', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'location_2;', 100 * sc, 100 * sc, '', 'Location', null, null, this.getTagsForStencil(gn, 'location_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'locked;', 80 * sc, 100 * sc, '', 'Locked', null, null, this.getTagsForStencil(gn, 'locked', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'looking_glass;', 100 * sc, 100 * sc, '', 'Looking Glass', null, null, this.getTagsForStencil(gn, 'looking_glass', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'loud;', 102 * sc, 108 * sc, '', 'Loud', null, null, this.getTagsForStencil(gn, 'loud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'magnet;pointerEvents=1', 80 * sc, 100 * sc, '', 'Magnet', null, null, this.getTagsForStencil(gn, 'magnet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mail;', 100 * sc, 55 * sc, '', 'Mail', null, null, this.getTagsForStencil(gn, 'mail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'map;', 100 * sc, 100 * sc, '', 'Map', null, null, this.getTagsForStencil(gn, 'map', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'message;', 100 * sc, 65 * sc, '', 'Message', null, null, this.getTagsForStencil(gn, 'message', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'messages;', 100 * sc, 85 * sc, '', 'Messages', null, null, this.getTagsForStencil(gn, 'messages', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'microphone;', 40 * sc, 100 * sc, '', 'Microphone', null, null, this.getTagsForStencil(gn, 'microphone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'monitor;', 100 * sc, 65 * sc, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'moon;', 98 * sc, 98 * sc, '', 'Moon', null, null, this.getTagsForStencil(gn, 'moon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'most_viewed;pointerEvents=1', 94 * sc, 76 * sc, '', 'Most Viewed', null, null, this.getTagsForStencil(gn, 'most_viewed', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'move_to_folder;', 100 * sc, 75 * sc, '', 'Move to Folder', null, null, this.getTagsForStencil(gn, 'move_to_folder', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'note;pointerEvents=1', 99 * sc, 99 * sc, '', 'Note', null, null, this.getTagsForStencil(gn, 'note', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'options;pointerEvents=1', 100 * sc, 50 * sc, '', 'Options', null, null, this.getTagsForStencil(gn, 'options', dt).join(' ')),
			this.createVertexTemplateEntry('html=1;verticalLabelPosition=bottom;strokeWidth=2;strokeColor=#0080F0;fillColor=strokeColor;shadow=0;dashed=0;shape=mxgraph.ios7.icons.orientation_lock;pointerEvents=1', 77 * sc, 70 * sc, '', 'Orientation Lock', null, null, this.getTagsForStencil(gn, 'orientation_lock', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'page_navigation;pointerEvents=1', 100 * sc, 16 * sc, '', 'Page Navigation', null, null, this.getTagsForStencil(gn, 'page_navigation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'paint;', 100 * sc, 85 * sc, '', 'Paint', null, null, this.getTagsForStencil(gn, 'paint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pause;pointerEvents=1', 50 * sc, 80 * sc, '', 'Pause', null, null, this.getTagsForStencil(gn, 'pause', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pen;', 98 * sc, 99 * sc, '', 'Pen', null, null, this.getTagsForStencil(gn, 'pen', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pie_chart;', 100 * sc, 100 * sc, '', 'Pie Chart', null, null, this.getTagsForStencil(gn, 'pie_chart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'play;', 70 * sc, 80 * sc, '', 'Play', null, null, this.getTagsForStencil(gn, 'play', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pointer;', 100 * sc, 100 * sc, '', 'Pointer', null, null, this.getTagsForStencil(gn, 'pointer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'preferences;pointerEvents=1', 100 * sc, 80 * sc, '', 'Preferences', null, null, this.getTagsForStencil(gn, 'preferences', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'printer;', 100 * sc, 85 * sc, '', 'Printer', null, null, this.getTagsForStencil(gn, 'printer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'privacy;', 56 * sc, 95 * sc, '', 'Privacy', null, null, this.getTagsForStencil(gn, 'privacy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'radio;', 100 * sc, 75 * sc, '', 'Radio', null, null, this.getTagsForStencil(gn, 'radio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'reload;', 80 * sc, 90 * sc, '', 'Reload', null, null, this.getTagsForStencil(gn, 'reload', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'repeat;pointerEvents=1', 100 * sc, 80 * sc, '', 'Repeat', null, null, this.getTagsForStencil(gn, 'repeat', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'retry;', 92 * sc, 48 * sc, '', 'Retry', null, null, this.getTagsForStencil(gn, 'retry', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'select;', 100 * sc, 100 * sc, '', 'Select', null, null, this.getTagsForStencil(gn, 'select', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'settings;', 100 * sc, 100 * sc, '', 'Settings', null, null, this.getTagsForStencil(gn, 'settings', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'share;', 70 * sc, 95 * sc, '', 'Share', null, null, this.getTagsForStencil(gn, 'share', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'shopping_cart;', 100 * sc, 85 * sc, '', 'Shopping Cart', null, null, this.getTagsForStencil(gn, 'shopping_cart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'shuffle;pointerEvents=1', 100 * sc, 70 * sc, '', 'Shuffle', null, null, this.getTagsForStencil(gn, 'shuffle', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'silent;', 100 * sc, 100 * sc, '', 'Silent', null, null, this.getTagsForStencil(gn, 'silent', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'smartphone;', 60 * sc, 100 * sc, '', 'Smartphone', null, null, this.getTagsForStencil(gn, 'smartphone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'star;', 100 * sc, 90 * sc, '', 'Star', null, null, this.getTagsForStencil(gn, 'star', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stopwatch;', 90 * sc, 94 * sc, '', 'Stopwatch', null, null, this.getTagsForStencil(gn, 'stopwatch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage;', 100 * sc, 35 * sc, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sun;pointerEvents=1', 100 * sc, 100 * sc, '', 'Sun', null, null, this.getTagsForStencil(gn, 'sun', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tape;pointerEvents=1', 100 * sc, 40 * sc, '', 'Tape', null, null, this.getTagsForStencil(gn, 'tape', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tools;pointerEvents=1', 99 * sc, 99 * sc, '', 'Tools', null, null, this.getTagsForStencil(gn, 'tools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'trashcan;', 80 * sc, 100 * sc, '', 'Trashcan', null, null, this.getTagsForStencil(gn, 'trashcan', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'trophy;', 95 * sc, 100 * sc, '', 'Trophy', null, null, this.getTagsForStencil(gn, 'trophy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'umbrella;', 100 * sc, 100 * sc, '', 'Umbrella', null, null, this.getTagsForStencil(gn, 'umbrella', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'unlocked;', 80 * sc, 100 * sc, '', 'Unlocked', null, null, this.getTagsForStencil(gn, 'unlocked', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'up;', 70 * sc, 85 * sc, '', 'Up', null, null, this.getTagsForStencil(gn, 'up', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'user;', 100 * sc, 100 * sc, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'video_conversation;', 100 * sc, 50 * sc, '', 'Video Conversation', null, null, this.getTagsForStencil(gn, 'video_conversation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'volume;pointerEvents=1', 100 * sc, 100 * sc, '', 'Volume', null, null, this.getTagsForStencil(gn, 'volume', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'volume_2;pointerEvents=1', 101 * sc, 94 * sc, '', 'Volume', null, null, this.getTagsForStencil(gn, 'volume_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallet;', 100 * sc, 80 * sc, '', 'Wallet', null, null, this.getTagsForStencil(gn, 'wallet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wifi;pointerEvents=1', 99 * sc, 70 * sc, '', 'WiFi', null, null, this.getTagsForStencil(gn, 'wifi', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'window;', 100 * sc, 100 * sc, '', 'Window', null, null, this.getTagsForStencil(gn, 'window', dt).join(' '))
		]);
		
		this.setCurrentSearchEntryLibrary();
		
		var s = 'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7ui.';
		var s2 = 'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7ui.';
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios.';		var sm = 'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=2;shape=mxgraph.ios7.misc.';
		var s4 = 'html=1;strokeWidth=2;shadow=0;dashed=0;shape=mxgraph.ios7ui.';
		var skcl9 = 'strokeColor=#999999;';
		var dt = 'ios ui ';
		var gn = 'mxgraph.ios7ui';
		var gnm = 'mxgraph.ios7.misc';
		this.setCurrentSearchEntryLibrary('ios', 'ios7ui');
		
		var fns =
		[
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.iphone;strokeColor=#c0c0c0;', 
		 			sizeX, sizeY, '', 'iPhone (Portrait)', null, null, this.getTagsForStencil(gn, 'phone', dt + 'iphone portrait').join(' ')),
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.ipad7inch;strokeColor=#c0c0c0;', 
		 			sizeX * 1.83, sizeY * 1.3725, '', "iPad (7'')", null, null, this.getTagsForStencil(gn, 'tablet tab 7', dt + 'ipad portrait').join(' ')),
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.ipad10inch;strokeColor=#c0c0c0;', 
		 			sizeX * 2.44, sizeY * 1.7325, '', "iPad (10'')", null, null, this.getTagsForStencil(gn, 'tablet tab 10', dt + 'ipad portrait').join(' ')),
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.ipad13inch;strokeColor=#c0c0c0;', 
		 			sizeX * 2.86, sizeY * 2.0325, '', "iPad (13'')", null, null, this.getTagsForStencil(gn, 'tablet tab 10', dt + 'ipad portrait').join(' ')),
			this.addDataEntry(dt + 'app bar portrait', 175, 15, 'App Bar (portrait)',
				'1ZZdb5swFIZ/jS+DwJgmuWxJFk1apSqbtGsrHLBVg5FxUrJfP4PtlECypVIzaUSRfD58Dj7PKwsUp2W7UbRmzzIDgeI1ilMlpbarsk1BCIRDnqF4hTAOzR/hL1eiUR8Na6qg0rdswHbDgYo9WI91NPoonIPp0rzWKkLxU6OVfIWfPNPMexjN5JsxQmNktGGQOcNE6q5C2Rbd6QIum/meB7Sun6gy8ZwLkUohVd8lzvvH+E12xs3b+1glK+jKvYLeMVeb0R3bK9jQ2jiIcdSSVxrU+mA2Ni7JnQyUhvbqdHqXG80GZAlaHU3K0UZnOFgQHM3DJYlDYn4RzCJiq7y5KXRF5on1MeAF85WdjzbWLk7V33GYhSNymU48oZM+brdf19sJJD9tBTs9nhYVvKjMWkDexXJZ6e/8V5e96FJruuNV8a0PrjA5z/DmgBTtn5MaRpyGWD062+GH9LRuwjeQ3U0k8R9JhkEywZaEF6i5kSsQVPMDnLW7hNJ1fOlOMBDOQzDCL/O8AT2Bf3rTm/RAJnqIzHwek+Tl+UOKGEngvwbcjgD/Y+Cu/SwOz9rfSQDJRADLBfLe6/D9DaDsua9cAVs3lWh5nvJwD4l8/D7/XL1Ef1ULuXSpf5JaSHIHtRjz/cPBpg+/K34D'),
			this.addDataEntry(dt + 'app bar landscape', 280, 15, 'App Bar (landscape)',
				'5ZbLjpswFIafhuUgYmCaWebeSh1plFbq2oIDtsZgy5hM0qfvMTZJyEWJNEo3gwTiXMxv+/9ABPGs2q40VexV5iCCeBHEMy2lcXfVdgZCBCTieRDPA0IiPAOyvFIdddVIUQ21uWcAcQM2VLTgMi7RmJ3wCWYqnNZ8FMTTxmj5Dn94blifYTSXHxhEGOS0YZD7ACvKPqHalnZ1IZfNt5aHVKkp1VgvuBAzKaTuVOKiOzCP3TnH2fe1WtZgH/cOJmP+2YxmrNWwogoTCSaU5LUBvdjgwMY3FbI2S1pxscPERGeMG8iwSqI5bUuG7b7pl2x1ZqfKjFFYT+MJXnDL7MU2NGEpZSmAKt6Emay6QtZ0rcvCSeDtQCQl01MZ/teKEDs3v+ugDWyvOtelvG0rkBUYjTrRh99+697YuRsx4Cjlh6UuRxsXl/uhBw7wxqNwGYv4DIvZZL3+sVif0dHbrHHZuDAqeFljKKAww3WPrYmKZrwuf3bFOUmGHX14RAXtjj15J0wcI9Rj4hR+S9Vj+DluvoPYgOGZncPRi3CXf+Syfzv/XobepyM/00t2ei80CGr4BgZylzz2im92aQe5p+fwhAtZFA2YMyr2M70LlOQMlBHuzyRN315voXLCxhdwfnvi/H8mwcs/kaH8g8hIz8h4GQd99vYHRLt1X/mCrP2ujF6GLc9fCqTRTYyS9HEYJY/ACMPDz49rP/43+gc='),
			
			this.createVertexTemplateEntry(
					s + 'slider;barPos=20;strokeColor=#0080f0;strokeColor2=#a0a0a0;', 
					sizeX * 0.75, sizeY * 0.0375, '', 'Slider', null, null, this.getTagsForStencil(gn, dt + 'slider', null).join(' ')),
			this.createVertexTemplateEntry(
					s2 + 'downloadBar;verticalAlign=middle;fontSize=8;buttonText=;barPos=30;fillColor=#aaaaaa;strokeColor=#0080f0;align=center;', 
					sizeX * 0.75, sizeY * 0.075, 'Downloading 2 of 6\n\n', 'Download bar', null, null, this.getTagsForStencil(gn, 'downloadBar', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'adjust;gradientColor=none;sketch=0;', 
					sizeX * 0.4, sizeY * 0.05, '', 'Adjust', null, null, this.getTagsForStencil(gn, 'adjust', dt + '').join(' ')),
					
			this.addEntry('horizontal button bar', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 164, 12.5),
			    	'swimlane;shape=mxgraph.bootstrap.anchor;strokeColor=#0080F0;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=0;startSize=0;horizontalStack=1;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Item 1', new mxGeometry(0, 0, 41, 12.5),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.leftButton;rSize=3;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Item 2', new mxGeometry(0, 0, 41, 12.5),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=3;fillColor=#0080F0;fontColor=#ffffff;fontSize=8;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Item 3', new mxGeometry(0, 0, 41, 12.5),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;rSize=3;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Item 4', new mxGeometry(0, 0, 41, 12.5),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;shape=mxgraph.bootstrap.rightButton;rSize=3;fillColor=inherit;fontColor=inherit;fontSize=8;');
				field4.vertex = true;
				cell.insert(field4);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Horizontal button bar');
			}),
		    
			this.addDataEntry(dt + 'select bar', sizeX * 0.825, sizeY * 0.0675, 'Select Bar',
				'7VVNb+IwEP01uaLglHLmo8Cl0koc9mwlk9iqE0e2A2F//c7YDpACu1Ur9bIbiWj85s2HZx5Kkq3qfmt4K151ASrJXpJsZbR2war7FSiVsFQWSbZOGEvxl7DNA+/Ue9OWG2jcRwJYCDhw1UFAAmDdSUVAuBrbWk+TbGmd0W/wUxZOIMIIEbzQRzykeCi4FVDEA3paylD3Fd1uIrWdd3JiQUHultwQv6e8zIee0Jx5DNOu52Ra+QsiGgqvtNLGN5WV/kFPKZW6wpl/EMeihcQhDL5GN0CJ3sDlIrYoeC46A1veIvCEQKtl48C8HDDQRlKpG7fhtVTU4cLkQjq8gMUZrXlXCaRH0l53JqeGhXMt+mfZAl84eXoRwU4qrSsFvJV2kuvaO3LrqZsylEBzVGTGlu/LhKn4qcXlgXHQPxSAh+L2t6BrcAbrpMe4RWI8z0KYAImlojLmAeM2nKtz6EVOaERF3VdXdqOuvV//jcYGsRhyjpc6LG6kgAjSPO6K4jKnKXu/wx2oAziZc1o4GIm3gqucBkh3u2ES00+L5hv0cPXXPBJl33Jf8Wiou4/Jg/1VHvM/qMOA4k4eYJT+K5J5eiiZdEHE/8L5x4QTK/ygYSGlH6ceInRZWnA3Qjv3dU97eLx8aAP9+jv8Gw=='),
			this.addDataEntry(dt + 'select bar', sizeX * 0.825, sizeY * 0.0675, 'Select Bar',
				'7ZZNb6MwEIZ/DdcITNme89Gkl5Uq5dCzBUNs1WBkm4T21++MbRqyNNqsdrWXDVKQ/c6XPfNEIsnXzbAzvBPfdQUqyZ+SfG20dmHVDGtQKmGprJJ8kzCW4i9h2yvWzFvTjhto3S0BLAQcueohKEGw7l1FQbgGj7XJknxlndFv8CorJ1BhpAhe6RNuUtxU3Aqo4gYtHWVohgPdbiG1fezlwoKC0q24If+B8jIf+o7LwmuMVj6D/ICohsJrrbTxh8pr/6CllkpNdOYf1LFoJbEJo63VLVCiN3CliEcUvBS9gR3vUHhAodOydWCejhhoo1OtW7fljVR0wqUphXR4AYs92vD+INA9Ou11b0o6sHCuQ3uRL/GFnacXOdjFQeuDAt5Juyh14w2l9a7bOpTA5UWRgq1+LhO64rsWhwfGwXAVAC/F6e9AN+AM1klPcYrk8a0IYQIklopkPAaN27A/fIaeccJFJOpruvIZXXs//hljIyyGjJdDHQd3QUAUqR9fQnHuUzab4TOoIzhZcho4GIm3gklOA8Td89iJbApN9jvQ/AMeTqTvO+7LnAwdaTX5u96EB/slHkV6nQ4Dijt5hIv0f4LMw1Vk0iU53sH5z8CJFV6oWegyXKYeI3RdW3Az0D7PdRN7xYy9F24d3KG7QxcC0r9AHW7Pn3fBffr19wM='),
					
			this.addEntry(dt + 'labels', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 20), 'shape=rect;fillColor=#F6F6F8;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Label', new mxGeometry(55, 0, 54, 20), 'text;fontSize=10;verticalAlign=middle;align=center;spacingTop=2;whiteSpace=wrap;html=1;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Label', new mxGeometry(109, 0, 55, 20), 'text;fontColor=#0080f0;fontSize=10;verticalAlign=middle;align=right;spacingTop=2;spacingRight=4;whiteSpace=wrap;html=1;');
			   	text2.vertex = true;
			   	bg.insert(text2);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Labels');
			}),

			this.addEntry(dt + 'search box', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 20), 'shape=rect;fillColor=#e0e0e0;strokeColor=none;');
			   	bg.vertex = true;
			   	var part1 = new mxCell('', new mxGeometry(0, 0, 164, 20), s2 + 'marginRect;rx=3;ry=3;rectMargin=5;strokeColor=none;');
			   	part1.vertex = true;
			   	bg.insert(part1);
			   	var icon1 = new mxCell('Search', new mxGeometry(0.5, 0.5, 6, 6), 'shape=mxgraph.ios7.icons.looking_glass;strokeColor=#e0e0e0;fillColor=none;fontColor=#e0e0e0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;fontSize=6;fontStyle=0;spacingTop=2;sketch=0;html=1;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-17, -3);
			   	icon1.vertex = true;
			   	bg.insert(icon1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Box');
			}),

			this.addEntry(dt + 'search box', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 20), 'shape=rect;fillColor=#F6F6F6;strokeColor=none;');
			   	bg.vertex = true;
			   	var part1 = new mxCell('', new mxGeometry(0, 0, 164, 20), s2 + 'marginRect;rx=3;ry=3;rectMargin=5;fillColor=#E4E4E4;strokeColor=none;');
			   	part1.vertex = true;
			   	bg.insert(part1);
			   	var icon1 = new mxCell('Search', new mxGeometry(0.5, 0.5, 6, 6), 'shape=mxgraph.ios7.icons.looking_glass;strokeColor=#878789;fillColor=none;fontColor=#878789;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;fontSize=6;fontStyle=0;spacingTop=2;sketch=0;html=1;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-17, -3);
			   	icon1.vertex = true;
			   	bg.insert(icon1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Box');
			}),
			this.addDataEntry(dt + 'status', 164, 25, 'Status',
				'vZRtb4MgEMc/jS9rnNZ2b1e7NlmyZcnWD8D0VDLkDNDW7tMPhD5qM7cm0xi5/3HA/eDwoqRqloLU5TNmwLzo0YsSgahsq2oSYMwLA5p50dwLw0B/Xri44r1rvUFNBHA1JCC0ARvC1mAVK0i1Y06QJalNU0Cqh5zllLEEGYrWGy0m5tW6VAI/Ye/hyHXMzI0OQkFzdYWt5Ja3BKxAiZ3usqWZKl2PydiGlUCL0oWFsdWItHZxCD3mqxsu5f70o076qzojCjItPq2l0r8X3HaQ6GxaFMjVCYqgfZz+Rr9M51ibJn2aEvbAaMG1prDWKnFWqjmAMABrklJevBvvfBQOpRf+kV5wO71xh54xV1wAyQYy+2ifn5lVNMvMSF1st0DaWa87SP+BLB5eb1VTmGvBpyinPk2RSz/FqkYJnWprD999kAcX9fmbKryC6DzAAQv8HmRxl9heE8CIohs4G6sPo5v/FSlXx8lHe/Ju+tHUv6h9zHMJqrMRhzz69kabx3vWdj+9hr8B'),
			this.addDataEntry(dt + 'message', 164, 20, 'Message',
				'xVbbbqMwEP0aHouICUnzSnp52UirdqU+WzDB1toY2W6b9OvX4IGWW5ZVuyoWkn3GM545x4MI4r083WtasYPKQQTxbRDvtVLWz+RpD0IEJOJ5EN8EhETuDcjdjHXVWKOKaijtEgfiHV6oeAaPeMDYs0DAMFrVUw2ZC5keuRB7JZRurPHdth4ON1ar39BaSlU6nxSjg7Zwms2wgTC9e1ASrD67La88twx3bNbejQEvGLphZRE1fl10ru/1ugmWPF1+PCqfH8AYWsCIBmali3Kz6kp9wvwahNFcvbpF5BY5NQxyXLTsyVNRixxyZbbPPJRUF7x88JTqmpu4npzbiTMcmi0/4FjXS5Ie+oA0DOBfqhoFSJW1SiI8FC+tx0g8Z0mbUXuo0k7hVPCidJho8ktNRTNeFm22O/R85G918ddLrwL5vquwXtAJY92HvHXtMGB60zwz9yHkmSpNmFEJmn6SqjN2fZh4l4/UJWPmdh7SIKjlL9A7bYpNPPCn4i4PEmF6GBjPvlq3h7cR1PFowI7U6NJeJFCyVKDBN+hvSrhTeGUWf61meO87XFJh4v622CdluFrt+kJs/4MMm3+VYa4rUJ4LDSF5plXFcN+o+RbJlVyUqxPogmBTekVfoxfpy/UFXeOW7z8PfvvHf4s/'),
			this.addDataEntry(dt + 'action sheet', 164, 115, 'Action Sheet',
				'7VbBUsIwEP2aHnXSBJAzrXjRGUcOniPdthnTppMGAb/eDUm1UJSOiFyAYWb3ZXez2ffIJGBRsbrTvMofVAIyYLcBi7RSxlnFKgIpA0pEErA4oJTgL6DTb1bDzSqpuIbS9EmgLuGNywU4xAG1WUsP1DmvrKlhjiUneibercvQro1WrxApqTQipSpxYZIKKRsooCymMYuHiGeaJwLb2gnH8olaok/QyU2BI4hDNH1joA2svj3cBvInuwNVgNFrDFmKxOQ+YjRwaTmILG/SwqEDee2A7DP3a1Zo+HHtHx3rjO6evyCDu/NrncnN69l3F+6ePuF1Dol3mrEXq8yq41qo+mYhro2qJgtjVPkjFe25p6o0PnDcpWca2q8Pa+GEjMnU9qGhxuR2z8tcGJhVfG5LLrG5vmzRw2wN97DlJUw0SG7EG2zV38eg3+JRCdyZEt+Qp3y95TXpKk1rMB36P7vspYhBT0Xs/KM6Armw2JfFk9A4vND4zzQOTkHj6Cz384vCy7m4XNF/oIrRKVRx01FFxMv5yWVRcJ2J8sk/oexxLe+2aWfgwsMmxAO/1Uq6+ZxVK+uthENPMXakcvxuV02dY8SC7tfL24W3H+Yf'),
				
			this.addDataEntry(dt + 'action sheet', 164, 115, 'Action Sheet',
				'7VhRb5swEP41PDYCnBDyuEDpS6tV66Q9Ti44YNVgZDtNsl+/czApCdCQJY0qrYkS2ec7Y/v7vjsLCwX5+k7gMnvgCWEWurVQIDhXVStfB4Qxy7VpYqHQcl0bfpYb9Yw621G7xIIUakiAWwW8YrYklaUySLVhxiAzXOqmIDFMORdP9I/uImhLJfgLCTjjAiwFL2BgvqCM1SbLRaEbonAC9lTghMKyDtxh+oSvoG9Dx6yGCEXWvTvamsx27gjPiRIbcFnRRGXGwxtXYRmhaVaHOZPKiGVlSHexbwcEDXNG3eeFjp9XpnKIDp3d+fwyC3MOd5tgmZHEdOpjztepZsOIcjld0pHi5XypFC/ePfrmOS94oYyj34YjcvTXuDXstu3bkV6HIBKCm2seBIp7HJRJByjjip62IAwr+kr25u8CyjzikVN4smubBRlkN3u9OpwvFpKoFsq7VQ4CftwC/oFIiVNyVC98WSRblJ1exbwhNmkj5vnR1EddiOlPh7D02GTuObCPuUaNxph9YzQFCoVAJ7Ay/EzYI5dUUU2sMIZoIhru9wcOzxwomIMDNvPsImSJY1qkP/W84c0YLA3+rzKqyBN46K2tgNZD2YS62WTwtUcG4Qa7aiE2yVXbLkqum8M0chF6TYbn4TpBPGNJ4xGHkN+AGONLNTAjL7afoVCMu6FY79WPzV52bIre70jE3vl52GvLEVP24Vp0Zp59G5ymRScKgyj60uJFtIimVxDj9HQx6mo9ojEv5CjXROwo0K47m0XoXDl678oR7Z2O15aj1yFH+3w5+te+FlUi+LoZnVi8xh8hl1kL/O8lKbSD/vtWlh+elncS6kvLV069055829DAIOr4nyn1XuMaVOeiNpfuafHyX/LoEiX8U/HoKiXccVpECnARk/4r4kGBybFIafHDEGttaot+fNWAgYeti2HSv1adfsr1Vp1Ts0hPAdrsBRx7e4LOLEc12sg+H23ovr0hq9ybL9D+Ag=='),

			this.addEntry('cell list', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 164, 120),
			    	'swimlane;shape=mxgraph.bootstrap.anchor;strokeColor=none;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=25;dropTarget=0;fontSize=10;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#FF9501;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(5, -7.5);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
			   	var marker2 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-15, -5);
			   	marker2.vertex = true;
			   	field1.insert(marker2);
				var field2 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=25;dropTarget=0;fontSize=10;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker3 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#FF3B2F;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(5, -7.5);
			   	marker3.vertex = true;
			   	field2.insert(marker3);
			   	var marker4 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
			   	marker4.geometry.relative = true;
			   	marker4.geometry.offset = new mxPoint(-15, -5);
			   	marker4.vertex = true;
			   	field2.insert(marker4);
				var field3 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=25;dropTarget=0;fontSize=10;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker5 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#4CDA64;');
			   	marker5.geometry.relative = true;
			   	marker5.geometry.offset = new mxPoint(5, -7.5);
			   	marker5.vertex = true;
			   	field3.insert(marker5);
			   	var marker6 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
			   	marker6.geometry.relative = true;
			   	marker6.geometry.offset = new mxPoint(-15, -5);
			   	marker6.vertex = true;
			   	field3.insert(marker6);
				var field4 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=25;dropTarget=0;fontSize=10;');
				field4.vertex = true;
				cell.insert(field4);
			   	var marker7 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#007AFF;');
			   	marker7.geometry.relative = true;
			   	marker7.geometry.offset = new mxPoint(5, -7.5);
			   	marker7.vertex = true;
			   	field4.insert(marker7);
			   	var marker8 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
			   	marker8.geometry.relative = true;
			   	marker8.geometry.offset = new mxPoint(-15, -5);
			   	marker8.vertex = true;
			   	field4.insert(marker8);
				var field5 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=25;dropTarget=0;fontSize=10;');
				field5.vertex = true;
				cell.insert(field5);
			   	var marker9 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#5855D6;');
			   	marker9.geometry.relative = true;
			   	marker9.geometry.offset = new mxPoint(5, -7.5);
			   	marker9.vertex = true;
			   	field5.insert(marker9);
			   	var marker10 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
			   	marker10.geometry.relative = true;
			   	marker10.geometry.offset = new mxPoint(-15, -5);
			   	marker10.vertex = true;
			   	field5.insert(marker10);
				var field6 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=25;dropTarget=0;fontSize=10;');
				field6.vertex = true;
				cell.insert(field6);
			   	var marker11 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#8F8E94;');
			   	marker11.geometry.relative = true;
			   	marker11.geometry.offset = new mxPoint(5, -7.5);
			   	marker11.vertex = true;
			   	field6.insert(marker11);
			   	var marker12 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
			   	marker12.geometry.relative = true;
			   	marker12.geometry.offset = new mxPoint(-15, -5);
			   	marker12.vertex = true;
			   	field6.insert(marker12);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Cell list');
			}),
						    
			this.addEntry('cell list', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 164, 120),
			    	'swimlane;shape=mxgraph.bootstrap.anchor;strokeColor=none;fillColor=#ffffff;fontColor=#000000;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=5;dropTarget=0;fontSize=10;');
				field1.vertex = true;
				cell.insert(field1);
			   	var marker1 = new mxCell('Label', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;fontSize=10;spacingRight=4;fontColor=#999999;html=1;');
			   	marker1.geometry.relative = true;
			   	marker1.geometry.offset = new mxPoint(-15, -5);
			   	marker1.vertex = true;
			   	field1.insert(marker1);
				var field2 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=5;dropTarget=0;fontSize=10;');
				field2.vertex = true;
				cell.insert(field2);
			   	var marker2 = new mxCell('Label', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;fontSize=10;spacingRight=4;fontColor=#999999;html=1;');
			   	marker2.geometry.relative = true;
			   	marker2.geometry.offset = new mxPoint(-15, -5);
			   	marker2.vertex = true;
			   	field2.insert(marker2);
				var field3 = new mxCell('Label', new mxGeometry(0, 0, 164, 20),
					'text;strokeColor=inherit;align=left;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=inherit;spacingLeft=5;dropTarget=0;fontSize=10;');
				field3.vertex = true;
				cell.insert(field3);
			   	var marker3 = new mxCell('Label', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;fontSize=10;spacingRight=4;fontColor=#999999;html=1;');
			   	marker3.geometry.relative = true;
			   	marker3.geometry.offset = new mxPoint(-15, -5);
			   	marker3.vertex = true;
			   	field3.insert(marker3);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Cell list');
			}),
						    
			this.addDataEntry(dt + 'message', 164, 35, 'Message',
				'1Zdtb5swEMc/DS+HCISme5mkTTSpk6p1mrSXHhzg1XDINk2yT787cB4IyRqpzbQRxcF/n33H3U828aJ5uV5qURefMQXlRfdeNNeItrsr13NQygsDmXrRnReGAX29cHFmdNSOBrXQUNlLJoTdhBehGuiUTjB2o5xgClHzrYaElpwZq/EZ5qhQk1hhRWOzTCq1lVLIRKPYNNcilRTIkTEtmOKK+gF3nsEmhesUIikaDUtRkzAmoUZZWdD3L7SKcUYZVnYhSqk2JEx1UkhLkRkK+k40eUHmzugJG51w5IW1NY3H0ZQaSgU3bGD8HDFXIGpp/ATLdiAxreki61zQbc9JHM6O3chf7CTk2Fw2QVtYn61IK7lyLAFLsJr8BCuZ2sJZ3Iy7aQVIctWJUdxpwnT9fDd1X1+6cSU+Xe5oUO5H4CcJgyVVEMzZ4tMysjZwSf29MAqCyWJx28/Pttsz44t0oWRekaYgaxGrRSKr/CsyBqO98NAO31HyZkr8APWIRlqJPFN3eZpx6mUi1MPReCnTlJ9pZzB1LncDbwTxG+hUVILn2lK5uC/CIXwdh2BIw1bToISVL9Bb/hQizsMjPwiZuHgcU5tebzsds8yAHfC1C/Ii5MYD5DiY6Tg+y1q5znk/9CWaiV9Kk/jb6vbZI4Ju2usED46kV3HYknfMzwCPI5IdkV9cQcZDuD+21z8IVn/CAWbx1Sj7MLo+Z/GAs0/U/dkYjiNHbgV9K1hRm2k6l9KzBFJWzx51R3vVJcBMBlvYaPKH3bC3/b3DGbknaMXH2BMtz1GtNC9xSNXhLu6e9r12sFMH2lvhcjCNrkHTzYCm79iQ8Fwh88NorQSlPXVYpZj79PMdjOVsb5zNnru6qWtWfd//W9jFF2F3G/DnqtgdIHaKQOd4htbSO1h3vv+fKL7Hxkbd/et/Z3747+A3'),
			this.addDataEntry(dt + 'message', 164, 100, 'Message',
				'7Zffb9sgEMf/Gj8uwjhJ28f8cvuwSlNbbc/MPhtWbCzATbq/fochrVMnndW1Uh9mKZb5cscd3AdQomRV7S41a/i1ykFGySZKVlop67+q3QqkjCgReZSsI0oJ/iKanuiNu17SMA21HeNAvcMDky14xQvGPsogGM4a96khwyGXxmp1DysllUaxVjX2LQsh5V6KaFJ0D+qlZrnAVF6Y45C52mKbuMY92IxjI8YGZxlvNVyyBoUpCo0StQW9ecBRTPAoVG1TVgn5iMJCZ1xYzM1g2mvWlhzNg9GtanXmcufWNtg/Sxb4wsVwL2dgJqVSpQTWCDPJVNV1ZKYzTQsfAj8Pgszo8mUY8dsFoS63sJ6gLexO1qSTQkEuQVVgNcYhW5FbHizmU+/GQWCoIBJfTMKMF8on3+cS40eo8vGKJ4OK3zLb6py5DGKcwiJ2/YvrkyDgzBwITIqyxmYGtV8KN2mRMbkIHZXIcwmHazQLzR4sF90zhqw9PQ3LRF3eqSbwoMHg6D/C6sV9psibmPoOuB41Q3nryn6LAV3yW+2GWHJbyRBnVLXpW6vtNQ2SWfEAB+MfIyCE+OZm1zNRRWHADhB5ymQUNdMBNVfgJlGxOqLoTUrVxXTEQBYl6YCe3qr5Qh/Uq38g5MxwyPenQ4Cu2pXukJwIZc5aMUHMpGrHnkebs818s+oxK6GwI4mdPxP3tfNax2dDiEn3HIPzGEEfCOw7EXlBhkDSfwQy5DPzDo/BfXbo/y60zoa0CmzficrDqgp8ZXg5GPDCr9a4DEs3K4QaAspo0shOEXVrwd0wVuGrELUwHD9+amD3BTN28ql4J/NzkqZOl6K5CjH/wr51xL4OPh1y/3TTH3D/hZ4AP1jdBKhi+nk3Q3AgkyTQ1D+vyZHtsbd76/YIG2JKPmBDzAcb4gZYjkqqRXfzj7vqtZ/t/5v+c930gZzzdyAHm89/Prx5/7/JHw=='),

			this.addEntry(dt + 'alert', function()
			{
				var bg = new mxCell("A dialog text that notifies you of something of which you don't need to make a decision, just to acknowledge it by pressing the close button.", 
						new mxGeometry(0, 0, 120, 70), 'shape=rect;rounded=1;strokeColor=none;fillColor=#F6F6F8;gradientColor=none;shadow=0;glass=0;dashed=1;fontFamily=Helvetica;fontSize=7;fontColor=#333333;align=center;html=1;verticalAlign=top;whiteSpace=wrap;spacing=8;spacingTop=0;');
				bg.vertex = true;
				var text1 = new mxCell('Close', new mxGeometry(0, 1, 120, 20), 'shape=text;align=center;verticalAlign=middle;fontSize=8;fontColor=#0680FF;strokeColor=none;fillColor=none;spacingTop=3;resizeWidth=1;whiteSpace=wrap;html=1;');
				text1.geometry.relative = true;
				text1.geometry.offset = new mxPoint(0, -20);
				text1.vertex = true;
				bg.insert(text1);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Alert');
			}),
			this.addDataEntry(dt + 'dialog', 120, 70, 'Dialog',
				'7VbbbptAEP0aHhNhSB2/xm5IXypVSqU+r9iBHWXZRbvjC/36zpq1jR1orKipVKlGNjNnruw5lkjyVbN7cqJVX60EneSPSb5y1lJvNbsVaJ1kKcok/5xkWcrfJCsmorN9NG2FA0PXFGR9wUboNfTIA7sShbY1G4SkoU/x1OmY4pVog+mg5CFLZ9dGQmg4Y8+Tsy+wsto6Row1nLmsUOsDlGR5MedrwXjthERe9SKdB0i7ZT8NOVp4H20pvDpOqqyhQjSoOwa+gN4AYSli4Bl/hhUX0R0M7z+MC421YazkBYCDS0WNjr034EIz/RBzyLaMbhUSPLeiDK23TFrYlV00NQPZyfse0vcbx/PldrCb5GgPRYKewDZAruOULUpSMSPymCrAWsWy+4gJ3/v1sfTEOBuR9HEB5G8IAHYUbkqEm7GEFYJns7Nr/rVVUEaYqsIZ8CpGHoMGIDhkQ0MoUUJ4JoWlCokloTWHMIkXuJ3U2X6JEb4uSWpQSg3nArj/jQDelOpBjkNSb+ZB8uC5/Y/Iz2xCGgM9XSWD7H0yyCPmQAvCDZz1H9NGHPHNogmsdnH6hZpsVXmgV1o6LnaVvO5ey+tA/OxD+B75w6fzRVoU7+U7/dt0d2cFA/LnI9xnf4b7mw8h/9M0+dl/8kfJjwXpbTy7f1YM7J7eYvr04UvOLw=='),

			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.bluetooth;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Bluetooth', null, null, this.getTagsForStencil(gn, 'bluetooth', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.broadcast;fillColor=#4CDA64;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Broadcast', null, null, this.getTagsForStencil(gn, 'broadcast', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.link;fillColor=#4CDA64;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Link', null, null, this.getTagsForStencil(gn, 'link', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.night;fillColor=#5855D6;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Night', null, null, this.getTagsForStencil(gn, 'night', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.notification;fillColor=#FF3B2F;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Notification', null, null, this.getTagsForStencil(gn, 'notification', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.settings;fillColor=#8F8E94;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Settings', null, null, this.getTagsForStencil(gn, 'settings', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.switch;fillColor=#8F8E94;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Switch', null, null, this.getTagsForStencil(gn, 'switch', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.text_size;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Text Size', null, null, this.getTagsForStencil(gn, 'text size', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.travel;fillColor=#FF9501;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'Travel', null, null, this.getTagsForStencil(gn, 'travel', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.vpn;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'VPN', null, null, this.getTagsForStencil(gn, 'vpn virtual private network', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.wifi;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;sketch=0;',
					15, 15, '', 'WiFi', null, null, this.getTagsForStencil(gn, 'wifi', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			s2 + 'url;fillColor=#e0e0e0;strokeColor=#c0c0c0;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;spacingTop=2;align=center;whiteSpace=wrap;',
					sizeX * 0.825, sizeY * 0.03125, 'draw.io', 'URL', null, null, this.getTagsForStencil(gn, 'url', dt + 'url').join(' ')),
			this.createVertexTemplateEntry(
					s + 'iconGrid;fillColor=#c0c0c0;gridSize=3,3;', 
					sizeX * 0.875, sizeY * 0.7, '', 'Icon grid', null, null, this.getTagsForStencil(gn, 'iconGrid', dt + 'icon grid').join(' ')),
					
			this.addEntry(dt + 'action dialog', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 60), 'shape=rect;fillColor=#a0a0a0;strokeColor=none;shadow=0;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Action', new mxGeometry(8, 6, 148, 21), 'html=1;strokeWidth=1;shadow=0;dashed=0;rounded=1;absoluteArcSize=1;arcSize=6;fontColor=#0080F0;fontSize=7;fontSize=14;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Cancel', new mxGeometry(8, 33, 148, 21), 'html=1;strokeWidth=1;shadow=0;dashed=0;rounded=1;absoluteArcSize=1;arcSize=6;fontColor=#0080F0;fontSize=7;fontSize=14;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Action Dialog');
			}),

			this.createVertexTemplateEntry(s3 + 'iKeybLett;sketch=0;', 
					sizeX * 0.87, sizeY * 0.25, '', 'iPhone Keyboard (letters)', null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;sketch=0;', 
					sizeX * 0.87, sizeY * 0.25, '', 'iPhone Keyboard (numbers)', null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;sketch=0;', 
					sizeX * 0.87, sizeY * 0.25, '', 'iPhone Keyboard (symbols)', null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybLett;sketch=0;', 
					sizeX * 1.66, sizeY * 0.36, '', "iPad 7''Keyboard (letters)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;sketch=0;', 
					sizeX * 1.66, sizeY * 0.36, '', "iPad 7'' Keyboard (numbers)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;sketch=0;', 
					sizeX * 1.66, sizeY * 0.36, '', "iPad 7'' Keyboard (symbols)", null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybLett;sketch=0;', 
					sizeX * 2.21, sizeY * 0.48, '', "iPad 10''Keyboard (letters)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;sketch=0;', 
					sizeX * 2.21, sizeY * 0.48, '', "iPad 10'' Keyboard (numbers)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;sketch=0;', 
					sizeX * 2.21, sizeY * 0.48, '', "iPad 10'' Keyboard (symbols)", null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybLett;sketch=0;', 
					sizeX * 2.53, sizeY * 0.55, '', "iPad 13''Keyboard (letters)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;sketch=0;', 
					sizeX * 2.53, sizeY * 0.55, '', "iPad 13'' Keyboard (numbers)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;sketch=0;', 
					sizeX * 2.53, sizeY * 0.55, '', "iPad 13'' Keyboard (symbols)", null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
		   	this.createVertexTemplateEntry(sm + 'call_pad;sketch=0;', 
		   			sizeX * 0.7, sizeY * 0.4, '', 'Call Pad', null, null, this.getTagsForStencil(gnm, 'call_pad', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'number_pad;strokeWidth=1;', 
					sizeX * 0.7, sizeY * 0.4, '', 'Number Pad', null, null, this.getTagsForStencil(gnm, 'number_pad', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'keyboard_(letters);sketch=0;', 
					sizeX * 0.875, sizeY * 0.3, '', 'Keyboard', null, null, this.getTagsForStencil(gnm, 'keyboard_(letters)', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'scroll_(horizontal);fillColor=#a0a0a0;', 
					sizeX * 0.4, sizeY * 0.015, '', 'Scroll (Horizontal)', null, null, this.getTagsForStencil(gnm, 'scroll_(horizontal)', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'scroll_(vertical);fillColor=#a0a0a0;', 
					sizeX * 0.03, sizeY * 0.2, '', 'Scroll (Vertical)', null, null, this.getTagsForStencil(gnm, 'scroll_(vertical)', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'add;fillColor=#00dd00;strokeColor=#ffffff;sketch=0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Add', null, null, this.getTagsForStencil(gnm, 'add', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'delete;fillColor=#ff0000;strokeColor=#ffffff;sketch=0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Delete', null, null, this.getTagsForStencil(gnm, 'delete', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'select;fillColor=#0080f0;strokeColor=#ffffff;sketch=0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Select', null, null, this.getTagsForStencil(gnm, 'select', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'remove;fillColor=#0080f0;strokeColor=#ffffff;sketch=0;', 
					sizeX * 0.08, sizeY * 0.03, '', 'Remove', null, null, this.getTagsForStencil(gnm, 'remove', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'check;strokeColor=#0080f0;', 
					sizeX * 0.05, sizeY * 0.02, '', 'Check', null, null, this.getTagsForStencil(gnm, 'check', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'flagged;strokeColor=#0080f0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Flagged', null, null, this.getTagsForStencil(gnm, 'flagged', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'up;strokeColor=#0080f0;', 
					sizeX * 0.06, sizeY * 0.015, '', 'Up', null, null, this.getTagsForStencil(gnm, 'up', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'down;strokeColor=#0080f0;', 
					sizeX * 0.06, sizeY * 0.015, '', 'Down', null, null, this.getTagsForStencil(gnm, 'down', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'left;strokeColor=#0080f0;', 
					sizeX * 0.03, sizeY * 0.03, '', 'Left', null, null, this.getTagsForStencil(gnm, 'left', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'right;strokeColor=#0080f0;', 
					sizeX * 0.03, sizeY * 0.03, '', 'Right', null, null, this.getTagsForStencil(gnm, 'right', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'increase;strokeColor=#0080f0;sketch=0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Increase', null, null, this.getTagsForStencil(gnm, 'increase', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'info;strokeColor=#0080f0;sketch=0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Info', null, null, this.getTagsForStencil(gnm, 'info', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'more_2;strokeColor=#a0a0a0;', 
					sizeX * 0.03, sizeY * 0.02, '', 'More 2', null, null, this.getTagsForStencil(gnm, 'more_2', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'more;strokeColor=#a0a0a0;', 
					sizeX * 0.025, sizeY * 0.02, '', 'More', null, null, this.getTagsForStencil(gnm, 'more', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'options;fillColor=#222222;sketch=0;', 
					sizeX * 0.06, sizeY * 0.015, '', 'Options', null, null, this.getTagsForStencil(gnm, 'options', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'pause;strokeColor=#0080f0;sketch=0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Pause', null, null, this.getTagsForStencil(gnm, 'pause', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'star;fillColor=#0080f0;strokeColor=none;sketch=0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Star', null, null, this.getTagsForStencil(gnm, 'star', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'contacts_bar;strokeColor=#0080F0;fillColor=#e0e0e0', 
					sizeX * 0.875, sizeY * 0.07, '', 'Contacts Bar', null, null, this.getTagsForStencil(gnm, 'contacts_bar', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'edit_bar;strokeColor=#0080F0;fillColor=#e0e0e0', 
					sizeX * 0.875, sizeY * 0.07, '', 'Edit Bar', null, null, this.getTagsForStencil(gnm, 'edit_bar', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'message_bar;strokeColor=#0080F0;fillColor=#e0e0e0', 
					sizeX * 0.875, sizeY * 0.07, '', 'Message Bar', null, null, this.getTagsForStencil(gnm, 'message_bar', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'misc_bar;strokeColor=#0080F0;fillColor=#e0e0e0', 
					sizeX * 0.875, sizeY * 0.07, '', 'Misc Bar', null, null, this.getTagsForStencil(gnm, 'misc_bar', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					s + 'onOffButton;buttonState=on;strokeColor=#38D145;strokeColor2=#aaaaaa;fillColor=#38D145;fillColor2=#ffffff;', 
					sizeX * 0.2175, sizeY * 0.0375, '', 'On-off button (On)', null, null, this.getTagsForStencil(gn, 'onOffButton', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					s + 'onOffButton;buttonState=off;strokeColor=#38D145;strokeColor2=#aaaaaa;fillColor=#38D145;fillColor2=#ffffff;', 
					sizeX * 0.2175, sizeY * 0.0375, '', 'On-off button (Off)', null, null, this.getTagsForStencil(gn, 'onOffButton', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					s2 + 'icon;fontSize=8;fontColor=#ffffff;buttonText=;whiteSpace=wrap;align=center;', 
					sizeX * 0.2, sizeY * 0.09, 'Icon', 'Icon', null, null, this.getTagsForStencil(gn, 'icon', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'loading_circle;', 
					sizeX * 0.2, sizeY * 0.1, '', 'Loading Circle', null, null, this.getTagsForStencil(gnm, 'loading_circle', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'circle;strokeColor=#222222;fillColor=none;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Circle', null, null, this.getTagsForStencil(gnm, 'circle', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					s + 'pageControl;fillColor=#222222;strokeColor=#aaaaaa;sketch=0;', 
					sizeX * 0.25, sizeY * 0.0125, '', 'Page control', null, null, this.getTagsForStencil(gn, 'pageControl', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'current_location;strokeColor=#ffffff;fillColor=#0080F0;sketch=0;', 
					sizeX * 0.3, sizeY * 0.15, '', 'Current Location', null, null, this.getTagsForStencil(gnm, 'current_location', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'expand;fillColor=#c0c0c0;', 
					sizeX * 0.12, sizeY * 0.015, '', 'Expand', null, null, this.getTagsForStencil(gnm, 'expand', dt + '').join(' ')),
			this.addDataEntry(dt + 'volume control', 160, 14, 'Volume Control',
				'zVVNb8IwDP01PVKFFgrXAYPLJiHtsOMUWkOjpXWVhK/9+rlN+Bgto0KbtkqV4me7dt5zUi8cZ7uZ4kX6jAlIL3z0wrFCNHaV7cYgpRcwkXjhxAsCRq8XTK94u5WXFVxBbtokBDZhw+UaLGIBbfbSATrlRblUENMnR9oofIcxSlQE5piTb7QUUl5Aki9AzlELIzAnOKaOgPyjDSgjYi6fLgIWaAxmFMClWDVmPDiHwYJQ1zn5YHd19xXktj4DzMCoPYVsRWJSFxFZhlgKYpUe0noW49raq2PqiUtaODqbqQ3bU5vtVuUE+AL1wM+Ejv0NynUGbwlu8wt6vSCMqueaFqnJqKVJty1FQTNFezc+ft+mnFEW1QkbWkiB5EZs4EuxJhJdvTkKauNYrHNBOy6XGkyN9GOXrXTo/YAO6+KPVPia8I0mh4ltmuJ7VXHFO4fvHFQa/IJK/dsqnVFqKX9126+QlNNhIYORkXCdQuKMJnHXwtdSJNXtsuCKbiEKiFhNTJKZRUM2pX2NsOCxMCUHXcbq4zCtnlJ5nicSXsRHWZSo+y9X4Y0JG9ZHqttw0O+4Gck8/dDsaJz/7z4B'),

			this.addEntry('picker', function()
			{
				var cell = new mxCell('', new mxGeometry(0, 0, 175, 160),
			    	'swimlane;shape=mxgraph.bootstrap.anchor;strokeColor=none;fillColor=none;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=0;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;whiteSpace=wrap;html=1;');
				cell.vertex = true;
				var field1 = new mxCell('Item 1', new mxGeometry(0, 0, 175, 32),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=#A0A0A0;spacingLeft=5;dropTarget=0;fontSize=15;');
				field1.vertex = true;
				cell.insert(field1);
				var field2 = new mxCell('Item 2', new mxGeometry(0, 0, 175, 32),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=#A0A0A0;spacingLeft=5;dropTarget=0;fontSize=15;');
				field2.vertex = true;
				cell.insert(field2);
				var field3 = new mxCell('Item 3', new mxGeometry(0, 0, 172, 32),
					'text;shape=mxgraph.ios7ui.horLines;strokeColor=#A0A0A0;align=center;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=#222222;spacingLeft=5;dropTarget=0;fontSize=15;strokeWidth=2;');
				field3.vertex = true;
				cell.insert(field3);
				var field4 = new mxCell('Item 4', new mxGeometry(0, 0, 175, 32),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=#A0A0A0;spacingLeft=5;dropTarget=0;fontSize=15;');
				field4.vertex = true;
				cell.insert(field4);
				var field5 = new mxCell('Item 5', new mxGeometry(0, 0, 175, 32),
					'text;strokeColor=inherit;align=center;verticalAlign=middle;overflow=visible;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;rotatable=0;whiteSpace=wrap;html=1;fillColor=inherit;fontColor=#A0A0A0;spacingLeft=5;dropTarget=0;fontSize=15;');
				field5.vertex = true;
				cell.insert(field5);
				
				return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Picker');
			})
						    
		];

		this.addPalette('ios7ui', 'iOS UI', false, mxUtils.bind(this, function(content)
				{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
		
		this.setCurrentSearchEntryLibrary();
	};
	
})();

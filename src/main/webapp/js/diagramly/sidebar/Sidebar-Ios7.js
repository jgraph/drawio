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
				'7ZZbi6MwFMc/jY8jXufy2NoLCzswdBf2OejRhIlGYuzY/fR7orGtl9I+TAcWRqjk/M+J/1x+plp+lDdbSUr6KhLglr+2/EgKobpW3kTAueU5LLH8leV5Dv4sb3Mh67ZZpyQSCnVLB6/rsCe8hk7phEoduBGoynFYK9fyl5WS4h3+sETRXqEkER8YOBgkpKKQmAAzpX5C3mR6djYT1VPNbFKWSyIxnzLOI8GFbF38tL1Qx+qE4ej7XCEK0I97BxVT82xKYlpL2JIShQCFUrBCgVzvsWNlilJRqA3JGT+gsJAxZQpizHrOitQZxXJT9EvUMtZDpUqVmA/9Bd5wyfRNF1R2JkTGgZSssmORt4m4aks3aWeBzYFJ6C3HNuyvNvH02Myqg1TQXNy5VjLbtgWRg5Lo43yY5dcVT2HXjQJDKyMajVRdnB27njjAhkFhHgt/gkW02O1+rHcTOvptljhtnBjhLCsw5JCq4byf9SaWJGZF9rNNrrxgWNGHZ1SQ9jqSN2LiHKEek87ht+jJ+L+5uYkTb56Tg3n/bcPDGTehM4ON2XMJnCi2h4HdHEvG8U0v4cnu4dEe8SfStAI1oe840puADCZAunj8LMLw7fUakiMGvwn7NMKaEWFfTJyxf/Cdgf2dCAwnBL48W716/UCU3bwvnIg7syruy7Dk8RvYOwDrXsU1mPtf/SRcg/AOuGJ4+mjsys+/Kf8B'),
			this.addDataEntry(dt + 'app bar landscape', 280, 15, 'App Bar (landscape)',
				'7ZZbi6MwFMc/jY8jGuts57F3FnZg6C7sc9CjCRNNiLHT7qffExPb2gvtw3RhYYRKzi3/JOfXYJDMqu1KU8VeZQ4iSBZBMtNSGjeqtjMQIiARz4NkHhAS4S8gyyvRuItGimqozT0FxBVsqGjBeZyjMTvhHcxUuKx5HCTTxmj5Dr95bljvYTSXH2hEaOS0YZB7AyPKzlBtS7u7kMvmW8tDqtSUaowXXIiZFFJ3KknRPejH7Jzj6vtYLWuw072DyZifm9GMtRpWVKFjhA4leW1ALzZY2PikQtZmSSsuduiY6IxxAxlGSTSnbckw3Sf9lK3O7FKZMQrjaTLBFx6ZfdmEJiylLAVQxZswk1UXyJoudVk4CRwORFIyPZXhf6wIsWvzpw7awPZq5zqXb9sKZAVGo0704Y/fdm/suhsx4Cjly1Lno42zy33pgQMceBQuY5GcYTGbrNffF+szOvo2a9w2bowKXtZoCijMcN9j20RFM16XP7rgnIyGGb15RAXtnj15J0wcI9Rj4hR+yZ6M/5ubuzghlznZ+f9/6Hk44ia9hI3vuQZBDd/AQO4SS17xzR7hQe7pOTzhTxZFA+aMvv1K7wJydAZkjNfPJE3fXm8hecLgF2GfRtj2hLB/TJyXfyJD+QcRmJ4R+DIOeu/tC1G7fV+5Edf+VOKXYcrzF7APADa+iesofRyuo0fgiubho9GlH39T/gU='),
			
			this.createVertexTemplateEntry(
					s + 'slider;barPos=20;strokeColor=#0080f0;strokeColor2=#a0a0a0;', 
					sizeX * 0.75, sizeY * 0.0375, '', 'Slider', null, null, this.getTagsForStencil(gn, dt + 'slider', null).join(' ')),
			this.createVertexTemplateEntry(
					s2 + 'downloadBar;verticalAlign=middle;fontSize=8;buttonText=;barPos=30;fillColor=#aaaaaa;strokeColor=#0080f0;align=center;', 
					sizeX * 0.75, sizeY * 0.075, 'Downloading 2 of 6\n\n', 'Download bar', null, null, this.getTagsForStencil(gn, 'downloadBar', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'adjust;gradientColor=none;sketch=0;', 
					sizeX * 0.4, sizeY * 0.05, '', 'Adjust', null, null, this.getTagsForStencil(gn, 'adjust', dt + '').join(' ')),
					
			this.addEntry(dt + 'horizontal button bar', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 12.5), s2 + 'rrect;rSize=3;strokeColor=#0080F0;gradientColor=none;');
				bg.vertex = true;
				var button1 = new mxCell('Item 1', new mxGeometry(0, 0, 41, 12.5), inh + s2 + 'leftButton;rSize=3;fontSize=8;');
				button1.vertex = true;
				bg.insert(button1);
				var button3 = new mxCell('Item 3', new mxGeometry(82, 0, 41, 12.5), inh + s2 + 'rrect;rSize=0;fontSize=8;');
				button3.vertex = true;
				bg.insert(button3);
				var button4 = new mxCell('Item 4', new mxGeometry(123, 0, 41, 12.5), inh + s2 + 'rightButton;rSize=3;fontSize=8;');
				button4.vertex = true;
				bg.insert(button4);
				var button2 = new mxCell('Item 2', new mxGeometry(41, 0, 41, 12.5), s2 + 'rrect;rSize=0;strokeColor=#0080F0;fillColor=#0080F0;fontColor=#ffffff;fontSize=8;');
				button2.vertex = true;
				bg.insert(button2);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Horizontal button bar');
			}),				
				
			this.addDataEntry(dt + 'select bar', sizeX * 0.825, sizeY * 0.0675, 'Select Bar',
				'7VXLbtswEPwaXQ2ZiuOzH7FzCVAgh54JaSUSoUyBXDlKv767JBVbsd0GKdBDUQESlrNP7gygrNi0w97JTj3ZCkxWPGTFxlmL0WqHDRiTiVxXWbHNhMjpzcTuhncevHknHRzwMwkiJhyl6SEiEfD4ZhKgsKWxtvOsWHt09gW+6woVIYIRJSv7SoecDpX0Cqp0IE/HFdqh4dvNtPXLXs88GChxLR3HD1xXhNQ3MhcBo7LbJZte/4CExsYba6wLQxV1eMhTa2POcBEewqlppWkJo+9gD8CFXgBLlUZUslS9g73sCLgjoLP6gOAejpToU1BtD7iTrTY84cqVSiNdwNOOtrJvFIWnoGfbu5IHVogd+RfFij60ef5wgJ811jYGZKf9rLRtcJQ+hO7q2ILMSZOFWH9sE7cStpbIA4cw3BRAgBL7e7AtoKM++WtikSPuFzFNgaZWSRnLiEkfz8176klOZCRFXVdXcaGu50D/hcZGsTh2TkkdiZsoIIG8j6uiOO1pLj5y+AjmCKhLyYSD03QrOKvpgHX3OG5i/mXR/AU9fIp/8Vv+l7+g34GRqI8wKf8nmri7qYl8xYH/lfGvKSN1+MbboJBhWnrMsHXtAS+U9D7XNXHR8fSrjOHnf9Kf'),
			this.addDataEntry(dt + 'select bar', sizeX * 0.825, sizeY * 0.0675, 'Select Bar',
				'7ZZLb5wwEMc/DdcVmJCc95HdXCJFyqFnCwZsxWBkDxvST9/xg+xSsupWqXpogwSy//OyZ34HknzbjgfDe/GoK1BJfp/kW6M1hlU7bkGphKWySvJdwlhKb8L2F6yZt6Y9N9DhNQEsBBy5GiAoQbD4pqIgsKVj7bIk31g0+gW+yQoFKcwpglf6lTYpbSpuBVRxQ5beZWjHxt1uJbW9G+TKgoISN9w4/9HlZT70jZaF15hb+QzyO0Q1FN5qpY0/VF77hyy1VOpMZ/4hnYpWkpow2TrdgUv0AliKeETBSzEYOPCehBsSei07BHN/pEAbnWrd4Z63UrkTrk0pJNIFLPVox4dGkHt0etaDKd2BBWJP9iJf04c67z7Owa4arRsFvJd2VerWG0rrXfd1KEHLWZGCbX4uE7riuxaHBwZhvAiAl+L0D6BbQEN10tc4RedxW4QwAZJKRTLugsZt2DfvoSecaBGJ+piufEHXsx//grEJFuOM86FOg5sREEXXjw+hOPUpW8zwAdQRUJbcDRyMpFvBWU4DjruHqRPZOTTZ70DzF3i4av7sl/Mv0svjN6A4yiPM0n+GiZuLTKRr5/hFxr9GRqzw5LpBLuM89RSh69oCLkh6P9dVcBULuJ64Rfii6n+hKkv/AFa0Pf2BBffzH7Qf'),
					
			this.addEntry(dt + 'labels', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 20), 'shape=rect;fillColor=#F6F6F8;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Label', new mxGeometry(55, 0, 54, 20), 'text;fontSize=10;verticalAlign=middle;align=center;spacingTop=2;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('Label', new mxGeometry(109, 0, 55, 20), 'text;fontColor=#0080f0;fontSize=10;verticalAlign=middle;align=right;spacingTop=2;spacingRight=4;');
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
			   	var icon1 = new mxCell('Search', new mxGeometry(0.5, 0.5, 6, 6), 'shape=mxgraph.ios7.icons.looking_glass;strokeColor=#e0e0e0;fillColor=none;fontColor=#e0e0e0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;fontSize=6;fontStyle=0;spacingTop=2;sketch=0;');
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
			   	var icon1 = new mxCell('Search', new mxGeometry(0.5, 0.5, 6, 6), 'shape=mxgraph.ios7.icons.looking_glass;strokeColor=#878789;fillColor=none;fontColor=#878789;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;fontSize=6;fontStyle=0;spacingTop=2;sketch=0;');
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
				'7VZNc4IwEP01HOuERNSzUL3UmU576DlKgEwDYUL86q/vQoKi2Err0F7UcWb3ZXez2ffMxCF+upsrmicLGTLhkEeH+EpKbax05zMhHIx46JDAwRjBz8GzL1bdahXlVLFMd0nAJmFDxZoZxACF3gsLFAnNS1OxFZScqlf+UboE7EIr+c58KaQCJJMZLEwjLkQNOZgEOCCBB3isaMihrbNwKB/KLfgIHNsNU5rtvjxRBdnjzJlMmVZ7CNnyUCc2YjQ0aQnjcVKnuZ4BaWGA+JB7HBAYdkaX50Va83qiS6DtfGiJTqFE4B6G9Ga7c8+PHNIiYaF16lmnu7iUxIDLYrzmAy3z6VprmX07/+awI5lpGzhpczJzy68Na+AITdCs7EOxApKbPXdiBl9nxrvAjNUoUkxQzTfspP4ltuwWz5LDzhjZhiy9+xOvTpdRVDDdovrQZSf2hx3ZP/vLtMRwZ+wSY71Q5t0p65GyYR+Ujf7ljl1KuGDT+zX7QwWM+lDAuKUAn2ar3iWQUhXz7MW+c8rjlhyXTRsDFhZViAV+q4uo+vyZLvYnCdeeSeRGldjdHuo6twgD3ONT2IQ3X8qf'),
				
			this.addDataEntry(dt + 'action sheet', 164, 115, 'Action Sheet',
				'7VhRj6IwEP41PK4BqoiPKyz7suY2t5fc46ULFZotlLR11fv1N5XiouCK52ruEjWadjpTynzfN0OwUJCvHgUusxlPCLPQg4UCwbmqRvkqIIxZrk0TC4WW69rws9zowKqzWbVLLEih+gS4VcA7ZgtSWSqDVGtmDDLDpR4KEsOWU/FCf+spgrFUgr+RgDMuwFLwAhamc8pYbbJcFLohCkdgTwVOKBxrzx22T/gS5jZMzGmIUGR18I42JnM7j4TnRIk1uCxpojLj4Q2rsIzQNKvDnFFlxLIypNvYjwTBwOSoO1/oeL4ylUN06Gzz89MczNm/2wTLjCRmUqc5X6WaDQPK5XhBB4qX04VSvPg09c08z3mhjKPfhiNy9Ne4Ney27duRPocgEoKbZ+4FinsclFEHKMOKnrYgDCv6Tnb27wLKXOKZU7iya5sDGWTXO7M6nM/nkqgWyttT9gJ+2AJ+RqTEKTmqF74okg3KzkHFfCA2aiPm+dHYR12I6U+HsPTaaOo5cB9TjRqNMbtnNAUKhUAnsDL8Stgzl1RRTawwhmgiGu5Pew6vHCiYgwM2+2wjZIljWqQ/9L7h3bAvXVA3XQyA9sBA2KBPrbQme2rbl7Lnbr9OfAl/Rv0LbV0BXrGk8YBDyC+AhPGF6lly55tPXyiG3VCsdhrEeqf8NVXtd1Ra7/xC67X1him7uNiciWc/BKeJzYnCIIpuYusnNjS+gtrGp6tN99sBjXkhB7lmWkeLdd3JJELn6s37VG9oJzteW29eh97s8/XmX/vBpmL57dnmxO40vIRcJi3wv5Wk0A76774sL153txI6VHevXFvHYFlmVJEXMOszL4G7ffni/0v19hoPN3UBahPoiRZvN/L8t+S5SrN2nBZ7AlzE5PDT3l4rybFIafHdsGlluoi+fDWAhdnGxdDnb/vLYZ5dpL+sdwKOvd5AZ3abGmJknw8xTD9eYVXuzTdcfwA='),
			this.addDataEntry(dt + 'cell list', 164, 120, 'Cell List',
				'7ZlNb6MwEIZ/DcdGtgmEHBtSeulKK3WlPbPBgLUGI0PbpL9+HWyaD2BlWlxVBUuR7MEz2O+YRxmwbD/b3/OwSH+wCFPLvrNsnzNWyV629zGlFgIksuythRAQPwsFPVdhfRUUIcd5peOApMNzSJ+wtEhDWR2oMpRpWBy7HO9EyE1ZcfYX+4wyLow5y8W1TUwobUwWsuO6CXvCw4iIpVxNFyEj9iLGQAzUCjCv8L53F7VJbeEeswxX/CCmvJCoStUMdyndUkyStHFT2wdhKQ3Jm+9JFNFRunRrZLc0egj/iFS9SyiWV4/k9TgNAjU+Ew7UTdg5LsWs32p7UFhCSpJc9CmO6+hFuCN58lCPtsg5mX6x4mjRVRa9T9lGWI5pWJFnfBH/I2ovB59Izp7yCEdKJ67ktTXPahCsHQB11bK71TqoZ23hSJdz9ZyOY+kMFE/d8ScjYiEIqPWpKOrmN6vm7k0EFsclrlriv61bKx+Ofj6yfXIE2YKwcrXISLlbcLnnq0QI1d26fVD1S4f/5KArBUPPb3cKbuBVEkykwJ0BNAKArhJ4uAwzasJWn84we3Ncrp7g7uQY5n0BhvWoPhWGrWeGGWPY0gTDmsP1aRBb+ttbIZKm4uvJQQzCL0CxHtmnQjHYrpdnjI2FMdcIxtrVu1mMAbC6DbT/i8Eeyb8zxwZU+MY41qf7ZEDWLutnkI0FMs8IyNpvAcyCzPEcZ6v/QDnTA9mAMt8cyHp0nwzI2rX9DLKxQAaBEZK13wWYJZkXeHdr7cpSnqhJkQwNqPXNkaxH929KMjE8feaV08+/Av8D'),
			this.addDataEntry(dt + 'cell list', 164, 60, 'Cell List',
				'7Vddb4IwFP01PGr4dnucuvniErMt2XMnBZoVStpOZb9+F1pRQCPqfJImJL3nfrXn9D5gOJNkM+Moi19ZgKnhPBvOhDMm1S7ZTDClhm2SwHCmhm2b8Bn2yxGvVXrNDHGcyi4JtkpYIfqDFaIAIXOqARGjrNhyvISSYyE5+8YTRhkHMGUp+MYhoXQLGbYTlgvwiKOAwFEa4VAyYGuwTTD0CTCXeHP0FiWkrzDDLMGS5xCyJoGMdYTvqrQYkyjWab66vYmEsqMqdccJbDQthylyWhTN0RcodRFPLJXv5LcIs0xt7/FmlgtwjgVEferbWYAgSqIU9hSHZfUMLUkafbAMMHsHzEv31OvKq30Zr/pVmRxTJMkK1+pfQ7Z7JtnJJipmZ0iYGA0TIpZDrk7Z4B/I9csFHlpUXDBBJGF7lBZMkSWi84Y7IUFQtK0k2HbYJjxpvApsqqy1edP8uW3hH8vVVTTnsGj1hFyP/9BT9p6kXltQ61xBdfsFI3CqqvfA8mrdB169AgtDgWXrQVSX6PRGvH4grx/Ihn55vcy/6uX3M31ad+++Z3rUz/StZtq9xUw/9DN9WvfRXc00mLv/FhW+/1vzBw=='),
			this.addDataEntry(dt + 'message', 164, 35, 'Message',
				'7ZfbjpswEIafhssiAiHZXuawiSptpajtzV66MIAbgy3b5NCn7xhMskDYRNqm1aolwmF+j+1h5sMIJ1jkh7UkIvvMY2BO8OgEC8m5rq/ywwIYc3yPxk6wdHzfw9PxVwO9o6rXE0RCoW8Z4NcDdoSVUCu1oPSRWUFlRJhLCRFOOVda8i0sOOMSxYIX2DdPKGON5PhBUh2op5LEFEPpuOOUMd+j7RljCzrK0BihkZEoKyWsiUBhjILgtNAgH3c4i7IjEl7oFckpO6Iwk1FGNcamMOwlKdMM3a3TV17KyMSeaS2wPwxm2GAyTGMclJtynjIggio34nnVEanKdZXUS+Bla5HQn3eXoT/NIr6JzeYTpIbDYE0qyRZkDTwHLXEdb09jnVmPybgelgHFpWoxCGuNqNpOT0PPFcYLW+TLBQ96Bd+AuRPfW2MNQQ2WH6ehQsGNBHjedLV6aOenMVtu5kCdMJoWqDFIKsgEiWiRfuPCcmGFp6p7icmbM/Id2IYrqik3I2Wdp7lJPY0Ie+r05zSOzT2dHGZ2yVPHCUTvPYJ4E3j+dfC8PneNJoERTXfQmv4SjHaFjUkZuth4LL3HltUM50miQPdIPgV5E9zjHtwmmNk4HKQ6P6Rm73UpV1M3pypyG47alCOrk+q4QJ5l9ip4DeNdUnsgdp4Zy/4XW5Bx/zH6WB3vfi99C8LtAS+ADu/G84fR/YkOe0R/QvNHqUwcKTctwbOAPbaJxHdtPMg6ZnXwBd7Zf29Bc9rblkfTV3b41pbu/9OsXnvPv5VPy+PoHkBOekA+8xKFbcENgobOPcHKxZbMmKcu/j2DwrzF5Gh9zuiKUgijuq77p8id3ETug2d+/8n9C+T+jq0UzfNnVO3+8ivrFw=='),
			this.addDataEntry(dt + 'message', 164, 100, 'Message',
				'7VffT9swEP5r8rjKcfoDHtvSwMOQJkDas5dcYg8njmyHlv31O8cuNISyiIHENCI1sj/f+c6+73OdKFlXu3PNGn6pcpBRsomStVbK+la1W4OUESUij5KziFKCv4imR0bjbpQ0TENtxzhQ73DHZAse8YCx9zIAhrPGNTVkOOXKWK1uYa2k0gjWqsaxVSGk3EMRTYruQbzULBeYyhNznDJXW+wT17kFm3HsxNjhLOOthnPWIDBFoFGitqA3dziLCR6Fqm3KKiHvEVjqjAuLuRlM+4y1JUfzYHStWp253Lm1DY7PkiW+cDPcyxmYSalUKYE1wkwyVXUDmelM08KHwGYvyIyunoYRv1wQ6nIL+wnawu5oTTooFOQcVAVWYxyyFbnlwWI+9W4cBIYKIPHFJMx4oHzwfSwxNkKVn694Mqj4NbOtzpnLIMYlLGM3vrw8SgRcmSMCk6KssZtB7bfCLVpkTC7DQCXyXEJ/j2ahe0CW0+4Zw6w9exqWibq8UY4jCQIaDM7+Pexe/M9zahSH6Gs55DENkllxB735n+NVCPHN7dmBiSoKA3ZAvIdMRnFxOuDiBbhFVKyOKHqTUnUxHQ8hi5J0wEluK7mveUefHgsOj5mcGQ75/swJVK52pTt6J0KZRSsmSF6p2rGn3GaxmW/WB0qQUNiROlg88vhr53UWL4bSIN3zlPJYk9XWUecaUTfZVjtqvyQD8h/L4JQMVUD/UgUhn5l3uA/us77/m0hkNpSIwP6NqLxCVIGvDIthwAM/W+MyLN2qUEkQ9IMmjewQUbcWXEWtwlchamE4Nn5oYLcFM3byoURG5ickTR0uRXMRYv5BcNbJ5GW10aHYHi4tPbF9Oaa2YHUVSBXTTwX2FBgcyCQJFD78ZyLPaHJv91pNBhVOyTuocD5Q4RWwHJFUi+7mNO6qpP1qP29KH4Gg731TCnw8eQM+Yvfxk9CbH34x/gY='),

			this.addEntry(dt + 'alert', function()
			{
				var bg = new mxCell("A dialog text that notifies you of something of which you don't need to make a decision, just to acknowledge it by pressing the close button.", 
						new mxGeometry(0, 0, 120, 70), 'shape=rect;rounded=1;strokeColor=none;fillColor=#F6F6F8;gradientColor=none;shadow=0;glass=0;dashed=1;fontFamily=Helvetica;fontSize=7;fontColor=#333333;align=center;html=0;verticalAlign=top;whiteSpace=wrap;spacing=8;spacingTop=0;');
				bg.vertex = true;
				var text1 = new mxCell('Close', new mxGeometry(0, 1, 120, 20), 'shape=text;align=center;verticalAlign=middle;fontSize=8;fontColor=#0680FF;strokeColor=none;fillColor=none;spacingTop=3;resizeWidth=1;');
				text1.geometry.relative = true;
				text1.geometry.offset = new mxPoint(0, -20);
				text1.vertex = true;
				bg.insert(text1);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Alert');
			}),
			this.addDataEntry(dt + 'dialog', 120, 70, 'Dialog',
				'5ZZNb9pAEIZ/jY+JjN0SroHW6aVSpVTqeeUde0dZ71rr4cP99Z3FAwFiNyhtDlVB4J3vwc+L5CRfNbuHoFrz1WuwSf45yVfBexpOzW4F1iZZijrJPyVZlvInyYqJ6GwfTVsVwNE1BdlQsFF2DYPnnk2NyvqaD4RkYUjpqLeS0hnVxmOAkocsg187DbHhjK2Ogn+Clbc+sMd5x5nLCq09uJIsL+b8XrC/Dkojr3qRzgO037Kdxhyruk7OWnXmOKnyjgrVoO3Z8QXsBghLJYFH/BlXXIh5Mnx4sV9ZrB37Sl4AOLg01FgZtIEQm9l7ySHfsndrkOCxVWVsvWVocVc20dUyS6zvMX3fSO4vt4PdJKO9SwA9gG+AQs8pW9RkJEM4pgawNlJ2Jz7VDXZ9LH0mzgeBPi6A/BUBwI7ixah4cZ6wQuj42Ps1f/sqKiNONfEe8CpOH4MOIBrkY0MoUUP8TQZLExNLQu8OYVJPcDups/0SI7wuITWotYVzAdz9RgCvSvUgx1OoNxFzgI7b/xA+swlpXMU+exv7XHwBrCLcwFn/MUHIiG8eXUTZy/QLCfmq6oBeCOi42FWa+vBSUwfas3eBPPIvT+eLtCjeCjkfZfwnPPuzghO68xG42d+Be/MudD9O083+V7pSkN7KzflnabP5/PAxpJ8+m/wC'),

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
		   			s2 + 'url;fillColor=#e0e0e0;strokeColor=#c0c0c0;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;spacingTop=2;align=center;',
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
				'vVVdb8IgFP01fbTBVqvPuunTEpM97HFhchUyWhqgWvfrd1to/WjdjHEjacI9cLmcc4AG8Twtl5rm/EUxkEH8HMRzrZR1vbScg5RBRAQL4qcgigh+QbS4MjqsR0lONWT2loTIJeyoLMAhDjD2ID1gOM2rroY1LjkzVqtPmCupNIKZynBsthFSXkB+YdAWyqubqyG/syWoFKw+4JS9YJb7GYkjQDiILW/SRg6jxsXbNvVIFTuebT/z+HbmabmtDAqFMpMwFWYd7pQsUnhnap9dsA+iOKnbNalu0iXq1+XgLQ3HLuVEp6Sr0tRBGiS1YgdnxfqU8/VWSuA22mKDC63VZmPAdpRud3mT+KMHiF/k/yn9ecIPRjRns++83muFLz5o1mmsmfyBNePfreE2xeynYavzm6dfI5zitcCAYMCo4cB80OdoIUIjBQN0afZB9UpVVBLScRC9JcmULJDXTOV0LWylwZCQ7hlY1A1xTjMm4VV8VUVRusccgGnX8WHP5bvjicLw+PA7507/C98='),
			this.addDataEntry(dt + 'picker', 175, 160, 'Picker',
				'7ZZta8IwEMc/Td5Km9i6vV3dZLDBYC/2OqxXE5Y2kkSt+/S7mtQHtEx8gg0Vofe/u9z1/6tQwrKyHhk+Ea86B0XYI2GZ0dr5q7LOQClCI5kTNiSURvgj9KkjGy+z0YQbqNwhDdQ3zLiagle8YN1CBUG4EtcaxoQ9WGf0F3zI3IlWETzXcwwiDHJuBeQhwMykOaGsx83d9aS2g6ns8epTaIP5MBiMg7pz+aUUNh+BLsGZBZbMwwZNxSDxbQLkWLRtqb/riFsvjFe9ay/wItix3xq2Y82zgxKV+FoWFbpy7/K7KYmTEGdaNTmcynjUfFE3YLFqc+ZB5tLjzGXhETGguJMz2Dr/FMP7XYZf7Zn8J4aHEW9a4mQaLbaPaTt0UVhwO4BWix3ELOlixi7MDIG9yArs79To8rOauo9nIZVq9UpXsLMi/avQ0/4FoKdd0Pu3P+oZmN2nF2A26GKW3JidgVlM706HhuH6zc+Xb74Y/gA=')
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

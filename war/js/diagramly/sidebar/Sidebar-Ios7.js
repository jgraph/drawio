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
		
		var s = 'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;strokeWidth=2;strokeColor=#0080F0;fillColor=#ffffff;shadow=0;dashed=0;shape=mxgraph.ios7.icons.'
		var gn = 'mxgraph.ios7.icons';
		
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
			this.createVertexTemplateEntry(s + 'bluetooth;', 50 * sc, 96 * sc, '', 'Bluetooth', null, null, this.getTagsForStencil(gn, 'bluetooth', dt).join(' ')),
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
//			this.createVertexTemplateEntry(s + 'dunno4;', 100 * sc, 85 * sc, '', 'Dunno4', null, null, this.getTagsForStencil(gn, 'dunno4', dt).join(' ')),
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
			this.createVertexTemplateEntry(s + 'magnet;', 80 * sc, 100 * sc, '', 'Magnet', null, null, this.getTagsForStencil(gn, 'magnet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mail;', 100 * sc, 55 * sc, '', 'Mail', null, null, this.getTagsForStencil(gn, 'mail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'map;', 100 * sc, 100 * sc, '', 'Map', null, null, this.getTagsForStencil(gn, 'map', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'message;', 100 * sc, 65 * sc, '', 'Message', null, null, this.getTagsForStencil(gn, 'message', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'messages;', 100 * sc, 85 * sc, '', 'Messages', null, null, this.getTagsForStencil(gn, 'messages', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'microphone;', 40 * sc, 100 * sc, '', 'Microphone', null, null, this.getTagsForStencil(gn, 'microphone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'monitor;', 100 * sc, 65 * sc, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'moon;', 98 * sc, 98 * sc, '', 'Moon', null, null, this.getTagsForStencil(gn, 'moon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'most_viewed;', 94 * sc, 76 * sc, '', 'Most Viewed', null, null, this.getTagsForStencil(gn, 'most_viewed', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'move_to_folder;', 100 * sc, 75 * sc, '', 'Move to Folder', null, null, this.getTagsForStencil(gn, 'move_to_folder', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'note;', 99 * sc, 99 * sc, '', 'Note', null, null, this.getTagsForStencil(gn, 'note', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'options;', 100 * sc, 50 * sc, '', 'Options', null, null, this.getTagsForStencil(gn, 'options', dt).join(' ')),
			this.createVertexTemplateEntry('html=1;verticalLabelPosition=bottom;strokeWidth=2;strokeColor=#0080F0;fillColor=#0080F0;shadow=0;dashed=0;shape=mxgraph.ios7.icons.orientation_lock;', 77 * sc, 70 * sc, '', 'Orientation Lock', null, null, this.getTagsForStencil(gn, 'orientation_lock', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'page_navigation;', 100 * sc, 16 * sc, '', 'Page Navigation', null, null, this.getTagsForStencil(gn, 'page_navigation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'paint;', 100 * sc, 85 * sc, '', 'Paint', null, null, this.getTagsForStencil(gn, 'paint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pause;', 50 * sc, 80 * sc, '', 'Pause', null, null, this.getTagsForStencil(gn, 'pause', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pen;', 98 * sc, 99 * sc, '', 'Pen', null, null, this.getTagsForStencil(gn, 'pen', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pie_chart;', 100 * sc, 100 * sc, '', 'Pie Chart', null, null, this.getTagsForStencil(gn, 'pie_chart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'play;', 70 * sc, 80 * sc, '', 'Play', null, null, this.getTagsForStencil(gn, 'play', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pointer;', 100 * sc, 100 * sc, '', 'Pointer', null, null, this.getTagsForStencil(gn, 'pointer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'preferences;', 100 * sc, 80 * sc, '', 'Preferences', null, null, this.getTagsForStencil(gn, 'preferences', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'printer;', 100 * sc, 85 * sc, '', 'Printer', null, null, this.getTagsForStencil(gn, 'printer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'privacy;', 56 * sc, 95 * sc, '', 'Privacy', null, null, this.getTagsForStencil(gn, 'privacy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'radio;', 100 * sc, 75 * sc, '', 'Radio', null, null, this.getTagsForStencil(gn, 'radio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'reload;', 80 * sc, 90 * sc, '', 'Reload', null, null, this.getTagsForStencil(gn, 'reload', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'repeat;', 100 * sc, 80 * sc, '', 'Repeat', null, null, this.getTagsForStencil(gn, 'repeat', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'retry;', 92 * sc, 48 * sc, '', 'Retry', null, null, this.getTagsForStencil(gn, 'retry', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'select;', 100 * sc, 100 * sc, '', 'Select', null, null, this.getTagsForStencil(gn, 'select', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'settings;', 100 * sc, 100 * sc, '', 'Settings', null, null, this.getTagsForStencil(gn, 'settings', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'share;', 70 * sc, 95 * sc, '', 'Share', null, null, this.getTagsForStencil(gn, 'share', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'shopping_cart;', 100 * sc, 85 * sc, '', 'Shopping Cart', null, null, this.getTagsForStencil(gn, 'shopping_cart', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'shuffle;', 100 * sc, 70 * sc, '', 'Shuffle', null, null, this.getTagsForStencil(gn, 'shuffle', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'silent;', 100 * sc, 100 * sc, '', 'Silent', null, null, this.getTagsForStencil(gn, 'silent', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'smartphone;', 60 * sc, 100 * sc, '', 'Smartphone', null, null, this.getTagsForStencil(gn, 'smartphone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'star;', 100 * sc, 90 * sc, '', 'Star', null, null, this.getTagsForStencil(gn, 'star', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'stopwatch;', 90 * sc, 94 * sc, '', 'Stopwatch', null, null, this.getTagsForStencil(gn, 'stopwatch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage;', 100 * sc, 35 * sc, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sun;', 100 * sc, 100 * sc, '', 'Sun', null, null, this.getTagsForStencil(gn, 'sun', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tape;', 100 * sc, 40 * sc, '', 'Tape', null, null, this.getTagsForStencil(gn, 'tape', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tools;', 99 * sc, 99 * sc, '', 'Tools', null, null, this.getTagsForStencil(gn, 'tools', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'trashcan;', 80 * sc, 100 * sc, '', 'Trashcan', null, null, this.getTagsForStencil(gn, 'trashcan', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'trophy;', 95 * sc, 100 * sc, '', 'Trophy', null, null, this.getTagsForStencil(gn, 'trophy', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'umbrella;', 100 * sc, 100 * sc, '', 'Umbrella', null, null, this.getTagsForStencil(gn, 'umbrella', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'unlocked;', 80 * sc, 100 * sc, '', 'Unlocked', null, null, this.getTagsForStencil(gn, 'unlocked', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'up;', 70 * sc, 85 * sc, '', 'Up', null, null, this.getTagsForStencil(gn, 'up', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'user;', 100 * sc, 100 * sc, '', 'User', null, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'video_conversation;', 100 * sc, 50 * sc, '', 'Video Conversation', null, null, this.getTagsForStencil(gn, 'video_conversation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'volume;', 100 * sc, 100 * sc, '', 'Volume', null, null, this.getTagsForStencil(gn, 'volume', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'volume_2;', 101 * sc, 94 * sc, '', 'Volume', null, null, this.getTagsForStencil(gn, 'volume_2', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wallet;', 100 * sc, 80 * sc, '', 'Wallet', null, null, this.getTagsForStencil(gn, 'wallet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wifi;', 99 * sc, 70 * sc, '', 'WiFi', null, null, this.getTagsForStencil(gn, 'wifi', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'window;', 100 * sc, 100 * sc, '', 'Window', null, null, this.getTagsForStencil(gn, 'window', dt).join(' '))
		]);
		
		var s = 'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7ui.';
		var s2 = 'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7ui.';
		var s3 = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;html=1;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios.';		var sm = 'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=2;shape=mxgraph.ios7.misc.';
		var s4 = 'html=1;strokeWidth=2;shadow=0;dashed=0;shape=mxgraph.ios7ui.';
		var skcl9 = 'strokeColor=#999999;';
		var dt = 'ios ui ';
		var gn = 'mxgraph.ios7ui';
		var gnm = 'mxgraph.ios7.misc';
		
		var fns =
		[
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.iphone;fillColor=#ffffff;strokeColor=#c0c0c0;', 
		 			sizeX, sizeY, '', 'iPhone (Portrait)', null, null, this.getTagsForStencil(gn, 'phone', dt + 'portrait').join(' ')),
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.ipad7inch;fillColor=#ffffff;strokeColor=#c0c0c0;', 
		 			sizeX * 1.83, sizeY * 1.3725, '', "iPad (7'')", null, null, this.getTagsForStencil(gn, 'tablet tab 7', dt + 'portrait').join(' ')),
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.ipad10inch;fillColor=#ffffff;strokeColor=#c0c0c0;', 
		 			sizeX * 2.44, sizeY * 1.7325, '', "iPad (10'')", null, null, this.getTagsForStencil(gn, 'tablet tab 10', dt + 'portrait').join(' ')),
		 	this.createVertexTemplateEntry(
		 			'html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;shadow=0;dashed=0;strokeWidth=1;shape=mxgraph.ios7.misc.ipad13inch;fillColor=#ffffff;strokeColor=#c0c0c0;', 
		 			sizeX * 2.86, sizeY * 2.0325, '', "iPad (13'')", null, null, this.getTagsForStencil(gn, 'tablet tab 10', dt + 'portrait').join(' ')),
			this.addEntry(dt + 'app bar portrait', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 15), s2 + 'appBar;fillColor=#ffffff;gradientColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('CARRIER', new mxGeometry(0, 0.5, 50, 13), 'shape=rect;align=left;fontSize=8;spacingLeft=24;fontSize=4;fontColor=#aaaaaa;strokeColor=none;fillColor=none;spacingTop=4;');
			   	text1.geometry.relative = true;
			   	text1.geometry.offset = new mxPoint(0, -6.5);
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('11:55PM', new mxGeometry(0.5, 0.5, 50, 13), 'shape=rect;fontSize=8;fontColor=#aaaaaa;strokeColor=none;fillColor=none;spacingTop=4;');
			   	text2.geometry.relative = true;
			   	text2.geometry.offset = new mxPoint(-30, -6.5);
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var text3 = new mxCell('98%', new mxGeometry(1, 0.5, 45, 13), 'shape=rect;align=right;fontSize=8;spacingRight=19;fontSize=6;fontColor=#aaaaaa;strokeColor=none;fillColor=none;spacingTop=4;');
			   	text3.geometry.relative = true;
			   	text3.geometry.offset = new mxPoint(-45, -6.5);
			   	text3.vertex = true;
			   	bg.insert(text3);
			   	
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App Bar (Portrait)');
			}),
			this.addEntry(dt + 'app bar landscape', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 280, 15), s2 + 'appBar;fillColor=#ffffff;gradientColor=none;');
				bg.vertex = true;
				var text1 = new mxCell('CARRIER', new mxGeometry(0, 0.5, 50, 13), 'shape=rect;align=left;fontSize=8;spacingLeft=24;fontSize=4;fontColor=#aaaaaa;strokeColor=none;fillColor=none;spacingTop=4;');
				text1.geometry.relative = true;
				text1.geometry.offset = new mxPoint(0, -6.5);
				text1.vertex = true;
				bg.insert(text1);
				var text2 = new mxCell('11:55PM', new mxGeometry(0.5, 0.5, 50, 13), 'shape=rect;fontSize=8;fontColor=#aaaaaa;strokeColor=none;fillColor=none;spacingTop=4;');
				text2.geometry.relative = true;
				text2.geometry.offset = new mxPoint(-25, -6.5);
				text2.vertex = true;
				bg.insert(text2);
				var text3 = new mxCell('98%', new mxGeometry(1, 0.5, 45, 13), 'shape=rect;align=right;fontSize=8;spacingRight=19;fontSize=6;fontColor=#aaaaaa;strokeColor=none;fillColor=none;spacingTop=4;');
				text3.geometry.relative = true;
				text3.geometry.offset = new mxPoint(-45, -6.5);
				text3.vertex = true;
				bg.insert(text3);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'App Bar (landscape)');
			}),
			
			this.createVertexTemplateEntry(
					s + 'slider;barPos=20;strokeColor=#0080f0;fillColor=#ffffff;strokeColor2=#a0a0a0;', 
					sizeX * 0.75, sizeY * 0.0375, '', 'Slider', null, null, this.getTagsForStencil(gn, dt + 'slider', null).join(' ')),
			this.createVertexTemplateEntry(
					s2 + 'downloadBar;verticalAlign=middle;fontSize=8;fontColor=#000000;buttonText=;barPos=30;fillColor=#aaaaaa;strokeColor=#0080f0;align=center;', 
					sizeX * 0.75, sizeY * 0.075, 'Downloading 2 of 6\n\n', 'Download bar', null, null, this.getTagsForStencil(gn, 'downloadBar', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'adjust;fillColor=#ffffff;gradientColor=none;', 
					sizeX * 0.4, sizeY * 0.05, '', 'Adjust', null, null, this.getTagsForStencil(gn, 'adjust', dt + '').join(' ')),
					
			this.addEntry(dt + 'horizontal button bar', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 12.5), s2 + 'rrect;rSize=3;strokeColor=#0080F0;fillColor=#ffffff;gradientColor=none;');
				bg.vertex = true;
				var button1 = new mxCell('Item 1', new mxGeometry(0, 0, 41, 12.5), s2 + 'leftButton;rSize=3;strokeColor=#0080F0;fontSize=8;fillColor=none;');
				button1.vertex = true;
				bg.insert(button1);
				var button2 = new mxCell('Item 2', new mxGeometry(41, 0, 41, 12.5), s2 + 'rrect;rSize=0;strokeColor=#0080F0;fillColor=#0080F0;fontColor=#ffffff;fontSize=8;');
				button2.vertex = true;
				bg.insert(button2);
				var button3 = new mxCell('Item 3', new mxGeometry(82, 0, 41, 12.5), s2 + 'rrect;rSize=0;strokeColor=#0080F0;fontSize=8;fillColor=none;');
				button3.vertex = true;
				bg.insert(button3);
				var button4 = new mxCell('Item 4', new mxGeometry(123, 0, 41, 12.5), s2 + 'rightButton;rSize=3;strokeColor=#0080F0;fontSize=8;fillColor=none;');
				button4.vertex = true;
				bg.insert(button4);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Horizontal button bar');
			}),

			this.addEntry(dt + 'select bar', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, sizeX * 0.825, sizeY * 0.0675), s4 + 'selectBar;dx=120;dy=5;dx2=75;size=5;strokeColor=#ffffff;fillColor=#222222;gradientColor=none;');
				bg.vertex = true;
				var text1 = new mxCell('Select', new mxGeometry(0, 0, sizeX * 0.375, sizeY * 0.0675), 'shape=rect;fillColor=none;strokeColor=none;fontColor=#ffffff;fontSize=12;fontFamily=Helvetica;perimeter=none;resizeHeight=1;');
				text1.geometry.relative = true;
				text1.vertex = true;
				bg.insert(text1);
				var text2 = new mxCell('Select All', new mxGeometry(0, 0, sizeX * 0.375, sizeY * 0.0675), 'shape=rect;fillColor=none;strokeColor=none;fontColor=#ffffff;fontSize=12;fontFamily=Helvetica;perimeter=none;resizeHeight=1;');
				text2.geometry.relative = true;
				text2.geometry.offset = new mxPoint(sizeX * 0.375, 0);
				text2.vertex = true;
				bg.insert(text2);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Select Bar');
			}),
					
					
			this.addEntry(dt + 'select bar', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, sizeX * 0.825, sizeY * 0.0675), s4 + 'selectBar;dx=120;dy=5;dx2=50;size=5;strokeColor=#ffffff;fillColor=#222222;gradientColor=none;');
				bg.vertex = true;
				var text1 = new mxCell('Select', new mxGeometry(0, 0, sizeX * 0.25, sizeY * 0.0675), 'shape=rect;fillColor=none;strokeColor=none;fontColor=#ffffff;fontSize=10;fontFamily=Helvetica;perimeter=none;resizeHeight=1;');
				text1.geometry.relative = true;
				text1.vertex = true;
				bg.insert(text1);
				var text2 = new mxCell('Select All', new mxGeometry(0, 0, sizeX * 0.25, sizeY * 0.0675), 'shape=rect;fillColor=none;strokeColor=none;fontColor=#ffffff;fontSize=10;fontFamily=Helvetica;perimeter=none;resizeHeight=1;');
				text2.geometry.relative = true;
				text2.geometry.offset = new mxPoint(sizeX * 0.25, 0);
				text2.vertex = true;
				bg.insert(text2);
				var text3 = new mxCell('Paste', new mxGeometry(0, 0, sizeX * 0.25, sizeY * 0.0675), 'shape=rect;fillColor=none;strokeColor=none;fontColor=#ffffff;fontSize=10;fontFamily=Helvetica;perimeter=none;resizeHeight=1;');
				text3.geometry.relative = true;
				text3.geometry.offset = new mxPoint(sizeX * 0.5, 0);
				text3.vertex = true;
				bg.insert(text3);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Select Bar');
			}),
					
			this.addEntry(dt + 'labels', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 20), 'shape=rect;fillColor=#F6F6F8;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Label', new mxGeometry(55, 0, 54, 20), 'text;fontColor=#000000;fontSize=10;verticalAlign=middle;align=center;spacingTop=2;');
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
			   	var part1 = new mxCell('', new mxGeometry(0, 0, 164, 20), s2 + 'marginRect;rx=3;ry=3;rectMargin=5;fillColor=#ffffff;strokeColor=none;');
			   	part1.vertex = true;
			   	bg.insert(part1);
			   	var icon1 = new mxCell('Search', new mxGeometry(0.5, 0.5, 6, 6), 'shape=mxgraph.ios7.icons.looking_glass;strokeColor=#e0e0e0;fillColor=none;fontColor=#e0e0e0;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;fontSize=6;fontStyle=0;spacingTop=2;');
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
			   	var icon1 = new mxCell('Search', new mxGeometry(0.5, 0.5, 6, 6), 'shape=mxgraph.ios7.icons.looking_glass;strokeColor=#878789;fillColor=none;fontColor=#878789;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;fontSize=6;fontStyle=0;spacingTop=2;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(-17, -3);
			   	icon1.vertex = true;
			   	bg.insert(icon1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Search Box');
			}),

			this.addEntry(dt + 'status', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 25), 'shape=rect;fillColor=#F6F6F6;strokeColor=none;');
			   	bg.vertex = true;
			   	var text1 = new mxCell('Updated Just Now', new mxGeometry(0, 0, 164, 20), 'text;fontColor=#000000;fontSize=5;verticalAlign=top;align=center;spacingTop=-2;');
			   	text1.vertex = true;
			   	bg.insert(text1);
			   	var text2 = new mxCell('2 Unread', new mxGeometry(0, 5, 164, 20), 'text;fontColor=#bbbbbb;fontSize=5;verticalAlign=middle;align=center;');
			   	text2.vertex = true;
			   	bg.insert(text2);
			   	var icon1 = new mxCell('', new mxGeometry(1, 0.5, 15, 15), 'shape=mxgraph.ios7.icons.compose;strokeColor=#0080f0;fillColor=none;');
				icon1.geometry.offset = new mxPoint(-20, -7.5);
			   	icon1.geometry.relative = true;
			   	icon1.vertex = true;
			   	bg.insert(icon1);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Status');
			}),

			this.addEntry(dt + 'message', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 164, 20), 'shape=rect;fillColor=#F7F7F7;strokeColor=none;');
			   	bg.vertex = true;
			   	var part1 = new mxCell('iMessage', new mxGeometry(0, 0, 164, 20), s2 + 'marginRect;rx=3;ry=3;rectMarginLeft=25;rectMarginRight=25;rectMarginTop=3;rectMarginBottom=3;fillColor=#FBFBFB;strokeColor=#B3B3B3;fontColor=#B3B3B3;align=left;spacingLeft=29;fontSize=8;');
			   	part1.vertex = true;
			   	bg.insert(part1);
			   	var icon1 = new mxCell('', new mxGeometry(0, 0.5, 15, 9), 'strokeWidth=1;strokeColor=#F7F7F7;fillColor=#666666;shape=mxgraph.ios7.icons.camera;');
			   	icon1.geometry.offset = new mxPoint(5, -4.5);
			   	icon1.geometry.relative = true;
			   	icon1.vertex = true;
			   	bg.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(1, 0.5, 14, 14), 'strokeColor=none;fillColor=#666666;shape=ellipse;');
			   	icon2.geometry.offset = new mxPoint(-19, -7);
			   	icon2.geometry.relative = true;
			   	icon2.vertex = true;
			   	bg.insert(icon2);
			   	var icon3 = new mxCell('', new mxGeometry(0.5, 0.5, 4, 10), 'strokeColor=#F7F7F7;fillColor=none;shape=mxgraph.ios7.icons.microphone;strokeWidth=1;');
			   	icon3.geometry.offset = new mxPoint(-2, -5);
			   	icon3.geometry.relative = true;
			   	icon3.vertex = true;
			   	icon2.insert(icon3);

			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Message');
			}),

			this.addEntry(dt + 'action sheet', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 115), 'shape=rect;rSize=3;strokeColor=none;fillColor=#D2D3D5;gradientColor=none;shadow=0;');
				bg.vertex = true;
				var button1 = new mxCell('Label', new mxGeometry(0, 0, 154, 20), s2 + 'topButton;rSize=3;strokeColor=#D2D3D5;fontSize=8;fillColor=#F1F1F1;fontColor=#0080F0;resizeWidth=1;');
				button1.geometry.relative = true;
				button1.geometry.offset = new mxPoint(5, 5);
				button1.vertex = true;
				bg.insert(button1);
				var button2 = new mxCell('Label', new mxGeometry(0, 0, 154, 20), 'shape=rect;html=1;strokeColor=#D2D3D5;fontSize=8;fillColor=#F1F1F1;fontColor=#0080F0;resizeWidth=1;');
				button2.geometry.relative = true;
				button2.geometry.offset = new mxPoint(5, 25);
				button2.vertex = true;
				bg.insert(button2);
				var button3 = new mxCell('Label', new mxGeometry(0, 0, 154, 20), 'shape=rect;html=1;strokeColor=#D2D3D5;fontSize=8;fillColor=#F1F1F1;fontColor=#0080F0;resizeWidth=1;');
				button3.geometry.relative = true;
				button3.geometry.offset = new mxPoint(5, 45);
				button3.vertex = true;
				bg.insert(button3);
				var button4 = new mxCell('Label', new mxGeometry(0, 0, 154, 20), s2 + 'bottomButton;rSize=3;strokeColor=#D2D3D5;fontSize=8;fillColor=#F1F1F1;fontColor=#0080F0;resizeWidth=1;');
				button4.geometry.relative = true;
				button4.geometry.offset = new mxPoint(5, 65);
				button4.vertex = true;
				bg.insert(button4);
				var button5 = new mxCell('Cancel', new mxGeometry(0, 1, 164, 30), s2 + 'marginRect;rx=5;ry=5;rectMargin=5;strokeColor=#D2D3D5;fontSize=8;fillColor=#ffffff;fontColor=#0080F0;resizeWidth=1;');
				button5.geometry.relative = true;//zzz
				button5.geometry.offset = new mxPoint(0, -30);
				button5.vertex = true;
				bg.insert(button5);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Action Sheet');
			}),

			this.addEntry(dt + 'action sheet', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 115), 'shape=rect;rSize=3;strokeColor=none;fillColor=#D2D3D5;gradientColor=none;shadow=0;');
				bg.vertex = true;
				var button1 = new mxCell('', new mxGeometry(0, 0, 154, 40), s2 + 'topButton;rSize=3;strokeColor=#D2D3D5;fontSize=8;fillColor=#F1F1F1;fontColor=#0080F0;resizeWidth=1;');
				button1.geometry.relative = true;
				button1.geometry.offset = new mxPoint(5, 5);
				button1.vertex = true;
				bg.insert(button1);
				var button2 = new mxCell('', new mxGeometry(0, 0, 154, 40), s2 + 'bottomButton;rSize=3;strokeColor=#D2D3D5;fontSize=8;fillColor=#F1F1F1;fontColor=#0080F0;resizeWidth=1;');
				button2.geometry.relative = true;
				button2.geometry.offset = new mxPoint(5, 45);
				button2.vertex = true;
				bg.insert(button2);
				var button3 = new mxCell('Cancel', new mxGeometry(0, 1, 164, 30), 'shape=mxgraph.ios7ui.marginRect;rx=3;ry=3;rectMargin=5;strokeColor=#D2D3D5;fontSize=8;fillColor=#ffffff;fontColor=#0080F0;resizeWidth=1;');
				button3.geometry.relative = true;
				button3.geometry.offset = new mxPoint(0, -30);
				button3.vertex = true;
				bg.insert(button3);
				var icon1 = new mxCell('Message', new mxGeometry(0, 0.5, 22, 22), 'shape=rect;rounded=1;strokeColor=none;fontSize=5;fillColor=#68F783;fontColor=#000000;gradientColor=#05B61E;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-4;');
				icon1.geometry.relative = true;
				icon1.geometry.offset = new mxPoint(5, -15);
				icon1.vertex = true;
				button1.insert(icon1);
				var icon2 = new mxCell('', new mxGeometry(2, 3, 18, 16), 'shape=mxgraph.basic.oval_callout;strokeColor=none;fillColor=#ffffff;');
				icon2.vertex = true;
				icon1.insert(icon2);
				var icon3 = new mxCell('Mail', new mxGeometry(0, 0.5, 22, 22), 'shape=rect;rounded=1;strokeColor=none;fontSize=5;fillColor=#1960EC;fontColor=#000000;gradientColor=#1FDCFF;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-4;');
				icon3.geometry.relative = true;
				icon3.geometry.offset = new mxPoint(37, -15);
				icon3.vertex = true;
				button1.insert(icon3);
				var icon4 = new mxCell('', new mxGeometry(3, 6, 16, 10), 'shape=mxgraph.ios7.icons.mail;strokeColor=#2299F3;fillColor=#ffffff;');
				icon4.vertex = true;
				icon3.insert(icon4);
				var icon5 = new mxCell('Open in App', new mxGeometry(0, 0.5, 22, 22), 'shape=rect;rounded=1;strokeColor=none;fontSize=5;fillColor=#ffffff;fontColor=#000000;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-7;whiteSpace=wrap;');
				icon5.geometry.relative = true;
				icon5.geometry.offset = new mxPoint(5, -15);
				icon5.vertex = true;
				button2.insert(icon5);
				var icon6 = new mxCell('Open Link', new mxGeometry(0, 0.5, 22, 22), 'shape=rect;rounded=1;strokeColor=none;fontSize=5;fillColor=#ffffff;fontColor=#000000;verticalAlign=top;labelPosition=center;verticalLabelPosition=bottom;align=center;spacingTop=-7;whiteSpace=wrap;');
				icon6.geometry.relative = true;
				icon6.geometry.offset = new mxPoint(37, -15);
				icon6.vertex = true;
				button2.insert(icon6);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Action Sheet');
			}),

			this.addEntry(dt + 'cell list', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 120), 'shape=rect;strokeColor=none;fillColor=#ffffff;gradientColor=none;shadow=0;');
				bg.vertex = true;
				var part1 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingLeft=25;spacingTop=2;');
				part1.geometry.relative = true;
				part1.vertex = true;
				bg.insert(part1);
				var button1 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#FF9501;');
				button1.geometry.relative = true;
				button1.geometry.offset = new mxPoint(5, -7.5);
				button1.vertex = true;
				part1.insert(button1);
				var button2 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
				button2.geometry.relative = true;
				button2.geometry.offset = new mxPoint(-15, -5);
				button2.vertex = true;
				part1.insert(button2);
				
				var part2 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingLeft=25;spacingTop=2;');
				part2.geometry.offset = new mxPoint(0, 20);
				part2.geometry.relative = true;
				part2.vertex = true;
				bg.insert(part2);
				var button3 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#FF3B2F;');
				button3.geometry.relative = true;
				button3.geometry.offset = new mxPoint(5, -7.5);
				button3.vertex = true;
				part2.insert(button3);
				var button4 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
				button4.geometry.relative = true;
				button4.geometry.offset = new mxPoint(-15, -5);
				button4.vertex = true;
				part2.insert(button4);

				var part3 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingLeft=25;spacingTop=2;');
				part3.geometry.offset = new mxPoint(0, 40);
				part3.geometry.relative = true;
				part3.vertex = true;
				bg.insert(part3);
				var button5 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#4CDA64;');
				button5.geometry.relative = true;
				button5.geometry.offset = new mxPoint(5, -7.5);
				button5.vertex = true;
				part3.insert(button5);
				var button6 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
				button6.geometry.relative = true;
				button6.geometry.offset = new mxPoint(-15, -5);
				button6.vertex = true;
				part3.insert(button6);

				var part4 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingLeft=25;spacingTop=2;');
				part4.geometry.offset = new mxPoint(0, 60);
				part4.geometry.relative = true;
				part4.vertex = true;
				bg.insert(part4);
				var button7 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#007AFF;');
				button7.geometry.relative = true;
				button7.geometry.offset = new mxPoint(5, -7.5);
				button7.vertex = true;
				part4.insert(button7);
				var button8 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
				button8.geometry.relative = true;
				button8.geometry.offset = new mxPoint(-15, -5);
				button8.vertex = true;
				part4.insert(button8);

				var part5 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingLeft=25;spacingTop=2;');
				part5.geometry.offset = new mxPoint(0, 80);
				part5.geometry.relative = true;
				part5.vertex = true;
				bg.insert(part5);
				var button9 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#5855D6;');
				button9.geometry.relative = true;
				button9.geometry.offset = new mxPoint(5, -7.5);
				button9.vertex = true;
				part5.insert(button9);
				var button10 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
				button10.geometry.relative = true;
				button10.geometry.offset = new mxPoint(-15, -5);
				button10.vertex = true;
				part5.insert(button10);

				var part6 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingLeft=25;spacingTop=2;');
				part6.geometry.offset = new mxPoint(0, 100);
				part6.geometry.relative = true;
				part6.vertex = true;
				bg.insert(part6);
				var button11 = new mxCell('', new mxGeometry(0, 0.5, 15, 15), 'shape=rect;rounded=1;rSize=3;strokeColor=none;fillColor=#8F8E94;');
				button11.geometry.relative = true;
				button11.geometry.offset = new mxPoint(5, -7.5);
				button11.vertex = true;
				part6.insert(button11);
				var button12 = new mxCell('', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;');
				button12.geometry.relative = true;
				button12.geometry.offset = new mxPoint(-15, -5);
				button12.vertex = true;
				part6.insert(button12);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cell List');
			}),

			this.addEntry(dt + 'cell list', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 60), 'shape=rect;strokeColor=none;fillColor=#ffffff;gradientColor=none;shadow=0;');
				bg.vertex = true;
				var part1 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingTop=2;spacingLeft=5;');
				part1.geometry.relative = true;
				part1.vertex = true;
				bg.insert(part1);
				var button2 = new mxCell('Label', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;fontSize=10;spacingRight=4;fontColor=#999999;');
				button2.geometry.relative = true;
				button2.geometry.offset = new mxPoint(-15, -5);
				button2.vertex = true;
				part1.insert(button2);
				
				var part2 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingTop=2;spacingLeft=5;');
				part2.geometry.offset = new mxPoint(0, 20);
				part2.geometry.relative = true;
				part2.vertex = true;
				bg.insert(part2);
				var button4 = new mxCell('Label', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;fontSize=10;spacingRight=4;fontColor=#999999;');
				button4.geometry.relative = true;
				button4.geometry.offset = new mxPoint(-15, -5);
				button4.vertex = true;
				part2.insert(button4);

				var part3 = new mxCell('Label', new mxGeometry(0, 0, 164, 20), 'shape=rect;strokeColor=none;fontSize=10;fontColor=#000000;resizeWidth=1;align=left;spacingTop=2;spacingLeft=5;');
				part3.geometry.offset = new mxPoint(0, 40);
				part3.geometry.relative = true;
				part3.vertex = true;
				bg.insert(part3);
				var button6 = new mxCell('Label', new mxGeometry(1, 0.5, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;fontSize=10;spacingRight=4;fontColor=#999999;');
				button6.geometry.relative = true;
				button6.geometry.offset = new mxPoint(-15, -5);
				button6.vertex = true;
				part3.insert(button6);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Cell List');
			}),

			this.addEntry(dt + 'message', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 35), 'shape=rect;strokeColor=none;fillColor=#ffffff;gradientColor=none;shadow=0;');
				bg.vertex = true;
				var part1 = new mxCell('Peter Gilles', new mxGeometry(0, 0, 10, 10), 'shape=ellipse;strokeColor=none;fillColor=#007FF8;fontSize=8;fontColor=#000000;align=left;spacingTop=1;spacingLeft=2;labelPosition=right;verticalLabelPosition=middle;verticalAlign=middle;');
				part1.geometry.relative = true;
				part1.geometry.offset = new mxPoint(5, 5);
				part1.vertex = true;
				bg.insert(part1);
				var button1 = new mxCell('22:45', new mxGeometry(1, 0, 5, 10), 'shape=mxgraph.ios7.misc.right;strokeColor=#666666;labelPosition=left;verticalLabelPosition=middle;align=right;verticalAlign=middle;fontSize=8;spacingRight=4;fontColor=#999999;');
				button1.geometry.relative = true;
				button1.geometry.offset = new mxPoint(-15, 5);
				button1.vertex = true;
				bg.insert(button1);
				var text1 = new mxCell('I just got a new friend', new mxGeometry(0, 0, 164, 10), 'shape=text;strokeColor=none;align=left;verticalAlign=middle;fontSize=7;spacingLeft=17;fontColor=#000000;spacingTop=2;');
				text1.geometry.relative = true;
				text1.geometry.offset = new mxPoint(0, 15);
				text1.vertex = true;
				bg.insert(text1);
				var text2 = new mxCell('You know I wanted a dog. Yesterday I got a puppy ...', new mxGeometry(0, 0, 164, 10), 'shape=text;strokeColor=none;align=left;verticalAlign=middle;fontSize=6;spacingLeft=17;fontColor=#808080;spacingTop=2;');
				text2.geometry.relative = true;
				text2.geometry.offset = new mxPoint(0, 25);
				text2.vertex = true;
				bg.insert(text2);
				
				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Message');
			}),

			this.addEntry(dt + 'message', function()
			{
				var bg = new mxCell('', new mxGeometry(0, 0, 164, 100), 'shape=rect;strokeColor=none;fillColor=#ffffff;gradientColor=none;shadow=0;');
				bg.vertex = true;
				var text1 = new mxCell('Saturday 10:12 AM', 
						new mxGeometry(0, 0, 164, 10), 'shape=text;align=center;verticalAlign=middle;fontSize=5;fontColor=#999999;strokeColor=none;fillColor=none;spacingTop=3;resizeWidth=1;');
				text1.geometry.relative = true;
				text1.geometry.offset = new mxPoint(0, 0);
				text1.vertex = true;
				bg.insert(text1);
				var part1 = new mxCell('Hey man, got a sec?', 
						new mxGeometry(0, 0, 90, 20), s2 + 'callout;strokeColor=none;fillColor=#E7E6EC;align=left;verticalAlign=middle;fontSize=7;spacingLeft=17;fontColor=#000000;spacingTop=2;whiteSpace=wrap;resizeWidth=1;');
				part1.geometry.relative = true;
				part1.geometry.offset = new mxPoint(5, 15);
				part1.vertex = true;
				bg.insert(part1);
				var part2 = new mxCell('Hi Tim, of course, just give me a couple minutes to finish breakfast.', 
						new mxGeometry(0.35, 0, 100, 35), s2 + 'callout;strokeColor=none;fillColor=#0680FF;flipH=1;align=left;verticalAlign=top;fontSize=7;spacingLeft=2;fontColor=#ffffff;spacingTop=-2;whiteSpace=wrap;spacingRight=12;resizeWidth=1;');
				part2.geometry.relative = true;
				part2.geometry.offset = new mxPoint(0, 40);
				part2.vertex = true;
				bg.insert(part2);
				var text2 = new mxCell('Read Friday', new mxGeometry(0, 0, 164, 10), 'shape=text;align=right;verticalAlign=middle;fontSize=5;fontColor=#999999;strokeColor=none;fillColor=none;spacingTop=3;resizeWidth=1;');
				text2.geometry.relative = true;
				text2.geometry.offset = new mxPoint(0, 80);
				text2.vertex = true;
				bg.insert(text2);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Message');
			}),

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

			this.addEntry(dt + 'dialog', function()
			{
				var bg = new mxCell("A dialog title", 
						new mxGeometry(0, 0, 120, 70), 'shape=rect;rounded=1;strokeColor=none;fillColor=#F6F6F8;gradientColor=none;shadow=0;glass=0;dashed=1;fontFamily=Helvetica;fontSize=8;fontColor=#333333;align=center;html=0;verticalAlign=top;whiteSpace=wrap;spacing=8;spacingTop=0;');
				bg.vertex = true;
				var text1 = new mxCell("A dialog text that notifies you of something and you need to decide which action to take.",
						new mxGeometry(0, 0, 120, 30), 'shape=text;align=center;verticalAlign=middle;fontSize=7;fontColor=#333333;strokeColor=none;fillColor=none;spacingTop=-8;resizeWidth=1;whiteSpace=wrap;');
				text1.geometry.relative = true;
				text1.geometry.offset = new mxPoint(0, 20);
				text1.vertex = true;
				bg.insert(text1);
				var text2 = new mxCell('Action 1', new mxGeometry(0, 1, 60, 20), 'shape=text;align=center;verticalAlign=middle;fontSize=8;fontColor=#0680FF;strokeColor=none;fillColor=none;spacingTop=3;resizeWidth=1;');
				text2.geometry.relative = true;
				text2.geometry.offset = new mxPoint(0, -20);
				text2.vertex = true;
				bg.insert(text2);
				var text3 = new mxCell('Action 2', new mxGeometry(0.5, 1, 60, 20), 'shape=text;align=center;verticalAlign=middle;fontSize=8;fontColor=#0680FF;strokeColor=none;fillColor=none;spacingTop=3;resizeWidth=1;');
				text3.geometry.relative = true;
				text3.geometry.offset = new mxPoint(0, -20);
				text3.vertex = true;
				bg.insert(text3);

				return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Dialog');
			}),

			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.bluetooth;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Bluetooth', null, null, this.getTagsForStencil(gn, 'bluetooth', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.broadcast;fillColor=#4CDA64;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Broadcast', null, null, this.getTagsForStencil(gn, 'broadcast', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.link;fillColor=#4CDA64;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Link', null, null, this.getTagsForStencil(gn, 'link', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.night;fillColor=#5855D6;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Night', null, null, this.getTagsForStencil(gn, 'night', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.notification;fillColor=#FF3B2F;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Notification', null, null, this.getTagsForStencil(gn, 'notification', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.settings;fillColor=#8F8E94;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Settings', null, null, this.getTagsForStencil(gn, 'settings', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.switch;fillColor=#8F8E94;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Switch', null, null, this.getTagsForStencil(gn, 'switch', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.text_size;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Text Size', null, null, this.getTagsForStencil(gn, 'text size', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.travel;fillColor=#FF9501;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'Travel', null, null, this.getTagsForStencil(gn, 'travel', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.vpn;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
					15, 15, '', 'VPN', null, null, this.getTagsForStencil(gn, 'vpn virtual private network', dt + '').join(' ')),
			this.createVertexTemplateEntry(
		   			'html=1;strokeWidth=1;shadow=0;dashed=0;shape=mxgraph.ios7.misc.wifi;fillColor=#007AFF;strokeColor=none;buttonText=;strokeColor2=#222222;fontColor=#222222;fontSize=8;verticalLabelPosition=bottom;verticalAlign=top;align=center;',
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
			   	var button1 = new mxCell('Action', new mxGeometry(8, 6, 148, 21), s2 + 'rrect;rSize=3;fontColor=#0080F0;fontSize=7;fontSize=14;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;');
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Cancel', new mxGeometry(8, 33, 148, 21), s2 + 'rrect;rSize=3;fontColor=#0080F0;fontSize=7;fontSize=14;fillColor=#e0e0e0;strokeColor=none;fontStyle=1;');
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Action Dialog');
			}),

			this.createVertexTemplateEntry(s3 + 'iKeybLett;', 
					sizeX * 0.87, sizeY * 0.25, '', 'iPhone Keyboard (letters)', null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;', 
					sizeX * 0.87, sizeY * 0.25, '', 'iPhone Keyboard (numbers)', null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;', 
					sizeX * 0.87, sizeY * 0.25, '', 'iPhone Keyboard (symbols)', null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybLett;', 
					sizeX * 1.66, sizeY * 0.36, '', "iPad 7''Keyboard (letters)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;', 
					sizeX * 1.66, sizeY * 0.36, '', "iPad 7'' Keyboard (numbers)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;', 
					sizeX * 1.66, sizeY * 0.36, '', "iPad 7'' Keyboard (symbols)", null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybLett;', 
					sizeX * 2.21, sizeY * 0.48, '', "iPad 10''Keyboard (letters)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;', 
					sizeX * 2.21, sizeY * 0.48, '', "iPad 10'' Keyboard (numbers)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;', 
					sizeX * 2.21, sizeY * 0.48, '', "iPad 10'' Keyboard (symbols)", null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybLett;', 
					sizeX * 2.53, sizeY * 0.55, '', "iPad 13''Keyboard (letters)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybNumb;', 
					sizeX * 2.53, sizeY * 0.55, '', "iPad 13'' Keyboard (numbers)", null, null, this.getTagsForStencil(gnm, 'keyboard letters', dt + '').join(' ')),
			this.createVertexTemplateEntry(s3 + 'iKeybSymb;', 
					sizeX * 2.53, sizeY * 0.55, '', "iPad 13'' Keyboard (symbols)", null, null, this.getTagsForStencil(gnm, 'keyboard symbols', dt + '').join(' ')),
		   	this.createVertexTemplateEntry(sm + 'call_pad;', 
		   			sizeX * 0.7, sizeY * 0.4, '', 'Call Pad', null, null, this.getTagsForStencil(gnm, 'call_pad', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'number_pad;strokeWidth=1;', 
					sizeX * 0.7, sizeY * 0.4, '', 'Number Pad', null, null, this.getTagsForStencil(gnm, 'number_pad', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'keyboard_(letters);', 
					sizeX * 0.875, sizeY * 0.3, '', 'Keyboard', null, null, this.getTagsForStencil(gnm, 'keyboard_(letters)', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'scroll_(horizontal);fillColor=#a0a0a0;', 
					sizeX * 0.4, sizeY * 0.015, '', 'Scroll (Horizontal)', null, null, this.getTagsForStencil(gnm, 'scroll_(horizontal)', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'scroll_(vertical);fillColor=#a0a0a0;', 
					sizeX * 0.03, sizeY * 0.2, '', 'Scroll (Vertical)', null, null, this.getTagsForStencil(gnm, 'scroll_(vertical)', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'add;fillColor=#00dd00;strokeColor=#ffffff;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Add', null, null, this.getTagsForStencil(gnm, 'add', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'delete;fillColor=#ff0000;strokeColor=#ffffff;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Delete', null, null, this.getTagsForStencil(gnm, 'delete', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'select;fillColor=#0080f0;strokeColor=#ffffff;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Select', null, null, this.getTagsForStencil(gnm, 'select', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'remove;fillColor=#0080f0;strokeColor=#ffffff;', 
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
					sm + 'increase;fillColor=#ffffff;strokeColor=#0080f0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Increase', null, null, this.getTagsForStencil(gnm, 'increase', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'info;fillColor=#ffffff;strokeColor=#0080f0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Info', null, null, this.getTagsForStencil(gnm, 'info', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'more_2;strokeColor=#a0a0a0;', 
					sizeX * 0.03, sizeY * 0.02, '', 'More 2', null, null, this.getTagsForStencil(gnm, 'more_2', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'more;strokeColor=#a0a0a0;', 
					sizeX * 0.025, sizeY * 0.02, '', 'More', null, null, this.getTagsForStencil(gnm, 'more', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'options;fillColor=#222222;', 
					sizeX * 0.06, sizeY * 0.015, '', 'Options', null, null, this.getTagsForStencil(gnm, 'options', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'pause;fillColor=#ffffff;strokeColor=#0080f0;', 
					sizeX * 0.06, sizeY * 0.03, '', 'Pause', null, null, this.getTagsForStencil(gnm, 'pause', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'star;fillColor=#0080f0;strokeColor=none;', 
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
					s + 'pageControl;fillColor=#222222;strokeColor=#aaaaaa;', 
					sizeX * 0.25, sizeY * 0.0125, '', 'Page control', null, null, this.getTagsForStencil(gn, 'pageControl', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'current_location;strokeColor=#ffffff;fillColor=#0080F0', 
					sizeX * 0.3, sizeY * 0.15, '', 'Current Location', null, null, this.getTagsForStencil(gnm, 'current_location', dt + '').join(' ')),
			this.createVertexTemplateEntry(
					sm + 'expand;fillColor=#c0c0c0;', 
					sizeX * 0.12, sizeY * 0.015, '', 'Expand', null, null, this.getTagsForStencil(gnm, 'expand', dt + '').join(' ')),

			this.addEntry(dt + 'volume control', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 160, 14), 'shape=rect;strokeColor=none;fillColor=none;');
			   	bg.vertex = true;
			   	var icon1 = new mxCell('', new mxGeometry(0, 0.5, 6, 8), 'shape=mxgraph.ios7.misc.volume_down;fillColor=#666666;strokeColor=none;');
			   	icon1.geometry.relative = true;
			   	icon1.geometry.offset = new mxPoint(0, -4);
			   	icon1.vertex = true;
			   	bg.insert(icon1);
			   	var icon2 = new mxCell('', new mxGeometry(1, 0.5, 14, 14), 'shape=mxgraph.ios7.misc.volume_up;fillColor=#666666;strokeColor=none;');
			   	icon2.geometry.relative = true;
			   	icon2.geometry.offset = new mxPoint(-14, -7);
			   	icon2.vertex = true;
			   	bg.insert(icon2);
			   	var part1 = new mxCell('', new mxGeometry(18, 0, 116, 14), s2 + 'slider;barPos=60;strokeColor=#0680FF;opacity=100;fillColor=#FFFFFF;handleSize=14;');
			   	part1.vertex = true;
			   	bg.insert(part1);
	
			   	return sb.createVertexTemplateFromCells([bg], 160, 14, 'Volume Control');
			}),
					
					
			this.addEntry(dt + 'picker', function()
			{
			   	var bg = new mxCell('', new mxGeometry(0, 0, 175, 160), s2 + 'anchor;');
			   	bg.vertex = true;
			   	var button1 = new mxCell('Item 1', new mxGeometry(0, 0, 175, 32), s2 + 'anchor;fontSize=15;fontColor=#a0a0a0;resizeWidth=1;');
			   	button1.geometry.relative = true;
			   	button1.vertex = true;
			   	bg.insert(button1);
			   	var button2 = new mxCell('Item 2', new mxGeometry(0, 0, 175, 32), s2 + 'anchor;fontSize=15;fontColor=#a0a0a0;resizeWidth=1;');
			   	button2.geometry.relative = true;
			   	button2.geometry.offset = new mxPoint(0, 32);
			   	button2.vertex = true;
			   	bg.insert(button2);
			   	var button3 = new mxCell('Item 3', new mxGeometry(0, 0, 175, 32), s2 + 'horLines;fontSize=15;fontColor=#222222;strokeColor=#a0a0a0;fillColor=none;strokeWidth=2;resizeWidth=1;');
			   	button3.geometry.relative = true;
			   	button3.geometry.offset = new mxPoint(0, 64);
			   	button3.vertex = true;
			   	bg.insert(button3);
			   	var button4 = new mxCell('Item 4', new mxGeometry(0, 0, 175, 32), s2 + 'anchor;fontSize=15;fontColor=#a0a0a0;resizeWidth=1;');
			   	button4.geometry.relative = true;
			   	button4.geometry.offset = new mxPoint(0, 96);
			   	button4.vertex = true;
			   	bg.insert(button4);
			   	var button5 = new mxCell('Item 5', new mxGeometry(0, 0, 175, 32), s2 + 'anchor;fontSize=15;fontColor=#a0a0a0;resizeWidth=1;');
			   	button5.geometry.relative = true;
			   	button5.geometry.offset = new mxPoint(0, 128);
			   	button5.vertex = true;
			   	bg.insert(button5);
	
			   	return sb.createVertexTemplateFromCells([bg], bg.geometry.width, bg.geometry.height, 'Picker');
			})
		];

		this.addPalette('ios7ui', 'iOS UI', false, mxUtils.bind(this, function(content)
				{
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));
	};
	
})();

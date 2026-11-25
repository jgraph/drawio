/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The Message template of prompts (FilenameDialog) in every look (concept
 * 13.1, mockup 54; Fusion's Rename in Simple, 18 November 2026): the
 * headline (the label of the prompt or the verb of its button), what the
 * prompt acts on (for Rename the file and where it is saved), the field on
 * its own row, named by the label for screen readers, the file types with
 * their label and the buttons of the dialog. The prompt keeps its controls
 * and their listeners (the validation, Enter, Escape, the file types and the
 * function of the button), so it does what it did.
 *
 * The layout (EditorUi.createPromptLayout) takes a skin: the Classic skin
 * (MessageTemplate.skins.classic, docs/dialog-style-guide.md: the head of
 * the Preview template, the colors of the other dialogs of the theme light
 * and dark; its CSS is in grapheditor.css under .geMessageTemplate) for the
 * Rename prompts of files, pages and groups of pages in Simple behind the
 * row renameDialog of Editor.featureDefaults (Editor.isRenameDialogEnabled),
 * or the skin of Fusion, which SimpleMessages.js adds
 * (MessageTemplate.skins.fusion) for all its prompts, so the code exists
 * once.
 */
var MessageTemplate = {};

/**
 * Width of the content of a prompt in the Classic skin (the frame adds 48),
 * limited to the window (EditorUi.getPromptLayoutWidth); the width of the
 * messages of Fusion (EditorUi.simpleMessageWidth).
 */
MessageTemplate.width = 372;

/**
 * Space between the frame of a prompt in the Classic skin and the window.
 */
MessageTemplate.windowMargin = 16;

/**
 * Resources of buttons that do not name what the prompt does: their prompt
 * has the label as its headline (EditorUi.simpleGenericButtons in Fusion).
 */
MessageTemplate.genericButtons = ['ok', 'apply', 'done', 'close', 'cancel'];

/**
 * Verbs of prompts with OK by the resource of their label; the others say
 * Apply (concept 13.1: never OK). EditorUi.simplePromptVerbs in Fusion.
 */
MessageTemplate.promptVerbs = {commitMessage: 'commit'};

/**
 * The skins of the template. A skin has the classes of the parts (message,
 * label, field) and the builders of its parts: takeInfo, addHeadline,
 * setSize, getFileSubtitle and addSubtitle (see
 * MessageTemplate.skins.classic). The skin of Fusion is added by
 * SimpleMessages.js.
 */
MessageTemplate.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the headline
 * and the subtitle in the head of the Preview template, the field across the
 * dialog, the buttons of the dialog. The CSS is in grapheditor.css under
 * .geMessageTemplate.
 */
MessageTemplate.skins.classic = {
	name: 'classic',
	classes: {message: 'geMessageTemplate', label: 'geMessageLabel', field: 'geMessageField',
		head: 'gePreviewHead', subtitle: 'geDialogHint gePreviewSubtitle geMessageSubtitle'},
	/**
	 * Returns what the next prompt acts on if the caller has said it (none).
	 */
	takeInfo: function(ui)
	{
		return null;
	},
	/**
	 * Adds the given headline before the given grid of the prompt in the
	 * given container, in the head of the Preview template.
	 */
	addHeadline: function(ui, container, headline, grid)
	{
		var head = document.createElement('div');
		head.className = this.classes.head;
		head.appendChild(headline);
		container.insertBefore(head, grid);
	},
	/**
	 * The width of the template and the height of its content are set where
	 * the prompt is shown (EditorUi.showDialog).
	 */
	setSize: function(ui, container)
	{
		// The dialog is sized in showDialog
	},
	/**
	 * Returns what Rename acts on: the name of the given file and the
	 * storage where it is saved, or null if it has neither.
	 */
	getFileSubtitle: function(ui, file)
	{
		return MessageTemplate.getFileSubtitle(file);
	},
	/**
	 * Adds the given subtitle after the given headline (as text).
	 */
	addSubtitle: function(ui, headline, text)
	{
		if (headline != null && headline.parentNode != null && text != null && text != '')
		{
			var sub = document.createElement('div');
			sub.className = this.classes.subtitle;
			mxUtils.write(sub, text);
			headline.parentNode.insertBefore(sub, headline.nextSibling);

			return sub;
		}

		return null;
	}
};

/**
 * Returns the skin of the template for the current theme: the skin of Fusion
 * in Fusion (if its scripts are loaded), else the Classic skin.
 */
MessageTemplate.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		MessageTemplate.skins.fusion != null) ? MessageTemplate.skins.fusion :
		MessageTemplate.skins.classic;
};

/**
 * Returns the name of the given file and the storage where it is saved,
 * joined with a middle dot, or null if it has neither (a new file has no
 * name until it is saved).
 */
MessageTemplate.getFileSubtitle = function(file)
{
	if (file == null)
	{
		return null;
	}

	var mode = file.getMode();
	var storage = (typeof App !== 'undefined' && App.storages != null && mode != null &&
		Object.prototype.hasOwnProperty.call(App.storages, mode)) ? App.storages[mode] : null;
	var title = (file.getTitle() != null) ? mxUtils.trim(String(file.getTitle())) : '';
	var place = (storage != null && storage.title != null) ? mxResources.get(storage.title) : null;
	var text = PreviewDialog.joinList([title, place]);

	return (text.length > 0) ? text : null;
};

/**
 * Returns true if Rename of files, pages and groups of pages shows the
 * Message template in the Classic skin: the feature renameDialog of
 * Editor.featureDefaults (renameDialog in the configuration and the URL), on
 * in Simple in the web app and off in Classic (the driver named only Simple,
 * 18 November 2026). The theme Fusion always has it, for all its prompts.
 */
Editor.isRenameDialogEnabled = function()
{
	return Editor.isFeatureEnabled('renameDialog');
};

/**
 * Returns true if the given arguments of a FilenameDialog are a prompt to
 * rename (a file, a page or a group of pages): the button says Rename and
 * the prompt has no content of its own.
 */
MessageTemplate.isRenamePrompt = function(buttonText, content)
{
	return buttonText == mxResources.get('rename') && content == null;
};

/**
 * Runs the given function, which shows the prompt to rename the given file
 * (the action rename of Menus.js), and returns its result. The prompt that
 * the function opens says what it renames: the name of the file and where it
 * is saved (createPromptLayout takes the file, see takeRenameFile). Rename of
 * pages, groups of pages and of plugins have no such subtitle, also if their
 * name is the title of the file.
 */
EditorUi.prototype.withRenameFile = function(file, fn)
{
	var prev = this.pendingRenameFile;
	this.pendingRenameFile = file;

	try
	{
		return fn();
	}
	finally
	{
		this.pendingRenameFile = prev;
	}
};

/**
 * Returns and clears the file that the next prompt renames (withRenameFile),
 * or null if the prompt does not rename the file.
 */
EditorUi.prototype.takeRenameFile = function()
{
	var file = this.pendingRenameFile;
	this.pendingRenameFile = null;

	return (file != null) ? file : null;
};

/**
 * Lays out the given FilenameDialog, built with the given arguments of its
 * constructor, on the Message template in the given skin: the headline (the
 * label, or the verb of the button if it names what the prompt does) before
 * the grid of the dialog, the field on its own row and named by the label
 * (the label is hidden), and for prompts without content of their own the
 * size of the skin, what the prompt acts on (for Rename of the current file
 * its name and storage), the label Type without its colon and a verb instead
 * of OK. The controls stay in their places in the grid, so the dialog works
 * as before.
 */
EditorUi.prototype.createPromptLayout = function(dlg, filename, buttonText, label, content, skin)
{
	var container = dlg.container;
	var grid = container.firstChild;
	var input = (grid != null) ? grid.querySelector('input') : null;
	container.classList.add(skin.classes.message);

	if ((label != null || content == null) && grid != null && input != null)
	{
		var generic = false;

		for (var i = 0; i < MessageTemplate.genericButtons.length && !generic; i++)
		{
			generic = buttonText == mxResources.get(MessageTemplate.genericButtons[i]);
		}

		var name = (label != null) ? label : mxResources.get('filename');
		var title = document.createElement('h3');
		mxUtils.write(title, (label != null || generic) ? name : buttonText);
		skin.addHeadline(this, container, title, grid);

		grid.firstChild.classList.add(skin.classes.label);
		input.parentNode.classList.add(skin.classes.field);
		input.setAttribute('aria-label', name);
	}

	// What the caller has said the next prompt acts on (Fusion) and the file
	// that the action rename renames (withRenameFile)
	var info = skin.takeInfo(this);
	var file = this.takeRenameFile();
	input = container.querySelector('input');

	if (content != null || input == null)
	{
		return;
	}

	skin.setSize(this, container);
	var headline = container.querySelector('h3');

	// Rename of the file says what it renames and where the file is saved
	// (mockup 54), never Rename of a page or a group with the name of the file
	if (info == null && buttonText == mxResources.get('rename') && file != null &&
		filename == file.getTitle())
	{
		info = {subtitle: skin.getFileSubtitle(this, file)};
	}

	if (info != null)
	{
		skin.addSubtitle(this, headline, info.subtitle);
	}

	// Labels have no colon (concept 13.1): Type of the file types
	var divs = container.querySelectorAll('div');

	for (var i = 0; i < divs.length; i++)
	{
		if (divs[i].childNodes.length == 1 && divs[i].textContent == mxResources.get('type') + ':')
		{
			divs[i].textContent = mxResources.get('type');
			var select = (divs[i].nextElementSibling != null) ?
				divs[i].nextElementSibling.querySelector('select') : null;

			if (select != null)
			{
				select.setAttribute('aria-label', mxResources.get('type'));
			}
		}
	}

	// The primary action is a verb (concept 13.1)
	var primary = container.querySelector('.gePrimaryBtn');

	if (buttonText == mxResources.get('ok') && primary != null &&
		mxUtils.trim(primary.textContent) == buttonText)
	{
		var verb = 'apply';

		for (var key in MessageTemplate.promptVerbs)
		{
			if (Object.prototype.hasOwnProperty.call(MessageTemplate.promptVerbs, key) &&
				label != null && label == mxResources.get(key))
			{
				verb = MessageTemplate.promptVerbs[key];
			}
		}

		primary.textContent = mxResources.get(verb);
	}
};

/**
 * Lays out the given FilenameDialog, built with the given arguments of its
 * constructor, on the Message template in the Classic skin if it is a
 * prompt to rename and the feature is on (Fusion lays out all its prompts in
 * SimpleMessages.js). Called at the end of the constructor of FilenameDialog.
 * Every other prompt keeps its layout.
 */
EditorUi.prototype.installPromptLayout = function(dlg, args)
{
	var buttonText = args[2];
	var content = args[6];

	if (dlg.container != null && !this.editor.isChromelessView() &&
		MessageTemplate.isRenamePrompt(buttonText, content) && Editor.isRenameDialogEnabled() &&
		MessageTemplate.getSkin() == MessageTemplate.skins.classic)
	{
		try
		{
			this.createPromptLayout(dlg, args[1], buttonText, args[4], content,
				MessageTemplate.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installPromptLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Returns the width of the content of a prompt in the Classic skin: the width
 * of the template limited to the window.
 */
EditorUi.prototype.getPromptLayoutWidth = function()
{
	var max = Math.max(0, window.innerWidth || document.documentElement.clientWidth || 0) -
		48 - 2 * MessageTemplate.windowMargin;

	return Math.max(200, Math.min(MessageTemplate.width, max));
};

(function()
{
	/**
	 * Shows a prompt on the Message template in the Classic skin with the
	 * width of the template and the height of its content.
	 */
	var editorUiShowDialog = EditorUi.prototype.showDialog;

	EditorUi.prototype.showDialog = function(elt, w, h, modal, closable, onClose, noScroll, transparent)
	{
		var args = arguments;

		if (elt != null && elt.nodeType == mxConstants.NODETYPE_ELEMENT && !transparent &&
			elt.classList.contains(MessageTemplate.skins.classic.classes.message) &&
			MessageTemplate.getSkin() == MessageTemplate.skins.classic)
		{
			args = Array.prototype.slice.call(arguments);
			args[1] = this.getPromptLayoutWidth();
			args[2] = null;
		}

		return editorUiShowDialog.apply(this, args);
	};
})();

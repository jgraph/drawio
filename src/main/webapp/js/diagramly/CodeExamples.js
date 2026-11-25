/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * CodeExamples.js: the examples of the code dialogs with a live preview
 * (Insert › Advanced › From Text, Mermaid, PlantUML, SQL and CSV) and the
 * parts of their errors that every skin shares:
 *
 * - A row of example chips above the preview (addCodeExamples): a mouse (or
 *   a pen that hovers) on a chip or the focus of the keyboard shows its
 *   example in the preview (computed on the first hover and cached for the
 *   dialog), a click or a tap loads its text and its type at once (a touch
 *   shows nothing before, isHoverPointer, hasKeyboardFocus). Code that was
 *   typed, pasted or dropped is replaced with an Undo
 *   next to the chips that brings it back with its type; an example that
 *   was loaded or the example of the dialog is replaced without one.
 * - The errors of the preview (installCodeErrors): the side of the preview
 *   keeps the last image without an error, dimmed, with the message and its
 *   line (getErrorLine), the line is marked in the code field
 *   (CodeField setMarkedLine) and code of another language (getLanguage)
 *   offers the dialog of that language.
 *
 * The theme Fusion shows them in its layout (SimpleCode.js, fusion.css);
 * the Classic skin of the code dialogs of the other themes (CodeDialogs.js,
 * grapheditor.css) uses the same functions with its own classes (since 23
 * November 2026). Nothing here runs unless a skin calls it.
 */
var CodeExamples = {};

/**
 * Delay before a pointer on a chip shows its example in the preview (ms), so
 * that a pointer that crosses the chips computes nothing.
 */
CodeExamples.hoverDelay = 80;

/**
 * Returns true if the given pointer event comes from a pointer that hovers:
 * a mouse, or a pen above the screen. A touch has no hover, and a pointer
 * that is down (a pen that taps) is a click, which loads the example.
 */
CodeExamples.isHoverPointer = function(evt)
{
	return evt.pointerType != 'touch' && !(evt.buttons > 0);
};

/**
 * Returns true if the given element has the focus of the keyboard (Tab):
 * the focus of a click or a tap, which a browser also gives a button, is
 * not :focus-visible. Browsers without :focus-visible count every focus.
 */
CodeExamples.hasKeyboardFocus = function(elt)
{
	if (document.activeElement != elt)
	{
		return false;
	}

	try
	{
		return elt.matches(':focus-visible');
	}
	catch (e)
	{
		return true;
	}
};

/**
 * The examples of the dialogs by their kind (the default type of the
 * ParseDialog: fromText, mermaid, plantUml and formatSql, and csv): the
 * resource key of the label, the type of the select of the dialog that the
 * example loads (null keeps the type) and its text (a function for a text
 * that is defined elsewhere). The texts are diagrams, not translated.
 */
CodeExamples.sets = {
	fromText: [
		{label: 'exampleKanban', type: 'list', text: 'To Do\nWrite release notes\nUpdate screenshots\n\n' +
			'In Progress\nFix login timeout\nTranslate settings page\n\nDone\nPublish version 2.4'},
		{label: 'exampleProjectPlan', type: 'csvTable', text: 'Task,Owner,Due,Status\n' +
			'Design review,Maria,Mar 4,Done\nAPI changes,Tom,Mar 11,In progress\n' +
			'User testing,Priya,Mar 18,Planned\nLaunch,Team,Mar 25,Planned'},
		{label: 'exampleConceptMap', type: 'diagram', text: 'Customer->places->Order\n' +
			'Order->contains->Product\nOrder->is paid by->Invoice\nCustomer->receives->Invoice\n' +
			'Product->is stored in->Warehouse'},
		{label: 'exampleReleaseCycle', type: 'circle', text: 'Plan->Build\nBuild->Test\n' +
			'Test->Release\nRelease->Monitor\nMonitor->feedback->Plan'},
		{label: 'exampleBuildPipeline', type: 'horizontalFlow', text: 'Commit->Build\n' +
			'Build->Run tests\nRun tests->pass->Deploy to staging\nRun tests->fail->Notify author\n' +
			'Deploy to staging->Release'},
		{label: 'exampleSupportProcess', type: 'verticalFlow', text: 'New ticket->Triage\n' +
			'Triage->known issue->Send help article\nTriage->new bug->Create bug report\n' +
			'Create bug report->Fix and test\nFix and test->Close ticket\nSend help article->Close ticket'},
		{label: 'orgChart', type: 'verticalTree', text: 'CEO\n  Engineering\n    Frontend\n' +
			'    Backend\n  Marketing\n    Content\n    Events\n  Sales'},
		{label: 'exampleSitemap', type: 'horizontalTree', text: 'Home\n  Products\n    Features\n' +
			'    Pricing\n  Docs\n    Getting started\n    API reference\n  Blog\n  Contact'},
		{label: 'exampleCloudServices', type: 'radialTree', text: 'Cloud platform\n  Compute\n' +
			'    Virtual machines\n    Containers\n    Functions\n  Storage\n    Object storage\n' +
			'    Databases\n  Networking\n    VPC\n    CDN\n    DNS'},
		{label: 'exampleAppScreens', type: 'balloonTree', text: 'Mobile app\n  Onboarding\n' +
			'    Sign up\n    Tutorial\n  Shopping\n    Search\n    Cart\n    Checkout\n  Account\n' +
			'    Orders\n    Settings'},
		{label: 'exampleBrainstorm', type: 'mindmap', text: 'Product launch\n  Marketing\n' +
			'    Blog post\n    Newsletter\n    Social media\n  Sales\n    Pricing\n    Demo\n' +
			'  Support\n    FAQ\n    Training'}],
	mermaid: [
		{label: 'flowchart', text: 'flowchart TD\n  A[Order received] --> B{In stock?}\n' +
			'  B -->|Yes| C[Pack and ship]\n  B -->|No| D[Reorder from supplier]\n  D --> C\n' +
			'  C --> E[Send invoice]'},
		{label: 'exampleSequence', text: 'sequenceDiagram\n  participant C as Customer\n' +
			'  participant S as Shop\n  participant P as Payment\n  C->>S: Place order\n' +
			'  S->>P: Charge card\n  P-->>S: Payment confirmed\n  S-->>C: Order confirmation'},
		{label: 'exampleClass', text: 'classDiagram\n  class Customer {\n    +String name\n' +
			'    +String email\n  }\n  class Order {\n    +int id\n    +Date date\n    +total() float\n' +
			'  }\n  class Product {\n    +String name\n    +float price\n  }\n' +
			'  Customer "1" --> "*" Order : places\n  Order "*" --> "*" Product : contains'},
		{label: 'exampleState', text: 'stateDiagram-v2\n  [*] --> Placed\n' +
			'  Placed --> Paid : payment received\n  Paid --> Shipped : packed\n  Shipped --> Delivered\n' +
			'  Placed --> Cancelled : customer cancels\n  Delivered --> [*]\n  Cancelled --> [*]'},
		{label: 'entityRelation', text: 'erDiagram\n  CUSTOMER ||--o{ ORDER : places\n' +
			'  ORDER ||--|{ LINE_ITEM : contains\n  PRODUCT ||--o{ LINE_ITEM : "ordered in"\n' +
			'  CUSTOMER {\n    int id\n    string name\n  }\n  ORDER {\n    int id\n    date created\n  }'},
		{label: 'exampleGantt', text: 'gantt\n  title Website launch\n  dateFormat YYYY-MM-DD\n' +
			'  section Design\n  Wireframes :a1, 2026-03-02, 5d\n  Visual design :a2, after a1, 7d\n' +
			'  section Build\n  Frontend :b1, after a2, 10d\n  Backend :b2, after a1, 12d\n' +
			'  section Launch\n  Testing :c1, after b1, 4d\n  Go live :milestone, after c1, 0d'},
		{label: 'examplePie', text: 'pie title Website traffic\n  "Search" : 45\n  "Social" : 25\n' +
			'  "Direct" : 20\n  "Email" : 10'},
		{label: 'mindmap', text: 'mindmap\n  root((Product launch))\n    Marketing\n      Blog post\n' +
			'      Newsletter\n    Sales\n      Pricing\n      Demo\n    Support\n      FAQ\n      Training'}],
	plantUml: [
		{label: 'exampleSequence', text: '@startuml\nactor User\nparticipant "Web app" as App\n' +
			'participant "Auth service" as Auth\nUser -> App: Log in\nApp -> Auth: Check password\n' +
			'Auth --> App: Session token\nApp --> User: Show dashboard\n@enduml'},
		{label: 'exampleUseCase', text: '@startuml\nleft to right direction\nactor Customer\n' +
			'actor "Support agent" as Agent\nrectangle "Help desk" {\n  Customer -- (Open ticket)\n' +
			'  Customer -- (Track ticket)\n  Agent -- (Answer ticket)\n  Agent -- (Close ticket)\n}\n@enduml'},
		{label: 'exampleClass', text: '@startuml\nclass Customer {\n  name : String\n  email : String\n' +
			'}\nclass Order {\n  id : int\n  date : Date\n  total() : float\n}\nclass Product {\n' +
			'  name : String\n  price : float\n}\nCustomer "1" -- "*" Order : places\n' +
			'Order "*" -- "*" Product : contains\n@enduml'},
		{label: 'exampleActivity', text: '@startuml\nstart\n:Receive order;\nif (In stock?) then (yes)\n' +
			'  :Pack and ship;\nelse (no)\n  :Reorder from supplier;\n  :Pack and ship;\nendif\n' +
			':Send invoice;\nstop\n@enduml'},
		{label: 'exampleComponent', text: '@startuml\n[Web app] --> [API gateway]\n' +
			'[API gateway] --> [Auth service]\n[API gateway] --> [Order service]\n' +
			'[Order service] --> [Payment service]\ndatabase "Orders DB" as DB\n[Order service] --> DB\n@enduml'},
		{label: 'exampleState', text: '@startuml\n[*] --> Placed\nPlaced --> Paid : payment received\n' +
			'Paid --> Shipped : packed\nShipped --> Delivered\nPlaced --> Cancelled : customer cancels\n' +
			'Delivered --> [*]\nCancelled --> [*]\n@enduml'},
		{label: 'mindmap', text: '@startmindmap\n* Product launch\n** Marketing\n*** Blog post\n' +
			'*** Newsletter\n** Sales\n*** Pricing\n*** Demo\n** Support\n*** FAQ\n@endmindmap'},
		{label: 'exampleGantt', text: '@startgantt\n[Design] requires 5 days\n[Build] requires 10 days\n' +
			'[Build] starts at [Design]\'s end\n[Test] requires 4 days\n[Test] starts at [Build]\'s end\n@endgantt'}],
	formatSql: [
		{label: 'exampleShop', text: 'CREATE TABLE customers (\n  id INT PRIMARY KEY,\n' +
			'  name VARCHAR(100),\n  email VARCHAR(255)\n);\nCREATE TABLE orders (\n  id INT PRIMARY KEY,\n' +
			'  customer_id INT,\n  order_date DATE,\n  total DECIMAL(10,2)\n);\nCREATE TABLE products (\n' +
			'  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  price DECIMAL(10,2)\n);'},
		{label: 'blog', text: 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n' +
			'CREATE TABLE posts (\n  id INT PRIMARY KEY,\n  user_id INT,\n  title VARCHAR(200),\n' +
			'  published DATE\n);\nCREATE TABLE comments (\n  id INT PRIMARY KEY,\n  post_id INT,\n' +
			'  user_id INT,\n  body TEXT\n);'},
		{label: 'exampleSchool', text: 'CREATE TABLE students (\n  id INT PRIMARY KEY,\n' +
			'  name VARCHAR(100),\n  grade INT\n);\nCREATE TABLE courses (\n  id INT PRIMARY KEY,\n' +
			'  title VARCHAR(100),\n  teacher VARCHAR(100)\n);\nCREATE TABLE enrollments (\n' +
			'  student_id INT,\n  course_id INT,\n  term VARCHAR(20)\n);'}],
	csv: [
		{label: 'orgChart', text: function()
		{
			return Editor.defaultCsvValue;
		}},
		{label: 'process', text: '## A process: one row per step, next lists the steps after it\n' +
			'# label: %step%\n' +
			'# style: rounded=1;whiteSpace=wrap;html=1;fillColor=%fill%;strokeColor=%stroke%;\n' +
			'# connect: {"from": "next", "to": "id", "style": "endArrow=blockThin;endFill=1;"}\n' +
			'# width: auto\n# height: auto\n# padding: 16\n# ignore: id,fill,stroke,next\n' +
			'# nodespacing: 40\n# levelspacing: 50\n# layout: verticalflow\n' +
			'## CSV starts under this line\nid,step,fill,stroke,next\n' +
			'1,Order received,#dae8fc,#6c8ebf,2\n2,Check stock,#fff2cc,#d6b656,"3,4"\n' +
			'3,Pack and ship,#d5e8d4,#82b366,5\n4,Reorder from supplier,#f8cecc,#b85450,3\n' +
			'5,Send invoice,#d5e8d4,#82b366,'}]
};

/**
 * Returns the examples of the given kind of dialog (see sets) or an empty
 * list.
 */
CodeExamples.get = function(kind)
{
	return (kind != null && Object.prototype.hasOwnProperty.call(CodeExamples.sets, kind)) ?
		CodeExamples.sets[kind] : [];
};

/**
 * Returns the text of the given example.
 */
CodeExamples.getText = function(example)
{
	return (typeof example.text === 'function') ? example.text() : example.text;
};

/**
 * Returns the label of the given example in the language of the editor.
 */
CodeExamples.getLabel = function(example)
{
	return mxResources.get(example.label);
};

/**
 * The first lines of the types of Mermaid diagrams (see getLanguage).
 */
CodeExamples.mermaidTypes = new RegExp('^(graph|flowchart|sequenceDiagram|classDiagram|' +
	'classDiagram-v2|stateDiagram|stateDiagram-v2|erDiagram|journey|gantt|pie|quadrantChart|' +
	'requirementDiagram|gitGraph|mindmap|timeline|zenuml|sankey|sankey-beta|xychart|xychart-beta|' +
	'block|block-beta|packet|packet-beta|kanban|architecture|architecture-beta|radar-beta|' +
	'treemap|treemap-beta|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment)(?![\\w-])');

/**
 * Returns the language that the given code is written in by its first
 * statement: plantUml for @start… (a PlantUML wrapper), mermaid for the
 * type of a Mermaid diagram (after its front matter and comments), else
 * null.
 */
CodeExamples.getLanguage = function(text)
{
	var lines = (text != null) ? String(text).split('\n') : [];
	var front = false;

	for (var i = 0; i < lines.length && i < 200; i++)
	{
		var line = mxUtils.trim(lines[i]);

		if (line == '---' && (front || i == 0 || mxUtils.trim(lines.slice(0, i).join('')).length == 0))
		{
			front = !front;
		}
		else if (!front && line.length > 0 && line.substring(0, 2) != '%%' && line.charAt(0) != '\'')
		{
			if (/^@start[a-z]+\b/i.test(line))
			{
				return 'plantUml';
			}
			else if (CodeExamples.mermaidTypes.test(line))
			{
				return 'mermaid';
			}

			return null;
		}
	}

	return null;
};

/**
 * Returns the number of the first line of the given text that is not empty
 * (1 for empty text).
 */
CodeExamples.getFirstLine = function(text)
{
	var lines = String(text).split('\n');

	for (var i = 0; i < lines.length; i++)
	{
		if (mxUtils.trim(lines[i]).length > 0)
		{
			return i + 1;
		}
	}

	return 1;
};

/**
 * Returns the number of the line (from 1) of the given code that the given
 * error of a parser is about, or null: the line of an error of PlantUML (line
 * of plantUmlSyntaxError and plantUmlUndetected) or the location of a parser,
 * "line N" in its message, the line of a diagram type that is not supported
 * (Mermaid), or the first line of code where the error is about the whole
 * code (PlantUML without @startuml … @enduml, or empty). Safari puts a line
 * on every Error (the line of the script that made it), so the line of other
 * errors is never used.
 */
CodeExamples.getErrorLine = function(error, text)
{
	var count = String(text).split('\n').length;
	var line = null;

	var valid = function(n)
	{
		return (typeof n === 'number' && isFinite(n) && n >= 1 && n <= count) ? Math.floor(n) : null;
	};

	if (error != null && typeof error === 'object')
	{
		if (error.plantUmlSyntaxError || error.plantUmlUndetected)
		{
			line = valid(error.line);
		}

		if (line == null && error.hash != null && error.hash.loc != null)
		{
			line = valid(error.hash.loc.first_line);
		}

		var msg = (typeof error.message === 'string') ? error.message : '';
		var m = (line == null) ? /\bline (\d+)\b/i.exec(msg) : null;

		if (m != null)
		{
			line = valid(parseInt(m[1], 10));
		}

		if (line == null)
		{
			m = /^Unsupported diagram type: (\S+)/.exec(msg);

			if (m != null)
			{
				var lines = String(text).split('\n');

				for (var i = 0; i < lines.length; i++)
				{
					if (mxUtils.trim(lines[i]).substring(0, m[1].length) == m[1])
					{
						line = i + 1;
						break;
					}
				}
			}
			else if (error.plantUmlNoWrapper || error.plantUmlEmpty)
			{
				line = CodeExamples.getFirstLine(text);
			}
		}
	}

	return line;
};

/**
 * Returns the message of the given error of a parser for the preview: its
 * message, or Invalid input for errors of the code of the parser (a type,
 * reference or range error) and errors without a message.
 */
CodeExamples.getErrorMessage = function(error)
{
	var msg = (error != null) ? error.message : null;

	return (typeof msg !== 'string' || mxUtils.trim(msg).length == 0 || error instanceof TypeError ||
		error instanceof ReferenceError || error instanceof RangeError) ?
		mxResources.get('invalidInput') : mxUtils.trim(msg);
};

/**
 * Adds the errors of the preview to the given side of a code dialog (see
 * createCodePreview with the classes of errors): the message and the line
 * of an error, the line marked in the code field of the given editor
 * (setMarkedLine of its codeField) and the text area invalid and described
 * by the message. describeError of the side gets the error and the code that
 * was parsed (the code of the text area if it is null). Options: text (the
 * text area), editor (the element of the
 * code field), kind (the language of the dialog: mermaid or plantUml for
 * the suggestion) and switchTo (a function that gets a language and opens
 * its dialog with the code, or null), createAction (a function that gets a
 * label and a function and returns the element of the suggestion). The
 * suggestion is about the code that was parsed, which may have changed since
 * (an older parse that fails after a change): it opens the other dialog only
 * while the code of the text area is still of its language.
 */
EditorUi.prototype.installCodeErrors = function(side, opts)
{
	var text = opts.text;
	var field = (opts.editor != null) ? opts.editor.codeField : null;

	side.describeError = function(error, code)
	{
		code = (code != null) ? code : text.value;
		var info = {message: CodeExamples.getErrorMessage(error),
			line: CodeExamples.getErrorLine(error, code)};
		var lang = (opts.switchTo != null && opts.createAction != null) ?
			CodeExamples.getLanguage(code) : null;

		// Code of another language offers its dialog
		if (lang != null && lang != opts.kind && (opts.canSwitchTo == null || opts.canSwitchTo(lang)))
		{
			var name = mxResources.get(lang);

			info.action = opts.createAction(mxResources.get('switchCodeLanguage', [name, name]), function()
			{
				// The code goes along as it is now: not if it has changed to
				// another language since it was parsed (the next preview
				// takes the suggestion away)
				if (CodeExamples.getLanguage(text.value) == lang)
				{
					opts.switchTo(lang);
				}
			});
		}

		return info;
	};

	side.markError = function(info, box)
	{
		if (field != null && typeof field.setMarkedLine === 'function')
		{
			field.setMarkedLine((info != null) ? info.line : null);
		}

		if (info != null && box != null)
		{
			text.setAttribute('aria-invalid', 'true');
			text.setAttribute('aria-describedby', box.id);
		}
		else
		{
			text.removeAttribute('aria-invalid');
			text.removeAttribute('aria-describedby');
		}
	};
};

/**
 * Returns a row of example chips for the given side of a code dialog, or
 * null if the dialog has no examples. The skin makes the parts. Options:
 * kind (see sets), text (the text area), select (the type, or null),
 * preview (a function that gets an example, its type and a function to
 * call with the data URI of its image or null), changed (called after
 * an example or Undo changed the code), getState (an optional function
 * that returns what else changes the image, eg. Editable of From Text),
 * skin: {createRow(label, control, undo) (returns the row with the chips
 * and Undo), createChip(label, fn) (returns a button), createUndo(label,
 * fn) (returns a button), classes: {chips, on}}. The
 * side shows the example while a mouse or the focus of the keyboard is on
 * its chip (showExample, see createCodePreview); a tap loads it at once.
 * The examples are also codeExamples of the side (isDirty: the code was
 * changed since it was opened or an example was loaded).
 */
EditorUi.prototype.addCodeExamples = function(side, opts)
{
	var examples = CodeExamples.get(opts.kind);

	if (examples.length == 0 || side.showExample == null)
	{
		return null;
	}

	var text = opts.text;
	var select = opts.select;
	var skin = opts.skin;
	var cache = {};
	var chips = [];
	var current = null;
	var hovered = null;
	var thread = null;
	var loading = false;
	var dirty = false;
	var saved = null;

	var control = document.createElement('div');
	control.className = skin.classes.chips;
	control.setAttribute('role', 'group');
	control.setAttribute('aria-label', mxResources.get('examples'));

	var getType = function(example)
	{
		return (example.type != null) ? example.type : ((select != null) ? select.value : null);
	};

	var hasType = function(type)
	{
		if (select != null)
		{
			for (var i = 0; i < select.options.length; i++)
			{
				if (select.options[i].value == type)
				{
					return true;
				}
			}
		}

		return false;
	};

	var mark = function()
	{
		for (var i = 0; i < chips.length; i++)
		{
			var on = chips[i].codeExample == current;
			chips[i].classList.toggle(skin.classes.on, on);

			if (on)
			{
				chips[i].setAttribute('aria-current', 'true');
			}
			else
			{
				chips[i].removeAttribute('aria-current');
			}
		}
	};

	var setType = function(type)
	{
		if (type != null && select != null && select.value != type && hasType(type))
		{
			select.value = type;
			select.dispatchEvent(new Event('change'));
		}
	};

	var setText = function(value)
	{
		loading = true;

		try
		{
			text.value = value;
			text.setSelectionRange(0, 0);
			text.scrollTop = 0;
			text.scrollLeft = 0;
		}
		finally
		{
			loading = false;
		}
	};

	// The code before the first example that replaced typed code
	var undo = skin.createUndo(mxResources.get('undo'), function()
	{
		if (saved != null)
		{
			var prev = saved;
			saved = null;
			current = null;
			setType(prev.type);
			setText(prev.text);
			dirty = true;
			undo.hidden = true;
			mark();
			opts.changed();
		}
	});

	undo.hidden = true;

	var load = function(example)
	{
		hover(null);

		if (dirty && saved == null)
		{
			saved = {text: text.value, type: (select != null) ? select.value : null};
		}

		setType(example.type);
		setText(CodeExamples.getText(example));
		current = example;
		dirty = false;
		undo.hidden = saved == null;
		mark();
		opts.changed();
	};

	// Shows the example of the given chip in the preview (null shows the
	// preview again), computed once per type, text and look
	var hover = function(example)
	{
		hovered = example;
		window.clearTimeout(thread);

		if (example == null)
		{
			side.hideExample();
		}
		else
		{
			var type = getType(example);
			var key = [type, Editor.isDarkMode(), (opts.getState != null) ? opts.getState() : '',
				CodeExamples.getText(example)].join('\n');
			var hint = mxResources.get('exampleHint', [CodeExamples.getLabel(example)]);

			if (Object.prototype.hasOwnProperty.call(cache, key))
			{
				if (cache[key] != null)
				{
					side.showExample(cache[key], hint);
				}
			}
			else
			{
				thread = window.setTimeout(function()
				{
					if (hovered == example)
					{
						opts.preview(example, type, function(src)
						{
							cache[key] = (src != null) ? src : null;

							if (hovered == example && src != null && document.body.contains(row))
							{
								side.showExample(src, hint);
							}
						});
					}
				}, CodeExamples.hoverDelay);
			}
		}
	};

	for (var i = 0; i < examples.length; i++)
	{
		(function(example)
		{
			var chip = skin.createChip(CodeExamples.getLabel(example), function()
			{
				load(example);
			});

			chip.codeExample = example;

			// Only a mouse or a pen that hovers shows the example: a touch, or a
			// pen that is down, is a tap that loads it with its click at once
			mxEvent.addListener(chip, 'pointerenter', function(evt)
			{
				if (CodeExamples.isHoverPointer(evt))
				{
					hover(example);
				}
			});

			mxEvent.addListener(chip, 'pointerleave', function()
			{
				if (hovered == example && !CodeExamples.hasKeyboardFocus(chip))
				{
					hover(null);
				}
			});

			// The focus of the keyboard: a tap or a click that focuses the chip
			// loads it (its click follows) and shows nothing before
			mxEvent.addListener(chip, 'focus', function()
			{
				if (CodeExamples.hasKeyboardFocus(chip))
				{
					hover(example);
				}
			});

			mxEvent.addListener(chip, 'blur', function()
			{
				if (hovered == example)
				{
					hover(null);
				}
			});

			// Tab shows the preview again before the focus moves, so that what
			// it shows (the action of an error) is next in the order
			mxEvent.addListener(chip, 'keydown', function(evt)
			{
				if (evt.key == 'Tab' && hovered == example)
				{
					hover(null);
				}
			});

			chips.push(chip);
			control.appendChild(chip);
		})(examples[i]);
	}

	var row = skin.createRow(mxResources.get('examples'), control, undo);

	// Typed, pasted or dropped code is replaced with Undo, and an example that
	// was changed (or is replaced by a file) is no longer the example of its
	// chip
	var edited = function(replaced)
	{
		if (!loading)
		{
			dirty = true;

			if (!undo.hidden)
			{
				saved = null;
				undo.hidden = true;
			}

			if (current != null && (replaced || text.value != CodeExamples.getText(current)))
			{
				current = null;
				mark();
			}
		}
	};

	mxEvent.addListener(text, 'input', function()
	{
		edited(false);
	});

	// A dropped file replaces the code once it is read (see ParseDialog),
	// with no input event; a drop without a file changes nothing
	mxEvent.addListener(text, 'drop', function(evt)
	{
		if (evt.dataTransfer != null && evt.dataTransfer.files != null &&
			evt.dataTransfer.files.length > 0)
		{
			edited(true);
		}
	});

	// Another type chosen in the list keeps the code, which is then no longer
	// the example of its chip
	if (select != null)
	{
		mxEvent.addListener(select, 'change', function()
		{
			if (current != null && current.type != null && select.value != current.type)
			{
				current = null;
				mark();
			}
		});
	}

	row.codeExamples = {chips: chips, undo: undo, load: load, hover: hover,
		isDirty: function()
		{
			return dirty;
		},
		getCacheSize: function()
		{
			return Object.keys(cache).length;
		},
		clearCache: function()
		{
			cache = {};
		}};
	side.codeExamples = row.codeExamples;

	return row;
};

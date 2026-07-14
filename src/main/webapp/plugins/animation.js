/**
 * Copyright (c) 2020-2026, JGraph Holdings Ltd
 * Copyright (c) 2020-2026, draw.io AG
 */
/**
 * Surfaces the Extras > Animation menu entry that's hidden by default
 * in the built-in UI. The step-based animation engine and editor live in
 * the core (Editor.AnimationPlayer / AnimationDialog) — this plugin just
 * wraps the Extras menu builder to append the legacy item. Existing
 * `?p=anim` URLs continue to work as before.
 *
 * The in-app entry point for users who don't load this plugin is the
 * "Lightbox animation" section in Edit > Page Setup.
 */
Draw.loadPlugin(function(editorUi)
{
	// The `animation` resource is only loaded when this plugin is
	// loaded — the rest of the editor uses the `effects` key
	// (picker section, custom-action link summary) or a built-in
	// 'Animation' fallback (Page Setup label, animation window
	// title). The action itself ('animation') is registered by the
	// core (see Menus.js) so we just need to surface it in the
	// Extras menu.
	mxResources.parse('animation=Animation');

	// Classic plugin override pattern: wrap the existing Extras menu
	// builder, run it first, then append our own item. Same shape used
	// by props.js, anonymize.js, tags.js etc.
	var extras = editorUi.menus.get('extras');

	if (extras != null)
	{
		var oldFunct = extras.funct;

		extras.funct = function(menu, parent)
		{
			oldFunct.apply(this, arguments);
			editorUi.menus.addMenuItems(menu, ['-', 'animation'], parent);
		};
	}
});

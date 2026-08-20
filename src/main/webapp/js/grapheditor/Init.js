/**
 * Copyright (c) 2006-2021, JGraph Holdings Ltd
 * Copyright (c) 2006-2021, draw.io AG
 */

 // urlParams is null when used for embedding
window.urlParams = window.urlParams || {};

// Public global variables
// DOMPurify allows all data attributes by default, which let a label carry an
// attribute that the embedding application later expands into HTML. Denylisting
// the known-dangerous names cannot work because the host supplies those sinks,
// so data attributes are denied by default and the ones draw.io reads back off
// its own sanitized DOM are allowed explicitly below. Do not trim that list
// without checking the call sites: data-font-src is read by
// Graph.processFontAttributes for custom label fonts in the editor, the viewer
// and SVG export, data-action, data-title, data-message, data-link and
// data-effect are read off the sanitized status container in EditorUi, and
// data-lucid-type and data-lucid-content carry a Lucidchart paste.
// data-icon and data-icon-content stay denied explicitly: they are written by
// the SVG export on the icon wrappers it creates, and the script it injects
// writes their values to innerHTML when the reader hovers the shape. FORBID_ATTR
// is evaluated first, so they remain excluded even if later added to ADD_ATTR.
window.DOM_PURIFY_CONFIG = window.DOM_PURIFY_CONFIG ||
    {ADD_TAGS: ['use', 'foreignObject'], FORBID_TAGS: ['form'],
    FORBID_ATTR: ['data-icon', 'data-icon-content'],
    ALLOWED_URI_REGEXP: /^((?!javascript:).)*$/i,
    HTML_INTEGRATION_POINTS: {'foreignobject': true},
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'content', 'pointer-events',
        'requiredFeatures', 'data-font-src', 'data-action',
        'data-title', 'data-message', 'data-link', 'data-effect',
        'data-lucid-type', 'data-lucid-content']};
window.MAX_REQUEST_SIZE = window.MAX_REQUEST_SIZE  || 10485760;
window.MAX_AREA = window.MAX_AREA || 15000 * 15000;

// URLs for save and export
window.EXPORT_URL = window.EXPORT_URL || '/export';
window.SAVE_URL = window.SAVE_URL || '/save';
window.OPEN_URL = window.OPEN_URL || '/open';
window.RESOURCES_PATH = window.RESOURCES_PATH || 'resources';
window.RESOURCE_BASE = window.RESOURCE_BASE || window.RESOURCES_PATH + '/grapheditor';
window.STENCIL_PATH = window.STENCIL_PATH || 'stencils';
window.IMAGE_PATH = window.IMAGE_PATH || 'images';
window.STYLE_PATH = window.STYLE_PATH || 'styles';
window.CSS_PATH = window.CSS_PATH || 'styles';
window.OPEN_FORM = window.OPEN_FORM || 'open.html';

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// each properties file since only one file is loaded.
window.mxBasePath = window.mxBasePath || 'mxgraph';
window.mxImageBasePath = window.mxImageBasePath || 'mxgraph/images';
window.mxLanguage = window.mxLanguage || urlParams['lang'];
window.mxLanguages = window.mxLanguages || ['de', 'se'];

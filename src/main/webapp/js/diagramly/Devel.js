/*
 * Copyright (c) 2006-2020, JGraph Holdings Ltd
 * 
 * This provides an indirection to make sure the mxClient.js
 * loads before the dependent classes below are loaded. This
 * is used for development mode where the JS is in separate
 * files and the mxClient.js loads other files.
 */
if (!mxIsElectron)
{
	(function()
	{
		var hashes = 'default-src \'self\'; ' +
			'script-src %script-src% \'self\' https://viewer.diagrams.net https://apis.google.com https://*.pusher.com; ';

		var directives = 'connect-src %connect-src% \'self\' https://*.draw.io https://*.diagrams.net ' +
			'https://*.googleapis.com wss://app.diagrams.net wss://*.pusher.com https://*.pusher.com ' +
			'https://api.github.com https://raw.githubusercontent.com https://gitlab.com ' +
			'https://graph.microsoft.com https://my.microsoftpersonalcontent.com https://*.sharepoint.com https://*.sharepoint.de  ' +
			'https://*.1drv.com https://api.onedrive.com https://dl.dropboxusercontent.com https://api.openai.com ' +
			'https://*.google.com https://fonts.gstatic.com https://fonts.googleapis.com https://api.anthropic.com; ' +
			'img-src * data: blob:; media-src * data:; font-src * data:; ' +
			// www.draw.io required for browser data migration to app.diagrams.net and
			// viewer.diagrams.net required for iframe embed preview
			'frame-src %frame-src% \'self\' https://viewer.diagrams.net https://www.draw.io https://*.google.com https://*.sharepoint.com https://login.microsoftonline.com; ' +
			'style-src %style-src% \'self\' https://fonts.googleapis.com \'unsafe-inline\'; ' +
			'base-uri \'none\'; ' +
			'child-src \'self\'; ' +
			'object-src \'none\';';
			
		var csp = hashes + directives;
		var devCsp = csp.
			// Adds script tags and loads shapes with eval
			replace(/%script-src%/g, 'https://www.dropbox.com https://api.trello.com \'unsafe-eval\'').
			// Adds Trello and Dropbox backend storage
			replace(/%connect-src%/g, 'https://*.dropboxapi.com https://trello.com https://api.trello.com https://my.microsoftpersonalcontent.com').
			// Loads common.css from mxgraph
			replace(/%style-src%/g, '').
			replace(/%frame-src%/g, '').
			replace(/  /g, ' ');

		mxmeta(null, devCsp, 'Content-Security-Policy');

		if (urlParams['print-csp'] == '1')
		{
			console.log('Content-Security-Policy');
			// 'wasm-unsafe-eval' allows the inlined libavoid WASM edge router to compile
			// (ships in extensions/atlas/integrate, so app + teams + ac + aj need it);
			// viewer and import serve no libavoid, dev is covered by 'unsafe-eval'
			var app_diagrams_net = csp.replace(/%script-src%/g, 'https://www.dropbox.com https://api.trello.com \'wasm-unsafe-eval\'').
				replace(/%connect-src%/g, 'https://*.dropboxapi.com https://api.trello.com').
				replace(/%frame-src%/g, '').
					replace(/%style-src%/g, '').
					replace(/  /g, ' ') + ' frame-ancestors \'self\' https://teams.microsoft.com https://*.cloud.microsoft https://*.sharepoint.com https://*.sharepoint.de;';
			console.log('app.diagrams.net:', app_diagrams_net);

			var viewer_diagrams_net = hashes.replace(/%script-src%/g, 'https://www.dropbox.com https://api.trello.com https://app.diagrams.net') +
				'connect-src *; ' +
				'img-src * data: blob:; ' +
				'media-src * data:; ' +
				'font-src * data:; ' +
				'style-src \'self\' https://fonts.googleapis.com \'unsafe-inline\'; ' +
				'base-uri \'none\'; ' +
				'object-src \'none\'; ' +
				'worker-src https://viewer.diagrams.net/service-worker.js;'
			console.log('viewer.diagrams.net:', viewer_diagrams_net);

			var teams_diagrams_net = csp
				.replace(/%script-src%/g, '\'wasm-unsafe-eval\'')
				.replace(/%connect-src%/g, 'https://res.cdn.office.net')
				.replace(/%frame-src%/g, '')
				.replace(/%style-src%/g, '')
				.replace(/  /g, ' ') +
				" frame-ancestors 'self' https://teams.microsoft.com https://*.cloud.microsoft;" +
				" worker-src https://app.diagrams.net/service-worker.js;";
				
			console.log('teams.diagrams.net:', teams_diagrams_net);

			var ac_draw_io = csp.replace(/%script-src%/g, 'https://aui-cdn.atlassian.com https://connect-cdn.atl-paas.net \'wasm-unsafe-eval\'').
					replace(/%frame-src%/g, 'https://www.lucidchart.com https://app.lucidchart.com https://lucid.app blob:').
					replace(/%style-src%/g, 'https://aui-cdn.atlassian.com https://*.atlassian.net https://connect-cdn.atl-paas.net').
					replace(/%connect-src%/g, '').
					replace(/  /g, ' ') +
					'worker-src https://ac.draw.io/service-worker.js;';
			console.log('ac.draw.io:', ac_draw_io);

			var aj_draw_io = csp.replace(/%script-src%/g, 'https://aui-cdn.atlassian.com https://connect-cdn.atl-paas.net \'wasm-unsafe-eval\'').
					replace(/%frame-src%/g, 'blob:').
					replace(/%style-src%/g, 'https://aui-cdn.atlassian.com https://*.atlassian.net https://connect-cdn.atl-paas.net').
					replace(/%connect-src%/g, 'https://api.atlassian.com https://api.media.atlassian.com').
					replace(/  /g, ' ') +
					'worker-src https://aj.draw.io/service-worker.js;';
			console.log('aj.draw.io:', aj_draw_io);

			console.log('import.diagrams.net:', 'default-src \'self\'; worker-src blob:; img-src \'self\' blob: data: https://www.lucidchart.com ' +
					'https://app.lucidchart.com https://lucid.app; style-src \'self\' \'unsafe-inline\'; frame-src https://www.lucidchart.com https://app.lucidchart.com https://lucid.app;');
			console.log('Development:', devCsp);

			console.log('Remember to add index.html new hashes to Desktop app (electron.js). In desktop, only newest hashes are needed.');
		}
	})();
}

mxscript(drawDevUrl + 'js/cryptojs/aes.min.js');
mxscript(drawDevUrl + 'js/spin/spin.min.js');
mxscript(drawDevUrl + 'js/deflate/pako.min.js');
mxscript(drawDevUrl + 'js/deflate/base64.js');
mxscript(drawDevUrl + 'js/sanitizer/purify.min.js');
mxscript(drawDevUrl + 'js/rough/rough.min.js');
mxscript(drawDevUrl + 'js/freehand/perfect-freehand.js');

// Uses grapheditor from devhost
mxscript(geBasePath +'/Editor.js');
mxscript(geBasePath +'/EditorUi.js');
mxscript(geBasePath +'/Sidebar.js');
mxscript(geBasePath +'/Graph.js');
mxscript(geBasePath +'/InlineToolbar.js');
mxscript(geBasePath +'/Format.js');
mxscript(geBasePath +'/Shapes.js');
mxscript(geBasePath +'/Actions.js');
mxscript(geBasePath +'/Menus.js');
mxscript(geBasePath +'/Toolbar.js');
mxscript(geBasePath +'/Dialogs.js');
// Loads main classes
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ActiveDirectory.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Advanced.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AlibabaCloud.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AlliedTelesis.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Android.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ArchiMate.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ArchiMate3.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Arrows2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Atlassian.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS3.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS3D.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS4.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-AWS4b.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Azure.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Azure2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Basic.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Bootstrap.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-BPMN.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-C4.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cabinet.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cisco.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cisco19.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-CiscoSafe.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Citrix.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Citrix2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cumulus.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-DFD.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Dynamics365.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-EIP.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Electrical.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ER.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Floorplan.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Flowchart.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-FluidPower.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP3.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCPIcons.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Gmdl.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-IBM.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-IBMCloud.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Infographic.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios7.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Kubernetes.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-LeanMapping.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Mockup.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-MSCAE.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Network.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Network2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Office.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-OpenStack.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-PID.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Rack.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Salesforce.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-SAP.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Signs.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sitemap.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sysml.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ThreatModeling.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-UML25.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Veeam.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Veeam2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-VVD.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-WebIcons.js');

mxscript(drawDevUrl + 'js/diagramly/util/mxJsCanvas.js');
mxscript(drawDevUrl + 'js/diagramly/util/mxAsyncCanvas.js');

mxscript(drawDevUrl + 'js/diagramly/gif/GifEncoder.js');
mxscript(drawDevUrl + 'js/diagramly/gif/AnimatedExport.js');

mxscript(drawDevUrl + 'js/diagramly/DrawioFile.js');
mxscript(drawDevUrl + 'js/diagramly/LocalFile.js');
mxscript(drawDevUrl + 'js/diagramly/LocalLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/StorageFile.js');
mxscript(drawDevUrl + 'js/diagramly/StorageLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/RemoteFile.js');
mxscript(drawDevUrl + 'js/diagramly/RemoteLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/EmbedFile.js');
mxscript(drawDevUrl + 'js/diagramly/Dialogs.js');
mxscript(drawDevUrl + 'js/diagramly/Editor.js');
mxscript(drawDevUrl + 'js/diagramly/EditorUi.js');
mxscript(drawDevUrl + 'js/diagramly/ConfigEditor.js');
mxscript(drawDevUrl + 'js/diagramly/DiffSync.js');
mxscript(drawDevUrl + 'js/diagramly/Settings.js');
mxscript(drawDevUrl + 'js/diagramly/DrawioFilePolling.js');
mxscript(drawDevUrl + 'js/diagramly/DrawioFileSync.js');

//Comments
mxscript(drawDevUrl + 'js/diagramly/DrawioComment.js');
mxscript(drawDevUrl + 'js/diagramly/DriveComment.js');

// Excluded in base.min.js
mxscript(drawDevUrl + 'js/diagramly/DrawioClient.js');
mxscript(drawDevUrl + 'js/diagramly/DrawioUser.js');
mxscript(drawDevUrl + 'js/diagramly/UrlLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/DriveFile.js');
mxscript(drawDevUrl + 'js/diagramly/DriveLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/DriveClient.js');
mxscript(drawDevUrl + 'js/diagramly/DropboxFile.js');
mxscript(drawDevUrl + 'js/diagramly/DropboxLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/DropboxClient.js');
mxscript(drawDevUrl + 'js/diagramly/GitHubFile.js');
mxscript(drawDevUrl + 'js/diagramly/GitHubLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/GitHubClient.js');
mxscript(drawDevUrl + 'js/diagramly/OneDriveFile.js');
mxscript(drawDevUrl + 'js/diagramly/OneDriveLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/OneDriveClient.js');
mxscript(drawDevUrl + 'js/onedrive/mxODPicker.js');
mxscript(drawDevUrl + 'js/diagramly/TrelloFile.js');
mxscript(drawDevUrl + 'js/diagramly/TrelloLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/TrelloClient.js');
mxscript(drawDevUrl + 'js/diagramly/GitLabFile.js');
mxscript(drawDevUrl + 'js/diagramly/GitLabLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/GitLabClient.js');

mxscript(drawDevUrl + 'js/diagramly/App.js');
mxscript(drawDevUrl + 'js/diagramly/Menus.js');
mxscript(drawDevUrl + 'js/diagramly/Pages.js');
mxscript(drawDevUrl + 'js/diagramly/Trees.js');
mxscript(drawDevUrl + 'js/diagramly/Minimal.js');
mxscript(drawDevUrl + 'js/diagramly/DistanceGuides.js');
mxscript(drawDevUrl + 'js/diagramly/mxRuler.js');
mxscript(drawDevUrl + 'js/diagramly/mxFreehand.js');
mxscript(drawDevUrl + 'js/diagramly/P2PCollab.js');
mxscript(drawDevUrl + 'js/diagramly/DevTools.js');

if (!window.DRAWIO_PUBLIC_BUILD)
{
	mxscript(drawDevUrl + 'js/diagramly/Simple.js');
	mxscript(drawDevUrl + 'js/diagramly/vsdx/VsdxExport.js');
}

// ELK layout engine + mxGraph bridge (drawio-elk port, built from
// ../drawio-elk). Exposes window.ELK (engine), window.ElkLayout (facade
// extending mxGraphLayout), window.ElkAdapter, window.ElkApplier.
// Must load BEFORE ElkLayout.js (whose statics decorate ElkLayout) and
// BEFORE drawio-mermaid (which picks ELK up via globalThis.ELK).
mxscript(drawDevUrl + 'js/elk/drawio-elk.min.js');

// ElkLayout editor bindings (run / runWithDialog / DIALOG_FIELDS /
// localStorage settings). Decorates the bundled ElkLayout above with
// the Arrange > Layout menu integration. drawio-elk doesn't ship these
// because they're editor-only.
mxscript(drawDevUrl + 'js/diagramly/ElkLayout.js');

// Mermaid custom parser + cell factory + layout (single bundle built from
// ../drawio-mermaid via esbuild). Uses window.ELK from drawio-elk above.
mxscript(drawDevUrl + 'js/mermaid/drawio-mermaid.min.js');

// PlantUML clean-room parser + cell factory (single bundle built from
// ../drawio-plantuml via esbuild). Exposes window.PlantUml and
// window.mxPlantUmlToDrawio for the native "Diagram" output (the
// default) of the PlantUML insert dialog.
mxscript(drawDevUrl + 'js/plantuml/drawio-plantuml.min.js');

// libavoid-js obstacle-avoiding orthogonal edge router (vendored WASM, see
// js/libavoid-js/README.md). Fixed order: glue (defines AvoidLib) → base64
// wasm payload → loader (decodes it, parks window.__libavoidReady) → the
// shared routing core (defines AvoidRouting; canonical, vendored verbatim by
// drawio-mcp) → the LibavoidRouting editor binding (Arrange > Layout >
// Orthogonal Routing).
mxscript(drawDevUrl + 'js/libavoid-js/libavoid.min.js');
mxscript(drawDevUrl + 'js/libavoid-js/libavoid-wasm.js');
mxscript(drawDevUrl + 'js/libavoid-js/libavoid-loader.js');
mxscript(drawDevUrl + 'js/libavoid-js/libavoid-routing.js');
mxscript(drawDevUrl + 'js/diagramly/LibavoidRouting.js');

// Vsdx/vssx support
mxscript(drawDevUrl + 'js/diagramly/emf/emf-svg.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/mxVsdxCanvas2D.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/bmpDecoder.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/importer.js');
mxscript(drawDevUrl + 'js/jszip/jszip.min.js');

// GraphMl Import
mxscript(drawDevUrl + 'js/diagramly/graphml/mxGraphMlCodec.js');

// Org Chart Layout
if (urlParams['orgChartDev'] == '1')
{
	mxscript(drawDevUrl + 'js/orgchart/bridge.min.js');
	mxscript(drawDevUrl + 'js/orgchart/bridge.collections.min.js');
	mxscript(drawDevUrl + 'js/orgchart/OrgChart.Layout.min.js');
	mxscript(drawDevUrl + 'js/orgchart/mxOrgChartLayout.js');
}

// Miro Import
mxscript(drawDevUrl + 'js/diagramly/miro/MiroImporter.js');

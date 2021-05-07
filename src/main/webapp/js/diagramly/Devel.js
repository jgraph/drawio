/*
 * Copyright (c) 2006-2020, JGraph Ltd
 * 
 * This provides an indirection to make sure the mxClient.js
 * loads before the dependent classes below are loaded. This
 * is used for development mode where the JS is in separate
 * files and the mxClient.js loads other files.
 */
if (!mxIsElectron && location.protocol !== 'http:')
{
	(function()
	{
		var csp = 'default-src \'self\'; ' +
			// storage.googleapis.com is needed for workbox-service-worker
			'script-src %script-src% \'self\' https://viewer.diagrams.net https://storage.googleapis.com ' +
				'https://apis.google.com https://*.pusher.com https://code.jquery.com ' +
				// Below are the SHAs of the two script blocks in index.html.
				// These must be updated here and in the CDN after changes.
				//----------------------------------------------------------//
				//------------- Bootstrap script in index.html -------------//
				//----------------------------------------------------------//
				'\'sha256-5DtSB5mj34lxcEf+HFWbBLEF49xxJaKnWGDWa/utwQA=\' ' +
				// Version 14.6.5
				'\'sha256-8HtpzsH4zj5+RKfTWMxPmWJKBu0OYbn+WuPrLbVky+g=\' ' +
				// Version 14.1.1
				'\'sha256-gCA3yqbX5kV5cXQOyvSd4v54e8cOLCBlaKU4tuhJF3Y=\' ' +
				// Version 14.0.1
				'\'sha256-ZMnCMK9Jg5ijd0Viqw4KAFn39HeC1LrVwervb9uC7Mo=\' ' +
				// Version 14.0.0
				'\'sha256-KgVey3Yy0LCtaUZnD77KXAark2kZ3wS5HGa+tyAkR28=\' ' +
				// Version 13.8.2
				'\'sha256-1k6pyjDIKgd1KTCRcmDfV6Yc9vgQexHRTiO4zUBoKg8=\' ' +
				// Version 13.8.1
				'\'sha256-/fZb/J4FQmI/TwyxqJbvALWSyGVEvnTrlj4ZTzZNKzI=\' ' +
				// Version 13.7.9
				'\'sha256-P4E8pNUYsln6/EUZppjCCe8y8lelBYTfsSyLjjFCE5g=\' ' +
				// Version 13.7.5
				'\'sha256-+CrvFhadGyk1VjhHM/t3R88LNSEKManW3TGSZi9fmHQ=\' ' +
				// Versions before 13.7.5
				'\'sha256-JqdgAC+ydIDMtmQclZEqgbw94J4IeABIfXAxwEJGDJs=\' ' +
				//---------------------------------------------------------//
				//------------- App.main script in index.html -------------//
				//---------------------------------------------------------//
				// Version 13.8.2
				'\'sha256-vS/MxlVD7nbY7AnV+0t1Ap338uF7vrcs7y23KjERhKc=\' ' +
				// Version 13.7.5
				'\'sha256-dIEi9UhRQPcyoE9/RPfkIPLe2mSS8oQzwabGMLAZzGE=\' ' +
				// Versions before 13.7.5
				'\'sha256-4Dg3/NrB8tLC7TUSCbrtUDWD/J6bSLka01GHn+qtNZ0=\' ' +
				//---------------------------------------------------------//
				'; ' +
			'connect-src %connect-src% \'self\' https://*.draw.io https://*.diagrams.net ' +
				'https://*.googleapis.com wss://*.pusher.com https://*.pusher.com ' +
				'https://api.github.com https://raw.githubusercontent.com https://gitlab.com ' +
				'https://graph.microsoft.com https://*.sharepoint.com  https://*.1drv.com ' +
				'https://dl.dropboxusercontent.com ' +
				'https://*.google.com https://fonts.gstatic.com https://fonts.googleapis.com; ' +
			// font-src about: is required for MathJax HTML-CSS output with STIX
			'img-src * data:; media-src * data:; font-src * about:; ' +
			// www.draw.io required for browser data migration to app.diagrams.net and
			// viewer.diagrams.net required for iframe embed preview
			'frame-src %frame-src% \'self\' https://viewer.diagrams.net https://www.draw.io https://*.google.com; ' +
			'style-src %style-src% \'self\' \'unsafe-inline\' https://fonts.googleapis.com;'

		var devCsp = csp.
			// Adds script tags and loads shapes with eval
			replace(/%script-src%/g, 'https://www.dropbox.com https://api.trello.com https://devhost.jgraph.com \'unsafe-eval\'').
			// Adds Trello and Dropbox backend storage
			replace(/%connect-src%/g, 'https://*.dropboxapi.com https://trello.com https://api.trello.com').
			// Loads common.css from mxgraph
			replace(/%style-src%/g, 'https://devhost.jgraph.com').
			replace(/%frame-src%/g, '').
			replace(/  /g, ' ');
		mxmeta(null, devCsp, 'Content-Security-Policy');

		if (urlParams['print-csp'] == '1')
		{
			console.log('Content-Security-Policy');
			var app_diagrams_net = csp.replace(/%script-src%/g, 'https://www.dropbox.com https://api.trello.com').
				replace(/%connect-src%/g, 'https://*.dropboxapi.com https://api.trello.com').
				replace(/%frame-src%/g, '').
					replace(/%style-src%/g, '').
					replace(/  /g, ' ') + ' frame-ancestors \'self\' https://teams.microsoft.com;';
			console.log('app.diagrams.net:', app_diagrams_net);
			// TODO remove https://ajax.googleapis.com April 2022. It's old jquery domain
			var ac_draw_io = csp.replace(/%script-src%/g, 'https://aui-cdn.atlassian.com https://connect-cdn.atl-paas.net https://ajax.googleapis.com https://cdnjs.cloudflare.com').
					replace(/%frame-src%/g, 'https://www.lucidchart.com https://app.lucidchart.com').
					replace(/%style-src%/g, 'https://aui-cdn.atlassian.com https://*.atlassian.net').
					replace(/%connect-src%/g, '').
					replace(/  /g, ' ');
			console.log('ac.draw.io:', ac_draw_io);
			var aj_draw_io = csp.replace(/%script-src%/g, 'https://connect-cdn.atl-paas.net').
					replace(/%frame-src%/g, '').
					replace(/%style-src%/g, 'https://aui-cdn.atlassian.com https://*.atlassian.net').
					replace(/%connect-src%/g, '').
					replace(/  /g, ' ');
			console.log('aj.draw.io:', aj_draw_io);
			console.log('import.diagrams.net:', 'default-src \'self\'; worker-src blob:; img-src \'self\' blob: data: https://www.lucidchart.com ' +
					'https://app.lucidchart.com; style-src \'self\' \'unsafe-inline\'; frame-src https://www.lucidchart.com https://app.lucidchart.com;');
			console.log('Development:', devCsp);
			
			console.log('Header Worker:', 'let securityHeaders =', JSON.stringify({
				online: {
					"Content-Security-Policy" : app_diagrams_net,
					"Permissions-Policy" : "microphone=()"
				},
				teams: {
					"Content-Security-Policy" : app_diagrams_net.replace(/ 'sha256-[^']+'/g, ''),
					"Permissions-Policy" : "microphone=()"
				},
				jira: {
					"Content-Security-Policy" : aj_draw_io,
					"Permissions-Policy" : "microphone=()"
				},
				conf: {
					"Content-Security-Policy" : ac_draw_io,
					"Permissions-Policy" : "microphone=()"
				}
			}, null, 4));
		}
	})();
}

mxscript(drawDevUrl + 'js/cryptojs/aes.min.js');
mxscript(drawDevUrl + 'js/spin/spin.min.js');
mxscript(drawDevUrl + 'js/deflate/pako.min.js');
mxscript(drawDevUrl + 'js/deflate/base64.js');
mxscript(drawDevUrl + 'js/jscolor/jscolor.js');
mxscript(drawDevUrl + 'js/sanitizer/sanitizer.min.js');
mxscript(drawDevUrl + 'js/croppie/croppie.min.js');
mxscript(drawDevUrl + 'js/rough/rough.min.js');

// Uses grapheditor from devhost
mxscript(geBasePath +'/Editor.js');
mxscript(geBasePath +'/EditorUi.js');
mxscript(geBasePath +'/Sidebar.js');
mxscript(geBasePath +'/Graph.js');
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
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cumulus.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-DFD.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-EIP.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Electrical.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ER.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Floorplan.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Flowchart.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-FluidPower.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Gmdl.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-IBM.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Infographic.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios7.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Kubernetes.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-LeanMapping.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Mockup.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-MSCAE.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Network.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Office.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-PID.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Rack.js');
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
mxscript(drawDevUrl + 'js/diagramly/DiffSync.js');
mxscript(drawDevUrl + 'js/diagramly/Settings.js');
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
mxscript(drawDevUrl + 'js/diagramly/DevTools.js');

// Vsdx/vssx support
mxscript(drawDevUrl + 'js/diagramly/vsdx/VsdxExport.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/mxVsdxCanvas2D.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/bmpDecoder.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/importer.js');
mxscript(drawDevUrl + 'js/jszip/jszip.min.js');

// GraphMl Import
mxscript(drawDevUrl + 'js/diagramly/graphml/mxGraphMlCodec.js');

// P2P Collab
mxscript(drawDevUrl + 'js/diagramly/P2PCollab.js');

// Org Chart Layout
if (urlParams['orgChartDev'] == '1')
{
	mxscript(drawDevUrl + 'js/orgchart/bridge.min.js');
	mxscript(drawDevUrl + 'js/orgchart/bridge.collections.min.js');
	mxscript(drawDevUrl + 'js/orgchart/OrgChart.Layout.min.js');
	mxscript(drawDevUrl + 'js/orgchart/mxOrgChartLayout.js');
}

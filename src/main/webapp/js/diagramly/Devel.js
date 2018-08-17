/*
 * $Id: Devel.js,v 1.27 2014/01/08 16:38:06 gaudenz Exp $
 * Copyright (c) 2006-2013, JGraph Ltd
 */
// This provides an indirection to make sure the mxClient.js
// loads before the dependent classes below are loaded. This
// is used for development mode where the JS is in separate
// files and the mxClient.js loads other files.
// Adds external dependencies
mxscript(drawDevUrl + 'js/spin/spin.min.js');
mxscript(drawDevUrl + 'js/deflate/pako.min.js');
mxscript(drawDevUrl + 'js/deflate/base64.js');
mxscript(drawDevUrl + 'js/jscolor/jscolor.js');
mxscript(drawDevUrl + 'js/sanitizer/sanitizer.min.js');

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
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Azure.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Basic.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Bootstrap.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-BPMN.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Cabinet.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-CiscoSafe.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Citrix.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-EIP.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Electrical.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-ER.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Floorplan.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Flowchart.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-GCP2.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Gmdl.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-IBM.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Infographic.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Ios7.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-LeanMapping.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Mockup.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-MSCAE.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Network.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Office.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-PID.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Rack.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sitemap.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Sysml.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-Veeam.js');
mxscript(drawDevUrl + 'js/diagramly/sidebar/Sidebar-WebIcons.js');

mxscript(drawDevUrl + 'js/diagramly/util/mxJsCanvas.js');
mxscript(drawDevUrl + 'js/diagramly/util/mxAsyncCanvas.js');

mxscript(drawDevUrl + 'js/diagramly/DrawioFile.js');
mxscript(drawDevUrl + 'js/diagramly/LocalFile.js');
mxscript(drawDevUrl + 'js/diagramly/LocalLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/StorageFile.js');
mxscript(drawDevUrl + 'js/diagramly/StorageLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/Dialogs.js');
mxscript(drawDevUrl + 'js/diagramly/Editor.js');
mxscript(drawDevUrl + 'js/diagramly/EditorUi.js');
mxscript(drawDevUrl + 'js/diagramly/Settings.js');

// Excluded in base.min.js
mxscript(drawDevUrl + 'js/diagramly/DrawioClient.js');
mxscript(drawDevUrl + 'js/diagramly/DrawioUser.js');
mxscript(drawDevUrl + 'js/diagramly/UrlLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/DriveRealtime.js');
mxscript(drawDevUrl + 'js/diagramly/RealtimeMapping.js');
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
mxscript(drawDevUrl + 'js/diagramly/TrelloFile.js');
mxscript(drawDevUrl + 'js/diagramly/TrelloLibrary.js');
mxscript(drawDevUrl + 'js/diagramly/TrelloClient.js');
mxscript(drawDevUrl + 'js/diagramly/ChatWindow.js');

mxscript(drawDevUrl + 'js/diagramly/App.js');
mxscript(drawDevUrl + 'js/diagramly/Menus.js');
mxscript(drawDevUrl + 'js/diagramly/Pages.js');
mxscript(drawDevUrl + 'js/diagramly/Trees.js');
mxscript(drawDevUrl + 'js/diagramly/Minimal.js');
mxscript(drawDevUrl + 'js/diagramly/DevTools.js');

// Vsdx/vssx support
mxscript(drawDevUrl + 'js/diagramly/vsdx/VsdxExport.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/mxVsdxCanvas2D.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/bmpDecoder.js');
mxscript(drawDevUrl + 'js/diagramly/vsdx/importer.js');
mxscript(drawDevUrl + 'js/jszip/jszip.min.js');

// mxRuler
mxscript(drawDevUrl + 'js/diagramly/ruler/mxRuler.js');

//EquiSpaced Guides
if (urlParams['distanceGuides'] == '1')
{
	mxscript(drawDevUrl + 'js/diagramly/DistanceGuides.js');
}

//GraphMl Import
mxscript(drawDevUrl + 'js/diagramly/graphml/mxGraphMlCodec.js');
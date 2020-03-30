/**
 * Copyright (c) 2006-2019, JGraph Ltd
 * Copyright (c) 2006-2019, draw.io AG
 */
// Overrides of global vars need to be pre-loaded
window.EXPORT_URL = '/export'; //This points to ExportProxyServlet which uses the local export server at port 8000. 
							   //This proxy configuration allows https requests to the export server via Tomcat.
window.PLANT_URL = 'REPLACE_WITH_YOUR_PLANTUML_SERVER';
window.DRAW_MATH_URL = 'math';
window.DRAWIO_CONFIG = null; //Replace with your custom draw.io configurations. For more details, https://desk.draw.io/support/solutions/articles/16000058316
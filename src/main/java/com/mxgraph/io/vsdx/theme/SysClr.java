package com.mxgraph.io.vsdx.theme;

public class SysClr extends OoxmlColor 
{
	private String val, lastClr;

	public SysClr(String val, String lastClr) 
	{
		this.val = val;
		this.lastClr = lastClr;
		//System color depends on the system. So, if lastClr is not given, guess best common system color
		String hexVal = lastClr;
		
		if (hexVal == null) 
		{
			switch(val) 
			{
				case "windowText": hexVal = "000000"; break;
				case "window": hexVal = "FFFFFF"; break;
				//TODO complete the cases! but this is rarely used
//				scrollBar	Scroll Bar System Color
//				background	Background System Color
//				activeCaption	Active Caption System Color
//				inactiveCaption	Inactive Caption System Color
//				menu	Menu System Color
//				windowFrame	Window Frame System Color
//				menuText	Menu Text System Color
//				captionText	Caption Text System Color
//				activeBorder	Active Border System Color
//				inactiveBorder	Inactive Border System Color
//				appWorkspace	Application Workspace System Color
//				highlight	Highlight System Color
//				highlightText	Highlight Text System Color
//				btnFace	Button Face System Color
//				btnShadow	Button Shadow System Color
//				grayText	Gray Text System Color
//				btnText	Button Text System Color
//				inactiveCaptionText	Inactive Caption Text System Color
//				btnHighlight	Button Highlight System Color
//				3dDkShadow	3D Dark System Color
//				3dLight	3D Light System Color
//				infoText	Info Text System Color
//				infoBk	Info Back System Color
//				hotLight	Hot Light System Color
//				gradientActiveCaption	Gradient Active Caption System Color
//				gradientInactiveCaption	Gradient Inactive Caption System Color
//				menuHighlight	Menu Highlight System Color
//				menuBar	Menu Bar System Color
				default:
					hexVal = "FFFFFF";
			}
		}
		color = Color.decodeColorHex(hexVal);
	}
	
	
}

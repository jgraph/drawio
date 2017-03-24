package com.mxgraph.io.vsdx.theme;


public class SrgbClr extends OoxmlColor {
	private String hexVal;
	public SrgbClr(String hexVal) {
		this.hexVal = hexVal;
		color = Color.decodeColorHex(hexVal);
	}
}

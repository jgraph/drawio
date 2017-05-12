package com.mxgraph.io.vsdx.export;

public class ModelExtAttrib 
{
	private double pageScale = 1, 
			pageWidth = 839, pageHeight = 1188, //A4 size in pixels as a default
			gridSize = 10;
	private boolean pageVisible = true, gridEnabled = true, guidesEnabled = true, foldingEnabled = true, 
			shadowVisible = false, tooltips = true, connect = true, arrows = true, mathEnabled = true;
	private String backgroundClr = "#FFFFFF";
	//TODO add backgroundImage support
	
	public double getPageScale() {
		return pageScale;
	}
	public double getPageWidth() {
		return pageWidth;
	}
	public double getPageHeight() {
		return pageHeight;
	}
	public double getGridSize() {
		return gridSize;
	}
	public boolean isPageVisible() {
		return pageVisible;
	}
	public boolean isGridEnabled() {
		return gridEnabled;
	}
	public boolean isGuidesEnabled() {
		return guidesEnabled;
	}
	public boolean isFoldingEnabled() {
		return foldingEnabled;
	}
	public boolean isShadowVisible() {
		return shadowVisible;
	}
	public boolean isTooltips() {
		return tooltips;
	}
	public boolean isConnect() {
		return connect;
	}
	public boolean isArrows() {
		return arrows;
	}
	public boolean isMathEnabled() {
		return mathEnabled;
	}
	public String getBackgroundClr() {
		return backgroundClr;
	}
	public void setPageScale(double pageScale) {
		this.pageScale = pageScale;
	}
	public void setPageWidth(double pageWidth) {
		this.pageWidth = pageWidth;
	}
	public void setPageHeight(double pageHeight) {
		this.pageHeight = pageHeight;
	}
	public void setGridSize(double gridSize) {
		this.gridSize = gridSize;
	}
	public void setPageVisible(boolean pageVisible) {
		this.pageVisible = pageVisible;
	}
	public void setGridEnabled(boolean gridEnabled) {
		this.gridEnabled = gridEnabled;
	}
	public void setGuidesEnabled(boolean guidesEnabled) {
		this.guidesEnabled = guidesEnabled;
	}
	public void setFoldingEnabled(boolean foldingEnabled) {
		this.foldingEnabled = foldingEnabled;
	}
	public void setShadowVisible(boolean shadowVisible) {
		this.shadowVisible = shadowVisible;
	}
	public void setTooltips(boolean tooltips) {
		this.tooltips = tooltips;
	}
	public void setConnect(boolean connect) {
		this.connect = connect;
	}
	public void setArrows(boolean arrows) {
		this.arrows = arrows;
	}
	public void setMathEnabled(boolean mathEnabled) {
		this.mathEnabled = mathEnabled;
	}
	public void setBackgroundClr(String backgroundClr) {
		this.backgroundClr = backgroundClr;
	}
}

package com.mxgraph.io.vsdx;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.geometry.LineTo;
import com.mxgraph.io.vsdx.geometry.MoveTo;
import com.mxgraph.io.vsdx.geometry.Row;
import com.mxgraph.util.mxPoint;

public class mxVsdxGeometryList 
{
	private List<mxVsdxGeometry> geomList = new ArrayList<>();
	private List<mxVsdxGeometry> parentGeomList = null;
	private boolean sortNeeded = false;
	
	public mxVsdxGeometryList(mxVsdxGeometryList parentGeoList) 
	{
		if (parentGeoList != null)
		{
			parentGeomList = parentGeoList.geomList;
			geomList.addAll(parentGeoList.geomList);
		}
	}

	public void addGeometry(Element geoElem)
	{
		mxVsdxGeometry geo = new mxVsdxGeometry(geoElem, parentGeomList);
		
		if (geo.getIndex() < geomList.size())
		{
			geomList.set(geo.getIndex(), geo);
		}
		else
		{
			geomList.add(geo);
			sortNeeded = true;
		}
	}
	
	private void sort()
	{
		if (sortNeeded)
		{
			Collections.sort(geomList, new Comparator<mxVsdxGeometry>() 
			{
				@Override
				public int compare(mxVsdxGeometry g1, mxVsdxGeometry g2) {
					return g1.getIndex() - g2.getIndex();
				}
			});
			sortNeeded = false;
		}
	}
	
	public boolean isNoShow()
	{
		for (mxVsdxGeometry geo : geomList)
		{
			if (!geo.isNoShow()) return false;
		}
		return true;
	}

	public boolean isNoFill()
	{
		for (mxVsdxGeometry geo : geomList)
		{
			if (!(geo.isNoShow() || geo.isNoFill())) return false;
		}
		return true;
	}
	
	public boolean isNoLine()
	{
		for (mxVsdxGeometry geo : geomList)
		{
			if (!(geo.isNoShow() || geo.isNoLine())) return false;
		}
		return true;
	}

	public boolean hasGeom()
	{
		return !geomList.isEmpty();
	}
	
	public int getGeoCount()
	{
		int count = 0;
		
		for (mxVsdxGeometry geo : geomList) 
		{
			if (!geo.isNoShow()) 
				count++;
		}
		
		return count;
	}
	
	private void rotatedPoint(mxPoint pt, double cos, double sin)
	{
		double x1 = pt.getX() * cos - pt.getY() * sin;
		double y1 = pt.getY() * cos + pt.getX() * sin;

		pt.setX(x1);
		pt.setY(y1);
	}

	/**
	 * Returns the list of routing points of a edge shape.
	 * @param parentHeight Height of the parent of the shape.
	 * @return List of mxPoint that represents the routing points.
	 */
	public List<mxPoint> getRoutingPoints(double parentHeight, mxPoint startPoint, double rotation)
	{
		sort();
		
		List<mxPoint> points = new ArrayList<mxPoint>();
		
		//Adding the starting point as a routing point instead of setting the entryX/Y
		points.add(new mxPoint(startPoint));
		
		double offsetX = 0;
		double offsetY = 0;
		
		for (mxVsdxGeometry geo : geomList)
		{
			if (!geo.isNoShow())
			{
				ArrayList<Row> rows = geo.getRows();
				
				for (Row row : rows)
				{
					if (row instanceof MoveTo)
					{
						offsetX = row.getX() != null? row.getX() : 0;
						offsetY = row.getY() != null? row.getY() : 0;
					}
					else if (row instanceof LineTo)
					{
						
						double x = row.getX() != null? row.getX() : 0, y = row.getY() != null? row.getY() : 0;

						mxPoint p = new mxPoint(x, y);
						if (rotation != 0)
						{
							rotation = Math.toRadians(360 - rotation);
							rotatedPoint(p, Math.cos(rotation), Math.sin(rotation));
						}

						x = (p.getX() - offsetX) * mxVsdxUtils.conversionFactor;
						x += startPoint.getX();

						y = ((p.getY() - offsetY) * mxVsdxUtils.conversionFactor) * -1;
						y += startPoint.getY();

						x = Math.round(x * 100.0) / 100.0;
						y = Math.round(y * 100.0) / 100.0;
						
						p.setX(x);
						p.setY(y);
						points.add(p);						
					}
				}
			}
		}

		return points;
	}

	public String getShapeXML(Shape shape)
	{
		mxPoint p = new mxPoint(0, 0);

		StringBuilder parsedGeom = new StringBuilder("<shape strokewidth=\"inherit\"><foreground>");
		int initSize = parsedGeom.length();
		
		int lastGeoStyle = -1;

		//first all geo with fill then without
		lastGeoStyle = processGeo(shape, p, parsedGeom, lastGeoStyle, true);

		lastGeoStyle = processGeo(shape, p, parsedGeom, lastGeoStyle, false);

		if (parsedGeom.length() == initSize)
		{
			return "";
		}
		else
		{
			closePath(parsedGeom, lastGeoStyle);
		}
		
		//System.out.println(parsedGeom);
		
		parsedGeom.append("</foreground></shape>");
		return parsedGeom.toString();
	}

	private int processGeo(Shape shape, mxPoint p, StringBuilder parsedGeom, int lastGeoStyle, boolean withFill) {
		for (mxVsdxGeometry geo : geomList)
		{
			
			if (withFill == geo.isNoFill()) continue;
			
			String str = geo.getPathXML(p, shape);
			
			if (!str.isEmpty())
			{
				int geoStyle = getGeoStyle(geo);
				 
				if (lastGeoStyle == -1) //first one
				{
					parsedGeom.append("<path>");
					parsedGeom.append(str);
				}
				else if (lastGeoStyle != geoStyle) 
				{
					closePath(parsedGeom, lastGeoStyle);
					parsedGeom.append("<path>");
					parsedGeom.append(str);
				}
				else
				{
					//parsedGeom.append("<close/>");
					parsedGeom.append(str);
				}
				lastGeoStyle = geoStyle;
			}
		}
		return lastGeoStyle;
	}

	private int getGeoStyle(mxVsdxGeometry geo) 
	{
		int geoStyle = 0;
		if (!geo.isNoLine() && !geo.isNoFill())
		{
			geoStyle = 1;
		}
		else if (!geo.isNoFill())
		{
			geoStyle = 2;
		}
		else if (!geo.isNoLine())
		{
			geoStyle = 3;
		}
		return geoStyle;
	}

	private void closePath(StringBuilder parsedGeom, int geoStyle) 
	{
		parsedGeom.append("</path>");
		if (geoStyle == 1)
		{
			parsedGeom.append("<fillstroke/>");
		}
		else if (geoStyle == 2)
		{
			parsedGeom.append("<fill/>");
		}
		else if (geoStyle == 3)
		{
			parsedGeom.append("<stroke/>");
		}
	}
	
}

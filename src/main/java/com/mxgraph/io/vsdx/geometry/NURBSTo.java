package com.mxgraph.io.vsdx.geometry;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.util.mxPoint;

public class NURBSTo extends Row 
{
	public NURBSTo(int index, Double x, Double y, Double a, Double b, Double c, Double d, String e) 
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.formulaE = e;
	}

	/**
	 * Holds the NURBS array that is part of the VSDX NURBSTo element, together with some helper functions
	 *
	 */
	private class Nurbs
	{
		
		List<Double> nurbsValues = new ArrayList<Double>();
		
		public Nurbs(String s, double w, double h)
		{
			List<String> n = Arrays.asList(s.split("\\s*,\\s*"));
			
			for (int i = 0; i < n.size(); i++)
			{
				if ((i > 3) && (i % 4 == 0))
				{
					nurbsValues.add(Double.parseDouble(n.get(i)) * 100.0);
				}
				else if ((i > 3) && (i % 4 == 1))
				{
					nurbsValues.add(100 - Double.parseDouble(n.get(i)) * 100.0);
				}
				else
				{
					nurbsValues.add(Double.parseDouble(n.get(i)));
				}
			}
		}
		
		/**
		 * @param lastKnot the last knot outside of the nurbs string. Obtain it with this.getA() 
		 * @return true if knots are ordered by sets of 3
		 */
		public boolean isOrderedByThree(double lastKnot)
		{

			for (int i = 0; i + 2 < (this.getSize()) ; i = i + 3)
			{
					double k = Math.round(this.getKnot((i)) * 100.0) / 100.0;
					double k1 = Math.round(this.getKnot((i + 1)) * 100.0) / 100.0;
					double k2 = Math.round(this.getKnot((i + 2)) * 100.0) / 100.0;

					if (k != k1 || k != k2 || k1 != k2)
					{
						return false;
					}
			}
			
			double k = Math.round(this.getKnot((this.getSize() - 2)) * 10.0) / 10.0;
			double k1 = Math.round(this.getKnot((this.getSize() - 1)) * 10.0) / 10.0;
			double lk = Math.round(lastKnot * 10.0) / 10.0;
			
			if (k != k1 || k != lk || k1 != lk)
			{
				return false;
			}
			
			return true;
		}
		
		/**
		 * @return number of points, not including the last one (which is outside of the nurbs string)
		 */
		public int getSize()
		{
			return ((nurbsValues.size() / 4) - 1);
		}
		
		/**
		 * @return last knot (element knotLast)
		 */
		public double getKnotLast()
		{
			return nurbsValues.get(0);
		}
		
		/**
		 * @return degree of the NURBS (element degree)
		 */
		public double getDegree()
		{
			return nurbsValues.get(1);
		}
		
		/**
		 * @return 0 if X is relative, otherwise X is in the coordinate system of the shape (element xType)
		 */
		public double getXType()
		{
			return nurbsValues.get(2);
		}
		
		/**
		 * @return 0 if Y is relative, otherwise Y is in the coordinate system of the shape (element yType)
		 */
		public double getYType()
		{
			return nurbsValues.get(3);
		}
		
		/**
		 * @return the i-th X coordinate
		 */
		public double getX(int i)
		{
			return nurbsValues.get((i + 1) * 4);
		}
		
		/**
		 * @return the i-th Y coordinate
		 */
		public double getY(int i)
		{
			return nurbsValues.get((i + 1) * 4 + 1);
		}
		
		/**
		 * @return the i-th knot
		 */
		public double getKnot(int i)
		{
			return nurbsValues.get((i + 1) * 4 + 2);
		}
		
		/**
		 * @return the i-th weight
		 */
		public double getWeight(int i)
		{
			return nurbsValues.get((i + 1) * 4 + 3);
		}
	}
	
	/**
	 * Helper class for geometry
	 *
	 */
	@Override
	public String handle(mxPoint p, Shape shape)
	{
		if (this.x != null && this.y != null && this.formulaE != null)
		{
			double h = shape.getHeight();
			double w = shape.getWidth();

			double x = this.x * mxVsdxUtils.conversionFactor;
			double y = this.y * mxVsdxUtils.conversionFactor;
			String eValue = this.formulaE.replace("NURBS(", "");
			eValue = eValue.replace(")", "");
			
			Nurbs nurbs = new Nurbs(eValue, w, h);
			
			if (nurbs.getSize() >= 2)
			{
				double x1 = nurbs.getX(0);
				double y1 = nurbs.getY(0);
				double x2 = nurbs.getX(1);
				double y2 = nurbs.getY(1);
	
				y = y * 100.0 / h;
				x = x * 100.0 / w;
				y = 100 - y;
				x = Math.round(x * 100.0) / 100.0;
				y = Math.round(y * 100.0) / 100.0;
				
				x1 = Math.round(x1 * 100.0) / 100.0;
				y1 = Math.round(y1 * 100.0) / 100.0;
				x2 = Math.round(x2 * 100.0) / 100.0;
				y2 = Math.round(y2 * 100.0) / 100.0;
	
				if (debug != null)
				{
					debug.drawRect(x, y, "");
					debug.drawLine(shape.getLastX(), shape.getLastY(), x, y, "");
				}
				
				shape.setLastX(x);
				shape.setLastY(y);
				
				// solution for degree 3 rational b spline where knots are grouped by sets of 3
				if (nurbs.getDegree() == 3 && nurbs.isOrderedByThree(this.getA()))
				{
					//first control points
					List<mxPoint> cp1 = new ArrayList<mxPoint>();
					//second control points
					List<mxPoint> cp2 = new ArrayList<mxPoint>();
					//nuts
					List<mxPoint> nut = new ArrayList<mxPoint>();
					int nurbsize = nurbs.getSize();
					
					for (int i = 0; i < nurbsize - 1; i = i + 3)
					{
						cp1.add(new mxPoint(nurbs.getX(i), nurbs.getY(i)));
						cp2.add(new mxPoint(nurbs.getX(i + 1), nurbs.getY(i + 1)));
						
						if (i < nurbsize - 2)
						{
							nut.add(new mxPoint(nurbs.getX(i + 2), nurbs.getY(i + 2)));
						}
						else
						{
							nut.add(new mxPoint(x, y));
						}
					}
					
					//form path data
					String result = "";

					for (int i = 0; i < cp1.size(); i++)
					{
						result += "<curve x1=\"" + cp1.get(i).getX() + "\" y1=\"" + cp1.get(i).getY() + 
							      "\" x2=\"" + cp2.get(i).getX() + "\" y2=\"" + cp2.get(i).getY() + 
							      "\" x3=\"" + nut.get(i).getX() + "\" y3=\"" + nut.get(i).getY() + "\"/>\n";
					}
					
					return result;
				}
				else
				{
					return "<curve x1=\"" + String.valueOf(x1) + "\" y1=\"" + String.valueOf(y1) + 
						      "\" x2=\"" + String.valueOf(x2) + "\" y2=\"" + String.valueOf(y2) + 
						      "\" x3=\"" + String.valueOf(x) + "\" y3=\"" + String.valueOf(y) + "\"/>";
				}
			}
		}

		return "";

	}

}

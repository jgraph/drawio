/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.model;

import java.util.StringTokenizer;
import java.util.regex.Pattern;

/**
 * Implements a mechanism for temporary cell Ids.
 */
public class mxCellPath
{

	/**
	 * Defines the separator between the path components. Default is
	 * <code>.</code>.
	 */
	public static String PATH_SEPARATOR = ".";

	/**
	 * Creates the cell path for the given cell. The cell path is a
	 * concatenation of the indices of all cells on the (finite) path to
	 * the root, eg. "0.0.0.1".
	 * 
	 * @param cell Cell whose path should be returned.
	 * @return Returns the string that represents the path.
	 */
	public static String create(mxICell cell)
	{
		String result = "";

		if (cell != null)
		{
			mxICell parent = cell.getParent();

			while (parent != null)
			{
				int index = parent.getIndex(cell);
				result = index + mxCellPath.PATH_SEPARATOR + result;

				cell = parent;
				parent = cell.getParent();
			}
		}

		return (result.length() > 1) ? result.substring(0, result.length() - 1)
				: "";
	}

	/**
	 * Returns the path for the parent of the cell represented by the given
	 * path. Returns null if the given path has no parent.
	 * 
	 * @param path Path whose parent path should be returned.
	 */
	public static String getParentPath(String path)
	{
		if (path != null)
		{
			int index = path.lastIndexOf(mxCellPath.PATH_SEPARATOR);

			if (index >= 0)
			{
				return path.substring(0, index);
			}
			else if (path.length() > 0)
			{
				return "";
			}
		}

		return null;
	}

	/**
	 * Returns the cell for the specified cell path using the given root as the
	 * root of the path.
	 * 
	 * @param root Root cell of the path to be resolved.
	 * @param path String that defines the path.
	 * @return Returns the cell that is defined by the path.
	 */
	public static mxICell resolve(mxICell root, String path)
	{
		mxICell parent = root;
		String[] tokens = path.split(Pattern.quote(PATH_SEPARATOR));

		for (int i = 0; i < tokens.length; i++)
		{
			parent = parent.getChildAt(Integer.parseInt(tokens[i]));
		}

		return parent;
	}
	
	/**
	 * Compares the given cell paths and returns -1 if cp1 is smaller, 0 if
	 * cp1 is equal and 1 if cp1 is greater than cp2.
	 */
	public static int compare(String cp1, String cp2)
	{
		StringTokenizer p1 = new StringTokenizer(cp1, mxCellPath.PATH_SEPARATOR);
		StringTokenizer p2 = new StringTokenizer(cp2, mxCellPath.PATH_SEPARATOR);
		int comp = 0;
		
		while (p1.hasMoreTokens() &&
			p2.hasMoreTokens())
		{
			String t1 = p1.nextToken();
			String t2 = p2.nextToken();
	
			if (!t1.equals(t2))
			{
				if (t1.length() == 0 ||
					t2.length() == 0)
				{
					comp = t1.compareTo(t2);
				}
				else
				{
					comp = Integer.valueOf(t1).compareTo(Integer.valueOf(t2));
				}
				
				break;
			}
		}
		
		// Compares path length if both paths are equal to this point
		if (comp == 0)
		{
			int t1 = p1.countTokens();
			int t2 = p2.countTokens();
			
			if (t1 != t2)
			{
				comp = (t1 > t2) ? 1 : -1;
			}
		}
		
		return comp;
	}

}

package com.mxgraph.io.gliffy.model;

import com.google.gson.annotations.SerializedName;

public class Constraint
{

	public static enum ConstraintType
	{
		@SerializedName("StartPositionConstraint") START_POSITION_CONSTRAINT,
		@SerializedName("EndPositionConstraint") END_POSITION_CONSTRAINT,
		@SerializedName("HeightConstraint") HEIGHT_CONSTRAINT;

		public String toString()
		{
			return this.name();
		}
	}

	static public class ConstraintData
	{
		private int nodeId;

		private float px;

		private float py;

		public int getNodeId()
		{
			return nodeId;
		}

		public void setNodeId(int nodeId)
		{
			this.nodeId = nodeId;
		}

		public float getPx()
		{
			return px;
		}

		public void setPx(float px)
		{
			this.px = px;
		}

		public float getPy()
		{
			return py;
		}

		public void setPy(float py)
		{
			this.py = py;
		}

	}

	private ConstraintType type;

	private ConstraintData StartPositionConstraint;

	private ConstraintData EndPositionConstraint;

	public ConstraintType getType()
	{
		return type;
	}

	public void setType(ConstraintType type)
	{
		this.type = type;
	}

	public ConstraintData getStartPositionConstraint()
	{
		return StartPositionConstraint;
	}

	public void setStartPositionConstraint(
			ConstraintData startPositionConstraint)
	{
		StartPositionConstraint = startPositionConstraint;
	}

	public ConstraintData getEndPositionConstraint()
	{
		return EndPositionConstraint;
	}

	public void setEndPositionConstraint(ConstraintData endPositionConstraint)
	{
		EndPositionConstraint = endPositionConstraint;
	}

}

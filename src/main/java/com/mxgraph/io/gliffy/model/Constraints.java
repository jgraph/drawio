package com.mxgraph.io.gliffy.model;

import java.util.List;

public class Constraints
{
	private List<Constraint> constraints;

	private Constraint startConstraint;

	private Constraint endConstraint;

	public Constraints()
	{
	}

	public List<Constraint> getConstraints()
	{
		return constraints;
	}

	public void setConstraints(List<Constraint> constraints)
	{
		this.constraints = constraints;
	}

	public Constraint getStartConstraint()
	{
		return startConstraint;
	}

	public void setStartConstraint(Constraint startConstraint)
	{
		this.startConstraint = startConstraint;
	}

	public Constraint getEndConstraint()
	{
		return endConstraint;
	}

	public void setEndConstraint(Constraint endConstraint)
	{
		this.endConstraint = endConstraint;
	}

}

package com.mxgraph.io.gliffy.model;

public class Diagram
{

	private String version;

	public Stage stage;

	public Metadata metadata;

	public EmbeddedResources embeddedResources;

	public Diagram()
	{
		super();
	}

	public String getVersion()
	{
		return version;
	}

	public void setVersion(String version)
	{
		this.version = version;
	}

}

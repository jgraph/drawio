package com.mxgraph.io.gliffy.model;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;

public class EmbeddedResources
{

	public static class Resource
	{
		public Integer id;

		public String mimeType;

		public String data;

		public Resource() {
		}

		public String getBase64EncodedData()
		{
			try
			{
				return Base64.encodeBase64String(data.getBytes("UTF-8"));
			}
			catch (UnsupportedEncodingException e)
			{
				throw new RuntimeException(e);
			}
		}
	}

	public List<Resource> resources;

	public Map<Integer, Resource> resourceMap;

	public void setResources(List<Resource> resources)
	{
		this.resources = resources;
	}

	public Resource get(Integer id)
	{
		if (resourceMap == null)
		{
			resourceMap = new HashMap<Integer, Resource>();
			for (Resource r : resources)
			{
				resourceMap.put(r.id, r);
			}
		}

		return resourceMap.get(id);
	}

}

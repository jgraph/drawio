package com.mxgraph.online;

import java.util.HashMap;
import java.util.Map;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.stdimpl.GCacheFactory;

public class CacheFacade {

	private CacheFacade() {}

	public static Cache createCache() throws CacheException
	{
		CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
		Map<Object, Object> properties = new HashMap<>();
		properties.put(MemcacheService.SetPolicy.ADD_ONLY_IF_NOT_PRESENT,
				true);
		properties.put(GCacheFactory.EXPIRATION_DELTA, AbsAuthServlet.COOKIE_AGE); //Cache servlet set it to 300 (5 min), all cache instances are the same so 5 will be enforced

		return cacheFactory.createCache(properties);
	}
}

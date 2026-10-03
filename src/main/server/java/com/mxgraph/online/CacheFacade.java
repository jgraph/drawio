/**
 * Copyright (c) 2020-2026, JGraph Holdings Ltd
 * Copyright (c) 2020-2026, draw.io AG
 */
package com.mxgraph.online;

import java.util.Properties;
import java.util.concurrent.TimeUnit;

import javax.cache.Cache;
import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.configuration.MutableConfiguration;
import javax.cache.expiry.CreatedExpiryPolicy;
import javax.cache.expiry.Duration;
import javax.cache.spi.CachingProvider;

import org.ehcache.jsr107.EhcacheCachingProvider;

/**
 * Public build version of src/main/server/java/com/mxgraph/online/CacheFacade.java,
 * which uses App Engine memcache and is excluded from the public repository.
 * Keep the public methods of both in step.
 */
public class CacheFacade {

	/**
	 * Not shipped in the public build, used if DRAWIO_MEMCACHED_ENDPOINT is
	 * set and its jar was added to WEB-INF/lib.
	 */
	private static final String MEMCACHED_PROVIDER = "org.memcached.jcache.MemcachedCachingProvider";

	private CacheFacade() {}

	public static Cache<String, String> createCache()
	{
		return createCache("cache", 300); // default values (one cache and 5 min)
	}

	public static Cache<String, String> createCache(String name, int expirationDelta)
	{
		String memcachedEndpoint = System.getenv("DRAWIO_MEMCACHED_ENDPOINT");
		CachingProvider provider;
		CacheManager cacheManager;

		if (memcachedEndpoint != null && memcachedEndpoint.length() > 0)
		{
			provider = Caching.getCachingProvider(MEMCACHED_PROVIDER);
			Properties properties = provider.getDefaultProperties();
			properties.setProperty("servers", memcachedEndpoint);
			properties.setProperty(name + ".useSharedClientConnection", "true");
			cacheManager = provider.getCacheManager(
				provider.getDefaultURI(), null, properties);
		}
		else
		{
			provider = Caching.getCachingProvider(EhcacheCachingProvider.class.getName());
			cacheManager = provider.getCacheManager();
		}

		MutableConfiguration<String, String> configuration =
			new MutableConfiguration<String, String>()
				.setStoreByValue(false) //Memcached does not support store by value
				.setExpiryPolicyFactory(CreatedExpiryPolicy.factoryOf(new Duration(TimeUnit.SECONDS, expirationDelta)));
		return cacheManager.createCache(name, configuration);
	}

	/**
	 * Stores the value if the key is absent and returns true if it was stored.
	 */
	@SuppressWarnings("unchecked")
	public static boolean putIfAbsent(Cache cache, Object key, Object value)
	{
		return cache.putIfAbsent(key, value);
	}

	public static String getStatistics()
	{
		//TODO implement this for memcached
		return "NYI";
	}
}

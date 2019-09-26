/**
 * 
 */
package com.aem.sample.core.utils;

import java.util.HashMap;
import java.util.Map;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Piyush
 *
 */
public class JCRUtility {
	private static final Logger LOGGER = LoggerFactory.getLogger(JCRUtility.class);

	private JCRUtility() {

	}

	public static ResourceResolver getResourceResolver(ResourceResolverFactory resourceresolverFactory) {
		return getResourceResolver(resourceresolverFactory, "aemapplicationdataread");
	}

	public static ResourceResolver getResourceResolver(ResourceResolverFactory resourceresolverFactory,
			String username) {
		final Map<String, Object> param = new HashMap<String, Object>();
		param.put(ResourceResolverFactory.SUBSERVICE, username);
		try {
			return resourceresolverFactory.getServiceResourceResolver(param);
		} catch (final org.apache.sling.api.resource.LoginException e) {
			LOGGER.error("LoginException occurred in getResourceResolver method", e);
		}
		return null;
	}
}

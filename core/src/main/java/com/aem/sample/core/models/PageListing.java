package com.aem.sample.core.models;
import java.util.List;
import java.util.ArrayList;
import javax.inject.Inject;
import javax.jcr.Property;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import java.util.Iterator;

import com.aem.sample.core.services.GetChildService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Model(adaptables = { Resource.class })
public class PageListing {

	private static final Logger LOGGER = LoggerFactory.getLogger(PageListing.class);
	/** The current resource. */
	@SlingObject
	private Resource currentResource;

	/** The resource resolver. */
	@Inject
	private ResourceResolver resourceResolver;

	@Inject
	@Optional
	private String pagePath;

	@Inject
	@Optional
	private Property childLinks;
	
	@Inject
    private GetChildService readService;

	public List<String> getChildLinks() {
		List<String> result = null;
		PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
		if(pageManager != null)
		{
			LOGGER.info("pageManager!=null Inside getChildLinks");
			Page page = pageManager.getPage(pagePath);
			result = readService.getChildren(page);
		}
		return result;
	}
	
	/**
	 * @return the pagePath
	 */
	public String getPagePath() {
		return pagePath;
	}
}
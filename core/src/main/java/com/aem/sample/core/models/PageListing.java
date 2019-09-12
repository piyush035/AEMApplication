package com.aem.sample.core.models;

import java.util.LinkedList;
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
	private String logoImagePath;

	@Inject
	@Optional
	private String logoDestinationUrl;
	
	@Inject
	@Optional
	private String pagePath;

	@Inject
	@Optional
	private Property childLinks;

	public List<String> getChildLinks() {
		final List<String> childList = new ArrayList<String>();
//		childList.add("Anand");
//		childList.add("Rohit Mishra");
//		
//		return childList;
		
		try {
			Resource resource = resourceResolver.getResource(pagePath);
			if(resource!=null)
			{
				PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
				Page page = pageManager.getPage(pagePath);
				LOGGER.info("Inside getChildLinks");
				//Page parentPage = resource.adaptTo(Page.class);
//				if(parentPage!=null)
//				{
					Iterator<Page> listChildPages = page.listChildren();
					while (listChildPages.hasNext()) {
						Page childPage = listChildPages.next();
						
						childList.add(childPage.getTitle());
						
					}
					
				//}
			}			
		}
		catch(Exception e) { e.printStackTrace();}
		
		//childList.add("Anand");
		//childList.add("Maurya");
		return childList;
	}
	
	

	/**
	 * @return the logoImagePath
	 */
	public String getLogoImagePath() {
		return logoImagePath;
	}
	
	/**
	 * @return the headerTitle
	 */
	public String getPagePath() {
		return pagePath;
	}

	/**
	 * @return the logoDestinationUrl
	 */
	public String getLogoDestinationUrl() {
		return logoDestinationUrl;
	}
}
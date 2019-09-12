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

	public List<String> getChildLinks() {
		final List<String> childList = new ArrayList<String>();
		
		try {
			//Not used: TO DO: To be removed once I write service
			Resource resource = resourceResolver.getResource(pagePath);
			if(resource!=null)
			{
				PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
				if(pageManager != null)
				{
					Page page = pageManager.getPage(pagePath);
					if(page != null)
					{
						LOGGER.info("Inside getChildLinks");
						
						Iterator<Page> listChildPages = page.listChildren();
							while (listChildPages.hasNext()) {
								Page childPage = listChildPages.next();
								if(childPage != null)
								{
									childList.add(childPage.getTitle());
								}
							}
					}
				}
				
			}			
		}
		catch(Exception e) { e.printStackTrace();}
		return childList;
	}
	
	/**
	 * @return the pagePath
	 */
	public String getPagePath() {
		return pagePath;
	}
}
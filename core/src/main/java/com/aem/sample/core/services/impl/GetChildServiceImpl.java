package com.aem.sample.core.services.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.inject.Inject;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.aem.sample.core.models.PageListing;
import com.aem.sample.core.services.GetChildService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

/**
 *
 * 
 * Implementation of ReadJsonService
 */
@Component(immediate = true, service = GetChildService.class)
public class GetChildServiceImpl implements GetChildService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(GetChildServiceImpl.class);
	
	/**
	 * Overridden method which will get all children of the input page
	 */
	@Override
	public List<String> getChildren(Page page) {
		
		LOGGER.info("Inside getChildLinks");
		final List<String> childList = new ArrayList<String>();
				
				try {
					if(page != null)
					{
						LOGGER.info("page!=null Inside getChildLinks");
								
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
				catch(Exception e) { 
					LOGGER.info("Inside Exception");
					e.printStackTrace();
				}
				return childList;
	}

}

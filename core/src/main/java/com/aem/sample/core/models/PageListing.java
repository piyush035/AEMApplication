/**
 * 
 */
package com.aem.sample.core.models;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Source;
import com.day.cq.wcm.api.Page;


@Model(adaptables = SlingHttpServletRequest.class)
public class PageListing {
	@Inject
	@Source("sling-object")
	private ResourceResolver resourceResolver;
	private List<ListPageDetail> datafromModelList = new ArrayList<ListPageDetail>();
	
	public List<ListPageDetail> getDatafromModelList() {
		try {
			Resource resource = resourceResolver.getResource("/content/AEMApplication/en");
			if(resource!=null)
			{
				Page parentPage = resource.adaptTo(Page.class);
				if(parentPage!=null)
				{
					Iterator<Page> listChildPages = parentPage.listChildren();
					while (listChildPages.hasNext()) {
						Page childPage = listChildPages.next();
						ListPageDetail detail = new ListPageDetail();
						detail.setTitle(childPage.getTitle());
						detail.setDescription(childPage.getDescription());
						datafromModelList.add(detail);
					}
				}
			}			
		}
		catch(Exception e) { e.printStackTrace();}
		return datafromModelList;
	}
}

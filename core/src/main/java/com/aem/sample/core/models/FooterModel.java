/**
 * package for core models
 */
package com.aem.sample.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Anand
 *
 */
public class FooterModel {
	private static final Logger LOGGER = LoggerFactory.getLogger(FooterModel.class);

	/** The current resource. */
	@SlingObject
	private Resource currentResource;

	/** The resource resolver. */
	@Inject
	private ResourceResolver resourceResolver;
	
	@Inject
	@Optional
	private String footerTitle;
	
	@Inject
	@Optional
	private String logoImagePath;

	@Inject
	@Optional
	private String logoDestinationUrl;
	
	
	/**
	 * @return the footerTitle
	 */
	public String getFooterTitle() {
		return footerTitle;
	}
	
	/**
	 * @return the logoImagePath
	 */
	public String getLogoImagePath() {
		return logoImagePath;
	}
	
	/**
	 * @return the logoDestinationUrl
	 */
	public String getLogoDestinationUrl() {
		return logoDestinationUrl;
	}
}

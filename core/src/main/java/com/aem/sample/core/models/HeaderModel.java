package com.aem.sample.core.models;

import java.util.LinkedList;
import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.sample.core.dto.LinksDTO;
import com.aem.sample.core.helper.JSONHelper;

@Model(adaptables = { Resource.class })
public class HeaderModel {

	private static final Logger LOGGER = LoggerFactory.getLogger(HeaderModel.class);

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
	private String headerTitle;

	@Inject
	@Default(intValues = {})
	private String[] headerLinks;
	
	public List<LinksDTO> getHeaderLinks() {
		LOGGER.info("Inside getHeaderLinks method ");
		final List<LinksDTO> headerLinksDTOList = new LinkedList<LinksDTO>();
		for (final String json : headerLinks) {
			LinksDTO linkDto = JSONHelper.getJSONObjectFromString(json, new LinksDTO());
			headerLinksDTOList.add(linkDto);
		}
		LOGGER.info("Existing from getHeaderLinks method with parameter :: {}", headerLinksDTOList);
		return headerLinksDTOList;
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
	public String getHeaderTitle() {
		return headerTitle;
	}

	/**
	 * @return the logoDestinationUrl
	 */
	public String getLogoDestinationUrl() {
		return logoDestinationUrl;
	}
}
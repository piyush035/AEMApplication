package com.aem.sample.core.models;

import java.util.LinkedList;
import java.util.List;

import javax.inject.Inject;
import javax.jcr.Property;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aem.sample.core.dto.HeaderLinksDTO;
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
	private Property headerLinks;

	public List<HeaderLinksDTO> getHeaderLinks() {
		LOGGER.debug("Inside getHeaderLinks method ");
		final List<HeaderLinksDTO> headerLinksDTOList = new LinkedList<HeaderLinksDTO>();
		try {
			final List<JSONObject> links = JSONHelper.getJSONListfromProperty(this.headerLinks);
			for (JSONObject jsonObject : links) {
				HeaderLinksDTO headerLinksDTO = new HeaderLinksDTO();
				headerLinksDTO.setLink(jsonObject.optString("link"));
				headerLinksDTO.setMenuLabel(jsonObject.optString("menuLabel"));
				headerLinksDTOList.add(headerLinksDTO);
			}
		} catch (final Exception e) {
			LOGGER.error("Exception occurred in getHeaderLinks method" + e);
		}
		LOGGER.debug("Existing from getHeaderLinks method with parameter :: {}", headerLinksDTOList);
		return headerLinksDTOList;
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
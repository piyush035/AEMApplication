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
public class GlobalFooterModel {

	private static final Logger LOGGER = LoggerFactory.getLogger(GlobalFooterModel.class);

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
	private String footerTitle;
	
	@Inject
	@Optional
	private String footerDescription;

	@Inject
	@Optional
	private Property footerLinks;

	public List<HeaderLinksDTO> getFooterLinks() {
		LOGGER.debug("Inside getFooterLinks method ");
		final List<HeaderLinksDTO> footerLinksDTOList = new LinkedList<HeaderLinksDTO>();
		try {
			final List<JSONObject> links = JSONHelper.getJSONListfromProperty(this.footerLinks);
			for (JSONObject jsonObject : links) {
				HeaderLinksDTO footerLinksDTO = new HeaderLinksDTO();
				footerLinksDTO.setLink(jsonObject.optString("link"));
				footerLinksDTO.setMenuLabel(jsonObject.optString("menuLabel"));
				footerLinksDTOList.add(footerLinksDTO);
			}
		} catch (final Exception e) {
			LOGGER.error("Exception occurred in getFooterLinks method" + e);
		}
		return footerLinksDTOList;
	}

	/**
	 * @return the logoImagePath
	 */
	public String getLogoImagePath() {
		return logoImagePath;
	}
	
	/**
	 * @return the footerTitle
	 */
	public String getFooterTitle() {
		return footerTitle;
	}
	
	/**
	 * @return the footerDescription
	 */
	public String getFooterDescription() {
		return footerDescription;
	}

	/**
	 * @return the logoDestinationUrl
	 */
	public String getLogoDestinationUrl() {
		return logoDestinationUrl;
	}
}
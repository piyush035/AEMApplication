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
	private String footerTitle;

	@Inject
	@Optional
	private String footerDescription;

	@Inject
	@Default(intValues = {})
	private String[] footerLinks;

	public List<LinksDTO> getFooterLinks() {
		LOGGER.debug("Inside getFooterLinks method ");
		final List<LinksDTO> footerLinksDTOList = new LinkedList<LinksDTO>();
		for (final String json : footerLinks) {
			LinksDTO linkDto = JSONHelper.getJSONObjectFromString(json, new LinksDTO());
			footerLinksDTOList.add(linkDto);
		}
		return footerLinksDTOList;
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

}
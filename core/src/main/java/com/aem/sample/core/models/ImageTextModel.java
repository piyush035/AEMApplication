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
public class ImageTextModel {

	private static final Logger LOGGER = LoggerFactory.getLogger(ImageTextModel.class);

	@Inject
	@Optional
	private String imagePath;

	@Inject
	@Optional
	private String text;
	
	@Inject
	@Optional
	private String alignmentText;

	/**
	 * @return the imagePath
	 */
	public String getImagePath() {
		return imagePath;
	}
	
	/**
	 * @return the text
	 */
	public String getText() {
		return text;
	}

	/**
	 * @return the alignmentText
	 */
	public String getAlignmentText() {
		return alignmentText;
	}
}
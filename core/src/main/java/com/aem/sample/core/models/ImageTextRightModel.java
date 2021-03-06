package com.aem.sample.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = { Resource.class })
public class ImageTextRightModel {

	private static final Logger LOGGER = LoggerFactory.getLogger(ImageTextRightModel.class);

	@Inject
	@Optional
	private String imagePath;

	@Inject
	@Optional
	private String title;

	@Inject
	@Optional
	private String description;

	/**
	 * @return the imagePath
	 */
	public String getImagePath() {
		return imagePath;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}
}

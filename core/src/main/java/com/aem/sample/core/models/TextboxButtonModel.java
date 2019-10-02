package com.aem.sample.core.models;

import javax.jcr.Property;
import javax.inject.Inject;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.aem.sample.core.services.ReadJsonService;

@Model(adaptables = { Resource.class })
public class TextboxButtonModel {

	private static final Logger LOGGER = LoggerFactory.getLogger(TextboxButtonModel.class);

	/** The current resource. */
	@SlingObject
	private Resource currentResource;

	@Inject
	private ReadJsonService jsonService;

	@Inject
	@Optional
	private Property records;

	//getRecords it reads json from service
	public String getRecords() {
		String result = null;
		LOGGER.info("Inside getRecords");
		result = jsonService.getData();
		return result;
	}

}

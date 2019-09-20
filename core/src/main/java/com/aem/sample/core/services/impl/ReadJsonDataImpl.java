package com.aem.sample.core.services.impl;

import org.osgi.service.component.annotations.Component;
import static com.aem.sample.core.constants.AppConstants.URL;
import com.aem.sample.core.services.ReadJsonService;
import com.aem.sample.core.utils.Network;

/**
 * @author Anand
 *
 * Implementation of ReadJsonService
 */
@Component(immediate = true, service = ReadJsonService.class)
public class ReadJsonDataImpl implements ReadJsonService {


	/**
	 * Overridden method which will read the JSON data via an HTTP GET call
	 */
	@Override
	public String getData() {

		String response = Network.readJson(URL);

		return response;
	}

}

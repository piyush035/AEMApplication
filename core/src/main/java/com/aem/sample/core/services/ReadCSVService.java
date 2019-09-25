package com.aem.sample.core.services;
import java.util.List;

/**
 *
 *
 * Service which will be exposed
 */
public interface ReadCSVService {

	/**
	 * @return JSON String
	 */
	public List<String> getCountries();
}

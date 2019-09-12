package com.aem.sample.core.services;

import java.util.List;

import com.day.cq.wcm.api.Page;

/**
 * 
 * 
 * Service which will be exposed
 */
public interface GetChildService {

	/**
	 * @return JSON String
	 */
	public List<String> getChildren(Page page);
}

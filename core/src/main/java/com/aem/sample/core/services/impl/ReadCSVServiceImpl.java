package com.aem.sample.core.services.impl;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.aem.sample.core.services.ReadCSVService;
import com.aem.sample.core.utils.JCRUtility;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Session;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.omg.CORBA.SystemException;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;

/**
 * @author Anand
 *
 * Implementation of ReadCSVService
 */
@Component(immediate = true, service = ReadCSVService.class)
public class ReadCSVServiceImpl implements ReadCSVService {

	private static final Logger LOGGER = LoggerFactory.getLogger(ReadCSVServiceImpl.class);

	
	@Reference    
    private ResourceResolverFactory resolverFactory;
	/**
	 * Overridden method which will read the JSON data via an HTTP GET call
	 */
	
	
	@Override
	public List<String> getCountries() {

		LOGGER.debug("Inside getCountries list method amit");
		final List<String> empList = new ArrayList<String>();
		
		String csvFile = "/Users/anand/Desktop/countries.csv";
        String line = "";
        String cvsSplitBy = ",";
        Session session = null;
        ResourceResolver resolver = null;
        Resource resource=null;
        
        	LOGGER.debug("before resolver amit");
        	resolver = JCRUtility.getResourceResolver(resolverFactory);
            session = resolver.adaptTo(Session.class);
            LOGGER.debug("after resolver amit :: "+resolver);
            resource = resolver.getResource("/content/dam/AEMApplication/employeeDetails");
            LOGGER.debug("resource amit :: "+resource);
            try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            	LOGGER.debug("BufferedReader  amit:: "+br);
        		 Node node = resource.adaptTo(Node.class); 
        		 LOGGER.debug("node is amit:: "+node);
        		 while ((line = br.readLine()) != null) {
        			 empList.add("Anand"); 
        			 LOGGER.debug("line is amit:: "+line);
        			 String[] employee = line.split(cvsSplitBy);
	        		 String employeeId = employee[4];
	        		 LOGGER.debug("employee is amit:: "+employee);
	        		 Node newNode = node.addNode(employeeId, "nt:unstructured");
	        		 newNode.setProperty("name", employee[5]);
	        		 newNode.setProperty("department", employee[2]);
	        		 newNode.setProperty("tagging", employee[3]);
	        		 LOGGER.debug("newNode is amit:: "+newNode);
	        		 empList.add(employee[5]);
	        		 LOGGER.debug("empList is amit:: "+empList);
	        		 session.save();
        		  
        		 } 
        		 
            }
			catch (IOException e) { 
				 e.printStackTrace();
				 empList.add("IOException"); 
			 }
			catch (RepositoryException e) {
					e.printStackTrace(); 
					empList.add("RepositoryException"); 
			}
            LOGGER.debug("empList before return is :: "+empList);
		return empList;
	}

}

package com.aem.sample.core.services.impl;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.aem.sample.core.services.ReadCSVService;
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

		LOGGER.debug("Inside getCountries list method");
		final List<String> empList = new ArrayList<String>();
		
		String csvFile = "/Users/anand/Desktop/countries.csv";
        String line = "";
        String cvsSplitBy = ",";
        Session session = null;
        ResourceResolver resolver = null;
        Resource resource=null;
        
        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
        	LOGGER.debug("before resolver cc");
        	//resolver = factory.getAdministrativeResourceResolver(null);
        	
        	
        	final Map<String, Object> param = new HashMap<String, Object>();
            param.put(ResourceResolverFactory.SUBSERVICE, "aemapplication");
            try {
            	LOGGER.debug("resolverFactory "+resolverFactory);
                resolver = resolverFactory.getServiceResourceResolver(param);
            } catch (final org.apache.sling.api.resource.LoginException e) {
                LOGGER.error("LoginException occurred in getResourceResolver method", e);
            }           
        	LOGGER.debug("value of resolver"+resolver);
            session = resolver.adaptTo(Session.class);
            LOGGER.debug("value of session"+session);
            
            LOGGER.debug("after resolver a");
            resource = resolver.getResource("/content/dam/AEMApplication/employeeDetails");


            Node node = resource.adaptTo(Node.class);
            
            

            while ((line = br.readLine()) != null) {

                // use comma as separator
                String[] employee = line.split(cvsSplitBy);
                
                String employeeId = employee[4];
                
				Node newNode = node.addNode(employeeId, "nt:unstructured");
				
				empList.add(employee[5]);
            }
            session.save();

        } catch (IOException e) {
            e.printStackTrace();
            empList.add("IOException");
        } 
        catch (RepositoryException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			empList.add("RepositoryException");
		}
        
        empList.add("Anand");
        empList.add("fffffjhjgjgh");

		return empList;
	}

}

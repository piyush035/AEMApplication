package com.aem.sample.core.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONArray;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParser;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

/**
 * @author Anand
 *
 * This class shows the usage of SlingPostServlet
 */
@Component(service = Servlet.class, property = { Constants.SERVICE_DESCRIPTION + "=Simple Demo Post Servlet",
		"sling.servlet.methods=" + HttpConstants.METHOD_POST, "sling.servlet.paths=" + "/bin/submitemployeedata" })
public class EmployeeServlet extends SlingAllMethodsServlet {

	/**
	 * Generated serialVersionUID
	 */
	private static final long serialVersionUID = -159625176093879129L;
	
	/**
	 * Logger
	 */
	private static final Logger log = LoggerFactory.getLogger(EmployeeServlet.class);
	
	/**
	 * Overridden doPost() method which is invoked when an HTTP post request is made
	 */
	@Override
	protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) {

		try {
			
			/**
			 * Getting the instance of resource resolver from the request
			 */
			ResourceResolver resourceResolver = request.getResourceResolver();
			
			/**
			 * Getting the resource object via path
			 */
			Resource resource = resourceResolver.getResource("/content/dam/AEMApplication/postempdetails");

			log.debug("Resource is at path {}", resource.getPath());

			/**
			 * Adapt the resource to javax.jcr.Node type
			 */
			Node node = resource.adaptTo(Node.class);
			/**
			 * Getting an instance of BufferedReader to read the response returned
			 */
			BufferedReader in = request.getReader();
			/**
			 * String which will read the response line by line
			 */
			String inputLine;

			/**
			 * StringBuffer object to append the string as a whole
			 */
			StringBuffer body = new StringBuffer();

			/**
			 * Read until empty line is encountered
			 */
			while ((inputLine = in.readLine()) != null) {

				/**
				 * Append each line to make the response as a whole
				 */
				body.append(inputLine);
			}

			/**
			 * Closing the BufferedReader to avoid memory leaks
			 */
			in.close();

			/**
			 * Return the response
			 */
			String requestBody = body.toString();
			log.debug("requestBody is "+ requestBody);
			
			JsonObject convertedObject = new Gson().fromJson(requestBody, JsonObject.class);

			log.debug("convertedObject is "+ convertedObject);
			
		    JsonArray jarray = convertedObject.getAsJsonArray("employees");
		    
		    for (JsonElement emp : jarray) {
		        JsonObject paymentObj = emp.getAsJsonObject();
		        String     empid     = paymentObj.get("EmpId").getAsString();
		        String     empname = paymentObj.get("Name").getAsString();
		        
				/**
				 * Create a new node with name and primary type and add it below the path specified by the resource
				 */
		        
		        Node newNode;
		        if(!node.hasNode(empid))
		        {
		        	log.debug("node is new"+ node);
		        	
		        	 newNode = node.addNode(empid, "nt:unstructured");
					
					/**
					 * Setting a name property for this node
					 */
		        	 newNode.setProperty("name", empname);
		        }
					
		        else
		        {
		        	node.update(empid);
		        	newNode = node.getNode(empid);
		        	newNode.setProperty("name", empname);
		        }
		        /**
				 * Commit the changes to JCR
				 */
				resourceResolver.commit();
				
		    }	
		} 
		catch (RepositoryException e) {
			
			log.error(e.getMessage(), e);
			
			e.printStackTrace();
			
		} 
		catch (PersistenceException e) {
			
			log.error(e.getMessage(), e);
			
			e.printStackTrace();		
		}
		catch (IOException e) {
			e.printStackTrace();
		}

	}
}
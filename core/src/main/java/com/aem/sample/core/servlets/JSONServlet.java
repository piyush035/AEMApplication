package com.aem.sample.core.servlets;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import static com.aem.sample.core.constants.AppConstants.requestURL;

import java.io.BufferedReader;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import com.aem.sample.core.utils.NetworkConnection;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Anand
 *
 * This servlet uses the HTTP GET method to read a data from the RESTful webservice
 */
@Component(service = Servlet.class, property = {
		Constants.SERVICE_DESCRIPTION + "=JSON Servlet to read the data from the external webservice",
		"sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.paths=" + "/bin/readjson" })
public class JSONServlet extends SlingSafeMethodsServlet {


	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * Logger
	 */
	private static final Logger log = LoggerFactory.getLogger(JSONServlet.class);

	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {

		try {
			
	        String idParam = request.getHeader("id");
	        String uidParam = request.getHeader("uid");

			log.debug("Id Param is "+ idParam);
			log.debug("uidParam is"+ uidParam);

			log.debug("Reading the data from the webservice");

			/**
			 * Getting the JSON string from the web service
			 */
			String responseString = NetworkConnection.readJson(requestURL);
			JsonArray convertedObject = new Gson().fromJson(responseString, JsonArray.class);
			JsonObject resultjson = null;
			for (JsonElement emp : convertedObject) {
				JsonObject employee = emp.getAsJsonObject();
		        String     uidk     = employee.get("userId").getAsString();
		        String     idk = employee.get("id").getAsString();
		        
		        log.debug("uidk is::"+uidk);
		        log.debug("idk is::"+idk);
		        
		        if((idParam.equals(uidk)) && (uidParam.equals(idk)))
		        {
		        	String title  = employee.get("title").getAsString();
			        
			        log.debug("resultStr is::"+title);
			        
			        resultjson = new JsonObject();
			        resultjson.add("completed", employee.get("completed"));
			        resultjson.add("title", employee.get("title"));
			        
			        break;
		        }
			}

			/**
			 * Writing the entire JSON string on the browser
			 */
			if(resultjson != null)
			{
				response.getWriter().println(resultjson);
			}
		} catch (Exception e) {

			log.error(e.getMessage(), e);
			log.debug("Exception occoured");
		}
	}

}

package com.aem.sample.core.servlets;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import static com.aem.sample.core.constants.AppConstants.requestURL;
import com.aem.sample.core.utils.NetworkConnection;
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

			log.debug("Reading the data from the webservice");

			/**
			 * Getting the JSON string from the web service
			 */
			String responseString = NetworkConnection.readJson(requestURL);

			/**
			 * Writing the entire JSON string on the browser
			 */
			response.getWriter().println(responseString);

		} catch (Exception e) {

			log.error(e.getMessage(), e);
		}
	}

}

/**
 * 
 */
package com.aem.sample.core.helper;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Property;
import javax.jcr.Value;

import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Piyush
 *
 */
public class JSONHelper {
	private JSONHelper() {

	}

	private static final Logger LOGGER = LoggerFactory.getLogger(JSONHelper.class);

	public static List<JSONObject> getJSONListfromProperty(Property property) {
		final List<JSONObject> datalist = new ArrayList<JSONObject>();
		if (property != null) {
			JSONObject obj = null;
			Value[] values = null;
			try {
				if (property.isMultiple()) {
					values = property.getValues();
				} else {
					values = new Value[1];
					values[0] = property.getValue();
				}
				for (final Value val : values) {
					obj = new JSONObject(val.getString());
					datalist.add(obj);

				}
			} catch (Exception ex) {
			}
		}

		return datalist;

	}
}

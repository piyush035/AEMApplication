package com.aem.sample.core.services.impl;

import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.aem.sample.core.services.ReadCSVService;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;



/**
 * @author Anand
 *
 * Implementation of ReadCSVService
 */
@Component(immediate = true, service = ReadCSVService.class)
public class ReadCSVServiceImpl implements ReadCSVService {

	private static final Logger LOGGER = LoggerFactory.getLogger(ReadCSVServiceImpl.class);

	/**
	 * Overridden method which will read the JSON data via an HTTP GET call
	 */
	@Override
	public List<String> getCountries() {

		LOGGER.info("Inside getCountries");
		final List<String> countryList = new ArrayList<String>();
		
		String csvFile = "/Users/anand/Desktop/countries.csv";
        String line = "";
        String cvsSplitBy = ",";

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {

            while ((line = br.readLine()) != null) {

                // use comma as separator
                String[] country = line.split(cvsSplitBy);

                System.out.println("Country [code= " + country[1] + " , name=" + country[2] + "]");
                countryList.add(country[5]);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

		return countryList;
	}

}

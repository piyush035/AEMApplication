package com.aem.sample.core.workflows;

import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;
@Component(service = WorkflowProcess.class, property = {"process.label="+"Read CSV Workflow"})
public class ReadCSVWorkflow implements WorkflowProcess {

	 private final Logger log = LoggerFactory.getLogger(this.getClass());
	 
	@Override
	public void execute(WorkItem item, WorkflowSession session, MetaDataMap args) throws WorkflowException {
		
		log.debug("This is execute of workflow");

	}

}

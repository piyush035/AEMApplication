/*!
    * textboxbutton.js
    * This file contains the code for textbox and button functionality
    * 
    * @project   Test
    * @date      2017-06-02
    * @author    Anand (capgemini)
    * @licensor  Test
    * @site      Test
    *
    */

'use strict';

function onSubmitClick() {
	$.ajax({
	       type : "GET",
				    url : '/bin/readjson',
					headers: {id:$("#idparam").val(), uid:$("#uidparam").val()},
				    success : function(response) {
						let data = JSON.parse(response) 
						
						document.getElementById("title_val").innerHTML = data.title;
						document.getElementById("completedstatus").innerHTML = data.completed;
						      
				                },
				    error : function(error) {
				        document.getElementById("resultlabel").innerHTML = "Error";
				    }     
	    });
}
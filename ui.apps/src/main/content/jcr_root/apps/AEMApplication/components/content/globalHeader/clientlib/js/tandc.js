/*!
    * tandc.js
    * This file contains the code for location and role functionality and being used for global site
    * 
    * @project   MFSCOM
    * @date      2017-07-10
    * @author    Rohit Kumar (SapientNitro)
    * @licensor  MFS
    * @site      MFSCOM
    *
    */
'use strict';

var APP = window.APP = window.APP || {};

APP.TNC = (function () {

    var redirectURL         =   '',
        $tnc                =   $('#tnc-global'),
        $dropdownMenu       =   $tnc.find('.dropdown-menu ul li'),
        $locationDropdown   =   $tnc.find('#location-dropdown'),
        $rolesWrapper       =   $tnc.find('.role-container ul'),
        //for 1527
        fromClickRoles      =   false;

    var USERCHOICE = {
        location : '',
        role : ''
    };
    var viewMode = APP.utility.getCookie('wcmmode');
    // Reset Popup Values
    var resetPopup = function(){
        var $tnc = $('#tnc-global');
        if(!$tnc.find('#remember-location').is(':checked')){
     	   $tnc.find('#remember-location').click();
        }
        $tnc.find('.disclaimer-content').css('visibility', 'hidden');               // Hide disclaimer content
        $tnc.find('.tnc-checkbox').find('#remember-location').attr('disabled','disabled');   // Disable remeber me
        $tnc.find('.modal-footer').find('.acceptCTA').attr('disabled','disabled').addClass('cta--primary--disabled');      // disable accept button
        $rolesWrapper.html('');
        $tnc.find('.change-location-flags').find('em').text($tnc.find('.change-location').data('text'));
        $tnc.find('.change-location-flags').find('.flagcont').attr('class','flagcont nolocation');
       
    };

    // Inialiaze popup
    var close = function(){
        $('#tnc-global').modal('hide');
    };

    // Pre-Set location and Role, if passed
    var Preselect = {
        location : function(location){
            $('#tnc-global').find(".dropdown-menu ul li[data-locationkey='"+location+"']").click();
            USERCHOICE.location = location;
        },
        role : function(role){
            $('#tnc-global').find('.role-container ul').find("a[data-rolekey='"+role+"']").click();
            USERCHOICE.role = role;
        }
    };
    var getDisclosure = function(location, role){
    	var serviceRole = APP.utility.getServiceRole({
    		location:location, 
    		language : APP.global.user.lang(), 
    		role : role 
    	});
    	var errorMsg = '<p>Disclosure not found or service seems to be down</p>';
    	$.ajax({
        	url: $('.global-header').data('tncservice')+'?roleCode='+serviceRole+'&locationCode='+location+'&webComponent=LEGAL_T_AND_C&webPage=LEGAL',
	          type: 'GET',
	          dataType:'json',
	          success: function(resultData) { 
	        	  try{
	        		  var html = resultData.disclosures.LEGAL_T_AND_C[0].noteText;
		        	  $tnc.find('.disclaimer-content').html(html);
	        	  }catch(error){
	        		  $tnc.find('.disclaimer-content').html(errorMsg);
	        	  }
	        	  
	          },
	          error : function(res){
	        	  console.log('Service seems down',res);
	        	  $tnc.find('.disclaimer-content').html(errorMsg);
	          }
	    });
    }
    // Select Role and procced further
    var selectRole = function(){
        var $tnc = $('#tnc-global');
        $tnc.find('.role-container ul').find('a').removeClass('selected');
        $(this).addClass('selected');
        // insert location in temp object
        USERCHOICE.role = $(this).data('rolekey').toLowerCase();

       
        if(USERCHOICE.location===APP.CONFIG.DEFAULT_LOCATION && USERCHOICE.role ===APP.CONFIG.DEFAULT_ROLE){
        	// do not show for now US with INV role
        	$tnc.find('.disclaimer-content').css('visibility', 'hidden');
        }else{
        	getDisclosure(USERCHOICE.location, USERCHOICE.role);
        	$tnc.find('.disclaimer-content').css('visibility', 'visible');
        }
        //show remember me, tnc and action buttons
        $tnc.find('.tnc-checkbox').find('#remember-location').removeAttr('disabled');   // enable remeber me
        $tnc.find('.modal-footer').find('.acceptCTA').removeAttr('disabled').removeClass('cta--primary--disabled');           // enable accept button
    };

    // Set location and role in cookies choosen by end user
    var setUserChoice = function(){
        var $tnc = $('#tnc-global');
        var checked = $tnc.find('#remember-location:checked').length;
        // if user checked remember me, set persitant cookies for 1 year
        if(checked){
        	// override session if exist
        	if(APP.utility.getCookie(APP.CONFIG.LOCATION_KEY)){
                $.cookie(APP.CONFIG.LOCATION_KEY, USERCHOICE.location, { path: '/' });     // Set Location
        	}
        	if(APP.utility.getCookie(APP.CONFIG.ROLE_KEY)){
        		$.cookie(APP.CONFIG.ROLE_KEY, USERCHOICE.role, { path: '/' });             // Set Role
        	}
        	// end of session override
            // set Role
            $.cookie(APP.CONFIG.PERSISTENT_ROLE_KEY, USERCHOICE.role, {
               expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
               path: '/'
            });
            // set Location
            $.cookie(APP.CONFIG.PERSISTENT_LOCATION_KEY, USERCHOICE.location, {
               expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
               path: '/'
            });
            // set user Acceptance
            $.cookie(APP.CONFIG.TNC_ACCEPT_KEY, true, {
               expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
               path: '/'
            });
        // otherwise store cookies for current session only
        }else{
            $.cookie(APP.CONFIG.ROLE_KEY, USERCHOICE.role, { path: '/' });             // Set Role
            $.cookie(APP.CONFIG.LOCATION_KEY, USERCHOICE.location, { path: '/' });     // Set Location
            $.cookie(APP.CONFIG.TNC_ACCEPT_KEY, true, { path: '/' });              // Set Acceptance state
        }
        
        var nonGlobalRegions = ['us','au','nz','ca'];
        var regionKey = USERCHOICE.location;
        if(nonGlobalRegions.indexOf(USERCHOICE.location)=='-1' && USERCHOICE.role!=='insti'){
        	regionKey = 'global';
        }
        var userRoleKey  = USERCHOICE.role;
        if(USERCHOICE.location=='au' || USERCHOICE.location=='nz' && USERCHOICE.role=='fa'){
        	userRoleKey = 'insti';
        }
        $.cookie('region', regionKey, { path: '/', domain:'.mfs.com' });		// set region
        
        if(checked){
        	$.cookie('invtype', userRoleKey, { expires : APP.CONFIG.LOCATION_EXPIRE_TIME, path: '/', domain:'.mfs.com' });  		// 	set invtype 
        	$.cookie('invtypeNEW', userRoleKey, {  expires : APP.CONFIG.LOCATION_EXPIRE_TIME, path: '/', domain:'.mfs.com' });  		// 	set invtypeNEE
        }
        else{
        	$.cookie('invtype', userRoleKey, { path: '/', domain:'.mfs.com' });  		// 	set invtype 
        	$.cookie('invtypeNEW', userRoleKey, { path: '/', domain:'.mfs.com' });  		// 	set invtypeNEE
        }
        close();
        if(redirectURL){
        	APP.utility.redirect(redirectURL);
        }else{
            if(APP.global.pagerole()!==APP.global.user.role() && APP.global.pagerole()!=='norole'){
            	if(APP.global.user.location('cookies')=== APP.CONFIG.DEFAULT_LOCATION){
            		APP.utility.redirect(APP.CONFIG.URL.US_HOME); 
            	}else{
            		APP.utility.redirect(APP.CONFIG.URL.GLOBAL_HOME);
            	}
            }else{
                location.reload();
            }
        }
    };

    // Set Location in dropdown
    var setLocation = function(e){
        var $tnc                =   $('#tnc-global'),
            $dropdownMenu       =   $tnc.find('.dropdown-menu ul li'),
            $locationDropdown   =   $tnc.find('#location-dropdown'),
            $rolesWrapper       =   $tnc.find('.role-container ul');

        var $this = $(this),
            keyType = $this.data('type'),
            locationRoles = $this.data('locationroles'),
            locationText = $this.text(),
            locationKey =  $this.data('locationkey');
        //for 1527
        fromClickRoles = true;
        // Insert location in temp object
        USERCHOICE.location = locationKey.toLowerCase();
        
        // Hide remember me, tnc and action buttons
        $tnc.find('.disclaimer-content').css('visibility', 'hidden');
        $tnc.find('.tnc-checkbox').find('#remember-location').attr('disabled','disabled');   // Disable remember me
        $tnc.find('.modal-footer').find('.acceptCTA').attr('disabled','disabled');      // disable accept button
        var pageLocation = $('#pagelocation').val();
        // Update fields
        if(!$this.hasClass('disabled')){
            // redirect if user changing location from 'US' to NON-US
            if (APP.global.user.location('cookies') === APP.CONFIG.DEFAULT_LOCATION && locationKey !== APP.CONFIG.DEFAULT_LOCATION) {
            	APP.global.user.redirect({
            		location : USERCHOICE.location,
            		navigate : 'GNRHP',
            		logout : APP.global.user.loggedIn()
            	});
            }
            // redirect if user changing location from 'NON-US' to US
            else if (APP.global.user.location('cookies')!==APP.CONFIG.DEFAULT_LOCATION && locationKey===APP.CONFIG.DEFAULT_LOCATION && pageLocation!==APP.CONFIG.DEFAULT_LOCATION) {
            	APP.global.user.redirect({
            		location : USERCHOICE.location,
            		navigate : 'NRHP',
            		logout : APP.global.user.loggedIn()
            	});
            }
            else{
                $locationDropdown.find('.flagcont').attr('class', ($(this).data('type')==='region') ? 'flagcont nolocation' : 'flagcont '+locationKey);
                $locationDropdown.find('.text').text(locationText);
                var html = '';
                for(var i = 0 ; i<locationRoles.length; i++){
                    html+='<li><a href="javascript:;" data-roleKey="'+locationRoles[i].key+'">'+locationRoles[i].value+'</a></li>';
                }
                $rolesWrapper.html(html);
                $rolesWrapper.find('a').off('click').on('click', selectRole);
                //for 1527
                if(fromClickRoles && locationKey !== APP.CONFIG.DEFAULT_LOCATION){
                    fromClickRoles = false;
                    if(locationRoles.find( function(role){ return role.key === 'iprof'; })){
                        //open tnc with default role ip
                        redirectURL = APP.utility.URLMap.pages[locationKey][APP.global.user.lang()]["iprof"]["tncRedirectURL"];
                        $rolesWrapper.find('[data-rolekey = iprof]').click();
                    }
                    else if(locationRoles.find( function(role){ return role.key === 'inv'; } )) {
                        //open tnc with default role inv
                        redirectURL = APP.utility.URLMap.pages[locationKey][APP.global.user.lang()]["inv"]["tncRedirectURL"];
                        $rolesWrapper.find('[data-rolekey = inv]').click();
                    } else if (locationRoles.find( function(role){ return role.key === 'insti'; })) {
                        //open tnc with default role insti
                        redirectURL = APP.utility.URLMap.pages[locationKey][APP.global.user.lang()]["insti"]["tncRedirectURL"];
                        $rolesWrapper.find('[data-rolekey = insti]').click();
                    }
                }
                
            }
        }else{
            e.preventDefault();
            return false;
        }
    };

    var modifyTable = function(selector, limit){
        // Modify layout to meet design
        var totalColumn = limit, generatedColumn='';
        var totalCountries = $tnc.find(selector+' li').length;
        if(totalCountries<limit){
            var toBeGenerated = '';
            toBeGenerated = totalColumn - totalCountries; 
            for(var i = 0; i<toBeGenerated; i++){
                generatedColumn += '<li class="disabled"></li>';
            }
            $('#tnc-global').find(selector).append(generatedColumn);
        }
    };

    // Inialiaze popup
    var open = function(params_){ 
        var params_ = params_ || {};
        
        if(viewMode==='edit' || $.cookie('wcmmode')==='edit'){  
        	return;
        }
        if($('.registration-steps').length && params_.bIsOnPageLoad){//Defect NPR-1651 - hiding TnC on Registration page
			$('.sensitive-data').removeClass('sensitive-data');
        	return;
         }
        $('#tnc-global').modal('show');             // show term and condition popup
        redirectURL = params_.url;
        resetPopup();                               // reset popup
        $('#tnc-global').on('shown', function () {
            $('body').on('click', function(e) {
     	       
     	       tncDeclined();
     	    });
        });
        if(typeof(params_.location) !== 'undefined'){
            Preselect.location(params_.location);
            if(typeof(params_.role) !== 'undefined'){
                Preselect.role(params_.role);
            }
        }
        modifyTable('.countries-list', 16);
        modifyTable('.region-list', 4);
    };
    
    var warning = function(location){
        var warningPopup = $('#location-change-alert');
        warningPopup.modal('show'); 
        warningPopup.find('.accept-btn').off('click').on('click', function(){
            APP.utility.setCookie(APP.CONFIG.LOCATION_KEY, location);
            APP.utility.redirect(APP.CONFIG.URL.LOGOUT);
        });
    };
    var APACListed = function(location, role){
    	try{
			var availableRole = APP.utility.APACMap[location].split(',');
			if(availableRole.indexOf(role)!== -1){
					return true;
            }else{
				return false;
			}
		}catch(msg){
			return false;
		}
    };
    var tncDeclined = function(){
    	/*var userCountry = APP.global.user.browser().country;
    	if(APACListed(userCountry, USERCHOICE.role)){
    		console.log('redirect user to contact us page');
    		var userLocationContactus = APP.utility.URLMap.pages[APP.global.user.browser().location][APP.global.user.lang()][USERCHOICE.role];
    		var globalContactus = APP.utility.URLMap.pages[APP.CONFIG.GLOBAL_LOCATION][APP.CONFIG.DEFAULT_LANGUAGE][APP.CONFIG.DEFAULT_ROLE];
    		if(userLocationContactus.contactus){
    			APP.utility.redirect(userLocationContactus.contactus);
    		}else{
    			APP.utility.redirect(globalContactus.contactus);
    		}
    	}else{}*/
    	// if user declient to accept TNC on no role home page
        if(APP.global.pagerole()==='norole'){
            $('#tnc-global').modal('hide');
            if(APP.global.user.location('cookies')===undefined && APP.global.user.role('cookies')===undefined){
                $.cookie(APP.CONFIG.TNC_ACCEPT_KEY, false, { path: '/' });              // remember TNC declined
                location.reload();
            }
            if($('.mega-nav-search').length){
            	$('.mega-nav-search').find('.js-sort-by-role option[data-key='+APP.global.user.role()+']').prop('selected', true)
            }
         // if user declient to accept TNC on role based page
        }else{
            $('#tnc-global').modal('hide');
            if(APP.global.user.location('cookies')===undefined && APP.global.user.role('cookies')===undefined){
                var redirectURL = APP.utility.createURL({ 
                    language: APP.global.user.lang(),  
                    location : APP.global.user.location(),
                    component : 'TNC',
                    urlType : 'public'
                });
                APP.utility.redirect(redirectURL+APP.CONFIG.FILE_EXT); 
            }else{
            	if(APP.global.user.location('cookies')=== APP.CONFIG.DEFAULT_LOCATION){
            		APP.utility.redirect(APP.CONFIG.URL.US_HOME); 
            	}else{
            		APP.utility.redirect(APP.CONFIG.URL.GLOBAL_HOME);
            	}
            }
        }
        $('body').off('click');
    };

    
    $(document).on('click','#tnc-global .dropdown-menu li', setLocation);       // set location in USERCHOICE Obj
    $(document).off('click','#tnc-global .acceptCTA').on('click','#tnc-global .acceptCTA', setUserChoice);            // SET LOCATION and ROLE in cookies
    $(document).on('click','#tnc-global .cancelCTA, #tnc-global .modal-header .close', tncDeclined);              // Redirect If declined
    
    
    /*
        * interfaces to public functions
    */
    return {
        open:open,
        reset: resetPopup,
        warning : warning,
        close:close
    };

}());

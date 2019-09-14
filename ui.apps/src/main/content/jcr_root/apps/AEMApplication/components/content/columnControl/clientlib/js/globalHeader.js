'use strict';

var APP = window.APP = window.APP || {};

APP.globalHeader = (function () {
    var ACTIVE_CLASS = 'active';
    var SEARCH_AJAX_SERVICE = "SEARCH_AJAX_SERVICE";
    var PREDICTIVE_SEARCH_AJAX_SERVICE = "PREDICTIVE_SEARCH_AJAX_SERVICE";
    var $globalHeader,
        $hamburgerMenu,
        $navLink,
        $strIsActiveClass = 'is-active',
        $mobileSubLink,
        $utilityLinks,
        $utilityChangeLocationFlags,
        $changeLocation,
        $searchLogo,
        $rightFlyout,
        $searchClose,
        $globalSearchInput,
        $globalSearchResult,
        $globalSearchHbsTemplate,
        $searchIcon,
        $suggestions,
        $gblViewAll,
        $changeLocationPopup,
        $searchCloseHeader,
        topNavContainer;
    var roleAndLocation = {
        role: '',
        locale: ''
    };
    var megaMenuSearchOpen = false,
    	$viewAll;
    
    // Method to switch view for specified CTAs based on log in state
    var switchCTA = function () {
        var mobileBottomLink = $('.mobile-bottom-link');        // Mobile view selector
        var desktopLink = $('.nav-top-items');                  // desktop view seletor
        // If logged in, show only applicable CTAs and hide others  
        if (APP.utility.isMobile()) {
        	desktopLink.find('li.logged-out').hide();
        	desktopLink.find('li.logged-in').hide();
            if (APP.global.user.loggedIn()) {
                mobileBottomLink.find('li.logged-out').hide();
                mobileBottomLink.find('li.logged-in').css('display', 'inline-block');
            } else {
                mobileBottomLink.find('li.logged-in').hide();
                mobileBottomLink.find('li.logged-out').css('display', 'inline-block');
            }
        // For anonymous use, show only applicable CTAs and hide others  
        } else {
        	mobileBottomLink.find('li.logged-out').hide();
        	mobileBottomLink.find('li.logged-in').hide();
            if (APP.global.user.loggedIn()) {
                desktopLink.find('li.logged-out').hide();
                desktopLink.find('li.logged-in').css('display', 'inline-block');
            } else {
                desktopLink.find('li.logged-in').hide();
                desktopLink.find('li.logged-out').css('display', 'inline-block');
            }            
        }
        // display login,logout,contact us links etc when login checked
        $('.right-links').css('display', 'inline-block');

    }

    // Method to update mega nav location and role as well as its data
    var setRoleLocationInMegaNav = function (location, role) {
    	// present page data
    	$('.sensitive-data').removeClass('sensitive-data');
    	
        topNavContainer.find('.location-dropdown li.loc_' + location).click();
        topNavContainer.find('.change-location').removeClass('is-active');
        if(role!==undefined && role !==null){
        	var role = role;
        	if(APP.global.getCurrentRoles().indexOf(role)=='-1'){
        		role = APP.global.getCurrentRoles()[0];
        		if(APP.utility.getCookie(APP.CONFIG.ROLE_KEY)){
        			$.cookie(APP.CONFIG.ROLE_KEY, role, { path: '/' });
        		}else{
        			$.cookie(APP.CONFIG.PERSISTENT_ROLE_KEY, role, {
    	               expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
    	               path: '/'
    	            });
        		}
        	}
            topNavContainer.find('.role-wrapper li[data-key="' + role + '"]').click();
            topNavContainer.find('.role-wrapper').removeClass('is-active');
            
            var nonGlobalRegions = ['us','au','nz','ca'];
            var regionKey = location;
            if(nonGlobalRegions.indexOf(location)=='-1' && role!=='insti'){
                  regionKey = 'global';
            }
            var userRoleKey  = role;
            if((location=='au' || location=='nz') && role=='fa'){
                  userRoleKey = 'insti';
            }
            $.cookie('region', regionKey, { path: '/', domain:'.mfs.com' });        // set region
            if(APP.utility.getCookie(APP.CONFIG.PERSISTENT_ROLE_KEY)){
                
                 $.cookie('invtype', userRoleKey, {expires : APP.CONFIG.LOCATION_EXPIRE_TIME, path: '/', domain:'.mfs.com' });           //    set invtype 
                 $.cookie('invtypeNEW', userRoleKey, {expires : APP.CONFIG.LOCATION_EXPIRE_TIME, path: '/', domain:'.mfs.com' });
            }
            else{
            	 $.cookie('invtype', userRoleKey, { path: '/', domain:'.mfs.com' });           //    set invtype 
                 $.cookie('invtypeNEW', userRoleKey, { path: '/', domain:'.mfs.com' });
            	
            }

        }else{
        	setRoleBasedMenu(APP.CONFIG.GLOBAL_LOCATION, APP.CONFIG.DEFAULT_ROLE);
        }
        //display location flag and role once cookies are checked
        $('.left-container').css('display', 'inline-block');
    };

    // Set role and location in session cookies on page load, if user visiting from United State
    var setRoleLocationInCookie = function (location, role) {
        $.cookie(APP.CONFIG.PERSISTENT_LOCATION_KEY, location, {
               expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
               path: '/'
        });
        $.cookie(APP.CONFIG.PERSISTENT_ROLE_KEY, role, {
               expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
               path: '/'
        });
        // set user Acceptance
        $.cookie(APP.CONFIG.TNC_ACCEPT_KEY, true, {path: '/'});

        // update meganav accordingly
        setRoleLocationInMegaNav(location, role);
    };
    var hideRoleLink = function(){
    	var containerMain = $('.nav-container');
    	if(APP.global.user.role('cookies')===undefined){
        	containerMain.find('.js-role-base-head-name a').hide();
        }
    }
    var APACListed = function(country){
    	try{
			var countries = APP.utility.APACMap;
			if(countries.indexOf(country)!== -1){
					return true;
            }else{
				return false;
			}
		}catch(msg){
			return false;
		}
    };
    // Check End User Role and Location on page load
    var checkRoleandLocation = function () {
        switchCTA();
        
        var currentPage = $('#currentPage').data().currentPage;
        //  cookie location and role
        var location = APP.global.user.location('cookies');  // return only cookies
        var role = APP.global.user.role('cookies');          // return only cookies
        // If already logged In
        if (APP.global.user.loggedIn()) {
        	if (location !== undefined && role !== undefined) {
        		if(location==APP.CONFIG.DEFAULT_LOCATION && APP.global.pagerole()==APP.CONFIG.DEFAULT_ROLE){
        			// update role for current session
                	$.cookie(APP.CONFIG.PERSISTENT_ROLE_KEY, APP.CONFIG.DEFAULT_ROLE, { path: '/' });
                	// override session if exist
                	if(APP.utility.getCookie(APP.CONFIG.ROLE_KEY)){
                        $.cookie(APP.CONFIG.ROLE_KEY, APP.CONFIG.DEFAULT_ROLE, { path: '/' });     // Set Location
                	}
        			setRoleLocationInMegaNav(location, APP.CONFIG.DEFAULT_ROLE);
        		}else if(role===APP.global.pagerole() || APP.global.pagerole() === 'norole'){
                    setRoleLocationInMegaNav(location, role);
                }else{
                    APP.TNC.open({location:location, role : APP.global.pagerole() });  
                }
            }else{
                topNavContainer.find('.location-dropdown li.loc_' + location).click();
                topNavContainer.find('.change-location').removeClass('is-active');
                // present page data
            	$('.sensitive-data').removeClass('sensitive-data');
            }
        // For anonymous user only
        } else {
            // If location is undefined 
            if (location === undefined && role === undefined) {
                var browserLocation = $('input#pagelocation').val() || APP.global.user.browser().location; // FIXED NPR-625
                //if  user navigating from US
                if (browserLocation === APP.CONFIG.DEFAULT_LOCATION) {
                    setRoleLocationInCookie(browserLocation, APP.CONFIG.DEFAULT_ROLE);
                 // FOR non-Listed APAC countries
                }else if (APACListed(APP.global.user.browser().country)) {  
                	// redirect all to international contact us page
                	if(currentPage!=='contact-us'){
                		APP.utility.redirect(APP.CONFIG.URL.CONTACT_US+APP.CONFIG.FILE_EXT);
                	}
                
                // FOR Listed APAC countries
                } else {
                    if(APP.global.pagerole()==='norole'){
                        if(APP.utility.getCookie(APP.CONFIG.TNC_ACCEPT_KEY)==='false'){
                        	setRoleBasedMenu(APP.CONFIG.GLOBAL_LOCATION, APP.CONFIG.DEFAULT_ROLE);
                        	// present page data
                        	$('.sensitive-data').removeClass('sensitive-data');
                        }else{
                            APP.TNC.open({location:browserLocation });       // open TNC Popup
                        }
                    }else{
                        APP.TNC.open({location:browserLocation, role : APP.global.pagerole() });       
                    }
                    setRoleLocationInMegaNav(browserLocation);
                }
            }else if (location !== undefined && role === undefined) {
            	//if  user navigating from US (default locatio is "us")
                if (location === APP.CONFIG.DEFAULT_LOCATION) {
                	// update role for current session
                	$.cookie(APP.CONFIG.PERSISTENT_ROLE_KEY, APP.CONFIG.DEFAULT_ROLE, { path: '/' });
                	// override session if exist
                	if(APP.utility.getCookie(APP.CONFIG.ROLE_KEY)){
                        $.cookie(APP.CONFIG.ROLE_KEY, APP.CONFIG.DEFAULT_ROLE, { path: '/' });     // Set Location
                	}
                	setRoleLocationInMegaNav(location, APP.CONFIG.DEFAULT_ROLE);
                }else{
                	setRoleLocationInMegaNav(location);
                }
            }else{
                if(role===APP.global.pagerole() || APP.global.pagerole() === 'norole'){
                    setRoleLocationInMegaNav(location, role);
                }else if(APP.global.pagerole()===APP.CONFIG.DEFAULT_ROLE && location === APP.CONFIG.DEFAULT_LOCATION){
                	setUserCookies(APP.CONFIG.DEFAULT_LOCATION, APP.CONFIG.DEFAULT_ROLE);
                	setRoleLocationInMegaNav(APP.CONFIG.DEFAULT_LOCATION, APP.CONFIG.DEFAULT_ROLE);
                }else{
                	//Defect NPR-1651 - hiding TnC on Registration page
                    if($('.registration-steps').length){
                        APP.TNC.open({location:location, role : APP.global.pagerole(), bIsOnPageLoad:true }); 
                    	setRoleLocationInMegaNav(location, APP.global.user.role('cookies'));
                    }
                    else{
						APP.TNC.open({location:location, role : APP.global.pagerole() }); 
                    }
                }
                
            }
        }
        // hide role link if role cookie does not exists
        hideRoleLink();
    };
    
    //close role and location dropdown container
    var closeUtilityRoleLocationdropdowns = function (e) {
        e.stopPropagation();
        if($('.role-location-container').has(e.target).length !== 0 || $(e.target).hasClass('role-location-container')){
            $('.change-location,.investment-professional').removeClass($strIsActiveClass);
        }     
        else if( $('.left-link-container').has(e.target).length === 0 && $('role-location-container').has(e.target).length === 0 ) {
				$('.left-container').removeClass($strIsActiveClass);
            	$('.role-location-container .change-location,.role-location-container .investment-professional').removeClass($strIsActiveClass);
        }
    }

    //Toggle role and location dropdown container
    var openRoleLocationDesktop = function (e) {
        var $this = $(this).closest('.left-container');
        if ($this.hasClass($strIsActiveClass)) {
            $this.removeClass($strIsActiveClass);
            $this.closest('.global-header').find('.header').removeClass($strIsActiveClass);
            $this.off('click tap', '.role-location-container', closeUtilityRoleLocationdropdowns);
            $('.role-location-container .change-location,.role-location-container .investment-professional').removeClass($strIsActiveClass);
            $(document).off('click', closeUtilityRoleLocationdropdowns);
        }
        else {
            $(document).on('click', closeUtilityRoleLocationdropdowns);
            $this.addClass($strIsActiveClass);
            
        }
    }

    // Flyout open/close Slide Function
    var openNavFlyout = function (e) {
        e.stopPropagation();
        var $this = $(this),
            $menuText = $this.find('span').data("menu"),
            $menuClose = $this.find('span').data("close");
        $('.banner.visible-popup').hide();
        $('.utility-nav').css('top','0px');
        // Close  Flyout
        if ($this.hasClass($strIsActiveClass)) {
            closeNavFlyout();
        }
        // open  Flyout
        else {
            if(!APP.utility.isMobile()){
                openRoleLocationDesktop();
            } else {
                $('body').css('position', 'fixed');
            }
            
                var hamburger = $this.closest('.global-header__hamburger-menu');
                if(hamburger.hasClass('disabled')){
                    return;
                }
                $this.addClass($strIsActiveClass);
                $this.find('span').text($menuClose);
                $this.closest('.global-header__hamburger-menu').addClass($strIsActiveClass);
                $this.closest('.global-header').find('.global-header__nav-background').addClass($strIsActiveClass);
                $this.closest('.global-header').find('.global-header__global-nav').addClass($strIsActiveClass);
                $this.closest('.global-header').find('.mfs-logo').addClass('dark-logo');
            $('body').addClass('flyout-fixed');
                $('.nav-container').find('.container-main-link-items').addClass($strIsActiveClass);
                actionCloseSearchGlobalHeader();
                $('.js-global-header__global-nav').css("z-index", "1199");
                $('.js-search-logo').addClass("search-color");
                $('.banner.visible-popup + header .header').addClass('scrolled-header');
            $('.banner.visible-popup + header .utility-nav').addClass('scrolled-header');
                $('.transparent-header .hero-banner').addClass('no-margin');
        }

    };


    var closeNavFlyout = function (e) {
        var $anchor = $hamburgerMenu.find('a');
        var menu = $hamburgerMenu.find('span').data('menu');
        if($('.banner.visible-popup') && $(window).scrollTop()<= $('.banner.visible-popup').height()) {
            $('.banner.visible-popup').show();
            $('.banner.visible-popup + header .header').removeClass('scrolled-header');
            $('.banner.visible-popup + header .utility-nav').removeClass('scrolled-header');
            $('.utility-nav').css('top',$('.banner.visible-popup').height());
        } 
        if ($anchor.hasClass($strIsActiveClass)) {
            $anchor.removeClass($strIsActiveClass);
            $anchor.find('span').text(menu);
            $anchor.closest('.global-header__hamburger-menu').removeClass($strIsActiveClass);
            $anchor.closest('.global-header').find('.global-header__nav-background').removeClass($strIsActiveClass);
            $anchor.closest('.global-header').find('.global-header__global-nav').removeClass($strIsActiveClass); 
            $('.nav-container').find('.is-active').removeClass($strIsActiveClass);
            $('body').removeClass('flyout-fixed');
            $('.nav-container').find('.link-items-detail').hide();
            $anchor.closest('.global-header').find('.mfs-logo').removeClass('dark-logo');
            $('.js-search-logo').removeClass("search-color");
            $('.transparent-header .hero-banner').removeClass('no-margin');
        }

        /* search-flyout close */
        if($('body').hasClass('search-flyout')){
            $searchClose.trigger('click');
        }
        if(APP.utility.isMobile()){
            $('body').css('position', 'relative');
        }
    };
    var openMenuContent = function (e) {
        var $this = $(this);
        if ($this.hasClass($strIsActiveClass)) {
            $this.removeClass($strIsActiveClass);
            $this.siblings('.link-items-detail').hide();
        }
        else {
            $this.closest('.nav-main-link-items').find('.is-active').removeClass($strIsActiveClass);
            $this.closest('.nav-main-link-items').find('.link-items-detail').hide();
            $this.addClass($strIsActiveClass);
            $this.siblings('.link-items-detail').show();
        }
    };

    var showTNCforRoleLinks = function(e){
    	//  cookie location and role
        var location = APP.global.user.location('cookies');  // return only cookies
        var role = APP.global.user.role('cookies');          // return only cookies

        if(location===undefined || role===undefined){
            if(!APP.utility.isMobile()) {
				var dropdownLocation = $('.utility-nav.nav-container .nav-top-items .utility-change-location-flags span#utility-nav-flag').attr('class');
            } else {
        	var dropdownLocation = $('.nav-container .nav-top-items span').attr('class');
            }
        	if(dropdownLocation==='' && dropdownLocation===undefined){
        		dropdownLocation = APP.global.user.browser().location;
        	}
            APP.TNC.open({location:dropdownLocation });       // open TNC Popup
        }else{
        	var $this = $(this);
            if ($this.hasClass($strIsActiveClass)) {
                $this.removeClass($strIsActiveClass);
                $this.siblings('.link-items-detail').hide();
            }
            else {
                $this.closest('.nav-main-link-items').find('.is-active').removeClass($strIsActiveClass);
                $this.closest('.nav-main-link-items').find('.link-items-detail').hide();
                $this.addClass($strIsActiveClass);
                $this.siblings('.link-items-detail').show();
            }
        }
    };
    var mobileSubLinkContent = function (e) {
        var $this = $(this);
        if ($this.hasClass($strIsActiveClass)) {
            $this.removeClass($strIsActiveClass);
            $this.siblings('ul').hide();
        }
        else {
            $this.closest('.link-items-detail').find('.is-active ul').hide();
            $this.closest('.link-items-detail').find('.is-active').removeClass($strIsActiveClass);
            $this.addClass($strIsActiveClass);
            $this.siblings('ul').show();
        }
    };

    // Change Location Open drop Down
    var changeLocationOpenDropDown = function (e) {
        e.stopPropagation();
        var $this = $(this);
        if ($this.hasClass($strIsActiveClass)) {
            $this.removeClass($strIsActiveClass);
            $this.closest('.global-header').find('.header').removeClass($strIsActiveClass);
        }
        else {
            $this.addClass($strIsActiveClass);
            $this.closest('.global-header').find('.header').addClass($strIsActiveClass);
            $this.closest('.nav-top-items').find('.one-col-drop-down').removeClass($strIsActiveClass);
            $('.js-global-header__global-nav').css("z-index", "1201");
        }
    };

    // Set Location of dropdown
    var setLocation = function (e) {
        e.stopPropagation();
        var $this = $(this);
        var regionValue = $this.data("regionvalue");
        var countryFlag = $this.data("locationkey");
        var locationrole = $this.data("locationrole");
        var locationValue = $this.data("locationkey");
        var changeLocation = $(".change-location a > span, .utility-change-location-flags > span#utility-nav-flag");
        var currentElement = $("li.one-col-drop-down");
        var location = APP.global.user.location('cookies');
        var dropdownVisible = $('.global-header .location-dropdown:visible').length;
        var boolTncOnce = true;
        var tncAcceptedCookie;// = APP.utility.getCookie('tnc_accepted');
        
        // if user select the location which is already selected
        if(changeLocation.attr('class')===locationValue){
        	$globalHeader.find('.change-location').removeClass('is-active');
        	return;
        }
        // redirect if user changing location from 'US' to NON-US
        if (location === APP.CONFIG.DEFAULT_LOCATION && locationValue !== APP.CONFIG.DEFAULT_LOCATION) {
        	$.cookie('tnc_Accepted_Cookie', false, { path: '/' });
        	APP.global.user.redirect({
        		location : locationValue,
        		navigate : 'GNRHP',
        		logout : APP.global.user.loggedIn()
        	});
        }
        // redirect if user changing location from 'NON-US' to US
        else if (location!==APP.CONFIG.DEFAULT_LOCATION && locationValue===APP.CONFIG.DEFAULT_LOCATION) {
        	$.cookie('tnc_Accepted_Cookie', false, { path: '/' });
        	APP.global.user.redirect({
        		location : locationValue,
        		navigate : 'NRHP',
        		logout : APP.global.user.loggedIn()
        	});
        }
        else{
	       updateRoleInit();
            tncAcceptedCookie = APP.utility.getCookie('tnc_Accepted_Cookie');
            if(location === locationValue && boolTncOnce == true && tncAcceptedCookie == 'false' && location !== APP.CONFIG.DEFAULT_LOCATION) {
                $.cookie('tnc_Accepted_Cookie', true, { path: '/' }); 
                boolTncOnce = false;
                var link;
                if(locationrole.find( function(role){ return role.key === 'iprof'; })){
                    //open tnc with default role ip
                    link = APP.utility.URLMap.pages[location][APP.global.user.lang()]["iprof"]["tncRedirectURL"];
                    APP.TNC.open({location:locationValue, role: 'iprof', url:link});
                }
                else if(locationrole.find( function(role){ return role.key === 'inv'; } )) {
                    //open tnc with default role inv
                    link = APP.utility.URLMap.pages[location][APP.global.user.lang()]["inv"]["tncRedirectURL"];
                    APP.TNC.open({location:locationValue, role: 'inv', url:link});
                } else if (locationrole.find( function(role){ return role.key === 'insti'; })) {
                    //open tnc with default role insti
                    link = APP.utility.URLMap.pages[location][APP.global.user.lang()]["insti"]["tncRedirectURL"];
                    APP.TNC.open({location:locationValue, role: 'insti', url:link});
                }
            }
            
        }
        function updateRoleInit(){
            changeLocation.html($this.html());
            changeLocation.removeClass().addClass(countryFlag);
            $utilityChangeLocationFlags.find('.label-default').show();
            $utilityChangeLocationFlags.find('.label-selected').hide();
            if($('.utility-nav').is(':visible')) {
                if(regionValue == undefined){
                    $utilityChangeLocationFlags.find('span#utility-nav-flag').html(''); 
                    $utilityChangeLocationFlags.find('span#utility-nav-flag').css('padding-left','28px');
                }
                else {
                    $utilityChangeLocationFlags.find('span#utility-nav-flag').css('padding-left','0');
                }
            }
            currentElement.addClass('enable');
            currentElement.find('.label-default').show();
            currentElement.find('.label-selected').hide();
            $this.closest('.nav-top-items').find('.two-col-drop-down').removeClass($strIsActiveClass);
            // update role, when location successfully selected
            updateRoles(locationrole, locationValue);
            $('.js-global-header__global-nav').css("z-index", "1199");
        }

    };

    var updateRoles = function (locationrole, locationValue) {
        var roleNameList = [];
        locationrole.forEach(function (role) {
            roleNameList.push("<li data-key='" + role.key + "' data-location='" + locationValue + "'>" + role.value + "</li>");
        });
        $("li.one-col-drop-down ul.dropdown-with-bg").html(roleNameList.join(""));
    };

    // Ajax call for role based menu  
    var setRoleBasedMenu = function (location, role) {
    	// render footer base on location and role
    	APP.globalfooter.render(location, role);
    	
        var headPath = APP.utility.createURL({ 
            location : location || APP.global.user.location(), 
            language: APP.global.user.lang(),  
            role: role || APP.global.user.role(),
            component: 'header',
            urlType : 'private'
        });
        var headerurl = headPath + '/utils/header/jcr:content/par.html';
        
        var getRoleBasedMenu = APP.ajax.get('getRoleBasedMenu',
            {
                'url': headerurl,
                'dataType': 'html',

            }).done(function (res) {
                var response = res.responseText;
                //$('.Success').html(response)
                var containerMain = $('.nav-container');
                var $linkDetails = $('.global-header').find('.link-items-detail');
                var roleBasedHeading = $(response).find('#js-role-based-heading').val();
                var roleBasedContactLink = $(response).find('#js-contact-us-link').val();

                containerMain.find('.js-role-base-head-name a').attr('href', roleBasedHeading);
                containerMain.find('.link-contact-us a').attr('href', roleBasedContactLink);
                $('.mobile-bottom-link').find('.link-contact-us a').attr('href', roleBasedContactLink);
                //enable menu
                $globalHeader.find('.global-header__hamburger-menu').removeClass('disabled');
                
                $linkDetails.each(function (index, element) {
                    // element == this
                    var currentRoleName = $(element).data("rolename");
                    // role base placeholder in header
                	var linksPlaceholder = $globalHeader.find('.link-items-detail[data-rolename="' + currentRoleName + '"]');
                	var labelPlaceholder = $globalHeader.find('.link-items-label[data-rolename="' + currentRoleName + '"]');
                	
                    var responseData = $(response).find('.role-content[data-rolename="' + currentRoleName + '"]');
                    if (responseData.length) {
                    	labelPlaceholder.html(responseData.data('labeltext'));
                        linksPlaceholder.html(responseData)
                    }else{
                    	labelPlaceholder.closest('li.js-role-view').hide();
                    }
                });
            });

    };


    // Investment professional Open drop Down
    var investmentProfessionalDropDown = function (e) {
        e.stopPropagation();
        var $this = $(this);
        if ($this.hasClass($strIsActiveClass)) {
            $this.removeClass($strIsActiveClass);
            $this.closest('.global-header').find('.header').removeClass($strIsActiveClass);
        }
        else {
            $this.addClass($strIsActiveClass);
            $this.closest('.global-header').find('.header').addClass($strIsActiveClass);
            $this.closest('.nav-top-items').find('.two-col-drop-down').removeClass($strIsActiveClass);
            $('.js-global-header__global-nav').css("z-index", "1201");
        }
    };
    var getRoleHomeLink = function(location, role){
		var headPath = APP.utility.createURL({ 
	        location : location, 
	        language: APP.global.user.lang(),  
	        role: role,
	        component: 'header',
	        urlType : 'private'
	    });
	    var headerurl = headPath + '/utils/header/jcr:content/par.html';
	    var roleBasedHeading  = '';
	    $.ajax({
        		url: headerurl,
	          type: 'GET',
	          dataType:'html',
	          async : false,
	          success: function(res) { 
		          roleBasedHeading = $(res).find('#js-role-based-heading').val();
	        }
	    });
	    
		return roleBasedHeading;
	};
	var setUserCookies = function(location, role){
		// override session if exist
    	if(APP.utility.getCookie(APP.CONFIG.LOCATION_KEY)){
            $.cookie(APP.CONFIG.LOCATION_KEY, location, { path: '/' });     // Set Location
    	}
    	if(APP.utility.getCookie(APP.CONFIG.ROLE_KEY)){
    		$.cookie(APP.CONFIG.ROLE_KEY, role, { path: '/' });             // Set Role
    	}
    	// end of session override
        // set Role
        $.cookie(APP.CONFIG.PERSISTENT_ROLE_KEY, role, {
           expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
           path: '/'
        });
        // set Location
        $.cookie(APP.CONFIG.PERSISTENT_LOCATION_KEY, location, {
           expires : APP.CONFIG.LOCATION_EXPIRE_TIME,       // expires in 1 year
           path: '/'
        });
	};
    // Set investment professional of dropdown
    var setInvestmentProfessional = function (e) {
        e.stopPropagation();
        var $this = $(this);
        roleAndLocation.locale = $(this).data("location");
        roleAndLocation.role = $(this).data("key");
        

        //  cookie  role
        var role = APP.global.user.role('cookies');
        var location = APP.global.user.location('cookies');

        // Show TNC popup, If user changing role 
        if(roleAndLocation.locale===APP.CONFIG.DEFAULT_LOCATION && roleAndLocation.role=== APP.CONFIG.DEFAULT_ROLE && roleAndLocation.role !==role) {
        	var link = getRoleHomeLink(roleAndLocation.locale, roleAndLocation.role);
        	setUserCookies(roleAndLocation.locale, roleAndLocation.role);
        	APP.utility.redirect(link);
        } else if(roleAndLocation.locale !== location || roleAndLocation.role !== role) {
        	if(APP.utility.URLMap.pages[roleAndLocation.locale][APP.global.user.lang()][roleAndLocation.role]["tncRedirectURL"]){
                var link = APP.utility.URLMap.pages[roleAndLocation.locale][APP.global.user.lang()][roleAndLocation.role]["tncRedirectURL"];
            	APP.TNC.open({ location: roleAndLocation.locale, role: roleAndLocation.role, url: link });
        	}
            else{   
                APP.TNC.open({ location: roleAndLocation.locale, role: roleAndLocation.role, url: "/" });
        	}
        	
        } else {
        	$(".investment-professional a > .label-default").hide();
            $(".investment-professional a > .label-selected").html($this.html()).show();
            $utilityChangeLocationFlags.find('.label-default').hide();
            $utilityChangeLocationFlags.find('.label-selected').html($this.html()).show();
            $(".js-role-base-head-name").find('a > span.js-name-role').html($this.html());
            $this.closest('.nav-top-items').find('.role-wrapper').removeClass($strIsActiveClass);
            // update mega nav links based on role and location
            setRoleBasedMenu(roleAndLocation.locale, roleAndLocation.role);
        }
    };


    // Login Panel
    var LoginPanel = function (e) {
        var $this = $(this);
        if ($this.hasClass($strIsActiveClass)) {
            $this.removeClass($strIsActiveClass);
            $this.closest('.nav-container').find('.global-header__login-container').removeClass($strIsActiveClass);
            $this.closest('.nav-container').find('.container-main-link-items').addClass($strIsActiveClass);
        }
        else {
            $this.siblings().removeClass($strIsActiveClass);
            $this.addClass($strIsActiveClass);
            $this.closest('.nav-container').find('.global-header__login-container').addClass($strIsActiveClass).siblings().removeClass($strIsActiveClass);
            if (APP.utility.isMobile()) {
                $('.js-global-header__global-nav').css("z-index", "1261");
            };
            
        }
    };

    var popCountryDropDown = function (e) {
        var $this = $(this);
        if ($this.hasClass($strIsActiveClass)) {
            $this.removeClass($strIsActiveClass);
        }
        else {
            $this.addClass($strIsActiveClass);
        }
    };
    var updateTermAndCount = function (displayResults, totalResults) {
        $suggestions.show();
        $suggestions.find(".search-term").text('"' + $globalSearchInput.val() + '"');
        $suggestions.find(".page-result").text(displayResults);
        $suggestions.find(".total-result").text(totalResults);
    };

    var renderGlobalSearchResults = function (serverURL, searchTerm) {
        APP.ajax.get(SEARCH_AJAX_SERVICE, { url: serverURL }).done(function (resp) {
            if ($globalSearchHbsTemplate.length) {
                var template = $globalSearchHbsTemplate.html();
                var preCompileTemplate = Handlebars.compile(template);
                var response = resp.responseJSON.response;
                var totalResults = resp.responseJSON.response.numFound;
                var numOfResults = response.docs.length;
                // report to analytics
                APP.utility.reportSearch("Global", searchTerm, totalResults)
                
                if (parseInt(totalResults) === 0) {
                    $('.js-viewall').hide();
                    var i18nKeys = APP.i18n.get("searchNoResultFound");
                    response.i18n = i18nKeys;
                } else {
                    $('.js-viewall').show();
                }
                $globalSearchResult.html(preCompileTemplate({ data: response.docs, count: response.numFound, term: searchTerm}));
                $globalSearchResult.show();
                updateTermAndCount(numOfResults, totalResults);
            } else {
                throw new Error("Hbs template not exist");
            }
        });
    };
    
    var search = function (_searchTerm) {
        var ajaxPath = $globalSearchResult.data('ajax-path');
        var searchTerm = $globalSearchInput.val();
        var userRole = APP.utility.getSearchRole({
            location : APP.global.user.location(),
            language : APP.global.user.lang(),
            role : APP.global.user.role()
           });
        
        var locale = APP.utility.searchTerms().locale;
        var region = APP.utility.searchTerms().region;
        if(typeof _searchTerm !== "undefined"){
        	searchTerm = _searchTerm;
        }
        searchTerm = APP.utility.removeSpecialChar(searchTerm);
        $gblViewAll.attr("href", $gblViewAll.data('base-href') + "?keywords=" + searchTerm);
        var productAuthorQueryParam = $('#pagelocation').val() === 'us' ? '&defType=edismax&bq=data_type:product%5E50.0' : '';
        var numOfResults = $globalSearchResult.data("result-length");
        var serverURL = ajaxPath + '?q=' + APP.global.getSearchTerm(searchTerm) + '&fq=locale:' + locale + ' AND region:'+ region+ ' AND data_type:(insights OR video OR pdf OR all OR product)';
        serverURL += '&rows=' + numOfResults + '&roleCode=' + userRole + '&wt=json'+productAuthorQueryParam+'';
        renderGlobalSearchResults(serverURL, searchTerm);
    };

    var predictiveSearch = function (req, res) {
        var userRole = APP.utility.getSearchRole({
            location : APP.global.user.location(),
            language : APP.global.user.lang(),
            role : APP.global.user.role()
           });
        
        var region = APP.utility.searchTerms().region;
        
        var ajaxPath = $globalSearchInput.data('ajax-path');
        var serverURL = ajaxPath + '?searchfor=' + req.term + '&locale=' + APP.CONFIG.DEFAULT_LOCALE + '&page=10&roleCode='+userRole+'&locationCode=' + region;
        var suggestionLength = $globalSearchInput.data("suggestion-length");
       
        APP.ajax.get(PREDICTIVE_SEARCH_AJAX_SERVICE, { url: serverURL,timeout:10*60*1000 }).done(function (resp) {
            var responseJSON = resp.responseJSON;
            var suggestions = responseJSON.suggestions;
            var data = [];
            for (var i = 0; i < suggestionLength && i < suggestions.length - 1; i++) {
                data.push(suggestions[i]['term'].replace(/#30;/g,' '));
            }
            res(data);
        });
    };
    function registerAutocomplete() {
        var minCharLen = $globalSearchInput.data('min-char-length');
        if( typeof $globalSearchInput.autocomplete !== "undefined"){
            $globalSearchInput.autocomplete({
                /*TODO service results are pending.*/
                source: predictiveSearch,
                minLength: minCharLen,
                appendTo: '#predictiveFlyout'
            }).on("autocompletechange", function (e, ui) {
            }).on('autocompleteselect', function (e, ui) {
                search(ui.item.value);
                e.stopPropagation();
            }).on('keyup', function (e, ui) {
            	// restrict special character
            	if(!APP.utility.hasSpecialChar(e.target.value)){
            		$globalSearchInput.val(APP.utility.removeSpecialChar(e.target.value));
            	}
            });
        }
    }
    // Header Add Class on Scroll
    var headerOnScroll = function (e) {
        $(window).scroll(function () {
            if(!megaMenuSearchOpen) {
            var header = $('.header');
            var scroll = $(window).scrollTop();
            var $headerFlyout = $('.banner.visible-popup+header .header, .transparent-header .banner.visible-popup+header .global-header__global-nav.flyout');
            $headerFlyout.removeClass('scrolled-header');
            if (($('body').hasClass('transparent-header') && scroll > 10) || scroll >= 100) {
                header.addClass('onscroll-drak-header');
                $headerFlyout.addClass('scrolled-header');
                    $('.banner.visible-popup + header .utility-nav').addClass('scrolled-header');
            } else {
                header.removeClass('onscroll-drak-header');
                $headerFlyout.removeClass('scrolled-header');
                    $('.banner.visible-popup + header .utility-nav').removeClass('scrolled-header');
            }
            }
            /*if(megaMenuSearchOpen ){
            	if($(window).scrollTop() > $(window).height() -100 ){
            		$viewAll.css("position","relative");
            	}else{
            		$viewAll.css("position","fixed");
            	}
            }*/
        });
    };

    // Set Left flyout out position 
    var flyoutPosition = function () {
    	 var menuPosition = $('.global-header__hamburger-menu').offset().left;
         var headerPosition = $('.header').offset().left;
         var getPosition = menuPosition - headerPosition;
        var setFlyoutleftPosition = $('.js-global-header__global-nav');
        if ($(window).width() > 1023) {
            setFlyoutleftPosition.css('padding-left', getPosition + 'px');
        };


    };

    var closeMobileFlyout = function (e) {
        e.stopPropagation();
        $('.nav-top-items').find('.is-active').removeClass($strIsActiveClass);
        $('.js-global-header__global-nav').css("z-index", "1199");
    };

    function actionCloseSearchGlobalHeader(){
    
        $rightFlyout.removeClass(ACTIVE_CLASS);
        $searchLogo.show();
        $searchCloseHeader.hide();
    }

    var bindEventsToUI = function () {
        // Click to Open Flyout Handler
        $hamburgerMenu.on('click tap', 'a', openNavFlyout);
        $('.js-global-header__global-nav,.header').on("click.globalheader", function (e) {
            e.stopPropagation();
            $('.change-location').removeClass($strIsActiveClass);
            $('.investment-professional').removeClass($strIsActiveClass);
        });


        // Close Menu Flyout on click on outer area
        $(document).on('click tap', 'body', closeNavFlyout);

        // Click to Open Menu Handler
        $navLink.on('click tap', 'li.commonview-list .link-label', openMenuContent);
        // Click to Open Menu Handler
        $navLink.on('click tap', 'li.js-role-view .link-label', showTNCforRoleLinks);

        //click to open role/location dropdown for desktop
        $('.left-container').on('click tap', '.left-link', openRoleLocationDesktop);
        
        topNavContainer.on('click tap', '.change-location', changeLocationOpenDropDown);

        // Click to Set Location
        topNavContainer.on('click tap', '.change-location .dropdown-with-bg li:not(.region)', setLocation);

        // Click to Set Location
        topNavContainer.on('click tap', '.investment-professional .dropdown-with-bg li', setInvestmentProfessional);

        // Click to Open investment Professional menu
        topNavContainer.on('click tap', '.investment-professional', investmentProfessionalDropDown);

        // Click to Close Mobile Pop up
        topNavContainer.on('click tap', '.close', closeMobileFlyout);
        
        $rightFlyout.on('click tap', function(e) {
            e.stopPropagation();
        });
        
        $searchIcon.on("click.flyout", function () {
            search();
        });
        $globalSearchInput.on("keyup.flyour keypress", function (e) {
            if (e.keyCode == 13) {
                search();
            }
            $('.close-icon')[$globalSearchInput.val().length ? 'removeClass' : 'addClass']('hide');
        });
        $('.close-icon').on('click',function(e){
            e.stopPropagation();
            $globalSearchInput.val('');
            $('.close-icon')[$globalSearchInput.val().length ? 'removeClass' : 'addClass']('hide');
        });

        $searchLogo.on("click.flyout", function (e) {
            e.stopPropagation;
        	megaMenuSearchOpen = true;
        	var $anchor = $hamburgerMenu.find('a');
            var menu = $hamburgerMenu.find('span').data('menu');
            var header = $('.header');
            var $headerFlyout = $('.global-header__global-nav.flyout');
            if($('.banner.visible-popup') && $(window).scrollTop()<= $('.banner.visible-popup').height()) {
                $('.banner.visible-popup').show();
                $('.banner.visible-popup + header .header').removeClass('scrolled-header');
                $('.banner.visible-popup + header .utility-nav').removeClass('scrolled-header');
                $('.utility-nav').css('top',$('.banner.visible-popup').height());
            }
        	// If user role is not defined
            if (typeof APP.global.user.role('cookies') === "undefined") {
            	// Get location form cookies
            	var location = APP.global.user.location('cookies');
            	// if undefined, try with browser location
            	if(location===undefined){
            		location = APP.global.user.browser().location;
            	}
                APP.TNC.open({location:location});
            } else {
                $('.global-header__nav-background').removeClass($strIsActiveClass);
                $('.js-global-header__global-nav').removeClass($strIsActiveClass);
                $searchLogo.hide();
                $searchCloseHeader.show();
                
             
                $('.global-header__hamburger-menu').find('.is-active').removeClass($strIsActiveClass);
                $rightFlyout.addClass(ACTIVE_CLASS);

                $hamburgerMenu.removeClass($strIsActiveClass);
                $anchor.find('span').text(menu);
                $('body').addClass('search-flyout flyout-fixed');
                setTimeout(function(){
                    $globalSearchInput.focus();
                })
                
            }
            if (($('body').hasClass('transparent-header') || header.hasClass('onscroll-drak-header')) && ($(window).width() < APP.CONSTANT.DESKTOP_DEVICE_WIDTH)) {
                header.hasClass('onscroll-drak-header') ? '' : header.addClass('onscroll-drak-header');
                $headerFlyout.addClass('scrolled-header');
            }

        });
        $searchClose.on('click.flyout', function () {
            var header = $('.header');
            var $headerFlyout = $('.global-header__global-nav.flyout');
        	megaMenuSearchOpen = false;
            actionCloseSearchGlobalHeader();
            $globalSearchInput.val('').focus();
            $suggestions.hide();
            $globalSearchResult.hide();
            $viewAll.hide();
            $('body').removeClass('search-flyout flyout-fixed');
            if ($('body').hasClass('transparent-header')) {
                header.removeClass('onscroll-drak-header');
                $headerFlyout.removeClass('scrolled-header');
            }
        });
        //topNavContainer.on('click tap', '.register', registerPanel);

        // Click to Open Login Panel Open
        if (APP.utility.isMobile()) {
        $mobileSubLink.on('click tap', '.login-cta', LoginPanel);
        } else {
            $utilityLinks.on('click tap', '.login-cta', APP.LoginRegister.openLoginDialogue);
        }

        // Login Close
        $globalHeader.find('.close_login').off('click').on('click',function(){
            $('.global-header__login-container').removeClass($strIsActiveClass);
            $('.nav-container').find('.container-main-link-items').addClass($strIsActiveClass);            
            $('.js-global-header__global-nav').css("z-index", "1199");
        });

        // Pop Country Selector
        $('.t-and-c-popups').on('click tap', '.four-col-drop-down', popCountryDropDown);

        // Click to Open Menu Handler
        if ($(window).width() < 1023) {
            $mobileSubLink.on('click tap', '.js-mobile-plus-link', mobileSubLinkContent);
        }

        $(window).resize(function () {
            flyoutPosition();
        });

        flyoutPosition();
        
        //TODO : JS ISSUE ON MFS DEV
        registerAutocomplete();
    };

    var bindOnResize = function () {
        /* Don't forget to uncomment APP.global.resizeRouteList.push('globalHeader'); */
    };

    var init = function (element) {
        console.log('APP.globalHeader');
        $globalHeader = $('.global-header');
        $hamburgerMenu = $globalHeader.find('.global-header__hamburger-menu');
        $navLink = $globalHeader.find('.nav-main-link-items');
        $mobileSubLink = $globalHeader.find('.nav-container');
        $utilityLinks = $('.utility-nav').find('.nav-top-items');
        $utilityChangeLocationFlags = $('.utility-change-location-flags');
        topNavContainer = $globalHeader.find('.nav-top-items');
        $searchLogo = $('.js-search-logo');
        $rightFlyout = $('.js-flyout--right');
        $searchClose = $('.js-search-close');
        $searchCloseHeader = $('.js-search-close-header');
        $globalSearchInput = $('.js-global-search-input');
        $globalSearchResult = $('.js-global-search-result');
        $globalSearchHbsTemplate = $('#js-global-search-template');
        $searchIcon = $('.js-search-icon');
        $suggestions = $('.js-suggestion');
        $gblViewAll = $('.js-gbl-view-all-btn');
        $viewAll = $(".js-viewall");
        $changeLocationPopup = $('#location-change-alert');

        bindEventsToUI();
        headerOnScroll();
        //APP.global.resizeRouteList.push('globalHeader');

        // Chech Role and Location on page load
        checkRoleandLocation();   
        /*$(window).resize(function () {
        	checkRoleandLocation();
        })*/
    };

    /**
     * interfaces to public functions
     */
    return {
        init: init,
        bindOnResize: bindOnResize,
        updateDropdown : setRoleLocationInMegaNav
    };

}());

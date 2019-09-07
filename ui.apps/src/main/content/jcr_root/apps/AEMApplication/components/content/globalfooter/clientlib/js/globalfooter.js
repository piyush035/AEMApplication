'use strict';

var APP = window.APP = window.APP || {};

APP.globalfooter = (function () {
    // to be removed
    var url = {
            value: '{mfscom_user_loc}{mfscom_user_role}',
            separator: '.',
            extension: '.html'
        },
        roleCookie = 'mfscom_user_role',
        locCookie = 'mfscom_user_loc',
        userLocaleCookie = 'user_locale',
        nodePath,
        loginCookie = 'invtypes',
        selectLocRoleState = false,
        desinationUrlParam = {
            regAction: 'StartRegAction',
            regNow: 'false',
            invType: 'iprof',
            invTypeNEW: 'iprof',
            region: 'global'
        };
        // to be removed
    var setLocRoleFromCookies = function (id, cName) {
        var value = $.cookie(cName),
            $items = $('div' + id + ' .option[data-value=' + value + ']');
        if (value && $items.length) {
            $('div' + id + ' .option').removeClass('selected');
            $items.addClass('selected');
            $('div' + id + ' .current').text($($items[0]).text());
        }
    };
// to be removed
    var showRegion = function () {
        var selectedItem = $('.global-footer .select-loc').find('.option.selected'),
            region = $('.region-label'),
            flag = $('.flag');
        if (selectedItem.hasClass('regions')) {
            region.text(selectedItem.text());
            region.show();
            flag.hide();
        } else {
            region.hide();
            flag.show();
        }
    };
    var handleLinks = function(){
        var linkWrapper = $('.global-footer__links');
        if(APP.global.user.loggedIn()){
            linkWrapper.find('.non-logged-in').remove();
        }else{
            linkWrapper.find('.logged-in').remove();
        }
    }
    var loadFooter = function (location, role) {

        var footerPath = APP.utility.createURL({ 
        	location : location || APP.global.user.location(), 
            language: APP.global.user.lang(),  
            role: role || APP.global.user.role(),
            component: 'footer',
            urlType : 'private'
        });
        var footerUrl = footerPath + '/utils/footer/jcr:content/par.html';
        var val, cookies = $.cookie() || {}, //get all cookies
            dfd = new $.Deferred();
        $.ajax({
            type: 'GET',
            url: footerUrl,
            success: function (response) {
                dfd.resolve(response);
            }
        });
        //Return promise object
        return dfd.promise();
    };
    var bindLoginDialog = function(){
    	/*$('.global-footer .global-footer__links a.login-cta').on('click', function(){
        	$('body').stop().animate({scrollTop:0}, 1000,function() { 
        		$('.global-header__hamburger-menu a').trigger('click'); 
        		$('.global-header .nav-top-items a.login-cta').trigger('click');
        	});
        });*/
        $('.global-footer .global-footer__links a.login-cta').on('click', APP.LoginRegister.openLoginDialogue);
    };
    var getFooter = function (location, role) {
        loadFooter(location, role).then(function (response) {
            $('.global-footer__links').empty();
            $('.global-footer__links').append(response);
            bindLoginDialog();
            var discloserHTML = $(response).find('.disclosure-text').html();
            
           if($('.js-primary-disclosure-text').length){
          		 $('.global-footer').find('.disclosure-wrapper .content').html($('.js-primary-disclosure-text').html());
           }
           else{
            $('.global-footer').find('.disclosure-wrapper .content').html(discloserHTML);
           }
            handleLinks();
            //set location and role from cookies
            setLocRoleFromCookies('.select-loc', locCookie);
            if ($.cookie(roleCookie) && $.cookie(roleCookie) !== 'undefined') {
                setLocRoleFromCookies('.select-role', roleCookie);
            }
            //set flag based on selected location
            if ($.cookie(locCookie)) {
                $('.flag').removeClass().addClass('flag ' + $.cookie(locCookie));
                showRegion();
            }
        });
    };

    // to be removed
    var getParametersAsJSON = function (url) {
        var pairs = url.split('?')[1] ? url.split('?')[1].split('&') : url.split('?')[1],
            result = {};
        if (pairs) {
            for (var index in pairs) {
                var _pair = pairs[index],
                    pair = typeof _pair === 'string' ? _pair.split('=') : '';
                if (!!pair[0]) {
                    result[pair[0]] = decodeURIComponent(pair[1] || '');
                }
            }
        }
        return result;
    };
    // to be removed
    var submitRoleForm = function (redirectionURl) {
        var action, rememberFlag = false,
            params = {},
            form, elem;
        //get the action url form the link
        action = redirectionURl.split('?')[0];

        //get params in object form
        params = getParametersAsJSON(redirectionURl);

        //set default params if nothing is there
        if ($.isEmptyObject(params)) {
            params = $.extend(true, {}, params, desinationUrlParam);
        }

        var remRoleParam = {
            rememberregion: rememberFlag
        };
        //add remember region params
        params = $.extend(true, {}, params, remRoleParam);

        //Create form
        form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);
        for (var key in params) {
            elem = document.createElement('input');
            elem.setAttribute('type', 'hidden');
            elem.setAttribute('name', key);
            elem.setAttribute('value', params[key]);
            form.appendChild(elem);
        }
        document.body.appendChild(form);
        form.submit();
    };
    // to be removed
    var isBHRedirect = function (redirectionURL, role) {
        var redirectFlag = true,
            loc = $.cookie(locCookie);
        if (((loc === 'us') && (role === 'inv' || role === 'iprof')) || (!redirectionURL)) {
            redirectFlag = false;
        }
        return redirectFlag;
    };


    // to be removed

    var checkUserLocale = function (e) {
        var userLocale = $.cookie(userLocaleCookie);
        if (userLocale && !$.cookie(locCookie)) {
            if (userLocale.split('|').length > 1) {
                $.cookie(locCookie, userLocale.split('|')[1], '/');
            }
        }
    };
    // nothing being used from below function
    var bindEventsToUI = function () {
        $('body').off('change', '.select-loc').on('change', '.select-loc', function (e) {
            $('body').trigger('location:changed');
            e.stopPropagation();
            var $this = $(this),
                selValue = $this.find('option:selected').val();
            $.cookie(locCookie, selValue, '/');
            $.cookie(roleCookie, undefined, '/');
            getFooter();
        });

        // while changing the role set cookies and get latest footer
        $('body').off('change', '.select-role').on('change', '.select-role', function () {
            var $this = $(this),
                selValue = $this.find('option:selected').val(),
                redirectionUrl = $this.find('option:selected').data('url'),
                authURL = $this.find('option:selected').data('authUrl');

            $.cookie(roleCookie, selValue, '/');
            if (!isBHRedirect(redirectionUrl, selValue)) {
                getFooter();
            } else if (authURL && $.cookie(loginCookie)) {
                window.location = authURL;
            } else {
                submitRoleForm(redirectionUrl);
            }
        });

        // Role selected form P and S links
        $('body').off('click', '.choose-role li a').on('click', '.choose-role li a', function () {
            var $this = $(this),
                selValue = $this.attr('value'),
                redirectionUrl = $this.data('url'),
                authURL = $this.data('authUrl');

            $.cookie(roleCookie, selValue, '/');
            if (!isBHRedirect(redirectionUrl, selValue)) {
                getFooter();
            } else if (authURL && $.cookie(loginCookie)) {
                window.location = authURL;
            } else {
                submitRoleForm(redirectionUrl);
            }
        });

        //accordian show hide
        $('body').off('click', '.global-footer__link-column li .heading').on('click', '.global-footer__link-column li .heading', function () {
            if ($(window).innerWidth() < 1025) {
                var $this = $(this);
                $this.closest('.global-footer__links').find('.is-active').removeClass('is-active');
                $this.closest('.list').addClass('is-active');
            }
        });
    };

    var init = function (element) {
        console.log('APP.globalFooter');
        nodePath = $('#footer-nodepath').attr('data-nodepath');
        //checkUserLocale();
        
        bindEventsToUI();
        //APP.global.resizeRouteList.push('globalFooter');
        
    };

    /**
     * interfaces to public functions
     */
    return {
        init: init,
        render : getFooter
    };

}());
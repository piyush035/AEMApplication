/*!
    * login.js
    * This file contains the code for login functionality
    * 
    * @project   MFSCOM
    * @date      2017-06-02
    * @author    Rohit Kumar (SapientNitro)
    * @licensor  MFS
    * @site      MFSCOM
    *
    */

'use strict';

var APP = window.APP = window.APP || {};

APP.LoginRegister = (function () {
    var $loginDialogue = '',
        $loginButton = '';

    // hide/show login dialogue for desktop
    var openLoginDialogueDesktop = function(){
        $(window).scrollTop(0);
        if($loginDialogue.hasClass('closed')){
            // show dialogue if closed
            $loginDialogue.animate({
                right: 0
            }, 500).removeClass('closed');
        }else{
            // hide dialogue if closed
            $loginDialogue.animate({
                right: '-'+$loginDialogue.outerWidth()
            }, 500).addClass('closed');
        }
        
    };
    // hide/show login dialogue for mobile
    var openLoginDialogueMobile = function(){
        var $loginDialogue = $('.login-register').find('.login-container');
        if($loginDialogue.hasClass('closed')){
            // show dialogue if closed
            $loginDialogue.slideDown("slow").removeClass('closed');
            $('.login-register').find('.login-button').hide();
            $('.login-register').find('.close_login').off('click').on('click',function(){
                openLoginDialogueMobile();
            });
        }else{
            // hide dialogue if closed
            $loginDialogue.slideUp("fast").addClass('closed');
            $('.login-register').find('.login-button').show();
        }
        
    };
    var closeDialogueDesktop = function(){
        $(document).mouseup(function(e){
            // if the target of the click isn't the container nor a descendant of the container
            if (!$loginDialogue.is(e.target) && $loginDialogue.has(e.target).length === 0 && !$('.login-cta').is(e.target)){
                $loginDialogue.animate({
                    right: '-'+$loginDialogue.outerWidth()
                }, 500).addClass('closed');
            }
        });
    };
    var openLoginDialogue = function(){
    	if(APP.utility.isMobile()){
            // init for mobile
            openLoginDialogueMobile();
        }else{
            // init for desktop
            openLoginDialogueDesktop();
        }
    }
    var bindEventsToUI = function () {
        closeDialogueDesktop();
        $loginButton.off('click').on('click',function(){ 
        	openLoginDialogue();
        });
    };  
   
    var bindOnResize = function () {
        /* Don't forget to uncomment APP.global.resizeRouteList.push('actionsBar'); */
    };
    var toggleLoginButton = function(){
    	if(APP.global.user.loggedIn()){
    		$loginButton.hide();
    	}
    };
    var init = function (element) {
        $loginButton = $('.login-button');
        $loginDialogue = $('.login-register');
        bindEventsToUI();
        toggleLoginButton();
    };


    //Login rembember me checkBox
    window.check = function check(paramLoginAlertText) {
        var loginAlertText = paramLoginAlertText;
        if ($(".remember_row input").is(":checked")) {
            if (confirm(loginAlertText)) {
                return true;
            } else {
                $(".remember_row input").attr("checked", false);
                return false;
            }
        }
    } 
    
    /**
     * interfaces to public functions
     */
    return {
        init: init,
        bindOnResize: bindOnResize,
        openLoginDialogue : openLoginDialogue
    };

}());
APP.LoginRegister.init();
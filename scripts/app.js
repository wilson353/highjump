var highjump = {

    settings: {
        small:  767,
        medium: 1024
    },

    /**
     * Initialize application
     */
    init: function() {
        this.bindUI();
    },

    /**
     * Bind global UI elements
     * * Push navigation
     * * Stacked navigation
     */
    bindUI: function() {
        $(document).on("click", ".push-nav-toggle", this.pushnav);
        $(document).on("click", ".stacked .with-children > a", this.stackednav);
        $(document).on("click", ".stacked .home > a", this.stackednavHeader);
        $(document).on("click", ".dropdown-toggle", this.dropdown);
        $(document).on("click", this.dropdownhelper);

        $(document).on("click", ".mobile-toggle", function(e) {
            e.preventDefault();
			// close other menu if one is active
            $(".push-nav-toggle.active").click()
			

            var parent      = $(this).closest(".mobile-app-bar"),
                isOpen      = $(parent).hasClass("open");

            if (isOpen) {
                $(parent).removeClass("open");
            }
            else {
                $(parent).addClass("open");
            }
        });

        $(document).on("ready", this.resized);
        $(window).on("resize",  this.resized);
        $(window).on("scroll",  this.scrolled);
    },

    /**
     * Push Navigation
     * - NOTE, animations are handled in the CSS. See _nav.scss
     */
    pushnav: function(e) {
        e.preventDefault();
		// close mobile menu if it is open
        $(".mobile-app-bar.open .mobile-toggle").click();
				

        var self        = $(this),
            current     = $(".push-nav.open").attr("id"),
            target      = $(self).attr("data-target");

        // is a menu already open?
        if (current != undefined) {
            // then lets close it
            current = "#" + current;
            $("body").removeClass("push-nav-open");
            $(current).removeClass("open");
            $("a[data-target='" + current + "']").removeClass("active");

            // are we closing the current menu?
            if (current == target) {
                // then break if we are.
                return;
            }
        }

        // open menu
        $("body").addClass("push-nav-open");
        $(target).addClass("open");
        $(self).addClass("active");
    },

    /**
     * Stacked Navigation
     */
    stackednav: function(e) {
        e.preventDefault();

        var root    = $(this).closest(".stacked"),
            parent  = $(this).parent();

        // open         ... first child list is shown
        // closed       ... all child lists are hidden
        // inactive     ... item is hidden in tree

        if ($(parent).hasClass("closed")) { // Opening an item
            $(root).find(".current").addClass("ancestor").removeClass("current"); // add 'ancestor' class to previous 'current'
            $(parent).addClass("current"); // add 'current'

            $(parent).siblings(":not(.home)").addClass("inactive"); // hide all siblings but 'home'
            $(parent).removeClass("closed").addClass("open"); // display first child list
        }
        else { // Closing an item

            if ($(parent).hasClass("current"))
                return false; //no action for current item

            // But first remove 'current' class from previous and add to current
            $(root).find(".current").removeClass("current");
            $(parent).addClass("current").removeClass("ancestor");

            // Closing children...
            $(parent).find(".open").each(function() {
                $(this).siblings(":not(.home)").removeClass("inactive").removeClass("ancestor"); // show siblings
                $(this).removeClass("open").addClass("closed"); // hide child list
            });
        }
    },

    /**
     * Stacked Navigation Header
     */
    stackednavHeader: function(e) {
        e.preventDefault();

        var root    = $(this).closest(".stacked"),
            parent  = $(this).parent();

        if ($(root).find(".open").length) {
            // A child is open, reset the menu

            $(root).find(".current").removeClass("current");
            $(root).find(".ancestor").removeClass("ancestor");
            $(parent).addClass("current");

            $(root).find(".open").each(function() {
                $(this).removeClass("open").removeClass("active").addClass("closed");
                $(this).siblings(":not(.home)").removeClass("inactive");
            });
        }
        else {
            // No children are open, close the meneu

            var current =       $(".push-nav.open").attr("id"),
                target =        $(self).attr("data-target");

            current = "#" + current;

            $("body").removeClass("push-nav-open");
            $(current).removeClass("open");
            $("a[data-target='" + current + "']").removeClass("active");
        }
    },

    /**
     * Dropdown
     */
    dropdown: function(e) {
        e.preventDefault();

        var parent      = $(this).closest(".dropdown"),
            group       = $(parent).attr("data-dropdown-group"),
            isOpen      = $(parent).hasClass("open");

        if (isOpen) {
            // We are closing the current dropdown only
            $(parent).removeClass("open");
        }
        else {
            // We are closing all open dropdowns and opening the requested
            $( ".dropdown").removeClass("open");
            $(parent).addClass("open");
        }
    },

    /**
     * Dropdown Helper
     */
    dropdownhelper: function(e) {
        var container = $(".dropdown");

        // Close all dropdowns when clicking outside of any
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.removeClass("open");
        }
    },

    /**
     * Resized
     */
    resized: function() {
        var pageWidth = highjump.viewport().width;

        if (pageWidth >= highjump.settings.medium) {

            // Move action groups back to app-bar
            var actionGroups = $(".mobile-app-bar .mobile-content .action-group").detach();
            $(".app-bar").append(actionGroups);

        }

        if (pageWidth < highjump.settings.medium) {

            // Move alerts back to top-bar
            var alerts = $("li.alerts").detach();
            $(".utilities > ul").prepend(alerts);

            // Move action groups back to quick-nav
            var actionGroups = $(".app-bar .action-group").detach();
            $(".mobile-app-bar .mobile-content").append(actionGroups);
        }

        if (pageWidth < highjump.settings.small) {

            // Move alerts to quick-nav
            var alertToggle = $("li.alerts").detach();
            $(".quick-nav > ul").append(alertToggle);

        }

        highjump.setDynamicHeights();
    },

    /**
     * Scrolled
     */
    scrolled: function() {
        highjump.setDynamicHeights();
        highjump.pinned();
    },

    pinned: function() {
        var pageWidth = $("body").width(),
            pinnedTop = $('.nav-wrap').position().top,
            quickNavHeight = $(".quick-nav").outerHeight();

        if (pageWidth <= highjump.settings.medium) {
            if( $(window).scrollTop() > pinnedTop ) {
                $('.nav-wrap').addClass("pinned");

                if ($('.pinned-spacer').length == 0)
                    $('.nav-wrap').after().append("<div class='pinned-spacer' style='height:" + quickNavHeight + "px'></div>");
            }
            else {
                $('.nav-wrap').removeClass("pinned");
                $('.pinned-spacer').remove();
            }
        }
        else {
            $('.nav-wrap').removeClass("pinned");
            $('.pinned-spacer').remove();
        }
    },

    /**
     * Set Push Nav Height
     */
    setDynamicHeights: function() {
        var pageWidth               = highjump.viewport().width,
            accountNavHeight        = ($("body").outerHeight() - $(".top-bar").outerHeight()) + "px",
            pushNavHeight           = 0;

        if (pageWidth <= highjump.settings.medium) {
            if ($(".quick-nav").hasClass("is_stuck"))
                pushNavHeight = $("body").outerHeight() - $(".quick-nav").outerHeight();
            else {
                if ($(document).scrollTop() === 0)
                    pushNavHeight = $("body").outerHeight() - $(".quick-nav").outerHeight() - $(".quick-nav").offset().top;
                else
                    pushNavHeight = ($("body").outerHeight() - $(".quick-nav").outerHeight() - $(".quick-nav").offset().top) + $(document).scrollTop();
            }

            accountNavHeight = "auto";
        }
        else
            pushNavHeight = $(".page-wrap").outerHeight();

        $(".account .stacked")  .css("height", accountNavHeight);
        $(".push-nav")          .css("height", pushNavHeight + "px");
    },

    viewport: function() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window )) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
    }
};

$(function () {
    highjump.init();
});

var highjump = {

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
        $(document).on("click", ".dropdown > .dropdown-toggle", this.dropdown);
        $(document).on("click", this.dropdownhelper);

        $(document).on("ready", this.resized);
        $(window).on("resize", this.resized);
    },

    /**
     * Push Navigation
     * - NOTE, animations are handled in the CSS. See _nav.scss
     */
    pushnav: function(e) {
        e.preventDefault();

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

        // If we click outside of this... close it..

        if (!parent.is(e.target) // if the target of the click isn't the container...
            && parent.has(e.target).length === 0) // ... nor a descendant of the container
        {
            parent.removeClass("open");
        }

        // Is this part of a group?
        if (group != undefined) {
            $( ".dropdown[data-dropdown-group='" + group + "']").removeClass("open");

            // If this is the current item, do nothing. We are closing it. If not, open it.
            if (!isOpen)
                $(parent).addClass("open");
        }
        else {
            $(parent).toggleClass("open");
        }
    },

    dropdownhelper: function(e) {
        e.preventDefault();

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
     * - Set the push-nav height to accommodate vertical scrolling
     * - Set the account height to accommodate vertical scrolling
     */
    resized: function() {
        var heightForPushNav    = ($(".page-wrap").outerHeight()) + "px",
            heightForAccount    = ($("body").outerHeight() - $(".top-bar").outerHeight()) + "px";

        $(".push-nav").css("height", heightForPushNav);
        $(".account .stacked").css("height", heightForAccount);
    }
};

$(function () {
    highjump.init();
});
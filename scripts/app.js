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
     * Resized
     * - Set the push-nav height to account for overflow-y: auto
     */
    resized: function() {
        var pagewrapHeight = $(".page-wrap").outerHeight();
        $(".push-nav").css("height", pagewrapHeight + "px");
    }
};

$(function () {
    highjump.init();
});
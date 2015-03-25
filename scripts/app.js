var highjump = {

    /**
     * Initialize application
     */
    init: function() {
        this.getMenu();
        this.getThreads();
        this.getFavorites();
        this.bindUI();
    },

    getMenu: function() {

    },

    getThreads: function() {

    },

    getFavorites: function() {

    },

    /**
     * Bind global UI elements
     * * Push navigation
     * * Stacked navigation
     */
    bindUI: function() {
        $(document).on("click", ".push-nav-toggle", this.pushNav);
    },

    /**
     * Push Navigation
     * * NOTE, animations are handled in the CSS. See _nav.scss
     */
    pushNav: function(e) {
        e.preventDefault();

        var self =          $(this),
            current =       $(".push-nav.open").attr("id"),
            target =        $(self).attr("data-target");

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
    }
};

highjump.init();
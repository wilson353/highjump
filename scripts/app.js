var highjump = {
    init: function() {
        this.bindUI();
    },

    bindUI: function() {
        $(document).on("click", ".push-nav-toggle", this.pushNav);
    },

    pushNav: function(e) {
        e.preventDefault();

        var self =          $(this),
            current =       $(".push-nav.active").attr("id"),
            target =        $(self).attr("data-target");

        // check for and close current

        $(target).toggleClass("active");
        $(self).toggleClass("active");
        $("body").toggleClass("push-menu-open");
    }
};

highjump.init();
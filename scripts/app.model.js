highjump.model = {

    /**
     * Initialize model
     * - Load model specific code
     */
    init: function() {
        this.loadpushnav();
    },

    /**
     * Load push navigation into DOM
     * - Loading externally to allow reuse of markup across multiple pages
     */
    loadpushnav: function() {
        $.get("_push-nav.html", function(html) { $("#push").replaceWith(html); highjump.resized() });
    }
};

$(function () {
    highjump.model.init();
});
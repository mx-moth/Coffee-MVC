exports.Pages = new Class({
	Extends: app.getClass('Controller', 'AppObject'),

	index: function() {
		var page = $A(arguments).clean().join('/') || 'home';
		if (page.lastIndexOf('/') == page.length - 1) {
			page = page.substring(0, page.length - 1);
		}
		this.action = page;
	},
});

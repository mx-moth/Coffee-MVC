var View = new Class({
	Extends: app.getClass('CoreObject', 'CoreObject'),
	controller: null,
	action: null,
	layout: null,

	variables: {},

	options: {},

	initialize: function(controller, options) {
		this.controller = controller;
	},

	set: function(name, value) {
		if (typeof name == 'string') {
			this.variables[name] = value;
		} else {
			$H(name).each(function(value, name) {
				this.set(name, value);
			}, this);
		}
	},

	render: function(action, layout) {
		this.action = action;

		// Render everything
		var name = this.controller.getName() + '/' + this.action;
		var file = app.findFile(name, 'View');

		if (file) {
			return include(file).content;
		} else {
			this.throw_error('viewNotFound', {
				description: 'View ' + name + ' could not be found',
				controller: this.controller.getName(),
				action: this.action
			});
		}
	},
});

$extend(exports, {View: View});

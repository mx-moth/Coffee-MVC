var Template = require('template').Template;

var View = new Class({
	Extends: app.getClass('CoreObject', 'CoreObject'),
	controller: null,
	action: null,

	variables: {},

	options: {},

	extension: '.html',

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
		var file = app.findFile(name, 'View', this.extension);

		if (file) {
			var template = new Template({suffix: this.extension.substring(1)});
			var content = template.process(file, this.variables);
			if (layout) {
				this.set('contentForLayout', content);
				content = template.process(app.findFile(layout, 'Layout', this.extension), this.variables);
			}
			return content;
		} else {
			this.throw_error('View ' + name + this.extension + ' could not be found', {
				type: 'view_not_found',
				controller: this.controller.getName(),
				action: this.action
			});
		}
	},
});

$extend(exports, {View: View});

var Controller = new Class({

	Extends: app.getClass('CoreObject', 'CoreObject'),

	$type: 'Controller',
	$name: null,

	layout: 'default',
	action: null,

	autoRender: true,

	variables: {},

	initialize: function() {},

	handle: function(action, args) {
		if (this[action] && $type(this[action]) == 'function') {

			
			// Set up some variables
			this.view = new (app.getClass('View', 'CoreObject'))(this);
			this.action = action;

			this[action].apply(this, $splat(args));

			if (this.autoRender) {
				global.vars = this.variables;
				var rendered = this.view.render(this.action, this.layout);

				if (this.layout) {
					this.set('content_for_layout', rendered);
					global.vars = this.variables;
					layout = include(app.findFile(this.layout, 'Layout'));
					return layout.document.toString();
				} else {
					return rendered.element.toString();
				}
			}
		}
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

	getName: function() {
		return this.$name;
	}
});

$extend(exports, {Controller: Controller});

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

			var View = (app.getClass('View', 'CoreObject'));
			
			// Set up some variables
			this.view = new View(this);
			this.view.set(this.variables);
			this.action = action;

			this[action].apply(this, $splat(args));

			if (this.autoRender) {
				var rendered = this.view.render(this.action, this.layout);
				return rendered;
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

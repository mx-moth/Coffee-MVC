var Controller = new Class({

	Extends: app.getClass('CoreObject', 'CoreObject'),

	$type: 'Controller',
	$name: null,

	$layout: null,
	$action: null,

	$autoRender: true,

	$variables: null,

	parameters: null,

	initialize: function(options) {
		this.$setup(options);
	},

	$setup: function(options) {
		this.parameters = options.parameters || new Hash();
		this.$autoRender = Array.pick([options.autoRender, this.$autoRender]);
		this.$variables = new Hash();
		this.$layout = null;
	},

	handle: function(action, args) {
		if (this[action] && $type(this[action]) == 'function') {
			this.$action = action;

			var returned = this[action].apply(this, $splat(args));

			if (this.$autoRender) {

				// Set the view up
				var View = (app.getClass('View', 'CoreObject'));
				view = new View(this);
				view.set(this.$variables);

				// Render the view
				var rendered = view.render(this.$action, this.$layout);
				return rendered;
			} else {
				return returned;
			}
		} else {
			this.throw_error('The action ' + action + ' is not defined in controller ' + this.$name, {
				type: 'action_not_found',
				action: action,
				controller: this.$name
			});
		}
	},
	
	set: function(name, value) {

		if (typeof name == 'string') {
			this.$variables[name] = value;
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

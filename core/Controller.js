var Controller = new Class({

	Extends: app.getClass('CoreObject', 'CoreObject'),

	$type: 'Controller',
	$name: null,

	$layout: 'default',
	$action: null,

	autoRender: true,

	variables: {},

	initialize: function(options) {
		this.parameters = options.parameters || new Hash();
	},

	handle: function(action, args) {
		if (this[action] && $type(this[action]) == 'function') {

			var View = (app.getClass('View', 'CoreObject'));
			
			// Set up some variables
			view = new View(this);
			this.$action = action;

			var returned = this[action].apply(this, $splat(args));

			if (this.autoRender) {
				view.set(this.variables);
				var rendered = view.render(this.$action, this.$layout);
				return rendered;
			} else {
				return returned;
			}
		} else {
			this.throw_error('actionNotFound', {
				description: 'The action ' + action + ' is not defined in controller ' + this.$name,
				action: action,
				controller: this.$name
			});
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

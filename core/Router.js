var Router = new Class({
	Extends: CoreObject,

	initialize: function() {
	},

	/**
	 * Convert a URL to a Controller/action pair
	 *
	 * Parameters:
	 * 	url - The URL to decode
	 *
	 * Returns:
	 * An object with:
	 * 	controller: The Controller class referenced by the URL
	 * 	action: The action to call on the controller
	 * 	arguments: An array of arguments to send to the action
	 * 	parameters: An object of key:value parameters to send to the action
	 */
	getAction: function(url) {
		var bits = (url || '').split('/');

		var controller = app.getClass(bits.shift() || 'Pages', 'Controller');
		var action = bits.shift() || 'index';

		var args = [];
		var parameters = $H({});
		bits.each(function(bit) {
			if (bit.indexOf(':') !== -1) {
				parameters.include.apply(parameters, bit.split(':'));
			} else {
				args.push(bit);
			}
		});

		return {
			controller: controller,
			action: action,
			arguments: args,
			parameters: parameters
		};
	},

	getUrl: function(action) {
		var url = [app.base];

		var controller = action.controller;
		if (controller.$name) {
			url.push(controller.$name);
		} else {
			url.push(controller);
		}

		if (action.action) {
			url.push(action.action);
		}
		if (action.arguments) {
			action.arguments.each(url.push.bind(url));
		}
		if (action.params) {
			action.params.map(function(val, key) {
				url.push(key + ':' + val);
			});
		}
		return url.join('/');
	},

	connect: function(url, action) {
	}
});

$extend(exports, {Router: Router});

var Router = new Class({
	Extends: CoreObject,

	moustache: /\{([a-zA-Z0-9._-]+)\}/g,

	patterns: {
		controller: '([a-zA-Z0-9._-]+)',
		action: '([a-zA-Z0-9._-]+)',
		string: '([^\\/]*)',
		id: '(\\d+)',
	},

	connections: null,

	defaultController: 'Pages',
	defaultAction: 'index',

	initialize: function() {
		this.connections = [];
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
		url = url || '';

		var action = false;
		var tail = [];

		this.connections.some(function(connection) {
			var matches = connection.urlRegex.exec(url);
			if (matches) {

				action = $merge({
					controller: this.defaultController,
					action: this.defaultAction,
					arguments: [],
					parameters: {}
				}, connection.action);

				var i = 1;
				$H(connection.namedMoustaches).each(function(pattern, name) {
					action.controller = action.controller.replace(name, matches[i]);
					action.action = action.action.replace(name, matches[i]);
					action.arguments = action.arguments.map(function(argument) {
						return argument.replace(name, matches[i]);
					});
					action.parameters = $H(action.parameters).map(function(param) {
						return param.replace(name, matches[i]);
					});
					i = i + 1;
				});

				tail = (matches[i] || '').split('/');
				return true;
			}
			return false;
		}, this);

		if (!action) {
			var bits = (url || '').split('/');
			action = {
				controller: bits.shift(),
				action: bits.shift() || this.defaultAction,
				arguments: [],
				parameters: $H({})
			};

			tail = bits;
		}

		tail.each(function(bit) {
			if (bit.indexOf(':') !== -1) {
				action.parameters.include.apply(action.parameters, bit.split(':'));
			} else {
				action.arguments.push(bit);
			}
		});

		//action.controller = app.getClass(action.controller, 'Controller');

		return action;
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
		if (action.parameters) {
			action.parameters.map(function(val, key) {
				url.push(key + ':' + val);
			});
		}
		return url.join('/');
	},

	connect: function(url, action, patterns) {
		$extend(patterns || {}, this.patterns);
		var moustache = this.moustache;
		var namedMoustaches = {};

		var getMoustaches = function(string) {
			var match;
			while ((match = moustache.exec(string)) !== null) {
				namedMoustaches[match[0]] = patterns[match[1]] || patterns.string;
			}
		};

		// Get all {moustaches} from url.
		getMoustaches(url);

		// Format the URL to match (forward routing)
		var urlRegex = '^' + url + '(?:\/(.*))?$';
		$H(namedMoustaches).each(function(pattern, name) {
			urlRegex = urlRegex.replace(name, pattern);
		});

		// Format the action to match (reverse routing)
		actionRegex = action;

		this.connections.push({
			urlRegex: new RegExp(urlRegex),
			namedMoustaches: namedMoustaches,
			action:	actionRegex
		});

		/*
		response.write('<strong>URL</strong>: ' + HTML.dump(url) + '<br />');
		response.write(HTML.dump(urlRegex) + '<br />');
		response.write(HTML.dump(namedMoustaches) + '<br />');
		*/

		// Construct giant regex
		// ???
		// Profit
	}
});

$extend(exports, {Router: Router});

var Router = new Class({
	Extends: app.getClass('CoreObject', 'CoreObject'),

	moustache: /\{([a-zA-Z0-9._-]+)\}/g,

	patterns: {
		controller: '([a-zA-Z0-9._-]+)',
		action: '([a-zA-Z0-9._-]+)',
		string: '([^\\/]*)',
		id: '(\\d+)',
	},

	connections: null,
	connectionsR: null,

	defaultController: null,
	defaultAction: null,

	initialize: function() {
		this.connections = [];
		this.connectionsR = [];
	},

	loadRules: function(path) {
		this.connect(require(path || app.corePaths.config + '/routes.js').routes);
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
			var matches = connection.urlRegExp.exec(url);
			if (matches) {

				action = $merge({
					controller: this.defaultController,
					action: this.defaultAction,
					arguments: [],
					parameters: $H({})
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

				tail = (matches[i] ? matches[i].split('/') : []);

				return true;
			}
			return false;
		}, this);

		if (!action) {
			if (url[0] == '/') {
				url = url.substring(1);
			};
			var bits = (url || '').split('/');
			action = {
				controller: bits.shift() || this.defaultController,
				action: bits.shift() || this.defaultAction,
				arguments: [],
				parameters: $H({})
			};

			tail = bits;
		}

		tail.each(function(bit) {
			if (bit) {
				if (bit.indexOf(':') !== -1) {
					action.parameters.include.apply(action.parameters, bit.split(':'));
				} else {
					action.arguments.push(bit);
				}
			}
		});

		if (!this.defaultController) {
			this.defaultController = action.controller;
		}
		if (!this.defaultAction) {
			this.defaultAction = action.action;
		}

		var inflector = app.getInstance('Inflector', 'AppObject');
		action.controller = inflector.classify(action.controller);

		return action;
	},

	getUrl: function(action) {

		action = $merge({
			controller: this.defaultController,
			action: this.defaultAction,
			arguments: [],
			parameters: $H({})
		}, action);

		action.parameters = $H(action.parameters);

		var matchConnectionBit = function(bit, match, url) {
			var matches = match.pattern.exec(bit);
			var i = 1;
			if (url && matches) {
				$H(match.namedMoustaches).each(function(_, name) {
					url = url.replace(name, matches[i]);
					i++;
				});
				return url;

			}
			return false;
		};

		var match = this.connectionsR.some(function(connection) {
			var actionUrl = connection.url;
			var actionRegExp = $merge({
				controller: this.defaultController,
				action: this.defaultAction,
				arguments: [],
				parameters: $H({})
			}, connection.actionRegExp);

			actionRegExp.parameters = $H(actionRegExp.parameters);

			if (action.arguments.length < actionRegExp.arguments.length) {
				return false;
			}

			if (!actionRegExp.parameters.every(function(_, key) {
				return action.parameters.has(key);
			})) {
				return false;
			}

			actionUrl = actionUrl && matchConnectionBit(action.controller, actionRegExp.controller, actionUrl);
			actionUrl = actionUrl && matchConnectionBit(action.action, actionRegExp.action, actionUrl);
			actionRegExp.arguments.every(function(actionArg, i) {
				actionUrl = actionUrl && matchConnectionBit(action.arguments[i], arg, actionUrl);
				return actionUrl;
			});

			actionUrl && actionRegExp.parameters.every(function(match, name) {
				actionUrl = actionUrl && matchConnectionBit(action.parameters[name], match, actionUrl);
				return actionUrl;
			});

			if (actionUrl) {
				// Remove matched parameters from the action
				actionRegExp.parameters.each(function(_, key) {
					action.parameters.erase(key);
				});
				// Remove matched arguments from the action
				actionUrl = actionUrl + action.arguments.splice(0, actionRegExp.arguments.length);
				
				// Add an empty argument here to include an extra /
				if (action.arguments.length > 0) {
					action.arguments.unshift('');
				}

				actionUrl = actionUrl + action.arguments.join('/');
				action.parameters.each(function(val, name) {
					actionUrl = actionUrl + '/' + name + ':' + val;
				});

				url = actionUrl;
				return true;
			}

			return false;
		});

		if (match) {
			return url;
		}

		// Find all the matches in the things
		var url = [app.base];

		var controller = action.controller;
		var inflector = app.getInstance('Inflector', 'AppObject');

		url.push(inflector.tableize(controller.$name || controller));
		url.push(action.action);
		url.extend(action.arguments);
		action.parameters.each(function(val, key) {
			url.push(key + ':' + val);
		});

		return url.join('/');
	},

	connect: function(url, action, patterns) {
		if (!action && !patterns) {
			url.each(function(arr) {
				this.connect.apply(this, arr);
			}, this);
			return;
		}

		$extend(patterns || {}, this.patterns);
		var moustache = this.moustache;
		var namedMoustaches = {};

		var getMoustaches = function(string) {
			var match;
			var namedMatches = {};
			while ((match = moustache.exec(string)) !== null) {
				namedMatches[match[0]] = patterns[match[1]] || patterns;
			}
			return namedMatches;
		};

		// Get all {moustaches} from url.
		namedMoustaches = getMoustaches(url);

		// Format the URL to match (forward routing)
		var urlRegExp = '^' + url + '(?:\/(.*))?$';
		$H(namedMoustaches).each(function(pattern, name) {
			urlRegExp = urlRegExp.replace(name, pattern);
		});

		// Format the action to match (reverse routing)
		var formatActionRegExp = function(string, name, pattern) {
			match = {
				pattern: string,
				namedMoustaches: getMoustaches(string)
			};
			$H(match.namedMoustaches).each(function(pattern, name) {
				match.pattern = match.pattern.replace(name, pattern);
			});
			match.pattern = new RegExp(match.pattern);
			return match;
		}

		actionRegExp = $merge(action);
		actionRegExp.controller = formatActionRegExp(actionRegExp.controller);
		actionRegExp.action = formatActionRegExp(actionRegExp.action);
		actionRegExp.arguments = (actionRegExp.arguments || []).map(function(arg) {
			return formatActionRegExp(arg);
		});
		actionRegExp.parameters = $H(actionRegExp.parameters).map(function(val, key) {
			return formatActionRegExp(val);
		});

		this.connections.push({
			namedMoustaches: namedMoustaches,
			actionRegExp: actionRegExp,
			urlRegExp: new RegExp(urlRegExp),
			action:	action,
			url: url
		});
		this.connectionsR.unshift({
			namedMoustaches: namedMoustaches,
			actionRegExp: actionRegExp,
			urlRegExp: new RegExp(urlRegExp),
			action:	action,
			url: url
		});
	}
});

Element.Properties.href = {
	set: function(action) {
		var url;

		if ($type(action) == 'string') {
			url = action;
		} else {
			url = app.getInstance('Router', 'AppObject').getUrl(action);
		}

		this.setAttribute('href', url);
	}
};

$extend(exports, {Router: Router});

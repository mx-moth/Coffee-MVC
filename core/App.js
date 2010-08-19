var App = new Class({
	Extends: CoreObject,

	paths: {
	},
	classes: {
	},

	router: null,

	/**
	 * Creates a new App, loading settings and setting paths
	 */
	initialize: function() {

		var pathsMerged = {};

		(['core/config/paths.js', 'app/config/paths.js']).each(function(configPath) {
			data = require(paths.root + '/' + configPath);
			$H(data).each(function(paths, type) {
				if (!pathsMerged[type]) {
					pathsMerged[type] = [];
				}
				paths.unshift(pathsMerged[type]);
				Array.unshift.apply(Array, paths);
			});
		});
		this.paths = pathsMerged;

		this.setRouter(new (this.getClass('Router', 'CoreObject')));
	},

	/**
	 * Get all the paths of a certain type
	 */
	getPaths: function(type) {
		return this.paths[type] || [];
	},

	/**
	 * Set the router used by this App
	 *
	 * Paramaters
	 * 	router - The router to use for this App
	 */
	setRouter: function(router) {
		this.router = router;
	},

	/**
	 * Finds a file in the application, and returns its path. It searches all paths included
	 * in the config/paths.js file. If the file is not found, then null is returned
	 *
	 * Paramaters:
	 * 	name - The name of the class.
	 * 	type - The type of the class. Eg. Controller, Model, Behaviour...
	 *
	 * Returns: The path of the file, or null if it can not be found.
	 */
	findFile: function(name, type) {
		var file = null;
		this.getPaths(type).some(function(path) {
			path = path + '/' + name;
			return this.getPaths('extensions').some(function(extension) {
				if (new File(paths.root + '/' + path + extension).exists()) {
					file = paths.root + '/' + path + extension;
					return true;
				}
				return false;
			});
		}, this);
		return file;
	},

	/**
	 * Add a class to the list of known classes
	 *
	 * Paramaters:
	 * 	name - The name of the class.
	 * 	type - The type of the class. Eg. Controller, Model, Behaviour...
	 * 	c - The class to add
	 */
	addClass: function(name, type, c) {
		if (!this.classes[type]) {
			this.classes[type] = {};
		}
		this.classes[type][name] = c;
	},

	/**
	 * Returns the constructor for a given class. If the class is unknown, it will be loaded
	 *
	 * Paramaters:
	 * 	name - The name of the class.
	 * 	type - The type of the class. Eg. Controller, Model, Behaviour...
	 *
	 * Throws: classNotFound
	 *
	 * Returns: The constructor for the class
	 */
	getClass: function(name, type) {
		if (!(this.classes[type] && this.classes[type][name])) {
			this.loadClass(name, type);
		}

		return this.classes[type][name];
	},

	/**
	 * Loads a class file, and adds it to the list of known classes
	 *
	 * Paramaters:
	 * 	name - The name of the class.
	 * 	type - The type of the class. Eg. Controller, Model, Behaviour...
	 *
	 * Throws: classNotFound
	 */
	loadClass: function(name, type) {
		var file = this.findFile(name, type);
		var c = null;
		if (file) {
			c = require(file)[name];
			c.implement('$name', name);
			c['$name'] = name;

			if (c) {
				this.addClass(name, type, c);
			} else {
				throw new (new Class({
					description: type + ' ' + name + ' in file ' + file + ' did not export ' + name,
					name: name,
					type: type,
					file: file,
					toString: function() {
						return this.description;
					}
				}))();
			}
		} else {
			throw new (new Class({
				description: 'Could not find ' + type + ' ' + name,
				name: name,
				type: type,
				toString: function() {
					return this.description;
				}
			}))();
			this.throw_error('classNotFound', {
				description: type + ' ' + name + ' could not be found',
				name: name,
				type: type
			});
		}
	}
});

Class.Mutators.CoreObject = function() {
	return true;
}

$extend(exports, {App: App});

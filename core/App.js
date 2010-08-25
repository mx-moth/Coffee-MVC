var App = new Class({

	paths: null,
	classes: null,
	instances: null,

	router: null,

	/**
	 * Creates a new App, loading settings and setting paths
	 */
	initialize: function() {

		this.paths = {};
		this.classes = {};
		this.instances = {};

		var pathsMerged = {};

		// Include the config paths
		([paths.core + '/config/paths.js', paths.config + '/paths.js']).each(function(configPath) {
			data = require(configPath);
			$H(data).each(function(paths, type) {
				if (!pathsMerged[type]) {
					pathsMerged[type] = [];
				}
				paths.unshift(pathsMerged[type]);
				Array.unshift.apply(Array, paths);
			});
		});
		this.paths = pathsMerged;
	},

	/**
	 * Get all the paths of a certain type
	 */
	getPaths: function(type) {
		return this.paths[type] || [];
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
	findFile: function(name, type, extension) {
		var file = null;
		extension = Array.from($pick(extension, this.paths.extensions));
		this.getPaths(type).some(function(path) {
			path = path + '/' + name;
			return extension.some(function(extension) {
				if (new File(path + extension).exists()) {
					file = path;
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

			if (c) {
				c.implement('$name', name);
				c['$name'] = name;
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
	},

	/**
	 * Function: getInstance
	 * Get a 'global' instance of a class. For this to work, the class needs
	 * an empty constructor
	 *
	 * Paramaters:
	 * 	name - The name of the class.
	 * 	type - The type of the class. Eg. Controller, Model, Behaviour...
	 *
	 * Returns:
	 *  An instance of the class asked for
	 *
	 * Throws: classNotFound
	 */
	 getInstance: function(name, type) {
		if (!this.instances[type]) {
			this.instances[type] = {};
		}
		if (!this.instances[type][name]) {
			this.instances[type][name] = new (this.getClass(name, type))();
		}

		return this.instances[type][name];
	 },
});

Class.Mutators.CoreObject = function() {
	return true;
}

$extend(exports, {App: App});

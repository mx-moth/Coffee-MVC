Error.implement({
	options: {
		description: null,
	},

	setOptions: function(options) {
		this.options = options || {};
	},

	toString: function() {
		return this.options.description || this.message;
	}
});
var CoreObject = new Class({
	throw_error: function(error, data) {
		err = new Error(error);
		err.setOptions(data);
		throw err;
	}
});

$extend(exports, {CoreObject: CoreObject});

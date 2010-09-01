var CoffeeError = new Class({
	initialize: function(message, data) {
		this.message = message;
		$extend(this, data);
	},

	toString: function() {
		return 'Error: ' + this.message;
	}
});
var CoreObject = new Class({
	CoreObject: true,

	throw_error: function(error, data) {
		err = new CoffeeError(error, data);
		Error.captureStackTrace(err, this.throw_error);
		throw err;
	},

	toString: function() {
		return this.$name;
	}
});

$extend(exports, {CoreObject: CoreObject});

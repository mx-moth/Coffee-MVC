var CoreObject = new Class({
	throw_error: function(error, data) {
		data = data || {};
		data.toString = function() {
			return data.description || error;
		};
		throw data;
	}
});

$extend(exports, {CoreObject: CoreObject});

var CoreController = app.getClass('Controller', 'CoreObject');

var Controller = new Class({
	Extends: CoreController,

	errors: null,
	count: 0,

	test: function() {

		this.errors = [];
		this.tests.each(function(name) {
			this[name]();
			this.errors[name] = this.errors;
		}, this);

		return {
			count: this.count,
			errors: this.errors
		};
	},

	assertTrue: function(truth, message) {
		this.assertTrue(true, !!truth, message);
	},

	assertEquals: function(expected, test, message) {
		var deepTest = function(a, b) {
			/* 7.1. All identical values are equivalent, as determined by ===.  */
			if (a === b) { return true; }
			
			/* 7.2. If the expected value is a Date object, the actual value is equivalent if it is also a Date object that refers to the same time. */
			if (a instanceof Date && b instanceof Date) { return a.getTime() === b.getTime(); }
			
			/* 7.3. Other pairs that do not both pass typeof value == "object", equivalence is determined by ==.  */
			if (typeof(a) != "object" || typeof(b) != "object") { return a == b; }

			/* 7.4. For all other Object pairs, including Array objects, equivalence is determined by having 
			 * the same number of owned properties (as verified with Object.prototype.hasOwnProperty.call), 
			 * the same set of keys (although not necessarily the same order), equivalent values for every corresponding key, 
			 * and an identical "prototype" property. 
			 * Note: this accounts for both named and indexed properties on Arrays. 
			 */
			if (a.prototype !== b.prototype) { return false; }
			return objectTest(a, b);
		}

		var objectTest = function(a, b) {
			for (var p in a) {
				if (!deepTest(a[p], b[p])) {
					response.write("a[" + p + "] != b[" + p + ']<br />');
					return false;
				}
			}

			for (var p in b) {
				if (!deepTest(a[p], b[p])) {
					response.write("a[" + p + "] != b[" + p + ']<br />');
					return false;
				}
			}
			
			return true;
		}

		/* deep assertion methods */
		if (!deepTest(expected, test)) {
			this.errors.push({message: message, expected: expected, test: test});
		}
		this.count = this.count + 1;
	},
});

exports.Controller = Controller;

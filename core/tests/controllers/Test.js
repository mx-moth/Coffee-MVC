var AppController = app.getClass('Controller', 'AppObject')

var Test = new Class({
	Extends: AppController,

	controllers: [
		'InflectorTests',
		'RouterTests',
	],

	index: function() {
		var tests = {};
		this.controllers.each(function(name) {
			var Controller = app.getClass(name, 'Controller');
			var controller = new Controller({autoRender: false});
			var state = controller.handle('test');
			tests[name] = state;
		}, this);

		this.set('tests', tests);
	},

});

exports.Test = Test;

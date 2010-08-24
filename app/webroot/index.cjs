#!/usr/local/bin/v8cgi

File.prototype.getParent = function() {
	return new Directory(this.toString().replace(/(.*)\/[^\/]+\/?/, '$1'));
};
Directory.prototype.getParent = function() {
	return new Directory(this.toString().replace(/(.*)\/[^\/]+\/?/, '$1'));
};

var paths = {};
paths.webroot = new File(system.env.SCRIPT_FILENAME).getParent();
paths.app = paths.webroot.getParent();
paths.config = new Directory(paths.app + '/config');
paths.root = paths.app.getParent();
paths.core = new Directory(paths.root + '/core');


var scriptUrl = request.headers()['SCRIPT_URL'];
var url = request.get.url || "";

if (scriptUrl.substring(scriptUrl - url.length) == url) {
	paths.base = scriptUrl(0, scriptUrl.length - url.length);
} else {
	paths.base = '';
}

exports.paths = paths;
// TODO Fix this. The above should be enough, but it isnt
global.paths = paths;

try {
	include(paths.core + '/loader');

	app = new App();
	exports.app = app;

	inflector = app.getInstance('Inflector', 'AppObject');
	exports.inflector = inflector;

	router = app.getInstance('Router', 'AppObject');
	exports.router = router;

	router.loadRules();

	var action = router.getAction(request.get.url);
	var controller = new (app.getClass(action.controller, 'Controller'))();
	controller.parameters = action.parameters;
	response.write(controller.handle(action.action, action.arguments));
} catch (err) {
	response.write('<pre>' + err + "<br />" + HTML.dump(err) + '</pre>');
}

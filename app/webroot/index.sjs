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

if (scriptUrl.substring(scriptUrl.length - url.length) == url) {
	paths.base = scriptUrl.substring(0, scriptUrl.length - url.length);
} else {
	paths.base = '';
}

exports.paths = paths;
// TODO Fix this. The above should be enough, but it isnt
global.paths = paths;

try {

	// Include the loader
	include(paths.core + '/loader');

	// Make an app and a router
	app = new App(paths);
	exports.app = app;

	router = app.getInstance('Router', 'AppObject');
	router.loadRules();

	// Get the action to load
	var action = router.getAction(request.get.url);

	// Load the controller and make the request
	var Controller = app.getClass(action.controller, 'Controller');
	var controller = new Controller({parameters: action.parameters});
	response.write(controller.handle(action.action, action.arguments));
} catch (err) {
	response.write('<pre>' + err + "<br />" + HTML.dump(err) + '</pre>');
}

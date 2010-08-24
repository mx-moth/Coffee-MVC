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

// TODO Work out how to export this properly
// Doing an $extend(exports, {paths: paths}); does not work, as it 
// wont be avaliable in the next include
global.paths = paths;

try {
	include(paths.core + '/loader');
} catch (err) {
	response.write('<pre>' + err + "<br />" + HTML.dump(err) + '</pre>');
}

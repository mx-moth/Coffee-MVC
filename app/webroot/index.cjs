#!/usr/local/bin/v8cgi

var paths = {};
File.prototype.getParent = function() {
	return new Directory(this.toString().replace(/(.*)\/[^\/]+\/?/, '$1'));
};
Directory.prototype.getParent = function() {
	return new Directory(this.toString().replace(/(.*)\/[^\/]+\/?/, '$1'));
};

paths.webroot = new File(system.env.SCRIPT_FILENAME).getParent();
paths.app = paths.webroot.getParent();
paths.root = paths.app.getParent();
paths.core = new Directory(paths.root + '/core');


var scriptUrl = request.headers()['SCRIPT_URL'];
var url = request.get.url || "";

if (scriptUrl.substring(scriptUrl - url.length) == url) {
	paths.base = scriptUrl(0, scriptUrl.length - url.length);
} else {
	paths.base = '';
}

global.paths = paths;

include('../../core/loader');

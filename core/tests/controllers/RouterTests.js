var AppController = app.getClass('Controller', 'AppObject');
var Router = app.getClass('Router', 'CoreObject');

var RouterTests = new Class({
	Extends: AppController,
	
	initialize: function(options) {
		this.$setup(options);
		this.router = new Router();
		this.router.loadRules(paths.config + '/routes.test');
	},

	tests: [
		'getAction',
	],

	getAction: function() {
		$H({
			'/': {
				controller: 'Repository',
				action: 'index',
				arguments: [],
				parameters: {}
			},
			'/test.git': {
				controller: 'Repository',
				action: 'view',
				arguments: [],
				parameters: $H({
					repository: 'test.git',
					ref: 'master',
				}),
			},
			'/test.git/view/dev': {
				controller: 'Repository',
				action: 'view',
				arguments: [],
				parameters: $H({
					repository: 'test.git',
					ref: 'dev',
				}),
			},
			'/test.git/log/dev': {
				controller: 'Repository',
				action: 'log',
				arguments: [],
				parameters: $H({
					repository: 'test.git',
					ref: 'dev',
				}),
			},
			'/test.git/log/master/2009-09-09/2010-09-09': {
				controller: 'Repository',
				action: 'log',
				parameters: $H({
					repository: 'test.git',
					ref: 'master',
				}),
				arguments: ['2009-09-09', '2010-09-09'],
			},
			'/test.git/log/dev/2009-09-09/2010-09-09': {
				controller: 'Repository',
				action: 'log',
				parameters: $H({
					repository: 'test.git',
					ref: 'dev',
				}),
				arguments: ['2009-09-09', '2010-09-09'],
			},
			'/test.git/diff/dev/compare:ticket-2345': {
				controller: 'Repository',
				action: 'diff',
				arguments: [],
				parameters: $H({
					repository: 'test.git',
					ref: 'dev',
					compare: 'ticket-2345',
				}),
			},
			'/controllers/action/1/2/arg/key:val/test:test': {
				controller: 'Controller',
				action: 'action',
				parameters: $H({
					key: 'val', test: 'test'
				}),
				arguments: [1, 2, 'arg']
			}
		}).each(function(action, url) {
			this.assertEquals(action, this.router.getAction(url), "URL " + url + " returned incorrect action");
			this.assertEquals(url, this.router.getUrl(action), "Action " + JSON.stringify(action) + " returned incorrect URL");
		}, this);
	}
});

exports.RouterTests = RouterTests;

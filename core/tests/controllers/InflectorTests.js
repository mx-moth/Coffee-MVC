var AppController = app.getClass('Controller', 'AppObject');

var InflectorTests = new Class({
	Extends: AppController,

	initialize: function(options) {
		this.$setup(options);
		this.inflector = app.getInstance('Inflector', 'CoreObject');
	},

	tests: [
		'slug',
		'singularize',
		'pluralize',
		'camelize',
		'underscore',
		'tableize',
		'classify',
		'variable',
	],

	slug: function() {
		this.assertEquals('hello-world', this.inflector.slug("Hello world!"),
			'Basic slug of "Hello world!" failed');
		this.assertEquals('a-long-title-with-symbols', this.inflector.slug("A long title with #$%^&* symbols"),
			'Symbol replacement doesnt work');
		this.assertEquals('alternate.replace......symbol', this.inflector.slug("#$alternate!^*replace&.^.^.Symbol", '.'),
			'Alternate replace symbol does not work');
	},

	pluralize: function() {
		this.assertEquals('cats', this.inflector.pluralize('cat'), 'Simple pluralization failed');
		this.assertEquals('sheep', this.inflector.pluralize('sheep'), 'Uninflected sheep was pluralized');
		this.assertEquals('oxen', this.inflector.pluralize('ox'), 'Irregular oxen was incorrectly pluralized');
	},

	singularize: function() {
		this.assertEquals('cat', this.inflector.singularize('cats'), 'Simple singularization failed');
		this.assertEquals('sheep', this.inflector.singularize('sheep'), 'Uninflected sheep was singularized');
		this.assertEquals('ox', this.inflector.singularize('oxen'), 'Irregular oxen was incorrectly singluarized');
	},

	camelize: function() {
		this.assertEquals('LowerUnder', this.inflector.camelize('lower_under'), 'Camelizing LowerUnder failed');
		this.assertEquals('One', this.inflector.camelize('one'), 'Camelizing single word failed');
		this.assertEquals('OxenAndSheep', this.inflector.camelize('oxen_and_sheep'), 'Camelizing three words failed');
		this.assertEquals('WordWord', this.inflector.camelize('word__word'), 'Camelizing double underscore failed');
	},

	underscore: function() {
		this.assertEquals('camel_case', this.inflector.underscore('CamelCase'), 'Underscoring CamelCase failed');
		this.assertEquals('one', this.inflector.underscore('One'), 'Underscoring single word failed');
		this.assertEquals('oxen_and_sheep', this.inflector.underscore('OxenAndSheep'), 'Underscoring multiple words failed');
	},

	tableize: function() {
		this.assertEquals('class_names', this.inflector.tableize('ClassName'), 'Tableizing ClassName failed');
		this.assertEquals('ones', this.inflector.tableize('One'), 'Tableizing single word failed');
		this.assertEquals('people', this.inflector.tableize('Person'), 'Tableizing irregular word failed');
		this.assertEquals('oxen_and_sheep', this.inflector.tableize('OxenAndSheep'), 'Tableizing uninflected word failed');
		this.assertEquals('sheep_and_oxen', this.inflector.tableize('SheepAndOx'), 'Tableizing irregular and uninflected words failed');
	},

	classify: function() {
		this.assertEquals('ClassName', this.inflector.classify('class_names'));
		this.assertEquals('One', this.inflector.classify('ones'));
		this.assertEquals('Person', this.inflector.classify('people'));
		this.assertEquals('OxenAndSheep', this.inflector.classify('oxen_and_sheep'));
		this.assertEquals('SheepAndOx', this.inflector.classify('sheep_and_oxen'));
	},

	variable: function() {
		this.assertEquals('className', this.inflector.variable('class_name'));
		this.assertEquals('one', this.inflector.variable('one'));
		this.assertEquals('person', this.inflector.variable('person'));
		this.assertEquals('oxenAndSheep', this.inflector.variable('oxen_and_sheep'));
		this.assertEquals('sheepAndOx', this.inflector.variable('sheep_and_ox'));
		this.assertEquals('classNames', this.inflector.variable('class_names'));
		this.assertEquals('ones', this.inflector.variable('ones'));
		this.assertEquals('people', this.inflector.variable('people'));
		this.assertEquals('oxenAndSheep', this.inflector.variable('oxen_and_sheep'));
		this.assertEquals('sheepAndOxen', this.inflector.variable('sheep_and_oxen'));
	},
});

exports.InflectorTests = InflectorTests;

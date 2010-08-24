$extend(exports, {InflectorTests: new Class({
	Extends: app.getClass('Controller', 'AppObject'),

	initialize: function() {
		this.parent(arguments);
		this.inflector = app.getInstance('Inflector', 'CoreObject');
	},

	tests: {
		'slug',
		'singularize',
		'pluralize',
		'camelize',
		'underscore',
		'tableize',
		'classify',
		'variable'
	},

	slug: function() {
		this.assertEquals('hello-world', this.inflector.slug("Hello world!"));
		this.assertEquals('a-long-title-with-symbols', this.inflector.slug("A long title with #$%^&* symbols"));
		this.assertEquals('alernate-replace', this.inflector.slug("#$alternate!^*replace&^^", '.'));
	},

	pluralize: function() {
		this.assertEquals('sheep', this.inflector.pluralize('sheep'));
		this.assertEquals('oxen', this.inflector.pluralize('ox'));
		this.assertEquals('cats', this.inflector.pluralize('cat'));
	},

	singularize: function() {
		this.assertEquals('sheep', this.inflector.singularize('sheep'));
		this.assertEquals('ox', this.inflector.singularize('oxen'));
		this.assertEquals('cat', this.inflector.singularize('cats'));
	},

	camelize: function() {
		this.assertEquals('LowerUnder', this.inflector.camelize('lower_under'));
		this.assertEquals('One', this.inflector.camelize('one'));
		this.assertEquals('OxenAndSheep', this.inflector.camelize('oxen_and_sheep'));
		this.assertEquals('WordWord', this.inflector.camelize('word__word'));
	},

	underscore: function() {
		this.assertEquals('camel_case', this.inflector.underscore('CamelCase'));
		this.assertEquals('one', this.inflector.underscore('One'));
		this.assertEquals('oxen_and_sheep', this.inflector.underscore('OxenAndSheep'));
	},

	tableize: function() {
		this.assertEquals('class_names', this.inflector.tableize('ClassName'));
		this.assertEquals('ones', this.inflector.tableize('One'));
		this.assertEquals('people', this.inflector.tableize('Person'));
		this.assertEquals('oxen_and_sheep', this.inflector.tableize('OxenAndSheep'));
		this.assertEquals('sheep_and_oxen', this.inflector.tableize('SheepAndOx'));
	},

	classify: function() {
		this.assertEquals('ClassName', this.inflector.classify('class_names'));
		this.assertEquals('One', this.inflector.classify('ones'));
		this.assertEquals('Person', this.inflector.classify('people'));
		this.assertEquals('OxenAndSheep', this.inflector.classify('oxen_and_sheep'));
		this.assertEquals('SheepAndOx', this.inflector.classify('sheep_and_oxen'));
	},

	variable: function() {
		this.assertEquals('className', this.inflector.variable('class_names'));
		this.assertEquals('ones', this.inflector.variable('ones'));
		this.assertEquals('people', this.inflector.variable('people'));
		this.assertEquals('oxenAndSheep', this.inflector.variable('oxen_and_sheep'));
		this.assertEquals('sheepAndOxen', this.inflector.variable('sheep_and_oxen'));
	}
});

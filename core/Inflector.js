/*
 * Class: Inflector
 * Pluralize and singularize English words.
 *
 * Taken from CakePHPs Inflector class
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2010, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */
$extend(exports, {Inflector: new Class({

	Extends: app.getClass('CoreObject', 'CoreObject'),

	/**
	 * Plural inflector rules
	 */
	_plural: {
		rules: [
			[/(s)tatus$/i, '$1$2tatuses'],
			[/(quiz)$/i, '$1zes'],
			[/^(ox)$/i, '$1$2en'],
			[/([m|l])ouse$/i, '$1ice'],
			[/(matr|vert|ind)(ix|ex)$/i, '$1ices'],
			[/(x|ch|ss|sh)$/i, '$1es'],
			[/([^aeiouy]|qu)y$/i, '$1ies'],
			[/(hive)$/i, '$1s'],
			[/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
			[/sis$/i, 'ses'],
			[/([ti])um$/i, '$1a'],
			[/(p)erson$/i, '$1eople'],
			[/(m)an$/i, '$1en'],
			[/(c)hild$/i, '$1hildren'],
			[/(buffal|tomat)o$/i, '$1$2oes'],
			[/(alumn|bacill|cact|foc|fung|nucle|radi|stimul|syllab|termin|vir)us$/i, '$1i'],
			[/us$/, 'uses'],
			[/(alias)$/i, '$1es'],
			[/(ax|cris|test)is$/i, '$1es'],
			[/s$/, 's'],
			[/^$/, ''],
			[/$/, 's']
		],
		uninflected: [
			'.*[nrlm]ese', '.*deer', '.*fish', '.*measles', '.*ois', '.*pox', '.*sheep', 'people'
		],
		irregular: {
			atlas: 'atlases',
			beef: 'beefs',
			brother: 'brothers',
			child: 'children',
			corpus: 'corpuses',
			cow: 'cows',
			ganglion: 'ganglions',
			genie: 'genies',
			genus: 'genera',
			graffito: 'graffiti',
			hoof: 'hoofs',
			loaf: 'loaves',
			man: 'men',
			money: 'monies',
			mongoose: 'mongooses',
			move: 'moves',
			mythos: 'mythoi',
			niche: 'niches',
			numen: 'numina',
			occiput: 'occiputs',
			octopus: 'octopuses',
			opus: 'opuses',
			ox: 'oxen',
			penis: 'penises',
			person: 'people',
			sex: 'sexes',
			soliloquy: 'soliloquies',
			testis: 'testes',
			trilby: 'trilbys',
			turf: 'turfs'
		}
	},

	/**
	 * Singular inflector rules
	 */
	_singular: {
		rules: [
			[/(s)tatuses$/i, '\1\2tatus'],
			[/^(.*)(menu)s$/i, '\1\2'],
			[/(quiz)zes$/i, '\1'],
			[/(matr)ices$/i, '\1ix'],
			[/(vert|ind)ices$/i, '\1ex'],
			[/^(ox)en/i, '\1'],
			[/(alias)(es)*$/i, '\1'],
			[/(alumn|bacill|cact|foc|fung|nucle|radi|stimul|syllab|termin|viri?)i$/i, '\1us'],
			[/([ftw]ax)es/i, '\1'],
			[/(cris|ax|test)es$/i, '\1is'],
			[/(shoe|slave)s$/i, '\1'],
			[/(o)es$/i, '\1'],
			[/ouses$/, 'ouse'],
			[/uses$/, 'us'],
			[/([m|l])ice$/i, '\1ouse'],
			[/(x|ch|ss|sh)es$/i, '\1'],
			[/(m)ovies$/i, '\1\2ovie'],
			[/(s)eries$/i, '\1\2eries'],
			[/([^aeiouy]|qu)ies$/i, '\1y'],
			[/([lr])ves$/i, '\1f'],
			[/(tive)s$/i, '\1'],
			[/(hive)s$/i, '\1'],
			[/(drive)s$/i, '\1'],
			[/([^fo])ves$/i, '\1fe'],
			[/(^analy)ses$/i, '\1sis'],
			[/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '\1\2sis'],
			[/([ti])a$/i, '\1um'],
			[/(p)eople$/i, '\1\2erson'],
			[/(m)en$/i, '\1an'],
			[/(c)hildren$/i, '\1\2hild'],
			[/(n)ews$/i, '\1\2ews'],
			[/eaus$/, 'eau'],
			[/^(.*us)$/, '\1'],
			[/s$/i, ''],
		],
		uninflected: [
			'.*[nrlm]ese', '.*deer', '.*fish', '.*measles', '.*ois', '.*pox', '.*sheep', '.*ss'
		],
		irregular: {
			waves: 'wave'
		}
	},

	/**
	 * Words that should not be inflected
	 */
	_uninflected: [
		'Amoyese', 'bison', 'Borghese', 'bream', 'breeches', 'britches', 'buffalo', 'cantus',
		'carp', 'chassis', 'clippers', 'cod', 'coitus', 'Congoese', 'contretemps', 'corps',
		'debris', 'diabetes', 'djinn', 'eland', 'elk', 'equipment', 'Faroese', 'flounder',
		'Foochowese', 'gallows', 'Genevese', 'Genoese', 'Gilbertese', 'graffiti',
		'headquarters', 'herpes', 'hijinks', 'Hottentotese', 'information', 'innings',
		'jackanapes', 'Kiplingese', 'Kongoese', 'Lucchese', 'mackerel', 'Maltese', 'media',
		'mews', 'moose', 'mumps', 'Nankingese', 'news', 'nexus', 'Niasese',
		'Pekingese', 'Piedmontese', 'pincers', 'Pistoiese', 'pliers', 'Portuguese',
		'proceedings', 'rabies', 'rice', 'rhinoceros', 'salmon', 'Sarawakese', 'scissors',
		'sea[- ]bass', 'series', 'Shavese', 'shears', 'siemens', 'species', 'swine', 'testes',
		'trousers', 'trout','tuna', 'Vermontese', 'Wenchowese', 'whiting', 'wildebeest',
		'Yengeese'
	],

	/**
	 * Default map of accented and special characters to ASCII characters
	 */
	_transliteration: [
		[/ä|æ|ǽ/, 'ae'],
		[/ö|œ/, 'oe'],
		[/ü/, 'ue'],
		[/Ä/, 'Ae'],
		[/Ü/, 'Ue'],
		[/Ö/, 'Oe'],
		[/À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ/, 'A'],
		[/à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª/, 'a'],
		[/Ç|Ć|Ĉ|Ċ|Č/, 'C'],
		[/ç|ć|ĉ|ċ|č/, 'c'],
		[/Ð|Ď|Đ/, 'D'],
		[/ð|ď|đ/, 'd'],
		[/È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě/, 'E'],
		[/è|é|ê|ë|ē|ĕ|ė|ę|ě/, 'e'],
		[/Ĝ|Ğ|Ġ|Ģ/, 'G'],
		[/ĝ|ğ|ġ|ģ/, 'g'],
		[/Ĥ|Ħ/, 'H'],
		[/ĥ|ħ/, 'h'],
		[/Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ/, 'I'],
		[/ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı/, 'i'],
		[/Ĵ/, 'J'],
		[/ĵ/, 'j'],
		[/Ķ/, 'K'],
		[/ķ/, 'k'],
		[/Ĺ|Ļ|Ľ|Ŀ|Ł/, 'L'],
		[/ĺ|ļ|ľ|ŀ|ł/, 'l'],
		[/Ñ|Ń|Ņ|Ň/, 'N'],
		[/ñ|ń|ņ|ň|ŉ/, 'n'],
		[/Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ/, 'O'],
		[/ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º/, 'o'],
		[/Ŕ|Ŗ|Ř/, 'R'],
		[/ŕ|ŗ|ř/, 'r'],
		[/Ś|Ŝ|Ş|Š/, 'S'],
		[/ś|ŝ|ş|š|ſ/, 's'],
		[/Ţ|Ť|Ŧ/, 'T'],
		[/ţ|ť|ŧ/, 't'],
		[/Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ/, 'U'],
		[/ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ/, 'u'],
		[/Ý|Ÿ|Ŷ/, 'Y'],
		[/ý|ÿ|ŷ/, 'y'],
		[/Ŵ/, 'W'],
		[/ŵ/, 'w'],
		[/Ź|Ż|Ž/, 'Z'],
		[/ź|ż|ž/, 'z'],
		[/Æ|Ǽ/, 'AE'],
		[/ß/, 'ss'],
		[/Ĳ/, 'IJ'],
		[/ĳ/, 'ij'],
		[/Œ/, 'OE'],
		[/ƒ/, 'f']
	],

	/**
	 * Cached array identity map of pluralized words.
	 */
	_pluralized: {},

	/**
	 * Cached array identity map of singularized words.
	 */
	_singularized: {},

	/**
	 * Cached Underscore Inflections
	 */
	_underscore: {},

	/**
	 * Cached Camelize Inflections
	 */
	_camelize: {},

	/**
	 * Classify cached inflecctions
	 */
	_classify: {},

	/**
	 * Tablize cached inflections
	 */
	_tableize: {},

	/**
	 * Humanize cached inflections
	 */
	_humanize: {},

	/**
	 * Humanize cached inflections
	 */
	_variable: {},

/**
 * Cache inflected values, and return if already available
 *
 * Parameters:
 * 		type - Inflection type
 * 		key - Original value
 * 		value - Inflected value
 *
 * Returns:
 * 		Inflected value, from cache
 */
	_cache: function(type, key, value) {

		key = '_' + key;
		type = '_' + type;

		if (value) {
			this[type][key] = value;
			return value;
		}

		if (!(this[type][key])) {
			return false;
		}
		return this[type][key];
	},

	/**
	 * Adds custom inflection rules, of either 'plural', 'singular' or 'transliteration' type.
	 *
	 * Usage:
	 *
	 * (start code)
	 * Inflector::rules('plural', {'/^(inflect)or$/i': '\1ables'});
	 * Inflector::rules('plural', {
	 *     rules: array('/^(inflect)ors$/i': '\1ables'),
	 *     uninflected: array('dontinflectme'),
	 *     irregular: array(red: 'redlings')
	 * ));
	 * Inflector::rules('transliteration', array('/å/': 'aa'));
	 * (end code)
	 *
	 * Parameters:
	 * 		type - The type of inflection, either 'plural', 'singular' or 'transliteration'
	 * 		rules - Array of rules to be added.
	 * 		reset - If true, will unset default inflections for all new rules that are being defined in rules.
	 */
	rules: function(type, rules, reset) {
		var _type = '_' + type;

		switch (type) {
			case 'transliteration':
				if (reset) {
					this._transliteration = rules;
				} else {
					this._transliteration = rules.combine(this._transliteration);
				}
			break;

			default:
				$H(rules).each(function(pattern, rule ) {
					if ($type(pattern) == 'array') {
						if (reset) {
							this[_type][rule] = pattern;
						} else {
							this[_type][rule] = $merge(this[_type][rule], pattern);
						}
						delete rules[rule], this[_type]['cache' + ucfirst(rule)], this[_type].merged[rule];
						if (type === 'plural') {
							this._pluralized = this._tableize = [];
						} else if (type === 'singular') {
							this._singularized = [];
						}
					}
				}, this);
				this[_type].rules = rules.combine(this[_type].rules);
			break;
		}
	},

	/**
	 * Return word in plural form.
	 *
	 * Parameters:
	 * 		word - Word in singular
	 *
	 * Returns:
	 * 		Word in plural
	 */
	pluralize: function(word) {

		var regs;

		if ((this._pluralized[word])) {
			return this._pluralized[word];
		}

		if (!this._plural.merged) {
			this._plural.merged = {};
		}

		if (!this._plural.merged.irregular) {
			this._plural.merged.irregular = this._plural.irregular;
		}

		if (!(this._plural.merged.uninflected)) {
			this._plural.merged.uninflected = this._uninflected.combine(this._plural.uninflected);
		}

		if (!(this._plural.cacheUninflected) || !(this._plural.cacheIrregular)) {
			this._plural.cacheUninflected = '(?:' + this._plural.merged.uninflected.join('|') + ')';
			this._plural.cacheIrregular = '(?:' + $H(this._plural.merged.irregular).getKeys().join('|') + ')';
		}

		regs = new RegExp('(.*)\\b(' + this._plural.cacheIrregular + ')$', 'i').exec(word);
		if (regs !== null) {
			this._pluralized[word] = regs[1] + word.substring(0, 1) + this._plural.merged.irregular[regs[2].toLowerCase()].substring(1);
			return this._pluralized[word];
		}

		regs = new RegExp('^(' + this._plural.cacheUninflected + ')$', 'i').exec(word);
		if (regs !== null) {
			this._pluralized[word] = word;
			return word;
		}

		var matched = this._plural.rules.some(function(arr) {
			var rule = arr[0];
			var replacement = arr[1];
			if (rule.test(word)) {
				this._pluralized[word] = word.replace(rule, replacement);
				return true;
			}
		}, this);
		return this._pluralized[word];
	},

/**
 * Return word in singular form.
 *
 * @param string word Word in plural
 * @return string Word in singular
 * @access public
 * @static
 * @link http://book.cakephp.org/view/1479/Class-methods
 */
	singularize: function(word) {
		var regs;

		if ((this._singularized[word])) {
			return this._singularized[word];
		}

		if (!this._singular.merged) {
			this._singular.merged = {};
		}

		if (!(this._singular.merged.uninflected)) {
			this._singular.merged.uninflected = this._uninflected.combine(this._singular.uninflected);
		}

		if (!(this._singular.merged.irregular)) {
			this._singular.merged.irregular = $merge($H(this._plural.irregular).flip(), this._singular.irregular);
		}

		if (!(this._singular.cacheUninflected) || !(this._singular.cacheIrregular)) {
			this._singular.cacheUninflected = '(?:' + this._singular.merged.uninflected.join('|') + ')';
			this._singular.cacheIrregular = '(?:' + $H(this._singular.merged.irregular).getKeys().join('|') + ')';
		}

		regs = new RegExp('(.*)\\b(' + this._singular.cacheIrregular + ')$', 'i').exec(word);
		if (regs !== null) {
			this._singularized[word] = regs[1] + word.substring(0, 1) + this._singular.merged.irregular[regs[2].toLowerCase()].substring(1);
			return this._singularized[word];
		}

		regs = new RegExp('^(' + this._singular.cacheUninflected + ')$', 'i').exec(word);
		if (regs !== null) {
			this._singularized[word] = word;
			return word;
		}

		var replaced = this._singular.rules.some(function(arr) {
			var rule = arr[0];
			var replacement = arr[1];
			if (rule.test(word)) {
				this._singularized[word] = word.replace(rule, replacement);
				return true;
			}
		}, this);

		if (!replaced) {
			this._singularized[word] = word;
		}
		return this._singularized[word];
	},

/**
 * Returns the given lower_case_and_underscored_word as a CamelCased word.
 *
 * @param string lower_case_and_underscored_word Word to camelize
 * @return string Camelized word. LikeThis.
 * @access public
 * @static
 * @link http://book.cakephp.org/view/1479/Class-methods
 */
	camelize: function(lowerCaseAndUnderscoredWord) {
		if (!(result = this._cache('camelize', lowerCaseAndUnderscoredWord))) {
			result = this.humanize(lowerCaseAndUnderscoredWord).replace(/ /g, '');
			this._cache('camelize', lowerCaseAndUnderscoredWord, result);
		}
		return result;
	},

/**
 * Returns the given camelCasedWord as an underscored_word.
 *
 * @param string camelCasedWord Camel-cased word to be "underscorized"
 * @return string Underscore-syntaxed version of the camelCasedWord
 * @access public
 * @static
 * @link http://book.cakephp.org/view/1479/Class-methods
 */
	underscore: function(camelCasedWord) {
		if (!(result = this._cache('underscore', camelCasedWord))) {
			result = camelCasedWord.replace(/(\w)([A-Z])/g, '$1_$2').toLowerCase();
			this._cache('underscore', camelCasedWord, result);
		}
		return result;
	},

/**
 * Returns the given underscored_word_group as a Human Readable Word Group.
 * (Underscores are replaced by spaces and capitalized following words.)
 *
 * @param string lower_case_and_underscored_word String to be made more readable
 * @return string Human-readable string
 * @access public
 * @static
 * @link http://book.cakephp.org/view/1479/Class-methods
 */
	humanize: function(lowerCaseAndUnderscoredWord) {
		if (!(result = this._cache('humanize', lowerCaseAndUnderscoredWord))) {
			result = lowerCaseAndUnderscoredWord.replace(/_/g, ' ').capitalize();
			this._cache('humanize', lowerCaseAndUnderscoredWord, result);
		}
		return result;
	},

/**
 * Returns corresponding table name for given model className. ("people" for the model class "Person").
 *
 * @param string className Name of class to get database table name for
 * @return string Name of the database table for given class
 * @access public
 * @static
 * @link http://book.cakephp.org/view/1479/Class-methods
 */
	tableize: function(className) {
		if (!(result = this._cache('tableize', className))) {
			result = this.pluralize(this.underscore(className));
			this._cache('tableize', className, result);
		}
		return result;
	},

/**
 * Returns Cake model class name ("Person" for the database table "people".) for given database table.
 *
 * @param string tableName Name of database table to get class name for
 * @return string Class name
 * @access public
 * @static
 * @link http://book.cakephp.org/view/1479/Class-methods
 */
	classify: function(tableName) {
		if (!(result = this._cache('classify', tableName))) {
			result = this.camelize(this.singularize(tableName));
			this._cache('classify', tableName, result);
		}
		return result;
	},

	/**
	 * Returns camelBacked version of an underscored string.
	 *
	 * @param string string
	 * @return string in variable form
	 * @access public
	 * @static
	 * @link http://book.cakephp.org/view/1479/Class-methods
	 */
	variable: function(string) {
		if (!(result = this._cache('variable', string))) {
			string2 = this.camelize(this.underscore(string));
			replace = string2.substring(0, 1).toLowerCase();
			result = string2.replace(/\w/, replace);
			this._cache('variable', string, result);
		}
		return result;
	},

	/**
	 * Returns a string with all spaces converted to underscores (by default), accented
	 * characters converted to non-accented characters, and non word characters removed.
	 *
	 * @param string string the string you want to slug
	 * @param string replacement will replace keys in map
	 * @param array map extra elements to map to the replacement
	 * @deprecated map param will be removed in future versions. Use Inflector::rules() instead
	 * @return string
	 * @access public
	 * @static
	 * @link http://book.cakephp.org/view/1479/Class-methods
	 */
	slug: function(string, replacement, map) {

		replacement = $pick(replacement, '_');

		if ($type(replacement) == 'array') {
			map = replacement;
			replacement = '_';
		}
		quotedReplacement = replacement.escapeRegExp();

		merge = [
			// TODO WTF?
			// [/[^\s\p{Ll}\p{Lm}\p{Lo}\p{Lt}\p{Lu}\p{Nd}]/mg, ' '],
			[new RegExp('[^\sa-zA-Z0-9' + replacement + ']', 'mg'), ' '],
			[/ +/g, replacement],
			[new RegExp('^[' + replacement + ']+|[' + replacement + ']+$', 'g'), ''],
		];

		map = (map || []).combine(this._transliteration).combine(merge);
		map.each(function(m) {
			string = string.replace(m[0], m[1]);
		});
		return string.toLowerCase();
	}
})});


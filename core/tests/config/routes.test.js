var gitPatterns = {
	repository: '([a-zA-Z0-9._-]+.git)',
	ref: '([a-zA-Z0-9._-]+)',
	actions: '(view|log|diff|network)',
};

exports.routes = [[
	'/{repository}/{actions}/{ref}',
	{controller: 'Repository', action: '{actions}', parameters: {
		repository: '{repository}',
		ref: '{ref}'
	}},
	gitPatterns
], [
	'/{repository}',
	{controller: 'Repository', action: 'view', parameters: {
		repository: '{repository}',
		ref: 'master'
	}},
	gitPatterns
],
['/', {controller: 'Repository', action: 'index', parameters: {}, arguments: []}],
];

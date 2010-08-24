$extend(exports, {
	extensions: ['.js'],
	View: [paths.core + '/views'],
	Layout: [paths.core + '/views/layouts'],
	Controller: [paths.core + '/controllers'],
	Model: [paths.core + '/models'],

	CoreObject: [paths.core],
	AppObject: [paths.core],
});

$extend(exports, {
	extensions: ['.js'],
	View: ['core/views'],
	Layout: ['core/views/layouts'],
	Controller: ['core/controllers'],
	Model: ['core/models'],

	CoreObject: ['core'],
	AppObject: ['core'],
});

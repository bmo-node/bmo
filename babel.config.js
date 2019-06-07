module.exports = function (api) {
	api.cache(false);
	return {
		presets: [
			[
				'@babel/env',
				{
					modules: 'cjs',
					loose: true,
					targets: {
						node: 'current'
					}
				}
			]
		]
	};
};

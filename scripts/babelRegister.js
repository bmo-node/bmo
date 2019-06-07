require('@babel/register')({
	sourceMaps: true,
	cache: false,
	rootMode: 'upward',
	ignore: [],
	exclude: [],
	include: [/@randall/gi]
})

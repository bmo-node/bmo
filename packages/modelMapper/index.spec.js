import modelMapper from '.';
const mockMap = {
	'foo': 'bar',
	'baz.fuz': 'baz-fuz'
};
const input = {
	bar: 'thing',
	'baz-fuz': 'otherThing'
};
const expected = {
	foo: input.bar,
	baz: {
		fuz: input['baz-fuz']
	}
};
describe('modelMapper', () => {
	it('should map the keys to a new object', () => {
		expect(modelMapper()(mockMap)(input)).toEqual(expected);
	});
});

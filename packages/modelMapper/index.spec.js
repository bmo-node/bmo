import modelMapper from '.';
const mockMap = {
	'foo': 'bar',
	'baz.fuz': 'baz-fuz'
};
const input = {
	bar: 'thing',
	'baz-fuz': 'otherThing'
};

const functionMap = {
	foo: 'bar',
	'baz-fuz': (currentValue) => currentValue.bar
};
const expectedFunction = {
	foo: input.bar,
	'baz-fuz': input.bar
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
	it('should use the function to create the value if the value is a function', () => {
		expect(modelMapper()(functionMap)(input)).toEqual(expectedFunction);
	});
});

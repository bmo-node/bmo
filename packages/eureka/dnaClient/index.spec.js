import dnaClient from 'dna-resilient-client';
import client from '.';
describe('DNA client', () => {
	it('Should return the dna client', () => {
		expect(client()).toBe(dnaClient);
	});
});

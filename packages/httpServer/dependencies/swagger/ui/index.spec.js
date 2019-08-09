import ui from '.';
const docUrl = '/api/docs';
describe('swagger.ui', () => {
	it('Should inject the doc url into the html', () => {
		const html = ui(docUrl);
		expect(new RegExp(`spec-url='${docUrl}'`).test(html)).toBeTruthy();
	});
});

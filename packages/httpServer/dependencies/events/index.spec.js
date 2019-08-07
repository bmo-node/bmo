import EventEmitter from 'events';
import events from '.';
describe('Events module', () => {
	it('Should return the event emitter', () => {
		const eventsModule = events();
		expect(eventsModule).toBeInstanceOf(EventEmitter);
	});
	it('Should return the same emitter for multiple calls', () => {
		const eventsModule = events();
		const eventsModule2 = events();
		expect(eventsModule).toBe(eventsModule2);
	});
});

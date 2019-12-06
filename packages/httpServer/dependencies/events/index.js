import EventEmitter from 'events';
let emitter;
export default () => {
	if (!emitter) {
		emitter = new EventEmitter();
	}
	return emitter;
};

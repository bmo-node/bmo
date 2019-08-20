export const SIGNALS = [
	'SIGINT',
	'SIGTERM'
];

export default ({
	config: {
		events: {
			shutdown
		}
	},
	dependencies: {
		events
	}
}) => {
	SIGNALS.forEach((signal) => {
		process.on(signal, async () => {
			events.emit(shutdown);
			process.exit(0);
		});
	});
};

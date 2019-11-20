import { shallowMount } from '@vue/test-utils';
import TokenLoader, { events as tokenEvents } from '.';

describe('TokenLoader', () => {
	const host = 'host';
	const token = 'token';
	const event = {
		origin: host,
		data: {
			token
		}
	};
	const onAuthenticated = jest.fn();
	global.addEventListener = jest.fn((_, cb) => cb(event));
	global.setTimeout = jest.fn()
		.mockImplementationOnce((f) => f());
	it('calls onAuthenticated with the token from the event', () => {
		const wrapper = shallowMount(TokenLoader, {
			propsData: {
				host,
				onAuthenticated
			}
		});
		expect(wrapper.emitted(tokenEvents.ONAUTHENTICATED)).toBeTruthy();
		wrapper.destroy();
	});
	it('starts a timer if an interval time is passed', () => {
		const interval = 1000;
		const wrapper = shallowMount(TokenLoader, {
			propsData: {
				host,
				onAuthenticated,
				interval
			}
		});
		expect(global.setTimeout).toHaveBeenCalledWith(wrapper.vm.enableIFrame, interval);
		wrapper.destroy();
	});
});

import { shallowMount } from '@vue/test-utils';
import TokenLoader from './TokenLoader';

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
	it('calls onAuthenticated with the token from the event', () => {
		const wrapper = shallowMount(TokenLoader, {
			propsData: {
				host,
				onAuthenticated
			}
		});
		expect(onAuthenticated).toHaveBeenCalledWith(token);
		wrapper.destroy();
	});
});

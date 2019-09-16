import authenticate from '.';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import HTTP_STATUS from 'http-status-codes';

jest.mock('axios');
jest.mock('jsonwebtoken');

const host = 'https://mock-auth.lmig.com';
const verifyToken = '/api/verify/v1';
const testToken = 'testToken';
const testData = 'some data in a jwt';
const manifest = () => ({
	config: {
		auth: {
			host,
			verifyToken
		}
	},
	dependencies: {
		logger: {
			error: jest.fn()
		}
	}
});
const context = () => ({
	headers: {
		authorization: `Bearer ${testToken}`
	}
});

jwt.decode.mockImplementation(() => testData);

describe('authenticate', () => {
	describe('Happy Path', () => {
		let m;
		let mw;
		let ctx;
		let next;
		beforeAll(async () => {
			m = manifest();
			mw = authenticate(m);
			ctx = context();
			next = jest.fn();
			await mw(ctx, next);
		});
		it('Should call next when the user is authenticated by the service', () => {
			expect(next).toHaveBeenCalled();
		});
		it('Should verify token with the correct host, endpoint, and token', () => {
			expect(axios.put).toHaveBeenCalledWith(`${host}${verifyToken}`, { token: testToken });
		});

		it('Should populate ctx.user with the result of jwt.decode', () => {
			expect(ctx.user).toEqual(testData);
		});
	});

	describe('Error Cases', () => {
		let m;
		let mw;
		let ctx;
		let next;
		beforeAll(async () => {
			axios.put.mockImplementation(() => {
				throw new Error();
			});
			m = manifest();
			mw = authenticate(m);
			ctx = context();
			next = jest.fn();
		});
		it('Should log the error when the service denies the request', async () => {
			await mw(ctx, next);
			expect(m.dependencies.logger.error).toHaveBeenCalled();
		});
		it('Should set the status to 401 when the service call fails', async () => {
			await mw(ctx, next);
			expect(ctx.status).toEqual(HTTP_STATUS.UNAUTHORIZED);
		});
	});
});

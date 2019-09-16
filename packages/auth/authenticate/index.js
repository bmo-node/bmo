import { get } from 'lodash';
import HTTP_STATUS from 'http-status-codes';
import jwt from 'jsonwebtoken';
import axios from 'axios';
export default ({
	config: { auth },
	dependencies: { logger }
}) => {
	const { host, verifyToken, expectedStatus } = auth;
	return async (ctx, next) => {
		const token = get(ctx, 'headers.authorization', '').replace(/Bearer/, '').trim();
		try {
			const result = await axios.put(`${host}${verifyToken}`, { token });
			logger.info('User Authenticated');
			// The token has been authenticated by our service
			// so we can decode here without verifying the signature
			ctx.userInfo = jwt.decode(token);
			await next();
		} catch (e) {
			logger.error(e);
			ctx.status = HTTP_STATUS.UNAUTHORIZED;
			ctx.body = {};
		}
	};
};

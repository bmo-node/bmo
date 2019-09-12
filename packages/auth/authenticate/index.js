import { get } from 'lodash';
import HTTP_STATUS from 'http-status-codes';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
export default ({
	config: { auth },
	dependencies: { logger }
}) => {
	const { host, verifyToken } = auth;
	return async (ctx, next) => {
		const token = get(ctx, 'headers.Authorization', '').replace(/Bearer/, '').trim();
		try {
			const result = await fetch.put(`${host}/${verifyToken}`, { token });
			if (result.statusCode > 200 && result.statusCode < 300) {
				logger.info('User Authenticated');
				// The token has been authenticated by our service
				// so we can decode here without verifying the signature
				ctx.userInfo = jwt.decode(token);
				await next();
			}
		} catch (e) {
			ctx.status = HTTP_STATUS.UNATHORIZED;
			ctx.body = {};
		}
	};
};

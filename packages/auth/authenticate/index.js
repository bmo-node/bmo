import { get } from 'lodash';
import HTTP_STATUS from 'http-status-codes';
import jwt from 'jsonwebtoken';
import axios from 'axios';
export default ({
	config: {
		auth
	},
	dependencies: {
		logger,
		errors
	}
}) => {
	const { host, verifyToken } = auth;
	return async (ctx, next) => {
		try {
			const token = get(ctx, 'headers.authorization', '')
				.replace(/Bearer/, '')
				.trim();
			// Axios throws an error on > 400 so if this passes we are good.
			await axios.put(`${host}${verifyToken}`, { token });
			// The token has been authenticated by our service
			// so we can safely decode here without verifying the signature
			ctx.user = jwt.decode(token);
		} catch (e) {
			logger.error(e);
			throw new errors.Unauthenticated(`Access Denied`);
		}
		await next();
	};
};

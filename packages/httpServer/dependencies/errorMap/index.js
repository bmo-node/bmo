import httpStatusCodes from 'http-status-codes';
import { each } from 'lodash';
const {
	BAD_REQUEST,
	NOT_FOUND,
	INTERNAL_SERVER_ERROR,
	UNAUTHORIZED,
	FORBIDDEN
} = httpStatusCodes;
export default ({
	dependencies: {
		errors
	}
}) => {
	const {
		Validation,
		Unauthenticated,
		Unauthorized,
		NotFound
	} = errors;
	const map = {
		[BAD_REQUEST]: [Validation],
		[NOT_FOUND]: [NotFound],
		// The status code for unauthorized really means unauthenticated
		[UNAUTHORIZED]: [Unauthenticated],
		[FORBIDDEN]: [Unauthorized]
	};
	return {
		get _map () { return map; },
		addError: (type, status) => {
			const key = status.toString();
			if (!map[key]) {
				map[key] = [];
			}
			map[key].push(type);
		},
		getErrorStatus: (error) => {
			let errorCode = INTERNAL_SERVER_ERROR;
			each(map, (types, code) => {
				/* this will be a string since the typeof check is against another typeof check */
				/* eslint-disable-next-line valid-typeof */
				if (types.some(t => error instanceof t)) {
					errorCode = parseInt(code);
				}
			});
			return errorCode;
		}
	};
};

import clamp from 'lodash.clamp';

const formatParams = (params) => Object.keys(params)
	.reduce((acc, param) => acc.concat(`&${param}=${params[param]}`), '');

const formatUrl = (host, resource, offset, limit, params) =>
	`${host}${resource}?offset=${offset}&limit=${limit}${params}`;
export default ({
	config: {
		server: {
			host
		}
	}
}) => ({ total, offset, limit, resource, params = {} }) => {
	let next, prev, last;
	const queryParams = formatParams(params);
	const self = formatUrl(host, resource, offset, limit, queryParams);
	last = formatUrl(host, resource, total - limit, limit, queryParams);
	if (total >= limit + offset) {
		next = formatUrl(host, resource, offset + limit, limit, queryParams);
	}
	if (offset - limit >= 0) {
		prev = formatUrl(host, resource, clamp(offset - limit, 0, total), limit, queryParams);
	} else if (offset !== 0) {
		prev = formatUrl(host, resource, 0, limit, queryParams);
	}

	if (offset + limit >= total) {
		last = undefined;
	}
	return { next, prev, self, last };
};

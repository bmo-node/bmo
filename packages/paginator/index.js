import clamp from 'lodash.clamp';
const formatUrl = (host, resource, offset, limit) => `${host}${resource}?offset=${offset}&limit=${limit}`;
export default ({
	config: {
		server: {
			host
		}
	}
}) => ({ total, offset, limit, resource }) => {
	let next, prev, last;
	const self = formatUrl(host, resource, offset, limit);
	last = formatUrl(host, resource, total - limit, limit);
	if (total >= limit + offset) {
		next = formatUrl(host, resource, offset + limit, limit);
	}
	if (offset - limit >= 0) {
		prev = formatUrl(host, resource, clamp(offset - limit, 0, total), limit);
	} else if (offset !== 0) {
		prev = formatUrl(host, resource, 0, limit);
	}

	if (offset + limit >= total) {
		last = undefined;
	}
	return { next, prev, self, last };
};

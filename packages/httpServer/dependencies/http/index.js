import status from 'http-status-codes';

export default () => ({
	status,
	methods: {
		GET: 'GET',
		PUT: 'PUT',
		POST: 'POST',
		DELETE: 'DELETE',
		PATCH: 'PATCH',
		HEAD: 'HEAD',
		CONNECT: 'CONNECT',
		OPTIONS: 'OPTIONS',
		TRACE: 'TRACE'
	}
});

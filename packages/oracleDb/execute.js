export default ({
	dependencies: {
		connectionPool
	}
}) => async (query) => {
	const connection = await connectionPool.getConnection();
	connection.execute(query);
	connection.close();
};

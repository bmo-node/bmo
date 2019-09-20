export default async ({
	dependencies: {
		connectionPool
	}
}) => async (statement, bindings = {}) => {
	const connection = await connectionPool.getConnection();
	const value = await connection.execute(statement, bindings);
	connectionPool.closeConnection(connection);
	return value;
};

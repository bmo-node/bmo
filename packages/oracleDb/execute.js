export default async ({
	dependencies: {
		connectionPool
	}
}) => async (statement) => {
	const connection = await connectionPool.getConnection();
	const value = await connection.execute(statement);
	connection.close();
	return value;
};

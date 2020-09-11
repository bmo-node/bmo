export default ({
  config: {
    events: {
      shutdown
    }
  },
  dependencies: { server, events }
}) => {
  const connections = {}
  server.on('connection', connection => {
    const { remoteAddress: address, remotePort: port } = connection
    const key = `${address}:${port}`
    connections[key] = connection
    connection.on('close', () => {
      delete connections[key]
    })
  })
  return () => new Promise(res => {
    events.emit(shutdown)
    Object.keys(connections).forEach(key => {
      connections[key].destroy()
    })
    server.close(res)
  })
}

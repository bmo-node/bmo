import db from '.'

const mockDb = { $database: {}, namespace: 'db1' }
const client = {
  db: jest.fn(() => mockDb)
}
const MongoClient = {
  connect: jest.fn(() => client)
}
const on = jest.fn()
const manifest = () => ({
  config: {
    mongodb: {
      user: 'user',
      password: 'password',
      url: 'url',
      databases: {
        db1: {
          col1: 'col1'
        }
      }
    },
    events: { shutdown: 'shutdown' }
  },
  dependencies: {
    logger: {
      error: jest.fn(),
      info: jest.fn()
    },
    events: {
      on
    },
    mongodb: {
      MongoClient
    }
  }
})
describe('db', () => {
  let mockManifest
  beforeEach(() => {
    jest.clearAllMocks()
    mockManifest = manifest()
  })
  it('Should create the client and return it', async () => {
    const result = await db(mockManifest)
    expect(result).toEqual({ db1: mockDb })
  })
  it('Should connect to the database', async () => {
    await db(mockManifest)
    const { url, password, user } = mockManifest.config.mongodb
    expect(MongoClient.connect).toHaveBeenCalledWith(url, {
      auth: { user, password },
      poolSize: 20,
      useUnifiedTopology: true
    })
  })
  it('Should throw an error when it cannot connect', async () => {
    MongoClient.connect.mockImplementation(() => {
      throw connectionError
    })
    const connectionError = new Error('Connection error')
    try {
      await db(mockManifest)
    } catch (e) {
      expect(e.message).toEqual(connectionError.message)
    }
  })
})

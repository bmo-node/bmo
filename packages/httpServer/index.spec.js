import App from './app'
import start from '.'
jest.mock('./app')
describe('App index', () => {
  it('Should call the app constructor with the config', () => {
    const config = {}
    start(config)
    expect(App).toHaveBeenCalledWith(config)
  })
})

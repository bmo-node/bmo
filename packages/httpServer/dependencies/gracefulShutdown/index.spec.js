import { mockProcessExit } from 'jest-mock-process'
import shutdown, { SIGNALS } from '.'
const shutdownEvent = 'shutdown'
const manifest = {
  config: {
    events: {
      shutdown: shutdownEvent
    }
  },
  dependencies: {
    events: {
      emit: jest.fn()
    }
  }
}
describe('Graceful shutdown', () => {
  SIGNALS.forEach(signal => {
    describe(`${signal}`, () => {
      it('Should attach a listener to the process.on function', () => {
        const processOnSpy = jest.spyOn(process, 'on')
        const processExitSpy = jest.spyOn(process, 'exit')
        shutdown(manifest)
        expect(processOnSpy).toHaveBeenCalledWith(signal, expect.anything())
        processOnSpy.mockRestore()
        processExitSpy.mockRestore()
      })
      it('events.emit should be called with the shudown event when the listener is invoked', () => {
        let eventHandler
        const exitMock = mockProcessExit()
        const processOnSpy = jest.spyOn(process, 'on')
          .mockImplementation((signal, listener) => {
            eventHandler = listener
          })
        shutdown(manifest)
        eventHandler()
        expect(manifest.dependencies.events.emit).toHaveBeenCalledWith(shutdownEvent)
        processOnSpy.mockRestore()
        exitMock.mockRestore()
      })
    })
  })
})

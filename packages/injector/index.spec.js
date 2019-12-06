/* eslint-disable no-unused-vars */
import inject from '.'
describe('load dependencies', () => {
  it('Should inject dependencies declared by the module', async () => {
    const tm = {}
    const fooDependency = () => {
      return tm
    }

    const otherDependency = ({ dependencies: { fooDependency }}) => fooDependency
    const manifest = await inject({}, { otherDependency, fooDependency })
    console.log(manifest)
    expect(manifest.dependencies.otherDependency).toEqual(tm)
  })

  it('Should inject dependencies declared in sub modules', async () => {
    const tm = {}
    const fooDependency = () => {
      return tm
    }

    const otherDependency = ({ dependencies: { submodule: { fooDependency }}}) => fooDependency
    const submodule = { otherDependency, fooDependency }
    const manifest = await inject({}, { submodule })
    expect(manifest.dependencies.submodule.otherDependency).toEqual(tm)
  })

  it('Should inject dependencies declared in sub modules into other dependencies in a different module', async () => {
    const tm = {}
    const fooDependency = () => {
      return tm
    }

    const otherDependency = ({ dependencies: { submodule: { fooDependency }}}) => fooDependency
    const submodule = { fooDependency }
    const manifest = await inject({}, { otherDependency, submodule })
    expect(manifest.dependencies.otherDependency).toEqual(tm)
  })

  it('Should inject dependencies declared in arrays', async () => {
    const tm = {}
    const submodules = [ () => tm ]
    const manifest = await inject({}, { submodules })
    expect(manifest.dependencies.submodules[0]).toEqual(tm)
  })

  it('Should Throw an error when no dependency is found', async () => {
    const otherDependency = ({ dependencies: { fooDependency }}) => {}
    try {
      await inject({}, { otherDependency })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('Should Throw an error when the dependency is not an injectable type', async () => {
    const fooDependency = 'hello'
    const otherDependency = ({ dependencies: { fooDependency }}) => {}
    try {
      await inject({}, { fooDependency, otherDependency })
    } catch (error) {
      console.log(error)
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('Should inject all the way down the chain', async () => {
    const tm = {}
    const fooDependency = () => tm
    const barDependency = ({ dependencies: { fooDependency }}) => fooDependency
    const bazDependency = ({ dependencies: { barDependency }}) => barDependency
    const manifest = await inject({}, { fooDependency, barDependency, bazDependency })
    expect(manifest.dependencies.bazDependency).toEqual(tm)
  })

  it('Should only create the module once even when referenced multiple times', async () => {
    let value = 0
    const tm = { value }
    const fooDependency = () => {
      value++
      return tm
    }

    const barDependency = ({ dependencies: { fooDependency }}) => fooDependency
    const bazDependency = ({ dependencies: { barDependency, fooDependency }}) => barDependency
    await inject({}, { fooDependency, barDependency, bazDependency })
    expect(value).toEqual(1)
  })
})

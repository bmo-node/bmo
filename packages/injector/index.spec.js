/* eslint-disable no-unused-vars, no-empty-pattern */
import inject from '.'
describe('load dependencies', () => {
  it('Should inject dependencies declared by the module', async () => {
    const tm = {}
    const fooDependency = () => {
      return tm
    }

    const otherDependency = ({ dependencies: { fooDependency }}) => fooDependency
    const manifest = await inject({}, { otherDependency, fooDependency })
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
    } catch (e) {
      expect(e).toBeInstanceOf(Error)
    }
  })

  it('Should Throw an error when the dependency is not an injectable type', async () => {
    const fooDependency = 'hello'
    const otherDependency = ({ dependencies: { fooDependency }}) => {}
    try {
      await inject({}, { fooDependency, otherDependency })
    } catch (e) {
      console.log(e)
      expect(e).toBeInstanceOf(Error)
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

  it('Should allow dependencies to require other dependencies in the same namespace', async () => {
    let dep
    let barModule = {}
    const barDependency = ({}) => barModule
    const bazDependency = ({
      dependencies: {
        faz: {
          barDependency
        }
      }}) => {
      dep = barDependency
    }

    const manifest = await inject({}, { faz: { barDependency, bazDependency }})
    expect(dep).toBe(barModule)
  })

  it('Should not allow circular dependencies', async () => {
    const barDependency = ({ dependencies: { bazDependency }}) => ({})
    const bazDependency = ({ dependencies: { barDependency }}) => ({})
    await expect(inject({}, { barDependency, bazDependency })).rejects.toThrow()
  })

  it('Should allow the same dependency in other dependencies', async () => {
    const manifest = await inject({}, {
      barDependency: ({ dependencies: { fooDependency }}) => ({}),
      bazDependency: ({ dependencies: { barDependency, fooDependency }}) => ({}),
      fooDependency: ({ dependencies: { }}) => ({})
    })
    expect(manifest).toBeDefined()
  })

  it('Should allow the same dependency in other dependencies', async () => {
    const manifest = await inject({}, {
      fuzDependency: ({ dependencies: { fooDependency, barDependency }}) => ({}),
      barDependency: ({ dependencies: { fooDependency }}) => ({}),
      bazDependency: ({ dependencies: { barDependency, fooDependency }}) => ({}),
      fooDependency: ({ dependencies: { }}) => ({})
    })
    expect(manifest).toBeDefined()
  })
})

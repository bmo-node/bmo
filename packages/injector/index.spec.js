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

  it('Should include package dependencies when requested, and the package is in the config', async () => {
    const manifest = await inject({
      pkg: {
        dependencies: {
          lodash: '4.0.0'
        }
      }
    }, {
      foo: ({ dependencies: { lodash }}) => lodash
    })
    expect(manifest.dependencies.foo).toEqual(require('lodash'))
  })

  it('Should include package with a namespace when requested, and the package is in the config', async () => {
    const manifest = await inject({
      pkg: {
        dependencies: {
          '@b-mo/es6-require': '1.0.0'
        }
      }
    }, {
      foo: ({ dependencies: { '@b-mo/es6-require': es6Require }}) => es6Require
    })
    expect(manifest.dependencies.foo).toEqual(require('@b-mo/es6-require').default)
  })

  // Its gross, but the injector needs the real name of the dependency in the declaration.
  // Variables don't work for module names.
  describe('Built in modules', () => {
    it('Should import the assert built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            assert: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('assert'))
    })

    it('Should import the buffer built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            buffer: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('buffer'))
    })

    it('Should import the child_process built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            child_process: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('child_process'))
    })

    it('Should import the cluster built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            cluster: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('cluster'))
    })

    it('Should import the console built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            console: mod
          }}) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('console'))
    })

    it('Should import the constants built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            constants: mod
          }}) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('constants'))
    })

    it('Should import the crypto built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            crypto: mod
          }}) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('crypto'))
    })

    it('Should import the dgram built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            dgram: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('dgram'))
    })

    it('Should import the dns built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            dns: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('dns'))
    })

    it('Should import the events built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            events: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('events'))
    })

    it('Should import the fs built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            fs: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('fs'))
    })

    it('Should import the http built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            http: mod
          }}) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('http'))
    })

    it('Should import the https built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            https: mod
          }}) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('https'))
    })

    it('Should import the module built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            module: mod
          }}) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('module'))
    })

    it('Should import the net built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            net: mod
          }}) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('net'))
    })

    it('Should import the os built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            os: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('os'))
    })

    it('Should import the path built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            path: mod
          }
        }) => mod
      })

      expect(manifest.dependencies.foo).toEqual(require('path'))
    })

    it('Should import the punycode built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            punycode: mod
          }
        }) => mod
      })

      expect(manifest.dependencies.foo).toEqual(require('punycode'))
    })

    it('Should import the querystring built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            querystring: mod
          }
        }) => mod
      })

      expect(manifest.dependencies.foo).toEqual(require('querystring'))
    })

    it('Should import the readline built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            readline: mod
          }
        }) => mod
      })

      expect(manifest.dependencies.foo).toEqual(require('readline'))
    })

    it('Should import the repl built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            repl: mod
          }
        }) => mod
      })

      expect(manifest.dependencies.foo).toEqual(require('repl'))
    })

    it('Should import the stream built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            stream: mod
          }
        }) => mod
      })

      expect(manifest.dependencies.foo).toEqual(require('stream'))
    })

    it('Should import the string_decoder built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            string_decoder: mod
          }}) => mod
      }
      )
      expect(manifest.dependencies.foo).toEqual(require('string_decoder'))
    })

    it('Should import the timers built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            timers: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('timers'))
    })

    it('Should import the tls built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            tls: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('tls'))
    })

    it('Should import the tty built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            tty: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('tty'))
    })

    it('Should import the url built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            url: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('url'))
    })

    it('Should import the util built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            util: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('util'))
    })

    it('Should import the vm built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            vm: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('vm'))
    })

    it('Should import the zlib built in module', async () => {
      const manifest = await inject({}, {
        foo: ({
          dependencies: {
            zlib: mod
          }
        }) => mod
      })
      expect(manifest.dependencies.foo).toEqual(require('zlib'))
    })
  })
})

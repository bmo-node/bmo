export const dependency = () => 'export default async ({ config, dependencies })=>({ });'
export const test = ({ name }) =>
  `import ${name} from '.'
describe('${name}', () => {
  it('Should have some tests', () => {
    throw new Error('Write some tests for ${name} dependency.')
  })
})
`

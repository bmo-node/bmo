import { dependency, test } from './template'
export default async ({ name }) => ({
  questions: [{
    name: 'name',
    default: name,
    message: 'Dependency name'
  },
  {
    default: 'dependencies',
    message: 'Dependency location',
    name: 'location'
  },
  {
    default: true,
    type: 'confirm',
    name: 'test',
    message: 'Create test file?'
  }],
  preProcess: ({ files, answers }) => {
    files[`${answers.location}/${answers.name}/index.js`] = dependency
    if (answers.test) {
      files[`${answers.location}/${answers.name}/index.spec.js`] = test
    }

    return { files, answers }
  }
})

module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
        'jest': true
    },
    'extends': ['eslint:recommended','xo-space'],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'overrides':[
        {
            "files": ["**/**.spec.js"],
            "rules": {
                "max-nested-callbacks": "off"
            }
        }
    ],
    'rules': {
        'indent': [
            'error',
            2
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'object-curly-spacing': ['error', 'always', {
             "arraysInObjects": false,
             "objectsInObjects": false
         }],
         'array-bracket-spacing': ["error", "always"],
         'no-negated-condition':0
    }
}

module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        "jest": true,
    },
    'extends': ['prettier', 'eslint:recommended', 'plugin:jest/style'],
    'plugins': ['prettier'],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'prettier/prettier': 'error',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
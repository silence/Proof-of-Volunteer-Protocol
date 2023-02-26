module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        printWidth: 88,
        singleAttributePerLine: true,
        singleQuote: true,
        semi: false,
        trailingComma: 'none' // Will be the default in Prettier 3.0
      }
    ],
    'linebreak-style': ['error', 'unix']
  }
}

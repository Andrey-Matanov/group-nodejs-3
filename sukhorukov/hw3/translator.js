const translate = require('google-translate-open-api').default

const translator = async (text) => {
  const russianLetters = /[а-яё]/i
  const to = russianLetters.test(text) ? 'en' : 'ru'

  const result = await translate(text, {
    tld: 'com',
    to,
  })

  return { original: text, translated: result.data[0] }
}

module.exports = translator

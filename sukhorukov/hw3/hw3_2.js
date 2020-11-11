const readline = require('readline')
const { clear } = require('console')
const { log } = require('console')
const translator = require('./translator')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.output,
})

clear()
log(
  `\nНаправление перевода зависит от языка ввода.\nПоддерживается русский и английский языки.\nДля выхода попробуйте перевести букву "e".\n`
)

rl.on('line', (cmd) => {
  if (cmd === 'e' || cmd === 'е') {
    // одна из них кирилическая
    clear()
    rl.close()
  } else {
    clear()
    log('please wait ...')
    translator(cmd)
      .then((data) => {
        clear()
        log(
          `Оригинальный текст:\t${data.original}\nПеревод:\t\t${data.translated}\n`
        )
      })
      .catch((err) => log('Ошибка: ', err))
  }
})

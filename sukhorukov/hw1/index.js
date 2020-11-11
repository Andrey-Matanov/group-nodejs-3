const {input, print} = require('console-input')

const name = input('Какое у Вас имя? ')

print(`Очень приятно, ${name}, а я вот ${__filename.slice(__dirname.length + 1)}`)

const minimist = require('minimist')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

const argv = minimist(process.argv.slice(2), {
    default: {
        log: 'game.log'
    },
    alias: {
        l: 'log',
    },
    string: ['log']
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.output
})

let logData = []
let attempt = 1
const title = 'Орёл, нет? (y/n, e-конец игры)'

console.log("\033[2J\033[0f")
console.log(title)
console.log( '\n', `Попытка №${attempt}:`)

rl.on('line', (cmd) => {
    let eagle = Math.random() >= 0.5 ? 'y' : 'n'
    attempt++

    switch(cmd) {
        case 'e':
            fs.writeFileSync(path.join(__dirname, argv.log), JSON.stringify(logData))
            console.log("\033[2J\033[0f")
            console.log('Для просмотра отчета запустите node stat.js', '\n');
            rl.close()
            break

        case 'y':
        case 'n':
            if (cmd === eagle) {
                logData.push({attempt: attempt, win: true})
                console.log(`Угадал!`)
            } else {
                logData.push({attempt: attempt, win: false})
                console.log(`Не угадал!`)
            }
            console.log( '\n', `Попытка №${attempt}:`)
            break

            default:
                console.log(`Не отвечайте "${cmd}", только "y/n/e", пжлст ...`)
                attempt--
                console.log( '\n', `Попытка №${attempt}:`)
    }
})

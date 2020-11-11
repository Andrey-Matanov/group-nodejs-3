const request = require('request')
const convert = require('xml-js')
const chalk   = require('chalk')
const moment  = require('moment')

var channelName
var news

function getNews() {
    request({
        method: 'POST',
        uri: 'https://news.yandex.ru/computers.rss',
        form:{key: 'value'},
    }, function (error, response, body) {
        if (error) {
            console.error(error)
        } else {
            let result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))
            channelName = result.rss.channel.title._text
            news = result.rss.channel.item
            showNews()
        }
    })
}

function showNews() {
    console.log(chalk.red.bgWhite(channelName))
    news.forEach(function(item,i,arr) {
        console.log(chalk.blue.bold('\n'+item.title._text)+' '+chalk.white(moment(item.pubDate._text).format('DD.MM.YYYY')+'\n'))
        console.log(chalk.white(item.description._text+'\n'))
    });
}

getNews()
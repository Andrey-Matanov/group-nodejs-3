const request = require('request')
const cheerio = require('cheerio')

const newsArr = []

request('https://yandex.ru/news/', (err, response, body) => {
    
    if (!err && response.statusCode === 200){
        const $ = cheerio.load(body)
        const elem = $('a[class=news-card__link]').each(function(i, elem){
            let objElem = {
                text: $(elem).text(),
                href: $(elem).attr('href')
            }
            newsArr.push(objElem)
        })
    }
})

module.exports = newsArr
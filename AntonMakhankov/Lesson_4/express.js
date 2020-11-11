const express       = require('express')
const hbs           = require('express-handlebars')
const cookieParser  = require('cookie-parser')
const path          = require('path')
const request       = require('request')
const convert       = require('xml-js')
const moment        = require('moment')

var app = express()

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static('public'))

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
}))
app.set('view engine', 'hbs')

app.get('/', function(req, res){
    let cookies = req.cookies
    var uri
    switch (cookies.newsSource) {
        case "1":
            uri = 'https://news.yandex.ru/computers.rss'
            break
        case "2":
            uri = 'https://lenta.ru/rss/news'
            break
        default:
            uri = 'https://news.yandex.ru/computers.rss'
            break
    }
    request({
        method: 'GET',
        uri: uri,
        form:{key: 'value'},
    }, (err, response, body) => {
        if(err)
            return res.status(500).send({message: err});

        let result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))
        if(cookies.newsMaxCount) {
            result.rss.channel.item.splice(cookies.newsMaxCount, result.rss.channel.item.length)
        }
        var news = []
        news['channelName'] = result.rss.channel.title._text
        news['items'] = result.rss.channel.item
        return res.render('news',{news})
    });
})

app.get('/config', function(req, res, next){
    let cookies = req.cookies
    res.render('config',{cookies})
    next()
})

app.post('/config', function(req, res, next){
    res.cookie('newsMaxCount', req.body.newsMaxCount)
    res.cookie('newsSource', req.body.newsSource)
    res.redirect('/')
    next()
})

app.get('*', function(req, res) {
    res.status(404).render('error')
})

app.listen(4000, () => {
    console.log('Server is running on port 4000')
})
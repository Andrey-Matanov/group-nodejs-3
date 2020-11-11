const express = require('express')
const {scrape} = require('./lesson3.js')
const hbs = require('express-handlebars')
const path = require('path')
const cookieParser = require('cookie-parser')
const links = require('./data/links')

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
}))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    // res.status(200).send('Hello, express.js!')
    res.redirect('/links')
})

app.get('/links', (req, res) => {
    if (req.test) {
        console.log(req.test)
    } else {
        // console.log('Заголовок test не был передан')
    }
    res.render('links', {links})
})

app.get('/links/:mediaName', (req, res) => {
    const mediaName = req.params.mediaName
    const newsCount = req.cookies.newsCount || req.query.count || 1
    res.render('config', {mediaName: mediaName, url: `/links/${mediaName}/result`, newsCount})
})

app.post('/links/:mediaName/result', (req, res) => {
    if (!req.body) return res.sendStatus(400)
    const {newsCount} = req.body
    console.log(newsCount)
    const result = scrape(req.params.mediaName).then((res) => ({
        mediaName: req.params.mediaName,
        newsCount: newsCount,
        data: res.slice(0, newsCount)
    }))
        .then((data) => {
            console.log(data)
            res.cookie('newsCount', newsCount)
            return res.render('news', {data: data})
        })
        .catch((ERR) => console.log(ERR))
})


app.listen(4000, () => {
    console.log('http://localhost:4000')
})
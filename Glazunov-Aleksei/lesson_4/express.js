const express = require('express')
const hbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const path = require('path')

const users = require('./data/users')

const request = require('request')
const cheerio = require('cheerio')

const app = express()

app.use(express.json())
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

app.use((req, res, next) => {
    //console.log('Middleware 1')
    // console.log(req)
    // console.log(res)
    next()
})

app.use('/users', (req, res, next) => {
    //console.log('Middleware 2')
    next()
})

app.all('/users', (req, res, next) => {
    //console.log('Middleware 3')
    next()
})

//Работа с заголовками
app.use((req, res, next) => {
    //console.log('Middleware 4')
    // console.log(req.headers)
   
    if(req.headers.test === '1234'){
        req.test = 'Передан пользовательский заголовок test!'
    }
    next()
})


app.get('/', (req, res) => {
    res.status(200).send('Hello, express.js!')
})

app.get('/users', (req, res) => {
    if(req.test){
        console.log(req.test)
    } else {
        console.log('Заголовок test не был передан')
    }
    // res.status(200).send('Users!')

    res.render('users', {users})
})

app.post('/users', (req, res) => {
   console.log(req.body)
    res.status(200).send('Post!')
})

app.get('/users/:username', (req, res) => {
    const {username} = req.params

    const user = users[username]

    if(!user){
        res.status(404).render('error')
    }

    res.render('user', {user})
})


app.get('/config', (req, res) => {
    const count = req.cookies.news - 1

    request('https://rbc.ru/', (err, response, body) => {
        if(!err && response.statusCode === 200){
            const $ = cheerio.load(body)
            const quantityNews = req.cookies.news  
            let counter = 0, topNews = {}
            // берем элементы с атрибутом заголовка новости и пробегаемся по ним
            const newsList = $('span[data-vr-headline]').slice(0,quantityNews).each((idx, elem)=>{
                
                //считываем адрес страницы с новостью, записываем в объект заголовок и адрес новости
                topNews[idx] = {}
                topNews[idx].urli = $(elem).parents('a').attr('href')
                topNews[idx].text = $(elem).text()
                console.log(idx+'+'+quantityNews)
                if (idx==quantityNews-1) res.render('config', {topNews, count})
                
            })
        }
    })

    
 })

 app.post('/config', (req, res) => {
     //console.log(req.body)
     const {news} = req.body
     res.cookie('news', news)
    res.redirect('/config')
 })

 app.get('/cookie/get', (req, res) => {
     console.log(req.cookies)
     res.send(JSON.stringify(req.cookies))
 })

 app.get('/cookie/set', (req, res) => {
    res.cookie('count', Math.floor(Math.random() * 10))
    res.redirect('/cookie/get')
})

//Вариант 1
// app.use((req, res) => {
//     res.status(404).render('error')
// })

//Вариант 2
app.get('*', (req, res) => {
    res.status(404).render('error')
})

app.listen(4000, () => {
    console.log('http://localhost:4000')
})

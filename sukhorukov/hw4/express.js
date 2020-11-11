const express = require('express')
const hbs = require('express-handlebars')
const request = require('request')
const cheerio = require('cheerio')
const format = require('date-format')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))

app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
  })
)
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  let {isTopCookies} = req.cookies
  isTopCookies = isTopCookies ? +isTopCookies : 1

  const distroParser = new Promise((resolve, reject) => {
    request('https://distrowatch.com/', (err, response, body) => {
      if (!err && response.statusCode === 200) {        
        resolve(cheerio.load(body))
      } else {
        reject(err)
      }
    })
  })
  
  distroParser
    .then($ => {
      const top = []
        
      for (let i = 0; i < 10; i++) {
        const index = isTopCookies ? i : 99 - i
        const line = {}
        
        line.line = i + 1
        line.place = $('.phr1').eq(index).text()
        line.name = $('.phr2').eq(index).text()
        line.loadsPerDay = $('.phr3').eq(index).text()

        top[i] = line
      }

      const parsedData = {
        top,
        isTopCookies,
        date: format('dd.MM.yyyy', new Date())
      }

      res.render('list', {parsedData})
    })
    
    .catch(err => console.log(`Error: `, err))
})

app.post('/', (req, res) => {
  const {isTop} = req.body
  res.cookie('isTopCookies', +isTop)
  res.redirect('/')
})

app.get('*', (req, res) => {
  res.status(404).render('error')
})

app.listen(4000, () => {
  console.log('сервер: http://localhost:4000')
})

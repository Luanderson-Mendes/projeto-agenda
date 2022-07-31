require('dotenv').config()
const express = require('express')
const app = express()

const mongoose = require('mongoose')

mongoose.connect(process.env.DBCONNECTION)
    .then(() => {
        app.emit('ready')
    })
    .catch(e => console.log(e))

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

const routes = require('./routes')
const path = require('path')

const helmet = require('helmet')
const csrf = require('csurf')

const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware')
const port = 3000

app.use(helmet())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOption = session({
    secret: 'alskdjfhg qpwoeiruty zmxncbv',
    store: MongoStore.create({mongoUrl: process.env.DBCONNECTION}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * (60**2) * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOption)
app.use(flash())
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())

// Middlewares
app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)

app.use(routes)

app.on('ready', () => {
    app.listen(port, () => {
        console.log('Server on!')
    })
})

'use strict'

import bodyParser from 'body-parser'
import compression from 'compression'
import Debug from 'debug'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import router from './middlewares/router'

const app = express()
const debug = Debug('vigne')
const port = process.env.PORT || 8080

// Templating by default.
app.set('view engine', 'ejs')
app.set('view options', { rmWhitespace: true })
// Views directory.
app.set('views', './views')

// Header protection.
app.use(helmet())

// Session handler.
app.use(session({ secret: 'MathildeFabienLouisHervé' }))

// Compress all responses.
app.use(compression())

// Static files.
app.use(express.static('public'))
app.use(express.static('assets'))

// Post parameters
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Routing.
app.use(router)

// Listening to XXXX port.
app.listen(port, () => debug(`=> http://localhost:${port} !`))

'use strict'

import compression from 'compression'
import Debug from 'debug'
import express from 'express'
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

// Compress all responses.
app.use(compression())

// Static files.
app.use(express.static('public'))
app.use(express.static('assets'))

// Routing.
app.use(router)

// Listening to XXXX port.
app.listen(port, () => debug(`=> http://localhost:${port} !`))

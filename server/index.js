'use strict'

require('dotenv').load()

// packages
const fs = require('fs')
const http = require('http')
const express = require('express')
require('express-namespace')

// middleware
const auth = require('./middleware/auth')

const app = express()
app.configure('prod', () => {
	app.use(express.cookieParser())
	app.use(express.bodyParser())
	app.use(app.router)
})

// logic used to register routes
const registerRoutes = routePath => {
	fs.readdirSync(routePath).forEach(file => {
		// if it's not a directory
		if (file.indexOf('.') >= 0) {
			let name = file.substr(0, file.indexOf('.'))
			require(`${routePath}/${name}`).register(app, middleware)
		}
	})
}

// Routes
const appRouteDir = `${__dirname}/routes`

// all routes will require the authentication middleware
const middleware = [auth]

registerRoutes(appRouteDir, middleware)

// initialize server
http.createServer(app).listen(process.env.PORT, () => {
	console.log('listening to port: ', process.env.PORT)
})

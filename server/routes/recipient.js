'use strict'

const rp = require('request-promise')

class Recipient {
	register (app, middleware) {
		app.namespace('/recipient', middleware, () => {
			app.get('/', this.list)
			app.post('/', this.create)
		})
	}

	// TODO: add in search when a query param is passed
	list (req, res, next) {
		console.log('req query => ', req.query) // {'name':'Henry'}

		const options = {
			uri: `${process.env.COOLPAY_ENDPOINT}/recipients`,
			headers: {
				"Authorization": `Bearer ${req.bearerToken}`
			},
			json:true
		}

		rp(options)
			.then(recipients => {
				res.json(recipients)
			})
			.catch(error => {
				next(error)
			})
	}

	create (req, res, next) {}
}

module.exports = new Recipient
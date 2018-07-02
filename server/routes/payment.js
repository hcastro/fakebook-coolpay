'use strict'

const rp = require('request-promise')

class Payment {
	register (app, middleware) {
		app.namespace('/payment', middleware, () => {
			app.get('/', this.list)
			app.post('/', this.create)
		})
	}

	list (req, res, next) {
		const options = {
			uri: `${process.env.COOLPAY_ENDPOINT}/payments`,
			headers: {
				"Authorization": `Bearer ${req.bearerToken}`
			},
			json:true
		}

		rp(options)
			.then(payments => {
				res.json(payments)
			})
			.catch(error => {
				next(error)
			})
	}

	create (req, res, next) {}
}

module.exports = new Payment
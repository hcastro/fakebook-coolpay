'use strict'

const rp = require('request-promise')

class Recipient {
	register (app, middleware) {
		app.namespace('/recipient', middleware, () => {
			app.get('/', this.list)
			app.post('/', this.create)
		})
	}

	list (req, res, next) {
		const options = {
			uri: `${process.env.COOLPAY_ENDPOINT}/recipients`,
			headers: {
				"Authorization": `Bearer ${req.bearerToken}`
			},
			json:true
		}

		rp(options)
			.then(body => {
				let recipients = body.recipients

				if (req.query.name) {
					recipients = recipients
						.filter(recipient => (recipient.name === req.query.name))
				}				

				res.json(200, recipients)
			})
			.catch(error => {
				next(error)
			})
	}

	create (req, res, next) {}
}

module.exports = new Recipient
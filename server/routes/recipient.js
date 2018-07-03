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
						// TODO: make search more flexible
						.filter(recipient => (recipient.name === req.query.name))
				}				

				res.json(200, recipients)
			})
			.catch(error => {
				next(error)
			})
	}

	create (req, res, next) {
		// TODO: add in condition for name being passed as query string
		if (req.body.recipient === undefined) {
			if (req.body.recipient.name === undefined) {
				res.json(400, "no recipient provided!")	
			} else {
				res.json(400, "no recipient name provided!")
			}
		} else {
			const options = {
				method: 'POST',
				uri: `${process.env.COOLPAY_ENDPOINT}/recipients`,
				headers: {
					"Authorization": `Bearer ${req.bearerToken}`
				},
				body: {
					"recipient": {
						"name": req.body.name
					}
				},
				json: true
			}

			rp(options)
				.then(body => {
					res.json(200, 'New recipient created!')
				})
				.catch(error => {
					res.json(error)
				})
		}
	}
}

module.exports = new Recipient
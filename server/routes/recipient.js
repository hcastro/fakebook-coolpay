'use strict'

const rp = require('request-promise')

const RecipientValidator = require('../validators/recipient')

class Recipient {
	register (app, middleware) {
		app.namespace('/recipient', middleware, () => {
			app.get('/', this.list)
			app.post('/', RecipientValidator.validateRecipient, this.create)
		})
	}

	list (req, res, next) {
    let endpoint = '/recipients'

    // add in search query when provided
    if (req.query.name) {
      endpoint += `?name=${req.query.name}`
    }

		const options = {
			uri: `${process.env.COOLPAY_BASE_URL}${endpoint}`,
			headers: {
				"Authorization": `Bearer ${req.bearerToken}`
			},
			json:true
		}

		return rp(options)
			.then(body => {
				res.json(200, body.recipients)
			})
			.catch(error => {
				next(error)
			})
	}

	create (req, res, next) {
		const options = {
			method: 'POST',
			uri: `${process.env.COOLPAY_BASE_URL}/recipients`,
			headers: {
				"Authorization": `Bearer ${req.bearerToken}`
			},
			body: {
				"recipient": {
					"name": req.body.recipient.name
				}
			},
			json: true
		}

		return rp(options)
			.then(() => {
				res.json(200, 'New recipient created!')
			})
			.catch(error => {
				next(error)
			})
	}
}

module.exports = new Recipient

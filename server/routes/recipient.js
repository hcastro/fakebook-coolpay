'use strict'

const request = require('request-promise')

const requestBuilder = require('../lib/requestBuilder')

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
    if (req.query.name) endpoint += `?name=${req.query.name}`

    const options = requestBuilder('GET', endpoint, req.bearerToken)

		return request(options)
			.then(body => {
				res.json(200, body.recipients)
			})
			.catch(error => {
				next(error)
			})
	}

	create (req, res, next) {
    const options = requestBuilder('POST', "/recipients", req.bearerToken, req.body)

		return request(options)
			.then(() => {
				res.json(200, 'New recipient created!')
			})
			.catch(error => {
				next(error)
			})
	}
}

module.exports = new Recipient

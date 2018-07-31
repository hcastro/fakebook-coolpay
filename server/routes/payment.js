'use strict'

const request = require('request-promise')

const requestBuilder = require('../lib/requestBuilder')

const paymentValidator = require('../validators/payment')

class Payment {
	register (app, middleware) {
		app.namespace('/payment', middleware, () => {
			app.get('/', this.list)
			app.post('/', paymentValidator.validatePayment, this.create)
		})
	}

	list (req, res, next) {
    const options = requestBuilder('GET', "/payments", req.bearerToken)

    return request(options)
    	.then(body => {
    		res.json(200, body.payments)
    	})
    	.catch(error => {
    		next(error)
    	})
	}

	create (req, res, next) {
    const options = requestBuilder('POST', "/payments", req.bearerToken, req.body)

    return request(options)
      .then(() => {
        res.json(200, 'Payment submitted!')
      })
      .catch(error => {
        // catch invalid recipients
        if (error.statusCode === 422) res.json(422, 'Recipient does not exist!')

        else next(error)
      })
	}
}

module.exports = new Payment

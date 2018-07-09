'use strict'

const rp = require('request-promise')

const paymentValidator = require('../validators/payment')

class Payment {
	register (app, middleware) {
		app.namespace('/payment', middleware, () => {
			app.get('/', this.list)
			app.post('/', paymentValidator.validatePayment, this.create)
		})
	}

	list (req, res, next) {
		const options = {
			uri: `${process.env.COOLPAY_BASE_URL}/payments`,
			headers: {
				"Authorization": `Bearer ${req.bearerToken}`
			},
			json:true
		}

    return rp(options)
    	.then(body => {
    		res.json(200, body.payments)
    	})
    	.catch(error => {
    		next(error)
    	})
	}

	create (req, res, next) {
    const payment = req.body.payment

    const options = {
      method: 'POST',
      uri: `${process.env.COOLPAY_BASE_URL}/payments`,
      headers: {
        "Authorization": `Bearer ${req.bearerToken}`
      },
      body: {
        "payment": {
          "amount": payment.amount,
          "currency": payment.currency,
          "recipient_id": payment.recipient_id
        }
      },
      json: true
    }

    return rp(options)
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

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
    const submitPaymentOptions = requestBuilder('POST', "/payments", req.bearerToken, req.body)
    const retrievePaymentOptions = requestBuilder('GET', "/payments", req.bearerToken)
    let tries = 0
    let maxTries = 3

    //delay execution of next statement given time in milliseconds
    const delay = (time, value) => {
      return new Promise(resolve => {
        setTimeout(resolve.bind(null, value), time)
      })
    }

    // gets the status for the payment with the given id
    const checkStatus = (options, paymentId) => {
        return request(options).then(body => {
          let payments = body.payments
          let payment = payments.filter(payment => (payment.id === paymentId))

          //all payments should have a unique id
          if (payment.length > 0) {
            let paymentStatus = payment[0].status

            switch (paymentStatus) {
              case 'processing':
                //re-check status every second
                return delay(1000).then(() => (checkStatus(retrievePaymentOptions, paymentId)))

              //payment is successfully made
              case 'paid':
                return paymentStatus

              //payment fails. Retry submission if we havent reached the retry threshold
              case 'failed':
                if (tries <= maxTries) return attemptPaymentSubmission(submitPaymentOptions)
                else return paymentStatus
            }

          } else {
            throw new Error("payment not found!")
          }
        })
    }

    //tries to submit payment with retry mechanism
    const attemptPaymentSubmission = options => {
      let paymentId

      tries++
      return request(options)
        .then(body => (checkStatus(retrievePaymentOptions, body.payment.id)))
        .then(status => {
          (status === 'paid')
            ? res.json(200, 'Payment successfully submitted!')
            : res.json(400, `payment failed after ${maxTries} attempts!`)
        })
        .catch(error => next(error))
    }

    attemptPaymentSubmission(submitPaymentOptions)
	}
}

module.exports = new Payment

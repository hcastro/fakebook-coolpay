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
                return delay(1000)
                  .then(() => (checkStatus(retrievePaymentOptions, paymentId)))

              //payment is successfully made
              case 'paid':
                return paymentStatus

              //payment fails. Retry submission if we havent reached the retry threshold
              case 'failed':
                return attemptPaymentSubmission(submitPaymentOptions)
            }

          } else {
            reject("payment not found!")
          }
        })
    }

    //tried to submit payment with retry mechanism
    const attemptPaymentSubmission = options => {
      let paymentId

      if (tries < maxTries) {
        tries++
        return request(options)
          .then((body) => (delay(1000, body.payment)))
          .then((payment) => {
            paymentId = payment.id

            return checkStatus(retrievePaymentOptions, paymentId)
          })
          .then(status => {
            res.json(200, 'Payment successfully submitted!')

          })
          .catch(error => next(error))
        } else {
          next(new Error(`payment failed after ${maxTries} attempts!`))
        }
    }
    attemptPaymentSubmission(submitPaymentOptions)
	}
}

module.exports = new Payment

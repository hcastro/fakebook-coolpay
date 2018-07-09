'use strict'

const currencies = require('../entities/helpers').CURRENCY

class PaymentValidator {
  validatePayment (req, res, next) {
    // check payment existence
    if (!req.body.payment) {
      res.json(400, 'No payment specified!')
      return
    }

    const payment = req.body.payment

    // check fields
    const fields = ['amount', 'currency', 'recipient_id']
    const reqFields = Object.keys(req.body.payment)

    for (let field of fields) {
      if (reqFields.indexOf(field) === -1) {
        res.json(400, `${field} field is required for new payments`)
        return
      }
    }

    // check that amounts are postive numbers
    if (typeof payment.amount != 'number' || payment.amount <= 0.01) {
      res.json(400, 'Payment amounts must be a number and greater than 0.01')
      return
    }

    // check for invalid currency
    if (!currencies.includes(payment.currency)) {
      res.json(400, 'Currency not recognized!')
      return
    }

    next()
  }
}

module.exports = new PaymentValidator

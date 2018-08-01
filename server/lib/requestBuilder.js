'use strict'

module.exports = (verb, path, auth, body) => {
  let options = {}

  options["method"] = verb
  options["uri"] = `${process.env.COOLPAY_BASE_URL}${path}`
  options["headers"] = {
    "Authorization": `Bearer ${auth}`
  }
  options["json"] = true

  if (verb === 'POST') {
    if (path === '/payments') {
      const payment = {
        "payment": {
          "amount": body.payment.amount,
          "currency": body.payment.currency,
          "recipient_id": body.payment.recipient_id
        }
      }
      options["body"] = payment
    } else if (path === '/recipients') {
      const recipient = {
        "recipient": {
          "name": body.recipient.name
        }
      }
      options["body"] = recipient
    }
  }

  return options
}

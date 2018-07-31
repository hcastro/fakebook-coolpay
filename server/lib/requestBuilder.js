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
          "amount": body.amount,
          "currency": body.currency,
          "recipient_id": body.recipient_id
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

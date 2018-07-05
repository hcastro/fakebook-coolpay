'use strict'

class RecipientValidator {
  validateRecipient (req, res, next) {
    // check if recipient exists
    if (!req.body.recipient) {
      res.json(400, 'No recipient specified!')
    } else if (!req.body.recipient.name) {
      res.json(400, 'No recipient name specified!')
    } else {
      next()
    }
  }
}

module.exports = new RecipientValidator

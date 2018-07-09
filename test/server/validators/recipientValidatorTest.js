'use strict'

const expect = require('chai').expect
const should = require('chai').should()
const sinon = require('sinon')

const expressMock = require('../mocks/expressMock')

const RecipientValidator = require('../../../server/validators/recipient')

describe('RecipientValidator', () => {
  afterEach(() => {
    expressMock.req.body = {}
    expressMock.req.query = {}

    sinon.reset()
  })

  it('should return Bad Request status for no recipient', done => {
    let message = 'No recipient specified!'

    RecipientValidator.validateRecipient.apply(RecipientValidator, expressMock.args)
    sinon.assert.calledWith(expressMock.res.json, 400, message)
    done()
  })

  it('should return Bad Request status for no recipient name', done => {
    let message = 'No recipient name specified!'
    expressMock.req.body.recipient = {}

    RecipientValidator.validateRecipient.apply(RecipientValidator, expressMock.args)
    sinon.assert.calledWith(expressMock.res.json, 400, message)
    done()
  })

})

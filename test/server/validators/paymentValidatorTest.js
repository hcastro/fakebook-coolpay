'use strict'

const expect = require('chai').expect
const should = require('chai').should()
const sinon = require('sinon')

const expressMock = require('../mocks/expressMock')

const PaymentValidator = require('../../../server/validators/payment')

describe('PaymentValidator', () => {
  afterEach(() => {
    expressMock.req.body = {}
    expressMock.req.query = {}

    sinon.reset()
  })

  it('should return Bad Request status for no payment', done => {
    let message = 'No payment specified!'

    PaymentValidator.validatePayment.apply(PaymentValidator, expressMock.args)
    sinon.assert.calledWith(expressMock.res.json, 400, message)
    done()
  })

  it('should return Bad Request status for missing payment fields', done => {
    let message = 'currency field is required for new payments'
    expressMock.req.body = {
      "payment": {
        "amount": "20.00",
        "recipient_id": "U-BINGBONG"
      }
    }

    PaymentValidator.validatePayment.apply(PaymentValidator, expressMock.args)
    sinon.assert.calledWith(expressMock.res.json, 400, message)
    done()
  })


  it('should return Bad Request status for non-number types on amount', done => {
    let message = 'Payment amounts must be a number and greater than 0.01'
    expressMock.req.body = {
      "payment": {
        "amount": "20.00",
        "currency": "USD",
        "recipient_id": "U-BINGBONG"
      }
    }

    PaymentValidator.validatePayment.apply(PaymentValidator, expressMock.args)
    sinon.assert.calledWith(expressMock.res.json, 400, message)
    done()
  })

  it('should return Bad Request status for not meeting minimum amount constraint - negative numbers', done => {
    let message = 'Payment amounts must be a number and greater than 0.01'
    expressMock.req.body = {
      "payment": {
        "amount": -20.00,
        "currency": "USD",
        "recipient_id": "U-BINGBONG"
      }
    }

    PaymentValidator.validatePayment.apply(PaymentValidator, expressMock.args)
    sinon.assert.calledWith(expressMock.res.json, 400, message)
    done()
  })

  it('should return Bad Request status for invalid currency codes', done => {
    let message = 'Currency not recognized!'
    expressMock.req.body = {
      "payment": {
        "amount": 20.00,
        "currency": "XXX",
        "recipient_id": "U-BINGBONG"
      }
    }

    PaymentValidator.validatePayment.apply(PaymentValidator, expressMock.args)
    sinon.assert.calledWith(expressMock.res.json, 400, message)
    done()
  })

})

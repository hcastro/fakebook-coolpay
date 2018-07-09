'use strict'

const expect = require('chai').expect
const should = require('chai').should()
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const expressMock = require('../mocks/expressMock')

process.env.COOLPAY_BASE_URL = 'https://coolpay.herokuapp.com/api'

describe('payment routes', () => {
  const endpoint = '/payments'
  const expectedUri = process.env.COOLPAY_BASE_URL + endpoint

  // stub out the request-promise package
  const rp = sinon.stub()
  const payment = proxyquire('../../../server/routes/payment', {
    'request-promise': rp
  })

  expressMock.req.bearerToken = '123-coolpay'

  const expectedAuthorization = {
    "Authorization": `Bearer ${expressMock.req.bearerToken}`
  }

  afterEach(() => {
    expressMock.req.body = {}
    expressMock.req.query = {}

    // reset stub history and behaviour
    sinon.reset()
  })

  describe('list()', () => {
    const data = {
      "payments":[
        {
        "status": "paid",
        "recipient_id": "U-AXIOM",
        "id": "P-TEST2",
        "currency": "USD",
        "amount": "10.5"
        }
      ]
    }

    let argMatcher = sinon.match({
      uri: expectedUri,
      headers: expectedAuthorization,
      json: true
    })

    it('should pass proper options for list', done => {
      rp.resolves(Promise.resolve())
      payment.list.apply(payment, expressMock.args)
      sinon.assert.calledWith(rp, argMatcher)
      done()
    })


    it('should list payments', done => {
      let next = sinon.spy()
      rp.resolves(data)

      payment.list(expressMock.req, expressMock.res, next).then(() => {
        sinon.assert.calledWith(expressMock.res.json, 200, data.payments)
        done()
      })
    })
  })

  describe.only('create()', () => {
    let expectedBody, argMatcher

    it('should pass proper options when creating new payments', done => {
      expectedBody = expressMock.req.body = {
        "payment": {
          "amount": 20.00,
          "currency": "USD",
          "recipient_id": "U-BINGBONG"
        }
      }

      argMatcher = sinon.match({
        method: 'POST',
        uri: expectedUri,
        headers: expectedAuthorization,
        body: expectedBody,
        json: true
      })

      rp.resolves(Promise.resolve())
      payment.create.apply(payment, [expressMock.req, expressMock.res, expressMock.next])
      sinon.assert.calledWith(rp, argMatcher)
      done()
    })

    it('should respond successfully after creating a new payment', done => {
      expressMock.req.body = {
        "payment": {
          "amount": 20.00,
          "currency": "USD",
          "recipient_id": "U-BINGBONG"
        }
      }

      let message = 'Payment submitted!'

      rp.resolves(Promise.resolve())
      payment.create(expressMock.req, expressMock.res, expressMock.next).then(() => {
        sinon.assert.calledWith(expressMock.res.json, 200, message)
        done()
      })
    })

  })
})

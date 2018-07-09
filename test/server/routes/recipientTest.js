'use strict'

const expect = require('chai').expect
const should = require('chai').should()
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const expressMock = require('../mocks/expressMock')

process.env.COOLPAY_BASE_URL = 'https://coolpay.herokuapp.com/api'

describe('recipient routes', () => {
  const endpoint = '/recipients'
  const expectedUri = process.env.COOLPAY_BASE_URL + endpoint

  // stub out the request-promise package
  const rp = sinon.stub()
  const recipient = proxyquire('../../../server/routes/recipient', {
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
      "recipients":[
        {
          "name": "BingBong",
          "id": "U-BINGBONG"
        },
        {
          "name": "Axiom",
          "id": "U-AXIOM"
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
      recipient.list.apply(recipient, expressMock.args)
      sinon.assert.calledWith(rp, argMatcher)
      done()
    })

    it('should pass proper options for list when query is provided', done => {
      let query = expressMock.req.query.name = 'BingBong'

      argMatcher = sinon.match({
        uri: `${expectedUri}?name=${query}`,
        headers: expectedAuthorization,
        json: true
      })

      rp.resolves(Promise.resolve())
      recipient.list.apply(recipient, expressMock.args)
      sinon.assert.calledWith(rp, argMatcher)
      done()
    })

    it('should list recipients', done => {
      let next = sinon.spy()
      rp.resolves(data)

      recipient.list(expressMock.req, expressMock.res, next).then(() => {
        sinon.assert.calledWith(expressMock.res.json, 200, data.recipients)
        done()
      })
    })
  })

  describe('create()', () => {
    let newRecipient, expectedBody, argMatcher

    beforeEach(() => {
      expressMock.req.body.recipient = {}
      newRecipient = expressMock.req.body.recipient.name = 'Luxo'

      expectedBody = {
        "recipient": {
          "name": newRecipient
        }
      }

      argMatcher = sinon.match({
        method: 'POST',
        uri: expectedUri,
        headers: expectedAuthorization,
        body: expectedBody,
        json: true
      })
    })

    it('should pass proper options when creating new recipients', done => {
      rp.resolves(Promise.resolve())
      recipient.create.apply(recipient, [expressMock.req, expressMock.res, expressMock.next])
      sinon.assert.calledWith(rp, argMatcher)
      done()
    })

    it('should respond successfully after creating a new recipient', done => {
      let message = 'New recipient created!'

      rp.resolves(Promise.resolve())
      recipient.create(expressMock.req, expressMock.res, expressMock.next).then(() => {
        sinon.assert.calledWith(expressMock.res.json, 200, message)
        done()
      })
    })

  })
})

'use strict'

const expect = require('chai').expect
const should = require('chai').should()
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const expressMock = require('../mocks/expressMock')

process.env.COOLPAY_BASE_URL = 'https://coolpay.herokuapp.com/api'

// TODO: separate get and post into separate suites (describes)
describe('recipient routes', function () {
  let rp, recipient, endpoint, query, data, expectedUri, expectedAuthorization, argMatcher,
    newRecipient, expectedBody


  before(function () {
    endpoint = '/recipients'
    expectedUri = process.env.COOLPAY_BASE_URL + endpoint
    rp = sinon.stub()
    recipient = proxyquire('../../../server/routes/recipient', {
      'request-promise': rp
    })

    data = {
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
  })

  beforeEach(function () {
    expressMock.req.bearerToken = '123-coolpay'
    expectedAuthorization = {
      "Authorization": `Bearer ${expressMock.req.bearerToken}`
    }

    argMatcher = sinon.match({
      uri: expectedUri,
      headers: expectedAuthorization,
      json: true
    })
  })

  afterEach(function () {
    expressMock.req.query = {}

    // reset stub history and behaviour
    sinon.reset()
  })

  it('should pass proper options for list', done => {
    rp.resolves(true)
    recipient.list.apply(recipient, expressMock.args)
    sinon.assert.calledWith(rp, argMatcher)
    done()
  })

  it('should pass proper options for list when query is provided', done => {
    query = expressMock.req.query.name = 'BingBong'

    argMatcher = sinon.match({
      uri: `${expectedUri}?name=${query}`,
      headers: expectedAuthorization,
      json: true
    })

    rp.resolves(true)
    recipient.list.apply(recipient, [expressMock.req, expressMock.res, expressMock.next])
    sinon.assert.calledWith(rp, argMatcher)
    done()
  })

  it('should list recipients', done => {
    expressMock.res = {
      json: function (code, data) {
        expect(code).to.equal(200)
        data.should.have.lengthOf(2)
        done()
      }
    }

    rp.withArgs(argMatcher).resolves(data)
    recipient.list.apply(recipient, [expressMock.req, expressMock.res, expressMock.next])
  })

  it('should pass proper options when creating new recipients', done => {
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

    rp.resolves(true)
    recipient.create.apply(recipient, [expressMock.req, expressMock.res, expressMock.next])
    sinon.assert.calledWith(rp, argMatcher)
    done()
  })

  it('should respond successfully after creating new recipients', done => {
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

    expressMock.res = {
      json: function (code, message) {
        expect(code).to.equal(200)
        expect(message).to.be.a('string')
        done()
      }
    }

    let responseData = {
      "recipient": {
        "id": "U-LUXO",
        "name": "Luxo"
      }
    }

    rp.withArgs(argMatcher).resolves(responseData)
    recipient.create.apply(recipient, [expressMock.req, expressMock.res, expressMock.next])
  })
})

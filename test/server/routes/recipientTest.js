'use strict'

const expect = require('chat').expect
const sinon = require('sinon')
const proxyquire = require('proxyquire')

describe('recipient', function () {
  let rp
  let recipient

  before(function () {
    rp = sinon.stub()
    recipient = proxyquire('../../server/routes/recipient')
  })
})

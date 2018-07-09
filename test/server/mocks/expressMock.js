'use strict'

const sinon = require('sinon')

let req = {
  body: {},
  query: {}
}

let res = {
  json: () => {}
}
sinon.spy(res, 'json')

let next = sinon.spy()

module.exports = {
  req: req,
  res: res,
  next: next,
  args: [req, res, next]
}

'use strict'

const rp = require('request-promise')

module.exports = (req, res, next) => {
	if (!req.bearerToken) {
		const options = {
			method: 'POST',
			uri: `${process.env.COOLPAY_BASE_URL}/login`,
			body: {
				username: process.env.COOLPAY_USERNAME,
				apikey: process.env.COOLPAY_API_KEY
			},
			json: true
		}

		return rp(options)
			.then(body => {
				req.bearerToken = body.token
				next()
			})
			.catch(error => {
				next(error)
			})
	} else {
		next()
	}
}

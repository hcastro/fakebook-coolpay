'use strict'

const rp = require('request-promise')

// 
module.exports = (req, res, next) => {
	if (!req.bearerToken) {
		const options = {
			method: 'POST',
			uri: `${process.env.COOLPAY_ENDPOINT}/login`,
			body: {
				username: process.env.COOLPAY_USERNAME,
				apikey: process.env.COOLPAY_API_KEY
			},
			json: true
		}

		rp(options)
			.then(body => {				
				req.bearerToken = body.token
				console.log('req.bearerToken => ', req.bearerToken)
				next()
			})

			.catch(error => {
				next(error)
			})			
	} else {
		next()
	} 	
}
'use strict'

// Probably dont need this
class Payment {
	constructor (id, currency) {
		this.id = id
		this.currency = currency
	}
	
	list () {}

	create (amount) {}
}

module.exports = Payment
'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:service:primes');

class Primes {

	static handle({ currentMax, count }) {
		debug('CurrentMax: %s, Count: %s', currentMax, count);
	}

}

module.exports = Primes;

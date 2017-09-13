'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:service:primes'),
	isPrime = require('is-prime');

class Primes {

	static handle({ currentMax, count }) {
		const result = [];
		let i = currentMax;

		debug('CurrentMax: %s, Count: %s', currentMax, count);

		while (result.length < count) {
			i++;
			if (isPrime(i)) {
				debug('Found prime: %s', i);
				result.push(i);
			}
		}

		debug(result);
		return result;
	}

}

module.exports = Primes;

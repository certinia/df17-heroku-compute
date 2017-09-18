'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:service:primes'),
	isPrime = require('is-prime'),
	SalesforceWriter = require('./salesforceWriter');

class Generator {

	static * primes({ currentMax, index }) {
		// Just iterate through each number greater than the currentMax,
		while (true) {
			currentMax++;
			// if the number is a prime, increment the index, and yield the prime and its index.
			if (isPrime(currentMax)) {
				index++;
				debug('Found prime, val: %s, index: %s', currentMax, index);
				yield { currentMax, index };
			}
		}
	}

}

class Primes {

	static handle(message) {
		const
			// Read the parameters from the message
			content = message.content,
			{ currentMax, index, count, accessToken, instanceUrl } = JSON.parse(content),
			generator = Generator.primes({ currentMax, index }),
			records = [],
			recordsByType = {
				['Prime__c']: records
			};

		// create records until we have as many primes as required
		while (records.length < count) {
			const { value: { currentMax, index } } = generator.next();
			records.push({
				['Value__c']: currentMax,
				['Index__c']: index
			});
		}

		// If there are any Primes, save them in Force.com
		if (records.length) {
			SalesforceWriter.insert({ accessToken, instanceUrl, recordsByType });
		}
	}

}

module.exports = Primes;

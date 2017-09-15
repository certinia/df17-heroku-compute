'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:service:primes'),
	isPrime = require('is-prime'),
	SalesforceWriter = require('./salesforceWriter');

class Primes {
	static handle(message) {
		const
			// Read the parameters from the message
			content = message.content,
			{ currentMax, count, accessToken, instanceUrl } = JSON.parse(content),
			records = [],
			recordsByType = { Prime__c: records }; // eslint-disable-line camelcase

		// Just iterate through each number greater than the currentMax,
		// adding each newly discovered Prime number until we have enough
		let i = currentMax;
		while (records.length < count) {
			i++;
			// Check primality
			if (isPrime(i)) {
				debug('Found prime: %s', i);

				// Create a new Prime__c
				// TODO: Work out Index__c also.
				// TODO: Use a generator function
				records.push({ Value__c: i }); // eslint-disable-line camelcase
			}
		}

		// If there are any Primes, save them in Force.com
		if (records.length) {
			SalesforceWriter.insert({ accessToken, instanceUrl, recordsByType });
		}
	}

}

module.exports = Primes;

'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:service:primes'),
	isPrime = require('is-prime'),
	SalesforceWriter = require('./salesforceWriter');

class Primes {

	static handle(message) {
		const
			content = message.content,
			{ currentMax, count, salesforceSession, instanceUrl } = JSON.parse(content),
			records = [],
			recordsByType = {
				Prime__c: records // eslint-disable-line camelcase
			};

		let i = currentMax;
		while (records.length < count) {
			i++;
			if (isPrime(i)) {
				debug('Found prime: %s', i);
				records.push({
					Value__c: i // eslint-disable-line camelcase
				});
			}
		}

		SalesforceWriter.insert({
			instanceUrl,
			recordsByType,
			salesforceSession
		});
	}

}

module.exports = Primes;

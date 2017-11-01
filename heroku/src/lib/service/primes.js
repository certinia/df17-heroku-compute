'use strict';

const
	debug = require('debug-plus')('df17~heroku~compute:service:primes'),
	isPrime = require('is-prime'),
	SalesforceWriter = require('./salesforceWriter'),

	SOBJECT_TYPE_PRIME = 'Prime__c',
	SOBJECT_TYPE_PRIME_EVENT = 'PrimeEvent__e';

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
			primes = [],

			insertPrimeEvent = ({ type, message }) => {
				return SalesforceWriter.insert({
					accessToken,
					instanceUrl,
					bulk: false,
					objectType: SOBJECT_TYPE_PRIME_EVENT,
					records: {
						['EventData__c']: JSON.stringify({ type, message })
					}
				});
			},

			insertPrimes = records => {
				return SalesforceWriter.insert({
					accessToken,
					instanceUrl,
					bulk: true,
					objectType: SOBJECT_TYPE_PRIME,
					records
				});
			};

		// Create records until we have as many primes as required
		while (primes.length < count) {
			const { value: { currentMax, index } } = generator.next();
			primes.push({
				['Value__c']: currentMax,
				['Index__c']: index
			});
		}

		// Exit early if there are no primes
		if (!primes.length) {
			return Promise.resolve();
		}

		// Write primes, with a platform event before and after to inform user of progress
		return insertPrimeEvent({ type: 'Info', message: `Starting to insert ${count} prime number(/s)` })
			.then(() => insertPrimes(primes))
			.then(() => insertPrimeEvent({ type: 'Success', message: `Successfully inserted ${count} prime number(/s)` }))
			.catch(error => {
				debug(error);
				insertPrimeEvent({ type: 'Error', message: `Error inserting ${count} prime number(/s)` });
			});
	}
}

module.exports = Primes;

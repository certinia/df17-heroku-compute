/**
 * Copyright (c) 2017, FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the FinancialForce.com, inc nor the names of its contributors
 *      may be used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

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

	static async handle(message) {
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

		if (primes.length) {
			try {
				await insertPrimeEvent({ type: 'Info', message: `Starting to insert ${count} prime number(/s)` });
				await insertPrimes(primes);
				await insertPrimeEvent({ type: 'Success', message: `Successfully inserted ${count} prime number(/s)` });
			} catch (error) {
				debug(error);
				await insertPrimeEvent({ type: 'Error', message: `Error inserting ${count} prime number(/s)` });
			}
		}

	}
}

module.exports = Primes;

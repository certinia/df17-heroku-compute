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
	_ = require('lodash'),
	debug = require('debug-plus')('df17~heroku~compute:server:routes:primes'),
	Publisher = require('../../messaging/publisher'),

	{ PRIMES_REQUESTED } = require('../../messaging/topics'),
	PRIMES_URI = '/primes',
	REQUIRED_PROPERTIES = ['currentMax', 'index', 'count', 'accessToken', 'instanceUrl'],

	requestHandler = async (request, response) => {
		try {
			const
				body = _.get(request, 'body', {}),
				messageBody = _.pick(body, REQUIRED_PROPERTIES);

			// Validate the request body has the expected properties
			_.each(REQUIRED_PROPERTIES, property => {
				if (messageBody[property] == null) {
					throw new Error(`Missing required parameter: ${property}`);
				}
			});

			// Publish the message
			await Publisher.publish(PRIMES_REQUESTED, JSON.stringify(messageBody));

			// Send a success response
			await response.sendStatus(200);
		} catch (error) {
			const errorMessage = error.message;

			// Log the error
			debug.error(errorMessage);

			// Send an error response
			await response.status(400).send(errorMessage);
		}
	};

class Primes {
	static addRoute(app) {
		// Add "/primes" route
		return app.post(PRIMES_URI, requestHandler);
	}
}

module.exports = Primes;

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
	Amqp = require('../service/amqp'),
	debug = require('debug-plus')('df17~heroku~compute:messaging:subscribe'),

	subscribeAction = ({ topic, handler, channel }) => {
		// Ensure the topic exists
		channel.assertQueue(topic);

		// Subscribe to the topic
		return channel.consume(topic, message => {
			return Promise.resolve()
				.then(() => {
					debug('Event handled: %s', message);
					// Invoke the handler with the message
					return handler(message);
				})
				.catch(error => {
					// Log any errors
					debug('Error: %s', error.message);
				})
				.then(() => {
					// Acknowledge the event, regardless
					// of whether or not we had an error
					channel.ack(message);
				});
		});
	};

class Subscriber {
	static subscribe(topic, handler) {
		// Opens a connection to the RabbitMQ server, and subscribes to the topic
		return Amqp.apply(channel => subscribeAction({ topic, handler, channel }));
	}
}

module.exports = Subscriber;

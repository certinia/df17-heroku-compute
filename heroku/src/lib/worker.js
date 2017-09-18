'use strict';

const
	primes = require('./service/primes'),
	Subscriber = require('./messaging/subscriber'),

	{ PRIMES_REQUESTED } = require('./messaging/topics');

// Subscribe to PRIMES_REQUESTED events with Primes.handle
Subscriber.subscribe(PRIMES_REQUESTED, primes.handle.bind(primes));

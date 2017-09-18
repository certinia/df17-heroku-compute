'use strict';

const
	chai = require('chai'),
	sinon = require('sinon'),

	Subscriber = require('../lib/messaging/subscriber'),
	PrimesService = require('../lib/service/primes'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect;

describe('worker', () => {

	beforeEach(() => {
		mocks.Subscriber = {
			subscribe: sandbox.stub(Subscriber, 'subscribe')
		};
		mocks.PrimesService = {
			handle: sandbox.stub(PrimesService, 'handle')
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should subscribe to PRIMES_REQUESTED with PrimeService.handle', () => {
		// given/when
		require('../lib/worker');

		// then
		expect(mocks.Subscriber.subscribe).to.have.been.calledOnce;
		expect(mocks.Subscriber.subscribe).to.have.been.calledWith('PRIMES_REQUESTED', sinon.match.func);
	});

});

'use strict';

const
	_ = require('lodash'),
	chai = require('chai'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),

	Publisher = require('../../../lib/messaging/publisher'),

	PrimesRoute = require('../../../lib/server/routes/primes'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect;

chai.use(chaiSinon);

describe('server/routes/primes', () => {

	beforeEach(() => {
		mocks.app = {
			post: sandbox.stub().callsFake((uri, handler) => {
				return handler(mocks.request, mocks.response);
			})
		};
		mocks.Publisher = {
			publish: sandbox.stub(Publisher, 'publish')
		};
		mocks.request = {
			body: {
				accessToken: 'testToken',
				currentMax: 1,
				count: 2,
				instanceUrl: 'testUrl',
				someOtherProperty: 'should be omitted from published message'
			}
		};
		mocks.response = {
			status: sandbox.stub().returnsThis(),
			send: sandbox.stub(),
			sendStatus: sandbox.stub()
		};
		mocks.stringifiedBody = JSON.stringify(_.pick(mocks.request.body, ['currentMax', 'count', 'accessToken', 'instanceUrl']));
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('addRoute', () => {

		describe('should send a 400 error for missing property', () => {

			it('accessToken', () => {
				// given
				const request = _.omit(mocks.request, 'body.accessToken');
				mocks.app.post.callsFake((uri, handler) => {
					return handler(request, mocks.response);
				});

				// when
				return PrimesRoute.addRoute(mocks.app)
					// then
					.then(() => {
						expect(mocks.response.status).to.be.calledOnce;
						expect(mocks.response.status).to.be.calledWith(400);
						expect(mocks.response.send).to.be.calledOnce;
						expect(mocks.response.send).to.be.calledWith('Missing required parameter: accessToken');
					});
			});

			it('count', () => {
				// given
				const request = _.omit(mocks.request, 'body.count');
				mocks.app.post.callsFake((uri, handler) => {
					return handler(request, mocks.response);
				});

				// when
				return PrimesRoute.addRoute(mocks.app)
					// then
					.then(() => {
						expect(mocks.response.status).to.be.calledOnce;
						expect(mocks.response.status).to.be.calledWith(400);
						expect(mocks.response.send).to.be.calledOnce;
						expect(mocks.response.send).to.be.calledWith('Missing required parameter: count');
					});
			});

			it('currentMax', () => {
				// given
				const request = _.omit(mocks.request, 'body.currentMax');
				mocks.app.post.callsFake((uri, handler) => {
					return handler(request, mocks.response);
				});

				// when
				return PrimesRoute.addRoute(mocks.app)
					// then
					.then(() => {
						expect(mocks.response.status).to.be.calledOnce;
						expect(mocks.response.status).to.be.calledWith(400);
						expect(mocks.response.send).to.be.calledOnce;
						expect(mocks.response.send).to.be.calledWith('Missing required parameter: currentMax');
					});
			});

			it('instanceUrl', () => {
				// given
				const request = _.omit(mocks.request, 'body.instanceUrl');
				mocks.app.post.callsFake((uri, handler) => {
					return handler(request, mocks.response);
				});

				// when
				return PrimesRoute.addRoute(mocks.app)
					// then
					.then(() => {
						expect(mocks.response.status).to.be.calledOnce;
						expect(mocks.response.status).to.be.calledWith(400);
						expect(mocks.response.send).to.be.calledOnce;
						expect(mocks.response.send).to.be.calledWith('Missing required parameter: instanceUrl');
					});
			});
		});
	});

	it('should send a 400 error for Publish errors', () => {
		// given
		mocks.Publisher.publish.rejects(new Error('bad'));

		// when
		return PrimesRoute.addRoute(mocks.app)
			// then
			.then(() => {
				expect(mocks.Publisher.publish).to.be.calledOnce;
				expect(mocks.Publisher.publish).to.be.calledWith('PRIMES_REQUESTED', mocks.stringifiedBody);
				expect(mocks.response.status).to.be.calledOnce;
				expect(mocks.response.status).to.be.calledWith(400);
				expect(mocks.response.send).to.be.calledOnce;
				expect(mocks.response.send).to.be.calledWith('bad');
			});
	});

	it('should send a 200 error for successful Publish', () => {
		// given
		mocks.Publisher.publish.resolves();

		// when
		return PrimesRoute.addRoute(mocks.app)
			// then
			.then(() => {
				expect(mocks.Publisher.publish).to.be.calledOnce;
				expect(mocks.Publisher.publish).to.be.calledWith('PRIMES_REQUESTED', mocks.stringifiedBody);
				expect(mocks.response.sendStatus).to.be.calledOnce;
				expect(mocks.response.sendStatus).to.be.calledWith(200);
			});
	});
});

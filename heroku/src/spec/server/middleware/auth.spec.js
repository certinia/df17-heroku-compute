'use strict';

const
	_ = require('lodash'),
	chai = require('chai'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),

	Auth = require('../../../lib/server/middleware/auth'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect;

chai.use(chaiSinon);

describe('server/middleware/auth', () => {

	beforeEach(() => {
		mocks.next = sandbox.stub();
		mocks.request = {
			headers: {
				authorization: 'Bearer testAuthorization',
				referer: 'testReferer'
			}
		};
		mocks.response = {
			sendStatus: sandbox.stub()
		};
		mocks.stringifiedBody = JSON.stringify(_.pick(mocks.request.body, ['currentMax', 'count', 'accessToken', 'instanceUrl']));
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('middleware', () => {

		describe('should send a 401 error for missing header', () => {

			it('authorization', () => {
				// given
				const request = _.omit(mocks.request, 'headers.authorization');

				// when
				Auth.middleware(request, mocks.response, mocks.next);

				// then
				expect(mocks.response.sendStatus).to.be.calledOnce;
				expect(mocks.response.sendStatus).to.be.calledWith(401);
				expect(mocks.next).to.be.notCalled;
			});

			it('referer', () => {
				// given
				const request = _.omit(mocks.request, 'headers.referer');

				// when
				Auth.middleware(request, mocks.response, mocks.next);

				// then
				expect(mocks.response.sendStatus).to.be.calledOnce;
				expect(mocks.response.sendStatus).to.be.calledWith(401);
				expect(mocks.next).to.be.notCalled;
			});
		});

		describe('should copy the request headers into the body and call next', () => {

			it('authorization with Bearer prefix', () => {
				// given/when
				Auth.middleware(mocks.request, mocks.response, mocks.next);

				// then
				expect(mocks.request).to.have.deep.property('body.accessToken', 'testAuthorization');
				expect(mocks.next).to.be.calledOnce;
				expect(mocks.response.sendStatus).to.be.notCalled;
			});

			it('authorization without Bearer prefix', () => {
				// given
				const request = _.omit(mocks.request, 'authorization');
				request.authorization = 'testAuthorization';

				// when
				Auth.middleware(mocks.request, mocks.response, mocks.next);

				// then
				expect(mocks.request).to.have.deep.property('body.accessToken', 'testAuthorization');
				expect(mocks.next).to.be.calledOnce;
				expect(mocks.response.sendStatus).to.be.notCalled;
			});

			it('authorization with Bearer prefix', () => {
				// given/when
				Auth.middleware(mocks.request, mocks.response, mocks.next);

				// then
				expect(mocks.request).to.have.deep.property('body.instanceUrl', 'testReferer');
				expect(mocks.next).to.be.calledOnce;
				expect(mocks.response.sendStatus).to.be.notCalled;
			});

		});
	});
});

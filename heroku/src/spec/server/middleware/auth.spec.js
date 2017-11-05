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

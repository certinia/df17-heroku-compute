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
	request = require('supertest'),
	sinon = require('sinon'),

	Auth = require('../../lib/server/middleware/auth'),
	PrimesRoute = require('../../lib/server/routes/primes'),

	Server = require('../../lib/server/server'),

	initialValues = {
		env: { PORT: process.env.port }
	},
	testValues = {
		env: { PORT: 1234 }
	},

	mocks = {},

	sandbox = sinon.sandbox.create(),
	match = sandbox.match,
	expect = chai.expect;

chai.use(chaiSinon);

describe('server/server', () => {

	beforeEach(() => {
		process.env.PORT = testValues.env.PORT;

		// Auth mocking
		mocks.Auth = {
			middleware: sandbox.stub(Auth, 'middleware').yields()
		};

		// PrimesRoute mocking
		mocks.postHandler = sandbox.stub().callsFake((request, response) => {
			response.sendStatus(200);
		});
		mocks.PrimesRoute = {
			addRoute: sandbox.stub(PrimesRoute, 'addRoute').callsFake(app => {
				app.post('/test', mocks.postHandler);
			})
		};
	});

	afterEach(() => {
		sandbox.restore();
		process.env.PORT = initialValues.env.PORT;
	});

	describe('init', () => {

		let expressServer;

		afterEach(() => {
			_.result(expressServer, 'close');
		});

		it('should add Primes route', () => {
			// given/when
			expressServer = Server.init();

			// then
			return request('http://localhost:' + testValues.env.PORT)
				.post('/test')
				.expect(200)
				.then(() => {
					expect(mocks.PrimesRoute.addRoute).to.have.been.calledOnce;
				});
		});

		it('should invoke postHandler with the supplied body', () => {
			// given
			const body = { test1: 1, test2: 2 };

			// when
			expressServer = Server.init();

			// then
			return request('http://localhost:' + testValues.env.PORT)
				.post('/test')
				.send(body)
				.expect(200)
				.then(() => {
					expect(mocks.postHandler).to.have.been.calledOnce;
					expect(mocks.postHandler).to.have.been.calledWith(match({ body }));
				});
		});

		it('should invoke the Auth middleware with the supplied headers', () => {
			// given
			const headers = { authorization: 'TestAuthorization', referer: 'TestReferer' };

			// when
			expressServer = Server.init();

			// then
			return request('http://localhost:' + testValues.env.PORT)
				.post('/test')
				.set(headers)
				.expect(200)
				.then(() => {
					expect(mocks.Auth.middleware).to.have.been.calledOnce;
					expect(mocks.Auth.middleware).to.have.been.calledWith(match({ headers }));
				});
		});

		it('should create a response with secure headers', () => {
			// given/when
			expressServer = Server.init();

			// then
			return request('http://localhost:' + testValues.env.PORT)
				.post('/test')
				.expect(200)
				.then(response => {
					expect(response.headers).to.include.keys('x-frame-options', 'x-xss-protection');
				});
		});

		it('should use 8080 if PORT is not supplied', () => {
			// given
			delete process.env.PORT;

			// when
			expressServer = Server.init();

			// then
			return request('http://localhost:8080')
				.post('/test')
				.expect(200);
		});
	});
});

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

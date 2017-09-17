'use strict';

const
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),
	amqp = require('amqplib'),

	initialValues = {
		env: { CLOUDAMQP_URL: process.env.CLOUDAMQP_URL }
	},
	testValues = {
		env: { CLOUDAMQP_URL: 'testCloudamqpUrl' }
	},

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect;

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('service/amqp', () => {

	let AmqpService;

	beforeEach(() => {
		process.env.CLOUDAMQP_URL = testValues.env.CLOUDAMQP_URL;

		mocks.action = sandbox.stub();
		mocks.channel = sandbox.stub();
		mocks.connection = {
			createChannel: sandbox.stub().resolves(mocks.channel)
		};
		mocks.amqp = {
			connect: sandbox.stub(amqp, 'connect').resolves(mocks.connection)
		};

		AmqpService = require('../../lib/service/amqp');
	});

	afterEach(() => {
		const amqpServicePath = require.resolve('../../lib/service/amqp');
		delete require.cache[amqpServicePath];

		sandbox.restore();
		process.env.CLOUDAMQP_URL = initialValues.env.CLOUDAMQP_URL;
	});

	describe('apply', () => {

		describe('should handles error', () => {

			it('from amqp.connect', () => {
				// given
				mocks.amqp.connect.rejects('bad');

				// when
				return expect(AmqpService.apply(mocks.action))
					.to.eventually.be.fulfilled
					// then
					.then(() => {
						expect(mocks.amqp.connect).to.have.been.calledOnce;
						expect(mocks.amqp.connect).to.have.been.calledWith(testValues.env.CLOUDAMQP_URL);
						expect(mocks.connection.createChannel).to.have.been.notCalled;
						expect(mocks.action).to.have.been.notCalled;
					});
			});

			it('from connection.createChannel', () => {
				// given
				mocks.connection.createChannel.rejects('bad');

				// when
				return expect(AmqpService.apply(mocks.action))
					.to.eventually.be.fulfilled
					// then
					.then(() => {
						expect(mocks.amqp.connect).to.have.been.calledOnce;
						expect(mocks.amqp.connect).to.have.been.calledWith(testValues.env.CLOUDAMQP_URL);
						expect(mocks.connection.createChannel).to.have.been.calledOnce;
						expect(mocks.action).to.have.been.notCalled;
					});
			});

			it('from action', () => {
				// given
				mocks.action.rejects('bad');

				// when
				return expect(AmqpService.apply(mocks.action))
					.to.eventually.be.fulfilled
					// then
					.then(() => {
						expect(mocks.amqp.connect).to.have.been.calledOnce;
						expect(mocks.amqp.connect).to.have.been.calledWith(testValues.env.CLOUDAMQP_URL);
						expect(mocks.connection.createChannel).to.have.been.calledOnce;
						expect(mocks.action).to.have.been.calledOnce;
						expect(mocks.action).to.have.been.calledWith(mocks.channel);
					});
			});

		});

		it('should invoke the action', () => {
			// given/when
			return expect(AmqpService.apply(mocks.action))
				.to.eventually.be.fulfilled
				// then
				.then(() => {
					expect(mocks.amqp.connect).to.have.been.calledOnce;
					expect(mocks.amqp.connect).to.have.been.calledWith(testValues.env.CLOUDAMQP_URL);
					expect(mocks.connection.createChannel).to.have.been.calledOnce;
					expect(mocks.action).to.have.been.calledOnce;
					expect(mocks.action).to.have.been.calledWith(mocks.channel);
				});
		});

		it('should lazy load the connection', () => {
			// given/when
			return expect(AmqpService.apply(mocks.action).then(() => AmqpService.apply(mocks.action)))
				.to.eventually.be.fulfilled
				// then
				.then(() => {
					expect(mocks.amqp.connect).to.have.been.calledOnce;
					expect(mocks.amqp.connect).to.have.been.calledWith(testValues.env.CLOUDAMQP_URL);
					expect(mocks.connection.createChannel).to.have.been.calledTwice;
					expect(mocks.action).to.have.been.calledTwice;
					expect(mocks.action).to.have.been.calledWith(mocks.channel);
				});
		});

		it('should use localhost if CLOUDAMQP_URL is not supplied', () => {
			// given
			delete process.env.CLOUDAMQP_URL;

			// when
			return expect(AmqpService.apply(mocks.action))
				.to.eventually.be.fulfilled
				// then
				.then(() => {
					expect(mocks.amqp.connect).to.have.been.calledOnce;
					expect(mocks.amqp.connect).to.have.been.calledWith('amqp://localhost');
					expect(mocks.connection.createChannel).to.have.been.calledOnce;
					expect(mocks.action).to.have.been.calledOnce;
					expect(mocks.action).to.have.been.calledWith(mocks.channel);
				});
		});
	});
});

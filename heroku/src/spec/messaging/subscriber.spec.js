'use strict';

const
	chai = require('chai'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),

	Amqp = require('../../lib/service/amqp'),

	Subscriber = require('../../lib/messaging/subscriber'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect,
	anyFunction = sinon.match.func;

chai.use(chaiSinon);

describe('messaging/subscriber', () => {

	beforeEach(() => {
		mocks.Amqp = {
			apply: sandbox.stub(Amqp, 'apply')
		};
		mocks.channel = {
			ack: sandbox.stub(),
			assertQueue: sandbox.stub(),
			consume: sandbox.stub()
		};
		mocks.handler = sandbox.stub();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('subscribe', () => {

		it('should supply messages to the handler', () => {

			// given
			const
				topic = 'TestTopic',
				message = 'TestMessage';

			mocks.channel.consume.callsFake((topic, callback) => {
				return callback(message);
			});
			mocks.handler.resolves();
			mocks.Amqp.apply.callsFake(action => {
				return Promise.resolve(action(mocks.channel));
			});

			// when
			return Subscriber.subscribe(topic, mocks.handler)
				// then
				.then(() => {
					expect(mocks.Amqp.apply).to.have.been.calledOnce;
					expect(mocks.Amqp.apply).to.have.been.calledWith(anyFunction);
					expect(mocks.channel.ack).to.have.been.calledOnce;
					expect(mocks.channel.ack).to.have.been.calledWith(message);
					expect(mocks.channel.assertQueue).to.have.been.calledOnce;
					expect(mocks.channel.assertQueue).to.have.been.calledWith(topic);
					expect(mocks.channel.consume).to.have.been.calledOnce;
					expect(mocks.channel.consume).to.have.been.calledWith(topic, anyFunction);
					expect(mocks.handler).to.have.been.calledOnce;
					expect(mocks.handler).to.have.been.calledWith(message);
				});
		});

		it('should handle handler errors', () => {

			// given
			const
				topic = 'TestTopic',
				message = 'TestMessage';

			mocks.channel.consume.callsFake((topic, callback) => {
				return callback(message);
			});
			mocks.handler.rejects();
			mocks.Amqp.apply.callsFake(action => {
				return Promise.resolve(action(mocks.channel));
			});

			// when
			return Subscriber.subscribe(topic, mocks.handler)
				// then
				.then(() => {
					expect(mocks.Amqp.apply).to.have.been.calledOnce;
					expect(mocks.Amqp.apply).to.have.been.calledWith(anyFunction);
					expect(mocks.channel.ack).to.have.been.calledOnce;
					expect(mocks.channel.ack).to.have.been.calledWith(message);
					expect(mocks.channel.assertQueue).to.have.been.calledOnce;
					expect(mocks.channel.assertQueue).to.have.been.calledWith(topic);
					expect(mocks.channel.consume).to.have.been.calledOnce;
					expect(mocks.channel.consume).to.have.been.calledWith(topic, anyFunction);
					expect(mocks.handler).to.have.been.calledOnce;
					expect(mocks.handler).to.have.been.calledWith(message);
				});
		});

	});
});

'use strict';

const
	chai = require('chai'),
	chaiSinon = require('chai-sinon'),
	sinon = require('sinon'),

	Amqp = require('../../lib/service/amqp'),

	Publisher = require('../../lib/messaging/publisher'),

	mocks = {},

	sandbox = sinon.sandbox.create(),
	expect = chai.expect;

chai.use(chaiSinon);

describe('messaging/publisher', () => {

	beforeEach(() => {
		mocks.Amqp = {
			apply: sandbox.stub(Amqp, 'apply')
		};
		mocks.channel = {
			sendToQueue: sandbox.stub()
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('publish', () => {

		describe('should call sendToQueue', () => {

			it('accessToken', () => {
				// given
				const
					topic = 'TestTopic',
					message = 'TestMessage';

				mocks.Amqp.apply.callsFake(action => {
					return Promise.resolve(action(mocks.channel));
				});

				// when
				return Publisher.publish(topic, message)
					// then
					.then(() => {
						expect(mocks.channel.sendToQueue).to.be.calledOnce;
						expect(mocks.channel.sendToQueue).to.be.calledWith(topic, Buffer.from(message));
					});
			});
		});
	});
});

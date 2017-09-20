@IsTest(SeeAllData=false)
private class HerokuConnectorTest
{
	@IsTest
	private static void requestPrimes_nullCount_CreatesExpectedHttpRequest()
	{
		// given
		HerokuConnector connector = HerokuConnector.newInstance();
		CalloutMock mock = new CalloutMock();
		Test.setMock(HttpCalloutMock.class, mock);

		// when
		connector.requestPrimes(null, 2, 3);

		// then
		System.assertEquals('Bearer ' + UserInfo.getSessionId(), mock.Request.getHeader('Authorization'));
		System.assertEquals(Url.getSalesforceBaseUrl().toExternalForm(), mock.Request.getHeader('Referer'));
		System.assertEquals('application/json', mock.Request.getHeader('Content-Type'));
		System.assertEquals('{"count":0,"index":3,"currentMax":2}', mock.Request.getBody());
	}

	@IsTest
	private static void requestPrimes_nullValue_CreatesExpectedHttpRequest()
	{
		// given
		HerokuConnector connector = HerokuConnector.newInstance();
		CalloutMock mock = new CalloutMock();
		Test.setMock(HttpCalloutMock.class, mock);

		// when
		connector.requestPrimes(1, null, 3);

		// then
		System.assertEquals('Bearer ' + UserInfo.getSessionId(), mock.Request.getHeader('Authorization'));
		System.assertEquals(Url.getSalesforceBaseUrl().toExternalForm(), mock.Request.getHeader('Referer'));
		System.assertEquals('application/json', mock.Request.getHeader('Content-Type'));
		System.assertEquals('{"count":1,"index":3,"currentMax":0}', mock.Request.getBody());
	}

	@IsTest
	private static void requestPrimes_nullIndex_CreatesExpectedHttpRequest()
	{
		// given
		HerokuConnector connector = HerokuConnector.newInstance();
		CalloutMock mock = new CalloutMock();
		Test.setMock(HttpCalloutMock.class, mock);

		// when
		connector.requestPrimes(1, 2, null);

		// then
		System.assertEquals('Bearer ' + UserInfo.getSessionId(), mock.Request.getHeader('Authorization'));
		System.assertEquals(Url.getSalesforceBaseUrl().toExternalForm(), mock.Request.getHeader('Referer'));
		System.assertEquals('application/json', mock.Request.getHeader('Content-Type'));
		System.assertEquals('{"count":1,"index":0,"currentMax":2}', mock.Request.getBody());
	}

	@IsTest
	private static void requestPrimes_integerValues_CreatesExpectedHttpRequest()
	{
		// given
		HerokuConnector connector = HerokuConnector.newInstance();
		CalloutMock mock = new CalloutMock();
		Test.setMock(HttpCalloutMock.class, mock);

		// when
		connector.requestPrimes(1, 2, 3);

		// then
		System.assertEquals('Bearer ' + UserInfo.getSessionId(), mock.Request.getHeader('Authorization'));
		System.assertEquals(Url.getSalesforceBaseUrl().toExternalForm(), mock.Request.getHeader('Referer'));
		System.assertEquals('application/json', mock.Request.getHeader('Content-Type'));
		System.assertEquals('{"count":1,"index":3,"currentMax":2}', mock.Request.getBody());
	}

	private class CalloutMock implements HttpCalloutMock
	{
		public HttpRequest Request {get; private set;}
		public HTTPResponse respond(HTTPRequest request)
		{
			this.Request = request;
			return new HttpResponse();
		}
	}
}
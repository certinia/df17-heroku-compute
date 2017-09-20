@IsTest(SeeAllData=false)
private class PrimesControllerTest
{
	@IsTest
	private static void requestPrimes_nullInputAndSelectorReturnsNull_connectorCalledWithNulls()
	{
		// given
		StubProvider mocks = new StubProvider();
		HerokuConnector connector = (HerokuConnector)mocks.mock(HerokuConnector.class);
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);

		HerokuConnector.instance = connector;
		PrimeSelector.instance = selector;

		HttpResponse response = new HttpResponse();

		mocks.stub(selector, 'getCurrentMax', new Type[]{}, new Object[]{}, null);
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Integer.class, Integer.class}, new Object[]{null, null, null}, response);

		// when
		Object actual = PrimesController.requestPrimes(null);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}

	@IsTest
	private static void requestPrimes_valueInputAndSelectorReturnsNull_connectorCalledWithCountAndNulls()
	{
		// given
		StubProvider mocks = new StubProvider();
		HerokuConnector connector = (HerokuConnector)mocks.mock(HerokuConnector.class);
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);

		HerokuConnector.instance = connector;
		PrimeSelector.instance = selector;

		HttpResponse response = new HttpResponse();

		mocks.stub(selector, 'getCurrentMax', new Type[]{}, new Object[]{}, null);
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Integer.class, Integer.class}, new Object[]{5, null, null}, response);
		
		// when
		Object actual = PrimesController.requestPrimes(5);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}

	@IsTest
	private static void requestPrimes_valueInputAndSelectorReturnsAPrime_connectorCalledWithCountAndPrimeValues()
	{
		// given
		StubProvider mocks = new StubProvider();
		HerokuConnector connector = (HerokuConnector)mocks.mock(HerokuConnector.class);
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);

		HerokuConnector.instance = connector;
		PrimeSelector.instance = selector;

		HttpResponse response = new HttpResponse();

		mocks.stub(selector, 'getCurrentMax', new Type[]{}, new Object[]{}, new Prime__c(Value__c = 11, Index__c = 6));
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Integer.class, Integer.class}, new Object[]{5, 11, 6}, response);
		
		// when
		Object actual = PrimesController.requestPrimes(5);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}
}
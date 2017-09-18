@IsTest(SeeAllData=false)
private class PrimesControllerTest
{
	@IsTest
	private static void requestPrimes_DelegatesToServices()
	{
		// given
		StubProvider mocks = new StubProvider();
		HerokuConnector connector = (HerokuConnector)mocks.mock(HerokuConnector.class);
		PrimeSelector selector = (PrimeSelector)mocks.mock(PrimeSelector.class);

		HerokuConnector.instance = connector;
		PrimeSelector.instance = selector;

		HttpResponse response = new HttpResponse();

		mocks.stub(selector, 'getCurrentMax', new Type[]{Integer.class}, new Object[]{}, 10);
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Integer.class}, new Object[]{5, 10}, response);
		
		// when
		Object actual = PrimesController.requestPrimes(5);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}
}
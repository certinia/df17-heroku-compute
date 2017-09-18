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

		Prime__c mockPrime =  new Prime__c(Value__c = 11, Index__c = 6);
		mocks.stub(selector, 'getCurrentMax', new Type[]{Prime__c.class}, new Object[]{}, mockPrime);
		mocks.stub(connector, 'requestPrimes', new Type[]{Integer.class, Prime__c.class}, new Object[]{5, mockPrime}, response);
		
		// when
		Object actual = PrimesController.requestPrimes(5);

		// then
		System.assert(response === actual, 'Unexpected response. Expected: ' + response + '. Actual: ' + actual);
	}
}
public class PrimeSelector
{
	@TestVisible
	private static PrimeSelector instance = null;

	public static PrimeSelector newInstance()
	{
		if (instance == null)
		{
			instance = new PrimeSelector();
		}

		return instance;
	}

	public Prime__c getCurrentMax()
	{			
		List<Prime__c> maxPrimes = [SELECT Value__c, Index__c FROM Prime__c ORDER BY Index__c DESC LIMIT 1];
		Prime__c maxPrime = maxPrimes.size() == 1 ? maxPrimes[0] : null;
		return maxPrime;
	}
}
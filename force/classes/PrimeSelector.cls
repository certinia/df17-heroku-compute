public class PrimeSelector
{
	@TestVisible
	private PrimeSelector instance = null;

	public static PrimeSelector newInstance()
	{
		if (instance == null)
		{
			instance = new PrimeSelector();
		}

		return instance;
	}

	public Integer getCurrentMax()
    {            
		Decimal max = (Decimal)[SELECT MAX(Value__c) max FROM Prime__c][0].get('max');
        return max == null ? 0 : max;
	}
}
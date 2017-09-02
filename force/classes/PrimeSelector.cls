public class PrimeSelector
{
	@TestVisible
	private static PrimeSelector instance;

	public static PrimeSelector newInstance()
	{
		return instance != null ? instance : new PrimeSelector();
	}

	public Prime__c[] selectTop(Integer max)
	{
		return [
			SELECT Id, Index__c, Value__c
			FROM Prime__c
			ORDER BY Index__c DESC
			LIMIT :max
		];
	}
}
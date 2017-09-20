public class HerokuConnector
{
	@TestVisible
	private static HerokuConnector instance = null;

	public static HerokuConnector newInstance()
	{
		if (instance == null)
		{
			instance = new HerokuConnector();
		}

		return instance;
	}

	public Object requestPrimes(Integer count, Integer value, Integer index)
	{			
		if (count == null || count < 0) {
			count = 0;
		}
		if (value == null || value < 0) {
			value = 0;
		}
		if (index == null || index < 0) {
			index = 0;
		}

		Http http = new Http();
		HttpRequest request = createRequest();
		populateHeader(request);
		populateBody(request, count, value, index);
		return http.send(request);
	}

	private static HttpRequest createRequest()
	{
		HttpRequest request = new HttpRequest();
		request.setEndpoint('callout:HerokuPrimes/primes');
		request.setMethod('POST');
		return request;
	}

	private static void populateHeader(HttpRequest request)
	{
		request.setHeader('Authorization', 'Bearer ' + getSessionId());
		request.setHeader('Referer', Url.getSalesforceBaseUrl().toExternalForm());
		request.setHeader('Content-Type', 'application/json');
	}

	private static void populateBody(HttpRequest request, Integer count, Integer currentMax, Integer index)
	{
		Map<String, Object> body = new Map<String, Object>{
			'currentMax' => currentMax,
			'index' => index,
			'count' => count
		};
		request.setBody(JSON.serialize(body));	   
	}
	
	private static String getSessionId()
	{
		//Strictly temporary hack to workaround the fact that
		//Lightning Component sessions are not API enabled
		//https://salesforce.stackexchange.com/questions/110515/getting-session-id-in-lightning
		return Test.isRunningTest() ? UserInfo.getSessionId() : Page.SessionId.getContent().toString();
	}
}
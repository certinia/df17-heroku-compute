public class HerokuConnector
{
	@TestVisible
	private HerokuConnector instance = null;

	public static HerokuConnector newInstance()
	{
		if (instance == null)
		{
			instance = new HerokuConnector();
		}

		return instance;
	}

	public Object requestPrimes(Integer count, Integer currentMax)
    {            
		Http http = new Http();
 
	    HttpRequest request = createRequest();
		populateHeader();
		populateBody(count, currentMax);
        return http.send(request);
	}

	private static createRequest()
	{
		HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:HerokuPrimes/primes');
        request.setMethod('POST');
		return request;
	}

	private static populateHeader(HttpRequest request)
	{
		request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
        request.setHeader('Referer', Url.getSalesforceBaseUrl().toExternalForm());
        request.setHeader('Content-Type', 'application/json');
	}

	private static populateBody(HttpRequest request, Integer count, Integer currentMax)
	{
		Map<String, Object> body = new Map<String, Object>{
            'currentMax' => 10,
            'count' => count
        };
        request.setBody(JSON.serialize(body));       
	}
}
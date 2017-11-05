/**
 * Copyright (c) 2017, FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the FinancialForce.com, inc nor the names of its contributors
 *      may be used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

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
		if (count == null || Integer.valueOf(count) < 0) {
			count = 0;
		}
		if (value == null || Integer.valueOf(value) < 0) {
			value = 0;
		}
		if (index == null || Integer.valueOf(index) < 0) {
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
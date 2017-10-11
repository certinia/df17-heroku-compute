public with sharing class EventMonitorController
{
	@AuraEnabled
	public static String getSessionId()
	{
		return UserInfo.getSessionId();
	}
}

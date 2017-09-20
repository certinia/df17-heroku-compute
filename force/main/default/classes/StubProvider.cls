/*
 * Incredibly simplistic StubProvider.
 * Holds a single return value for a given stub method, regardless of the argument values used on invocation.
 * 
 * For more advanced mocking, see ApexMocks: https://github.com/financialforcedev/fflib-apex-mocks
 * Apex Mocks supports stubbing, verification, answering, matchers and more.
 */
@IsTest(SeeAllData=false)
public class StubProvider implements System.StubProvider
{
	private final Map<Integer, Object> returnValuesByMethod = new Map<Integer, Object>();

	public Object handleMethodCall(Object stubbedObject, String stubbedMethodName, 
		Type returnType, List<Type> listOfParamTypes, List<String> listOfParamNames, 
		List<Object> listOfArgs)
	{
		return returnValuesByMethod.get(generateHash(stubbedObject, stubbedMethodName, listOfParamTypes, listOfArgs));
	}

	public Object mock(Type mockType)
	{
		return Test.createStub(mockType, this);
	}

	public void stub(Object stubbedObject, String stubbedMethodName, List<Type> listOfParamTypes, List<Object> listOfArgs, Object returnValue)
	{	
		returnValuesByMethod.put(generateHash(stubbedObject, stubbedMethodName, listOfParamTypes, listOfArgs), returnValue);
	}

	private Integer generateHash(Object stubbedObject, String stubbedMethodName, List<Type> listOfParamTypes, List<Object> listOfArgs) {
		String objectType = ('' + stubbedObject).split(':')[0];
		String hashString = objectType
			+ stubbedMethodName
			+ listOfParamTypes
			+ listOfArgs;
		return hashString.hashCode();
	}

}

({
	requestPrimes : function(component, event, helper) {
        var action = component.get("c.requestPrimes");
        action.setParams({ count : component.get("v.count") });
        action.setCallback(this, function(response) {});

        $A.enqueueAction(action);
    }
})
({	
	/*
	 * Displays toast notifications on receiving PageLayoutUpdate__e events
	 */
	handleMonitoredEvent: function (event) {
		var platformEvent = event.getParam('event'),
			toast = $A.get("e.force:showToast"),
			eventData = JSON.parse(platformEvent.data.payload.EventData__c),
			type = eventData.type,
			message = eventData.message;

		toast.setParams({
			message: message,
			type: type
		});
		toast.fire();
	},

	/*
	 * Instigate a request to the Heroku app
	 */
	requestPrimes: function (component) {
		var action = component.get('c.requestPrimes');

		action.setParams({ count: component.get('v.count') });
		action.setCallback(this, function (response) {
			var state = response.getState();
			if (state === "SUCCESS") {
				console.log("From server: " + response.getReturnValue());
			} else if (state === "ERROR") {
				var errors = response.getError();
				if (errors) {
					if (errors[0] && errors[0].message) {
						console.log("Error message: " + errors[0].message);
					}
				} else {
					console.log("Unknown error");
				}
			}
		});

		$A.enqueueAction(action);
	}
})

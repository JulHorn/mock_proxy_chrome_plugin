
var ApiBridge = function () {

};

ApiBridge.prototype.webSocket = function(endpoint, receiveCallBack) {
	var connection = new WebSocket("ws://" + localStorage.mockProxyServerTargetEndpoint + endpoint);

	connection.onopen = function () {
		connection.send('Ping'); // Send the message 'Ping' to the server
	};

	// Log errors
	connection.onerror = function (error) {
		console.log('WebSocket Error ' + error);
	};

	// Log messages from the server
	connection.onmessage = function (e) {
		receiveCallBack(JSON.parse(e.data));
	};

	return connection;
};

ApiBridge.prototype.sendRequest = function (endpoint, method, data, callback) {

	console.log('sendRequest', endpoint, method, data);

	// if MockProxy is in DevPanel
	if ($('body').hasClass('panel')) {
		var request = { "endpoint": endpoint, "method": method, "data": data};
		chrome.runtime.sendMessage(request, function(response) {
			callback(response);
		});
	}
	else {
		var xhr = new XMLHttpRequest();
		xhr.open(method, 'http://'+localStorage.mockProxyServerTargetEndpoint + endpoint, true);
		xhr.onload = function (event) {
			console.log('onload', event);
			if (xhr.readyState == 4 && xhr.status == 200) {
				var payload = JSON.parse(xhr.responseText);
				callback(payload);
			}
		};

		if (typeof data === 'object' && data !== null) {
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify(data));
		}
		else {
			xhr.send(null);
		}
	}
};


ApiBridge.prototype.enableMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId + "/enable", "PUT", null, callback);
};

ApiBridge.prototype.disableMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId + "/disable", "PUT", null, callback);
};

ApiBridge.prototype.getMockList = function (callback) {
	this.sendRequest("/api/mocks", "GET", null, callback);
};

ApiBridge.prototype.deleteMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId, "DELETE", null, callback);
};

ApiBridge.prototype.createMock = function (data, callback) {
	this.sendRequest("/api/mocks", "POST", data, callback);
};

ApiBridge.prototype.getReturnedMocks = function (limit, callback) {
	this.sendRequest("/api/mocks/getReturnedMocks" + "?limit=" + limit, "GET", null, callback);
};

ApiBridge.prototype.getRequestList = function (callback) {
	this.sendRequest("/api/requests", "GET", null, callback);
};

ApiBridge.prototype.clearRequestList = function (callback) {
	this.sendRequest("/api/requests", "DELETE", null, callback);
};

ApiBridge.prototype.getMock = function (mockId, callback) {
	this.sendRequest("/api/mocks/" + mockId, "GET", null, callback);
};

ApiBridge.prototype.getRequest = function (requestId, callback) {
	this.sendRequest("/api/requests/" + requestId, "GET", null, callback);
};

ApiBridge.prototype.getMockSetList = function(callback) {
	this.sendRequest("/api/mock-sets", "GET", null, callback);
};

ApiBridge.prototype.getMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId, "GET", null, callback);
};

ApiBridge.prototype.deleteMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId, "DELETE", null, callback);
};

ApiBridge.prototype.activateMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId + "/enable", "PUT", null, callback);
};

ApiBridge.prototype.deactivateMockSet = function(mockSetId, callback) {
	this.sendRequest("/api/mock-sets/" + mockSetId + "/disable", "PUT", null, callback);
};

ApiBridge.prototype.createMockSet = function(data, callback) {
	this.sendRequest("/api/mock-sets", "POST", data, callback);
};


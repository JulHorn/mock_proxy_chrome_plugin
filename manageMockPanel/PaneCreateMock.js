// Constructor to init stuff
var PaneCreateMock = function() {
	this.__providePaneElements();
	this.apiBridge = new ApiBridge();
	this.languageDetector = new LanguageDetector();
	this.bindEvents();
};

// Reset the form to its empty state
PaneCreateMock.prototype.draw = function(data) {
	var that = this;

	// Reset form to default sate before doing anything
	this.$form.trigger('reset');
	$('#form_id').val('');

	// Hide the delete button if a mock is being created
	that.$deleteButton.hide();

	// If no data was given do not try to fill anything in
	if(!data) {
		return;
	}

	// Autoformat code
	var responseBodyFormatted = this.languageDetector.autoDetectLanguageAndFormatCode(data.responseBody);
	//var requestBodyFormatted = this.languageDetector.autoDetectLanguageAndFormatCode(data.requestBody);

	// Fill pane
	that.$requestUriField.val(data.requestUri);
	that.$requestMethodField.val(data.requestMethod);
	that.$responseBodyField.val(responseBodyFormatted);

	// Only set fields if value is not undefined to avoid the text
	// undefined in the text field
	if (data.id) {
		that.$idField.val(data.id);
		// Display delete button if a mock gets edited
		that.$deleteButton.show();
	}

	if (data.name) {
		that.$nameField.val(data.name);
	}

	if (data.description) {
		that.$descField.val(data.description);
	}

	if (data.requestBody) {
		that.$requestBodyField.val(data.requestBody);
	}

	// Check the checkbox, if the mock is enabled
	this.apiBridge.getMockList(function (mockList) {
		var resultMock = mockList.find(function (mock) {
			return mock.id === data.id;
		});

		if(resultMock && resultMock.enabled) {
			that.$enableMockCheckbox.prop('checked', true);
		}
	});
};

// Bind events to send the request to the server
PaneCreateMock.prototype.bindEvents = function() {
	var that = this;
	this.$container.find('*.PaneCreateMock').off();

	// Jquery serialize does not create the data as we want it, grml
	// Submit the data and go back to mock list
	this.$form.on('submit.PaneCreateMock', function (event) {
		event.preventDefault();
		var data = {
			'id': $('#form_id').val(),
			'name': $('#form_name').val(),
			'description': $('#form_description').val(),
			'request': {
				'uri': $('#form_requestUri').val(),
				'method': $('#form_requestMethod').val(),
				'body': $('#form_requestBody').val()
			},
			'response': {
				'body': $('#form_responseBody').val()
			}
		};

		// Send create/update request to server and enable/disable the mock afterwards
		that.apiBridge.createMock(requestData, function (response) {
			if(that.$enableMockCheckbox.is(':checked')){
				that.apiBridge.enableMock(response.id, function () {
					that.draw();
					new UiNavigation().switchPanel('PaneMockList');
				});
			} else {
				that.apiBridge.disableMock(response.id, function () {
					that.draw();
					new UiNavigation().switchPanel('PaneMockList');
				})
			}
		});
	});

	// Update the mock without going to the mock list and enable/disable the mock afterwards
	this.$form.on('click.PaneMockList', 'button[data-action=apply]', function (event) {
		event.preventDefault();
		var requestData = that._getRequestData();

		// Send create/update request to server
		that.apiBridge.createMock(requestData, function (response) {
			if(that.$enableMockCheckbox.is(':checked')){
				that.apiBridge.enableMock(response.id, function () {
					that.$idField.val(response.id);
					that.draw(that._getRequestData());
				});
				that.draw(requestData);
			} else {
				that.apiBridge.disableMock(response.id, function () {
					that.$idField.val(response.id);
					that.draw(that._getRequestData());
				});
			}
		});
	});

	// Delete this mock
	this.$form.on('click.PaneMockList', 'button[data-action=delete]', function (event) {
		event.preventDefault();

		// Deletes the mock on the server and redirects the user to the mock list
		that.apiBridge.deleteMock(that.$idField.val(), function (response) {
			new UiNavigation().switchPanel('PaneMockList');
		});
	});
};

// Gets the data from the form fields, creates an object out of them and returns it for further usage for the createMock request
PaneCreateMock.prototype._getRequestData = function () {
 	var that = this;

	return {
	 'id': that.$idField.val(),
	 'name': that.$nameField.val(),
	 'description': that.$descField.val(),
	 'requestUri': that.$requestUriField.val(),
	 'requestMethod': that.$requestMethodField.val(),
	 'requestBody': that.$requestBodyField.val(),
	 'responseBody': that.$responseBodyField.val()
 };
};

// Provide form elements to avoid multiple declarations
PaneCreateMock.prototype.__providePaneElements = function () {
	this.$container = $('#PaneCreateMock');
	this.$form = $('#formManuallyCreate');
	this.$createMockButton = this.$container.find('#manuallyCreateMock');
	this.$idField = this.$container.find('#form_id');
	this.$nameField = this.$container.find('#form_name');
	this.$descField = this.$container.find('#form_description');
	this.$requestUriField = this.$container.find('#form_requestUri');
	this.$requestMethodField = this.$container.find('#form_requestMethod');
	this.$requestBodyField = this.$container.find('#form_requestBody');
	this.$responseBodyField = this.$container.find('#form_responseBody');
	this.$deleteButton = this.$container.find('#deleteMockButton');
	this.$enableMockCheckbox = this.$container.find('#activateMockCheckbox');
};
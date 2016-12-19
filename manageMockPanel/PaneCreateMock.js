// Constructor to init stuff
var PaneCreateMock = function() {
	this.$container = $('#PaneCreateMock');
	this.$form = $('#formManuallyCreate');
	this.apiBridge = new ApiBridge();
	this.languageDetector = new LanguageDetector();
	this.bindEvents();
};

// Reset the form to its empty state
PaneCreateMock.prototype.draw = function(data) {
	var $createMockButton = $('#manuallyCreateMock');
	var $idField = $('#form_id');
	var $nameField = $('#form_name');
	var $descField = $('#form_description');
	var $requestUriField = $('#form_requestUri');
	var $requestMethodField = $('#form_requestMethod');
	var $requestBodyField = $('#form_requestBody');
	var $responseBodyField = $('#form_responseBody');

	// Reset form to default sate before doing anything
	this.$form.trigger('reset');
	$('#form_id').val('');

	// If no data was given do not try to fill anything in
	if(!data) {
		return;
	}

	// Autoformat code
	var responseBodyFormatted = this.languageDetector.autoDetectLanguageAndFormatCode(data.responseBody);
	//var requestBodyFormatted = this.languageDetector.autoDetectLanguageAndFormatCode(data.requestBody);

	// Fill pane
	$requestUriField.val(data.requestUri);
	console.warn(data.method);
	$requestMethodField.val(data.method);
	$responseBodyField.val(responseBodyFormatted);

	// Only set fields if value is not undefined to avoid the text
	// undefined in the text field
	if (data.id) {
		$idField.val(data.id);
	}

	if (data.name) {
		$nameField.val(data.name);
	}

	if (data.desc) {
		$descField.val(data.desc);
	}

	if (data.requestBody) {
		$requestBodyField.val(data.requestBody);
	}
};

// Bind events to send the request to the server
PaneCreateMock.prototype.bindEvents = function() {
	var that = this;
	this.$container.find('*.PaneCreateMock').off();

	// Jquery serialize does not create the data as we want it, grml
	// Submit the data and go back to mock list
	this.$form.on('submit.PaneCreateMock', function (event) {
		event.preventDefault();

		// Send create/update request to server
		that.apiBridge.createMock(that._getRequestData(), function (response) {
			that.draw();

			new UiNavigation().switchPanel('PaneMockList');
		});
	});

	// Update the mock without going to the mock list
	this.$form.on('click.PaneMockList', 'button[data-action=apply]', function (event) {
		event.preventDefault();

		// Send create/update request to server
		that.apiBridge.createMock(that._getRequestData(), function (response) {
		});
	});
};

// Gets the data from the form fields, creates an object out of them and returns it for further usage for the createMock request
PaneCreateMock.prototype._getRequestData = function () {
 return {
	 'id': $('#form_id').val(),
	 'name': $('#form_name').val(),
	 'description': $('#form_description').val(),
	 'requestUri': $('#form_requestUri').val(),
	 'requestMethod': $('#form_requestMethod').val(),
	 'requestBody': $('#form_requestBody').val(),
	 'responseBody': $('#form_responseBody').val()
 };
};
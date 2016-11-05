var PaneShowRequests = function() {

	this.$container = $('#PaneShowRequests');
	this.apiBridge = new ApiBridge();
	this.preview = new UiPreview();				// The preview window object

	this.bindEvents();
};

// Draw pane
PaneShowRequests.prototype.draw = function() {
	var that = this;

	// Remove old content in order to add data to the already existing data and draw the table anew
	var $contentTableBody = that.$container.find('tbody');
	$contentTableBody.empty();

	// Get requests and fill table
	this.apiBridge.getRequestList(function (requestList) {
		var tableContent = '';

		// Draw table content
		requestList.forEach(function (entry) {
			var rowContent = '';
			rowContent += '<td><label>' + entry.request.uri + '</label></td>';
			rowContent += '<td><label>' + entry.request.method + '</label></td>';
			rowContent += '<td>';
			rowContent += '<button data-request-id="' + entry.id + '" data-action="addToMock">Add</button>';
			rowContent += '<button data-request-data="' + encodeURI(entry.response.body) + '" data-action="requestPreview">Preview</button>';
			rowContent += '</td>';

			tableContent += '<tr>' + rowContent + '</tr>';
		});

		$contentTableBody.append($(tableContent));
	});
};

// Bind buttons to actions
PaneShowRequests.prototype.bindEvents = function() {
	var that = this;

	this.$container.find('*.PaneShowRequests').off();

	// Show preview
	this.$container.on('click.PaneShowRequests', 'button[data-action=requestPreview]', function() {
		console.log(this);
		var requestData = decodeURI($(this).data('request-data'));
		that.preview.setContent(requestData).show();
	});

	// Delete all requests
	this.$container.on('click.PaneShowRequests', 'button[data-action=deleteRequests]', function() {
		that.apiBridge.clearRequestList(function (response) {
			console.log('Cleared requests.', response);
			that.draw();
		});
	});

	// Get the request which is associated with the button and fill its data into the create mock pane
	this.$container.on('click.PaneShowRequests', 'button[data-action=addToMock]', function() {
		that.apiBridge.getRequest($(this).data('request-id'), function (request) {
			// Check if the request body is an empty object and call the create mock method with null if it is the case
			// to avoid the [Object object] string
			if(request.message.request.body && request.message.request.body != null && Object.keys(request.message.request.body).length > 0) {
				new PaneCreateMock().fillCreateMockFields(null, null, null, request.message.request.uri,
					request.message.request.method, request.message.request.body, request.message.response.body);
			} else {
				new PaneCreateMock().fillCreateMockFields(null, null, null, request.message.request.uri,
					request.message.request.method, null, request.message.response.body);
			}
		});
	});
};


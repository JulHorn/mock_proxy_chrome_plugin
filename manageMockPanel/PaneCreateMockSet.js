// Constructor to init stuff
var PaneCreateMockSet = function(navigation) {
    this.$container = $('#PaneCreateMockSet');
    this.$form = $('#formManuallyCreateMockSet');
    this.$multiSelect = $('#mockSetSelecter');
    this.apiBridge = new ApiBridge();
    this.bindEvents();

	this.$multiSelect.multiSelect();
};

// Draw pane
PaneCreateMockSet.prototype.draw = function() {
    var that = this;
    
	this.$form.trigger('reset');    
	$('#set_form_id').val('');

    // Make multi select box fancy
    // http://loudev.com/

    this.$multiSelect.multiSelect('deselect_all');

	this.apiBridge.getMockList(function(mockList) {
		mockList.forEach(function (mock) {
			that.$multiSelect.multiSelect('addOption', { value: mock.id, text: mock.name});
		});
	});

};

// Bind events
PaneCreateMockSet.prototype.bindEvents = function() {
	var that = this;

	this.$container.find("*.PaneCreateMockSet").off();

	this.$form.on('submit.PaneCreateMockSet', function(event) {
		event.preventDefault();
		
		var data = {
				'id': $('#set_form_id').val(),
				'name': $('#set_form_name').val(),
				'description': $('#set_form_description').val(),
				'mockIds': that.$multiSelect.val()
			};
		
		// Send create/update request to server
		that.apiBridge.createMockSet(data, function (response) {
			console.log('createMockSet', response);
			that.draw();
			// This seem to cause a major performance problem
			new UiNavigation().switchPanel('PaneMockSetList');
		});
	});
};

PaneCreateMockSet.prototype.fillFields = function (id, name, description, mockIds) {

	var $idField = $('#set_form_id');
	var $nameField = $('#set_form_name');
	var $descField = $('#set_form_description');

	// Go to create tab
	new UiNavigation().switchPanel('PaneCreateMockSet');

	// Fill pane
	// Only set fields if value is not undefined to avoid the text
	// undefined in the text field
	if (id) {
		$idField.val(id);
	}

	if (name) {
		$nameField.val(name);
	}

	if (description) {
		$descField.val(description);
	}

	this.$multiSelect.multiSelect('select', mockIds);
};
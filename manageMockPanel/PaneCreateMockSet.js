var PaneCreateMockSet = function() {
    this.$container = $('#PaneCreateMockSet');
    this.$form = $('#formManuallyCreateMockSet');
    this.$multiSelect = $('#mockSetSelecter');
    this.apiBridge = new ApiBridge();
    this.bindEvents();
};

PaneCreateMockSet.prototype.draw = function() {
    var that = this;
    
	this.$form.trigger('reset');    
	$('#set_form_id').val('');

    // Make multi select box fancy
    // http://loudev.com/
    this.$multiSelect.multiSelect();
    this.$multiSelect.multiSelect('deselect_all');
    
    this.apiBridge.getMockList(function(mockList) {
        mockList.forEach(function (mock) {
            that.$multiSelect.multiSelect('addOption', { value: mock.id, text: mock.name});
        });
    });




};

PaneCreateMockSet.prototype.bindEvents = function() {
	var that = this;
	
	this.$container.unbind();
	this.$form.submit(function(event) {
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

	// Go to create tab
	new UiNavigation().switchPanel('PaneCreateMock');

    this.$multiSelect.multiSelect('select', mockIds);
};
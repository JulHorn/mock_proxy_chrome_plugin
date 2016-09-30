// Constructor to init stuff
var PaneCreateMockSet = function(navigation) {
    this.$container = $('#PaneCreateMockSet');
    this.$form = $('#formManuallyCreateMockSet');
    this.$multiSelect = $('#mockSetSelecter');
    this.apiBridge = new ApiBridge();
    this.bindEvents();

	// Make multi select box fancy
	// http://loudev.com/
	this.$multiSelect.multiSelect({
		selectableHeader: "<input type='text' class='search-input' autocomplete='off' placeholder=''>",
		selectionHeader: "<input type='text' class='search-input' autocomplete='off' placeholder=''>",
		afterInit: function(ms) {
			var that = this;
			var $selectableSearch = that.$selectableUl.prev();
			var $selectionSearch = that.$selectionUl.prev();
			var selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)';
			var selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

			that.qs1 = $selectableSearch.quicksearch(selectableSearchString).on('keydown', function(e){

				if (e.which === 13){
					e.preventDefault();
				}

				if (e.which === 40){
					that.$selectableUl.focus();
					return false;
				}
			});

			that.qs2 = $selectionSearch.quicksearch(selectionSearchString).on('keydown', function(e) {

				if (e.which === 13){
					e.preventDefault();
				}

				if (e.which == 40){
					that.$selectionUl.focus();
					return false;
				}
			});
		},
		afterSelect: function(){
			this.qs1.cache();
			this.qs2.cache();
		},
		afterDeselect: function(){
			this.qs1.cache();
			this.qs2.cache();
		}
  });
};

// Draw pane
PaneCreateMockSet.prototype.draw = function() {
    var that = this;
    
	this.$form.trigger('reset');    
	$('#set_form_id').val('');



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
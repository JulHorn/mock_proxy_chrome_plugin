var PaneCreateMockSet = function() {
    this.$container = $('#PaneCreateMockSet');
    this.$form = $('#formManuallyCreate');
    this.$multiSelect = $('#mockSetSelecter');
    this.apiBridge = new ApiBridge();
    this.bindEvents();
};

PaneCreateMockSet.prototype.draw = function() {
    this.$form.trigger('reset');
    $('#form_id').val('');

    // Make multi select box fancy
    this.$multiSelect.multiSelect();

    this.apiBridge.getMockList(function(mockList) {
        mockList.forEach(function () {
            this.$multiSelect.multiSelect('addOption', { value: 'test', text: 'test'});
        });
    });




};

PaneCreateMockSet.prototype.bindEvents = function() {

};

PaneCreateMockSet.prototype.fillFields = function (id, name, description, mockIds) {

    // First change pane and then! select stuff


    this.$multiSelect.multiSelect('select', mockIds);
};
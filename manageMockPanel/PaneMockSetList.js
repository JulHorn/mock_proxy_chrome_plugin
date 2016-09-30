var PaneMockSetList = function() {
    this.$container = $('#PaneMockSetList');
    this.apiBridge = new ApiBridge();
    this.bindEvents();
};

PaneMockSetList.prototype.draw = function (){
    var that = this;

    var $contentTableBody = that.$container.find('tbody');
    // Remove old content in order to add data to the already existing data and draw the table anew
    $contentTableBody.empty()

    this.apiBridge.getMockSetList(function (mockSetList) {
        var tableContent = '';

        // Draw table content
        mockSetList.forEach(function (mockSetData) {
            var rowContent = '';
            rowContent += '<td>' + mockSetData.name + '</label></td>';
            rowContent += '<td>' + mockSetData.description + '</td>';
            rowContent += '<td>';
            rowContent += '<button data-mockset-id="' + mockSetData.id + '" data-action="activate">Activate</button>';
            rowContent += '<button data-mockset-id="' + mockSetData.id + '" data-action="deactivate">Deactivate</button>';
            rowContent += '<button data-mockset-id="' + mockSetData.id + '" data-action="edit">Edit</button>';
            rowContent += '<button data-mockset-id="' + mockSetData.id + '" data-action="delete">Delete</button>';            
            rowContent += '</td>';
            tableContent += '<tr>' + rowContent + '</tr>';
        });

        $contentTableBody.append($(tableContent));
    });
};

PaneMockSetList.prototype.bindEvents = function (){
    var that = this;

    this.$container.find('*.PaneMockSetList').off();

    // Activate mocks in mock set
    this.$container.on('click.PaneMockSetList', 'button[data-action=activate]', function() {
        that.apiBridge.activateMockSet($(this).data('mockset-id'), function() {
            console.log('Activated mocks in mock set.');
        });
    });

    // Deactivate mocks in mock set
    this.$container.on('click.PaneMockSetList', 'button[data-action=deactivate]', function() {
        that.apiBridge.deactivateMockSet($(this).data('mockset-id'), function() {
            console.log('Deactivated mocks in mock set.');
        });
    });

    // Edit mock set
    this.$container.on('click.PaneMockSetList', 'button[data-action=edit]', function() {
        var updateMockPane = new PaneCreateMockSet();
        
        that.apiBridge.getMockSet($(this).data('mockset-id'), function (mockSet) {
            updateMockPane.fillFields(mockSet.message.id, mockSet.message.name,
                    mockSet.message.description, mockSet.message.mockIds);
        });   
    });

    // Delete mock set
   this.$container.on('click.PaneMockSetList', 'button[data-action=delete]', function() {
        that.apiBridge.deleteMockSet($(this).data('mockset-id'), function() {
            console.log('Deleted mock set: ', $(this).data('mockset-id'));
            that.draw();
        });
    });
};

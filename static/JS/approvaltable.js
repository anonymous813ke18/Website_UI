
            $(document).ready(function(){
                var allData;

                $.getJSON('/approval_table', function(data){
                    allData = data;
                    console.log('this is the data',data)
                    populateTable(data);
                    populateFilterDropdowns(data);
                });

                function populateTable(data){
                    var i = 0;
                    $('#transactionData').empty();
                    $.each(data, function(index, transaction){
                        $('#transactionTable tbody').append('<tr>' +
                            '<td><input type="radio" name="selection" class"radioButton" data-formid="'+ transaction.formID +'"></td>'+
                            '<td>' + (++i) + '</td>' +
                            '<td>' + transaction.FormID + '</td>' +
                            '<td>' + transaction.EwayBillNo + '</td>' +
                            '<td>' + transaction.Source + '</td>' +
                            '<td>' + transaction.Destination + '</td>' +
                            '<td>' + transaction.Sender + '</td>' +
                            '<td>' + transaction.Receiver + '</td>' +
                            '<td>' + transaction.InitiationDate + '</td>' +
                            '<td>' + transaction.ApprovalType + '</td>' +
                            '</tr>');
                            console.log(transaction.ApprovalType)
                    });
                }

                document.getElementById("viewButton").addEventListener("click", function() {
    var table = document.getElementById("transactionTable");
    var selectedRow;
    var approvalType;

    // Check if at least one radio button is selected
    var atLeastOneSelected = false;
    for (var i = 0; i < table.rows.length; i++) {
        var radioButton = table.rows[i].querySelector("input[type='radio']");
        if (radioButton && radioButton.checked) {
            selectedRow = table.rows[i];
            approvalType = selectedRow.cells[9].textContent.trim(); // Assuming Approval Type is the 10th column (index 9)
            atLeastOneSelected = true;
            break;
        }
    }

    // If at least one radio button is selected, proceed
    if (atLeastOneSelected) {
        var formid = selectedRow.cells[2].textContent; // Change index if needed
        console.log(formid);

        // Send the form ID to the Flask route using XMLHttpRequest
        sendFormID(formid);

        // Determine the route based on the approval type
        var route;
        if (approvalType === 'Send') {
            route = '/display_send_approval';
        } else if (approvalType === 'Receive') {
            route = '/display_receive_approval';
        } else {
            // Handle other cases, if any
            console.log('Unknown Approval Type:', approvalType);
            // You can set a default route here or handle it as per your requirement
            route = '/default_route';
        }

        // Redirect to the desired route
        window.location.href = route;
    } else {
        // If no radio button is selected, show an alert
        floatingMessageBox("Please select a radio button before viewing the form");

    }
});



                function populateFilterDropdowns(data){
                    // Populate filter dropdowns
                    var serialOptions = [];
                    var formIDOptions = [];
                    var ewayOptions = [];
                    var sourceOptions = [];
                    var destinationOptions = [];
                    var senderOptions = [];
                    var receiverOptions = [];
                    var doiOptions = [];
                    var approvalOptions = [];

                    formIDOptions.push("NONE");
                    $('#formIDFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    ewayOptions.push("NONE");
                    $('#ewayFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    sourceOptions.push("NONE");
                    $('#sourceFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    destinationOptions.push("NONE");
                    $('#destinationFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    senderOptions.push("NONE");
                    $('#senderFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    receiverOptions.push("NONE");
                    $('#receiverFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    doiOptions.push("NONE");
                    $('#doiFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    approvalOptions.push("NONE");
                    $('#approvalFilter').append('<option value=NONE>NONE</option>')

                    $.each(data, function(index, item) {
                        if(!formIDOptions.includes(item.FormID)) {
                            formIDOptions.push(item.FormID);
                            $('#formIDFilter').append('<option value="'+item.FormID+'">'+item.FormID+'</option>')
                        }

                        if(!ewayOptions.includes(item.EwayBillNo)) {
                            ewayOptions.push(item.EwayBillNo);
                            $('#ewayFilter').append('<option value="'+item.EwayBillNo+'">'+item.EwayBillNo+'</option>')
                        }

                        if (!sourceOptions.includes(item.Source)) {
                            sourceOptions.push(item.Source);
                            $('#sourceFilter').append('<option value="' + item.Source + '">' + item.Source + '</option>');
                        }

                        if (!destinationOptions.includes(item.Destination)) {
                            destinationOptions.push(item.Destination);
                            $('#destinationFilter').append('<option value="' + item.Destination + '">' + item.Destination + '</option>');
                        }

                        if (!senderOptions.includes(item.Sender)) {
                            senderOptions.push(item.Sender);
                            $('#senderFilter').append('<option value="' + item.Sender + '">' + item.Sender + '</option>');
                        }

                        if (!receiverOptions.includes(item.Receiver)) {
                            receiverOptions.push(item.Receiver);
                            $('#receiverFilter').append('<option value="' + item.Receiver + '">' + item.Receiver + '</option>');
                        }

                        if(!doiOptions.includes(item.InitiationDate)) {
                            doiOptions.push(item.InitiationDate);
                            $('#doiFilter').append('<option value="'+item.InitiationDate+'">'+item.InitiationDate+'</option>')
                        }

                        if(!approvalOptions.includes(item.ApprovalType)) {
                            approvalOptions.push(item.ApprovalType);
                            $('#approvalFilter').append('<option value="'+item.ApprovalType+'">'+item.ApprovalType+'</option>')
                        }
                    });
                }
                // Event listeners for filter dropdowns
                $('#formIDFilter').change(function(){
                    var selectedFormID = $(this).val();
                    var filteredData;
                    if (selectedFormID == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.FormID === selectedFormID;
                        })
                    }
                    populateTable(filteredData);
                });

                $('#ewayFilter').change(function(){
                    var selectedEway = $(this).val();
                    var filteredData;
                    if (selectedEway == "NONE") {
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.EwayBillNo === selectedEway;
                        })
                    }
                    populateTable(filteredData);
                });

                $('#sourceFilter').change(function() {
                    var selectedSource = $(this).val();
                    var filteredData;
                    if (selectedSource == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.Source === selectedSource;
                        })
                    }
                    populateTable(filteredData);
                });

                $('#destinationFilter').change(function() {
                    var selectedDestination = $(this).val();
                    var filteredData;
                    if (selectedDestination == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.Destination === selectedDestination;
                        })
                    }
                    populateTable(filteredData);
                });

                $('#senderFilter').change(function() {
                    var selectedSender = $(this).val();
                    var filteredData;
                    if (selectedSender == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.Sender === selectedSender;
                        })
                    }
                    populateTable(filteredData);
                });

                $('#receiverFilter').change(function() {
                    var selectedReceiver = $(this).val();
                    var filteredData;
                    if (selectedReceiver == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.Receiver === selectedReceiver;
                        })
                    }
                    populateTable(filteredData);
                });

                $('#doiFilter').change(function(){
                    var selectedDOI = $(this).val();
                    var filteredData;
                    if (selectedDOI == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.InitiationDate === selectedDOI;
                        })
                    }
                    populateTable(filteredData);
                });

                $('#approvalFilter').change(function() {
                    var selectedApproval = $(this).val();
                    var filteredData;
                    if (selectedApproval == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.ApprovalType === selectedApproval;
                        })
                    }
                    populateTable(filteredData);
                });

                /*$('#approvalFilter').change(function(){
                    var approvalOptions = $(this).val();
                    var filteredData;
                    if (selectedDOI == "NONE"){
                        filteredData = allData;
                    } else {
                        filteredData = allData.filter(function(item) {
                            return item.ApprovalType === selectedDOI;
                        })
                    }
                    populateTable(filteredData);
                });*/

                // Add click event handler for the dynamically created buttons
                /*$('#transactionTable').on('click', '.viewButton', function(){
                    var formID = $(this).data('formid');
                    console.log('this is the data',$(this).data());
                    var ApprovalType = $(this).data('approvaltype');
                    
                    // Perform any action you want with the formID and approvalType
                    console.log('Form ID:', formID);
                    console.log('Approval Type:', ApprovalType);
                    
                    // Determine the route based on the approval type
                    var route;
                    if(ApprovalType === 'Send') {
                        route = '/display_send_approval';
                    } else if(ApprovalType === 'Receive') {
                        route = '/display_receive_approval';
                    } 

                    // Send the form ID to the Flask route using XMLHttpRequest
                    sendFormID(formID);

                    // Redirect to the desired route
                    window.location.href = route;
                });*/
            });            

            // Function to send form ID to Flask route
            function sendFormID(formID) {
                var xhr = new XMLHttpRequest(); 
                xhr.open("GET", "/send_formid?form_id=" + formID, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        console.log("Form ID sent to Flask: " + formID);
                    }
                };
                xhr.send();
            }
        
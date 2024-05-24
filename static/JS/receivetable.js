
            $(document).ready(function(){
                var allData;

                $.getJSON('/recieve_items_table_data', function(data){
                    allData = data;
                    console.log('this is data',data)
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
                            '</tr>');
                    });
                }

                document.getElementById("viewButton").addEventListener("click", function() {
    var table = document.getElementById("transactionTable");
    var selectedRow;

    // Check if at least one radio button is selected
    var radioButtons = document.querySelectorAll("input[type='radio']");
    var atLeastOneSelected = false;
    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            atLeastOneSelected = true;
            break;
        }
    }

    // If at least one radio button is selected, proceed
    if (atLeastOneSelected) {
        // Iterate over the table rows
        for (var i = 0; i < table.rows.length; i++) {
            // Check if the radio button in this row is selected
            var radioButton = table.rows[i].querySelector("input[type='radio']");
            if (radioButton && radioButton.checked) {
                selectedRow = table.rows[i];
                break; // Exit loop if a selected row is found
            }
        }

        // If a selected row is found, retrieve data from the formid column (second column)
        if (selectedRow) {
            var formid = selectedRow.cells[2].textContent; // Change index if needed
            console.log(formid)

            // Send the form ID to the Flask route using XMLHttpRequest
            sendFormID(formid);

            // Redirect to the desired route
            window.location.href = "/receive_form_data";
        } else {
            
            console.log('No formid selected')
        }
    } else {
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
                    $('#approvalFilter').append('<option value="'+"NONE"+'">'+"NONE"+'</option>')

                    approvalOptions.push("Send");
                    $('#approvalFilter').append('<option value="'+"Send"+'">'+"Send"+'</option>')

                    approvalOptions.push("Receive");
                    $('#approvalFilter').append('<option value="'+"Receive"+'">'+"Receive"+'</option>')

                    $.each(data, function(index, item) {
                        if(!formIDOptions.includes(item.FormID)) {
                            formIDOptions.push(item.FormID);
                            $('#formIDFilter').append('<option value="'+item.FormID+'">'+item.FormID+'</option>')
                        }

                        if(!ewayOptions.includes(item.EwayBillNo)) {
                            ewayOptions.push(item.EwayBillNo);
                            $('#ewayFilter').append('<option value="'+item.EwayBillNo+'">'+item.EwayBillNo+'</option>')
                        }

                        if (!sourceOptions.includes(item.FromProject)) {
                            sourceOptions.push(item.FromProject);
                            $('#sourceFilter').append('<option value="' + item.FromProject + '">' + item.FromProject + '</option>');
                        }

                        if (!destinationOptions.includes(item.ToProject)) {
                            destinationOptions.push(item.ToProject);
                            $('#destinationFilter').append('<option value="' + item.ToProject + '">' + item.ToProject + '</option>');
                        }

                        if (!senderOptions.includes(item.FromPerson)) {
                            senderOptions.push(item.FromPerson);
                            $('#senderFilter').append('<option value="' + item.FromPerson + '">' + item.FromPerson + '</option>');
                        }

                        if (!receiverOptions.includes(item.ToPerson)) {
                            receiverOptions.push(item.ToPerson);
                            $('#receiverFilter').append('<option value="' + item.ToPerson + '">' + item.ToPerson + '</option>');
                        }

                        if(!doiOptions.includes(item.HandoverDate)) {
                            doiOptions.push(item.HandoverDate);
                            $('#doiFilter').append('<option value="'+item.HandoverDate+'">'+item.HandoverDate+'</option>')
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
                            return item.FromProject === selectedSource;
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
                            return item.ToProject === selectedDestination;
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
                            return item.FromPerson === selectedSender;
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
                            return item.ToPerson === selectedReceiver;
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
                            return item.HandoverDate === selectedDOI;
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
                    // Perform any action you want with the formID
                    console.log('Form ID:', formID);
                    
                    // Send the form ID to the Flask route using XMLHttpRequest
                    sendFormID(formID);

                    // Redirect to the desired route
                    window.location.href = "/display_transaction_progess_table";
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

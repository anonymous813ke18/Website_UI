// Add event listener to the ask-approval-button
var askApprovalButton = document.getElementById("ask-approval-button");
askApprovalButton.addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('[id^="checkbox_"]');
    var atLeastOneChecked = false;
    var allConditionsSelected = true; // Assume all conditions are initially selected

    checkboxes.forEach(function(checkbox, index) {
        if (checkbox.checked) {
            atLeastOneChecked = true;
            var selectElement = document.getElementById(`conditionReceiver_${index}`);
            if (selectElement && selectElement.value === "") {
                floatingMessageBox("Please select a condition for the selected items");
                allConditionsSelected = false;
                return; // Stop execution if condition is not met
            }
        }
    });

    if (!atLeastOneChecked) {
        floatingMessageBox("Please select at least one item");

    } else if (atLeastOneChecked && !allConditionsSelected) {
        // Don't proceed if at least one item is checked but not all conditions are selected
    } else {
        logRowValues(); // Call logRowValues() function only if at least one item is checked and all conditions are met
    }
});



function logRowValues() {
    var formObject = []; // Initialize formObject as an array

    // Create a list and add Form No value
    var formNoLabel = document.getElementById('formNo');
    var formNoValue = formNoLabel.innerText;

    var formNoData = {
        FormID: formNoValue
    };
    formObject.push(formNoData); // Append Form No data to formObject array

    // Get the table body by its ID
    var tableBody = document.querySelector('#mainTable');
    console.log(tableBody)
    // Loop through table rows and collect data
    var rows = tableBody.querySelectorAll('tr');
    rows.forEach(function(row, index) {
        if (index !== 0) { // Skip the header row
            var cells = row.querySelectorAll('td');
            var checkbox = cells[0].querySelector('input[type="checkbox"]');
            var isChecked = checkbox.checked;

            if (isChecked) { // Only include checked rows
                // Retrieve select element for receiver condition
                var conditionSelect = cells[9].querySelector('select[name="conditionReceiver"]');
                if (conditionSelect) {
                    var selectedCondition = conditionSelect.value;
                } else {
                    console.error('Condition select element not found.');
                    return; // Skip this row if select element not found
                }

                // Retrieve receiver remarks input
                var receiverRemarksInput = cells[10].querySelector('input[type="text"]');
                var receiverRemarks = '';
                if (receiverRemarksInput) {
                    receiverRemarks = receiverRemarksInput.value;
                } else {
                    console.error('Receiver remarks input element not found.');
                    return; // Skip this row if input element not found
                }

                // Extract serial number
                var serialNo = cells[6].innerText;

                // Construct rowData object
                var rowData = {
                    SerialNo: serialNo,
                    ReceiverCondition: selectedCondition,
                    ReceiverRemark: receiverRemarks,
                    Reached: isChecked
                };

                formObject.push(rowData); // Append rowData to formObject array
            }
        }
    });

console.log("This is the formObject Data", formObject); // Check the collected data in formObject


var xhr = new XMLHttpRequest();
xhr.open("POST", "http://127.0.0.1:5001/receive_approval_request", true);

xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            console.log('Success:', xhr.responseText);
            floatingMessageBox("Mail for approval of receiving item is sent. \nYou may contact your manager to approve it.",'green','receivertable');

        } else {
            console.error('Error:', xhr.status);
            // Handle error response from server
        }
    }
};

xhr.setRequestHeader("Content-Type", "application/json"); // Set request header
xhr.send(JSON.stringify(formObject));
}

// Declare the data variable at the global scope
var data;

    window.onload = function() {

        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", "/get_form_data", true);
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState == 4 && xhr2.status == 200) {
                parsedData = JSON.parse(xhr2.responseText);
                data = JSON.parse(parsedData);
                var table = document.getElementById("mainTable");
                console.log(data)
                if (data && Array.isArray(data) && data.length > 0) {
                    
            var firstFormData = data[0]; // Get the first dictionary from the list
            // Update labels with values from the first dictionary
            // Assuming firstFormData contains the date in the format 'YYYY-MM-DD HH:MM:SS'
            var initiationDateTime = firstFormData['InitiationDate'];

            // Extract just the date part
            var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';

            document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
            document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';

            document.getElementById("Sender").textContent = firstFormData['Sender'] || 'Loading From Person ...';
            document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
            document.getElementById("Receiver").textContent = firstFormData['Receiver'] || 'Loading To Person ...';
            document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
            document.getElementById("InitiationDate").textContent = initiationDate;        

} else {
            console.error("No form data or invalid data format received");
        }


            data.forEach(function(row, index) {
                var newRow = table.insertRow();

                // Checkbox cell
                var reachedCell = newRow.insertCell(0);
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `checkbox_${index}`; // Assign unique ID to checkbox
                reachedCell.appendChild(checkbox);

                // Serial number cell
                var serialNoCell = newRow.insertCell(1);
                serialNoCell.textContent = index + 1; // Generate dynamic serial number starting from 1

                // Other cells
                var productCategoryCell = newRow.insertCell(2);
                productCategoryCell.textContent = row['Category'];

                var productNameCell = newRow.insertCell(3);
                productNameCell.textContent = row['Name'];

                var productNameCell = newRow.insertCell(4);
                productNameCell.textContent = row['Make'];

                var ModelCell = newRow.insertCell(5);
                ModelCell.textContent = row['Model'];

                var ProductNoCell = newRow.insertCell(6);
                ProductNoCell.textContent = row['ProductID'];


                var conditionCell = newRow.insertCell(7);
                conditionCell.textContent = row['SenderCondition'];

                var remarksCell = newRow.insertCell(8);
                remarksCell.textContent = row['SenderRemarks'];

                // Remarks input cell
                var remarksInputCell = newRow.insertCell(9);
                remarksInputCell.innerHTML = `
                    <select id="conditionReceiver_${index}" name="conditionReceiver" disabled>
                        <option value="">Select</option>
                        <option value="Good">Good</option>
                        <option value="Not Ok">Not Ok</option>
                        <option value="Damaged">Damaged</option>
                    </select>
                `;

                var remarksInputCell = newRow.insertCell(10);
                remarksInputCell.innerHTML = `
                    <input id="remarksReceiver_${index}" type="text" name="remarksReceiver" value="" disabled>
                `;

            // Add event listener to the checkbox
            checkbox.addEventListener('change', function() {
                var isChecked = checkbox.checked;
                // Extract index from checkbox id
                var idParts = checkbox.id.split('_');
                var index = idParts[idParts.length - 1];
                // Enable/disable select and input based on checkbox state
                var selectElement = document.getElementById(`conditionReceiver_${index}`);
                var inputElement = document.getElementById(`remarksReceiver_${index}`);
                if (selectElement && inputElement) {
                    if (isChecked) {
                        selectElement.removeAttribute('disabled');
                        inputElement.removeAttribute('disabled');
                    } else {
                        selectElement.setAttribute('disabled', 'disabled');
                        inputElement.setAttribute('disabled', 'disabled');
                    }
                } else {
                }
                                                            }
                                    );

});



           }
        };
        xhr2.send();
    };


var tableBody = document.querySelector("#mainTable tbody");

var submitButton = document.getElementById("approvalButton");
submitButton.addEventListener("click", function() {


    logRowValues();
});

function logRowValues() {
var formObject = []; // Initialize formObject as an array

// Get the values from the labels
var formNo = document.getElementById("formNo").textContent.trim();
var toPersonValue = document.getElementById("Receiver").textContent.trim();
var toProjectValue = document.getElementById("Destination").textContent.trim();


// Assign all key-value pairs to the formObject
newObject = {
    FormNo:formNo,
    Owner: toPersonValue,
    Project: toProjectValue

};

formObject.push(newObject); // Append rowData to formObject array
console.log(newObject)

    
// Loop through table rows and collect data
var rows = tableBody.querySelectorAll('tr');
rows.forEach(function(row, index) {
    if (index !== 0) { // Skip the header row
        var cells = row.querySelectorAll('td');
        var rowData = {
            SerialNo: cells[2].innerText,
            Condition: cells[8].innerText,
        };
        formObject.push(rowData); // Append rowData to formObject array
    }
});

console.log("This is the formObject Data", formObject); // Check the collected data in formObject



var xhr = new XMLHttpRequest();
xhr.open("POST", "http://127.0.0.1:5001/approve_receive_request", true);

xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            console.log('Success:', xhr.responseText);
            floatingMessageBox("Approval to Receive items has been given.", 'green','approvetable');


            // Handle success response from server
        } else {
            console.error('Error:', xhr.status);
            floatingMessageBox( xhr.status, 'red');

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
                console.log("We have reached")
                console.log(data)

                if (data && Array.isArray(data) && data.length > 0) {
            var firstFormData = data[0]; // Get the first dictionary from the list
            // Update labels with values from the first dictionary
    // Update labels with values from the first dictionary
    var initiationDateTime = firstFormData['InitiationDate'];

    // Extract just the date part
    var initiationDate = initiationDateTime ? initiationDateTime.split(' ')[0] : 'Loading Initiation Date ...';
            // Update labels with values from the first dictionary
            document.getElementById("formNo").textContent = firstFormData['FormID'] || 'Loading Form ID ...';
            document.getElementById("ewaybillno").textContent = firstFormData['EwayBillNo'] || 'Loading Eway Bill No ...';


            document.getElementById("Sender").textContent = firstFormData['Sender'] || 'Loading From Person ...';
            document.getElementById("Source").textContent = firstFormData['Source'] || 'Loading From Project ...';
            document.getElementById("Receiver").textContent = firstFormData['Receiver'] || 'Loading To Person ...';
            document.getElementById("Destination").textContent = firstFormData['Destination'] || 'Loading To Project ...';
            document.getElementById("InitiationDate").textContent = initiationDate;        

            document.getElementById("CompletionDate").textContent = firstFormData['CompletionDate'] || 'Loading To Project ...';

        } else {
            console.error("No form data or invalid data format received");
        }
        



            data.forEach(function(row, index) {
    var newRow = table.insertRow();

    var serialNoCell = newRow.insertCell(0);
    serialNoCell.textContent = index + 1; // Generate dynamic serial number starting from 1

                    var productCategoryCell = newRow.insertCell(1);
                    productCategoryCell.textContent = row['Category'];

                    var ProductNoCell = newRow.insertCell(2);
                    ProductNoCell.textContent = row['ProductID'];

                    var productNameCell = newRow.insertCell(3);
                    productNameCell.textContent = row['Name'];

                    var productNameCell = newRow.insertCell(4);
                    productNameCell.textContent = row['Make'];

                    var ModelCell = newRow.insertCell(5);
                    ModelCell.textContent = row['Model'];

                    var SenderconditionCell = newRow.insertCell(6);
                    SenderconditionCell.textContent = row['SenderCondition'];

                    var SenderremarksCell = newRow.insertCell(7);
                    SenderremarksCell.textContent = row['SenderRemarks'];

                    var ReceiverconditionCell = newRow.insertCell(8);
                    ReceiverconditionCell.textContent = row['ReceiverCondition'];

                    var ReceiverremarksCell = newRow.insertCell(9);
                    ReceiverremarksCell.textContent = row['ReceiverRemark'];


                });
           }
        };
        xhr2.send();
    };

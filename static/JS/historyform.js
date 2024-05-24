
// Declare the data variable at the global scope
var data;

    window.onload = function() {
      if (!sessionStorage.getItem('refreshed')) {
        // Refresh the page
        sessionStorage.setItem('refreshed', 'true');
        window.location.reload();
    }
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
                    document.getElementById("CompletionDate").textContent = firstFormData['CompletionDate'] || 'Loading To Project ...';
        } else {
            console.error("No form data or invalid data format received");
        }
        
            // Check if AskReceiveApproval is "yes" in the first dictionary
            if (data.length > 0 && data[0]['ApprovalToReceive'] === 'yes') {
                var approvalButton = document.getElementById("approvalButton");
                var approvalText = document.createTextNode("You have already approved this form transaction to receive items");
                approvalButton.parentNode.replaceChild(approvalText, approvalButton);
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

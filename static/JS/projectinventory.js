let tableData = [];

// Function to fetch data from Flask route using XMLHttpRequest
function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/my_project_dashboard', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                tableData = JSON.parse(xhr.responseText);
                console.log(tableData);
                displayData(tableData);
                populateFilters(tableData);
                attachFilterListeners();
            } else {
                console.error('Error fetching data:', xhr.statusText);
            }
        }
    };
    xhr.send();
}

// Function to get unique values for each column
function getUniqueValues(data, column) {
    return [...new Set(data.map(item => item[column]))];
}

// Function to populate filters with unique values
function populateFilters(data) {
    const filters = {
        'filter-serialNo': 'SerialNo',
        'filter-category': 'Category',
        'filter-name': 'Name',
        'filter-make': 'Make',
        'filter-model': 'Model',
        'filter-productId': 'ProductID',
        'filter-condition': 'Condition',
        'filter-project': 'Project',
        'filter-owner': 'Owner'
    };

    for (const [filterId, column] of Object.entries(filters)) {
        const select = document.getElementById(filterId);
        select.innerHTML = '<option value="All">All</option>'; // Reset options
        const uniqueValues = getUniqueValues(data, column);

        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.text = value;
            select.appendChild(option);
        });
    }
}

// Function to display data in the table
function displayData(data) {
    const tableBody = document.querySelector('#data-table tbody');

    tableBody.innerHTML = ''; // Clear existing data

    // Define the desired column sequence
    const desiredColumns = ['SerialNo', 'Category', 'Name', 'Make', 'Model', 'ProductID', 'Project', 'Owner', 'Condition'];

    // Populate table with data and generate SerialNo dynamically
    data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Populate columns
        desiredColumns.forEach(column => {
            const td = document.createElement('td');
            if (column === 'SerialNo') {
                td.textContent = index + 1; // Serial number based on the index
            } else {
                td.textContent = row[column] || ''; // If data for the column is not available, display an empty string
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });

    // Initialize DataTables with custom options
    $('#data-table').DataTable({
        lengthChange: false,  // Remove "Show entries" dropdown
        info: false,          // Remove "Showing X to Y of Z entries" label
        paging: false,        // Remove pagination
        searching: false,     // Remove the default search box
        ordering: false       // Disable column ordering
    });
}

// Function to filter the table based on dropdown values
function filterTable() {
    const filters = {
        'filter-serialNo': 'SerialNo',
        'filter-category': 'Category',
        'filter-name': 'Name',
        'filter-make': 'Make',
        'filter-model': 'Model',
        'filter-productId': 'ProductID',
        'filter-condition': 'Condition',
        'filter-project': 'Project',
        'filter-owner': 'Owner'
    };

    const tableBody = document.querySelector('#data-table tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        let showRow = true;

        for (const [filterId, column] of Object.entries(filters)) {
            const filterValue = document.getElementById(filterId).value;
            const cellValue = row.cells[columnIndex(column)].textContent;

            if (filterValue !== 'All' && filterValue !== cellValue) {
                showRow = false;
                break;
            }
        }

        row.style.display = showRow ? '' : 'none';
    });

    updateDropdowns(filters);
}

// Helper function to get column index based on column name
function columnIndex(columnName) {
    const columns = ['SerialNo', 'Category', 'Name', 'Make', 'Model', 'ProductID', 'Project', 'Owner', 'Condition'];
    return columns.indexOf(columnName);
}

// Function to attach filter listeners to dropdowns
function attachFilterListeners() {
    const filterIds = [
        'filter-serialNo', 'filter-category', 'filter-name',
        'filter-make', 'filter-model', 'filter-productId', 'filter-condition', 'filter-project', 'filter-owner'
    ];

    filterIds.forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', () => {
            filterTable();
            // Update dropdowns with the current selection
            updateDropdowns();
        });
    });
}

// Function to update dropdowns based on visible rows
function updateDropdowns() {
    const filters = {
        'filter-serialNo': 'SerialNo',
        'filter-category': 'Category',
        'filter-name': 'Name',
        'filter-make': 'Make',
        'filter-model': 'Model',
        'filter-productId': 'ProductID',
        'filter-condition': 'Condition',
        'filter-project': 'Project',
        'filter-owner': 'Owner'
    };

    const visibleRows = Array.from(document.querySelectorAll('#data-table tbody tr'))
        .filter(row => row.style.display !== 'none');

    for (const [filterId, column] of Object.entries(filters)) {
        const select = document.getElementById(filterId);
        const uniqueValues = new Set([select.value]); // Ensure the selected value stays in the dropdown

        visibleRows.forEach(row => {
            const cellValue = row.cells[columnIndex(column)].textContent;
            uniqueValues.add(cellValue);
        });

        select.innerHTML = '';
        uniqueValues.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.text = value;
            select.appendChild(option);
        });

        // Set the dropdown to the previously selected value
        select.value = select.value;
    }
}

// Call the fetchData function when the page loads
window.onload = fetchData;

document.getElementById('syncBtn').addEventListener('click', fetchDataSync);
document.getElementById('asyncBtn').addEventListener('click', fetchDataAsync);
document.getElementById('fetchBtn').addEventListener('click', fetchDataWithFetch);

function fetchDataSync() {
    clearTable();
    let reference = getFileSync('data/reference.json');
    let data1 = getFileSync(`data/${reference.data_location}`);
    let data2 = getFileSync(`data/${data1.data_location}`);
    let data3 = getFileSync('data/data3.json');
    let combinedData = [...data1.data, ...data2.data, ...data3.data];
    displayData(combinedData);
}

function fetchDataAsync() {
    clearTable();
    getFileAsync('data/reference.json', (reference) => {
        getFileAsync(`data/${reference.data_location}`, (data1) => {
            getFileAsync(`data/${data1.data_location}`, (data2) => {
                getFileAsync('data/data3.json', (data3) => {
                    let combinedData = [...data1.data, ...data2.data, ...data3.data];
                    displayData(combinedData);
                });
            });
        });
    });
}

function fetchDataWithFetch() {
    clearTable();
    fetch('data/reference.json')
        .then(response => response.json())
        .then(reference => fetch(`data/${reference.data_location}`))
        .then(response => response.json())
        .then(data1 => fetch(`data/${data1.data_location}`).then(response => response.json())
        .then(data2 => fetch('data/data3.json').then(response => response.json())
        .then(data3 => {
            let combinedData = [...data1.data, ...data2.data, ...data3.data];
            displayData(combinedData);
        })));
}

// Synchronous XMLHttpRequest
function getFileSync(file) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', file, false);
    xhr.send();
    if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
    }
}

// Asynchronous XMLHttpRequest
function getFileAsync(file, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

// Display Data
function displayData(data) {
    let tableBody = document.querySelector('#dataTable tbody');
    data.forEach(person => {
        let nameParts = person.name.split(' ');
        let row = document.createElement('tr');
        let firstNameCell = document.createElement('td');
        let lastNameCell = document.createElement('td');
        let idCell = document.createElement('td');
        firstNameCell.textContent = nameParts[0];
        lastNameCell.textContent = nameParts[1];
        idCell.textContent = person.id;
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(idCell);
        tableBody.appendChild(row);
    });
}

// Clear Table
function clearTable() {
    let tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';
}

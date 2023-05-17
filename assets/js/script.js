const API_KEY = 'HgbcDIkVr5PiSZXhy9CjG7YTiVw';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

document.getElementById('status').addEventListener('click', e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading = `API Key Status`;
    let results = 'Your key is valid until:';
    results += `<br><strong>${data.expiry}</strong>`;

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}

document.getElementById('submit').addEventListener('click', e => postForm(e));

function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }

    form.delete('options');

    form.append('options', optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById('checksform')));

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': API_KEY,
        },
        body: form
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <strong>${data.total_errors}</strong></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <strong>${error.line}</strong>, `;
            results += `column <strong>${error.col}</strong></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}

function displayException(data) {
    let heading = `An Exception Occurred`;
    results = `<div class="exception">The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;


    document.getElementById('resultsModalTitle').innerHTML = heading;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}
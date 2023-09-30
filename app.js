// Constants
const baseUrl = 'https://api.nasa.gov/planetary/apod';
const apiKey = 'pVXWydYBO9ETi6Mtgls5maJW6wFX6x4jeSTp5Oqp';
const currentImageContainer = document.getElementById('current-image-container');
const searchForm = document.getElementById('search-form');
const searchHistory = document.getElementById('search-history');
const submitBtn = document.getElementById('submit');
const showSearchesBtn = document.getElementById('showSearchesBtn');

// function to prevent getting future dates
const dateInput = document.getElementById('search-input');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('max', today);

let storedArray = [];

// function to get current day data
async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    let URL = `${baseUrl}?api_key=${apiKey}&date=${currentDate}`;
    const response = await fetch(URL);
    const result = await response.json();
    addDataOnUI(result);
}
getCurrentImageOfTheDay()


// function to get searched day data
async function getImageOfTheDay(inputDate) {
    if (inputDate > today) return alert("Data for Entered Date Doesn't Exist. Please Enter Date Not More Than Today");
    try {
        let URL = `${baseUrl}?api_key=${apiKey}&date=${inputDate}`;
        const response = await fetch(URL);
        const result = await response.json();
        addDataOnUI(result);
        saveSearch(inputDate);
        addSearchToHistory();
    }
    catch (err) {
        alert('Something Went Wrong');
        window.location.reload();
    }
}

// function to handle form submit event
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getImageOfTheDay(searchForm.dateInput.value);
});

// function to save data to LocalHost
function saveSearch(inputDate) {
    let searchDate = {
        date: inputDate
    }
    storedArray.push(searchDate);
    localStorage.removeItem('searches');
    localStorage.setItem('searches', JSON.stringify(storedArray))
}

// function to add Searched Data to History Section
function addSearchToHistory() {
    const storedData = localStorage.getItem('searches');
    if (storedData) {
        storedArray = JSON.parse(storedData);
    }
    let searchList = '';
    searchList += storedArray ? storedArray
        .map((date) => {
            return `<li onclick="getImageOfTheDay('${date.date}')">${date.date}</li>`;
        })
        .join('')
        : '';
    searchHistory.innerHTML = searchList;
}

addSearchToHistory();

// function to handle show Search History Button event
showSearchesBtn.addEventListener('click', () => {
    if (searchHistory.style.display === 'none') {
        searchHistory.style.display = 'block';
    } else {
        searchHistory.style.display = 'none';
    }
})

// function to add Data On UI
function addDataOnUI(dataObject) {
    if (!dataObject.title) {
        alert('Something Went Wrong ! ');
        window.location.reload();
        return;
    };
    let data = `
        <img src="${dataObject.url}" alt="${dataObject.title}">
            <div class="details">
                <h2>${dataObject.title}</h2>
                <p id="explaination">${dataObject.explanation}</p>
            </div>
    `;
    currentImageContainer.innerHTML = data;
}
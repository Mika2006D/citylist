let currentPage = 0; // Start page is 0
const citiesPerPage = 30; // Number of cities per page
let totalCities = 0; // Total number of cities

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('prev').addEventListener('click', (event) => {
        event.preventDefault();
        changePage(-1);
    });
    document.getElementById('next').addEventListener('click', (event) => {
        event.preventDefault();
        changePage(1);
    });
    fetchTotalCities();
    updateNavigation(); // Initialize navigation visibility
});

async function fetchTotalCities() {
    const url = 'https://demo-backendcities.azurewebsites.net/?cuid=hajIUIksk983LLP11112220&size=1&start=0';
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalCities = data.totalCount || 1000; // Assuming the API provides a totalCount field, default to 1000 if not
        updateNavigation();
    } catch (error) {
        console.error('Error fetching total number of cities:', error);
    }
}

async function fetchCities(page) {
    const start = page * citiesPerPage;
    const url = `https://demo-backendcities.azurewebsites.net/?cuid=hajIUIksk983LLP11112220&size=${citiesPerPage}&start=${start}`;
    try {
        const response = await fetch(url);
        const cities = await response.json();
        displayCities(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

function displayCities(cities) {
    const cityList = document.getElementById('city-list');
    cityList.innerHTML = '';
    if (cities && cities.length > 0) {
        cities.forEach(city => {
            const cityElement = document.createElement('div');
            cityElement.textContent = `${city.name}, ${city.country} (Lon: ${city.coord.lon}, Lat: ${city.coord.lat})`;
            cityList.appendChild(cityElement);
        });
    } else {
        cityList.textContent = 'No cities to display';
    }
}

function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 0 && newPage < getTotalPages()) {
        currentPage = newPage;
        fetchCities(currentPage);
        updateNavigation();
    }
}

function updateNavigation() {
    const prevLink = document.getElementById('prev');
    const nextLink = document.getElementById('next');

    prevLink.style.visibility = currentPage > 0 ? 'visible' : 'hidden'; // Hide 'Vorige' if on the first page
    nextLink.style.visibility = currentPage < getTotalPages() - 1 ? 'visible' : 'hidden'; // Hide 'Volgende' if on the last page
}

function getTotalPages() {
    return Math.ceil(totalCities / citiesPerPage);
}

const cities = ['Paris', 'New York', 'Tokyo', 'Sydney', 'Rome', 'Barcelona', 'Dubai', 'Singapore'];

const places = [
    { name: "Paris", region: "europe" },
    { name: "Rome", region: "europe" },
    { name: "London", region: "europe" },
    { name: "Tokyo", region: "asia" },
    { name: "Dubai", region: "asia" },
    { name: "Bangkok", region: "asia" },
    { name: "New York", region: "america" },
    { name: "Los Angeles", region: "america" },
    { name: "Toronto", region: "america" }
];

const cityImages = {
    "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    "New York": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee",
    "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    "Sydney": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
    "Rome": "https://images.unsplash.com/photo-1529260830199-42c24126f198",
    "Barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded",
    "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd",
    "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
    "Bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365",
    "Los Angeles": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da",
    "Toronto": "https://images.unsplash.com/photo-1517935706615-2717063c2225"
};

function getCityImage(city, size = "400x300") {
    const [width, height] = size.split("x");
    const image = cityImages[city] || cityImages["Paris"];
    return `${image}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

function loadDestinations() {
    const destinationContainer = document.getElementById('destinations');
    if (!destinationContainer) return;

    destinationContainer.innerHTML = "";
    cities.forEach(city => {
        destinationContainer.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${getCityImage(city)}" class="card-img-top" alt="${city}">
                    <div class="card-body">
                        <h5 class="card-title">${city}</h5>
                        <button class="btn btn-primary" onclick="searchCity('${city}')">View Info</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function searchCity(cityName) {
    const searchInput = document.getElementById('searchinput') || document.getElementById('searchInput');
    const city = (cityName || (searchInput ? searchInput.value : "")).trim();

    if (!city) return;

    saveSearch(city);
    fetchWeather(city);
}

function fetchWeather(city) {
    const weatherBox = document.getElementById('weatherBox');
    if (!weatherBox) return;

    weatherBox.innerHTML = `<p>Loading weather for ${city}...</p>`;

    const api = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=cdc818014b2e4b6c6f368d684afb9a95`;
    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            weatherBox.innerHTML = `
                <h3>${data.name}</h3>
                <p>Temperature: ${Math.round(data.main.temp)} &deg;C</p>
                <p>Weather: ${data.weather[0].description}</p>
            `;
        })
        .catch(() => {
            weatherBox.innerHTML = `<p class="text-warning">Sorry, no weather was found for "${city}".</p>`;
        });
}

function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches = searches.filter(item => item.toLowerCase() !== city.toLowerCase());
    searches.unshift(city);
    searches = searches.slice(0, 5);
    localStorage.setItem('searches', JSON.stringify(searches));
    showSearches();
}

function showSearches() {
    const container = document.getElementById("recentSearches");
    if (!container) return;

    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    container.innerHTML = searches.length ? "" : "<p>No recent searches yet.</p>";
    searches.forEach(city => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = city;
        button.addEventListener("click", () => repeatSearch(city));
        container.appendChild(button);
    });
}

function repeatSearch(city) {
    const exploreSearchBox = document.getElementById("searchBox");

    if (exploreSearchBox) {
        exploreSearchBox.value = city;
        filterPlaces();
        return;
    }

    searchCity(city);
}

function loadPlaces(list) {
    const container = document.getElementById("placesContainer");
    if (!container) return;

    container.innerHTML = "";
    list.forEach(place => {
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${getCityImage(place.name)}" class="card-img-top" alt="${place.name}">
                    <div class="card-body">
                        <h5>${place.name}</h5>
                        <p class="text-capitalize">${place.region}</p>
                        <button class="btn btn-success" onclick="viewDetails('${place.name}')">Details</button>
                        <button class="favorite-btn" onclick="saveFavorite('${place.name}')">Save</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterPlaces() {
    const searchBox = document.getElementById("searchBox");
    const regionFilter = document.getElementById("regionFilter");
    const searchText = searchBox ? searchBox.value.trim() : "";
    const text = searchText.toLowerCase();
    const region = regionFilter ? regionFilter.value : "all";

    if (searchText) {
        saveSearch(searchText);
    }

    const filtered = places.filter(place => {
        const matchName = place.name.toLowerCase().includes(text);
        const matchRegion = region === "all" || place.region === region;
        return matchName && matchRegion;
    });

    loadPlaces(filtered);
}

function saveFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(city);
    favorites = [...new Set(favorites)];
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
    alert("Saved to favorites");
}

function viewDetails(city) {
    localStorage.setItem("selectedCity", city);
    window.location.href = "details.html";
}

function handleLogin(event) {
    event.preventDefault();

    const nameInput = document.getElementById("loginName");
    const emailInput = document.getElementById("loginEmail");
    const user = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim()
    };

    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "profile.html";
}

function loadProfile() {
    const profileContainer = document.getElementById("profileContainer");
    if (!profileContainer) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        profileContainer.innerHTML = `
            <p>You are not logged in.</p>
            <a class="btn btn-success" href="login.html">Login</a>
        `;
        return;
    }

    profileContainer.innerHTML = `
        <h3>${user.name}</h3>
        <p>${user.email}</p>
        <button class="btn btn-outline-danger" onclick="logout()">Logout</button>
    `;
}

function logout() {
    localStorage.removeItem("user");
    loadProfile();
}

function loadDetails() {
    const detailsContainer = document.getElementById("detailsContainer");
    if (!detailsContainer) return;

    const city = localStorage.getItem("selectedCity") || "Paris";
    const place = places.find(item => item.name === city) || { name: city, region: "unknown" };
    detailsContainer.innerHTML = `
        <div class="card details-card">
            <img src="${getCityImage(place.name, "900x500")}" class="card-img-top" alt="${place.name}">
            <div class="card-body">
                <h2>${place.name}</h2>
                <p class="text-capitalize">Region: ${place.region}</p>
                <button class="btn btn-success" onclick="saveFavorite('${place.name}')">Save Favorite</button>
            </div>
        </div>
    `;
}

function loadFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    if (!favoritesContainer) return;

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesContainer.innerHTML = favorites.length
        ? favorites.map(city => `<button type="button" onclick="viewDetails('${city}')">${city}</button>`).join("")
        : "<p>No favorites saved yet.</p>";
}
const contactform = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

// contactform.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const formData = new FormData(form);
//     formData.append("access_key", "6bd7f3d2-01d9-4452-9095-27d218272cfb");

//     const originalText = submitBtn.textContent;

//     submitBtn.textContent = "Sending...";
//     submitBtn.disabled = true;

//     try {
//         const response = await fetch("https://api.web3forms.com/submit", {
//             method: "POST",
//             body: formData
//         });

//         const data = await response.json();

//         if (response.ok) {
//             alert("Success! Your message has been sent.");
//             form.reset();
//         } else {
//             alert("Error: " + data.message);
//         }

//     } catch (error) {
//         alert("Something went wrong. Please try again.");
//     } finally {
//         submitBtn.textContent = originalText;
//         submitBtn.disabled = false;
//     }
// });

loadDestinations();
loadPlaces(places);
showSearches();
loadProfile();
loadDetails();
loadFavorites();

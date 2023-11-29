function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const day = "today";
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const todayUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;
            console.log("Today URL:", todayUrl);

            fetch(todayUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("Today's Data:", data);
                    // Display Today's Forecast
                    document.querySelector('#sunrise').innerHTML = data.results.sunrise;
                    document.querySelector('#sunset').innerHTML = data.results.sunset;
                    document.querySelector('#Dawn').innerHTML = data.results.dawn;
                    document.querySelector('#Dusk').innerHTML = data.results.dusk;
                    document.querySelector('#today-day-length').innerHTML = data.results.day_length;
                    document.querySelector('#today-solar-noon').innerHTML = data.results.solar_noon;
                    document.querySelector('#time-zone').innerHTML = data.results.timezone;

                    // Display Current Date
                    const currentDate = new Date();
                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    const formattedDate = currentDate.toLocaleDateString('en-US', options);
                    document.querySelector('#current-date').innerHTML = formattedDate;

                    // Fetch Tomorrow's Forecast
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${tomorrow.toISOString().split('T')[0]}`;
                    console.log("Tomorrow URL:", tomorrowUrl);
                    return fetch(tomorrowUrl);
                })
                .then(response => response.json())
                .then(dataTomorrow => {
                    console.log("Tomorrow's Data:", dataTomorrow);

                    // Display Tomorrow's Forecast
                    if (dataTomorrow.results) {
                        document.querySelector('#tomorrow-sunrise').innerHTML = dataTomorrow.results.sunrise || 'N/A';
                        document.querySelector('#tomorrow-sunset').innerHTML = dataTomorrow.results.sunset || 'N/A';
                        document.querySelector('#tomorrow-Dawn').innerHTML = dataTomorrow.results.dawn || 'N/A';
                        document.querySelector('#tomorrow-Dusk').innerHTML = dataTomorrow.results.dusk || 'N/A';
                        document.querySelector('#tomorrow-day-length').innerHTML = dataTomorrow.results.day_length || 'N/A';
                        document.querySelector('#tomorrow-solar-noon').innerHTML = dataTomorrow.results.solar_noon || 'N/A';
                        document.querySelector('#tomorrow-time-zone').innerHTML = dataTomorrow.results.timezone || 'N/A';
                        const dateElementId = `${day}-date`;
                        const nextDay = new Date();
                        nextDay.setDate(nextDay.getDate() + 1);
                        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                        const formattedDate = nextDay.toLocaleDateString('en-US', options);
                        document.querySelector(`#tomorrow-date`).innerHTML = `${formattedDate}`;
                    } 
                    else {
                        console.error("No results for tomorrow's forecast");
                    }
                })
                .catch(error => console.error('Error:', error));

        }, function () {
            displayError('Error fetching current location.');
        });
    } else {
        displayError('Geolocation is not supported by this browser.');
    }
}
function searchLocation() {
    var locationInput = document.getElementById('location-input').value;

    // Check if the input is empty or contains only spaces
    if (!locationInput.trim()) {
        displayError('Please enter a valid location');
        clearUI(); 
        return;
    }

    // Use geocode API to get latitude and longitude
    const geocodeUrl = `https://geocode.maps.co/search?q=${locationInput}`;

    fetch(geocodeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch geocode data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;
                fetchSunriseSunsetData(latitude, longitude);
            } else {
                clearUI();
                document.getElementById('location-input').value = '';
                throw new Error('Location not found');
            }
        })
        .catch(error => displayError(error.message));
}


// Existing function for fetching sunrise and sunset data
function fetchSunriseSunsetData(latitude, longitude) {
    const todayUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;

    fetch(todayUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Today's Data:", data);

            // Display Today's Forecast
            document.querySelector('#sunrise').innerHTML = data.results.sunrise || 'N/A';
            document.querySelector('#sunset').innerHTML = data.results.sunset || 'N/A';
            document.querySelector('#Dawn').innerHTML = data.results.dawn || 'N/A';
            document.querySelector('#Dusk').innerHTML = data.results.dusk || 'N/A';
            document.querySelector('#today-day-length').innerHTML = data.results.day_length || 'N/A';
            document.querySelector('#today-solar-noon').innerHTML = data.results.solar_noon || 'N/A';
            document.querySelector('#time-zone').innerHTML = data.results.timezone || 'N/A';

            // Display Current Date
            const currentDate = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);
            document.querySelector('#current-date').innerHTML = formattedDate;

            // Fetch Tomorrow's Forecast
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${tomorrow.toISOString().split('T')[0]}`;

            return fetch(tomorrowUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tomorrow's data: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(dataTomorrow => {
            console.log("Tomorrow's Data:", dataTomorrow);

            // Display Tomorrow's Forecast
            if (dataTomorrow.results) {
                document.querySelector('#tomorrow-sunrise').innerHTML = dataTomorrow.results.sunrise || 'N/A';
                document.querySelector('#tomorrow-sunset').innerHTML = dataTomorrow.results.sunset || 'N/A';
                document.querySelector('#tomorrow-Dawn').innerHTML = dataTomorrow.results.dawn || 'N/A';
                document.querySelector('#tomorrow-Dusk').innerHTML = dataTomorrow.results.dusk || 'N/A';
                document.querySelector('#tomorrow-day-length').innerHTML = dataTomorrow.results.day_length || 'N/A';
                document.querySelector('#tomorrow-solar-noon').innerHTML = dataTomorrow.results.solar_noon || 'N/A';
                document.querySelector('#tomorrow-time-zone').innerHTML = dataTomorrow.results.timezone || 'N/A';

                const dateElementId = 'tomorrow-date'; // Corrected from `${day}-date`
                const nextDay = new Date();
                nextDay.setDate(nextDay.getDate() + 1);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = nextDay.toLocaleDateString('en-US', options);
                document.querySelector(`#${dateElementId}`).innerHTML = `${formattedDate}`;
            } else {
                console.error("No results for tomorrow's forecast");
            }
        })
        .catch(error => console.error('Error:', error));
}
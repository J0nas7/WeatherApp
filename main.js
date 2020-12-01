const theCity = localStorage.getItem('weatherCity');
const theCityCode = localStorage.getItem('weatherCityCode');
let module;
if (theCity == null || theCity.length == 0) {
    module = "city-page";
} else {
    module = "weather-report";
}

document.getElementById(module).style.display = "block";
document.getElementsByTagName("body")[0].classList.add(module);

var chooseCity = document.getElementById("choose-city");

if (module == "city-page") {
    chooseCity.focus();
}
chooseCity.addEventListener("keydown", function(e) {
    if (e.code == "Enter") {
        const city = chooseCity.value;
        const accuCityAPI = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=&q="+city+"&language=da-dk&details=false";
        let locationKey = null;
        
        fetch(accuCityAPI)
        .then((response) => response.json())
        .then((data)=>{
            locationKey = data[0].Key;

            if (locationKey > 0) {
                localStorage.setItem('weatherCity', city);
                localStorage.setItem('weatherCityCode', locationKey);
                location.reload();
            } else {
                alert("City could not be found in the database. Try to check for spelling mistakes.")
            }
        })
        .catch((e)=>{
            console.log("ERR: "+e.message);
        });
    }
});

if (module == "weather-report") {
    const accuWeatherAPI = "http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/"+theCityCode+"?apikey=&language=da-dk&details=false&metric=false";
    let weatherReport;

    fetch(accuWeatherAPI)
    .then((response) => response.json())
    .then((data)=>{
        weatherReport = data[0];
        console.log(weatherReport);
        
        const weatherIcon = weatherReport.WeatherIcon;
        const weatherPhrase = weatherReport.IconPhrase;
        const daylight = weatherReport.IsDaylight;
        const temp = weatherReport.Temperature;
        const temperature = Math.floor((temp.Value-30)/2);

        document.getElementById("weather-icon").style.backgroundImage = "url('https://developer.accuweather.com/sites/default/files/"+weatherIcon+"-s.png')";
        document.getElementsByTagName("body")[0].classList.add(daylight ? "light-on" : "light-off");
        document.getElementById("weather-area").innerHTML = theCity;
        document.getElementById("weather-phrase").innerHTML = weatherPhrase;
        document.getElementById("weather-degrees").innerHTML = temperature+" &#176;C";
    })
    .catch((e)=>{
        console.log("ERR: "+e.message);
    });
}
const hour = document.getElementById('hour');
const minute = document.getElementById('minute');
const seconds = document.getElementById('seconds');

const clock = setInterval(
    function time() {
        let dateToday = new Date();
        //console.log(dateToday);

        let hr = dateToday.getHours();
        let min = dateToday.getMinutes();
        let sec = dateToday.getSeconds();

        //console.log(hr, min, sec)
        if(hr<10){
            hr = '0' + hr;
        }
        if(min<10){
            //min = '0' + min;
            min = min;
        }
        if(sec<10){
            sec = '0' + sec;
        }

        //12 hour clock format conversion
        let ampm = hr >=12 ? 'pm' : 'am';
        hr = hr % 12;
        hr = hr ? hr : 12;
        min = min < 10 ? '0' + min : min;
        
        hour.textContent = hr;
        minute.textContent = min;
        seconds.textContent = sec;
}, 1000)

let weather = {
    "apiKey": "4ed53ec99fdb4fb3c80ba66f81ff2006",
    fetchWeather: function(city){
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&appid=" 
            + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data){
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        //console.log(name, icon, description, temp, humidity, speed);

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + "km/h";
        document.querySelector(".weather").classList.remove("loading");
    },
    search: function(){
        this.fetchWeather(document.querySelector(".search-bar").value);
    }//Automatically get the content of the search bar and get the results.
};
//Search button Listener
document.querySelector(".search button").addEventListener("click", function(){
    weather.search();
})
//Enter Key Event Listener
document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        weather.search();
    }
})
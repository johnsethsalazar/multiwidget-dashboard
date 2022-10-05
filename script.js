//Clock widget
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

//Weather widget
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
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name +"')";
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

//To-do Widget
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

let LIST, id;

//get item from local storage
let data = localStorage.getItem("TODO");

//Check if data is not empty
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;//sets the id to the last one in the list
    loadList(LIST);//loads the list to the user interface
}else{
    //if data isn't empty (when it is the 1st time the user used the app)
    LIST = [];
    id = 0;
}

//load items to the user's interface
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

//Clearing the localStorage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});

//Show Today's date
const today = new Date();
const options = {weekday: "long", month: "short", day: "numeric"};
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

function addToDo(toDo, id, done, trash){
    
    if(trash){
        return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `
    <li class="item">
    <i class="fa fa-check-circle co" job="complete" id="${id}"></i>
    <p class="text ${LINE}">${toDo}</p>
    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
    </li>
                `;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}

//Add item to the list when user press the Enter key
document.addEventListener("keyup", function(even){
    if(event.keyCode == 13){
        const toDo = input.value;
        //if the input isn't empty
        if(toDo){
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });
            //add item to local storage (This code must be added where the LIST array is updated)
            localStorage.setItem("TODO", JSON.stringify(LIST));

            id++;
        }
        input.value="";
    }
});

//complete to-do function
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//remove to-do function
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

//Event listener to target the items that are created dynamically
list.addEventListener("click", function(event){
    const element = event.target;// will return the clicked element inside the list
    const elementJob = element.attributes.job.value; 
    
    //checks if the element job has been completed or deleted
    if(elementJob == "complete"){
        completeToDo(element);
    }
    else if(elementJob == "delete"){
        removeToDo(element);
    }
    //add item to local storage (This code must be added where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});
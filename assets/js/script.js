
var contentEl = $('#weatherCard');
var searchButtonEl = $('#search-button');
var citySearchEl = $('#city-search');
var previousSearchEl = $('#previous-searches');
var fivedayContainer = $('#fivedayContainer');
var fivedayTextEl = $('#five-day-text');
var weatherSearchEl = $('#weather-search');

var citiesSearched = JSON.parse(window.localStorage.getItem("myCities")) || [];

var weatherKey = `bcb95194fe4553296aaea47702511125`

var timeNow = moment().format('[(]MM[/]DD[/]YYYY[)]');


function getWeather(cityName){


    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherKey}`;


        fetch(requestURL)
        .then(function (response){
        return response.json();
        })
        .then(function (data){
            var iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            
            var cityName = $('<h1>');
            var currentTemperature = $('<h4>');
            var humidityLevel = $('<h4>');
            var weatherIcon = $('<img>');
            
            weatherIcon.attr('src', iconURL);
            

            cityName.text(`${data.name} ${timeNow}`);
            currentTemperature.text(`Temp: ${data.main.temp.toPrecision(2)}\u00B0F`);
            humidityLevel.text(`Humidity: ${data.main.humidity} %`);

            cityName.append(weatherIcon);

            contentEl.append(cityName);
            contentEl.append(currentTemperature);    
            contentEl.append(humidityLevel);
            });
}

function getFiveDay(cityName){

    var fivedayRequestURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${weatherKey}`;
    fetch(fivedayRequestURL)
    .then(function (response){
        return response.json();
    })
    .then(function (data){

        var weatherLists = data.list;

        var fiveDayArray = [];

        for(var i = 0; i < weatherLists.length; i++){
    
            if(i % 8 == 0){
                fiveDayArray.push(weatherLists[i]);
            }
        }


        //this for each loop will dynamically creates the five day forecast cards.
        fiveDayArray.forEach(function(element){

            var theDate = element.dt_txt;
            theDate = theDate.substring(0, 10);
            theDate = theDate.split("-");
            var properDate = formatDate(theDate);

            var newCardContainerEl = $('<div>');
            newCardContainerEl.addClass('col s12 m5 l2');
            var newCardEl = $('<div>');
            newCardEl.addClass('card blue-grey darken-2');
            var newCardContentEl = $('<div>');
            newCardContentEl.addClass('card-content white-text');
            newCardSpanEl = $('<span>');
            newCardSpanEl.text(properDate);
            newCardSpanEl.addClass('card-title');
            newCardSpanEl.text(properDate);
            newCardPEl1 = $('<p>');
            newCardPEl1.text(`Temp: ${element.main.temp.toPrecision(2)}\u00B0F`);
            newCardPEl2 = $('<p>');
            newCardPEl2.text(`Wind: ${element.wind.speed} MPH`);
            newCardPEl3 = $('<p>');
            newCardPEl3.text(`Humidity: ${element.main.humidity} %`);

            var iconURL = `http://openweathermap.org/img/wn/${element.weather[0].icon}.png`;
            var weatherIcon = $('<img>');           
            weatherIcon.attr('src', iconURL);


            fivedayContainer.append((newCardContainerEl).append((newCardEl).append(newCardContentEl.append(newCardSpanEl, weatherIcon, newCardPEl1, newCardPEl2, newCardPEl3))));


        })
    })
}

function formatDate(dateArray){
    var formatArray = [];
    formatArray[0] = dateArray[1];
    formatArray[1] = dateArray[2];
    formatArray[2] = dateArray[0];

    var stringDate = formatArray.join('/');

    return stringDate;

}

function createPrevCitySearch(newCity){

    var newItem = $('<li>');
    var newItemBtn = $('<button>')
    newItemBtn.text(newCity);
    newItemBtn.addClass('waves-effect waves-light btn-large grey darken-2');
    newItemBtn.attr('id','prevCity')
    newItem.append(newItemBtn);
    previousSearchEl.append(newItem);

}

function handleSearch(){

    var cityName = citySearchEl.val();
    var newCity = cityName;

    if(!citiesSearched.includes(cityName)){
    createPrevCitySearch(newCity);
    citiesSearched.push(newCity);
    window.localStorage.setItem("myCities", JSON.stringify(citiesSearched));
    }

    cityName = cityName.split(' ').join('+');

    fivedayTextEl.removeClass('hide');
    contentEl.empty();
    fivedayContainer.empty();
    getWeather(cityName);
    getFiveDay(cityName);

}

function prevCitySearch(event){

    fivedayTextEl.removeClass('hide');
    contentEl.empty();
    fivedayContainer.empty();
    getWeather($(this).text());
    getFiveDay($(this).text());
}

function showPrevSearches(){

    if(citiesSearched.length > 0){

        for(var i = 0; i < citiesSearched.length; i++){
            createPrevCitySearch(citiesSearched[i]);
        }

    }

}

searchButtonEl.on('click', handleSearch);
weatherSearchEl.on('submit', handleSearch);

previousSearchEl.on('click', '#prevCity', prevCitySearch);

$('Document').ready(showPrevSearches());
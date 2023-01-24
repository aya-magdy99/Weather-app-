let apiKey = `fafece6730fe406d84212124210405`;
let baseUrl = `http://api.weatherapi.com/v1`;
let mainDay = document.querySelector('.day');
let mainDate = document.querySelector('.date');
let city = document.querySelector('.city-name');
let mainTemp = document.querySelector('.temp-update');
let mainIcon = document.querySelector('.time-icon img');
let mainState = document.querySelector('.state p');
let hum = document.querySelector('.hum-update');
let cloud = document.querySelector('.cloud-update');
let wind = document.querySelector('.wind-update');
let highTemp = document.querySelectorAll('.high-temp span');
let forecastDay = document.querySelectorAll('.forecast-day');
let lowTemp = document.querySelectorAll('.low-temp span');
let forecastIcon = document.querySelectorAll('.forecast-icon img');
let forecastState = document.querySelectorAll('.forecast-state p');
let search = document.querySelector('#search');
let starBtn = document.querySelector('.star-btn');
let starP = document.querySelector('.star');
let flag = document.querySelector('.flag');
let starBtnI = document.querySelector('.star-btn i');
let bulb = document.querySelector('.fixed-bulb');
let bulbI = document.querySelector('.fixed-bulb i');
let dayNum = 0;
let errorFetch = document.querySelector('.error');
///////////////////////////////// var end

search.addEventListener('keyup', () => {
    starBtnI.style.color = 'rgba(58, 58, 60, 0.527)';
    starBtnI.style.fontSize = '22px';
    //maain function call
    let searchValue = search.value;
    if (searchValue.length > 2) //after two letters to minimize errors
    {

        let str = searchValue.split(' ').join('_');
        mainFunc(str);

    }



});











async function mainFunc(missing) {

    let res = await fetch(`${baseUrl}/forecast.json?key=${apiKey}&q=${missing}&days=7`);
    let dataRes = await res.json();



    if (dataRes.hasOwnProperty('error') == true) {

        // alert('error');
        danger();
    } else {
        errorFetch.classList.add('error');
        search.classList.add('good');
        search.classList.remove('bad');
        display(dataRes);
        getFlag(dataRes.location.country);
    }


    ///////////////////////////////////////////// local storage
    starBtn.addEventListener('click', () => {

        localStorage.setItem('starred', dataRes.location.name);
        localStorage.setItem('country', dataRes.location.country);
        starBtnI.style.color = 'var(--main)';
        starBtnI.style.fontSize = '23px';
        starP.innerHTML = `<i class="fas fa-map-marker-alt px-1"></i>  ${dataRes.location.name}`;

    })
};


async function defaultFunc() {

    //displays stored data if avalible
    if (localStorage.getItem('starred') != null) {

        mainFunc(localStorage.getItem('starred'));
        starP.innerHTML = `<i class="fas fa-map-marker-alt px-1"></i>  ${localStorage.getItem('starred')}`;
    }
    //displays paris data if there's no stored data
    else {
        mainFunc('paris');

    }



};


function display(dataRes) {


    city.innerText = dataRes.location.name;
    mainState.innerText = dataRes.current.condition.text;
    mainTemp.innerText = dataRes.current.temp_c;
    hum.innerText = dataRes.current.humidity;
    cloud.innerText = dataRes.current.cloud;
    wind.innerText = dataRes.current.wind_kph;
    mainIcon.src = `http:${dataRes.current.condition.icon}`;

    //other day
    let forecastDays = dataRes.forecast.forecastday;
    for (let i = 1; i < forecastDays.length; i++) {
        highTemp[i - 1].innerText = forecastDays[i].day.maxtemp_c;
        lowTemp[i - 1].innerText = forecastDays[i].day.mintemp_c;
        forecastState[i - 1].innerText = forecastDays[i].day.condition.text;

        forecastIcon[i - 1].src = `http:${forecastDays[i].day.condition.icon}`;
    }

    mydate(dataRes);
}

function mydate(dataRes) {
    var date = new Date();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    var localTime = dataRes.location.localtime;
    //to ensure date
    let localDay = parseInt(localTime.slice(8, 10));



    if (date.getDate() == localDay) {

        dayNum = date.getDay();

        mainDay.innerText = days[dayNum];

    } else if (date.getDate() > localDay) {
        dayNum = date.getDay() - 1;
        if (dayNum < 0) {
            dayNum = 6;
            mainDay.innerText = days[dayNum];
        } else {
            mainDay.innerText = days[dayNum];
        }

    } else if (date.getDate() < localDay) {
        dayNum = date.getDay() + 1;

        if (dayNum > 6) {
            dayNum = 0;
            mainDay.innerText = days[dayNum];
        } else {
            mainDay.innerText = days[dayNum];
        }
    }
    mainDate.innerText = `${months[date.getMonth()]} ${localDay}`



    if (dayNum < 5) {
        for (let i = 0; i < forecastDay.length; i++) {
            forecastDay[i].innerText = days[dayNum + i + 1];
        }


    } else if (dayNum == 5) {
        forecastDay[0].innerText = days[dayNum + 1];
        forecastDay[1].innerText = days[0];
    } else if (dayNum == 6) {
        for (let i = 0; i < forecastDay.length; i++) {
            forecastDay[i].innerText = days[i];
        }
    }
}

async function getFlag(countryName) {


    if (countryName == 'United States of America') {
        flag.src = `https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg`;
    } else {
        let res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        let dataFlag = await res.json();

        for (let i = 0; i < dataFlag.data.length; i++) {
            if (dataFlag.data[i].name == countryName) {
                flag.src = dataFlag.data[i].flag;

            }
        }
    }
};




function danger() {

    search.classList.add('bad');
    errorFetch.innerText = `${search.value} is not a city name`;
    errorFetch.classList.remove('error');
    search.classList.remove('good');
}


bulb.addEventListener('click', (e) => {

    if (e.target.classList[0] == 'far') {
        bulb.innerHTML = `<i class="fas fa-lightbulb on">`;


        document.body.style.setProperty('--text', 'rgb(26,25,26)');
        document.body.style.setProperty('--body', '#f2f2f7');
        document.body.style.setProperty('--date', '#A6A6A6');
        document.body.style.setProperty('--bg', ' rgba(255, 255, 255, 0.319)');
        document.body.style.setProperty('--item', ' rgb(238,238,238)');


    } else {
        bulb.innerHTML = `<i class="far fa-lightbulb off">`;
        document.body.style.setProperty('--text', '#fff');
        document.body.style.setProperty('--body', 'rgb(26,25,26)');
        document.body.style.setProperty('--date', 'rgb(58,58,60)');
        document.body.style.setProperty('--item', 'rgb(44,44,46)');
        document.body.style.setProperty('--bg', 'rgba(26, 25, 26, 0.719)');

    }
});

defaultFunc();
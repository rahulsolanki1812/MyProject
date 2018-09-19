var calendar = {
    weekdays : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    birthday : [{"month":"January","birthday":[{"date":31,"person":"Sagar Mishra"}]},{"month":"February","birthday":[]},{"month":"March","birthday":[]},{"month":"April","birthday":[]},{"month":"May","birthday":[]},{"month":"June","birthday":[{"date":6,"person":"ashwin"}]},{"month":"July","birthday":[]},{"month":"August","birthday":[{"date":21,"person":"Rahul"},{"date":21,"person":"Tarun"}]},{"month":"September","birthday":[{"date":15,"person":"shivam"}]},{"month":"October","birthday":[{"date":18,"person":"Piyush"}]},{"month":"November","birthday":[]},{"month":"December","birthday":[]}]
};

var _firstSelectedDate = null;

function dateSelector(lastSelectedDate) {
    if (_firstSelectedDate === null) {
        _firstSelectedDate = lastSelectedDate;
        var intermediateDate = document.querySelector('li[onclick="dateSelector('+ lastSelectedDate +')"]');
        intermediateDate.setAttribute('class','selected');
    }
    else {
        var myBtn = document.getElementById('myBtn');
        var modalContent = [];

        if (_firstSelectedDate < lastSelectedDate) {
            for (var i = _firstSelectedDate; i <= lastSelectedDate; i++) {
                var intermediateDate = document.querySelector('li[onclick="dateSelector('+ i +')"]');
                intermediateDate.setAttribute('class','selected');
                modalContent.push(intermediateDate.firstChild.nodeValue);
            }
        } else {
            for (var i = lastSelectedDate; i <= _firstSelectedDate; i++) {
                var intermediateDate = document.querySelector('li[onclick="dateSelector('+ i +')"]');
                intermediateDate.setAttribute('class','selected');
                modalContent.push(intermediateDate.firstChild.nodeValue);
            }
        }
        myBtn.click();
        _firstSelectedDate = null;
        document.getElementById('selected-content').innerHTML = modalContent.join(", ");
    }
}


function onChangeYear() {
    var month = document.getElementById('month-name').innerHTML;
    var year = document.getElementById('year').value;
    createCalendar(new Date(year, (calendar.months.indexOf(month) + 1), 0 ));
}


function onModalClose() {
    var message = document.querySelector('input[type="text"]').value;
    var indexes = (document.getElementById('selected-content').innerHTML).split(', ');
    var selectedDates = (document.querySelector('li[onclick="dateSelector('+ indexes[0] +')"]'));
    selectedDates.lastChild.innerHTML = message;
    for (var i = 0; i < indexes.length; i++) {
        selectedDates = (document.querySelector('li[onclick="dateSelector('+ indexes[i] +')"]'));
        selectedDates.removeAttribute('class');

        if (message != "") {
            selectedDates.lastChild.setAttribute('class','event-box');
            selectedDates.lastChild.setAttribute('title',message);
        }
    }
};

//Generate previous month data (when clicked on previous button on jumbotron)
function getPreviousMonth() {
    var month = document.getElementById('month-name').innerHTML;
    var year = document.getElementById('year').value;
    createCalendar(new Date(year, calendar.months.indexOf(month), 0 ));
}

//Generate next month data (when clicked on next button on jumbotron)
function getNextMonth() {
    var month = document.getElementById('month-name').innerHTML;
    var year = document.getElementById('year').value;
    createCalendar(new Date(year, (calendar.months.indexOf(month) + 2), 0 ));
}

//get previous month disabled weekdays
function previousMonthDates(date) {
    var lastMonthDate = new Date(date.getFullYear(), date.getMonth(), 0);
    return lastMonthDate.getDate() - lastMonthDate.getDay();
}

//Get last date of given date object
function getMonthLastDate(currentMonth) {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
}

function createCalendar(receivedDate) {
    var today = new Date();

    if (receivedDate === undefined) {
        receivedDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    var monthStartDate = new Date(receivedDate.setDate(1));
    var lastMonthDates = previousMonthDates(monthStartDate);
    var dateContainer = document.querySelector('.dates');
    var endingDate = getMonthLastDate(receivedDate);
    var currentMonthDates = (monthStartDate.getDay() + endingDate);
    dateContainer.innerHTML = "";

    // Print calender according to day on 1st of month
    for(var i = 0; i < currentMonthDates; i++ ) {
        if( i < monthStartDate.getDay()) {
            dateContainer.innerHTML += "<li class='disabled'>" + lastMonthDates + "</li>";
            lastMonthDates++;
        } else {
            dateContainer.innerHTML += "<li onclick='dateSelector(" + monthStartDate.getDate() + ")'>" + monthStartDate.getDate() + "<div></div></li>";
            if(i == currentMonthDates-1) {
                var currentMonthDates = (6 - monthStartDate.getDay());
                for( var j = 1; j <= currentMonthDates; j++) {
                    dateContainer.innerHTML += "<li class='disabled'>"+ j +"</li>";
                }
                monthStartDate.setDate(monthStartDate.getDate() - 1);
            }

            monthStartDate.setDate(monthStartDate.getDate()+1);
        }
    }

    // Show Current Date In Calendar - Checks current year, month with current calendar month & year then changes it.
    if( (today.getFullYear() == monthStartDate.getFullYear()) && (today.getMonth() == monthStartDate.getMonth()) ) {
        var todaysDate = document.querySelector('li[onclick="dateSelector(' + today.getDate() + ')"]');
        todaysDate.setAttribute('class', 'current');
    }

    // By changing calendar month/year update jumbotron with changed month/year
    document.getElementById('month-name').innerHTML = calendar.months[monthStartDate.getMonth()];
    document.getElementById('month-name').setAttribute('onchange','getNextMonth()');

    document.getElementById('year').value = monthStartDate.getFullYear();
    document.getElementById('year').setAttribute('onchange','onChangeYear()');
}

function generateDaysAndYear() {
    var days = document.querySelector('.days');
    for(var i = 0; i < 7; i++ ) {
        days.innerHTML += "<li>" + calendar.weekdays[i] + "</li>";
    }

    var years = document.getElementById('year');
    for(var i = 1996; i < 2025; i++) {
        years.innerHTML += "<option>" + i + "</option>";
    }
}

var initilize = function () {
    generateDaysAndYear();
    createCalendar();
};

initilize();

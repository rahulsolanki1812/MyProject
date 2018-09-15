var calendar = {
    weekdays : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

}


function getPreviousMonthData() {
    var month = document.getElementById('month-name').innerHTML;
    var year = document.getElementById('year').innerHTML;
    createCalendar(new Date(year, calendar.months.indexOf(month), 0 ));
}

function getNextMonthData() {
    var month = document.getElementById('month-name').innerHTML;
    var year = document.getElementById('year').innerHTML;
    console.log(calendar.months.indexOf(month) + 1);
    createCalendar(new Date(year, (calendar.months.indexOf(month)+2), 0 ));
}

//Create calendar will create date and year passed in it.
function createCalendar(subDate) {
    var superDate = new Date();
    if (subDate === undefined) {
        var subDate = new Date(superDate.getFullYear(), superDate.getMonth()+1, 0);
    }
    var days = document.querySelector('.days');
    days.innerHTML = "";
    let counter = 1;
    for(let i = 0; i < 7; i++ ) {
        var li = document.createElement('li');
        li.append(document.createTextNode(calendar.weekdays[i]));
        days.append(li);
    }

    var noOfDays = subDate.getDate();
    var ulDays = document.querySelector('.dates');
    ulDays.innerHTML = "";
    subDate = new Date(subDate.getFullYear(),subDate.getMonth(),1);
    for(let i = 0; i < (subDate.getDay() + noOfDays); i++ ) {
        let id = "id" + i;

        var li = document.createElement('li');
        li.setAttribute('id',id);
        ulDays.append(li);
        if( i < subDate.getDay()) {
            document.getElementById(id).innerHTML = "";
            document.getElementById(id).style.border = "0";
            document.getElementById(id).style.backgroundColor = "#ffffff";
        }
        else {
            document.getElementById(id).innerHTML = counter;
            counter++;
        }
    }

    // Show Current Date In Calendar - Checks current year, month with current calendar month & year then changes it.
    if( (superDate.getFullYear() == subDate.getFullYear()) && (superDate.getMonth() == subDate.getMonth()) ) {
        let id = "id" + (superDate.getDate() - 1 + subDate.getDay());
        (document.getElementById(id)).setAttribute('id','current');
    }

    document.getElementById('month-name').innerHTML = calendar.months[subDate.getMonth()];
    document.getElementById('year').innerHTML = ""+subDate.getFullYear();
}
createCalendar();

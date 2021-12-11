//const {dialog} = require('electron').remote;

let run = true;
let timeDiv = document.getElementById('time');
let typeDiv = document.getElementById('type');
let addedTime = 0;
let addedDiv = document.getElementById('addedTime');
const { clipboard } = require('electron')

function saveTime(time, type) {

    //console.log(time, type);
    //console.log("LiveTime: " + liveTime);
    //console.log("AppTime: " + appTime);
    timeDiv.innerHTML = time;
    typeDiv.innerHTML = type;
    //showDisplay(time);

    //updateBar(time, type);

    saveLiveTime(time);
    saveAppTime(time.toString());

    if (type == "FINAL") {
        saveFirebase(time);
        clipboard.writeText(time.toString());
    } else {
    }
};

function addTime() {
    addedTime = addedTime + 3;
    addedDiv.innerHTML = addedTime;

    if (type == 'FINAL') {
        saveFirebase(Number.parseFloat(time) + addedTime.toString());
        timeDiv.innerHTML = (Number.parseFloat(time) + addedTime).toString();
    }
}

function reduceTime() {
    addedTime = addedTime - 3;
    if (addedTime < 0) { addedTime = 0; }
    addedDiv.innerHTML = addedTime.toString();
}

function resetAddedTime() {
    console.log('reset added time');
    addedTime = 0;
    addedDiv.innerHTML = addedTime.toString();
}


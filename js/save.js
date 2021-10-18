//const {dialog} = require('electron').remote;

let run = true;
let timeDiv = document.getElementById('time');
let typeDiv = document.getElementById('type');

function saveTime(time, type) {

    console.log(time, type);
    //console.log("LiveTime: " + liveTime);
    //console.log("AppTime: " + appTime);
    timeDiv.innerHTML = time;
    typeDiv.innerHTML = type;
    //showDisplay(time);

    //updateBar(time, type);
    if (type == "final") {
        saveLiveTime(time);
        saveAppTime(time.toString());
        saveFirebase(time);
    } else if (type == 'running' || type == 'countdown') {
        saveLiveTime(time);
        saveAppTime(time.toString());
    }

};
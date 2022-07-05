// TODO: Replace the following with your app's Firebase project configuration

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
    apiKey: "AIzaSyBFhMU1VwH3l1Hf4yGoQE6Qm3SEY9fIO0Y",
    authDomain: "ecuestredigital.firebaseapp.com",
    databaseURL: "https://ecuestredigital.firebaseio.com",
    projectId: "ecuestredigital",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

var concursosDropDown = document.getElementById('concursos');
//var colRef = db.collection(pais);

var coleccionConcursos = db.collection('concursos')
    .where("id", 'in', ['us_449', 'us_450']).orderBy('inicio')
var timeAllowed;
var idPrueba;
var idConcurso;
var channel;
var vista = "enPista";


function getShows() {
    var selectShows = document.getElementById("shows");
    coleccionConcursos.get().then(
        function (querySnapshot) {
            var shows = [];
            querySnapshot.forEach(function (doc) {
                shows.push(doc.data()['nombre']);
                var el = document.createElement("option");
                el.textContent = doc.data()['nombre'];
                el.value = doc.id;
                selectShows.appendChild(el);
            });
            console.log("Current Shows: " + shows.join(", "));
        }
    );
}

function getClasses(showId) {
    var selectCompetitions = document.getElementById("pruebas");
    db.collection('concursos/' + idConcurso + '/pruebas').get().then(
        function (querySnapshot) {
            var competitions = [];
            querySnapshot.forEach(function (doc) {
                competitions.push(doc.data()['numero'] + ' - ' + doc.data()['nombre']);
                var el = document.createElement("option");
                el.textContent = doc.data()['numero'] + ' - ' + doc.data()['nombre'];
                el.value = doc.id;
                selectCompetitions.appendChild(el);
            });
            console.log("Current Classes: " + competitions.join(", "));
            document.getElementById("pruebas").disabled = false;
        }
    );
}

function setShow(showId) {
    console.log("Show has been selected: " + showId);
    console.log("Display available classes");
    //document.getElementById("channel").disabled = false;
    idConcurso = showId;
    channel = '1';
    getClasses(showId);
}

function setCompetition(classId) {
    console.log("Class has been selected: " + classId);
    console.log("Display available classes");
    idPrueba = classId;
    console.log("Fijar prueba activa");
    db.collection('concursos').doc(idConcurso).collection("channels").doc(channel).set({
        prueba: idPrueba
    }, { merge: true })
        .then(function () {
            console.log("Document successfully written!");
            //document.getElementById("opcionesVistas").style.display = 'block';
            getTA();
        })
        .catch(function (error) {
            console.error("Error writing channels document: ", error);
        });

}


function setGraphics() {
    vista = document.querySelector('input[name="group2"]:checked').value;
    console.log("Vista " + vista);
    db.collection('concursos').doc(idConcurso).collection("channels").doc(channel).set({
        view: vista
    }, { merge: true })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

function saveFirebase(time) {
    //console.log("Concurso: " + idConcurso);
    //console.log("Prueba: " + idPrueba);
    time = Number.parseFloat(time).toFixed(2).toString();

    db.collection('concursos/' + idConcurso + '/pruebas/').doc(idPrueba).set({
        tiempoFinal: time
    }, { merge: true })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

function saveLiveTime(time) {
    db.collection('concursos').doc(idConcurso).collection('channels').doc(channel).set({
        liveTime: time
    }, { merge: true }).then(function () {
        //console.log("Document successfully written!");
    })
        .catch(function (error) {
            console.error("Error writing live time: ", error);
        });
}

function saveAppTime(time) {
    db.collection('concursos').doc(idConcurso).collection('pruebas').doc(idPrueba).set({
        liveTime: time
    }, { merge: true }).then(function () {
        //console.log("Document successfully written!");
    })
        .catch(function (error) {
            console.error("Error writing app time: ", error);
        });
}

getShows();


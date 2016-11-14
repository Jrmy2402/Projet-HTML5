var video = document.querySelector("video");
var photo = new Audio('photo.mp3');
var poubelle = new Audio('poubelle.mp3');
var save = new Audio('save.mp3');
var canvas = document.getElementById('myCanvas');
var text = document.getElementById('text');

//debugger
canvas.width = 640;
canvas.height = 480;
var widthstandard = 640;
var heightstandard = 480;
var ctx = canvas.getContext('2d');
var myStream = null;
var refreshIntervalId = null;
var image = null;
var position = null;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({
        video: true
    }, handleVideo, videoError);
} else {
    alert('Sorry, the browser you are using doesn\'t support getUserMedia');
}

function handleVideo(localMediaStream) {
    video.src = window.URL.createObjectURL(localMediaStream);
    myStream = localMediaStream;
    refreshIntervalId = window.setInterval(canvasPlayer, 20);
}

function videoError(e) {
    console.log("Erreur :", e);
}

function ShootPhoto() {
    video.pause();
    changetext();
    photo.play();
    geoloc();
}

function ResetPhoto() {
    video.play();
    poubelle.play();
    text.innerHTML = "Cliquez sur shoot pour prendre une photo";
}

document.getElementById('save').addEventListener('click', function () {
    if (!video.paused) {
        changetext();
        geoloc();
    }
    video.pause();
    canvasPlayer();
    downloadCanvas(this, 'myCanvas', 'image.png');
    save.play();

}, false);

function downloadCanvas(link, canvasId, filename) {
    var url = document.getElementById(canvasId).toDataURL();
    window.addEventListener('focus', window_focus, false);

    function window_focus() {
        window.removeEventListener('focus', window_focus, false);
        URL.revokeObjectURL(url);
        document.getElementById('save').href = null;
    }
    link.href = url;
    link.download = filename;
}

var rapportwidth;
function canvasPlayer() {
    if (myStream) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        rapportwidth = (canvas.width/widthstandard);
        if (video.paused || video.ended) return;
        
        ctx.beginPath();
        ctx.arc(320*rapportwidth, 245, 45*rapportwidth, 0, Math.PI * 2, true);
        ctx.strokeStyle = "RED";
        ctx.stroke();

        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.strokeStyle = "RED";
        ctx.lineWidth = 2;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.beginPath();
        ctx.moveTo(275*rapportwidth, 245);
        ctx.lineTo((275*rapportwidth)-(45*rapportwidth), 245);
        ctx.stroke();

        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.strokeStyle = "RED";
        ctx.lineWidth = 2;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.beginPath();
        ctx.moveTo(365*rapportwidth, 245);
        ctx.lineTo((365*rapportwidth)+(45*rapportwidth), 245);
        ctx.stroke();

        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.strokeStyle = "RED";
        ctx.lineWidth = 2;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.beginPath();
        ctx.moveTo(320*rapportwidth, 245-(45*rapportwidth));
        ctx.lineTo(320*rapportwidth, 245-(45*rapportwidth)-(45*rapportwidth));
        ctx.stroke();

        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.strokeStyle = "RED";
        ctx.lineWidth = 2;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.beginPath();
        ctx.moveTo(320*rapportwidth, 245+(45*rapportwidth));
        ctx.lineTo(320*rapportwidth, 245+(45*rapportwidth)+(45*rapportwidth));
        ctx.stroke();

    }
}


function geo_erreur(error) {
    console.log('error (' + error.code + '): ' + error.message);
}

function changetext() {
    var d = new Date();
    text.innerHTML = "Photo prise le " + d.getDate() +
        "/" + (d.getMonth() + 1) +
        "/" + d.getFullYear() +
        " à  " + d.getHours() +
        ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + "<br/> Vous pouvez voir la géolocalisation de la photo sur la map en dessous.";
}
var infoWindow;
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 48.4000000,
            lng: -4.4833300
        },
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow({
        map: map
    });
    geoloc();


}

function geoloc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Latitude : " + pos.lat + "º, Longitude : " + pos.lng + "º");
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}


window.onresize = function (event) {
    if ($(window).width() < 640) {
        $('.divMain').css('margin-top', '1%');
        canvas.width = $(window).width();
    } else {
        $('.divMain').css('margin-top', '2%');
        canvas.width = 640;
    }
};

// // declare our variables
// var seriously, // the main object that holds the entire composition
//     colorbars, // a wrapper object for our source image
//     vignette, // a vignette effect
//     flip,
//     filter,
//     target; // a wrapper object for our target canvas

// filter = 'invert';
// seriously = new Seriously();
// colorbars = seriously.source(video);
// target = seriously.target('#myCanvas');
// //vignette = seriously.effect('invert');
// flip = seriously.transform('flip');
// flip.direction = 'horizontal';
// flip.source = video; // implicitly create a hidden source node
// if (filter.length !== 0) {
//     effect = seriously.effect(filter);
//     // connect all our nodes in the right order
//     effect.source = flip;
//     target.source = effect;
// } else {
//     target.source = flip;
// };
// seriously.go();


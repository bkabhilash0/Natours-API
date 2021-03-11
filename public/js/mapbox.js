console.log('Hello From Client!');
const locations = JSON.parse(document.getElementById('map').dataset.locations);


mapboxgl.accessToken =
    'pk.eyJ1IjoiYmthYmhpbGFzaDEyMyIsImEiOiJja201MTNmZzcwYTByMnVwMXY4OTA4cGtoIn0.Lo59cQAbcj8342M2Srchjg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
});

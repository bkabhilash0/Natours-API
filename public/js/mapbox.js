export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiYmthYmhpbGFzaDEyMyIsImEiOiJja201MTNmZzcwYTByMnVwMXY4OTA4cGtoIn0.Lo59cQAbcj8342M2Srchjg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/bkabhilash123/ckm6f2xeb3deg17q3l4ck8hem',
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Create Marker
        const el = document.createElement('div');
        el.className = 'marker';
        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        //  App Popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
        //* Extend Mapbounds.
        bounds.extend(loc.coordinates);
    });
    map.scrollZoom.disable();
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};

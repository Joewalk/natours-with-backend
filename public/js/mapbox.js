/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGV2am9lLW1lZGlhIiwiYSI6ImNrYm5qZW1rejFzeTMyc3F2aHkwOHJsZmIifQ.8vipNmBxsg9Afq_bFkY8BA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/devjoe-media/ckbnjz7l61zn01inyf3igk8qr',
    scrollZoom: false
    // center: [-74.248882, 40.736703],
    // zoom: 4,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  });
};

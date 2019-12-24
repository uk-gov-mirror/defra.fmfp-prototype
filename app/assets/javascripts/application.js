/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()


  var source = new ol.source.Vector({wrapX: false});
  var vector = new ol.layer.Vector({
    source: source
  });

  var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  var map = new ol.Map({
    target: 'map',
    layers: [ baseMapLayer, vector],
    view: new ol.View({
            center: ol.proj.fromLonLat([0.90401, 51.80645]),
            zoom: 15 //Initial Zoom Level
          })
  });


  //Adding a marker on the map
  var marker = new ol.Feature({
    geometry: new ol.geom.Point(
      ol.proj.fromLonLat([0.90401, 51.80645]) // postcode CO5 7QG
    ),
  });

  marker.setStyle(new ol.style.Style({
          image: new ol.style.Icon(({
              crossOrigin: 'anonymous',
              src: '/public/images/pin.png'
          }))
      }));

  var vectorSource = new ol.source.Vector({
    features: [marker]
  });
  var markerVectorLayer = new ol.layer.Vector({
    source: vectorSource,
  });
  map.addLayer(markerVectorLayer);

  var draw; // global so we can remove it later

  function addInteraction() {

      draw = new ol.interaction.Draw({
        source: source,
        type: 'Polygon'
      });
      map.addInteraction(draw);

  }

  var shapeCheck = document.getElementById('shapeCheckbox');

  shapeCheck.addEventListener('click', function(event) {
    if ( this.checked ) {
      map.removeInteraction(draw);
      addInteraction();
      vector.setVisible(true);
      markerVectorLayer.setVisible(false);
    } else {
      map.removeInteraction(draw);
      vector.setVisible(false);
      markerVectorLayer.setVisible(true);
    }
  }, false);


// DRAGGABLE MARKER
  var translate1 = new ol.interaction.Translate({
  	features: new ol.Collection([marker])
  });
  map.addInteraction(translate1);
  var coordMarker1;

  map.on('pointermove', function(e) {
    if (e.dragging) return;
    var hit = map.hasFeatureAtPixel(map.getEventPixel(e.originalEvent));
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });
//////////////////////

})

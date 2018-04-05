// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([32.240086, -86.823730], 7);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/applesloss/cjfbu9fj186qf2ro3uiofr423/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYXBwbGVzbG9zcyIsImEiOiJjajloZnptNDkzN3N5MnFyd2E4YjJzMmZyIn0.QOsmmI2w4V0LxUnEyMdMpw', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'emsloss'
});


// Initialze source data
var source = new carto.source.Dataset('energyburden2015_50fpl');

// Create style for the data
var style = new carto.style.CartoCSS(`
 #layer {
  polygon-fill: ramp([percincome], (#ecda9a, #efc47e, #f3ad6a, #f7945d, #f97b57, #f66356, #ee4d5a), jenks);
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
} 
`);

// Add style to the data
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var layer = new carto.layer.Layer(source, style, {
  featureClickColumns: ['county_onl', 'percincome', 'totalenerg']
});

var popup = L.popup();
layer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h1>' + event.data['county_onl'] + '</h1>'
  content += '<div>% of Income Spent on Energy: ' + event.data['percincome'] + '</div>'
  content += '<div>Estimated Annual Energy Costs: $' + event.data['totalenerg'] + '</div>';
  popup.setContent(content);
  
  // Place the popup and open it
  popup.setLatLng(event.latLng);
  popup.openOn(map);
});

// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);
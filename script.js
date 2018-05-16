// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([36.949892, -96.416016], 5);

// Add base layer
L.tileLayer('https://api.mapbox.com/styles/v1/applesloss/cjfbu9fj186qf2ro3uiofr423/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYXBwbGVzbG9zcyIsImEiOiJjajloZnptNDkzN3N5MnFyd2E4YjJzMmZyIn0.QOsmmI2w4V0LxUnEyMdMpw', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'emsloss'
});

// *** Begin Layer One
// Initialze source data
// var AlCosource = new carto.source.Dataset('alco_popup');
var AlCosource = new carto.source.SQL('SELECT * FROM alco_popup');

//https://thenewschool.carto.com/u/emsloss/dataset/energyburden2015_50fpl

// Create style for the data
var AlCostyle = new carto.style.CartoCSS(`
 #layer {
  polygon-fill: ramp([total_median_income], (#c4e6c3, #80c799, #4da284, #2d7974, #1d4f60), quantiles);
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
var AlColayer = new carto.layer.Layer(AlCosource, AlCostyle, {
  featureClickColumns: ['name', 'total_median_income', 'mi_white', 'mi_black', 'percent_white', 'percent_black', 'other_race', '_15_24', '_25_44', '_45_64', 'over_65', 'percent_income_on_energy','annual_energy_cost']
});
AlColayer.hide();

var sidebar = document.querySelector('.sidebar-content');
  sidebar.style.display = 'block';
  
  
  var panelClose = document.querySelector('.panel-close');
  panelClose.style.display = 'block';

AlColayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var AlCocontent = '<h1>' + event.data['name'] + ' County' + '</h1>';
  AlCocontent += '<h2>' + 'Income' + '</h2>';
  AlCocontent += '<div>Total Median Income: ' + '$' + event.data['total_median_income'] + '</div>'; 
  AlCocontent += '<div>White Median Income: ' + '$' + event.data['mi_white'] + '</div>';
  AlCocontent += '<div>Black Median Income: ' + '$' + event.data['mi_black'] + '</div>';
  AlCocontent += '<h2>' + 'Race' + '</h2>';
  AlCocontent += '<div>White: ' + event.data['percent_white'] + '%' + '</div>'; 
  AlCocontent += '<div>Black: ' + event.data['percent_black'] + '%' + '</div>';
  AlCocontent += '<div>Other: ' + event.data['other_race'] + '%' + '</div>';
  AlCocontent += '<h2>' + 'Age' + '</h2>';
  AlCocontent += '<div> < 24: ' + event.data['_15_24'] + '%' + '</div>'; 
  AlCocontent += '<div>25-44: ' + event.data['_25_44'] + '%' + '</div>';
  AlCocontent += '<div>45-64: ' + event.data['_45_64'] + '%' + '</div>';
  AlCocontent += '<div> > 65: ' + event.data['over_65'] + '%' + '</div>';
  AlCocontent += '<h2>' + 'Energy Burden' + '</h2>';
  AlCocontent += '<div>' + event.data['percent_income_on_energy'] + '% of income spent on energy' + '</div>'; 
  AlCocontent += '<div>Annual Energy Costs ' + event.data['annual_energy_cost'] + '</div>';
  AlCocontent += '<img src= "https://cdn.glitch.com/206e896a-4403-4c86-83b4-925e7a41c1f0%2FScreen%20Shot%202018-05-16%20at%201.00.32%20AM.png?1526446891554">';
  AlCocontent += '<h4>' + ' Source: <a href="https://factfinder.census.gov/">2010 US Census </a> & <a href="http://insideenergy.org/2016/05/08/high-utility-costs-force-hard-decisions-for-the-poor/">Inside Energy </a>' + '</h4>';
  sidebar.innerHTML = AlCocontent;
}); 


// *** Begin Layer Two
// Initialze source data
// var Energysource = new carto.source.SQL('SELECT * FROM energyburden2015_50fpl');
var Energysource = new carto.source.SQL('SELECT * FROM energyburden2015_50fpl');

// Create style for the data
var Energystyle = new carto.style.CartoCSS(`
 #layer {
  polygon-fill: ramp([percentincome], (#ecda9a, #efc47e, #f3ad6a, #f7945d, #f97b57, #f66356, #ee4d5a), jenks);
}
#layer::outline {
  line-width: 1;
  line-color: #FFFFFF;
  line-opacity: 0.5;
} 
`);



var Energylayer = new carto.layer.Layer(Energysource, Energystyle, {
  featureClickColumns: ['county_onl', 'percentincome', 'totalenerg']
});

var Energypopup = L.popup();
Energylayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var content = '<h1>' + event.data['county_onl'] + '</h1>'
  content += '<div>' + event.data['percentincome'] + '% of income spent on energy' + '</div>'
  content += '<div>' + '$' + event.data['totalenerg'] + ' annual energy costs' + '</div>';
  Energypopup.setContent(content);
  
  // Place the popup and open it
  Energypopup.setLatLng(event.latLng);
  Energypopup.openOn(map);
});

// *** Begin Layer Three
// Initialze source data
var Racesource = new carto.source.Dataset('alco_popup');

// Create style for the data
var Racestyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: ramp([percent_black], (#f7f7f7, #cccccc, #969696, #636363, #252525), quantiles);
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
var Racelayer = new carto.layer.Layer(Racesource, Racestyle, {
  featureClickColumns: ['name', 'total_median_income', 'mi_white', 'mi_black', 'percent_white', 'percent_black', 'other_race', '_15_24', '_25_44', '_45_64', 'over_65', 'percent_income_on_energy','annual_energy_cost']
});
Racelayer.hide();

var sidebar = document.querySelector('.sidebar');
sidebar.style.display = 'block';
Racelayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var Racecontent = '<h1>' + event.data['name'] + ' County' + '</h1>';
  Racecontent += '<h2>' + 'Income' + '</h2>';
  Racecontent += '<div>Total Median Income: ' + '$' + event.data['total_median_income'] + '</div>'; 
  Racecontent += '<div>White Median Income: ' + '$' + event.data['mi_white'] + '</div>';
  Racecontent += '<div>Black Median Income: ' + '$' + event.data['mi_black'] + '</div>';
  Racecontent += '<h2>' + 'Race' + '</h2>';
  Racecontent += '<div>White: ' + event.data['percent_white'] + '%' + '</div>'; 
  Racecontent += '<div>Black: ' + event.data['percent_black'] + '%' + '</div>';
  Racecontent += '<div>Other: ' + event.data['other_race'] + '%' + '</div>';
  Racecontent += '<h2>' + 'Age' + '</h2>';
  Racecontent += '<div> < 24: ' + event.data['_15_24'] + '%' + '</div>'; 
  Racecontent += '<div>25-44: ' + event.data['_25_44'] + '%' + '</div>';
  Racecontent += '<div>45-64: ' + event.data['_45_64'] + '%' + '</div>';
  Racecontent += '<div> > 65: ' + event.data['over_65'] + '%' + '</div>';
  Racecontent += '<h2>' + 'Energy Burden' + '</h2>';
  Racecontent += '<div>' + event.data['percent_income_on_energy'] + '% of income spent on energy' + '</div>'; 
  Racecontent += '<div>Annual Energy Costs ' + event.data['annual_energy_cost'] + '</div>';
  Racecontent += '<img src= "https://cdn.glitch.com/206e896a-4403-4c86-83b4-925e7a41c1f0%2FScreen%20Shot%202018-05-16%20at%2012.37.31%20AM.png?1526445477910">';
  Racecontent += '<h4>' + ' Source: <a href="https://factfinder.census.gov/">2010 US Census </a> & <a href="http://insideenergy.org/2016/05/08/high-utility-costs-force-hard-decisions-for-the-poor/">Inside Energy </a>' + '</h4>';
  sidebar.innerHTML = Racecontent;
});


// *** Begin Layer Four
// Initialze source data
var Membersource = new carto.source.Dataset('octobermasterl_1');

// Create style for the data
var Memberstyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 7;
  marker-fill: purple;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

var Memberlayer = new carto.layer.Layer(Membersource, Memberstyle);
Memberlayer.hide();

// *** Begin Layer five
// Initialze source data
var BWEMCsource = new carto.source.Dataset('bwemc_rec_merged');

// Create style for the data
var BWEMCstyle = new carto.style.CartoCSS(`
#layer['mapnik::geometry_type'=3] {
  polygon-fill: #250776;
  polygon-opacity: 0;
  ::outline {
    line-color: #000000;
    line-width: 1;
    line-opacity: 1;
  }
}
`);

var BWEMClayer = new carto.layer.Layer(BWEMCsource, BWEMCstyle);
BWEMClayer.hide();


// *** Begin Layer Six
// Initialze source data
var Churchsource = new carto.source.Dataset('bwemc_territory_churches');

// Create style for the data
var Churchstyle = new carto.style.CartoCSS(`
 #layer {
  marker-width: 7;
  marker-fill: blue;
  marker-fill-opacity: 0.9;
  marker-allow-overlap: true;
  marker-line-width: 1;
  marker-line-color: #FFFFFF;
  marker-line-opacity: 1;
}
`);

var Churchlayer = new carto.layer.Layer(Churchsource, Churchstyle);
Churchlayer.hide();

// *** Begin Layer Seven
// Initialze source data
var Coopsource = new carto.source.Dataset('electric_coops');

// Create style for the data
var Coopstyle = new carto.style.CartoCSS(`
#layer {
  polygon-fill: #007b00;
  polygon-opacity: 0.9;
  ::outline {
    line-color: #FFFFFF;
    line-width: 1;
    line-opacity: 0.5;
  }
}
`);

// Add style to the data
//
// Note: any column you want to show up in the popup needs to be in the list of
// featureClickColumns below
var Cooplayer = new carto.layer.Layer(Coopsource, Coopstyle, {
  featureClickColumns: ['name', 'city', 'customers']
});
Cooplayer.hide();

var sidebar = document.querySelector('.sidebar');
sidebar.style.display = 'block';
Cooplayer.on('featureClicked', function (event) {
  // Create the HTML that will go in the popup. event.data has all the data for 
  // the clicked feature.
  //
  // I will add the content line-by-line here to make it a little easier to read.
  var Coopcontent = '<h2>' + event.data['name'] + '</h2>';
  Coopcontent += '<div>' + event.data['city'] + '</div>'; 
  Coopcontent += '<div>' + event.data['customers'] + ' coop members' + '</div>';
  sidebar.innerHTML = Coopcontent;
});




/*
 * A function that is called any time a radio changes
 */
function handleRadioChange() {
  // First we find every radio and store them in separate variables
  var energyRadio = document.querySelector('.energy-Radio');
  var incomeRadio = document.querySelector('.income-Radio');
  var raceRadio = document.querySelector('.race-Radio');
  var BWEMCRadio = document.querySelector('.BWEMC-Radio');
    var coopRadio = document.querySelector('.coop-Radio');

  
  // Logging out to make sure we get the radios correctly
  console.log('energy:', energyRadio.checked);
  console.log('income:', incomeRadio.checked);
  console.log('race:', raceRadio.checked);
  console.log('BWEMC:', BWEMCRadio.checked);
   console.log('coop:', coopRadio.checked);

  
  
  // Find the radio that is checked and set layer accordingly
  var checkedlayer;
  if (energyRadio.checked) {
    checkedlayer = 'energyburden2015_50fpl';
    AlColayer.hide();
    Energylayer.show();
    Racelayer.hide();
    Cooplayer.hide();
    BWEMClayer.hide()
  }
  if (incomeRadio.checked) {
    checkedlayer = 'alco_popup';
    AlColayer.show();
    Energylayer.hide();
    Racelayer.hide();
    Cooplayer.hide();
    BWEMClayer.hide()
  }
   if (raceRadio.checked) {
    checkedlayer = 'alco_popup';
    AlColayer.hide();
    Energylayer.hide();
    Racelayer.show();
     Cooplayer.hide();
    BWEMClayer.hide()
  }
  if (BWEMCRadio.checked) {
    checkedlayer = 'bwemc_rec_merged';
    AlColayer.hide();
    Energylayer.hide();
    Racelayer.hide();
    Cooplayer.hide();
    BWEMClayer.show()
  }
  
   if (coopRadio.checked) {
    checkedlayer = 'bwemc_rec_merged';
    AlColayer.hide();
    Energylayer.hide();
    Racelayer.hide();
    Cooplayer.show();
    BWEMClayer.hide()
  }
  //   // If there are any values to filter on, do an SQL IN condition on those values,
  // // otherwise select all features
  if (checkedlayer) {
    // var sql = "SELECT * FROM energyburden2015_50fpl = '" + checkedlayer + "'";
    // var sql = "SELECT" +"*"+ "FROM" +" '"+ checkedlayer + "'";
    var sql = 'SELECT * FROM ' + checkedlayer;
    console.log(sql);
    Energysource.setQuery(sql);
  }
  else {
    // AlCosource.setQuery("SELECT * FROM alco_popup");
    // AlCosource.setQuery("SELECT * FROM alco_popup");
    // console.log(sql);
    // AlCosource.setQuery(sql);
  }
}


// When the member button is clicked, show or hide the layer
var energyPopup = document.querySelector('.energy-Radio');
energyPopup.addEventListener('click', function () {
  if (energyRadio.checked) {
    energyPopup.show();
  }
  else {
    energyPopup.hide();
  }
});

// When the member check is clicked, show or hide the layer
var memberCheckbox = document.querySelector('.Member-checkbox');
memberCheckbox.addEventListener('click', function () {
  if (memberCheckbox.checked) {
    Memberlayer.show();
  }
  else {
    Memberlayer.hide();
  }
});

// When the church check is clicked, show or hide the layer
var churchCheckbox = document.querySelector('.Church-checkbox');
churchCheckbox.addEventListener('click', function () {
  if (churchCheckbox.checked) {
    Churchlayer.show();
  }
  else {
    Churchlayer.hide();
  }
});



/*
 * Listen for changes on any radio
 */
var energyRadio = document.querySelector('.energy-Radio');
energyRadio.addEventListener('change', function () {
  handleRadioChange();
  // You could zoom anywhere you want in any event listener
  map.setView([36.949892, -96.416016], 5);
   
});

var coopRadio = document.querySelector('.coop-Radio');
coopRadio.addEventListener('change', function () {
  handleRadioChange();
  // You could zoom anywhere you want in any event listener
  map.setView([36.949892, -96.416016], 5);
   
});
var incomeRadio = document.querySelector('.income-Radio');
incomeRadio.addEventListener('change', function () {
  handleRadioChange();
  // You could zoom anywhere you want in any event listener
  map.setView([32.240086, -86.823730], 7);
});
var raceRadio = document.querySelector('.race-Radio');
raceRadio.addEventListener('change', function () {
  handleRadioChange();
  // You could zoom anywhere you want in any event listener
  map.setView([32.240086, -86.823730], 7);
});

var memberCheckbox = document.querySelector('.Member-checkbox');
memberCheckbox.addEventListener('change', function () {
  handleRadioChange();
  // You could zoom anywhere you want in any event listener
  map.setView([32.458791, -88.0], 8.5);
});

var churchCheckbox = document.querySelector('.Church-checkbox');
churchCheckbox.addEventListener('change', function () {
  handleRadioChange();
  // You could zoom anywhere you want in any event listener
  map.setView([32.458791, -88.0], 8.5);
});

var BWEMCRadio = document.querySelector('.BWEMC-Radio');
BWEMCRadio.addEventListener('change', function () {
  handleRadioChange();
  // You could zoom anywhere you want in any event listener
  map.setView([32.458791, -88.0], 8.5);
});


// Add the data to the map as many layers. Order matters here--first one goes on the bottom
client.addLayers([Energylayer, AlColayer, Racelayer, BWEMClayer, Cooplayer, Memberlayer, Churchlayer]);
client.getLeafletLayer().addTo(map);

var sidebarbutton = document.querySelector('.sidebar-button');
sidebarbutton.addEventListener('click', function () {
  var sidebarcontent = document.querySelector('.sidebar-content');
  var panelClose = document.querySelector('.panel-close');
  sidebarcontent.style.display = 'block';
  panelClose.style.display = 'block';
})

var panelClose = document.querySelector('.panel-close');
panelClose.addEventListener('click', function () {
  var sidebarcontent = document.querySelector('.sidebar-content');
  var panelClose = document.querySelector('.panel-close');
  sidebarcontent.style.display = 'none';
  panelClose.style.display = 'none';
})





// map object
var map = L.map('map',{
	scrollWheelZoom: false,
	zoomControl: false
}).setView([51.505, -0.09], 13);

// basemap
L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'hoganmaps.jnd4h596'
}).addTo(map);

function getColor(d) {
	return d > 80 ? '#800026' :
				d > 50  ? '#BD0026' :
				d > 40  ? '#E31A1C' :
				d > 30  ? '#FC4E2A' :
				d > 20  ? '#FD8D3C' :
				d > 10  ? '#FEB24C' :
				d > 1   ? '#FED976' :
									'#FFEDA0';
}

function getWidth(d) {
	return d > 80  ?  20:
				 d > 50  ?  14:
				 d > 40  ?  12:
				 d > 30  ?  10:
				 d > 20  ?  8:
				 d > 10  ?  6:
				 d > 1   ?  4:
						 				2;
}

function style(feature) {
	return {
		color: getColor(feature.properties.val),
		weight: getWidth(feature.properties.val),
		opacity: 1,
		clickable: true
	};
}

//parse the CSV, turn it in to geojson, and put it on the map.
d3.csv('data/triphome.csv', function(err, inData){
	//borrowed from here http://bl.ocks.org/sumbera/10463358
    var data = [];
    inData.map(function (d, i) {
        data.push({
            id: i,
            type: "Feature",
            properties: {
            	val: d.val
            },
            geometry: {
                coordinates: [[d.startx, +d.starty],[d.endx, +d.endy]],
                type: "LineString"
            }
        });
    });
    geoData = { type: "FeatureCollection", features: data };
    geoJsonLyr = L.geoJson(geoData,{
			style: style
		})
    	//enable click, using function from above
    	// .on('click', onMapClick)
    	.addTo(map);
    map.fitBounds(geoJsonLyr.getBounds());
});

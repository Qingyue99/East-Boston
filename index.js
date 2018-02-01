// $('#fullpage').fullpage({
//     sectionsColor: ['yellow', 'orange', '#C0C0C0', '#ADD8E6'],
// });

$(document).ready(function() {
    $('#fullpage').fullpage({
        //Navigation
        anchors:['firstPage', 'secondPage'],
        navigation: true,
        navigationPosition: 'right',

        //Scrolling
        scrollingSpeed: 700,
        fitToSection: true,
        easing: 'easeInOutCubic',

        //Design
        controlArrows: true,
        verticalCentered: true,
        sectionsColor :  ['#71C9CE', '#A6E3E9', '#C0C0C0', '#CBF1F5','#E3FDFD'],

        //events
        //onLeave: function(index, nextIndex, direction){},
        afterLoad: function(anchorLink, index){},
    });
    var description = [{
        'name':'Eagle Hill',
        'description': '#2 Number of Retail Shop: 26 '+'<br/>'+'#5 Number of Street Light: 79'+'<br/>'+' #3 Average Number of Years Since Building been Remodel: 36'
    }, {
        'name':'Eagle Hill2',
        'description': 'population 2'
    }];
    var map = L.map('Map',{
        scrollWheelZoom: false
    }).setView([42.3731185,-71.0312639], 15);

    var eBostonGeojson = [{
        "type": "Feature",
        "properties": {"name": "Eagle Hill"},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [-71.043145, 42.375465],
                [-71.022245, 42.384088],
                [-71.024048, 42.385134],
                [-71.040484, 42.383137],
                [-71.043145, 42.375465]
            ]]
        }
    }];

    // L.tileLayer('https://api.mapbox.com/styles/v1/qqyue/cjcxtlx6k1gx12tmsu69c0yzx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicXF5dWUiLCJhIjoiY2lpcGJtNG13MDFvNXRya244MGVmNWpseSJ9.Cjq1RBJLYTgEawZX--r_FQ', {
    //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);
    //

    var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.geoJSON(eBostonGeojson)
        .bindPopup(function (layer) {

            for(var i=0; i<description.length; i++){
                if(description[i].name == layer.feature.properties.name){
                    return layer.feature.properties.name + '<br/>' +description[i].description
                }
            }
            return layer.feature.properties.name;
        })
        .addTo(map);


});

//
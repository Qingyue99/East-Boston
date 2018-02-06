// $('#fullpage').fullpage({
//     sectionsColor: ['yellow', 'orange', '#C0C0C0', '#ADD8E6'],
// });

$(document).ready(function() {
    $('#fullpage').fullpage({
        //Navigation
        anchors:['firstPage', 'secondPage','thirdPage','fourthPage'],
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
        'color':'red',
        'description': '#2 Number of Retail Shop: 26 '+'<br/>'+'#5 Number of Street Light: 79'+'<br/>'+' #3 Average Number of Years Since Building been Remodel: 36'
    }, {
        'name':'Lower Eagle Hill',
        'description': '#3 Number of Retail Shop: 26 '+'<br/>'+'#5 Number of Street Light: 86'+ '<br/>'+' #3 Average Number of Years Since Building been Remodel: 36'
    }, {
        'name':'Jeffries Point',
        'description': 'population 3'
    },{
        'name':'Orient Heights',
        'description': 'population 4'
    },{
            'name':'Lower Orient Heights',
            'description': 'population 5'
        },{
        'name':'Logan',
        'description': 'population 6'
    }];
    var map = L.map('Map',{
        scrollWheelZoom: false,
        zoomSnap: 0.2
    });
    map.fitBounds([[42.401203, -71.048002],[42.347432, -70.987063]]);



    // L.tileLayer('https://api.mapbox.com/styles/v1/qqyue/cjcxtlx6k1gx12tmsu69c0yzx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicXF5dWUiLCJhIjoiY2lpcGJtNG13MDFvNXRya244MGVmNWpseSJ9.Cjq1RBJLYTgEawZX--r_FQ', {
    //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);
    //

    var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var geojsonLayer = new L.GeoJSON.AJAX("eb_neighborhood.geojson",
        {
            onEachFeature: function (feature, layer) {
                var text = "";
                for (var i = 0; i < description.length; i++) {
                    console.log(feature.properties.Name);

                    if (description[i].name == feature.properties["Neighbor"]) {
                        text += "<br>" + feature.properties["Neighbor"] + '<br/>' + description[i].description;
                    }
                }
                text += "<br>" +  feature.properties["Neighbor"];
                console.log(text);
                layer.bindPopup(text);
                layer.setStyle({
                    fillColor: colorNeiborhood(feature.properties["Neighbor"]),
                });

            }
        }).addTo(map);

    var lightOptions = {
        onEachFeature: function(feature, layer) {
        },
        style: function(feature) {
            return {
                opacity: 0.8,
                fillOpacity:0.6,
                radius:0.05,
                color: '#DE561C'
            }
        },
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {

            });
        }
    };

    var retailLayer = L.layerGroup();
    retailLayer.addTo(map);
    d3.csv('./assets/Retail.csv', function (err, data) {
        console.log(data);
        data.forEach(function (obj) {
                var circle = L.circle([+obj.lat, +obj.lon], {
                    color: '#3090A1'
                });
                retailLayer.addLayer(circle);
        });
    });

    L.shapefile('./assets/EH.zip', lightOptions).addTo(map);
    L.shapefile('./assets/Logan.zip', lightOptions).addTo(map);
    L.shapefile('./assets/JP.zip', lightOptions).addTo(map);
    L.shapefile('./assets/LEH.zip', lightOptions).addTo(map);



    function colorNeiborhood(str) {
        if (str == 'Eagle Hill') {
            return '#ECFEFF'
        } else if (str == 'Jeffries Point') {
            return '#C1C0B9'
        }
        else if (str == 'Lower Eagle Hill') {
            return '#537791'
        }
        else if (str == 'Orient Heights') {
            return '#FFCDCD'
        }
        else if (str == 'Lower Orient Heights') {
            return '#8785A2'
        }
        else if (str == 'Lower Orient Heights') {
            return '#A6DFDE'
        }
    }


    //Pie chart

    var pieChart = d3.select('#piechart')
        .append('svg')
        .attr('width','500px')
        .attr('height','500px')
        .append('g')
        .attr('transform','translate(100,100)');

    console.log(pieChart);

    //import data here
    d3.csv('./assets/piedata.csv', parse, function(d) {

        var pie = d3.pie().value(function (d) {
            return d.per
        });

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(50);

        var arcs = pie(d)

        pieChart.selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d',arc)
            .style('fill','black')
            .style('stroke-width','2px')
            .style('stroke','white');

    });//import data and draw pie


    function parse(d) {
        return{
            factor: d['factor'],
            per: +d['percent']
        }
    }



}); // Draw map


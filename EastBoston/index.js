// $('#fullpage').fullpage({
//     sectionsColor: ['yellow', 'orange', '#C0C0C0', '#ADD8E6'],
// });

$(document).ready(function() {
    $('#fullpage').fullpage({
        //Navigation
        anchors:['firstPage', 'secondPage','thirdPage','fourthPage','lastPage','lastPage1','lastPage2'],
        navigation: true,
        navigationPosition: 'right',

        //Scrolling
        scrollingSpeed: 700,
        fitToSection: true,
        easing: 'easeInOutCubic',

        //Design
        controlArrows: true,
        verticalCentered: true,
        sectionsColor :  ['#71C9CE',
            '#A6E3E9',
            '#C0C0C0',
            '#CBF1F5',
            '#ffffff'],

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

    var popup = L.popup()
        .setLatLng([42.367657, -71.034137])
        .setContent('<p>Welcome to East Boston!<br />Click Each Neighborhood to Explore More</p>')
        .openOn(map);

    // L.tileLayer('https://api.mapbox.com/styles/v1/qqyue/cjcxtlx6k1gx12tmsu69c0yzx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicXF5dWUiLCJhIjoiY2lpcGJtNG13MDFvNXRya244MGVmNWpseSJ9.Cjq1RBJLYTgEawZX--r_FQ', {
    //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);
    //

    var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var geojsonLayer = new L.GeoJSON.AJAX("./EastBoston/eb_neighborhood.geojson",
        {
            onEachFeature: function (feature, layer) {
                var text = "";
                for (var i = 0; i < description.length; i++) {
                    console.log(feature.properties.Name);

                    if (description[i].name == feature.properties["Neighbor"]) {
                        text += "<br/><span class='pop-title'>" + feature.properties["Neighbor"] + '</span><br/>' + description[i].description;
                    }
                }
                text += "<br>" +  feature.properties["Neighbor"];
                var bindpop = layer.bindPopup(text);
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
                radius:2,
                stroke:false,
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
    d3.csv('EastBoston/assets/Retail.csv', function (err, data) {
        console.log(data);
        data.forEach(function (obj) {
                var circle = L.circle([+obj.lat, +obj.lon], {
                    color: '#3090A1'
                });
                retailLayer.addLayer(circle);
        });
    });

    L.shapefile('EastBoston/assets/EH.zip', lightOptions).addTo(map);
    L.shapefile('EastBoston/assets/Logan.zip', lightOptions).addTo(map);
    L.shapefile('EastBoston/assets/JP.zip', lightOptions).addTo(map);
    L.shapefile('EastBoston/assets/LEH.zip', lightOptions).addTo(map);
    L.shapefile('EastBoston/assets/LOH.zip', lightOptions).addTo(map);
    L.shapefile('EastBoston/assets/OH.zip', lightOptions).addTo(map);



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


    //barChart
    var barWidth = document.getElementById('barChart').clientWidth,
        barHeight = document.getElementById('barChart').clientHeight;

    var barChart = d3.select('#barChart')
        .append('svg')
        .attr('class', 'barsvg')
        .attr('width',barWidth)
        .attr('height',barHeight)
        .append('g')
        .attr('class', 'barG')
        .attr('transform','translate(10,10)');

    console.log(barChart);

    //import data here
    d3.csv('EastBoston/assets/piedata.csv', function(data) {
        console.log(data);

        var max = d3.max(data, function (d) {
            return d.percent;
        });
        var barH = 40;
        var barS = 40;

        var scaleX = d3.scaleLinear()
            .domain([0, max])
            .range([0, barHeight]);

        d3.select('.barG')
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", 0)
            .attr("x", 0)
            .attr("y", function (d, i) { return (barH + barS)*i+30; })
            .attr("height", barH)
            .transition()
            .delay(function (d, i) { return i*250; })
            .attr("width", function (d) {
                return scaleX(d.percent);
            })

        d3.select('.barG')
            .selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .text(function (d) {
                return d.factor +' '+ d.percent;
            })
            .attr("x", 5)
            .attr("y", function (d, i) { return (barH + barS)*i+20; })
            .attr("dy", ".35em")




    });//import data and draw pie



}); // Draw map


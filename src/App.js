import React from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div id="map"></div>
      </div>
    );
  }
  componentDidMount() {
    var d3 = window.d3;
    var topojson = window.topojson;
    var world_110m = window.world_110m;

    if (world_110m) { //loading resource from other Pen
      var world = world_110m;
    } else {
      console.log("No topo data loaded!");
    }

    var countries = this.getCountryCod();

    var width = 960,
      height = 960;



    var projection = d3.geo.mercator()
      .scale((width + 1) / 2 / Math.PI)
      .translate([(width / 2), height / 2])
      .precision(.1);

    var path = d3.geo.path()
      .projection(projection);

    d3.geo.graticule();

    var svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "bg");

    svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);


    // Sea shore filter
    var defs = svg.append('defs'),
      filter = defs.append('filter').attr('id', 'seaShore');
    filter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'smoothAlpha')
      .attr('operator', 'over');

    var features = countries.features;


    // Markers
    for (var j = 0; j < features.length; j++) {

      // check if has value and draw line
      if (features[j].geometry.properties.value > 0) {
        var x = projection(features[j].geometry.coordinates)[0],
          y = projection(features[j].geometry.coordinates)[1];

        svg.append("svg:path")
          .attr("class", "marker")
          .attr("d", "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z")
          .attr("transform", "translate(" + x + "," + y + ") scale(0)")
          .transition()
          .delay(200)
          .duration(300)
          .ease("elastic")
          .attr("transform", "translate(" + x + "," + y + ") scale(.30)")
          ;

        var cc = features[j].geometry.properties.countryCode;

        svg.append("svg:text")
          .attr("x", x)
          .attr("y", y)
          .attr("dx", ".5em")
          .attr("dy", ".35em")
          .text(cc)
          .attr("class", "cc");
      }
    }
  }


  getCountryCod = () => {
    return {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "id": "12",
          "geometry": {
            "type": "Point",
            "coordinates": [
              "145",
              "-38"
            ],
            "properties": {
              "name": "Melbourne",
              "countryCode": "Melbourne",
              "value": "10.64"
            }
          }
        },
        {
          "type": "Feature",
          "id": "12",
          "geometry": {
            "type": "Point",
            "coordinates": [
              "150.5",
              "-35"
            ],
            "properties": {
              "name": "Sydney",
              "countryCode": "Sydney",
              "value": "10.64"
            }
          }
        }
      ]
    }
  }
}

export default App;

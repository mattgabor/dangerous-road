// drawMap("datafilename");
// drawCars("data/file.csv");
// drawScatter("data/file.csv");

    var driverData;
    d3.csv("data/bad-drivers138.csv", function(error, data) {

      // change string (from CSV) into number format
      data.forEach(function(d) {
        d["percentage unemployement rate"]                        = +d["percentage unemployement rate"];
        d["percentage graduation rate"]                           = +d["percentage graduation rate"];
        d["percentage of immigrants"]                             = +d["percentage of immigrants"];
        // d["Percentage Of Drivers Involved In Fatal Collisions Who Had Not Been Involved In Any Previous Accidents"] = +d["Percentage Of Drivers Involved In Fatal Collisions Who Had Not Been Involved In Any Previous Accidents"];
        // d["Percentage Of Drivers Involved In Fatal Collisions Who Were Not Distracted"]                             = +d["Percentage Of Drivers Involved In Fatal Collisions Who Were Not Distracted"];
        d["Start"]                                                = +d["Start"];
       // console.log(d);
      });
        driverData = data;
        create(data);
    });

var svg;
var xScale;
var yScale;
var newline;
var xAxis;
var yAxis;
var attr = {};
var padding;
var w;

setAttrFalse();
// attr['repeat'] = false;
// attr['other'] = false;

function create(data){
    w = 960;
    var h = 500;
    padding = 30;
    var numDataPoints = 1000;

    //create data points
    attr['start'] = true;
    var dataset = create_data(data);

    // function for creation of line
    newline = d3.svg.line()
        .x(function(d) {
            return xScale(d.x);
        })
        .y(function(d) {
            return yScale(d.yhat);
        });

    ////// Define Scales /////////////////
     // xScale = d3.scale.linear()
     //                      .domain([0,d3.max(dataset, function(d){
     //                        return d.x;
     //                      })])
     //                      .range([padding,w - padding*2]);

    xScale = d3.scale.linear()
                          .domain([0,100])
                          .range([padding,w - padding*2]);
                         
    yScale = d3.scale.linear()
                          .domain([0,40]) //y range is reversed because svg
                          .range([h-padding, padding]);
    /////// Define Axis //////////////////////////////
    xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom");

    yAxis =	d3.svg.axis()
                  .scale(yScale)
                  .orient("left");
    // create svg
    svg = d3.select("#content")
                .append("svg")
                .attr("width",w)
                .attr("height", h);

    // cut off datapoints that are outside the axis
    svg.append("clipPath")
        .attr("id", "chart-area")
        .append("rect")
        .attr("x", padding)
        .attr("y", padding)
        .attr("width", w-padding * 3)
        .attr("height", h-padding *2);

    // append data points
    svg.append("g")
        .attr("id", "circles")
        .attr("clip-path", "url(#chart-area)")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d){
          return xScale(d.x);
        })
        .attr("cy", function(d){
          return yScale(d.y);
        })
        .attr("r", 3.5);


    // append regression line
    svg.append("path")
        .datum(dataset)
        .attr("clip-path", "url(#chart-area)")
        .attr("class", "line")
        .attr("d", newline);

    // append Axes ///////////////////////////
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h-padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
}

    d3.select("#percentageunemployementrate")
      .on("click", function(){
        // create new data
        setAttrFalse();
        console.log(attr);
        attr["percentage unemployement rate"] = true;
        dataset = create_data(driverData);
        update(dataset);
      });    

    d3.select("#percentagegraduationrate")
      .on("click", function(){
        // create new data
        setAttrFalse();
        attr["percentage graduation rate"] = true;
        dataset = create_data(driverData);
        update(dataset);
      });

    d3.select("#percentageofimmigrants")
      .on("click", function(){
        // create new data
        setAttrFalse();
        attr["percentage of immigrants"] = true;
        dataset = create_data(driverData);
        update(dataset);
      });

    function setAttrFalse(){
        attr['start']                           = false;
        attr['percentage unemployement rate']   = false;
        attr['percentage graduation rate']      = false;
        attr['percentage of immigrants']        = false;
    }

    function update(dataset){
        console.log(dataset);

        // console.log(dataset[0].x);

        xScale = d3.scale.linear()
                  .domain([0,d3.max(dataset, function(d){
                    return d.x;
                  }) + 1])
                  .range([padding,w - padding*2]);

        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(1000)
            .attr("cx", function(d){
              return xScale(d.x);
            })
            .attr("cy", function(d){
              return yScale(d.y);
            });

        xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

        yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

        svg.select(".x.axis")
          .transition()
          .duration(1000)
          .call(xAxis);

        svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis);


        svg.select("path")
            .datum(dataset)
            // .transition()
            // .duration(10)
            .attr("d", newline);
    }

    function create_data(driverData) {
        nsamples = 50
        var x = [];
        var y = [];
        var n = nsamples;
        var x_mean = 0;
        var y_mean = 0;
        var term1 = 0;
        var term2 = 0;
        var x_value = 0;
        // console.log(attr)
        // create x and y values
        for (var i = 0; i < n; i++) {
            y.push(driverData[i]["Number of drivers involved in fatal collisions per billion miles"]);
            x.push(calculate_x_Value(driverData[i]))
            // x.push(driverData[i]["Start"]);
            x_mean = x_mean + +(x[i]);
            y_mean = y_mean + +(y[i]);
        }
        // calculate mean x and y
        x_mean /= n;
        y_mean /= n;

        // calculate coefficients
        var xr = 0;
        var yr = 0;
        for (i = 0; i < x.length; i++) {
            xr = x[i] - x_mean;
            yr = y[i] - y_mean;
            term1 += xr * yr;
            term2 += xr * xr;

        }
        var b1 = term1 / term2;
        var b0 = y_mean - (b1 * x_mean);
        // perform regression

        yhat = [];
        // fit line using coeffs
        for (i = 0; i < x.length; i++) {
            yhat.push(b0 + (x[i] * b1));
        }
        // console.log(x_mean)
        var data = [];
        for (i = 0; i < y.length; i++) {
            data.push({
                "yhat": yhat[i],
                "y": y[i],
                "x": x[i]
            })
        }
        return (data);
    }

function changeButtonColor(){}

function calculate_x_Value(data){
    var value   = 0;
    if(attr["start"]){
        value = value + +data["Start"];
    }
    else if (attr["percentage unemployement rate"]){
        value = value + +data["percentage unemployement rate"]; 
    }    
    else if (attr["percentage graduation rate"]){
        value = value + +data["percentage graduation rate"];
    }
    else if (attr["percentage of immigrants"]){
        value = value + +data["percentage of immigrants"]; 
    }
    return value;
}

// Checkbox


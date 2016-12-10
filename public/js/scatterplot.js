
var ScatterPlot = (function(window,d3) {
    var margin = {top: 0, right: 20, bottom: 22, left: 30, xlabel: 15, ylabel: 15},
    containerWidth,
    plot,
    width,
    height,
    svgContainer,
    // svgContainer = d3.select("#scatterplot").append("svg"),
    data,
    xValue,
    xScale,
    xMap,
    xAxis,
    yValue,
    yScale,
    yMap,
    yAxis,
    sal,
    salScale,
    salMap,
    temp,
    tScale,
    tMap
    rMax = 8;

    function initPlot(){
        return new Promise(function (resolve, reject) {
            data = depthSelection;

            xValue = function(d) { return d["x"];};
            xMap = function(d) { return xScale(xValue(d));};

            yValue = function(d) { return d["depth"];};
            yMap = function(d) { return yScale(yValue(d));};

            sal = function(d) { return d["sal"];};
            salScale = d3.scale.threshold()
                        .domain([32.5, 33, 33.5, 34])
                        .range([2, 3.5, 5, 6.5, 8]);
            salMap = function(d) { return salScale(sal(d));};

            temp = function(d) { return d["temp"];};
            tScale = d3.scale.threshold()
                        //Light blue / orange
                        //http://stackoverflow.com/questions/21977786/star-b-v-color-index-to-apparent-rgb-color/22630970#22630970
                        .domain([-2, -1.5, -1, -.5, 0, .5, 1, 1.5, 2, 2.5]) //11 colors
                        .range(["#9bb0ff", "#9cb2ff", "#aabfff", "#b5c7ff", "#d5deff", "#f4f1ff", "#fff5f2", "#ffefdd", "#ffd2a1", "#ffc483", "#ffc66d"]);
                        // //Gradient from blue to red
                        // .domain([-1, 0, 1, 2])
                        // .range(["#0000FF", "#4000BF", "#800080", "#BF0040", "#FF0000"]),
            tMap = function(d) { return tScale(temp(d));};


            // Adding stuff from render



            // Done adding stuff from render



            window.addEventListener('resize', ScatterPlot.render);
        });
    }

    function render(){
        return new Promise(function (resolve, reject) {
            console.log('being rendered');
            //Add svg
            d3.select("#scatterplot").selectAll("*").remove();
            svgContainer = d3.select("#scatterplot").append("svg");

            depthLabel =  svgContainer.append("text")
                    .attr("text-anchor", "middle")
                    .attr("class", "label")
                    .text("Depth (m)");
            xLabel = svgContainer.append("text")
                    .attr("text-anchor", "middle")
                    .attr("class", "label")
                    .text("distance (m)");

            containerWidth = parseInt(d3.select("#scatterplot").style("width"));
            width = containerWidth;
            height = parseInt(containerWidth * .3);
            svgContainer.attr("width", width)
                .attr("height", height)
                .append("g");


            //Scales and axis
            xScale = d3.scale.linear().range([margin.left + margin.ylabel + 20, width - rMax]);
            yScale = d3.scale.linear().range([rMax, height - rMax - margin.bottom - margin.xlabel]);

            xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
            yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

            xAxis = d3.svg.axis().scale(xScale).orient("bottom");
            yAxis = d3.svg.axis().scale(yScale).orient("left");

            // Data
            // depth: 10
            // id: "11"
            // sal: 30.4436
            // temp: 3.2769
            // x: 1349.2694

            // //Working logs
            // console.log(d3.min(data, function(d) {
            //     return d["depth"];
            // }));
            //
            // console.log(d3.max(data, function(d) {
            //     return d["depth"];
            // }));


            //Enter data and draw dots
            plot = svgContainer.selectAll("dots")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", salMap)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", tMap)
                .style("opacity", .7);


            svgContainer.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+(margin.ylabel-rMax)+"," + (height - margin.bottom - margin.xlabel)+ ")")
            .call(xAxis);

            svgContainer.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + 6 + 0 + ", "+rMax+")")
            .call(yAxis);

            depthLabel.attr("transform", "translate("+margin.ylabel+","+(height/2)+")rotate(-90)");
            xLabel.attr("transform", "translate("+ width/2 + ","+(height - 1)+")");
        });
    }

    return {
      render : render,
      init : initPlot
    }


})(window,d3);

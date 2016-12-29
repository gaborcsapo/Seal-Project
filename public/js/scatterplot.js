
var ScatterPlot = (function(window,d3) {
    var margin = {top: 0, right: 20, bottom: 22, left: 30, xlabel: 15, ylabel: 15, legend: 75},
    containerWidth,
    plot,
    width,
    height,
    svgContainer,
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
    tMap,
    rMax = 8,
    legend,
    salLegend;

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
                        .domain([-2, -1.5, -1, -.5, 0, .5, 1, 1.5, 2, 2.5]) //11 colors
                        .range(["#9bb0ff", "#9cb2ff", "#aabfff", "#b5c7ff", "#d5deff", "#f4f1ff", "#fff5f2", "#ffefdd", "#ffd2a1", "#ffc483", "#ffc66d"]);
            tMap = function(d) { return tScale(temp(d));};

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
            height = parseInt(containerWidth * .35);
            svgContainer.attr("width", width)
                .attr("height", height)
                .append("g");

            //Scales and axis
            xScale = d3.scale.linear().range([margin.left + margin.ylabel + 20, width - rMax - margin.legend]);
            yScale = d3.scale.linear().range([rMax, height - rMax - margin.bottom - margin.xlabel]);

            xScale.domain([d3.min(data, xValue), d3.max(data, xValue)]);
            yScale.domain([d3.min(data, yValue), d3.max(data, yValue)]);

            xAxis = d3.svg.axis().scale(xScale).orient("bottom");
            yAxis = d3.svg.axis().scale(yScale).orient("left");

            // Data Format
            // depth: 10
            // id: "11"
            // sal: 30.4436
            // temp: 3.2769
            // x: 1349.2694
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
            .attr("transform", "translate("+(0)+"," + (height - margin.bottom - margin.xlabel)+ ")")
            .call(xAxis);

            svgContainer.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+60+ ", "+0+")")
            .call(yAxis);

            depthLabel.attr("transform", "translate("+margin.ylabel+","+(height/2)+")rotate(-90)");
            xLabel.attr("transform", "translate("+ width/2 + ","+(height - 1)+")");

            // draw temperature legend
            var legend = svgContainer.selectAll("legend")
                .data(tScale.domain())
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(" + 0 +"," + (20+(i*20)) + ")"; });

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width - margin.legend + 10)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", tScale);

            // draw legend text
            legend.append("text")
                .attr("x", width - margin.legend + 35)
                .attr("y", 9)
                .attr("dy", ".2em")
                .style("text-anchor", "start")
                .text(function(d) { return (d + "\xB0C");})

            // draw salinity legend
            var salLegend = svgContainer.selectAll("salLegend")
                .data(salScale.domain())
              .enter().append("g")
                .attr("class", "salLegend")
                .attr("transform", function(d, i) { return "translate(" + 0 +"," + (240+(i * 20))+ ")"; });

            // draw legend sized circles
            salLegend.append("circle")
                .attr("cx", width - margin.legend + 19)
                .attr("r", salScale)
                .style("fill", "black");

            // draw legend text
            salLegend.append("text")
                .attr("x", width - margin.legend + 34)
                .attr("y", 3)
                .attr("dy", ".2em")
                .style("text-anchor", "start")
                .text(function(d) { return (d + " sal");})
        });
    }

    return {
      render : render,
      init : initPlot
    }
})(window,d3);

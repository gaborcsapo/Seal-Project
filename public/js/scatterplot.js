
var ScatterPlot = (function(window,d3) {
    var svgContainer = d3.select("#scatterplot").append("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width,
    height,
    // width = 600 - margin.left - margin.right,
    // height = 400 - margin.top - margin.bottom;
    xScale,
    yScale,
    xMap,
    yMap,
    xAxis,
    yAxis;

    $(document).ready(function(){
      initPlot();
    })

    function initPlot(){


        window.addEventListener('resize', ScatterPlot.render);
        render();
    }

    function render(){
        width = parseInt(d3.select("#scatterplot").style("width"));
        height = parseInt(width * .7);
        svgContainer.attr("width", width).attr("height", height);
        xScale.range([0,width]);
        yScale.range([0,width]);
    }



})(window,d3);

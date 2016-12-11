var Chart = (function(window,d3) {
    // setting up variables in the initial stage
  var data,
  margin = {top: 15, right: 40, bottom: 15, left: 40}, 
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom,
  parseDate = d3.time.format("%d-%b-%y").parse,
  
  y,
  x0,
  x1,
  svg,
  path1,
  path2,
  depth,
  temperature,
  salinity,
  yAxis,
  xAxisTop,
  valueline,
  valueline2,
  xAxisBottom,
  breakPoint = 270;

  //this function sets up the visualization. But only the parts that never change (on resize)
  function init(index) {
    data = sdata[index]['points'];    
    //scales
    y = d3.scale.linear().domain(d3.extent(data, function(d) { return d['depth']; }));
    x0 = d3.scale.linear().domain([0, d3.max(data, function(d) {return Math.max(d['temp']); })]); 
    x1 = d3.scale.linear().domain([0, d3.max(data, function(d) {return Math.max(d['sal']); })]);
    //line graphs are created like this
    valueline = d3.svg.line()
      .y(function(d) { return y(d['depth']); })
      .x(function(d) { return x0(d['temp']); });       
    valueline2 = d3.svg.line()
      .y(function(d) { return y(d['depth']); })
      .x(function(d) { return x1(d['sal']); });
    //setting up the axiis
    yAxis = d3.svg.axis().orient("left").ticks(5);
    xAxisBottom = d3.svg.axis().orient("bottom").ticks(5);
    xAxisTop = d3.svg.axis().orient("top").ticks(5); 
    //creating the svg items that are later shaped into what we need
    d3.select("#individual").selectAll("*").remove();
    svg = d3.select("#individual").append("svg");
    wrapper = svg.append("g");
      
    wrapper.append("g")            
        .attr("class", "y axis")

    wrapper.append("g")
        .attr("class", "x0 axis")        	
        .style("fill", "steelblue")       	

    wrapper.append("g")				
        .attr("class", "x1 axis")	
        .style("fill", "red")
    
    path1 = wrapper.append("path");
    path2 = wrapper.append("path").style("stroke", "red");

    temperature =  svg.append("text")
            .attr("text-anchor", "middle")
            .text("Temperature");
    salinity = svg.append("text")
            .attr("text-anchor", "middle")  
            .text("Salinity");
    depth = svg.append("text")
            .attr("text-anchor", "middle")
            .text("Depth");
    //when window size is changed it has to rerender the whole thing
    window.addEventListener('resize', Chart.render);
    render();
  };

  //render is where we actually put stuff on the canvas
  function render(){
      //if the size is smaller than the breakpoint, we decrease the left margin to give more space
      margin.left = parseInt(d3.select("#individual").style("width")) < breakPoint ? 5 : 40;
      width = parseInt(d3.select("#individual").style("width")) - margin.right - margin.left;
      if (width>125)
        width = 125;
      height = width;
      //max height is 600
      if (height > (600-margin.left-margin.right))
        height = (600-margin.left-margin.right);
      //reposition axis labels to save space
      yAxis.scale(y).orient(parseInt(d3.select("#individual").style("width")) < breakPoint ? 'right' : 'left');

      y.range([0, height]);
      x0.range([0, width]);
      x1.range([0, width]);
      //actually drawing the space where we put stuff
      svg.attr("width", '100%' ).attr("height", height + margin.top + margin.bottom);
      wrapper.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      path1.attr("d", valueline(data));
      path2.attr("d", valueline2(data));
      
      xAxisBottom.scale(x0);
      xAxisTop.scale(x1);
      yAxis.scale(y);
      //decrease tick number if there is no space
      if(parseInt(d3.select("#individual").style("width")) < breakPoint) {
        xAxisBottom.ticks(3);
        xAxisTop.ticks(3)
      }
      else {
        xAxisBottom.ticks(6);
        xAxisTop.ticks(6)
      }

      wrapper.select('.x0.axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisBottom);
      wrapper.select('.x1.axis')
        .call(xAxisTop);
      wrapper.select('.y.axis')
        .call(yAxis);

      depth.attr("transform", "translate(,"+(height/2)+")rotate(-90)");
      salinity.attr("transform", "translate("+ (width - 20) +",30)");
      temperature.attr("transform", "translate("+ (width -20) +"," + height +")");
  }
  
  return {
    render : render,
    init : init
  }

})(window,d3);

var updateIndividual = function(msg){
    Chart.init(msg);
}
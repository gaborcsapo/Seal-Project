var updateIndividual = function(msg){
    console.log(msg);
}

var Chart = (function(window,d3) {
  var data,
  margin = {top: 15, right: 40, bottom: 15, left: 40},
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom,
  parseDate = d3.time.format("%d-%b-%y").parse,
  y,
  x0,
  x1,
  yAxis,
  xAxisBottom,
  xAxisTop,
  valueline,
  valueline2,
  svg,
  breakPoint = 270;
        
  d3.csv("data2a.csv", init);

  function init(csv) {
    data = csv;
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.close = +d.close;
      d.open = +d.open;
    });

    y = d3.time.scale().domain(d3.extent(data, function(d) { return d.date; }));
    x0 = d3.scale.linear().domain([0, d3.max(data, function(d) {return Math.max(d.close); })]); 
    x1 = d3.scale.linear().domain([0, d3.max(data, function(d) {return Math.max(d.open); })]);
    
    valueline = d3.svg.line()
        .y(function(d) { return y(d.date); })
        .x(function(d) { return x0(d.close); });       
    valueline2 = d3.svg.line()
        .y(function(d) { return y(d.date); })
        .x(function(d) { return x1(d.open); });

    yAxis = d3.svg.axis().orient("left").ticks(5);
    xAxisBottom = d3.svg.axis().orient("bottom").ticks(5);
    xAxisTop = d3.svg.axis().orient("top").ticks(5); 
    
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
    
    window.addEventListener('resize', Chart.render);
    render();
  };

  function render(){
      margin.left = parseInt(d3.select("#individual").style("width")) < breakPoint ? 5 : 40;
      width = parseInt(d3.select("#individual").style("width")) - margin.right - margin.left;
      height = width*1.1;
      if (height > (600-margin.left-margin.right))
        height = (600-margin.left-margin.right);
      
      yAxis.scale(y).orient(parseInt(d3.select("#individual").style("width")) < breakPoint ? 'right' : 'left');

      y.range([0, height]);
      x0.range([0, width]);
      x1.range([0, width]);

      svg.attr("width", '100%' ).attr("height", height + margin.top + margin.bottom);
      wrapper.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      path1.attr("d", valueline(data));
      path2.attr("d", valueline2(data));
      
      xAxisBottom.scale(x0);
      xAxisTop.scale(x1);
      yAxis.scale(y);

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
  }
  
  return {
    render : render
  }

})(window,d3);
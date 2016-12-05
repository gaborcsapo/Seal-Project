var Spiral = (function(window,d3){
    var margin = 20,
    padding = 70,
    spiralElemPos = [],
    monthTickPos = [],
    monthPos = [],  
    donutThickness,
    donutDistance,
    periods,
    elementsPerPeriod,
    baseRadius,
    radius,
    angle,
    
    donutThickness = 20,
    donutDistance = 20,
    periods = 4,
    elementsPerPeriod = 365,
    baseRadius = 100,
    radius = baseRadius,
    angle = 0,

    Ay = 0,
    Ax = 0,
    Bx = 0,
    By = 0,
    Cx = radius + donutThickness,
    Cy = 0,
    Dx = radius,
    Dy = 0,
    ay,
    ax,
    bx,
    by,
    cx,
    cy,

    xScale,
    yScale,
    lineFunction,
    strokewidth,
    svgContainer = d3.select("#spiral").append("svg"),
    spiralLine,
    spiralName,
    monthTicks,
    monthBaseLine,
    monthNameSvg,
    months = ['Dec','Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','kru'];
    colorList = ['red','blue','green', 'yellow'],
    periodNames = [{name:'2012',pos:null},{name:'2013',pos:null},{name:'2014',pos:null},{name:'2015',pos:null}],
    periodNameSVG = null;
     
    $(document).ready(function(){
      initSpiral();
    })

    function initSpiral(){   
      angle = 0; 

      for (var index = 0; index < elementsPerPeriod*periods; index++) {
        radius += ((donutThickness+donutDistance)/365);
        angle += 2*Math.PI/365;
        Ay = radius * Math.sin(angle);
        Ax = radius * Math.cos(angle);
        By = (radius + donutThickness) * Math.sin(angle);
        Bx = (radius + donutThickness) * Math.cos(angle);
        spiralElemPos.push({'p':[{'x':Ax,'y':Ay},{'x':Bx,'y':By},{'x':Cx,'y':Cy},{'x':Dx,'y':Dy},], 'c': (colorList[Math.ceil(index/365)])});
        
        Cy = By;
        Cx = Bx;
        Dy = Ay;
        Dx = Ax;
      }

      Cy = (baseRadius - 5) * Math.sin(2*Math.PI/12*11);
      Cx = (baseRadius - 5) * Math.cos(2*Math.PI/12*11);
      cy = (radius + donutThickness + 30) * Math.sin(2*Math.PI/12*11);
      cx = (radius + donutThickness + 30) * Math.cos(2*Math.PI/12*11);
      for (var angle = 0; angle < 2*Math.PI; angle += 2*Math.PI/months.length) {
        Ay = (baseRadius - 5) * Math.sin(angle);
        Ax = (baseRadius - 5) * Math.cos(angle);
        By = (baseRadius - 10) * Math.sin(angle);
        Bx = (baseRadius - 10) * Math.cos(angle);
        ay = (radius + donutThickness + 15) * Math.sin(angle);
        ax = (radius + donutThickness + 15) * Math.cos(angle);
        by = (radius + donutThickness + 25) * Math.sin(angle);
        bx = (radius + donutThickness + 25) * Math.cos(angle);
        monthTickPos.push([{'x':Ax,'y':Ay},{'x':Bx,'y':By}]);
        monthTickPos.push([{'x':ax,'y':ay},{'x':bx,'y':by}]);
        monthPos.push([{'x':Ax,'y':Ay},{'x':Cx,'y':Cy}]);
        monthPos.push([{'x':bx,'y':by},{'x':cx,'y':cy}]);
        Cx = Ax;
        Cy = Ay;
        cx = bx;
        cy = by;
      } 
      
      for (var periodIndex = 0; periodIndex < periods; periodIndex++) {
        periodNames[periodIndex].pos = baseRadius + donutThickness + periodIndex*(donutThickness + donutDistance) + donutDistance/3; 
      }

      xScale = d3.scale.linear().domain([d3.min(spiralElemPos, function(d) {return d.p[1].x - padding;}), d3.max(spiralElemPos, function(d) {return d.p[1].x + padding;})]);
      yScale = d3.scale.linear().domain([d3.min(spiralElemPos, function(d) {return d.p[1].y - padding;}), d3.max(spiralElemPos, function(d) {return d.p[1].y + padding;})]);
      lineFunction = d3.svg.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); });

      //add stuff for legend and later just update 
      spiralName = svgContainer.append("text")
        .attr("text-anchor", "middle")
        .text("Temperature");

      spiralLine = svgContainer.append('g').attr('id','spiralLine').selectAll('path')
        .data(spiralElemPos)
        .enter().append("polygon") 
        .attr("fill", function(d){return d.c;})
        .attr("stroke", function(d){return d.c;});
      
      periodNameSVG = svgContainer.append("g").attr('id','periodNameSVG').selectAll('text')
        .data(periodNames)
        .enter()
        .append('text')
        .attr("transform", "rotate(90)")
        .attr("text-anchor", "middle")
        .text(function(d){return d.name;});
      
      monthTicks = svgContainer.append('g').attr('id','monthTick').selectAll(".monthLine")
        .data(monthTickPos)
        .enter().append("path")
        .attr("class","monthLine");
      
      monthBaseLine = svgContainer.append('g').attr('id','monthBaseLine').selectAll(".arc")
        .data(monthPos)
        .enter().append("path")
        .attr("class","arc")
        .attr("id", function(d,i) { return "monthArc_"+i; });
      
      monthNameSvg = svgContainer.append('g').attr('id','monthNameSVG').selectAll(".name")
      .data(monthPos)
      .enter()
      .append("text")     
      .attr("class", "donutText")
      .append("textPath")
      .attr("xlink:href",function(d,i){return "#monthArc_"+(i);})
      .text(function(d, i){return months[Math.floor(i/2)];})	
      .style("text-anchor","middle") 
      .attr("startOffset", "50%")		

      window.addEventListener('resize', Spiral.render);
      render();
    }

    function render(){      
      width = parseInt(d3.select("#spiral").style("width"));
      svgContainer.attr("width", width).attr("height", width);
      xScale.range([0,width]);
      yScale.range([0,width]);
      
      svgContainer.selectAll("polygon").each(function(d, i) {
          d3.select(this).attr("points",function(d) { 
            return d.p.map(function(d) {
                return [xScale(d.x),yScale(d.y)].join(",");}
            ).join(" ");
        })
      });
      
      svgContainer.selectAll(".monthLine").each(function(d, i) {
          d3.select(this).attr("d", lineFunction);
      });
      
      svgContainer.selectAll(".arc").each(function(d, i) {
          d3.select(this).attr("d", lineFunction)
      });

      monthNameSvg.selectAll("textpath").each(function(d, i) {
          d3.select(this).attr("d", lineFunction)
      });

      periodNameSVG.each(function(d, i) {
          d3.select(this)
          .attr("transform", 'translate(' + xScale(d.pos) + ',' +yScale(0) + ')rotate(90)')
      });

      spiralName.attr("x", width/2)
        .attr("y", width/2);
    }
    
    return {
      render : render
    }
  })(window,d3);
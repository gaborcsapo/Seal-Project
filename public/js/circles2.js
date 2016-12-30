var Spiral = (function(parameter,window,d3){
    var margin = 20,
    parameter = parameter,
    padding = 70,
    spiralElemPos = [],
    spiralSkelettonPos = [],
    monthTickPos = [],
    monthPos = [],  
    donutThickness,
    donutDistance,
    periods,
    elementsPerPeriod,
    baseRadius,
    radius,
    angle,
    min,
    max,
    
    donutThickness = 20,
    donutDistance = 20,
    periods = 8,
    elementsPerPeriod = 366,
    baseRadius = 100,
    radius = baseRadius,
    angle = 0,
    spiralStartDate,

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
    colorScale,
    lineFunction,
    skelettonFunction,
    strokewidth,
    svgContainer = d3.select("#"+parameter).append("svg").attr("id", parameter),
    spiralCont,
    spiralLine,
    spiralColor,
    spiralName,
    monthCont,
    monthTicks,
    monthBaseLine,
    monthNameSvg,
    months = ['Dec','Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov'],
    periodNames = [],
    periodNameSVG = null;

    //need to make dynamically settable
    var upperLimit;
    var lowerLimit;
    if (parameter == 'sal'){
      upperLimit = 34;
      lowerLimit = 32;
    }
    if (parameter == 'temp'){
      upperLimit = 3;
      lowerLimit = -2;
    }

    function calcSpiral(){  
      return new Promise(function (resolve, reject) {
        //console.log(upperTime,lowerTime)
        radius = baseRadius;
        angle = 0; 
        periods = (upperTime.getFullYear() - lowerTime.getFullYear())+1;
        spiralElemPos= [];
        monthTickPos = [];
        monthPos = []; 
        periodNames = [];
        spiralSkelettonPos = [[]];

        for (var index = 0; index < elementsPerPeriod*periods; index++) {
          radius += ((donutThickness+donutDistance)/elementsPerPeriod);
          angle += 2*Math.PI/elementsPerPeriod;
          Ay = radius * Math.sin(angle);
          Ax = radius * Math.cos(angle);
          By = (radius + donutThickness) * Math.sin(angle);
          Bx = (radius + donutThickness) * Math.cos(angle);
          spiralElemPos.push({'p':[{'x':Ax,'y':Ay},{'x':Bx,'y':By},{'x':Cx,'y':Cy},{'x':Dx,'y':Dy}]});
          spiralSkelettonPos[0].push({'x':Bx,'y':By});
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
          periodNames.push({'name':(parseInt(lowerTime.getFullYear())+parseInt(periodIndex)).toString(), 
                            'pos':baseRadius + donutThickness + periodIndex*(donutThickness + donutDistance) + donutDistance/3
                            });
        }
        // average = (d3.min(circleData, function(d) {return d[parameter]/d.counter;}) + d3.max(circleData, function(d) {return d[parameter]/d.counter;}))/2;
        // colorScale.domain([d3.min(circleData, function(d) {return d[parameter]/d.counter;}), average, d3.max(circleData, function(d) {return d[parameter]/d.counter;})]).range(["#F18200", "#f7f7f7", "#5313BE"]);
        colorScale.domain([lowerLimit, (lowerLimit+upperLimit)/2, upperLimit]).range(["#F18200", "#f7f7f7", "#5313BE"]);
        
        xScale.domain([d3.min(spiralElemPos, function(d) {return d.p[1].x - padding;}), d3.max(spiralElemPos, function(d) {return d.p[1].x + padding;})]);
        yScale.domain([d3.min(spiralElemPos, function(d) {return d.p[1].y - padding;}), d3.max(spiralElemPos, function(d) {return d.p[1].y + padding;})]);
        lineFunction = d3.svg.line()
          .x(function(d) { return xScale(d.x); })
          .y(function(d) { return yScale(d.y); });
        skelettonFunction = d3.svg.line()
          .x(function(d) { return xScale(d.x); })
          .y(function(d) { return yScale(d.y); });
      });      
    }

    function render(){
      return new Promise(function (resolve, reject) {
        $('#'+parameter+' + .spinner').css('display', 'block');
        width = parseInt(d3.select('#'+parameter).style("width"));
        svgContainer.attr("width", width).attr("height", width);
        xScale.range([0,width]);
        yScale.range([0,width]);
        spiralStartDate = new Date(lowerTime.getFullYear(),0,1,0,0,0,0); 
        //console.log(spiralStartDate);
        // spiralName.attr("x", width/2)
        // .attr("y", width/2);
        
        
        spiralLine = spiralCont.selectAll('polygon')
          .data(circleData)
          .attr("fill", function(d){if (d[parameter]/d.counter>upperLimit || d[parameter]/d.counter<lowerLimit) return 'white'; return colorScale(d[parameter]/d.counter);})
          .attr("stroke", function(d){if (d[parameter]/d.counter>upperLimit || d[parameter]/d.counter<lowerLimit) return 'white'; return colorScale(d[parameter]/d.counter);})
          .attr("points",function(d) {
                return spiralElemPos[daysBetween(d.date, spiralStartDate)].p.map(function(d) {
                    return [xScale(d.x),yScale(d.y)].join(",");}
                ).join(" ");
          })     
        spiralLine.enter()
          .append('polygon')
          .attr("fill", function(d){if (d[parameter]/d.counter>upperLimit || d[parameter]/d.counter<lowerLimit) return 'white'; return colorScale(d[parameter]/d.counter);})
          .attr("stroke", function(d){if (d[parameter]/d.counter>upperLimit || d[parameter]/d.counter<lowerLimit) return 'white'; return colorScale(d[parameter]/d.counter);})
          .attr("points",function(d) {
                return spiralElemPos[daysBetween(d.date, spiralStartDate)].p.map(function(d) {
                    return [xScale(d.x),yScale(d.y)].join(",");}
                ).join(" ");
          })
        spiralLine.exit().remove();

        spiralSkeletton = spiralCont.selectAll('.skeletton') 
          .data(spiralSkelettonPos)
          .attr('d', function(d){return skelettonFunction(d)});
        spiralSkeletton.enter()
          .append('path')
          .attr('class', 'skeletton')
          .attr('d', function(d){return skelettonFunction(d)})
          .attr("stroke", "gray")
          .attr("fill", "none")
          .attr("stroke-width", '1px')
        spiralSkeletton.exit().remove();

        monthBaseLine = monthCont.selectAll(".arc")
          .data(monthPos)
          .attr("id", function(d,i) {return "monthArc_"+i; })
          .attr("d", lineFunction);
        monthBaseLine.enter()
          .append("path")
          .attr("class","arc")
          .attr("id", function(d,i) {return "monthArc_"+i; })
          .attr("d", lineFunction);
        monthBaseLine.exit().remove();
        
        monthNameSvg = monthCont.selectAll(".name")
          .data(monthPos)
          .attr("xlink:href",function(d,i){return "#monthArc_"+(i);});
        monthNameSvg.enter()
          .append("text")     
          .attr("class", "name")
          .append("textPath")
          .attr("xlink:href",function(d,i){return "#monthArc_"+(i);})
          .text(function(d, i){return months[Math.floor(i/2)];})	
          .style("text-anchor","middle") 
          .attr("startOffset", "50%");
        monthNameSvg.exit().remove();	

        monthTicks = monthCont.selectAll(".monthLine")
          .data(monthTickPos)
          .attr("d", lineFunction);
        monthTicks.enter()
          .append("path")
          .attr("class","monthLine")
          .attr("d", lineFunction)
          .attr('stroke', 'gray');
        monthTicks.exit().remove();
        
        periodNameSVG = monthCont.selectAll('.period')
          .data(periodNames)
          .text(function(d){return d.name;})
          .attr("transform", function(d){return 'translate(' + xScale(d.pos) + ',' +yScale(0) + ')rotate(90)';});
        periodNameSVG.enter()
          .append('text')
          .attr("class","period")
          .attr("transform", "rotate(90)")
          .attr("text-anchor", "middle")
          .text(function(d){return d.name;})
          .attr("transform", function(d){return 'translate(' + xScale(d.pos) + ',' +yScale(0) + ')rotate(90)';});
        periodNameSVG.exit().remove();

        svgContainer.append("g")
          .attr("class", "legendLinear")
          .attr("transform", "translate(20,20)");

        var legendLinear = d3.legend.color()
          .shapeWidth(30)
          .orient('horizontal')
          .scale(colorScale);

        svgContainer.select(".legendLinear")
          .call(legendLinear);  


      });      
    }

    $(document).ready(function(){
        spiralCont = svgContainer.append('g').attr('id', parameter + 'spiralCont');
        monthCont = svgContainer.append('g').attr('id', parameter + 'monthCont');
        // spiralName = svgContainer.append("text").text(parameter)
        //   .attr("text-anchor", "middle")
        //   .attr('font-weight', 900)
        //   .attr('font-size', '2em');
        xScale = d3.scale.linear();
        yScale = d3.scale.linear();
        colorScale = d3.scale.linear();
    }); 
    
    return {
      render : render,
      init : calcSpiral
    }
  });
  console.log('spirals');
  var tempSpiral = Spiral('temp', window, d3);
  var salSpiral = Spiral('sal', window, d3);
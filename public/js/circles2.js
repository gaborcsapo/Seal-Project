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
    lineFunction,
    strokewidth,
    svgContainer = d3.select("#spiral").append("svg"),
    spiralLine,
    spiralName,
    monthCont,
    monthTicks,
    monthBaseLine,
    monthNameSvg,
    months = ['Dec','Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','kru'];
    colorList = ['red','blue','green', 'yellow'],
    periodNames = [],
    periodNameSVG = null;
    
    $(document).ready(function(){
        //add stuff for legend and later just update
        spiralCont = svgContainer.append('g').attr('id','spiralCont');
        monthCont = svgContainer.append('g').attr('id','monthCont');
        spiralName = svgContainer.append("text")
          .attr("text-anchor", "middle")
          .text("Temperature");
        
        xScale = d3.scale.linear();
        yScale = d3.scale.linear();
        window.addEventListener('resize', Spiral.render().then(function(){$('#spiral + .spinner').css('display', 'none');}()));
    }); 

    function calcSpiral(){  
      return new Promise(function (resolve, reject) {
        console.log(upperTime,lowerTime)
        radius = baseRadius;
        angle = 0; 
        periods = (upperTime.getFullYear() - lowerTime.getFullYear())+1;
        console.log('periods ' + periods);
        spiralElemPos= [];
        monthTickPos = [];
        monthPos = []; 
        periodNames = [];

        for (var index = 0; index < elementsPerPeriod*periods; index++) {
          radius += ((donutThickness+donutDistance)/elementsPerPeriod);
          angle += 2*Math.PI/elementsPerPeriod;
          Ay = radius * Math.sin(angle);
          Ax = radius * Math.cos(angle);
          By = (radius + donutThickness) * Math.sin(angle);
          Bx = (radius + donutThickness) * Math.cos(angle);
          spiralElemPos.push({'p':[{'x':Ax,'y':Ay},{'x':Bx,'y':By},{'x':Cx,'y':Cy},{'x':Dx,'y':Dy},], 'c': (colorList[Math.ceil(index/elementsPerPeriod)])});
          
          Cy = By;
          Cx = Bx;
          Dy = Ay;
          Dx = Ax;
        }

        Cy = (baseRadius - 5) * Math.sin(2*Math.PI/12*11);
        Cx = (baseRadius - 5) * Math.cos(2*Math.PI/12*11);
        cy = (radius + donutThickness + 30) * Math.sin(2*Math.PI/12*11);
        cx = (radius + donutThickness + 30) * Math.cos(2*Math.PI/12*11);
        console.log(monthTickPos);
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
        console.log(monthTickPos);
        
        for (var periodIndex = 0; periodIndex < periods; periodIndex++) {
          periodNames.push({'name':(parseInt(lowerTime.getFullYear())+parseInt(periodIndex)).toString(), 
                            'pos':baseRadius + donutThickness + periodIndex*(donutThickness + donutDistance) + donutDistance/3
                            });
        }

        xScale.domain([d3.min(spiralElemPos, function(d) {return d.p[1].x - padding;}), d3.max(spiralElemPos, function(d) {return d.p[1].x + padding;})]);
        yScale.domain([d3.min(spiralElemPos, function(d) {return d.p[1].y - padding;}), d3.max(spiralElemPos, function(d) {return d.p[1].y + padding;})]);
        lineFunction = d3.svg.line()
          .x(function(d) { return xScale(d.x); })
          .y(function(d) { return yScale(d.y); });

        });   
      
    }

    function render(){
      return new Promise(function (resolve, reject) {
        $('#spiral + .spinner').css('display', 'block');
        width = parseInt(d3.select("#spiral").style("width"));
        svgContainer.attr("width", width).attr("height", width);
        xScale.range([0,width]);
        yScale.range([0,width]);
        spiralStartDate = new Date(lowerTime.getFullYear(),1,1,0,0,0,0); 

        spiralName.attr("x", width/2)
        .attr("y", width/2);

        spiralLine = spiralCont.selectAll('polygon')
        .data(depthSelection)
        .attr("fill", function(d){return 'red';})
        .attr("stroke", function(d){return 'red';})

        spiralLine.enter()
        .append('polygon')
        .attr("fill", function(d){return 'red';})
        .attr("stroke", function(d){return 'red';})
        .attr("points",function(d) {
              var x = spiralElemPos[daysBetween(d.date, spiralStartDate)];
              if (x == undefined)
                console.log(daysBetween(d.date, spiralStartDate), spiralElemPos.length);
              return x.p.map(function(d) {
                  return [xScale(d.x),yScale(d.y)].join(",");}
              ).join(" ");
        })
        
        spiralLine.exit().remove();

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
          .data(monthTickPos);
        monthTicks.enter()
          .append("path")
          .attr("class","monthLine")
          .attr("d", lineFunction);
        monthTicks.exit().remove();
        
        periodNameSVG = monthCont.selectAll('.period')
          .data(periodNames);
        periodNameSVG.enter()
          .append('text')
          .attr("class","period")
          .attr("transform", "rotate(90)")
          .attr("text-anchor", "middle")
          .text(function(d){return d.name;})
          .attr("transform", function(d){return 'translate(' + xScale(d.pos) + ',' +yScale(0) + ')rotate(90)';});
        periodNameSVG.exit().remove();
      });      
    }
    
    return {
      render : render,
      init : calcSpiral
    }
  })(window,d3);
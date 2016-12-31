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
        colorScale.domain([lowerLimit, (lowerLimit+upperLimit)/2, upperLimit]).range(["#440154", "#21918c", "#fde725"]);
        var y = ["#440154","#440256","#450457","#450559","#46075a","#46085c","#460a5d","#460b5e","#470d60","#470e61","#471063","#471164","#471365","#481467","#481668","#481769","#48186a","#481a6c","#481b6d","#481c6e","#481d6f","#481f70","#482071","#482173","#482374","#482475","#482576","#482677","#482878","#482979","#472a7a","#472c7a","#472d7b","#472e7c","#472f7d","#46307e","#46327e","#46337f","#463480","#453581","#453781","#453882","#443983","#443a83","#443b84","#433d84","#433e85","#423f85","#424086","#424186","#414287","#414487","#404588","#404688","#3f4788","#3f4889","#3e4989","#3e4a89","#3e4c8a","#3d4d8a","#3d4e8a","#3c4f8a","#3c508b","#3b518b","#3b528b","#3a538b","#3a548c","#39558c","#39568c","#38588c","#38598c","#375a8c","#375b8d","#365c8d","#365d8d","#355e8d","#355f8d","#34608d","#34618d","#33628d","#33638d","#32648e","#32658e","#31668e","#31678e","#31688e","#30698e","#306a8e","#2f6b8e","#2f6c8e","#2e6d8e","#2e6e8e","#2e6f8e","#2d708e","#2d718e","#2c718e","#2c728e","#2c738e","#2b748e","#2b758e","#2a768e","#2a778e","#2a788e","#29798e","#297a8e","#297b8e","#287c8e","#287d8e","#277e8e","#277f8e","#27808e","#26818e","#26828e","#26828e","#25838e","#25848e","#25858e","#24868e","#24878e","#23888e","#23898e","#238a8d","#228b8d","#228c8d","#228d8d","#218e8d","#218f8d","#21908d","#21918c","#20928c","#20928c","#20938c","#1f948c","#1f958b","#1f968b","#1f978b","#1f988b","#1f998a","#1f9a8a","#1e9b8a","#1e9c89","#1e9d89","#1f9e89","#1f9f88","#1fa088","#1fa188","#1fa187","#1fa287","#20a386","#20a486","#21a585","#21a685","#22a785","#22a884","#23a983","#24aa83","#25ab82","#25ac82","#26ad81","#27ad81","#28ae80","#29af7f","#2ab07f","#2cb17e","#2db27d","#2eb37c","#2fb47c","#31b57b","#32b67a","#34b679","#35b779","#37b878","#38b977","#3aba76","#3bbb75","#3dbc74","#3fbc73","#40bd72","#42be71","#44bf70","#46c06f","#48c16e","#4ac16d","#4cc26c","#4ec36b","#50c46a","#52c569","#54c568","#56c667","#58c765","#5ac864","#5cc863","#5ec962","#60ca60","#63cb5f","#65cb5e","#67cc5c","#69cd5b","#6ccd5a","#6ece58","#70cf57","#73d056","#75d054","#77d153","#7ad151","#7cd250","#7fd34e","#81d34d","#84d44b","#86d549","#89d548","#8bd646","#8ed645","#90d743","#93d741","#95d840","#98d83e","#9bd93c","#9dd93b","#a0da39","#a2da37","#a5db36","#a8db34","#aadc32","#addc30","#b0dd2f","#b2dd2d","#b5de2b","#b8de29","#bade28","#bddf26","#c0df25","#c2df23","#c5e021","#c8e020","#cae11f","#cde11d","#d0e11c","#d2e21b","#d5e21a","#d8e219","#dae319","#dde318","#dfe318","#e2e418","#e5e419","#e7e419","#eae51a","#ece51b","#efe51c","#f1e51d","#f4e61e","#f6e620","#f8e621","#fbe723","#fde725"]
        var q = [];
        for (var i = 0; i<11; i++){
          q.push(y[Math.round((y.length-1)/10*i)]);
        }
        console.log(q);
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
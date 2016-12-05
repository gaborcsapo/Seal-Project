var locSelection;
var depthSelection = [];
var depthSlider;
var lowerDepth = 0;
var upperDepth = 100;
var timeSelection;
var timeSlider;
var lowerTime = new Date('2009.01.01');
var upperTime = new Date('2018.01.01');
var dateParts;

function makeLocSelection(){
    locSelection = _.pick(sdata, queryKeys);
    var max = 0, key;
    for (key in locSelection) {
        for (var i = 0; i < locSelection[key].points.length; i++){
            if (locSelection[key].points[i].depth > max)
                max = locSelection[key].points[i].depth
        }
    }
    depthSlider.slider("option", "max", max);
    console.log(locSelection)
    makeTimeSelection();
}

function makeTimeSelection(){
    queryKeys = [];
    for (key in locSelection) {
        dateParts =locSelection[key].date.split('/');
        if (new Date(dateParts[2],dateParts[0]-1,dateParts[1]) > lowerTime && new Date(dateParts[2],dateParts[0]-1,dateParts[1]) < upperTime)
            queryKeys.push(key)
    }
    timeSelection = _.pick(locSelection, queryKeys);
    makeDepthSelection()
}

function makeDepthSelection(){
    queryKeys = [];
    for (key in timeSelection) {
        for (var i = 0; i < timeSelection[key].points.length; i++){
            if (timeSelection[key].points[i].depth > lowerDepth && timeSelection[key].points[i].depth < upperDepth)
                depthSelection.push({'id': key, 'loc':timeSelection[key].loc, 'depth':timeSelection[key].points[i].depth, 'sal':timeSelection[key].points[i].sal, 'temp':timeSelection[key].points[i].temp})
        }
    }
    console.log(depthSelection);
}

$(document).ready(function(){
  $(function() {
    depthSlider = $( "#depth-slider" ).slider({
      range: true,
      min: 0,
      max: 60,
      values: [ 10, 30 ],
      slide: function( event, ui ) {
        lowerDepth = (ui.values[ 0 ]);
        upperDepth = (ui.values[ 1 ]);
        $( "#depthamount" ).val( ((ui.values[ 0 ]).toString() ) + " - " + ((ui.values[ 1 ]).toString() ) );
      },
      change: function( event, ui ) {makeDepthSelection(ui)}
    });
    $( "#depthamount" ).val( ($( "#depth-slider" ).slider( "values", 0 )) +
      " - " + ($( "#depth-slider" ).slider( "values", 1 )));
  });
  $(function() {
    timeSlider = $( "#time-slider" ).slider({
      range: true,
      min: new Date('2010.01.01').getTime() / 1000,
      max: new Date('2016.01.01').getTime() / 1000,
      step: 86400,
      values: [ new Date('2011.01.01').getTime() / 1000, new Date('2013.02.01').getTime() / 1000 ],
      slide: function( event, ui ) {
          lowerTime = new Date(ui.values[ 0 ] *1000);
          upperTime = new Date(ui.values[ 1 ] *1000);
          $( "#timeamount" ).val( (new Date(ui.values[ 0 ] *1000).toDateString() ) + " - " + (new Date(ui.values[ 1 ] *1000)).toDateString() );
      }
    });
    $( "#timeamount" ).val( (new Date($( "#time-slider" ).slider( "values", 0 )*1000).toDateString()) +
      " - " + (new Date($( "#time-slider" ).slider( "values", 1 )*1000)).toDateString());
  });
})
  

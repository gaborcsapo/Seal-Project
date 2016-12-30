var selectedShape,
infowindow,
colorButtons = {},
marker_list = [],
shape_list = [],
containQuery,
putLocations,
location_list = [],
putLocations = function(){},
queryKeys = [],
markerSet = 0,
markerList = [],
markerLine;

var labels = 'AB';
var labelIndex = 0;


function clearSelection () {
    if (selectedShape) {
        if (selectedShape.type !== 'marker') 
            selectedShape.setEditable(false);
        selectedShape = null;
    }
}

function setSelection (shape) {
    if (shape.type !== 'marker') {
        clearSelection();
        shape.setEditable(true);
    }
    selectedShape = shape;
}

function deleteSelectedShape () {
    if (selectedShape){
        for (var i=0; i<=shape_list.length;i++){
            if (_.isEqual(selectedShape,shape_list[i])){
                shape_list.splice(i,1);
                 selectedShape.setMap(null);
            }
        }
    }
}      

function loadedMap(){
    let promiseMap = new Promise((resolve, reject) => {
        console.log('map is created'); 
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 69.184529, lng: -50.462265},
            zoom: 8,
            mapTypeId: 'satellite',
            streetViewControl: false
        }); 
        var markerImage = new google.maps.MarkerImage('img/marker.png',
                new google.maps.Size(12, 12),
                new google.maps.Point(0, 0),
                new google.maps.Point(6, 6));
        var locationImage = new google.maps.MarkerImage('img/location.png',
                new google.maps.Size(16, 16),
                new google.maps.Point(0, 0),
                new google.maps.Point(8, 8));
        
        // Properties of drawable objects
        var polyOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true,
            draggable: true
        };
        markerLine = new google.maps.Polyline({
            strokeColor: 'red',
            strokeOpacity: 0.5,
            strokeWeight: 3,
            geodesic: true,
            map: map
        });
        
        // Creates a drawing manager attached to the map that allows the user to draw markers, lines, and shapes.
        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker', 'polygon']
            },
            markerOptions: {
                icon: markerImage,
                draggable: false,
                label: labels[labelIndex++ % labels.length]
            },
            polylineOptions: {
                editable: true,
                draggable: true
            },
            polygonOptions: polyOptions,
            map: map
        });

        // Put Locations on Map: adds markers and marker clusters to the map. Gets called after the map and data are loaded
        putLocations = function(){
            return new Promise(function (resolve, reject) {
                var singleMarker;
                var markers = Object.keys(sdata).map(function(key, i){return function(innerKey){
                    infowindow = new google.maps.InfoWindow({
                        content: '<div id="individual"></div>'
                    });
                    google.maps.event.addListener(infowindow, 'domready', function() {
                        // Reference to the DIV which receives the contents of the infowindow using jQuery
                        var iwOuter = $('.gm-style-iw');
                        /* The DIV we want to change is above the .gm-style-iw DIV.
                            * So, we use jQuery and create a iwBackground variable,
                            * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
                            */
                        var iwBackground = iwOuter.prev();
                        // Remove the background shadow DIV
                        iwBackground.children(':nth-child(2)').css({'display' : 'none'});
                        // Remove the white background DIV
                        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
                    });
                    singleMarker = new google.maps.Marker({
                        position: sdata[innerKey]['loc'],
                        icon: locationImage,
                        title: (innerKey + "\n" + sdata[innerKey]['date'])
                    });
                    google.maps.event.addListener(singleMarker,'click', function(e) {
                        infowindow.open(map, this);
                        updateIndividual(e, innerKey);
                    });
                    return singleMarker;
                }(key)});
                    
                // Add a marker clusterer to manage the markers.
                var markerCluster = new MarkerClusterer(map, markers,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            });
        }

        // Shape is Drawn: whenever a shape or marker is drawn this overlaycomplete event fires
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
            console.log(labelIndex);
            var newShape = e.overlay; 
            newShape.type = e.type;
            if (newShape.type == 'polygon'){
                shape_list.push(newShape);
            } else if (newShape.type == 'marker') {
                drawingManager.markerOptions = {
                    icon: markerImage,
                    draggable: false,
                    label: labels[labelIndex++ % labels.length]
                };

                //there can be only 2 markers and if there are 2 we should connect them
                marker_list.push(e);
                if (marker_list.length >2){
                    marker_list[0].overlay.setMap(null);
                    marker_list.shift();
                }
                if (marker_list.length == 2)
                    markerLine.setPath([marker_list[0].overlay.getPosition(), marker_list[1].overlay.getPosition()]);
            }

            // Drawing related
            if (e.type !== google.maps.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                drawingManager.setDrawingMode(null);
                // Add an event listener that selects the newly-drawn shape when the user mouses down on it.
                google.maps.event.addListener(newShape, 'click', function (e) {
                    if (e.vertex !== undefined) {
                        if (newShape.type === google.maps.drawing.OverlayType.POLYGON) {
                            var path = newShape.getPaths().getAt(e.path);
                            path.removeAt(e.vertex);
                            if (path.length < 3) 
                                newShape.setMap(null);
                        }
                        if (newShape.type === google.maps.drawing.OverlayType.POLYLINE) {
                            var path = newShape.getPath();
                            path.removeAt(e.vertex);
                            if (path.length < 2) 
                                newShape.setMap(null);
                        }
                    }
                    setSelection(newShape);
                });
                setSelection(newShape);
            }
            else {
                google.maps.event.addListener(newShape, 'click', function (e) {
                    setSelection(newShape);
                });
                setSelection(newShape);
            }
        });
        
        // Drawing related
        google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
        google.maps.event.addListener(map, 'click', clearSelection);
        google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);     
    });

    //LocationQuery: based on the shapes drawn it starts to query the data
    function locationQuery (){
        return new Promise(function (resolve, reject) {
            queryKeys = [];
            for (var key in sdata) {
                for (var i=0; i<shape_list.length; i++){
                    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(sdata[key]['loc']), shape_list[i])){
                        queryKeys.push(key);
                        break;
                    } 
                } 
            }
            return queryKeys;
        });
    }

    function loadedFiles(){
        putLocations().then(function(x){
            console.log('Data is on the map');
            $('#map + .spinner').css('display', 'none');
        }());
    }

    promiseMap
    .then(promiseFile1
    .then(function(data){return createDataPoint(data)
    .then(promiseFile2
    .then(function(data){return createDataPoint(data)
    .then(promiseFile3
    .then(function(data){return createDataPoint(data)
    .then(promiseFile4
    .then(function(data){return createDataPoint(data)
    .then(promiseFile5
    .then(function(data){return createDataPoint(data)
    .then(promiseFile6
    .then(function(data){return createDataPoint(data)
    .then(promiseFile7
    .then(function(data){return createDataPoint(data)
    .then(promiseFile8
    .then(function(data){return createDataPoint(data)
    .then(promiseFile9
    .then(function(data){return createDataPoint(data)
    .then(loadedFiles())
    }))}))}))}))}))}))}))}))})); 

    $( "#makeSel" ).click(function() {
        if((marker_list.length == 2) && (shape_list.length !== 0)){       
            $('#scatterplot + .spinner + .initial').css('display', 'none');
            $('#temp + .spinner + .initial').css('display', 'none');
            $('#sal + .spinner + .initial').css('display', 'none');
            
            $('#scatterplot + .spinner').css('display', 'block');
            $('#sal + .spinner').css('display', 'block');
            $('#temp + .spinner').css('display', 'block');
            locationQuery().then(
            makeLocSelection().then(
            makeTimeSelection().then(
            makeDepthSelection().then(
            aggregateDays().then(
            tempSpiral.init().then(
            tempSpiral.render().then(
            salSpiral.init().then(
            salSpiral.render().then(
            ScatterPlot.init().then(
            ScatterPlot.render().then(
            function(){
                $('#sal + .spinner').css('display', 'none');
                $('#temp + .spinner').css('display', 'none');
                $('#scatterplot + .spinner').css('display', 'none');
            }())))))))))));
        }
    });
      
}

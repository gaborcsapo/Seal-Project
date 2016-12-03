var drawingManager;
var selectedShape;
var colorButtons = {};
var marker_list = [];
var shape_list = [];
var containQuery;
var putLocations;
var location_list = [];
var putLocations = function(){};
var locSelection;
var queryKeys;

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
        for (var i=0; i<=marker_list.lenght;i++){
            if (selectedShape.equals(marker_list[i]))
                marker_list.splice(i,1);
        }
        selectedShape.setMap(null);
    }
        
}

function finishedLoading(){
    let promiseMap = new Promise((resolve, reject) => {
        console.log('map is created');
        
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 69.184529, lng: -50.462265},
            zoom: 8,
            mapTypeId: 'satellite',
            streetViewControl: false
        });
        
        var markerImage = new google.maps.MarkerImage('img/marker.png',
                new google.maps.Size(10, 10),
                new google.maps.Point(0, 0),
                new google.maps.Point(5, 5));
        var locationImage = new google.maps.MarkerImage('img/location.png',
                new google.maps.Size(5, 5),
                new google.maps.Point(0, 0),
                new google.maps.Point(2.5, 2.5));
        
        var polyOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true,
            draggable: true
        };
        // Creates a drawing manager attached to the map that allows the user to draw
        // markers, lines, and shapes.
        drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['marker', 'polygon']
            },
            markerOptions: {
                icon: markerImage,
                draggable: true
            },
            polylineOptions: {
                editable: true,
                draggable: true
            },
            polygonOptions: polyOptions,
            map: map
        });

        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
            var newShape = e.overlay; 
            newShape.type = e.type;
            shape_list.push(newShape);
            
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

            locationQuery();

        });
        //Only allow 2 markers to be on the map
        google.maps.event.addListener(drawingManager, 'markercomplete', function (e) {
            marker_list.push(e);
            if (marker_list.length >2){
                marker_list[0].setMap(null);
                marker_list.shift();
            }
        })
        
        // Clear the current selection when the drawing mode is changed, or when the
        // map is clicked.
        google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
        google.maps.event.addListener(map, 'click', clearSelection);
        google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);

        putLocations = function(){
            console.log('locations are being put');
            var singleMarker;
            var markers = Object.keys(sdata).map(function(key, i){
                singleMarker = new google.maps.Marker({
                        position: sdata[key]['loc'],
                        icon: locationImage,
                        title: key
                    });
                    google.maps.event.addListener(singleMarker, 'click', function (e) {
                        updateIndividual(this.getTitle());
                    })
                    return singleMarker;
            })
            // Add a marker clusterer to manage the markers.
            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        }     
    });

    function locationQuery (){
        promise = new Promise(function (resolve, reject) {
            queryKeys = [];
            for (var key in sdata) {
                for (var i=0; i<shape_list.length; i++){
                    if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(sdata[key]['loc']), shape_list[i])){
                        queryKeys.push(key);
                        break;
                    } 
                } 
            }
        });
        promise.then(makeSelection())
    } 
    
    function makeSelection(){
        locSelection = _.pick(sdata, queryKeys);
        console.log(locSelection);
    }

    promiseMap.then(promiseFile1
        .then(function(data){return createDataPoint(data)
            .then(promiseFile2
                .then(function(data){return createDataPoint(data)
                    .then(promiseFile3
                        .then(function(data){return createDataPoint(data)
                            .then(putLocations())}))}))}));   
}

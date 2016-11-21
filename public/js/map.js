var drawingManager;
var selectedShape;
var colorButtons = {};
var marker_list = [];
var shape_list = [];
var containQuery;
var putLocations;
var location_list = [];


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

function initMap () {
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

    containQuery = function(mylong, mylat){
        for (var i=0; i<shape_list.length; i++){
            if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng({lat: mylat, lng: mylong}), shape_list[i])){
                console.log("Contained");
                break;
            } else {
                console.log("Not contained");
            }
        }  
    }

    putLocations = function(){
        var singleMarker;
        var markers = locations.map(function(location, i) {
            singleMarker = new google.maps.Marker({
                position: location,
                icon: locationImage,
                title: location.id
            });
            google.maps.event.addListener(singleMarker, 'click', function (e) {
                updateIndividual(singleMarker.title);
            })
            return singleMarker;
        });
        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }

    var locations = [
    {lat: -31.563910, lng: 147.154312,id: "1"},
    {lat: -33.718234, lng: 150.363181,id: "2"},
    {lat: -33.727111, lng: 150.371124,id: "3"},
    {lat: -33.848588, lng: 151.209834,id: "4"},
    {lat: -33.851702, lng: 151.216968,id: "5"},
    {lat: -34.671264, lng: 150.863657,id: "6"},
    {lat: -35.304724, lng: 148.662905,id: "7"},
    {lat: -36.817685, lng: 175.699196,id: "8"},
    {lat: -36.828611, lng: 175.790222,id: "9"},
    {lat: -37.750000, lng: 145.116667,id: "99"},
    {lat: -37.759859, lng: 145.128708,id: "45"},
    {lat: -37.765015, lng: 145.133858,id: "34"},
    {lat: -37.770104, lng: 145.143299,id: "23"},
    {lat: -37.773700, lng: 145.145187,id: "12"},
    {lat: -37.774785, lng: 145.137978,id: "15"},
    {lat: -37.819616, lng: 144.968119,id: "12"},
    {lat: -38.330766, lng: 144.695692,id: "13"},
    {lat: -39.927193, lng: 175.053218,id: "14"},
    {lat: -41.330162, lng: 174.865694,id: "15"},
    {lat: -42.734358, lng: 147.439506,id: "16"},
    {lat: -42.734358, lng: 147.501315,id: "17"},
    {lat: -42.735258, lng: 147.438000,id: "18"},
    {lat: -43.999792, lng: 170.463352,id: "19"}
    ]

    putLocations();
}


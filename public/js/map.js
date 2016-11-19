var drawingManager;
var selectedShape;
var colorButtons = {};

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
    if (selectedShape)
        selectedShape.setMap(null);
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
        
        if (e.type !== google.maps.drawing.OverlayType.MARKER) {
            // Switch back to non-drawing mode after drawing a shape.
            drawingManager.setDrawingMode(null);
            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
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

    // Clear the current selection when the drawing mode is changed, or when the
    // map is clicked.
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
    google.maps.event.addListener(map, 'click', clearSelection);
    google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
}


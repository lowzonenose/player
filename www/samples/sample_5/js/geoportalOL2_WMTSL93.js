/*
 * Copyright (c) 2008-2014 Institut National de l'information Geographique et forestiere France, released under the
 * BSD license.
 */
var map= null;

/**
 * Function: initMap
 * Load the application. Called when all information have been loaded by
 * <loadAPI>().
 */
function initMap() {

    // get Lambert 93 projection
    var epsg2154= new OpenLayers.Projection("EPSG:2154") ;
        
    // Bounding box (max extent) in Lambert 93
    var bounds = new OpenLayers.Bounds(10000,6000000,1250000,7150000);

    // Tile Matrix Set resolutions
    var resolutionsL93 = [
        104579.224549894,
        52277.5323537905,
        26135.4870785954,
        13066.8913818,
        6533.2286041135,
        3266.5595244627,
        1633.2660045974,
        816.629554986,
        408.3139146768,
        204.1567415109,
        102.0783167832,
        51.0391448966,
        25.5195690743,
        12.7597836936,
        6.379891636,
        3.1899457653,
        1.5949728695,
        0.7974864315
    ];

    // tile origin (top left corner)
    var tileOrigin = new OpenLayers.LonLat(0,12000000);

    // map initialization, with Lambert 93 projection
    map = new OpenLayers.Map({
        div: "viewerDiv",
        projection: epsg2154,
        units: "meters",
        resolutions: resolutionsL93,
        maxExtent: bounds,
        controls:[
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.NavToolbar(),
            new OpenLayers.Control.LayerSwitcher({'ascending':false}),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.KeyboardDefaults(),
            new OpenLayers.Control.Attribution()
        ]
    });  

    // WMTS layer creation (orthophotos)
    var wmts = new OpenLayers.Layer.WMTS({
        name:"Orthos WMTS L93",
        url:"http://wxs.ign.fr/"+[config.keyJsL93]+"/proxy-wmts",
        layer:"ORTHOIMAGERY.ORTHOPHOTOS.BDORTHO.L93",
        style:"normal",
        matrixSet:"LAMB93",
        tileOrigin:tileOrigin,
        isBaseLayer: true
    });
    map.addLayer(wmts);

    // set map center and zoom (L93 coordinates)
    var centerL93 = new OpenLayers.LonLat(600000, 6650000);
    map.setCenter(centerL93, 6);

}

/**
 * Function: loadAPI
 * Load the configuration related with the API keys.
 * Called on "onload" event.
 * Call <initMap>() function to load the interface.
 */
function loadAPI() {
    // wait for all classes to be loaded
    // on attend que les classes soient chargées
    if (checkApiLoading('loadAPI();',['OpenLayers','Geoportal'])===false) {
        return;
    }

    // load API keys configuration, then load the interface
    // on charge la configuration de la clef API, puis on charge l'application
     Geoportal.GeoRMHandler.getConfig([config.keyJsL93], null, null, {
        onContractsComplete: initMap
    });
}

// assign callback when "onload" event is fired
// assignation de la fonction à appeler lors de la levée de l'évènement
// "onload"
window.onload= loadAPI;

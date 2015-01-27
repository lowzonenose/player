/*
 * Copyright (c) 2008-2014 Institut National de l'information Geographique et forestiere France, released under the
 * BSD license.
 */

/**
 * Function: initMap
 * Load the application. Called when all information have been loaded by
 * <loadAPI>().
 */
function initMap() {
    //The api is loaded at this step
    //L'api est chargée à cette étape
    
    var carteLayerConf= Geoportal.Catalogue.CONFIG["GEOGRAPHICALGRIDSYSTEMS.MAPS$GEOPORTAIL:OGC:WMTS"] ;
   
    var viewer = new Cesium.Viewer('viewerDiv', {
        baseLayerPicker : false,
        timeline : false,
        geocoder : false,
        animation : false
      });

    var scene = viewer.scene;

    //adds the landscape layer to the globe
    //ajoute le relief au globe
    var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
        url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
    });

    scene.terrainProvider = cesiumTerrainProviderMeshes;
    
    var layers = viewer.scene.imageryLayers;
    //adds the wmts geoportal layer
    //ajoute la couche wmts geoportail
    var ignMapLayer = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url :  gGEOPORTALRIGHTSMANAGEMENT[gGEOPORTALRIGHTSMANAGEMENT.apiKey].resources['GEOGRAPHICALGRIDSYSTEMS.MAPS:WMTS'].url,     //   'http://wxs.ign.fr/CLE/geoportail/wmts'
        layer : 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
        style : carteLayerConf.layerOptions.style,            // 'normal'
        format : carteLayerConf.serviceParams["WMTS"].format, // 'image/jpeg'
        tileMatrixSetID : carteLayerConf.layerOptions.matrixSet,          // 'PM'
        credit : new Cesium.Credit("IGN", "http://wxs.ign.fr/static/logos/IGN/IGN.gif", "http://www.ign.fr/")
    	})
    );
    //sets the transparency of the layer
    //regle la transparence de la couche
    ignMapLayer.alpha = 0.5;
    
    //centers the map on the defined rectangle
    //centre la carte sur le rectangle défini
    var west = 6.07;
    var south = 45.00;
    var east = 6.02;
    var north = 45.05;
    scene.camera.viewRectangle(Cesium.Rectangle.fromDegrees(west, south, east, north));
    //Zoomes to the given elevation in meters (by default, elevation = 100000m)
    //Zoom à l'altitude donnée en mètres (par default, altitude = 100000m)
    scene.camera.zoomIn(50000);
    //Tilt the view
    //Incline la vue 
    scene.camera.lookUp(Cesium.Math.toRadians(85));
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
    // if (checkApiLoading('loadAPI();',['OpenLayers','Geoportal','Cesium'])===false) {
    //    return;
    // }

    // load API keys configuration, then load the interface
    // on charge la configuration de la clef API, puis on charge l'application
    Geoportal.GeoRMHandler.getConfig([config.key3d], null, null, {
        onContractsComplete: initMap
    });
}

// assign callback when "onload" event is fired
// assignation de la fonction à appeler lors de la levée de l'évènement
// "onload"
window.onload= loadAPI;

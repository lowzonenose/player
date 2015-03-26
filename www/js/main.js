// Place third party dependencies in the external folder
// Configure loading modules from the lib directory,
// except 'modules' ones, 
requirejs.config({
    // my lib
    "baseUrl": "js/lib",
    "paths": {
        // my module
        "module": "../modules",
        "ui"    : "../modules/ui",
        // my config
        "config": "../cfg/config",
        // framework internal
        "cm"    : "../thirdparty/codemirror",
        // framework external
        "jquery": "../external/jquery",
        "jquery-ui": "../external/jquery-ui",
        "log4js": "../external/log4javascript",
        "promise" : "../external/promise",
        // zip
        "zip"       : "../external/jszip",
        "zip-utils" : "../external/jszip-utils",
        "zip-utils-ie" : "../external/jszip-utils-ie",
        "zip-save"  : "../external/FileSaver"
       
    }
});

// Load the main appplication module to start the application
requirejs(["module/playgroundjs"], function (PlayGroundJS) {

    var player  = null;
    var options = {
        div: 'PlayGroundJS',
        onsuccess : function (e) {
            console.log(e);
        },
        onerror : function (e) {
            console.log(e);
        }
    };
    
    $( document ).ready(function() {
        console.log( "document is ready");
        
        player = new PlayGroundJS(options);
        player.load();
    });

    $( window ).load(function() {
        console.log("window loaded");
        player.resize();
    });
    
    $( window ).resize(function() {
        console.log("window resized");
        player.resize();
    });
    
});

requirejs.onError = function (err) {
    /* 
        err has the same info as the errback callback:
        err.requireType & err.requireModules
    */
    console.log(err.requireType);
    // Be sure to rethrow if you don't want to
    // blindly swallow exceptions here!!!
};

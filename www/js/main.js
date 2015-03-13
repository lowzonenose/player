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
        "log4js": "../external/log4javascript",
        "promise" : "../external/promise",
        // zip
        "zip"       : "../external/jszip",
        "zip-utils" : "../external/jszip-utils",
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

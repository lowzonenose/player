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
        // jquery
        "jquery": "../external/jquery",
        // codemirror (cf. ../external/codemirror/FIXME) :
        //      "cm-lib"       : "../external/codemirror/codemirror",
        //      "cm-htmlmixed" : "../external/codemirror/mode/htmlmixed/htmlmixed",
        //      "cm-javascript": "../external/codemirror/mode/javascript/javascript",
        //      "cm-css"       : "../external/codemirror/mode/css/css",
        //      "cm-xml"       : "../external/codemirror/mode/xml/xml"
        "log4js": "../external/log4javascript/log4javascript_uncompressed",
        // "uri"   : "../external/URI",
        // jszip
        "zip"       : "../external/jszip",
        "zip-utils" : "../external/jszip-utils",
        "zip-save"  : "../external/FileSaver",
       
    }
});

// Load the main appplication module to start the application
requirejs(["module/playgroundjs"], function (PlayGroundJS) {

    var player  = null;
    var options = {
        div: 'PlayGroundJS',
        onload  : function (e) {
            console.log('message INFO  : ' + e);
        },
        onerror : function (e) {
            console.log('message ERROR : ' + e);
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

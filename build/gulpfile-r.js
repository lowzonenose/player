({
    // INFO
    // A command line tool for running JavaScript scripts that use the Asychronous 
    // Module Defintion API (AMD) for declaring and using JavaScript modules and 
    // regular JavaScript script files.
    // It is part of the RequireJS project, and works with the RequireJS implementation
    // of AMD.
    //      cf. README https://github.com/jrburke/r.js
    //      cf. SAMPLE https://github.com/jrburke/r.js/blob/master/build/example.build.js
    
    baseUrl:"../www/js/",
    mainConfigFile : "../www/js/main.js",
    
    // FIXME
    // doit on garder les licences des librairies tierces ou les ajouter nous même ? 
    preserveLicenseComments: false,
    
    paths: {
        
        // my module
        module: "modules",
        ui    : "modules/ui",
        
        // my lib
        config : "lib/config",
        helper : "lib/helper",
        cdn : "lib/cdn",
        dependency : "lib/dependency",
        download : "lib/download",
        logger : "lib/logger",
        settings : "lib/settings",
        sort : "lib/sort",
        type : "lib/type",
        syntaxhighlighter : "lib/syntaxhighlighter",
        
        // framework
        
        jquery: "empty:",
        log4js: "empty:",
        cm    : "empty:",
        
        // INFO :
        // possibilité de ne ps prendre en compte les lib. externes !
        // jquery: "external/jquery",
        // log4js: "external/log4javascript/log4javascript_uncompressed",
        // cm    : "external/codemirror",
        
        // zip
        "zip"       : "empty:",
        "zip-utils" : "empty:",
        "zip-save"  : "empty:",
        
        // INFO :
        // possibilité de ne ps prendre en compte les lib. externes !
        // "zip"       : "external/jszip",
        // "zip-utils" : "external/jszip-utils",
        // "zip-save"  : "external/FileSaver",
        
    },
    // INFO :
    // traitement d'un répertoire
    // modules: [{name: "main"}],
    // dir: "target/build-r/js/",
    
    // INFO :
    // traitement d'un fichier
    include: ['main'],
    out: "target/build-r/js/main.js",
    
    keepBuildDir: false,
    
    skipDirOptimize: false,
    
    // INFO
    // How to optimize all the JS files in the build output directory.
    //  - "uglify": (default) uses UglifyJS to minify the code.
    //  - "uglify2": in version 2.1.2+. Uses UglifyJS2.
    //  - "closure": uses Google's Closure Compiler
    //  - "closure.keepLines": Same as closure option, but keeps line returns
    // in the minified files.
    //  - "none": no minification will be done.
    optimize: 'uglify2'
})
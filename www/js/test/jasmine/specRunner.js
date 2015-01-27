(function() {
  'use strict';

    // Configure RequireJS to shim Jasmine
    requirejs.config({

        baseUrl: '../../lib',
        paths: {
            'jasmine': '../test/jasmine/lib/jasmine/jasmine',
            'jasmine-html': '../test/jasmine/lib/jasmine/jasmine-html',
            'boot': '../test/jasmine/lib/jasmine/boot',
            'jszip': "../test/jasmine/lib/jszip", 
            'jquery': "../test/jasmine/lib/jquery"
        },

        shim: {
            jasmine: {
                exports: 'window.jasmineRequire'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            },
            'boot': {
            deps: ['jasmine', 'jasmine-html'],
            exports: 'window.jasmineRequire'
          }
        }
    });

    var specs = [];
    specs.push('../test/jasmine/spec/specHelper');
    specs.push('../test/jasmine/spec/specType');
    specs.push('../test/jasmine/spec/specCdn');
    specs.push('../test/jasmine/spec/specDependency');
    specs.push('../test/jasmine/spec/specDownload');
    specs.push('../test/jasmine/spec/specSyntaxHighlighter');
    
    require(['boot'], function () {

        // Load the specs
        require(specs, function () {

            // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
            window.onload();
        });
    });
  
})();
    // code javascript Exemple 2
    var iv= null;
    window.onload= function() {
        iv= Geoportal.load(
            // div's ID:
            'viewerDiv',
            // API's keys:
            [config.keyJsAll],
            {// map's center :
                // longitude:
                lon:2.731525,
                // latitude:
                lat:45.833333
            },
            null,
            {
              language:'fr',
              geormUrl: config.serverUrl
            }
        );
    };
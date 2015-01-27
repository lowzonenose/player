    // code javascript Exemple 4
    var iv= null;
    window.onload= function() {
        iv= Geoportal.load(
            // div's ID:
            'viewerDiv',
            // API's keys:
            ['e4i6cff4ot440vro0byfkciw'],
            {// map's center :
                // longitude:
                lon:2.731525,
                // latitude:
                lat:45.833333
            },
            null,
            {
              language:'fr',
              geormUrl: 'http://wxs.ign.fr/$key$/autoconf/'
            }
        );
    };
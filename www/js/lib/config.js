define({
    
   /**
    * DESCRIPTION
    *  Gestion de la configuration de l'application en fonction de l'environnement 
    *  de deploiement.
    * 
    *  ex. Configuration de Production
    *  - logger: {
    *       active: false,
    *       level: "ERROR"
    *    }
    *  - proxy: {
    *       php: "",
    *       perl: "",
    *       jsp: "/servlet/proxy"
    *    }
    *  - api: {
    *       url:'http://api.ign.fr/geoportail/api/js/',
    *       version:"2.1.1"                 
    *    }
    *  - ...
    *  
    */
   
    application: {
        logger: {
            active: true,
            level: "DEBUG"
        },
        data: "samples/",              // Repertoire par defaut des exemples
        archive: "samples/archives/",  // Repertoire par defaut des archives des exemples
        proxy: "http://localhost:8084/api-servlets/api/xmlproxy",                 
            // liste des proxy disponibles (hors servlet) !
            // php: "/proxy/php/proxy.php",
            // perl: "/proxy/perl/proxy.pl",
            // jsp: "/servlet/proxy"
        servlet: {
            download: "http://localhost:8084/api-servlets/api/save",
            compress: "http://localhost:8084/api-servlets/api/compress"
        }
    },
    api: {
        url:'http://api.ign.fr/geoportail/api/js/', // ex. en dev. = http://localhost:8093/api/js/ 
        version:"2.1.1"                             // ex. en dev. = 2.1.1-SNAPSHOT,2.1.0-SNAPSHOT
    }
});

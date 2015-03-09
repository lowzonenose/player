define({
    
   /**
    * DESCRIPTION
    * 
    *  Gestion de la configuration de l'application par defaut.
    *  
    *  En fonction de l'environnement de deploiement (local, dev, qualif, prod),
    *  il faudra surcharge ces parametres.
    * 
    *  ex. Configuration de Production
    *  ```javascript
    *  - logger: {
    *       active: false,
    *       level: "ERROR"
    *    }
    *  ```  
    *  ```javascript
    *  - proxy:"/servlet/proxy"
    *  ```
    *  // possibilité de surcharger ces params. dans l'url
    *  ```javascript
    *  - api: {
    *       url:'http://api.ign.fr/geoportail/api/js/',
    *       version:"2.1.1"                 
    *    }
    *  - ...
    *  ```
    */
   
    application: {
        // logger
        logger: {
            active: true,
            level: "DEBUG"
        },
        // Repertoire par defaut des exemples et des archives
        data: "samples/",              
        archive: "samples/archives/", 
        // liste des proxy disponibles (embarqués dans le projet) !
        // php: "/proxy/php/proxy.php",
        // perl: "/proxy/perl/proxy.pl",
        // jsp: "/servlet/proxy"
        proxy: ""
    },
    // params. surchargeable dans l'url
    api: {
        url:'http://api.ign.fr/geoportail/api/js/', // ex. en dev. = http://localhost:8093/api/js/ 
        version:"2.1.1"                             // ex. en dev. = 2.1.1-SNAPSHOT,2.1.0-SNAPSHOT
    }
});

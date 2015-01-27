define([ 
        "jszip"
    ], function (JSZip) {
    
    /**
     * DESCRIPTION
     *   Gestion des téléchargements des exemples au format 'zip'.
     *   
     * INFORMATION
     *   types de fonctionnement selon les parametres d'entrée :
     *    - cas n° 1 : Une archive est fournie 
     *                  donc transfert par URL-HREF 
     *    - cas n° 2 : Une liste de fichier est fournie 
     *                  donc compression et transfert par DATA-URL ou XHR
     *    - cas n° 3 : contenu d'un fichier HTML
     *                  donc compression et transfert par DATA-URL ou XHR
     *    
     *  +ieurs mode de téléchargements (param. interne)
     *  Par defaut, en mode XHR ()
     *      {
     *        mode : (
     *          "XHR",
     *          "URI",
     *          "JSP"  // TODO cross-domain possible donc proxy !?
     *          )
     *       } 
     * 
     * USAGE
     * 
     *   // cas n° 1 
     *   var options = { 
     *      scope    : this,        // cf. notes  
     *      archive  : "exemple",   // ex. exemple.zip
     *      base     : "./www/site/download/",
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     *   // cas n° 2
     *   var options = {  
     *      scope    : this,                // cf. notes 
     *      archive  : "exemple",           // ex. exemple.zip
     *      base     : "./www/site/download/",
     *      files    : ["exemple",          // cad structure de fichiers
     *                  "exemple/file.js", 
     *                  "exemple/file.html",
     *                  "exemple/file.css"], 
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     *   // cas n° 3
     *   var options = {  
     *      scope    : this,             // cf. notes 
     *      archive  : exemple"",        // ex. exemple.zip
     *      base     : "",               // vide ou null...
     *      content  : "some content !", // cad contenu d'un fichier
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     * NOTES
     * 
     *   l'option 'scope' permet d'interagir avec la fonction 'callback':
     *   Si "scope : this", le this du callback renvoie l'objet player.
     *   Par defaut, si le scope n'est pas renseignée, this est associé à l'objet 
     *   'Download'.
     *   
     * RETURN
     * 
     *  cf. callback
     *  
     * SEE ASLO
     * 
     */
    
    "use strict";
    
    function Download(options) {
        
        if (!(this instanceof Download)) {
            throw new TypeError("Download constructor cannot be called as a function.");
        }
        
        this.settings = options || {};
        this.instance = 0;
        
        // obligatoire donc par defaut, on renseigne qqchose !
        if (this.settings.archive == null ||
            this.settings.archive == "") {
            this.settings.archive = Download.PARAMS_ARCHIVE_NAME;
        }

        // cas n° 1
        //  uniquement un envoie de l'archive 
        //  { 
        //      archive: "exemples", 
        //      base: "..."
        //  }
        if (this.settings.files == null &&
            this.settings.content == null) {
        
            // obligatoire
            if (this.settings.base == null ||
                this.settings.base == "") {
                throw new Error("No base url ?!");
            }
            
            this.instance = 1;
        }
        
        // cas n° 2
        //  compression et envoie des fichiers
        //  { 
        //      archive: "exemples", 
        //      base: "...", 
        //      files: []
        //  }
        if (this.settings.files != null) {
            
            // au cas où..., un seul fichier possible...
            if (typeof this.settings.files === "string") {
                this.settings.files = [this.settings.files];
            }
            
            // exception
            if (this.settings.files.length == 0) {
                throw new Error("No files ?!");
            }
            
            // obligatoire
            if (this.settings.base == null ||
                this.settings.base == "") {
                throw new Error("No base url ?!");
            }
            
            this.instance = 2;
            
            throw new ReferenceError("Not yet implemented !");
            
        }
        
        // cas n° 3
        // envoie du contenu dans un fichier HTML
        //  { 
        //      archive: "exemple",
        //      content: "qsdqdqscqsc"
        //  }
        if (this.settings.content != null) {
            
            if (this.settings.content == "") {
                throw new Error("Content value is empty ?!");
            }
            
            if (typeof this.settings.content !== "string") {
                throw new Error("Content value must be a string ?!");
            }
            
            this.instance = 3;
            
            throw new ReferenceError("Not yet implemented !");
        }

        // callback à mettre en place 
        //  * onsuccess 
        //  * onfailure
        if (this.settings.onsuccess == null) {
            this.settings.onsuccess = function(message) {
                console.log("[INTERNE] success : " + message);
            };
        }
        
        if  (this.settings.onfailure == null) {
            this.settings.onfailure = function(message) {
                throw new Error("[INTERNE] failure : " + message);
            };
        }
        
        var mode = this.settings.mode;
        if (mode != null) {
            if (! _checkMode(mode)) {
                throw new Error("mode unknown !?");
            }
        } 
        else { // par defaut...
            this.settings.mode = Download.DEFAULT_MODE;
        }
    };
    
    function _checkMode (mode) {
            
        // test du mode 
        var bgood = false;
        for(var i=0; i<Download.MODES.length; i++) {
            if (Download.MODES[i] == mode) {
                bgood = true;
                break;
            }
        }

        return bgood;
    };
    
    // mode d'impl. du téléchargement...
    Download.MODES        = ["URL", "URI", "TAG"];
    Download.DEFAULT_MODE = Download.MODES[0];
    
    // params par defaut de l'archive
    Download.PARAMS_ARCHIVE_NAME = "exemple";
    Download.PARAMS_ARCHIVE_EXT  = "zip";
    
    Download.prototype = {
        
        constructor: Download,
        
        send : function () {
            
            switch (this.getMode()) {
                
                case "TAG":
                    this._sendWithModeTAG();
                    break;
                    
                case "URI":
                    this._sendWithModeXHRtoURI();
                    break;
                    
                // par defaut !
                case "URL":
                    this._sendWithModeXHRtoURL();
                    
                default:
                    throw new Error("mode unknown !?");
            }
            
        },
        
        save : function () {
            
            throw new ReferenceError("Not yet implemented !");
            
        },
        
        zip : function () {
            
            throw new ReferenceError("Not yet implemented !");

            // Browser support and resulting filename :
            // * Opera    : "default.zip"	
            // * Firefox  : random alphanumeric with ".part" extension	
            // * Safari   : "Unknown" (no extension)	
            // * Chrome   : "download.zip" on OSX and Linux, just "download" on Windows	
            // * IE       : No

            // TODO
            // cf. http://stuk.github.io/jszip/documentation/examples/download-zip-file.html
            // cf. https://github.com/eligrey/FileSaver.js
            // cf. http://eligrey.com/blog/post/saving-generated-files-on-the-client-side/
            // cf. https://github.com/eligrey/Blob.js/blob/master/Blob.js
            
        },
        
        /**
         * Méthode de téléchargements 
         */
        
        _sendWithModeTAG: function () {
            
            var $self = this;
            
            // INFO
            // mode avec la mise en place de la balise 
            //   '<a href=... download=... />'
            // puis, execution de l'event 'click'
            
            
            // FIXME 
            // compatibilité difficile entre navigateur
            //   * FF 34       : NOK
            //   * Chromium 39 :  OK
            //   * Opera 12.16 :  OK
            //   * IE          : ???
            
            // FIXME
            // - archive avec extension 'zip' uniquement !
            // - test sur le path de l'url
            
            
            var archive_name = 
                    Download.PARAMS_ARCHIVE_NAME + '.' + 
                    Download.PARAMS_ARCHIVE_EXT;
            
            var archive_url = $self.settings.base 
                            + '/'
                            + $self.settings.archive 
                            + '.zip';
            
            var elt = document.createElement('a');
            elt.setAttribute('href', archive_url);
            elt.setAttribute('download', archive_name);
            if (elt.addEventListener) {
                elt.addEventListener("click",
                    function(event){
                        console.log("addEventListener : " + event);
                        $self.settings.onsuccess("[mode:URIonTAG][addEventListener] cool!");
                    },
                    true
                );
            }
            else if (elt.attachEvent) {
                elt.attachEvent('onclick', 
                    function(event){
                        console.log("attachEvent : " + event);
                        $self.settings.onsuccess("[mode:URIonTAG][attachEvent] cool!");
                    }
                );
            }
            else {
                $self.settings.onfailure("[mode:URIonTAG] Gestionnaire d'evenements non pris en compte sur ce navigateur !?");
            }
            
            // execute !
            elt.click();
        },
        
        _sendWithModeXHRtoURI: function () {
            
            var $self = this;
            
            // INFO
            // cf. http://hackworthy.blogspot.fr/2012/05/savedownload-data-generated-in.html
            // cf. http://openclassrooms.com/courses/ajax-et-l-echange-de-donnees-en-javascript/l-objet-xmlhttprequest-1
            // mode requête XHR avec URI data scheme
            
            // INFO 
            // cf. "data URI scheme"
            // cf. http://en.wikipedia.org/wiki/Data_URI_scheme
            // cf. http://webreflection.blogspot.fr/2011/08/html5-how-to-create-downloads-on-fly.html
            
            // FIXME 
            // compatibilité difficile entre navigateur 
            //   * FF 34       :  OK but not allow to define a file name (random name)
            //   * Chromium 39 :  OK
            //   * Opera 12.16 :  OK but not allow to define a file name (random name)
            //   * IE          :  ??
            
            // FIXME
            // - cf. cdn.js pour la compatibilité sous IE
            // - probleme de contexte de 'this' (impl. du scope)
            // - comment capturer le message d'erreur envoyé par XHR
            
            
            var archive_url = $self.settings.base 
                            + '/'
                            + $self.settings.archive 
                            + '.zip';
                    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", archive_url, true);
            xhr.responseType = "blob";
            xhr.overrideMimeType('application/zip');
            
            xhr.onerror= function(e) {
                var message = "[mode:XHR][URI] Errors Occured on Http Request with XMLHttpRequest !" ;
                
                if ($self.settings.scope) {
                    $self.settings.onfailure.call($self.settings.scope, message);
                } else {
                    $self.settings.onfailure(message);
                }
            };
            
            xhr.onload = function(e) {
                // je recupère une reponse de type 'blob' !
                var blob   = xhr.response;
                
                var reader = new FileReader();
            
                reader.onload = function (event) {
                    var contents = event.target.result;
                    console.log("[mode:XHR][URI] File contents: " + contents);
                    // FIXME 
                    // comment determiner le nom de l'archive finale ?
                    document.location = contents;
                    if ($self.settings.onsuccess !== null && typeof $self.settings.onsuccess === 'function') {
                        if ($self.settings.scope) {
                            // this : Player class
                            $self.settings.onsuccess.call($self.settings.scope, "[mode:XHR][URI] cool!");
                            // this : FileReader class
                            // $self.settings.onsuccess.call(this, "[mode:XHR][URI] cool!");
                        } else {
                            // this : Download class
                            $self.settings.onsuccess.call($self, "[mode:XHR][URI] cool!");
                        }
                    }
                };

                reader.onerror = function(event) {
                    var message = "[mode:XHR][URI] File could not be read! Code " + event.target.error.code;
                    if ($self.settings.onfailure !== null && typeof $self.settings.onfailure === 'function') {
                        if ($self.settings.scope) {
                            $self.settings.onfailure.call($self.settings.scope, message);
                        } else {
                            $self.settings.onfailure.call($self, message);
                        }
                    }
                };

                reader.readAsDataURL(blob);
            };
            xhr.onreadystatechange = function(e) {
                // cf. cdn.js
            };
            
            xhr.send();
        },
        
        _sendWithModeXHRtoURL: function () {
            throw new ReferenceError("Not yet implemented !");
        },
        
        /**
         * Getter/Setter
         */
        
        setMode: function (mode) {
            this.settings.mode = mode;
        },
        
        getMode: function () {
            return this.settings.mode;
        },
        
        getModes: function () {
            return Download.MODES;
        },
        
        setOptions: function (options) {
            this.settings = options || {};
        },
        
        getOptions: function () {
            return this.settings;
        }

    };
    
    return Download;
});
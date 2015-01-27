define([ 
        "jszip"
    ], function (JSZip) {
    
    /**
     * DESCRIPTION
     *   Gestion des téléchargements des exemples au format 'zip'.
     *   
     * INFORMATION
     *   2 types de fonctionnement :
     *    - cas n° 1 : Une archive est fournie pour transfert
     *    - cas n° 2 : Une liste de fichier est fournie pour compression puis transfert 
     *    - cas n° 3 : export d'un contenu dans un fichier HTML
     *    
     *  +ieurs mode de téléchargements 
     *      {mode : ("HREF","XHR","DATA","JSP")} 
     * 
     * USAGE
     * 
     *   // cas n° 1 
     *   var options = { 
     *      archive: "exemple", // ex. exemple.zip
     *      base: "./www/site/download/",
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     *   // cas n° 2
     *   var options = { 
     *      archive: "exemple", // exemple.zip
     *      base: "./www/site/download/",
     *      files: ["exemple", 
     *              "exemple/file.js", 
     *              "exemple/file.html",
     *              "exemple/file.css"], // structure de fichiers
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     *   // cas n° 3
     *   var options = { 
     *      archive: "", // vide 
     *      base: "",    // vide 
     *      content: "some content !", // contenu d'un fichier
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     *   
     * RETURN
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
        this.isAlreadyCompress  = true;
        this.isArchive          = true;
        
        // cas n° 1
        //  envoie de l'archive 
        //  { 
        //      archive: "exemples", 
        //      base: "..."
        //  }
        //      => isAlreadyCompress = true
        //      => isArchive         = true
        
        if (this.settings.archive == null) {
            this.settings.archive = Download.PARAMS_ARCHIVE_NAME;
        }
        
        if (this.settings.mode == null) {
            this.setMode("HREF");
        }
        
        // exception sur le mode de téléchargement ?
        if (! checkMode(this.settings.mode)) {
            throw new Error("Mode de téléchargement inconnu !?");
        }
        
        // exception sur l'url de base ?
        if (this.settings.base == null) {
            throw new Error("No base url ?!");
        }

        // cas n° 2
        //  compression + envoie des fichiers
        //  { 
        //      archive: "exemples", 
        //      base: "...", 
        //      files: []
        //  }
        //      => isAlreadyCompress = false
        //      => isArchive         = true
        
        if (this.settings.files != null) {
            
            if (typeof this.settings.files === "string") {
                this.settings.files = [this.settings.files];
            }
            
            if (this.settings.files.length == 0) {
                throw new Error("No files ?!");
            }
            
            this.isAlreadyCompress = false;
        }
        
        // cas n° 3
        // envoie du contenu dans un fichier HTML
        //  { 
        //      archive: "", // vide
        //      base: "",    // vide
        //      content: "qsdqdqscqsc"
        //  }
        //      => isAlreadyCompress = false
        //      => isArchive         = false
        
        if (this.settings.files   == null &&
            this.settings.content != null) {
            
            if (typeof this.settings.content !== "string") {
                 throw new Error("Content value must be a string ?!");
            }
             
            this.isAlreadyCompress = false;
            this.isArchive         = false;
        }
        
        // TODO 
        // callback à mettre en place sur le mode 
        // XHR, 
        // HREF(?)
        // DATA(?)
        //  * onsuccess 
        //  * onfailure

    };
    
    function checkMode (mode) {
            
        // test du mode 
        var bgood = false;
        for(var i=0; i<Download.MODE.length; i++) {
            if (Download.MODE[i] == mode) {
                bgood = true;
                break;
            }
        }

        return bgood;
    };
    
    // mode d'impl. du téléchargement...
    Download.MODE = ["XHR","HREF","DATA", "JSP"];
    
    // params par defaut
    Download.PARAMS_ARCHIVE_NAME = "exemple";
    Download.PARAMS_ARCHIVE_EXT  = "zip";
    
    Download.prototype = {
        
        constructor: Download,
        
        send : function () {
            
            if (this.isArchive) {
                
                // cas n° 1
                if (this.isAlreadyCompress) {

                    var url = this.settings.base 
                            + '/'                      // TODO test à faire !
                            + this.settings.archive 
                            + '.zip';                  // FIXME uniquement du ZIP ?!

                    switch (this.getMode()) {
                        case "HREF" :
                            // mode en HREF
                            this._modeHREF(url);
                            break;
                        case "XHR" :
                            // mode en XHR
                            this._modeXHR(url);
                            break;
                        case "DATA" :
                            // mode en Data Url
                            this._modeDataUrl(url);
                            break;
                        case "JSP" :
                            // mode servlet 

                            // une servlet fournit l'archive, avec possibilité de configurer 
                            // un proxy à cause du cross domain

                            throw new ReferenceError("Not yet implemented !");
                            break;
                        default :
                            throw new Error("Mode de téléchargement inconnu !?");
                    }
                }
                // cas n° 2
                else if (! this.isAlreadyCompress) {

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

                }
                // autre cas ???
                else {
                    
                }
            } 
            // cas n° 3
            else {
                
                throw new ReferenceError("Not yet implemented !");
                
            }
        },
        
        /**
         * Méthode de téléchargements 
         */
        _modeHREF : function (url) {
            
            // FIXME compatibilité dificile entre navigateur
            //   * FF 34       : NOK
            //   * Chromium 39 :  OK
            //   * Opera 12.16 :  OK
            //   * IE          : ???
            
            // mode avec mise en place d'une balise '<a href=.../>'            
            var elt = document.createElement('a');
            elt.setAttribute('href', url);
            elt.setAttribute('download', Download.PARAMS_ARCHIVE_NAME + '.' + Download.PARAMS_ARCHIVE_EXT); // FIXME nom d'archive fixe ?
            if (elt.addEventListener) {elt.addEventListener("click",function(){console.log("addEventListener");},true);}
            else if (elt.attachEvent) {elt.attachEvent('onclick', function(){console.log("attachEvent");});}
            else {throw new Error("Gestionnaire d'evenements non pris en compte sur ce navigateur !?");}
            elt.click();   
        },
        
        _modeXHR: function (url) {
            // cf. http://hackworthy.blogspot.fr/2012/05/savedownload-data-generated-in.html
            
            // FIXME compatibilité dificile entre navigateur 
            //   * FF 34       :  OK but not allow to define a file name (random name)
            //   * Chromium 39 :  OK
            //   * Opera 12.16 :  OK but not allow to define a file name (random name)
            //   * IE          :  ??
            
            var $self = this;
            
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "blob";
            xhr.overrideMimeType('application/zip');
            xhr.onerror= function(e) {
                throw new Error("Errors Occured on Http Request with XMLHttpRequest !");
            };
            xhr.onload = function(e) {
                // je recupère une reponse de type 'blob' !
                var blob   = xhr.response;
                
                var reader = new FileReader();
            
                reader.onload = function (event) {
                    var contents = event.target.result;
                    console.log("File contents: " + contents);
                    // FIXME comment determiner le nom de l'archive ?
                    document.location = contents;
                    if ($self.settings.onsuccess !== null && typeof $self.settings.onsuccess === 'function') {
                        $self.settings.onsuccess("cool!");
                    }
                };

                reader.onerror = function(event) {
                    var message = "File could not be read! Code " + event.target.error.code;
                    if ($self.settings.onfailure !== null && typeof $self.settings.onfailure === 'function') {
                        $self.settings.onfailure(message);
                    }
                };

                reader.readAsDataURL(blob);
            };
            xhr.onreadystatechange = function(e) {
                // cf. cdn.js
            };
            
            xhr.send();
        },
        
        _modeDataUrl: function (url) {
            // INFO sur "data URI scheme"
            // cf. http://en.wikipedia.org/wiki/Data_URI_scheme
            // cf. http://webreflection.blogspot.fr/2011/08/html5-how-to-create-downloads-on-fly.html
            
            throw new ReferenceError("Not yet implemented !");

            // FIXME 
            // compatibilité entre navigateur
            //   * FF 34       :  
            //   * Chromium 39 :  
            //   * Opera 12.16 :  
            //   * IE          :  ??? the size of the data uri 
            
            // comment obtenir un objet blob à partir d'un path vers l'archive (file to blob) ?
            var blob = null;
            
            var reader = new FileReader();
            
            reader.onload = function (event) {
                var contents = event.target.result;
                console.log("File contents: " + contents);
                //// FIXME comment determiner le nom de l'archive ?
                document.location = contents;
            };
            
            reader.onerror = function(event) {
                console.error("File could not be read! Code " + event.target.error.code);
            };
            
            reader.readAsDataURL(blob);

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
        
        setOptions: function (options) {
            this.settings = options || {};
        },
        
        getOptions: function () {
            return this.settings;
        }

    };
    
    return Download;
});
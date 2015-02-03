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
     *                  donc simple transfert (mode URI, URL ou TAG)
     *    - cas n° 2 : Une liste de fichier est fournie 
     *                  donc compression et transfert (mode URI)
     *    - cas n° 3 : contenu d'un fichier HTML
     *                  donc compression et transfert (mode URI, URL)
     *    
     *  +ieurs mode de téléchargements (param. interne, orienté !)
     *  Par defaut, en mode URI :
     *      {
     *        mode : (
     *          "TAG",
     *          "URL",
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
     *   Si "scope : this", le this du callback renvoie l'objet 'player'.
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

        // callback  
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
                default:    
                    this._sendWithModeXHRtoURL();

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
        
        /****************************
         * Méthode de téléchargements 
         ****************************/
        
        /**
         * Mise en place d'une balise <a> dans le "document", 
         * et execution de l'evenement "click()".
         * 
         * @returns {undefined}
         */
        _sendWithModeTAG: function () {
            
            var $self = this;
            
            // INFO
            // mode avec la mise en place de la balise 
            //   '<a href=... download=... />'
            // puis, execution de l'event 'click'
            
            // FAKE
            // à cause d'un BUG sous FF, il faut mettre en place reellement la balise 
            // de téléchargement mais cachée :
            // '<a href=... download=... style="visibility: hidden;" />'
            
            // FIXME 
            // compatibilité entre navigateur
            //   * FF 34       :  OK
            //   * FF 35       :  OK
            //   * Chromium 39 :  OK
            //   * Opera 12.16 :  OK
            //   * IE          : ???
            
            var archive_name = 
                    Download.PARAMS_ARCHIVE_NAME + '.' + 
                    Download.PARAMS_ARCHIVE_EXT;
            
            var archive_url = $self.settings.base 
                            + '/'
                            + $self.settings.archive 
                            + '.zip'; // FIXME, extension en dur !
            
            // id de la balise
            var id  = "_download_archive_sample";
            
            var elt = null;
            var elt = document.getElementById(id);
            if (elt === undefined || elt === null) {
                
                elt = document.createElement('a');
                elt.setAttribute('id', id);
                elt.setAttribute('href', archive_url);
                elt.setAttribute('download', archive_name);
                elt.setAttribute('style', "visibility: hidden;");
                
                document.body.appendChild(elt);
            
                if (elt.addEventListener) {
                    elt.addEventListener("click",
                        function(event){
                            console.log("addEventListener : " + event);
                            $self.settings.onsuccess("[mode:TAG][addEventListener] cool!");
                        },
                        false
                    );
                }
                else if (elt.attachEvent) { // IE+
                    elt.attachEvent('onclick', 
                        function(event){
                            console.log("attachEvent : " + event);
                            $self.settings.onsuccess("[mode:TAG][attachEvent] cool!");
                        }
                    );
                }
                else { // au cas où...
                    $self.settings.onfailure("[mode:TAG] Gestionnaire d'evenements non pris en compte sur ce navigateur !?");
                }
            }
            
            // execute !
            elt.click();
        },
        
        /**
         * Mise en place d'une requête XHR avec passage du content de l'archive 
         * en URI data scheme.
         * appel de "document.location"
         * 
         * @returns {undefined}
         */
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
            // compatibilité entre navigateur 
            //   * FF 34       :  OK but not allow to define a file name (random name)
            //   * Chromium 39 :  OK
            //   * Opera 12.16 :  OK but not allow to define a file name (random name)
            //   * IE          :  ??
            
            // FIXME
            // - probleme de contexte de 'this' (impl. du scope)
            // - comment capturer le message d'erreur envoyé par XHR
            
            
            var archive_url = $self.settings.base 
                            + '/'
                            + $self.settings.archive 
                            + '.zip';
            
            var XHR = null;
            
            var callbackOnLoad  = function() {
                // INFO 
                // je recupère une reponse de type 'blob' !
                var blob   = XHR.response;

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
                            $self.settings.onsuccess.call($self.settings.scope, "[mode:XHR][URI] All that's cool !");
                            // this : FileReader class
                            // $self.settings.onsuccess.call(this, "[mode:XHR][URI] cool!");
                        } else {
                            // this : Download class
                            $self.settings.onsuccess.call($self, "[mode:XHR][URI] All that's cool!");
                        }
                    }
                };

                reader.onerror = function(event) {
                    var code     = event.target.error.code;
                    var response = event.target.responseText;
                    var message = "[mode:XHR][URI] Errors Occured with FileReader (" + response + ") !";
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
            var callbackOnError = function(message) {
                if ($self.settings.scope) {
                    $self.settings.onfailure.call($self.settings.scope, message);
                } else {
                    $self.settings.onfailure(message);
                }
            };
            
            if (XMLHttpRequest) {
                
                console.log("XMLHttpRequest");
                
                XHR = new XMLHttpRequest();
                XHR.open("GET", archive_url, true);
                XHR.responseType = "blob";
                XHR.overrideMimeType('application/zip');

                XHR.onerror = function () {
                        var message = "[mode:XHR][URI] Errors Occured on Http Request with XMLHttpRequest !" ;
                        callbackOnError(message);
                    };

                XHR.onreadystatechange = function(e) {

                    if (XHR.readyState == 4) { // DONE

                            if (XHR.status == 200) {

                                callbackOnLoad();

                            } 
                            else {
                                var message = "[mode:XHR][URI] Errors Occured on Http Request with XMLHttpRequest (Status != 200) !";
                                if ($self.settings.onfailure !== null && typeof $self.settings.onfailure === 'function') { 
                                    if ($self.settings.scope) {
                                        $self.settings.onfailure.call($self.settings.scope, message);
                                    } else {
                                        $self.settings.onfailure.call($self, message);
                                    }
                                }
                            }
                        }
                };

                XHR.send();
            }
            else if(XDomainRequest) { // IE+
                    console.log("Xdomain");
                    
                    XHR = new XDomainRequest();
                    XHR.open('GET', archive_url);
                    
                    XHR.onerror = function () {
                        var message = "[mode:XHR][URI] Errors Occured on Http Request with XMLHttpRequest !" ;
                        callbackOnError(message);
                    };
                    XHR.onload  = callbackOnLoad;
                    XHR.send();
            } 
            else {
                throw new Error('CORS not supported');
            }
        },
        
        /**
         * Create an object URL for the binary data (blob) from the XHR response.
         * 
         * @returns {undefined}
         */
        _sendWithModeXHRtoURL: function () {
            
            // INFO
            // cf. http://blogs.adobe.com/webplatform/2012/01/17/displaying-xhr-downloaded-images-using-the-file-api/

            // FIXME 
            // compatibilité entre navigateur
            //   * FF 34       :  OK
            //   * FF 35       :  OK
            //   * Chromium 39 :  OK
            //   * Opera 12.16 : NOK
            //   * IE          : ???
            
            var $self = this;
            
            var archive_url = $self.settings.base 
                            + '/'
                            + $self.settings.archive 
                            + '.zip';
            
            var XHR = null;
            var callbackOnLoad  = function() {
                
                var imageObjectURL = window.URL.createObjectURL(XHR.response);
                
                // INFO 
                // ouverture d'une fenetre avec l'URL de l'archive...
                window.open(imageObjectURL);
                
                if ($self.settings.onsuccess !== null && typeof $self.settings.onsuccess === 'function') {
                    if ($self.settings.scope) {
                        // this : Player class
                        $self.settings.onsuccess.call($self.settings.scope, "[mode:XHR][URL] All that's cool : " + imageObjectURL);
                        // this : FileReader class
                        // $self.settings.onsuccess.call(this, "[mode:XHR][URL] cool!");
                    } else {
                        // this : Download class
                        $self.settings.onsuccess.call($self, "[mode:XHR][URL] All that's cool : " + imageObjectURL);
                    }
                }
            };
            var callbackOnError = function(message) {
                if ($self.settings.scope) {
                    $self.settings.onfailure.call($self.settings.scope, message);
                } else {
                    $self.settings.onfailure(message);
                }
            };
            
            if (XMLHttpRequest) {
                
                console.log("XMLHttpRequest");
                
                XHR = new XMLHttpRequest();
                XHR.open("GET", archive_url, true);
                XHR.responseType = "blob";
                XHR.overrideMimeType('application/zip');

                XHR.onerror = function () {
                        var message = "[mode:XHR][URL] Errors Occured on Http Request with XMLHttpRequest !" ;
                        callbackOnError(message);
                    };

                XHR.onreadystatechange = function(e) {

                    if (XHR.readyState == 4) { // DONE

                            if (XHR.status == 200) {

                                callbackOnLoad();

                            } 
                            else {
                                var message = "[mode:XHR][URL] Errors Occured on Http Request with XMLHttpRequest (Status != 200) !";
                                if ($self.settings.onfailure !== null && typeof $self.settings.onfailure === 'function') { 
                                    if ($self.settings.scope) {
                                        $self.settings.onfailure.call($self.settings.scope, message);
                                    } else {
                                        $self.settings.onfailure.call($self, message);
                                    }
                                }
                            }
                        }
                };

                XHR.send();
            }
        },
        
        /***************
         * Getter/Setter
         ***************/
        
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
define([ 
        "jquery",
        // dependances zip lib.
        "zip",
        "zip-utils",
        "zip-save",
        // libs. 
        "sort"
    ], function ($, JSZip, JSZipUtils, JSFileSave, Sort) {
    
    /**
     * DESCRIPTION
     *   Gestion des téléchargements des exemples au format 'zip'.
     *   Gestion de la construction  des archives au format 'zip'.
     *   
     * INFORMATION
     *   types de fonctionnement selon les parametres d'entrée :
     *    - cas n° 1 : Une archive est fournie 
     *                  donc simple transfert
     *                  on peut choisir un mode de téléchargement.
     *    - cas n° 2 : Une liste de fichier est fournie 
     *                  donc compression et transfert (mode URI)
     *    
     *  Il existe +ieurs mode de téléchargements (param. interne !)
     *  Par defaut, on utilise le mode TAG :
     *  cf. notes !
     *      {
     *        mode : (
     *          "TAG", // insertion d'une balise <a>
     *          "URL", // requete XHR
     *          "URI"  // requete XHR
     *          )
     *       } 
     * 
     * USAGE
     * 
     *   // cas n° 1 
     *   var options = { 
     *      scope    : this,        // cf. notes !
     *      mode     : "URI",       // cf. notes !
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
     *      files    : ["exemple/",
     *                  "exemple/file.js", 
     *                  "exemple/file.html",
     *                  "exemple/file.css"], 
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     *   // cas n° 2 avec gestion des contents
     *   var options = {  
     *      scope    : this,             // cf. notes  
     *      archive  : "exemple",        // ex. exemple.zip
     *      base     : "./www/site/download/",               
     *      files    : [
     *                  {path: "sample/"},
                        {path: "sample/file.1",content:"test contenu!"},
                        {path: "sample/file.2",content:"test contenu!"}"
                       ] 
     *      onsuccess: callback,
     *      onfailure: callback,
     *   };
     *   var dl = new Download(options);
     *   dl.send();
     *   
     * NOTES
     * 
     *  - scope
     *   l'option 'scope' permet d'interagir avec la fonction 'callback':
     *   Si "scope : this", le this du callback renvoie l'objet 'player'.
     *   Par defaut, si le scope n'est pas renseignée, this est associé à l'objet 
     *   'Download'.
     *   
     *  - mode
     *   l'option 'mode' est utile dans le cas d'un téléchargement d'une archive. 
     *   par defaut, on est dans le mode 'TAG'.
     *   (fonctionnalité orientée maintenance !)
     *   
     * RETURN
     * 
     *  une archive !
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

        // gestion des path : on verifie le '/' final !
        if (this.settings.base != null ||
            this.settings.base != "") {
            var baseUrl = this.settings.base;
            if (baseUrl.lastIndexOf("/")+1 !== baseUrl.length) {
                this.settings.base = baseUrl+"/";
            }
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
        
        // mode de téléchargement utilisé
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
    Download.MODES        = ["TAG", "URL", "URI"];
    Download.DEFAULT_MODE = Download.MODES[0];
    
    // params par defaut de l'archive
    Download.PARAMS_ARCHIVE_NAME = "exemple";
    Download.PARAMS_ARCHIVE_EXT  = "zip";
    
    Download.prototype = {
        
        constructor: Download,
        
        send : function () {
            
            switch(this.instance) {
                
                // oups...
                case 0:
                    throw new Error("some problems !?");
                    
                // on envoie uniquement une archive.
                case 1:
                    this.sendArchive();
                    break;
                    
                // on construit une archive à partir d'une liste de fichiers
                // puis on l'envoie.
                case 2:
                    this.createArchive();
                    break;
                    
                // un autre cas ???
                case 3:
                    throw new Error("Not yet implemented !");
                    break;
                    
                // pas de choix par defaut...
                default:
                    throw new Error("some problems !?");
                            
            }
            
        },
        
        sendArchive : function () {
            
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
        
        createArchive : function () {
            
            var $self = this;

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
            
            // INFO
            // base : "./www/site/download/"        --> / at the end !     url
            // files :["exemple/",                  --> / at the end !     dir
            //         "exemple/file.0",            --> not / at the end ! file
            //         "exemple/file.1",            --> not / at the end ! file
            //         "exemple/file.2"             --> not / at the end ! file
            //         "exemple/folder0/"           --> / at the end !     dir
            //         "exemple/folder0/file.0"     --> not / at the end ! file
            //         "exemple/folder0/file.1"     --> not / at the end ! file
            //         "exemple/folder0/file.2"     --> not / at the end ! file
            //         "exemple/folder1/"           --> / at the end !     dir   
            //         "exemple/folder1/file.0"     --> not / at the end ! file
            //         "exemple/folder1/file.1"     --> not / at the end ! file
            //         "exemple/folder1/file.2"     --> not / at the end ! file
                
            var zip  = new JSZip();

            var files     = $self.sortFiles($self.settings.files);
            var archive   = $self.settings.archive + '.zip';
            var url       = $self.settings.base;
            
            var deferreds = $self._deferredAddFilesZip(url, files, zip)
            
            if(! deferreds) {
                // TODO
            }
            
            // callback
            var callback_failure = function(message) {
                if ($self.settings.onfailure !== null && typeof $self.settings.onfailure === 'function') {
                    if ($self.settings.scope) {
                        $self.settings.onfailure.call($self.settings.scope, message);
                    } else {
                        $self.settings.onfailure(message);
                    }
                }
            };
            var callback_success = function(message) {
                if ($self.settings.onsuccess !== null && typeof $self.settings.onsuccess === 'function') {
                        if ($self.settings.scope) {
                            // this : Player class
                            $self.settings.onsuccess.call($self.settings.scope, message);
                            // this : FileReader class
                            // $self.settings.onsuccess.call(this, "[mode:XHR][URI] cool!");
                        } else {
                            // this : Download class
                            $self.settings.onsuccess.call($self, message);
                        }
                }
            };
            
            // when everything has been downloaded, we can trigger the dl
            $.when.apply($, deferreds)
                .done(function() {
                    
                    var blob = zip.generate({type:"blob"});

                    // see FileSaver.js
                    saveAs(blob, archive);
                    
                    callback_success("yes!");
                })
                .fail(function (err, source) {
                    callback_failure("Source : " + source + " | ERROR (" + err + ")!");
                });
        },
        
        /****************************
         * Méthode d'archivage 
         ****************************/
        _deferredAddFilesZip : function(url, files, zip) {
            
            var $self = this;
                       
            var deferreds = [];
            var hdl_zip   = null;
            var root_zip  = zip; // racine de zip, toujours un nom du repertoire !
            
            console.log(files);
            
            while(files.length > 0) {
                
                var value = files.shift();
                
                // closure
                (function(v){
                    
                    var path    = null;
                    var content = null;
                    
                    if (typeof v === "string") {
                        console.log("string");
                        path = v;
                    }
                    else {
                        if (v.hasOwnProperty('path')) {
                            path = v.path;
                        }
                        if (v.hasOwnProperty('content')) {
                            content = v.content;
                        }
                    }
                    
                    if (path == null || path == '') {
                        // TODO
                    }
                    
                    // valeur courrante !
                    console.log(path);

                    // gestion des path : on supprime les debut de path "./" ou "/" !
                    if (path.indexOf('./', 0) === 0) {path=path.substring(2);}
                    if (path.indexOf('/' , 0) === 0) {path=path.substring(1);}

                    //  source to target path 
                    var filepath_source = url + path;
                    var filepath_target = path;
                    
                    // file or directory ?
                    if (filepath_target.lastIndexOf("/")+1 === filepath_target.length) {
                        
                        // c'est un repertoire !
                        var dirs = filepath_target.split("/");
                        hdl_zip  = root_zip;
                        for(var i=0; i<dirs.length; i++) { 
                            var dirname = dirs[i];
                            if (dirname) {
                                hdl_zip = hdl_zip.folder(dirname);
                                console.log("> add directory : " + dirname);
                            }
                        }
                        return true;
                    }
                    
                    // c'est un fichier !
                    var filename_target = filepath_target.substring(filepath_target.lastIndexOf("/")+1);
                    console.log("> add file : " + filename_target + " into the last directory");
                    deferreds.push($self._deferredAddFileZip(filepath_source, filename_target, content, hdl_zip));

                })(value);
                
            }
            return deferreds;
        },
        
        _deferredAddFileZip : function(source, target, content, zip ) {
            var deferred = $.Deferred();
            if (!content) {
                JSZipUtils.getBinaryContent(source, function (err, data) {
                    if(err) {
                        deferred.reject(err, source);
                    } else {
                        zip.file(target, data, {binary:true});
                        deferred.resolve(data);
                    }
                });
            }
            else {
                zip.file(target, content, {binary:true});
                deferred.resolve(content);
            }
            
            return deferred;
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
            //   * IE          :  OK
            
            var archive_name = 
                    Download.PARAMS_ARCHIVE_NAME + '.' + 
                    Download.PARAMS_ARCHIVE_EXT;
            
            var archive_url = $self.settings.base 
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
            //   * IE          : NOK car l'URI risque d'etre trop grande pour IE !!!
            
            // FIXME
            // - probleme de contexte de 'this' (impl. du scope)
            // - comment capturer le message d'erreur envoyé par XHR
            
            
            var archive_url = $self.settings.base 
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
            //   * IE          : NOK car pb de sécurité à ouvrir une fenetre ?!
            
            var $self = this;
            
            var archive_url = $self.settings.base 
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
            else if(XDomainRequest) { // IE+
                    console.log("Xdomain");
                    
                    XHR = new XDomainRequest();
                    XHR.open('GET', archive_url);
                    
                    XHR.onerror = function () {
                        var message = "[mode:XHR][URL] Errors Occured on Http Request with XMLHttpRequest !" ;
                        callbackOnError(message);
                    };
                    XHR.onload  = callbackOnLoad;
                    XHR.send();
            } 
            else {
                throw new Error('CORS not supported');
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
        
        getDefaultMode: function () {
            return Download.DEFAULT_MODE;
        },
        
        setOptions: function (options) {
            this.settings = options || {};
        },
        
        getOptions: function () {
            return this.settings;
        },

        /****************
         * Other function
         ****************/
        sortFiles : function (array) {

            var s = new Sort(array);
            var sort_array = s.pathsort();
            return sort_array;
            
        }
    };
    
    return Download;
});
/**
 * References sur le CORS :
 *  http://www.eriwen.com/javascript/how-to-cors/
 *  https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Browser_compatibility
 *  https://xhr.spec.whatwg.org/
 *  http://arunranga.com/examples/access-control/
 */

define(function () {
    
    /**
     * DESCRIPTION
     *  Gestion des librairies externes à ajouter dans l'exemple,  
     *  via une API de consultation d'un 'Content Delivery Networks for JS'.
     *  
     * INFORMATION 
     *  Par defaut, on télécharge les libraries sur http://api.cdnjs.com/libraries
     *  La recherche se fait via la construction de l'url suivante :
     *    http://api.cdnjs.com/libraries?search=jquery&fields=version
     *    on obtient un objet JSON (liste de resultats).
     *  Cette liste est affichée pour selection dans le menu de la page principale.
     * 
     * USAGE
     *  var cdn = new CDN("codemirror");
     *  // en mode JSON (par defaut)
     *  cdn.request(); 
     *  
     *  // en mode JSONP
     *  var options = { 
     *       mode: "jsonp",                         // par defaut, "json"
     *       url: "http://api.cdnjs.com/libraries", // par defaut
     *       callback: function () {}               // par defaut, cf. fonction 'insert'
     *  }
     *  cdn.request(options); 
     * 
     * RETURN 
     *  Reponse en JSONP ou JSON
     *  Ex. JSONP par defaut
     *  typeof insert === 'function' && insert(
     *  {
     *    results: [
     *     {
     *       name: "codemirror",
     *       latest: "http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.8.0/codemirror.min.js",
     *       version: "4.8.0"
     *     }
     *    ],
     *    total: 1
     *  });
     *  
     * JSONP
     * 
     *  (...)
     *  <select id="liste"></select>
     * 
     *  <script>
     *   function insert(json) {
     *     for(var i=0; i< json.results.length; i++) {
     *       var x = document.getElementById("liste");
     *       var option = document.createElement("option");
     *       option.text = json.results[i].name + json.results[i].version + "(" + json.results[i].latest + ")";
     *       x.add(option);
     *     }
     *   }
     * 
     *   var script = document.createElement('script');
     *   script.src = 'http://api.cdnjs.com/libraries?search=codemirror&fields=version&callback=insert';
     *   document.body.appendChild(script);
     *  </script> 
     *  (...)
     * 
     */
    
    "use strict";
    
    function CDN(library) {
        
        if (!(this instanceof CDN)) {
            throw new TypeError("CDN constructor cannot be called as a function.");
        }
        
        this.library = library;
        
        if (library === null) {
            throw new Error("Param. undefined !");
        }
        
        this.json = {};
        this.settings = {};
        
        
    }
    
    CDN.URL  = "http://api.cdnjs.com/libraries";
    CDN.MODE = "json";
    CDN.CALLBACK = "callback";
    CDN.PARAMS_SEARCH = "search=";
    CDN.PARAMS_FIELDS = "fields=version";
    CDN.PARAMS_CALLBACK = "callback=";
    
    CDN.prototype = {
        
        constructor: CDN,
        
        /**
         * Requête mode GET de type XHR
         * @param {type} options
         * @returns {undefined}
         */
        request: function (options) {
            
            var $self = this;
            
            // en mode par defaut, on fait du CORS !
            $self.settings = options || {
                    mode    : CDN.MODE,
                    url     : CDN.URL,
                    callback: null,
                    onsucess: null, // FIXME ???
                    onerror : null  // FIXME ???
            };
            
            if ($self.settings.mode == null)
                $self.settings.mode = CDN.MODE;
            
            if ($self.settings.url == null)
                $self.settings.url = CDN.URL;
            
            if ($self.settings.callback == null)
                $self.settings.callback = CDN.CALLBACK;
            
            // url
            var url = $self.settings.url + '?' + 
                    CDN.PARAMS_SEARCH + $self.library + '&' +
                    CDN.PARAMS_FIELDS;
            
            if ($self.settings.mode == "jsonp") {
                
                // TODO...
                if (typeof $self.settings.callback === 'string') {
                    url = url + '&' + CDN.PARAMS_CALLBACK + $self.settings.callback;
                    $self._requestScript(url);
                }
                
                // fonction anonyme
                if (typeof $self.settings.callback === 'function') {
                    url = url + '&' + CDN.PARAMS_CALLBACK + CDN.CALLBACK;
                    $self._requestScript(url, true);
                }
                
            }
            else {
               $self._requestXHR(url);
            }
            
            
        },
        
        _requestXHR: function (url) {
            
            var $self = this;
            
            var XHR = null;
            
            if (XMLHttpRequest) {
                console.log("XHR");
                
                XHR = new XMLHttpRequest();
                XHR.open('GET', url, true);
                XHR.onerror = function () {throw new Error("Errors Occured on Http Request with XMLHttpRequest !");};
                XHR.onreadystatechange = function () {

                    if (XHR.readyState == 4) { // DONE
                        if (XHR.status == 200) {
                            $self.json = JSON.parse(XHR.responseText);
                            // callback de la reponse !
                            if ($self.settings.callback !== null && typeof $self.settings.callback === 'function') {
                                $self.settings.callback($self.json.results);
                            }
                        } else {
                            throw new Error("Errors Occured on Http Request Status (" + XHR.status + ") !");
                        }
                    }
                };

                XHR.send();
            }
            else 
                if(XDomainRequest) { // IE+
                    console.log("Xdomain");
                    
                    XHR = new XDomainRequest();
                    XHR.open('GET', url);
                    XHR.onerror = function () {throw new Error("Errors Occured on Http Request with XDomainRequest !");};
                    XHR.onload = function() {
                        $self.json = JSON.parse(XHR.responseText);   
                        if ($self.settings.callback !== null && typeof $self.settings.callback === 'function') {
                            $self.settings.callback($self.json.results);
                        }
                    };
                    XHR.send();
            } 
            else {
                throw new Error('CORS not supported');
            }
        },
        
        _requestScript: function (url, is) {
            
            // INFO
            // cf. http://openclassrooms.com/courses/ajax-et-l-echange-de-donnees-en-javascript/dynamic-script-loading
            
            console.log("Script");
            
            var scriptu, scriptf;
            
            // si callback == function
            if (is) {
                scriptf = document.createElement('script');
                scriptf.innerHTML = 'var' + ' ' + CDN.CALLBACK + ' = ' + this.settings.callback.toString();
                document.body.appendChild(scriptf);
            }
            else { // FIXME ???
                throw new Error("Not Implemented yet !");
            }
            
            scriptu = document.createElement('script');
            scriptu.setAttribute('type', 'text/javascript');
            scriptu.setAttribute('src', url);
            scriptu.setAttribute('charset', 'UTF-8');
            scriptu.setAttribute('id', 'results');

            document.body.appendChild(scriptu);
            
        },
        
        /**
         * TODO
         * Setter/Getter
         */
        setUrl: function(url) {
            
        },
        
        setParams: function (params) {
            
        },
        
        setMode: function(mode) {
            
        },
        
        // ************************************* //
        // Manipulation de la liste de resultats //
        // ************************************* //

        json: function () {
            return this.json;
        },
        
        length: function () {
            return this.json.total;
        },
        
        version: function (index) {
            if (index < this.lenght() || index != null) {
                return this.json.results[index].version;
            }
        }
,
        name: function (index) {
            if (index < this.lenght() || index != null) {
                return this.json.results[index].name;
            }
        },
        
        url: function (index) {
            if (index < this.lenght() || index != null) {
                return this.json.results[index].url;
            }
        }
    };
    
    return CDN;
});
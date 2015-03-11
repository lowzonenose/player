/**
 * Content Delivery Networks
 * @tutorial CDN
 * @module CDN
 */
define(function () {
    
    "use strict";
    
    /**
     * Content Delivery Networks
     * @method CDN
     * @param {String} library - library name to search
     * @return {Object} - Object CDN
     */
    function CDN(library) {
        
        if (!(this instanceof CDN)) {
            throw new TypeError("CDN constructor cannot be called as a function.");
        }
        
        this.library = library;
        
        if (library === null) {
            throw new Error("Param. undefined !");
        }
        
        this.response = {};
        this.settings = {};
        
        
    }
    
    
    CDN.URL  = "http://api.cdnjs.com/libraries";
    CDN.MODE = "json";
    CDN.CALLBACK = "callback";
    CDN.PARAMS_SEARCH = "search=";
    CDN.PARAMS_FIELDS = "fields=version";
    CDN.PARAMS_CALLBACK = "callback=";
    
    CDN.prototype = {
        
        /**
         * Constructor
         * @alias CDN
         * @constructor
         */
        constructor: CDN,
        
        /**
         * Requête mode GET de type XHR
         * @method request
         * @public
         * @param {Object} options
         * @param {Object} options.scope - this (cad objet CDN par defaut)
         * @param {String} options.mode - json (par defaut) ou jsonp
         * @param {String} options.url
         * @param {} options.callback
         */
        request: function (options) {
            
            var $self = this;
            
            // en mode par defaut, on fait du CORS !
            $self.settings = options || {
                    scope    : $self, // l'objet CDN !
                    mode     : CDN.MODE,
                    url      : CDN.URL,
                    callback : null,
                    onsuccess: null, // TODO ???
                    onerror  : null  // TODO ???
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
        
        /**
         * Description
         * @method _requestXHR
         * @param {String} url
         */
        _requestXHR: function (url) {
            
            var $self = this;
            
            var XHR = null;
            
            if (XMLHttpRequest) {
                console.log("XHR");
                
                XHR = new XMLHttpRequest();
                XHR.open('GET', url, true);
                /**
                 * Description
                 * @method onerror
                 * @private
                 */
                XHR.onerror = function () {throw new Error("Errors Occured on Http Request with XMLHttpRequest !");};
                /**
                 * Description
                 * @method onreadystatechange
                 * @private
                 */
                XHR.onreadystatechange = function () {

                    if (XHR.readyState == 4) { // DONE
                        if (XHR.status == 200) {
                            $self.response = JSON.parse(XHR.responseText);
                            // callback de la reponse !
                            
                            if ($self.settings.callback !== null && typeof $self.settings.callback === 'function') {
                                if ($self.settings.scope) {
                                    $self.settings.callback.call($self.settings.scope, $self.response.results);
                                }
                                else {
                                    $self.settings.callback.call($self, $self.response.results);
                                }
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
                    /**
                     * Description
                     * @method onerror
                     * @private
                     */
                    XHR.onerror = function () {throw new Error("Errors Occured on Http Request with XDomainRequest !");};
                    /**
                     * Description
                     * @method onload
                     * @private
                     */
                    XHR.onload = function() {
                        $self.response = JSON.parse(XHR.responseText);   
                        if ($self.settings.callback !== null && typeof $self.settings.callback === 'function') {
                            if ($self.settings.scope) {
                                $self.settings.callback.call($self.settings.scope, $self.response.results);
                            }
                            else {
                                $self.settings.callback.call($self, $self.response.results);
                            }
                        }
                    };
                    XHR.send();
            } 
            else {
                throw new Error('CORS not supported');
            }
        },
        
        /**
         * Description
         * @method _requestScript
         * @param {String} url
         * @param {Boolean} is - is a function or a string ?
         */
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
            else { // FIXME utile ???
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
         * Description
         * @method setUrl
         * @todo Implement this function.
         * @param {String} url
         */
        setUrl: function(url) {
            
        },
        
        /**
         * Description
         * @method setParams
         * @todo Implement this function.
         * @param {} params
         */
        setParams: function (params) {
            
        },
        
        /**
         * Description
         * @method setMode
         * @todo Implement this function.
         * @param {String} mode
         */
        setMode: function(mode) {
            
        },
        
        // ************************************* //
        // Manipulation de la liste de resultats //
        // ************************************* //

        /**
         * Description
         * @method json
         * @return {Object}
         */
        json: function () {
            return this.response;
        },
        
        /**
         * Description
         * @method length
         * @return {Number}
         */
        length: function () {
            return this.response.total;
        },
        
        /**
         * Description
         * @method version
         * @param {Number} index
         * @return {String}
         */
        version: function (index) {
            if (index < this.length() || index != null) {
                return this.response.results[index].version;
            }
        }
,
        /**
         * Description
         * @method name
         * @param {Number} index
         * @return {String}
         */
        name: function (index) {
            if (index < this.length() || index != null) {
                return this.response.results[index].name;
            }
        },
        
        /**
         * Description
         * @method url
         * @param {Number} index
         * @return {String}
         */
        url: function (index) {
            if (index < this.length() || index != null) {
                return this.response.results[index].latest;
            }
        }
    };
    
    return CDN;
});
/**
 * Requete Ajax (utilisation des Promises)
 * @tutorial XHR
 * @module XHR
 * @see module:promise
 */

define(["promise"], 
    function (ES6Promise) {
    
    "use strict";
    
    /**
     * Description
     * @method RequestXHR
     * @return {Object} RequestXHR
     */
    function RequestXHR() {
        
        if (!(this instanceof RequestXHR)) {
            throw new TypeError("RequestXHR constructor cannot be called as a function.");
        }
        
        // To polyfill the global environment 
        ES6Promise.polyfill();
        
        // TODO
        // aucunes options pour le moment...
        // - scope (this)
        // - ...
        this.settings = {};
    }
    
    RequestXHR.prototype = {
        
        /**
         * @alias RequestXHR
         * @constructor RequestXHR
         */
        constructor: RequestXHR,
        
        /**
         * Requete GET
         * @method get
         * @param {String} url
         * @return {Object} promise
         */
        get : function(url) {
            
            var promise = new Promise(
                function(resolve, reject) {
                    
                    var XHR = null;

                    if (XMLHttpRequest) {
                        
                        XHR = new XMLHttpRequest();
                        XHR.open("GET", url, true);
                    
                        /**
                         * Description
                         * @method onerror
                         * @private
                         */
                        XHR.onerror = function () {

                        };
                        
                        /**
                         * Description
                         * @method onreadystatechange
                         * @private
                         */
                        XHR.onreadystatechange = function() {
                            
                            if (XHR.readyState == 4) { // DONE
                                if (XHR.status == 200) {
                                    resolve(XHR.response);
                                }else {
                                    reject("Errors Occured on Http Request with XMLHttpRequest !");
                                }
                            }
                            
                        };
                        
                        XHR.send();
                    }
                    else if(XDomainRequest) {
                        
                        XHR = new XDomainRequest();
                        XHR.open('GET', url);
                        
                        /**
                         * Description
                         * @method onerror
                         * @private
                         */
                        XHR.onerror = function () {

                        };
                        
                        /**
                         * Description
                         * @method onload
                         * @private
                         */
                        XHR.onload  = function(e) {
                            
                            if (XHR.status == 200) {
                                resolve(XHR.response);
                            }
                            else {
                                reject("Errors Occured on Http Request with XMLHttpRequest !");
                            }
                        };
                        
                        XHR.send();
                    }
                    else {
                        throw new Error('CORS not supported');
                    }
                }
            );
                
            return promise;
        },

        /**
         *  Requete GET avec parser JSON
         * @method getJSON
         * @param {String} url
         * @return {Object} promise
         */
        getJSON : function(url) {
            return this.get(url)
                    .then(JSON.parse)
                    .catch(function(error) {
                        console.log("getJSON parser a échoué sur ", url, error);
                        throw error;
                    });
        },
        
        /**
         * Requete GET avec parser XML
         * @method getXML
         * @param {String} url
         * @return {Object} promise
         */
        getXML : function(url) {
            return this.get(url)
                    .then(function(response) {
                        
                        var xmlDoc;
                
                        if (window.DOMParser) {
                            var parser = new DOMParser();
                            xmlDoc = parser.parseFromString(response,"text/xml");
                        }
                        else { // IE
                            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                            xmlDoc.async=false;
                            xmlDoc.loadXML(response);
                        }
                        
                        return xmlDoc;
                    })
                    .catch(function(error) {
                        console.log("getXML parser a échoué sur ", url, error);
                        throw error;
                    });
        },
        
        gets : function(urls) {
            
            var promises = [];
            for (var index = 0; index < urls.length; ++index) {
                promises.push(this.get(urls[index]));
            }
            return promises;
        },
        
        getsJSON : function(urls) {
            
            var promises = [];
            for (var index = 0; index < urls.length; ++index) {
                promises.push(this.getJSON(urls[index]));
            }
            return promises;
        },
        
        getsXML : function(urls) {
            
            var promises = [];
            for (var index = 0; index < urls.length; ++index) {
                promises.push(this.getXML(urls[index]));
            }
            return promises;
        }
        
    };
    
    return RequestXHR;
});
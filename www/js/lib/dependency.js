define(function () {
    
    /**
     * DESCRIPTION
     *  Gestion des dependances des exemples.
     *  Permet d'extraire une liste de librairies interne et/ou externe utilisées 
     *  dans l'exemple chargé.
     *  Pour information, cette liste est affichée dans le menu de la page principale.
     *  
     * USAGE
     *  var dep = new Dependency();
     *  
     *  var lstUrl = null;
     *  lstUrl = dep.getScriptsIntoBody();
     *  lstUrl = dep.getScriptsIntoHead();
     *  lstUrl = dep.getScriptsInternal();
     *  lstUrl = dep.getScriptsExternal();
     *  
     *  ou
     *  
     *  (cf. Helper.getDoc)
     *  var parser = new DOMParser();
     *  var doc    = parser.parseFromString(code_html, "text/html");
     *  var dep = new Dependency(doc);
     *  
     *  var lstUrl = null;
     *  lstUrl = dep.getScriptsIntoBody();
     *  lstUrl = dep.getScriptsIntoHead();
     *  lstUrl = dep.getScriptsInternal();
     *  lstUrl = dep.getScriptsExternal();
     *  
     * RETURN
     *  Ex. de liste de dependances 
     *  - External  http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js
     *  - External  http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
     *  - Internal  js/apiconfig.js
     *  - Internal  ./sample.js
     *  - Internal  ./api/js/2.1.1-SNAPSHOT/Geoportal.js
     *  - Internal  ./thirdParty/Cesium/Cesium.js
     *  - External  http://api.ign.fr/geoportail/api/js/2.1.0/Geoportal.js
     *  
     *  SEE ASLO
     *   dep.getScripts()
     *   dep.isEmpty()
     *   Helper.getDoc()
     */
    
    "use strict";
    
    /**
     * Constructor
     */
    function Dependency(adoc) {
        
        if (!(this instanceof Dependency)) {
            throw new TypeError("Dependency constructor cannot be called as a function.");
        }
        
        this.dependencies = [];
        
        // objet document(DOM HTML) ou on parse une string ?
        var mydoc;
        (adoc) ? mydoc=adoc : mydoc=document;
        
        if (typeof mydoc !== "object") {
            throw new Error("Is not an object !?");
        }
        
        // recherche des balises scripts
        var dom_scripts = mydoc.getElementsByTagName("script");
        
        if (dom_scripts.length == 0) {
            // FIXME 
            // mettre en place le logger...
            console.log("[Dependency] No scripts !?");
        }
        
        for (var i = 0; i < dom_scripts.length; ++i) {
            
            // on ecarte la lib de l'API ?
            if (filterUrl(dom_scripts[i].getAttribute('src'), Dependency.REGEX_API)) {
                continue;
            }
            
            // on n'ecarte pas les anciennes versions des exemples mais on previent le developpeur !
            if (filterUrl(dom_scripts[i].getAttribute('src'), Dependency.REGEX_I18N) ||
                filterUrl(dom_scripts[i].getAttribute('src'), Dependency.REGEX_UTILS)) {
                    console.log("[Dependency] Use old samples (i18n or utils) !?");;
            }
            
            var script = {
                parent: dom_scripts[i].parentNode.nodeName,
                source: dom_scripts[i].getAttribute('src'),
                type  : "js"
            };
            
            if (script.source != null) {
                this.dependencies.push(script);
            }
        }
        
        // recherche des balises link avec css
        var dom_link = mydoc.getElementsByTagName("link");
        
        if (dom_link.length == 0) {
            // FIXME 
            // mettre en place le logger...
            console.log("[Dependency] No link !?");
        }
        
        for (var i = 0; i < dom_link.length; ++i) {
            
            // on ne garde que les css avec l'attribut rel="stylesheet"
            if (! filterUrl(dom_link[i].getAttribute('rel'), Dependency.REGEX_CSS)) {
                continue;
            }
            
            var css = {
                parent: dom_link[i].parentNode.nodeName,
                source: dom_link[i].getAttribute('href'),
                type  : "css"
            };
            
            if (css.source != null) {
                this.dependencies.push(css);
            }
        }
    };
    
    function filterUrl (url, filter) {
        if (Dependency.FILTER) {
            var regex = new RegExp(filter);
            return regex.test(url);
        }
        return false;
    };
    
    // TODO 
    // mettre un filtre sur les dependances
    // que l'on souhaite lister ou pas ...
    // ex. 
    Dependency.FILTER = true;
    Dependency.REGEX_I18N   = "i18n";      // ancienne version des exemples ?!
    Dependency.REGEX_UTILS  = "utils";     // ancienne version des exemples ?!
    Dependency.REGEX_API    = "Geoportal";
    Dependency.REGEX_CSS    = "stylesheet";
    
    Dependency.prototype = {
        
        constructor: Dependency,
        
        /**
         * Liste des dependances en fonction du type (js ou css)
         * 
         * @param {type} type
         * @returns {Array}
         */
        getDeps: function(type) {
            var $this = this;
            
            var deps = [];
            
//            for(var i=0; i < this.dependencies.length; i++) {
//                var dep = this.dependencies[i];
//                if (dep.type === type) {
//                   deps.push(dep); 
//                }
//            }
            
            for(var i=0; i < this.dependencies.length; i++) {
                // closure !
                (function(j){
                    var dep = $this.dependencies[j];
                    if (dep.type === type) {
                        deps.push(dep); 
                    }
                })(i);
            }
            
            return deps;
        },
        
        /**
         * Liste des scripts
         *   var script = {
         *     parent: [HEAD|BODY],
         *     source: "url",
         *     type  : "js"
         *   };
         * @returns {Array}
         */
        getScripts : function () {
            var scripts = [];
            for(var entry in this.dependencies) {
                if (entry.type == 'js') {
                    scripts.push(entry);
                }
            }
            return scripts;
        },
        
        /**
         * Liste des css
         *   var css = {
         *     parent: [HEAD|BODY],
         *     source: "url",
         *     type  : "css"
         *   };
         * @returns {Array}
         */
        getCss: function () {
            var css = [];
            for(var entry in this.dependencies) {
                if (entry.type == 'css') {
                    css.push(entry);
                }
            }
            return css;
        },
        
        /**
         * Liste des scripts dans la balise BODY
         * @returns {undefined|Array}
         */
        getScriptsIntoBody : function () {
            
            if (this.isEmpty("js")) {
                return;
            }
            
            var scripts = [];
            for (var i = 0; i < this.dependencies.length; ++i) {
                if (this.dependencies[i].parent === 'BODY' && this.dependencies[i].type === 'js') {
                    scripts.push(this.dependencies[i].source);
                }
            }
            return scripts;
        },
        
        /**
         * Liste des scripts dans la balise HEAD
         * @returns {undefined|Array}
         */
        getScriptsIntoHead : function () {
            
            if (this.isEmpty("js")) {
                return;
            }
            
            var scripts = [];
            for (var i = 0; i < this.dependencies.length; ++i) {
                if (this.dependencies[i].parent === 'HEAD' && this.dependencies[i].type === 'js') {
                    scripts.push(this.dependencies[i].source);
                }
            }
            return scripts;
        },
        
        /**
         * Liste des css dans la balise HEAD
         * @returns {undefined|Array}
         */
        getCssIntoHead : function () {
            
            if (this.isEmpty("css")) {
                return;
            }
            
            var css = [];
            for (var i = 0; i < this.dependencies.length; ++i) {
                if (this.dependencies[i].parent === 'HEAD' && this.dependencies[i].type === 'css') {
                    css.push(this.dependencies[i].source);
                }
            }
            return css;
        },
        
        /**
         * Liste des scripts internes
         * Possibilité d'ajouter une base url aux lib. trouvées
         * 
         * @returns {undefined|Array}
         */
        getScriptsInternal : function (baseUrl) {
            
            if (this.isEmpty("js")) {
                return;
            }
            
            var scripts = [];
            for (var i = 0; i < this.dependencies.length; ++i) {
                if (this.dependencies[i].type === 'js') {
                    if (! filterUrl(this.dependencies[i].source, "^http://")) {

                        var url = this.dependencies[i].source;

                        // gestion des path : on supprime les debut de path "./" ou "/" !
                        if (url.indexOf('./', 0) === 0) {url=url.substring(2);}
                        if (url.indexOf('/' , 0) === 0) {url=url.substring(1);}

                        if (baseUrl) {
                            // gestion des path : on verifie le '/' final !
                            if (baseUrl.lastIndexOf("/")+1 !== baseUrl.length) {baseUrl=baseUrl+"/";}
                            url = baseUrl + url;
                        }
                        scripts.push(url);
                    }
                }
            }
            return scripts;
        },
        
        /**
         * Liste des css internes
         * Possibilité d'ajouter une base url aux lib. trouvées
         * 
         * @returns {undefined|Array}
         */
        getCssInternal : function (baseUrl) {
 
            if (this.isEmpty("css")) {
                return;
            }
            
            var css = [];
            for (var i = 0; i < this.dependencies.length; ++i) {
                
                if (! filterUrl(this.dependencies[i].source, "^http://")) {
                    if (this.dependencies[i].type === 'css') {
                        var url = this.dependencies[i].source;

                        // gestion des path : on supprime les debut de path "./" ou "/" !
                        if (url.indexOf('./', 0) === 0) {url=url.substring(2);}
                        if (url.indexOf('/' , 0) === 0) {url=url.substring(1);}

                        if (baseUrl) {
                            // gestion des path : on verifie le '/' final !
                            if (baseUrl.lastIndexOf("/")+1 !== baseUrl.length) {baseUrl=baseUrl+"/";}
                            url = baseUrl + url;
                        }
                        css.push(url);
                    }
                }
            }
            return css;
        },
        
        /**
         * Liste des scripts externes 
         * (url en http)
         * @returns {undefined|Array}
         */
        getScriptsExternal : function () {
            
            if (this.isEmpty("js")) {
                return;
            }
            
            var scripts = [];
            for (var i = 0; i < this.dependencies.length; ++i) {
                if (this.dependencies[i].type === 'js') {
                    if (filterUrl(this.dependencies[i].source, "^http://")) {
                        scripts.push(this.dependencies[i].source);
                    }
                }
            }
            return scripts;
        },
        
        /**
         * Tableau de scripts vide ?
         * @returns {Boolean}
         */
        isEmpty : function (type) {
            
            if (typeof this.dependencies === 'undefined') {
                return true;
            }
            
            var deps = this.getDeps(type);
            
            if (typeof deps === 'undefined') {
                return true;
            }
            
            if (deps.length === 0) {
                return true;
            }
            
            return false;
        },
        
        getDependencyName : function (index, type) {
            
            if (this.isEmpty(type)) {
                return;
            }
            
            var deps = this.getDeps(type);
            
            if (index > (deps.length - 1)) {
                throw new RangeError("Index Out Of Bounds");
                return;
            }
            
            var url_name   = deps[index].source;
            var regex_ext  = /\.[0-9a-z]+$/i;
            url_name = url_name.replace(regex_ext, ""); // supprime l'extension
            var regex_min  = /(.|_|-)min$/i;
            url_name = url_name.replace(regex_min, ""); // supprime minification extension
            var regex_path = /^.*[\\\/]/;
            url_name = url_name.replace(regex_path, "");// supprime le chemin
            
            if (url_name) {
                return url_name;
            }

        },
        
        getDependencySource : function (index, type) {
            
            if (this.isEmpty(type)) {
                return;
            }
            
            var deps = this.getDeps(type);
            
            if (index > (deps.length - 1)) {
                throw new RangeError("Index Out Of Bounds");
                return;
            }
            
            var url = deps[index].source;
            
            if (url) {
                return url;
            }
        }
    };
    
    return Dependency;
});
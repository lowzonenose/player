/**
 * Classe utilitaire
 * @tutorial Helper
 * @module Helper
 */
define({
    
    /**
     * Obtenir l'url de l'application.
     * WARNING, toujours un '/' à la fin de l'URL !
     * @method {string} url
     * @return {string} url
     */
    url: function() {
        
        var url_hostname  = window.location.hostname;
        var url_protocol  = window.location.protocol;
        var url_port      = window.location.port;
        var url_pathname  = window.location.pathname;

        var url = url_protocol.concat("//");
        (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname;
        url = url + url_pathname.substring(0, url_pathname.lastIndexOf("/")+1);
        
        return url;
    }, 
    
    /**
     * Tri et decomposition en chemins 
     * ex.
     * Pour une liste de fichiers et/ou répertoires :
     *   "root/folder/files/file"
     * on aura en sortie la liste suivante :
     *   "root/"
     *   "root/folder/"
     *   "root/folder/files/"
     *   "root/folder/files/file"
     * @method paths
     * @param {string[]} lstpath
     * @return {string[]} 
     */
    paths: function(lstpath) {
        
        var paths    = [];
        var objpaths = {};
        
        var regex = new RegExp("http://");
        
        for(var i=0; i<lstpath.length; i++) {
   
            (function(f){
                if (! regex.test(lstpath[f])) {
                    var dirs = lstpath[f].split("/");
                    var k = "";
                    for(var j=0; j<dirs.length-1; j++){
                        k = k + dirs[j] + "/";
                        objpaths[k] = 1;
                    }
                }
            })(i);
        }

        for(var obj in objpaths) {
            paths.push(obj);
        }
        
        return paths.sort();
    },
    
    /**
     * Gestion des chemins relatifs 
     * ex.
     *  URL  : "/root/folder/"
     *  PATH : "/root/folder/files/file.html"
     * on a en sortie : "files/file.html"
     * @method path2relative
     * @param {string} url
     * @param {string} path
     * @return {string} path_rel
     */
    path2relative : function(url, path) {
        
        // FIXME 
        // utiliser une lib. spécialisée tel que URI !
        
        var path_rel = null;
        
        // url, on ne traite pas...
        var regex = new RegExp("http://");
        if (regex.test(path)) {
            console.log("c'est une url (http)!");
            return path;
        }
        
        // uniquement un fichier, on ne traite pas...
        if (path.lastIndexOf("/") === -1) {
            console.log("y'a pas de chemin!");
            return path;
        }
        
        // on a donc un chemin
        path_rel = path.substring(url.length+1);
        if (path_rel == "") {
            // hummm..., pas normal !
            console.log("Argh! le path est vide!");
            return path;
        }
        
        // test à la con...
        if (path_rel.length < path.substring(path.lastIndexOf("/"))) {
            // hummm..., pas normal !
            console.log("Argh! path trouvé : " + path_rel + " (" + path + ")");
            return path;
        }
        
        return path_rel;
    },
    
    /**
     * Extraction d'une liste des ressources dans un fichier CSS
     * ex.
     * sur un texte :
     *  (...)
     *  background-image : url('img/image.png');
     *  (...)
     *  on a une liste en sortie :
     *    "img/image.png"
     * @method pathIntoCSS
     * @param {string} css
     * @return {string[]} lstresources
     */
    pathIntoCSS : function (css) {
        
        // INFO
        // recherche uniquement les URL locales !
        
        var lstresources = [];
        
        var regex = /(url\(.*\);)/g;
        var regex_url = /(https?:\/\/[^\s]+)/;
        var index = 0;
        var match;
        while (match = regex.exec(css)) {
            var value = match[index]
                    .replace('url', '')
                    .replace(';', '')
                    .replace('(', '')
                    .replace(')', '')
                    .replace('\'', '')
                    .replace('\'', '');
            if (! regex_url.test(value)) {
                lstresources.push(value);
            }
        }
        return lstresources;
    },
    
    /**
     * Merge 2 ou +ieurs objets javascript properties (json)
     * 
     * @todo fusionner des tableaux
     * @param {object} objet
     */   
    extend : function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
          if (!arguments[i])
            continue;

          for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key))
              out[key] = arguments[i][key];
          }
        }

        return out;
      },
      
    /********************
     * load Element (doc)
     ********************/
    
    /**
     * Ajouter une balise 'link' dans l'entête (head) du document courant.
     * @method loadCss
     * @param {string} url
     */
    loadCss : function (url) {
        var link  = document.createElement("link");
        link.type = "text/css";
        link.rel  = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    
    /**
     * Ajouter une balise 'script' dans l'entête (head) du document courant.
     * @method loadScript
     * @param {string} url
     */
    loadScript : function (url) {
        var script  = document.createElement("script");
        script.type = "text/javascript";
        script.href = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    
    /**
     * ***********************
     * Create Element (string)
     * ***********************
     */
  
    /**
     * Description
     * @method createCss
     * @param {string} url
     * @return {string} outerHTML
     */
    createCss : function (url) {
        // cf. https://developer.mozilla.org/en-US/docs/Web/API/element.outerHTML
        var link  = document.createElement("link");
        link.type = "text/css";
        link.rel  = "stylesheet";
        link.href = url;
        return link.outerHTML;
    },
    
    /**
     * Description
     * @method createScript
     * @param {string} url
     * @return {string} outerHTML
     */
    createScript : function (url) {
        var script  = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        return script.outerHTML;
    },
    
    /*********************
     * DOM Extraction info 
     *********************/
    
    /**
     * Surcharge de la methode 'parseFromString' 
     * du parser 'DOMParser'.
     * @method parser
     * @param {Object} DOMParser
     * @return {Object} DOMParser
     */
    parser: function(DOMParser) {  
        // INFO
        // DOMException: NOT_SUPPORTED_ERR 
        // pb sur certains navigateurs (ex. Opera)
        // use polyfill
        
        /* 
         * DOMParser HTML extension 
         * 2012-02-02 
         * 
         * By Eli Grey, http://eligrey.com 
         * cf. https://github.com/eligrey
         * cf. https://gist.github.com/eligrey/1129031
         * Public domain. 
         * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK. 
         */  
        
        "use strict";  
        var DOMParser_proto = DOMParser.prototype  
          , real_parseFromString = DOMParser_proto.parseFromString;

        // Firefox/Opera/IE throw errors on unsupported types  
        try {  
            // WebKit returns null on unsupported types  
            if ((new DOMParser).parseFromString("", "text/html")) {  
                // text/html parsing is natively supported  
                return;  
            }  
        } catch (ex) {
            console.log(ex);
        }  

        /**
         * Description
         * @method parseFromString
         * @param {String} markup
         * @param {String} type
         * @return {Object} document
         */
        DOMParser_proto.parseFromString = function(markup, type) {  
            if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {  
                var doc = document.implementation.createHTMLDocument("")
                  , doc_elt = doc.documentElement
                  , first_elt;

                doc_elt.innerHTML = markup;
                first_elt = doc_elt.firstElementChild;

                if (doc_elt.childElementCount === 1
                    && first_elt.localName.toLowerCase() === "html") {  
                    doc.replaceChild(first_elt, doc_elt);  
                }  

                return doc;  
            } else {  
                return real_parseFromString.apply(this, arguments);  
            }  
        };  
    },
    
    /**
     * Description
     * @method getDoc
     * @param {String} text
     * @return {Object} document
     */
    getDoc : function (text) {
        
        (this.parser(DOMParser));
        
        var parser = new DOMParser();
        var doc  = parser.parseFromString(text, "text/html");
        parser = null;
        return doc;
    },
    
    /**
     * Description
     * @method extractBody
     * @param {String} text
     * @return {String} body_without_scripts
     */
    extractBody : function (text) {
        
        var body = this.getDoc(text).getElementsByTagName("body");
        var body_without_scripts = body[0].innerHTML.replace(new RegExp('\\s*<script[^>]*>[\\s\\S]*?</script>\\s*','ig'),'');
        return body_without_scripts;
    },
    
    /**
     * Description
     * @method extractScripts
     * @param {String} text
     * @return {String[]} lstscripts
     */
    extractScripts : function (text) {

        var scripts = this.getDoc(text).getElementsByTagName("script");
        var lstscripts = [];
        for(var i=0; i<scripts.length; i++) {
            lstscripts.push(scripts[i].outerHTML);
        }
        return lstscripts;
    },
    
});
define({
    /**
     * DESCRIPTION
     * 
     * USAGE
     * 
     * RETURN
     * 
     * SEE ASLO
     * 
     */
    
    /**
     * Logger de type console par defaut.
     *  TODO : mettre en place un fichier de log...
     * @param {type} text
     */
    log : function  (text) {
        console.log(text);
    },

    /**
     * Chargement des CSS de l'application.
     * @param {type} url
     */
    loadCss : function (url) {
        var link  = document.createElement("link");
        link.type = "text/css";
        link.rel  = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    },
    
    parser: function(DOMParser) {  
        // FIXME 
        // DOMException: NOT_SUPPORTED_ERR 
        // pb sur certains navigateurs (ex. Opera)
        
        /* 
         * DOMParser HTML extension 
         * 2012-02-02 
         * 
         * By Eli Grey, http://eligrey.com 
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
    
    getDoc : function (text) {
        
        (this.parser(DOMParser));
        
        var parser = new DOMParser();
        var doc  = parser.parseFromString(text, "text/html");
        parser = null;
        return doc;
    },
    
    extractBody : function (text) {
        
        var body = this.getDoc(text).getElementsByTagName("body");
        var body_without_scripts = body[0].innerHTML.replace(new RegExp('\\s*<script[^>]*>[\\s\\S]*?</script>\\s*','ig'),'');
        return body_without_scripts;

    },
    
    extractScripts : function (text) {

        var scripts = this.getDoc(text).getElementsByTagName("script");
        var lstscripts = [];
        for(var i=0; i<scripts.length; i++) {
            lstscripts.push(scripts[i].outerHTML);
        }
        return lstscripts;
    }
    
});
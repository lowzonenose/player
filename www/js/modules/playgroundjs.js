define([
    "jquery", 
    // libs :
    "config", 
    "helper", 
    "settings", 
    "syntaxhighlighter",
    "type",
    "logger",
    "dependency",
    "download",
    // GUI :
    "ui/ui-crossbar",
    "ui/ui-sidebar",
    "ui/ui-codearea"
], function(
    $, 
    // libs :
    Config, 
    Helper, 
    Settings, 
    SyntaxHighlighter, 
    Type, 
    Logger,
    Dependency,
    Download,
    // GUI :
    UICrossBar,
    UISideBar,
    UICodeArea) 
{

    "use strict";
    
    /**
     * 
     */
    function PlayGroundJS(options) {

        if (!(this instanceof PlayGroundJS)) {
            throw new TypeError("PlayGroundJS constructor cannot be called as a function.");
        }
        
        this.player = null;
        
        // TODO options : 
        //  - callbacks 
        //  - div 
        //  - ...
        this.options = options || {};
        
        // params de l'url
        this.settings = null;

        // dom ui
        this.crossbar  = null;
        this.sidebar   = null;
        this.codearea  = null;
        
        // class ui
        this.uicrossbar  = null;
        this.uisidebar   = null;
        this.uicodearea  = null;

        // dom
        this.boxHTML   = null;
        this.boxCSS    = null;
        this.boxJS     = null;
        this.boxResult = null;
        
    };
    
    // div ID du player par defaut !
    PlayGroundJS.DIV = '#PlayGroundJS';
    
    PlayGroundJS.prototype = {
        
        /**
         * div ID du player
         * Par defaut, "#PlayGroundJS"
         * Information fournie via le param. options de la classe.
          */
        m_divPlayer: null,
        
        /**
         * Object
         * Gestionnaire de log
         */
        m_Logger: null,

        /**
         * Type d'API JS utilisée par defaut pour un exemple :
         * - Extended
         * - Mobile
         * - 3D
         * - Min
         * - Gouv
         * - Flash
         * - Standard
         * ${String} issue des paramètres de l'URL 
         *   (cf. params.type)
         * Par defaut, utilisation de la lib. API JS Extended
         */
        m_jsApiType: null,
        
        /**
         * Version de l'API
         * ${String} issue de la configuration 
         * ou surchargée des paramètres de l'URL  
         *   (cf. params.version)
         */
        m_jsApiVersion: null,
        
        /**
         * URL de l'API
         * ${String} issue de la configuration 
         * ou surchargée des paramètres de l'URL  
         *   (cf. params.url)
         */
        m_jsApiUrl: null,
        
        /**
         * Exemple à charger :
         * loadSample : {
         *           sample_path: , // ex "./samples",
         *           sample_name: , // ex "sample_1"
         *           sample_file: {
         *               html: , // ex "sample_1.html",
         *               css:  , // ex "sample_1.css",
         *               js:   , // ex "sample_1.js"
         *           }
         *       }
         * ${Objet} issue des paramètres de l'URL 
         *   (cf. params.loadsample)
         */
        m_loadSample: null,
        
        /**
         * Determine s'il y'a modification de l'exemple.
         */
        m_sampleIsModify: false,
        
        /**
         * Determine si l'exemple possère des ressources 
         * (images, fichiers de données, ...)
         */
        m_sampleHasResources: false,

        /**
         * Active/Desactive la colorisation syntaxique
         * ${Bolean} issue des paramètres de l'URL 
         *   (cf. params.applysyntaxhighlighter)
         * Par defaut, active...
         */
        m_applySyntaxHighlighter: true,
        
        /**
         * Object
         * CodeMirror is a code-editor component that can be embedded in Web pages
         * cf. http://codemirror.net/
         */
        m_SyntaxHighlighter: null,

        /**
         * Page HTML de sortie.
         */
        m_resultHtml: null,
               
        constructor: PlayGroundJS,
        
        /**
         * fonction principale de chargement !
         * 
         * @returns {undefined}
         */
        load: function() {
            
            var $this = this;
            
            Helper.log("call : load !");
            
            // logger
            $this.doLog();
            
            // settings 
            var objSettings = new Settings();
            this.settings   = objSettings.getSettings();
            $this.m_Logger.debug(this.settings);
            
            // init
            $this.doInit();

            // generate html dans la page
            $($this.m_divPlayer).append($this.doGenerate());
            
            // import de l'exemple, puis execution de l'exemple 
            $this.doImport({
                onfinish: function() {
                    // auto-run
                    $this.doRun();
                }
            });

            
        },
        
        /**
         * Reinitialiser le player à vide.
         *  (Not yet used !)
         * 
         * @returns {undefined}
         */
        doEmpty: function () {
            
            this.m_Logger.debug("call : doEmpty !");
            
            this.doWriteResult('');
            
            this.uicodearea.clean();
            this.uisidebar.clean();
            
            if (this.m_applySyntaxHighlighter) {
                if (this.m_SyntaxHighlighter !== null) {
                    this.m_SyntaxHighlighter.clear();
                }
            }
        },
        
        /**
         * Initialisation d'un logger.
         *  (désactivé en production)
         *  
         * @returns {undefined}
         */
        doLog: function() {
            var $this = this;
            
            $this.m_Logger = new Logger();
            $this.m_Logger.debug("Activation du logger en mode " + $this.m_Logger.level());
        },
        
        /**
         * Init. des parametres de l'application (cf. settings).
         * - type d'API 
         * - colorisation synthaxique
         * - l'exemple à charger
         * 
         * @returns {undefined}
         */
        doInit: function() {
            var $this = this;

            $this.m_Logger.debug("call : doInit !");

            // ***************
            //    SETTINGS
            // ***************
            
            // Test sur le type de lib. API
            var obj = new Type($this.settings.typeApiJs.toLowerCase());
            $this.m_jsApiType = obj.getType();

            // Test sur la version de lib. API
            var version = $this.settings.versionApiJs;
            if (version == null) {
                // on utilise la version presente dans la config par env
                $this.m_jsApiVersion = Config.api.version;
            }
            else {
                $this.m_jsApiVersion = version;
            }
            
            // Test sur l'url de lib. API
            var url = $this.settings.urlApiJs;
            if (url == null) {
                // on utilise la version presente dans la config par env
                $this.m_jsApiUrl = Config.api.url;
            }
            else {
                $this.m_jsApiUrl = url;
            }
            
            // Test sur la colorisation synthaxique ?
            if (typeof $this.settings.applySyntaxHighlighter === "string") {
                ($this.settings.applySyntaxHighlighter === "true") ? 
                        $this.m_applySyntaxHighlighter = true : $this.m_applySyntaxHighlighter = false;
            }
            
            // chargement de la lib. de colorisation synthaxique
            if ($this.m_applySyntaxHighlighter) {
                if ($this.m_SyntaxHighlighter === null) {
                    $this.m_SyntaxHighlighter = new SyntaxHighlighter();
                }
            }
            
            // chargement de l'exemple
            $this.m_loadSample = $this.settings.loadSample; 
            
            // ***************
            //    OPTIONS
            // ***************
            
            // div
            if ($this.options.div != null ) {
                var div = $this.options.div;
                if (div.indexOf('#', 0) === 0) {
                    $this.m_divPlayer = div;
                }
                else {
                    $this.m_divPlayer = '#'+div;
                }
            }
            else {
                $this.m_divPlayer = PlayGroundJS.DIV;
            }
            
            // callback de fin de chargement ou d'erreur !
            if ($this.options.onload == null) {
                    $this.options.onload = function (message) {console.log(message);}
            }
            
            if ( $this.options.onerror == null ) {
                    $this.options.onload = function (message) {console.log(message);}
            }
        },
        
        /**
         * Generation de la page.
         * - creation du menu latteral (sidebar)
         * - creation du menu action (crossbar)
         * - creation des zones de codes (codearea)
         * 
         * @returns {$this}
         */
        doGenerate: function() {
            var $this = this;

            $this.m_Logger.debug("call : doGenerate !");

            if($this.player) return $this.player;

            /************************************************
             * Crossbar (menu)
             ************************************************/
            $this.uicrossbar = new UICrossBar($this);
            $this.crossbar   = $this.uicrossbar.generate();

            /************************************************
             * Sidebar
             ************************************************/
            var options = {
                jsapi : {
                    type   : $this.m_jsApiType,
                    version: $this.m_jsApiVersion,
                    url    : $this.m_jsApiUrl
                }
            };
            
            $this.uisidebar = new UISideBar($this, options);
            $this.sidebar   = $this.uisidebar.generate();
            
            /************************************************
             * Code Area
             ************************************************/
            $this.uicodearea = new UICodeArea($this);
            $this.codearea   = $this.uicodearea.generate(); 
            
            /************************************************
             * All parts
             ************************************************/
            $this.player = 
                $('<div class="_PlayGroundJS_holder"></div>')
                    .append($this.crossbar)
                    .append($this.sidebar)
                    .append($this.codearea);
	
            $this.m_Logger.debug($this.player);
            
            return $this.player;
        },

        /**
         * Import de l'exemple dans la page.
         *  Chaque fichier, html, js et css, est placé dans sa zone d'edition 
         *  de code avec la colorisation synthaxique.
         *  Les dependances sont extraites de l'exemple.
         *  
         * @param {function} callback de fin d'import !
         * @returns {undefined}
         */
        doImport: function(callback) {

            var $this = this;

            $this.m_Logger.debug("call : doImport !");
            
            var html_file = "", js_file = "", css_file = "";

            if (! $this.m_loadSample) {

                // Au cas ou ...
                if (! html_file) {
                    $this.boxHTML.append("code html à inserer.");
                }
                if (! js_file) {
                    $this.boxJS.append("code js à inserer.");
                }
                if (! css_file) {
                    $this.boxCSS.append("code css à inserer.");
                }

                return;
            }

            var path = $this.m_loadSample.sample_path;
            var name = $this.m_loadSample.sample_name;

            // on a un chemin...
            if (path) {
                // on traite qq cas sur le path...
                if (path.indexOf('.', 0) !== -1) {path=path.substring(1);}
                if (path.indexOf('/', 0) === -1) {path="/"+path;}

                html_file = path;
                js_file   = path;
                css_file  = path;
            }

            // un repertoire ou un bout de chemin...
            if (name) {
                html_file = html_file.concat("/", name);
                js_file   = js_file.concat("/",   name);
                css_file  = css_file.concat("/",  name);
            }

            var url_hostname  = window.location.hostname;
            var url_protocol  = window.location.protocol;
            var url_port      = window.location.port;
            var url_pathname  = window.location.pathname;

            var url = url_protocol.concat("//");
            (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname;
            url = url + url_pathname.substring(0, url_pathname.lastIndexOf("/"));
            
            $this.m_Logger.debug(url);

            // on ajoute les fichiers aux chemins precedents...
            html_file =  html_file.concat('/', $this.m_loadSample.sample_file.html);
            js_file   =  js_file.concat('/',   $this.m_loadSample.sample_file.js);
            css_file  =  css_file.concat('/',  $this.m_loadSample.sample_file.css);

            // FIXME
            // revoir implementation AJAX avec JQuery 
            // cf. http://api.jquery.com/jquery.ajax/

            // INFO 
            // cf. http://stackoverflow.com/questions/4368946/javascript-callback-for-multiple-ajax-calls
            
            // FIXME 
            // impl. promises sous IE ? 
            // l'utilisation à travers JQuery devrait fonctionner ?
            // cf. http://caniuse.com/#feat=promises
            $.when(
                
                // HTML
                $.ajax({
                    url : url.concat(html_file),
                    type : 'GET' ,
                    dataType : 'text',
                    success : function(code_text, statut){ 
                        $this.m_Logger.debug("code : " + code_text);

                        // extraction du body
                        var body = Helper.extractBody(code_text);
                        // insertion du code dans la page
                        $this.uicodearea.boxHTML.text(body);
                        $this.m_Logger.debug("body : " + body);

                        // extraction des dependances internes
                        var dep = new Dependency(Helper.getDoc(code_text));

                        // INFO
                        // ajout du path url dans les lib. internes de l'exemple !
                        var path = this.url.substring(0, this.url.lastIndexOf("/"));

                        var lstUrlInterne = dep.getScriptsInternal(path);
                        $this.uisidebar.set_jsapi_dependencies(lstUrlInterne);
                        $this.m_Logger.debug("url interne : " +lstUrlInterne);

                        // extraction des dependances externes
                        var lstUrlExterne = dep.getScriptsExternal();
                        $this.uisidebar.set_jsapi_dependencies(lstUrlExterne);
                        $this.m_Logger.debug("url externe : " + lstUrlExterne);

                        // extraction des dependances css
                        var lstUrlCssInterne = dep.getCssInternal(path);
                        $this.uisidebar.set_jsapi_dependencies_css(lstUrlCssInterne);
                        $this.m_Logger.debug("css interne : " +lstUrlCssInterne);

                    },
                    error : function(resultat, statut, erreur){
                        if (!erreur) {erreur="???"}
                        var message = "### Statut: " + statut + "(" + erreur + ") ###";
                        $this.uicodearea.boxHTML.html(message);
                    }
                    
//                    complete : function(resultat, statut){
//                        $this.m_Logger.debug("html ajax complete !");
//                        // colorisation synthaxique
//                        $this.applySyntaxHighlighter('html');
//                    }
                }),

                // JS
                $.ajax({
                    url : url.concat(js_file),
                    type : 'GET' ,
                    dataType : 'text',
                    success : function(code_text, statut){
                        $this.m_Logger.debug("code : " + code_text);
                        $this.uicodearea.boxJS.text(code_text);
                        
                    },
                    error : function(resultat, statut, erreur){
                        if (!erreur) {erreur="???"}
                        var message = "### Statut: " + statut + "(" + erreur + ") ###";
                        $this.uicodearea.boxJS.html(message);
                    }
                    
//                    complete : function(resultat, statut){
//                        $this.m_Logger.debug("js ajax complete !");
//                        // colorisation synthaxique
//                        $this.applySyntaxHighlighter('js');
//                    }
                }),

                // CSS
                $.ajax({
                    url : url.concat(css_file),
                    type : 'GET' ,
                    dataType : 'text',
                    success : function(code_text, statut){
                        $this.m_Logger.debug("code : " + code_text);
                        $this.uicodearea.boxCSS.text(code_text);
                    },
                    error : function(resultat, statut, erreur){
                        if (!erreur) {erreur="???"}
                        var message = "### Statut: " + statut + "(" + erreur + ") ###";
                        $this.uicodearea.boxCSS.html(message);
                    }
                    
//                    complete : function(resultat, statut){
//                        $this.m_Logger.debug("css ajax complete !");
//                        // colorisation synthaxique
//                        $this.applySyntaxHighlighter('css');
//                    }
                })
                        
            ).done(
                // INFO succes : callback de fin de chargement !
                function(html, js, css){   
                    $this.m_Logger.debug("all request ajax : DONE !");
                    if ($this.options.onload != null && typeof $this.options.onload === 'function') {
                        $this.options.onload.call($this, "Gestionnaire de fin de chargement !");
                    }
                }
            ).fail(
                // INFO echec : callback !
                function(){
                    $this.m_Logger.debug("one request ajax : FAILED !");
                    if ($this.options.onerror != null && typeof $this.options.onerror === 'function') {
                        $this.options.onerror.call($this, "Gestionnaire d'erreur de chargement !");
                    }   
                }
            ).always(
                // INFO
                // cette fonction de colorisation synthaxique est toujours appelée !
                function(){
                    $this.m_Logger.debug("always call after request ajax !");
                    $this.applySyntaxHighlighterAll();
                                                
                }
            ).then(
                // INFO 
                // callback de fin d'import mais uniquement en cas de reussite !
                function(){
                    $this.m_Logger.debug("then call after all success request ajax !");
                    if (callback != null && typeof callback.onfinish === 'function') {
                        callback.onfinish.call($this, ["Import de l'exemple : OK !"]);
                    }
                }
            );

        },

        /**
         * Export de l'exemple dans un fichier de sortie.
         *  Les fichiers html, js et css sont placés dans une page html, sans les ressources...
         *  (Not yet used !)
         * 
         * @returns {undefined}
         */
        doExport: function () {
            
            var $this = this;
            $this.m_Logger.debug("Not yet implemented : doExport !");
            
            // FIXME : FF ? et IE non testé...
            var elt = document.createElement('a');
            elt.setAttribute('href', 'data:text/html;charset=utf-8,' +
                    encodeURIComponent(this.m_resultHtml));
            elt.setAttribute('download', "exportSample.html");
            if (elt.addEventListener) {elt.addEventListener("click",function(){$this.m_Logger.debug("addEventListener");},true);}
            else {elt.attachEvent('onclick', function(){$this.m_Logger.debug("attachEvent");});}
            elt.click();
            
            // Version simpliste..., mais c'est juste pour l'exemple !
            // document.location = 'data:text/html,' +
            //                   encodeURIComponent(this.m_resultHtml);
            
        },
        
        /**
         * Execution de l'exemple.
         *  Chaque fragment de code (html, cc et js) est concaténé dans une chaine de 
         *  caractères. Les dependances (interne et externe) de l'exemple y sont ajoutées.
         *  Cette chaine est insérée dans une 'iframe' pour execution.
         *  
         * @returns {undefined}
         */
        doRun: function() {
            
            this.m_Logger.debug("call : doRun !");
            
            // FIXME 
            // en mode lib. éclatée, toutes les dependances de la lib. API JS 
            // sont intégrées dans l'iframe ?! d'où un chargement long !?
            // cf. http://blog.blary.be/analyse-diff%C3%A9rentes-fa%C3%A7ons-dint%C3%A9grer-un-script-javascript
            
            
            var codeHTML, codeCSS, codeJS;

            // cas où la colorisation synthaxique est activée, il faut 
            // prendre en compte les modifications...
            if (this.m_applySyntaxHighlighter) {
                if (this.m_SyntaxHighlighter !== null) {
                    this.m_SyntaxHighlighter.update();
                }
            }
            
            // INFO
            // on prend en compte le contenu des 3 fenetres !
            // par contre, l'instance 'uicodearea' contient toujours les données initiales !
            codeHTML = this.uicodearea.boxHTML.val();
            codeCSS  = this.uicodearea.boxCSS.val();
            codeJS   = this.uicodearea.boxJS.val();

            // script JS API
            var jsApi = '<script type="text/javascript" src="' + this.uisidebar.get_jsapi_selected() + '"></script>';
            
            // script JS dependances de l'exemple
            var jsApiDeps = "";
            var jsDeps = this.uisidebar.get_jsapi_dependencies();
            for(var i=0; i<jsDeps.length; i++) {
                jsApiDeps += '<script type="text/javascript" src="' + jsDeps[i] + '"></script>'
            }
            
            // CSS dependances de l'exemple
            var cssApiDeps = "";
            var cssDeps = this.uisidebar.get_jsapi_dependencies_css();
            for(var i=0; i<cssDeps.length; i++) {
                cssApiDeps += '<link rel="stylesheet" type="text/css" href="' + cssDeps[i] + '"/>'
            }
            
            
            // script JS Framework
            var jsDepFramework = "";
            var jsFrameworks = this.uisidebar.get_jsdep_cdn();
            for(var i=0; i<jsFrameworks.length; i++) {
                // on filtre celles qui sont nulles !
                if (jsFrameworks[i] != null) {
                    jsDepFramework += '<script type="text/javascript" src="' + jsFrameworks[i] + '"></script>';
                }
            }

            // ressources externes
            var jsDepExternals = "";
            var jsExternals = this.uisidebar.get_jsdep_external();
            for(var i=0; i<jsExternals.length; i++) {
                // on filtre celles qui sont nulles !
                if (jsExternals[i] != null) {
                    jsDepExternals += '<script type="text/javascript" src="' + jsExternals[i] + '"></script>';
                }
            }
            
            // TODO 
            // callback à mettre en place !
            var strCallbackOnLoad = function callbackOnLoad() {
                alert("callbackOnLoad");
            };
            
            // resultat 
            this.m_resultHtml = '<html>\n' 
                    + '<head>\n' 
                    + jsApi 
                    + jsApiDeps 
                    + jsDepExternals
                    + jsDepFramework
                    + cssApiDeps
                    + '\n<style>\n' 
                    + codeCSS 
                    + '\n</style>\n' 
                    + '<script>\n' 
                    + '  function callbackOnLoad() {\n' 
                    + '    // FIXME comment ça marche ce truc (FF:NOK, CHROME:OK) ?\n'
                    + '    console.log("callbackOnLoad");\n'
                    + '  }\n'
                    + '</script>\n'
                    + '</head>\n' 
                    + '<body onload=\'callbackOnLoad()\'>\n' 
                    + codeHTML 
                    + '\n<script type="text/javascript">\n' 
                    + codeJS 
                    + '\n</script>\n'
                    + '</body>\n'
                    + '</html>';

            this.m_Logger.debug(this.m_resultHtml);
            
            this.doWriteResult(this.m_resultHtml);
        },

        /**
         * Recharge l'exemple initiale
         * 
         * @returns {undefined}
         */
        doReset: function() {
            
            this.m_Logger.debug("call : doReset !");
            
            this.uicodearea.boxHTML[0].value = this.uicodearea.boxHTML[0].defaultValue;
            this.uicodearea.boxJS[0].value   = this.uicodearea.boxJS[0].defaultValue;
            this.uicodearea.boxCSS[0].value  = this.uicodearea.boxCSS[0].defaultValue;
            
            if (this.m_applySyntaxHighlighter) {
                if (this.m_SyntaxHighlighter !== null) {
                    this.m_SyntaxHighlighter.remove();
                }
                
                this.applySyntaxHighlighterAll();
            }

        },

        /**
         * Sauvegarde.
         *  Un fichier archive contenant le code HTML, JS et CSS.
         * 
         * @returns {undefined}
         */
        doSave: function () {
            
            var $this = this;
            
            $this.m_Logger.debug("call : doSave !");
            
            // callback
            function callbackOnSuccess(message) {
                $this.m_Logger.debug("callbackOnSuccess : " + message);
                $this.m_Logger.debug("instance : " + this.instance);
            };
            
            function callbackOnFailure(message) {
                $this.m_Logger.debug("callbackOnFailure : " + message);
                alert(message);
            };
            
            // le nom de l'archive
            var archive = null;
            
            if ($this.m_loadSample.sample_name) {
                archive = $this.m_loadSample.sample_name;
            }
            else {
                // on determine le nom de l'archive à partir du fichier HTML
                var html = $this.m_loadSample.sample_file.html;
                archive  = html.substring(html.lastIndexOf("/")+1, html.lastIndexOf("."));
            }
            
            // options par defaut
            var options = {
                // INFO
                // interaction entre le player et la fonction callback !
                // scope    : $this, 
                mode     : "URI", // FIXME...
                archive  : archive,
                base     : "samples/archives/",
                onsuccess: callbackOnSuccess,
                onfailure: callbackOnFailure,
            };
            
            // options à modifier
            if ($this.m_sampleIsModify) {
                // TODO
                // cas où les fichiers ont été modifié, on ne peut plus prendre 
                // l'archive pré calculée !
                throw new Error("Not yet implemented !");
            }
            
            if ($this.m_sampleHasResources) {
                // TODO
                // cas où des ressources ont été ajouté
                // (images, css, js, data (kml, gpx, ...)), 
                // on ne peut plus prendre l'archive pré calculée !
                throw new Error("Not yet implemented !");
            }

            var dl = new Download(options);
            dl.send();
        },
        
        /**
         * Sauvegarde.
         *  Un fichier archive contenant le code HTML, JS et CSS.
         *  (Not yet used !)
         *  
         * @returns {undefined}
         */
        doSave_servlet: function() {

            var $this = this;
            
            $this.m_Logger.debug("Not yet implemented : doSave !");
            
            // FIXME
            // téléchargement du fichier resultat zippé avec AJAX en utilisant la servlet du projet API :
            // XMLHttpRequest cannot load http://localhost:9999/geoportail/api/save?fn=downloadSample2.html&ct=text/html&dt=null. 
            // No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8383' is therefore not allowed access.
            // => on a un probleme de cross domain avec des servlets hebergées sur un autre domaine !!!
            // 
            // FIXME 
            // en mode GET, on risque un pb de longueur d'url en mode HTML ...
            // 
            // FIXME 
            // en mode POST, la servlet ne permet de choisir le nom du fichier...
            // => dev. à prevoir sur la servlet...


            // See: http://api.jquery.com/jQuery.ajaxPrefilter/
            $.ajaxPrefilter( 
                function( options ) {
                    if ( options.crossDomain ) {
                        var newData = {};
                        // Copy the options.data object to the newData.data property.
                        // We need to do this because javascript doesn't deep-copy variables by default.
                        newData.data = $.extend({}, options.data);
                        newData.url = options.url;

                        // Reset the options object - we'll re-populate in the following lines.
                        options = {};

                        // Set the proxy URL
                        options.url = Config.application.proxy + "?url=" + encodeURIComponent( newData.url);
                        options.data = $.param(newData.data);
                        options.crossDomain = false;
                    }
                });

            $.ajax({
                url : Config.application.servlet.download,
                type : 'POST',
                data : {
                    fn: "downloadSample.html",
                    ct: "text/html",
                    dt: this.m_resultHtml
                },
                crossDomain: true,
                success : function(code_text, statut){
                    $this.m_Logger.debug("Not yet implemented : success !");
                },
                error : function(resultat, statut, erreur){
                    $this.m_Logger.warn("Mode Ajax en échec : on tente un export en mode HTML simple !");
                    $this.doExport();
                },
                complete : function(resultat, statut){
                    $this.m_Logger.debug("Not yet implemented : complete !");
                }
            });

        },

        /**
         * fonction de Test
         * 
         * @param {type} e
         * @returns {undefined}
         */
        doTest: function(e) {
            
            this.m_Logger.debug("call : doTest !");
            
            alert("Test de la fonction d'export...");
            this.doExport();
        },

        /**
         * Ecriture de la page de résultat dans la zone d'execution (iframe).
         * 
         * @param {String} result
         * @returns {undefined}
         */
        doWriteResult: function(result) {
            
            // INFO
            // cf. http://openclassrooms.com/courses/ajax-et-l-echange-de-donnees-en-javascript/iframe-loading
            
            // FIXME 
            // performance !?
            // cf. http://blog.blary.be/analyse-diff%C3%A9rentes-fa%C3%A7ons-dint%C3%A9grer-un-script-javascript
            // cf. http://www.aaronpeters.nl/blog/iframe-loading-techniques-performance
            
            this.m_Logger.debug("call : doWriteResult !");
            
            var iframe          = this.uicodearea.boxResult[0];
            
            // INFO 
            // ça ne fonctionne pas avec ce type d'ajout de contenu dans une iframe...
            // var iframeWindow    = iframe.contentDocument.parentWindow || iframe.contentWindow;
            // iframeWindow.onload = function(){
            //     console.log("Local iframe is now loaded.");
            // };
            
            var doc = null;
            if(iframe.contentDocument) {
                doc = iframe.contentDocument;
            }
            else if(iframe.contentWindow) {
                doc = iframe.contentWindow.document;
            }
            else {
                doc = iframe.document;
            }

            doc.open();
            doc.writeln(result);
            doc.close();

        },

        /**
         * Calcul de la taille des fenetres 
         *  (par ex., aprés deplacement de la fenetres principale)
         * 
         * @returns {undefined}
         */
        resize: function() {
            
            this.m_Logger.debug("call : resize !");
            
            // on redefinit la taille de la fenetre !?
            $(this.m_divPlayer).height($(window).height());
            
            // FIXME 
            // le calcul CSS des hauteurs dans le javascript me parait douteux...
            // je decide donc de surcharger via le CSS externe...
            //   player   is _PlayGroundJS_holder
            //   crossbar is _PlayGroundJS_menu
            //   codearea is _PlayGroundJS_codeAera
            //   sideBar  is _PlayGroundJS_sidebar
            
            // var menuHeight    = this.crossbar.outerHeight(true);
            // var playerHeight  = this.player.outerHeight(true) - menuHeight;
            // var codeAreaWidth = this.player.outerWidth(true) - this.sidebar.outerWidth(true);

            // this.sidebar.css({top: menuHeight, height: playerHeight});
            // this.codeArea.css({top: menuHeight, height: playerHeight, width: codeAreaWidth});

            // FIXME : on surcharge les CSS de CodeMirror car les tailles des div sont bizarres !
            var h  = window.innerHeight - this.crossbar.outerHeight(true);
            var topLeft, topRight, bottomLeft, bottomRight;
            if (this.m_applySyntaxHighlighter) {
                topLeft    = $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:first-child .CodeMirror').height(Math.round(h*0.4));
                topRight   = $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:last-child  .CodeMirror').height(Math.round(h*0.4));
                bottomLeft = $('table._PlayGroundJS_codeAreaTable tbody tr:last-child td:first-child  .CodeMirror').height(Math.round(h*0.6));
                $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:first-child .CodeMirror-gutters').height(topLeft.height());
                $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:last-child  .CodeMirror-gutters').height(topRight.height());
                $('table._PlayGroundJS_codeAreaTable tbody tr:last-child td:first-child  .CodeMirror-gutters').height(bottomLeft.height());
                
            } 
            else {
                topLeft    = $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:first-child').height(Math.round(h*0.4));
                topRight   = $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:last-child').height(Math.round(h*0.4));
                bottomLeft = $('table._PlayGroundJS_codeAreaTable tbody tr:last-child td:first-child').height(Math.round(h*0.6));
                $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:first-child').height(topLeft.height());
                $('table._PlayGroundJS_codeAreaTable tbody tr:first-child td:last-child').height(topRight.height());
                $('table._PlayGroundJS_codeAreaTable tbody tr:last-child td:first-child').height(bottomLeft.height());
                
            }
            this.uicodearea.boxResult.css({height: bottomLeft.height()});
        },

        /**
         * Application de la colorisation synthaxique.
         *  INFO : on recalcule la taille des fenetres après la mise en colorisation !
         *  cf. resize()
         * 
         * @param {String} code
         * @returns {undefined}
         * 
         */
        applySyntaxHighlighter: function(code) {
            var $this = this;
            
            $this.m_Logger.debug("call : applySyntaxHighlighter !");
            
            if ($this.m_applySyntaxHighlighter) {
                if ($this.m_SyntaxHighlighter !== null) {
                    $this.m_SyntaxHighlighter.apply(code, {
                        onfinish: function() {
                            $this.m_Logger.debug("call resize into applySyntaxHighlighter() !");
                            $this.resize();
                        }
                    });
                }
            }

        },

        /**
         * Application de la colorisation synthaxique.
         * 
         * @returns {undefined}
         */
        applySyntaxHighlighterAll: function() {
            this.m_Logger.debug("call : applySyntaxHighlighterAll !");
            
            if (this.m_applySyntaxHighlighter) {
                
                if (this.m_SyntaxHighlighter !== null) {
                   // nettoyage à faire ?
                }
                
                // dans un ordre predefini ?
                var code = ["html","js","css"];
                
                for(var i=0; i<code.length;i++) {
                    this.applySyntaxHighlighter(code[i]);
                }
            }
        }
    };
    
    return PlayGroundJS;
});
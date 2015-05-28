/**
 * Programme principal
 * @tutorial PlayGroundJS
 * @module PlayGroundJS
 * @see module:helper
 * @see module:settings
 * @see module:syntaxhighlighter
 * @see module:logger
 * @see module:dependency
 * @see module:download
 * @see module:config
 * @see module:xhr
 * @see module:ui/ui-crossbar
 * @see module:ui/ui-sidebar
 * @see module:ui/ui-codearea
 * @todo !!! version avec ou sans JQuery !!!
 */

define([
    "jquery",
    // libs :
    "helper", 
    "settings", 
    "syntaxhighlighter",
    "type",
    "logger",
    "dependency",
    "download",
    "xhr",
    // GUI :
    "ui/ui-crossbar",
    "ui/ui-sidebar",
    "ui/ui-codearea",
    // other
    "config"
], function(
    $,
    // libs :
    Helper, 
    Settings, 
    SyntaxHighlighter, 
    Type, 
    Logger,
    Dependency,
    Download,
    RequestXHR,
    // GUI :
    UICrossBar,
    UISideBar,
    UICodeArea,
    // Other:
    Config
    ) 
{

    "use strict";
    
    /**
     * Description
     * @method PlayGroundJS
     * @param {Object} options
     * @param {String} options.div
     * @param {String} options.onsuccess
     * @param {String} options.onerror
     * @return {Object} PlayGroundJS
     */
    function PlayGroundJS(options) {

        if (!(this instanceof PlayGroundJS)) {
            throw new TypeError("PlayGroundJS constructor cannot be called as a function.");
        }
        
        this.player = null;
        
        // options : 
        //  - callbacks : onsuccess et onerror
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
    
    /**
     * div ID du player.
     * 
     * @type {string}
     * @constant
     * @default
     */ 
    PlayGroundJS.DIV = '#PlayGroundJS';
    
    PlayGroundJS.prototype = {
        
        /****************************
         * Variables de l'application
         ****************************/
        
        /**
         * div ID du player.
         * 
         * Information fournie via le param. options de la classe.
         * @example #PlayGroundJS
         * @type {string}
         */
        m_divPlayer: null,
        
        /**
         * Gestionnaire de log
         * @type {Object}
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
         * 
         * issue des paramètres de l'URL (cf. params.type)
         * 
         * Par defaut, utilisation de la lib. API JS Extended
         * @type {string}
         */
        m_jsApiType: null,
        
        /**
         * Version de l'API
         * 
         * issue de la configuration 
         * ou surchargée des paramètres de l'URL (cf. params.version)
         * @type {string}
         */
        m_jsApiVersion: null,
        
        /**
         * URL de l'API
         * 
         * issue de la configuration 
         * ou surchargée des paramètres de l'URL (cf. params.url)
         * @type {string}
         */
        m_jsApiUrl: null,
        
        /**
         * Exemple à charger :
         * loadSample : {
         *           sample_path: , // ex "/samples/",
         *           sample_name: , // ex "sample_1"
         *           sample_file: {
         *               html: , // ex "/samples/sample_1/sample_1.html",
         *               css:  , // ex "/samples/sample_1/css/sample_1.css",
         *               js:   , // ex "/samples/sample_1/js/sample_1.js"
         *           }
         *       }
         * issue des paramètres de l'URL (cf. params.loadsample)
         * @typedef loadSample
         * @type {Object} 
         * @property {string} sample_path
         * @property {string} sample_name
         * @property {string} sample_file.html
         * @property {string} sample_file.css
         * @property {string} sample_file.js
         */
        m_loadSample: null,

        /**
         * Active/Desactive la colorisation syntaxique
         * Par defaut, active...
         * 
         * issue des paramètres de l'URL (cf. params.applysyntaxhighlighter)
         * @type {Boolean}
         */
        m_applySyntaxHighlighter: true,
        
        /**
         * CodeMirror is a code-editor component that can be embedded in Web pages
         * cf. http://codemirror.net/
         * @type {Object}
         * @see SyntaxHighlighter
         */
        m_SyntaxHighlighter: null,

        /**
         * Page HTML de sortie en mode 'standalone'.
         * @type {string}
         */
        m_resultStandAlone: null,
        
        /********************
         * methodes publiques
         * (appel externe)
         ********************/
        
        /**
         * @constructor PlayGroundJS
         * @alias PlayGroundJS
         */
        constructor: PlayGroundJS,
        
        /**
         * fonction principale de chargement !
         * @method load
         * @see doLog
         * @see Settings
         * @see doInit
         * @see doImport
         * @see doGenerate
         * @see doRun
         */
        load: function() {
            
            var $this = this;
            
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
         * Calcul de la taille des fenetres 
         *  (par ex., aprés deplacement de la fenetres principale)
         *  
         * @method resize
         * @todo instruction CSS à supprimer !
         */
        resize: function() {
            
            this.m_Logger.debug("call : resize !");
            
            // on redefinit la taille de la fenetre !?
            // $(this.m_divPlayer).height($(window).height());
            
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
            
            var height = this.crossbar.offsetHeight;
            var style  = getComputedStyle(this.crossbar);
            height    += parseInt(style.marginTop) + parseInt(style.marginBottom);
            var h      = window.innerHeight - height;
            // version avec JQuery !
            // var h  = window.innerHeight - this.crossbar.outerHeight(true);
            
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
        
        /******************
         * methodes privées
         * (appel interne)
         ******************/
        
        /**
         * Reinitialiser le player à vide.
         *  (Not yet used !)
         * @method doEmpty
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
         * @method doLog
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
         * @method doInit
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
            
            // ***************
            //    SAMPLE
            // ***************
            
            // chargement de l'exemple
            $this.m_loadSample = $this.settings.loadSample; 
            
            // gestion des paths des fichiers de l'exemple 
            var html_file = "", 
                js_file   = "", 
                css_file  = "";
        
            var path = $this.m_loadSample.sample_path;
            var name = $this.m_loadSample.sample_name;

            // on a un chemin...
            if (path) {
                // on traite qq cas sur le path..., 
                // on supprime les '/' en debut de path !
                // mais on les ajoute à la fin !
                if (path.indexOf('./', 0) === 0)  {path=path.substring(2);}
                if (path.indexOf('/',  0)  === 0) {path=path.substring(1);}
                if (path.lastIndexOf("/")+1 !== path.length) {
                    path=path.concat("/");
                }
                // on sauvegarde
                $this.m_loadSample.sample_path = path;
                
                html_file = path;
                js_file   = path;
                css_file  = path;
            }

            // un repertoire ou un bout de chemin...
            if (name) {
                // on traite qq cas sur le path..., c'est aussi un simple nom d'exemple !
                if (name.indexOf('./', 0) === 0) {name=name.substring(2);}
                if (name.indexOf('/',  0) === 0) {name=name.substring(1);}
                if (name.lastIndexOf("/")+1 !== name.length) {
                    name=name.concat("/");
                }
                
                // on sauvegarde 
                $this.m_loadSample.sample_name = name;
                
                html_file = html_file.concat(name);
                js_file   = js_file.concat(name);
                css_file  = css_file.concat(name);
            }
            
            // on ajoute les fichiers aux chemins precedents...
            html_file =  html_file.concat($this.m_loadSample.sample_file.html);
            js_file   =  js_file.concat($this.m_loadSample.sample_file.js);
            css_file  =  css_file.concat($this.m_loadSample.sample_file.css);
            
            // on sauvegarde
            $this.m_loadSample.sample_file.html = html_file;
            $this.m_loadSample.sample_file.js   = js_file;
            $this.m_loadSample.sample_file.css  = css_file;
            
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
            
            // callback de fin de chargement ou d'erreur du player !
            if ($this.options.onsuccess == null) {
                    $this.options.onsuccess = function (message) {console.log(message);}
            }
            
            if ($this.options.onerror == null) {
                    $this.options.onload = function (message) {console.log(message);}
            }
        },
        
        /**
         * Generation de la page.
         * - creation du menu latteral (sidebar)
         * - creation du menu action (crossbar)
         * - creation des zones de codes (codearea)
         * 
         * @method doGenerate
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
         * 
         *  Chaque fichier, html, js et css, est placé dans sa zone d'edition 
         *  de code avec la colorisation synthaxique.
         *  
         *  Les dependances sont extraites de l'exemple.
         *  
         * @method doImport
         * @param {function} callback - fin d'import !
         */
        doImport: function(callback) {
            
            var $this = this;

            $this.m_Logger.debug("call : doImport !");
            
            // Au cas ou ...
            if (! $this.m_loadSample) {
                if (! $this.m_loadSample.sample_file.html) {
                    $this.boxHTML.append("code html à inserer.");
                }
                if (! $this.m_loadSample.sample_file.js) {
                    $this.boxJS.append("code js à inserer.");
                }
                if (! $this.m_loadSample.sample_file.css) {
                    $this.boxCSS.append("code css à inserer.");
                }

                return;
            }

            // Url de l'application
            var url = Helper.url();
            $this.m_Logger.debug(url);
            
            var xhr  = new RequestXHR();
            
            var lstUrl  = [];
            lstUrl.push(url.concat($this.m_loadSample.sample_file.html));
            lstUrl.push(url.concat($this.m_loadSample.sample_file.js));
            lstUrl.push(url.concat($this.m_loadSample.sample_file.css));
            
            Promise.all(xhr.gets(lstUrl))
                    .then(
                        // INFO 
                        // on charge les fichiers dans le GUI
                        function(responses){
                            $this.m_Logger.debug("sample data : " + responses);
                            
                            var resp_html, resp_js, resp_css;
                            
                            if (responses) {
                                
                                resp_html = responses[0];
                                resp_js   = responses[1];
                                resp_css  = responses[2];

                                __loadUI_HTML(resp_html);
                                __loadUI_JS(resp_js);
                                __loadUI_CSS(resp_css);
                            }
                        }
                    )
                    .catch(
                        // INFO 
                        // echec d'une requête !
                        // callback onerror
                        function(error){
                            $this.m_Logger.debug("sample request Ajax FAILED (onError Callback) !");
                            if ($this.options.onerror != null && typeof $this.options.onerror === 'function') {
                                $this.options.onerror.call($this, "Erreur de chargement de l'exemple (" + error.message + ") !");
                                // si on souhaite  ne pas aller plus loin, 
                                // on peut toujours relancer cette exception...
                                throw error;
                            }   
                        }
                    )
                    .then(
                        // INFO
                        // appel de cette fonction de colorisation synthaxique !
                        function(){
                            $this.applySyntaxHighlighterAll();
                        }
                    )
                    .then(
                        // INFO 
                        // reussite de toutes les requetes !
                        // callback onfinish pour notifier la fin de l'import !
                        // callback : declenche l'execution !
                        function(){
                            $this.m_Logger.debug("import sample FINISHED (onFinish Callback) !");
                            if (callback != null && typeof callback.onfinish === 'function') {
                                callback.onfinish.call($this, ["Fin de l'import de l'exemple !"]);
                            }
                        }
                    )
                    .then(
                        // INFO 
                        // reussite du chargement du player
                        // callback onsuccess
                        function() {
                            $this.m_Logger.debug("sample LOADED (onSuccess Callback) !");
                            if ($this.options.onsuccess != null && typeof $this.options.onsuccess === 'function') {
                                $this.options.onsuccess.call($this, "Succes du chargement de l'exemple !");
                            }
                        }
                    );
            
            /**
             * Chargement du HTML dans la fenetre GUI
             * @method __loadUI_HTML
             * @param {String} response
             */
            function __loadUI_HTML(response) {
                
                $this.m_Logger.debug("code : " + response);

                // extraction du body
                var body = Helper.extractBody(response);
                // insertion du code dans la page
                $this.uicodearea.boxHTML.text(body);
                $this.m_Logger.debug("body : " + body);

                // extraction des dependances
                var dep = new Dependency(Helper.getDoc(response));

                // INFO
                // ajout du path url dans les lib. internes de l'exemple !
                // on enleve le '/' de fin de l'URL !
                var thisurl     = url.concat($this.m_loadSample.sample_file.html);
                var path_absolu = thisurl.substring(0, thisurl.lastIndexOf("/"));
                var path_relatif= thisurl.substring(url.length, thisurl.lastIndexOf("/"));

                $this.m_Logger.debug('url abs. : ' + path_absolu);
                $this.m_Logger.debug('url rel. : ' + path_relatif);

                var lstUrlInterne = dep.getScriptsInternal(path_relatif);
                $this.uisidebar.set_jsapi_dependencies(lstUrlInterne);
                $this.m_Logger.debug("url interne : " +lstUrlInterne);

                // extraction des dependances externes
                var lstUrlExterne = dep.getScriptsExternal();
                $this.uisidebar.set_jsapi_dependencies(lstUrlExterne);
                $this.m_Logger.debug("url externe : " + lstUrlExterne);

                // extraction des dependances css
                var lstUrlCssInterne = dep.getCssInternal(path_relatif);
                $this.uisidebar.set_jsapi_dependencies_css(lstUrlCssInterne);
                $this.m_Logger.debug("css interne : " +lstUrlCssInterne);

                // extraction des dependances css externes
                var lstUrlCssExterne = dep.getCssExternal();
                $this.uisidebar.set_jsapi_dependencies_css(lstUrlCssExterne);
                $this.m_Logger.debug("css externe : " +lstUrlCssExterne);
            
            };
    
            /**
             * Chargement du JS dans la fenetre GUI
             * @method __loadUI_JS
             * @param {String} response
             */
            function __loadUI_JS(response) {
                $this.m_Logger.debug("code : " + response);
                // insertion du code dans la page
                $this.uicodearea.boxJS.text(response);
            }
            
            /**
             * Chargement du CSS dans la fenetre GUI
             * @method __loadUI_CSS
             * @param {String} response
             */
            function __loadUI_CSS(response) {
                $this.m_Logger.debug("code : " + response);

                // FIXME hummm..., pb de path relatif...
                // ex. url(img/loading.png)
                //     au lieu de url(samples/sample_4/img/loading.png)
                var css_text = response;

                var css =  Helper.pathIntoCSS(response);
                for(var i=0; i<css.length; i++) {
                    // sinon, on determine le nom de l'archive à partir du fichier HTML
                    var file = $this.m_loadSample.sample_file.css;
                    var path = file.substring(0, file.lastIndexOf("/")+1);
                    (function(k){
                        var v = css[k];
                        css_text = css_text.replace(v, path + v);
                    })(i);
                }

                // insertion du code dans la page
                $this.uicodearea.boxCSS.text(css_text);
            }

        },
        
        /**
         * Export de l'exemple dans un fichier de sortie.
         * 
         *  Les fichiers html, js et css sont placés dans une page html, sans les ressources...
         * 
         * @method doExport
         * @deprecated Not yet used !
         */
        doExport: function () {
            
            var $this = this;
            $this.m_Logger.debug("Not yet implemented : doExport !");
            
            // FIXME : FF ? et IE non testé...
            var elt = document.createElement('a');
            elt.setAttribute('href', 'data:text/html;charset=utf-8,' +
                    encodeURIComponent(this.m_resultStandAlone));
            elt.setAttribute('download', "exportSample.html");
            if (elt.addEventListener) {elt.addEventListener("click",function(){$this.m_Logger.debug("addEventListener");},true);}
            else {elt.attachEvent('onclick', function(){$this.m_Logger.debug("attachEvent");});}
            elt.click();
            
            // Version simpliste..., mais c'est juste pour l'exemple !
            // document.location = 'data:text/html,' +
            //                   encodeURIComponent(this.m_resultStandAlone);
            
        },
        
        /**
         * Execution de l'exemple
         * 
         *  Chaque fragment de code (html, cc et js) est concaténé dans une chaine de 
         *  caractères. Les dependances (interne et externe) de l'exemple y sont ajoutées.
         *  Cette chaine est insérée dans une 'iframe' pour execution.
         *  
         *  @method doRun
         */
        doRun: function() {
            
            this.m_Logger.debug("call : doRun !");
            
            // FIXME 
            // en mode lib. éclatée, toutes les dependances de la lib. API JS 
            // sont intégrées dans l'iframe ?! d'où un chargement long !?
            // cf. http://blog.blary.be/analyse-diff%C3%A9rentes-fa%C3%A7ons-dint%C3%A9grer-un-script-javascript
            
            // activation de la patience
            // this.uicodearea.waiting();

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
            codeHTML = this.uicodearea.getHTML();
            codeCSS  = this.uicodearea.getCSS();
            codeJS   = this.uicodearea.getJS();

            // script JS : c'est l'API !
            var m_strApiJS = '<script type="text/javascript" src="' + this.uisidebar.get_jsapi_selected() + '"></script>';
            
            // script JS : dependances de l'exemple
            var m_strApiJSDeps = "";
            var jsDeps = this.uisidebar.get_jsapi_dependencies();
            for(var i=0; i<jsDeps.length; i++) {
                m_strApiJSDeps += Helper.createScript(jsDeps[i]);
            }
            
            // CSS : dependances de l'exemple
            var m_strApiCSSDeps = "";
            var cssDeps = this.uisidebar.get_jsapi_dependencies_css();
            for(var i=0; i<cssDeps.length; i++) {
                m_strApiCSSDeps += Helper.createCss(cssDeps[i]);
            }

            // script : JS Framework
            var m_strFrameworkJSDeps = "";
            var jsFrameworks = this.uisidebar.get_jsdep_cdn();
            for(var i=0; i<jsFrameworks.length; i++) {
                // on filtre celles qui sont nulles !
                if (jsFrameworks[i] != null) {
                    m_strFrameworkJSDeps += Helper.createScript(jsFrameworks[i])
                }
            }

            // script : JS externes
            var m_strExternalJSDeps = "";
            var jsExternals = this.uisidebar.get_jsdep_external();
            for(var i=0; i<jsExternals.length; i++) {
                // on filtre celles qui sont nulles !
                if (jsExternals[i] != null) {
                    m_strExternalJSDeps += Helper.createScript(jsExternals[i]);
                }
            }
            
            // on enregistre les differents resultats
            // (c'est un peu pourri comme méthode...)
            var result = {
                    script_api            : m_strApiJS,
                    css_api_deps          : m_strApiCSSDeps,
                    script_api_deps       : m_strApiJSDeps,
                    script_external_deps  : m_strExternalJSDeps,
                    script_framework_deps : m_strFrameworkJSDeps,
                    code: {
                        css: codeCSS,
                        html: codeHTML,
                        js: codeJS
                    }
            };
            
            // FIXME 
            // mettre en place l'image de la patience..., et donc attendre la fin du
            // chargement de l'IFrame.
            // 1. hummm..., si le document n'est pas encore chargé, 
            // comment peut on afficher l'image ou avoir une interaction avec qqch qui est 
            // en train de se charger ?
            // 2. comment savoir si l'iframe est chargée ?

            var strLoadCallback = '\
            function loadCallback () {\n\
                parent.loadIFrameCallback();\n\
            };';
            
            // resultat 
            var html = "";
                html = html.concat('<html> ', '\n');
                html = html.concat('<head>',  '\n');
                html = html.concat("<!-- JS Deps externes -->", '\n', result.script_external_deps, '\n');
                html = html.concat("<!-- JS API Deps -->", '\n',      result.script_api_deps, '\n');
                html = html.concat("<!-- JS API -->", '\n',           result.script_api, '\n');
                html = html.concat("<!-- JS Deps Framework -->", '\n',result.script_framework_deps, '\n');
                html = html.concat("<!-- Scripts -->", '\n');
                html = html.concat('<script type="text/javascript">', '\n');
                html = html.concat(strLoadCallback, '\n');
                html = html.concat("</script>", '\n');
                html = html.concat("<!-- CSS API Deps -->", '\n');
                html = html.concat(result.css_api_deps, '\n');
                html = html.concat("<!-- CSS -->", '\n');
                html = html.concat("<style>", '\n');
                html = html.concat(result.code.css, '\n');
                html = html.concat("</style>", '\n');
                html = html.concat('</head>', '\n');
                html = html.concat('<body onload="loadCallback()">', '\n');
                html = html.concat("<!-- HTML -->", '\n');
                html = html.concat(result.code.html, '\n');
                html = html.concat("<!-- Scripts -->", '\n');
                html = html.concat("<script type=\"text/javascript\">", '\n');
                html = html.concat(result.code.js, '\n');
                html = html.concat("</script>", '\n');
                html = html.concat('</body' , '\n');
                html = html.concat('</html> ','\n');
                
            // sauvegarde du resultat !
            this.m_resultStandAlone = html; 
            this.m_Logger.debug(this.m_resultStandAlone);
            
            this.doWriteResult(this.m_resultStandAlone);
        },

        /**
         * Recharge l'exemple initiale
         * 
         * @method doReset
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
         * 
         *  Un fichier archive contenant le code HTML, JS et CSS.
         *
         * @method doSave
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
                // on prend le nom de l'exemple 
                var name = $this.m_loadSample.sample_name;
                archive = name.substring(0, name.lastIndexOf("/"));
            }
            else {
                // sinon, on determine le nom de l'archive à partir du fichier HTML
                var html = $this.m_loadSample.sample_file.html;
                archive  = html.substring(html.lastIndexOf("/")+1, html.lastIndexOf("."));
            }
            
            // options par defaut
            var options = {
                // INFO
                // interaction entre le player et la fonction callback !
                // scope    : $this, 
                archive  : archive,
                base     : Config.application.archive,
                onsuccess: callbackOnSuccess,
                onfailure: callbackOnFailure,
            };
                      
            // le code est il modifié ?
            var sampleIsModified = $this.uicodearea.isModified();
            if (sampleIsModified) {
                $this.m_Logger.debug("Code modifié !");
            }
            
            // INFO
            // on ne traite plus le cas où on utilise une archive pré calculée !
            var entries = {
                files :[]
            };

            var m_strApiJS           = "", 
                m_strApiCSSDeps      = "", 
                m_strApiJSDeps       = "", 
                m_strExternalJSDeps  = "", 
                m_strFrameworkJSDeps = "";

            m_strApiJS = '<script type="text/javascript" src="' + this.uisidebar.get_jsapi_selected() + '"></script>';

            // INFO
            // les paths internes doivent être relatifs à l'exemple, 
            // et non pas par rapport à l'execution dans l'application !
            // on reconstruit donc les chemins...
            var url_sample = this.m_loadSample.sample_file.html;
            var url_base   = url_sample.substring(0, url_sample.lastIndexOf("/"));

            var jsDeps = this.uisidebar.get_jsapi_dependencies();
            for(var i=0; i<jsDeps.length; i++) {
                var v = Helper.path2relative(url_base, jsDeps[i]);
                m_strApiJSDeps += Helper.createScript(v);
            }

            var cssDeps = this.uisidebar.get_jsapi_dependencies_css();
            for(var i=0; i<cssDeps.length; i++) {
                var v = Helper.path2relative(url_base, cssDeps[i]);
                m_strApiCSSDeps += Helper.createCss(v);
            }

            // INFO
            // cas SPECIAL où le fichier HTML est livré sans entête (head)... possible !?
            // on ajoute donc la dependance CSS et JS !
            if (m_strApiCSSDeps == "" && m_strApiJSDeps == "") {
                m_strApiCSSDeps = Helper.createCss(Helper.path2relative(url_base, this.m_loadSample.sample_file.css));
                m_strApiJSDeps  = Helper.createScript(Helper.path2relative(url_base, this.m_loadSample.sample_file.js));
            }

            // INFO
            // pas de gestion des paths sur des lib. externes...
            var jsFrameworks = this.uisidebar.get_jsdep_cdn();
            for(var i=0; i<jsFrameworks.length; i++) {
                // par contre, on filtre celles qui sont nulles !
                if (jsFrameworks[i] != null) {
                    m_strFrameworkJSDeps += Helper.createScript(jsFrameworks[i]);
                }
            }

            // INFO
            // pas de gestion des paths sur des dependances externes...
            var jsExternals = this.uisidebar.get_jsdep_external();
            for(var i=0; i<jsExternals.length; i++) {
                // par contre, on filtre celles qui sont nulles !
                if (jsExternals[i] != null) {
                    m_strExternalJSDeps += Helper.createScript(jsExternals[i]);
                }
            }

            // on enregistre les differents resultats
            // (c'est un peu pourri comme méthode...)
            var result = {
                script_api            : m_strApiJS,
                css_api_deps          : m_strApiCSSDeps,
                script_api_deps       : m_strApiJSDeps,
                script_external_deps  : m_strExternalJSDeps,
                script_framework_deps : m_strFrameworkJSDeps,
                code: {
                    css : this.uicodearea.getCSS(),
                    html: this.uicodearea.getHTML(),
                    js  : this.uicodearea.getJS()
                }
            };

            // INFO
            // obtenir une liste de fichiers avec leur chemin dans l'archive sur :
            // - des fichiers HTML, CSS et JS, 
            // - des ressources du CSS, 
            // - des dependances JS,
            // - des dependances CSS

            var filepath_html = $this.m_loadSample.sample_file.html;
            var filepath_css  = $this.m_loadSample.sample_file.css;
            var filepath_js   = $this.m_loadSample.sample_file.js;

            // INFO
            // ajout de l'entête du fichier HTML
            // avec encodage du fichier : UTF-8 -> ISO-8859-15
            var content_html = "";
                content_html = content_html.concat('<html> ', '\n');
                content_html = content_html.concat('<head>',  '\n');
                content_html = content_html.concat('<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-15"/>', '\n');
                content_html = content_html.concat("<!-- JS Deps externes -->", '\n', result.script_external_deps, '\n');
                content_html = content_html.concat("<!-- JS Deps Framework -->", '\n',result.script_framework_deps, '\n');
                content_html = content_html.concat("<!-- JS API Deps -->", '\n',      result.script_api_deps, '\n');
                content_html = content_html.concat("<!-- JS API -->", '\n',           result.script_api, '\n');
                content_html = content_html.concat("<!-- CSS API Deps -->", '\n',     result.css_api_deps, '\n');
                content_html = content_html.concat('</head>', '\n');
                content_html = content_html.concat('<body'  , '\n');
                content_html = content_html.concat(result.code.html, '\n');
                content_html = content_html.concat('</body' , '\n');
                content_html = content_html.concat('</html> ','\n');

            // INFO
            // gestion des paths des ressources des CSS 
            // ex. les images (cf. doImport(), importation du fichier CSS)
            var content_css = result.code.css;

            var css = Helper.pathIntoCSS(result.code.css);
            for(var i=0; i<css.length; i++) {
                var path = filepath_css.substring(0, filepath_css.lastIndexOf("/")+1);
                (function(k){
                    var v = css[k];
                    content_css = content_css.replace(path, '');
                })(i);
             }

            // ajout des fichiers HTML, JS et CSS 
            // avec leur contenu
            entries.files.push(
                {path:filepath_html, content: content_html},
                {path:filepath_css,  content: content_css},
                {path:filepath_js,   content: result.code.js}
            );

            // on recherche des paths dans les fichiers HTML, JS et CSS, 
            // epour ajout dans l'archive
            //  ex. sur le fichier "./sample/sample_1/sample.html", 
            //  on aura une liste de path :
            //    -> ./sample/
            //    -> ./sample/sample_1/
            //    -> ./sample/sample_1/sample.html (Attention, déjà ajouté !)
            var files = [];
            var path_html = filepath_html.substring(0,filepath_html.lastIndexOf("/")+1);
            var path_css  = filepath_css.substring(0,filepath_css.lastIndexOf("/")+1);
            var path_js   = filepath_js.substring(0,  filepath_js.lastIndexOf("/")+1);
            
            files.push(path_html);
            files.push(path_css);
            files.push(path_js);

            var paths_file = Helper.paths(files);
            for(var i=0; i<paths_file.length; i++) {
                entries.files.push( {path:paths_file[i]} );
            }

            // on recherche des paths dans les ressources des CSS (internes uniquement)
            // pour ajout dans l'archive
            //  ex. les images
            var resources_css = Helper.pathIntoCSS(result.code.css);
            for(var i=0; i<resources_css.length; i++) {
                entries.files.push( {path:resources_css[i]} );
            }

            var paths_css = Helper.paths(resources_css);
            for(var i=0; i<paths_css.length; i++) {
                entries.files.push( {path:paths_css[i]} );
            }

            // on recherche des paths des dependances CSS (internes uniquement)
            // pour ajout dans l'archive

            for(var i=0; i<cssDeps.length; i++) {
                var regex = new RegExp("http://");
                if (! regex.test(cssDeps[i])) {
                    if(cssDeps[i] == filepath_css) {
                        continue;
                    }
                    entries.files.push( {path:cssDeps[i]} );
                }
            }

            var paths_css_deps = Helper.paths(cssDeps);
            for(var i=0; i<paths_css_deps.length; i++) {
                entries.files.push( {path:paths_css_deps[i]} );
            }

            // on recherche des paths des dependances JS (internes uniquement)
            // pour ajout dans l'archive

            for(var i=0; i<jsDeps.length; i++) {
                var regex = new RegExp("http://");
                if (! regex.test(jsDeps[i])) {
                    if(jsDeps[i] == filepath_js) {
                        continue;
                    }
                    entries.files.push( {path:jsDeps[i]} );
                }
            }

            var paths_js_deps = Helper.paths(jsDeps);
            for(var i=0; i<paths_js_deps.length; i++) {
                entries.files.push( {path:paths_js_deps[i]} );
            }

            // on sauvegarde le tout dans "options"
            Helper.extend(options,  entries);
            Helper.extend(options,  {base:Helper.url()});
            
            var dl = new Download(options);
            dl.send();
        },

        /**
         * fonction de Test
         * 
         * @method doTest
         * @param {type} e
         * @deprecated Orienté maintenance !
         */
        doTest: function(e) {
            
            this.m_Logger.debug("call : doTest !");
            
            alert("Test de la fonction d'export...");
            this.doExport();
        },

        /**
         * Ecriture de la page de résultat dans la zone d'execution (iframe).
         * 
         * @method doWriteResult
         * @param {String} document
         */
        doWriteResult: function(result) {
            
            // INFO
            // cf. http://openclassrooms.com/courses/ajax-et-l-echange-de-donnees-en-javascript/iframe-loading
            
            // FIXME 
            // performance !?
            // cf. http://blog.blary.be/analyse-diff%C3%A9rentes-fa%C3%A7ons-dint%C3%A9grer-un-script-javascript
            // cf. http://www.aaronpeters.nl/blog/iframe-loading-techniques-performance
            
            this.m_Logger.debug("call : doWriteResult !");
            
            // INFO
            // on nettoie l'ancienne iframe car selon les navigateurs, on a des pb de mise à jour...
            var iframe_old = document.getElementById("iframe");
            var iframe_new = this.uicodearea.boxResult[0]; // attention, c'est du JQuery !
            var parent = iframe_old.parentNode;
            parent.removeChild(iframe_old);
            parent.appendChild(iframe_new);
            
            // INFO 
            // ça ne fonctionne pas avec ce type d'ajout de contenu dans une iframe...
            // var iframeWindow    = iframe.contentDocument.parentWindow || iframe.contentWindow;
            // iframeWindow.onload = function(){
            //     console.log("Local iframe is now loaded.");
            // };
            
            var doc = null;
            if(iframe_new.contentDocument) {
                doc = iframe_new.contentDocument;
            }
            else if(iframe_new.contentWindow) {
                doc = iframe_new.contentWindow.document;
            }
            else {
                doc = iframe_new.document;
            }
            
            
            doc.open();
            doc.writeln(result);
            doc.close();
            
            this.m_Logger.debug(iframe_new);
            
            // TODO
            // callback onerror et onsuccess

        },

        /**
         * Application de la colorisation synthaxique.
         * 
         *  On recalcule la taille des fenetres après la mise en colorisation !
         * 
         * @method applySyntaxHighlighter
         * @param {String} code - "html","js","css"
         * @see applySyntaxHighlighterAll
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
         * @method applySyntaxHighlighterAll
         * @see applySyntaxHighlighter
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

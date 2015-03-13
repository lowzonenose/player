/**
 * Gestion des parametres de l'URL.
 * @tutorial Settings
 * @module Settings
 */
define(function () {

    "use strict";
    
    /**
     * Description
     * @method Settings
     * @return 
     */
    function Settings() {
        
        if (!(this instanceof Settings)) {
            throw new TypeError("Settings constructor cannot be called as a function.");
        }
        
        this.settings = {};
    }

    Settings.PARAMS_HIGHLIGHTER = true;
    Settings.PARAMS_TYPE_API    = "Extended";
    Settings.PARAMS_SAMPLE_PATH = "samples";
    Settings.PARAMS_SAMPLE_NAME = "sample_1";
    Settings.PARAMS_SAMPLE_FILE_HTML = "sample_1.html";
    Settings.PARAMS_SAMPLE_FILE_JS   = "sample_1.js";
    Settings.PARAMS_SAMPLE_FILE_CSS  = "sample_1.css";
    

    /**
     * Description
     * @method hasParams
     * @return 
     */
    function hasParams () {
        if (location.search) {
           var parts = location.search.substring(1).split('&');
           return (parts.length > 0) ? true : false;
        }
    };
    
    /**
     * Description
     * @method getParams
     * @return params
     */
    function getParams() {
        var params = {};
        
        if (location.search) {
           var parts = location.search.substring(1).split('&');
           for (var i = 0; i < parts.length; i++) {
                var nv = parts[i].split('=');
                if (!nv[0]) continue;
                // FIXME : pas de valeur par defaut !?
                // params[nv[0]] = nv[1] || true; 
                params[nv[0]] = nv[1];
            }
        }
        return params;
    };
    
    Settings.prototype = {
        
        /**
         * @alias Settings
         * @constructor Settings
         */
    	constructor: Settings,
        
        /**
         * Description
         * @method getSettings
         * @return MemberExpression
         */
        getSettings: function() {
            
            if (hasParams()) {
                var params = getParams();
                
                // Cas sans parametre !
                if (! params.sample_name &&
                    ! params.sample_path &&
                    ! params.sample_file_html &&
                    ! params.sample_file_js &&
                    ! params.sample_file_css) {

                    // c'est un cas par defaut de type HelloWorld !
                    params.sample_path      = Settings.PARAMS_SAMPLE_PATH;
                    params.sample_name      = Settings.PARAMS_SAMPLE_NAME;
                    params.sample_file_html = Settings.PARAMS_SAMPLE_FILE_HTML;
                    params.sample_file_js   = Settings.PARAMS_SAMPLE_FILE_JS;
                    params.sample_file_css  = Settings.PARAMS_SAMPLE_FILE_CSS;

                }
                    
                // test sur exemple si parametres manquants !
                if (! params.sample_file_html && params.sample_name) {params.sample_file_html = params.sample_name+".html";} 
                if (! params.sample_file_js   && params.sample_name) {params.sample_file_js   = params.sample_name+".js";}
                if (! params.sample_file_css  && params.sample_name) {params.sample_file_css  = params.sample_name+".css";}

                if (params.sample_file_html &&
                    params.sample_file_js &&
                    params.sample_file_css  &&      
                    params.sample_name && 
                    ! params.sample_path ) {params.sample_path = Settings.PARAMS_SAMPLE_PATH;}
            
                // test sur exemple si on peut determiner des params manquants !
                if (! params.sample_path) {
                    // TODO 
                    // par defaut, on prend le chemin du fichier HTML !
                }
                if (! params.sample_name) {
                    // TODO 
                    // par defaut, on prend le nom du fichier HTML !
                }
            
                // test sur colorisation syntaxique !
                // ex. true|false
                if (! params.applysyntaxhighlighter) {params.applysyntaxhighlighter=Settings.PARAMS_HIGHLIGHTER;}
                
                
                
                // test sur le type d'API !
                // ex. extended|ext, 
                //     standard|std, 
                //     mobile|mob, 
                //     3d, 
                //     flash|f, 
                //     gouv|g, 
                //     minimal|min
                if (! params.type) {params.type=Settings.PARAMS_TYPE_API;}
                if (! params.version) {} // la version par defaut cf. config
                if (! params.url) {}     // l'url par defaut cf. config
                
                // on charge toutes les options dans 'settings'
                // puis on le transme à la classe d'application...
                this.settings = {
                    applySyntaxHighlighter: params.applysyntaxhighlighter,
                    typeApiJs: params.type,
                    versionApiJs: params.version,
                    urlApiJs: params.url,
                    loadSample : {
                        sample_path: params.sample_path,
                        sample_name: params.sample_name,
                        sample_file: {
                            html: params.sample_file_html,
                            css:  params.sample_file_css,
                            js:   params.sample_file_js,
                        }
                    }
                };
                
            }
            else {
                // exemple par defaut...
                this.settings = {
                        applySyntaxHighlighter: Settings.PARAMS_HIGHLIGHTER,
                        typeApiJs: Settings.PARAMS_TYPE_API,
                        versionApiJs: null, // overload in config per env !
                        urlApiJs: null,     // overload in config per env !
                        loadSample : {
                            sample_path: Settings.PARAMS_SAMPLE_PATH, 
                            sample_name: Settings.PARAMS_SAMPLE_NAME,
                            sample_file: {
                                html: Settings.PARAMS_SAMPLE_FILE_HTML,
                                css:  Settings.PARAMS_SAMPLE_FILE_CSS,
                                js:   Settings.PARAMS_SAMPLE_FILE_JS,
                            }
                        }
                    };
            }
            
            return this.settings;
        }
        
    };
    
    return Settings;
});
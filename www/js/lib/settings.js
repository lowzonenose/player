/**     
 * INFO
 * This example make use of requireJS to provide a clean and simple way to split 
 * JavaScript class definitions into separate files and avoid global namespace pollution.  
 * http://requirejs.org/
 *
 * We start by defining the definition within the require block inside a function; 
 * this means that any new variables / methods will not be added to the global namespace; 
 * requireJS simply requires us to return a single value (function / Object) 
 * which represents this definition.  
 * In our case, we will be returning the Class' function.
 */
define(function () {
    
    /**
     * DESCRIPTION
     *  Gestion des parametres de l'URL.
     *  Permet de definir les informations sur :
     *  - l'API : version, type, url
     *  - l'exemple
     *  - la colorisation synthaxique
     *  
     * USAGE
     *  var obj = new Settings();
     *  obj.getSettings();
     * 
     * RETURN
     *  {
     *      applySyntaxHighlighter: ...,
     *      typeApiJs: ...,
     *      versionApiJs: ...,
     *      urlApiJs: ...,
     *      loadSample : {
     *          sample_path:  ...,
     *          sample_name:  ...,
     *          sample_file: {
     *              html: ...,
     *              css:  ...,
     *              js:   ...,
     *          }
     *      }
     *  }
     * 
     * SEE ASLO
     *  obj.set*()
     *  obj.get*()
     * 
     */
         
    // INFO
    // Forces the JavaScript engine into strict mode
    // http://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
    "use strict";
    
    /**
     * Constructor
     */
    function Settings() {
        
        if (!(this instanceof Settings)) {
            throw new TypeError("Settings constructor cannot be called as a function.");
        }
        
        this.settings = {};
    }
    
    /**
     * INFO
     * Adding static properties is as simple as adding them directly to the constructor
     * function directly.
     */
    Settings.PARAMS_HIGHLIGHTER = true;
    Settings.PARAMS_TYPE_API    = "Extended";
    Settings.PARAMS_SAMPLE_PATH = "samples";
    Settings.PARAMS_SAMPLE_NAME = "sample_1";
    Settings.PARAMS_SAMPLE_FILE_HTML = "sample_1.html";
    Settings.PARAMS_SAMPLE_FILE_JS   = "sample_1.js";
    Settings.PARAMS_SAMPLE_FILE_CSS  = "sample_1.css";
    
    /**
     * INFO
     * Any functions not added to the Settings reference won't be visible, or 
     * accessible outside of this file (closure); however, these methods and 
     * functions don't belong to the Settings class either and are static as a result.
     */
    function hasParams () {
        // INFO Note that 'this' does not refer to the Settings object from inside this method.
        if (location.search) {
           var parts = location.search.substring(1).split('&');
           return (parts.length > 0) ? true : false;
        }
    };
    
    function getParams() {
        // INFO Note that 'this' does not refer to the Settings object from inside this method.
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
         * INFO
    	 * Whenever you replace an Object's Prototype, you need to repoint
    	 * the base Constructor back at the original constructor Function, 
    	 * otherwise `instanceof` calls will fail.
    	 */
    	constructor: Settings,
        
        /**
         * INFO
         * All methods added to a Class' prototype are public (visible); they are able to 
         * access the properties and methods of the Person class via the `this` keyword.
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
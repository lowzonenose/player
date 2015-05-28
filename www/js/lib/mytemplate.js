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
    
    // INFO
    // 2 methodes pour appeler les dependances avec RequireJS:
    // 
    // define([ 
    //     "zip",
    //     "zip-utils",
    //     "zip-save",
    // ], function (JSZip, JSZipUtils, JSFileSave) {
    //     // (...)
    // });
    // 
    // ou 
    // 
    // define(function(require) {
    //     var JSZip      = require("zip"),
    //         JSZipUtils = require("zip-utils"),
    //         JSFileSave = require("zip-save");
    //     // (...)
    // });
        
    // INFO
    // Forces the JavaScript engine into strict mode
    // http://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it
    "use strict";
    

    function Template() {
        
        if (!(this instanceof Template)) {
            throw new TypeError("Template constructor cannot be called as a function.");
        }
        
        this.settings = {};
    }
    
    /**
     * INFO
     * Adding static properties is as simple as adding them directly to the constructor
     * function directly.
     */
    Template.PARAMS = true;
    
    /**
     * INFO
     * Any functions not added to the Settings reference won't be visible, or 
     * accessible outside of this file (closure); however, these methods and 
     * functions don't belong to the Settings class either and are static as a result.
     */

    function getParams() {
        // INFO Note that 'this' does not refer to the Settings object from inside this method.
        var params = {};
        if(Template.PARAMS) {
            return params;
        }
    };
    
    Template.prototype = {
        
        /**
         * INFO
    	 * Whenever you replace an Object's Prototype, you need to repoint
    	 * the base Constructor back at the original constructor Function, 
    	 * otherwise `instanceof` calls will fail.
    	 */
    	constructor: Template,
        
        /**
         * INFO
         * All methods added to a Class' prototype are public (visible); they are able to 
         * access the properties and methods of the Person class via the `this` keyword.
         */
        getSettings: function() {
            
            var params = getParams();
            
            if(Template.PARAMS) {  
                return this.settings;
            }
        }
        
    };
    
    return Template;
});
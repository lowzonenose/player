 /**
 * Gestion des types d'API.
 * @tutorial Type
 * @module Type
 */
define(function () {

    "use strict";
    
    /**
     * Description
     * @method Type
     * @param {} type
     * @return 
     */
    function Type(type) {
        
        if (!(this instanceof Type)) {
            throw new TypeError("Type constructor cannot be called as a function.");
        }
        
        this.type = type;
    }
      
    Type.DEFAULT = "Extended";
    
    /**
     * Description
     * @method isExist
     * @param {} type
     * @return ConditionalExpression
     */
    Type.isExist = function(type) {
        
        var obj = new Type(type);
        return obj.check() == null  ? false : true;

    };
    
    Type.prototype = {
        
        constructor: Type,
        
        /**
         * Description
         * @method check
         * @return MemberExpression
         */
        check: function() {
            
            switch (true) {
                case /^(extended|ext|apiahnext|apiext)$/.test(this.type):
                    this.type = "Extended";
                    break;
                case /^(standard|std|apiahnstd|apistd)$/.test(this.type):
                    this.type = "Standard";
                    break;
                case /^(mobile|mob|apimobile)$/.test(this.type):
                    this.type = "Mobile";
                    break;
                case /^(3d|apiahn3d)$/.test(this.type):
                    this.type = "3D";
                    break;
                case /^(minimal|min|apimin)$/.test(this.type):
                    this.type = "Min";
                    break;
                case /^(flash|f|apiahnflex)$/.test(this.type):
                    this.type = "Flash";
                    break;
                case /^(gouv|g)$/.test(this.type):
                    this.type = "Gouv";
                    break;
                default :
                    console.log("Ce type d'API JS n'existe pas !");
                    this.type = null;
            }

            return this.type;
        },
        
        /**
         * Description
         * @method getType
         * @return MemberExpression
         */
        getType: function () {
            
            if (this.check() == null) {
                this.type = Type.DEFAULT;
            }
            return this.type;
        },
        
        /**
         * Description
         * @method setType
         * @param {} type
         * @return 
         */
        setType: function (type) {
            this.type = type;
        }
        
    };
    
    return Type;
});


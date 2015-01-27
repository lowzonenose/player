define(function () {
    
    /**
     * DESCRIPTION
     *  Gestion des types d'API.
     *  
     * INFORMATION
     *  
     * 
     * USAGE
     *  var obj  = new Type("extended");
     *  var type = obj.getType(); // Extended
     * 
     * ou
     *  
     *  (static)
     *  Type.isExist("extended"); // true / false
     * 
     * RETURN
     *  Le type d'API
     * 
     * SEE ASLO
     *  
     */
    
    "use strict";
    
    function Type(type) {
        
        if (!(this instanceof Type)) {
            throw new TypeError("Type constructor cannot be called as a function.");
        }
        
        this.type = type;
    }
      
    Type.DEFAULT = "Extended";
    
    Type.isExist = function(type) {
        
        var obj = new Type(type);
        return obj.check() == null  ? false : true;

    };
    
    Type.prototype = {
        
        constructor: Type,
        
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
        
        getType: function () {
            
            if (this.check() == null) {
                this.type = Type.DEFAULT;
            }
            return this.type;
        },
        
        setType: function (type) {
            this.type = type;
        }
        
    };
    
    return Type;
});


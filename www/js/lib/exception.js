define(function () {
    
    /**
     * DESCRIPTION
     *   
     * INFORMATION
     * 
     * USAGE
     *   
     * RETURN
     * 
     * SEE ASLO
     * 
     *   cf. https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Error
     *   Attention, Certaines fonctionnalités ne sont ni standards, 
     *   ni en voie de standardisation...
     *   
     *   Liste des classes :
     *      Error
     *      EvalError
     *      RangeError
     *      ReferenceError
     *      SyntaxError
     *      InternalError
     *      TypeError
     *      URIError
     */
    
    "use strict";
    
    function UserException() {}
    
    UserException.PARAMS = "null";
    
    UserException.prototype = {
        
        constructor: UserException,
        
    };
    
    return UserException;
    
});

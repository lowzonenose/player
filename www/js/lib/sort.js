define(function () {
    
    /**
     * DESCRIPTION
     *   
     *   Tri du liste de chemins (path).
     *   
     * INFORMATION
     * 
     *  Exemple de liste :
     *  - string
     *  [
     *     "sample/",
     *     "sample/folder/",
     *     "sample/folder/README",
     *     "sample/sample.css",
     *     "sample/sample.html",
     *     "sample/sample.js",
     *     "sample/folder-bis/",
     *     "sample/folder-bis/README"
     *   ]
     *   
     *   - object 
     *   [
     *      {path:"sample/"},
     *      {path:"sample/folder/"},
     *      {path:"sample/folder/README", content:"contenu du fichier README!"},
     *      {path:"sample/sample.css"},
     *      {path:"sample/sample.html"},
     *      {path:"sample/sample.js"},
     *      {path:"sample/folder-bis/"},
     *      {path:"sample/folder-bis/README", content:"contenu du fichier README!"}
     *   ]
     *   
     * USAGE
     * 
     *      var s = new Sort([
     *          {path:"sample/"},
     *          {path:"sample/folder/"},
     *          {path:"sample/folder/README", content:"contenu du fichier README!"},
     *          {path:"sample/sample.css"},
     *          {path:"sample/sample.html"},
     *          {path:"sample/sample.js"},
     *          {path:"sample/folder-bis/"},
     *          {path:"sample/folder-bis/README", content:"contenu du fichier README!"}]);
     *      var array = s.pathsort();
     *      
     * RETURN
     * 
     *  Liste triée
     *  
     * SEE ASLO
     * 
     */
    
    "use strict";
    
    function Sort(array_paths) {
        
        if (!(this instanceof Sort)) {
            throw new TypeError("Sort constructor cannot be called as a function.");
        }
         
        if (array_paths == null || array_paths.length == 0) {
            throw new Error("Array is empty or not defined !?");
        }
        
        // type de liste
        this.isJson = false;
        if (typeof array_paths[0] != "string" ) {
            if (array_paths[0].hasOwnProperty('path')) {
                this.isJson = true;
            }
        }
        
        // liste
        this.array = array_paths;
    }
    
    Sort.DEFAULTSEP = "/";
      
    Sort.prototype = {
        
        constructor: Sort,
        pathsort : function(sep) {
        
            var $this = this;
            
            sep = sep || Sort.DEFAULTSEP;

            var array      = [];
            var array_sort = [];
            
            // type de liste : 
            // string ou objet json ?
            if (!$this.isJson) {
                array = $this.array;
            }
            else {
                for(var i=0; i<$this.array.length; i++) {
                    array.push($this.array[i].path);
                }
            }
            
            //trie
            array_sort = array.map(
                        function(el) {
                            return el.split(sep);
                })
                   .sort(this._sorter).map(
                        function(el) {
                            return el.join(sep);
                });
            
            // on reconstruit la liste triée d'objet
            if ($this.isJson) {
                var array_sort_json = [];
                for(var i=0; i<array_sort.length; i++) {
                    (function(j) {
                        for(var o in $this.array) {
                            if ($this.array[o].path == array_sort[j]) {
                                if ($this.array[o].hasOwnProperty('content')) {
                                    array_sort_json.push({
                                        path: $this.array[o].path,
                                        content: $this.array[o].content
                                    });
                                    break;
                                }
                                array_sort_json.push({
                                    path: $this.array[o].path
                                });
                            }
                        }
                    })(i);
                }
                array_sort = array_sort_json;
            }
            
            return array_sort;
        },
        _sorter : function(a, b) {
        
            var l = Math.max(a.length, b.length);
            for (var i = 0; i < l; i += 1) {
                  if (!(i in a)) return -1;
                  if (!(i in b)) return +1;
                  if (a[i].toUpperCase() > b[i].toUpperCase()) return +1;
                  if (a[i].toUpperCase() < b[i].toUpperCase()) return -1;
                  if (a.length < b.length) return -1;
                  if (a.length > b.length) return +1;
            }
        }
    };
    
    return Sort;
});

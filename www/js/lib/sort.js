 /**
 * Tri du liste de chemins (path).
 * @tutorial Sort
 * @module Sort
 */
define(function () {

    "use strict";
    
    /**
     * Description
     * @method Sort
     * @param {} array_paths
     * @return 
     */
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
        
        /**
         * @alias Sort
         * @constructor Sort
         */
        constructor: Sort,
        /**
         * Description
         * @method pathsort
         * @param {} sep
         * @return array_sort
         */
        pathsort : function(sep) {
        
            var $this = this;
            
            sep = sep || Sort.DEFAULTSEP;

            var array      = [];
            var array_sort = [];
            
            // type de liste : 
            // string ou objet json ?
            // et on supprime les doublons...
            if (!$this.isJson) {
                array = $this._clean($this.array);
            }
            else {
                var array_tmp = [];
                for(var i=0; i<$this.array.length; i++) {
                    array_tmp.push($this.array[i].path);
                }
                array = $this._clean(array_tmp);
            }
            
            // trie
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
                    // FIXME on n'ecarte pas les doublons...
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
        /**
         * Description
         * @method _sorter
         * @param {} a
         * @param {} b
         * @return 
         */
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
        },
        
        _clean : function (array) {
            
            var i, j, len = array.length, array_clean = [], obj = {};
            
            for (i = 0; i < len; i++) {
                obj[array[i]] = 0;
            }
            for (j in obj) {
                array_clean.push(j);
            }
            return array_clean;
        }
        
    };
    
    return Sort;
});

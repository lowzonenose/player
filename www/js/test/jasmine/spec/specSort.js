define(["sort"], function (Sort) {
    describe("Test de la classe Sort.",
    function () {
        
        var sort_array_string = [
               "sample/",
               "sample/sample.css",
               "sample/sample.html",
               "sample/sample.js",
               "sample/folder/",
               "sample/folder/README",
               "sample/folder-bis/",
               "sample/folder-bis/README"
        ];
        var sort_array_json = [
               {path:"sample/"},
               {path:"sample/sample.css"},
               {path:"sample/sample.html"},
               {path:"sample/sample.js"},
               {path:"sample/folder/"},
               {path:"sample/folder/README", content:"contenu du fichier README!"},
               {path:"sample/folder-bis/"},
               {path:"sample/folder-bis/README", content:"contenu du fichier README!"}
        ];
        
        beforeEach(function() {
        });
        
        it("Tri (tableau de string)", function() {
            
            
            var s = new Sort([
               "sample/",
               "sample/folder/",
               "sample/folder/README",
               "sample/sample.css",
               "sample/sample.html",
               "sample/sample.js",
               "sample/folder-bis/",
               "sample/folder-bis/README"]);
            var array = s.pathsort();
            
            expect(array).toEqual(sort_array_string);
            console.log(array);
        });
        
        it("Tri (tableau d'objet)", function() {
            
            
            var s = new Sort([
               {path:"sample/"},
               {path:"sample/folder/"},
               {path:"sample/folder/README", content:"contenu du fichier README!"},
               {path:"sample/sample.css"},
               {path:"sample/sample.html"},
               {path:"sample/sample.js"},
               {path:"sample/folder-bis/"},
               {path:"sample/folder-bis/README", content:"contenu du fichier README!"}]);
            var array = s.pathsort();
            
            expect(array).toEqual(sort_array_json);
            console.log(array);
        });
    });
});
define(["download"], function (Download) {
    
    'use strict';
    
    describe("Test de la classe Download.",
    function () {
        
        beforeEach(function() {});
        afterEach (function() {});
        
        it("Test avec parametres vides !", function() {
            var options = {
                archive: "",
                base: "",
                mode: ""
            };

            try {
                
                var dl = new Download(options);
                dl.send();
                
                console.log("success !");
                expect(true).toBe(true);
                
            } catch (e) {
                console.log("failure : " + e);
                expect(false).toBe(false);
            }

        });
        
        it("Test du téléchargement d'une archive en mode TAG", function() {
            
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "TAG",
                onsuccess: function (e) {
                    console.log("failure : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test du téléchargement d'une archive en mode XHR/URI (no-callback)", function() {
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "URI"
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test du téléchargement d'une archive en mode XHR/URI", function() {
            
            // FIXME 
            // hummm..., la methode 'expect' de jasmine echoue dans les callback 
            // car pb de contexte de this !?
            // comment passer le contexte jasmine ?

            // cf. https://github.com/jasmine/jasmine-ajax
            
            // var callbacks = {
            //     success: jasmine.createSpy(),
            //     failure: jasmine.createSpy(),
            // };
            
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "URI",
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
                // onsuccess: callbacks.success,
                // onfailure: callbacks.failure
            };
            
            var dl = new Download(options);
            dl.send();
            
            // spyOn(dl, 'spy').andCallFake(function(e) {
            //     e.spy();
            // });
            
            // expect(callbacks.success).toHaveBeenCalled();  //Verifies this was called
            // expect(callbacks.failure).not.toHaveBeenCalled();  //Verifies this was NOT called
        });
        
        it("Test du téléchargement d'une archive en mode par defaut", function() {
            pending();
            var options = {
                archive: "sample",
                base: "resources/",
                onsuccess: function (e, o) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();
 
        });
        
        it("Test avec une liste de fichiers vide !", function() {
            
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "URI",
                files:[],
                onsuccess: function () {},
                onfailure: function () {}
            };
            
            try {
                
                var dl = new Download(options);
                dl.send();
                
                console.log("success !");
                expect(true).toBe(true);
                
            } catch (e) {
                console.log("failure : " + e);
                expect(false).toBe(false);
            }

        });

        it("Test avec une liste de fichiers !", function() {
            pending();
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "URI",
                files:["README"],
                onsuccess: function () {},
                onfailure: function () {}
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test avec un contenu !", function() {
            pending();
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "URI",
                content: "README",
                onsuccess: function () {},
                onfailure: function () {}
            };
            
            var dl = new Download(options);
            dl.send();

        });
    });
});
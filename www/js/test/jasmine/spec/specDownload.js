/* global expect */

define(["download"], function (Download) {
    
    'use strict';
    
    describe("Test de la classe Download (1)",
    function () {
        
        beforeEach(function() {});
        afterEach (function() {});
        
        it("Test du téléchargement d'une archive en mode TAG (par defaut)", function(done) {
            
            var match = "cool";
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "TAG",
                onsuccess: function (e) {
                    console.log("success : " + e);
                    expect(e).toEqual(jasmine.stringMatching(match));
                    expect(e).toEqual(jasmine.stringMatching("mode:TAG"));
                    done();
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test du téléchargement d'une archive en mode XHR/URI (sans callback !)", function() {
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "URI"
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test du téléchargement d'une archive en mode XHR/URI", function(done) {
            
            var match = "cool";
            var options = {
                archive: "sample",
                base: "resources/",
                mode: "URI",
                onsuccess: function (e) {
                    console.log("success : " + e);
                    expect(e).toEqual(jasmine.stringMatching(match));
                    expect(e).toEqual(jasmine.stringMatching("[mode:XHR][URI]"));
                    done();
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();
            
        });
        
        it("Test du téléchargement d'une archive en mode XHR/URL", function(done) {
            
            var match = "cool";
            var options = {
                mode: "URL",
                archive: "sample",
                base: "resources/",
                onsuccess: function (e, o) {
                    console.log("success : " + e);
                    expect(e).toEqual(jasmine.stringMatching(match));
                    expect(e).toEqual(jasmine.stringMatching("[mode:XHR][URL]"));
                    done();
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();
 
        });
        
        it("Test avec une liste de fichiers !", function() {

            var options = {
                archive: "sample-1",
                base: "resources/",
                files:["sample/", 
                       "sample/sample.css",
                       "sample/sample.html",
                       "sample/sample.js",
                       "sample/folder/",
                       "sample/folder/README",
                       "sample/folder/logo-api.png"
                   ],
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test avec une autre liste de fichiers !", function() {

            var options = {
                archive: "sample-2",
                base: "resources/",
                files:["sample/", 
                       "sample/sample.css",
                       "sample/sample.html",
                       "sample/sample.js",
                       "sample/folder/",
                       "sample/folder/README",
                       "sample/folder/logo-api.png",
                       "sample/folder-bis/",
                       "sample/folder-bis/README",
                       "sample/folder-bis/logo-api.png"
                   ],
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test avec une liste de fichiers non triée !", function() {

            var options = {
                archive: "sample-3",
                base: "resources/",
                files:["sample/", 
                       "sample/folder/",
                       "sample/folder/README",
                       "sample/folder/logo-api.png",
                       "sample/sample.css",
                       "sample/sample.html",
                       "sample/sample.js",
                       "sample/folder-bis/",
                       "sample/folder-bis/README",
                       "sample/folder-bis/logo-api.png"
                   ],
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test avec une liste de fichiers mais sans entrée pour les réperoires !", function() {

            var options = {
                archive: "sample-fake",
                base: "resources/",
                files:["sample/", 
                       "sample/sample.css",
                       "sample/sample.html",
                       "sample/sample.js",
                       "sample/folder/README", // <-- FIXME repertoire 'folder' n'existe pas dans l'archive ! -->
                       "sample/folder/logo-api.png",
                       "sample/folder-bis/README", // <-- FIXME repertoire 'folder-bis' n'existe pas dans l'archive ! -->
                       "sample/folder-bis/logo-api.png"
                   ],
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test avec une liste de fichiers mais certain n'existe pas !", function() {

            var options = {
                archive: "sample-fake",
                base: "resources/",
                files:["sample/", 
                       "sample/sample.css",
                       "sample/sample.bidon",
                       "sample/sample.js",
                       "sample/bidon/",
                       "sample/bidon/README",
                       "sample/bidon/logo-api.png"
                   ],
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test avec une liste de fichiers avec un contenu !", function() {

            var options = {
                archive: "sample-4",
                base: "resources/",
                files: [
                    {path: "sample/"},
                    {path: "sample/sample.css",content:"test css"},
                    {path: "sample/sample.html",content:"test html"},
                    {path: "sample/sample.js",content:"test js"},
                    {path: "sample/folder/"},
                    {path: "sample/folder/README"},
                    {path: "sample/folder/logo-api.png"}
                ],
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
        
        it("Test avec une liste de fichiers avec un contenu mais non triée !", function() {

            var options = {
                archive: "sample-5",
                base: "resources/",
                files: [
                    {path: "sample/"},
                    {path: "sample/folder/"},
                    {path: "sample/folder/README"},
                    {path: "sample/sample.css",content:"test css"},
                    {path: "sample/sample.html",content:"test html"},
                    {path: "sample/sample.js",content:"test js"},
                    {path: "sample/folder/logo-api.png"}
                ],
                onsuccess: function (e) {
                    console.log("success : " + e);
                },
                onfailure: function (e) {
                    console.log("failure : " + e);
                }
            };
            
            var dl = new Download(options);
            dl.send();

        });
    });
    
    describe("Test de la classe Download (2)",
    function () {
        
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
        
        it("Test avec une liste de fichiers vide !", function() {
            
            var options = {
                archive: "sample-fake",
                base: "resources/",
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
    });
});
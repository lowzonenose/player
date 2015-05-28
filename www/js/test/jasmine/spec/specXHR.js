/*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn, done, mockPromises, Promise*/

define(["xhr"], function (RequestXHR) {

    "use strict";
    
    describe("Test de la classe RequestXHR (1)",
        function () {

            beforeEach(function() {
 
            });
            
            it("Test GET JSON content", function(done) {
                
                var url = "http://";
                var url_hostname = window.location.hostname;
                var url_port     = window.location.port;
                (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname; 
                var urlTest  = url + "/test-player/www/js/test/jasmine/resources/test.json";
                
                var resolved_done = {"name": "jpbazonnais"};
                var resolved_fail = {};
                
                var xhr     = new RequestXHR();
                var promise = xhr.getJSON(urlTest);
                promise.then(function(response) {
                            console.log("Succès :", response, "not equal to", resolved_done);
                            expect(resolved_done).toEqual(response);
                            expect(resolved_fail).not.toEqual(response);
                            done(); 
                });

            });   
            
            it("Test GET JSON Failed", function(done) {
                 
                var urlTest  = null;
                
                var rejected = "Errors Occured on Http Request !";
                
                var xhr     = new RequestXHR();
                var promise = xhr.getJSON(urlTest);

                promise.then(
                        function(response) {}, function(error) {
                            console.log("Erreur :", error.message);
                            expect(rejected).toEqual(error.message);
                            done(); 
                    });
            });  
            
            it("Test GET content", function(done) {
                
                var url = "http://";
                var url_hostname = window.location.hostname;
                var url_port     = window.location.port;
                (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname; 
                var urlTest  = url + "/test-player/www/js/test/jasmine/resources/test.json";
                
                var resolved_done = {"name": "jpbazonnais"};
                
                var xhr     = new RequestXHR();
                var promise = xhr.get(urlTest);
                promise.then(function(response) {
                            var response_json = JSON.parse(response);
                            console.log("Succès :", response_json, "equal to", resolved_done);
                            expect(resolved_done).toEqual(response_json);
                            done(); 
                });

            });
            
            it("Test GET Failed", function(done) {
                 
                var urlTest  = null;
                
                var rejected = "Errors Occured on Http Request !";
                
                var xhr     = new RequestXHR();
                var promise = xhr.get(urlTest);

                promise.then(
                        function(response) {}, function(error) {
                            console.log("Erreur :", error.message);
                            expect(rejected).toEqual(error.message);
                            done(); 
                    });
            });

            it("Test GET XML", function(done) {
                
                var url = "http://";
                var url_hostname = window.location.hostname;
                var url_port     = window.location.port;
                (url_port) ? url = url + url_hostname.concat(":", url_port) : url = url + url_hostname; 
                var urlTest  = url + "/test-player/www/js/test/jasmine/resources/test.xml";

                var xhr     = new RequestXHR();
                var promise = xhr.get(urlTest);
                promise.then(function(response) {
                    // FIXME compatibilité avec IE !?
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(response,"text/xml");
                    console.log("Succès : response XML ", response);
                    expect(xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue).toEqual("jpbazonnais");
                    done(); 
                });
            });
    });
    
    describe("Test de la classe RequestXHR (2)",
        function () {
            
            var xhr = null;
            
            beforeEach(function() {
                xhr = new RequestXHR();
            });
            
            it("Access-Control-Allow-Origin or 404 not found", function(done) {
                var xhr  = new RequestXHR();
                xhr.get("http://localhost/deploy.player/js/cfg/config.js").then(
                    function(response) {})
                    .catch(
                        function(error) {
                            console.log("Échec : ", error);
                            expect(error).toBeDefined();
                            done(); 
                        }
                    ); 
            });
            
            it("Test URLs multiple", function() {

                var value = "jpbazonnais";
                
                var urls = [];
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_1.json");
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_2.json");
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_3.json");
                
                Promise.all(xhr.getsJSON(urls))
                        .then(function(responses) {
                            for (var index = 0; index < responses.length; ++index) {
                                console.log("Succès :", responses[index].name, "is equal to", value+(index+1));
                            }
                        }).catch(function(error) {
                            console.log("Échec : ",  error);
                        });
                
            });
            
            it("Test URLs multiple Failed", function() {
                
                var urls = [];
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_0.json"); // json n'existe pas !
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_1.json");
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_2.json");
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_3.json");
                
                Promise.all(xhr.getsJSON(urls))
                        .then(function(responses) {
                            for (var index = 0; index < responses.length; ++index) {
                                console.log("Succès : ", responses[index].name);
                            }
                        }).catch(function(error) {
                            console.log("Échec :",  error.message);
                        });
                
            });
        });
});
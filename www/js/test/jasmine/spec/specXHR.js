define(["xhr"], function (RequestXHR) {

    describe("Test de la lib. RequestXHR",
        function () {
            
            var xhr = null;
            
            beforeEach(function() {
                xhr  = new RequestXHR();
            });
            
            it("Test URL : Access-Control-Allow-Origin", function() {
                
                xhr.get("http://localhost/test-player/www/js/test/jasmine/resources/test.json").then(function(response) {
                    console.log("Succès : ", response);
                }).catch(function(error) {
                    console.log("Échec : ", error);
                });

            });
            
            it("Test URL : JSON parser (1)", function() {
                
                xhr.get("http://localhost:8383/test-player/www/js/test/jasmine/resources/test.json").then(function(response) {
                    try {
                        JSON.parse(response);
                        console.log("Succès : ", response);
                    } catch (e) {
                        console.log("Échec de parsing JSON !");
                    }
                    
                }).catch(function(error) {
                    console.log("Échec : ",  error);
                });
                
            });
            
            it("Test URL : JSON parser (2)", function() {
                
                xhr.getJSON("http://localhost:8383/test-player/www/js/test/jasmine/resources/test.json").then(function(response) {
                    console.log("Succès : ", response);
                }).catch(function(error) {
                    console.log("Échec : ",  error);
                });
                
            });
            
            it("Test URL : Text", function() {
                
                xhr.get("http://localhost:8383/test-player/www/js/test/jasmine/resources/test").then(function(response) {
                    console.log("Succès : ", response);
                }).catch(function(error) {
                    console.log("Échec : ",  error);
                });
                
            });
            
            it("Test URL : XML parser", function() {
                
                xhr.getXML("http://localhost:8383/test-player/www/js/test/jasmine/resources/test.xml").then(function(response) {
                    console.log("Succès : ", response);
                }).catch(function(error) {
                    console.log("Échec : ",  error);
                });
                
            });
            
            it("Test URLs : JSON", function() {
                
                var urls = [];
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test.json");
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_1.json");
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_2.json");
                urls.push("http://localhost:8383/test-player/www/js/test/jasmine/resources/test_3.json");
                
                Promise.all(xhr.getsJSON(urls))
                        .then(function(responses) {
                            for (var index = 0; index < responses.length; ++index) {
                                console.log("Succès : ", responses[index].name);
                            }
                        }).catch(function(error) {
                            console.log("Échec : ",  error);
                        });
                
            });
            
            it("Test URLs : JSON with error", function() {
                
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
                            console.log("Échec : ",  error);
                        });
                
            });
        });
});
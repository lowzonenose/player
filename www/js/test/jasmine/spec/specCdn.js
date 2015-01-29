define(["cdn"], function (CDN) {
    
    'use strict';
    
    describe("Test de la classe CDN.",
    function () {
        var cdn;
        
        var length  = 1;
        var version = "4.12.0";
        var name    = "codemirror";
        var url     = "http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.12.0/codemirror.min.js";
        
        beforeEach(function() {
            cdn = new CDN("codemirror");
            
        });
       
        it("Test requete avec callback sur mode JSON (anonyme)", function() {

            cdn.request({
                callback: function (response) {
                    console.log(this.json());
                    console.log(this.length());
                    console.log(this.version(0));
                    console.log(this.name(0));
                    console.log(this.url(0));
                }
            });
            
//                expect(response).toBeDefined();
//                expect(response.lenght).toEqual("1");
//                expect(response[0].version).toEqual("4.8.0");
//                expect(response[0].name).toEqual("codemirror");
//                expect(response[0].latest).toEqual("http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.8.0/codemirror.min.js");

        });
        
        it("Test requete avec callback sur mode JSON", function() {
            
            cdn.request({
                callback: callback
            });
            
            function callback (response) {
                console.log(response);
                console.log(response.length);
                console.log(response[0].version);
                console.log(response[0].name);
                console.log(response[0].latest);
            };
        });
        
        it("Test requete avec callback sur mode JSONP (anonyme)", function() {
            
            cdn.request({
                mode: "jsonp",
                callback: function (response) {
                    console.log(response);
                    console.log(response.total);
                    console.log(response.results[0].version);
                    console.log(response.results[0].name);
                    console.log(response.results[0].latest);
                }
            });
        });
        
        it("Test requete avec callback sur mode JSONP", function() {

            cdn.request({
                mode: "jsonp",
                callback: "callback4jsonp"
            });
            
            function callback4jsonp (response) {
                    console.log(this.json());
                    console.log(this.length());
                    console.log(this.version(0));
                    console.log(this.name(0));
                    console.log(this.url(0));
            };
        
        });
        
    });
});
define(["cdn"], function (CDN) {
    
    'use strict';
    
    describe("Test de la classe CDN.",
    function () {
        var cdn;
        
        var length  = 1;
        var version = "4.12.0";
        var name    = "codemirror";
        var url     = "http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.12.0/codemirror.min.js";
        
        beforeEach(function() {});
       
        it("Test requete avec callback(anonyme) en mode JSON ", function() {

            cdn = new CDN("codemirror");
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
            
            var status     = false;
            var myresponse = null;
            
            cdn = new CDN("codemirror");
            
//            runs(
//                    function() {
                        cdn.request({
                            scope: this,
                            callback: callback
                        });
//                    }
//            );
//            
//            function callback (response) {
//                if (response) {
//                    this.myresponse = response;
//                    status = true;
//                }
//            }
//            
//            waitsFor(function(){
//                return status;
//            }, "AJAX should complete", 1000);
//            
//            runs(function() {
//                expect(status).toBe(true);
//                
//                expect(myresponse).toBeDefined();
//                expect(myresponse.lenght).toEqual("1");
//                expect(myresponse[0].version).toEqual("4.8.0");
//                expect(myresponse[0].name).toEqual("codemirror");
//                expect(myresponse[0].latest).toEqual("http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.8.0/codemirror.min.js");
//            });
            
            function callback (myresponse) {
                // jasmine.getEnv().expect(true).toBe(true);
                console.log(myresponse);
                // jasmine.getEnv().expect(myresponse).toBeDefined();
                console.log(myresponse.length);
                // jasmine.getEnv().expect(myresponse.lenght).toEqual("1");
                console.log(myresponse[0].version);
                // jasmine.getEnv().expect(myresponse[0].version).toEqual("4.8.0");
                console.log(myresponse[0].name);
                // jasmine.getEnv().expect(myresponse[0].name).toEqual("codemirror");
                console.log(myresponse[0].latest); 
                // jasmine.getEnv(). expect(myresponse[0].latest).toEqual("http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.8.0/codemirror.min.js");
            };
        });
        
        it("Test requete avec callback(anonyme) sur mode JSONP", function() {
            
            cdn = new CDN("codemirror");
            cdn.request({
                scope: this,
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

            cdn = new CDN("codemirror");
            cdn.request({
                scope: this,
                mode: "jsonp",
                callback: "callback4jsonp"
            });
        
        });
        
        it("Test requete avec scope", function() {

            cdn = new CDN("test");
            cdn.request({
                scope: this,
                mode: "jsonp",
                callback: function (response) {
                    console.log(response);
                }
            });

        });
    });
});
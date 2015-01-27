define(["syntaxhighlighter"], function (SyntaxHighlighter) {
    
    'use strict';
    
    describe("Test de la classe SyntaxHighlighter.",
    function () {
        var syn;
        
        beforeEach(function() {
            
            syn = new SyntaxHighlighter();
            
        });
       
        it("Test", function() {

            expect(syn.apply()).toBeUndefined();
//                expect(response).toBeDefined();
//                expect(response.lenght).toEqual("1");
//                expect(response[0].version).toEqual("4.8.0");
//                expect(response[0].name).toEqual("codemirror");
//                expect(response[0].latest).toEqual("http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.8.0/codemirror.min.js");

        });
    });
});
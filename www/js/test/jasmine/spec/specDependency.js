define(["dependency"], function (Dependency) {
    
    'use strict';
    
    describe("Test de la classe Dependency.",
    function () {
        var dep;
        
        beforeEach(function() {
            
            dep = new Dependency();
            
        });
       
        it("Test All scripts", function() {

            var scripts = dep.getScripts();
            
            console.log(scripts);
            expect(scripts).toBeDefined();

            
//                expect(response).toBeDefined();
//                expect(response.lenght).toEqual("1");
//                expect(response[0].version).toEqual("4.8.0");
//                expect(response[0].name).toEqual("codemirror");
//                expect(response[0].latest).toEqual("http://cdnjs.cloudflare.com/ajax/libs/codemirror/4.8.0/codemirror.min.js");

        });
        
        it("Test All scripts in body tag", function() {

            var scripts = dep.getScriptsIntoBody();
            
            console.log(scripts);
            expect(scripts).toBeDefined();
        });
        
        it("Test All scripts in head tag", function() {

            var scripts = dep.getScriptsIntoHead();
            
            console.log(scripts);
            expect(scripts).toBeDefined();
        });
        
        it("Test All external scripts", function() {

            var scripts = dep.getScriptsExternal();
            
            console.log(scripts);
            if (scripts.length > 0) {
                expect(scripts.length).toBeGreaterThan(0); // toBeLessThan
            }            
            
        });
        
        it("Test All internal scripts", function() {

            var scripts = dep.getScriptsInternal();
            
            console.log(scripts);
            expect(scripts).toBeDefined();
        });
        
        it("Test All internal scripts with protocole http", function() {

            var scripts = dep.getScriptsInternal("http://suffixe/");
            
            console.log(scripts);
            expect(scripts).toBeDefined();
        });
        
        it("Test Extract info lib. name", function() {

            var scriptName = dep.getDependencyName(1, 'js');
            var scriptPath = dep.getDependencySource(1, 'js');
            
            console.log(scriptName + " - " + scriptPath);
            expect(scriptName).toBeDefined();
            expect(scriptPath).toBeDefined();
        });

        it("Test Exist", function() {

            var script = dep.isEmpty('js');
            var css    = dep.isEmpty('css');
            
            expect(script).toBe(false);
            expect(css).toBe(false);
        });
        
        it("Test if has only one css", function() {

            var css = dep.getDeps('css');
            
            expect(css).toBeDefined();
            expect(css.length).toEqual(1);
        });
        
        it("Test Index Out Of Bounds", function() {
            // FIXME 
            // comment on cpture une exception avec cette methode ?
            // expect(dep.getDependencySource(100, 'js')).toThrow();
            
            try {
                dep.getDependencySource(100, 'js');
                expect(false).toBe(true);
            } catch (e) {
                console.log(e.message);
                expect(false).toBe(false);
            }
        });
    });
});

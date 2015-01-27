define(["helper"], function (Helper) {
    describe("Test de la classe Helper.",
    function () {
        var html = '<html><head><title>test</title><script type="text/javascript" src="test_externe.js"></script></head><body><div id="test">test</div><script type="text/javascript" src="test_interne.js"></script></body></html>';
        var body = '<div id="test">test</div>';
        var script_interne = '<script type="text/javascript" src="test_interne.js"></script>';
        var script_externe = '<script type="text/javascript" src="test_externe.js"></script>';
        
        beforeEach(function() {
        });
        
        it("Extract Body", function() {
            var mybody = Helper.extractBody(html);
            expect(mybody).toEqual(body);
        });
        
        it("Extract Scripts Interne", function() {
            var myscripts = Helper.extractScripts(html);
            expect(myscripts[1]).toEqual(script_interne);
        });
        
        it("Extract Scripts Externe", function() {
            var myscripts = Helper.extractScripts(html);
            expect(myscripts[0]).toEqual(script_externe);
        });
    });
});
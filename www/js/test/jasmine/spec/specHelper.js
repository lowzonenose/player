define(["helper"], function (Helper) {
    describe("Test de la classe Helper.",
    function () {
        var html = '<html><head><title>test</title><script type="text/javascript" src="test_externe.js"></script></head><body><div id="test">test</div><script type="text/javascript" src="test_interne.js"></script></body></html>';
        var body = '<div id="test">test</div>';
        var css  = "\
div#viewerDiv {\n\
 width:700px; height:500px; \n\
background-image:url('http://api.ign.fr/geoportail/api/js/2.1.0/theme/geoportal/img/loading.gif');\n\
background-image:url(img/loading.gif);\n\
}";
        var script_interne = '<script type="text/javascript" src="test_interne.js"></script>';
        var script_externe = '<script type="text/javascript" src="test_externe.js"></script>';
        
        var object_extended = {
            a: "a",
            b: {
                bc:{
                    bbd:"bbd"
                },
                bd:[0]
            },
            d:4
        };
        
        var object = {
            a: 1,
            b: {
                ba:2,
                bb:"bb",
                bc:{
                    bba:2,
                    bbb:"bbb",
                    bbc:"bbc",
                },
                bd:[1,2,3,4]
            },
            c: "c"
        };
        
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
        
        it("Extract Resources", function() {
            var myresources = Helper.pathIntoCSS(css);
            console.log(myresources);
            expect(myresources.length).toEqual(1);
        });
        
        it("Merge", function() {
            var out = {};
            Helper.extend(object_extended, object);
            console.log(object_extended);
            expect(object_extended.a).toEqual(1);
            expect(object_extended.b.bc.bba).toEqual(2);
        });
        
        it("Merge2", function() {
            var out = {};
            Helper.extend(out, object_extended, object);
            console.log(out);
            expect(out.a).toEqual(1);
            expect(out.b.bc.bba).toEqual(2);
        });
        
        it("Merge3", function() {
            var out = {};
            Helper.extend(out, object_extended, object, {f:10}, {e:"e"});
            console.log(out);
            expect(out.a).toEqual(1);
            expect(out.b.bc.bba).toEqual(2);
            expect(out.f).toEqual(10);
        });
    });
});
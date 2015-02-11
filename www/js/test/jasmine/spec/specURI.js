define(["uri"], function (URI) {
    // FIXME TypeError: object is not a function ???
    describe("Test de la lib. URI.",
        function () {

            beforeEach(function() {
            });
            
            it("Test URL", function() {
                pending();
                var uri = new URI("/test/");
            });
            
            it("Test URL relative", function() {
                pending();
                var uri    = URI("http://localhost:8383/test-player/www/template.html");
                var relUri = uri.relativeTo("http://localhost:8383/test-player/www/samples/sample_1/sample_1.html");
                console.log(relUri);
            });
        });
});
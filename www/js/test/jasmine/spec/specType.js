define(["type"], function (Type) {
    describe("Test de la classe Type.",
    function () {
        var type;
        
        beforeEach(function() {
            type = new Type();
        });
        
        it("Type par defaut", function() {
            expect(type.getType()).toEqual("Extended");
        });
        
        it("Test sur tous les types (court)", function() {
            type.setType('ext');
            expect(type.getType()).toEqual("Extended");
            type.setType('min');
            expect(type.getType()).toEqual("Min");
            type.setType('std');
            expect(type.getType()).toEqual("Standard");
            type.setType('mob');
            expect(type.getType()).toEqual("Mobile");
            type.setType('3d');
            expect(type.getType()).toEqual("3D");
            type.setType('f');
            expect(type.getType()).toEqual("Flash");
            type.setType('g');
            expect(type.getType()).toEqual("Gouv");
        });
       
        it("Test sur tous les types (long)", function() {
            type.setType('minimal');
            expect(type.getType()).toEqual("Min");
            type.setType('standard');
            expect(type.getType()).toEqual("Standard");
            type.setType('mobile');
            expect(type.getType()).toEqual("Mobile");
            type.setType('3d');
            expect(type.getType()).toEqual("3D");
            type.setType('flash');
            expect(type.getType()).toEqual("Flash");
            type.setType('gouv');
            expect(type.getType()).toEqual("Gouv");
        });
        
        it("Test sur tous les types (api)", function() {
            type.setType('apimin');
            expect(type.getType()).toEqual("Min");
            type.setType('apistd');
            expect(type.getType()).toEqual("Standard");
            type.setType('apiahnstd');
            expect(type.getType()).toEqual("Standard");
        });
        
         it("Test sur un type inconnu", function() {
             type.setType('bidon');
            expect(type.getType()).toEqual("Extended");
        });
    });
});
var gulp      = require('gulp');
var rjs       = require('gulp-requirejs-optimize');
var clean     = require('gulp-clean');
var gutil     = require('gulp-util');
var jshint    = require('gulp-jshint');
var css       = require('gulp-minify-css');
var jasmine   = require('gulp-jasmine');
var uglify    = require('gulp-uglify');
var normalize = require('gulp-bower-normalize');
var bower     = require('main-bower-files');
var runtask   = require('gulp-bower');
var debug     = require('gulp-debug');
var shell     = require('gulp-shell');
// optimisation des images...
var image     = require('imagemin');
// system file...
var fs = require('fs');

/*********************************
 * options de la ligne de commande
 *********************************/
 
// ex. gulp --dev --check --test --doc --sample --download
//  dev      : cette option desactive les taches d'optimisation
//  check    : controle synthaxique des JS
//  test     : execution des tests
//  doc      : documentation JSdoc
//  sample   : deployer des exemples
//  download : tétélchargement des dependances externes via bower (ex. jquery)
var argv = require('minimist')(process.argv.slice(4));

var bDev = false;
if(gutil.env.dev === true) {
    bDev = true;
}

var bCheck = false;
if(gutil.env.check === true) {
    bCheck = true;
}

var bDoc = false;
if(gutil.env.doc === true) {
    bDoc = true;
}

var bSamples = false;
if(gutil.env.sample === true) {
    bSamples = true;
}

var bTests = false;
if(gutil.env.test === true) {
    bTests = true;
}

var bDownload = false;
if(gutil.env.download === true) {
    bDownload = true;
}

/*******
 * Paths
 *******/
 
var targetdir = "target/build/";
var sourcedir = "../www/";

// TODO : mettre en place les paths
var paths = {
	src : {
		jsdir    : sourcedir + "js/",
		
		jslibdir : sourcedir + "js/lib/*.js",
		jscfgdir : sourcedir + "js/cfg/*.js",
		jsmoddir : sourcedir + "js/modules/**/*.js",
		jstestdir: sourcedir + "js/test/jasmine/spec/*.js",
		
		imgdir : sourcedir + "js/modules/img/*.*",
		cssdir : sourcedir + "js/modules/style/*.css",
		
		jsinternaldir :  sourcedir + "js/thirdparty/**",
		jsexternaldir :  sourcedir + "js/external/**",
		
		sampledir : sourcedir + "samples/**",
		
		page : sourcedir + "*.html"
		
	},
	tgt : {
		jsdir    : targetdir + "js/",
		
		jslibdir : targetdir + "js/lib/",
		jscfgdie : targetdir + "js/cfg/",
		jsmoddir : targetdir + "js/modules/",
		jstestdir: targetdir + "js/test/jasmine/spec/",
		jsdoc    : targetdir + "js/doc",
                
		imgdir : targetdir + "js/modules/img/",
		cssdir : targetdir + "js/modules/style/",
		
		jsinternaldir : targetdir + "js/thirdparty/",
		jsexternaldir : targetdir + "js/external/",
		
		sampledir : targetdir + "samples/",
	}
};

/***********************
 * Définition des tâches
 ***********************/

// tâche principale 
gulp.task('default', [
    "clean",
    "test",
    "check",
    "doc",
    "download",
    "normalize",
    "build"
]);

// nettoyage du repertoire de "build"
gulp.task("clean", function () {
    return gulp.src(targetdir, {read: false})
        .pipe(clean());
});

// OPTIONS FACULTATIF : --> "--check"
// controle des sources JS avec 'jshint'
gulp.task('check', function() {
    
    if (!bCheck) {
        gutil.log("SKIP Task : check !");
    }
    
    gulp.src([
        sourcedir + "js/lib/**/*.js", 
        sourcedir + "js/cfg/**/*.js", 
        sourcedir + "js/modules/**/*.js"
    ])
    .pipe(bCheck ? jshint() : gutil.noop())
    .pipe(jshint.reporter('default'));
});

// OPTIONS FACULTATIF : --> "--test"
// execution des tests
gulp.task('test', function() {
	
    // TODO 
    // execution des tests sous jasmin ? 
    if (!bTests) {
        gutil.log("SKIP Task : test !");
        return;
    }
    
    gutil.log("Not yet implemented : test !");
    
    // return gulp.src(sourcedir + 'js/test/jasmine/spec/*.js')
    //    .pipe(jasmine({verbose:true}));
        
    // gulp.src(sourcedir  + "js/test/jasmine/**")
    //     .pipe((bTests ? gulp.dest(targetdir + "test/") : gutil.noop() ));
});

// OPTIONS FACULTATIF : --> "--doc"
// JSdoc
gulp.task('doc', function() {
    
    gutil.log("Not yet released : doc (Beta) !");
    
    if (bDoc) {
        
        return gulp.src("jsdoc.json")
        .pipe(shell([
            'jsdoc -c <%= file.path %>'
        ]));
    }
    
    gutil.log("SKIP Task : doc !");
    
});

// recuperation des dependances via "bower" 
gulp.task('download', ["clean"], function() {
    
     if (bDownload) {
        return runtask();
    }
    
    gutil.log("SKIP Task : download !");
});

// normalisation des noms de dependances issu de "bower"
gulp.task('normalize', ["download"], function() {
    
    // les dependances doivent être placées dans le répertoire : target/build/js/external/
    // avec la possibilité d'utilisé une version minifiée ou non (cf. --dev)
    // Il faut normaliser les nons des lib., cad on ne veut pas de *.min.js !
    // Attention, il est possible qu'il n'y ait pas de lib. à normaliser...

    fs.exists('./bower_components', function (exist) {
        if (exist) {
            gulp.src(bower(), {base: './bower_components'})
                .pipe(normalize({bowerJson: './bower.json', flatten:true}))
                .pipe(gulp.dest('./bower_dependencies/'));
        }
        else {
            gutil.log("No bower components !");
        }
    });
    
});

// construction
gulp.task('build', [
    "build:js", 
    "build:cfg", 
    "build:third-party",
    "build:dependencies",
    "build:image", 
    "build:css", 
    "build:html",
    "build:sample"
]);

// minification des JS
// option --> "--dev"
gulp.task('build:js', ["normalize"], function () {
	
	if (bDev) {
		
		gulp.src([sourcedir + "js/lib/*.js"])
			.pipe(gulp.dest(targetdir + 'js/lib/'));
		gulp.src([sourcedir + "js/modules/**/*.js"])
			.pipe(gulp.dest(targetdir + 'js/modules/'));
		gulp.src([sourcedir + "js/*.js"])
			.pipe(gulp.dest(targetdir + 'js/'));	
	}
	else {
	
		return gulp.src(sourcedir + 'js/main.js')
			.pipe(rjs({
                            paths: {

                                // my module
                                module: "modules",
                                ui    : "modules/ui",
                                
                                // my conf
                                config : "empty:",
                                
                                // my lib
                                helper : "lib/helper",
                                cdn : "lib/cdn",
                                dependency : "lib/dependency",
                                download : "lib/download",
                                logger : "lib/logger",
                                settings : "lib/settings",
                                sort : "lib/sort",
                                type : "lib/type",
                                syntaxhighlighter : "lib/syntaxhighlighter",

                                // thirdparty
                                cm    : "empty:",
                                
                                // framework
                                jquery: "empty:",
                                log4js: "empty:",
  
                                // zip
                                "zip"       : "empty:",
                                "zip-utils" : "empty:",
                                "zip-save"  : "empty:",
                            }
			}))
			.pipe(gulp.dest(targetdir + 'js/'));
	}
});

// ajout de la config.
gulp.task('build:cfg', ["normalize"], function () {
    
    return gulp.src(sourcedir + 'js/cfg/*.js')
		.pipe(!bDev ? uglify() : gutil.noop())
        .pipe(gulp.dest(targetdir + 'js/cfg/'));
});

// ajout des JS externes (dependances)
gulp.task('build:third-party', ["normalize"], function () {
    
    return gulp.src(sourcedir + 'js/thirdparty/codemirror/**')
        .pipe(gulp.dest(targetdir + 'js/thirdparty/codemirror/'));
});

// ajout des JS externes (dependances)
gulp.task('build:dependencies', [
    'build:dependencies:local',
    'build:dependencies:remote'
]);

// lib. JS du projet
gulp.task('build:dependencies:local', ["normalize"], function () {
    // Par defaut, on prend les lib. externes du projet
    return gulp.src(sourcedir + 'js/external/*.js')
        .pipe(!bDev ? uglify() : gutil.noop())
	.pipe(gulp.dest(targetdir + 'js/external/'));
});

// lib. JS téléchargées
gulp.task('build:dependencies:remote', ["build:dependencies:local"], function () {
    // puis, on ajoute les autres..., si elles existent...
    return gulp.src('./bower_dependencies/js/*.js')
		.pipe(!bDev ? uglify() : gutil.noop())
		.pipe(gulp.dest(targetdir + 'js/external/'));
});

// copie et optimisation des ressources images
// option --> "--dev"
gulp.task('build:image', ["normalize"], function () {
	
	if (bDev) {
		return gulp.src(sourcedir + 'js/modules/img/*.*')
			.pipe(gulp.dest(targetdir + 'js/modules/img/'));
	}
	
	var imagemin = new image()
            .src(sourcedir  + 'js/modules/img/*.*')
            .dest(targetdir + 'js/modules/img/')
            .use(image.jpegtran({ progressive: true }));
 
    imagemin.run(
        function (err, files) {
            if (err) {
                throw err;
            }
        }
    );

});

// copie et optimisation des ressources CSS
// option --> "--dev"
gulp.task('build:css', ["normalize"], function () {
    // FIXME : ça ne marche pas à tous les coups !?
	
    gulp.src(sourcedir + 'js/*.css')
        // .pipe(!bDev ? css() : gutil.noop())
        .pipe(gulp.dest(targetdir + 'js/'));
        
    gulp.src(sourcedir + 'js/modules/**/*.css')
            .pipe(!bDev ? css() : gutil.noop())
            .pipe(gulp.dest(targetdir + 'js/modules/'));    

});

// copie du html
gulp.task('build:html', ["normalize"], function () {
    return gulp.src(sourcedir + 'template.html')
        .pipe(gulp.dest(targetdir));
});

// OPTIONS FACULTATIF : --> "--sample"
// copie des exemples
gulp.task('build:sample', ["normalize"], function() {
    
    if (!bSamples) {
        gutil.log("SKIP Task : samples !");
    }
    
    return gulp.src(sourcedir + "samples/**")
        .pipe((bSamples ? gulp.dest(targetdir + "samples/") : gutil.noop() ));
});


// options 
//  --tasks, --silent, --color, ...
//  ex. gulp <task> <othertask> ...
var gulp   = require('gulp');

/*********
 * Modules
 *********/
var del    = require('del');
var image  = require('imagemin');

var uglify  = require('gulp-uglify');
var rename  = require('gulp-rename');
var gutil   = require('gulp-util');
var jshint  = require('gulp-jshint');
var css     = require('gulp-minify-css');

/*********************************
 * options de la ligne de commande
 *********************************/
// ex. gulp --dev --check --test --sample
//  dev    : cette option desactive les taches 'merge' and/or 'minify'
//  check  : controle synthaxique des JS
//  test   : execution des tests
//  sample : deployer des exemples

var options = require("minimist")(process.argv.slice(3));

var bDev = false;
if(gutil.env.dev === true) {
    bDev = true;
}

var bCheck = false;
if(gutil.env.check === true) {
    bCheck = true;
}

var bSample = false;
if(gutil.env.sample === true) {
    bSample = true;
}

var bTests = false;
if(gutil.env.test === true) {
    bTests = true;
}

/*******
 * Paths
 *******/
var targetdir = "target/build/";
var sourcedir = "../www/";

var paths = {
    source : {
        jsdir         : sourcedir + "js/",
        jslibdir      : sourcedir + "js/lib/",
        jsmodulesdir  : sourcedir + "js/modules/",
        jsexternaldir : sourcedir + "js/external/",
        jstestdir     : sourcedir + "js/test/",
        jssamplesdir  : sourcedir + "samples/",
        
        module  : {
            js  : sourcedir + "js/modules/**/*.js",
            img : sourcedir + "js/modules/img/*.*",
            css : sourcedir + "js/modules/**/*.css"
        },
        
        main    : {
            js  : sourcedir + "js/*.js",
            css : sourcedir + "js/*.css",
            img : sourcedir + "js/img*.*"
        },
        
        page : sourcedir + "*.html",
        
    },
    target : {
        jsbuild       : targetdir + "js/",
        jslibdir      : targetdir + "js/lib/",
        jsmodulesdir  : targetdir + "js/modules/",
        jsexternaldir : targetdir + "js/external/",
        jstestdir     : targetdir + "js/test/",
        jssamplesdir  : targetdir + "samples/",
        page          : targetdir,
        main          : targetdir + "js/"
    }
};

/***********************
 * Définition des tâches
 ************************/

// sans argument, 'gulp' lance la tâche 'default'.
gulp.task('default', [
    "clean", 
    "check",  // OPTION!
    "test",   // OPTION!
    "sample", // OPTION!
    "build",
    "licence",
    "deploy"
]);

// nettoyage du target complet
gulp.task("clean", function(cb) {
    del([targetdir], cb);
    
});

// OPTIONS FACULTATIF : --> "gulp --check"
// controle des sources JS avec 'jshint'
gulp.task('check', function() {
    
    if (!bCheck) {
        console.log("SKIP Task : check (jshint)");
    }
    
    gulp.src([
        paths.source.jslibdir + "**/*.js", 
        paths.source.jsmodulesdir + "**/*.js"
    ])
    .pipe(bCheck ? jshint() : gutil.noop())
    .pipe(jshint.reporter('default'));
});

// OPTIONS FACULTATIF : --> "gulp --test"
// copie et execution des tests
gulp.task('test', function() {
    // TODO 
    // execution des tests sous jasmin ? 
    if (!bTests) {
        console.log("SKIP Task : test (jasmin)");
    }
    gulp.src([paths.source.jstestdir  + "**"])
        .pipe((bTests ? gulp.dest(paths.target.jstestdir) : gutil.noop() ));
});

// OPTIONS FACULTATIF : --> "gulp --sample"
// copie des exemples
gulp.task('sample', function() {
    
    if (!bSample) {
        console.log("SKIP Task : deploy samples");
    }
    gulp.src([paths.source.jssamplesdir + "**"])
        .pipe((bSample ? gulp.dest(paths.target.jssamplesdir) : gutil.noop() ));
});

// OPTIONS FACULTATIF : --> "gulp --dev"
// build : 
// - JS,
//   - lib,
//   - modules
//   - external 
//   - main 
// - page principale
// - ressources (images, css, ..)
gulp.task('build', [
    'build:js',
    'build:html',
    'build:resources'
], function() {
    
});

gulp.task('build:js', [
    "build:minify:lib", 
    "build:minify:module",
    "build:minify:external",
    "build:minify:main"
], function() {
    // en mode dev., 
    // on fait une simple copie des fichiers...
    // sinon, on minifie et merge les JS...
    if (bDev) {
        gulp.src([paths.source.jslibdir + "**"])
            .pipe(gulp.dest(paths.target.jslibdir));
        gulp.src([paths.source.jsmodulesdir + "**"])
            .pipe(gulp.dest(paths.target.jsmodulesdir));
        gulp.src([paths.source.jsexternaldir + "**"])
            .pipe(gulp.dest(paths.target.jsexternaldir));
        gulp.src(paths.source.jsdir + "*.js")
            .pipe(gulp.dest(paths.target.main));
        gulp.src(paths.source.jsdir + "*.css")
            .pipe(gulp.dest(paths.target.main));
    }
});
gulp.task('build:html',      ['clean'], function() {
    gulp.src(paths.source.page)
        .pipe(gulp.dest(paths.target.page));
});
gulp.task("build:resources", [
    "resources:lib",
    "resources:module",
    "resources:external",
    "resources:main"
], function() {});

// minification des JS
gulp.task("build:minify:lib",      ['clean'], function() {

    return gulp.src(paths.source.jslibdir + "*.js")
        .pipe(!bDev ? uglify() : gutil.noop())
        .pipe(!bDev ? rename( {extname:'.js'} ) : gutil.noop())
        .pipe(gulp.dest(paths.target.jslibdir));

});
gulp.task("build:minify:module",   ['clean'], function() {
    
    return gulp.src(paths.source.jsmodulesdir + "**/*.js")
        .pipe(!bDev ? uglify() : gutil.noop())
        .pipe(!bDev ? rename( {extname:'.js'} ) : gutil.noop())
        .pipe(gulp.dest(paths.target.jsmodulesdir));

});
gulp.task("build:minify:external", ['clean'], function() {
    
    return gulp.src(paths.source.jsexternaldir  + "**/*.js")
        .pipe(!bDev ? uglify() : gutil.noop())
        .pipe(!bDev ? rename( {extname:'.js'} ) : gutil.noop())
        .pipe(gulp.dest(paths.target.jsexternaldir));

});
gulp.task("build:minify:main",     ['clean'], function() {

    return gulp.src(paths.source.main.js)
        .pipe(!bDev ? uglify() : gutil.noop())
        .pipe(!bDev ? rename( {extname:'.js'} ) : gutil.noop())
        .pipe(gulp.dest(paths.target.main));

});

// ajout des ressources
gulp.task("resources:lib",      ['clean'], function() {});
gulp.task("resources:module",   ['clean'], function() {
    
    // css
    gulp.src([paths.source.module.css])
        .pipe(!bDev ? css() : gutil.noop())
        .pipe(!bDev ? rename( {extname:'.css'} ) : gutil.noop())
        .pipe(gulp.dest(paths.target.jsmodulesdir));

    // images
    var imagemin = new image()
        .src(paths.source.module.img)
        .dest(paths.target.jsmodulesdir + 'img') // FIXME
        .use(image.jpegtran({ progressive: true }));
 
    imagemin.run(
        function (err, files) {
            if (err) {
                throw err;
            }
        }
    );
});
gulp.task('resources:external', ['clean'], function() {
    var res = !paths.source.jsexternaldir + "**/*.js";
    return gulp.src([res])
        .pipe(gulp.dest(paths.target.jsexternaldir));
});
gulp.task('resources:main',     ['clean'], function() {
    // FIXME ???
    return gulp.src(paths.source.main.css)
        // .pipe(!bDev ? css() : gutil.noop())
        // .pipe(!bDev ? rename( {extname:'.css'} ) : gutil.noop())
        .pipe(gulp.dest(paths.target.main));   
});


// TODO : ajout des licences sur les sources du build : JS, CSS, HTML
gulp.task("licence", [
    "licence:html",
    "licence:main", 
    "licence:lib", 
    "licence:module"
], function() {});
gulp.task("licence:html"  , ['build'], function() {});
gulp.task("licence:main"  , ['build'], function() {
});
gulp.task("licence:lib"   , ['build'], function() {
});
gulp.task("licence:module", ['build'], function() {
});


// TODO : configuration par environnement
gulp.task("deploy", [
    "deploy:local", 
    "deploy:dev", 
    "deploy:prod",
    "deploy:preprod",
    "deploy:qualif"
], function() {});
gulp.task("deploy:local"  , ['licence'], function() {
});
gulp.task("deploy:dev"    , ['licence'], function() {
});
gulp.task("deploy:prod"   , ['licence'], function() {
});
gulp.task("deploy:preprod", ['licence'], function() {
});
gulp.task("deploy:qualif" , ['licence'], function() {
});

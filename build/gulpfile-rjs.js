var gulp = require('gulp');
var rjs  = require('gulp-requirejs-optimize');
var del  = require('del');

var targetdir = "target/build-rjs/";
var sourcedir = "../www/";

gulp.task('default', [
    "clean",
    "js", 
    "third-party",
    "resources", 
    "html"

]);

gulp.task("clean", function(cb) {
    del([targetdir], cb);
    
});

gulp.task('js', ["clean"], function () {
    return gulp.src(sourcedir + 'js/main.js')
        .pipe(rjs({
            paths: {
                // my module
                module: "modules",
                ui    : "modules/ui",
        
                // my lib
                config : "lib/config",
                helper : "lib/helper",
                cdn : "lib/cdn",
                dependency : "lib/dependency",
                download : "lib/download",
                logger : "lib/logger",
                settings : "lib/settings",
                sort : "lib/sort",
                type : "lib/type",
                syntaxhighlighter : "lib/syntaxhighlighter",

                // framework
        
                jquery: "empty:",
                log4js: "empty:",
                cm    : "empty:",

                // INFO :
                // possibilité de ne ps prendre en compte les lib. externes !
                // jquery: "external/jquery",
                // log4js: "external/log4javascript/log4javascript_uncompressed",
                // cm    : "external/codemirror",

                // zip
                "zip"       : "empty:",
                "zip-utils" : "empty:",
                "zip-save"  : "empty:",

                // INFO :
                // possibilité de ne ps prendre en compte les lib. externes !
                // "zip"       : "external/jszip",
                // "zip-utils" : "external/jszip-utils",
                // "zip-save"  : "external/FileSaver",
            }
        }))
        .pipe(gulp.dest(targetdir + 'js/'));
});

gulp.task('third-party', ["clean"], function () {
    return gulp.src(sourcedir + 'js/external/**')
        .pipe(gulp.dest(targetdir + 'js/external/'));
});

gulp.task('resources', ["clean"], function () {
    gulp.src(sourcedir + 'js/main.css')
        .pipe(gulp.dest(targetdir + 'js/'));
    
    gulp.src(sourcedir + 'js/modules/img/*.*')
        .pipe(gulp.dest(targetdir + 'js/modules/img/'));

    gulp.src(sourcedir + 'samples/**')
        .pipe(gulp.dest(targetdir + 'samples/'));
});

gulp.task('html', ["clean"], function () {
    return gulp.src(sourcedir + 'template.html')
        .pipe(gulp.dest(targetdir));
});


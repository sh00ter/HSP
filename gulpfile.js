// -------------------------------------------------------------------------------------------------------------------------
// Gulp Plugins ------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
// Quick npm install command -----------------------------------------------------------------------------------------------
// $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-uglify gulp-imagemin gulp-rename gulp-concat gulp-cache gulp-livereload gulp-plumber gulp-html-replace gulp-minify-html gulp-connect del gulp-gzip --save-dev
// -------------------------------------------------------------------------------------------------------------------------
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    htmlreplace = require('gulp-html-replace'),
    minifyHTML = require('gulp-minify-html'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    del = require('del'),
    gzip = require('gulp-gzip');

// -------------------------------------------------------------------------------------------------------------------------
// Style the Styles --------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('styles', function() {
    // Minify and copy all Styles (except vendor scripts)
    gulp.src('src/scss/**/*.scss')
        // Styles for Dev. Env.
        .pipe(plumber())
        .pipe(sass({sourcemap: true, sourcemapPath: 'scss'}))
        .pipe(autoprefixer('last 2 version', '> 5%', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'ios 7', 'android 4'))
        .pipe(gulp.dest('dist/'))
        // Styles for Production Env.
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

// -------------------------------------------------------------------------------------------------------------------------
// Script the Scripts ------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('scripts', function() {
    gulp.src('src/scripts/*.js')
        // Scripts for Dev Env.
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('dist/scripts'))
        // Scripts for Production Env.
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(connect.reload());
});

// -------------------------------------------------------------------------------------------------------------------------
// Compress images ---------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('images', function() {
    gulp.src('src/images/**/*')
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload());
});

// -------------------------------------------------------------------------------------------------------------------------
// Process HTML for PRODUCTION  --------------------------------------------------------------------------------------------
// Replace the dev styles and scripts with minified and optimized versions -------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('html-production', function() {
    gulp.src('src/markup/**/*.html')
        .pipe(htmlreplace({
            'css': 'style.min.css',
            'js': 'main.min.js'
        }))
        .pipe(minifyHTML({comments:true, spare:true}))
        .pipe(gulp.dest('dist/'));
});

// -------------------------------------------------------------------------------------------------------------------------
// Process HTML for DEVELOPMENT  -------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('html-dev', function() {
    gulp.src('src/markup/**/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

// -------------------------------------------------------------------------------------------------------------------------
// Start local server for Production ---------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('connect-dist', function() {
    connect.server({
        root: 'dist',
        port: 8001
    });
});


// -------------------------------------------------------------------------------------------------------------------------
// Start local server for DEVELOPMENT --------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('connect-dev', function() {
    connect.server({
        root: 'dist',
        port: 8002,
        livereload: true
    });
});

// -------------------------------------------------------------------------------------------------------------------------
// Build for production ----------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('build-production', function() {
    gulp.start('styles', 'scripts', 'html-production', 'images', 'connect-dist'); // Run $ gulp clean-dist when ready for production
});

// -------------------------------------------------------------------------------------------------------------------------
// Watch Task --------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch('src/markup/**/*.html', ['html-dev']);
    gulp.watch('src/images/**/*', ['images']);
});

// -------------------------------------------------------------------------------------------------------------------------
// Start Dev enviroment ----------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('start-dev', function() {
    gulp.start('styles', 'scripts', 'html-dev', 'images', 'connect-dev', 'watch');
});

// -------------------------------------------------------------------------------------------------------------------------
// Distribution Cleanup ----------------------------------------------------------------------------------------------------
// Before a deploy it's safe to clean the distirbution ---------------------------------------------------------------------
// Just to make sure nothing unwanted gets live ----------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('clean', function(cb) {
    del(['dist/*.+(css|map|html)', 'dist/images', 'dist/scripts'], cb)
});

// -------------------------------------------------------------------------------------------------------------------------
// Clean distribution's leftovers ------------------------------------------------------------------------------------------
// Remove the css.map's, unminified styles and scripts ---------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
gulp.task('clean-dist', function() {
    del(["dist/*.map", 'dist/style.css', 'dist/scripts/main.js'])
});

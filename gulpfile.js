var gulp = require('gulp'),
    gutil = require('gulp-util'),
    express = require('express'),
    livereload = require('connect-livereload'),
    reload = require('gulp-livereload'),
    path = require('path'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    cmq = require('gulp-combine-media-queries'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    duration = require('gulp-duration'),
    runSequence = require('run-sequence'),
    watch = require('gulp-watch'),
    size = require('gulp-size'),
    args = require('yargs').argv,
    // when using 'gulp --theme shop' or 'gulp watch --theme shop'
    // var theme can be used to setup the theme paths
    // if the theme argument is not used the theme var defaults to _scaffold
    // not used at the moment
    theme = args.theme || '_scaffold';

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname;
// don't set this port to the default livereload 35729 since we are not using
// the browser plugin but instead we are inserting the script via connect-livereload
var LIVERELOAD_PORT = EXPRESS_PORT + 1;
var sources = {
  sass: 'stylesheets/sass/**/*.scss',
  css: ['stylesheets/css/**/*.css', '!stylesheets/css/**/*.min.css', '!stylesheets/css/**/*.css.map'],
  js: ['js/**/*.js', '!js/**/*.min.js'],
  watch: ['**/*.html', 'stylesheets/css/style.css', 'js/**/*.js']
};
var destinations = {
  html: 'dist/',
  js: 'dist/js/',
  css: 'dist/css/'
};


gulp.task('serve', function() {
  var app = express();
  // insert livereload script so we don't need the browser plugin
  app.use(livereload({ port: LIVERELOAD_PORT }));
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
});

refresh = function(event) {
  var fileName = path.relative(EXPRESS_ROOT, event.path);
  
  gutil.log(gutil.colors.magenta(fileName), gutil.colors.cyan('changed'));
  
  gulp.src(fileName, { read: false })
      .pipe(reload(LIVERELOAD_PORT));
}

gulp.task('styles:sass', function() {
  return gulp.src(sources.sass)
    .pipe(size({ title: 'sass size' }))
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: 'stylesheets/css',
      sass: 'stylesheets/sass'
    }))
    .pipe(duration('sass files compiled'));
});

gulp.task('styles:opt', function() {
  return gulp.src(sources.css)
    .pipe(plumber())
    .pipe(autoprefixer(["last 1 version", "> 1%", "ie 9", "ie 8"], { cascade: true }))
    .pipe(size({ title: 'css size' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cmq())
    .pipe(csso())
    .pipe(gulp.dest('stylesheets/css'))
    .pipe(size({ title: 'optimized css size' }));
});

// WIP: attempt to write a task for optimizing build speed
// should only compile changed files in .css-cache, optimize and move them to
// stylesheets/css
gulp.task('styles:cache', function() {
  gulp.src(sources.sass)
    .pipe(size({ title: 'sass size' }))
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
      css: '.css-cache',
      sass: 'stylesheets/sass'
    }))
    .pipe(duration('sass files compiled'));
  
  return watch({ glob: '.css-cache/**/*.css' }, function(files) {
    return files
      .pipe(plumber())
      .pipe(cmq())
      .pipe(csso())
      .pipe(gulp.dest('stylesheets/css'))
  });
});

gulp.task('styles', function() {
  return runSequence('styles:sass', 'styles:opt');
});

// gulp watch || gulp watch --theme [theme-name]
// run express server with livereload and compass
gulp.task('watch', ['serve', 'styles:sass'], function() {
  gulp.watch(sources.sass, ['styles:sass']);
  gulp.watch(sources.watch, refresh);
});

// gulp || gulp --theme [theme-name]
// build SCSS
gulp.task('default', ['styles'], function() {
  // place code for your default task here
  
});

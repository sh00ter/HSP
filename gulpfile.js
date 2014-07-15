var gulp = require('gulp'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename');

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

function startExpress() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
}

var tinylr;
function startLiveReload() {
  tinylr = require('tiny-lr')();
  tinylr.listen(LIVERELOAD_PORT);
}

function notifyLiveReload(event) {
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('compass', function() {
  return gulp.src('stylesheets/sass/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'stylesheets/css',
      sass: 'stylesheets/sass'
    }))
    .pipe(gulp.dest('stylesheets/css'))
    .pipe(autoprefixer(["last 1 version", "> 1%", "ie 9", "ie 8"], { cascade: true }))
    .pipe(gulp.dest('stylesheets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('stylesheets/css'));
});

gulp.task('default', function() {
  // place code for your default task here
  startExpress();
  startLiveReload();
  gulp.watch(['*.html', 'stylesheets/css/style.css'], notifyLiveReload);
  gulp.watch('stylesheets/sass/*.scss', ['compass']);
});

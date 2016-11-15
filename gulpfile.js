var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

gulp.task('build', function () {
    return browserify({entries: './app/main.jsx', extensions: ['.jsx'], debug: true})
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('app/dist'));
});

gulp.task("less", function () {
    return gulp.src('./app/styles/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
    .pipe(gulp.dest('./app/styles/css'));
});

gulp.task("copy", ["build", "less"], function () {
    return gulp.src('app/styles/css/*.css')
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('app/dist'))
});

gulp.task('watch', ['copy'], function () {
    gulp.watch('./app/components/*.jsx', ['copy']);
    gulp.watch('./app/pages/*.jsx', ['copy']);
    gulp.watch('./app/widgets/*.jsx', ['copy']);
    gulp.watch('./app/main.jsx', ['copy']);
    gulp.watch('./app/styles/less/*.less', ['copy']);
});

gulp.task('default', ['watch']);

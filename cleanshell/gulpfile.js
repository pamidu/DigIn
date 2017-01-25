var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	templateCache = require('gulp-angular-templatecache'),
	useref = require('gulp-useref');
	
	
gulp.task('minify-html', function(cb) {
  return gulp.src('partials/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/partials'))
	cb(err);
});

gulp.task('templateCache', ['minify-html'], function () {
  return gulp.src('dist/partials/*.html')
	.pipe(templateCache())
    .pipe(gulp.dest('template_cache'));
});

gulp.task('cache', ['minify-html','templateCache'])

gulp.task('useref', function (cb) {
	return gulp.src('index.php')
		.pipe(useref())
        .pipe(gulp.dest('concat'))
		cb(err);
});
	
	
gulp.task('minify-scripts', ['useref'], function(){
	gulp.src('concat/js/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
})

gulp.task('minify-css', ['useref'], function() {
  return gulp.src('concat/css/styles.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minify', ['useref','minify-scripts','minify-css'])

// gulp.task('concat-scripts', function() {
  // return gulp.src('min/js/**/*.js')
    // .pipe(concat('script.js'))
    // .pipe(gulp.dest('dist'));
// });

// gulp.task('concat-css', function () {
  // return gulp.src('min/css/*.css')
    // .pipe(concatCss("styles.css"))
    // .pipe(gulp.dest('dist'));
// });

gulp.task('watch', function(){
	gulp.watch('js/**/*.js', ['scripts'])
})


//gulp.task('default', ['minify-scripts', 'minify-css', 'minify-html', 'watch'])



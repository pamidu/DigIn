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
	gulp.src('concat/scripts/script.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'));
})

gulp.task('minify-css', ['useref'], function() {
  return gulp.src('concat/styles/styles.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('moveIndex', ['useref'], function() {
  gulp.src("concat/index.php")
      .pipe(gulp.dest('dist'));
});

gulp.task('moveImages', ['useref'], function() {
  gulp.src("images/**")
      .pipe(gulp.dest('concat/images'));
});

gulp.task('moveViews', ['useref'], function() {
  gulp.src("views/**")
      .pipe(gulp.dest('concat/views'));
});

gulp.task('moveDiginFonts', ['useref'], function() {
  gulp.src("styles/digin-main/**")
      .pipe(gulp.dest('concat/styles'));
});

gulp.task('moveThemifyFonts', ['useref'], function() {
  gulp.src("styles/themify/**")
      .pipe(gulp.dest('concat/styles'));
});

gulp.task('moveSounds', ['useref'], function() {
  gulp.src("sounds/**")
      .pipe(gulp.dest('concat/sounds'));
});

gulp.task('move', [ 'moveSounds','moveThemifyFonts','moveDiginFonts','moveViews','moveImages','moveIndex'])

gulp.task('minify', ['move','useref','minify-scripts','minify-css'])

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



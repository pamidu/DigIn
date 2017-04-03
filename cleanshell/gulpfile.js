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
  return gulp.src('concat/styles/styles.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('moveIndex', ['useref'], function() {
  gulp.src("concat/index.php")
      .pipe(gulp.dest('dist'));
});

gulp.task('moveLibraries', ['useref'], function() {
  gulp.src("concat/js/libraries.js")
      .pipe(gulp.dest('dist/js'));
});

gulp.task('moveImages', [], function() {
  gulp.src("images/**")
      .pipe(gulp.dest('dist/images'));
});

gulp.task('moveDialogs', [], function() {
  gulp.src("dialogs/**")
      .pipe(gulp.dest('dist/dialogs'));
});

gulp.task('moveModules', [], function() {
  gulp.src("modules/**")
      .pipe(gulp.dest('dist/modules'));
});

gulp.task('moveConfig', [], function() {
  gulp.src("js/config.js")
      .pipe(gulp.dest('dist/js'));
});

gulp.task('moveSounds', [], function() {
  gulp.src("sounds/**")
      .pipe(gulp.dest('dist/sounds'));
});

gulp.task('moveViews', [], function() {
  gulp.src("views/**")
      .pipe(gulp.dest('dist/views'));
});

gulp.task('moveJsons', [], function() {
  gulp.src("jsons/**")
      .pipe(gulp.dest('dist/jsons'));
});

gulp.task('moveWebWorker', [], function() {
  gulp.src("js/services/webWorker.js")
      .pipe(gulp.dest('dist/js/services'));
});

gulp.task('moveDiginMainIcons', [], function() {
  gulp.src("styles/icons/digin-main/**")
      .pipe(gulp.dest('dist/styles'));
});

gulp.task('moveThemifyIcons', [], function() {
  gulp.src("styles/icons/themify/**")
      .pipe(gulp.dest('dist/styles'));
});

gulp.task('moveItems', ['moveIndex','moveLibraries','moveImages','moveDialogs','moveModules','moveConfig','moveSounds','moveViews','moveJsons','moveWebWorker','moveDiginMainIcons','moveThemifyIcons']);

gulp.task('minify', ['moveItems','useref','minify-scripts','minify-css']);



gulp.task('templateCacheOne', function () {
  return gulp.src('template_cache/abc.html')
    .pipe(templateCache())
    .pipe(gulp.dest('custom'));
});


var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({lazy:false});
var mainBowerFiles = require('main-bower-files');

var target_dir="<%= output_directory %>";

gulp.task('scripts', function(){
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js','./app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(gulp.dest(target_dir+'/js'));
        
});

gulp.task('templates',function(){
    //combine all template files of the app into a js file
    gulp.src(['!./app/index.html',
        './app/**/*.html'])
        .pipe(plugins.angularTemplatecache('templates.js',{standalone:true}))
        .pipe(gulp.dest(target_dir+'/js'));
});

gulp.task('css', function(){
    gulp.src('./app/**/*.css')
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest(target_dir+'/css'));
});

gulp.task('vendorFonts',function(){
var fontFilter = plugins.filter(['**/*.eot', '**/*.woff', '**/*.svg', '**/*.ttf']);
  gulp.src('./bower_components/**')
  .pipe(fontFilter)
  .pipe(plugins.flatten())
  .pipe(gulp.dest(target_dir+'/fonts'));

});

gulp.task('vendorImages',function(){
var imagesFilter = plugins.filter(['**/*.png', '**/*.jpg', '**/*.gif', '**/*.jpeg']);
  gulp.src('./bower_components/**')
  .pipe(imagesFilter)
  .pipe(plugins.flatten())
  .pipe(gulp.dest(target_dir+'/images'));

});

gulp.task('vendorJS', function(){
    //concatenate vendor JS files
    var jsFilter=plugins.filter(['*.js','!*.min.js']);
        gulp.src(mainBowerFiles({"includeDev":true}))
        .pipe(jsFilter)
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest(target_dir+'/js'));

});

gulp.task('vendorCSS', function(){
    //concatenate vendor CSS files
    gulp.src(['!./bower_components/**/*.min.css',
        './bower_components/**/*.css'])
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest(target_dir+'/css'));
});

gulp.task('copy-index', function() {
    gulp.src('./app/index.html')    
        .pipe(gulp.dest(target_dir));
});

gulp.task('minify',['vendorJS','copy-index'],function(){

       gulp.src(target_dir+'/index.html')
       .pipe(plugins.replace(/(\.js)/g, '.min.js'))
       .pipe(plugins.replace(/(\.css)/g, '.min.css'))
       .pipe(gulp.dest(target_dir));

    gulp.src(target_dir+'/js/*')
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
       suffix: ".min"
    }))
    .pipe(gulp.dest(target_dir+'/js'));

   gulp.src(target_dir+'/css/*')
    .pipe(plugins.minifyCss())
    .pipe(plugins.rename({
       suffix: ".min"
    }))
    .pipe(gulp.dest(target_dir+'/css'));

});
gulp.task('watch',function(){
    gulp.watch([
        'build/**/*.html',        
        'build/**/*.js',
        'build/**/*.css'        
    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts']);
    gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
    gulp.watch('./app/**/*.css',['css']);
    gulp.watch('./app/index.html',['copy-index']);

});

gulp.task('connect', plugins.connect.server({
    root: ['build'],
    port: 9000,
    livereload: true
}));

gulp.task('default',['connect','scripts','templates','css','copy-index','vendorJS','vendorCSS','vendorFonts','vendorImages','watch']);

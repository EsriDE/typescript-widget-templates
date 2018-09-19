var gulp = require('gulp');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');

// If you need several compiler configurations, start here by adding tsconfigs for your projects. Use the "include" property in tsconfig.json to restrict compilation to a certain folder.
var tsProjectWab = ts.createProject("./WebAppBuilder/tsconfig.json");
var tsProject4x = ts.createProject("./JS_API_4.x/tsconfig.json");

// Deployment paths outsourced to config file
var gulpconfig = require('./gulpconfig.json');

gulp.task('default', function () {console.log("default");});

// Using 'series' to execute tasks: compileTs must be ready when deploy starts. We don't want asynchronous / parallel execution here!
gulp.task('watchCompileDeploy', function() {
    console.log("watchCompileDeploy");
    gulp.watch(gulpconfig.watchFileTypes, 
        gulp.series(
            //gulp.parallel('compileTsWab', 'compileTs4x'), 
            'compileTsWab',
            'deployWabWidgets'
        )
    );
});


// Other than the regular tsc compiler, grunt-typescript aborts task execution when errors arise. To avoid this, we need to catch the compile errors .on('error'), () => {})
// Ending the method with a return value, which comes back after compilation is finished.
gulp.task('compileTsWab', function() {
    console.log("Gulp task 'compileTs tsProjectWab'");
    return tsProjectWab
        .src("./WebAppBuilder")
        .pipe(sourcemaps.init())
        .pipe(tsProjectWab())
        .on('error', () => {
            console.log("Catching TS compile errors to proceed with tasks.");
        })
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./WebAppBuilder"));
});
gulp.task('compileTs4x', function() {
    console.log("Gulp task 'compileTs tsProject4x'");
    return tsProject4x
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject4x())
        .on('error', () => {
            console.log("Catching TS compile errors to proceed with tasks.");
        })
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});


// Ending the method with a done() call, which lets the method continue ansynchronously in the back and confirms to the caller that it's being executed. Please note: This would not work for 'compileTs', because compilation needs time and Grunt would go on and deploy before compilation is finished.
gulp.task('deployWabWidgets', function(done) {
    console.log("Gulp task 'deployWabWidgets'");
    gulpconfig.wabDeploymentPaths.map(dest => {
        console.log("copying files to", dest);
        gulp.src(gulpconfig.wabDevelopmentPath)
            .pipe(gulp.dest(dest));
    });
    done();
});

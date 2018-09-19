var gulp = require('gulp');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');

// Deployment paths outsourced to config file
var gulpconfig = require('./gulpconfig.json');

// Using 'series' to execute tasks: compileTs must be ready when deploy starts. We don't want asynchronous / parallel execution here!
gulp.task('watchCompileDeploy', function() {
    console.log("watchCompileDeploy");
    gulp.parallel('compileTsWab', 'compileTs4x', 'compileTsDocs');
    gulp.watch(gulpconfig.watchFileTypes, 
        gulp.series(
            gulp.parallel('compileTsWab', 'compileTs4x', 'compileTsDocs'), 
            'deployWabWidgets'
        )
    );
});


// If you need several compiler configurations, start here by adding tsconfigs for your projects. Use the "include" property in tsconfig.json to restrict compilation to a certain folder.
// Other than the regular tsc compiler, grunt-typescript aborts task execution when errors arise. To avoid this, we need to catch the compile errors .on('error'), () => {})
// Ending the method with a return value, which comes back after compilation is finished.
gulp.task('compileTsWab', function() {
    let tsProjectWab = ts.createProject("./WebAppBuilder/tsconfig.json");
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
    let tsProject4x = ts.createProject("./JS_API_4.x/tsconfig.json");
    console.log("Gulp task 'compileTs tsProject4x'");
    return tsProject4x
        .src("./JS_API_4.x")
        .pipe(sourcemaps.init())
        .pipe(tsProject4x())
        .on('error', () => {
            console.log("Catching TS compile errors to proceed with tasks.");
        })
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./JS_API_4.x"));
});
gulp.task('compileTsDocs', function() {
    let tsProjectDocs = ts.createProject("./docs/tsconfig.json");
    console.log("Gulp task 'compileTs tsProjectDocs'");
    return tsProjectDocs
        .src("./docs")
        .pipe(sourcemaps.init())
        .pipe(tsProjectDocs())
        .on('error', () => {
            console.log("Catching TS compile errors to proceed with tasks.");
        })
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./docs"));
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

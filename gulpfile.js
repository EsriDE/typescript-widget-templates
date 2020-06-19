var gulp = require('gulp');
var ts = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
const server = browserSync.create();

// Deployment paths outsourced to config file
var gulpconfig = require('./gulpconfig.json');

// If you need several compiler configurations, start here by adding tsconfigs for your projects. Use the "include" property in tsconfig.json to restrict compilation to a certain folder.
var tsProjectWab = ts.createProject("./tsconfig.json");

// Using 'series' to execute tasks: compileTs must be ready when deploy starts. We don't want asynchronous / parallel execution here!
gulp.task('watchCompileDeploy', function(done) {
    console.log("watchCompileDeploy");
    serve();

    var reloadDeploy = gulp.series('reload', 'deployWabWidgets');
    reloadDeploy();

    var compileAllReloadDeploy = gulp.series(
        gulp.parallel('compileTsWab'),  // if there were several compiler configurations, you would put the compile functions into this parallel execution
        'reload',
        'deployWabWidgets'
    );
    compileAllReloadDeploy();

    gulp.watch(gulpconfig.watchFileTypesNoBuild, reloadDeploy);
    gulp.watch(gulpconfig.watchFileTypesNeedBuild, compileAllReloadDeploy);
    done();
});

// Other than the regular tsc compiler, grunt-typescript aborts task execution when errors arise. To avoid this, we need to catch the compile errors .on('error'), () => {})
// Ending the method with a return value, which comes back after compilation is finished.
gulp.task('compileTsWab', function() {
    console.log("Gulp task 'compileTs tsProjectWab'");
    return tsProjectWab.src()
        .pipe(sourcemaps.init())
        .pipe(tsProjectWab())
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
    gulpconfig.wabPaths.map(devDep => {
        devDep.deployment.map(dest => {
        console.log("copying files to", dest);
        gulp.src(devDep.development)
            .pipe(gulp.dest(dest));
        })
    });
    done();
});

gulp.task('reload', function(done){
    console.log("reload");
    server.reload();
    done();
});
  
function serve() {
    console.log("serve docs");
    server.init({
        server: {
            baseDir: './docs',
            https: true
        }
    });
}
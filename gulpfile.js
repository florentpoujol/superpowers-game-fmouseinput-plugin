var gulp = require("gulp");
var tasks = [];

// TypeScript
var ts = require("gulp-typescript");
var tsProject = ts.createProject({
  typescript: require("typescript"),
  noImplicitAny: true,
  declarationFiles: false,
  module: "commonjs",
  target: "ES5"
});

gulp.task("typescript", function() {
  var js = gulp.src([ "**/*.ts", "!node_modules/**", "!api/**", "!gitignore/**", "!project/**" ]).
  pipe(ts(tsProject)).js.
  pipe(gulp.dest("./"));
});
tasks.push("typescript");

// Browserify
var browserify = require("browserify");
var vinylSourceStream = require("vinyl-source-stream");
function makeBrowserify(sourcePath, destPath, outputName, standalone, taskName) {
  gulp.task((taskName || outputName) + "-browserify", function() {   
    var options = {};
    // if (standalone === true)
    //   options = { standalone: "fTextEditorWidget" };
    browserify(sourcePath+"index.js", options).
    transform("brfs").
    bundle().
    pipe(vinylSourceStream(outputName + ".js")).
    pipe(gulp.dest(destPath));
  });
  tasks.push((taskName || outputName) + "-browserify");
}

makeBrowserify("./api/", "./public", "api");
makeBrowserify("./components/", "./public", "components");

// Watch
gulp.task("watch", function() {
  gulp.watch(["./api/*.js", "./api/*.ts"], ["api-browserify"]);
  gulp.watch(["./components/*.js"], ["components-browserify"]);

  gulp.watch(["./**/*.ts", "!./api/*.ts"], ["typescript"]);
});

// All
gulp.task("default", tasks);

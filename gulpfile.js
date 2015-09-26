var gulp = require("gulp");
var tasks = [ "jade", "stylus" ];

// Jade
var jade = require("gulp-jade");
gulp.task("jade", function() {
  return gulp.src("./editors/**/index.jade").pipe(jade()).pipe(gulp.dest("./public/editors"));
});

// Stylus
var stylus = require("gulp-stylus");
var nib = require("nib");
var cssimport = require("gulp-cssimport");
gulp.task("stylus", function() {
  return gulp.src("./editors/**/index.styl").pipe(stylus({use: [ nib() ], errors: true})).pipe(cssimport()).pipe(gulp.dest("./public/editors"));
});

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
makeBrowserify("./componentEditors/", "./public", "componentEditors");
makeBrowserify("./editors/docsbrowser/", "./public/editors", "docsbrowser/index", null, "docsbrowser");

// Watch
gulp.task("watch", function() {
  gulp.watch(["./editors/**/*.jade"], ["jade"]);
  gulp.watch(["./editors/**/*.styl"], ["stylus"]);
  
  gulp.watch(["./api/*.js", "./api/*.ts"], ["api-browserify"]);
  gulp.watch(["./components/*.js"], ["components-browserify"]);
  gulp.watch(["./componentEditors/*.js"], ["componentEditors-browserify"]);
  gulp.watch(["./editors/docsbrowser/*.js"], ["docsbrowser-browserify"]);

  gulp.watch(["./**/*.ts", "!./api/*.ts"], ["typescript"]);
});

// All
gulp.task("default", tasks);

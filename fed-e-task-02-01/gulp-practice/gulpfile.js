// Project build tasks
const { src, dest, watch, parallel, series } = require("gulp");
const BrowserSync = require("browser-sync");
const gulpSwig = require("gulp-swig");
const gulpSass = require("gulp-sass");
const gulpBabel = require("gulp-babel");
const del = require("del");
const gulpImagemin = require("gulp-imagemin");
const gulpHtmlmin = require("gulp-htmlmin");
const gulpCleanCss = require("gulp-clean-css");
const gulpUglify = require("gulp-uglify");
const gulpIf = require("gulp-if");
const gulpUseref = require("gulp-useref");

const { data } = require("./project.config");
const { print } = require("./fxxk-bug");
const chalk = require('chalk')
// path defined
const config = {
  src: "src",
  dist: "dist",
  temp: "temp",
  public: "public",
  path: {
    page: "**/*.html",
    style: "assets/styles/**/*.scss",
    script: "assets/scripts/**/*.js",
    image: "assets/images/**/*.{jpg,jpeg,png,gif,svg}",
    font: "assets/fonts/**/*.{eot,svg,ttf,woff,woff2}",
  },
};
// dev server
const server = BrowserSync.create();

const devServer = () => {
  // listen source code changed
  watch(config.path.page, { cwd: config.src }, page);
  watch(config.path.style, { cwd: config.src }, style);
  watch(config.path.script, { cwd: config.src }, script);

  // listen static source code
  watch([config.path.image, config.path.font], {
    cwd: config.src,
  });
  watch("**", { cwd: config.public }, server.reload);

  server.init({
    open: true,
    notify: false,
    server: {
      baseDir: [config.temp, config.src, config.public],
      routes: {
        "/node_modules": "node_modules", // route mapping
      },
    },
  });
};


// HTML template compile
const page = () => {
  return src(config.path.page, {
    base: config.src,
    cwd: config.src,
    ignore: ["{layouts,partials}/**"],
  })
    .pipe(gulpSwig({ defaults: { locals: data, cache: false } }))
    .pipe(dest(config.temp))
    .pipe(server.reload({ stream: true }));
};

// scss template compile
const style = () => {
  return src(config.path.style, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpSass({ outputStyle: "expanded" }))
    .pipe(dest(config.temp))
    .pipe(server.reload({ stream: true }));
};

// ES6 compile
const script = () => {
  return src(config.path.script, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpBabel({ presets: [require("@babel/preset-env")] }))
    .pipe(dest(config.temp))
    .pipe(server.reload({ stream: true }));
};

// files compress 
const useref = () => {
  return src(config.path.page, {
    base: config.temp,
    cwd: config.temp,
  })
    .pipe(gulpUseref({ searchPath: [".", ".."] }))
    .pipe(gulpIf(/\.css$/, gulpCleanCss()))
    .pipe(gulpIf(/\.js$/, gulpUglify()))
    .pipe(
      gulpIf(
        /\.html$/,
        gulpHtmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest(config.dist));
};

// image compress
const image = () => {
  return src(config.path.image, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpImagemin({}))
    .pipe(dest(config.dist));
};

// font compress
const font = () => {
  return src(config.path.font, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpImagemin({}))
    .pipe(dest(config.dist));
};

// public folder copy
const extra = () => {
  return src("**", { base: config.public, cwd: config.public })
    .pipe(gulpImagemin())
    .pipe(dest(config.dist));
};

// clean folder
const cleanDev = () => {
  return del(config.temp);
};
const clean = () => {
  return del([config.dist, config.temp]);
};

// print slogon fxxk bug
const printSlogon = async () => {
  print()
 
};


// ===========================================================

// group tasks
const compile = parallel(page, style, script);

// develop environment tasks 开发环境编译任务
const serve = series(printSlogon, series(cleanDev, compile, devServer));

// production environment 
const build = series(
  printSlogon,
  clean,
  parallel(series(compile, useref), image, font, extra)
);

module.exports = {  
  clean,
  serve,
  build,
};
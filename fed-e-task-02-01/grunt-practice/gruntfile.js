const sass = require("sass");
const { data } = require("./project.config");
const { print } = require("./fxxk-bug");
const browserSync = require("browser-sync");

module.exports = (grunt) => {
  const server = browserSync.create();

  const config = {
    src: "src/",
    dist: "dist/",
    temp: "temp/",
    public: "public/",
    path: {
      page: "*.html",
      scss: "assets/styles/**/*.scss",
      css: "assets/styles/**/*.css",
      script: "assets/scripts/**/*.js",
      image: "assets/images/**/*.{jpg,jpeg,png,gif,svg}",
      font: "assets/fonts/**/*.{eot,svg,ttf,woff,woff2}",
    },
  };

  grunt.initConfig({
    clean: [config.temp, config.dist],
    sass: {
      options: {
        sourceMap: true,
        implementation: sass,
      },
      main: {
        files: [
          {
            expand: true,
            cwd: config.src,
            src: [config.path.scss],
            dest: config.temp,
            ext: ".css",
          },
        ],
      },
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ["@babel/preset-env"],
      },
      main: {
        files: [
          {
            expand: true,
            cwd: config.src,
            src: [config.path.script],
            dest: config.temp,
          },
        ],
      },
    },
    uglify: {
      options: {
        sourceMap: true,
      },
      compress: {
        files: [
          {
            expand: true,
            cwd: config.temp,
            src: [config.path.script],
            dest: config.dist,
            ext: ".js",
          },
        ],
      },
    },
    cssmin: {
      options: {
        sourceMap: true,
      },
      compress: {
        options: {
          keepSpecialComments: 0,
        },
        files: [
          {
            expand: true,
            cwd: config.temp,
            src: [config.path.css],
            dest: config.dist,
            ext: ".css",
          },
        ],
      },
    },
    htmlmin: {
      compress: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          minifyCSS: true,
          minifyJS: true,
        },
        files: [
          {
            expand: true,
            cwd: config.temp,
            src: [config.path.page],
            dest: config.dist,
            ext: ".html",
          },
        ],
      },
    },
    imagemin: {
      compress: {
        options: {
          optimizationLevel: 7,
        },
        files: [
          {
            expand: true,
            cwd: config.src,
            src: [config.path.image, config.path.font],
            dest: config.dist,
          },
        ],
      },
    },
    html_template: {
      options: {
        locals: {
          ...data,
        },
      },
      build_html: {
        expand: true,
        cwd: config.src,
        src: [config.path.page],
        dest: config.temp,
      },
    },
    useref: {
        // specify which files contain the build blocks
        html: 'output/**/*.html',
        // explicitly specify the temp directory you are working in
        // this is the the base of your links ( "/" )
        temp: 'output'
    },
    watch: {
      html: {
        files: ["src/**/*.html"],
        tasks: ["html_template"],
      },
      js: {
        files: ["src/assets/scripts/*.js"],
        tasks: ["babel"],
      },
      scss: {
        files: ["src/assets/styles/*.scss"],
        tasks: ["sass"],
      },
    },
  });

  grunt.registerTask("devServer", function () {
    const done = this.async();
    server.init({
      server: {
        baseDir: [config.temp, config.src, config.public],
        routes: {
          "/node_modules": "node_modules",
        },
        watchTask: true,
      },
    });
  });

  grunt.registerTask("print_slogon",function () {
    print()
  })

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-html-template");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-css");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-useref");
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default',['watch']);

  grunt.registerTask("build_html", ["html_template", "htmlmin"]);
  grunt.registerTask("build_js", ["babel", "uglify"]);
  grunt.registerTask("build_css", ["sass", "cssmin"]);

  grunt.registerTask("compile", ["clean", "html_template", "sass", "babel"]);

  grunt.registerTask("serve", ["print_slogon","compile", "devServer","watch"]);

  grunt.registerTask("build", ["print_slogon",
    "clean",
    "useref",
    "build_html",
    "build_css",
    "build_js",
    "imagemin",
  ]);
};
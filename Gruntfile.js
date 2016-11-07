module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
     // browserify: {
     // dist: {
     //   options: {
     //     transform: ["babelify"]
     //   },
     //   files: {
     //     "src/static/dist/main.js": "src/static/js/first.js"
     //   }
     // }
     //},
    browserify: {
      dist: {
        options: {
           transform: [['babelify', {presets: ['es2015', 'react']}]]
        },        
        src: ['./src/js/main.js'],
        dest: './src/dist/main.js',
      }
    },
    concat: {
      options: {},
      dist: {
        // TODO: Concat Bootstrap CSS so that browser only 
        // has to import one CSS file
        src: ['./src/css/*.scss'],
        dest: './src/css/concated.scss',
      },
    },
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                './src/dist/style.css': './src/css/concated.scss'
            }
        }
    },
    clean: ['./src/css/concated.scss']
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-sass");

  grunt.registerTask("default", [ "clean", "browserify", "concat", "sass"]);
};

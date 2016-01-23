# Grunt configuration updated to latest Grunt.  That means your minimum
# version necessary to run these tasks is Grunt 0.4.
#
# Please install this locally and install `grunt-cli` globally to run.
module.exports = (grunt) ->

  grunt.loadNpmTasks("grunt-contrib-watch")
  grunt.loadNpmTasks("grunt-contrib-coffee")
  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks("grunt-contrib-concat")
  grunt.loadNpmTasks("grunt-contrib-sass")

  # Initialize the configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    sass:
      compile:
        options:
          style: "compressed"
          sourcemap: true
        files: [
          "public/stylesheets/style.css": "public/stylesheets/style.scss"
        ]
    
    watch:
      coffee:
        files: [
          "public/javascripts/app.coffee"
        ]
        tasks: ["coffee:compile"]

      sass:
        files: [
          "public/stylesheets/style.scss"
        ]
        tasks: ["sass"]
    coffee:
      compile:
        expend: true
        flatten: true
        files: {
          "public/javascripts/app.js": "public/javascripts/app.coffee"
        }

    uglify:
      my_target:
        files: {
          "public/javascripts/app.min.js": ["public/javascripts/app.js"]
        }
      options:
        compress: true
        mangle: false
        sourceMap: false

    copy:
      main:
        files: [
          {
            expand: false
            isFile: true
            src: "public/bower_components/angular/angular.min.js.map"
            dest: "public/javascripts/angular.min.js.map"
          }
        ]

    concat:
      dev:
        src: [
          "public/bower_components/angular/angular.min.js",
          "public/bower_components/angular-route/angular-route.min.js",
          "public/javascripts/app.js"
        ]
        dest: "public/javascripts/app.js"


    # Allow certain options.
    options:
      browser: true
      boss: true
      immed: false
      eqnull: true
      evil: true
      globals: {}

  grunt.registerTask "default", ["watch"]
  grunt.registerTask "dist", ["concat:dev", "uglify"]

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner:
          """
          /*
          * <%= pkg.name %>
          * Version <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %>
          * @requires jQuery <%= pkg.dependencies.jquery %> or later
          *
          * Homepage: <%= pkg.homepage %>
          * Author: <%= pkg.author %>
          * License: <%= pkg.license %>
          */

          """
      build:
        src: '<%= pkg.name %>.js'
        dest: '<%= pkg.name %>.min.js'

  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.registerTask 'default', ['uglify']

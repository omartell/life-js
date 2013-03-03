module.exports = function(grunt) {
  grunt.initConfig({
    meta : {
      src   : 'src/**/*.js',
      specs : 'spec/**/*.js'
    },
    concat: {
      dist: {
        src: ['node_modules/underscore/underscore.js','<%= meta.src %>'],
        dest: 'dist/life.js'
      }
    },
    watch: {
      test : {
        files: ['<%= meta.src %>','<%= meta.specs %>'],
        tasks: 'test'
      }
    },
    jasmine : {
      src : 'dist/life.js',
      options : {
        specs : '<%= meta.specs %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['concat', 'jasmine']);

  grunt.registerTask('default', ['test']);
};
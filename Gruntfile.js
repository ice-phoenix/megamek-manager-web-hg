module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      min: {
        files: [{
          expand: true,
          cwd: 'public/js/mmm',
          src: '**/*.js',
          dest: 'public/js/min',
          ext: '.min.js'
        }]
      }
    },

    concat: {
      options: {
        nonull: true
      },
      full: {
        src: [
          'public/js/jquery-1.9.0.min.js',
          'public/js/angular.js',
          'public/js/angular-resource.js',
          'public/js/ui-bootstrap-0.3.0.js',
          'public/js/mmm/**/*.js'
        ],
        dest: 'public/js/all/mmm.full.js'
      },
      min: {
        src: [
          'public/js/jquery-1.9.0.min.js',
          'public/js/angular.min.js',
          'public/js/angular-resource.min.js',
          'public/js/ui-bootstrap-0.3.0.min.js',
          'public/js/min/**/*.min.js'
        ],
        dest: 'public/js/all/mmm.min.js'
      },
      less: {
        src: [
          'public/js/jquery-1.9.0.min.js',
          'public/js/angular.min.js',
          'public/js/angular-resource.min.js',
          'public/js/ui-bootstrap-0.3.0.min.js',
          'public/js/min/util/**/*.min.js',
          'public/js/min/rest/whoami.min.js',
          'public/js/min/app-less.min.js'
        ],
        dest: 'public/js/all/mmm.less.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['uglify', 'concat']);

};

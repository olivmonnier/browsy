const sass = require('node-sass');

module.exports = function(grunt) {

  grunt.config.set('sass', {
    dev: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      files: [{
        expand: true,
        cwd: 'assets/styles/',
        src: ['importer.scss', 'importer.sass'],
        dest: '.tmp/public/styles/',
        ext: '.css'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-sass');
}
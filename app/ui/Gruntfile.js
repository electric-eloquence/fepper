module.exports = function (grunt) {

  /******************************
   * Project configuration.
   * Should only be needed if you are developing against core, running tests, linting and want to run tests or increment package numbers
   *****************************/
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodeunit: {
      all: ['test/*_tests.js']
    },
    eslint: {
      options: {
        configFile: './.eslintrc',
        ignorePattern: '!node_modules/*'
      },
      target: [
        './core/lib/*',
        './node_modules/patternengine-node-mustache/lib/*',
        './test/*.js'
      ]
    }
  });

  // load all grunt tasks
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  //travis CI task
  grunt.registerTask('test', ['nodeunit', 'eslint']);
};

'use strict';

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        eslint: {
            all: ['lib/**/*.js', 'test/**/*.js', 'config/**/*.js', 'Gruntfile.js', 'app.js']
        },

        nodeunit: {
            splitter: ['test/message-splitter-test.js'],
            all: ['test/**/*-test.js']
        }
    });

    // Load the plugin(s)
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Tasks
    grunt.registerTask('default', ['eslint:all', 'nodeunit:all']);
};

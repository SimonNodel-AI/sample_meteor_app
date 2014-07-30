(function(){
    'use strict';

    module.exports = function (grunt) {
        // load all grunt tasks    
        require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

        grunt.initConfig({            
            coverage: {
                options: {
                    thresholds: {
                        'statements': 96,
                        'branches': 96,
                        'lines': 96,
                        'functions': 96
                    },
                    dir: 'coverage',
                    root: '.tmp'
                }
            },
            karma: {
                unit: {
                    configFile: 'karma.conf.js',
                    singleRun: true
                }
            }
        });

        grunt.registerTask('test', [
            'karma',
            'coverage'
        ]);

        grunt.registerTask('default', [
            'test'
        ]);
    };
})();

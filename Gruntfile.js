(function(){
    'use strict';

    module.exports = function (grunt) {
        // load all grunt tasks    
        require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

        grunt.initConfig({            
            coverage: {
                options: {
                    thresholds: {
                        'statements': 90,
                        'branches': 90,
                        'lines': 90,
                        'functions': 90
                    },
                    dir: 'coverage',
                    root: ''
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

// Karma configuration
module.exports = function (config) {

    config.set({        
        basePath: '',

        frameworks: ['jasmine'],

        plugins: [
            'karma-*'
        ],

        // list of files / patterns to load in the browser
        files: [
            'test/unit/meteor-stubs.js',
            'test/unit/client/*.js',
            'app/client/*.js'            
        ],

        preprocessors: {
            'app/client/*.js': 'coverage'
        },

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        reporters : ['dots', 'coverage'],

        coverageReporter : {
            reporters:[
                {type: 'html', dir: '.tmp/coverage/'},
                {type: 'json', dir: '.tmp/coverage/'},
                {type: 'text-summary', dir: '.tmp/coverage/'}
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging        
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - Firefox       
        // - PhantomJS        
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000
    });
};

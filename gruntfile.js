module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      jade: {
        files: ['app/views/**'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: ['public/js/**'],
        options: {
          livereload: true,
        },
      },
      css: {
        files: ['public/sass/**'],
        tasks: ['compass'],
        options: {
          livereload: true,
          force: true
        }
      }
    },
    jshint: {
       all: ['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js']
    },
    compass: { //Task
      dist: { //Target
        options: { //Target options
          sassDir: 'public/sass',
          cssDir: 'public/css',
          environment: 'production',
          imagesDir: 'public/img/',
          httpImagesPath: '/img/',
          generatedImagesDir: 'public/img/sprites/',
          httpGeneratedImagesPath: '/img/sprites/'
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'server.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['app', 'config'],
          debug: true,
          delayTime: 1,
          cwd: __dirname
        }
      },
      exec: {
        options: {
          exec: 'less'
        }
      }
    },
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/**/*.js']
    },
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('test', ['jshint','mochaTest']);
  grunt.registerTask('default', ['jshint', 'compass:dist', 'concurrent:target']);
};

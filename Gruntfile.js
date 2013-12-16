module.exports = function(grunt) {

  'use strict';

  var path = require('path');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    bower: {
      install: {
        options: {
          targetDir: 'src/vendor/',
          install: true,
          verbose: true,
          cleanBowerDir: true,
          cleanTargetDir: true,
          layout: function(type, component) {
            if (type === 'img') {
              return path.join('../../demo/static/img');
            } else if (type === 'fonts') {
              return path.join('../../demo/static/fonts');
            } else {
              return path.join(component);
            }
          }
        }
      }
    },

    clean: {
      vendor: [
        'src/vendor/fj-fe/fj.less'
      ]
    },

    concat: {
      fj: {
        src: [
          'src/*.less',
          'src/vendor/fj-*/*.less',
          'src/vendor/ghost/ghost.less',
          'src/vendor/font-awesome/font-awesome.css'
        ],
        dest: 'src/vendor/fj-fe/fj.less',
      },
    },

    less: {
      main: {
        options: {
          paths: grunt.file.expand('src/vendor/**/'),
          yuicompress: false
        },
        files: {
          'demo/static/css/main.css': [
            'src/vendor/normalize-css/normalize.css',
            'src/vendor/fj-fe/fj.less'
          ]
        }
      }
    },

    'string-replace': {
      vendor: {
        files: {
          'demo/static/css/': ['demo/static/css/main.css']
        },
        options: {
          replacements: [{
            pattern: /url\((.*?)\)/ig,
            replacement: function (match, p1, offset, string) {
              var path, pathParts, pathLength, filename, newPath;
              path = p1.replace(/["']/g,''); // Removes quotation marks if there are any
              pathParts = path.split('/'); // Splits the path so we can find the filename
              pathLength = pathParts.length;
              filename = pathParts[pathLength-1]; // The filename is the last item in pathParts

              grunt.verbose.writeln('');
              grunt.verbose.writeln('--------------');
              grunt.verbose.writeln('Original path:');
              grunt.verbose.writeln(match);
              grunt.verbose.writeln('--------------');

              // Rewrite the path based on the file type
              // Note that .svg can be a font or a graphic, not usre what to do about this.
              if (filename.indexOf('.eot') !== -1 ||
                  filename.indexOf('.woff') !== -1 ||
                  filename.indexOf('.ttf') !== -1 ||
                  filename.indexOf('.svg') !== -1)
              {
                newPath = 'url("/static/fonts/'+filename+'")';
                grunt.verbose.writeln('New path:');
                grunt.verbose.writeln(newPath);
                grunt.verbose.writeln('--------------');
                return newPath;
              } else if (filename.indexOf('.png') !== -1 ||
                  filename.indexOf('.gif') !== -1 ||
                  filename.indexOf('.jpg') !== -1)
              {
                newPath = 'url("/static/img/'+filename+'")';
                grunt.verbose.writeln('New path:');
                grunt.verbose.writeln(newPath);
                grunt.verbose.writeln('--------------');
                return newPath;
              } else {
                grunt.verbose.writeln('No new path.');
                grunt.verbose.writeln('--------------');
                return match;
              }

              grunt.verbose.writeln('--------------');
              return match;
            }
          }]
        }
      }
    },

    topdoc: {
        usageguides: {
            options: {
                source: 'demo/static/css',
                destination: "demo/demo",
                template: "node_modules/topdoc-theme/",
                templateData: {
                    "title": "Flapjack Front-End <%= pkg.name %> Demo",
                    "subtitle": "<%= pkg.description %>",
                    "homeURL": "https://fake.ghe.domain/flapjack/front-end"
                }
            }
        }
    }

  });

  /**
   * The above tasks are loaded here.
   */
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-topdoc');

  /**
   * Create custom task aliases and combinations
   */
  grunt.registerTask('vendor', ['clean', 'bower', 'concat']);
  grunt.registerTask('compile', ['less', 'string-replace']);
  grunt.registerTask('default', ['clean', 'concat', 'less', 'string-replace']);

};

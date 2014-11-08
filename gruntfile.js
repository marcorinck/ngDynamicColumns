/* global module: true, require: true */
module.exports = function (grunt) {
	"use strict";

	grunt.initConfig({

		pkg: grunt.file.readJSON('bower.json'),

		language: grunt.option('lang') || 'en',

		meta: {
			banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;' +
				' Licensed <%= pkg.license %>\n */\n'
		},

		build_dir: 'dist',

		lib_files: {

			core: [
				'src/**/*'
			],
			test: ['test/**/*.js']
		},

		watch: {

			scripts: {
				files: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],
				tasks: ['jshint:all', 'karma:unit']
			},

			livereload: {
				options: {
					livereload: true
				},
				files: ['src/**/*.*'],
				tasks: ['jshint', 'karma:unit']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},

			all: ['gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.test %>'],

			core: {
				files: {
					src: ['<%= lib_files.core %>']
				}
			},

			test: {
				files: {
					src: ['<%= lib_files.test %>']
				}
			}
		},

		concat: {
			banner: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: '<%= concat.core.dest %>',
				dest: '<%= concat.core.dest %>'
			},

			core: {
				src: ['<%= lib_files.core %>'],
				dest: '<%= build_dir + "/" + pkg.name %>.js'
			}
		},
		uglify: {
			core: {
				files: {
					'<%= build_dir + "/" + pkg.name %>.min.js': '<%= concat.core.dest %>'
				},
				options: {
					banner: '<%= meta.banner %>',
					report: 'gzip'
				}
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		push: {
			options: {
				files: ['package.json', 'bower.json'],
				add: true,
				addFiles: ['.'], // '.' for all files except ingored files in .gitignore
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'bower.json', '<%= build_dir%>/**/*', 'README.md'], // '-a' for all files
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin',
				npm: true,
				npmTag: 'Release v%VERSION%',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		}
	});


	grunt.registerTask('default', ['jshint:all', 'karma']);
	grunt.registerTask('test', ['karma']);

	grunt.registerTask('build', [
		'jshint:all',
		'karma',
		'build:core'
	]);

	grunt.registerTask('build:core', [
		'concat:core',
		'concat:banner',
		'uglify:core'
	]);

	// For development purpose.
	grunt.registerTask('dev', ['jshint', 'karma:unit', 'watch:livereload']);

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
/* eslint-disable */

const {src, dest, series, watch} = require('gulp'),
	fileInclude = require('gulp-file-include'),
	dartSass = require('gulp-dart-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	rename = require("gulp-rename"),
	del = require("del"),
	image = require('gulp-image'),
	babel = require('gulp-babel'),
	svgmin = require( 'gulp-svgmin'),
	svgSprite = require('gulp-svg-sprite'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	browserSync = require('browser-sync').create();

const html = () => (
	src('./src/index.html')
		.pipe(fileInclude({
		prefix: '@@',
		basepath: '@file',
	}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(dest('dist'))
		.pipe(browserSync.stream())
);

const sass = () => (
	 src('./src/scss/style.scss')
		 .pipe(dartSass().on('error', dartSass.logError))
		 .pipe(cleanCSS({compatibility: 'ie8'}))
		 .pipe(autoprefixer({
			 cascade: false
		 }))
		 .pipe(rename({suffix: '.min'}))
		 .pipe(dest('dist/css'))
		 .pipe(browserSync.stream())
);

const images = () => (
	src(['./src/images/**/*.png','./src/images/**/*.jpg'])
		.pipe(image())
		.pipe(dest('dist/images'))
		.pipe(browserSync.stream())
);

const video = () => (
	src('./src/images/**/*.mp4')
		.pipe(dest('dist/images'))
		.pipe(browserSync.stream())
);

const svg = async () => {
	src('./src/images/**/*.svg')
		.pipe(svgmin())
		.pipe(dest('dist/images'))
		.pipe(browserSync.stream())
}

const fonts = () => (
	src('./src/fonts/*')
		.pipe(dest('dist/fonts'))
		.pipe(browserSync.stream())
)

const js = () => (
	src('./src/js/**/*.js')
		.pipe(concat('index.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(dest('dist/js'))
		.pipe(browserSync.stream())
)

const sprite = async () => (
	src('./src/images/sprite/**/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			},
		}))
		.pipe(dest('./dist/images/sprite'))
		.pipe(browserSync.stream())
)

const clean = () => (
	del(['dist/*'])
);

const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./dist"
		}
	});

	watch('./src/**/*.html', html);
	watch('./src/scss/**/*', sass);
	watch(['./src/images/**/*.png','./src/images/**/*.jpeg'], images);
	watch('./src/images/svg/sprite/**/*.svg', sprite);
	watch('./src/images/svg/**/*.svg', svg);
	watch('./src/js/**/*.js', js)
	watch('./src/fonts/**/*', fonts);
}

exports.default = series(clean, fonts, html, sass, images, js, svg, sprite, video, watchFiles);

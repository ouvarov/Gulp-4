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
	gulpStylelint = require('gulp-stylelint'),
	browserSync = require('browser-sync').create();

const html = () => (
	src('./src/index.html')
		.pipe(fileInclude({
		prefix: '@@',
		basepath: '@file'
	}))
		.pipe(dest('dist'))
);

const sass = () => (
	 src('./src/scss/style.scss')
		 .pipe(dartSass().on('error', dartSass.logError))
		 .pipe(gulpStylelint({
			 fix: true
		 }))
		 .pipe(cleanCSS({compatibility: 'ie8'}))
		 .pipe(autoprefixer({
			 cascade: false
		 }))
		 .pipe(rename({suffix: '.min'}))
		 .pipe(dest('dist/css'))
);

const images = () => (
	src(['./src/images/**/*.png','./src/images/**/*.jpeg'])
		.pipe(image())
		.pipe(dest('dist/images'))
);

const svg = async () => {
	src('./src/images/**/*.svg')
		.pipe(svgmin())
		.pipe(dest('dist/images'))
}

const fonts = () => (
	src('./src/fonts/*')
		.pipe(dest('dist/fonts'))
)

const js = () => (
	src('./src/js/**/*.js')
		.pipe(concat('index.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(dest('dist/js'))
)

const sprite = () => (
	src('./src/images/sprite/**/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"  //sprite file name
				}
			},
		}))
		.pipe(dest('./dist/images/sprite'))
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
	watch('./src/styles/style.sass', sass);
	watch(['./src/images/**/*.png','./src/images/**/*.jpeg'], images);
	watch('./src/images/svg/sprite/**/*.svg', sprite);
	watch('./src/images/svg/**/*.svg', svg);
	watch('./src/js/**/*.js', js)
	watch('./src/fonts/**/*', fonts);
}

exports.default = series(clean, fonts, html, sass, images, js, svg, sprite, watchFiles);

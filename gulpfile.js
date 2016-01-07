/* Set base variables */

var basePaths = {
	src: 'build/',
	dest: 'assets/',
	scss: 'assets/sass/**/*.scss',
	css: 'assets/css/'
};
var paths = {
	images: {
		src: basePaths.src + 'images/',
		dest: basePaths.dest + 'images/'
	},
	sprite: {
		src: basePaths.src + 'sprite/*',
		svg: 'images/sprite.svg',
		scss: 'sass/elements/_sprite.scss'
	},
	templates: {
		src: basePaths.src + 'templates/sprites.scss'
	}
};

/* Nodes list */

var gulp = require('gulp');

var nodes = {
	sass: require('gulp-sass'),
	svgSprite: require('gulp-svg-sprite'),
	svg2png: require('gulp-svg2png'),
}

/* Task list */

gulp.task('svgSprite', function () {
	return gulp.src(paths.sprite.src)
		.pipe(nodes.svgSprite({
			shape: {
				spacing: {
					padding: 10
				}
			},
			mode: {
				css: {
					dest: "./",
					layout: "packed",
					sprite: paths.sprite.svg,
					bust: false,
					render: {
						scss: {
							template: paths.templates.src,
							dest: paths.sprite.scss
						}
					}
				}
			}
		}))
		.pipe(gulp.dest(basePaths.dest));
});

gulp.task('pngSprite', ['svgSprite'], function() {
	return gulp.src(basePaths.dest + paths.sprite.svg)
		.pipe(nodes.svg2png())
		.pipe(gulp.dest(paths.images.dest));
});

gulp.task('sprites', ['pngSprite']);


gulp.task('sass', function () {
	gulp.src(basePaths.scss)
		.pipe(nodes.sass().on('error', nodes.sass.logError))
		.pipe(gulp.dest(basePaths.css));
})

gulp.task('sass:watch', function () {
	gulp.watch(basePaths.scss, ['sass']);
})


gulp.task('watch', function(){
	gulp.watch(paths.sprite.src, ['sprites', 'sass']).on('change', function(e) {
		changeEvent(e);
	});
});

gulp.task('default', ['sprites', 'sass', 'sass:watch']);

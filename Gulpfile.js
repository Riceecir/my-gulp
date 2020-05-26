const path = require('path')
const del = require('del');
const { src, dest, series, watch } = require('gulp')
const plugins = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()

const resolve = (p) => {
    return path.resolve(__dirname, p)
}

/* 处理 js 文件 */
const scripts = function (cb) {
    src('./src/*.js')
        .pipe(plugins.uglify())
        .pipe(dest('./dist'))
        .pipe(browserSync.reload({ stream: true }))
    cb()
}

/* 处理Sass */
const sass = function (cb) {
    src('./src/*.scss')
        .pipe(plugins.sass({
            outputStyle: 'compressed'
        }))
        .pipe(plugins.autoprefixer({
            cascade: false
        }))
        .pipe(dest('./dist'))
        .pipe(browserSync.reload({ stream: true }))
    cb()
}

/* 处理HTML文件 */
const html = function (cb) {
    src('./public/*.html')
        .pipe(plugins.htmlhint())
        .pipe(dest('./dist'))
        .pipe(browserSync.reload({ stream: true }))
    cb()
}

/* 清除打包目录 */
const clean = function (cb) {
    del('./dist')
    cb()
}


/* 监听文件变化 */
const watcher = function (cb) {
    watch('./src/*.js', scripts)
    watch('./src/*.scss', sass)
    watch('./public/*.html', html)
}

/* 浏览器同步刷新 */
const serve = function (cb) {
    browserSync.init({
        server: {
            baseDir: resolve('./dist')
        }
    })
    cb()
}

exports.default = series(clean, sass, scripts, html, serve, watcher)
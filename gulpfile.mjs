'use strict';

// モジュールをインポート
import gulp from 'gulp';
import dartSass from 'sass';  // dart-sassをインポート
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);  // gulp-sassとdart-sassを接続
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import pug from 'gulp-pug';

// Gulp タスク
const { series, task, src, dest, watch } = gulp;

// 入出力ディレクトリ設定
const cssSrcPath = './src/sass';
const cssDestPath = './public/css';
const jsSrcPath = './src/js';
const jsDestPath = './public/js';
const pugSrcPath = './src/pug';
const pugDestPath = './public/';

// Sassタスクの実行
task('sass', () => {
    console.log('///// sassのタスク実行 /////');
    return src(cssSrcPath + '/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(autoprefixer())
        .pipe(dest(cssDestPath));
});

// Pugタスクの実行
task('pug', () => {
    console.log('***** pugのタスク実行 *****');
    return src([`${pugSrcPath}/*.pug`, `!${pugSrcPath}/_*.pug`])
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(pug({ pretty: true }))
        .pipe(dest(pugDestPath));
});

// JavaScriptタスクの実行
task('js', () => {
    console.log('>>>>>>>> jsのタスク実行 <<<<<<<<<');
    return src(jsSrcPath + '/*.js')
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        .pipe(dest(jsDestPath));
});

// Watchタスク
task('watch', () => {
    console.log('+++++ watchの実行 +++++');
    watch(`${pugSrcPath}/*.pug`, series('pug'));
    watch(`${cssSrcPath}/*.scss`, series('sass'));
    watch(`${jsSrcPath}/*.js`, series('js'));
});

// デフォルトタスク
task('default', series('sass', 'pug', 'js', 'watch'));

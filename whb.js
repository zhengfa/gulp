import gulp from "gulp"
import gulp_sass from "gulp-sass"
import fileinclude from "gulp-file-include"
import inject from "gulp-inject"
import config from "./config"

/**
 * 编译sass文件
 * @param name
 */
export function sass(module){
    return new Promise((resolve,reject)=>{
        gulp.src(config.src+'/module/'+module.name+'/assets/scss/app.scss')
            .pipe(gulp_sass({outputStyle: 'compact'}).on('error', gulp_sass.logError))
            .pipe(gulp.dest(config.dist+'/module/'+module.name+'/assets/css/'));
        resolve('sass编译完成...');
    })

}

/**
 * 编译HTML
 */
export function compile_html(module){
    return new Promise((resolve,reject) =>{
        gulp.src(config.src + '/module/' + module.name + '/html/*.html')
            .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
            })).pipe(gulp.dest(config.dist + '/module/' + module.name + '/html/'));
        setTimeout(()=>{
            inject_assets(module)
        },100)
        resolve('html编译完成...')
    })
}

/**
 * 导入静态资源
 * @param name
 * @param framework
 */
export function import_assets(module){
    return new Promise((resolve,reject) =>{
        if (module.framework != '') {
            gulp.src(config.src + '/framework/' + module.framework + '/' + (config.debug ? 'debug' : 'release') + '/**/')
                .pipe(gulp.dest(config.dist + '/module/' + module.name + '/assets/' + module.framework +'/' ));
        }
        //拷贝js
        gulp.src([config.src + '/common/js/*.js',config.src + '/module/' + module.name + '/assets/js/*.*'])
            .pipe(gulp.dest(config.dist + '/module/' + module.name + '/assets/js/'));
        //拷贝图片
        gulp.src([config.src + '/module/' + module.name + '/assets/img/*.*', config.src + '/common/img/*.*'])
            .pipe(gulp.dest(config.dist + '/module/' + module.name + '/assets/img/'));
        //拷贝字体
        gulp.src([config.src + '/module/' + module.name + '/assets/fonts/*.*', config.src + '/common/fonts/*.*'])
            .pipe(gulp.dest(config.dist + '/module/' + module.name + '/assets/fonts/'));
        resolve('静态文件导入完成...');
    })
}

/**
 * 注入静态资源文件
 * @param name
 */
export function inject_assets(module){
    gulp.src('./'+config.dist+'/module/'+module.name+'/html/*.html')
        .pipe(inject(gulp.src([
            './'+config.dist+'/module/'+module.name+'/assets/'+module.framework+'/css/*.css',
            './'+config.dist+'/module/'+module.name+'/assets/'+module.framework+'/js/*.js',
            './'+config.dist+'/module/'+module.name+'/assets/css/*.css',
            './'+config.dist+'/module/'+module.name+'/assets/js/*.js',
        ], {read: true}), {relative: true}))
        .pipe(gulp.dest('./'+config.dist+'/module/'+module.name+'/html/'));
}
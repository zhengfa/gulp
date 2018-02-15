'use strict';

import gulp from "gulp"
import clean from "gulp-clean"
import fs from "fs"
import config from "./config"
import {
    sass,
    import_assets,
    compile_html,
    inject_assets
} from './whb';
var browserSync = require('browser-sync').create();

var paths = {
    'scss':[
        config.src+'/module/**/assets/scss/*.scss',
        config.src+'/common/scss/*.scss',
        config.src+'/module/**/assets/scss/**/*.scss',
    ],
    'html':[
        config.src+'/module/**/html/*.html',
        config.src+'/module/**/include/*.html',
        config.src+'/module/**/section/**/*.html'
    ],
    'js':[
        config.src+'/module/**/assets/js/*.js',
        config.src+'/common/js/*.js',
    ],
}

gulp.task('default',['compile','server'],()=>{});

/**
 * 编译文件
 */
gulp.task('compile',()=>{
    config.modules.forEach((module)=>{
        if(!fs.existsSync('./'+config.src+'/module/'+module.name)){
            gulp.src('./template/**/*.*')
                .pipe(gulp.dest('./'+config.src+'/module/'+module.name+'/'));
        }
        if(module.check) {
            setTimeout(()=>{
                sass(module).then(import_assets(module)).then(compile_html(module))
            },300)
        }
    });
});

/**
 * 清除生成目录
 */
gulp.task('clean', () => {
    gulp.src(config.dist+'/*', {read: false}).pipe(clean());
})

/**
 * 编译sass
 */
gulp.task('sass', ()=>{
    console.log('开始编译css')
    config.modules.forEach((module)=>{
        if(module.check){
            sass(module)
        }
    });
    console.log('css编译完成')
});

/**
 * 导入静态资源
 */
gulp.task('import_assets', ()=>{
    config.modules.forEach((module)=>{
        if(module.check){
            import_assets(module)
        }
    });
});


/**
 * 编译HTML
 */
gulp.task('compile_html', ()=> {
    config.modules.forEach((module)=>{
        if(module.check) {
            compile_html(module)
        }
    });
});

/**
 * 浏览器运行
 */
gulp.task('server', () => {
    browserSync.init({
        files:['**'],
        server: {
            baseDir: './'+config.dist+'/module',
            index: 'index.html',
            directory: true
        },
        open: 'external',
        injectChanges: true
    });
    gulp.watch(paths.scss,['sass']);
    gulp.watch(paths.html,['compile_html']);
    gulp.watch(paths.js,['import_assets']);
})

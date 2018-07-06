// 载入外挂
var gulp = require('gulp'),
    path = require('path'),
    sass = require('gulp-ruby-sass'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean'),
    minimist = require('minimist')
    concat = require('gulp-concat'),
    proxyConfig = require('./proxy.config'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    filter = require('gulp-filter'),
    rev = require('gulp-rev'), //添加版本号
    revCollector = require('gulp-rev-collector'), //添加版本号
    autoprefixer = require('gulp-autoprefixer'); //自动处理前缀
    var htmlmin = require('gulp-htmlmin');
    var gulpIf = require('gulp-if');
    var ejs = require('gulp-ejs');
var plumber = require('gulp-plumber');
var base64 = require('gulp-base64');
var babel = require("gulp-babel");
console.log(plumber)
var BUILD_DIR = {
    src: "src/",
    debug: "debug/",
    dist: "dist/"
};
var mod = 'all';  //默认为全部
var BUILD_DIST = BUILD_DIR.dist; //默认打包到dist
var options = minimist(process.argv.slice(2));
var env = true; // 生产环境为true，开发环境为false，默认为true

var custom = 'standard'; // 平台标准版
var custom_dist = 'www'; // 平台生产目录
var custom_base = 'standard'; // 定制版基于版本
var public_arr = ['base', 'lib', 'public']; // 公共文件，添加版本号需要用到


var projectObj = {
  "JCenter": "JCenterHome",
  "teacher": "teacherStudio",
  "platform": "platform",
  "activity": "activity",
  "wisdomCampus": "wisdomCampus"
};

var optM = options['m'], // 模块参数
    optD = options['d'], // 环境参数
    optC = options['c'], // 定制化参数
    optCM = options['cm'], // 定制化功能模块
    optCMD = options['_'][0]; // 命令参数 build/watch

    mod = optM;

    if (optD) {
      env = false;
      BUILD_DIST = BUILD_DIR.debug;
    }
    if (typeof optC === 'string') {
      custom = optC;
    }

var exclude = filter(['**/*', '!**/service.js'], {restore: true});
var platform_customModule = path.join('!' + BUILD_DIR.src, 'platform', 'standard/customModule/**/*');
if (optCMD === 'watch' || !env) platform_customModule = '';
if (typeof optCM === 'string') {
  if (optCM === 'all') {
    platform_customModule = '';
  }
}
// 样式
/*gulp.task('styles', function() {
    return sass('src/styles/ss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }))
        .pipe(connect.reload());
});*/
gulp.task('styles', function () {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass({ style: 'expanded' }).on("error", sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }))
        
});

// 脚本
gulp.task('scripts', function() {
    return gulp.src('src/lib/**/*.js')
        // .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        //.pipe(concat('main.js'))
        .pipe(gulp.dest('dist/lib'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib'))
        .pipe(notify({ message: 'Scripts task complete' }))
        .pipe(connect.reload());
});

// 图片
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }))
        .pipe(connect.reload())
});


// 清理
/*gulp.task('clean', function() {
    return gulp.src([ 'dist/scripts', 'dist/images', 'dist/styles'], {read: false})
        .pipe(clean());
});*/
gulp.task('clean', function () {
  return gulp.src(BUILD_DIST)
    .pipe(clean({force: true}));
});

gulp.task('lib',creatTask, function () {
    console.log(creatTask);
  return gulp.src(path.join(BUILD_DIR.src, "lib/**/*"))
    .pipe(rev())
    .pipe(gulp.dest(path.join(BUILD_DIST, "lib")))
    .pipe(rev.manifest())
    .pipe(gulp.dest(path.join(BUILD_DIST, 'rev/lib')));
});
gulp.task('copyConfig', function () {
  return gulp.src(path.join(BUILD_DIR.src, "config/**/*"))
    .pipe(rev())
    .pipe(gulp.dest(path.join(BUILD_DIST, "config")))
    .pipe(rev.manifest())
    .pipe(gulp.dest(path.join(BUILD_DIST, 'rev/config')));
});

gulp.task('copyBase', function () {
  return gulp.src(path.join(BUILD_DIR.src, "base/**/*"))
    .pipe(rev())
    .pipe(gulp.dest(path.join(BUILD_DIST, "base")))
    .pipe(rev.manifest())
    .pipe(gulp.dest(path.join(BUILD_DIST, 'rev/base')));
});

// 预设任务
gulp.task('build', optCMD === 'watch' ? [] : ['clean'], function() {
    if (mod && mod !== 'all') runTask(projectObj[mod]);
    else runTask(objToArr(projectObj));
    //gulp.start( 'scripts', 'images', 'styles', 'connect');
});

function objToArr(obj) {
  var arr = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) arr.push(obj[key]);
  }
  return arr;
}

//开启服务，
gulp.task('connect',function(){
    connect.server({
        root:"dist",
        livereload:true,
        middleware: function (connect, opt) {
            return proxyConfig;
        }
    })
})
// 看守
gulp.task('watch', function() {

    // 看守所有.scss档
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // 看守所有.js档
    gulp.watch('src/lib/**/*.js', ['scripts']);

    // 看守所有图片档
    gulp.watch('src/images/**/*', ['images']);

});

//用来存放任务
var creatTask = [];

function runTask(fileName){
    console.log(fileName)
    typeof(fileName) =="string" ? fileName = [fileName] : '';
    /*fileName.unshift('base');
    fileName.unshift('config');*/
    fileName.unshift('public');
    for (var i = 0; i < fileName.length; i++) {
        creatImagesTask(fileName[i]);
        creatHtmlTask(fileName[i]);
        createSassTask(fileName[i]);
        creatCssTask(fileName[i]);
        creatScriptTask(fileName[i]);
        console.log('first-look!!!!!');
        console.log(creatTask);
    }

    if (optCMD === 'watch') {
        fileName.forEach(function (name) {
            watchSass(name);
            watchHtml(name);
            if (standard_arr.indexOf(name) < 0) watchCss(name);
            watchScript(name);
            watchImages(name);
            watchLib();
        });
    }  else if(optCMD == 'build'){
        addRev(fileName);
    }
}

function creatHtmlTask(name) {
  creatTask.push(name + 'html');
    console.log("---:"+ name + 'html')
  gulp.task(name + 'html', function () {

    var src = [
      path.join(BUILD_DIR.src, name, custom_base, '**/*.{ejs,html}'),
      path.join(BUILD_DIR.src, name, custom, '**/*.{ejs,html}'),
      path.join('!' + BUILD_DIR.src, name, '**/_*.ejs')
    ];
    platform_customModule && src.push(platform_customModule);
    var dest = path.join(BUILD_DIST, name, name === 'public' ? '' : custom_dist);
    console.log(src);
    return gulp.src(src)
      .pipe(plumber())
      .pipe(ejs())
      .pipe(rename(function (path) {
        path.extname = ".html"
      }))
      .pipe(gulpIf(env, htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest(dest))
      .pipe(connect.reload());
  });
};

function creatCssTask(name) {
  creatTask.push(name + 'css');
  gulp.task(name + 'css', [name + 'sass'], function () {
    var src = path.join(BUILD_DIST, name, name === 'public' ? '' : custom_dist, '**/*.css');
    var dest = path.join(BUILD_DIST, name, name === 'public' ? '' : custom_dist);
    var revUrl = path.join(BUILD_DIST, 'rev', name, 'css');
    return gulp.src(src)
      .pipe(gulpIf(env, minifycss({processImport: false})))
      .pipe(rev())
      .pipe(gulp.dest(path.join(dest)))
      .pipe(rev.manifest())
      .pipe(gulp.dest(revUrl))
      .pipe(connect.reload());
  });
}

function creatScriptTask(name) {
  creatTask.push(name + 'script');
  gulp.task(name + 'script', function () {
    var src = [
      path.join(BUILD_DIR.src, name, custom_base, '**/*.js'),
      path.join(BUILD_DIR.src, name, custom, '**/*.js')
    ];
    platform_customModule && src.push(platform_customModule);
    var dest = path.join(BUILD_DIST, name, name === 'public' ? '' : custom_dist);
    var revUrl = path.join(BUILD_DIST, 'rev', name, 'js');
    return gulp.src(src)
      .pipe(gulpIf(!env, sourcemaps.init()))
      .pipe(plumber())
      .pipe(gulpIf(name === 'base', exclude))
      .pipe(babel({presets: ['env','es2015']}))
      .pipe(gulpIf(env, uglify()))
      .pipe(gulpIf(name === 'base', exclude.restore))
      .pipe(rev())
      .pipe(gulpIf(!env, sourcemaps.write()))
      .pipe(gulp.dest(dest))
      .pipe(rev.manifest())
      .pipe(gulp.dest(revUrl))
      .pipe(connect.reload());
  });
};

function creatImagesTask(name) {
  creatTask.push(name + 'images');
  gulp.task(name + 'images', function () {
    var src = [
      path.join(BUILD_DIR.src, name, custom_base, '**/images/**/*'),
      path.join(BUILD_DIR.src, name, custom, '**/images/**/*')
    ];
    platform_customModule && src.push(platform_customModule);
    var dest = path.join(BUILD_DIST, name, name === 'public' ? '' : custom_dist);
    var revUrl = path.join(BUILD_DIST, 'rev', name, 'images');
    return gulp.src(src)
      .pipe(rev())
      .pipe(gulp.dest(dest))
      .pipe(rev.manifest())
      .pipe(gulp.dest(revUrl))
      .pipe(connect.reload());
  });
};
function createSassTask(name) {
  creatTask.push(name + 'sass');
  gulp.task(name + 'sass', function () {
    var src = [
      path.join(BUILD_DIR.src, name, custom_base, '**/*.{scss,css}'),
      path.join(BUILD_DIR.src, name, custom, '**/*.{scss,css}'),
      path.join('!' + BUILD_DIR.src, name, '**/_*.scss'),
    ];
    platform_customModule && src.push(platform_customModule);
    var dest = path.join(BUILD_DIST, name, name === 'public' ? '' : custom_dist);
    return gulp.src(src)
      .pipe(gulpIf(!env, sourcemaps.init()))
      .pipe(plumber())
      .pipe(sass({outputStyle: env ? 'compressed' : 'expanded'}).on('error', sass.logError))
      .pipe(gulpIf(!env, sourcemaps.write()))
      //添加前缀
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename(function (path) {
        path.dirname = path.dirname.replace('sass', 'css');
      }))
      .pipe(gulp.dest(dest))
      .pipe(connect.reload());
  });
}

// 说明
gulp.task('help', function () {

  console.log(' gulp build    文件打包');

  console.log(' gulp help    gulp参数说明');

  console.log(' gulp build -r    生产环境（默认生产环境）');

  console.log(' gulp build -d    开发环境');

  console.log(' gulp build -m <standard>    部分模块打包（默认全部打包）<JCenter>：人人通 参考 projectObj.key');

  console.log(' gulp build -m platform -c <custom>    平台打包，定制版(默认标准版)');

  console.log(' gulp build -m platform --cm <customModule|all>    平台打包，定制化功能，默认不包含 customModule 下功能');

});

gulp.task("default", function () {
  gulp.start('help');
});

//添加版本号
//添加版本号
function addRev(nameArr) {
  var src = [];
  public_arr.forEach(function (item) {
    src.push(path.join(BUILD_DIST, 'rev', item, '**/*.json'));
  });
  nameArr.forEach(function (name) {
    src.push(path.join(BUILD_DIST, 'rev', name, '**/*.json'));
    var srcHtml = src.concat([path.join(BUILD_DIST, name, '**/*.html')]),
        srcCss = src.concat([path.join(BUILD_DIST, name, '**/*.css')]),
        srcJs = src.concat([path.join(BUILD_DIST, name, '**/*.js')]);
        creatTask.unshift('lib');
        creatTask.unshift('copyBase');
        creatTask.unshift('copyConfig')
    gulp.task(name + 'addrevhtml',creatTask, function () {
      return gulp.src(srcHtml)
        .pipe(revCollector())
        .pipe(gulp.dest(path.join(BUILD_DIST, name)));
    });
    gulp.task(name + 'addrevcss', [name + 'addrevhtml'], function () {
      return gulp.src(srcCss)
        .pipe(base64({
          extensions: ['svg', 'png', /\.jpg#datauri$/i],
          maxImageSize: 20 * 1024, // bytes
          debug: !env
        }))
        .pipe(revCollector())
        .pipe(gulp.dest(path.join(BUILD_DIST, name)));
    });
    gulp.task(name + 'addrevjs', [name + 'addrevcss'], function () {
      return gulp.src(srcJs)
        .pipe(revCollector())
        .pipe(gulp.dest(path.join(BUILD_DIST, name)));
    });
    gulp.start(name + 'addrevjs');
    //gulp.start('connect')
  });
}
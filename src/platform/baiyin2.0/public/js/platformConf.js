define(function () {
  return {
    paths: {
      // 相对目录为版本目录 standard|baiyin|baiyin2.0 www
      'jquery': '../../lib/jquery/jquery-1.9.1.js',
      'service': '../../base/js/service.js',
      'tools': '../../base/js/requiretools.js',
      'layer': '../../lib/layer/layer.js',
      'template': '../../lib/arTtemplate/template.js',
      'footer': '../../public/footer/js/logout.js',
      'header': '../../public/header/js/header.js',

      'jqueryUI': '../../lib/jquery/jquery-ui-1.10.3.min.js',
      'jqueryUIB': '../../lib/jquery/jquery-ui-1.11.0.min.js',
      'fullPage': '../../lib/jquery/jquery.fullPage.min.js',

      'tool': 'home/js/tools.js',
      'app': 'home/js/app.js',

      'banner': 'home/js/banner.js',
      'textScroll': 'home/js/textScroll.js',
      'scrollNav': 'home/js/scroll.js',
      'center': 'home/js/center.js',
      'main': 'home/js/main.js',
      'indexApp': 'home/js/indexApp.js',

      'page': '../../lib/component/pagingSimple/paging.js',

      "webuploader": "../../lib/component/upload/js/webuploader.js",
      'dialog': 'persCenter/js/appDialog.js',
      'ajaxhelper': 'persCenter/js/ajaxhelper.js',

      'orgConfig': '../../config/orgConfig.js',

      'tab': 'home/js/tab.js',
      'ajaxBanner': 'home/js/ajaxBanner.js',
      'secondNav': 'home/js/secondNav.js',
      'appVerify': '../../public/header/js/appVerify.js',
      'album': 'home/js/album.js',

      'NProgress': '../../lib/nprogress/nprogress.min.js',

      'echarts': '../../lib/echarts/echarts.min.js',
      'addFav': '../../public/header/js/addFav.js',

    },
    shim: {
      'jquery': {
        exports: 'jQuery'
      },
      'common': {
        deps: ['jquery']
      },
      'layer': {
        deps: ['jquery']
      },
      'fullPage': {
        deps: ['jquery']
      },
      'jqueryUI': {
        deps: ['jquery']
      },
      'jqueryUIB': {
        deps: ['jquery']
      },
      'tab': {
        deps: ['jquery']
      }
    }
  }
});
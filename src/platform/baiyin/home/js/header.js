require.config({
  baseUrl: '../../../',
  paths: {
    'jquery': 'lib/jquery/jquery-1.9.1.js',
    'NProgress': 'lib/nprogress/nprogress.min.js',
    'layer': 'lib/layer/layer.js',
  },
  shim: {
    'layer': {
      deps: ['jquery']
    }
  }
});
define(['jquery', 'NProgress', 'layer'], function ($, NProgress, layer) {
  $(document).ajaxStart(function () {
    NProgress.start();
  });
  $(document).ajaxComplete(function () {
    NProgress.done(true);
  });
  layer.msg('我是 baiyin 定制版的 home');

});

define(['jquery', 'NProgress', 'layer'], function ($, NProgress, layer) {
  $(document).ajaxStart(function () {
    NProgress.start();
  });
  $(document).ajaxComplete(function () {
    NProgress.done(true);
  });
  layer.msg('我是 baiyin 定制版的 home');

});
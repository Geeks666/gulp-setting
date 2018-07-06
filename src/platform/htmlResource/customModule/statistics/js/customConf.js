define(function () {
  return {
    paths: {
      // 相对目录为版本目录 standard|baiyin|baiyin2.0 www
      'jquery': '../../../lib/jquery/jquery-1.9.1.js',
      'service': '../../../base/js/service.js', // 接口的前缀
      'common': 'statistics/js/common.js',
      'select': 'statistics/js/select.js',
      'page': '../../../lib/component/pagingSimple/paging.js',
      'paging': '../../../lib/component/pagingSimple/paging.js',
      'echarts': '../../../lib/echarts/echarts.min.js',
      'tools': '../../../base/js/requiretools.js',
    },
    shim: {
      'paging': {
        degs: ['jquery']
      }
    }
  }
});
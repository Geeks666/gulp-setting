require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  define('',['jquery', 'template', 'layer', 'service', 'orgConfig', 'tools', 'footer', 'header'],
    function ($, template, layer, service, orgConfig, tools, footer, header) {

    });
})








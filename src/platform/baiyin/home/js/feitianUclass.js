require.config({
  paths: {
    'jquery': '../../../../lib/jquery/jquery-1.9.1.js',
    'template': '../../../../lib/arTtemplate/template.js',
    'layer': '../../../../lib/layer/layer.js',
    'service': '../../../../base/js/service.js',
    'orgConfig': '../../../../config/orgConfig.js',
    'tools': '../../../../base/js/requiretools.js',
    'footer': '../../../../public/footer/js/logout.js',
    'header': '../../../../public/header/js/header.js'
  },
  shim: {
    'layer': {
      deps: ['jquery']
    }
  }
});
define(['jquery' , 'template' , 'layer' , 'service' , 'orgConfig' , 'tools' ,'footer' , 'header' ],
    function ($ , template , layer , service , orgConfig , tools , footer , header ) {

    });




require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);

  define('',['jquery', 'fullPage', 'jqueryUIB', 'template', 'service', 'tool', 'layer', 'footer', 'header', 'app'],
    function ($, fullPage, jqueryUI, template, service, tools, layer, footer, header, app) {
      setMargin();
      $(window).resize(function (event) {
        setMargin();
      });

      function setMargin() {
        $('.button').each(function () {
          if ($(this).width() / 2 !== 0) {
            $(this).css('margin-left', '-' + $(this).width() / 2 + 'px');
          }
        });
      }

      $('.into-app').fadeOut(30);
      $('#fullpage').fullpage({
        slidesColor: ['#fafbfd', '#fafbfd'],
        anchors: ['page1', 'page2'],
        menu: '#menu',
        verticalCentered: false,
        afterRender: function (anchorLink, index) {
          setMargin();
        },
        afterLoad: function (anchorLink, index) {
          setMargin();
        },
        onSlideLeave: function (anchorLink, index) {
          setMargin();
        },
        onLeave: function (anchorLink, index) {
          setMargin();
        }
      });

    }
  );
})

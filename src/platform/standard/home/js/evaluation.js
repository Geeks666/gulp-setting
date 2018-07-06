require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);

  define('',['jquery', 'fullPage', 'jqueryUIB', 'service', 'tool', 'layer', 'footer', 'header', 'app'],
    function ($, fullPage, jqueryUI, service, tools, layer, footer, header, app) {

      $(function () {
        //背景图定位
        $('.section-top').css('background-position', ($(window).width() - 1920) / 2 + 'px 0')
        $(window).resize(function (event) {
          var left = ($(window).width() - 1920) / 2;

          $('.section-top').css('background-position', left + 'px 0');
        });

        function contenShow(index) {
          $('.section' + index).find('.youke').fadeIn(500);
          $('.section' + index).find('.section-title').fadeIn(500);
          $('.section' + index).find('.into-app').fadeIn(500);
          $('.section' + index).find('ul').fadeIn(500);
        };

        function contenHide(index) {
          $('.section' + index).find('.youke').fadeOut(500);
          $('.section' + index).find('.section-title').fadeOut(500);
          $('.section' + index).find('.into-app').fadeOut(500);
          $('.section' + index).find('ul').fadeOut(500);
        };
        $('.into-app').fadeOut(30);
        $('#fullpage').fullpage({
          slidesColor: ['#fafbfd', '#fafbfd'],
          anchors: ['page1', 'page2'],
          menu: '#menu',
          verticalCentered: false,
          afterRender: function (anchorLink, index) {
            contenShow(1);
          },
          afterLoad: function (anchorLink, index) {
            if (index == 1) {
              contenShow(1);
              contenHide(2);
              $('.app-pics').fadeOut(500);
            } else if (index == 2) {
              contenShow(2);
              contenHide(1);
              $('.app-pics').fadeIn(500);
            }
          }
        });
      });
    }
  );
})


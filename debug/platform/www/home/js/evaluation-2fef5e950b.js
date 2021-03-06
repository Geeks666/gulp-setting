'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);

  define('', ['jquery', 'fullPage', 'jqueryUIB', 'service', 'tool', 'layer', 'footer', 'header', 'app'], function ($, fullPage, jqueryUI, service, tools, layer, footer, header, app) {

    $(function () {
      //背景图定位
      $('.section-top').css('background-position', ($(window).width() - 1920) / 2 + 'px 0');
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
        afterRender: function afterRender(anchorLink, index) {
          contenShow(1);
        },
        afterLoad: function afterLoad(anchorLink, index) {
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
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvZXZhbHVhdGlvbi5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiY29uZmlncGF0aHMiLCJkZWZpbmUiLCIkIiwiZnVsbFBhZ2UiLCJqcXVlcnlVSSIsInNlcnZpY2UiLCJ0b29scyIsImxheWVyIiwiZm9vdGVyIiwiaGVhZGVyIiwiYXBwIiwiY3NzIiwid2luZG93Iiwid2lkdGgiLCJyZXNpemUiLCJldmVudCIsImxlZnQiLCJjb250ZW5TaG93IiwiaW5kZXgiLCJmaW5kIiwiZmFkZUluIiwiY29udGVuSGlkZSIsImZhZGVPdXQiLCJmdWxscGFnZSIsInNsaWRlc0NvbG9yIiwiYW5jaG9ycyIsIm1lbnUiLCJ2ZXJ0aWNhbENlbnRlcmVkIiwiYWZ0ZXJSZW5kZXIiLCJhbmNob3JMaW5rIiwiYWZ0ZXJMb2FkIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxvQkFBZ0I7QUFEWDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLGNBQUQsQ0FBUixFQUEwQixVQUFVSSxXQUFWLEVBQXVCO0FBQy9DSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7O0FBRUFDLFNBQU8sRUFBUCxFQUFVLENBQUMsUUFBRCxFQUFXLFVBQVgsRUFBdUIsV0FBdkIsRUFBb0MsU0FBcEMsRUFBK0MsTUFBL0MsRUFBdUQsT0FBdkQsRUFBZ0UsUUFBaEUsRUFBMEUsUUFBMUUsRUFBb0YsS0FBcEYsQ0FBVixFQUNFLFVBQVVDLENBQVYsRUFBYUMsUUFBYixFQUF1QkMsUUFBdkIsRUFBaUNDLE9BQWpDLEVBQTBDQyxLQUExQyxFQUFpREMsS0FBakQsRUFBd0RDLE1BQXhELEVBQWdFQyxNQUFoRSxFQUF3RUMsR0FBeEUsRUFBNkU7O0FBRTNFUixNQUFFLFlBQVk7QUFDWjtBQUNBQSxRQUFFLGNBQUYsRUFBa0JTLEdBQWxCLENBQXNCLHFCQUF0QixFQUE2QyxDQUFDVCxFQUFFVSxNQUFGLEVBQVVDLEtBQVYsS0FBb0IsSUFBckIsSUFBNkIsQ0FBN0IsR0FBaUMsTUFBOUU7QUFDQVgsUUFBRVUsTUFBRixFQUFVRSxNQUFWLENBQWlCLFVBQVVDLEtBQVYsRUFBaUI7QUFDaEMsWUFBSUMsT0FBTyxDQUFDZCxFQUFFVSxNQUFGLEVBQVVDLEtBQVYsS0FBb0IsSUFBckIsSUFBNkIsQ0FBeEM7O0FBRUFYLFVBQUUsY0FBRixFQUFrQlMsR0FBbEIsQ0FBc0IscUJBQXRCLEVBQTZDSyxPQUFPLE1BQXBEO0FBQ0QsT0FKRDs7QUFNQSxlQUFTQyxVQUFULENBQW9CQyxLQUFwQixFQUEyQjtBQUN6QmhCLFVBQUUsYUFBYWdCLEtBQWYsRUFBc0JDLElBQXRCLENBQTJCLFFBQTNCLEVBQXFDQyxNQUFyQyxDQUE0QyxHQUE1QztBQUNBbEIsVUFBRSxhQUFhZ0IsS0FBZixFQUFzQkMsSUFBdEIsQ0FBMkIsZ0JBQTNCLEVBQTZDQyxNQUE3QyxDQUFvRCxHQUFwRDtBQUNBbEIsVUFBRSxhQUFhZ0IsS0FBZixFQUFzQkMsSUFBdEIsQ0FBMkIsV0FBM0IsRUFBd0NDLE1BQXhDLENBQStDLEdBQS9DO0FBQ0FsQixVQUFFLGFBQWFnQixLQUFmLEVBQXNCQyxJQUF0QixDQUEyQixJQUEzQixFQUFpQ0MsTUFBakMsQ0FBd0MsR0FBeEM7QUFDRDs7QUFFRCxlQUFTQyxVQUFULENBQW9CSCxLQUFwQixFQUEyQjtBQUN6QmhCLFVBQUUsYUFBYWdCLEtBQWYsRUFBc0JDLElBQXRCLENBQTJCLFFBQTNCLEVBQXFDRyxPQUFyQyxDQUE2QyxHQUE3QztBQUNBcEIsVUFBRSxhQUFhZ0IsS0FBZixFQUFzQkMsSUFBdEIsQ0FBMkIsZ0JBQTNCLEVBQTZDRyxPQUE3QyxDQUFxRCxHQUFyRDtBQUNBcEIsVUFBRSxhQUFhZ0IsS0FBZixFQUFzQkMsSUFBdEIsQ0FBMkIsV0FBM0IsRUFBd0NHLE9BQXhDLENBQWdELEdBQWhEO0FBQ0FwQixVQUFFLGFBQWFnQixLQUFmLEVBQXNCQyxJQUF0QixDQUEyQixJQUEzQixFQUFpQ0csT0FBakMsQ0FBeUMsR0FBekM7QUFDRDtBQUNEcEIsUUFBRSxXQUFGLEVBQWVvQixPQUFmLENBQXVCLEVBQXZCO0FBQ0FwQixRQUFFLFdBQUYsRUFBZXFCLFFBQWYsQ0FBd0I7QUFDdEJDLHFCQUFhLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FEUztBQUV0QkMsaUJBQVMsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUZhO0FBR3RCQyxjQUFNLE9BSGdCO0FBSXRCQywwQkFBa0IsS0FKSTtBQUt0QkMscUJBQWEscUJBQVVDLFVBQVYsRUFBc0JYLEtBQXRCLEVBQTZCO0FBQ3hDRCxxQkFBVyxDQUFYO0FBQ0QsU0FQcUI7QUFRdEJhLG1CQUFXLG1CQUFVRCxVQUFWLEVBQXNCWCxLQUF0QixFQUE2QjtBQUN0QyxjQUFJQSxTQUFTLENBQWIsRUFBZ0I7QUFDZEQsdUJBQVcsQ0FBWDtBQUNBSSx1QkFBVyxDQUFYO0FBQ0FuQixjQUFFLFdBQUYsRUFBZW9CLE9BQWYsQ0FBdUIsR0FBdkI7QUFDRCxXQUpELE1BSU8sSUFBSUosU0FBUyxDQUFiLEVBQWdCO0FBQ3JCRCx1QkFBVyxDQUFYO0FBQ0FJLHVCQUFXLENBQVg7QUFDQW5CLGNBQUUsV0FBRixFQUFla0IsTUFBZixDQUFzQixHQUF0QjtBQUNEO0FBQ0Y7QUFsQnFCLE9BQXhCO0FBb0JELEtBM0NEO0FBNENELEdBL0NIO0FBaURELENBcEREIiwiZmlsZSI6ImhvbWUvanMvZXZhbHVhdGlvbi0yZmVmNWU5NTBiLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZS5jb25maWcoe1xyXG4gIGJhc2VVcmw6ICcuLi8nLFxyXG4gIHBhdGhzOiB7XHJcbiAgICAncGxhdGZvcm1Db25mJzogJ3B1YmxpYy9qcy9wbGF0Zm9ybUNvbmYuanMnXHJcbiAgfVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJyxbJ2pxdWVyeScsICdmdWxsUGFnZScsICdqcXVlcnlVSUInLCAnc2VydmljZScsICd0b29sJywgJ2xheWVyJywgJ2Zvb3RlcicsICdoZWFkZXInLCAnYXBwJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgZnVsbFBhZ2UsIGpxdWVyeVVJLCBzZXJ2aWNlLCB0b29scywgbGF5ZXIsIGZvb3RlciwgaGVhZGVyLCBhcHApIHtcclxuXHJcbiAgICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8v6IOM5pmv5Zu+5a6a5L2NXHJcbiAgICAgICAgJCgnLnNlY3Rpb24tdG9wJykuY3NzKCdiYWNrZ3JvdW5kLXBvc2l0aW9uJywgKCQod2luZG93KS53aWR0aCgpIC0gMTkyMCkgLyAyICsgJ3B4IDAnKVxyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICB2YXIgbGVmdCA9ICgkKHdpbmRvdykud2lkdGgoKSAtIDE5MjApIC8gMjtcclxuXHJcbiAgICAgICAgICAkKCcuc2VjdGlvbi10b3AnKS5jc3MoJ2JhY2tncm91bmQtcG9zaXRpb24nLCBsZWZ0ICsgJ3B4IDAnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY29udGVuU2hvdyhpbmRleCkge1xyXG4gICAgICAgICAgJCgnLnNlY3Rpb24nICsgaW5kZXgpLmZpbmQoJy55b3VrZScpLmZhZGVJbig1MDApO1xyXG4gICAgICAgICAgJCgnLnNlY3Rpb24nICsgaW5kZXgpLmZpbmQoJy5zZWN0aW9uLXRpdGxlJykuZmFkZUluKDUwMCk7XHJcbiAgICAgICAgICAkKCcuc2VjdGlvbicgKyBpbmRleCkuZmluZCgnLmludG8tYXBwJykuZmFkZUluKDUwMCk7XHJcbiAgICAgICAgICAkKCcuc2VjdGlvbicgKyBpbmRleCkuZmluZCgndWwnKS5mYWRlSW4oNTAwKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjb250ZW5IaWRlKGluZGV4KSB7XHJcbiAgICAgICAgICAkKCcuc2VjdGlvbicgKyBpbmRleCkuZmluZCgnLnlvdWtlJykuZmFkZU91dCg1MDApO1xyXG4gICAgICAgICAgJCgnLnNlY3Rpb24nICsgaW5kZXgpLmZpbmQoJy5zZWN0aW9uLXRpdGxlJykuZmFkZU91dCg1MDApO1xyXG4gICAgICAgICAgJCgnLnNlY3Rpb24nICsgaW5kZXgpLmZpbmQoJy5pbnRvLWFwcCcpLmZhZGVPdXQoNTAwKTtcclxuICAgICAgICAgICQoJy5zZWN0aW9uJyArIGluZGV4KS5maW5kKCd1bCcpLmZhZGVPdXQoNTAwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICQoJy5pbnRvLWFwcCcpLmZhZGVPdXQoMzApO1xyXG4gICAgICAgICQoJyNmdWxscGFnZScpLmZ1bGxwYWdlKHtcclxuICAgICAgICAgIHNsaWRlc0NvbG9yOiBbJyNmYWZiZmQnLCAnI2ZhZmJmZCddLFxyXG4gICAgICAgICAgYW5jaG9yczogWydwYWdlMScsICdwYWdlMiddLFxyXG4gICAgICAgICAgbWVudTogJyNtZW51JyxcclxuICAgICAgICAgIHZlcnRpY2FsQ2VudGVyZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgYWZ0ZXJSZW5kZXI6IGZ1bmN0aW9uIChhbmNob3JMaW5rLCBpbmRleCkge1xyXG4gICAgICAgICAgICBjb250ZW5TaG93KDEpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFmdGVyTG9hZDogZnVuY3Rpb24gKGFuY2hvckxpbmssIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgY29udGVuU2hvdygxKTtcclxuICAgICAgICAgICAgICBjb250ZW5IaWRlKDIpO1xyXG4gICAgICAgICAgICAgICQoJy5hcHAtcGljcycpLmZhZGVPdXQoNTAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PSAyKSB7XHJcbiAgICAgICAgICAgICAgY29udGVuU2hvdygyKTtcclxuICAgICAgICAgICAgICBjb250ZW5IaWRlKDEpO1xyXG4gICAgICAgICAgICAgICQoJy5hcHAtcGljcycpLmZhZGVJbig1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICk7XHJcbn0pXHJcblxyXG4iXX0=

'use strict';

define(['jquery', 'layer'], function ($, layer) {

  $('body').delegate('.nav .favorite_button', 'click', function () {
    addFavorite();
  });
  function addFavorite() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
      alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    } else if (ua.indexOf("msie 8") > -1) {
      window.external.AddToFavoritesBar(url, title); //IE8
    } else if (document.all) {
      try {
        window.external.addFavorite(url, title);
      } catch (e) {
        alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
      }
    } else if (window.sidebar) {
      window.sidebar.addPanel(title, url, "");
    } else {
      alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
  };
  var wrap = $('.notice_list');
  var interval = 3000;
  var moving; //定时器执行的函数
  wrap.hover(function () {
    clearInterval(moving);
  }, function () {
    moving = setInterval(function () {
      var field = wrap.find('li:first');
      var h = field.height();
      field.animate({ marginTop: -h + 'px' }, 600, function () {
        field.css('marginTop', 0).appendTo(wrap);
      });
    }, interval);
  }).trigger('mouseleave');
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvY29tbW9uLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsIiQiLCJsYXllciIsImRlbGVnYXRlIiwiYWRkRmF2b3JpdGUiLCJ1cmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInRpdGxlIiwiZG9jdW1lbnQiLCJ1YSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImFsZXJ0IiwiZXh0ZXJuYWwiLCJBZGRUb0Zhdm9yaXRlc0JhciIsImFsbCIsImUiLCJzaWRlYmFyIiwiYWRkUGFuZWwiLCJ3cmFwIiwiaW50ZXJ2YWwiLCJtb3ZpbmciLCJob3ZlciIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImZpZWxkIiwiZmluZCIsImgiLCJoZWlnaHQiLCJhbmltYXRlIiwibWFyZ2luVG9wIiwiY3NzIiwiYXBwZW5kVG8iLCJ0cmlnZ2VyIl0sIm1hcHBpbmdzIjoiOztBQUNBQSxPQUFPLENBQUMsUUFBRCxFQUFZLE9BQVosQ0FBUCxFQUE4QixVQUFVQyxDQUFWLEVBQWNDLEtBQWQsRUFBc0I7O0FBRWxERCxJQUFFLE1BQUYsRUFBVUUsUUFBVixDQUFtQix1QkFBbkIsRUFBNkMsT0FBN0MsRUFBdUQsWUFBWTtBQUNqRUM7QUFDRCxHQUZEO0FBR0EsV0FBU0EsV0FBVCxHQUF1QjtBQUNyQixRQUFJQyxNQUFNQyxPQUFPQyxRQUFqQjtBQUNBLFFBQUlDLFFBQVFDLFNBQVNELEtBQXJCO0FBQ0EsUUFBSUUsS0FBS0MsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsRUFBVDtBQUNBLFFBQUlILEdBQUdJLE9BQUgsQ0FBVyxPQUFYLElBQXNCLENBQUMsQ0FBM0IsRUFBOEI7QUFDNUJDLFlBQU0sOEJBQU47QUFDRCxLQUZELE1BR0ssSUFBSUwsR0FBR0ksT0FBSCxDQUFXLFFBQVgsSUFBdUIsQ0FBQyxDQUE1QixFQUErQjtBQUNsQ1IsYUFBT1UsUUFBUCxDQUFnQkMsaUJBQWhCLENBQWtDWixHQUFsQyxFQUF1Q0csS0FBdkMsRUFEa0MsQ0FDYTtBQUNoRCxLQUZJLE1BR0EsSUFBSUMsU0FBU1MsR0FBYixFQUFrQjtBQUNyQixVQUFHO0FBQ0RaLGVBQU9VLFFBQVAsQ0FBZ0JaLFdBQWhCLENBQTRCQyxHQUE1QixFQUFpQ0csS0FBakM7QUFDRCxPQUZELENBRUMsT0FBTVcsQ0FBTixFQUFRO0FBQ1BKLGNBQU0sMEJBQU47QUFDRDtBQUNGLEtBTkksTUFPQSxJQUFJVCxPQUFPYyxPQUFYLEVBQW9CO0FBQ3ZCZCxhQUFPYyxPQUFQLENBQWVDLFFBQWYsQ0FBd0JiLEtBQXhCLEVBQStCSCxHQUEvQixFQUFvQyxFQUFwQztBQUNELEtBRkksTUFHQTtBQUNIVSxZQUFNLDBCQUFOO0FBQ0Q7QUFDRjtBQUNELE1BQUlPLE9BQUtyQixFQUFFLGNBQUYsQ0FBVDtBQUNBLE1BQUlzQixXQUFTLElBQWI7QUFDQSxNQUFJQyxNQUFKLENBL0JrRCxDQStCdkM7QUFDWEYsT0FBS0csS0FBTCxDQUFXLFlBQVU7QUFDbkJDLGtCQUFjRixNQUFkO0FBQ0QsR0FGRCxFQUVFLFlBQVU7QUFDVkEsYUFBT0csWUFBWSxZQUFVO0FBQzNCLFVBQUlDLFFBQU1OLEtBQUtPLElBQUwsQ0FBVSxVQUFWLENBQVY7QUFDQSxVQUFJQyxJQUFFRixNQUFNRyxNQUFOLEVBQU47QUFDQUgsWUFBTUksT0FBTixDQUFjLEVBQUNDLFdBQVUsQ0FBQ0gsQ0FBRCxHQUFHLElBQWQsRUFBZCxFQUFrQyxHQUFsQyxFQUFzQyxZQUFVO0FBQzlDRixjQUFNTSxHQUFOLENBQVUsV0FBVixFQUFzQixDQUF0QixFQUF5QkMsUUFBekIsQ0FBa0NiLElBQWxDO0FBQ0QsT0FGRDtBQUdELEtBTk0sRUFNTEMsUUFOSyxDQUFQO0FBT0QsR0FWRCxFQVVHYSxPQVZILENBVVcsWUFWWDtBQVlELENBNUNEIiwiZmlsZSI6ImhvbWUvanMvY29tbW9uLTlkNTY0NzI1ZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZGVmaW5lKFsnanF1ZXJ5JyAsICdsYXllcicgXSwgZnVuY3Rpb24gKCQgLCBsYXllciApIHtcclxuXHJcbiAgJCgnYm9keScpLmRlbGVnYXRlKCcubmF2IC5mYXZvcml0ZV9idXR0b24nICwgJ2NsaWNrJyAsIGZ1bmN0aW9uICgpIHtcclxuICAgIGFkZEZhdm9yaXRlKCk7XHJcbiAgfSk7XHJcbiAgZnVuY3Rpb24gYWRkRmF2b3JpdGUoKSB7XHJcbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uO1xyXG4gICAgdmFyIHRpdGxlID0gZG9jdW1lbnQudGl0bGU7XHJcbiAgICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgICBpZiAodWEuaW5kZXhPZihcIjM2MHNlXCIpID4gLTEpIHtcclxuICAgICAgYWxlcnQoXCLnlLHkuo4zNjDmtY/op4jlmajlip/og73pmZDliLbvvIzor7fmjIkgQ3RybCtEIOaJi+WKqOaUtuiXj++8gVwiKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHVhLmluZGV4T2YoXCJtc2llIDhcIikgPiAtMSkge1xyXG4gICAgICB3aW5kb3cuZXh0ZXJuYWwuQWRkVG9GYXZvcml0ZXNCYXIodXJsLCB0aXRsZSk7IC8vSUU4XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChkb2N1bWVudC5hbGwpIHtcclxuICAgICAgdHJ5e1xyXG4gICAgICAgIHdpbmRvdy5leHRlcm5hbC5hZGRGYXZvcml0ZSh1cmwsIHRpdGxlKTtcclxuICAgICAgfWNhdGNoKGUpe1xyXG4gICAgICAgIGFsZXJ0KCfmgqjnmoTmtY/op4jlmajkuI3mlK/mjIEs6K+35oyJIEN0cmwrRCDmiYvliqjmlLbol48hJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHdpbmRvdy5zaWRlYmFyKSB7XHJcbiAgICAgIHdpbmRvdy5zaWRlYmFyLmFkZFBhbmVsKHRpdGxlLCB1cmwsIFwiXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGFsZXJ0KCfmgqjnmoTmtY/op4jlmajkuI3mlK/mjIEs6K+35oyJIEN0cmwrRCDmiYvliqjmlLbol48hJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuICB2YXIgd3JhcD0kKCcubm90aWNlX2xpc3QnKTtcclxuICB2YXIgaW50ZXJ2YWw9MzAwMDtcclxuICB2YXIgbW92aW5nOy8v5a6a5pe25Zmo5omn6KGM55qE5Ye95pWwXHJcbiAgd3JhcC5ob3ZlcihmdW5jdGlvbigpe1xyXG4gICAgY2xlYXJJbnRlcnZhbChtb3ZpbmcpO1xyXG4gIH0sZnVuY3Rpb24oKXtcclxuICAgIG1vdmluZz1zZXRJbnRlcnZhbChmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgZmllbGQ9d3JhcC5maW5kKCdsaTpmaXJzdCcpO1xyXG4gICAgICB2YXIgaD1maWVsZC5oZWlnaHQoKTtcclxuICAgICAgZmllbGQuYW5pbWF0ZSh7bWFyZ2luVG9wOi1oKydweCd9LDYwMCxmdW5jdGlvbigpe1xyXG4gICAgICAgIGZpZWxkLmNzcygnbWFyZ2luVG9wJywwKS5hcHBlbmRUbyh3cmFwKTtcclxuICAgICAgfSlcclxuICAgIH0saW50ZXJ2YWwpXHJcbiAgfSkudHJpZ2dlcignbW91c2VsZWF2ZScpO1xyXG5cclxufSk7XHJcbiJdfQ==

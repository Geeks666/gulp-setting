'use strict';

define(['jquery', 'service', 'header'], function ($, service, header) {
  $(function () {
    //判断当前用户是否有权限进入该APP,
    $("body").delegate('#morebook', 'click', function () {
      if (header.getUser()) {
        verifyApp(service.appIds[$(this).attr('type')], '2');
      } else {
        layer.alert("请登录后操作。", { icon: 0 });
        return;
      }
    });
    /**
     *
     * @param appId
     * @param kindCode 1:客户端 2：浏览器
     */
    function verifyApp(appId, kindCode) {
      var w = window;
      if (kindCode == '2') {
        w = window.open('about:blank');
      }
      $.ajax({
        url: service.htmlHost + "/pf/api/app/verify",
        type: "get",
        data: { "appId": appId },
        success: function success(data) {
          if (data.code == "success") {
            w.location.href = data.data;
          } else if (data.code == "failed") {
            if (kindCode == '2') {
              w.close();
            }
            layer.alert(data.msg, { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("请求失败", { icon: 0 });
        }
      });
    };
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvaW5kZXhBcHAuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwiJCIsInNlcnZpY2UiLCJoZWFkZXIiLCJkZWxlZ2F0ZSIsImdldFVzZXIiLCJ2ZXJpZnlBcHAiLCJhcHBJZHMiLCJhdHRyIiwibGF5ZXIiLCJhbGVydCIsImljb24iLCJhcHBJZCIsImtpbmRDb2RlIiwidyIsIndpbmRvdyIsIm9wZW4iLCJhamF4IiwidXJsIiwiaHRtbEhvc3QiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJjb2RlIiwibG9jYXRpb24iLCJocmVmIiwiY2xvc2UiLCJtc2ciLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBTyxDQUFDLFFBQUQsRUFBWSxTQUFaLEVBQXdCLFFBQXhCLENBQVAsRUFBMkMsVUFBV0MsQ0FBWCxFQUFlQyxPQUFmLEVBQXlCQyxNQUF6QixFQUFpQztBQUMxRUYsSUFBRSxZQUFVO0FBQ1Y7QUFDQUEsTUFBRSxNQUFGLEVBQVVHLFFBQVYsQ0FBbUIsV0FBbkIsRUFBaUMsT0FBakMsRUFBMkMsWUFBWTtBQUNyRCxVQUFJRCxPQUFPRSxPQUFQLEVBQUosRUFBc0I7QUFDcEJDLGtCQUFXSixRQUFRSyxNQUFSLENBQWVOLEVBQUUsSUFBRixFQUFRTyxJQUFSLENBQWEsTUFBYixDQUFmLENBQVgsRUFBa0QsR0FBbEQ7QUFDRCxPQUZELE1BRUs7QUFDSEMsY0FBTUMsS0FBTixDQUFZLFNBQVosRUFBdUIsRUFBQ0MsTUFBTSxDQUFQLEVBQXZCO0FBQ0E7QUFDRDtBQUNGLEtBUEQ7QUFRQTs7Ozs7QUFLQSxhQUFTTCxTQUFULENBQW9CTSxLQUFwQixFQUE0QkMsUUFBNUIsRUFBc0M7QUFDcEMsVUFBSUMsSUFBSUMsTUFBUjtBQUNBLFVBQUlGLFlBQVksR0FBaEIsRUFBb0I7QUFDbEJDLFlBQUlDLE9BQU9DLElBQVAsQ0FBWSxhQUFaLENBQUo7QUFDRDtBQUNEZixRQUFFZ0IsSUFBRixDQUFPO0FBQ0xDLGFBQU1oQixRQUFRaUIsUUFBUixHQUFtQixvQkFEcEI7QUFFTEMsY0FBTyxLQUZGO0FBR0xDLGNBQU8sRUFBQyxTQUFVVCxLQUFYLEVBSEY7QUFJTFUsaUJBQVEsaUJBQVNELElBQVQsRUFBYztBQUNwQixjQUFJQSxLQUFLRSxJQUFMLElBQWEsU0FBakIsRUFBNEI7QUFDMUJULGNBQUVVLFFBQUYsQ0FBV0MsSUFBWCxHQUFrQkosS0FBS0EsSUFBdkI7QUFDRCxXQUZELE1BRU0sSUFBSUEsS0FBS0UsSUFBTCxJQUFhLFFBQWpCLEVBQTJCO0FBQy9CLGdCQUFJVixZQUFZLEdBQWhCLEVBQW9CO0FBQ2xCQyxnQkFBRVksS0FBRjtBQUNEO0FBQ0RqQixrQkFBTUMsS0FBTixDQUFhVyxLQUFLTSxHQUFsQixFQUF3QixFQUFDaEIsTUFBTSxDQUFQLEVBQXhCO0FBQ0Q7QUFDRixTQWJJO0FBY0xpQixlQUFRLGVBQVdQLElBQVgsRUFBa0I7QUFDeEJaLGdCQUFNQyxLQUFOLENBQWEsTUFBYixFQUFzQixFQUFDQyxNQUFNLENBQVAsRUFBdEI7QUFDRDtBQWhCSSxPQUFQO0FBa0JEO0FBQ0YsR0F2Q0Q7QUF3Q0QsQ0F6Q0QiLCJmaWxlIjoiaG9tZS9qcy9pbmRleEFwcC0zZGY3YWZmY2UwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFsnanF1ZXJ5JyAsICdzZXJ2aWNlJyAsICdoZWFkZXInXSAsIGZ1bmN0aW9uICggJCAsIHNlcnZpY2UgLCBoZWFkZXIpIHtcclxuICAkKGZ1bmN0aW9uKCl7XHJcbiAgICAvL+WIpOaWreW9k+WJjeeUqOaIt+aYr+WQpuacieadg+mZkOi/m+WFpeivpUFQUCxcclxuICAgICQoXCJib2R5XCIpLmRlbGVnYXRlKCcjbW9yZWJvb2snICwgJ2NsaWNrJyAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYoIGhlYWRlci5nZXRVc2VyKCkgKXtcclxuICAgICAgICB2ZXJpZnlBcHAoIHNlcnZpY2UuYXBwSWRzWyQodGhpcykuYXR0cigndHlwZScpXSAsICcyJyApO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuaTjeS9nOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYXBwSWRcclxuICAgICAqIEBwYXJhbSBraW5kQ29kZSAxOuWuouaIt+erryAy77ya5rWP6KeI5ZmoXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHZlcmlmeUFwcCggYXBwSWQgLCBraW5kQ29kZSApe1xyXG4gICAgICB2YXIgdyA9IHdpbmRvdztcclxuICAgICAgaWYoIGtpbmRDb2RlID09ICcyJyl7XHJcbiAgICAgICAgdyA9IHdpbmRvdy5vcGVuKCdhYm91dDpibGFuaycpXHJcbiAgICAgIH1cclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmwgOiBzZXJ2aWNlLmh0bWxIb3N0ICsgXCIvcGYvYXBpL2FwcC92ZXJpZnlcIixcclxuICAgICAgICB0eXBlIDogXCJnZXRcIixcclxuICAgICAgICBkYXRhIDoge1wiYXBwSWRcIiA6IGFwcElkfSxcclxuICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgaWYoIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIiApe1xyXG4gICAgICAgICAgICB3LmxvY2F0aW9uLmhyZWYgPSBkYXRhLmRhdGE7XHJcbiAgICAgICAgICB9ZWxzZSBpZiggZGF0YS5jb2RlID09IFwiZmFpbGVkXCIgKXtcclxuICAgICAgICAgICAgaWYoIGtpbmRDb2RlID09ICcyJyl7XHJcbiAgICAgICAgICAgICAgdy5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KCBkYXRhLm1zZyAsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvciA6IGZ1bmN0aW9uICggZGF0YSApIHtcclxuICAgICAgICAgIGxheWVyLmFsZXJ0KCBcIuivt+axguWksei0pVwiICwge2ljb246IDB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9KVxyXG59KTtcclxuIl19
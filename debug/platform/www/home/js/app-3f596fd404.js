'use strict';

define(['jquery', 'jqueryUI', 'fullPage', 'service', 'tool', 'layer', 'header'], function ($, jqueryUI, fullPage, service, tools, layer, header) {

  $("body").delegate("#areaTeachResearch , #goTeach , #teachResearch , #jspj , #pingjiao", "click", function () {
    if (!header.getUser()) {
      layer.alert("请登录后操作。", { icon: 0 });
      return;
    }
    verifyApp(service.appIds[$(this).attr("type")], $(this).attr('kindCode'));
  });
  $('body').on('mousedown', '.downUrl', function () {
    if (!header.getUser()) {
      layer.alert("请登录后操作。", { icon: 0 });
      return;
    }
    verifyDownApp(service.appIds[$(this).attr("type")], $(this).attr('kindCode'));
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
  /**
   *
   * @param appId
   */
  function verifyDownApp(appId) {
    $.ajax({
      url: service.htmlHost + "/pf/api/app/verifyDown",
      type: "get",
      data: { "appId": appId },
      success: function success(data) {
        if (data.code == "success") {
          window.location.href = data.data;
        } else if (data.code == "failed") {
          layer.alert("您没有该权限下载。", { icon: 0 });
        }
      },
      error: function error(data) {
        layer.alert("请求失败。", { icon: 0 });
      }
    });
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvYXBwLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsIiQiLCJqcXVlcnlVSSIsImZ1bGxQYWdlIiwic2VydmljZSIsInRvb2xzIiwibGF5ZXIiLCJoZWFkZXIiLCJkZWxlZ2F0ZSIsImdldFVzZXIiLCJhbGVydCIsImljb24iLCJ2ZXJpZnlBcHAiLCJhcHBJZHMiLCJhdHRyIiwib24iLCJ2ZXJpZnlEb3duQXBwIiwiYXBwSWQiLCJraW5kQ29kZSIsInciLCJ3aW5kb3ciLCJvcGVuIiwiYWpheCIsInVybCIsImh0bWxIb3N0IiwidHlwZSIsImRhdGEiLCJzdWNjZXNzIiwiY29kZSIsImxvY2F0aW9uIiwiaHJlZiIsImNsb3NlIiwibXNnIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU8sQ0FBQyxRQUFELEVBQVcsVUFBWCxFQUF3QixVQUF4QixFQUFxQyxTQUFyQyxFQUFpRCxNQUFqRCxFQUEwRCxPQUExRCxFQUFvRSxRQUFwRSxDQUFQLEVBQ0UsVUFBV0MsQ0FBWCxFQUFlQyxRQUFmLEVBQTBCQyxRQUExQixFQUFxQ0MsT0FBckMsRUFBK0NDLEtBQS9DLEVBQXVEQyxLQUF2RCxFQUErREMsTUFBL0QsRUFBd0U7O0FBRXRFTixJQUFFLE1BQUYsRUFBVU8sUUFBVixDQUFtQixvRUFBbkIsRUFBMEYsT0FBMUYsRUFBb0csWUFBWTtBQUM5RyxRQUFHLENBQUNELE9BQU9FLE9BQVAsRUFBSixFQUFzQjtBQUNwQkgsWUFBTUksS0FBTixDQUFZLFNBQVosRUFBdUIsRUFBQ0MsTUFBTSxDQUFQLEVBQXZCO0FBQ0E7QUFDRDtBQUNEQyxjQUFXUixRQUFRUyxNQUFSLENBQWVaLEVBQUUsSUFBRixFQUFRYSxJQUFSLENBQWEsTUFBYixDQUFmLENBQVgsRUFBa0RiLEVBQUUsSUFBRixFQUFRYSxJQUFSLENBQWEsVUFBYixDQUFsRDtBQUNELEdBTkQ7QUFPQWIsSUFBRSxNQUFGLEVBQVVjLEVBQVYsQ0FBYSxXQUFiLEVBQXlCLFVBQXpCLEVBQW9DLFlBQVU7QUFDNUMsUUFBRyxDQUFDUixPQUFPRSxPQUFQLEVBQUosRUFBc0I7QUFDcEJILFlBQU1JLEtBQU4sQ0FBWSxTQUFaLEVBQXVCLEVBQUNDLE1BQU0sQ0FBUCxFQUF2QjtBQUNBO0FBQ0Q7QUFDREssa0JBQWVaLFFBQVFTLE1BQVIsQ0FBZVosRUFBRSxJQUFGLEVBQVFhLElBQVIsQ0FBYSxNQUFiLENBQWYsQ0FBZixFQUFzRGIsRUFBRSxJQUFGLEVBQVFhLElBQVIsQ0FBYSxVQUFiLENBQXREO0FBQ0QsR0FORDtBQU9BOzs7OztBQUtBLFdBQVNGLFNBQVQsQ0FBb0JLLEtBQXBCLEVBQTRCQyxRQUE1QixFQUFzQztBQUNwQyxRQUFJQyxJQUFJQyxNQUFSO0FBQ0EsUUFBSUYsWUFBWSxHQUFoQixFQUFvQjtBQUNsQkMsVUFBSUMsT0FBT0MsSUFBUCxDQUFZLGFBQVosQ0FBSjtBQUNEO0FBQ0RwQixNQUFFcUIsSUFBRixDQUFPO0FBQ0xDLFdBQU1uQixRQUFRb0IsUUFBUixHQUFtQixvQkFEcEI7QUFFTEMsWUFBTyxLQUZGO0FBR0xDLFlBQU8sRUFBQyxTQUFVVCxLQUFYLEVBSEY7QUFJTFUsZUFBUSxpQkFBU0QsSUFBVCxFQUFjO0FBQ3BCLFlBQUlBLEtBQUtFLElBQUwsSUFBYSxTQUFqQixFQUE0QjtBQUMxQlQsWUFBRVUsUUFBRixDQUFXQyxJQUFYLEdBQWtCSixLQUFLQSxJQUF2QjtBQUNELFNBRkQsTUFFTSxJQUFJQSxLQUFLRSxJQUFMLElBQWEsUUFBakIsRUFBMkI7QUFDL0IsY0FBSVYsWUFBWSxHQUFoQixFQUFvQjtBQUNsQkMsY0FBRVksS0FBRjtBQUNEO0FBQ0R6QixnQkFBTUksS0FBTixDQUFhZ0IsS0FBS00sR0FBbEIsRUFBd0IsRUFBQ3JCLE1BQU0sQ0FBUCxFQUF4QjtBQUNEO0FBQ0YsT0FiSTtBQWNMc0IsYUFBUSxlQUFXUCxJQUFYLEVBQWtCO0FBQ3hCcEIsY0FBTUksS0FBTixDQUFhLE1BQWIsRUFBc0IsRUFBQ0MsTUFBTSxDQUFQLEVBQXRCO0FBQ0Q7QUFoQkksS0FBUDtBQWtCRDtBQUNEOzs7O0FBSUEsV0FBU0ssYUFBVCxDQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0JoQixNQUFFcUIsSUFBRixDQUFPO0FBQ0xDLFdBQU1uQixRQUFRb0IsUUFBUixHQUFtQix3QkFEcEI7QUFFTEMsWUFBTyxLQUZGO0FBR0xDLFlBQU8sRUFBQyxTQUFVVCxLQUFYLEVBSEY7QUFJTFUsZUFBUSxpQkFBU0QsSUFBVCxFQUFjO0FBQ3BCLFlBQUlBLEtBQUtFLElBQUwsSUFBYSxTQUFqQixFQUE0QjtBQUMxQlIsaUJBQU9TLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCSixLQUFLQSxJQUE1QjtBQUNELFNBRkQsTUFFTSxJQUFJQSxLQUFLRSxJQUFMLElBQWEsUUFBakIsRUFBMkI7QUFDL0J0QixnQkFBTUksS0FBTixDQUFZLFdBQVosRUFBeUIsRUFBQ0MsTUFBTSxDQUFQLEVBQXpCO0FBQ0Q7QUFDRixPQVZJO0FBV0xzQixhQUFRLGVBQVdQLElBQVgsRUFBa0I7QUFDeEJwQixjQUFNSSxLQUFOLENBQVksT0FBWixFQUFxQixFQUFDQyxNQUFNLENBQVAsRUFBckI7QUFDRDtBQWJJLEtBQVA7QUFlRDtBQUNGLENBbkVIIiwiZmlsZSI6ImhvbWUvanMvYXBwLTNmNTk2ZmQ0MDQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoWydqcXVlcnknLCAnanF1ZXJ5VUknICwgJ2Z1bGxQYWdlJyAsICdzZXJ2aWNlJyAsICd0b29sJyAsICdsYXllcicgLCAnaGVhZGVyJyBdLFxyXG4gIGZ1bmN0aW9uICggJCAsIGpxdWVyeVVJICwgZnVsbFBhZ2UgLCBzZXJ2aWNlICwgdG9vbHMgLCBsYXllciAsIGhlYWRlciApIHtcclxuXHJcbiAgICAkKFwiYm9keVwiKS5kZWxlZ2F0ZShcIiNhcmVhVGVhY2hSZXNlYXJjaCAsICNnb1RlYWNoICwgI3RlYWNoUmVzZWFyY2ggLCAjanNwaiAsICNwaW5namlhb1wiICwgXCJjbGlja1wiICwgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZighaGVhZGVyLmdldFVzZXIoKSApe1xyXG4gICAgICAgIGxheWVyLmFsZXJ0KFwi6K+355m75b2V5ZCO5pON5L2c44CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZlcmlmeUFwcCggc2VydmljZS5hcHBJZHNbJCh0aGlzKS5hdHRyKFwidHlwZVwiKV0gLCAkKHRoaXMpLmF0dHIoJ2tpbmRDb2RlJykgKTtcclxuICAgIH0pO1xyXG4gICAgJCgnYm9keScpLm9uKCdtb3VzZWRvd24nLCcuZG93blVybCcsZnVuY3Rpb24oKXtcclxuICAgICAgaWYoIWhlYWRlci5nZXRVc2VyKCkgKXtcclxuICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuaTjeS9nOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB2ZXJpZnlEb3duQXBwKCBzZXJ2aWNlLmFwcElkc1skKHRoaXMpLmF0dHIoXCJ0eXBlXCIpXSAsICQodGhpcykuYXR0cigna2luZENvZGUnKSApO1xyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYXBwSWRcclxuICAgICAqIEBwYXJhbSBraW5kQ29kZSAxOuWuouaIt+erryAy77ya5rWP6KeI5ZmoXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHZlcmlmeUFwcCggYXBwSWQgLCBraW5kQ29kZSApe1xyXG4gICAgICB2YXIgdyA9IHdpbmRvdztcclxuICAgICAgaWYoIGtpbmRDb2RlID09ICcyJyl7XHJcbiAgICAgICAgdyA9IHdpbmRvdy5vcGVuKCdhYm91dDpibGFuaycpXHJcbiAgICAgIH1cclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmwgOiBzZXJ2aWNlLmh0bWxIb3N0ICsgXCIvcGYvYXBpL2FwcC92ZXJpZnlcIixcclxuICAgICAgICB0eXBlIDogXCJnZXRcIixcclxuICAgICAgICBkYXRhIDoge1wiYXBwSWRcIiA6IGFwcElkfSxcclxuICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgaWYoIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIiApe1xyXG4gICAgICAgICAgICB3LmxvY2F0aW9uLmhyZWYgPSBkYXRhLmRhdGE7XHJcbiAgICAgICAgICB9ZWxzZSBpZiggZGF0YS5jb2RlID09IFwiZmFpbGVkXCIgKXtcclxuICAgICAgICAgICAgaWYoIGtpbmRDb2RlID09ICcyJyl7XHJcbiAgICAgICAgICAgICAgdy5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KCBkYXRhLm1zZyAsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBlcnJvciA6IGZ1bmN0aW9uICggZGF0YSApIHtcclxuICAgICAgICAgIGxheWVyLmFsZXJ0KCBcIuivt+axguWksei0pVwiICwge2ljb246IDB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBhcHBJZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB2ZXJpZnlEb3duQXBwKCBhcHBJZCApe1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybCA6IHNlcnZpY2UuaHRtbEhvc3QgKyBcIi9wZi9hcGkvYXBwL3ZlcmlmeURvd25cIixcclxuICAgICAgICB0eXBlIDogXCJnZXRcIixcclxuICAgICAgICBkYXRhIDoge1wiYXBwSWRcIiA6IGFwcElkfSxcclxuICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgaWYoIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIiApe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgIH1lbHNlIGlmKCBkYXRhLmNvZGUgPT0gXCJmYWlsZWRcIiApe1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuaCqOayoeacieivpeadg+mZkOS4i+i9veOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3IgOiBmdW5jdGlvbiAoIGRhdGEgKSB7XHJcbiAgICAgICAgICBsYXllci5hbGVydChcIuivt+axguWksei0peOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH1cclxuKTtcclxuXHJcbiJdfQ==

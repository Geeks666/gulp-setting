'use strict';

define(['jquery'], function ($) {
  var wrap = $('.notice_list');
  var interval = 3000;
  var moving; //定时器执行的函数
  wrap.hover(function () {
    clearTimer();
  }, function () {
    setTimer();
  }).trigger('mouseleave');
  function clearTimer() {
    clearInterval(moving);
  }
  function setTimer() {
    moving = setInterval(function () {
      var field = wrap.find('li:first');
      var h = field.height();
      field.animate({ marginTop: -h + 'px' }, 600, function () {
        field.css('marginTop', 0).appendTo(wrap);
      });
    }, interval);
  }
  return {
    setTimer: setTimer,
    clearTimer: clearTimer
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvdGV4dFNjcm9sbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCIkIiwid3JhcCIsImludGVydmFsIiwibW92aW5nIiwiaG92ZXIiLCJjbGVhclRpbWVyIiwic2V0VGltZXIiLCJ0cmlnZ2VyIiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwiZmllbGQiLCJmaW5kIiwiaCIsImhlaWdodCIsImFuaW1hdGUiLCJtYXJnaW5Ub3AiLCJjc3MiLCJhcHBlbmRUbyJdLCJtYXBwaW5ncyI6Ijs7QUFDQUEsT0FBTyxDQUFDLFFBQUQsQ0FBUCxFQUNFLFVBQVdDLENBQVgsRUFBZTtBQUNYLE1BQUlDLE9BQUtELEVBQUUsY0FBRixDQUFUO0FBQ0EsTUFBSUUsV0FBUyxJQUFiO0FBQ0EsTUFBSUMsTUFBSixDQUhXLENBR0E7QUFDWEYsT0FBS0csS0FBTCxDQUFXLFlBQVU7QUFDbkJDO0FBQ0QsR0FGRCxFQUVFLFlBQVU7QUFDVkM7QUFDRCxHQUpELEVBSUdDLE9BSkgsQ0FJVyxZQUpYO0FBS0EsV0FBU0YsVUFBVCxHQUFxQjtBQUNuQkcsa0JBQWNMLE1BQWQ7QUFDRDtBQUNELFdBQVNHLFFBQVQsR0FBbUI7QUFDakJILGFBQU9NLFlBQVksWUFBVTtBQUMzQixVQUFJQyxRQUFNVCxLQUFLVSxJQUFMLENBQVUsVUFBVixDQUFWO0FBQ0EsVUFBSUMsSUFBRUYsTUFBTUcsTUFBTixFQUFOO0FBQ0FILFlBQU1JLE9BQU4sQ0FBYyxFQUFDQyxXQUFVLENBQUNILENBQUQsR0FBRyxJQUFkLEVBQWQsRUFBa0MsR0FBbEMsRUFBc0MsWUFBVTtBQUM5Q0YsY0FBTU0sR0FBTixDQUFVLFdBQVYsRUFBc0IsQ0FBdEIsRUFBeUJDLFFBQXpCLENBQWtDaEIsSUFBbEM7QUFDRCxPQUZEO0FBR0QsS0FOTSxFQU1MQyxRQU5LLENBQVA7QUFPRDtBQUNELFNBQU87QUFDTEksY0FBV0EsUUFETjtBQUVMRCxnQkFBYUE7QUFGUixHQUFQO0FBSUgsQ0ExQkgiLCJmaWxlIjoiaG9tZS9qcy90ZXh0U2Nyb2xsLTJhM2FmNTNkNjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZGVmaW5lKFsnanF1ZXJ5JyBdLFxyXG4gIGZ1bmN0aW9uICggJCApIHtcclxuICAgICAgdmFyIHdyYXA9JCgnLm5vdGljZV9saXN0Jyk7XHJcbiAgICAgIHZhciBpbnRlcnZhbD0zMDAwO1xyXG4gICAgICB2YXIgbW92aW5nOy8v5a6a5pe25Zmo5omn6KGM55qE5Ye95pWwXHJcbiAgICAgIHdyYXAuaG92ZXIoZnVuY3Rpb24oKXtcclxuICAgICAgICBjbGVhclRpbWVyKCk7XHJcbiAgICAgIH0sZnVuY3Rpb24oKXtcclxuICAgICAgICBzZXRUaW1lcigpO1xyXG4gICAgICB9KS50cmlnZ2VyKCdtb3VzZWxlYXZlJyk7XHJcbiAgICAgIGZ1bmN0aW9uIGNsZWFyVGltZXIoKXtcclxuICAgICAgICBjbGVhckludGVydmFsKG1vdmluZyk7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gc2V0VGltZXIoKXtcclxuICAgICAgICBtb3Zpbmc9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIHZhciBmaWVsZD13cmFwLmZpbmQoJ2xpOmZpcnN0Jyk7XHJcbiAgICAgICAgICB2YXIgaD1maWVsZC5oZWlnaHQoKTtcclxuICAgICAgICAgIGZpZWxkLmFuaW1hdGUoe21hcmdpblRvcDotaCsncHgnfSw2MDAsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgZmllbGQuY3NzKCdtYXJnaW5Ub3AnLDApLmFwcGVuZFRvKHdyYXApO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LGludGVydmFsKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgc2V0VGltZXIgOiBzZXRUaW1lcixcclxuICAgICAgICBjbGVhclRpbWVyIDogY2xlYXJUaW1lclxyXG4gICAgICB9XHJcbiAgfVxyXG4pOyJdfQ==

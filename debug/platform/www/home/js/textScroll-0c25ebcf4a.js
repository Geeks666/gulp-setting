'use strict';

define(['jquery'], function ($) {
  var wrap = $('.notice_list');
  var interval = 2000;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvdGV4dFNjcm9sbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCIkIiwid3JhcCIsImludGVydmFsIiwibW92aW5nIiwiaG92ZXIiLCJjbGVhclRpbWVyIiwic2V0VGltZXIiLCJ0cmlnZ2VyIiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwiZmllbGQiLCJmaW5kIiwiaCIsImhlaWdodCIsImFuaW1hdGUiLCJtYXJnaW5Ub3AiLCJjc3MiLCJhcHBlbmRUbyJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsT0FBTyxDQUFDLFFBQUQsQ0FBUCxFQUNFLFVBQVdDLENBQVgsRUFBZTtBQUNYLE1BQUlDLE9BQUtELEVBQUUsY0FBRixDQUFUO0FBQ0EsTUFBSUUsV0FBUyxJQUFiO0FBQ0EsTUFBSUMsTUFBSixDQUhXLENBR0E7QUFDWEYsT0FBS0csS0FBTCxDQUFXLFlBQVU7QUFDbkJDO0FBQ0QsR0FGRCxFQUVFLFlBQVU7QUFDVkM7QUFDRCxHQUpELEVBSUdDLE9BSkgsQ0FJVyxZQUpYO0FBS0EsV0FBU0YsVUFBVCxHQUFxQjtBQUNuQkcsa0JBQWNMLE1BQWQ7QUFDRDtBQUNELFdBQVNHLFFBQVQsR0FBbUI7QUFDakJILGFBQU9NLFlBQVksWUFBVTtBQUMzQixVQUFJQyxRQUFNVCxLQUFLVSxJQUFMLENBQVUsVUFBVixDQUFWO0FBQ0EsVUFBSUMsSUFBRUYsTUFBTUcsTUFBTixFQUFOO0FBQ0FILFlBQU1JLE9BQU4sQ0FBYyxFQUFDQyxXQUFVLENBQUNILENBQUQsR0FBRyxJQUFkLEVBQWQsRUFBa0MsR0FBbEMsRUFBc0MsWUFBVTtBQUM5Q0YsY0FBTU0sR0FBTixDQUFVLFdBQVYsRUFBc0IsQ0FBdEIsRUFBeUJDLFFBQXpCLENBQWtDaEIsSUFBbEM7QUFDRCxPQUZEO0FBR0QsS0FOTSxFQU1MQyxRQU5LLENBQVA7QUFPRDtBQUNELFNBQU87QUFDTEksY0FBV0EsUUFETjtBQUVMRCxnQkFBYUE7QUFGUixHQUFQO0FBSUgsQ0ExQkgiLCJmaWxlIjoiaG9tZS9qcy90ZXh0U2Nyb2xsLTBjMjVlYmNmNGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoWydqcXVlcnknIF0sXHJcbiAgZnVuY3Rpb24gKCAkICkge1xyXG4gICAgICB2YXIgd3JhcD0kKCcubm90aWNlX2xpc3QnKTtcclxuICAgICAgdmFyIGludGVydmFsPTIwMDA7XHJcbiAgICAgIHZhciBtb3Zpbmc7Ly/lrprml7blmajmiafooYznmoTlh73mlbBcclxuICAgICAgd3JhcC5ob3ZlcihmdW5jdGlvbigpe1xyXG4gICAgICAgIGNsZWFyVGltZXIoKTtcclxuICAgICAgfSxmdW5jdGlvbigpe1xyXG4gICAgICAgIHNldFRpbWVyKCk7XHJcbiAgICAgIH0pLnRyaWdnZXIoJ21vdXNlbGVhdmUnKTtcclxuICAgICAgZnVuY3Rpb24gY2xlYXJUaW1lcigpe1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwobW92aW5nKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBzZXRUaW1lcigpe1xyXG4gICAgICAgIG1vdmluZz1zZXRJbnRlcnZhbChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgdmFyIGZpZWxkPXdyYXAuZmluZCgnbGk6Zmlyc3QnKTtcclxuICAgICAgICAgIHZhciBoPWZpZWxkLmhlaWdodCgpO1xyXG4gICAgICAgICAgZmllbGQuYW5pbWF0ZSh7bWFyZ2luVG9wOi1oKydweCd9LDYwMCxmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBmaWVsZC5jc3MoJ21hcmdpblRvcCcsMCkuYXBwZW5kVG8od3JhcCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0saW50ZXJ2YWwpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzZXRUaW1lciA6IHNldFRpbWVyLFxyXG4gICAgICAgIGNsZWFyVGltZXIgOiBjbGVhclRpbWVyXHJcbiAgICAgIH1cclxuICB9XHJcbik7Il19

'use strict';

require.config({
  paths: {}
});

define([], function () {
  var doubleNum = function two(m) {
    if (m < 0) return m;
    if (m >= 10) {
      return m;
    } else {
      return '0' + m;
    }
  };
  var timeSet = function timeSet(timeStr) {
    if (!timeStr) {
      return '';
    }
    var time = new Date();
    var y = time.getFullYear();
    var m = doubleNum(time.getMonth() + 1);
    var d = time.getDate();
    if (timeStr.indexOf('-') == -1) {
      return format(timeStr);
    }
    if (timeStr.slice(0, 4) == y && timeStr.slice(5, 7) == m && timeStr.slice(8, 10) == doubleNum(d)) {
      return timeStr.slice(11, 16);
    } else {
      return timeStr.slice(0, 11);
    }
  };
  var format = function format(shijianchuo) {
    shijianchuo = Number(shijianchuo);
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var timeStr = y + '-' + doubleNum(m) + '-' + doubleNum(d) + ' ' + doubleNum(h) + ':' + doubleNum(mm) + ':' + doubleNum(s);
    return timeSet(timeStr);
  };
  function getUrlArgObject(query) {
    //获取url参数值
    var args = new Object();
    var pairs = query.split("&"); //在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('='); //查找name=value
      if (pos == -1) {
        //如果没有找到就跳过
        continue;
      }
      var argname = pairs[i].substring(0, pos); //提取name
      var value = pairs[i].substring(pos + 1); //提取value
      value = decodeURIComponent(value); //传过来的编码过得汉字进行解码;
      //args[argname]=unescape(value);//存为属性
      args[argname] = value; //存为属性
    }
    return args; //返回对象
  };

  /**
   * 超出字节显示省略号
   * @param str 要截取的字符串
   * @param Len 要截取的字节长度，注意是字节不是字符，一个汉字两个字节
   * @returns {*} 截取后的字符串
   */
  function hideTextByLen(str, Len) {
    var result = '',
        strlen = str.length,
        // 字符串长度
    chrlen = str.replace(/[^\x00-\xff]/g, '**').length; // 字节长度

    if (chrlen <= Len) {
      return str;
    }

    for (var i = 0, j = 0; i < strlen; i++) {
      var chr = str.charAt(i);
      if (/[\x00-\xff]/.test(chr)) {
        j++; // ascii码为0-255，一个字符就是一个字节的长度
      } else {
        j += 2; // ascii码为0-255以外，一个字符就是两个字节的长度
      }
      if (j < Len) {
        // 当加上当前字符以后，如果总字节长度小于等于L，则将当前字符真实的+在result后
        result += chr;
      } else {
        // 反之则说明result已经是不拆分字符的情况下最接近L的值了，直接返回
        return result + "...";
      }
    }
  }
  return window.tools = {
    //时间处理函数
    timeSet: timeSet,
    args: getUrlArgObject(window.location.search.substring(1)),
    hideTextByLen: hideTextByLen
    //: getHeadMes
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvanMvdG9vbHMuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsInBhdGhzIiwiZGVmaW5lIiwiZG91YmxlTnVtIiwidHdvIiwibSIsInRpbWVTZXQiLCJ0aW1lU3RyIiwidGltZSIsIkRhdGUiLCJ5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImQiLCJnZXREYXRlIiwiaW5kZXhPZiIsImZvcm1hdCIsInNsaWNlIiwic2hpamlhbmNodW8iLCJOdW1iZXIiLCJoIiwiZ2V0SG91cnMiLCJtbSIsImdldE1pbnV0ZXMiLCJzIiwiZ2V0U2Vjb25kcyIsImdldFVybEFyZ09iamVjdCIsInF1ZXJ5IiwiYXJncyIsIk9iamVjdCIsInBhaXJzIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwicG9zIiwiYXJnbmFtZSIsInN1YnN0cmluZyIsInZhbHVlIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiaGlkZVRleHRCeUxlbiIsInN0ciIsIkxlbiIsInJlc3VsdCIsInN0cmxlbiIsImNocmxlbiIsInJlcGxhY2UiLCJqIiwiY2hyIiwiY2hhckF0IiwidGVzdCIsIndpbmRvdyIsInRvb2xzIiwibG9jYXRpb24iLCJzZWFyY2giXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxTQUFPO0FBRE0sQ0FBZjs7QUFJQUMsT0FBTyxFQUFQLEVBQVUsWUFBWTtBQUNwQixNQUFJQyxZQUFZLFNBQVNDLEdBQVQsQ0FBYUMsQ0FBYixFQUFlO0FBQzdCLFFBQUlBLElBQUksQ0FBUixFQUFXLE9BQU9BLENBQVA7QUFDWCxRQUFJQSxLQUFLLEVBQVQsRUFBYTtBQUNYLGFBQU9BLENBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLE1BQU1BLENBQWI7QUFDRDtBQUNGLEdBUEQ7QUFRQSxNQUFJQyxVQUFVLFNBQVZBLE9BQVUsQ0FBVUMsT0FBVixFQUFtQjtBQUMvQixRQUFJLENBQUNBLE9BQUwsRUFBYztBQUNaLGFBQU8sRUFBUDtBQUNEO0FBQ0Qs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LFNBQVNILElBQUlQLE1BRGpCO0FBQUEsUUFDeUI7QUFDckJXLGFBQVNKLElBQUlLLE9BQUosQ0FBWSxlQUFaLEVBQTRCLElBQTVCLEVBQWtDWixNQUYvQyxDQUQ2QixDQUcwQjs7QUFFdkQsUUFBR1csVUFBUUgsR0FBWCxFQUFlO0FBQUMsYUFBT0QsR0FBUDtBQUFZOztBQUU1QixTQUFJLElBQUlSLElBQUUsQ0FBTixFQUFRYyxJQUFFLENBQWQsRUFBZ0JkLElBQUVXLE1BQWxCLEVBQXlCWCxHQUF6QixFQUE2QjtBQUMzQixVQUFJZSxNQUFNUCxJQUFJUSxNQUFKLENBQVdoQixDQUFYLENBQVY7QUFDQSxVQUFHLGNBQWNpQixJQUFkLENBQW1CRixHQUFuQixDQUFILEVBQTJCO0FBQ3pCRCxZQUR5QixDQUNwQjtBQUNOLE9BRkQsTUFFSztBQUNIQSxhQUFHLENBQUgsQ0FERyxDQUNHO0FBQ1A7QUFDRCxVQUFHQSxJQUFFTCxHQUFMLEVBQVM7QUFBRTtBQUNUQyxrQkFBVUssR0FBVjtBQUNELE9BRkQsTUFFSztBQUFFO0FBQ0wsZUFBT0wsU0FBTyxLQUFkO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsU0FBT1EsT0FBT0MsS0FBUCxHQUFlO0FBQ3BCO0FBQ0E3QyxhQUFVQSxPQUZVO0FBR3BCc0IsVUFBT0YsZ0JBQWlCd0IsT0FBT0UsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJqQixTQUF2QixDQUFpQyxDQUFqQyxDQUFqQixDQUhhO0FBSXBCRyxtQkFBZ0JBO0FBQ2Y7QUFMbUIsR0FBdEI7QUFPRCxDQTFGRCIsImZpbGUiOiJob21lL2pzL3Rvb2xzLTQ2ZTM0OGVmYzkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgcGF0aHM6IHt9XHJcbn0pO1xyXG5cclxuZGVmaW5lKFtdLGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZG91YmxlTnVtID0gZnVuY3Rpb24gdHdvKG0pe1xyXG4gICAgaWYgKG0gPCAwKSByZXR1cm4gbTtcclxuICAgIGlmIChtID49IDEwKSB7XHJcbiAgICAgIHJldHVybiBtO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICcwJyArIG07XHJcbiAgICB9XHJcbiAgfTtcclxuICB2YXIgdGltZVNldCA9IGZ1bmN0aW9uICh0aW1lU3RyKSB7XHJcbiAgICBpZiggIXRpbWVTdHIgKXtcclxuICAgICAgcmV0dXJuICcnO1xyXG4gICAgfVxyXG4gICAgdmFyIHRpbWUgPSBuZXcgRGF0ZTtcclxuICAgIHZhciB5ID0gdGltZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgdmFyIG0gPSBkb3VibGVOdW0odGltZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB2YXIgZCA9IHRpbWUuZ2V0RGF0ZSgpO1xyXG4gICAgaWYoIHRpbWVTdHIuaW5kZXhPZignLScpID09IC0xKXtcclxuICAgICAgcmV0dXJuIGZvcm1hdCh0aW1lU3RyKTtcclxuICAgIH1cclxuICAgIGlmICggdGltZVN0ci5zbGljZSgwLCA0KSA9PSB5ICYmIHRpbWVTdHIuc2xpY2UoNSwgNykgPT0gbSAmJiB0aW1lU3RyLnNsaWNlKDgsIDEwKSA9PSBkb3VibGVOdW0oZCkpIHtcclxuICAgICAgcmV0dXJuIHRpbWVTdHIuc2xpY2UoMTEsIDE2KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aW1lU3RyLnNsaWNlKDAsIDExKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHZhciBmb3JtYXQgPSBmdW5jdGlvbiBmb3JtYXQoc2hpamlhbmNodW8pe1xyXG4gICAgc2hpamlhbmNodW8gPSBOdW1iZXIoc2hpamlhbmNodW8pO1xyXG4gICAgLy9zaGlqaWFuY2h1b+aYr+aVtOaVsO+8jOWQpuWImeimgXBhcnNlSW506L2s5o2iXHJcbiAgICB2YXIgdGltZSA9IG5ldyBEYXRlKHNoaWppYW5jaHVvKTtcclxuICAgIHZhciB5ID0gdGltZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgdmFyIG0gPSB0aW1lLmdldE1vbnRoKCkrMTtcclxuICAgIHZhciBkID0gdGltZS5nZXREYXRlKCk7XHJcbiAgICB2YXIgaCA9IHRpbWUuZ2V0SG91cnMoKTtcclxuICAgIHZhciBtbSA9IHRpbWUuZ2V0TWludXRlcygpO1xyXG4gICAgdmFyIHMgPSB0aW1lLmdldFNlY29uZHMoKTtcclxuICAgIHZhciB0aW1lU3RyID0gIHkrJy0nK2RvdWJsZU51bShtKSsnLScrZG91YmxlTnVtKGQpKycgJytkb3VibGVOdW0oaCkrJzonK2RvdWJsZU51bShtbSkrJzonK2RvdWJsZU51bShzKTtcclxuICAgIHJldHVybiB0aW1lU2V0KHRpbWVTdHIpO1xyXG4gIH07XHJcbiAgZnVuY3Rpb24gZ2V0VXJsQXJnT2JqZWN0KCBxdWVyeSApey8v6I635Y+WdXJs5Y+C5pWw5YC8XHJcbiAgICB2YXIgYXJncz1uZXcgT2JqZWN0KCk7XHJcbiAgICB2YXIgcGFpcnM9cXVlcnkuc3BsaXQoXCImXCIpOy8v5Zyo6YCX5Y+35aSE5pat5byAXHJcbiAgICBmb3IodmFyIGk9MDtpPHBhaXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICB2YXIgcG9zPXBhaXJzW2ldLmluZGV4T2YoJz0nKTsvL+afpeaJvm5hbWU9dmFsdWVcclxuICAgICAgaWYocG9zPT0tMSl7Ly/lpoLmnpzmsqHmnInmib7liLDlsLHot7Pov4dcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgYXJnbmFtZT1wYWlyc1tpXS5zdWJzdHJpbmcoMCxwb3MpOy8v5o+Q5Y+WbmFtZVxyXG4gICAgICB2YXIgdmFsdWU9cGFpcnNbaV0uc3Vic3RyaW5nKHBvcysxKTsvL+aPkOWPlnZhbHVlXHJcbiAgICAgIHZhbHVlPWRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7Ly/kvKDov4fmnaXnmoTnvJbnoIHov4flvpfmsYnlrZfov5vooYzop6PnoIE7XHJcbiAgICAgIC8vYXJnc1thcmduYW1lXT11bmVzY2FwZSh2YWx1ZSk7Ly/lrZjkuLrlsZ7mgKdcclxuICAgICAgYXJnc1thcmduYW1lXT12YWx1ZTsvL+WtmOS4uuWxnuaAp1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyZ3M7Ly/ov5Tlm57lr7nosaFcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiDotoXlh7rlrZfoioLmmL7npLrnnIHnlaXlj7dcclxuICAgKiBAcGFyYW0gc3RyIOimgeaIquWPlueahOWtl+espuS4slxyXG4gICAqIEBwYXJhbSBMZW4g6KaB5oiq5Y+W55qE5a2X6IqC6ZW/5bqm77yM5rOo5oSP5piv5a2X6IqC5LiN5piv5a2X56ym77yM5LiA5Liq5rGJ5a2X5Lik5Liq5a2X6IqCXHJcbiAgICogQHJldHVybnMgeyp9IOaIquWPluWQjueahOWtl+espuS4slxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIGhpZGVUZXh0QnlMZW4oc3RyLExlbil7XHJcbiAgICB2YXIgcmVzdWx0ID0gJycsXHJcbiAgICAgICAgc3RybGVuID0gc3RyLmxlbmd0aCwgLy8g5a2X56ym5Liy6ZW/5bqmXHJcbiAgICAgICAgY2hybGVuID0gc3RyLnJlcGxhY2UoL1teXFx4MDAtXFx4ZmZdL2csJyoqJykubGVuZ3RoOyAvLyDlrZfoioLplb/luqZcclxuXHJcbiAgICBpZihjaHJsZW48PUxlbil7cmV0dXJuIHN0cjt9XHJcblxyXG4gICAgZm9yKHZhciBpPTAsaj0wO2k8c3RybGVuO2krKyl7XHJcbiAgICAgIHZhciBjaHIgPSBzdHIuY2hhckF0KGkpO1xyXG4gICAgICBpZigvW1xceDAwLVxceGZmXS8udGVzdChjaHIpKXtcclxuICAgICAgICBqKys7IC8vIGFzY2lp56CB5Li6MC0yNTXvvIzkuIDkuKrlrZfnrKblsLHmmK/kuIDkuKrlrZfoioLnmoTplb/luqZcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgais9MjsgLy8gYXNjaWnnoIHkuLowLTI1NeS7peWklu+8jOS4gOS4quWtl+espuWwseaYr+S4pOS4quWtl+iKgueahOmVv+W6plxyXG4gICAgICB9XHJcbiAgICAgIGlmKGo8TGVuKXsgLy8g5b2T5Yqg5LiK5b2T5YmN5a2X56ym5Lul5ZCO77yM5aaC5p6c5oC75a2X6IqC6ZW/5bqm5bCP5LqO562J5LqOTO+8jOWImeWwhuW9k+WJjeWtl+espuecn+WunueahCvlnKhyZXN1bHTlkI5cclxuICAgICAgICByZXN1bHQgKz0gY2hyO1xyXG4gICAgICB9ZWxzZXsgLy8g5Y+N5LmL5YiZ6K+05piOcmVzdWx05bey57uP5piv5LiN5ouG5YiG5a2X56ym55qE5oOF5Ya15LiL5pyA5o6l6L+RTOeahOWAvOS6hu+8jOebtOaOpei/lOWbnlxyXG4gICAgICAgIHJldHVybiByZXN1bHQrXCIuLi5cIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gd2luZG93LnRvb2xzID0ge1xyXG4gICAgLy/ml7bpl7TlpITnkIblh73mlbBcclxuICAgIHRpbWVTZXQgOiB0aW1lU2V0LFxyXG4gICAgYXJncyA6IGdldFVybEFyZ09iamVjdCggd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSkgKSxcclxuICAgIGhpZGVUZXh0QnlMZW4gOiBoaWRlVGV4dEJ5TGVuXHJcbiAgICAgLy86IGdldEhlYWRNZXNcclxuICB9XHJcbn0pO1xyXG5cclxuIl19

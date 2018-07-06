'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);
  define('', ['jquery', 'service', 'layer', 'footer', 'tool'], function ($, service, layer, footer, tools) {
    if (tools.args.redirectUrl) $("input[name=redirectUrl]").val(tools.args.redirectUrl);
    if (tools.args.appKey) $("input[name=appKey]").val(tools.args.appKey);
    if (tools.args.error) $("#hint-text").text(tools.args.error);
    $("#form").attr("action", service.prefix + $("#form").attr("action"));
    //登录
    var browser = navigator.appName;
    var b_version = navigator.appVersion;
    var version = b_version.split(";");
    var trim_Version = version[1].replace(/[ ]/g, "");
    if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
      passwordHint();
    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
      passwordHint();
    }

    function passwordHint() {
      var userName = $("#box .username").eq(0);
      var passWord = $("#box .password").eq(0);
      var passWordHint = passWord.prev();
      var userNameHint = userName.prev();
      userNameHint.addClass('username_bg');
      passWordHint.addClass('password_bg');
      setInterval(function () {
        if ($.trim(passWord.val())) {
          passWordHint.removeClass("password_bg");
        } else {
          passWordHint.addClass("password_bg");
        }
        if ($.trim(userName.val())) {
          userNameHint.removeClass("username_bg");
        } else {
          userNameHint.addClass("username_bg");
        }
      }, 30);
    }

    function setLoginTop() {
      if ($(window).height() < 730) {
        $('.show-box').css('top', 0);
      } else {
        $('.show-box').css('top', '10%');
      }
    }

    setLoginTop();
    $(window).resize(function () {
      setLoginTop();
    });

    $('body').delegate('#subimt', 'click', function (e) {
      var userName = $.trim($("input.username").val());
      var passWord = $.trim($("input.password").val());
      if (!userName) {
        $('#hint-text').html('请输入用户名');
        return false;
      }
      if (!passWord) {
        $('#hint-text').html('请输入密码');
        return false;
      }
      $('#hint-text').html('');
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvZ2luL2pzL2xvZ2luLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJjb25maWdwYXRocyIsImRlZmluZSIsIiQiLCJzZXJ2aWNlIiwibGF5ZXIiLCJmb290ZXIiLCJ0b29scyIsImFyZ3MiLCJyZWRpcmVjdFVybCIsInZhbCIsImFwcEtleSIsImVycm9yIiwidGV4dCIsImF0dHIiLCJwcmVmaXgiLCJicm93c2VyIiwibmF2aWdhdG9yIiwiYXBwTmFtZSIsImJfdmVyc2lvbiIsImFwcFZlcnNpb24iLCJ2ZXJzaW9uIiwic3BsaXQiLCJ0cmltX1ZlcnNpb24iLCJyZXBsYWNlIiwicGFzc3dvcmRIaW50IiwidXNlck5hbWUiLCJlcSIsInBhc3NXb3JkIiwicGFzc1dvcmRIaW50IiwicHJldiIsInVzZXJOYW1lSGludCIsImFkZENsYXNzIiwic2V0SW50ZXJ2YWwiLCJ0cmltIiwicmVtb3ZlQ2xhc3MiLCJzZXRMb2dpblRvcCIsIndpbmRvdyIsImhlaWdodCIsImNzcyIsInJlc2l6ZSIsImRlbGVnYXRlIiwiZSIsImh0bWwiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLG9CQUFnQjtBQURYO0FBRk0sQ0FBZjtBQU1BSCxRQUFRLENBQUMsY0FBRCxDQUFSLEVBQTBCLFVBQVVJLFdBQVYsRUFBdUI7QUFDL0NKLFVBQVFDLE1BQVIsQ0FBZUcsV0FBZjtBQUNBQyxTQUFPLEVBQVAsRUFBVSxDQUFDLFFBQUQsRUFBVyxTQUFYLEVBQXNCLE9BQXRCLEVBQStCLFFBQS9CLEVBQXlDLE1BQXpDLENBQVYsRUFDRSxVQUFVQyxDQUFWLEVBQWFDLE9BQWIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFxQ0MsS0FBckMsRUFBNEM7QUFDMUMsUUFBSUEsTUFBTUMsSUFBTixDQUFXQyxXQUFmLEVBQTRCTixFQUFFLHlCQUFGLEVBQTZCTyxHQUE3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O0FBQ0Q7QUFDRCxVQUFJLENBQUNmLFFBQUwsRUFBZTtBQUNiekIsVUFBRSxZQUFGLEVBQWdCd0MsSUFBaEIsQ0FBcUIsT0FBckI7QUFDQSxlQUFPLEtBQVA7QUFDRDtBQUNEeEMsUUFBRSxZQUFGLEVBQWdCd0MsSUFBaEIsQ0FBcUIsRUFBckI7QUFDRCxLQVpEO0FBY0QsR0FsRUg7QUFvRUQsQ0F0RUQiLCJmaWxlIjoibG9naW4vanMvbG9naW4tY2Y2NDZhYmJhNi5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ3BsYXRmb3JtQ29uZic6ICdwdWJsaWMvanMvcGxhdGZvcm1Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydwbGF0Zm9ybUNvbmYnXSwgZnVuY3Rpb24gKGNvbmZpZ3BhdGhzKSB7XHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG4gIGRlZmluZSgnJyxbJ2pxdWVyeScsICdzZXJ2aWNlJywgJ2xheWVyJywgJ2Zvb3RlcicsICd0b29sJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgc2VydmljZSwgbGF5ZXIsIGZvb3RlciwgdG9vbHMpIHtcclxuICAgICAgaWYgKHRvb2xzLmFyZ3MucmVkaXJlY3RVcmwpICQoXCJpbnB1dFtuYW1lPXJlZGlyZWN0VXJsXVwiKS52YWwodG9vbHMuYXJncy5yZWRpcmVjdFVybCk7XHJcbiAgICAgIGlmICh0b29scy5hcmdzLmFwcEtleSkgJChcImlucHV0W25hbWU9YXBwS2V5XVwiKS52YWwodG9vbHMuYXJncy5hcHBLZXkpO1xyXG4gICAgICBpZiAodG9vbHMuYXJncy5lcnJvcikgJChcIiNoaW50LXRleHRcIikudGV4dCh0b29scy5hcmdzLmVycm9yKTtcclxuICAgICAgJChcIiNmb3JtXCIpLmF0dHIoXCJhY3Rpb25cIiwgc2VydmljZS5wcmVmaXggKyAkKFwiI2Zvcm1cIikuYXR0cihcImFjdGlvblwiKSk7XHJcbiAgICAgIC8v55m75b2VXHJcbiAgICAgIHZhciBicm93c2VyID0gbmF2aWdhdG9yLmFwcE5hbWVcclxuICAgICAgdmFyIGJfdmVyc2lvbiA9IG5hdmlnYXRvci5hcHBWZXJzaW9uXHJcbiAgICAgIHZhciB2ZXJzaW9uID0gYl92ZXJzaW9uLnNwbGl0KFwiO1wiKTtcclxuICAgICAgdmFyIHRyaW1fVmVyc2lvbiA9IHZlcnNpb25bMV0ucmVwbGFjZSgvWyBdL2csIFwiXCIpO1xyXG4gICAgICBpZiAoYnJvd3NlciA9PSBcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiICYmIHRyaW1fVmVyc2lvbiA9PSBcIk1TSUU4LjBcIikge1xyXG4gICAgICAgIHBhc3N3b3JkSGludCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKGJyb3dzZXIgPT0gXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIiAmJiB0cmltX1ZlcnNpb24gPT0gXCJNU0lFOS4wXCIpIHtcclxuICAgICAgICBwYXNzd29yZEhpbnQoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcGFzc3dvcmRIaW50KCkge1xyXG4gICAgICAgIHZhciB1c2VyTmFtZSA9ICQoXCIjYm94IC51c2VybmFtZVwiKS5lcSgwKTtcclxuICAgICAgICB2YXIgcGFzc1dvcmQgPSAkKFwiI2JveCAucGFzc3dvcmRcIikuZXEoMCk7XHJcbiAgICAgICAgdmFyIHBhc3NXb3JkSGludCA9IHBhc3NXb3JkLnByZXYoKTtcclxuICAgICAgICB2YXIgdXNlck5hbWVIaW50ID0gdXNlck5hbWUucHJldigpO1xyXG4gICAgICAgIHVzZXJOYW1lSGludC5hZGRDbGFzcygndXNlcm5hbWVfYmcnKTtcclxuICAgICAgICBwYXNzV29yZEhpbnQuYWRkQ2xhc3MoJ3Bhc3N3b3JkX2JnJyk7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgaWYgKCQudHJpbShwYXNzV29yZC52YWwoKSkpIHtcclxuICAgICAgICAgICAgcGFzc1dvcmRIaW50LnJlbW92ZUNsYXNzKFwicGFzc3dvcmRfYmdcIik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwYXNzV29yZEhpbnQuYWRkQ2xhc3MoXCJwYXNzd29yZF9iZ1wiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgkLnRyaW0odXNlck5hbWUudmFsKCkpKSB7XHJcbiAgICAgICAgICAgIHVzZXJOYW1lSGludC5yZW1vdmVDbGFzcyhcInVzZXJuYW1lX2JnXCIpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXNlck5hbWVIaW50LmFkZENsYXNzKFwidXNlcm5hbWVfYmdcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMzApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzZXRMb2dpblRvcCgpIHtcclxuICAgICAgICBpZiAoJCh3aW5kb3cpLmhlaWdodCgpIDwgNzMwKSB7XHJcbiAgICAgICAgICAkKCcuc2hvdy1ib3gnKS5jc3MoJ3RvcCcsIDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKCcuc2hvdy1ib3gnKS5jc3MoJ3RvcCcsICcxMCUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNldExvZ2luVG9wKCk7XHJcbiAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNldExvZ2luVG9wKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCgnYm9keScpLmRlbGVnYXRlKCcjc3ViaW10JywgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgdXNlck5hbWUgPSAkLnRyaW0oJChcImlucHV0LnVzZXJuYW1lXCIpLnZhbCgpKTtcclxuICAgICAgICB2YXIgcGFzc1dvcmQgPSAkLnRyaW0oJChcImlucHV0LnBhc3N3b3JkXCIpLnZhbCgpKTtcclxuICAgICAgICBpZiAoIXVzZXJOYW1lKSB7XHJcbiAgICAgICAgICAkKCcjaGludC10ZXh0JykuaHRtbCgn6K+36L6T5YWl55So5oi35ZCNJyk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcGFzc1dvcmQpIHtcclxuICAgICAgICAgICQoJyNoaW50LXRleHQnKS5odG1sKCfor7fovpPlhaXlr4bnoIEnKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnI2hpbnQtdGV4dCcpLmh0bWwoJycpO1xyXG4gICAgICB9KVxyXG5cclxuICAgIH1cclxuICApO1xyXG59KVxyXG5cclxuIl19
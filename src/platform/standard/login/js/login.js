require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);
  define('',['jquery', 'service', 'layer', 'footer', 'tool'],
    function ($, service, layer, footer, tools) {
      if (tools.args.redirectUrl) $("input[name=redirectUrl]").val(tools.args.redirectUrl);
      if (tools.args.appKey) $("input[name=appKey]").val(tools.args.appKey);
      if (tools.args.error) $("#hint-text").text(tools.args.error);
      $("#form").attr("action", service.prefix + $("#form").attr("action"));
      //登录
      var browser = navigator.appName
      var b_version = navigator.appVersion
      var version = b_version.split(";");
      var trim_Version = version[1].replace(/[ ]/g, "");
      if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
        passwordHint();
      }
      else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
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
      })

    }
  );
})


require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {

  require.config(configpaths);

  define('', ['jquery', 'service', 'footer', 'tool'],
    function ($, service, footer, tools) {
      //获取浏览器url参数
      function getParameter(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return decodeURIComponent(r[2]);
        }
        return null;
      }

      $('#email').on('keyup', function () {
        var val = $('#email').val();
        if (!val) {
          $('#sendCode').attr('disabled', true);
          $('#sendCode').css({'background': '#768d9f', "cursor": "not-allowed"});
        } else {
          $('#sendCode').attr('disabled', false);
          $('#sendCode').css({'background': '#0884dc', "cursor": "pointer"});
        }
      });

      function CheckMail(account, mail, callback) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(mail)) {
          $('#sendCode').css({'background': '#768d9f', "cursor": "not-allowed"});
          callback(account, mail);
        } else {
          $('.pwdInfo').show();
          $('.pwdInfo span.info').text('您的邮箱格式不正确！');
        }
      }

      $('.pwdInfo').hide();

      function password(account, mail, code, password, callback) {
        var pwd = /^[a-zA-Z0-9]{6,10}$/;
        if (pwd.test(password)) {
          $('.pwdInfo').hide();
          if ($('#pwd').val() == $('#pwd1').val()) {
            callback(account, mail, code, password);
            return true;
          } else {
            $('.pwdInfo').show();
            $('.pwdInfo span.info').text('您两次密码输入不一致，请重新输入！');
            return false;
          }
        } else {
          $('.pwdInfo').show();
          $('.pwdInfo span.info').text('请输入6-10位密码!');
          return false;
        }
      }

      $('body').on('click', '#nextStepBtn2', function () {
        password(getParameter('account'), getParameter('email'), getParameter('code'), $('#pwd').val(), resetPassword);

      });

      /**
       * @description       发送邮箱验证码接口
       * @param account     用户账号
       * @param email       邮箱地址
       */
      function sendEmail(account, email) {
        var url = service.prefix + '/pf/api/findpas/sendCode?account=' + account + '&email=' + email;
        $.ajax({
          url: url,
          type: "post",
          dataType: 'json',
          success: function (result) {
            if (result['code'] == 'success') {
              console.log(result['code']);
              $('.pwdInfo span.info').text(result.msg);
              $('.pwdInfo').show();
              $('#sendCode').css({'background': '#768d9f', "cursor": "not-allowed"});
            } else {
              $('.pwdInfo span.info').text(result.msg);
              $('.pwdInfo').show();
              $('#sendCode').css({'background': '#0884dc', "cursor": "pointer"});
            }
          }
        });
      }

      $('body').on('click', '#sendCode', function () {
        CheckMail($('#accountNnumber').val(), $('#email').val(), sendEmail);
      });

      /**
       * @description       验证邮箱验证码接口
       * @param account     用户账号
       * @param email       邮箱地址
       * @param ecode        邮箱的验证码
       */
      function verificationCode(account, email, ecode) {
        var url = service.prefix + '/pf/api/findpas/verifyCode?account=' + account + '&email=' + email + '&code=' + ecode;
        $.ajax({
          url: url,
          type: "post",
          dataType: 'json',
          success: function (result) {
            if (result['code'] == 'success') {
              $('.pwdInfo').show();
              $('.pwdInfo span.info').text(result.msg);
              window.location = 'passworkTwo.html?account=' + account + '&email=' + email + '&code=' + ecode;
            } else {
              $('.pwdInfo').show();
              $('.pwdInfo span.info').text(result.msg);
            }
          }
        });
      }

      $('body').on('click', '#nextStepBtn1', function () {
        verificationCode($('#accountNnumber').val(), $('#email').val(), $('.VerificationCode').val());
      });


      /**
       * @description       重置密码接口
       * @param account     用户账号
       * @param email       邮箱地址
       * @param code        邮箱的验证码
       * @param password    新密码
       */
      function resetPassword(account, email, code, password) {
        var url = service.prefix + '/pf/api/findpas/resetPas?account=' + account + '&email=' + email + '&code=' + code +
          '&password=' + password;
        $.ajax({
          url: url,
          type: "post",
          dataType: 'json',
          success: function (result) {
            if (result['code'] == 'success') {
              window.location = 'passworkThree.html';
            } else {
              $('.pwdInfo').show();
              $('.pwdInfo span.info').text(result.msg);
            }
          }
        });
      }

      $('body').on('click', '#loginBtn', function () {
        window.location.href = service.prefix + '/login';
      });
    });
})
'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
require(['platformConf'], function (configpaths) {

  require.config(configpaths);

  define('', ['jquery', 'service', 'footer', 'tool'], function ($, service, footer, tools) {
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
        $('#sendCode').css({ 'background': '#768d9f', "cursor": "not-allowed" });
      } else {
        $('#sendCode').attr('disabled', false);
        $('#sendCode').css({ 'background': '#0884dc', "cursor": "pointer" });
      }
    });

    function CheckMail(account, mail, callback) {
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(mail)) {
        $('#sendCode').css({ 'background': '#768d9f', "cursor": "not-allowed" });
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
        success: function success(result) {
          if (result['code'] == 'success') {
            console.log(result['code']);
            $('.pwdInfo span.info').text(result.msg);
            $('.pwdInfo').show();
            $('#sendCode').css({ 'background': '#768d9f', "cursor": "not-allowed" });
          } else {
            $('.pwdInfo span.info').text(result.msg);
            $('.pwdInfo').show();
            $('#sendCode').css({ 'background': '#0884dc', "cursor": "pointer" });
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
        success: function success(result) {
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
      var url = service.prefix + '/pf/api/findpas/resetPas?account=' + account + '&email=' + email + '&code=' + code + '&password=' + password;
      $.ajax({
        url: url,
        type: "post",
        dataType: 'json',
        success: function success(result) {
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
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhc3N3b3JkL2pzL3Bhc3N3b3JkLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJjb25maWdwYXRocyIsImRlZmluZSIsIiQiLCJzZXJ2aWNlIiwiZm9vdGVyIiwidG9vbHMiLCJnZXRQYXJhbWV0ZXIiLCJuYW1lIiwicmVnIiwiUmVnRXhwIiwiciIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic3Vic3RyIiwibWF0Y2giLCJkZWNvZGVVUklDb21wb25lbnQiLCJvbiIsInZhbCIsImF0dHIiLCJjc3MiLCJDaGVja01haWwiLCJhY2NvdW50IiwibWFpbCIsImNhbGxiYWNrIiwiZmlsdGVyIiwidGVzdCIsInNob3ciLCJ0ZXh0IiwiaGlkZSIsInBhc3N3b3JkIiwiY29kZSIsInB3ZCIsInJlc2V0UGFzc3dvcmQiLCJzZW5kRW1haWwiLCJlbWFpbCIsInVybCIsInByZWZpeCIsImFqYXgiLCJ0eXBlIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwicmVzdWx0IiwiY29uc29sZSIsImxvZyIsIm1zZyIsInZlcmlmaWNhdGlvbkNvZGUiLCJlY29kZSIsImhyZWYiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLG9CQUFnQjtBQURYO0FBRk0sQ0FBZjtBQU1BSCxRQUFRLENBQUMsY0FBRCxDQUFSLEVBQTBCLFVBQVVJLFdBQVYsRUFBdUI7O0FBRS9DSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7O0FBRUFDLFNBQU8sRUFBUCxFQUFXLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsUUFBdEIsRUFBZ0MsTUFBaEMsQ0FBWCxFQUNFLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsTUFBdEIsRUFBOEJDLEtBQTlCLEVBQXFDO0FBQ25DO0FBQ0EsYUFBU0MsWUFBVCxDQUFzQkMsSUFBdEIsRUFBNEI7QUFDMUIsVUFBSUMsTUFBTSxJQUFJQyxN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UUFEakI7QUFFQTVCLFFBQUVvQyxJQUFGLENBQU87QUFDTEYsYUFBS0EsR0FEQTtBQUVMRyxjQUFNLE1BRkQ7QUFHTEMsa0JBQVUsTUFITDtBQUlMQyxpQkFBUyxpQkFBVUMsTUFBVixFQUFrQjtBQUN6QixjQUFJQSxPQUFPLE1BQVAsS0FBa0IsU0FBdEIsRUFBaUM7QUFDL0IvQixtQkFBT0MsUUFBUCxHQUFrQixvQkFBbEI7QUFDRCxXQUZELE1BRU87QUFDTFYsY0FBRSxVQUFGLEVBQWN5QixJQUFkO0FBQ0F6QixjQUFFLG9CQUFGLEVBQXdCMEIsSUFBeEIsQ0FBNkJjLE9BQU9HLEdBQXBDO0FBQ0Q7QUFDRjtBQVhJLE9BQVA7QUFhRDs7QUFFRDNDLE1BQUUsTUFBRixFQUFVZSxFQUFWLENBQWEsT0FBYixFQUFzQixXQUF0QixFQUFtQyxZQUFZO0FBQzdDTixhQUFPQyxRQUFQLENBQWdCb0MsSUFBaEIsR0FBdUI3QyxRQUFRa0MsTUFBUixHQUFpQixRQUF4QztBQUNELEtBRkQ7QUFHRCxHQXBKSDtBQXFKRCxDQXpKRCIsImZpbGUiOiJQYXNzd29yZC9qcy9wYXNzd29yZC0wMTFkMTlmZTQ3LmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZS5jb25maWcoe1xyXG4gIGJhc2VVcmw6ICcuLi8nLFxyXG4gIHBhdGhzOiB7XHJcbiAgICAncGxhdGZvcm1Db25mJzogJ3B1YmxpYy9qcy9wbGF0Zm9ybUNvbmYuanMnXHJcbiAgfVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuXHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG5cclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ3NlcnZpY2UnLCAnZm9vdGVyJywgJ3Rvb2wnXSxcclxuICAgIGZ1bmN0aW9uICgkLCBzZXJ2aWNlLCBmb290ZXIsIHRvb2xzKSB7XHJcbiAgICAgIC8v6I635Y+W5rWP6KeI5ZmodXJs5Y+C5pWwXHJcbiAgICAgIGZ1bmN0aW9uIGdldFBhcmFtZXRlcihuYW1lKSB7XHJcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXnwmKVwiICsgbmFtZSArIFwiPShbXiZdKikoJnwkKVwiKTtcclxuICAgICAgICB2YXIgciA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLm1hdGNoKHJlZyk7XHJcbiAgICAgICAgaWYgKHIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyWzJdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJyNlbWFpbCcpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmFsID0gJCgnI2VtYWlsJykudmFsKCk7XHJcbiAgICAgICAgaWYgKCF2YWwpIHtcclxuICAgICAgICAgICQoJyNzZW5kQ29kZScpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgICAkKCcjc2VuZENvZGUnKS5jc3MoeydiYWNrZ3JvdW5kJzogJyM3NjhkOWYnLCBcImN1cnNvclwiOiBcIm5vdC1hbGxvd2VkXCJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJCgnI3NlbmRDb2RlJykuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAkKCcjc2VuZENvZGUnKS5jc3MoeydiYWNrZ3JvdW5kJzogJyMwODg0ZGMnLCBcImN1cnNvclwiOiBcInBvaW50ZXJcIn0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBDaGVja01haWwoYWNjb3VudCwgbWFpbCwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgZmlsdGVyID0gL14oW2EtekEtWjAtOV9cXC5cXC1dKStcXEAoKFthLXpBLVowLTlcXC1dKStcXC4pKyhbYS16QS1aMC05XXsyLDR9KSskLztcclxuICAgICAgICBpZiAoZmlsdGVyLnRlc3QobWFpbCkpIHtcclxuICAgICAgICAgICQoJyNzZW5kQ29kZScpLmNzcyh7J2JhY2tncm91bmQnOiAnIzc2OGQ5ZicsIFwiY3Vyc29yXCI6IFwibm90LWFsbG93ZWRcIn0pO1xyXG4gICAgICAgICAgY2FsbGJhY2soYWNjb3VudCwgbWFpbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoJy5wd2RJbmZvJykuc2hvdygpO1xyXG4gICAgICAgICAgJCgnLnB3ZEluZm8gc3Bhbi5pbmZvJykudGV4dCgn5oKo55qE6YKu566x5qC85byP5LiN5q2j56Gu77yBJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCcucHdkSW5mbycpLmhpZGUoKTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIHBhc3N3b3JkKGFjY291bnQsIG1haWwsIGNvZGUsIHBhc3N3b3JkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBwd2QgPSAvXlthLXpBLVowLTldezYsMTB9JC87XHJcbiAgICAgICAgaWYgKHB3ZC50ZXN0KHBhc3N3b3JkKSkge1xyXG4gICAgICAgICAgJCgnLnB3ZEluZm8nKS5oaWRlKCk7XHJcbiAgICAgICAgICBpZiAoJCgnI3B3ZCcpLnZhbCgpID09ICQoJyNwd2QxJykudmFsKCkpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soYWNjb3VudCwgbWFpbCwgY29kZSwgcGFzc3dvcmQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICQoJy5wd2RJbmZvJykuc2hvdygpO1xyXG4gICAgICAgICAgICAkKCcucHdkSW5mbyBzcGFuLmluZm8nKS50ZXh0KCfmgqjkuKTmrKHlr4bnoIHovpPlhaXkuI3kuIDoh7TvvIzor7fph43mlrDovpPlhaXvvIEnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKCcucHdkSW5mbycpLnNob3coKTtcclxuICAgICAgICAgICQoJy5wd2RJbmZvIHNwYW4uaW5mbycpLnRleHQoJ+ivt+i+k+WFpTYtMTDkvY3lr4bnoIEhJyk7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNuZXh0U3RlcEJ0bjInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcGFzc3dvcmQoZ2V0UGFyYW1ldGVyKCdhY2NvdW50JyksIGdldFBhcmFtZXRlcignZW1haWwnKSwgZ2V0UGFyYW1ldGVyKCdjb2RlJyksICQoJyNwd2QnKS52YWwoKSwgcmVzZXRQYXNzd29yZCk7XHJcblxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAg5Y+R6YCB6YKu566x6aqM6K+B56CB5o6l5Y+jXHJcbiAgICAgICAqIEBwYXJhbSBhY2NvdW50ICAgICDnlKjmiLfotKblj7dcclxuICAgICAgICogQHBhcmFtIGVtYWlsICAgICAgIOmCrueuseWcsOWdgFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gc2VuZEVtYWlsKGFjY291bnQsIGVtYWlsKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9wZi9hcGkvZmluZHBhcy9zZW5kQ29kZT9hY2NvdW50PScgKyBhY2NvdW50ICsgJyZlbWFpbD0nICsgZW1haWw7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0Wydjb2RlJ10pO1xyXG4gICAgICAgICAgICAgICQoJy5wd2RJbmZvIHNwYW4uaW5mbycpLnRleHQocmVzdWx0Lm1zZyk7XHJcbiAgICAgICAgICAgICAgJCgnLnB3ZEluZm8nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgJCgnI3NlbmRDb2RlJykuY3NzKHsnYmFja2dyb3VuZCc6ICcjNzY4ZDlmJywgXCJjdXJzb3JcIjogXCJub3QtYWxsb3dlZFwifSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgJCgnLnB3ZEluZm8gc3Bhbi5pbmZvJykudGV4dChyZXN1bHQubXNnKTtcclxuICAgICAgICAgICAgICAkKCcucHdkSW5mbycpLnNob3coKTtcclxuICAgICAgICAgICAgICAkKCcjc2VuZENvZGUnKS5jc3MoeydiYWNrZ3JvdW5kJzogJyMwODg0ZGMnLCBcImN1cnNvclwiOiBcInBvaW50ZXJcIn0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI3NlbmRDb2RlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIENoZWNrTWFpbCgkKCcjYWNjb3VudE5udW1iZXInKS52YWwoKSwgJCgnI2VtYWlsJykudmFsKCksIHNlbmRFbWFpbCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiAgICAgICDpqozor4Hpgq7nrrHpqozor4HnoIHmjqXlj6NcclxuICAgICAgICogQHBhcmFtIGFjY291bnQgICAgIOeUqOaIt+i0puWPt1xyXG4gICAgICAgKiBAcGFyYW0gZW1haWwgICAgICAg6YKu566x5Zyw5Z2AXHJcbiAgICAgICAqIEBwYXJhbSBlY29kZSAgICAgICAg6YKu566x55qE6aqM6K+B56CBXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiB2ZXJpZmljYXRpb25Db2RlKGFjY291bnQsIGVtYWlsLCBlY29kZSkge1xyXG4gICAgICAgIHZhciB1cmwgPSBzZXJ2aWNlLnByZWZpeCArICcvcGYvYXBpL2ZpbmRwYXMvdmVyaWZ5Q29kZT9hY2NvdW50PScgKyBhY2NvdW50ICsgJyZlbWFpbD0nICsgZW1haWwgKyAnJmNvZGU9JyArIGVjb2RlO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxyXG4gICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdFsnY29kZSddID09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICQoJy5wd2RJbmZvJykuc2hvdygpO1xyXG4gICAgICAgICAgICAgICQoJy5wd2RJbmZvIHNwYW4uaW5mbycpLnRleHQocmVzdWx0Lm1zZyk7XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJ3Bhc3N3b3JrVHdvLmh0bWw/YWNjb3VudD0nICsgYWNjb3VudCArICcmZW1haWw9JyArIGVtYWlsICsgJyZjb2RlPScgKyBlY29kZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkKCcucHdkSW5mbycpLnNob3coKTtcclxuICAgICAgICAgICAgICAkKCcucHdkSW5mbyBzcGFuLmluZm8nKS50ZXh0KHJlc3VsdC5tc2cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI25leHRTdGVwQnRuMScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2ZXJpZmljYXRpb25Db2RlKCQoJyNhY2NvdW50Tm51bWJlcicpLnZhbCgpLCAkKCcjZW1haWwnKS52YWwoKSwgJCgnLlZlcmlmaWNhdGlvbkNvZGUnKS52YWwoKSk7XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAg6YeN572u5a+G56CB5o6l5Y+jXHJcbiAgICAgICAqIEBwYXJhbSBhY2NvdW50ICAgICDnlKjmiLfotKblj7dcclxuICAgICAgICogQHBhcmFtIGVtYWlsICAgICAgIOmCrueuseWcsOWdgFxyXG4gICAgICAgKiBAcGFyYW0gY29kZSAgICAgICAg6YKu566x55qE6aqM6K+B56CBXHJcbiAgICAgICAqIEBwYXJhbSBwYXNzd29yZCAgICDmlrDlr4bnoIFcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmQoYWNjb3VudCwgZW1haWwsIGNvZGUsIHBhc3N3b3JkKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IHNlcnZpY2UucHJlZml4ICsgJy9wZi9hcGkvZmluZHBhcy9yZXNldFBhcz9hY2NvdW50PScgKyBhY2NvdW50ICsgJyZlbWFpbD0nICsgZW1haWwgKyAnJmNvZGU9JyArIGNvZGUgK1xyXG4gICAgICAgICAgJyZwYXNzd29yZD0nICsgcGFzc3dvcmQ7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Wydjb2RlJ10gPT0gJ3N1Y2Nlc3MnKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJ3Bhc3N3b3JrVGhyZWUuaHRtbCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgJCgnLnB3ZEluZm8nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgJCgnLnB3ZEluZm8gc3Bhbi5pbmZvJykudGV4dChyZXN1bHQubXNnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJyNsb2dpbkJ0bicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlcnZpY2UucHJlZml4ICsgJy9sb2dpbic7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pIl19

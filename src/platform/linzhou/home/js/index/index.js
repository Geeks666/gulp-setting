/**
 * Created by dell on 2017/4/28.
 */
require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);

  define('', ['jquery', 'service', 'header', 'footer', 'appConfig'],
    function ($, service, header, footer, appConfig) {
      console.log(header.STATE())

      function getHight() {

        if (document.body.clientHeight <= 700) {
          $("#xiaozhuang_footer").css({"position": "initial"})
          return
        }
        else {
          $(".apps").css({"marginTop": (document.body.clientHeight - 100 - 80 - 448) / 2 + "px"});
          $("#xiaozhuang_footer").css({"position": "fixed"})
        }

      }

      function jumpPlatform(appId) {
        $.ajax({
          url: service.htmlHost + 'pf/api/app/verify?appId=' + appId,
          type: 'GET',
          success: function (data) {
            if (data.code === "success") {
              window.location.href = data.data;
            }
            else {
              var popPosition = header.getPosition('tips');
              $(".mask").show();
              $(".pop").show().css({
                left: popPosition.popLeft,
                top: popPosition.popTop
              });
              ;
              setTimeout(function () {
                $(".mask").hide();
                $(".pop").hide();
              }, 1000)
            }
            console.log(data)
          },
          error: function () {
          }
        });
      }

      function getAppId(app_id) {
        $.ajax({
          url: service.htmlHost + '/pf/api/header/appid/' + app_id,
          type: 'GET',
          success: function (data) {
            if (data.code === "success") {
              jumpPlatform(data.data);
            }
            console.log(data)
          },
          error: function () {
          }
        });
      }

      $(".platform").click(function () {
        if (!header.STATE()) {
          var popPosition = header.getPosition('login');
          $(".mask").show();
          $(".login_tab").show().css({
            left: popPosition.popLeft,
            top: popPosition.popTop
          });
        }
        else {
          /*jumpPlatform("11a9ca75cb7746e99cda8f928429e7c4")*/
          getAppId('xxjyId');

        }
      });
      $(".shixun").click(function () {
        if (!header.STATE()) {
          var popPosition = header.getPosition('login');
          $(".mask").show();
          $(".login_tab").show().css({
            left: popPosition.popLeft,
            top: popPosition.popTop
          });
        }
        else {
          window.location.href = "download.html"
        }
      });
      getHight();
      $(window).resize(function () {
        getHight();
      });
    }
  );
})


// require.config({
//   paths: {
//     'jquery': '../../../../lib/jquery/jquery-1.11.2.min.js',
//     'service': '../../../../base/js/service.js',
//     'template': '../../../../lib/arTtemplate/template.js'
//   }
// });

define(['jquery', 'service', 'template'], function ($, service, template) {
  var userInfo = null;
  initNavList();

  getUserInfo();
  function initNavList() {
    var navList = [
      {
        "id": "1",
        "name": "首页",
        "url": service.htmlHost + "/dist/platform/www/home/index.html",
        "iconurl": service.htmlHost + "/dist/public/header/images/index.png",
        'newOpen': false
      },
      {
        "id": "2",
        "name": "资源",
        "url": service.sourcePlatformBase + "?requireLogin=false",
        "iconurl": service.htmlHost + "/dist/public/header/images/resource.png",
        'newOpen': true
      },
      {
        "id": "3",
        "name": "应用",
        "url": service.htmlHost + "/dist/platform/www/app/application.html",
        "iconurl": service.htmlHost + "/dist/public/header/images/app.png",
        'newOpen': false
      },
      {
        "id": "4",
        "name": "空间",
        "url": service.newSpaceBase + "/JCenterHome/www/interspace/interspace.html",
        "iconurl": service.htmlHost + "/dist/public/header/images/space.png",
        'newOpen': false
      }
    ];
    $("#nav").html(template("navList", {"navList": navList}));
  };

  $('#mainbo-top-nav').on('click', '.activity', function () {
    var w = window.open('about:blank');
    $.support.cors = true;
    $.ajax({
      url: service.activityHost + '/anonymous/activityIndex',
      type: 'GET',
      dataType: "jsonp",
      jsonp: "callback",
      success: function (data) {
        if (data.code == "success") {
          w.location.href = service.activityHost + data.data + ( userInfo ? '?login=true' : '?login=false' );
        } else {
          layer.alert(data.msg, {icon: 0});
        }
      },
      error: function (data) {
        layer.alert('服务器异常', {icon: 0});
      }
    });
  });

  $('#mainbo-top-nav').on('click', '.statistics-header', function () {
    if (!userInfo) {
      layer.alert("请登录后操作。", {icon: 0});
      return false;
    } else {
      verifyApp('b5176e330028457fa78289d6e63eca2f', '2');
    }
  });
  function verifyApp(appId, kindCode) {
    var w = window;
    if (kindCode == '2') {
      w = window.open('about:blank')
    }
    $.support.cors = true;
    $.ajax({
      url: service.htmlHost + "/pf/api/app/verifyJp.jsonp",
      type: "get",
      data: {"appId": appId},
      dataType: 'jsonp',
      jsonp: "callback",
      success: function (data) {
        data = data.result;
        if (data.code == "success") {
          w.location.href = data.data;
        } else if (data.code == "failed") {
          if (kindCode == '2') {
            w.close();
          }
          layer.alert(data.msg, {icon: 0});
        }
      },
      error: function (data) {
        layer.alert("请求失败", {icon: 0});
      }
    });
  };


  function getUserInfo() {
    var userJumpHref = {
      'mySpace': service.newSpaceBase + '/home?requireLogin=true',
      'myApp': service.htmlHost + '/dist/platform/www/persCenter/persApp.html',
      'personCenter': service.htmlHost + '/dist/platform/www/persCenter/persCenter.html',
      'spaceManager': service.newSpaceBase + '/home?requireLogin=true',
      'managerCenter': service.newSpaceBase + '/JCenterHome/persCenter/manageCen.html?spaceId=cdf26851780d41029fa149ec3f21c4df&spaceType=school',
      'adminManager': service.adminManager
    };
    if (localStorage.userInfo) {
      userInfo = localStorage.userInfo;
    } else {
      //请求获取
      $.ajax({
        url: service.prefix + '/pf/api/header/user.jsonp',
        type: 'GET',
        dataType: "jsonp",
        jsonp: "callback",
        success: function (data) {
          if (data.result.code == "success") {
            userInfo = data.result.data;
          } else if (data.code == "login_error") {
            console.log("用户没有登录");
          }
          data.result.userJumpHref = userJumpHref;
          $("#login_message").html(template("loginMessage", {"data": data.result}));
        }
      });
    }
  }

  /** 平台登录方法(oauth)方法*/
  function oauthLogin() {
    var url = window.location.href;
    if (url.indexOf("#page")) {
      url = url.split("#page")[0];
    }
    window.location.href = service.prefix + '/login?redirectUrl=' + url;
  };
  function logout() {

    $.ajax({
      url: service.prefix + '/logout',
      type: 'GET',
      dataType: "jsonp",
      jsonp: "callback",
      success: function (data) {
        if (window.location.href.indexOf("persCenter")) {
          window.location.href = service.htmlHost + "/dist/platform/www/home/index.html";
        } else {
          window.location.reload();
        }
      },
      error: function () {
        if (window.location.href.indexOf("persCenter")) {
          window.location.href = service.htmlHost + "/dist/platform/www/home/index.html";
        } else {
          window.location.reload();
        }
      }
    });
  };
  $("body").delegate(".mainbo-top-nav .loginButton", "click", function () {
    oauthLogin();
  });
  $("body").delegate(".logout", "click", function () {
    logout();
  });
  $("body").delegate(".login_user .login_username", "click", function (e) {
    e.stopPropagation();
    var $arrow = $(this).find("span.arrow");
    if ($arrow.hasClass("arrow_up")) {
      $arrow.removeClass("arrow_up");
      $(this).parents(".login_user").find("ul").hide();
    } else {
      $arrow.addClass("arrow_up");
      $(this).parents(".login_user").find("ul").show();
    }
  });
  $(document).click(function () {
    $(".login_user").find("span.arrow").removeClass("arrow_up");
    $(".login_user").find("ul").hide();
  });
  return window.mes = {
    getUser: function () {
      return userInfo;
    }
  }
});
	
	  

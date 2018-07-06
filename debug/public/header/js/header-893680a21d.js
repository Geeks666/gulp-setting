'use strict';

// require.config({
//   paths: {
//     'jquery': '../../../../lib/jquery/jquery-1-5790ead7ad.11.2.min.js',
//     'service': '../../../../base/js/service-5ba6dc5529.js',
//     'template': '../../../../lib/arTtemplate/template-dd622e58c9.js'
//   }
// });

define(['jquery', 'service', 'template'], function ($, service, template) {
  var userInfo = null;
  initNavList();
  getUserInfo();
  function initNavList() {
    var navList = [{
      "id": "1",
      "name": "首页",
      "url": service.prefix + "/dist/platform/www/home/index.html",
      "iconurl": service.prefix + "/dist/public/header/images/index-66d37a201e.png",
      'newOpen': false
    }, {
      "id": "2",
      "name": "资源",
      "url": service.sourcePlatformBase + "?requireLogin=false",
      "iconurl": service.htmlHost + "/dist/public/header/images/resource-be94a25e9a.png",
      'newOpen': true
    }, {
      "id": "3",
      "name": "应用",
      "url": service.prefix + "/dist/platform/www/app/application.html",
      "iconurl": service.htmlHost + "/dist/public/header/images/app-78d5ef7327.png",
      'newOpen': false
    }, {
      "id": "4",
      "name": "空间",
      "url": service.newSpaceBase + "/JCenterHome/www/interspace/interspace.html",
      "iconurl": service.htmlHost + "/dist/public/header/images/space-de51dfaae7.png",
      'newOpen': false
    }, {
      "id": "5",
      "name": "活动",
      "url": "javascript:void(0);",
      "iconurl": "",
      'newOpen': false,
      "class": "activity"
    }, {
      "id": "6",
      "name": "数据",
      "url": "javascript:void(0);",
      "iconurl": "",
      'newOpen': false,
      "class": "statistics-header"
    }];
    $("#nav").html(template("navList", { "navList": navList }));
  };

  $('#mainbo-top-nav').on('click', '.activity', function () {
    var w = window.open('about:blank');
    $.support.cors = true;
    $.ajax({
      url: service.activityHost + '/anonymous/activityIndex',
      type: 'GET',
      dataType: "jsonp",
      jsonp: "callback",
      success: function success(data) {
        if (data.code == "success") {
          w.location.href = service.activityHost + data.data + (userInfo ? '?login=true' : '?login=false');
        } else {
          layer.alert(data.msg, { icon: 0 });
        }
      },
      error: function error(data) {
        layer.alert('服务器异常', { icon: 0 });
      }
    });
  });

  $('#mainbo-top-nav').on('click', '.statistics-header', function () {
    if (!userInfo) {
      layer.alert("请登录后操作。", { icon: 0 });
      return false;
    } else {
      verifyApp('b5176e330028457fa78289d6e63eca2f', '2');
    }
  });
  function verifyApp(appId, kindCode) {
    var w = window;
    if (kindCode == '2') {
      w = window.open('about:blank');
    }
    $.support.cors = true;
    $.ajax({
      url: service.prefix + "/pf/api/app/verifyJp.jsonp",
      type: "get",
      data: { "appId": appId },
      dataType: 'jsonp',
      jsonp: "callback",
      success: function success(data) {
        data = data.result;
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

  function getUserInfo() {
    var userJumpHref = {
      'mySpace': service.newSpaceBase + '/home?requireLogin=true',
      'myApp': service.prefix + '/dist/platform/www/persCenter/persApp.html',
      'personCenter': service.prefix + '/dist/platform/www/persCenter/persCenter.html',
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
        success: function success(data) {
          if (data.result.code == "success") {
            userInfo = data.result.data;
            /*判断是否有未读消息*/
            $.ajax({
              type: "get",
              dataType: 'jsonp',
              url: service.prefix + 'pf/api/information/list.jsonp',
              success: function success(data) {
                console.log(data);
                if (data.data.datalist.length > 0) {
                  $.each(data.data.datalist, function (i, d) {
                    if (d.isRead == 0) {
                      $('.message-warn').addClass('has-notread');
                      $('.message-warn').addClass('noread');
                    }
                  });
                }
              },
              error: function error() {}
            });
          } else if (data.code == "login_error") {
            console.log("用户没有登录");
          }
          data.result.userJumpHref = userJumpHref;
          $("#login_message").html(template("loginMessage", { "data": data.result }));
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
    $.getJSON(service.OAHost + '/logout');
    $.ajax({
      url: service.prefix + '/logout',
      type: 'GET',
      dataType: "jsonp",
      jsonp: "callback",
      success: function success(data) {
        if (window.location.href.indexOf("persCenter") != -1) {
          window.location.href = service.htmlHost + "/dist/platform/www/home/index.html";
        } else {
          window.location.reload();
        }
      },
      error: function error() {
        if (window.location.href.indexOf("persCenter") != -1) {
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
  /*消息点击进入消息页面*/
  $("body").delegate(".message-warn", "click", function () {
    window.location.href = service.prefix + '/dist/platform/www/message/message.html';
  });

  /*判断是否有未读消息*/
  /*$.ajax({
    type: "get",
    dataType: 'jsonp',
    callback:'',
    url: service.htmlHost + 'pf/api/information/list',
    success: function(data){
      if(data.data && data.data.datalist.length>0){
        $.each(data.data.datalist,function(i,d){
          if(d.isRead==0){
            $('.message-warn').addClass('has-notread');
            $('.message-warn').addClass('noread');
          }
        })
      }
      },
    error: function () {
    }
  });*/

  return window.mes = {
    getUser: function getUser() {
      return userInfo;
    },
    verifyApp: verifyApp
  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci9qcy9oZWFkZXIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwiJCIsInNlcnZpY2UiLCJ0ZW1wbGF0ZSIsInVzZXJJbmZvIiwiaW5pdE5hdkxpc3QiLCJnZXRVc2VySW5mbyIsIm5hdkxpc3QiLCJwcmVmaXgiLCJzb3VyY2VQbGF0Zm9ybUJhc2UiLCJodG1sSG9zdCIsIm5ld1NwYWNlQmFzZSIsImh0bWwiLCJvbiIsInciLCJ3aW5kb3ciLCJvcGVuIiwic3VwcG9ydCIsImNvcnMiLCJhamF4IiwidXJsIiwiYWN0aXZpdHlIb3N0IiwidHlwZSIsImRhdGFUeXBlIiwianNvbnAiLCJzdWNjZXNzIiwiZGF0YSIsImNvZGUiLCJsb2NhdGlvbiIsImhyZWYiLCJsYXllciIsImFsZXJ0IiwibXNnIiwiaWNvbiIsImVycm9yIiwidmVyaWZ5QXBwIiwiYXBwSWQiLCJraW5kQ29kZSIsInJlc3VsdCIsImNsb3NlIiwidXNlckp1bXBIcmVmIiwiYWRtaW5NYW5hZ2VyIiwibG9jYWxTdG9yYWdlIiwiY29uc29sZSIsImxvZyIsImRhdGFsaXN0IiwibGVuZ3RoIiwiZWFjaCIsImkiLCJkIiwiaXNSZWFkIiwiYWRkQ2xhc3MiLCJvYXV0aExvZ2luIiwiaW5kZXhPZiIsInNwbGl0IiwibG9nb3V0IiwiZ2V0SlNPTiIsIk9BSG9zdCIsInJlbG9hZCIsImRlbGVnYXRlIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsIiRhcnJvdyIsImZpbmQiLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwicGFyZW50cyIsImhpZGUiLCJzaG93IiwiZG9jdW1lbnQiLCJjbGljayIsIm1lcyIsImdldFVzZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFBLE9BQU8sQ0FBQyxRQUFELEVBQVcsU0FBWCxFQUFzQixVQUF0QixDQUFQLEVBQTBDLFVBQVVDLENBQVYsRUFBYUMsT0FBYixFQUFzQkMsUUFBdEIsRUFBZ0M7QUFDeEUsTUFBSUMs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LEVBQWlCOEQsSUFBakIsQ0FBc0IsWUFBdEIsRUFBb0NFLFdBQXBDLENBQWdELFVBQWhEO0FBQ0FoRSxNQUFFLGFBQUYsRUFBaUI4RCxJQUFqQixDQUFzQixJQUF0QixFQUE0QkksSUFBNUI7QUFDRCxHQUhEO0FBSUE7QUFDQWxFLElBQUUsTUFBRixFQUFVMEQsUUFBVixDQUFtQixlQUFuQixFQUFtQyxPQUFuQyxFQUEyQyxZQUFVO0FBQ25ENUMsV0FBT2EsUUFBUCxDQUFnQkMsSUFBaEIsR0FBc0IzQixRQUFRTSxNQUFSLEdBQWlCLHlDQUF2QztBQUNELEdBRkQ7O0FBSUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxTQUFPTyxPQUFPd0QsR0FBUCxHQUFhO0FBQ2xCQyxhQUFTLG1CQUFZO0FBQ25CLGFBQU9wRSxRQUFQO0FBQ0QsS0FIaUI7QUFJbEIrQixlQUFXQTtBQUpPLEdBQXBCO0FBTUQsQ0F2UEQiLCJmaWxlIjoiaGVhZGVyL2pzL2hlYWRlci04OTM2ODBhMjFkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gcmVxdWlyZS5jb25maWcoe1xyXG4vLyAgIHBhdGhzOiB7XHJcbi8vICAgICAnanF1ZXJ5JzogJy4uLy4uLy4uLy4uL2xpYi9qcXVlcnkvanF1ZXJ5LTEuMTEuMi5taW4uanMnLFxyXG4vLyAgICAgJ3NlcnZpY2UnOiAnLi4vLi4vLi4vLi4vYmFzZS9qcy9zZXJ2aWNlLmpzJyxcclxuLy8gICAgICd0ZW1wbGF0ZSc6ICcuLi8uLi8uLi8uLi9saWIvYXJUdGVtcGxhdGUvdGVtcGxhdGUuanMnXHJcbi8vICAgfVxyXG4vLyB9KTtcclxuXHJcbmRlZmluZShbJ2pxdWVyeScsICdzZXJ2aWNlJywgJ3RlbXBsYXRlJ10sIGZ1bmN0aW9uICgkLCBzZXJ2aWNlLCB0ZW1wbGF0ZSkge1xyXG4gIHZhciB1c2VySW5mbyA9IG51bGw7XHJcbiAgaW5pdE5hdkxpc3QoKTtcclxuICBnZXRVc2VySW5mbygpO1xyXG4gIGZ1bmN0aW9uIGluaXROYXZMaXN0KCkge1xyXG4gICAgdmFyIG5hdkxpc3QgPSBbXHJcbiAgICAgIHtcclxuICAgICAgICBcImlkXCI6IFwiMVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiBcIummlumhtVwiLFxyXG4gICAgICAgIFwidXJsXCI6IHNlcnZpY2UucHJlZml4ICsgXCIvZGlzdC9wbGF0Zm9ybS93d3cvaG9tZS9pbmRleC5odG1sXCIsXHJcbiAgICAgICAgXCJpY29udXJsXCI6IHNlcnZpY2UucHJlZml4ICsgXCIvZGlzdC9wdWJsaWMvaGVhZGVyL2ltYWdlcy9pbmRleC5wbmdcIixcclxuICAgICAgICAnbmV3T3Blbic6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImlkXCI6IFwiMlwiLFxyXG4gICAgICAgIFwibmFtZVwiOiBcIui1hOa6kFwiLFxyXG4gICAgICAgIFwidXJsXCI6IHNlcnZpY2Uuc291cmNlUGxhdGZvcm1CYXNlICsgXCI/cmVxdWlyZUxvZ2luPWZhbHNlXCIsXHJcbiAgICAgICAgXCJpY29udXJsXCI6IHNlcnZpY2UuaHRtbEhvc3QgKyBcIi9kaXN0L3B1YmxpYy9oZWFkZXIvaW1hZ2VzL3Jlc291cmNlLnBuZ1wiLFxyXG4gICAgICAgICduZXdPcGVuJzogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjNcIixcclxuICAgICAgICBcIm5hbWVcIjogXCLlupTnlKhcIixcclxuICAgICAgICBcInVybFwiOiBzZXJ2aWNlLnByZWZpeCArIFwiL2Rpc3QvcGxhdGZvcm0vd3d3L2FwcC9hcHBsaWNhdGlvbi5odG1sXCIsXHJcbiAgICAgICAgXCJpY29udXJsXCI6IHNlcnZpY2UuaHRtbEhvc3QgKyBcIi9kaXN0L3B1YmxpYy9oZWFkZXIvaW1hZ2VzL2FwcC5wbmdcIixcclxuICAgICAgICAnbmV3T3Blbic6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImlkXCI6IFwiNFwiLFxyXG4gICAgICAgIFwibmFtZVwiOiBcIuepuumXtFwiLFxyXG4gICAgICAgIFwidXJsXCI6IHNlcnZpY2UubmV3U3BhY2VCYXNlICsgXCIvSkNlbnRlckhvbWUvd3d3L2ludGVyc3BhY2UvaW50ZXJzcGFjZS5odG1sXCIsXHJcbiAgICAgICAgXCJpY29udXJsXCI6IHNlcnZpY2UuaHRtbEhvc3QgKyBcIi9kaXN0L3B1YmxpYy9oZWFkZXIvaW1hZ2VzL3NwYWNlLnBuZ1wiLFxyXG4gICAgICAgICduZXdPcGVuJzogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiaWRcIjogXCI1XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IFwi5rS75YqoXCIsXHJcbiAgICAgICAgXCJ1cmxcIjogXCJqYXZhc2NyaXB0OnZvaWQoMCk7XCIsXHJcbiAgICAgICAgXCJpY29udXJsXCI6IFwiXCIsXHJcbiAgICAgICAgJ25ld09wZW4nOiBmYWxzZSxcclxuICAgICAgICBcImNsYXNzXCI6IFwiYWN0aXZpdHlcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJpZFwiOiBcIjZcIixcclxuICAgICAgICBcIm5hbWVcIjogXCLmlbDmja5cIixcclxuICAgICAgICBcInVybFwiOiBcImphdmFzY3JpcHQ6dm9pZCgwKTtcIixcclxuICAgICAgICBcImljb251cmxcIjogXCJcIixcclxuICAgICAgICAnbmV3T3Blbic6IGZhbHNlLFxyXG4gICAgICAgIFwiY2xhc3NcIjogXCJzdGF0aXN0aWNzLWhlYWRlclwiXHJcbiAgICAgIH1cclxuICAgIF07XHJcbiAgICAkKFwiI25hdlwiKS5odG1sKHRlbXBsYXRlKFwibmF2TGlzdFwiLCB7XCJuYXZMaXN0XCI6IG5hdkxpc3R9KSk7XHJcbiAgfTtcclxuXHJcbiAgJCgnI21haW5iby10b3AtbmF2Jykub24oJ2NsaWNrJywgJy5hY3Rpdml0eScsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3ID0gd2luZG93Lm9wZW4oJ2Fib3V0OmJsYW5rJyk7XHJcbiAgICAkLnN1cHBvcnQuY29ycyA9IHRydWU7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IHNlcnZpY2UuYWN0aXZpdHlIb3N0ICsgJy9hbm9ueW1vdXMvYWN0aXZpdHlJbmRleCcsXHJcbiAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxyXG4gICAgICBqc29ucDogXCJjYWxsYmFja1wiLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIGlmIChkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgIHcubG9jYXRpb24uaHJlZiA9IHNlcnZpY2UuYWN0aXZpdHlIb3N0ICsgZGF0YS5kYXRhICsgKCB1c2VySW5mbyA/ICc/bG9naW49dHJ1ZScgOiAnP2xvZ2luPWZhbHNlJyApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsYXllci5hbGVydChkYXRhLm1zZywge2ljb246IDB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIGxheWVyLmFsZXJ0KCfmnI3liqHlmajlvILluLgnLCB7aWNvbjogMH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgJCgnI21haW5iby10b3AtbmF2Jykub24oJ2NsaWNrJywgJy5zdGF0aXN0aWNzLWhlYWRlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghdXNlckluZm8pIHtcclxuICAgICAgbGF5ZXIuYWxlcnQoXCLor7fnmbvlvZXlkI7mk43kvZzjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmVyaWZ5QXBwKCdiNTE3NmUzMzAwMjg0NTdmYTc4Mjg5ZDZlNjNlY2EyZicsICcyJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgZnVuY3Rpb24gdmVyaWZ5QXBwKGFwcElkLCBraW5kQ29kZSkge1xyXG4gICAgdmFyIHcgPSB3aW5kb3c7XHJcbiAgICBpZiAoa2luZENvZGUgPT0gJzInKSB7XHJcbiAgICAgIHcgPSB3aW5kb3cub3BlbignYWJvdXQ6YmxhbmsnKVxyXG4gICAgfVxyXG4gICAgJC5zdXBwb3J0LmNvcnMgPSB0cnVlO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiBzZXJ2aWNlLnByZWZpeCArIFwiL3BmL2FwaS9hcHAvdmVyaWZ5SnAuanNvbnBcIixcclxuICAgICAgdHlwZTogXCJnZXRcIixcclxuICAgICAgZGF0YToge1wiYXBwSWRcIjogYXBwSWR9LFxyXG4gICAgICBkYXRhVHlwZTogJ2pzb25wJyxcclxuICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICBkYXRhID0gZGF0YS5yZXN1bHQ7XHJcbiAgICAgICAgaWYgKGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgdy5sb2NhdGlvbi5ocmVmID0gZGF0YS5kYXRhO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YS5jb2RlID09IFwiZmFpbGVkXCIpIHtcclxuICAgICAgICAgIGlmIChraW5kQ29kZSA9PSAnMicpIHtcclxuICAgICAgICAgICAgdy5jbG9zZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICBsYXllci5hbGVydChcIuivt+axguWksei0pVwiLCB7aWNvbjogMH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gZ2V0VXNlckluZm8oKSB7XHJcbiAgICB2YXIgdXNlckp1bXBIcmVmID0ge1xyXG4gICAgICAnbXlTcGFjZSc6IHNlcnZpY2UubmV3U3BhY2VCYXNlICsgJy9ob21lP3JlcXVpcmVMb2dpbj10cnVlJyxcclxuICAgICAgJ215QXBwJzogc2VydmljZS5wcmVmaXggKyAnL2Rpc3QvcGxhdGZvcm0vd3d3L3BlcnNDZW50ZXIvcGVyc0FwcC5odG1sJyxcclxuICAgICAgJ3BlcnNvbkNlbnRlcic6IHNlcnZpY2UucHJlZml4ICsgJy9kaXN0L3BsYXRmb3JtL3d3dy9wZXJzQ2VudGVyL3BlcnNDZW50ZXIuaHRtbCcsXHJcbiAgICAgICdzcGFjZU1hbmFnZXInOiBzZXJ2aWNlLm5ld1NwYWNlQmFzZSArICcvaG9tZT9yZXF1aXJlTG9naW49dHJ1ZScsXHJcbiAgICAgICdtYW5hZ2VyQ2VudGVyJzogc2VydmljZS5uZXdTcGFjZUJhc2UgKyAnL0pDZW50ZXJIb21lL3BlcnNDZW50ZXIvbWFuYWdlQ2VuLmh0bWw/c3BhY2VJZD1jZGYyNjg1MTc4MGQ0MTAyOWZhMTQ5ZWMzZjIxYzRkZiZzcGFjZVR5cGU9c2Nob29sJyxcclxuICAgICAgJ2FkbWluTWFuYWdlcic6IHNlcnZpY2UuYWRtaW5NYW5hZ2VyXHJcbiAgICB9O1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS51c2VySW5mbykge1xyXG4gICAgICB1c2VySW5mbyA9IGxvY2FsU3RvcmFnZS51c2VySW5mbztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8v6K+35rGC6I635Y+WXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBzZXJ2aWNlLnByZWZpeCArICcvcGYvYXBpL2hlYWRlci91c2VyLmpzb25wJyxcclxuICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxyXG4gICAgICAgIGpzb25wOiBcImNhbGxiYWNrXCIsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIGlmIChkYXRhLnJlc3VsdC5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgIHVzZXJJbmZvID0gZGF0YS5yZXN1bHQuZGF0YTtcclxuICAgICAgICAgICAgLyrliKTmlq3mmK/lkKbmnInmnKror7vmtojmga8qL1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwiZ2V0XCIsXHJcbiAgICAgICAgICAgICAgZGF0YVR5cGU6J2pzb25wJyxcclxuICAgICAgICAgICAgICB1cmw6IHNlcnZpY2UucHJlZml4ICsgJ3BmL2FwaS9pbmZvcm1hdGlvbi9saXN0Lmpzb25wJyxcclxuICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgaWYoZGF0YS5kYXRhLmRhdGFsaXN0Lmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuZGF0YS5kYXRhbGlzdCxmdW5jdGlvbihpLGQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGQuaXNSZWFkPT0wKXtcclxuICAgICAgICAgICAgICAgICAgICAgICQoJy5tZXNzYWdlLXdhcm4nKS5hZGRDbGFzcygnaGFzLW5vdHJlYWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICQoJy5tZXNzYWdlLXdhcm4nKS5hZGRDbGFzcygnbm9yZWFkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmNvZGUgPT0gXCJsb2dpbl9lcnJvclwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi55So5oi35rKh5pyJ55m75b2VXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZGF0YS5yZXN1bHQudXNlckp1bXBIcmVmID0gdXNlckp1bXBIcmVmO1xyXG4gICAgICAgICAgJChcIiNsb2dpbl9tZXNzYWdlXCIpLmh0bWwodGVtcGxhdGUoXCJsb2dpbk1lc3NhZ2VcIiwge1wiZGF0YVwiOiBkYXRhLnJlc3VsdH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqIOW5s+WPsOeZu+W9leaWueazlShvYXV0aCnmlrnms5UqL1xyXG4gIGZ1bmN0aW9uIG9hdXRoTG9naW4oKSB7XHJcbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcbiAgICBpZiAodXJsLmluZGV4T2YoXCIjcGFnZVwiKSkge1xyXG4gICAgICB1cmwgPSB1cmwuc3BsaXQoXCIjcGFnZVwiKVswXTtcclxuICAgIH1cclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2VydmljZS5wcmVmaXggKyAnL2xvZ2luP3JlZGlyZWN0VXJsPScgKyB1cmw7XHJcbiAgfTtcclxuICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAkLmdldEpTT04oc2VydmljZS5PQUhvc3QrJy9sb2dvdXQnKTtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogc2VydmljZS5wcmVmaXggKyAnL2xvZ291dCcsXHJcbiAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxyXG4gICAgICBqc29ucDogXCJjYWxsYmFja1wiLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwicGVyc0NlbnRlclwiKSAhPSAtMSkge1xyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzZXJ2aWNlLmh0bWxIb3N0ICsgXCIvZGlzdC9wbGF0Zm9ybS93d3cvaG9tZS9pbmRleC5odG1sXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJwZXJzQ2VudGVyXCIpICE9IC0xKSB7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlcnZpY2UuaHRtbEhvc3QgKyBcIi9kaXN0L3BsYXRmb3JtL3d3dy9ob21lL2luZGV4Lmh0bWxcIjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuICAkKFwiYm9keVwiKS5kZWxlZ2F0ZShcIi5tYWluYm8tdG9wLW5hdiAubG9naW5CdXR0b25cIiwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBvYXV0aExvZ2luKCk7XHJcbiAgfSk7XHJcbiAgJChcImJvZHlcIikuZGVsZWdhdGUoXCIubG9nb3V0XCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgbG9nb3V0KCk7XHJcbiAgfSk7XHJcbiAgJChcImJvZHlcIikuZGVsZWdhdGUoXCIubG9naW5fdXNlciAubG9naW5fdXNlcm5hbWVcIiwgXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIHZhciAkYXJyb3cgPSAkKHRoaXMpLmZpbmQoXCJzcGFuLmFycm93XCIpO1xyXG4gICAgaWYgKCRhcnJvdy5oYXNDbGFzcyhcImFycm93X3VwXCIpKSB7XHJcbiAgICAgICRhcnJvdy5yZW1vdmVDbGFzcyhcImFycm93X3VwXCIpO1xyXG4gICAgICAkKHRoaXMpLnBhcmVudHMoXCIubG9naW5fdXNlclwiKS5maW5kKFwidWxcIikuaGlkZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJGFycm93LmFkZENsYXNzKFwiYXJyb3dfdXBcIik7XHJcbiAgICAgICQodGhpcykucGFyZW50cyhcIi5sb2dpbl91c2VyXCIpLmZpbmQoXCJ1bFwiKS5zaG93KCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgJChkb2N1bWVudCkuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgJChcIi5sb2dpbl91c2VyXCIpLmZpbmQoXCJzcGFuLmFycm93XCIpLnJlbW92ZUNsYXNzKFwiYXJyb3dfdXBcIik7XHJcbiAgICAkKFwiLmxvZ2luX3VzZXJcIikuZmluZChcInVsXCIpLmhpZGUoKTtcclxuICB9KTtcclxuICAvKua2iOaBr+eCueWHu+i/m+WFpea2iOaBr+mhtemdoiovXHJcbiAgJChcImJvZHlcIikuZGVsZWdhdGUoXCIubWVzc2FnZS13YXJuXCIsXCJjbGlja1wiLGZ1bmN0aW9uKCl7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0gc2VydmljZS5wcmVmaXggKyAnL2Rpc3QvcGxhdGZvcm0vd3d3L21lc3NhZ2UvbWVzc2FnZS5odG1sJztcclxuICB9KTtcclxuXHJcbiAgLyrliKTmlq3mmK/lkKbmnInmnKror7vmtojmga8qL1xyXG4gIC8qJC5hamF4KHtcclxuICAgIHR5cGU6IFwiZ2V0XCIsXHJcbiAgICBkYXRhVHlwZTogJ2pzb25wJyxcclxuICAgIGNhbGxiYWNrOicnLFxyXG4gICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJ3BmL2FwaS9pbmZvcm1hdGlvbi9saXN0JyxcclxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICBpZihkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmRhdGFsaXN0Lmxlbmd0aD4wKXtcclxuICAgICAgICAkLmVhY2goZGF0YS5kYXRhLmRhdGFsaXN0LGZ1bmN0aW9uKGksZCl7XHJcbiAgICAgICAgICBpZihkLmlzUmVhZD09MCl7XHJcbiAgICAgICAgICAgICQoJy5tZXNzYWdlLXdhcm4nKS5hZGRDbGFzcygnaGFzLW5vdHJlYWQnKTtcclxuICAgICAgICAgICAgJCgnLm1lc3NhZ2Utd2FybicpLmFkZENsYXNzKCdub3JlYWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB9XHJcbiAgfSk7Ki9cclxuXHJcbiAgcmV0dXJuIHdpbmRvdy5tZXMgPSB7XHJcbiAgICBnZXRVc2VyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB1c2VySW5mbztcclxuICAgIH0sXHJcbiAgICB2ZXJpZnlBcHA6IHZlcmlmeUFwcFxyXG4gIH1cclxufSk7XHJcblxyXG5cdFxyXG5cdCAgXHJcbiJdfQ==

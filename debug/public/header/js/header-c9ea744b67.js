'use strict';

// require.config({
//   paths: {
//     'jquery': '../../../../lib/jquery/jquery-1-5790ead7ad.11.2.min.js',
//     'service': '../../../../base/js/service-5ba6dc5529.js',
//     'tools': '../../../../base/js/tools-742156ed1a.js',
//     'template': '../../../../lib/arTtemplate/template-dd622e58c9.js',
//     'orgConfig':'../../../../config/orgConfig.js',
//     'addFav':'../../../../public/header/js/addFav-98ac8fb349.js',
//     'appVerify':'../../../../public/header/js/appVerify-a48f01e5f5.js'
//   }
// });
define(['jquery', 'service', 'orgConfig', 'tools', 'template', 'addFav', 'appVerify'], function ($, service, orgConfig, tools, template, addFav, appVerify) {
  var userInfo = null; //用户信息
  var schoolList = null; //白银区下学校列表
  var userRole = ""; //活动运营用户角色
  initNavList();
  //getAppId('byqjyjID');
  initSchoolList($("#schoolList"), 'school_list', orgConfig.orgIds.baiyinAreaId);
  getUserInfo();

  /*
  * 首页显示下拉
  * */
  var curOpenPage = window.location.href.split("/")[window.location.href.split("/").length - 1];
  var curOpenPage1 = window.location.href.split("/")[window.location.href.split("/").length - 2];
  if (curOpenPage == 'index.html' && curOpenPage1 == 'home') {
    $('.chooseArea').show();
  } else {
    $(".chooseArea").hide();
  }

  function initNavList() {
    var navList = [{
      "id": "1",
      "name": "首页",
      "url": service.htmlHost + "/dist/platform/www/home/index.html",
      'newOpen': false
    }, {
      "id": "2",
      "name": "新闻",
      "url": service.htmlHost + "/dist/platform/www/news/sitenewsListInCategory.html",
      'newOpen': false
    }, {
      "id": "3",
      "name": "资源",
      "url": "",
      'childNav': [{
        'id': '31',
        'name': '本地资源',
        "url": "javascript:void(0)",
        'newOpen': false,
        'type': 'resources_appId'
      }, {
        'id': '32',
        'name': '在线资源',
        'url': service.sourcePlatformBase + "/syncTeaching/index?requireLogin=false",
        'newOpen': false
      }]
    }, {
      "id": "7",
      "name": "视频",
      "url": "javascript:void(0)",
      "type": "video",
      'newOpen': false
    }, {
      "id": "6",
      "name": "教研",
      "url": "javascript:void(0)",
      'newOpen': false,
      'type': 'teachingresearch_appId'
    }, {
      "id": "4",
      "name": "活动",
      "url": "javascript:void(0)",
      'newOpen': false,
      'type': 'activityId'
    }, {
      "id": "5",
      "name": "社区",
      "url": service.newSpaceBase + "/JCenterHome/www/interspace/interspace.html",
      'newOpen': false
    }];
    var data = { "navList": navList };
    $("#nav .nav_bottom ul").html(template("navList", data));
  };
  function initSchoolList($obj, temId, areaId) {
    var url = service.htmlHost + '/pf/api/schshow/orgs';
    if (areaId) url += '?areaId=' + areaId;
    $.ajax({
      url: url,
      type: 'GET',
      success: function success(data) {
        if (data && data.code == "success") {
          if (data.data && data.data.length > 0) {
            $.each(data.data, function (i) {
              data.data[i].showName = tools.hideTextByLen(data.data[i].name, 10);
            });
            schoolList = data.data;
            $obj.html(template(temId, data));
          }
        } else {
          layer.alert(data.msg, { icon: 0 });
        }
      },
      error: function error(data) {
        layer.alert("获取学校信息异常。", { icon: 0 });
      }
    });
  }
  function getUserInfo() {
    var userJumpHref = {
      'mySpace': service.newSpaceBase + '/home?requireLogin=true',
      'myApp': service.htmlHost + '/dist/platform/www/app/app.html',
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
        success: function success(data) {
          if (data.result.code == "success") {
            userInfo = data.result.data;
            if ($("#reviewEnter").length > 0) {
              getUserRole(userInfo.id);
            }
          } else if (data.code == "login_error") {
            console.log("用户没有登录");
          }
          data.result.userJumpHref = userJumpHref;
          $("#login_message").append(template("loginMessage", { "data": data.result }));
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
      success: function success(data) {
        if (window.location.href.indexOf("persCenter")) {
          window.location.href = service.htmlHost + "/dist/platform/www/home/index.html";
        } else {
          window.location.reload();
        }
      },
      error: function error() {
        if (window.location.href.indexOf("persCenter")) {
          window.location.href = service.htmlHost + "/dist/platform/www/home/index.html";
        } else {
          window.location.reload();
        }
      }
    });
  };
  function getUserRole(userId) {
    $.ajax({
      url: service.activityHost + '/authority/anonymous/getAuthority?userId=' + userId,
      type: 'GET',
      dataType: "jsonp",
      jsonp: "callbackuser",
      success: function success(data) {
        userRole = data.data.roleId;
      },
      error: function error(data) {
        layer.alert('服务器异常', { icon: 0 });
      }
    });
  };
  $("body").delegate("#login_message .loginButton", "click", function () {
    oauthLogin();
  });
  $("body").delegate(".logout", "click", function () {
    logout();
  });
  $("body").delegate("#login_message .userName>span , .chooseArea .area , .resourceNav>a", "click", function (e) {
    e.stopPropagation();
    var $arrow = $(this).find("span.arrow");
    if ($arrow.hasClass("arrowUp")) {
      $arrow.addClass("arrowDown").removeClass("arrowUp");
      $(this).parent().find(".chooseList").hide();
    } else {
      $arrow.addClass("arrowUp").removeClass("arrowDown");
      $(this).parent().find(".chooseList").show();
    }
  });

  $(document).click(function () {
    $("span.arrow").removeClass("arrowUp").addClass("arrowDown");
    $(".chooseList").hide();
  });
  $("body").delegate('#nav .verify_app_enter', 'click', function () {
    if ($(this).attr('type') == 'activityId') {
      $.ajax({
        url: service.activityHost + '/anonymous/activityIndex',
        type: 'GET',
        dataType: "jsonp",
        jsonp: "callback",
        success: function success(data) {
          if (data.code == "success") {
            window.location.href = service.activityHost + data.data + (userInfo ? '?login=true' : '?login=false');
          } else {
            layer.alert(data.msg, { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert('服务器异常', { icon: 0 });
        }
      });
    } else if ($(this).attr('type') == 'teachingresearch_appId') {
      if (userInfo) {
        appVerify.verifyApp(service.appIds[$(this).attr('type')], '2', '', 'about:self');
      } else {
        window.location.href = service.htmlHost + "/dist/platform/www/jy/jy.html";
      }
    } else if ($(this).attr('type') == 'video') {
      if (userInfo) {
        appVerify.verifyApp(service.appIds['hanbovideo_appId'], '2', '', 'about:self');
      } else {
        layer.alert("请登录后操作。", { icon: 0 });
        return;
      }
    }
  });
  $("body").delegate('#nav .list a', 'click', function () {
    $(this).parents('.resource').siblings().addClass('nav_act');
    if ($(this).attr('type') == 'resources_appId') {
      if (userInfo) {
        window.location.href = service.sourceSystemBase + '/apps.do';
      } else {
        window.location.href = service.htmlHost + "/dist/platform/www/resources/resources.html";
      }
    }
  });

  return window.mes = {
    getUser: function getUser() {
      return userInfo;
    },
    getSchoolList: function getSchoolList() {
      return schoolList;
    },
    getUserRole: function getUserRole() {
      return userRole;
    }

  };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci9qcy9oZWFkZXIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwiJCIsInNlcnZpY2UiLCJvcmdDb25maWciLCJ0b29scyIsInRlbXBsYXRlIiwiYWRkRmF2IiwiYXBwVmVyaWZ5IiwidXNlckluZm8iLCJzY2hvb2xMaXN0IiwidXNlclJvbGUiLCJpbml0TmF2TGlzdCIsImluaXRTY2hvb2xMaXN0Iiwib3JnSWRzIiwiYmFpeWluQXJlYUlkIiwiZ2V0VXNlckluZm8iLCJjdXJPcGVuUGFnZSIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInNwbGl0IiwibGVuZ3RoIiwiY3VyT3BlblBhZ2UxIiwic2hvdyIsImhpZGUiLCJuYXZMaXN0IiwiaHRtbEhvc3QiLCJzb3VyY2VQbGF0Zm9ybUJhc2UiLCJuZXdTcGFjZUJhc2UiLCJkYXRhIiwiaHRtbCIsIiRvYmoiLCJ0ZW1JZCIsImFyZWFJZCIsInVybCIsImFqYXgiLCJ0eXBlIiwic3VjY2VzcyIsImNvZGUiLCJlYWNoIiwiaSIsInNob3dOYW1lIiwiaGlkZVRleHRCeUxlbiIsIm5hbWUiLCJsYXllciIsImFsZXJ0IiwibXNnIiwiaWNvbiIsImVycm9yIiwidXNlckp1bXBIcmVmIiwiYWRtaW5NYW5hZ2VyIiwibG9jYWxTdG9yYWdlIiwicHJlZml4IiwiZGF0YVR5cGUiLCJqc29ucCIsInJlc3VsdCIsImdldFVzZXJSb2xlIiwiaWQiLCJjb25zb2xlIiwibG9nIiwiYXBwZW5kIiwib2F1dGhMb2dpbiIsImluZGV4T2YiLCJsb2dvdXQiLCJyZWxvYWQiLCJ1c2VySWQiLCJhY3Rpdml0eUhvc3QiLCJyb2xlSWQiLCJkZWxlZ2F0ZSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCIkYXJyb3ciLCJmaW5kIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiZG9jdW1lbnQiLCJjbGljayIsImF0dHIiLCJ2ZXJpZnlBcHAiLCJhcHBJZHMiLCJwYXJlbnRzIiwic2libGluZ3MiLCJz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QUFoQixHQUF1QmpCLFFBQVF3QixRQUFSLEdBQWlCLDZDQUF4QztBQUNEO0FBQ0Y7QUFDRixHQVREOztBQVdBLFNBQU9ULE9BQU9vRSxHQUFQLEdBQWE7QUFDbEJDLGFBQVUsbUJBQVk7QUFDcEIsYUFBTzlFLFFBQVA7QUFDRCxLQUhpQjtBQUlsQitFLG1CQUFnQix5QkFBWTtBQUMxQixhQUFPOUUsVUFBUDtBQUNELEtBTmlCO0FBT2xCK0MsaUJBQWMsdUJBQVk7QUFDeEIsYUFBTzlDLFFBQVA7QUFDRDs7QUFUaUIsR0FBcEI7QUFZRCxDQTFRRCIsImZpbGUiOiJoZWFkZXIvanMvaGVhZGVyLWM5ZWE3NDRiNjcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyByZXF1aXJlLmNvbmZpZyh7XHJcbi8vICAgcGF0aHM6IHtcclxuLy8gICAgICdqcXVlcnknOiAnLi4vLi4vLi4vLi4vbGliL2pxdWVyeS9qcXVlcnktMS4xMS4yLm1pbi5qcycsXHJcbi8vICAgICAnc2VydmljZSc6ICcuLi8uLi8uLi8uLi9iYXNlL2pzL3NlcnZpY2UuanMnLFxyXG4vLyAgICAgJ3Rvb2xzJzogJy4uLy4uLy4uLy4uL2Jhc2UvanMvdG9vbHMuanMnLFxyXG4vLyAgICAgJ3RlbXBsYXRlJzogJy4uLy4uLy4uLy4uL2xpYi9hclR0ZW1wbGF0ZS90ZW1wbGF0ZS5qcycsXHJcbi8vICAgICAnb3JnQ29uZmlnJzonLi4vLi4vLi4vLi4vY29uZmlnL29yZ0NvbmZpZy5qcycsXHJcbi8vICAgICAnYWRkRmF2JzonLi4vLi4vLi4vLi4vcHVibGljL2hlYWRlci9qcy9hZGRGYXYuanMnLFxyXG4vLyAgICAgJ2FwcFZlcmlmeSc6Jy4uLy4uLy4uLy4uL3B1YmxpYy9oZWFkZXIvanMvYXBwVmVyaWZ5LmpzJ1xyXG4vLyAgIH1cclxuLy8gfSk7XHJcbmRlZmluZShbJ2pxdWVyeScgLCAnc2VydmljZScgLCAnb3JnQ29uZmlnJyAsJ3Rvb2xzJyAsICd0ZW1wbGF0ZScgLCAnYWRkRmF2JyAsICdhcHBWZXJpZnknXSAsIGZ1bmN0aW9uICggJCAsIHNlcnZpY2UgLCBvcmdDb25maWcgLCB0b29scyAsIHRlbXBsYXRlICwgYWRkRmF2ICwgYXBwVmVyaWZ5KSB7XHJcbiAgdmFyIHVzZXJJbmZvID0gbnVsbDsvL+eUqOaIt+S/oeaBr1xyXG4gIHZhciBzY2hvb2xMaXN0ID0gbnVsbDsvL+eZvemTtuWMuuS4i+WtpuagoeWIl+ihqFxyXG4gIHZhciB1c2VyUm9sZSA9IFwiXCI7Ly/mtLvliqjov5DokKXnlKjmiLfop5LoibJcclxuICBpbml0TmF2TGlzdCgpO1xyXG4gIC8vZ2V0QXBwSWQoJ2J5cWp5aklEJyk7XHJcbiAgaW5pdFNjaG9vbExpc3QoICQoXCIjc2Nob29sTGlzdFwiKSAsICdzY2hvb2xfbGlzdCcgLCBvcmdDb25maWcub3JnSWRzLmJhaXlpbkFyZWFJZCApO1xyXG4gIGdldFVzZXJJbmZvKCk7XHJcblxyXG4gIC8qXHJcbiAgKiDpppbpobXmmL7npLrkuIvmi4lcclxuICAqICovXHJcbiAgdmFyIGN1ck9wZW5QYWdlID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIvXCIpWyh3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdChcIi9cIikpLmxlbmd0aC0xXTtcclxuICB2YXIgY3VyT3BlblBhZ2UxID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIvXCIpWyh3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdChcIi9cIikpLmxlbmd0aC0yXTtcclxuICBpZihjdXJPcGVuUGFnZSA9PSAnaW5kZXguaHRtbCcgJiYgY3VyT3BlblBhZ2UxID09ICdob21lJyl7XHJcbiAgICAkKCcuY2hvb3NlQXJlYScpLnNob3coKTtcclxuICB9ZWxzZXtcclxuICAgICQoXCIuY2hvb3NlQXJlYVwiKS5oaWRlKCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpbml0TmF2TGlzdCgpIHtcclxuICAgIHZhciBuYXZMaXN0ID0gW1xyXG4gICAgICB7XHJcbiAgICAgICAgXCJpZFwiIDogXCIxXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IFwi6aaW6aG1XCIsXHJcbiAgICAgICAgXCJ1cmxcIjogc2VydmljZS5odG1sSG9zdCtcIi9kaXN0L3BsYXRmb3JtL3d3dy9ob21lL2luZGV4Lmh0bWxcIixcclxuICAgICAgICAnbmV3T3BlbicgOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJpZFwiIDogXCIyXCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IFwi5paw6Ze7XCIsXHJcbiAgICAgICAgXCJ1cmxcIjogc2VydmljZS5odG1sSG9zdCtcIi9kaXN0L3BsYXRmb3JtL3d3dy9uZXdzL3NpdGVuZXdzTGlzdEluQ2F0ZWdvcnkuaHRtbFwiLFxyXG4gICAgICAgICduZXdPcGVuJyA6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImlkXCIgOiBcIjNcIixcclxuICAgICAgICBcIm5hbWVcIjogXCLotYTmupBcIixcclxuICAgICAgICBcInVybFwiOiBcIlwiLFxyXG4gICAgICAgICdjaGlsZE5hdicgOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICdpZCcgOiAnMzEnLFxyXG4gICAgICAgICAgICAnbmFtZScgOiAn5pys5Zyw6LWE5rqQJyxcclxuICAgICAgICAgICAgXCJ1cmxcIjogXCJqYXZhc2NyaXB0OnZvaWQoMClcIixcclxuICAgICAgICAgICAgJ25ld09wZW4nIDogZmFsc2UsXHJcbiAgICAgICAgICAgICd0eXBlJyA6ICdyZXNvdXJjZXNfYXBwSWQnXHJcbiAgICAgICAgICB9LHtcclxuICAgICAgICAgICAgJ2lkJyA6ICczMicsXHJcbiAgICAgICAgICAgICduYW1lJyA6ICflnKjnur/otYTmupAnLFxyXG4gICAgICAgICAgICAndXJsJyA6IHNlcnZpY2Uuc291cmNlUGxhdGZvcm1CYXNlICsgXCIvc3luY1RlYWNoaW5nL2luZGV4P3JlcXVpcmVMb2dpbj1mYWxzZVwiLFxyXG4gICAgICAgICAgICAnbmV3T3BlbicgOiBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiaWRcIiA6IFwiN1wiLFxyXG4gICAgICAgIFwibmFtZVwiOiBcIuinhumikVwiLFxyXG4gICAgICAgIFwidXJsXCI6IFwiamF2YXNjcmlwdDp2b2lkKDApXCIsXHJcbiAgICAgICAgXCJ0eXBlXCI6XCJ2aWRlb1wiLFxyXG4gICAgICAgICduZXdPcGVuJyA6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBcImlkXCIgOiBcIjZcIixcclxuICAgICAgICBcIm5hbWVcIjogXCLmlZnnoJRcIixcclxuICAgICAgICBcInVybFwiOiBcImphdmFzY3JpcHQ6dm9pZCgwKVwiLFxyXG4gICAgICAgICduZXdPcGVuJyA6IGZhbHNlLFxyXG4gICAgICAgICd0eXBlJyA6ICd0ZWFjaGluZ3Jlc2VhcmNoX2FwcElkJ1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgXCJpZFwiIDogXCI0XCIsXHJcbiAgICAgICAgXCJuYW1lXCI6IFwi5rS75YqoXCIsXHJcbiAgICAgICAgXCJ1cmxcIjogXCJqYXZhc2NyaXB0OnZvaWQoMClcIixcclxuICAgICAgICAnbmV3T3BlbicgOiBmYWxzZSxcclxuICAgICAgICAndHlwZScgOiAnYWN0aXZpdHlJZCdcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIFwiaWRcIiA6IFwiNVwiLFxyXG4gICAgICAgIFwibmFtZVwiOiBcIuekvuWMulwiLFxyXG4gICAgICAgIFwidXJsXCI6IHNlcnZpY2UubmV3U3BhY2VCYXNlICsgXCIvSkNlbnRlckhvbWUvd3d3L2ludGVyc3BhY2UvaW50ZXJzcGFjZS5odG1sXCIsXHJcbiAgICAgICAgJ25ld09wZW4nIDogZmFsc2VcclxuICAgICAgfVxyXG4gICAgXTtcclxuICAgIHZhciBkYXRhID0ge1wibmF2TGlzdFwiIDogbmF2TGlzdCB9O1xyXG4gICAgJChcIiNuYXYgLm5hdl9ib3R0b20gdWxcIikuaHRtbCggdGVtcGxhdGUoXCJuYXZMaXN0XCIsIGRhdGEgKSApO1xyXG4gIH07XHJcbiAgZnVuY3Rpb24gaW5pdFNjaG9vbExpc3QoICRvYmogLCB0ZW1JZCAsIGFyZWFJZCApIHtcclxuICAgIHZhciB1cmwgPSBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvc2Noc2hvdy9vcmdzJztcclxuICAgIGlmKCBhcmVhSWQgKSB1cmwgKz0gJz9hcmVhSWQ9JythcmVhSWQ7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmwgOiB1cmwsXHJcbiAgICAgIHR5cGUgOidHRVQnLFxyXG4gICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgaWYoIGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiICl7XHJcbiAgICAgICAgICBpZiggZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGg+MCApe1xyXG4gICAgICAgICAgICAkLmVhY2goIGRhdGEuZGF0YSAsIGZ1bmN0aW9uKCBpICl7XHJcbiAgICAgICAgICAgICAgZGF0YS5kYXRhW2ldLnNob3dOYW1lID0gdG9vbHMuaGlkZVRleHRCeUxlbiggZGF0YS5kYXRhW2ldLm5hbWUgLCAxMCApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2Nob29sTGlzdCA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgICAgJG9iai5odG1sKCB0ZW1wbGF0ZSggdGVtSWQgLCBkYXRhICkgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGxheWVyLmFsZXJ0KCBkYXRhLm1zZyAsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBlcnJvciA6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5blrabmoKHkv6Hmga/lvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuICBmdW5jdGlvbiBnZXRVc2VySW5mbygpIHtcclxuICAgIHZhciB1c2VySnVtcEhyZWYgPSB7XHJcbiAgICAgICdteVNwYWNlJyA6IHNlcnZpY2UubmV3U3BhY2VCYXNlICsgJy9ob21lP3JlcXVpcmVMb2dpbj10cnVlJyxcclxuICAgICAgJ215QXBwJyA6IHNlcnZpY2UuaHRtbEhvc3QrJy9kaXN0L3BsYXRmb3JtL3d3dy9hcHAvYXBwLmh0bWwnLFxyXG4gICAgICAncGVyc29uQ2VudGVyJyA6IHNlcnZpY2UuaHRtbEhvc3QrJy9kaXN0L3BsYXRmb3JtL3d3dy9wZXJzQ2VudGVyL3BlcnNDZW50ZXIuaHRtbCcsXHJcbiAgICAgICdzcGFjZU1hbmFnZXInIDogc2VydmljZS5uZXdTcGFjZUJhc2UgKyAnL2hvbWU/cmVxdWlyZUxvZ2luPXRydWUnLFxyXG4gICAgICAnbWFuYWdlckNlbnRlcicgOiBzZXJ2aWNlLm5ld1NwYWNlQmFzZSArICcvSkNlbnRlckhvbWUvcGVyc0NlbnRlci9tYW5hZ2VDZW4uaHRtbD9zcGFjZUlkPWNkZjI2ODUxNzgwZDQxMDI5ZmExNDllYzNmMjFjNGRmJnNwYWNlVHlwZT1zY2hvb2wnLFxyXG4gICAgICAnYWRtaW5NYW5hZ2VyJyA6IHNlcnZpY2UuYWRtaW5NYW5hZ2VyXHJcbiAgICB9O1xyXG4gICAgaWYoIGxvY2FsU3RvcmFnZS51c2VySW5mbyApe1xyXG4gICAgICB1c2VySW5mbyA9IGxvY2FsU3RvcmFnZS51c2VySW5mbztcclxuICAgIH1lbHNle1xyXG4gICAgICAvL+ivt+axguiOt+WPllxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybCA6IHNlcnZpY2UucHJlZml4ICsgJy9wZi9hcGkvaGVhZGVyL3VzZXIuanNvbnAnLFxyXG4gICAgICAgIHR5cGUgOidHRVQnLFxyXG4gICAgICAgIGRhdGFUeXBlIDogXCJqc29ucFwiLFxyXG4gICAgICAgIGpzb25wOiBcImNhbGxiYWNrXCIsXHJcbiAgICAgICAgc3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgaWYoIGRhdGEucmVzdWx0LmNvZGUgPT0gXCJzdWNjZXNzXCIgKXtcclxuICAgICAgICAgICAgdXNlckluZm8gPSBkYXRhLnJlc3VsdC5kYXRhO1xyXG4gICAgICAgICAgICBpZiggJChcIiNyZXZpZXdFbnRlclwiKS5sZW5ndGg+MCApe1xyXG4gICAgICAgICAgICAgIGdldFVzZXJSb2xlKCB1c2VySW5mby5pZCApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9ZWxzZSBpZiggZGF0YS5jb2RlID09IFwibG9naW5fZXJyb3JcIiApe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIueUqOaIt+ayoeacieeZu+W9lVwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGRhdGEucmVzdWx0LnVzZXJKdW1wSHJlZiA9IHVzZXJKdW1wSHJlZjtcclxuICAgICAgICAgICQoXCIjbG9naW5fbWVzc2FnZVwiKS5hcHBlbmQodGVtcGxhdGUoXCJsb2dpbk1lc3NhZ2VcIiwge1wiZGF0YVwiOiBkYXRhLnJlc3VsdH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAvKiog5bmz5Y+w55m75b2V5pa55rOVKG9hdXRoKeaWueazlSovXHJcbiAgZnVuY3Rpb24gb2F1dGhMb2dpbigpe1xyXG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xyXG4gICAgaWYodXJsLmluZGV4T2YoXCIjcGFnZVwiKSl7XHJcbiAgICAgIHVybCA9IHVybC5zcGxpdChcIiNwYWdlXCIpWzBdO1xyXG4gICAgfVxyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzZXJ2aWNlLnByZWZpeCArICcvbG9naW4/cmVkaXJlY3RVcmw9JyArIHVybDtcclxuICB9O1xyXG4gIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsIDogc2VydmljZS5wcmVmaXggKyAnL2xvZ291dCcsXHJcbiAgICAgICAgdHlwZSA6J0dFVCcsXHJcbiAgICAgICAgZGF0YVR5cGUgOiBcImpzb25wXCIsXHJcbiAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICBpZiggd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihcInBlcnNDZW50ZXJcIikgKXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzZXJ2aWNlLmh0bWxIb3N0K1wiL2Rpc3QvcGxhdGZvcm0vd3d3L2hvbWUvaW5kZXguaHRtbFwiO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yIDogZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGlmKCB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKFwicGVyc0NlbnRlclwiKSApe1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlcnZpY2UuaHRtbEhvc3QrXCIvZGlzdC9wbGF0Zm9ybS93d3cvaG9tZS9pbmRleC5odG1sXCI7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfTtcclxuICBmdW5jdGlvbiBnZXRVc2VyUm9sZSggdXNlcklkICl7XHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBzZXJ2aWNlLmFjdGl2aXR5SG9zdCArICcvYXV0aG9yaXR5L2Fub255bW91cy9nZXRBdXRob3JpdHk/dXNlcklkPScgKyB1c2VySWQsXHJcbiAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgZGF0YVR5cGU6IFwianNvbnBcIixcclxuICAgICAgICBqc29ucDogXCJjYWxsYmFja3VzZXJcIixcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgdXNlclJvbGUgPSBkYXRhLmRhdGEucm9sZUlkO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICBsYXllci5hbGVydCgn5pyN5Yqh5Zmo5byC5bi4Jywge2ljb246IDB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICB9O1xyXG4gICQoXCJib2R5XCIpLmRlbGVnYXRlKFwiI2xvZ2luX21lc3NhZ2UgLmxvZ2luQnV0dG9uXCIgLCBcImNsaWNrXCIgLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBvYXV0aExvZ2luKCk7XHJcbiAgfSk7XHJcbiAgJChcImJvZHlcIikuZGVsZWdhdGUoXCIubG9nb3V0XCIsIFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgbG9nb3V0KCk7XHJcbiAgfSk7XHJcbiAgJChcImJvZHlcIikuZGVsZWdhdGUoXCIjbG9naW5fbWVzc2FnZSAudXNlck5hbWU+c3BhbiAsIC5jaG9vc2VBcmVhIC5hcmVhICwgLnJlc291cmNlTmF2PmFcIiAsIFwiY2xpY2tcIiAsIGZ1bmN0aW9uICggZSApIHtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB2YXIgJGFycm93ID0gJCh0aGlzKS5maW5kKFwic3Bhbi5hcnJvd1wiKTtcclxuICAgIGlmKCAkYXJyb3cuaGFzQ2xhc3MoXCJhcnJvd1VwXCIpICl7XHJcbiAgICAgICRhcnJvdy5hZGRDbGFzcyhcImFycm93RG93blwiKS5yZW1vdmVDbGFzcyhcImFycm93VXBcIik7XHJcbiAgICAgICQodGhpcykucGFyZW50KCkuZmluZChcIi5jaG9vc2VMaXN0XCIpLmhpZGUoKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAkYXJyb3cuYWRkQ2xhc3MoXCJhcnJvd1VwXCIpLnJlbW92ZUNsYXNzKFwiYXJyb3dEb3duXCIpO1xyXG4gICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoXCIuY2hvb3NlTGlzdFwiKS5zaG93KCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gICQoZG9jdW1lbnQpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAkKFwic3Bhbi5hcnJvd1wiKS5yZW1vdmVDbGFzcyhcImFycm93VXBcIikuYWRkQ2xhc3MoXCJhcnJvd0Rvd25cIik7XHJcbiAgICAkKFwiLmNob29zZUxpc3RcIikuaGlkZSgpO1xyXG4gIH0pO1xyXG4gICQoXCJib2R5XCIpLmRlbGVnYXRlKCcjbmF2IC52ZXJpZnlfYXBwX2VudGVyJyAsICdjbGljaycgLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZigkKHRoaXMpLmF0dHIoJ3R5cGUnKSA9PSAnYWN0aXZpdHlJZCcpe1xyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybCA6IHNlcnZpY2UuYWN0aXZpdHlIb3N0ICsgJy9hbm9ueW1vdXMvYWN0aXZpdHlJbmRleCcsXHJcbiAgICAgICAgdHlwZSA6J0dFVCcsXHJcbiAgICAgICAgZGF0YVR5cGUgOiBcImpzb25wXCIsXHJcbiAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICBpZihkYXRhLmNvZGU9PVwic3VjY2Vzc1wiKXtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9c2VydmljZS5hY3Rpdml0eUhvc3QrZGF0YS5kYXRhICsgKCB1c2VySW5mbyA/ICc/bG9naW49dHJ1ZScgOiAnP2xvZ2luPWZhbHNlJyApO1xyXG4gICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChkYXRhLm1zZywge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGVycm9yIDogZnVuY3Rpb24gKCBkYXRhICkge1xyXG4gICAgICAgICAgbGF5ZXIuYWxlcnQoJ+acjeWKoeWZqOW8guW4uCcsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1lbHNlIGlmKCQodGhpcykuYXR0cigndHlwZScpID09ICd0ZWFjaGluZ3Jlc2VhcmNoX2FwcElkJyl7XHJcbiAgICAgIGlmICh1c2VySW5mbykge1xyXG4gICAgICAgIGFwcFZlcmlmeS52ZXJpZnlBcHAoIHNlcnZpY2UuYXBwSWRzWyQodGhpcykuYXR0cigndHlwZScpXSAsICcyJyAsJycsICdhYm91dDpzZWxmJyk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2VydmljZS5odG1sSG9zdCtcIi9kaXN0L3BsYXRmb3JtL3d3dy9qeS9qeS5odG1sXCI7XHJcbiAgICAgIH1cclxuICAgIH1lbHNlIGlmKCQodGhpcykuYXR0cigndHlwZScpID09ICd2aWRlbycpe1xyXG4gICAgICBpZiAodXNlckluZm8pIHtcclxuICAgICAgICBhcHBWZXJpZnkudmVyaWZ5QXBwKCBzZXJ2aWNlLmFwcElkc1snaGFuYm92aWRlb19hcHBJZCddICwgJzInICwnJywgJ2Fib3V0OnNlbGYnKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgbGF5ZXIuYWxlcnQoXCLor7fnmbvlvZXlkI7mk43kvZzjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICAkKFwiYm9keVwiKS5kZWxlZ2F0ZSgnI25hdiAubGlzdCBhJyAsICdjbGljaycgLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAkKHRoaXMpLnBhcmVudHMoJy5yZXNvdXJjZScpLnNpYmxpbmdzKCkuYWRkQ2xhc3MoJ25hdl9hY3QnKTtcclxuICAgICBpZigkKHRoaXMpLmF0dHIoJ3R5cGUnKSA9PSAncmVzb3VyY2VzX2FwcElkJyl7XHJcbiAgICAgIGlmICh1c2VySW5mbykge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2VydmljZS5zb3VyY2VTeXN0ZW1CYXNlICsgJy9hcHBzLmRvJztcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBzZXJ2aWNlLmh0bWxIb3N0K1wiL2Rpc3QvcGxhdGZvcm0vd3d3L3Jlc291cmNlcy9yZXNvdXJjZXMuaHRtbFwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB3aW5kb3cubWVzID0ge1xyXG4gICAgZ2V0VXNlciA6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHVzZXJJbmZvO1xyXG4gICAgfSxcclxuICAgIGdldFNjaG9vbExpc3QgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBzY2hvb2xMaXN0O1xyXG4gICAgfSxcclxuICAgIGdldFVzZXJSb2xlIDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdXNlclJvbGU7XHJcbiAgICB9LFxyXG5cclxuICB9XHJcbn0pO1xyXG5cdFxyXG5cdCAgXHJcbiJdfQ==

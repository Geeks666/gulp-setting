'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  },
  enforeDefine: true
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);

  require(['jquery', 'tools', 'service', 'layer', 'dialog', 'ajaxhelper', 'footer', 'header', 'template'], function ($, tools, service, layer, dialog, ajaxhelper) {
    $("#html-content").css({ "visibility": "inherit" });

    var categorys = [];

    function addCategorys(item) {
      if (categorys.indexOf(item) < 0) categorys.push(item);
    }

    function fetchAppCategory(cagegroyId) {
      $.when(getUserApp(cagegroyId)).done(function () {
        ajaxhelper.getAppCategory({
          success: function success(data) {
            var resultString = '<li class="header-li" data-id="0"><span class="tab-choose">全部</span></li>';
            for (var index in data.data) {
              if (categorys.indexOf(data.data[index].id) >= 0) resultString += '<li class="header-li" data-id="' + data.data[index].id + '"><span>' + data.data[index].name + '</span></li>';
            }
            $(".header-list").html(resultString);
            var childCount = $(".header-li").children().length;
            $(".header-li").each(function (index) {
              if (index == 0) {
                $(this).css({ "padding-left": 0 });
                return;
              }
              if (index == childCount - 1) {
                $(this).css({ "border-right": "none" });
                return;
              }
            });
            initEvent();
          },
          fail: function fail() {
            layer.alert("请登录后再试");
          }
        });
      });
    }

    fetchAppCategory("0");

    //加载用户选择类型的应用
    function getUserApp(categoryID) {
      var data = parseInt(categoryID) == 0 ? {} : { "category": parseInt(categoryID) };
      return ajaxhelper.getAppList({
        "data": data,
        success: function success(data) {
          var list = '';
          if (data.data.length) {
            for (var i = 0; i < data.data.length; i++) {
              if (!data.data[i].isShow) continue;
              addCategorys(data.data[i]['category']);
              if (data.data[i].id == 12) {
                data.data[i].appUrl = data.data[i].appUrl + '&totype=area';
              }
              list += '<li class="app-li">' + '<img class="app-pic" src="' + getPicPath(data.data[i].logo) + '">' + '<div class="app-msg">' + '<p><span class="app-name">' + data.data[i].name + '</span></p>' + '<p class="clearFix">';
              if (data.data[i].downUrl && data.data[i].downUrl !== '') {
                list += '<a class="download btn" target="_blank" data-href="' + data.data[i].downUrl + '" appId="' + data.data[i].id + '">下载应用</a>';
              }

              if (data.data[i].kindCode !== 3 && data.data[i].kindCode !== "3") {
                list += '<a class="into btn" target="_blank" data-kindCode="' + data.data[i].kindCode + '" data-href="' + data.data[i].appUrl + '"  appId="' + data.data[i].id + '">进入应用</a>';
              }
              list += '</p>' + '</div>' + '<span class="remove-btn icon-close-small" appId="' + data.data[i].id + '"></span>' + '</li>';
            }
            list += ' <li id="add-app"  class="app-li"><div class="add-pic"><span></span>添加应用 </div></li>';
          } else {
            list = '<li id="add-app"  class="app-li"><div class="add-pic"><span></span>添加应用 </div></li>';
          }
          $('#app-list').html(list);
          $(".download").each(function () {
            var item = $(this);
            $(this).click(function () {
              ajaxhelper.isLogin({
                "success": function success() {
                  ajaxhelper.downloadApp({
                    "data": {
                      "appId": item.attr("appId")
                    },
                    "success": function success(data) {
                      window.location.href = data.data;
                    },
                    "fail": function fail() {
                      layer.alert("您没有相应权限");
                      return;
                    }
                  });
                },
                "fail": function fail() {
                  layer.alert("请登录后再试");
                  return;
                }
              });
            });
          });
          $(".into").each(function () {
            $(this).click(function () {
              var item = $(this);
              var w = "";
              if (item.data("kindcode") == 2) {
                w = window.open('about:blank');
              }
              ajaxhelper.isLogin({
                "success": function success() {
                  ajaxhelper.enterApp({
                    "data": {
                      "appId": item.attr("appId")
                    },
                    "success": function success(data) {
                      if (item.data("kindcode") == 1) {
                        window.location.href = data.data;
                      } else if (item.data("kindcode") == 2) {
                        w.location.href = data.data;
                      }
                    },
                    "fail": function fail() {
                      if (item.data("kindcode") == 2) {
                        w.close();
                      }
                      layer.alert("您没有相应权限");
                      return;
                    }
                  });
                },
                "fail": function fail() {
                  layer.alert("请登录后再试");
                  return;
                }
              });
            });
          });
        },
        fail: function fail() {
          $("#app-list").empty().append(dialog.noContent("没有查到对应应用哦"));
          layer.alert("请登录后再试");
        }
      });
    }

    function getAddAppList() {
      var categoryID = getChooseCategory();
      var data = parseInt(categoryID) == 0 ? {} : { "category": parseInt(categoryID) };
      ajaxhelper.getAppList({
        "data": data,
        success: function success(data) {
          dialog.addAppDialog(data, function (chooseData) {
            var appIdString = "";
            for (var index in chooseData.appId) {
              appIdString += chooseData.appId[index] + ",";
            }
            ajaxhelper.addApps({
              "data": appIdString,
              success: function success() {
                fetchAppCategory(getChooseCategory());
                layer.alert("添加应用成功");
              },
              fail: function fail() {
                // layer.alert("添加应用失败，请登录后再试")
              }
            });
          });
        },
        fail: function fail() {
          $("#app-list").empty().append(dialog.noContent("没有查到对应应用哦"));
          layer.alert("请登录后再试");
        }
      });
    }

    function initEvent() {
      $(".header-li").each(function () {
        $(this).click(function () {
          if ($(this).find("span").hasClass("tab-choose")) {
            return;
          } else {
            $(this).find("span").addClass("tab-choose").parents(".header-li").siblings().each(function () {
              $(this).find("span").removeClass("tab-choose");
            });
            getUserApp($(this).data("id"));
          }
        });
      });
      //添加应用
      $('#add-app').on('click', function () {
        getAddAppList();
      });
      //删除应用
      $('body').on('click', '.remove-btn', function () {
        var appId = $(this).attr('appId');
        layer.open({
          content: '确应删除该应用吗？',
          btn: ['确认', '取消'],
          yes: function yes(index, layero) {
            ajaxhelper.deleteApp({
              "data": appId,
              "success": function success() {
                $(".app-li").each(function () {
                  if ($(this).find(".remove-btn").attr("appId") == appId) {
                    $(this).remove();
                    return;
                  }
                });
              },
              "fail": function fail() {
                layer.alert("请登录后在试;");
              }
            });
            layer.close(index);
          }, btn2: function btn2(index, layero) {
            this.cancel();
          },
          cancel: function cancel() {}
        });
      });
    }

    function getChooseCategory() {
      var id = "0";
      $(".header-li").each(function () {
        if ($(this).find("span").hasClass("tab-choose")) {
          id = $(this).data("id");
          return;
        }
      });
      return id;
    }

    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    };
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlcnNDZW50ZXIvanMvcGVyc0FwcC5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiZW5mb3JlRGVmaW5lIiwiY29uZmlncGF0aHMiLCIkIiwidG9vbHMiLCJzZXJ2aWNlIiwibGF5ZXIiLCJkaWFsb2ciLCJhamF4aGVscGVyIiwiY3NzIiwiY2F0ZWdvcnlzIiwiYWRkQ2F0ZWdvcnlzIiwiaXRlbSIsImluZGV4T2YiLCJwdXNoIiwiZmV0Y2hBcHBDYXRlZ29yeSIsImNhZ2Vncm95SWQiLCJ3aGVuIiwiZ2V0VXNlckFwcCIsImRvbmUiLCJnZXRBcHBDYXRlZ29yeSIsInN1Y2Nlc3MiLCJkYXRhIiwicmVzdWx0U3RyaW5nIiwiaW5kZXgiLCJpZCIsIm5hbWUiLCJodG1sIiwiY2hpbGRDb3VudCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiZWFjaCIsImluaXRFdmVudCIsImZhaWwiLCJhbGVydCIsImNhdGVnb3J5SUQiLCJwYXJzZUludCIsImdldEFwcExpc3QiLCJsaXN0IiwiaSIsImlzU2hvdyIsImFwcFVybCIsImdldFBpY1BhdGgiLCJsb2dvIiwiZG93blVybCIsImtpbmRDb2RlIiwiY2xpY2siLCJpc0xvZ2luIiwiZG93bmxvYWRBcHAiLCJhdHRyIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwidyIsIm9wZW4iLCJlbnRlckFwcCIsImNsb3NlIiwiZW1wdHkiLCJhcHBlbmQiLCJub0NvbnRlbnQiLCJnZXRBZGRBcHBMaXN0IiwiZ2V0Q2hvb3NlQ2F0ZWdvcnkiLCJhZGRBcHBEaWFsb2ciLCJjaG9vc2VEYXRhIiwiYXBwSWRTdHJpbmciLCJhcHBJZCIsImFkZEFwcHMiLCJmaW5kIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInBhcmVudHMiLCJzaWJsaW5ncyIsInJlbW92ZUNsYXNzIiwib24iLCJjb250ZW50IiwiYnRuIiwieWVzIiwibGF5ZXJvIiwiZGVsZXRlQXBwIiwicmVtb3ZlIiwiYnRuMiIsImNhbmNl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QUFvRDNELEVBQXBELENBQTlELEdBQXlIcEIsUUFBUWdGLE1BQVIsR0FBaUJoRixRQUFRNkUsUUFBUixDQUFpQixjQUFqQixFQUFpQ0UsT0FBakMsQ0FBeUMsU0FBekMsRUFBb0QzRCxFQUFwRCxDQUFqSjtBQUNEO0FBQ0YsR0FoUEQ7QUFpUEQsQ0FyUEQiLCJmaWxlIjoicGVyc0NlbnRlci9qcy9wZXJzQXBwLTY2NDYwY2ZjNWYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9LFxyXG4gIGVuZm9yZURlZmluZTogdHJ1ZVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG5cclxuICByZXF1aXJlKFsnanF1ZXJ5JywgJ3Rvb2xzJywgJ3NlcnZpY2UnLCAnbGF5ZXInLCAnZGlhbG9nJywgJ2FqYXhoZWxwZXInLCAnZm9vdGVyJywgJ2hlYWRlcicsICd0ZW1wbGF0ZSddLCBmdW5jdGlvbiAoJCwgdG9vbHMsIHNlcnZpY2UsIGxheWVyLCBkaWFsb2csIGFqYXhoZWxwZXIpIHtcclxuICAgICQoXCIjaHRtbC1jb250ZW50XCIpLmNzcyh7XCJ2aXNpYmlsaXR5XCI6IFwiaW5oZXJpdFwifSk7XHJcblxyXG4gICAgdmFyIGNhdGVnb3J5cyA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZENhdGVnb3J5cyhpdGVtKSB7XHJcbiAgICAgIGlmIChjYXRlZ29yeXMuaW5kZXhPZihpdGVtKSA8IDApIGNhdGVnb3J5cy5wdXNoKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZldGNoQXBwQ2F0ZWdvcnkoY2FnZWdyb3lJZCkge1xyXG4gICAgICAkLndoZW4oZ2V0VXNlckFwcChjYWdlZ3JveUlkKSlcclxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBhamF4aGVscGVyLmdldEFwcENhdGVnb3J5KHtcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0U3RyaW5nID0gJzxsaSBjbGFzcz1cImhlYWRlci1saVwiIGRhdGEtaWQ9XCIwXCI+PHNwYW4gY2xhc3M9XCJ0YWItY2hvb3NlXCI+5YWo6YOoPC9zcGFuPjwvbGk+JztcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBkYXRhLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYXRlZ29yeXMuaW5kZXhPZihkYXRhLmRhdGFbaW5kZXhdLmlkKSA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICByZXN1bHRTdHJpbmcgKz0gJzxsaSBjbGFzcz1cImhlYWRlci1saVwiIGRhdGEtaWQ9XCInICsgZGF0YS5kYXRhW2luZGV4XS5pZCArICdcIj48c3Bhbj4nICsgZGF0YS5kYXRhW2luZGV4XS5uYW1lICsgJzwvc3Bhbj48L2xpPic7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICQoXCIuaGVhZGVyLWxpc3RcIikuaHRtbChyZXN1bHRTdHJpbmcpO1xyXG4gICAgICAgICAgICAgIHZhciBjaGlsZENvdW50ID0gJChcIi5oZWFkZXItbGlcIikuY2hpbGRyZW4oKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgJChcIi5oZWFkZXItbGlcIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKHtcInBhZGRpbmctbGVmdFwiOiAwfSk7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSBjaGlsZENvdW50IC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyh7XCJib3JkZXItcmlnaHRcIjogXCJub25lXCJ9KTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIGluaXRFdmVudCgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLor7fnmbvlvZXlkI7lho3or5VcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoQXBwQ2F0ZWdvcnkoXCIwXCIpO1xyXG5cclxuXHJcbiAgICAvL+WKoOi9veeUqOaIt+mAieaLqeexu+Wei+eahOW6lOeUqFxyXG4gICAgZnVuY3Rpb24gZ2V0VXNlckFwcChjYXRlZ29yeUlEKSB7XHJcbiAgICAgIHZhciBkYXRhID0gcGFyc2VJbnQoY2F0ZWdvcnlJRCkgPT0gMCA/IHt9IDoge1wiY2F0ZWdvcnlcIjogcGFyc2VJbnQoY2F0ZWdvcnlJRCl9O1xyXG4gICAgICByZXR1cm4gYWpheGhlbHBlci5nZXRBcHBMaXN0KHtcclxuICAgICAgICBcImRhdGFcIjogZGF0YSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgdmFyIGxpc3QgPSAnJztcclxuICAgICAgICAgIGlmIChkYXRhLmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCFkYXRhLmRhdGFbaV0uaXNTaG93KSBjb250aW51ZTtcclxuICAgICAgICAgICAgICBhZGRDYXRlZ29yeXMoZGF0YS5kYXRhW2ldWydjYXRlZ29yeSddKTtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhW2ldLmlkID09IDEyKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLmRhdGFbaV0uYXBwVXJsID0gZGF0YS5kYXRhW2ldLmFwcFVybCArICcmdG90eXBlPWFyZWEnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBsaXN0ICs9ICc8bGkgY2xhc3M9XCJhcHAtbGlcIj4nICtcclxuICAgICAgICAgICAgICAgICc8aW1nIGNsYXNzPVwiYXBwLXBpY1wiIHNyYz1cIicgKyBnZXRQaWNQYXRoKGRhdGEuZGF0YVtpXS5sb2dvKSArICdcIj4nICtcclxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYXBwLW1zZ1wiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxwPjxzcGFuIGNsYXNzPVwiYXBwLW5hbWVcIj4nICsgZGF0YS5kYXRhW2ldLm5hbWUgKyAnPC9zcGFuPjwvcD4nICtcclxuICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNsZWFyRml4XCI+JztcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhW2ldLmRvd25VcmwgJiYgZGF0YS5kYXRhW2ldLmRvd25VcmwgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ICs9ICc8YSBjbGFzcz1cImRvd25sb2FkIGJ0blwiIHRhcmdldD1cIl9ibGFua1wiIGRhdGEtaHJlZj1cIicgKyBkYXRhLmRhdGFbaV0uZG93blVybCArICdcIiBhcHBJZD1cIicgKyBkYXRhLmRhdGFbaV0uaWQgKyAnXCI+5LiL6L295bqU55SoPC9hPic7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhW2ldLmtpbmRDb2RlICE9PSAzICYmIGRhdGEuZGF0YVtpXS5raW5kQ29kZSAhPT0gXCIzXCIpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QgKz0gJzxhIGNsYXNzPVwiaW50byBidG5cIiB0YXJnZXQ9XCJfYmxhbmtcIiBkYXRhLWtpbmRDb2RlPVwiJyArIGRhdGEuZGF0YVtpXS5raW5kQ29kZSArICdcIiBkYXRhLWhyZWY9XCInICsgZGF0YS5kYXRhW2ldLmFwcFVybCArICdcIiAgYXBwSWQ9XCInICsgZGF0YS5kYXRhW2ldLmlkICsgJ1wiPui/m+WFpeW6lOeUqDwvYT4nO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBsaXN0ICs9ICc8L3A+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJyZW1vdmUtYnRuIGljb24tY2xvc2Utc21hbGxcIiBhcHBJZD1cIicgKyBkYXRhLmRhdGFbaV0uaWQgKyAnXCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvbGk+JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaXN0ICs9ICcgPGxpIGlkPVwiYWRkLWFwcFwiICBjbGFzcz1cImFwcC1saVwiPjxkaXYgY2xhc3M9XCJhZGQtcGljXCI+PHNwYW4+PC9zcGFuPua3u+WKoOW6lOeUqCA8L2Rpdj48L2xpPic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaXN0ID0gJzxsaSBpZD1cImFkZC1hcHBcIiAgY2xhc3M9XCJhcHAtbGlcIj48ZGl2IGNsYXNzPVwiYWRkLXBpY1wiPjxzcGFuPjwvc3Bhbj7mt7vliqDlupTnlKggPC9kaXY+PC9saT4nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgJCgnI2FwcC1saXN0JykuaHRtbChsaXN0KTtcclxuICAgICAgICAgICQoXCIuZG93bmxvYWRcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgYWpheGhlbHBlci5pc0xvZ2luKHtcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIGFqYXhoZWxwZXIuZG93bmxvYWRBcHAoe1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBcImFwcElkXCI6IGl0ZW0uYXR0cihcImFwcElkXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmYWlsXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi5oKo5rKh5pyJ55u45bqU5p2D6ZmQXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImZhaWxcIjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuWGjeivlVwiKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgJChcIi5pbnRvXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB2YXIgaXRlbSA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgdmFyIHcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgIGlmIChpdGVtLmRhdGEoXCJraW5kY29kZVwiKSA9PSAyKSB7XHJcbiAgICAgICAgICAgICAgICB3ID0gd2luZG93Lm9wZW4oJ2Fib3V0OmJsYW5rJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGFqYXhoZWxwZXIuaXNMb2dpbih7XHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICBhamF4aGVscGVyLmVudGVyQXBwKHtcclxuICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgXCJhcHBJZFwiOiBpdGVtLmF0dHIoXCJhcHBJZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5kYXRhKFwia2luZGNvZGVcIikgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5kYXRhKFwia2luZGNvZGVcIikgPT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3LmxvY2F0aW9uLmhyZWYgPSBkYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBcImZhaWxcIjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uZGF0YShcImtpbmRjb2RlXCIpID09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLmgqjmsqHmnInnm7jlupTmnYPpmZBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFwiZmFpbFwiOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6K+355m75b2V5ZCO5YaN6K+VXCIpO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoXCIjYXBwLWxpc3RcIikuZW1wdHkoKS5hcHBlbmQoZGlhbG9nLm5vQ29udGVudChcIuayoeacieafpeWIsOWvueW6lOW6lOeUqOWTplwiKSk7XHJcbiAgICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuWGjeivlVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEFkZEFwcExpc3QoKSB7XHJcbiAgICAgIHZhciBjYXRlZ29yeUlEID0gZ2V0Q2hvb3NlQ2F0ZWdvcnkoKTtcclxuICAgICAgdmFyIGRhdGEgPSBwYXJzZUludChjYXRlZ29yeUlEKSA9PSAwID8ge30gOiB7XCJjYXRlZ29yeVwiOiBwYXJzZUludChjYXRlZ29yeUlEKX07XHJcbiAgICAgIGFqYXhoZWxwZXIuZ2V0QXBwTGlzdCh7XHJcbiAgICAgICAgXCJkYXRhXCI6IGRhdGEsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIGRpYWxvZy5hZGRBcHBEaWFsb2coZGF0YSwgZnVuY3Rpb24gKGNob29zZURhdGEpIHtcclxuICAgICAgICAgICAgdmFyIGFwcElkU3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gY2hvb3NlRGF0YS5hcHBJZCkge1xyXG4gICAgICAgICAgICAgIGFwcElkU3RyaW5nICs9IGNob29zZURhdGEuYXBwSWRbaW5kZXhdICsgXCIsXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWpheGhlbHBlci5hZGRBcHBzKHtcclxuICAgICAgICAgICAgICBcImRhdGFcIjogYXBwSWRTdHJpbmcsXHJcbiAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZmV0Y2hBcHBDYXRlZ29yeShnZXRDaG9vc2VDYXRlZ29yeSgpKTtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi5re75Yqg5bqU55So5oiQ5YqfXCIpO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbGF5ZXIuYWxlcnQoXCLmt7vliqDlupTnlKjlpLHotKXvvIzor7fnmbvlvZXlkI7lho3or5VcIilcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICQoXCIjYXBwLWxpc3RcIikuZW1wdHkoKS5hcHBlbmQoZGlhbG9nLm5vQ29udGVudChcIuayoeacieafpeWIsOWvueW6lOW6lOeUqOWTplwiKSk7XHJcbiAgICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuWGjeivlVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdEV2ZW50KCkge1xyXG4gICAgICAkKFwiLmhlYWRlci1saVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKHRoaXMpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoXCJzcGFuXCIpLmhhc0NsYXNzKFwidGFiLWNob29zZVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJzcGFuXCIpLmFkZENsYXNzKFwidGFiLWNob29zZVwiKS5wYXJlbnRzKFwiLmhlYWRlci1saVwiKS5zaWJsaW5ncygpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICQodGhpcykuZmluZChcInNwYW5cIikucmVtb3ZlQ2xhc3MoXCJ0YWItY2hvb3NlXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZ2V0VXNlckFwcCgkKHRoaXMpLmRhdGEoXCJpZFwiKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfSk7XHJcbiAgICAgIC8v5re75Yqg5bqU55SoXHJcbiAgICAgICQoJyNhZGQtYXBwJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGdldEFkZEFwcExpc3QoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8v5Yig6Zmk5bqU55SoXHJcbiAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnJlbW92ZS1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFwcElkID0gJCh0aGlzKS5hdHRyKCdhcHBJZCcpO1xyXG4gICAgICAgIGxheWVyLm9wZW4oe1xyXG4gICAgICAgICAgY29udGVudDogJ+ehruW6lOWIoOmZpOivpeW6lOeUqOWQl++8nydcclxuICAgICAgICAgICwgYnRuOiBbJ+ehruiupCcsICflj5bmtognXVxyXG4gICAgICAgICAgLCB5ZXM6IGZ1bmN0aW9uIChpbmRleCwgbGF5ZXJvKSB7XHJcbiAgICAgICAgICAgIGFqYXhoZWxwZXIuZGVsZXRlQXBwKHtcclxuICAgICAgICAgICAgICBcImRhdGFcIjogYXBwSWQsXHJcbiAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoXCIuYXBwLWxpXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKFwiLnJlbW92ZS1idG5cIikuYXR0cihcImFwcElkXCIpID09IGFwcElkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXCJmYWlsXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6K+355m75b2V5ZCO5Zyo6K+VO1wiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsYXllci5jbG9zZShpbmRleCk7XHJcbiAgICAgICAgICB9LCBidG4yOiBmdW5jdGlvbiAoaW5kZXgsIGxheWVybykge1xyXG4gICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLCBjYW5jZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q2hvb3NlQ2F0ZWdvcnkoKSB7XHJcbiAgICAgIHZhciBpZCA9IFwiMFwiO1xyXG4gICAgICAkKFwiLmhlYWRlci1saVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCh0aGlzKS5maW5kKFwic3BhblwiKS5oYXNDbGFzcyhcInRhYi1jaG9vc2VcIikpIHtcclxuICAgICAgICAgIGlkID0gJCh0aGlzKS5kYXRhKFwiaWRcIik7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBpY1BhdGgoaWQpIHtcclxuICAgICAgcmV0dXJuIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnID8gc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10ucmVwbGFjZSgnI3Jlc2lkIycsIGlkKSA6IChzZXJ2aWNlLnByZWZpeCArIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkpO1xyXG4gICAgfTtcclxuICB9KTtcclxufSlcclxuXHJcbiJdfQ==

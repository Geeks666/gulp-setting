require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  },
  enforeDefine: true
});
require(['platformConf'], function (configpaths) {
  require.config(configpaths);


  require(['jquery', 'tools', 'service', 'layer', 'dialog', 'ajaxhelper', 'footer', 'header', 'template'], function ($, tools, service, layer, dialog, ajaxhelper) {
    $("#html-content").css({"visibility": "inherit"});

    var categorys = [];

    function addCategorys(item) {
      if (categorys.indexOf(item) < 0) categorys.push(item);
    }

    function fetchAppCategory(cagegroyId) {
      $.when(getUserApp(cagegroyId))
        .done(function () {
          ajaxhelper.getAppCategory({
            success: function (data) {
              var resultString = '<li class="header-li" data-id="0"><span class="tab-choose">全部</span></li>';
              for (var index in data.data) {
                if (categorys.indexOf(data.data[index].id) >= 0)
                  resultString += '<li class="header-li" data-id="' + data.data[index].id + '"><span>' + data.data[index].name + '</span></li>';
              }
              $(".header-list").html(resultString);
              var childCount = $(".header-li").children().length;
              $(".header-li").each(function (index) {
                if (index == 0) {
                  $(this).css({"padding-left": 0});
                  return;
                }
                if (index == childCount - 1) {
                  $(this).css({"border-right": "none"});
                  return;
                }
              });
              initEvent();
            },
            fail: function () {
              layer.alert("请登录后再试");
            }
          });
        });
    }

    fetchAppCategory("0");


    //加载用户选择类型的应用
    function getUserApp(categoryID) {
      var data = parseInt(categoryID) == 0 ? {} : {"category": parseInt(categoryID)};
      return ajaxhelper.getAppList({
        "data": data,
        success: function (data) {
          var list = '';
          if (data.data.length) {
            for (var i = 0; i < data.data.length; i++) {
              if (!data.data[i].isShow) continue;
              addCategorys(data.data[i]['category']);
              if (data.data[i].id == 12) {
                data.data[i].appUrl = data.data[i].appUrl + '&totype=area';
              }
              list += '<li class="app-li">' +
                '<img class="app-pic" src="' + getPicPath(data.data[i].logo) + '">' +
                '<div class="app-msg">' +
                '<p><span class="app-name">' + data.data[i].name + '</span></p>' +
                '<p class="clearFix">';
              if (data.data[i].downUrl && data.data[i].downUrl !== '') {
                list += '<a class="download btn" target="_blank" data-href="' + data.data[i].downUrl + '" appId="' + data.data[i].id + '">下载应用</a>';
              }

              if (data.data[i].kindCode !== 3 && data.data[i].kindCode !== "3") {
                list += '<a class="into btn" target="_blank" data-kindCode="' + data.data[i].kindCode + '" data-href="' + data.data[i].appUrl + '"  appId="' + data.data[i].id + '">进入应用</a>';
              }
              list += '</p>' +
                '</div>' +
                '<span class="remove-btn icon-close-small" appId="' + data.data[i].id + '"></span>' +
                '</li>';
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
                "success": function () {
                  ajaxhelper.downloadApp({
                    "data": {
                      "appId": item.attr("appId")
                    },
                    "success": function (data) {
                      window.location.href = data.data;
                    },
                    "fail": function () {
                      layer.alert("您没有相应权限");
                      return;
                    }
                  })
                },
                "fail": function () {
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
                "success": function () {
                  ajaxhelper.enterApp({
                    "data": {
                      "appId": item.attr("appId")
                    },
                    "success": function (data) {
                      if (item.data("kindcode") == 1) {
                        window.location.href = data.data;
                      } else if (item.data("kindcode") == 2) {
                        w.location.href = data.data;
                      }
                    },
                    "fail": function () {
                      if (item.data("kindcode") == 2) {
                        w.close();
                      }
                      layer.alert("您没有相应权限");
                      return;
                    }
                  })
                },
                "fail": function () {
                  layer.alert("请登录后再试");
                  return;
                }
              });
            });
          })
        },
        fail: function () {
          $("#app-list").empty().append(dialog.noContent("没有查到对应应用哦"));
          layer.alert("请登录后再试");
        }
      });
    }

    function getAddAppList() {
      var categoryID = getChooseCategory();
      var data = parseInt(categoryID) == 0 ? {} : {"category": parseInt(categoryID)};
      ajaxhelper.getAppList({
        "data": data,
        success: function (data) {
          dialog.addAppDialog(data, function (chooseData) {
            var appIdString = "";
            for (var index in chooseData.appId) {
              appIdString += chooseData.appId[index] + ",";
            }
            ajaxhelper.addApps({
              "data": appIdString,
              success: function () {
                fetchAppCategory(getChooseCategory());
                layer.alert("添加应用成功");
              },
              fail: function () {
                // layer.alert("添加应用失败，请登录后再试")
              }
            })
          });
        },
        fail: function () {
          $("#app-list").empty().append(dialog.noContent("没有查到对应应用哦"));
          layer.alert("请登录后再试");
        }
      })
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
        })
      });
      //添加应用
      $('#add-app').on('click', function () {
        getAddAppList();
      });
      //删除应用
      $('body').on('click', '.remove-btn', function () {
        var appId = $(this).attr('appId');
        layer.open({
          content: '确应删除该应用吗？'
          , btn: ['确认', '取消']
          , yes: function (index, layero) {
            ajaxhelper.deleteApp({
              "data": appId,
              "success": function () {
                $(".app-li").each(function () {
                  if ($(this).find(".remove-btn").attr("appId") == appId) {
                    $(this).remove();
                    return;
                  }
                });
              },
              "fail": function () {
                layer.alert("请登录后在试;");
              }
            });
            layer.close(index);
          }, btn2: function (index, layero) {
            this.cancel();
          }
          , cancel: function () {
          }
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
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
    };
  });
})


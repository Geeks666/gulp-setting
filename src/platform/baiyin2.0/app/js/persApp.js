require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  },
  enforeDefine: true
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  require(['jquery', 'tools', 'service', 'layer', 'dialog', 'ajaxhelper', 'footer', 'header', 'template' , 'banner' , 'ajaxBanner' , 'secondNav'],
    function ($, tools, service, layer, dialog, ajaxhelper) {
    $("#html-content").css({"visibility": "inherit"});

    ajaxhelper.getAppCategory({
        success: function (data) {
            var resultString = '<li class="header-li" data-id="0"><span class="tab-choose">全部</span></li>';
            for (var index in data.data) {
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

    //加载用户选择类型的应用
    function getUserApp(categoryID) {
        var data = parseInt(categoryID) == 0 ? {} : {"category": parseInt(categoryID)};
        ajaxhelper.getAppList({
            "data": data,
            success: function (data) {
                var list = '';
                if (data.data.length) {
                    for (var i = 0; i < data.data.length; i++) {
                        if (!data.data[i].isShow)  continue;
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
                          list += '<a class="into btn" target="_blank" data-kindCode="'+ data.data[i].kindCode +'" data-href="' + data.data[i].appUrl + '"  appId="' + data.data[i].id + '">进入应用</a>';
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
                            /*var tempwindow = window.open('_blank');
                             tempwindow.location = data.data;*/
                            window.location.href=data.data;
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
                      if(item.data("kindcode") == 2){
                        w = window.open('about:blank');
                      }
                      ajaxhelper.isLogin({
                        "success": function () {
                          ajaxhelper.enterApp({
                            "data": {
                              "appId": item.attr("appId")
                            },
                            "success": function (data) {
                              if(item.data("kindcode") == 1){
                                window.location.href = data.data;
                              }else if(item.data("kindcode") == 2){
                                w.location.href = data.data;
                              }
                            },
                            "fail": function () {
                              if(item.data("kindcode") == 2){
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
                            getUserApp(getChooseCategory());
                            layer.alert("添加应用成功");
                        },
                        fail: function () {
                            layer.alert("添加应用失败")
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
        getUserApp("0");
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
        $('body').on('click', '#add-app', function () {
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
        return service.prefix + '/pf/res/download/' + id;
    };
  });
})


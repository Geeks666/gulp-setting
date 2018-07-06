'use strict';

require.config({
    baseUrl: '../',
    paths: {
        'platformConf': 'public/js/platformConf-541e3fb1ce.js'
    },
    enforeDefine: true
});
require(['platformConf'], function (configpaths) {
    // configpaths.paths.dialog = "myspace/js/appDialog.js";
    require.config(configpaths);
    require(['jquery', 'tools', 'service', 'layer', 'dialog', 'ajaxhelper', 'footer', 'header', 'template', 'banner', 'ajaxBanner', 'secondNav'], function ($, tools, service, layer, dialog, ajaxhelper) {
        $("#html-content").css({ "visibility": "inherit" });

        ajaxhelper.getAppCategory({
            success: function success(data) {
                var resultString = '<li class="header-li" data-id="0"><span class="tab-choose">全部</span></li>';
                for (var index in data.data) {
                    resultString += '<li class="header-li" data-id="' + data.data[index].id + '"><span>' + data.data[index].name + '</span></li>';
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

        //加载用户选择类型的应用
        function getUserApp(categoryID) {
            var data = parseInt(categoryID) == 0 ? {} : { "category": parseInt(categoryID) };
            ajaxhelper.getAppList({
                "data": data,
                success: function success(data) {
                    var list = '';
                    if (data.data.length) {
                        for (var i = 0; i < data.data.length; i++) {
                            if (!data.data[i].isShow) continue;
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
                                            /*var tempwindow = window.open('_blank');
                                             tempwindow.location = data.data;*/
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
                                getUserApp(getChooseCategory());
                                layer.alert("添加应用成功");
                            },
                            fail: function fail() {
                                layer.alert("添加应用失败");
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
                });
            });
            //添加应用
            $('body').on('click', '#add-app', function () {
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
            return service.prefix + '/pf/res/download/' + id;
        };
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9qcy9wZXJzQXBwLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJlbmZvcmVEZWZpbmUiLCJjb25maWdwYXRocyIsIiQiLCJ0b29scyIsInNlcnZpY2UiLCJsYXllciIsImRpYWxvZyIsImFqYXhoZWxwZXIiLCJjc3MiLCJnZXRBcHBDYXRlZ29yeSIsInN1Y2Nlc3MiLCJkYXRhIiwicmVzdWx0U3RyaW5nIiwiaW5kZXgiLCJpZCIsIm5hbWUiLCJodG1sIiwiY2hpbGRDb3VudCIsImNoaWxkcmVuIiwibGVuZ3RoIiwiZWFjaCIsImluaXRFdmVudCIsImZhaWwiLCJhbGVydCIsImdldFVzZXJBcHAiLCJjYXRlZ29yeUlEIiwicGFyc2VJbnQiLCJnZXRBcHBMaXN0IiwibGlzdCIsImkiLCJpc1Nob3ciLCJhcHBVcmwiLCJnZXRQaWNQYXRoIiwibG9nbyIsImRvd25VcmwiLCJraW5kQ29kZSIsIml0ZW0iLCJjbGljayIsImlzTG9naW4iLCJkb3dubG9hZEFwcCIsImF0dHIiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJ3Iiwib3BlbiIsImVudGVyQXBwIiwiY2xvc2UiLCJlbXB0eSIsImFwcGVuZCIsIm5vQ29udGVudCIsImdldEFkZEFwcExpc3QiLCJnZXRDaG9vc2VDYXRlZ29yeSIsImFkZEFwcERpYWxvZyIsImNob29zZURhdGEiLCJhcHBJZFN0cmluZyIsImFwcElkIiwiYWRkQXBwcyIsImZpbmQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwicGFyZW50cyIsInNpYmxpbmdzIiwicmVtb3ZlQ2xhc3MiLCJvbiIsImNvbnRlbnQiLCJidG4iLCJ5ZXMiLCJsYXllcm8iLCJkZWxldGVBcHAiLCJyZW1vdmUiLCJidG4yIiwiY2FuY2VsIiwicHJlZml4Il0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsYUFBUyxLQURJO0FBRWJDLFdBQU87QUFDTCx3QkFBZ0I7QUFEWCxLQUZN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QVksQ0FDckI7QUF2Qk0saUJBQVg7QUF5QkgsYUEzQkQ7QUE0Qkg7O0FBRUQsaUJBQVNwQixpQkFBVCxHQUE2QjtBQUN6QixnQkFBSXRDLEtBQUssR0FBVDtBQUNBWixjQUFFLFlBQUYsRUFBZ0JrQixJQUFoQixDQUFxQixZQUFZO0FBQzdCLG9CQUFJbEIsRUFBRSxJQUFGLEVBQVF3RCxJQUFSLENBQWEsTUFBYixFQUFxQkMsUUFBckIsQ0FBOEIsWUFBOUIsQ0FBSixFQUFpRDtBQUM3QzdDLHlCQUFLWixFQUFFLElBQUYsRUFBUVMsSUFBUixDQUFhLElBQWIsQ0FBTDtBQUNBO0FBQ0g7QUFDSixhQUxEO0FBTUEsbUJBQU9HLEVBQVA7QUFDSDs7QUFFRCxpQkFBU2tCLFVBQVQsQ0FBb0JsQixFQUFwQixFQUF3QjtBQUNwQixtQkFBT1YsUUFBUXFFLE1BQVIsR0FBaUIsbUJBQWpCLEdBQXVDM0QsRUFBOUM7QUFDSDtBQUNGLEtBeE9EO0FBeU9ELENBNU9EIiwiZmlsZSI6ImFwcC9qcy9wZXJzQXBwLWZhNjQ4NjQxMjMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9LFxyXG4gIGVuZm9yZURlZmluZTogdHJ1ZVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICAvLyBjb25maWdwYXRocy5wYXRocy5kaWFsb2cgPSBcIm15c3BhY2UvanMvYXBwRGlhbG9nLmpzXCI7XHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG4gIHJlcXVpcmUoWydqcXVlcnknLCAndG9vbHMnLCAnc2VydmljZScsICdsYXllcicsICdkaWFsb2cnLCAnYWpheGhlbHBlcicsICdmb290ZXInLCAnaGVhZGVyJywgJ3RlbXBsYXRlJyAsICdiYW5uZXInICwgJ2FqYXhCYW5uZXInICwgJ3NlY29uZE5hdiddLFxyXG4gICAgZnVuY3Rpb24gKCQsIHRvb2xzLCBzZXJ2aWNlLCBsYXllciwgZGlhbG9nLCBhamF4aGVscGVyKSB7XHJcbiAgICAkKFwiI2h0bWwtY29udGVudFwiKS5jc3Moe1widmlzaWJpbGl0eVwiOiBcImluaGVyaXRcIn0pO1xyXG5cclxuICAgIGFqYXhoZWxwZXIuZ2V0QXBwQ2F0ZWdvcnkoe1xyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHRTdHJpbmcgPSAnPGxpIGNsYXNzPVwiaGVhZGVyLWxpXCIgZGF0YS1pZD1cIjBcIj48c3BhbiBjbGFzcz1cInRhYi1jaG9vc2VcIj7lhajpg6g8L3NwYW4+PC9saT4nO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBkYXRhLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFN0cmluZyArPSAnPGxpIGNsYXNzPVwiaGVhZGVyLWxpXCIgZGF0YS1pZD1cIicgKyBkYXRhLmRhdGFbaW5kZXhdLmlkICsgJ1wiPjxzcGFuPicgKyBkYXRhLmRhdGFbaW5kZXhdLm5hbWUgKyAnPC9zcGFuPjwvbGk+JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKFwiLmhlYWRlci1saXN0XCIpLmh0bWwocmVzdWx0U3RyaW5nKTtcclxuICAgICAgICAgICAgdmFyIGNoaWxkQ291bnQgPSAkKFwiLmhlYWRlci1saVwiKS5jaGlsZHJlbigpLmxlbmd0aDtcclxuICAgICAgICAgICAgJChcIi5oZWFkZXItbGlcIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3Moe1wicGFkZGluZy1sZWZ0XCI6IDB9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gY2hpbGRDb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyh7XCJib3JkZXItcmlnaHRcIjogXCJub25lXCJ9KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpbml0RXZlbnQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLor7fnmbvlvZXlkI7lho3or5VcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy/liqDovb3nlKjmiLfpgInmi6nnsbvlnovnmoTlupTnlKhcclxuICAgIGZ1bmN0aW9uIGdldFVzZXJBcHAoY2F0ZWdvcnlJRCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gcGFyc2VJbnQoY2F0ZWdvcnlJRCkgPT0gMCA/IHt9IDoge1wiY2F0ZWdvcnlcIjogcGFyc2VJbnQoY2F0ZWdvcnlJRCl9O1xyXG4gICAgICAgIGFqYXhoZWxwZXIuZ2V0QXBwTGlzdCh7XHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBkYXRhLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhLmRhdGFbaV0uaXNTaG93KSAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGFbaV0uaWQgPT0gMTIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YVtpXS5hcHBVcmwgPSBkYXRhLmRhdGFbaV0uYXBwVXJsICsgJyZ0b3R5cGU9YXJlYSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCArPSAnPGxpIGNsYXNzPVwiYXBwLWxpXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGltZyBjbGFzcz1cImFwcC1waWNcIiBzcmM9XCInICsgZ2V0UGljUGF0aChkYXRhLmRhdGFbaV0ubG9nbykgKyAnXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImFwcC1tc2dcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cD48c3BhbiBjbGFzcz1cImFwcC1uYW1lXCI+JyArIGRhdGEuZGF0YVtpXS5uYW1lICsgJzwvc3Bhbj48L3A+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjbGVhckZpeFwiPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGFbaV0uZG93blVybCAmJiBkYXRhLmRhdGFbaV0uZG93blVybCAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgKz0gJzxhIGNsYXNzPVwiZG93bmxvYWQgYnRuXCIgdGFyZ2V0PVwiX2JsYW5rXCIgZGF0YS1ocmVmPVwiJyArIGRhdGEuZGF0YVtpXS5kb3duVXJsICsgJ1wiIGFwcElkPVwiJyArIGRhdGEuZGF0YVtpXS5pZCArICdcIj7kuIvovb3lupTnlKg8L2E+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YVtpXS5raW5kQ29kZSAhPT0gMyAmJiBkYXRhLmRhdGFbaV0ua2luZENvZGUgIT09IFwiM1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCArPSAnPGEgY2xhc3M9XCJpbnRvIGJ0blwiIHRhcmdldD1cIl9ibGFua1wiIGRhdGEta2luZENvZGU9XCInKyBkYXRhLmRhdGFbaV0ua2luZENvZGUgKydcIiBkYXRhLWhyZWY9XCInICsgZGF0YS5kYXRhW2ldLmFwcFVybCArICdcIiAgYXBwSWQ9XCInICsgZGF0YS5kYXRhW2ldLmlkICsgJ1wiPui/m+WFpeW6lOeUqDwvYT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ICs9ICc8L3A+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJyZW1vdmUtYnRuIGljb24tY2xvc2Utc21hbGxcIiBhcHBJZD1cIicgKyBkYXRhLmRhdGFbaV0uaWQgKyAnXCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvbGk+JztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCArPSAnIDxsaSBpZD1cImFkZC1hcHBcIiAgY2xhc3M9XCJhcHAtbGlcIj48ZGl2IGNsYXNzPVwiYWRkLXBpY1wiPjxzcGFuPjwvc3Bhbj7mt7vliqDlupTnlKggPC9kaXY+PC9saT4nO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gJzxsaSBpZD1cImFkZC1hcHBcIiAgY2xhc3M9XCJhcHAtbGlcIj48ZGl2IGNsYXNzPVwiYWRkLXBpY1wiPjxzcGFuPjwvc3Bhbj7mt7vliqDlupTnlKggPC9kaXY+PC9saT4nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJCgnI2FwcC1saXN0JykuaHRtbChsaXN0KTtcclxuICAgICAgICAgICAgICAgICQoXCIuZG93bmxvYWRcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFqYXhoZWxwZXIuaXNMb2dpbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhamF4aGVscGVyLmRvd25sb2FkQXBwKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcHBJZFwiOiBpdGVtLmF0dHIoXCJhcHBJZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKnZhciB0ZW1wd2luZG93ID0gd2luZG93Lm9wZW4oJ19ibGFuaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXB3aW5kb3cubG9jYXRpb24gPSBkYXRhLmRhdGE7Ki9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPWRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmFpbFwiOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllci5hbGVydChcIuaCqOayoeacieebuOW6lOadg+mZkFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgXCJmYWlsXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLor7fnmbvlvZXlkI7lho3or5VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICQoXCIuaW50b1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciB3ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0uZGF0YShcImtpbmRjb2RlXCIpID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gd2luZG93Lm9wZW4oJ2Fib3V0OmJsYW5rJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBhamF4aGVscGVyLmlzTG9naW4oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFqYXhoZWxwZXIuZW50ZXJBcHAoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcHBJZFwiOiBpdGVtLmF0dHIoXCJhcHBJZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmRhdGEoXCJraW5kY29kZVwiKSA9PSAxKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGRhdGEuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoaXRlbS5kYXRhKFwia2luZGNvZGVcIikgPT0gMil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdy5sb2NhdGlvbi5ocmVmID0gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmYWlsXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXRlbS5kYXRhKFwia2luZGNvZGVcIikgPT0gMil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi5oKo5rKh5pyJ55u45bqU5p2D6ZmQXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJmYWlsXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuWGjeivlVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoXCIjYXBwLWxpc3RcIikuZW1wdHkoKS5hcHBlbmQoZGlhbG9nLm5vQ29udGVudChcIuayoeacieafpeWIsOWvueW6lOW6lOeUqOWTplwiKSk7XHJcbiAgICAgICAgICAgICAgICBsYXllci5hbGVydChcIuivt+eZu+W9leWQjuWGjeivlVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEFkZEFwcExpc3QoKSB7XHJcbiAgICAgICAgdmFyIGNhdGVnb3J5SUQgPSBnZXRDaG9vc2VDYXRlZ29yeSgpO1xyXG4gICAgICAgIHZhciBkYXRhID0gcGFyc2VJbnQoY2F0ZWdvcnlJRCkgPT0gMCA/IHt9IDoge1wiY2F0ZWdvcnlcIjogcGFyc2VJbnQoY2F0ZWdvcnlJRCl9O1xyXG4gICAgICAgIGFqYXhoZWxwZXIuZ2V0QXBwTGlzdCh7XHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiBkYXRhLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZGlhbG9nLmFkZEFwcERpYWxvZyhkYXRhLCBmdW5jdGlvbiAoY2hvb3NlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcHBJZFN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaW5kZXggaW4gY2hvb3NlRGF0YS5hcHBJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBJZFN0cmluZyArPSBjaG9vc2VEYXRhLmFwcElkW2luZGV4XSArIFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhamF4aGVscGVyLmFkZEFwcHMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogYXBwSWRTdHJpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFVzZXJBcHAoZ2V0Q2hvb3NlQ2F0ZWdvcnkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllci5hbGVydChcIua3u+WKoOW6lOeUqOaIkOWKn1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLmt7vliqDlupTnlKjlpLHotKVcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZmFpbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNhcHAtbGlzdFwiKS5lbXB0eSgpLmFwcGVuZChkaWFsb2cubm9Db250ZW50KFwi5rKh5pyJ5p+l5Yiw5a+55bqU5bqU55So5ZOmXCIpKTtcclxuICAgICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6K+355m75b2V5ZCO5YaN6K+VXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0RXZlbnQoKSB7XHJcbiAgICAgICAgZ2V0VXNlckFwcChcIjBcIik7XHJcbiAgICAgICAgJChcIi5oZWFkZXItbGlcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZChcInNwYW5cIikuaGFzQ2xhc3MoXCJ0YWItY2hvb3NlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJzcGFuXCIpLmFkZENsYXNzKFwidGFiLWNob29zZVwiKS5wYXJlbnRzKFwiLmhlYWRlci1saVwiKS5zaWJsaW5ncygpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJzcGFuXCIpLnJlbW92ZUNsYXNzKFwidGFiLWNob29zZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBnZXRVc2VyQXBwKCQodGhpcykuZGF0YShcImlkXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL+a3u+WKoOW6lOeUqFxyXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnI2FkZC1hcHAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGdldEFkZEFwcExpc3QoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL+WIoOmZpOW6lOeUqFxyXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnJlbW92ZS1idG4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcHBJZCA9ICQodGhpcykuYXR0cignYXBwSWQnKTtcclxuICAgICAgICAgICAgbGF5ZXIub3Blbih7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiAn56Gu5bqU5Yig6Zmk6K+l5bqU55So5ZCX77yfJ1xyXG4gICAgICAgICAgICAgICAgLCBidG46IFsn56Gu6K6kJywgJ+WPlua2iCddXHJcbiAgICAgICAgICAgICAgICAsIHllczogZnVuY3Rpb24gKGluZGV4LCBsYXllcm8pIHtcclxuICAgICAgICAgICAgICAgICAgICBhamF4aGVscGVyLmRlbGV0ZUFwcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBhcHBJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuYXBwLWxpXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoXCIucmVtb3ZlLWJ0blwiKS5hdHRyKFwiYXBwSWRcIikgPT0gYXBwSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImZhaWxcIjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLor7fnmbvlvZXlkI7lnKjor5U7XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIuY2xvc2UoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfSwgYnRuMjogZnVuY3Rpb24gKGluZGV4LCBsYXllcm8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLCBjYW5jZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q2hvb3NlQ2F0ZWdvcnkoKSB7XHJcbiAgICAgICAgdmFyIGlkID0gXCIwXCI7XHJcbiAgICAgICAgJChcIi5oZWFkZXItbGlcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoXCJzcGFuXCIpLmhhc0NsYXNzKFwidGFiLWNob29zZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSAkKHRoaXMpLmRhdGEoXCJpZFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRQaWNQYXRoKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UucHJlZml4ICsgJy9wZi9yZXMvZG93bmxvYWQvJyArIGlkO1xyXG4gICAgfTtcclxuICB9KTtcclxufSlcclxuXHJcbiJdfQ==

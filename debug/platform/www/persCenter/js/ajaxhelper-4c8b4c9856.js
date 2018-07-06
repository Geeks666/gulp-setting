"use strict";

define("ajaxhelper", ["jquery", "service"], function ($, service) {

    //删除某个应用
    var deleteApp = function deleteApp(params) {
        var data = { "ids": params.data, "show": false };
        setAppStatus({
            "data": data,
            "success": params.success,
            "fail": params.fail
        });
    };

    //集合添加应用
    var addApps = function addApps(params) {
        var data = { "ids": params.data, "show": true };
        setAppStatus({
            "data": data,
            "success": params.success,
            "fail": params.fail
        });
    };

    //设置应用状态
    var setAppStatus = function setAppStatus(params) {
        $.ajax({
            url: service.htmlHost + "/pf/uc/upAppShow",
            type: 'post',
            data: params.data,
            success: function success(data) {
                handleSuccess(data, params.success, params.fail);
            },
            error: function error(xhrData) {
                handleError(xhrData);
            }
        });
    };

    //获取应用信息
    var getAppList = function getAppList(params) {
        return $.ajax({
            url: service.htmlHost + '/pf/uc/applist',
            type: "get",
            data: params.data,
            success: function success(data) {
                handleSuccess(data, params.success, params.fail);
            },
            error: function error(xhrData) {
                handleError(xhrData);
            }
        });
    };

    //获取应用分类
    var getAppCategory = function getAppCategory(params) {
        $.ajax({
            url: service.htmlHost + "/pf/api/app/types",
            type: 'get',
            data: {},
            success: function success(data) {
                handleSuccess(data, params.success, params.fail);
            },
            error: function error(xhrData) {
                handleError(xhrData);
            }
        });
    };

    //判断是否登录
    var isLogin = function isLogin(params) {
        $.ajax({
            url: service.htmlHost + '/pf/api/header/user.json',
            type: 'get',
            data: {},
            async: false,
            success: function success(data) {
                console.log("user.jsonp");
                console.log(data);
                if (data.result.code == "success") {
                    params.success(data);
                } else if (data.code == "login_error") {
                    params.fail();
                }
            },
            error: function error(xhrData) {
                handleError(xhrData);
            }
        });
    };
    //获取进入地址
    var enterApp = function enterApp(params) {
        $.ajax({
            url: service.htmlHost + '/pf/api/app/verify',
            type: 'get',
            data: params.data,
            success: function success(data) {
                handleSuccess(data, params.success, params.fail);
            },
            error: function error(xhrData) {
                handleError(xhrData);
            }
        });
    };

    //获取下载地址
    var downloadApp = function downloadApp(params) {
        $.ajax({
            url: service.htmlHost + '/pf/api/app/verifyDown',
            type: 'get',
            data: params.data,
            success: function success(data) {
                handleSuccess(data, params.success, params.fail);
            },
            error: function error(xhrData) {
                handleError(xhrData);
            }
        });
    };

    var handleSuccess = function handleSuccess(data, callbackSuccess, callbackFailed) {
        if (data && data.code == "success") {
            //异常处理
            if (typeof callbackSuccess == "function") {
                callbackSuccess(data);
            }
        } else if (data.code == "failed" || data.code == "login_error" || JSON.parse(data) && JSON.parse(data).code == "login_error") {
            if (typeof callbackFailed == "function") {
                callbackFailed();
            }
        }
    };
    var handleError = function handleError(xhrData) {};
    return {
        "deleteApp": deleteApp,
        "addApps": addApps,
        "setAppStatus": setAppStatus,
        "getAppList": getAppList,
        "getAppCategory": getAppCategory,
        "isLogin": isLogin,
        "enterApp": enterApp,
        "downloadApp": downloadApp
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlcnNDZW50ZXIvanMvYWpheGhlbHBlci5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCIkIiwic2VydmljZSIsImRlbGV0ZUFwcCIsInBhcmFtcyIsImRhdGEiLCJzZXRBcHBTdGF0dXMiLCJzdWNjZXNzIiwiZmFpbCIsImFkZEFwcHMiLCJhamF4IiwidXJsIiwiaHRtbEhvc3QiLCJ0eXBlIiwiaGFuZGxlU3VjY2VzcyIsImVycm9yIiwieGhyRGF0YSIsImhhbmRsZUVycm9yIiwiZ2V0QXBwTGlzdCIsImdldEFwcENhdGVnb3J5IiwiaXNMb2dpbiIsImFzeW5jIiwiY29uc29sZSIsImxvZyIsInJlc3VsdCIsImNvZGUiLCJlbnRlckFwcCIsImRvd25sb2FkQXBwIiwiY2FsbGJhY2tTdWNjZXNzIiwiY2FsbGJhY2tGYWlsZWQiLCJKU09OIiwicGFyc2UiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU8sWUFBUCxFQUFvQixDQUFDLFFBQUQsRUFBVSxTQUFWLENBQXBCLEVBQXlDLFVBQVVDLENBQVYsRUFBWUMsT0FBWixFQUFxQjs7QUFFMUQ7QUFDQSxRQUFJQyxZQUFZLFNBQVpBLFNBQVksQ0FBVUMsTUFBVixFQUFrQjtBQUM5QixZQUFJQyxPQUFPLEVBQUMsT0FBTUQsT0FBT0MsSUFBZCxFQUFtQixRQUFPLEtBQTFCLEVBQVg7QUFDQUMscUJBQWE7QUFDVCxvQkFBT0QsSUFERTtBQUVULHVCQUFVRCxPQUFPRyxPQUZSO0FBR1Qsb0JBQU9ILE9BQU9JO0FBSEwsU0FBYjtBQUtILEtBUEQ7O0FBU0E7QUFDQSxRQUFJQyxVQUFVLFNBQVZBLE9BQVUsQ0FBVUwsTUFBVixFQUFrQjtBQUM1QixZQUFJQyxPQUFPLEVBQUMsT0FBTUQsT0FBT0MsSUFBZCxFQUFtQixRQUFPLElBQTFCLEVBQVg7QUFDQUMscUJBQWE7QUFDVCxvQkFBT0QsSUFERTtBQUVULHVCQUFVRCxPQUFPRyxPQUZSO0FBR1Qsb0JBQU9ILE9BQU9JO0FBSEwsU0FBYjtBQUtILEtBUEQ7O0FBU0E7QUFDQSxRQUFJRixlQUFlLFNBQWZBLFlBQWUsQ0FBVUYsTUFBVixFQUFrQjtBQUNqQ0gsVUFBRVMsSUFBRixDQUFPO0FBQ0hDLGlCQUFJVCxRQUFRVSxRQUFSLEdBQW1CLGtCQURwQjtBQUVIQyxrQkFBSyxNQUZGO0FBR0hSLGtCQUFLRCxPQUFPQyxJQUhUO0FBSUhFLHFCQUFRLGlCQUFVRixJQUFWLEVBQWdCO0FBQ3BCUyw4QkFBY1QsSUFBZCxFQUFtQkQsT0FBT0csT0FBMUIsRUFBa0NILE9BQU9JLElBQXpDO0FBQ0gsYUFORTtBQU9ITyxtQkFBTSxlQUFVQyxPQUFWLEVBQW1CO0FBQ3JCQyw0QkFBWUQsT0FBWjtBQUNIO0FBVEUsU0FBUDtBQVdILEtBWkQ7O0FBZ0JBO0FBQ0EsUUFBSUUsYUFBYSxTQUFiQSxVQUFhLENBQVNkLE1BQVQsRUFBaUI7QUFDOUIsZUFBT0gsRUFBRVMsSUFBRixDQUFPO0FBQ1ZDLGlCQUFJVCxRQUFRVSxRQUFSLEdBQW1CLGdCQURiO0FBRVZDLGtCQUFLLEtBRks7QUFHVlIsa0JBQUtELE9BQU9DLElBSEY7QUFJVkUscUJBQVEsaUJBQVVGLElBQVYsRUFBZ0I7QUFDcEJTLDhCQUFjVCxJQUFkLEVBQW1CRCxPQUFPRyxPQUExQixFQUFrQ0gsT0FBT0ksSUFBekM7QUFDSCxhQU5TO0FBT1ZPLG1CQUFNLGVBQVVDLE9BQVYsRUFBbUI7QUFDckJDLDRCQUFZRCxPQUFaO0FBQ0g7QUFUUyxTQUFQLENBQVA7QUFXSCxLQVpEOztBQWVBO0FBQ0EsUUFBSUcsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFVZixNQUFWLEVBQWtCO0FBQ25DSCxVQUFFUyxJQUFGLENBQU87QUFDSEMsaUJBQUlULFFBQVFVLFFBQVIsR0FBbUIsbUJBRHBCO0FBRUhDLGtCQUFLLEtBRkY7QUFHSFIsa0JBQUssRUFIRjtBQUlIRSxxQkFBUSxpQkFBVUYsSUFBVixFQUFnQjtBQUNwQlMsOEJBQWNULElBQWQsRUFBbUJELE9BQU9HLE9BQTFCLEVBQWtDSCxPQUFPSSxJQUF6QztBQUNILGFBTkU7QUFPSE8sbUJBQU0sZUFBVUMsT0FBVixFQUFtQjtBQUNyQkMsNEJBQVlELE9BQVo7QUFDSDtBQVRFLFNBQVA7QUFXSCxLQVpEOztBQWNBO0FBQ0EsUUFBSUksVUFBVSxTQUFWQSxPQUFVLENBQVVoQixNQUFWLEVBQWtCO0FBQzVCSCxVQUFFUyxJQUFGLENBQU87QUFDSEMsaUJBQUlULFFBQVFVLFFBQVIsR0FBbUIsMEJBRHBCO0FBRUhDLGtCQUFLLEtBRkY7QUFHSFIsa0JBQUssRUFIRjtBQUlIZ0IsbUJBQU8sS0FKSjtBQUtIZCxxQkFBUSxpQkFBVUYsSUFBVixFQUFnQjtBQUNwQmlCLHdCQUFRQyxHQUFSLENBQWEsWUFBYjtBQUNBRCx3QkFBUUMsR0FBUixDQUFhbEIsSUFBYjtBQUNBLG9CQUFJQSxLQUFLbUIsTUFBTCxDQUFZQyxJQUFaLElBQW9CLFNBQXhCLEVBQW1DO0FBQy9CckIsMkJBQU9HLE9BQVAsQ0FBZUYsSUFBZjtBQUNILGlCQUZELE1BRU0sSUFBSUEsS0FBS29CLElBQUwsSUFBYSxhQUFqQixFQUFnQztBQUNuQ3JCLDJCQUFPSSxJQUFQO0FBQ0Y7QUFDSixhQWJFO0FBY0hPLG1CQUFNLGVBQVVDLE9BQVYsRUFBbUI7QUFDckJDLDRCQUFZRCxPQUFaO0FBQ0g7QUFoQkUsU0FBUDtBQWtCSCxLQW5CRDtBQW9CQTtBQUNBLFFBQUlVLFdBQVcsU0FBWEEsUUFBVyxDQUFVdEIsTUFBVixFQUFrQjtBQUM3QkgsVUFBRVMsSUFBRixDQUFPO0FBQ0hDLGlCQUFJVCxRQUFRVSxRQUFSLEdBQW1CLG9CQURwQjtBQUVIQyxrQkFBSyxLQUZGO0FBR0hSLGtCQUFLRCxPQUFPQyxJQUhUO0FBSUhFLHFCQUFRLGlCQUFVRixJQUFWLEVBQWdCO0FBQ3BCUyw4QkFBY1QsSUFBZCxFQUFtQkQsT0FBT0csT0FBMUIsRUFBa0NILE9BQU9JLElBQXpDO0FBQ0gsYUFORTtBQU9ITyxtQkFBTSxlQUFVQyxPQUFWLEVBQW1CO0FBQ3JCQyw0QkFBWUQsT0FBWjtBQUNIO0FBVEUsU0FBUDtBQVdILEtBWkQ7O0FBY0E7QUFDQSxRQUFJVyxjQUFjLFNBQWRBLFdBQWMsQ0FBVXZCLE1BQVYsRUFBa0I7QUFDaENILFVBQUVTLElBQUYsQ0FBTztBQUNIQyxpQkFBSVQsUUFBUVUsUUFBUixHQUFtQix3QkFEcEI7QUFFSEMsa0JBQUssS0FGRjtBQUdIUixrQkFBS0QsT0FBT0MsSUFIVDtBQUlIRSxxQkFBUSxpQkFBVUYsSUFBVixFQUFnQjtBQUNwQlMsOEJBQWNULElBQWQsRUFBbUJELE9BQU9HLE9BQTFCLEVBQWtDSCxPQUFPSSxJQUF6QztBQUNILGFBTkU7QUFPSE8sbUJBQU0sZUFBVUMsT0FBVixFQUFtQjtBQUNyQkMsNEJBQVlELE9BQVo7QUFDSDtBQVRFLFNBQVA7QUFXSCxLQVpEOztBQWNBLFFBQUlGLGdCQUFpQixTQUFqQkEsYUFBaUIsQ0FBVVQsSUFBVixFQUFldUIsZUFBZixFQUErQkMsY0FBL0IsRUFBK0M7QUFDaEUsWUFBR3hCLFFBQVFBLEtBQUtvQixJQUFMLElBQVksU0FBdkIsRUFBaUM7QUFBRTtBQUMvQixnQkFBRyxPQUFPRyxlQUFQLElBQTBCLFVBQTdCLEVBQXdDO0FBQ3BDQSxnQ0FBZ0J2QixJQUFoQjtBQUNIO0FBQ0osU0FKRCxNQUlNLElBQUdBLEtBQUtvQixJQUFMLElBQWEsUUFBYixJQUF5QnBCLEtBQUtvQixJQUFMLElBQWEsYUFBdEMsSUFBd0RLLEtBQUtDLEtBQUwsQ0FBVzFCLElBQVgsS0FBcUJ5QixLQUFLQyxLQUFMLENBQVcxQixJQUFYLEVBQWlCb0IsSUFBakIsSUFBd0IsYUFBeEcsRUFBdUg7QUFDekgsZ0JBQUcsT0FBT0ksY0FBUCxJQUF5QixVQUE1QixFQUF1QztBQUNuQ0E7QUFDSDtBQUNKO0FBQ0osS0FWRDtBQVdBLFFBQUlaLGNBQWMsU0FBZEEsV0FBYyxDQUFVRCxPQUFWLEVBQW1CLENBRXBDLENBRkQ7QUFHQSxXQUFPO0FBQ0gscUJBQVliLFNBRFQ7QUFFSCxtQkFBVU0sT0FGUDtBQUdILHdCQUFlSCxZQUhaO0FBSUgsc0JBQWFZLFVBSlY7QUFLSCwwQkFBaUJDLGNBTGQ7QUFNSCxtQkFBVUMsT0FOUDtBQU9ILG9CQUFXTSxRQVBSO0FBUUgsdUJBQWNDO0FBUlgsS0FBUDtBQVVILENBakpEIiwiZmlsZSI6InBlcnNDZW50ZXIvanMvYWpheGhlbHBlci00YzhiNGM5ODU2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFwiYWpheGhlbHBlclwiLFtcImpxdWVyeVwiLFwic2VydmljZVwiXSxmdW5jdGlvbiAoJCxzZXJ2aWNlKSB7XHJcbiAgICBcclxuICAgIC8v5Yig6Zmk5p+Q5Liq5bqU55SoXHJcbiAgICB2YXIgZGVsZXRlQXBwID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgIHZhciBkYXRhID0ge1wiaWRzXCI6cGFyYW1zLmRhdGEsXCJzaG93XCI6ZmFsc2V9O1xyXG4gICAgICAgIHNldEFwcFN0YXR1cyh7XHJcbiAgICAgICAgICAgIFwiZGF0YVwiOmRhdGEsXHJcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOnBhcmFtcy5zdWNjZXNzLFxyXG4gICAgICAgICAgICBcImZhaWxcIjpwYXJhbXMuZmFpbFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvL+mbhuWQiOa3u+WKoOW6lOeUqFxyXG4gICAgdmFyIGFkZEFwcHMgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XCJpZHNcIjpwYXJhbXMuZGF0YSxcInNob3dcIjp0cnVlfTtcclxuICAgICAgICBzZXRBcHBTdGF0dXMoe1xyXG4gICAgICAgICAgICBcImRhdGFcIjpkYXRhLFxyXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjpwYXJhbXMuc3VjY2VzcyxcclxuICAgICAgICAgICAgXCJmYWlsXCI6cGFyYW1zLmZhaWxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIC8v6K6+572u5bqU55So54q25oCBXHJcbiAgICB2YXIgc2V0QXBwU3RhdHVzID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDpzZXJ2aWNlLmh0bWxIb3N0ICsgXCIvcGYvdWMvdXBBcHBTaG93XCIsXHJcbiAgICAgICAgICAgIHR5cGU6J3Bvc3QnLFxyXG4gICAgICAgICAgICBkYXRhOnBhcmFtcy5kYXRhLFxyXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVTdWNjZXNzKGRhdGEscGFyYW1zLnN1Y2Nlc3MscGFyYW1zLmZhaWwpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjpmdW5jdGlvbiAoeGhyRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoeGhyRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIC8v6I635Y+W5bqU55So5L+h5oGvXHJcbiAgICB2YXIgZ2V0QXBwTGlzdCA9IGZ1bmN0aW9uKHBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6c2VydmljZS5odG1sSG9zdCArICcvcGYvdWMvYXBwbGlzdCcsXHJcbiAgICAgICAgICAgIHR5cGU6XCJnZXRcIixcclxuICAgICAgICAgICAgZGF0YTpwYXJhbXMuZGF0YSxcclxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlU3VjY2VzcyhkYXRhLHBhcmFtcy5zdWNjZXNzLHBhcmFtcy5mYWlsKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24gKHhockRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKHhockRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvL+iOt+WPluW6lOeUqOWIhuexu1xyXG4gICAgdmFyIGdldEFwcENhdGVnb3J5ID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDpzZXJ2aWNlLmh0bWxIb3N0ICsgXCIvcGYvYXBpL2FwcC90eXBlc1wiLFxyXG4gICAgICAgICAgICB0eXBlOidnZXQnLFxyXG4gICAgICAgICAgICBkYXRhOnt9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVTdWNjZXNzKGRhdGEscGFyYW1zLnN1Y2Nlc3MscGFyYW1zLmZhaWwpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjpmdW5jdGlvbiAoeGhyRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoeGhyRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfTtcclxuXHJcbiAgICAvL+WIpOaWreaYr+WQpueZu+W9lVxyXG4gICAgdmFyIGlzTG9naW4gPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOnNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9oZWFkZXIvdXNlci5qc29uJyxcclxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcclxuICAgICAgICAgICAgZGF0YTp7fSxcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJ1c2VyLmpzb25wXCIgKVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGRhdGEgKVxyXG4gICAgICAgICAgICAgICAgaWYoIGRhdGEucmVzdWx0LmNvZGUgPT0gXCJzdWNjZXNzXCIgKXtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMuc3VjY2VzcyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKCBkYXRhLmNvZGUgPT0gXCJsb2dpbl9lcnJvclwiICl7XHJcbiAgICAgICAgICAgICAgICAgICBwYXJhbXMuZmFpbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjpmdW5jdGlvbiAoeGhyRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlRXJyb3IoeGhyRGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfTtcclxuICAgIC8v6I635Y+W6L+b5YWl5Zyw5Z2AXHJcbiAgICB2YXIgZW50ZXJBcHAgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOnNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9hcHAvdmVyaWZ5JyxcclxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcclxuICAgICAgICAgICAgZGF0YTpwYXJhbXMuZGF0YSxcclxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlU3VjY2VzcyhkYXRhLHBhcmFtcy5zdWNjZXNzLHBhcmFtcy5mYWlsKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24gKHhockRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKHhockRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgLy/ojrflj5bkuIvovb3lnLDlnYBcclxuICAgIHZhciBkb3dubG9hZEFwcCA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6c2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL2FwcC92ZXJpZnlEb3duJyxcclxuICAgICAgICAgICAgdHlwZTonZ2V0JyxcclxuICAgICAgICAgICAgZGF0YTpwYXJhbXMuZGF0YSxcclxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlU3VjY2VzcyhkYXRhLHBhcmFtcy5zdWNjZXNzLHBhcmFtcy5mYWlsKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6ZnVuY3Rpb24gKHhockRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKHhockRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHZhciBoYW5kbGVTdWNjZXNzICA9IGZ1bmN0aW9uIChkYXRhLGNhbGxiYWNrU3VjY2VzcyxjYWxsYmFja0ZhaWxlZCkge1xyXG4gICAgICAgIGlmKGRhdGEgJiYgZGF0YS5jb2RlID09XCJzdWNjZXNzXCIpeyAvL+W8guW4uOWkhOeQhlxyXG4gICAgICAgICAgICBpZih0eXBlb2YgY2FsbGJhY2tTdWNjZXNzID09IFwiZnVuY3Rpb25cIil7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja1N1Y2Nlc3MoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSBpZihkYXRhLmNvZGUgPT0gXCJmYWlsZWRcIiB8fCBkYXRhLmNvZGUgPT0gXCJsb2dpbl9lcnJvclwiIHx8IChKU09OLnBhcnNlKGRhdGEpICYmICBKU09OLnBhcnNlKGRhdGEpLmNvZGUgPT1cImxvZ2luX2Vycm9yXCIpKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIGNhbGxiYWNrRmFpbGVkID09IFwiZnVuY3Rpb25cIil7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja0ZhaWxlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBoYW5kbGVFcnJvciA9IGZ1bmN0aW9uICh4aHJEYXRhKSB7XHJcblxyXG4gICAgfTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgXCJkZWxldGVBcHBcIjpkZWxldGVBcHAsXHJcbiAgICAgICAgXCJhZGRBcHBzXCI6YWRkQXBwcyxcclxuICAgICAgICBcInNldEFwcFN0YXR1c1wiOnNldEFwcFN0YXR1cyxcclxuICAgICAgICBcImdldEFwcExpc3RcIjpnZXRBcHBMaXN0LFxyXG4gICAgICAgIFwiZ2V0QXBwQ2F0ZWdvcnlcIjpnZXRBcHBDYXRlZ29yeSxcclxuICAgICAgICBcImlzTG9naW5cIjppc0xvZ2luLFxyXG4gICAgICAgIFwiZW50ZXJBcHBcIjplbnRlckFwcCxcclxuICAgICAgICBcImRvd25sb2FkQXBwXCI6ZG93bmxvYWRBcHBcclxuICAgIH07XHJcbn0pO1xyXG4iXX0=

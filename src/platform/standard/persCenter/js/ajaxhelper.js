define("ajaxhelper",["jquery","service"],function ($,service) {
    
    //删除某个应用
    var deleteApp = function (params) {
        var data = {"ids":params.data,"show":false};
        setAppStatus({
            "data":data,
            "success":params.success,
            "fail":params.fail
        });
    };

    //集合添加应用
    var addApps = function (params) {
        var data = {"ids":params.data,"show":true};
        setAppStatus({
            "data":data,
            "success":params.success,
            "fail":params.fail
        });
    };
    
    //设置应用状态
    var setAppStatus = function (params) {
        $.ajax({
            url:service.htmlHost + "/pf/uc/upAppShow",
            type:'post',
            data:params.data,
            success:function (data) {
                handleSuccess(data,params.success,params.fail);
            },
            error:function (xhrData) {
                handleError(xhrData);
            }
        })
    };



    //获取应用信息
    var getAppList = function(params) {
        return $.ajax({
            url:service.htmlHost + '/pf/uc/applist',
            type:"get",
            data:params.data,
            success:function (data) {
                handleSuccess(data,params.success,params.fail);
            },
            error:function (xhrData) {
                handleError(xhrData);
            }
        });
    };


    //获取应用分类
    var getAppCategory = function (params) {
        $.ajax({
            url:service.htmlHost + "/pf/api/app/types",
            type:'get',
            data:{},
            success:function (data) {
                handleSuccess(data,params.success,params.fail);
            },
            error:function (xhrData) {
                handleError(xhrData);
            }
        })
    };

    //判断是否登录
    var isLogin = function (params) {
        $.ajax({
            url:service.htmlHost + '/pf/api/header/user.json',
            type:'get',
            data:{},
            async: false,
            success:function (data) {
                console.log( "user.jsonp" )
                console.log( data )
                if( data.result.code == "success" ){
                    params.success(data);
                }else if( data.code == "login_error" ){
                   params.fail();
                }
            },
            error:function (xhrData) {
                handleError(xhrData);
            }
        })
    };
    //获取进入地址
    var enterApp = function (params) {
        $.ajax({
            url:service.htmlHost + '/pf/api/app/verify',
            type:'get',
            data:params.data,
            success:function (data) {
                handleSuccess(data,params.success,params.fail);
            },
            error:function (xhrData) {
                handleError(xhrData);
            }
        })
    };

    //获取下载地址
    var downloadApp = function (params) {
        $.ajax({
            url:service.htmlHost + '/pf/api/app/verifyDown',
            type:'get',
            data:params.data,
            success:function (data) {
                handleSuccess(data,params.success,params.fail);
            },
            error:function (xhrData) {
                handleError(xhrData);
            }
        })
    };
    
    var handleSuccess  = function (data,callbackSuccess,callbackFailed) {
        if(data && data.code =="success"){ //异常处理
            if(typeof callbackSuccess == "function"){
                callbackSuccess(data);
            }
        }else if(data.code == "failed" || data.code == "login_error" || (JSON.parse(data) &&  JSON.parse(data).code =="login_error")){
            if(typeof callbackFailed == "function"){
                callbackFailed();
            }
        }
    };
    var handleError = function (xhrData) {

    };
    return {
        "deleteApp":deleteApp,
        "addApps":addApps,
        "setAppStatus":setAppStatus,
        "getAppList":getAppList,
        "getAppCategory":getAppCategory,
        "isLogin":isLogin,
        "enterApp":enterApp,
        "downloadApp":downloadApp
    };
});

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  },
  enforeDefine: true
});
require(['platformConf'], function (configpaths) {
  configpaths.paths.header = 'header/js/header.js';
  configpaths.paths.footer = 'footer/js/logout.js';
  require.config(configpaths);

require(['jquery', 'tools','service','layer','dialog','ajaxhelper','footer','header','template'], function ($, tools,service,layer,dialog,ajaxhelper) {
    $("#html-content").css({"visibility":"inherit"});
    /*var intoApps = [
        {appid:85, name:'优课v4', url:'UClass.URL'},
        {appid:107, name:'2D物理', url:'twodimensionphysical.URL'},
        {appid:108, name:'2D化学', url:'twodimensionChemical.URL'},
        {appid:109, name:'3D物理', url:'threedimensionalphysical.URL'},
        {appid:89, name:'备课大师', url:'beikedashi.URL'},
        {appid:7, name:'优课v2', url:'UClass.URL'}
    ];*/

    ajaxhelper.getAppCategory({
       success:function (data) {
           var resultString = '<li class="header-li" data-id="0"><span class="tab-choose">全部</span></li>';
           for(var index in data.data){
               resultString += '<li class="header-li" data-id="'+ data.data[index].id +'"><span>'+ data.data[index].name +'</span></li>';
           }
           $(".header-list").html(resultString);
           var childCount = $(".header-li").children().length;
           $(".header-li").each(function (index) {
               if(index == 0){
                   $(this).css({"padding-left":0});
                   return;
               }
               if(index == childCount - 1){
                   $(this).css({"border-right":"none"});
                   return;
               }
           });
           initEvent();
       },
       fail:function () {
           layer.alert("请登录后再试");
       } 
    });

    /*//进入应用
    $('#app-list').on('mousedown','.into',function(){
        if( $(this).hasClass('no-drop') ){
            return;
        }
        var appId = $(this).attr('appId');
        var url = getAppUrl(appId);;
        if( $(this).attr('isSetUrl') == 1 ){
            $.ajax({
                url: service.htmlHost + '/member/' + loginInfo.userID + '/account',
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if( data.code && data.code == 200 ){
                        var appUrl = url + '://a$' + data.login_name + ' pw$' + data.password;
                        $('body').append('<iframe style="position: absolute;top: -999999px;left: -99999px" src="' + appUrl + '"></iframe>')
                    }else{
                    }
                    return false;
                },
                error: function (data) {
                }
            });
            return false;
        }
    });*/

    //加载用户选择类型的应用
    function getUserApp(categoryID){
        var data = parseInt(categoryID) == 0?{}:{"category":parseInt(categoryID)};
        ajaxhelper.getAppList({
            "data":data,
            success:function (data) {
                var list = '';
                if( data.data.length )  {
                    for (var i = 0; i < data.data.length; i++) {
                        if( !data.data[i].isShow)  continue;
                        if( data.data[i].id == 12 ){
                            data.data[i].appUrl = data.data[i].appUrl + '&totype=area';
                        }
                        list += '<li class="app-li">' +
                            '<img class="app-pic" src="' + getPicPath(data.data[i].logo)  + '">' +
                            '<div class="app-msg">' +
                            '<p><span class="app-name">' + data.data[i].name + '</span></p>' +
                            '<p class="clearFix">';
                        if( data.data[i].downUrl && data.data[i].downUrl !== '' ){
                            list += '<a class="download btn" href="' + data.data[i].downUrl + '">下载应用</a>';
                        }

                        /*if( isIntoApp(data.data[i].appId) == 1 ){
                            list += '<a class="into btn" href="javascript:;" issetUrl="1" appId="' + data.data[i].appId + '">进入应用</a>';
                        }else{
                            list += '<a class="into btn" target="_blank" href="' + data.data[i].appUrl + '" appId="' + data.data[i].appId + '">进入应用</a>';
                        }*/
                        list += '<a class="into btn" target="_blank" data-href="' + data.data[i].appUrl + '"  appId="' + data.data[i].id + '">进入应用</a>';

                        list += '</p>' +
                            '</div>' +
                            '<span class="remove-btn icon-close-small" appId="' + data.data[i].id + '"></span>' +
                            '</li>';
                    }
                    list += ' <li id="add-app"  class="app-li"><div class="add-pic"><span></span>添加应用 </div></li>';
                }else{
                    list = '<li id="add-app"  class="app-li"><div class="add-pic"><span></span>添加应用 </div></li>';
                }
                $('#app-list').html(list);
                $(".into").each(function () {
                    var item = $(this);
                    $(this).click(function () {
                        ajaxhelper.isLogin({
                            "success":function () {
                                //解决a标签跳转前插入js被被浏览器阻拦的问题
                                var tempwindow = window.open('_blank');
                                tempwindow.location = item.data("href");
                            },
                            "fail":function () {
                                layer.alert("请登录后再试");
                                return;
                            }
                        });
                    });
                })
            },
            fail:function () {
                $("#app-list").empty().append(dialog.noContent("没有查到对应应用哦"));
                layer.alert("请登录后再试");
            }
        });
    }

    function getAddAppList() {
        var categoryID = getChooseCategory();
        var data = parseInt(categoryID) == 0?{}:{"category":parseInt(categoryID)};
        ajaxhelper.getAppList({
            "data":data,
            success:function (data) {
                dialog.addAppDialog(data, function (chooseData) {
                    var appIdString = "";
                    for(var index in chooseData.appId){
                        appIdString += chooseData.appId[index] + ",";
                    }
                    ajaxhelper.addApps({
                        "data":appIdString,
                        success:function () {
                            getUserApp(getChooseCategory());
                            layer.alert("添加应用成功");
                        },
                        fail:function () {
                            layer.alert("添加应用失败，请登录后再试")
                        }
                    })
                });
            },
            fail:function () {
                $("#app-list").empty().append(dialog.noContent("没有查到对应应用哦"));
                layer.alert("请登录后再试");
            }
        })
    }

    /*function isIntoApp(id){
        for (var i = 0; i < intoApps.length; i++) {
            if( intoApps[i].appid == id ){
                return 1;
            }
        }
        return 2;
    }
    function getAppUrl(id){
        for (var i = 0; i < intoApps.length; i++) {
            if( intoApps[i].appid == id ){
                return intoApps[i].url;
            }
        }
    }*/



    function initEvent() {
        getUserApp("0");
        $(".header-li").each(function () {
            $(this).click(function () {
                if($(this).find("span").hasClass("tab-choose")){
                    return;
                }else{
                    $(this).find("span").addClass("tab-choose").parents(".header-li").siblings().each(function () {
                        $(this).find("span").removeClass("tab-choose");
                    });
                    getUserApp($(this).data("id"));
                }
            })
        });
        //添加应用
        $('body').on('click','#add-app',function(){
            getAddAppList();
        });
        //删除应用
        $('body').on('click','.remove-btn',function(){
            var appId = $(this).attr('appId');
            layer.open({
                content: '确应删除该应用吗？'
                ,btn: ['确认', '取消']
                ,yes: function(index,layero){
                    ajaxhelper.deleteApp({
                        "data":appId,
                        "success":function () {
                            $(".app-li").each(function () {
                               if($(this).find(".remove-btn").attr("appId") == appId){
                                   $(this).remove();
                                   return;
                               }
                            });
                        },
                        "fail":function () {
                            layer.alert("请登录后在试;");
                        }
                    });
                    layer.close(index);
                },btn2: function(index, layero){
                    this.cancel();
                }
                ,cancel: function(){
                }
            });
        });
    }
    function getChooseCategory() {
        var id = "0";
        $(".header-li").each(function () {
            if($(this).find("span").hasClass("tab-choose")){
                id = $(this).data("id");
                return;
            }
        });
        return id;
    }

    function getPicPath(id){
        return service.prefix + '/pf/res/download/'+id;
    };
});


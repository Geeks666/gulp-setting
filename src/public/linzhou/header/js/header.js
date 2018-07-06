/**
 * Created by dell on 2017/5/3.
 */

// require.config({
//     paths: {
//         'jquery': '../../../../lib/jquery/jquery-1.11.2.min.js',
//         'service': '../../../../base/js/service.js'
//     }
// });

define(['jquery' , 'service' ] , function ( $ , service) {
    var STATE  = 0;//0表示未登录1表示登录
    function getPopPosition(target) {
        var popTop ,popLeft;
        if (target == "login"){
            popTop = (document.body.clientHeight/2 - 165) + 'px';
            popLeft = (document.body.clientWidth/2 - 180) + 'px';
        }
        else {
            popTop = (document.body.clientHeight/2 - 50) + 'px';
            popLeft = (document.body.clientWidth/2 - 100) + 'px';
        }
        return{
            popTop:popTop,
            popLeft:popLeft
        }
    }
    function getState() {
        return STATE;
    }
    var login = function (username, password) {
        var data = {
            username:username,
            password:password
        }
        $.ajax({
            url : service.htmlHost + 'login',
            type :'POST',
            dataType : "json",
            data:data,
            success : function(data){
                if (data.code === "failed") {
                    $(".tips").show();
                }
                else {
                    $(".tips").hide();
                }
                console.log(data);
                getuserinfo();
            },
            error : function(){

            }
        });
    };
    function getuserinfo() {
        $.ajax({
            url : service.htmlHost + 'pf/api/header/user.json',
            type :'GET',
            success : function(data){
                console.log(data);
                if(data.result.code === "success" ){
                    STATE = 1;
                    $("#_xiaozhuang_header .nav .bg").show();
                    $(".mask").hide();
                    $(".login_tab").hide();
                    $(".nav .name").text(data.result.data.userInfo.name);
                }

            }
        });
    }
    function exit() {
        $.ajax({
            url : service.htmlHost + 'logout',
            type :'GET',
            success : function(data){
                STATE = 0;
                if( window.location.href.indexOf("persCenter") ){
                    window.location.href = service.htmlHost+"/dist/platform/www/home/index.html";
                }else{
                    window.location.reload();
                }
            },
            error : function(){
                if( window.location.href.indexOf("persCenter") ){
                    window.location.href = service.htmlHost+"/platform/www/home/index.html";
                }else{
                    window.location.reload();
                }
            }
        });
    }
    function init() {
        $("#button").click(function () {
            var username = $("#user").val();
            var password = $("#psw").val();
            login(username, password);
        });
        $(".nav .name,.nav .bg").click(function () {
            var text = $(".nav .name").text();
            var $option = $(".option");
            if (!STATE&&text==="登录") {
                var popPosition = getPopPosition('login');
                $(".mask").show();
                $(".login_tab").show().css({
                    left:popPosition.popLeft,
                    top:popPosition.popTop
                });
            }
            else {
                $option[0].style.display!="block"?$option.show():$option.hide();
            }
        });
        $(".nav .logo").click(function () {
            var url = window.location.href;
            if(window.location.href.indexOf("persCenter") == -1){
                window.location.href = "index.html"
            }
            else {
                window.location.href = "../home/index.html"

            }

        });
        $(".close").click(function () {
            $(".mask").hide()
        });
        $(".exit").click(function (e) {
            var e = window.event || event;
            if ( e.stopPropagation ){
                e.stopPropagation();
            }else{
                window.event.cancelBubble = true;
            }
            exit();
        });
        $(".person").click(function (e) {
            var e = window.event || event;
            if ( e.stopPropagation ){
                e.stopPropagation();
            }else{
                window.event.cancelBubble = true;
            }
            window.location.href = "../persCenter/persCenter.html"
        });
        getuserinfo();
    }
    init();
    return {
        STATE: getState,
        getPosition:getPopPosition
    };
});



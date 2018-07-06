define(['jquery' , 'service' , 'orgConfig' ,'tools' , 'template' , 'addFav' , 'appVerify'] , function ( $ , service , orgConfig , tools , template , addFav , appVerify) {
  var userInfo = null;//用户信息
  var schoolList = null;//白银区下学校列表
  var userRole = "";//活动运营用户角色
  initNavList();
  getUserInfo();

  /*
  * 首页显示下拉
  * */
  var curOpenPage = window.location.href.split("/")[(window.location.href.split("/")).length-1];
  if(curOpenPage == 'index.html'){
    $('.chooseArea').show();
  }else{
    $(".chooseArea").hide();
  }

  function initNavList() {
    var navList = [
      {
        "id": "1",
        "name": "首页",
        "url": service.prefix + "/dist/platform/www/home/index.html",
        "iconurl": service.prefix + "/dist/public/header/images/index.png",
        'newOpen': false
      },
      {
        "id": "2",
        "name": "资源",
        "url": service.sourcePlatformBase + "?requireLogin=false",
        "iconurl": service.htmlHost + "/dist/public/header/images/resource.png",
        'newOpen': true
      },
      {
        "id": "3",
        "name": "应用",
        "url": service.prefix + "/dist/platform/www/app/application.html",
        "iconurl": service.htmlHost + "/dist/public/header/images/app.png",
        'newOpen': false
      },
      {
        "id": "4",
        "name": "空间",
        "url": service.newSpaceBase + "/JCenterHome/www/interspace/interspace.html",
        "iconurl": service.htmlHost + "/dist/public/header/images/space.png",
        'newOpen': false
      },
      {
        "id": "5",
        "name": "活动",
        "url": "javascript:void(0);",
        "iconurl": "",
        'newOpen': false,
        "type": "activity"
      },
      {
        "id": "6",
        "name": "数据",
        "url": "javascript:void(0);",
        "iconurl": "",
        'newOpen': false,
        "type": "statistics-header"
      }
    ];
    var data = {"navList" : navList };
    $("#nav .nav_bottom ul").html( template("navList", data ) );
  };
  function getUserInfo() {
    var userJumpHref = {
      'mySpace' : service.newSpaceBase + '/home?requireLogin=true',
      'myApp' : service.htmlHost+'dist/platform/www/persCenter/persApp.html',
      'personCenter' : service.htmlHost+'/dist/platform/www/persCenter/persCenter.html',
      'spaceManager' : service.newSpaceBase + '/home?requireLogin=true',
      'managerCenter' : service.newSpaceBase + '/JCenterHome/persCenter/manageCen.html?spaceId=cdf26851780d41029fa149ec3f21c4df&spaceType=school',
      'adminManager' : service.adminManager
    };
    if( localStorage.userInfo ){
      userInfo = localStorage.userInfo;
    }else{
      //请求获取
      $.ajax({
        url : service.prefix + '/pf/api/header/user.jsonp',
        type :'GET',
        dataType : "jsonp",
        jsonp: "callback",
        success : function(data){
          if( data.result.code == "success" ){
            userInfo = data.result.data;
            if( $("#reviewEnter").length>0 ){
              getUserRole( userInfo.id );
            }
          }else if( data.code == "login_error" ){
            console.log("用户没有登录");
          }
          data.result.userJumpHref = userJumpHref;
          $("#login_message").append(template("loginMessage", {"data": data.result}));
        }
      });
    }
  }
  /** 平台登录方法(oauth)方法*/
  function oauthLogin(){
    var url = window.location.href;
    if(url.indexOf("#page")){
      url = url.split("#page")[0];
    }
    window.location.href = service.prefix + '/login?redirectUrl=' + url;
  };
  function logout() {

      $.ajax({
        url : service.prefix + '/logout',
        type :'GET',
        dataType : "jsonp",
        jsonp: "callback",
        success : function(data){
          if( window.location.href.indexOf("persCenter") ){
            window.location.href = service.htmlHost+"/dist/platform/www/home/index.html";
          }else{
            window.location.reload();
          }
        },
        error : function(){
          if( window.location.href.indexOf("persCenter") ){
            window.location.href = service.htmlHost+"/dist/platform/www/home/index.html";
          }else{
            window.location.reload();
          }
        }
      });
  };
  function getUserRole( userId ){
      $.ajax({
        url: service.activityHost + '/authority/anonymous/getAuthority?userId=' + userId,
        type: 'GET',
        dataType: "jsonp",
        jsonp: "callbackuser",
        success: function (data) {
          userRole = data.data.roleId;
        },
        error: function (data) {
          layer.alert('服务器异常', {icon: 0});
        }
      });

  };
  $("body").delegate("#login_message .loginButton" , "click" , function () {
    oauthLogin();
  });
  $("body").delegate(".logout", "click", function () {
    logout();
  });
  $("body").delegate("#login_message .userName>span , .chooseArea .area , .resourceNav>a" , "click" , function ( e ) {
    e.stopPropagation();
    var $arrow = $(this).find("span.arrow");
    if( $arrow.hasClass("arrowUp") ){
      $arrow.addClass("arrowDown").removeClass("arrowUp");
      $(this).parent().find(".chooseList").hide();
    }else{
      $arrow.addClass("arrowUp").removeClass("arrowDown");
      $(this).parent().find(".chooseList").show();
    }
  });

  $(document).click(function(){
    $("span.arrow").removeClass("arrowUp").addClass("arrowDown");
    $(".chooseList").hide();
  });
  $("body").delegate('#nav .verify_app_enter' , 'click' , function () {
    if($(this).attr('type') == 'activity'){
      $.ajax({
        url : service.activityHost + '/anonymous/activityIndex',
        type :'GET',
        dataType : "jsonp",
        jsonp: "callback",
        success : function(data){
          if(data.code=="success"){
            var w =window.open('about:blank');
            w.location.href=service.activityHost+data.data + ( userInfo ? '?login=true' : '?login=false' );
          }else {
            layer.alert(data.msg, {icon: 0});
          }
        },
        error : function ( data ) {
          layer.alert('服务器异常', {icon: 0});
        }
      });
    }else{
      if (!userInfo) {
        layer.alert("请登录后操作。", {icon: 0});
        return false;
      } else {
        appVerify.verifyApp( service.appIds.datawatch_appId , '2' ,'', 'about:self');
      }

    }

  });

  return window.mes = {
    getUser : function () {
      return userInfo;
    },
    getSchoolList : function () {
      return schoolList;
    },
    getUserRole : function () {
      return userRole;
    },

  }
});
	
	  

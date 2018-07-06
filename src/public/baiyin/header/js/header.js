
require.config({
  paths: {
    'jquery': '../../lib/jquery/jquery-1.11.2.min.js',
    'service': '../../base/js/service.js',
    'orgConfig': './config/orgConfig.js',
    'tools': '../../base/js/requiretools.js',
    'template': '../../lib/arTtemplate/template.js',
    'addFav': './public/header/js/addFav.js',
    'appVerify': './public/header/js/appVerify.js',
  }
});

define(['jquery' , 'service' , 'orgConfig' ,'tools' , 'template' , 'addFav' , 'appVerify'] , function ( $ , service , orgConfig , tools , template , addFav , appVerify) {
  var userInfo = null;//用户信息
  var schoolList = null;//白银区下学校列表
  var userRole = "";//活动运营用户角色
  initNavList();
  //getAppId('byqjyjID');
  initSchoolList( $("#schoolList") , 'school_list' , orgConfig.orgIds.baiyinAreaId );
  getUserInfo();
  function initNavList() {
    var navList = [
      {
        "id" : "1",
        "name": "首页",
        "url": service.htmlHost+"/dist/platform/www/home/index.html",
        'newOpen' : false
      },
      {
        "id" : "2",
        "name": "新闻",
        "url": service.htmlHost+"/dist/platform/www/news/sitenewsListInCategory.html",
        'newOpen' : false
      },
      {
        "id" : "3",
        "name": "资源",
        "url": "",
        'childNav' : [
          {
            'id' : '31',
            'name' : '本地资源',
            'url' : service.sourceSystemBase + '/apps.do',
            'newOpen' : false
          },{
            'id' : '32',
            'name' : '在线资源',
            'url' : service.sourcePlatformBase + "/syncTeaching/index?requireLogin=false",
            'newOpen' : false
          }
        ]
      },
      {
        "id" : "4",
        "name": "活动",
        "url": "javascript:void(0)",
        'newOpen' : true,
        'type' : 'activityId'
      },
      {
        "id" : "5",
        "name": "社区",
        "url": service.newSpaceBase + "/JCenterHome/www/interspace/interspace.html",
        'newOpen' : false
      }
    ];
    var data = {"navList" : navList };
    $("#nav .nav_bottom ul").html( template("navList", data ) );
  };
  function initSchoolList( $obj , temId , areaId ) {
    var url = service.htmlHost + '/pf/api/schshow/orgs';
    if( areaId ) url += '?areaId='+areaId;
    $.ajax({
      url : url,
      type :'GET',
      success : function(data){
        if( data && data.code == "success" ){
          if( data.data && data.data.length>0 ){
            $.each( data.data , function( i ){
              data.data[i].showName = tools.hideTextByLen( data.data[i].name , 10 );
            });
            schoolList = data.data;
            $obj.html( template( temId , data ) );
          }
        }else{
          layer.alert( data.msg , {icon: 0});
        }
      },
      error : function (data) {
        layer.alert("获取学校信息异常。", {icon: 0});
      }
    });

  }
  function getUserInfo() {
    var userJumpHref = {
      'mySpace' : service.newSpaceBase + '/home?requireLogin=true',
      'myApp' : service.htmlHost+'/dist/platform/www/app/app.html',
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
        url : service.platformHost + '/pf/api/header/user.jsonp',
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
    window.location.href = service.platformHost + '/login?redirectUrl=' + url;
  };
  function logout() {

      $.ajax({
        url : service.platformHost + '/logout',
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
    $.ajax({
      url : service.activityHost + '/anonymous/activityIndex',
      type :'GET',
      dataType : "jsonp",
      jsonp: "callback",
      success : function(data){
        if(data.code=="success"){
          window.location.href=service.activityHost+data.data + ( userInfo ? '?login=true' : '?login=false' );
        }else {
          layer.alert(data.msg, {icon: 0});
        }
      },
      error : function ( data ) {
        layer.alert('服务器异常', {icon: 0});
      }
    });
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
	
	  

require.config({
  paths: {
    'jquery': '../../../../lib/jquery/jquery-1.9.1.js',
    'template': '../../../../lib/arTtemplate/template.js',
    'layer': '../../../../lib/layer/layer.js',
    'service': '../../../../base/js/service.js',
    'orgConfig': '../../../../config/orgConfig.js',
    'header': '../../../../public/header/js/header.js',
    'appVerify': '../../../../public/header/js/appVerify.js',
  },
  shim: {
    'layer': {
      deps: ['jquery']
    }
  }
});
define(['jquery' , 'template' , 'layer' , 'service' , 'orgConfig' , 'header' , 'appVerify'],
    function ($ , template , layer , service , orgConfig , header , appVerify) {

      var allData = {
        'shareResourceCount' : {},
        'totalUser' : {}
      };
      getShareResourceCount( orgConfig.orgIds.baiyinAreaId );
      getTotalUser( orgConfig.orgIds.baiyinAreaId );
      getVideoCount();
      function getTotalUser( areaId , orgId ){
        var key = areaId ? areaId : orgId;
        if( allData.totalUser[key] == null ){
          var url = service.htmlHost + '/pf/api/schshow/teachers';
          if( areaId ) url += '?areaId='+areaId;
          if( orgId ) url += '?orgId='+orgId;
          $.ajax({
            url : url,
            type :'GET',
            success : function(data){
              if( data && data.code == "success" ){
                allData.totalUser[key] = data.data;
                $(".total_user .num").text(data.data);
              }else{
                layer.alert( data.msg , {icon: 0});
              }
            },
            error : function (data) {
              layer.alert("获取注册用户数异常。", {icon: 0});
            }
          });
        }else{
          $(".total_user .num").text( allData.totalUser[key] );
        }
      };
      function getShareResourceCount( areaId , orgId ){
        var key = areaId ? areaId : orgId;
        if( allData.shareResourceCount[key] == null ) {
          var url = service.htmlHost + '/pf/api/qtapp/resI_shareCount';
          if (areaId) url += '?areaId=' + areaId;
          if (orgId) url += '?orgId=' + orgId;
          $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
              if (data && data.code == "success") {
                allData.shareResourceCount[key] = data.data.data.resTotal;
                $(".teacher_rank .share_resource_num .num,.spaceNavul1 .share_resource_num .num").text(data.data.data.resTotal);
              } else {
                layer.alert(data.msg, {icon: 0});
              }
            },
            error: function (data) {
              layer.alert("获取分享资源数异常。", {icon: 0});
            }
          });
        }else{
          $(".teacher_rank .share_resource_num .num,.spaceNavul1 .share_resource_num .num").text(allData.shareResourceCount[key]);
        }
      };
      function getVideoCount(){
        var url = service.htmlHost + '/pf/api/rank/videoCount';
        $.ajax({
          url : url,
          type :'GET',
          success : function(data){
            if( data && data.code == "success" ){
              $(".total_ktsl .num1").text(data.data);
            }else{
              layer.alert( data.msg , {icon: 0});
            }
          },
          error : function (data) {
            layer.alert("获取课堂实录总条数异常。", {icon: 0});
          }
        });
      };

      $.each( $(".spaceNavul a.spaceLink") , function () {
        if( $(this).hasClass("ktsl")){
          $(this).attr("href" , '#' );
        }else{
          $(this).attr("href" , service.htmlHost + $(this).attr("data-href") );
        }
      });
      $('body').delegate('.spaceNavul li.application','click',function ( e ) {
        if( !header.getUser() ){
          layer.alert("请登录后操作。", {icon: 0});
          return false;
        }
      });

      //判断当前用户是否有权限进入课堂实录和看视频,
      $("body .wrap").delegate('.hanbo_enter' , 'click' , function () {
        if( header.getUser() ){
          appVerify.verifyApp( service.appIds[$(this).attr('type')] , '2' )
        }else{
          layer.alert("请登录后操作。", {icon: 0});
          return;
        }
      });

      return {
        getShareResourceCount : getShareResourceCount,
        getTotalUser : getTotalUser
      }
    });




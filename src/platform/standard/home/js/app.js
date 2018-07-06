define(['jquery', 'jqueryUI' , 'fullPage' , 'service' , 'tool' , 'layer' , 'header' ],
  function ( $ , jqueryUI , fullPage , service , tools , layer , header ) {

    $("body").delegate("#areaTeachResearch , #goTeach , #teachResearch , #jspj , #pingjiao" , "click" , function () {
      if(!header.getUser() ){
        layer.alert("请登录后操作。", {icon: 0});
        return;
      }
      verifyApp( service.appIds[$(this).attr("type")] , $(this).attr('kindCode') );
    });
    $('body').on('mousedown','.downUrl',function(){
      if(!header.getUser() ){
        layer.alert("请登录后操作。", {icon: 0});
        return;
      }
      verifyDownApp( service.appIds[$(this).attr("type")] , $(this).attr('kindCode') );
    });
    /**
     *
     * @param appId
     * @param kindCode 1:客户端 2：浏览器
     */
    function verifyApp( appId , kindCode ){
      var w = window;
      if( kindCode == '2'){
        w = window.open('about:blank')
      }
      $.ajax({
        url : service.htmlHost + "/pf/api/app/verify",
        type : "get",
        data : {"appId" : appId},
        success:function(data){
          if( data.code == "success" ){
            w.location.href = data.data;
          }else if( data.code == "failed" ){
            if( kindCode == '2'){
              w.close();
            }
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function ( data ) {
          layer.alert( "请求失败" , {icon: 0});
        }
      });
    };
    /**
     *
     * @param appId
     */
    function verifyDownApp( appId ){
      $.ajax({
        url : service.htmlHost + "/pf/api/app/verifyDown",
        type : "get",
        data : {"appId" : appId},
        success:function(data){
          if( data.code == "success" ){
            window.location.href = data.data;
          }else if( data.code == "failed" ){
            layer.alert("您没有该权限下载。", {icon: 0});
          }
        },
        error : function ( data ) {
          layer.alert("请求失败。", {icon: 0});
        }
      });
    };
  }
);


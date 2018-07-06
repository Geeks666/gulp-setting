define(['jquery' , 'service' ] , function ( $ , service ) {
    /**
     *
     * @param appId
     * @param kindCode 1:客户端 2：浏览器
     */
    function verifyApp( appId , kindCode , url ,openTarget){
      var w = openTarget?window:window.open('about:blank');
      if( kindCode == '1'){
        w = window;
      }
      $.ajax({
        url : service.htmlHost + "/pf/api/app/verifyJp.jsonp",
        type : "get",
        dataType :  "jsonp",
        jsonp: "callback",
        data : {"appId" : appId},
        success:function(data){
          data = data.result;
          if( data.code == "success" ){
            if( url )
              w.location.href = url;
            else
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

  return {
    'verifyApp' : verifyApp,
  };
});

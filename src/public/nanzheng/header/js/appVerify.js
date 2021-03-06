define(['jquery' , 'service' ] , function ( $ , service ) {


    /**
     *
     * @param appId
     * @param kindCode 1:客户端 2：浏览器
     */
  function verifyApp( appId , kindCode , url ,openTarget){
    var w = openTarget?window.open(openTarget):window.open('about:blank');
    if( kindCode == '1'){
      w = window;
    }
    $.ajax({
      url : service.htmlHost + "/pf/api/app/verify",
      type : "get",
      data : {"appId" : appId},
      success:function(data){
        if (data.code == "success") {
          w.location.href = data.data;
        } else if (data.code == "failed") {
          if (kindCode == '2') {
            w.close();
          }
          layer.alert(data.msg, {icon: 0});
        }
      },
      error : function ( data ) {
        layer.alert( "请求失败" , {icon: 0});
      }
    });
  }

  return {
    'verifyApp' : verifyApp
  };
});

define(['jquery' , 'service' , 'header'] , function ( $ , service , header) {
  $(function(){
    //判断当前用户是否有权限进入该APP,
    $("body").delegate('#morebook' , 'click' , function () {
      if( header.getUser() ){
        verifyApp( service.appIds[$(this).attr('type')] , '2' );
      }else{
        layer.alert("请登录后操作。", {icon: 0});
        return;
      }
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
  })
});

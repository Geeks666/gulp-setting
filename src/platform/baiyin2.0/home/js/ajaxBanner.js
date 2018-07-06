
define(['jquery' , 'template' , 'layer' , 'service' , 'banner'],
  function ($ , template , layer , service , banner ) {
    /*service.htmlHost = 'http://172.16.1.141:8008';*/
    var bannerList = [{
      'id' : 1,
      'name' : 'banner1',
      'pic' : '../home/images/banner1.jpg'
    },{
      'id' : 2,
      'name' : 'banner2',
      'pic' : '../home/images/banner2.jpg'
    },{
      'id' : 3,
      'name' : 'banner3',
      'pic' : '../home/images/banner3.jpg'
    }];
    //初始化banner
    initBanner( bannerList );
    /**
     * 初始化banner
     * @param bannerList 如果请求不到banner图片，则显示bannerList
     */
    function initBanner( bannerList ){
      $.ajax({
        url : service.htmlHost + '/pf/api/friend/banner?limit=3',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            if( data.data && data.data.length > 0 ){
              $.each( data.data , function( index ){
                data.data[index].pic = getPicPath(data.data[index].pic) ;
              });
            }else{
              data.data = bannerList;
            }
            $(".slide-pic").html( template('slidePic', data ));
            $(".slide-li").html( template('slideLi', data ));
            banner();
          }else{
            layer.alert("初始化banner异常", {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("初始化banner异常。", {icon: 0});
        }
      });
    };

    /**
     * 根据图片ID返回图片路径
     * @param id 图片ID
     * @returns {string} 图片路径
     */
    function getPicPath( id ){
      return service.prefix + '/pf/res/download/'+id;
    };
});




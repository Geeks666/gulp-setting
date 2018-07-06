
// require.config({
//   paths: {
//     'jquery': '../../../../lib/jquery/jquery-1.11.2.min.js',
//     'service': '../../../../base/js/service.js'
//   }
// });
define(['jquery' , 'service' ] , function ( $ , service ) {
  homepageJp();
  function homepageJp() {//跨域
    //请求获取
    $.support.cors = true;
    $.ajax({
      url : service.prefix + '/pf/api/header/homepage.jsonp',
      type :'GET',
      async: false,
      dataType : "jsonp",
      jsonp: "callback",
      success : function(data){
        if( data.result.code == "success" ){
          $("#mainbo_footer").html( data.result.data.portal_info_bottom );
          document.title=data.result.data.portal_info_name;
          if( data.result.data.portal_info_logo && data.result.data.portal_info_logo != "" && $(".logo img").length>0){
            $(".logo a").attr("href",  service.htmlHost+'/dist/platform/www/home/index.html' );
            $(".logo img").attr("src", getPicPath( data.result.data.portal_info_logo ));
          }
        }
      }
    });
  }

  /**
   * 根据图片ID返回图片路径
   * @param id 图片ID
   * @returns {string} 图片路径
   */
  function getPicPath(id) {
    return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
  }
});
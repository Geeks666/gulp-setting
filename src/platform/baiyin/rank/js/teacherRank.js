require.config({
  paths: {
    'jquery': '../../../../lib/jquery/jquery-1.9.1.js',
    'template': '../../../../lib/arTtemplate/template.js',
    'layer': '../../../../lib/layer/layer.js',
    'page': '../../../../lib/component/pagingSimple/paging.js',
    'service': '../../../../base/js/service.js',
    'tools': '../../../../base/js/requiretools.js',
    'banner': '../../home/js/banner.js',
    'textScroll': '../../home/js/textScroll.js',
    'tab': '../../home/js/tab.js',
    'ajaxBanner': '../../home/js/ajaxBanner.js',
    'secondNav': '../../home/js/secondNav.js',
    'footer': '../../../../public/footer/js/logout.js',
    'header': '../../../../public/header/js/header.js',
  },
  shim: {
    'layer': {
      deps: ['jquery']
    }
  }
});
define(['jquery' , 'template' , 'layer' , 'page' , 'service' , 'tools' , 'banner' , 'textScroll' , 'tab' , 'ajaxBanner' , 'secondNav' , 'footer' , 'header'],
  function ($ , template , layer , Page , service , tools , banner , textScroll , tab , ajaxBanner , secondNav ,  footer , header) {
    var pageSize = 20;
    var currentPage = 1;
    /*
    * 1:登录次数；
     2：资源上传数；
     3：资源下载数
     */
    var sortby = 1;

    getTeacherData( $(".content_table") , 'teacherRank', pageSize , currentPage , sortby );

    function getTeacherData( $obj , temId , pageSize , currentPage , sortby){
      var $data = {
        'pageSize': pageSize,
        'currentPage': currentPage,
        'sortby' : sortby
      };
      $.ajax({
        url : service.htmlHost + '/pf/api/rank/teacher',
        type :'GET',
        data: $data,
        success : function(data){
          console.log(data);
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.datalist && data.data.datalist.length > 0) {
              html = template( temId , { 'data' : data.data.datalist , 'currentPage' : data.data.currentPage-1 , 'pageSize' : data.data.pageSize } );
              if( data.data.currentPage == 1 ){
                $("#pageTool").html("");
                renderPage('pageTool', data.data.totalCount , data.data.pageSize , getTeacherData , $obj , temId , sortby);
              }
            }else{
              html = showprompt();
            }
            $obj.html(html);
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取教师排行榜异常。", {icon: 0});
        }
      });
    };


    //翻页
    function renderPage(domId, total , pageSize , callback , $obj , temId , sortby) {
      var p = new Page();
      p.init({
        target: '#' + domId,
        pagesize: pageSize,
        pageCount: 8,
        count: total,
        callback: function (current) {
          callback( $obj , temId , pageSize ,  current , sortby);
        }
      });
    }
    /**
     * 公用没有内容方法
     * @returns {string}
     */
    function showprompt(){
      return "<p id='no-content'>没有您查看的内容</p>";
    };
    $("body").delegate('.content_title ul li','click',function ( e ) {
      e.stopPropagation();
      if( !$(this).hasClass('active') ){
        $(this).addClass('active').siblings("li").removeClass('active');
        getTeacherData( $(".content_table") , 'teacherRank', pageSize , currentPage , $(this).attr("data-value") );
      }
    });

});




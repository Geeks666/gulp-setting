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
    getActivityRank( $(".content_table") , 'activityRank' , pageSize , currentPage );


    /**
     * 活动热度排行榜
     * @param $obj : 内容容器
     * @param temId : 模板ID
     * @param pageSize
     * @param currentPage
     */
    function getActivityRank( $obj , temId , pageSize ,  currentPage ){
      var $data = {
        'pageSize': pageSize,
        'currentPage': currentPage
      };
      $.ajax({
        url : service.htmlHost + '/pf/api/direct/activity_heatAct',
        type :'GET',
        data: $data,
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.datalist && data.data.datalist.length > 0) {
              html = template( temId , { 'data' : data.data.datalist , 'currentPage' : currentPage-1 , 'pageSize' : pageSize } );
            }else{
              html = showprompt();
            }
            $obj.html(html);
            if( currentPage == 1 ) {
              $("#pageTool").html("");
              renderPage('pageTool', data.data.page.totalCount, data.data.page.pageSize);
            }
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取活动热度排行榜异常。", {icon: 0});
        }
      });
    };
    /**
     * 参与学校排行榜
     * @param $obj : 内容容器
     * @param temId : 模板ID
     * @param pageSize
     * @param currentPage
     */
    function getActivitySchool( $obj , temId , pageSize ,  currentPage ){
      var $data = {
        'pageSize': pageSize,
        'currentPage': currentPage
      };
      $.ajax({
        url : service.htmlHost + '/pf/api/direct/activity_school',
        type :'GET',
        data: $data,
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.datalist && data.data.datalist.length > 0) {
              html = template( temId , { 'data' : data.data.datalist , 'currentPage' : currentPage-1 , 'pageSize' : pageSize } );
            }else{
              html = showprompt();
            }
            $obj.html(html);
            if( currentPage == 1 ) {
              $("#pageTool").html("");
              renderPage('pageTool', data.data.page.totalCount, data.data.page.pageSize);
            }
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取参与学校排行榜异常。", {icon: 0});
        }
      });
    };
    /**
     * 作品热度排行榜
     * @param $obj : 内容容器
     * @param temId : 模板ID
     * @param pageSize
     * @param currentPage
     * @param softFile : 1:viewCount 浏览量 2: commentCount 评论数 必填
     */
    function getWorksRank( $obj , temId , pageSize ,  currentPage , softFile){
      var $data = {
        'pageSize': pageSize,
        'currentPage': currentPage,
        'softFile' : softFile
      };
      $.ajax({
        url : service.htmlHost + '/pf/api/direct/activity_heatWork',
        type :'GET',
        data: $data,
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.datalist && data.data.datalist.length > 0) {
              html = template( temId , { 'data' : data.data.datalist , 'currentPage' : currentPage-1 , 'pageSize' : pageSize } );
            }else{
              html = showprompt();
            }
            $obj.html(html);
            if( currentPage == 1 ){
              $("#pageTool").html("");
              renderPage('pageTool', data.data.page.totalCount , data.data.page.pageSize , getWorksRank , $obj , temId , softFile);
            }
          }else{
            layer.alert( data.msg , {icon: 0});
          }
        },
        error : function (data) {
          layer.alert("获取作品热度排行榜异常。", {icon: 0});
        }
      });
    };

    //翻页
    function renderPage(domId, total , pageSize , callback , $obj , temId , softFile) {
      var p = new Page();
      p.init({
        target: '#' + domId,
        pagesize: pageSize,
        pageCount: 8,
        count: total,
        callback: function (current) {
          callback( $obj , temId , pageSize ,  current , softFile);
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
    template.helper('dateRound', function (date) {
      var value=Math.round(parseFloat(date)*100)/100;
      var xsd=value.toString().split(".");
      if(xsd.length==1){
        value=value.toString()+".00";
        return value;
      }
      if(xsd.length>1){
        if(xsd[1].length<2){
          value=value.toString()+"0";
        }
        return value;
      }
    });
    $("body").delegate('.content_title ul li','click',function ( e ) {
      e.stopPropagation();
      if( !$(this).hasClass('active') ){
        $(this).addClass('active').siblings("li").removeClass('active');
        if( $(this).index() == 0 ){
          $(".content_nav").hide();
          getActivityRank( $(".content_table") , 'activityRank' , pageSize , currentPage );
        }else if( $(this).index() == 1 ){
          $(".content_nav").hide();
          getActivitySchool( $(".content_table") , 'schoolRank' , pageSize , currentPage );
        }else if( $(this).index() == 2 ){
          $(".content_nav").show();
          getWorksRank( $(".content_table") , 'worksRank' , pageSize , currentPage , 1 );
        }
      }
    });
    $("body").delegate('.content_nav a','click',function ( e ) {
      e.stopPropagation();
      if( !$(this).hasClass('active') ){
        $(this).addClass('active').siblings("a").removeClass('active');
        getWorksRank( $(".content_table") , 'worksRank' , pageSize , currentPage , $(this).attr("data-value") );
      }
    });

});




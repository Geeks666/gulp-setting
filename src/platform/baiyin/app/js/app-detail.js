require.config({
  paths: {
    'jquery': '../../../../lib/jquery/jquery-1.9.1.js',
    'service': '../../../../base/js/service.js',
    'tools': '../../../../base/js/requiretools.js',
    'layer': '../../../../lib/layer/layer.js',
    'template': '../../../../lib/arTtemplate/template.js',
    'footer': '../../../../public/footer/js/logout.js',
    'header': '../../../../public/header/js/header.js'
  }
});

define(['jquery', 'service' , 'tools' , 'layer' , 'template' , 'footer' , 'header'],
  function ( $ , service , tools , layer , template , footer , header ) {
    var typeList = null;

    var appDataList = {};
    getCategory();
    function getCategory() {
      $.ajax({
        url : service.htmlHost + '/pf/api/app/types',
        type :'GET',
        success : function(data){
          if( data && data.code == "success" ){
            if( data.data && data.data.length > 0) {
              typeList = data.data;
              $('#application_content_type').html( template( "applicationContentType" , data) );
              if( $("#recommended_list").length > 0 ) loadAppData( 'recommended_list' , '' , '1' , false );
              loadAppData( 'application_list' , '' , '0' , true );
            }
          }else{
            alert("获取应用分类异常")
          }
        }
      });
    };
    function loadAppData( id , category , isRecommend , firstLoad ) {
      $('#'+id).html("");
      var data = {};
      if( category != '' ){
        data['category'] = category;
      }
      if( isRecommend === '1' ){
        data['isRecommend'] = isRecommend;
      }
      $.ajax({
        url : service.htmlHost + '/pf/api/app/list',
        type :'GET',
        data : data,
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.length > 0) {
              if( isRecommend === '0'){
                appDataList['all'] = data.data;
              }
              $.each( data.data , function ( i ) {
                data.data[i].logo = data.data[i].logo ? getPicPath( data.data[i].logo) : "";
                data.data[i].category = data.data[i].category ? getType(data.data[i].category) : "其他";
              });
              html = template( id+"_" , data);
            }else{
              html = showprompt();
            }
            $("#"+id).html(html);
            if( firstLoad && tools.getQueryObj().targetApp){
              $("#application_list li[appid='"+ tools.getQueryObj().targetApp +"'").find(".appName").click();
            }
          }else{
            alert("获取应用异常")
          }
        }
      });
    };
    function getAppByType( category ) {
      var data = {};
      if( category ){
        data['category'] = category;
      }
      $.ajax({
        url : service.htmlHost + '/pf/api/app/list',
        type :'GET',
        data : data,
        success : function(data){
          if( data && data.code == "success" ){
            var html = "";
            if( data.data && data.data.length > 0) {
              appDataList[(category ? category : 'all')] = data.data;
              $.each( data.data , function ( i ) {
                data.data[i].logo = data.data[i].logo ? getPicPath( data.data[i].logo) : "";
                data.data[i].category = data.data[i].category ? getType(data.data[i].category) : "其他";
              });
              html = template( "application_list_" , data);
            }else{
              html = showprompt();
            }
            $("#application_list").html(html);
          }else{
            alert("获取应用异常")
          }
        }
      });
    }
    $('body').delegate('#application_content_type li' , 'click' , function () {
      $('.application_content_box').show();
      $('#app-details').hide();
      $(this).addClass('application_active').siblings().removeClass('application_active');
      if( appDataList[ $(this).attr("type") ] ){
        $("#application_list").html( template( "application_list_" , { 'data' : appDataList[ $(this).attr("type") ] }) );
      }else{
        getAppByType( $(this).attr("type") );
      }
    });

    $('body').delegate('.recommended_list li , .application_content_list li','click',function(){
      var appid = $(this).attr("appid");
      var isneedLogin = $(this).find(".appName").attr('isLogin');
      var praiseNum = $(this).find('.like_num_'+appid).html();
      var type = $(this).find('.type_'+appid).html();
      if( $(this).attr("isDetail") == "false" ){
        verifyApp( appid );
      }else{
        showAppDetails( appid , praiseNum , type , isneedLogin );
        $(this).unbind();
        return false;
      }
    });
    function showAppDetails( id , praiseNum , type , isneedLogin ){
      $.ajax({
        url : service.htmlHost + "/pf/api/app/detail/"+id,
        type : "get",
        success:function(data){
          if( data.code == "success" ){
            data.data.praiseNum = praiseNum;
            data.data.fappcategory = type;
            data.data.ispraise = parseInt( praiseNum ) > 0 ? true : false ;
            $('.application_content_box').hide();
            $('#app-details').show();
            lookApp( data.data );
          }else if( data.code == "failed" ){
            layer.alert("操作错误。", {icon: 0});
          }
        }
      });
    };

    function lookApp( data ){
      data.logo = data.logo ? getPicPath( data.logo) : "";
      data.category = data.category ? getType(data.category) : "其他";
      $(".detail-cont .detail-msg").html( template( 'detailMsg' , { 'data' : data}) );

      var $prev = $('#app-details').find('.prev-btn');
      var $next = $('#app-details').find('.next-btn');
      var width = $('#app-details').find('.pic-box').width();
      var $picBox = $('#app-details').find('.pic-list');
      var contentPic = '';
      var onOff = true;
      var lookNum = 1;
      var newVar = data.promotePictures ? data.promotePictures.split(",") : [];
      var images = newVar;
      var length = images.length;
      if( length < 2 ){
        //images = ['images/banner1.jpg'];
        for (x in images)
        {
          //contentPic += '<li><img src="' + (images[x]) + '" alt=""></li>'
          contentPic += '<li><img src="' + getPicPath(images[x]) + '" alt=""></li>'
          $picBox.html(contentPic);
        }
      }else{
        initPicScroll();
      }

      function initPicScroll(){
        for (x in images)
        {
          //contentPic += '<li><img src="' + (images[x]) + '" alt=""></li>'
          contentPic += '<li><img src="' + getPicPath(images[x]) + '" alt=""></li>'
        }
        for (var k = 0; k < Math.min(3,length); k++)
        {
          //contentPic += '<li><img src="' + (images[k]) + '" alt=""></li>'
          contentPic += '<li><img src="' + getPicPath(images[k]) + '" alt=""></li>'
        }
        $picBox.width( (length+Math.min(3,length))*width );
        $picBox.html(contentPic);
        length = length + Math.min(3,length);
        $picBox.css('left',-width);
      };
      function move(n){
        $picBox.animate({
            'left': width*-n
          },
          800,function() {
            onOff = true;
          });
      }
      //下一个
      $next.unbind().bind('click',function(){
        if( !onOff || $picBox.find("li").length < 2 ) return;
        if( lookNum == length-2 ){
          lookNum = 0;
          $picBox.css('left',-lookNum*width);
        };
        lookNum++;
        onOff = false;
        move(lookNum);
      });
      //上一个
      $prev.unbind().bind('click',function(){
        if( !onOff || $picBox.find("li").length < 2 ) return;
        if( lookNum == 0 ){
          lookNum = length-2;
          $picBox.css('left',-lookNum*width);
        }
        lookNum--;
        onOff = false;
        move(lookNum);
      });
    };

    function getType( category ){
      for( var i = 0 ; i < typeList.length ; i++ ){
        if( category == typeList[i].value ){
          return typeList[i].name;
        }
      }
    };
    function getPicPath( id ){
      return service.prefix + '/pf/res/download/'+id;
    };
    function showprompt(){
      return "<p id='no-content'>没有您查看的内容</p>";
    };

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
    function downVerifyApp( appId ){
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
          layer.alert("请求失败", {icon: 0});
        }
      });
    };

    $("body").delegate( '#app-details .into-app' , 'click',function(e){
      e.stopPropagation();
      if( !header.getUser() ){
        layer.alert("请登录后操作。", {icon: 0});
        return false;
      }else{
        verifyApp( $(this).attr('appid') , $(this).attr('kindCode'));
      }
    });
    $("body").delegate( '#app-details .down-app' , 'click',function(e){
      e.stopPropagation();
      if( !header.getUser() ){
        layer.alert("请登录后操作。", {icon: 0});
        return false;
      }else{
        downVerifyApp( $(this).attr('appid') );
      }
    });
    $("body").delegate( '.praise-icon2' , 'click',function(e){
      e.stopPropagation();
      var This = this;
      if( !header.getUser() ){
        layer.alert("请登录后操作。", {icon: 0});
        return false;
      }else{
        if( ($(This)[0].tagName == "SPAN" && !$(This).hasClass("praised")) || ($(This)[0].tagName == "STRONG" && !$(This).hasClass("praise-icon-active"))){
          praiseIcon( $(This).attr("appid") , function () {
            var $spanApp = $("span[appid='"+$(This).attr("appid")+"']");
            var $strongApp = $("strong[appid='"+$(This).attr("appid")+"']");
            if( $spanApp.length > 0 ){
              $spanApp.addClass("praised").removeClass("unpraise_"+$(This).attr("appid"));
              $.each( $spanApp , function( i ){
                $(this).siblings("span").text( parseInt($(this).siblings("span").text())+1 );
              });

            }
            if( $strongApp.length > 0 ){
              $strongApp.addClass("praise-icon-active");
              $strongApp.siblings("strong").text( parseInt($strongApp.siblings("strong").text())+1 );
            }
            for( var key in appDataList ){
              $.each( appDataList[key] , function (i) {
                if( appDataList[key][i].id == $(This).attr("appid") ){
                  appDataList[key][i].isLike = true;
                  appDataList[key][i].likeNum = parseInt(appDataList[key][i].likeNum)+1;
                }
              })
            }
          });
        }
      }
    });
    function praiseIcon( id , callback ) {
      $.ajax({
        type:"POST",
        url : service.htmlHost + "/pf/api/app/like",
        data:{"appId": id , "isLike":true},
        success:function(data){
          if(data.code == "success"){
            //window.location.search = 'targetApp='+data.id;
            callback();
          }else if(data.code == "login_error"){
            layer.alert( data.msg , {icon: 0});
          }
        },
        error:function(error){
          layer.alert("添加出错,请稍后重试。", {icon: 0});
        }
      });
    }
  }
);

	
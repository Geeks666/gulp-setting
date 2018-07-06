require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {

  require.config(configpaths);

  define('', ['jquery', 'template', 'service', 'footer', 'header', 'tool'],
    function ($, template, service, footer, header, tools) {
      //公告详情
      $.ajax({
        url: service.htmlHost + '/pf/api/notice/detail?id=' + tools.args.id + '&index=' + tools.args.index,
        type: 'GET',
        success: function (data) {
          if (data && data.code == "success") {
            $(".title_noborder").html(data.data.title);
            $("#cur").html(data.data.content);
            if( data.data.reslist ){
              if(data.data.reslist.length != 0){
                for (var i = 0,extHTML = ''; i < data.data.reslist.length; i++){
                  extHTML += "<a href='"+ getPicPath(data.data.reslist[i].id) +"'><img src='images/ext.png' alt=''>"+ data.data.reslist[i].name +"."+ data.data.reslist[i].ext +"</a></br>";
                }
                $('#exts').html ( extHTML );
              }
            }
            $("#_time").html(data.data.crtDttm.split(" ")[0]);
            var htmlContent = '';
            if (data.data.flago !== '0' && parseInt(tools.args.index) !== 0) {
              htmlContent += '<a class="prev" href="noticeDetail.html?id=' + data.data.flago + '&index=' + (parseInt(tools.args.index) - 1) + '">上一篇</a>';
            }
            if (data.data.flags !== '0') {
              htmlContent += '<a class="next" href="noticeDetail.html?id=' + data.data.flags + '&index=' + (parseInt(tools.args.index) + 1) + '">下一篇</a>';
            }
            $(".content-link").html(htmlContent);
          } else {
            alert("获取公告详情异常")
          }
        }
      });
      //相关公告
      $.ajax({
        url: service.htmlHost + '/pf/api/notice/getLimit?limit=6',
        type: 'GET',
        success: function (data) {
          if (data && data.code == "success") {
            $('#importnotice').empty();
            for (var i = 0; i < data.data.length; i++) {
              $('#importnotice').append('<li class="imp-list"><a class="imp-text" href="noticeDetail.html?id=' + data.data[i].id + '&index=' + i + '">' + data.data[i].title + '</a></li>');
            }
          } else {
            alert("获取重要公告异常")
          }
        }
      });
      /**
       * 根据图片ID返回图片路径
       * @param id 图片ID
       * @returns {string} 图片路径
       */
      function getPicPath(id) {
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
      }
    }
  );


  /*$(function(){
    $('.nav-line').hide();
    //鑷�搴旂獥鍙�
    function winChange(minNum,outNUm){
      var contHeight = $(window).height() - outNUm;
      if( contHeight < minNum ){
        contHeight = minNum;
      }
      $('.message-content').get(0).style['min-height'] = contHeight + 'px';
    }
    winChange(350,574);

    $(window).resize(function() {
      winChange();
    })

    //鍐呭澶氬嚭鏄剧ず闅愯棌
    function hideText(obj,long){
      for (var i = 0; i < obj.length; i++) {
        var str = '...';
        var be_str = obj.eq(i).html();
          be_str = be_str.replace( /^\s+|\s+$/,'');
        var newstr = '';

        if( be_str.length > long ){
          newstr = be_str.slice(0,long) + str;
          obj.eq(i).html(newstr);
        }
      }
    };

    //鍘绘帀鍙戝竷鏃ュ織缂栬緫鍣ㄤ骇鐢熺殑瀹介珮鍚�00px 寮曞彂鐨勬牱寮廱ug
    if( $('#cur') ){
      $('#cur').css({'height':'auto','width':'100%'})
    }
  })*/
})




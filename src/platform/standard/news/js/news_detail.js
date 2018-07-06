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
      gettoplistnews();
      //新闻详情
      $.ajax({
        url: service.htmlHost + '/pf/api/news/detail?id=' + tools.args.id + '&index=' + tools.args.index + '&category=' + tools.args.category + (tools.args.isComm ? '&isComm=' + tools.args.isComm : ''),
        type: 'GET',
        success: function (data) {
          if (data && data.code == "success") {
            $(".title_noborder").html(data.data.title);
            $(".content-text").html(data.data.content);
            $(".text-time").html(data.data.crtDttm.split(" ")[0]);
            var htmlContent = '';
            if (data.data.flago !== '' && parseInt(tools.args.index) != 0) {
              htmlContent += '<a class="prev" href="sitenewsDetail.html?id=' + data.data.flago + '&index=' + (parseInt(tools.args.index) - 1) + '&category=' + tools.args.category + '">上一篇</a>';
            }
            if (data.data.flags !== '') {
              htmlContent += '<a class="next" href="sitenewsDetail.html?id=' + data.data.flags + '&index=' + (parseInt(tools.args.index) + 1) + '&category=' + tools.args.category + '">下一篇</a>';
            }
            $(".content-link").html(htmlContent);
          } else {
            alert("获取新闻详情异常")
          }
        }
      });

      //推荐新闻
      function gettoplistnews() {
        $.ajax({
          url: service.htmlHost + '/pf/api/news/getLimit?limit=6&isComm=1&category=1',
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              $('#toplistnews').empty();
              for (var i = 0; i < data.data.length; i++) {
                $('#toplistnews').append('<li class="imp-list"><a class="imp-text" href="sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isComm=1">' + data.data[i].title + '</a></li>');
              }
              hideText($('.imp-text'), 18);
            } else {
              alert("获取推荐新闻异常")
            }
          }
        });
      };

      //内容多出显示隐藏
      function hideText(obj, long) {
        for (var i = 0; i < obj.length; i++) {
          var str = '...';
          var be_str = obj.eq(i).html();
          be_str = be_str.replace(/^\s+|\s+$/, '');
          var newstr = '';

          if (be_str.length > long) {
            newstr = be_str.slice(0, long) + str;
            obj.eq(i).html(newstr);
          }
        }
      }
    }
  );
  /*
  $(function(){
      //顶部导航
      var begin_left = 0;
      var begin_width = parseFloat($('.nav-list').eq(1).css('width'));
      for (var i = 0; i < 1; i++) {
          begin_left += parseFloat($('.nav-list').eq(i).css('width')) + 10;
      }
      $('.nav-line').css('left',begin_left);
      $('.nav-line').css('width',begin_width);

      $('.nav-list').hover(
          function(){
              var line_left = 0;
              var line_width = parseFloat($(this).css('width'));//头部的白色底部
              for (var i = 0; i < $(this).index() ; i++) {
                  line_left += parseFloat($('.nav-list').eq(i).css('width')) + 10;
              }
              $('.nav-line').eq(0).animate({
                  width:line_width,
                  left:line_left
              },200)
          },
          function(){}
       )
      $('.nav-box').hover(
          function(){},
          function(){
              $('.nav-line').eq(0).animate({
                  width:begin_width,
                  left:begin_left
              },200)
          }

      )
      //自适应窗口
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
  })



  */
})
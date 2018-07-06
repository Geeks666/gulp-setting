require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'template', 'service', 'footer', 'header', 'tool'],
    function ($, template, service, footer, header, tools) {
      gettoplistnews();
      //图片新闻
      getPicListNews();
      //新闻详情
      $.ajax({
        url: service.htmlHost + '/pf/api/news/detail?id=' + tools.args.id + '&index=' + tools.args.index + '&category=' + tools.args.category + (tools.args.isComm ? '&isComm=' + tools.args.isComm : '') + (tools.args.isImg ? '&isImg=' + tools.args.isImg : '') + (tools.args.orgId ? '&orgId=' + tools.args.orgId : ''),
        type: 'GET',
        success: function (data) {
          if (data && data.code == "success") {
            $(".title_noborder").html(data.data.title);
            $(".title_noborder").attr('title', data.data.title);
            $(".content-text").html(data.data.content);
            $(".text-time").html('发表时间：<span class="textColor">'+data.data.crtDttm.split(" ")[0]+'</span>');
            $(".text-author").html('作者：<span class="textColor">'+data.data.author+'</span>');
            $(".text-form").html('来源：<span class="textColor">'+data.data.orgId+'</span>');
            var htmlContent = '';
            if (data.data.flago !== '' && parseInt(tools.args.index) != 0) {
              htmlContent += '<a class="prev" href="sitenewsDetail.html?id=' + getOtherTitle(data.data.flago, 1) + '&index=' + (parseInt(tools.args.index) - 1) + '&category=' + tools.args.category + (tools.args.isImg ? '&isImg=' + tools.args.isImg : '') + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '') + '"><span>上一篇：</span>' + getOtherTitle(data.data.flago, 0) + '</a>';
            }
            if (data.data.flags !== '') {
              if (htmlContent != '') {
                htmlContent += '<br>'
              }
              htmlContent += '<a class="next" href="sitenewsDetail.html?id=' + getOtherTitle(data.data.flags, 1) + '&index=' + (parseInt(tools.args.index) + 1) + '&category=' + tools.args.category + (tools.args.isImg ? '&isImg=' + tools.args.isImg : '') + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '') + '"><span>下一篇：</span>' + getOtherTitle(data.data.flags, 0) + '</a>';
            }

            $(".content-link").html(htmlContent);
            htmlContent = ''
          } else {
            alert("获取新闻详情异常")
          }
        }
      });

      //推荐新闻
      function gettoplistnews() {
        $.ajax({
          url: service.htmlHost + '/pf/api/news/getLimit?limit=6&isComm=1&category=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : ''),
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              $('#toplistnews').empty();
              for (var i = 0; i < data.data.length; i++) {
                $('#toplistnews').append(
                  '<li class="imp-list">' +
                  '<a title="' + data.data[i].title + '"class="imp-text" href="sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isComm=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '') +
                  '">' + data.data[i].title +
                  '</a>' +
                  '</li>'
                );
              }
              hideText($('.imp-text'), 18);
              if (data.data == '') {
                $('#toplistnews').replaceWith('<p style="line-height:32px;margin-left:15px">暂无数据...</p>')
              }
            } else {
              alert("获取推荐新闻异常")
            }
          }
        });
      };

      //图片新闻
      function getPicListNews() {
        $.ajax({
          url: service.htmlHost + '/pf/api/news/getLimit?&limit=4&category=1&isImg=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : ''),
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              if (data.data == '') {
                $('#pic-news').replaceWith('<p style="line-height:32px;margin-left:15px">暂无数据...</p>')
              } else {
                $('#pic-news').empty();
                for (var i = 0; i < data.data.length; i++) {
                  var url = 'sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isImg=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '');
                  $('#pic-news').append(
                    '<li class="pic-list" >' +
                    '<a href=' + url + '>' +
                    '<img src="' + getPicPath(data.data[i].img) + '" alt=""  onerror="this.src=\'../home/images/bg-no.png\'" >' +
                    '</a>' +
                    '<p title="' + data.data[i].title + '\" class="suspend"  onclick="location.href =\'' + url + '\'">' + data.data[i].title + '</p>' +
                    '</li>'
                  );
                }
                hideText($('.imp-message .imp-text'), 20);
              }
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

      /**
       * 根据图片ID返回图片路径
       * @param id 图片ID
       * @returns {string} 图片路径
       */
      function getPicPath(id) {
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
      };

      //截取字符串上篇，下篇
      function getOtherTitle(str, also) {
        if (also) {
          return str.slice(0, str.indexOf(','))
        } else {
          return str.slice(str.indexOf(',') + 1)
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

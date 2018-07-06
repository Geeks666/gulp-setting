'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'template', 'service', 'footer', 'header', 'tool'], function ($, template, service, footer, header, tools) {
    gettoplistnews();
    //图片新闻
    getPicListNews();
    //新闻详情
    $.ajax({
      url: service.htmlHost + '/pf/api/news/detail?id=' + tools.args.id + '&index=' + tools.args.index + '&category=' + tools.args.category + (tools.args.isComm ? '&isComm=' + tools.args.isComm : '') + (tools.args.isImg ? '&isImg=' + tools.args.isImg : '') + (tools.args.orgId ? '&orgId=' + tools.args.orgId : ''),
      type: 'GET',
      success: function success(data) {
        if (data && data.code == "success") {
          $(".title_noborder").html(data.data.title);
          $(".title_noborder").attr('title', data.data.title);
          $(".content-text").html(data.data.content);
          $(".text-time").html('发表时间：<span class="textColor">' + data.data.crtDttm.split(" ")[0] + '</span>');
          $(".text-author").html('作者：<span class="textColor">' + data.data.author + '</span>');
          $(".text-form").html('来源：<span class="textColor">' + data.data.orgId + '</span>');
          var htmlContent = '';
          if (data.data.flago !== '' && parseInt(tools.args.index) != 0) {
            htmlContent += '<a class="prev" href="sitenewsDetail.html?id=' + getOtherTitle(data.data.flago, 1) + '&index=' + (parseInt(tools.args.index) - 1) + '&category=' + tools.args.category + (tools.args.isImg ? '&isImg=' + tools.args.isImg : '') + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '') + '"><span>上一篇：</span>' + getOtherTitle(data.data.flago, 0) + '</a>';
          }
          if (data.data.flags !== '') {
            if (htmlContent != '') {
              htmlContent += '<br>';
            }
            htmlContent += '<a class="next" href="sitenewsDetail.html?id=' + getOtherTitle(data.data.flags, 1) + '&index=' + (parseInt(tools.args.index) + 1) + '&category=' + tools.args.category + (tools.args.isImg ? '&isImg=' + tools.args.isImg : '') + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '') + '"><span>下一篇：</span>' + getOtherTitle(data.data.flags, 0) + '</a>';
          }

          $(".content-link").html(htmlContent);
          htmlContent = '';
        } else {
          alert("获取新闻详情异常");
        }
      }
    });

    //推荐新闻
    function gettoplistnews() {
      $.ajax({
        url: service.htmlHost + '/pf/api/news/getLimit?limit=6&isComm=1&category=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : ''),
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            $('#toplistnews').empty();
            for (var i = 0; i < data.data.length; i++) {
              $('#toplistnews').append('<li class="imp-list">' + '<a title="' + data.data[i].title + '"class="imp-text" href="sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isComm=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '') + '">' + data.data[i].title + '</a>' + '</li>');
            }
            hideText($('.imp-text'), 18);
            if (data.data == '') {
              $('#toplistnews').replaceWith('<p style="line-height:32px;margin-left:15px">暂无数据...</p>');
            }
          } else {
            alert("获取推荐新闻异常");
          }
        }
      });
    };

    //图片新闻
    function getPicListNews() {
      $.ajax({
        url: service.htmlHost + '/pf/api/news/getLimit?&limit=4&category=1&isImg=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : ''),
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            if (data.data == '') {
              $('#pic-news').replaceWith('<p style="line-height:32px;margin-left:15px">暂无数据...</p>');
            } else {
              $('#pic-news').empty();
              for (var i = 0; i < data.data.length; i++) {
                var url = 'sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isImg=1' + (tools.args.orgId ? '&orgId=' + tools.args.orgId : '');
                $('#pic-news').append('<li class="pic-list" >' + '<a href=' + url + '>' + '<img src="' + getPicPath(data.data[i].img) + '" alt=""  onerror="this.src=\'../home/images/bg-no-d41c843890.png\'" >' + '</a>' + '<p title="' + data.data[i].title + '\" class="suspend"  onclick="location.href =\'' + url + '\'">' + data.data[i].title + '</p>' + '</li>');
              }
              hideText($('.imp-message .imp-text'), 20);
            }
          } else {
            alert("获取推荐新闻异常");
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
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    };

    //截取字符串上篇，下篇
    function getOtherTitle(str, also) {
      if (also) {
        return str.slice(0, str.indexOf(','));
      } else {
        return str.slice(str.indexOf(',') + 1);
      }
    }
  });
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
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ld3MvanMvbmV3c19kZXRhaWwuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInRlbXBsYXRlIiwic2VydmljZSIsImZvb3RlciIsImhlYWRlciIsInRvb2xzIiwiZ2V0dG9wbGlzdG5ld3MiLCJnZXRQaWNMaXN0TmV3cyIsImFqYXgiLCJ1cmwiLCJodG1sSG9zdCIsImFyZ3MiLCJpZCIsImluZGV4IiwiY2F0ZWdvcnkiLCJpc0NvbW0iLCJpc0ltZyIsIm9yZ0lkIiwidHlwZSIsInN1Y2Nlc3MiLCJkYXRhIiwiY29kZSIsImh0bWwiLCJ0aXRsZSIsImF0dHIiLCJjb250ZW50IiwiY3J0RHR0bSIsInNwbGl0IiwiYXV0aG9yIiwiaHRtbENvbnRlbnQiLCJmbGFnbyIsInBhcnNlSW50IiwiZ2V0T3RoZXJUaXRsZSIsImZsYWdzIiwiYWxlcnQiLCJlbXB0eSIsImkiLCJsZW5ndGgiLCJhcHBlbmQiLCJoaWRlVGV4dCIsInJlcGxhY2VXaXRoIiwiZ2V0UGljUGF0aCIsImltZyIsIm9iaiIsImxvbmciLCJzdHIiLCJiZV9zdHIiLCJlcSIsInJlcGxhY2UiLCJuZXdzdHIiLCJzbGljZSIsInBhdGhfdXJsIiwic3Vic3RyaW5nIiwicHJlZml4IiwiYWxzbyIsImluZGV4T2YiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLG9CQUFnQjtBQURYO0FBRk0sQ0FBZjtBQU1BSCxRQUFRLENBQUMsY0FBRCxDQUFSLEVBQTBCLFVBQVVJLFdBQVYsRUFBdUI7QUFDL0M7QUFDQUosVUFBUUMsTUFBUixDQUFlRyxXQUFmOztBQUVBQyxTQUFPLEVBQVAsRUFBVyxDQUFDLFFBQUQsRUFBVyxVQUFYLEVBQXVCLFNBQXZCLEVBQWtDLFFBQWxDLEVBQTRDLFFBQTVDLEVBQXNELE1BQXRELENBQVgsRUFDRSxVQUFV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Yjs7QUFFQSxZQUFJSCxPQUFPVCxNQUFQLEdBQWdCTyxJQUFwQixFQUEwQjtBQUN4QkssbUJBQVNILE9BQU9JLEtBQVAsQ0FBYSxDQUFiLEVBQWdCTixJQUFoQixJQUF3QkMsR0FBakM7QUFDQUYsY0FBSUksRUFBSixDQUFPWCxDQUFQLEVBQVVkLElBQVYsQ0FBZTJCLE1BQWY7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7Ozs7O0FBS0EsYUFBU1IsVUFBVCxDQUFvQjdCLEVBQXBCLEVBQXdCO0FBQ3RCLGFBQU9WLFFBQVFpRCxRQUFSLENBQWlCLGNBQWpCLEVBQWlDQyxTQUFqQyxDQUEyQyxDQUEzQyxFQUE4QyxDQUE5QyxNQUFxRCxNQUFyRCxHQUE4RGxELFFBQVFpRCxRQUFSLENBQWlCLGNBQWpCLEVBQWlDSCxPQUFqQyxDQUF5QyxTQUF6QyxFQUFvRHBDLEVBQXBELENBQTlELEdBQXlIVixRQUFRbUQsTUFBUixHQUFpQm5ELFFBQVFpRCxRQUFSLENBQWlCLGNBQWpCLEVBQWlDSCxPQUFqQyxDQUF5QyxTQUF6QyxFQUFvRHBDLEVBQXBELENBQWpKO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFTb0IsYUFBVCxDQUF1QmEsR0FBdkIsRUFBNEJTLElBQTVCLEVBQWtDO0FBQ2hDLFVBQUlBLElBQUosRUFBVTtBQUNSLGVBQU9ULElBQUlLLEtBQUosQ0FBVSxDQUFWLEVBQWFMLElBQUlVLE9BQUosQ0FBWSxHQUFaLENBQWIsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU9WLElBQUlLLEtBQUosQ0FBVUwsSUFBSVUsT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBN0IsQ0FBUDtBQUNEO0FBQ0Y7QUFDRixHQS9ISDtBQWlJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcURELENBMUxEIiwiZmlsZSI6Im5ld3MvanMvbmV3c19kZXRhaWwtMWRkNjY4Y2MxMC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ3BsYXRmb3JtQ29uZic6ICdwdWJsaWMvanMvcGxhdGZvcm1Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydwbGF0Zm9ybUNvbmYnXSwgZnVuY3Rpb24gKGNvbmZpZ3BhdGhzKSB7XHJcbiAgLy8gY29uZmlncGF0aHMucGF0aHMuZGlhbG9nID0gXCJteXNwYWNlL2pzL2FwcERpYWxvZy5qc1wiO1xyXG4gIHJlcXVpcmUuY29uZmlnKGNvbmZpZ3BhdGhzKTtcclxuXHJcbiAgZGVmaW5lKCcnLCBbJ2pxdWVyeScsICd0ZW1wbGF0ZScsICdzZXJ2aWNlJywgJ2Zvb3RlcicsICdoZWFkZXInLCAndG9vbCddLFxyXG4gICAgZnVuY3Rpb24gKCQsIHRlbXBsYXRlLCBzZXJ2aWNlLCBmb290ZXIsIGhlYWRlciwgdG9vbHMpIHtcclxuICAgICAgZ2V0dG9wbGlzdG5ld3MoKTtcclxuICAgICAgLy/lm77niYfmlrDpl7tcclxuICAgICAgZ2V0UGljTGlzdE5ld3MoKTtcclxuICAgICAgLy/mlrDpl7vor6bmg4VcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9uZXdzL2RldGFpbD9pZD0nICsgdG9vbHMuYXJncy5pZCArICcmaW5kZXg9JyArIHRvb2xzLmFyZ3MuaW5kZXggKyAnJmNhdGVnb3J5PScgKyB0b29scy5hcmdzLmNhdGVnb3J5ICsgKHRvb2xzLmFyZ3MuaXNDb21tID8gJyZpc0NvbW09JyArIHRvb2xzLmFyZ3MuaXNDb21tIDogJycpICsgKHRvb2xzLmFyZ3MuaXNJbWcgPyAnJmlzSW1nPScgKyB0b29scy5hcmdzLmlzSW1nIDogJycpICsgKHRvb2xzLmFyZ3Mub3JnSWQgPyAnJm9yZ0lkPScgKyB0b29scy5hcmdzLm9yZ0lkIDogJycpLFxyXG4gICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgJChcIi50aXRsZV9ub2JvcmRlclwiKS5odG1sKGRhdGEuZGF0YS50aXRsZSk7XHJcbiAgICAgICAgICAgICQoXCIudGl0bGVfbm9ib3JkZXJcIikuYXR0cigndGl0bGUnLCBkYXRhLmRhdGEudGl0bGUpO1xyXG4gICAgICAgICAgICAkKFwiLmNvbnRlbnQtdGV4dFwiKS5odG1sKGRhdGEuZGF0YS5jb250ZW50KTtcclxuICAgICAgICAgICAgJChcIi50ZXh0LXRpbWVcIikuaHRtbCgn5Y+R6KGo5pe26Ze077yaPHNwYW4gY2xhc3M9XCJ0ZXh0Q29sb3JcIj4nK2RhdGEuZGF0YS5jcnREdHRtLnNwbGl0KFwiIFwiKVswXSsnPC9zcGFuPicpO1xyXG4gICAgICAgICAgICAkKFwiLnRleHQtYXV0aG9yXCIpLmh0bWwoJ+S9nOiAhe+8mjxzcGFuIGNsYXNzPVwidGV4dENvbG9yXCI+JytkYXRhLmRhdGEuYXV0aG9yKyc8L3NwYW4+Jyk7XHJcbiAgICAgICAgICAgICQoXCIudGV4dC1mb3JtXCIpLmh0bWwoJ+adpea6kO+8mjxzcGFuIGNsYXNzPVwidGV4dENvbG9yXCI+JytkYXRhLmRhdGEub3JnSWQrJzwvc3Bhbj4nKTtcclxuICAgICAgICAgICAgdmFyIGh0bWxDb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEuZmxhZ28gIT09ICcnICYmIHBhcnNlSW50KHRvb2xzLmFyZ3MuaW5kZXgpICE9IDApIHtcclxuICAgICAgICAgICAgICBodG1sQ29udGVudCArPSAnPGEgY2xhc3M9XCJwcmV2XCIgaHJlZj1cInNpdGVuZXdzRGV0YWlsLmh0bWw/aWQ9JyArIGdldE90aGVyVGl0bGUoZGF0YS5kYXRhLmZsYWdvLCAxKSArICcmaW5kZXg9JyArIChwYXJzZUludCh0b29scy5hcmdzLmluZGV4KSAtIDEpICsgJyZjYXRlZ29yeT0nICsgdG9vbHMuYXJncy5jYXRlZ29yeSArICh0b29scy5hcmdzLmlzSW1nID8gJyZpc0ltZz0nICsgdG9vbHMuYXJncy5pc0ltZyA6ICcnKSArICh0b29scy5hcmdzLm9yZ0lkID8gJyZvcmdJZD0nICsgdG9vbHMuYXJncy5vcmdJZCA6ICcnKSArICdcIj48c3Bhbj7kuIrkuIDnr4fvvJo8L3NwYW4+JyArIGdldE90aGVyVGl0bGUoZGF0YS5kYXRhLmZsYWdvLCAwKSArICc8L2E+JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0YS5kYXRhLmZsYWdzICE9PSAnJykge1xyXG4gICAgICAgICAgICAgIGlmIChodG1sQ29udGVudCAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgaHRtbENvbnRlbnQgKz0gJzxicj4nXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGh0bWxDb250ZW50ICs9ICc8YSBjbGFzcz1cIm5leHRcIiBocmVmPVwic2l0ZW5ld3NEZXRhaWwuaHRtbD9pZD0nICsgZ2V0T3RoZXJUaXRsZShkYXRhLmRhdGEuZmxhZ3MsIDEpICsgJyZpbmRleD0nICsgKHBhcnNlSW50KHRvb2xzLmFyZ3MuaW5kZXgpICsgMSkgKyAnJmNhdGVnb3J5PScgKyB0b29scy5hcmdzLmNhdGVnb3J5ICsgKHRvb2xzLmFyZ3MuaXNJbWcgPyAnJmlzSW1nPScgKyB0b29scy5hcmdzLmlzSW1nIDogJycpICsgKHRvb2xzLmFyZ3Mub3JnSWQgPyAnJm9yZ0lkPScgKyB0b29scy5hcmdzLm9yZ0lkIDogJycpICsgJ1wiPjxzcGFuPuS4i+S4gOevh++8mjwvc3Bhbj4nICsgZ2V0T3RoZXJUaXRsZShkYXRhLmRhdGEuZmxhZ3MsIDApICsgJzwvYT4nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkKFwiLmNvbnRlbnQtbGlua1wiKS5odG1sKGh0bWxDb250ZW50KTtcclxuICAgICAgICAgICAgaHRtbENvbnRlbnQgPSAnJ1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWxlcnQoXCLojrflj5bmlrDpl7vor6bmg4XlvILluLhcIilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy/mjqjojZDmlrDpl7tcclxuICAgICAgZnVuY3Rpb24gZ2V0dG9wbGlzdG5ld3MoKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL25ld3MvZ2V0TGltaXQ/bGltaXQ9NiZpc0NvbW09MSZjYXRlZ29yeT0xJyArICh0b29scy5hcmdzLm9yZ0lkID8gJyZvcmdJZD0nICsgdG9vbHMuYXJncy5vcmdJZCA6ICcnKSxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgJCgnI3RvcGxpc3RuZXdzJykuZW1wdHkoKTtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgJCgnI3RvcGxpc3RuZXdzJykuYXBwZW5kKFxyXG4gICAgICAgICAgICAgICAgICAnPGxpIGNsYXNzPVwiaW1wLWxpc3RcIj4nICtcclxuICAgICAgICAgICAgICAgICAgJzxhIHRpdGxlPVwiJyArIGRhdGEuZGF0YVtpXS50aXRsZSArICdcImNsYXNzPVwiaW1wLXRleHRcIiBocmVmPVwic2l0ZW5ld3NEZXRhaWwuaHRtbD9pZD0nICsgZGF0YS5kYXRhW2ldLmlkICsgJyZpbmRleD0nICsgaSArICcmY2F0ZWdvcnk9MSZpc0NvbW09MScgKyAodG9vbHMuYXJncy5vcmdJZCA/ICcmb3JnSWQ9JyArIHRvb2xzLmFyZ3Mub3JnSWQgOiAnJykgK1xyXG4gICAgICAgICAgICAgICAgICAnXCI+JyArIGRhdGEuZGF0YVtpXS50aXRsZSArXHJcbiAgICAgICAgICAgICAgICAgICc8L2E+JyArXHJcbiAgICAgICAgICAgICAgICAgICc8L2xpPidcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGhpZGVUZXh0KCQoJy5pbXAtdGV4dCcpLCAxOCk7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI3RvcGxpc3RuZXdzJykucmVwbGFjZVdpdGgoJzxwIHN0eWxlPVwibGluZS1oZWlnaHQ6MzJweDttYXJnaW4tbGVmdDoxNXB4XCI+5pqC5peg5pWw5o2uLi4uPC9wPicpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFsZXJ0KFwi6I635Y+W5o6o6I2Q5paw6Ze75byC5bi4XCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8v5Zu+54mH5paw6Ze7XHJcbiAgICAgIGZ1bmN0aW9uIGdldFBpY0xpc3ROZXdzKCkge1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9uZXdzL2dldExpbWl0PyZsaW1pdD00JmNhdGVnb3J5PTEmaXNJbWc9MScgKyAodG9vbHMuYXJncy5vcmdJZCA/ICcmb3JnSWQ9JyArIHRvb2xzLmFyZ3Mub3JnSWQgOiAnJyksXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEgPT0gJycpIHtcclxuICAgICAgICAgICAgICAgICQoJyNwaWMtbmV3cycpLnJlcGxhY2VXaXRoKCc8cCBzdHlsZT1cImxpbmUtaGVpZ2h0OjMycHg7bWFyZ2luLWxlZnQ6MTVweFwiPuaaguaXoOaVsOaNri4uLjwvcD4nKVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjcGljLW5ld3MnKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHVybCA9ICdzaXRlbmV3c0RldGFpbC5odG1sP2lkPScgKyBkYXRhLmRhdGFbaV0uaWQgKyAnJmluZGV4PScgKyBpICsgJyZjYXRlZ29yeT0xJmlzSW1nPTEnICsgKHRvb2xzLmFyZ3Mub3JnSWQgPyAnJm9yZ0lkPScgKyB0b29scy5hcmdzLm9yZ0lkIDogJycpO1xyXG4gICAgICAgICAgICAgICAgICAkKCcjcGljLW5ld3MnKS5hcHBlbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgJzxsaSBjbGFzcz1cInBpYy1saXN0XCIgPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8YSBocmVmPScgKyB1cmwgKyAnPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8aW1nIHNyYz1cIicgKyBnZXRQaWNQYXRoKGRhdGEuZGF0YVtpXS5pbWcpICsgJ1wiIGFsdD1cIlwiICBvbmVycm9yPVwidGhpcy5zcmM9XFwnLi4vaG9tZS9pbWFnZXMvYmctbm8ucG5nXFwnXCIgPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2E+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxwIHRpdGxlPVwiJyArIGRhdGEuZGF0YVtpXS50aXRsZSArICdcXFwiIGNsYXNzPVwic3VzcGVuZFwiICBvbmNsaWNrPVwibG9jYXRpb24uaHJlZiA9XFwnJyArIHVybCArICdcXCdcIj4nICsgZGF0YS5kYXRhW2ldLnRpdGxlICsgJzwvcD4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9saT4nXHJcbiAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoaWRlVGV4dCgkKCcuaW1wLW1lc3NhZ2UgLmltcC10ZXh0JyksIDIwKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQoXCLojrflj5bmjqjojZDmlrDpl7vlvILluLhcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy/lhoXlrrnlpJrlh7rmmL7npLrpmpDol49cclxuICAgICAgZnVuY3Rpb24gaGlkZVRleHQob2JqLCBsb25nKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHZhciBzdHIgPSAnLi4uJztcclxuICAgICAgICAgIHZhciBiZV9zdHIgPSBvYmouZXEoaSkuaHRtbCgpO1xyXG4gICAgICAgICAgYmVfc3RyID0gYmVfc3RyLnJlcGxhY2UoL15cXHMrfFxccyskLywgJycpO1xyXG4gICAgICAgICAgdmFyIG5ld3N0ciA9ICcnO1xyXG5cclxuICAgICAgICAgIGlmIChiZV9zdHIubGVuZ3RoID4gbG9uZykge1xyXG4gICAgICAgICAgICBuZXdzdHIgPSBiZV9zdHIuc2xpY2UoMCwgbG9uZykgKyBzdHI7XHJcbiAgICAgICAgICAgIG9iai5lcShpKS5odG1sKG5ld3N0cik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5qC55o2u5Zu+54mHSUTov5Tlm57lm77niYfot6/lvoRcclxuICAgICAgICogQHBhcmFtIGlkIOWbvueJh0lEXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IOWbvueJh+i3r+W+hFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0UGljUGF0aChpZCkge1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5zdWJzdHJpbmcoMCwgNCkgPT09ICdodHRwJyA/IHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkgOiAoc2VydmljZS5wcmVmaXggKyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5yZXBsYWNlKCcjcmVzaWQjJywgaWQpKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8v5oiq5Y+W5a2X56ym5Liy5LiK56+H77yM5LiL56+HXHJcbiAgICAgIGZ1bmN0aW9uIGdldE90aGVyVGl0bGUoc3RyLCBhbHNvKSB7XHJcbiAgICAgICAgaWYgKGFsc28pIHtcclxuICAgICAgICAgIHJldHVybiBzdHIuc2xpY2UoMCwgc3RyLmluZGV4T2YoJywnKSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHN0ci5zbGljZShzdHIuaW5kZXhPZignLCcpICsgMSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG4gIC8qXHJcbiAgJChmdW5jdGlvbigpe1xyXG4gICAgICAvL+mhtumDqOWvvOiIqlxyXG4gICAgICB2YXIgYmVnaW5fbGVmdCA9IDA7XHJcbiAgICAgIHZhciBiZWdpbl93aWR0aCA9IHBhcnNlRmxvYXQoJCgnLm5hdi1saXN0JykuZXEoMSkuY3NzKCd3aWR0aCcpKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgICAgICAgIGJlZ2luX2xlZnQgKz0gcGFyc2VGbG9hdCgkKCcubmF2LWxpc3QnKS5lcShpKS5jc3MoJ3dpZHRoJykpICsgMTA7XHJcbiAgICAgIH1cclxuICAgICAgJCgnLm5hdi1saW5lJykuY3NzKCdsZWZ0JyxiZWdpbl9sZWZ0KTtcclxuICAgICAgJCgnLm5hdi1saW5lJykuY3NzKCd3aWR0aCcsYmVnaW5fd2lkdGgpO1xyXG5cclxuICAgICAgJCgnLm5hdi1saXN0JykuaG92ZXIoXHJcbiAgICAgICAgICBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIHZhciBsaW5lX2xlZnQgPSAwO1xyXG4gICAgICAgICAgICAgIHZhciBsaW5lX3dpZHRoID0gcGFyc2VGbG9hdCgkKHRoaXMpLmNzcygnd2lkdGgnKSk7Ly/lpLTpg6jnmoTnmb3oibLlupXpg6hcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICQodGhpcykuaW5kZXgoKSA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lX2xlZnQgKz0gcGFyc2VGbG9hdCgkKCcubmF2LWxpc3QnKS5lcShpKS5jc3MoJ3dpZHRoJykpICsgMTA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICQoJy5uYXYtbGluZScpLmVxKDApLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aDpsaW5lX3dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICBsZWZ0OmxpbmVfbGVmdFxyXG4gICAgICAgICAgICAgIH0sMjAwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uKCl7fVxyXG4gICAgICAgKVxyXG4gICAgICAkKCcubmF2LWJveCcpLmhvdmVyKFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXt9LFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAkKCcubmF2LWxpbmUnKS5lcSgwKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgd2lkdGg6YmVnaW5fd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGxlZnQ6YmVnaW5fbGVmdFxyXG4gICAgICAgICAgICAgIH0sMjAwKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgKVxyXG4gICAgICAvL+iHqumAguW6lOeql+WPo1xyXG4gICAgICBmdW5jdGlvbiB3aW5DaGFuZ2UobWluTnVtLG91dE5VbSl7XHJcbiAgICAgICAgICB2YXIgY29udEhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSAtIG91dE5VbTtcclxuICAgICAgICAgIGlmKCBjb250SGVpZ2h0IDwgbWluTnVtICl7XHJcbiAgICAgICAgICAgICAgY29udEhlaWdodCA9IG1pbk51bTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICQoJy5tZXNzYWdlLWNvbnRlbnQnKS5nZXQoMCkuc3R5bGVbJ21pbi1oZWlnaHQnXSA9IGNvbnRIZWlnaHQgKyAncHgnO1xyXG4gICAgICB9XHJcbiAgICAgIHdpbkNoYW5nZSgzNTAsNTc0KTtcclxuXHJcbiAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB3aW5DaGFuZ2UoKTtcclxuICAgICAgfSlcclxuICB9KVxyXG5cclxuXHJcblxyXG4gICovXHJcbn0pXHJcbiJdfQ==

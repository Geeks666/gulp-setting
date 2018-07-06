'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js'
  }
});
require(['platformConf'], function (configpaths) {

  require.config(configpaths);

  define('', ['jquery', 'template', 'service', 'footer', 'header', 'tool'], function ($, template, service, footer, header, tools) {
    gettoplistnews();
    //新闻详情
    $.ajax({
      url: service.htmlHost + '/pf/api/news/detail?id=' + tools.args.id + '&index=' + tools.args.index + '&category=' + tools.args.category + (tools.args.isComm ? '&isComm=' + tools.args.isComm : ''),
      type: 'GET',
      success: function success(data) {
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
          alert("获取新闻详情异常");
        }
      }
    });

    //推荐新闻
    function gettoplistnews() {
      $.ajax({
        url: service.htmlHost + '/pf/api/news/getLimit?limit=6&isComm=1&category=1',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            $('#toplistnews').empty();
            for (var i = 0; i < data.data.length; i++) {
              $('#toplistnews').append('<li class="imp-list"><a class="imp-text" href="sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isComm=1">' + data.data[i].title + '</a></li>');
            }
            hideText($('.imp-text'), 18);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ld3MvanMvbmV3c19kZXRhaWwuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInRlbXBsYXRlIiwic2VydmljZSIsImZvb3RlciIsImhlYWRlciIsInRvb2xzIiwiZ2V0dG9wbGlzdG5ld3MiLCJhamF4IiwidXJsIiwiaHRtbEhvc3QiLCJhcmdzIiwiaWQiLCJpbmRleCIsImNhdGVnb3J5IiwiaXNDb21tIiwidHlwZSIsInN1Y2Nlc3MiLCJkYXRhIiwiY29kZSIsImh0bWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJjcnREdHRtIiwic3BsaXQiLCJodG1sQ29udGVudCIsImZsYWdvIiwicGFyc2VJbnQiLCJmbGFncyIsImFsZXJ0IiwiZW1wdHkiLCJpIiwibGVuZ3RoIiwiYXBwZW5kIiwiaGlkZVRleHQiLCJvYmoiLCJsb25nIiwic3RyIiwiYmVfc3RyIiwiZXEiLCJyZXBsYWNlIiwibmV3c3RyIiwic2xpY2UiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZTtBQUNiQyxXQUFTLEtBREk7QUFFYkMsU0FBTztBQUNMLG9CQUFnQjtBQURYO0FBRk0sQ0FBZjtBQU1BSCxRQUFRLENBQUMsY0FBRCxDQUFSLEVBQTBCLFVBQVVJLFdBQVYsRUFBdUI7O0FBRS9DSixVQUFRQyxNQUFSLENBQWVHLFdBQWY7O0FBRUFDLFNBQU8sRUFBUCxFQUFXLENBQUMsUUFBRCxFQUFXLFVBQVgsRUFBdUIsU0FBdkIsRUFBa0MsUUFBbEMsRUFBNEMsUUFBNUMsRUFBc0QsTUFBdEQsQ0FBWCxFQUNFLFVBQVVDLENBQVYsRUFBYUMsUUFBYixFQUF1QkMsT0FBdkIsRUFBZ0NDLE1BQWhDLEVBQXdDQyxNQUF4QyxFQUFnREMsS0FBaEQsRUFBdUQ7QUFDckRDO0FBQ0E7QUFDQU4sTUFBRU8sSUFBRixDQUFPO0FBQ0xDLFdBQUtOLFFBQVFPLFFBQVIsR0FBbUIseUJBQW5CLEdBQStDSixNQUFNSyxJQUFOLENBQVdDLEVBQTFELEdBQStELFNBQS9ELEdBQTJFTixNQUFNSyxJQUFOLENBQVdFLEtBQXRGLEdBQThGLFlBQTlGLEdBQTZHUCxNQUFNSyxJQUFOLENBQVdHLFFBQXhILElBQW9JUixNQUFNSyxJQUFOLENBQVdJLE1BQVgsR0FBb0IsYUFBYVQsTUFBTUssSUFBTixDQUFXSSxNQUE1QyxHQUFxRCxFQUF6TCxDQURBO0FBRUxDLFlBQU0sS0FGRDtBQUdMQyxlQUFTLGlCQUFVQyxJQUFWLEVBQWdCO0FBQ3ZCLFlBQUlBLFFBQVFBLEtBQUtDLElBQUwsSUFBYSxTQUF6QixFQUFvQztBQUNsQ2xCLFlBQUUsaUJBQUYsRUFBcUJtQixJQUFyQixDQUEwQkYsS0FBS0EsSUFBTCxDQUFVRyxLQUFwQztBQUNBcEIsWUFBRSxlQUFGLEVBQW1CbUIsSUFBbkIsQ0FBd0JGLEtBQUtBLElBQUwsQ0FBVUksT0FBbEM7QUFDQXJCLFlBQUUsWUFBRixFQUFnQm1CLElBQWhCLENBQXFCRixLQUFLQSxJQUFMLENBQVVLLE9BQVYsQ0FBa0JDLEtBQWxCLENBQXdCLEdBQXhCLEVBQTZCLENBQTdCLENBQXJCO0FBQ0EsY0FBSUMsY0FBYyxFQUFsQjtBQUNBLGNBQUlQLEtBQUtBLElBQUwsQ0FBVVEsS0FBVixLQUFvQixFQUFwQixJQUEwQkMsU0FBU3JCLE1BQU1LLElBQU4sQ0FBV0UsS0FBcEIsS0FBOEIsQ0FBNUQsRUFBK0Q7QUFDN0RZLDJCQUFlLGtEQUFrRFAsS0FBS0EsSUFBTCxDQUFVUSxLQUE1RCxHQUFvRSxTQUFwRSxJQUFpRkMsU0FBU3JCLE1BQU1LLElBQU4sQ0FBV0UsS0FBcEIsSUFBNkIsQ0FBOUcsSUFBbUgsWUFBbkgsR0FBa0lQLE1BQU1LLElBQU4sQ0FBV0csUUFBN0ksR0FBd0osV0FBdks7QUFDRDtBQUNELGNBQUlJLEtBQUtBLElBQUwsQ0FBVVUsS0FBVixLQUFvQixFQUF4QixFQUE0QjtBQUMxQkgsMkJBQWUsa0RBQWtEUCxLQUFLQSxJQUFMLENBQVVVLEtBQTVELEdBQW9FLFNBQXBFLElBQWlGRCxTQUFTckIsTUFBTUssSUFBTixDQUFXRSxLQUFwQixJQUE2QixDQUE5RyxJQUFtSCxZQUFuSCxHQUFrSVAsTUFBTUssSUFBTixDQUFXRyxRQUE3SSxHQUF3SixXQUF2SztBQUNEO0FBQ0RiLFlBQUUsZUFBRixFQUFtQm1CLElBQW5CLENBQXdCSyxXQUF4QjtBQUNELFNBWkQsTUFZTztBQUNMSSxnQkFBTSxVQUFOO0FBQ0Q7QUFDRjtBQW5CSSxLQUFQOztBQXNCQTtBQUNBLGFBQVN0QixjQUFULEdBQTBCO0FBQ3hCTixRQUFFTyxJQUFGLENBQU87QUFDTEMsYUFBS04sUUFBUU8sUUFBUixHQUFtQixtREFEbkI7QUFFTE0sY0FBTSxLQUZEO0FBR0xDLGlCQUFTLGlCQUFVQyxJQUFWLEVBQWdCO0FBQ3ZCLGNBQUlBLFFBQVFBLEtBQUtDLElBQUwsSUFBYSxTQUF6QixFQUFvQztBQUNsQ2xCLGNBQUUsY0FBRixFQUFrQjZCLEtBQWxCO0FBQ0EsaUJBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJYixLQUFLQSxJQUFMLENBQVVjLE1BQTlCLEVBQXNDRCxHQUF0QyxFQUEyQztBQUN6QzlCLGdCQUFFLGNBQUYsRUFBa0JnQyxNQUFsQixDQUF5QiwyRUFBMkVmLEtBQUtBLElBQUwsQ0FBVWEsQ0FBVixFQUFhbkIsRUFBeEYsR0FBNkYsU0FBN0YsR0FBeUdtQixDQUF6RyxHQUE2Ryx3QkFBN0csR0FBd0liLEtBQUtBLElBQUwsQ0FBVWEsQ0FBVixFQUFhVixLQUFySixHQUE2SixXQUF0TDtBQUNEO0FBQ0RhLHFCQUFTakMsRUFBRSxXQUFGLENBQVQsRUFBeUIsRUFBekI7QUFDRCxXQU5ELE1BTU87QUFDTDRCLGtCQUFNLFVBQU47QUFDRDtBQUNGO0FBYkksT0FBUDtBQWVEOztBQUVEO0FBQ0EsYUFBU0ssUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLElBQXZCLEVBQTZCO0FBQzNCLFdBQUssSUFBSUwsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSSxJQUFJSCxNQUF4QixFQUFnQ0QsR0FBaEMsRUFBcUM7QUFDbkMsWUFBSU0sTUFBTSxLQUFWO0FBQ0EsWUFBSUMsU0FBU0gsSUFBSUksRUFBSixDQUFPUixDQUFQLEVBQVVYLElBQVYsRUFBYjtBQUNBa0IsaUJBQVNBLE9BQU9FLE9BQVAsQ0FBZSxXQUFmLEVBQTRCLEVBQTVCLENBQVQ7QUFDQSxZQUFJQyxTQUFTLEVBQWI7O0FBRUEsWUFBSUgsT0FBT04sTUFBUCxHQUFnQkksSUFBcEIsRUFBMEI7QUFDeEJLLG1CQUFTSCxPQUFPSSxLQUFQLENBQWEsQ0FBYixFQUFnQk4sSUFBaEIsSUFBd0JDLEdBQWpDO0FBQ0FGLGNBQUlJLEVBQUosQ0FBT1IsQ0FBUCxFQUFVWCxJQUFWLENBQWVxQixNQUFmO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsR0EzREg7QUE2REE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFERCxDQXRIRCIsImZpbGUiOiJuZXdzL2pzL25ld3NfZGV0YWlsLTFiNTlkODFmZDQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9XHJcbn0pO1xyXG5yZXF1aXJlKFsncGxhdGZvcm1Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG5cclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAndGVtcGxhdGUnLCAnc2VydmljZScsICdmb290ZXInLCAnaGVhZGVyJywgJ3Rvb2wnXSxcclxuICAgIGZ1bmN0aW9uICgkLCB0ZW1wbGF0ZSwgc2VydmljZSwgZm9vdGVyLCBoZWFkZXIsIHRvb2xzKSB7XHJcbiAgICAgIGdldHRvcGxpc3RuZXdzKCk7XHJcbiAgICAgIC8v5paw6Ze76K+m5oOFXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvbmV3cy9kZXRhaWw/aWQ9JyArIHRvb2xzLmFyZ3MuaWQgKyAnJmluZGV4PScgKyB0b29scy5hcmdzLmluZGV4ICsgJyZjYXRlZ29yeT0nICsgdG9vbHMuYXJncy5jYXRlZ29yeSArICh0b29scy5hcmdzLmlzQ29tbSA/ICcmaXNDb21tPScgKyB0b29scy5hcmdzLmlzQ29tbSA6ICcnKSxcclxuICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICQoXCIudGl0bGVfbm9ib3JkZXJcIikuaHRtbChkYXRhLmRhdGEudGl0bGUpO1xyXG4gICAgICAgICAgICAkKFwiLmNvbnRlbnQtdGV4dFwiKS5odG1sKGRhdGEuZGF0YS5jb250ZW50KTtcclxuICAgICAgICAgICAgJChcIi50ZXh0LXRpbWVcIikuaHRtbChkYXRhLmRhdGEuY3J0RHR0bS5zcGxpdChcIiBcIilbMF0pO1xyXG4gICAgICAgICAgICB2YXIgaHRtbENvbnRlbnQgPSAnJztcclxuICAgICAgICAgICAgaWYgKGRhdGEuZGF0YS5mbGFnbyAhPT0gJycgJiYgcGFyc2VJbnQodG9vbHMuYXJncy5pbmRleCkgIT0gMCkge1xyXG4gICAgICAgICAgICAgIGh0bWxDb250ZW50ICs9ICc8YSBjbGFzcz1cInByZXZcIiBocmVmPVwic2l0ZW5ld3NEZXRhaWwuaHRtbD9pZD0nICsgZGF0YS5kYXRhLmZsYWdvICsgJyZpbmRleD0nICsgKHBhcnNlSW50KHRvb2xzLmFyZ3MuaW5kZXgpIC0gMSkgKyAnJmNhdGVnb3J5PScgKyB0b29scy5hcmdzLmNhdGVnb3J5ICsgJ1wiPuS4iuS4gOevhzwvYT4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEuZmxhZ3MgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgaHRtbENvbnRlbnQgKz0gJzxhIGNsYXNzPVwibmV4dFwiIGhyZWY9XCJzaXRlbmV3c0RldGFpbC5odG1sP2lkPScgKyBkYXRhLmRhdGEuZmxhZ3MgKyAnJmluZGV4PScgKyAocGFyc2VJbnQodG9vbHMuYXJncy5pbmRleCkgKyAxKSArICcmY2F0ZWdvcnk9JyArIHRvb2xzLmFyZ3MuY2F0ZWdvcnkgKyAnXCI+5LiL5LiA56+HPC9hPic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJChcIi5jb250ZW50LWxpbmtcIikuaHRtbChodG1sQ29udGVudCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydChcIuiOt+WPluaWsOmXu+ivpuaDheW8guW4uFwiKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL+aOqOiNkOaWsOmXu1xyXG4gICAgICBmdW5jdGlvbiBnZXR0b3BsaXN0bmV3cygpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvbmV3cy9nZXRMaW1pdD9saW1pdD02JmlzQ29tbT0xJmNhdGVnb3J5PTEnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAkKCcjdG9wbGlzdG5ld3MnKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjdG9wbGlzdG5ld3MnKS5hcHBlbmQoJzxsaSBjbGFzcz1cImltcC1saXN0XCI+PGEgY2xhc3M9XCJpbXAtdGV4dFwiIGhyZWY9XCJzaXRlbmV3c0RldGFpbC5odG1sP2lkPScgKyBkYXRhLmRhdGFbaV0uaWQgKyAnJmluZGV4PScgKyBpICsgJyZjYXRlZ29yeT0xJmlzQ29tbT0xXCI+JyArIGRhdGEuZGF0YVtpXS50aXRsZSArICc8L2E+PC9saT4nKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaGlkZVRleHQoJCgnLmltcC10ZXh0JyksIDE4KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydChcIuiOt+WPluaOqOiNkOaWsOmXu+W8guW4uFwiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvL+WGheWuueWkmuWHuuaYvuekuumakOiXj1xyXG4gICAgICBmdW5jdGlvbiBoaWRlVGV4dChvYmosIGxvbmcpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIHN0ciA9ICcuLi4nO1xyXG4gICAgICAgICAgdmFyIGJlX3N0ciA9IG9iai5lcShpKS5odG1sKCk7XHJcbiAgICAgICAgICBiZV9zdHIgPSBiZV9zdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvLCAnJyk7XHJcbiAgICAgICAgICB2YXIgbmV3c3RyID0gJyc7XHJcblxyXG4gICAgICAgICAgaWYgKGJlX3N0ci5sZW5ndGggPiBsb25nKSB7XHJcbiAgICAgICAgICAgIG5ld3N0ciA9IGJlX3N0ci5zbGljZSgwLCBsb25nKSArIHN0cjtcclxuICAgICAgICAgICAgb2JqLmVxKGkpLmh0bWwobmV3c3RyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG4gIC8qXHJcbiAgJChmdW5jdGlvbigpe1xyXG4gICAgICAvL+mhtumDqOWvvOiIqlxyXG4gICAgICB2YXIgYmVnaW5fbGVmdCA9IDA7XHJcbiAgICAgIHZhciBiZWdpbl93aWR0aCA9IHBhcnNlRmxvYXQoJCgnLm5hdi1saXN0JykuZXEoMSkuY3NzKCd3aWR0aCcpKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgICAgICAgIGJlZ2luX2xlZnQgKz0gcGFyc2VGbG9hdCgkKCcubmF2LWxpc3QnKS5lcShpKS5jc3MoJ3dpZHRoJykpICsgMTA7XHJcbiAgICAgIH1cclxuICAgICAgJCgnLm5hdi1saW5lJykuY3NzKCdsZWZ0JyxiZWdpbl9sZWZ0KTtcclxuICAgICAgJCgnLm5hdi1saW5lJykuY3NzKCd3aWR0aCcsYmVnaW5fd2lkdGgpO1xyXG5cclxuICAgICAgJCgnLm5hdi1saXN0JykuaG92ZXIoXHJcbiAgICAgICAgICBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgIHZhciBsaW5lX2xlZnQgPSAwO1xyXG4gICAgICAgICAgICAgIHZhciBsaW5lX3dpZHRoID0gcGFyc2VGbG9hdCgkKHRoaXMpLmNzcygnd2lkdGgnKSk7Ly/lpLTpg6jnmoTnmb3oibLlupXpg6hcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICQodGhpcykuaW5kZXgoKSA7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBsaW5lX2xlZnQgKz0gcGFyc2VGbG9hdCgkKCcubmF2LWxpc3QnKS5lcShpKS5jc3MoJ3dpZHRoJykpICsgMTA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICQoJy5uYXYtbGluZScpLmVxKDApLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aDpsaW5lX3dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICBsZWZ0OmxpbmVfbGVmdFxyXG4gICAgICAgICAgICAgIH0sMjAwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uKCl7fVxyXG4gICAgICAgKVxyXG4gICAgICAkKCcubmF2LWJveCcpLmhvdmVyKFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXt9LFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAkKCcubmF2LWxpbmUnKS5lcSgwKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgd2lkdGg6YmVnaW5fd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGxlZnQ6YmVnaW5fbGVmdFxyXG4gICAgICAgICAgICAgIH0sMjAwKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgKVxyXG4gICAgICAvL+iHqumAguW6lOeql+WPo1xyXG4gICAgICBmdW5jdGlvbiB3aW5DaGFuZ2UobWluTnVtLG91dE5VbSl7XHJcbiAgICAgICAgICB2YXIgY29udEhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKSAtIG91dE5VbTtcclxuICAgICAgICAgIGlmKCBjb250SGVpZ2h0IDwgbWluTnVtICl7XHJcbiAgICAgICAgICAgICAgY29udEhlaWdodCA9IG1pbk51bTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgICQoJy5tZXNzYWdlLWNvbnRlbnQnKS5nZXQoMCkuc3R5bGVbJ21pbi1oZWlnaHQnXSA9IGNvbnRIZWlnaHQgKyAncHgnO1xyXG4gICAgICB9XHJcbiAgICAgIHdpbkNoYW5nZSgzNTAsNTc0KTtcclxuXHJcbiAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB3aW5DaGFuZ2UoKTtcclxuICAgICAgfSlcclxuICB9KVxyXG5cclxuXHJcblxyXG4gICovXHJcbn0pIl19

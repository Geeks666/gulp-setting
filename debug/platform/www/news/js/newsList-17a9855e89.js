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
    var tabArr = {
      "1": "edunews",
      "2": "result"
    };
    var pageSize = 5;

    $("#" + tabArr[tools.args.tab]).show().siblings(".cont-message").hide();
    if (tools.args.tab == null) {
      tools.args.tab = '1';
    }
    ;
    if (tools.args.currentPage == null) {
      tools.args.currentPage = 1;
    }
    ;
    if (tools.args.tab == "1") {
      $("#newstab").addClass("news-title-active").siblings().removeClass("news-title-active");
    } else {
      $("#newstab").removeClass("news-title-active").siblings().addClass("news-title-active");
    }
    gettoplistnews(); //推荐新闻
    getnewsList(tools.args.tab); //获取新闻/成果列表

    //推荐新闻
    function gettoplistnews() {
      $.ajax({
        url: service.htmlHost + '/pf/api/news/getLimit?limit=6&isComm=1&category=1',
        type: 'GET',
        success: function success(data) {
          if (data && data.code == "success") {
            $('#toplistnews').empty();
            if (data.data && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                $('#toplistnews').append('<li class="imp-list"><a class="imp-text" href="sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isComm=1">' + data.data[i].title + '</a></li>');
              }
              hideText($('.imp-text'), 18);
            } else {
              $('#toplistnews').html(showprompt());
            }
          } else {
            layer.alert("获取推荐新闻异常", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取推荐新闻异常。", { icon: 0 });
        }
      });
    };

    //获取新闻/成果列表
    function getnewsList(category) {
      tools.args.tab = category;
      $.ajax({
        url: service.htmlHost + '/pf/api/news/getByPage',
        type: 'GET',
        data: {
          'page.pageSize': pageSize,
          'page.currentPage': tools.args.currentPage,
          'category': tools.args.tab
        },
        success: function success(data) {
          if (data && data.code == "success") {
            var newlist = data.data.datalist;
            if (newlist.length == 0) {
              $("#edunews").empty();
              $("#result").empty();
              $("#pages").empty();
              $("#edunews").append("<p id='no-content'>没有您查看的内容</p>");
              $("#result").append("<p id='no-content'>没有您查看的内容</p>");
              return;
            }
            var htmlCon = '';
            for (var i = 0; i < newlist.length; i++) {
              htmlCon += '<li id="' + tabArr[tools.args.tab] + i + '" class="cont-list clearFix">' + '<div id="' + tabArr[tools.args.tab] + 'content' + i + '" class="content-right">' + '<h3><a class="text-link" href="sitenewsDetail.html?id=' + newlist[i].id + '&index=' + (pageSize * (tools.args.currentPage - 1) + i) + '&category=' + category + '">' + newlist[i].title + '</a></h3>' + '<p class="news-text">' + newlist[i].brief.replace(/<.*?>/g, "") + '</p>' + '<span class="news-time">' + newlist[i].crtDttm.split(" ")[0] + '</span>' + '</div>' + '</li>';
            }
            $("#" + tabArr[tools.args.tab]).html(htmlCon);
            hideText($('.news-text'), 115);
            $("#pages").empty();
            var page = data.data.page;
            page.totalPages = data.data.totalPages;
            if (page.totalPages > 1) {
              createPage(page);
            }
          } else {
            layer.alert("获取推荐新闻异常。", { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取推荐新闻异常。", { icon: 0 });
        }
      });
    };

    //分页
    function createPage(page) {
      if (page.totalPages <= 3) {
        createPre(page);
        for (var i = 1; i <= page.totalPages; i++) {
          createContent(i);
        }
        //show1();
        createNext(page);
      } else {
        if (page.currentPage <= 2) {
          createPre(page);
          for (var i = page.currentPage; i < page.currentPage + 3; i++) {
            createContent(i);
          }
          createNext(page);
        } else {
          if (page.currentPage <= page.totalPages - 2) {
            createPre(page);
            for (var i = page.currentPage - 1; i <= page.currentPage + 1; i++) {
              createContent(i);
            }
            createNext(page);
          } else {
            if (page.currentPage <= page.totalPages) {
              createPre(page);
              for (var i = page.totalPages - 2; i <= page.totalPages; i++) {
                createContent(i);
              }
              createNext(page);
            }
          }
        }
      }
    };

    function createPre(page) {
      if (parseInt(page.currentPage) > 1) {
        var prePage = parseInt(page.currentPage) - 1;
        $('#pages').append('<li class=pages-list > <a class=pages-link page=' + prePage + ' href=javascript:;>&lsaquo;&lsaquo;</a> </li>');
      }
    };

    function createNext(page) {
      if (parseInt(page.currentPage) < page.totalPages) {
        var nextPage = parseInt(page.currentPage) + 1;
        $("#pages").append('<li class=pages-list > <a class=pages-link page=' + nextPage + ' href=javascript:;>&rsaquo;&rsaquo;</a> </li>');
      }
    };

    function createContent(i) {
      var htmlCon = '<li class=pages-list > <a class="' + (tools.args.currentPage == i ? 'pages-active pages-link' : 'pages-link') + '" page="' + i + '" href=javascript:;>' + i + '</a> </li>';
      $("#pages").append(htmlCon);
    };

    function changePage() {
      getnewsList(tools.args.tab);
    };
    $(".news-top .news-title").click(function (ev) {
      tools.args.currentPage = 1;
      tools.args.tab = $(this).attr("category");
      $(this).addClass("news-title-active").siblings().removeClass("news-title-active");
      $("#" + tabArr[tools.args.tab]).show().siblings(".cont-message").hide();
      getnewsList(tools.args.tab);
    });
    $(".wrap").delegate('#pages li', 'click', function () {
      tools.args.currentPage = parseInt($(this).find("a").attr("page"));
      changePage();
    });
    /*function show1(){
      $('.pages-link').removeClass('pages-active');
      $('.pages-link').eq(currentPage).addClass('pages-active')
    };*/

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
    };

    /**
     * 公用没有内容方法
     * @returns {string}
     */
    function showprompt() {
      return "<p id='no-content'>没有您查看的内容</p>";
    };
  });

  /*$(function(){
      //椤堕儴瀵艰埅
        var begin_left = 0;
      var begin_width = parseFloat($('.nav-list').eq(1).css('width')+10);
      for (var i = 0; i < 1; i++) {
          begin_left += parseFloat($('.nav-list').eq(i).css('width'))+10;
      }
      $('.nav-line').css('left',begin_left);
      $('.nav-line').css('width',begin_width);
        $('.nav-list').hover(
          function(){
              var line_left = 0;
              var line_width = parseFloat($(this).css('width'));//澶撮儴鐨勭櫧鑹插簳閮�
              for (var i = 0; i < $(this).index() ; i++) {
                  line_left += parseFloat($('.nav-list').eq(i).css('width'))+10;
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
        //鑷�搴旂獥鍙�
      function winChange(minNum,outNUm){
          var contHeight = $(window).height() - outNUm;
          if( contHeight < minNum ){
              contHeight = minNum;
          }
          $('.message-content').get(0).style['min-height'] = contHeight + 'px';
      }
      winChange(250,654);
        $(window).resize(function() {
          winChange();
      })
  
        //鏂伴椈 鍜�搴曢儴椤甸潰鍒囨崲
      $('.pages-link').click(function(){
          $('.pages-link').removeClass('pages-active');
          $(this).addClass('pages-active');
      })
        var str = window.location.search;
      if(str.slice(5) == 'result'){
          $('.cont-message').hide();
          $('.news-title').removeClass('news-title-active');
          $('.news-title').eq(1).addClass('news-title-active');
          $('.cont-message').eq(1).show();
          getnewsList('others','3',1)
          gettoplistnews();
      }
  
      $('.news-title').click(function(){
          $('.cont-message').hide();
          $('.news-title').removeClass('news-title-active');
          $(this).addClass('news-title-active');
          $('.cont-message').eq($(this).index()).show();
      })
      hideText($('.news-text'),110);
  })*/
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ld3MvanMvbmV3c0xpc3QuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInRlbXBsYXRlIiwic2VydmljZSIsImZvb3RlciIsImhlYWRlciIsInRvb2xzIiwidGFiQXJyIiwicGFnZVNpemUiLCJhcmdzIiwidGFiIiwic2hvdyIsInNpYmxpbmdzIiwiaGlkZSIsImN1cnJlbnRQYWdlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImdldHRvcGxpc3RuZXdzIiwiZ2V0bmV3c0xpc3QiLCJhamF4IiwidXJsIiwiaHRtbEhvc3QiLCJ0eXBlIiwic3VjY2VzcyIsImRhdGEiLCJjb2RlIiwiZW1wdHkiLCJsZW5ndGgiLCJpIiwiYXBwZW5kIiwiaWQiLCJ0aXRsZSIsImhpZGVUZXh0IiwiaHRtbCIsInNob3dwcm9tcHQiLCJsYXllciIsImFsZXJ0IiwiaWNvbiIsImVycm9yIiwiY2F0ZWdvcnkiLCJuZXdsaXN0IiwiZGF0YWxpc3QiLCJodG1sQ29uIiwiYnJpZWYiLCJyZXBsYWNlIiwiY3J0RHR0bSIsInNwbGl0IiwicGFnZSIsInRvdGFsUGFnZXMiLCJjcmVhdGVQYWdlIiwiY3JlYXRlUHJlIiwiY3JlYXRlQ29udGVudCIsImNyZWF0ZU5leHQiLCJwYXJzZUludCIsInByZVBhZ2UiLCJuZXh0UGFnZSIsImNoYW5nZVBhZ2UiLCJjbGljayIsImV2IiwiYXR0ciIsImRlbGVnYXRlIiwiZmluZCIsIm9iaiIsImxvbmciLCJzdHIiLCJiZV9zdHIiLCJlcSIsIm5ld3N0ciIsInNsaWNlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxvQkFBZ0I7QUFEWDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLGNBQUQsQ0FBUixFQUEwQixVQUFVSSxXQUFWLEVBQXVCOztBQUUvQ0osVUFBUUMsTUFBUixD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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZFRCxDQTNSRCIsImZpbGUiOiJuZXdzL2pzL25ld3NMaXN0LTE3YTk4NTVlODkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9XHJcbn0pO1xyXG5yZXF1aXJlKFsncGxhdGZvcm1Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG5cclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJyxbJ2pxdWVyeScsICd0ZW1wbGF0ZScsICdzZXJ2aWNlJywgJ2Zvb3RlcicsICdoZWFkZXInLCAndG9vbCddLFxyXG4gICAgZnVuY3Rpb24gKCQsIHRlbXBsYXRlLCBzZXJ2aWNlLCBmb290ZXIsIGhlYWRlciwgdG9vbHMpIHtcclxuICAgICAgdmFyIHRhYkFyciA9IHtcclxuICAgICAgICBcIjFcIjogXCJlZHVuZXdzXCIsXHJcbiAgICAgICAgXCIyXCI6IFwicmVzdWx0XCJcclxuICAgICAgfTtcclxuICAgICAgdmFyIHBhZ2VTaXplID0gNTtcclxuXHJcbiAgICAgICQoXCIjXCIgKyB0YWJBcnJbdG9vbHMuYXJncy50YWJdKS5zaG93KCkuc2libGluZ3MoXCIuY29udC1tZXNzYWdlXCIpLmhpZGUoKTtcclxuICAgICAgaWYgKHRvb2xzLmFyZ3MudGFiID09IG51bGwpIHtcclxuICAgICAgICB0b29scy5hcmdzLnRhYiA9ICcxJztcclxuICAgICAgfVxyXG4gICAgICA7XHJcbiAgICAgIGlmICh0b29scy5hcmdzLmN1cnJlbnRQYWdlID09IG51bGwpIHtcclxuICAgICAgICB0b29scy5hcmdzLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgfVxyXG4gICAgICA7XHJcbiAgICAgIGlmICh0b29scy5hcmdzLnRhYiA9PSBcIjFcIikge1xyXG4gICAgICAgICQoXCIjbmV3c3RhYlwiKS5hZGRDbGFzcyhcIm5ld3MtdGl0bGUtYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJuZXdzLXRpdGxlLWFjdGl2ZVwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKFwiI25ld3N0YWJcIikucmVtb3ZlQ2xhc3MoXCJuZXdzLXRpdGxlLWFjdGl2ZVwiKS5zaWJsaW5ncygpLmFkZENsYXNzKFwibmV3cy10aXRsZS1hY3RpdmVcIik7XHJcbiAgICAgIH1cclxuICAgICAgZ2V0dG9wbGlzdG5ld3MoKTsvL+aOqOiNkOaWsOmXu1xyXG4gICAgICBnZXRuZXdzTGlzdCh0b29scy5hcmdzLnRhYik7Ly/ojrflj5bmlrDpl7sv5oiQ5p6c5YiX6KGoXHJcblxyXG4gICAgICAvL+aOqOiNkOaWsOmXu1xyXG4gICAgICBmdW5jdGlvbiBnZXR0b3BsaXN0bmV3cygpIHtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvbmV3cy9nZXRMaW1pdD9saW1pdD02JmlzQ29tbT0xJmNhdGVnb3J5PTEnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAkKCcjdG9wbGlzdG5ld3MnKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEgJiYgZGF0YS5kYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICQoJyN0b3BsaXN0bmV3cycpLmFwcGVuZCgnPGxpIGNsYXNzPVwiaW1wLWxpc3RcIj48YSBjbGFzcz1cImltcC10ZXh0XCIgaHJlZj1cInNpdGVuZXdzRGV0YWlsLmh0bWw/aWQ9JyArIGRhdGEuZGF0YVtpXS5pZCArICcmaW5kZXg9JyArIGkgKyAnJmNhdGVnb3J5PTEmaXNDb21tPTFcIj4nICsgZGF0YS5kYXRhW2ldLnRpdGxlICsgJzwvYT48L2xpPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaGlkZVRleHQoJCgnLmltcC10ZXh0JyksIDE4KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnI3RvcGxpc3RuZXdzJykuaHRtbChzaG93cHJvbXB0KCkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluaOqOiNkOaWsOmXu+W8guW4uFwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5o6o6I2Q5paw6Ze75byC5bi444CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvL+iOt+WPluaWsOmXuy/miJDmnpzliJfooahcclxuICAgICAgZnVuY3Rpb24gZ2V0bmV3c0xpc3QoY2F0ZWdvcnkpIHtcclxuICAgICAgICB0b29scy5hcmdzLnRhYiA9IGNhdGVnb3J5O1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9uZXdzL2dldEJ5UGFnZScsXHJcbiAgICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgJ3BhZ2UucGFnZVNpemUnOiBwYWdlU2l6ZSxcclxuICAgICAgICAgICAgJ3BhZ2UuY3VycmVudFBhZ2UnOiB0b29scy5hcmdzLmN1cnJlbnRQYWdlLFxyXG4gICAgICAgICAgICAnY2F0ZWdvcnknOiB0b29scy5hcmdzLnRhYlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgIHZhciBuZXdsaXN0ID0gZGF0YS5kYXRhLmRhdGFsaXN0O1xyXG4gICAgICAgICAgICAgIGlmIChuZXdsaXN0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkdW5ld3NcIikuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICQoXCIjcmVzdWx0XCIpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3BhZ2VzXCIpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2VkdW5ld3NcIikuYXBwZW5kKFwiPHAgaWQ9J25vLWNvbnRlbnQnPuayoeacieaCqOafpeeci+eahOWGheWuuTwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3Jlc3VsdFwiKS5hcHBlbmQoXCI8cCBpZD0nbm8tY29udGVudCc+5rKh5pyJ5oKo5p+l55yL55qE5YaF5a65PC9wPlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgdmFyIGh0bWxDb24gPSAnJztcclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld2xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGh0bWxDb24gKz1cclxuICAgICAgICAgICAgICAgICAgJzxsaSBpZD1cIicgKyB0YWJBcnJbdG9vbHMuYXJncy50YWJdICsgaSArICdcIiBjbGFzcz1cImNvbnQtbGlzdCBjbGVhckZpeFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cIicgKyB0YWJBcnJbdG9vbHMuYXJncy50YWJdICsgJ2NvbnRlbnQnICsgaSArICdcIiBjbGFzcz1cImNvbnRlbnQtcmlnaHRcIj4nICtcclxuICAgICAgICAgICAgICAgICAgJzxoMz48YSBjbGFzcz1cInRleHQtbGlua1wiIGhyZWY9XCJzaXRlbmV3c0RldGFpbC5odG1sP2lkPScgKyBuZXdsaXN0W2ldLmlkICsgJyZpbmRleD0nICsgKHBhZ2VTaXplICogKHRvb2xzLmFyZ3MuY3VycmVudFBhZ2UgLSAxKSArIGkpICsgJyZjYXRlZ29yeT0nICsgY2F0ZWdvcnkgKyAnXCI+JyArIG5ld2xpc3RbaV0udGl0bGUgKyAnPC9hPjwvaDM+JyArXHJcbiAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cIm5ld3MtdGV4dFwiPicgKyBuZXdsaXN0W2ldLmJyaWVmLnJlcGxhY2UoLzwuKj8+L2csIFwiXCIpICsgJzwvcD4nICtcclxuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibmV3cy10aW1lXCI+JyArIG5ld2xpc3RbaV0uY3J0RHR0bS5zcGxpdChcIiBcIilbMF0gKyAnPC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICc8L2xpPic7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICQoXCIjXCIgKyB0YWJBcnJbdG9vbHMuYXJncy50YWJdKS5odG1sKGh0bWxDb24pO1xyXG4gICAgICAgICAgICAgIGhpZGVUZXh0KCQoJy5uZXdzLXRleHQnKSwgMTE1KTtcclxuICAgICAgICAgICAgICAkKFwiI3BhZ2VzXCIpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgdmFyIHBhZ2UgPSBkYXRhLmRhdGEucGFnZTtcclxuICAgICAgICAgICAgICBwYWdlLnRvdGFsUGFnZXMgPSBkYXRhLmRhdGEudG90YWxQYWdlcztcclxuICAgICAgICAgICAgICBpZiAocGFnZS50b3RhbFBhZ2VzID4gMSkge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bmjqjojZDmlrDpl7vlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluaOqOiNkOaWsOmXu+W8guW4uOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy/liIbpobVcclxuICAgICAgZnVuY3Rpb24gY3JlYXRlUGFnZShwYWdlKSB7XHJcbiAgICAgICAgaWYgKHBhZ2UudG90YWxQYWdlcyA8PSAzKSB7XHJcbiAgICAgICAgICBjcmVhdGVQcmUocGFnZSk7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBwYWdlLnRvdGFsUGFnZXM7IGkrKykge1xyXG4gICAgICAgICAgICBjcmVhdGVDb250ZW50KGkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy9zaG93MSgpO1xyXG4gICAgICAgICAgY3JlYXRlTmV4dChwYWdlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHBhZ2UuY3VycmVudFBhZ2UgPD0gMikge1xyXG4gICAgICAgICAgICBjcmVhdGVQcmUocGFnZSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBwYWdlLmN1cnJlbnRQYWdlOyBpIDwgcGFnZS5jdXJyZW50UGFnZSArIDM7IGkrKykge1xyXG4gICAgICAgICAgICAgIGNyZWF0ZUNvbnRlbnQoaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY3JlYXRlTmV4dChwYWdlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwYWdlLmN1cnJlbnRQYWdlIDw9IHBhZ2UudG90YWxQYWdlcyAtIDIpIHtcclxuICAgICAgICAgICAgICBjcmVhdGVQcmUocGFnZSk7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHBhZ2UuY3VycmVudFBhZ2UgLSAxOyBpIDw9IHBhZ2UuY3VycmVudFBhZ2UgKyAxOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZUNvbnRlbnQoaSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGNyZWF0ZU5leHQocGFnZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaWYgKHBhZ2UuY3VycmVudFBhZ2UgPD0gcGFnZS50b3RhbFBhZ2VzKSB7XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVQcmUocGFnZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gKHBhZ2UudG90YWxQYWdlcykgLSAyOyBpIDw9IHBhZ2UudG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNyZWF0ZUNvbnRlbnQoaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOZXh0KHBhZ2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZVByZShwYWdlKSB7XHJcbiAgICAgICAgaWYgKHBhcnNlSW50KHBhZ2UuY3VycmVudFBhZ2UpID4gMSkge1xyXG4gICAgICAgICAgdmFyIHByZVBhZ2UgPSBwYXJzZUludChwYWdlLmN1cnJlbnRQYWdlKSAtIDE7XHJcbiAgICAgICAgICAkKCcjcGFnZXMnKS5hcHBlbmQoJzxsaSBjbGFzcz1wYWdlcy1saXN0ID4gPGEgY2xhc3M9cGFnZXMtbGluayBwYWdlPScgKyBwcmVQYWdlICsgJyBocmVmPWphdmFzY3JpcHQ6Oz4mbHNhcXVvOyZsc2FxdW87PC9hPiA8L2xpPicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZU5leHQocGFnZSkge1xyXG4gICAgICAgIGlmIChwYXJzZUludChwYWdlLmN1cnJlbnRQYWdlKSA8IHBhZ2UudG90YWxQYWdlcykge1xyXG4gICAgICAgICAgdmFyIG5leHRQYWdlID0gcGFyc2VJbnQocGFnZS5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAgICAgJChcIiNwYWdlc1wiKS5hcHBlbmQoJzxsaSBjbGFzcz1wYWdlcy1saXN0ID4gPGEgY2xhc3M9cGFnZXMtbGluayBwYWdlPScgKyBuZXh0UGFnZSArICcgaHJlZj1qYXZhc2NyaXB0Ojs+JnJzYXF1bzsmcnNhcXVvOzwvYT4gPC9saT4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBmdW5jdGlvbiBjcmVhdGVDb250ZW50KGkpIHtcclxuICAgICAgICB2YXIgaHRtbENvbiA9ICc8bGkgY2xhc3M9cGFnZXMtbGlzdCA+IDxhIGNsYXNzPVwiJyArICggdG9vbHMuYXJncy5jdXJyZW50UGFnZSA9PSBpID8gJ3BhZ2VzLWFjdGl2ZSBwYWdlcy1saW5rJyA6ICdwYWdlcy1saW5rJykgKyAnXCIgcGFnZT1cIicgKyBpICsgJ1wiIGhyZWY9amF2YXNjcmlwdDo7PicgKyBpICsgJzwvYT4gPC9saT4nO1xyXG4gICAgICAgICQoXCIjcGFnZXNcIikuYXBwZW5kKGh0bWxDb24pO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgZnVuY3Rpb24gY2hhbmdlUGFnZSgpIHtcclxuICAgICAgICBnZXRuZXdzTGlzdCh0b29scy5hcmdzLnRhYik7XHJcbiAgICAgIH07XHJcbiAgICAgICQoXCIubmV3cy10b3AgLm5ld3MtdGl0bGVcIikuY2xpY2soZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICAgdG9vbHMuYXJncy5jdXJyZW50UGFnZSA9IDE7XHJcbiAgICAgICAgdG9vbHMuYXJncy50YWIgPSAkKHRoaXMpLmF0dHIoXCJjYXRlZ29yeVwiKTtcclxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwibmV3cy10aXRsZS1hY3RpdmVcIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcIm5ld3MtdGl0bGUtYWN0aXZlXCIpO1xyXG4gICAgICAgICQoXCIjXCIgKyB0YWJBcnJbdG9vbHMuYXJncy50YWJdKS5zaG93KCkuc2libGluZ3MoXCIuY29udC1tZXNzYWdlXCIpLmhpZGUoKTtcclxuICAgICAgICBnZXRuZXdzTGlzdCh0b29scy5hcmdzLnRhYik7XHJcbiAgICAgIH0pO1xyXG4gICAgICAkKFwiLndyYXBcIikuZGVsZWdhdGUoJyNwYWdlcyBsaScsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0b29scy5hcmdzLmN1cnJlbnRQYWdlID0gcGFyc2VJbnQoJCh0aGlzKS5maW5kKFwiYVwiKS5hdHRyKFwicGFnZVwiKSk7XHJcbiAgICAgICAgY2hhbmdlUGFnZSgpO1xyXG4gICAgICB9KTtcclxuICAgICAgLypmdW5jdGlvbiBzaG93MSgpe1xyXG4gICAgICAgICQoJy5wYWdlcy1saW5rJykucmVtb3ZlQ2xhc3MoJ3BhZ2VzLWFjdGl2ZScpO1xyXG4gICAgICAgICQoJy5wYWdlcy1saW5rJykuZXEoY3VycmVudFBhZ2UpLmFkZENsYXNzKCdwYWdlcy1hY3RpdmUnKVxyXG4gICAgICB9OyovXHJcblxyXG4gICAgICAvL+WGheWuueWkmuWHuuaYvuekuumakOiXj1xyXG4gICAgICBmdW5jdGlvbiBoaWRlVGV4dChvYmosIGxvbmcpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIHN0ciA9ICcuLi4nO1xyXG4gICAgICAgICAgdmFyIGJlX3N0ciA9IG9iai5lcShpKS5odG1sKCk7XHJcbiAgICAgICAgICBiZV9zdHIgPSBiZV9zdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvLCAnJyk7XHJcbiAgICAgICAgICB2YXIgbmV3c3RyID0gJyc7XHJcblxyXG4gICAgICAgICAgaWYgKGJlX3N0ci5sZW5ndGggPiBsb25nKSB7XHJcbiAgICAgICAgICAgIG5ld3N0ciA9IGJlX3N0ci5zbGljZSgwLCBsb25nKSArIHN0cjtcclxuICAgICAgICAgICAgb2JqLmVxKGkpLmh0bWwobmV3c3RyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5YWs55So5rKh5pyJ5YaF5a655pa55rOVXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzaG93cHJvbXB0KCkge1xyXG4gICAgICAgIHJldHVybiBcIjxwIGlkPSduby1jb250ZW50Jz7msqHmnInmgqjmn6XnnIvnmoTlhoXlrrk8L3A+XCI7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgKTtcclxuXHJcblxyXG4gIC8qJChmdW5jdGlvbigpe1xyXG4gICAgICAvL+akpOWgleWEtOeAteiJsOWfhVxyXG5cclxuICAgICAgdmFyIGJlZ2luX2xlZnQgPSAwO1xyXG4gICAgICB2YXIgYmVnaW5fd2lkdGggPSBwYXJzZUZsb2F0KCQoJy5uYXYtbGlzdCcpLmVxKDEpLmNzcygnd2lkdGgnKSsxMCk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTsgaSsrKSB7XHJcbiAgICAgICAgICBiZWdpbl9sZWZ0ICs9IHBhcnNlRmxvYXQoJCgnLm5hdi1saXN0JykuZXEoaSkuY3NzKCd3aWR0aCcpKSsxMDtcclxuICAgICAgfVxyXG4gICAgICAkKCcubmF2LWxpbmUnKS5jc3MoJ2xlZnQnLGJlZ2luX2xlZnQpO1xyXG4gICAgICAkKCcubmF2LWxpbmUnKS5jc3MoJ3dpZHRoJyxiZWdpbl93aWR0aCk7XHJcblxyXG4gICAgICAkKCcubmF2LWxpc3QnKS5ob3ZlcihcclxuICAgICAgICAgIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgdmFyIGxpbmVfbGVmdCA9IDA7XHJcbiAgICAgICAgICAgICAgdmFyIGxpbmVfd2lkdGggPSBwYXJzZUZsb2F0KCQodGhpcykuY3NzKCd3aWR0aCcpKTsvL+a+tuaSruWEtOmQqOWLrearp+mRueaPkuews+mWru+/vVxyXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJCh0aGlzKS5pbmRleCgpIDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxpbmVfbGVmdCArPSBwYXJzZUZsb2F0KCQoJy5uYXYtbGlzdCcpLmVxKGkpLmNzcygnd2lkdGgnKSkrMTA7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICQoJy5uYXYtbGluZScpLmVxKDApLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aDpsaW5lX3dpZHRoLFxyXG4gICAgICAgICAgICAgICAgICBsZWZ0OmxpbmVfbGVmdFxyXG4gICAgICAgICAgICAgIH0sMjAwKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uKCl7fVxyXG4gICAgICAgKVxyXG4gICAgICAkKCcubmF2LWJveCcpLmhvdmVyKFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXt9LFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAkKCcubmF2LWxpbmUnKS5lcSgwKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgd2lkdGg6YmVnaW5fd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGxlZnQ6YmVnaW5fbGVmdFxyXG4gICAgICAgICAgICAgIH0sMjAwKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgKVxyXG5cclxuICAgICAgLy/pkbfugYjvv73mkLTml4LnjaXpjZnvv71cclxuICAgICAgZnVuY3Rpb24gd2luQ2hhbmdlKG1pbk51bSxvdXROVW0pe1xyXG4gICAgICAgICAgdmFyIGNvbnRIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSBvdXROVW07XHJcbiAgICAgICAgICBpZiggY29udEhlaWdodCA8IG1pbk51bSApe1xyXG4gICAgICAgICAgICAgIGNvbnRIZWlnaHQgPSBtaW5OdW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAkKCcubWVzc2FnZS1jb250ZW50JykuZ2V0KDApLnN0eWxlWydtaW4taGVpZ2h0J10gPSBjb250SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgfVxyXG4gICAgICB3aW5DaGFuZ2UoMjUwLDY1NCk7XHJcblxyXG4gICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgd2luQ2hhbmdlKCk7XHJcbiAgICAgIH0pXHJcblxyXG5cclxuXHJcbiAgICAgIC8v6Y+C5Ly05qSIIOmNnO+/veaQtOabouWEtOakpOeUuOa9sOmNkuWbqOW0slxyXG4gICAgICAkKCcucGFnZXMtbGluaycpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAkKCcucGFnZXMtbGluaycpLnJlbW92ZUNsYXNzKCdwYWdlcy1hY3RpdmUnKTtcclxuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3BhZ2VzLWFjdGl2ZScpO1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgdmFyIHN0ciA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICAgIGlmKHN0ci5zbGljZSg1KSA9PSAncmVzdWx0Jyl7XHJcbiAgICAgICAgICAkKCcuY29udC1tZXNzYWdlJykuaGlkZSgpO1xyXG4gICAgICAgICAgJCgnLm5ld3MtdGl0bGUnKS5yZW1vdmVDbGFzcygnbmV3cy10aXRsZS1hY3RpdmUnKTtcclxuICAgICAgICAgICQoJy5uZXdzLXRpdGxlJykuZXEoMSkuYWRkQ2xhc3MoJ25ld3MtdGl0bGUtYWN0aXZlJyk7XHJcbiAgICAgICAgICAkKCcuY29udC1tZXNzYWdlJykuZXEoMSkuc2hvdygpO1xyXG4gICAgICAgICAgZ2V0bmV3c0xpc3QoJ290aGVycycsJzMnLDEpXHJcbiAgICAgICAgICBnZXR0b3BsaXN0bmV3cygpO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgJCgnLm5ld3MtdGl0bGUnKS5jbGljayhmdW5jdGlvbigpe1xyXG4gICAgICAgICAgJCgnLmNvbnQtbWVzc2FnZScpLmhpZGUoKTtcclxuICAgICAgICAgICQoJy5uZXdzLXRpdGxlJykucmVtb3ZlQ2xhc3MoJ25ld3MtdGl0bGUtYWN0aXZlJyk7XHJcbiAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCduZXdzLXRpdGxlLWFjdGl2ZScpO1xyXG4gICAgICAgICAgJCgnLmNvbnQtbWVzc2FnZScpLmVxKCQodGhpcykuaW5kZXgoKSkuc2hvdygpO1xyXG4gICAgICB9KVxyXG4gICAgICBoaWRlVGV4dCgkKCcubmV3cy10ZXh0JyksMTEwKTtcclxuICB9KSovXHJcbn0pXHJcblxyXG5cclxuXHJcbiJdfQ==

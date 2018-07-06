'use strict';

require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf-541e3fb1ce.js',
    'paging': '../../lib/component/pagingSimple/paging-0d69ce3f70.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'template', 'service', 'footer', 'header', 'tool', 'paging'], function ($, template, service, footer, header, tools, Page) {
    getPicListNews();
    var tabArr = {
      "1": "edunews",
      "2": "result"
    };
    var pageSize = 20;

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
    getnewsList(tools.args.tab, tools.args.currentPage, false); //获取新闻/成果列表


    //翻页
    function renderPage(domId, total, category) {
      var p = new Page();
      p.init({
        target: '#' + domId,
        pagesize: pageSize,
        pageCount: 10,
        firstTplShow: true,
        firstTpl: "首页",
        lastTplShow: true,
        lastTpl: "末页",
        toolbar: true,
        count: total,
        callback: function callback(current) {
          $('.ui-select-pagesize').remove();
          getnewsList(category, current, true);

          $('.ui-paging-count').unbind();
          $('.ui-paging-toolbar').unbind();
        }
      });
    }

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
                $('#toplistnews').append('<li class="imp-list"><a class="imp-text" title="' + data.data[i].title + '" href="sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isComm=1">' + data.data[i].title + '</a></li>');
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
    function getnewsList(category, current, isPaging) {
      tools.args.tab = category;
      $.ajax({
        url: service.htmlHost + '/pf/api/news/getByPage',
        type: 'GET',
        data: {
          'page.pageSize': pageSize,
          'page.currentPage': current,
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
              htmlCon += '<li id="' + tabArr[tools.args.tab] + i + '" class="cont-list clearFix">' + '<div id="' + tabArr[tools.args.tab] + 'content' + i + '" class="content-right">' + '<h3 class="bg-circle"><a class="text-link" title="' + newlist[i].title + '" href="sitenewsDetail.html?id=' + newlist[i].id + '&index=' + (pageSize * (tools.args.currentPage - 1) + i) + '&category=' + category + '">' + newlist[i].title + '</a></h3>' + '<span class="news-text">' + newlist[i].orgId + '</span>' + '<span class="news-time">' + newlist[i].crtDttm.split(" ")[0] + '</span>' + '</div>' + '</li>';
            }
            $("#" + tabArr[tools.args.tab]).html(htmlCon);
            hideText($('.news-text'), 115);
            //$("#pages").empty();
            //var page = data.data.page;
            //page.totalPages = data.data.totalPages;
            //if (page.totalPages > 1) {
            //  createPage(page,data.data.totalPages);
            //}
            if (!isPaging) {
              $('#pages').html('');
            }
            if (data['data']['totalPages'] > 1 && !isPaging) {
              renderPage('pages', data['data']['totalCount'], category);
              $('.ui-select-pagesize').remove();
              $('.ui-paging-count').unbind();
              $('.ui-paging-toolbar').unbind();
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

    /**
     * 根据图片ID返回图片路径
     * @param id 图片ID
     * @returns {string} 图片路径
     */
    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    };

    //获取图片
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

    //分页
    //function createPage(page,countPages) {
    //  if (page.totalPages <= 10) {
    //    createPre(page);
    //    for (var i = 1; i <= page.totalPages; i++) {
    //      createContent(i);
    //    }
    //    //show1();
    //    createNext(page,countPages);
    //  } else {//1
    //    if (page.currentPage <= page.totalPages - 10) {
    //      createPre(page);
    //      for (var i = page.currentPage; i < page.currentPage + 10; i++) {
    //        createContent(i);
    //      }
    //      createNext(page,countPages);
    //    } else {//2
    //      if (page.currentPage >= page.totalPages - 10) {
    //        createPre(page);
    //        for (var i = page.totalPages - 9; i <= page.totalPages; i++) {
    //          createContent(i);
    //        }
    //        createNext(page,countPages);
    //      } else {//3
    //
    //      }//3
    //    }//2
    //  }//1
    //};

    //function createPre(page) {
    //  //if (parseInt(page.currentPage) > 1) {
    //    var prePage = parseInt(page.currentPage) - 1;
    //    $('#pages').append('<li class="pages-list pageone" > <a class=pages-link page=' + prePage + ' href=javascript:;>上一页</a> </li>');
    //  //}
    //};

    //function createNext(page,countPages) {
    //    var nextPage = parseInt(page.currentPage) + 1;
    //    $("#pages").append('<li class="pages-list pagelast"> <a data-count="'+ countPages +'" class=pages-link page=' + nextPage + ' href=javascript:;>下一页</a></li> <div class="go-page">转到<input type="text" class="page-target">页 <a data-count="'+ countPages +'" class="page-target-go" href="javascript:;">确定</a></div>');
    //  //}
    //};

    //function createContent(i) {
    //  var htmlCon = '<li class=pages-list > <a class="' + ( tools.args.currentPage == i ? 'pages-active pages-link' : 'pages-link') + '" page="' + i + '" href=javascript:;>' + i + '</a> </li>';
    //  $("#pages").append(htmlCon);
    //};

    //function changePage() {
    //  getnewsList(tools.args.tab, tools.args.currentPage);
    //};
    $(".news-top .news-title").click(function (ev) {
      tools.args.currentPage = 1;
      tools.args.tab = $(this).attr("category");
      $(this).addClass("news-title-active").siblings().removeClass("news-title-active");
      $("#" + tabArr[tools.args.tab]).show().siblings(".cont-message").hide();
      getnewsList(tools.args.tab, tools.args.currentPage, false);
    });
    //$(".wrap").delegate('#pages li', 'click', function () {
    //  tools.args.currentPage = parseInt($(this).find("a").attr("page"));
    //  var countP = parseInt($(this).find('a').attr('data-count')) + 1;
    //  if(tools.args.currentPage == countP){
    //    layer.alert('最后一页',{icon:0});
    //    return;
    //  }
    //  changePage();
    //});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ld3MvanMvbmV3c0xpc3QuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInRlbXBsYXRlIiwic2VydmljZSIsImZvb3RlciIsImhlYWRlciIsInRvb2xzIiwiUGFnZSIsImdldFBpY0xpc3ROZXdzIiwidGFiQXJyIiwicGFnZVNpemUiLCJhcmdzIiwidGFiIiwic2hvdyIsInNpYmxpbmdzIiwiaGlkZSIsImN1cnJlbnRQYWdlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImdldHRvcGxpc3RuZXdzIiwiZ2V0bmV3c0xpc3QiLCJyZW5kZXJQYWdlIiwiZG9tSWQiLCJ0b3RhbCIsImNhdGVnb3J5IiwicCIsImluaXQiLCJ0YXJnZXQiLCJwYWdlc2l6ZSIsInBhZ2VDb3VudCIsImZpcnN0VHBsU2hvdyIsImZpcnN0VHBsIiwibGFzdFRwbFNob3ciLCJsYXN0VHBsIiwidG9vbGJhciIsImNvdW50IiwiY2FsbGJhY2siLCJjdXJyZW50IiwicmVtb3ZlIiwidW5iaW5kIiwiYWpheCIsInVybCIsImh0bWxIb3N0IiwidHlwZSIsInN1Y2Nlc3MiLCJkYXRhIiwiY29kZSIsImVtcHR5IiwibGVuZ3RoIiwiaSIsImFwcGVuZCIsInRpdGxlIiwiaWQiLCJoaWRlVGV4dCIsImh0bWwiLCJzaG93cHJvbXB0IiwibGF5ZXIiLCJhbGVydCIsImljb24iLCJlcnJvciIsImlzUGFnaW5nIiwibmV3bGlzdCIsImRhdGFsaXN0IiwiaHRtbENvbiIsIm9yZ0lkIiwiY3J0RHR0bSIsInNwbGl0IiwiZ2V0UGljUGF0aCIsInBhdGhfdXJsIiwic3Vic3RyaW5nIiwicmVwbGFjZSIsInByZWZpeCIsInJlcGxhY2VXaXRoIiwiaW1nIiwiY2xpY2siLCJldiIsImF0dHIiLCJvYmoiLCJsb25nIiwic3RyIiwiYmVfc3RyIiwiZXEiLCJuZXdzdHIiLCJzbGljZSJdLCJtYXBwaW5ncyI6Ijs7QUFB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IjoibmV3cy9qcy9uZXdzTGlzdC1jMGZlZjI1NjVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZS5jb25maWcoe1xyXG4gIGJhc2VVcmw6ICcuLi8nLFxyXG4gIHBhdGhzOiB7XHJcbiAgICAncGxhdGZvcm1Db25mJzogJ3B1YmxpYy9qcy9wbGF0Zm9ybUNvbmYuanMnLFxyXG4gICAgJ3BhZ2luZyc6ICcuLi8uLi9saWIvY29tcG9uZW50L3BhZ2luZ1NpbXBsZS9wYWdpbmcuanMnXHJcbiAgfVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICAvLyBjb25maWdwYXRocy5wYXRocy5kaWFsb2cgPSBcIm15c3BhY2UvanMvYXBwRGlhbG9nLmpzXCI7XHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG5cclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ3RlbXBsYXRlJywgJ3NlcnZpY2UnLCAnZm9vdGVyJywgJ2hlYWRlcicsICd0b29sJywncGFnaW5nJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgdGVtcGxhdGUsIHNlcnZpY2UsIGZvb3RlciwgaGVhZGVyLCB0b29scywgUGFnZSkge1xyXG4gICAgICBnZXRQaWNMaXN0TmV3cygpO1xyXG4gICAgICB2YXIgdGFiQXJyID0ge1xyXG4gICAgICAgIFwiMVwiOiBcImVkdW5ld3NcIixcclxuICAgICAgICBcIjJcIjogXCJyZXN1bHRcIlxyXG4gICAgICB9O1xyXG4gICAgICB2YXIgcGFnZVNpemUgPSAyMDtcclxuXHJcbiAgICAgICQoXCIjXCIgKyB0YWJBcnJbdG9vbHMuYXJncy50YWJdKS5zaG93KCkuc2libGluZ3MoXCIuY29udC1tZXNzYWdlXCIpLmhpZGUoKTtcclxuICAgICAgaWYgKHRvb2xzLmFyZ3MudGFiID09IG51bGwpIHtcclxuICAgICAgICB0b29scy5hcmdzLnRhYiA9ICcxJztcclxuICAgICAgfVxyXG4gICAgICA7XHJcbiAgICAgIGlmICh0b29scy5hcmdzLmN1cnJlbnRQYWdlID09IG51bGwpIHtcclxuICAgICAgICB0b29scy5hcmdzLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgfVxyXG4gICAgICA7XHJcbiAgICAgIGlmICh0b29scy5hcmdzLnRhYiA9PSBcIjFcIikge1xyXG4gICAgICAgICQoXCIjbmV3c3RhYlwiKS5hZGRDbGFzcyhcIm5ld3MtdGl0bGUtYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJuZXdzLXRpdGxlLWFjdGl2ZVwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKFwiI25ld3N0YWJcIikucmVtb3ZlQ2xhc3MoXCJuZXdzLXRpdGxlLWFjdGl2ZVwiKS5zaWJsaW5ncygpLmFkZENsYXNzKFwibmV3cy10aXRsZS1hY3RpdmVcIik7XHJcbiAgICAgIH1cclxuICAgICAgZ2V0dG9wbGlzdG5ld3MoKTsvL+aOqOiNkOaWsOmXu1xyXG4gICAgICBnZXRuZXdzTGlzdCh0b29scy5hcmdzLnRhYiwgdG9vbHMuYXJncy5jdXJyZW50UGFnZSwgZmFsc2UpOy8v6I635Y+W5paw6Ze7L+aIkOaenOWIl+ihqFxyXG5cclxuXHJcbiAgICAgIC8v57+76aG1XHJcbiAgICAgIGZ1bmN0aW9uIHJlbmRlclBhZ2UoZG9tSWQsIHRvdGFsLCBjYXRlZ29yeSkge1xyXG4gICAgICAgIHZhciBwID0gbmV3IFBhZ2UoKTtcclxuICAgICAgICBwLmluaXQoe1xyXG4gICAgICAgICAgdGFyZ2V0OiAnIycgKyBkb21JZCxcclxuICAgICAgICAgIHBhZ2VzaXplOiBwYWdlU2l6ZSxcclxuICAgICAgICAgIHBhZ2VDb3VudDogMTAsXHJcbiAgICAgICAgICBmaXJzdFRwbFNob3c6IHRydWUsXHJcbiAgICAgICAgICBmaXJzdFRwbDogXCLpppbpobVcIixcclxuICAgICAgICAgIGxhc3RUcGxTaG93OiB0cnVlLFxyXG4gICAgICAgICAgbGFzdFRwbDogXCLmnKvpobVcIixcclxuICAgICAgICAgIHRvb2xiYXI6IHRydWUsXHJcbiAgICAgICAgICBjb3VudDogdG90YWwsXHJcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgJCgnLnVpLXNlbGVjdC1wYWdlc2l6ZScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBnZXRuZXdzTGlzdChjYXRlZ29yeSwgY3VycmVudCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAkKCcudWktcGFnaW5nLWNvdW50JykudW5iaW5kKCk7XHJcbiAgICAgICAgICAgICQoJy51aS1wYWdpbmctdG9vbGJhcicpLnVuYmluZCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgLy/mjqjojZDmlrDpl7tcclxuICAgICAgZnVuY3Rpb24gZ2V0dG9wbGlzdG5ld3MoKSB7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL25ld3MvZ2V0TGltaXQ/bGltaXQ9NiZpc0NvbW09MSZjYXRlZ29yeT0xJyxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgJCgnI3RvcGxpc3RuZXdzJykuZW1wdHkoKTtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAkKCcjdG9wbGlzdG5ld3MnKS5hcHBlbmQoJzxsaSBjbGFzcz1cImltcC1saXN0XCI+PGEgY2xhc3M9XCJpbXAtdGV4dFwiIHRpdGxlPVwiJyArIGRhdGEuZGF0YVtpXS50aXRsZSArICdcIiBocmVmPVwic2l0ZW5ld3NEZXRhaWwuaHRtbD9pZD0nICsgZGF0YS5kYXRhW2ldLmlkICsgJyZpbmRleD0nICsgaSArICcmY2F0ZWdvcnk9MSZpc0NvbW09MVwiPicgKyBkYXRhLmRhdGFbaV0udGl0bGUgKyAnPC9hPjwvbGk+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoaWRlVGV4dCgkKCcuaW1wLXRleHQnKSwgMTgpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKCcjdG9wbGlzdG5ld3MnKS5odG1sKHNob3dwcm9tcHQoKSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5o6o6I2Q5paw6Ze75byC5bi4XCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bmjqjojZDmlrDpl7vlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8v6I635Y+W5paw6Ze7L+aIkOaenOWIl+ihqFxyXG4gICAgICBmdW5jdGlvbiBnZXRuZXdzTGlzdChjYXRlZ29yeSxjdXJyZW50LGlzUGFnaW5nKSB7XHJcbiAgICAgICAgdG9vbHMuYXJncy50YWIgPSBjYXRlZ29yeTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvbmV3cy9nZXRCeVBhZ2UnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICdwYWdlLnBhZ2VTaXplJzogcGFnZVNpemUsXHJcbiAgICAgICAgICAgICdwYWdlLmN1cnJlbnRQYWdlJzogY3VycmVudCxcclxuICAgICAgICAgICAgJ2NhdGVnb3J5JzogdG9vbHMuYXJncy50YWJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgbmV3bGlzdCA9IGRhdGEuZGF0YS5kYXRhbGlzdDtcclxuICAgICAgICAgICAgICBpZiAobmV3bGlzdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZHVuZXdzXCIpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3Jlc3VsdFwiKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNwYWdlc1wiKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNlZHVuZXdzXCIpLmFwcGVuZChcIjxwIGlkPSduby1jb250ZW50Jz7msqHmnInmgqjmn6XnnIvnmoTlhoXlrrk8L3A+XCIpO1xyXG4gICAgICAgICAgICAgICAgJChcIiNyZXN1bHRcIikuYXBwZW5kKFwiPHAgaWQ9J25vLWNvbnRlbnQnPuayoeacieaCqOafpeeci+eahOWGheWuuTwvcD5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHZhciBodG1sQ29uID0gJyc7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBodG1sQ29uICs9XHJcbiAgICAgICAgICAgICAgICAgICc8bGkgaWQ9XCInICsgdGFiQXJyW3Rvb2xzLmFyZ3MudGFiXSArIGkgKyAnXCIgY2xhc3M9XCJjb250LWxpc3QgY2xlYXJGaXhcIj4nICtcclxuICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCInICsgdGFiQXJyW3Rvb2xzLmFyZ3MudGFiXSArICdjb250ZW50JyArIGkgKyAnXCIgY2xhc3M9XCJjb250ZW50LXJpZ2h0XCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICc8aDMgY2xhc3M9XCJiZy1jaXJjbGVcIj48YSBjbGFzcz1cInRleHQtbGlua1wiIHRpdGxlPVwiJyArIG5ld2xpc3RbaV0udGl0bGUgKyAnXCIgaHJlZj1cInNpdGVuZXdzRGV0YWlsLmh0bWw/aWQ9JyArIG5ld2xpc3RbaV0uaWQgKyAnJmluZGV4PScgKyAocGFnZVNpemUgKiAodG9vbHMuYXJncy5jdXJyZW50UGFnZSAtIDEpICsgaSkgKyAnJmNhdGVnb3J5PScgKyBjYXRlZ29yeSArICdcIj4nICsgbmV3bGlzdFtpXS50aXRsZSArICc8L2E+PC9oMz4nICtcclxuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwibmV3cy10ZXh0XCI+JytuZXdsaXN0W2ldLm9yZ0lkKyc8L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cIm5ld3MtdGltZVwiPicgKyBuZXdsaXN0W2ldLmNydER0dG0uc3BsaXQoXCIgXCIpWzBdICsgJzwvc3Bhbj4nICtcclxuICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgICAnPC9saT4nO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAkKFwiI1wiICsgdGFiQXJyW3Rvb2xzLmFyZ3MudGFiXSkuaHRtbChodG1sQ29uKTtcclxuICAgICAgICAgICAgICBoaWRlVGV4dCgkKCcubmV3cy10ZXh0JyksIDExNSk7XHJcbiAgICAgICAgICAgICAgLy8kKFwiI3BhZ2VzXCIpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgLy92YXIgcGFnZSA9IGRhdGEuZGF0YS5wYWdlO1xyXG4gICAgICAgICAgICAgIC8vcGFnZS50b3RhbFBhZ2VzID0gZGF0YS5kYXRhLnRvdGFsUGFnZXM7XHJcbiAgICAgICAgICAgICAgLy9pZiAocGFnZS50b3RhbFBhZ2VzID4gMSkge1xyXG4gICAgICAgICAgICAgIC8vICBjcmVhdGVQYWdlKHBhZ2UsZGF0YS5kYXRhLnRvdGFsUGFnZXMpO1xyXG4gICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgIGlmICghaXNQYWdpbmcpIHtcclxuICAgICAgICAgICAgICAgICQoJyNwYWdlcycpLmh0bWwoJycpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAoZGF0YVsnZGF0YSddWyd0b3RhbFBhZ2VzJ10gPiAxICAmJiAhaXNQYWdpbmcpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlclBhZ2UoJ3BhZ2VzJywgZGF0YVsnZGF0YSddWyd0b3RhbENvdW50J10sIGNhdGVnb3J5KTtcclxuICAgICAgICAgICAgICAgICQoJy51aS1zZWxlY3QtcGFnZXNpemUnKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICQoJy51aS1wYWdpbmctY291bnQnKS51bmJpbmQoKTtcclxuICAgICAgICAgICAgICAgICQoJy51aS1wYWdpbmctdG9vbGJhcicpLnVuYmluZCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsYXllci5hbGVydChcIuiOt+WPluaOqOiNkOaWsOmXu+W8guW4uOOAglwiLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5o6o6I2Q5paw6Ze75byC5bi444CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICAgIFxyXG4gICAgICAvKipcclxuICAgICAgICog5qC55o2u5Zu+54mHSUTov5Tlm57lm77niYfot6/lvoRcclxuICAgICAgICogQHBhcmFtIGlkIOWbvueJh0lEXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IOWbvueJh+i3r+W+hFxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gZ2V0UGljUGF0aChpZCkge1xyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5zdWJzdHJpbmcoMCwgNCkgPT09ICdodHRwJyA/IHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkgOiAoc2VydmljZS5wcmVmaXggKyBzZXJ2aWNlLnBhdGhfdXJsWydkb3dubG9hZF91cmwnXS5yZXBsYWNlKCcjcmVzaWQjJywgaWQpKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8v6I635Y+W5Zu+54mHXHJcbiAgICAgIGZ1bmN0aW9uIGdldFBpY0xpc3ROZXdzKCl7XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL25ld3MvZ2V0TGltaXQ/JmxpbWl0PTQmY2F0ZWdvcnk9MSZpc0ltZz0xJyArICh0b29scy5hcmdzLm9yZ0lkID8gJyZvcmdJZD0nICsgdG9vbHMuYXJncy5vcmdJZCA6ICcnKSxcclxuICAgICAgICAgIHR5cGU6ICdHRVQnLFxyXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgJCgnI3BpYy1uZXdzJykucmVwbGFjZVdpdGgoJzxwIHN0eWxlPVwibGluZS1oZWlnaHQ6MzJweDttYXJnaW4tbGVmdDoxNXB4XCI+5pqC5peg5pWw5o2uLi4uPC9wPicpXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoJyNwaWMtbmV3cycpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdXJsID0gJ3NpdGVuZXdzRGV0YWlsLmh0bWw/aWQ9JyArIGRhdGEuZGF0YVtpXS5pZCArICcmaW5kZXg9JyArIGkgKyAnJmNhdGVnb3J5PTEmaXNJbWc9MScgKyAodG9vbHMuYXJncy5vcmdJZCA/ICcmb3JnSWQ9JyArIHRvb2xzLmFyZ3Mub3JnSWQgOiAnJyk7XHJcbiAgICAgICAgICAgICAgICAgICQoJyNwaWMtbmV3cycpLmFwcGVuZChcclxuICAgICAgICAgICAgICAgICAgICAnPGxpIGNsYXNzPVwicGljLWxpc3RcIiA+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9JyArIHVybCArICc+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiJyArIGdldFBpY1BhdGgoZGF0YS5kYXRhW2ldLmltZykgKyAnXCIgYWx0PVwiXCIgIG9uZXJyb3I9XCJ0aGlzLnNyYz1cXCcuLi9ob21lL2ltYWdlcy9iZy1uby5wbmdcXCdcIiA+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvYT4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPHAgdGl0bGU9XCInICsgZGF0YS5kYXRhW2ldLnRpdGxlICsgJ1xcXCIgY2xhc3M9XCJzdXNwZW5kXCIgIG9uY2xpY2s9XCJsb2NhdGlvbi5ocmVmID1cXCcnICsgdXJsICsgJ1xcJ1wiPicgKyBkYXRhLmRhdGFbaV0udGl0bGUgKyAnPC9wPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2xpPidcclxuICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhpZGVUZXh0KCQoJy5pbXAtbWVzc2FnZSAuaW1wLXRleHQnKSwgMjApO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhbGVydChcIuiOt+WPluaOqOiNkOaWsOmXu+W8guW4uFwiKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvL+WIhumhtVxyXG4gICAgICAvL2Z1bmN0aW9uIGNyZWF0ZVBhZ2UocGFnZSxjb3VudFBhZ2VzKSB7XHJcbiAgICAgIC8vICBpZiAocGFnZS50b3RhbFBhZ2VzIDw9IDEwKSB7XHJcbiAgICAgIC8vICAgIGNyZWF0ZVByZShwYWdlKTtcclxuICAgICAgLy8gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gcGFnZS50b3RhbFBhZ2VzOyBpKyspIHtcclxuICAgICAgLy8gICAgICBjcmVhdGVDb250ZW50KGkpO1xyXG4gICAgICAvLyAgICB9XHJcbiAgICAgIC8vICAgIC8vc2hvdzEoKTtcclxuICAgICAgLy8gICAgY3JlYXRlTmV4dChwYWdlLGNvdW50UGFnZXMpO1xyXG4gICAgICAvLyAgfSBlbHNlIHsvLzFcclxuICAgICAgLy8gICAgaWYgKHBhZ2UuY3VycmVudFBhZ2UgPD0gcGFnZS50b3RhbFBhZ2VzIC0gMTApIHtcclxuICAgICAgLy8gICAgICBjcmVhdGVQcmUocGFnZSk7XHJcbiAgICAgIC8vICAgICAgZm9yICh2YXIgaSA9IHBhZ2UuY3VycmVudFBhZ2U7IGkgPCBwYWdlLmN1cnJlbnRQYWdlICsgMTA7IGkrKykge1xyXG4gICAgICAvLyAgICAgICAgY3JlYXRlQ29udGVudChpKTtcclxuICAgICAgLy8gICAgICB9XHJcbiAgICAgIC8vICAgICAgY3JlYXRlTmV4dChwYWdlLGNvdW50UGFnZXMpO1xyXG4gICAgICAvLyAgICB9IGVsc2Ugey8vMlxyXG4gICAgICAvLyAgICAgIGlmIChwYWdlLmN1cnJlbnRQYWdlID49IHBhZ2UudG90YWxQYWdlcyAtIDEwKSB7XHJcbiAgICAgIC8vICAgICAgICBjcmVhdGVQcmUocGFnZSk7XHJcbiAgICAgIC8vICAgICAgICBmb3IgKHZhciBpID0gcGFnZS50b3RhbFBhZ2VzIC0gOTsgaSA8PSBwYWdlLnRvdGFsUGFnZXM7IGkrKykge1xyXG4gICAgICAvLyAgICAgICAgICBjcmVhdGVDb250ZW50KGkpO1xyXG4gICAgICAvLyAgICAgICAgfVxyXG4gICAgICAvLyAgICAgICAgY3JlYXRlTmV4dChwYWdlLGNvdW50UGFnZXMpO1xyXG4gICAgICAvLyAgICAgIH0gZWxzZSB7Ly8zXHJcbiAgICAgIC8vXHJcbiAgICAgIC8vICAgICAgfS8vM1xyXG4gICAgICAvLyAgICB9Ly8yXHJcbiAgICAgIC8vICB9Ly8xXHJcbiAgICAgIC8vfTtcclxuXHJcbiAgICAgIC8vZnVuY3Rpb24gY3JlYXRlUHJlKHBhZ2UpIHtcclxuICAgICAgLy8gIC8vaWYgKHBhcnNlSW50KHBhZ2UuY3VycmVudFBhZ2UpID4gMSkge1xyXG4gICAgICAvLyAgICB2YXIgcHJlUGFnZSA9IHBhcnNlSW50KHBhZ2UuY3VycmVudFBhZ2UpIC0gMTtcclxuICAgICAgLy8gICAgJCgnI3BhZ2VzJykuYXBwZW5kKCc8bGkgY2xhc3M9XCJwYWdlcy1saXN0IHBhZ2VvbmVcIiA+IDxhIGNsYXNzPXBhZ2VzLWxpbmsgcGFnZT0nICsgcHJlUGFnZSArICcgaHJlZj1qYXZhc2NyaXB0Ojs+5LiK5LiA6aG1PC9hPiA8L2xpPicpO1xyXG4gICAgICAvLyAgLy99XHJcbiAgICAgIC8vfTtcclxuXHJcbiAgICAgIC8vZnVuY3Rpb24gY3JlYXRlTmV4dChwYWdlLGNvdW50UGFnZXMpIHtcclxuICAgICAgLy8gICAgdmFyIG5leHRQYWdlID0gcGFyc2VJbnQocGFnZS5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAvLyAgICAkKFwiI3BhZ2VzXCIpLmFwcGVuZCgnPGxpIGNsYXNzPVwicGFnZXMtbGlzdCBwYWdlbGFzdFwiPiA8YSBkYXRhLWNvdW50PVwiJysgY291bnRQYWdlcyArJ1wiIGNsYXNzPXBhZ2VzLWxpbmsgcGFnZT0nICsgbmV4dFBhZ2UgKyAnIGhyZWY9amF2YXNjcmlwdDo7PuS4i+S4gOmhtTwvYT48L2xpPiA8ZGl2IGNsYXNzPVwiZ28tcGFnZVwiPui9rOWIsDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwicGFnZS10YXJnZXRcIj7pobUgPGEgZGF0YS1jb3VudD1cIicrIGNvdW50UGFnZXMgKydcIiBjbGFzcz1cInBhZ2UtdGFyZ2V0LWdvXCIgaHJlZj1cImphdmFzY3JpcHQ6O1wiPuehruWumjwvYT48L2Rpdj4nKTtcclxuICAgICAgLy8gIC8vfVxyXG4gICAgICAvL307XHJcblxyXG4gICAgICAvL2Z1bmN0aW9uIGNyZWF0ZUNvbnRlbnQoaSkge1xyXG4gICAgICAvLyAgdmFyIGh0bWxDb24gPSAnPGxpIGNsYXNzPXBhZ2VzLWxpc3QgPiA8YSBjbGFzcz1cIicgKyAoIHRvb2xzLmFyZ3MuY3VycmVudFBhZ2UgPT0gaSA/ICdwYWdlcy1hY3RpdmUgcGFnZXMtbGluaycgOiAncGFnZXMtbGluaycpICsgJ1wiIHBhZ2U9XCInICsgaSArICdcIiBocmVmPWphdmFzY3JpcHQ6Oz4nICsgaSArICc8L2E+IDwvbGk+JztcclxuICAgICAgLy8gICQoXCIjcGFnZXNcIikuYXBwZW5kKGh0bWxDb24pO1xyXG4gICAgICAvL307XHJcblxyXG4gICAgICAvL2Z1bmN0aW9uIGNoYW5nZVBhZ2UoKSB7XHJcbiAgICAgIC8vICBnZXRuZXdzTGlzdCh0b29scy5hcmdzLnRhYiwgdG9vbHMuYXJncy5jdXJyZW50UGFnZSk7XHJcbiAgICAgIC8vfTtcclxuICAgICAgJChcIi5uZXdzLXRvcCAubmV3cy10aXRsZVwiKS5jbGljayhmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICB0b29scy5hcmdzLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICB0b29scy5hcmdzLnRhYiA9ICQodGhpcykuYXR0cihcImNhdGVnb3J5XCIpO1xyXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJuZXdzLXRpdGxlLWFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwibmV3cy10aXRsZS1hY3RpdmVcIik7XHJcbiAgICAgICAgJChcIiNcIiArIHRhYkFyclt0b29scy5hcmdzLnRhYl0pLnNob3coKS5zaWJsaW5ncyhcIi5jb250LW1lc3NhZ2VcIikuaGlkZSgpO1xyXG4gICAgICAgIGdldG5ld3NMaXN0KHRvb2xzLmFyZ3MudGFiLCB0b29scy5hcmdzLmN1cnJlbnRQYWdlLCBmYWxzZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyQoXCIud3JhcFwiKS5kZWxlZ2F0ZSgnI3BhZ2VzIGxpJywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyAgdG9vbHMuYXJncy5jdXJyZW50UGFnZSA9IHBhcnNlSW50KCQodGhpcykuZmluZChcImFcIikuYXR0cihcInBhZ2VcIikpO1xyXG4gICAgICAvLyAgdmFyIGNvdW50UCA9IHBhcnNlSW50KCQodGhpcykuZmluZCgnYScpLmF0dHIoJ2RhdGEtY291bnQnKSkgKyAxO1xyXG4gICAgICAvLyAgaWYodG9vbHMuYXJncy5jdXJyZW50UGFnZSA9PSBjb3VudFApe1xyXG4gICAgICAvLyAgICBsYXllci5hbGVydCgn5pyA5ZCO5LiA6aG1Jyx7aWNvbjowfSk7XHJcbiAgICAgIC8vICAgIHJldHVybjtcclxuICAgICAgLy8gIH1cclxuICAgICAgLy8gIGNoYW5nZVBhZ2UoKTtcclxuICAgICAgLy99KTtcclxuICAgICAgLypmdW5jdGlvbiBzaG93MSgpe1xyXG4gICAgICAgICQoJy5wYWdlcy1saW5rJykucmVtb3ZlQ2xhc3MoJ3BhZ2VzLWFjdGl2ZScpO1xyXG4gICAgICAgICQoJy5wYWdlcy1saW5rJykuZXEoY3VycmVudFBhZ2UpLmFkZENsYXNzKCdwYWdlcy1hY3RpdmUnKVxyXG4gICAgICB9OyovXHJcblxyXG4gICAgICAvL+WGheWuueWkmuWHuuaYvuekuumakOiXj1xyXG4gICAgICBmdW5jdGlvbiBoaWRlVGV4dChvYmosIGxvbmcpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgdmFyIHN0ciA9ICcuLi4nO1xyXG4gICAgICAgICAgdmFyIGJlX3N0ciA9IG9iai5lcShpKS5odG1sKCk7XHJcbiAgICAgICAgICBiZV9zdHIgPSBiZV9zdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvLCAnJyk7XHJcbiAgICAgICAgICB2YXIgbmV3c3RyID0gJyc7XHJcblxyXG4gICAgICAgICAgaWYgKGJlX3N0ci5sZW5ndGggPiBsb25nKSB7XHJcbiAgICAgICAgICAgIG5ld3N0ciA9IGJlX3N0ci5zbGljZSgwLCBsb25nKSArIHN0cjtcclxuICAgICAgICAgICAgb2JqLmVxKGkpLmh0bWwobmV3c3RyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5YWs55So5rKh5pyJ5YaF5a655pa55rOVXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzaG93cHJvbXB0KCkge1xyXG4gICAgICAgIHJldHVybiBcIjxwIGlkPSduby1jb250ZW50Jz7msqHmnInmgqjmn6XnnIvnmoTlhoXlrrk8L3A+XCI7XHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgIH1cclxuICApO1xyXG5cclxuXHJcbiAgLyokKGZ1bmN0aW9uKCl7XHJcbiAgICAgIC8v5qSk5aCV5YS054C16Imw5Z+FXHJcblxyXG4gICAgICB2YXIgYmVnaW5fbGVmdCA9IDA7XHJcbiAgICAgIHZhciBiZWdpbl93aWR0aCA9IHBhcnNlRmxvYXQoJCgnLm5hdi1saXN0JykuZXEoMSkuY3NzKCd3aWR0aCcpKzEwKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxOyBpKyspIHtcclxuICAgICAgICAgIGJlZ2luX2xlZnQgKz0gcGFyc2VGbG9hdCgkKCcubmF2LWxpc3QnKS5lcShpKS5jc3MoJ3dpZHRoJykpKzEwO1xyXG4gICAgICB9XHJcbiAgICAgICQoJy5uYXYtbGluZScpLmNzcygnbGVmdCcsYmVnaW5fbGVmdCk7XHJcbiAgICAgICQoJy5uYXYtbGluZScpLmNzcygnd2lkdGgnLGJlZ2luX3dpZHRoKTtcclxuXHJcbiAgICAgICQoJy5uYXYtbGlzdCcpLmhvdmVyKFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICB2YXIgbGluZV9sZWZ0ID0gMDtcclxuICAgICAgICAgICAgICB2YXIgbGluZV93aWR0aCA9IHBhcnNlRmxvYXQoJCh0aGlzKS5jc3MoJ3dpZHRoJykpOy8v5r625pKu5YS06ZCo5Yut5qun6ZG55o+S57Cz6Zau77+9XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkKHRoaXMpLmluZGV4KCkgOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgbGluZV9sZWZ0ICs9IHBhcnNlRmxvYXQoJCgnLm5hdi1saXN0JykuZXEoaSkuY3NzKCd3aWR0aCcpKSsxMDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJCgnLm5hdi1saW5lJykuZXEoMCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoOmxpbmVfd2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgIGxlZnQ6bGluZV9sZWZ0XHJcbiAgICAgICAgICAgICAgfSwyMDApXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZnVuY3Rpb24oKXt9XHJcbiAgICAgICApXHJcbiAgICAgICQoJy5uYXYtYm94JykuaG92ZXIoXHJcbiAgICAgICAgICBmdW5jdGlvbigpe30sXHJcbiAgICAgICAgICBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICQoJy5uYXYtbGluZScpLmVxKDApLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aDpiZWdpbl93aWR0aCxcclxuICAgICAgICAgICAgICAgICAgbGVmdDpiZWdpbl9sZWZ0XHJcbiAgICAgICAgICAgICAgfSwyMDApXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICApXHJcblxyXG4gICAgICAvL+mRt+6BiO+/veaQtOaXgueNpemNme+/vVxyXG4gICAgICBmdW5jdGlvbiB3aW5DaGFuZ2UobWluTnVtLG91dE5VbSl7XHJcbiAgIHZhciBjb250SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gb3V0TlVtO1xyXG4gICBpZiggY29udEhlaWdodCA8IG1pbk51bSApe1xyXG4gICBjb250SGVpZ2h0ID0gbWluTnVtO1xyXG4gICB9XHJcbiAgICQoJy5tZXNzYWdlLWNvbnRlbnQnKS5nZXQoMCkuc3R5bGVbJ21pbi1oZWlnaHQnXSA9IGNvbnRIZWlnaHQgKyAncHgnO1xyXG4gICB9XHJcbiAgICAgIHdpbkNoYW5nZSgyNTAsNjU0KTtcclxuXHJcbiAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB3aW5DaGFuZ2UoKTtcclxuICAgICAgfSlcclxuXHJcblxyXG5cclxuICAgICAgLy/pj4LkvLTmpIgg6Y2c77+95pC05pui5YS05qSk55S45r2w6Y2S5Zuo5bSyXHJcbiAgICAgICQoJy5wYWdlcy1saW5rJykuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAgICQoJy5wYWdlcy1saW5rJykucmVtb3ZlQ2xhc3MoJ3BhZ2VzLWFjdGl2ZScpO1xyXG4gICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygncGFnZXMtYWN0aXZlJyk7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICB2YXIgc3RyID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcclxuICAgICAgaWYoc3RyLnNsaWNlKDUpID09ICdyZXN1bHQnKXtcclxuICAgICAgICAgICQoJy5jb250LW1lc3NhZ2UnKS5oaWRlKCk7XHJcbiAgICAgICAgICAkKCcubmV3cy10aXRsZScpLnJlbW92ZUNsYXNzKCduZXdzLXRpdGxlLWFjdGl2ZScpO1xyXG4gICAgICAgICAgJCgnLm5ld3MtdGl0bGUnKS5lcSgxKS5hZGRDbGFzcygnbmV3cy10aXRsZS1hY3RpdmUnKTtcclxuICAgICAgICAgICQoJy5jb250LW1lc3NhZ2UnKS5lcSgxKS5zaG93KCk7XHJcbiAgICAgICAgICBnZXRuZXdzTGlzdCgnb3RoZXJzJywnMycsMSlcclxuICAgICAgICAgIGdldHRvcGxpc3RuZXdzKCk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAkKCcubmV3cy10aXRsZScpLmNsaWNrKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAkKCcuY29udC1tZXNzYWdlJykuaGlkZSgpO1xyXG4gICAgICAgICAgJCgnLm5ld3MtdGl0bGUnKS5yZW1vdmVDbGFzcygnbmV3cy10aXRsZS1hY3RpdmUnKTtcclxuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ25ld3MtdGl0bGUtYWN0aXZlJyk7XHJcbiAgICAgICAgICAkKCcuY29udC1tZXNzYWdlJykuZXEoJCh0aGlzKS5pbmRleCgpKS5zaG93KCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIGhpZGVUZXh0KCQoJy5uZXdzLXRleHQnKSwxMTApO1xyXG4gIH0pKi9cclxufSlcclxuXHJcblxyXG5cclxuXHJcblxyXG4iXX0=

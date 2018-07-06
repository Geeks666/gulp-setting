require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js',
    'paging': '../../lib/component/pagingSimple/paging.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);

  define('', ['jquery', 'template', 'service', 'footer', 'header', 'tool','paging'],
    function ($, template, service, footer, header, tools, Page) {
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
      gettoplistnews();//推荐新闻
      getnewsList(tools.args.tab, tools.args.currentPage, false);//获取新闻/成果列表


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
          callback: function (current) {
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
          success: function (data) {
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
              layer.alert("获取推荐新闻异常", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取推荐新闻异常。", {icon: 0});
          }
        });
      };

      //获取新闻/成果列表
      function getnewsList(category,current,isPaging) {
        tools.args.tab = category;
        $.ajax({
          url: service.htmlHost + '/pf/api/news/getByPage',
          type: 'GET',
          data: {
            'page.pageSize': pageSize,
            'page.currentPage': current,
            'category': tools.args.tab
          },
          success: function (data) {
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
                htmlCon +=
                  '<li id="' + tabArr[tools.args.tab] + i + '" class="cont-list clearFix">' +
                  '<div id="' + tabArr[tools.args.tab] + 'content' + i + '" class="content-right">' +
                  '<h3 class="bg-circle"><a class="text-link" title="' + newlist[i].title + '" href="sitenewsDetail.html?id=' + newlist[i].id + '&index=' + (pageSize * (tools.args.currentPage - 1) + i) + '&category=' + category + '">' + newlist[i].title + '</a></h3>' +
                  '<span class="news-text">'+newlist[i].orgId+'</span>' +
                  '<span class="news-time">' + newlist[i].crtDttm.split(" ")[0] + '</span>' +
                  '</div>' +
                  '</li>';
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
              if (data['data']['totalPages'] > 1  && !isPaging) {
                renderPage('pages', data['data']['totalCount'], category);
                $('.ui-select-pagesize').remove();
                $('.ui-paging-count').unbind();
                $('.ui-paging-toolbar').unbind();
              }
            } else {
              layer.alert("获取推荐新闻异常。", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取推荐新闻异常。", {icon: 0});
          }
        });
      };
      
      /**
       * 根据图片ID返回图片路径
       * @param id 图片ID
       * @returns {string} 图片路径
       */
      function getPicPath(id) {
        return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : (service.prefix + service.path_url['download_url'].replace('#resid#', id));
      };

      //获取图片
      function getPicListNews(){
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


    }
  );


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
})






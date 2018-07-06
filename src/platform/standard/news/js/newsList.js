require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {

  require.config(configpaths);

  define('',['jquery', 'template', 'service', 'footer', 'header', 'tool'],
    function ($, template, service, footer, header, tools) {
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
      gettoplistnews();//推荐新闻
      getnewsList(tools.args.tab);//获取新闻/成果列表

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
                  $('#toplistnews').append('<li class="imp-list"><a class="imp-text" href="sitenewsDetail.html?id=' + data.data[i].id + '&index=' + i + '&category=1&isComm=1">' + data.data[i].title + '</a></li>');
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
                  '<h3><a class="text-link" href="sitenewsDetail.html?id=' + newlist[i].id + '&index=' + (pageSize * (tools.args.currentPage - 1) + i) + '&category=' + category + '">' + newlist[i].title + '</a></h3>' +
                  '<p class="news-text">' + newlist[i].brief.replace(/<.*?>/g, "") + '</p>' +
                  '<span class="news-time">' + newlist[i].crtDttm.split(" ")[0] + '</span>' +
                  '</div>' +
                  '</li>';
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
              layer.alert("获取推荐新闻异常。", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取推荐新闻异常。", {icon: 0});
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
                for (var i = (page.totalPages) - 2; i <= page.totalPages; i++) {
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
        var htmlCon = '<li class=pages-list > <a class="' + ( tools.args.currentPage == i ? 'pages-active pages-link' : 'pages-link') + '" page="' + i + '" href=javascript:;>' + i + '</a> </li>';
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




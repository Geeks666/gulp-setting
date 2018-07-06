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
      var pageSize = 10;
      var pageNum = 0;
      if (!tools.args.currentPage) tools.args.currentPage = 1;
      getListByPage(pageSize);
      //重要公告
      $.ajax({
        url: service.htmlHost + '/pf/api/notice/getLimit?limit=6',
        type: 'GET',
        success: function (data) {
          if (data && data.code == "success") {
            $('#importnotice').empty();
            if (data.data && data.data.length > 0) {
              for (var i = 0; i < data.data.length; i++) {
                $('#importnotice').append('<li class="imp-list"><a class="imp-text" href="noticeDetail.html?id=' + data.data[i].id + '&index=' + i + '">' + data.data[i].title + '</a></li>');
              }
            } else {
              $('#importnotice').html("<p id='no-content'>没有您查看的内容</p>");
            }
          } else {
            layer.alert("获取重要公告异常。", {icon: 0});
          }
        },
        error: function (data) {
          layer.alert("获取重要公告异常。", {icon: 0});
        }
      });

      //公告列表
      function getListByPage(pageSize) {
        $.ajax({
          url: service.htmlHost + '/pf/api/notice/getByPage?page.pageSize=' + pageSize + '&page.currentPage=' + tools.args.currentPage,
          type: 'GET',
          success: function (data) {
            if (data && data.code == "success") {
              if (data.data.datalist.length > 0) {
                $('#noticelist').empty();
                //var page = data.page;
                for (var i = 0; i < data.data.datalist.length; i++) {
                  $('#noticelist').append('<li class="message-list clearFix"><a class="message-text message-title" href="noticeDetail.html?id=' + data.data.datalist[i].id + '&index=' + ((parseInt(data.data.currentPage) - 1) * pageSize + i) + '" >' + data.data.datalist[i].title + '</a><span class="message-text message-time">' + data.data.datalist[i].crtDttm.split(" ")[0] + '</span> </li>');
                }
                var page = data.data.page;
                page.totalPages = data.data.totalPages;
                if (page.totalPages > 1) {
                  createPage(data.data.page);
                }
              } else {
                $('#noticelist').html("<p id='no-content'>没有您查看的内容</p>");
              }
            } else {
              layer.alert("获取重要公告异常。", {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取重要公告异常。", {icon: 0});
          }
        });
      };

      //分页
      function createPage(page) {
        $('#pages').empty();
        if (page.totalPages <= 3) {
          createPre(page);
          for (var i = 1; i <= page.totalPages; i++) {
            createContent(i);
          }
          // show1();
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
          $('#pages').append('<li class=pages-list > <a id=' + prePage + ' page=' + prePage + ' class=pages-link href=javascript:;>&lsaquo;&lsaquo;</a> </li>');
        }
      };

      function createContent(i) {
        $("#pages").append('<li class=pages-list > <a id=' + i + ' page=' + i + ' class="' + ( tools.args.currentPage == i ? 'pages-active pages-link' : 'pages-link') + '" href=javascript:;>' + i + '</a> </li>');

      };

      function createNext(page) {
        if (parseInt(page.currentPage) < page.totalPages) {
          var nextPage = parseInt(page.currentPage) + 1;
          $("#pages").append('<li class=pages-list > <a id=' + nextPage + ' page=' + nextPage + ' class=pages-link href=javascript:;>&rsaquo;&rsaquo;</a> </li>');

        }
      };

      function changePage(page) {
        pageNum = page;
        getListByPage(page);
      };
      /*function show1(){
        $('.pages-link').removeClass('pages-active');
        $('.pages-link').eq(pageNum).addClass('pages-active')
      };*/
      $(".wrap").delegate('#pages li', 'click', function () {
        tools.args.currentPage = parseInt($(this).find("a").attr("page"));
        changePage(pageSize);
      });
      $(function () {
        $('.nav-line').hide();

        //鑷�搴旂獥鍙�
        function winChange(minNum, outNUm) {
          var contHeight = $(window).height() - outNUm;
          if (contHeight < minNum) {
            contHeight = minNum;
          }
          $('.message-content').get(0).style['min-height'] = contHeight + 'px';
        }

        winChange(400, 664);

        $(window).resize(function () {
          winChange();
        });

        //鍐呭澶氬嚭鏄剧ず闅愯棌
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

        /*$('.pages-link').click(function(){
          $('.pages-link').removeClass('pages-active');
          $(this).addClass('pages-active');
        })*/

      });
    }
  );
})
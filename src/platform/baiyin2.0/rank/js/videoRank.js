require.config({
  baseUrl: '../',
  paths: {
    'platformConf': 'public/js/platformConf.js'
  }
});
require(['platformConf'], function (configpaths) {
  // configpaths.paths.dialog = "myspace/js/appDialog.js";
  require.config(configpaths);
  define('', ['jquery', 'template', 'layer', 'page', 'service', 'tools', 'banner', 'textScroll', 'tab', 'ajaxBanner', 'secondNav', 'footer', 'header'],
    function ($, template, layer, Page, service, tools, banner, textScroll, tab, ajaxBanner, secondNav, footer, header) {
      var pageSize = 20;
      var currentPage = 1;

      videoUploadRank($(".content_table"), 'videoUploadRank', pageSize, currentPage);

      function videoUploadRank($obj, temId, pageSize, currentPage) {
        var $data = {
          'pageSize': pageSize,
          'currentPage': currentPage
        };
        $.ajax({
          url: service.htmlHost + '/pf/api/rank/video',
          type: 'GET',
          data: $data,
          success: function (data) {
            console.log(data);
            if (data && data.code == "success") {
              var html = "";
              if (data.data && data.data.datalist && data.data.datalist.length > 0) {
                html = template(temId, {
                  'data': data.data.datalist,
                  'currentPage': data.data.currentPage - 1,
                  'pageSize': data.data.pageSize
                });
                if (data.data.currentPage == 1) {
                  $("#pageTool").html("");
                  renderPage('pageTool', data.data.totalCount, data.data.pageSize, videoUploadRank, $obj, temId);
                }
              } else {
                html = showprompt();
              }
              $obj.html(html);
            } else {
              layer.alert(data.msg, {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取视频上传排行榜异常。", {icon: 0});
          }
        });
      };

      function getvideoHotRank($obj, temId, pageSize, currentPage, sort) {
        var $data = {
          'pageSize': pageSize,
          'currentPage': currentPage - 1,
          'sort': sort
        };
        $.ajax({
          url: service.htmlHost + '/pf/api/direct/ktsl_heatVideo',
          type: 'GET',
          data: $data,
          success: function (data) {
            if (data && data.status == "100000") {
              var html = "";
              if (data.result && data.result.data && data.result.data.length > 0) {
                html = template(temId, {
                  'data': data.result.data,
                  'currentPage': data.result.currentPage,
                  'pageSize': data.result.pageSize
                });
                if (data.result.currentPage == 0) {
                  $("#pageTool").html("");
                  renderPage('pageTool', data.result.totalCount, data.result.pageSize, getvideoHotRank, $obj, temId, sort);
                }
              } else {
                html = showprompt();
              }
              $obj.html(html);
            } else {
              layer.alert(data.msg, {icon: 0});
            }
          },
          error: function (data) {
            layer.alert("获取视频热度排行榜异常。", {icon: 0});
          }
        });
      };

      //翻页
      function renderPage(domId, total, pageSize, callback, $obj, temId, softFile) {
        var p = new Page();
        p.init({
          target: '#' + domId,
          pagesize: pageSize,
          pageCount: 8,
          count: total,
          callback: function (current) {
            if (softFile) {
              callback($obj, temId, pageSize, current, softFile);
            } else {
              callback($obj, temId, pageSize, current);
            }
          }
        });
      }

      /**
       * 公用没有内容方法
       * @returns {string}
       */
      function showprompt() {
        return "<p id='no-content'>没有您查看的内容</p>";
      };
      template.helper('dateRound', function (date) {
        var value = Math.round(parseFloat(date) * 100) / 100;
        var xsd = value.toString().split(".");
        if (xsd.length == 1) {
          value = value.toString() + ".00";
          return value;
        }
        if (xsd.length > 1) {
          if (xsd[1].length < 2) {
            value = value.toString() + "0";
          }
          return value;
        }
      });


      $("body").delegate('.content_title ul li', 'click', function (e) {
        e.stopPropagation();
        if (!$(this).hasClass('active')) {
          $(this).addClass('active').siblings("li").removeClass('active');
          if ($(this).index() == 0) {
            $(".content_nav").hide();
            videoUploadRank($(".content_table"), 'videoUploadRank');
          } else if ($(this).index() == 1) {
            $(".content_nav").show();
            getvideoHotRank($(".content_table"), 'videoHotRank', pageSize, currentPage, 1);
          }
        }
      });
      $("body").delegate('.content_nav a', 'click', function (e) {
        e.stopPropagation();
        if (!$(this).hasClass('active')) {
          $(this).addClass('active').siblings("a").removeClass('active');
          getvideoHotRank($(".content_table"), 'videoHotRank', pageSize, currentPage, $(this).attr("data-value"));
        }
      });

    });
})




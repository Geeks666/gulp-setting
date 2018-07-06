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
  define('', ['jquery', 'template', 'layer', 'page', 'service', 'tools', 'banner', 'textScroll', 'tab', 'ajaxBanner', 'secondNav', 'footer', 'header'], function ($, template, layer, Page, service, tools, banner, textScroll, tab, ajaxBanner, secondNav, footer, header) {

    var pageSize = 20;
    var currentPage = 1;
    /*
     1：资源上传数；
     2：资源下载数
     */
    var sortby = 1;

    getSchoolData($(".content_table"), 'schoolRank', pageSize, currentPage, sortby);

    function getSchoolData($obj, temId, pageSize, currentPage, sortby) {
      var $data = {
        'pageSize': pageSize,
        'currentPage': currentPage,
        'sortby': sortby
      };
      $.ajax({
        url: service.htmlHost + '/pf/api/rank/school',
        type: 'GET',
        data: $data,
        success: function success(data) {
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
                renderPage('pageTool', data.data.totalCount, data.data.pageSize, getSchoolData, $obj, temId, sortby);
              }
            } else {
              html = showprompt();
            }
            $obj.html(html);
          } else {
            layer.alert(data.msg, { icon: 0 });
          }
        },
        error: function error(data) {
          layer.alert("获取学校排行榜异常。", { icon: 0 });
        }
      });
    };

    template.helper('dateRound', function (date) {
      var value = Math.round(parseFloat(date) * 100) / 100;
      var xsd = value.toString().split(".");
      if (xsd.length == 1) {
        value = value.toString() + "";
        return value;
      }
      if (xsd.length > 1) {
        if (xsd[1].length < 2) {
          value = value.toString() + "0";
        }
        return value;
      }
    });

    //翻页
    function renderPage(domId, total, pageSize, _callback, $obj, temId, sortby) {
      var p = new Page();
      p.init({
        target: '#' + domId,
        pagesize: pageSize,
        pageCount: 8,
        count: total,
        callback: function callback(current) {
          _callback($obj, temId, pageSize, current, sortby);
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
    $("body").delegate('.content_title ul li', 'click', function (e) {
      e.stopPropagation();
      if (!$(this).hasClass('active')) {
        $(this).addClass('active').siblings("li").removeClass('active');
        getSchoolData($(".content_table"), 'schoolRank', pageSize, currentPage, $(this).attr("data-value"));
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJhbmsvanMvc2Nob29sUmFuay5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY29uZmlnIiwiYmFzZVVybCIsInBhdGhzIiwiY29uZmlncGF0aHMiLCJkZWZpbmUiLCIkIiwidGVtcGxhdGUiLCJsYXllciIsIlBhZ2UiLCJzZXJ2aWNlIiwidG9vbHMiLCJiYW5uZXIiLCJ0ZXh0U2Nyb2xsIiwidGFiIiwiYWpheEJhbm5lciIsInNlY29uZE5hdiIsImZvb3RlciIsImhlYWRlciIsInBhZ2VTaXplIiwiY3VycmVudFBhZ2UiLCJzb3J0YnkiLCJnZXRTY2hvb2xEYXRhIiwiJG9iaiIsInRlbUlkIiwiJGRhdGEiLCJhamF4IiwidXJsIiwiaHRtbEhvc3QiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJjb25zb2xlIiwibG9nIiwiY29kZSIsImh0bWwiLCJkYXRhbGlzdCIsImxlbmd0aCIsInJlbmRlclBhZ2UiLCJ0b3RhbENvdW50Iiwic2hvd3Byb21wdCIsImFsZXJ0IiwibXNnIiwiaWNvbiIsImVycm9yIiwiaGVscGVyIiwiZGF0ZSIsInZhbHVlIiwiTWF0aCIsInJvdW5kIiwicGFyc2VGbG9hdCIsInhzZCIsInRvU3RyaW5nIiwic3BsaXQiLCJkb21JZCIsInRvdGFsIiwiY2FsbGJhY2siLCJwIiwiaW5pdCIsInRhcmdldCIsInBhZ2VzaXplIiwicGFnZUNvdW50IiwiY291bnQiLCJjdXJyZW50IiwiZGVsZWdhdGUiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInNpYmxpbmdzIiwicmVtb3ZlQ2xhc3MiLCJhdHRyIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxvQkFBZ0I7QUFEWDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLGNBQUQsQ0FBUixFQUEwQixVQUFVSSxXQUFWLEVBQXVCO0FBQy9DO0FBQ0FKLFVBQVFDLE1BQVIsQ0FBZUcsV0FB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RUFBaUM7QUFDL0I3RCxVQUFFLElBQUYsRUFBUThELFFBQVIsQ0FBaUIsUUFBakIsRUFBMkJDLFFBQTNCLENBQW9DLElBQXBDLEVBQTBDQyxXQUExQyxDQUFzRCxRQUF0RDtBQUNBaEQsc0JBQWNoQixFQUFFLGdCQUFGLENBQWQsRUFBbUMsWUFBbkMsRUFBaURhLFFBQWpELEVBQTJEQyxXQUEzRCxFQUF3RWQsRUFBRSxJQUFGLEVBQVFpRSxJQUFSLENBQWEsWUFBYixDQUF4RTtBQUNEO0FBQ0YsS0FORDtBQVNELEdBaEdIO0FBaUdELENBcEdEIiwiZmlsZSI6InJhbmsvanMvc2Nob29sUmFuay01YWU2MzAxNjNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZS5jb25maWcoe1xyXG4gIGJhc2VVcmw6ICcuLi8nLFxyXG4gIHBhdGhzOiB7XHJcbiAgICAncGxhdGZvcm1Db25mJzogJ3B1YmxpYy9qcy9wbGF0Zm9ybUNvbmYuanMnXHJcbiAgfVxyXG59KTtcclxucmVxdWlyZShbJ3BsYXRmb3JtQ29uZiddLCBmdW5jdGlvbiAoY29uZmlncGF0aHMpIHtcclxuICAvLyBjb25maWdwYXRocy5wYXRocy5kaWFsb2cgPSBcIm15c3BhY2UvanMvYXBwRGlhbG9nLmpzXCI7XHJcbiAgcmVxdWlyZS5jb25maWcoY29uZmlncGF0aHMpO1xyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAndGVtcGxhdGUnLCAnbGF5ZXInLCAncGFnZScsICdzZXJ2aWNlJywgJ3Rvb2xzJywgJ2Jhbm5lcicsICd0ZXh0U2Nyb2xsJywgJ3RhYicsICdhamF4QmFubmVyJywgJ3NlY29uZE5hdicsICdmb290ZXInLCAnaGVhZGVyJ10sXHJcbiAgICBmdW5jdGlvbiAoJCwgdGVtcGxhdGUsIGxheWVyLCBQYWdlLCBzZXJ2aWNlLCB0b29scywgYmFubmVyLCB0ZXh0U2Nyb2xsLCB0YWIsIGFqYXhCYW5uZXIsIHNlY29uZE5hdiwgZm9vdGVyLCBoZWFkZXIpIHtcclxuXHJcbiAgICAgIHZhciBwYWdlU2l6ZSA9IDIwO1xyXG4gICAgICB2YXIgY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAvKlxyXG4gICAgICAgMe+8mui1hOa6kOS4iuS8oOaVsO+8m1xyXG4gICAgICAgMu+8mui1hOa6kOS4i+i9veaVsFxyXG4gICAgICAgKi9cclxuICAgICAgdmFyIHNvcnRieSA9IDE7XHJcblxyXG4gICAgICBnZXRTY2hvb2xEYXRhKCQoXCIuY29udGVudF90YWJsZVwiKSwgJ3NjaG9vbFJhbmsnLCBwYWdlU2l6ZSwgY3VycmVudFBhZ2UsIHNvcnRieSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRTY2hvb2xEYXRhKCRvYmosIHRlbUlkLCBwYWdlU2l6ZSwgY3VycmVudFBhZ2UsIHNvcnRieSkge1xyXG4gICAgICAgIHZhciAkZGF0YSA9IHtcclxuICAgICAgICAgICdwYWdlU2l6ZSc6IHBhZ2VTaXplLFxyXG4gICAgICAgICAgJ2N1cnJlbnRQYWdlJzogY3VycmVudFBhZ2UsXHJcbiAgICAgICAgICAnc29ydGJ5Jzogc29ydGJ5XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvcmFuay9zY2hvb2wnLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBkYXRhOiAkZGF0YSxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhICYmIGRhdGEuZGF0YS5kYXRhbGlzdCAmJiBkYXRhLmRhdGEuZGF0YWxpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHRlbXBsYXRlKHRlbUlkLCB7XHJcbiAgICAgICAgICAgICAgICAgICdkYXRhJzogZGF0YS5kYXRhLmRhdGFsaXN0LFxyXG4gICAgICAgICAgICAgICAgICAnY3VycmVudFBhZ2UnOiBkYXRhLmRhdGEuY3VycmVudFBhZ2UgLSAxLFxyXG4gICAgICAgICAgICAgICAgICAncGFnZVNpemUnOiBkYXRhLmRhdGEucGFnZVNpemVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YS5jdXJyZW50UGFnZSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICQoXCIjcGFnZVRvb2xcIikuaHRtbChcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgcmVuZGVyUGFnZSgncGFnZVRvb2wnLCBkYXRhLmRhdGEudG90YWxDb3VudCwgZGF0YS5kYXRhLnBhZ2VTaXplLCBnZXRTY2hvb2xEYXRhLCAkb2JqLCB0ZW1JZCwgc29ydGJ5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHRtbCA9IHNob3dwcm9tcHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgJG9iai5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxheWVyLmFsZXJ0KGRhdGEubXNnLCB7aWNvbjogMH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGxheWVyLmFsZXJ0KFwi6I635Y+W5a2m5qCh5o6S6KGM5qac5byC5bi444CCXCIsIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0ZW1wbGF0ZS5oZWxwZXIoJ2RhdGVSb3VuZCcsIGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGRhdGUpICogMTAwKSAvIDEwMDtcclxuICAgICAgICB2YXIgeHNkID0gdmFsdWUudG9TdHJpbmcoKS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgaWYgKHhzZC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpICsgXCJcIjtcclxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHhzZC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICBpZiAoeHNkWzFdLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpICsgXCIwXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8v57+76aG1XHJcbiAgICAgIGZ1bmN0aW9uIHJlbmRlclBhZ2UoZG9tSWQsIHRvdGFsLCBwYWdlU2l6ZSwgY2FsbGJhY2ssICRvYmosIHRlbUlkLCBzb3J0YnkpIHtcclxuICAgICAgICB2YXIgcCA9IG5ldyBQYWdlKCk7XHJcbiAgICAgICAgcC5pbml0KHtcclxuICAgICAgICAgIHRhcmdldDogJyMnICsgZG9tSWQsXHJcbiAgICAgICAgICBwYWdlc2l6ZTogcGFnZVNpemUsXHJcbiAgICAgICAgICBwYWdlQ291bnQ6IDgsXHJcbiAgICAgICAgICBjb3VudDogdG90YWwsXHJcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGN1cnJlbnQpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soJG9iaiwgdGVtSWQsIHBhZ2VTaXplLCBjdXJyZW50LCBzb3J0YnkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICog5YWs55So5rKh5pyJ5YaF5a655pa55rOVXHJcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzaG93cHJvbXB0KCkge1xyXG4gICAgICAgIHJldHVybiBcIjxwIGlkPSduby1jb250ZW50Jz7msqHmnInmgqjmn6XnnIvnmoTlhoXlrrk8L3A+XCI7XHJcbiAgICAgIH07XHJcbiAgICAgICQoXCJib2R5XCIpLmRlbGVnYXRlKCcuY29udGVudF90aXRsZSB1bCBsaScsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKS5zaWJsaW5ncyhcImxpXCIpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgIGdldFNjaG9vbERhdGEoJChcIi5jb250ZW50X3RhYmxlXCIpLCAnc2Nob29sUmFuaycsIHBhZ2VTaXplLCBjdXJyZW50UGFnZSwgJCh0aGlzKS5hdHRyKFwiZGF0YS12YWx1ZVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgfSk7XHJcbn0pXHJcblxyXG5cclxuXHJcbiJdfQ==

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
    * 1:登录次数；
     2：资源上传数；
     3：资源下载数
     */
    var sortby = 1;

    getTeacherData($(".content_table"), 'teacherRank', pageSize, currentPage, sortby);

    function getTeacherData($obj, temId, pageSize, currentPage, sortby) {
      var $data = {
        'pageSize': pageSize,
        'currentPage': currentPage,
        'sortby': sortby
      };
      $.ajax({
        url: service.htmlHost + '/pf/api/rank/teacher',
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
                renderPage('pageTool', data.data.totalCount, data.data.pageSize, getTeacherData, $obj, temId, sortby);
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
          layer.alert("获取教师排行榜异常。", { icon: 0 });
        }
      });
    };

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
        getTeacherData($(".content_table"), 'teacherRank', pageSize, currentPage, $(this).attr("data-value"));
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJhbmsvanMvdGVhY2hlclJhbmsuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImNvbmZpZyIsImJhc2VVcmwiLCJwYXRocyIsImNvbmZpZ3BhdGhzIiwiZGVmaW5lIiwiJCIsInRlbXBsYXRlIiwibGF5ZXIiLCJQYWdlIiwic2VydmljZSIsInRvb2xzIiwiYmFubmVyIiwidGV4dFNjcm9sbCIsInRhYiIsImFqYXhCYW5uZXIiLCJzZWNvbmROYXYiLCJmb290ZXIiLCJoZWFkZXIiLCJwYWdlU2l6ZSIsImN1cnJlbnRQYWdlIiwic29ydGJ5IiwiZ2V0VGVhY2hlckRhdGEiLCIkb2JqIiwidGVtSWQiLCIkZGF0YSIsImFqYXgiLCJ1cmwiLCJodG1sSG9zdCIsInR5cGUiLCJkYXRhIiwic3VjY2VzcyIsImNvbnNvbGUiLCJsb2ciLCJjb2RlIiwiaHRtbCIsImRhdGFsaXN0IiwibGVuZ3RoIiwicmVuZGVyUGFnZSIsInRvdGFsQ291bnQiLCJzaG93cHJvbXB0IiwiYWxlcnQiLCJtc2ciLCJpY29uIiwiZXJyb3IiLCJkb21JZCIsInRvdGFsIiwiY2FsbGJhY2siLCJwIiwiaW5pdCIsInRhcmdldCIsInBhZ2VzaXplIiwicGFnZUNvdW50IiwiY291bnQiLCJjdXJyZW50IiwiZGVsZWdhdGUiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInNpYmxpbmdzIiwicmVtb3ZlQ2xhc3MiLCJhdHRyIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxRQUFRQyxNQUFSLENBQWU7QUFDYkMsV0FBUyxLQURJO0FBRWJDLFNBQU87QUFDTCxvQkFBZ0I7QUFEWDtBQUZNLENBQWY7QUFNQUgsUUFBUSxDQUFDLGNBQUQsQ0FBUixFQUEwQixVQUFVSSxXQUFWLEVBQXVCO0FBQy9DO0FBQ0FKLFVBQVFDLE1BQVIsQ0FBZUcsV0FBZjtBQUNBQyxTQUFPLEVBQVAsRUFBVyxDQUFDLFFBQUQsRUFBVyxVQUFYLEVBQXVCLE9BQXZCLEVBQWdDLE1BQWhDLEVBQXdDLFNB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O0FBRUxNLGtCQUFVaEMsUUFGTDtBQUdMaUMsbUJBQVcsQ0FITjtBQUlMQyxlQUFPUCxLQUpGO0FBS0xDLGtCQUFVLGtCQUFVTyxPQUFWLEVBQW1CO0FBQzNCUCxvQkFBU3hCLElBQVQsRUFBZUMsS0FBZixFQUFzQkwsUUFBdEIsRUFBZ0NtQyxPQUFoQyxFQUF5Q2pDLE1BQXpDO0FBQ0Q7QUFQSSxPQUFQO0FBU0Q7O0FBRUQ7Ozs7QUFJQSxhQUFTbUIsVUFBVCxHQUFzQjtBQUNwQixhQUFPLGlDQUFQO0FBQ0Q7QUFDRGxDLE1BQUUsTUFBRixFQUFVaUQsUUFBVixDQUFtQixzQkFBbkIsRUFBMkMsT0FBM0MsRUFBb0QsVUFBVUMsQ0FBVixFQUFhO0FBQy9EQSxRQUFFQyxlQUFGO0FBQ0EsVUFBSSxDQUFDbkQsRUFBRSxJQUFGLEVBQVFvRCxRQUFSLENBQWlCLFFBQWpCLENBQUwsRUFBaUM7QUFDL0JwRCxVQUFFLElBQUYsRUFBUXFELFFBQVIsQ0FBaUIsUUFBakIsRUFBMkJDLFFBQTNCLENBQW9DLElBQXBDLEVBQTBDQyxXQUExQyxDQUFzRCxRQUF0RDtBQUNBdkMsdUJBQWVoQixFQUFFLGdCQUFGLENBQWYsRUFBb0MsYUFBcEMsRUFBbURhLFFBQW5ELEVBQTZEQyxXQUE3RCxFQUEwRWQsRUFBRSxJQUFGLEVBQVF3RCxJQUFSLENBQWEsWUFBYixDQUExRTtBQUNEO0FBQ0YsS0FORDtBQVFELEdBakZIO0FBa0ZELENBckZEIiwiZmlsZSI6InJhbmsvanMvdGVhY2hlclJhbmstNWRhZjJjNjE0NC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUuY29uZmlnKHtcclxuICBiYXNlVXJsOiAnLi4vJyxcclxuICBwYXRoczoge1xyXG4gICAgJ3BsYXRmb3JtQ29uZic6ICdwdWJsaWMvanMvcGxhdGZvcm1Db25mLmpzJ1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoWydwbGF0Zm9ybUNvbmYnXSwgZnVuY3Rpb24gKGNvbmZpZ3BhdGhzKSB7XHJcbiAgLy8gY29uZmlncGF0aHMucGF0aHMuZGlhbG9nID0gXCJteXNwYWNlL2pzL2FwcERpYWxvZy5qc1wiO1xyXG4gIHJlcXVpcmUuY29uZmlnKGNvbmZpZ3BhdGhzKTtcclxuICBkZWZpbmUoJycsIFsnanF1ZXJ5JywgJ3RlbXBsYXRlJywgJ2xheWVyJywgJ3BhZ2UnLCAnc2VydmljZScsICd0b29scycsICdiYW5uZXInLCAndGV4dFNjcm9sbCcsICd0YWInLCAnYWpheEJhbm5lcicsICdzZWNvbmROYXYnLCAnZm9vdGVyJywgJ2hlYWRlciddLFxyXG4gICAgZnVuY3Rpb24gKCQsIHRlbXBsYXRlLCBsYXllciwgUGFnZSwgc2VydmljZSwgdG9vbHMsIGJhbm5lciwgdGV4dFNjcm9sbCwgdGFiLCBhamF4QmFubmVyLCBzZWNvbmROYXYsIGZvb3RlciwgaGVhZGVyKSB7XHJcbiAgICAgIHZhciBwYWdlU2l6ZSA9IDIwO1xyXG4gICAgICB2YXIgY3VycmVudFBhZ2UgPSAxO1xyXG4gICAgICAvKlxyXG4gICAgICAqIDE655m75b2V5qyh5pWw77ybXHJcbiAgICAgICAy77ya6LWE5rqQ5LiK5Lyg5pWw77ybXHJcbiAgICAgICAz77ya6LWE5rqQ5LiL6L295pWwXHJcbiAgICAgICAqL1xyXG4gICAgICB2YXIgc29ydGJ5ID0gMTtcclxuXHJcbiAgICAgIGdldFRlYWNoZXJEYXRhKCQoXCIuY29udGVudF90YWJsZVwiKSwgJ3RlYWNoZXJSYW5rJywgcGFnZVNpemUsIGN1cnJlbnRQYWdlLCBzb3J0YnkpO1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0VGVhY2hlckRhdGEoJG9iaiwgdGVtSWQsIHBhZ2VTaXplLCBjdXJyZW50UGFnZSwgc29ydGJ5KSB7XHJcbiAgICAgICAgdmFyICRkYXRhID0ge1xyXG4gICAgICAgICAgJ3BhZ2VTaXplJzogcGFnZVNpemUsXHJcbiAgICAgICAgICAnY3VycmVudFBhZ2UnOiBjdXJyZW50UGFnZSxcclxuICAgICAgICAgICdzb3J0YnknOiBzb3J0YnlcclxuICAgICAgICB9O1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICB1cmw6IHNlcnZpY2UuaHRtbEhvc3QgKyAnL3BmL2FwaS9yYW5rL3RlYWNoZXInLFxyXG4gICAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgICBkYXRhOiAkZGF0YSxcclxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmNvZGUgPT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YSAmJiBkYXRhLmRhdGEuZGF0YWxpc3QgJiYgZGF0YS5kYXRhLmRhdGFsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGh0bWwgPSB0ZW1wbGF0ZSh0ZW1JZCwge1xyXG4gICAgICAgICAgICAgICAgICAnZGF0YSc6IGRhdGEuZGF0YS5kYXRhbGlzdCxcclxuICAgICAgICAgICAgICAgICAgJ2N1cnJlbnRQYWdlJzogZGF0YS5kYXRhLmN1cnJlbnRQYWdlIC0gMSxcclxuICAgICAgICAgICAgICAgICAgJ3BhZ2VTaXplJzogZGF0YS5kYXRhLnBhZ2VTaXplXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEuY3VycmVudFBhZ2UgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAkKFwiI3BhZ2VUb29sXCIpLmh0bWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgIHJlbmRlclBhZ2UoJ3BhZ2VUb29sJywgZGF0YS5kYXRhLnRvdGFsQ291bnQsIGRhdGEuZGF0YS5wYWdlU2l6ZSwgZ2V0VGVhY2hlckRhdGEsICRvYmosIHRlbUlkLCBzb3J0YnkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBodG1sID0gc2hvd3Byb21wdCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAkb2JqLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGF5ZXIuYWxlcnQoZGF0YS5tc2csIHtpY29uOiAwfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgbGF5ZXIuYWxlcnQoXCLojrflj5bmlZnluIjmjpLooYzmppzlvILluLjjgIJcIiwge2ljb246IDB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICAvL+e/u+mhtVxyXG4gICAgICBmdW5jdGlvbiByZW5kZXJQYWdlKGRvbUlkLCB0b3RhbCwgcGFnZVNpemUsIGNhbGxiYWNrLCAkb2JqLCB0ZW1JZCwgc29ydGJ5KSB7XHJcbiAgICAgICAgdmFyIHAgPSBuZXcgUGFnZSgpO1xyXG4gICAgICAgIHAuaW5pdCh7XHJcbiAgICAgICAgICB0YXJnZXQ6ICcjJyArIGRvbUlkLFxyXG4gICAgICAgICAgcGFnZXNpemU6IHBhZ2VTaXplLFxyXG4gICAgICAgICAgcGFnZUNvdW50OiA4LFxyXG4gICAgICAgICAgY291bnQ6IHRvdGFsLFxyXG4gICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCRvYmosIHRlbUlkLCBwYWdlU2l6ZSwgY3VycmVudCwgc29ydGJ5KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIOWFrOeUqOayoeacieWGheWuueaWueazlVxyXG4gICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAgICAgKi9cclxuICAgICAgZnVuY3Rpb24gc2hvd3Byb21wdCgpIHtcclxuICAgICAgICByZXR1cm4gXCI8cCBpZD0nbm8tY29udGVudCc+5rKh5pyJ5oKo5p+l55yL55qE5YaF5a65PC9wPlwiO1xyXG4gICAgICB9O1xyXG4gICAgICAkKFwiYm9keVwiKS5kZWxlZ2F0ZSgnLmNvbnRlbnRfdGl0bGUgdWwgbGknLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJykuc2libGluZ3MoXCJsaVwiKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICBnZXRUZWFjaGVyRGF0YSgkKFwiLmNvbnRlbnRfdGFibGVcIiksICd0ZWFjaGVyUmFuaycsIHBhZ2VTaXplLCBjdXJyZW50UGFnZSwgJCh0aGlzKS5hdHRyKFwiZGF0YS12YWx1ZVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufSlcclxuXHJcblxyXG5cclxuIl19

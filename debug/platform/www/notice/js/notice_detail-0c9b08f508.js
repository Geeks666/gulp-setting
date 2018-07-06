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
    //公告详情
    $.ajax({
      url: service.htmlHost + '/pf/api/notice/detail?id=' + tools.args.id + '&index=' + tools.args.index,
      type: 'GET',
      success: function success(data) {
        if (data && data.code == "success") {
          $(".title_noborder").html(data.data.title);
          $("#cur").html(data.data.content);
          if (data.data.reslist) {
            if (data.data.reslist.length != 0) {
              for (var i = 0, extHTML = ''; i < data.data.reslist.length; i++) {
                extHTML += "<a href='" + getPicPath(data.data.reslist[i].id) + "'><img src='images/ext.png' alt=''>" + data.data.reslist[i].name + "." + data.data.reslist[i].ext + "</a></br>";
              }
              $('#exts').html(extHTML);
            }
          }
          $("#_time").html(data.data.crtDttm.split(" ")[0]);
          var htmlContent = '';
          if (data.data.flago !== '0' && parseInt(tools.args.index) !== 0) {
            htmlContent += '<a class="prev" href="noticeDetail.html?id=' + data.data.flago + '&index=' + (parseInt(tools.args.index) - 1) + '">上一篇</a>';
          }
          if (data.data.flags !== '0') {
            htmlContent += '<a class="next" href="noticeDetail.html?id=' + data.data.flags + '&index=' + (parseInt(tools.args.index) + 1) + '">下一篇</a>';
          }
          $(".content-link").html(htmlContent);
        } else {
          alert("获取公告详情异常");
        }
      }
    });
    //相关公告
    $.ajax({
      url: service.htmlHost + '/pf/api/notice/getLimit?limit=6',
      type: 'GET',
      success: function success(data) {
        if (data && data.code == "success") {
          $('#importnotice').empty();
          for (var i = 0; i < data.data.length; i++) {
            $('#importnotice').append('<li class="imp-list"><a class="imp-text" href="noticeDetail.html?id=' + data.data[i].id + '&index=' + i + '">' + data.data[i].title + '</a></li>');
          }
        } else {
          alert("获取重要公告异常");
        }
      }
    });
    /**
     * 根据图片ID返回图片路径
     * @param id 图片ID
     * @returns {string} 图片路径
     */
    function getPicPath(id) {
      return service.path_url['download_url'].substring(0, 4) === 'http' ? service.path_url['download_url'].replace('#resid#', id) : service.prefix + service.path_url['download_url'].replace('#resid#', id);
    }
  });

  /*$(function(){
    $('.nav-line').hide();
    //鑷�搴旂獥鍙�
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
      //鍐呭澶氬嚭鏄剧ず闅愯棌
    function hideText(obj,long){
      for (var i = 0; i < obj.length; i++) {
        var str = '...';
        var be_str = obj.eq(i).html();
          be_str = be_str.replace( /^\s+|\s+$/,'');
        var newstr = '';
          if( be_str.length > long ){
          newstr = be_str.slice(0,long) + str;
          obj.eq(i).html(newstr);
        }
      }
    };
      //鍘绘帀鍙戝竷鏃ュ織缂栬緫鍣ㄤ骇鐢熺殑瀹介珮鍚�00px 寮曞彂鐨勬牱寮廱ug
    if( $('#cur') ){
      $('#cur').css({'height':'auto','width':'100%'})
    }
  })*/
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vdGljZS9qcy9ub3RpY2VfZGV0YWlsLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJjb25maWciLCJiYXNlVXJsIiwicGF0aHMiLCJjb25maWdwYXRocyIsImRlZmluZSIsIiQiLCJ0ZW1wbGF0ZSIsInNlcnZpY2UiLCJmb290ZXIiLCJoZWFkZXIiLCJ0b29scyIsImFqYXgiLCJ1cmwiLCJodG1sSG9zdCIsImFyZ3MiLCJpZCIsImluZGV4IiwidHlwZSIsInN1Y2Nlc3MiLCJkYXRhIiwiY29kZSIsImh0bWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJyZXNsaXN0IiwibGVuZ3RoIiwiaSIsImV4dEhUTUwiLCJnZXRQaWNQYXRoIiwibmFtZSIsImV4dCIsImNydER0dG0iLCJzcGxpdCIsImh0bWxDb250ZW50IiwiZmxhZ28iLCJwYXJzZUludCIsImZsYWdzIiwiYWxlcnQiLCJlbXB0eSIsImFwcGVuZCIsInBhdGhfdXJsIiwic3Vic3RyaW5nIiwicmVwbGFjZSIsInByZWZpeCJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlO0FBQ2JDLFdBQVMsS0FESTtBQUViQyxTQUFPO0FBQ0wsb0JBQWdCO0FBRFg7QUFGTSxDQUFmO0FBTUFILFFBQVEsQ0FBQyxjQUFELENBQVIsRUFBMEIsVUFBVUksV0FBVixFQUF1Qjs7QUFFL0NKLFVBQVFDLE1BQVIsQ0FBZUcsV0FBZjs7QUFFQUMsU0FBTyxFQUFQLEVBQVcsQ0FBQyxRQUFELEVBQVcsVUFBWCxFQUF1QixTQUF2QixFQUFrQyxRQUFsQyxFQUE0QyxRQUE1QyxFQUFzRCxNQUF0RCxDQUFYLEVBQ0UsVUFBVUMsQ0FBVixFQUFhQyxRQUFiLEVBQXVCQyxPQUF2QixFQUFnQ0MsTUFBaEMsRUFBd0NDLE1BQXhDLEVBQWdEQyxLQUFoRCxFQUF1RDtBQUNyRDtBQUNBTCxNQUFFTSxJQUFGLENBQU87QUFDTEMsV0FBS0wsUUFBUU0sUUFBUixHQUFtQiwyQkFBbkIsR0FBaURILE1BQU1JLElBQU4sQ0FBV0MsRUFB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SCxHQUF1SSxXQUFqSztBQUNEO0FBQ0YsU0FMRCxNQUtPO0FBQ0xlLGdCQUFNLFVBQU47QUFDRDtBQUNGO0FBWkksS0FBUDtBQWNBOzs7OztBQUtBLGFBQVNULFVBQVQsQ0FBb0JiLEVBQXBCLEVBQXdCO0FBQ3RCLGFBQU9SLFFBQVFpQyxRQUFSLENBQWlCLGNBQWpCLEVBQWlDQyxTQUFqQyxDQUEyQyxDQUEzQyxFQUE4QyxDQUE5QyxNQUFxRCxNQUFyRCxHQUE4RGxDLFFBQVFpQyxRQUFSLENBQWlCLGNBQWpCLEVBQWlDRSxPQUFqQyxDQUF5QyxTQUF6QyxFQUFvRDNCLEVBQXBELENBQTlELEdBQXlIUixRQUFRb0MsTUFBUixHQUFpQnBDLFFBQVFpQyxRQUFSLENBQWlCLGNBQWpCLEVBQWlDRSxPQUFqQyxDQUF5QyxTQUF6QyxFQUFvRDNCLEVBQXBELENBQWpKO0FBQ0Q7QUFDRixHQXZESDs7QUEyREE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0NELENBbkdEIiwiZmlsZSI6Im5vdGljZS9qcy9ub3RpY2VfZGV0YWlsLTBjOWIwOGY1MDguanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlLmNvbmZpZyh7XHJcbiAgYmFzZVVybDogJy4uLycsXHJcbiAgcGF0aHM6IHtcclxuICAgICdwbGF0Zm9ybUNvbmYnOiAncHVibGljL2pzL3BsYXRmb3JtQ29uZi5qcydcclxuICB9XHJcbn0pO1xyXG5yZXF1aXJlKFsncGxhdGZvcm1Db25mJ10sIGZ1bmN0aW9uIChjb25maWdwYXRocykge1xyXG5cclxuICByZXF1aXJlLmNvbmZpZyhjb25maWdwYXRocyk7XHJcblxyXG4gIGRlZmluZSgnJywgWydqcXVlcnknLCAndGVtcGxhdGUnLCAnc2VydmljZScsICdmb290ZXInLCAnaGVhZGVyJywgJ3Rvb2wnXSxcclxuICAgIGZ1bmN0aW9uICgkLCB0ZW1wbGF0ZSwgc2VydmljZSwgZm9vdGVyLCBoZWFkZXIsIHRvb2xzKSB7XHJcbiAgICAgIC8v5YWs5ZGK6K+m5oOFXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBzZXJ2aWNlLmh0bWxIb3N0ICsgJy9wZi9hcGkvbm90aWNlL2RldGFpbD9pZD0nICsgdG9vbHMuYXJncy5pZCArICcmaW5kZXg9JyArIHRvb2xzLmFyZ3MuaW5kZXgsXHJcbiAgICAgICAgdHlwZTogJ0dFVCcsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuY29kZSA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAkKFwiLnRpdGxlX25vYm9yZGVyXCIpLmh0bWwoZGF0YS5kYXRhLnRpdGxlKTtcclxuICAgICAgICAgICAgJChcIiNjdXJcIikuaHRtbChkYXRhLmRhdGEuY29udGVudCk7XHJcbiAgICAgICAgICAgIGlmKCBkYXRhLmRhdGEucmVzbGlzdCApe1xyXG4gICAgICAgICAgICAgIGlmKGRhdGEuZGF0YS5yZXNsaXN0Lmxlbmd0aCAhPSAwKXtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLGV4dEhUTUwgPSAnJzsgaSA8IGRhdGEuZGF0YS5yZXNsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgZXh0SFRNTCArPSBcIjxhIGhyZWY9J1wiKyBnZXRQaWNQYXRoKGRhdGEuZGF0YS5yZXNsaXN0W2ldLmlkKSArXCInPjxpbWcgc3JjPSdpbWFnZXMvZXh0LnBuZycgYWx0PScnPlwiKyBkYXRhLmRhdGEucmVzbGlzdFtpXS5uYW1lICtcIi5cIisgZGF0YS5kYXRhLnJlc2xpc3RbaV0uZXh0ICtcIjwvYT48L2JyPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJCgnI2V4dHMnKS5odG1sICggZXh0SFRNTCApO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkKFwiI190aW1lXCIpLmh0bWwoZGF0YS5kYXRhLmNydER0dG0uc3BsaXQoXCIgXCIpWzBdKTtcclxuICAgICAgICAgICAgdmFyIGh0bWxDb250ZW50ID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEuZmxhZ28gIT09ICcwJyAmJiBwYXJzZUludCh0b29scy5hcmdzLmluZGV4KSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgIGh0bWxDb250ZW50ICs9ICc8YSBjbGFzcz1cInByZXZcIiBocmVmPVwibm90aWNlRGV0YWlsLmh0bWw/aWQ9JyArIGRhdGEuZGF0YS5mbGFnbyArICcmaW5kZXg9JyArIChwYXJzZUludCh0b29scy5hcmdzLmluZGV4KSAtIDEpICsgJ1wiPuS4iuS4gOevhzwvYT4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLmRhdGEuZmxhZ3MgIT09ICcwJykge1xyXG4gICAgICAgICAgICAgIGh0bWxDb250ZW50ICs9ICc8YSBjbGFzcz1cIm5leHRcIiBocmVmPVwibm90aWNlRGV0YWlsLmh0bWw/aWQ9JyArIGRhdGEuZGF0YS5mbGFncyArICcmaW5kZXg9JyArIChwYXJzZUludCh0b29scy5hcmdzLmluZGV4KSArIDEpICsgJ1wiPuS4i+S4gOevhzwvYT4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQoXCIuY29udGVudC1saW5rXCIpLmh0bWwoaHRtbENvbnRlbnQpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWxlcnQoXCLojrflj5blhazlkYror6bmg4XlvILluLhcIilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAvL+ebuOWFs+WFrOWRilxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogc2VydmljZS5odG1sSG9zdCArICcvcGYvYXBpL25vdGljZS9nZXRMaW1pdD9saW1pdD02JyxcclxuICAgICAgICB0eXBlOiAnR0VUJyxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5jb2RlID09IFwic3VjY2Vzc1wiKSB7XHJcbiAgICAgICAgICAgICQoJyNpbXBvcnRub3RpY2UnKS5lbXB0eSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICQoJyNpbXBvcnRub3RpY2UnKS5hcHBlbmQoJzxsaSBjbGFzcz1cImltcC1saXN0XCI+PGEgY2xhc3M9XCJpbXAtdGV4dFwiIGhyZWY9XCJub3RpY2VEZXRhaWwuaHRtbD9pZD0nICsgZGF0YS5kYXRhW2ldLmlkICsgJyZpbmRleD0nICsgaSArICdcIj4nICsgZGF0YS5kYXRhW2ldLnRpdGxlICsgJzwvYT48L2xpPicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydChcIuiOt+WPlumHjeimgeWFrOWRiuW8guW4uFwiKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiDmoLnmja7lm77niYdJROi/lOWbnuWbvueJh+i3r+W+hFxyXG4gICAgICAgKiBAcGFyYW0gaWQg5Zu+54mHSURcclxuICAgICAgICogQHJldHVybnMge3N0cmluZ30g5Zu+54mH6Lev5b6EXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBnZXRQaWNQYXRoKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnN1YnN0cmluZygwLCA0KSA9PT0gJ2h0dHAnID8gc2VydmljZS5wYXRoX3VybFsnZG93bmxvYWRfdXJsJ10ucmVwbGFjZSgnI3Jlc2lkIycsIGlkKSA6IChzZXJ2aWNlLnByZWZpeCArIHNlcnZpY2UucGF0aF91cmxbJ2Rvd25sb2FkX3VybCddLnJlcGxhY2UoJyNyZXNpZCMnLCBpZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKTtcclxuXHJcblxyXG4gIC8qJChmdW5jdGlvbigpe1xyXG4gICAgJCgnLm5hdi1saW5lJykuaGlkZSgpO1xyXG4gICAgLy/pkbfugYjvv73mkLTml4LnjaXpjZnvv71cclxuICAgIGZ1bmN0aW9uIHdpbkNoYW5nZShtaW5OdW0sb3V0TlVtKXtcclxuICAgICAgdmFyIGNvbnRIZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSBvdXROVW07XHJcbiAgICAgIGlmKCBjb250SGVpZ2h0IDwgbWluTnVtICl7XHJcbiAgICAgICAgY29udEhlaWdodCA9IG1pbk51bTtcclxuICAgICAgfVxyXG4gICAgICAkKCcubWVzc2FnZS1jb250ZW50JykuZ2V0KDApLnN0eWxlWydtaW4taGVpZ2h0J10gPSBjb250SGVpZ2h0ICsgJ3B4JztcclxuICAgIH1cclxuICAgIHdpbkNoYW5nZSgzNTAsNTc0KTtcclxuXHJcbiAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xyXG4gICAgICB3aW5DaGFuZ2UoKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy/pjZDlka3uhpDmvrbmsKzlmq3pj4TliafjgZrpl4XmhK/mo4xcclxuICAgIGZ1bmN0aW9uIGhpZGVUZXh0KG9iaixsb25nKXtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgc3RyID0gJy4uLic7XHJcbiAgICAgICAgdmFyIGJlX3N0ciA9IG9iai5lcShpKS5odG1sKCk7XHJcbiAgICAgICAgICBiZV9zdHIgPSBiZV9zdHIucmVwbGFjZSggL15cXHMrfFxccyskLywnJyk7XHJcbiAgICAgICAgdmFyIG5ld3N0ciA9ICcnO1xyXG5cclxuICAgICAgICBpZiggYmVfc3RyLmxlbmd0aCA+IGxvbmcgKXtcclxuICAgICAgICAgIG5ld3N0ciA9IGJlX3N0ci5zbGljZSgwLGxvbmcpICsgc3RyO1xyXG4gICAgICAgICAgb2JqLmVxKGkpLmh0bWwobmV3c3RyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy/pjZjnu5jluIDpjZnmiJ3nq7fpj4Pjg6XnuZTnvILmoKznt6vpjaPjhKTpqofpkKLnhrrmrpHngLnku4vnj67pjZrvv70wMHB4IOWvruabnuW9gumQqOWLrOeJseWvruW7sXVnXHJcbiAgICBpZiggJCgnI2N1cicpICl7XHJcbiAgICAgICQoJyNjdXInKS5jc3MoeydoZWlnaHQnOidhdXRvJywnd2lkdGgnOicxMDAlJ30pXHJcbiAgICB9XHJcbiAgfSkqL1xyXG59KVxyXG5cclxuXHJcblxyXG4iXX0=
